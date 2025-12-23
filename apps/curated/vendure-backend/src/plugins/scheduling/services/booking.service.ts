/**
 * BookingService - Core Appointment Booking Logic
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T105
 *
 * Purpose: Handle all appointment booking operations with validation
 * Implements conflict detection, capacity checking, and database locking
 */

import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { ServiceProvider } from '../entities/service-provider.entity';
import { Client } from '../entities/client.entity';
import { Availability } from '../entities/availability.entity';
import { PubSubService, AppointmentEventType, ScheduleEventType, CalendarEventType } from './pubsub.service';

/**
 * Booking Request Input
 */
export interface BookAppointmentInput {
  clientId: string;
  providerId: string;
  serviceType: string;
  startTime: Date;
  endTime: Date;
  notes?: string;
  requestedProducts?: string[];
}

/**
 * Booking Result
 */
export interface BookingResult {
  success: boolean;
  appointment?: Appointment;
  errors?: BookingError[];
  warnings?: string[];
}

/**
 * Booking Error Types
 */
export enum BookingErrorCode {
  PROVIDER_NOT_FOUND = 'PROVIDER_NOT_FOUND',
  CLIENT_NOT_FOUND = 'CLIENT_NOT_FOUND',
  PROVIDER_UNAVAILABLE = 'PROVIDER_UNAVAILABLE',
  PROVIDER_AT_CAPACITY = 'PROVIDER_AT_CAPACITY',
  CLIENT_CONFLICT = 'CLIENT_CONFLICT',
  OUTSIDE_WORKING_HOURS = 'OUTSIDE_WORKING_HOURS',
  BLOCKED_TIME = 'BLOCKED_TIME',
  INVALID_TIME_RANGE = 'INVALID_TIME_RANGE',
  MISSING_CONSENT = 'MISSING_CONSENT',
  SERVICE_NOT_OFFERED = 'SERVICE_NOT_OFFERED',
  CONTRAINDICATION = 'CONTRAINDICATION',
}

export interface BookingError {
  code: BookingErrorCode;
  message: string;
  field?: string;
}

/**
 * Reschedule Request Input
 */
export interface RescheduleAppointmentInput {
  appointmentId: string;
  newStartTime: Date;
  newEndTime: Date;
  reason?: string;
}

/**
 * Cancellation Request Input
 */
export interface CancelAppointmentInput {
  appointmentId: string;
  reason: string;
  cancelledBy: 'CLIENT' | 'PROVIDER' | 'ADMIN';
}

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(ServiceProvider)
    private readonly providerRepo: Repository<ServiceProvider>,
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
    @InjectRepository(Availability)
    private readonly availabilityRepo: Repository<Availability>,
    @Inject(PubSubService)
    private readonly pubSubService: PubSubService,
  ) {}

  /**
   * Book a new appointment with full validation and conflict detection
   *
   * Uses database-level locking (SELECT FOR UPDATE) to prevent race conditions
   * Validates:
   * - Provider exists and offers service
   * - Client exists and has required consents
   * - Time slot is within working hours
   * - No provider conflicts (overlapping appointments)
   * - Provider has capacity for this time slot
   * - No client conflicts (client double-booking)
   * - No blocked time periods
   * - No medical contraindications
   */
  async bookAppointment(
    input: BookAppointmentInput,
  ): Promise<BookingResult> {
    const errors: BookingError[] = [];
    const warnings: string[] = [];

    // Validate time range
    if (input.startTime >= input.endTime) {
      errors.push({
        code: BookingErrorCode.INVALID_TIME_RANGE,
        message: 'Start time must be before end time',
        field: 'startTime',
      });
      return { success: false, errors };
    }

    // Use transaction with database locking
    return await this.appointmentRepo.manager.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager: EntityManager) => {
        // Step 1: Fetch and lock provider (SELECT FOR UPDATE)
        const provider = await transactionalEntityManager
          .createQueryBuilder(ServiceProvider, 'provider')
          .setLock('pessimistic_write')
          .where('provider.id = :providerId', { providerId: input.providerId })
          .getOne();

        if (!provider) {
          errors.push({
            code: BookingErrorCode.PROVIDER_NOT_FOUND,
            message: `Provider with ID ${input.providerId} not found`,
            field: 'providerId',
          });
          return { success: false, errors };
        }

        // Step 2: Verify provider offers this service
        const offersService = provider.services.some(
          (s) => s.serviceType === input.serviceType,
        );
        if (!offersService) {
          errors.push({
            code: BookingErrorCode.SERVICE_NOT_OFFERED,
            message: `Provider does not offer service: ${input.serviceType}`,
            field: 'serviceType',
          });
          return { success: false, errors };
        }

        // Step 3: Check if provider is available during this time
        const isAvailable = provider.isProviderAvailable(
          input.startTime,
          input.endTime,
        );
        if (!isAvailable) {
          errors.push({
            code: BookingErrorCode.OUTSIDE_WORKING_HOURS,
            message: 'Requested time is outside provider working hours',
            field: 'startTime',
          });
          return { success: false, errors };
        }

        // Step 4: Fetch and lock client
        const client = await transactionalEntityManager
          .createQueryBuilder(Client, 'client')
          .setLock('pessimistic_write')
          .where('client.id = :clientId', { clientId: input.clientId })
          .getOne();

        if (!client) {
          errors.push({
            code: BookingErrorCode.CLIENT_NOT_FOUND,
            message: `Client with ID ${input.clientId} not found`,
            field: 'clientId',
          });
          return { success: false, errors };
        }

        // Step 5: Check for required consent forms
        const hasConsent = client.hasValidConsent(input.serviceType);
        if (!hasConsent) {
          errors.push({
            code: BookingErrorCode.MISSING_CONSENT,
            message: `Client must sign consent form for ${input.serviceType}`,
            field: 'clientId',
          });
          return { success: false, errors };
        }

        // Step 6: Check for medical contraindications
        const contraindication = client.hasContraindications(input.serviceType);
        if (contraindication) {
          errors.push({
            code: BookingErrorCode.CONTRAINDICATION,
            message: `Client has contraindication for ${input.serviceType}: ${contraindication}`,
            field: 'serviceType',
          });
          return { success: false, errors };
        }

        // Step 7: Check for provider conflicts (existing appointments)
        const providerConflicts = await transactionalEntityManager
          .createQueryBuilder(Appointment, 'appointment')
          .setLock('pessimistic_write')
          .where('appointment.providerId = :providerId', {
            providerId: input.providerId,
          })
          .andWhere('appointment.status NOT IN (:...excludedStatuses)', {
            excludedStatuses: ['CANCELLED', 'NO_SHOW'],
          })
          .andWhere('appointment.deletedAt IS NULL')
          .andWhere(
            '(appointment.startTime < :endTime AND appointment.endTime > :startTime)',
            {
              startTime: input.startTime,
              endTime: input.endTime,
            },
          )
          .getMany();

        if (providerConflicts.length > 0) {
          errors.push({
            code: BookingErrorCode.PROVIDER_UNAVAILABLE,
            message: 'Provider already has an appointment during this time',
            field: 'startTime',
          });
          return { success: false, errors };
        }

        // Step 8: Check provider capacity for this time slot
        const service = provider.services.find(
          (s) => s.serviceType === input.serviceType,
        );
        const capacity = service?.capacity || 1;

        const concurrentAppointments = await transactionalEntityManager
          .createQueryBuilder(Appointment, 'appointment')
          .where('appointment.providerId = :providerId', {
            providerId: input.providerId,
          })
          .andWhere('appointment.status NOT IN (:...excludedStatuses)', {
            excludedStatuses: ['CANCELLED', 'NO_SHOW'],
          })
          .andWhere('appointment.deletedAt IS NULL')
          .andWhere(
            '(appointment.startTime < :endTime AND appointment.endTime > :startTime)',
            {
              startTime: input.startTime,
              endTime: input.endTime,
            },
          )
          .getCount();

        if (concurrentAppointments >= capacity) {
          errors.push({
            code: BookingErrorCode.PROVIDER_AT_CAPACITY,
            message: `Provider is at maximum capacity (${capacity}) for this time`,
            field: 'startTime',
          });
          return { success: false, errors };
        }

        // Step 9: Check for client conflicts (client already has appointment)
        const clientConflicts = await transactionalEntityManager
          .createQueryBuilder(Appointment, 'appointment')
          .setLock('pessimistic_write')
          .where('appointment.clientId = :clientId', {
            clientId: input.clientId,
          })
          .andWhere('appointment.status NOT IN (:...excludedStatuses)', {
            excludedStatuses: ['CANCELLED', 'NO_SHOW'],
          })
          .andWhere('appointment.deletedAt IS NULL')
          .andWhere(
            '(appointment.startTime < :endTime AND appointment.endTime > :startTime)',
            {
              startTime: input.startTime,
              endTime: input.endTime,
            },
          )
          .getMany();

        if (clientConflicts.length > 0) {
          errors.push({
            code: BookingErrorCode.CLIENT_CONFLICT,
            message: 'Client already has an appointment during this time',
            field: 'clientId',
          });
          return { success: false, errors };
        }

        // Step 10: Check for blocked time periods
        const blockedTimes = await transactionalEntityManager
          .createQueryBuilder(Availability, 'availability')
          .where('availability.providerId = :providerId', {
            providerId: input.providerId,
          })
          .andWhere(
            '(availability.startTime < :endTime AND availability.endTime > :startTime)',
            {
              startTime: input.startTime,
              endTime: input.endTime,
            },
          )
          .getMany();

        const hasBlockingAvailability = blockedTimes.some((avail) =>
          avail.blocksAppointments(),
        );

        if (hasBlockingAvailability) {
          errors.push({
            code: BookingErrorCode.BLOCKED_TIME,
            message: 'This time slot has been blocked by the provider',
            field: 'startTime',
          });
          return { success: false, errors };
        }

        // Step 11: Check if medical history needs update
        if (client.needsMedicalHistoryUpdate()) {
          warnings.push(
            'Client medical history is outdated (>12 months). Please update before appointment.',
          );
        }

        // All validations passed - create the appointment
        const appointment = this.appointmentRepo.create({
          appointmentNumber: await this.generateAppointmentNumber(),
          clientId: input.clientId,
          providerId: input.providerId,
          serviceType: input.serviceType,
          startTime: input.startTime,
          endTime: input.endTime,
          status: 'SCHEDULED',
          notes: input.notes || '',
          requestedProducts: input.requestedProducts || [],
          productsUsed: [],
          duration: Math.round(
            (input.endTime.getTime() - input.startTime.getTime()) / 60000,
          ), // minutes
          timezone: provider.timezone || 'America/Los_Angeles',
          paymentStatus: 'PENDING',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const savedAppointment: Appointment =
          await transactionalEntityManager.getRepository(Appointment).save(appointment) as any;

        // Publish real-time event for new appointment
        await this.pubSubService.publishAppointmentUpdate(
          savedAppointment,
          AppointmentEventType.CREATED,
        );

        // Publish calendar update
        await this.pubSubService.publishCalendarUpdate(
          [savedAppointment],
          CalendarEventType.APPOINTMENT_CREATED,
          savedAppointment.startTime,
          savedAppointment.providerId,
        );

        // Publish schedule update
        await this.pubSubService.publishProviderScheduleUpdate(
          savedAppointment.providerId,
          ScheduleEventType.APPOINTMENT_ADDED,
          [], // affectedSlots would be calculated by calendar service
        );

        return {
          success: true,
          appointment: savedAppointment,
          warnings: warnings.length > 0 ? warnings : undefined,
        };
      },
    );
  }

  /**
   * Reschedule an existing appointment
   *
   * Validates:
   * - Appointment exists and can be rescheduled
   * - New time slot is available (same validations as booking)
   * - No cancellation fees apply
   */
  async rescheduleAppointment(
    input: RescheduleAppointmentInput,
  ): Promise<BookingResult> {
    const errors: BookingError[] = [];

    // Fetch existing appointment
    const appointment = await this.appointmentRepo.findOne({
      where: { id: input.appointmentId },
    });

    if (!appointment) {
      errors.push({
        code: BookingErrorCode.PROVIDER_NOT_FOUND,
        message: `Appointment with ID ${input.appointmentId} not found`,
        field: 'appointmentId',
      });
      return { success: false, errors };
    }

    // Check if appointment can be rescheduled
    if (!appointment.canBeRescheduled()) {
      errors.push({
        code: BookingErrorCode.INVALID_TIME_RANGE,
        message: `Appointment cannot be rescheduled (status: ${appointment.status})`,
        field: 'appointmentId',
      });
      return { success: false, errors };
    }

    // Validate new time slot by attempting to book
    const bookingResult = await this.bookAppointment({
      clientId: appointment.clientId,
      providerId: appointment.providerId,
      serviceType: appointment.serviceType,
      startTime: input.newStartTime,
      endTime: input.newEndTime,
      notes: appointment.notes,
      requestedProducts: appointment.requestedProducts,
    });

    if (!bookingResult.success) {
      return bookingResult;
    }

    // Cancel old appointment and save new one
    return await this.appointmentRepo.manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        // Mark old appointment as rescheduled
        appointment.status = 'CANCELLED';
        appointment.cancellationInfo = {
          cancelledBy: 'CLIENT',
          cancelledAt: new Date().toISOString(),
          reason: input.reason || 'Rescheduled to new time',
          cancellationFee: 0,
          refundIssued: false,
        };
        appointment.updatedAt = new Date();

        await transactionalEntityManager.save(appointment);

        // Publish reschedule event
        if (bookingResult.appointment) {
          await this.pubSubService.publishAppointmentUpdate(
            bookingResult.appointment,
            AppointmentEventType.RESCHEDULED,
            appointment.status,
          );

          // Publish calendar updates for both old and new dates
          await this.pubSubService.publishCalendarUpdate(
            [appointment],
            CalendarEventType.APPOINTMENT_CANCELLED,
            appointment.startTime,
            appointment.providerId,
          );

          await this.pubSubService.publishCalendarUpdate(
            [bookingResult.appointment],
            CalendarEventType.APPOINTMENT_CREATED,
            bookingResult.appointment.startTime,
            bookingResult.appointment.providerId,
          );
        }

        // Return new appointment
        return bookingResult;
      },
    );
  }

  /**
   * Cancel an existing appointment
   *
   * Calculates cancellation fees based on policy
   * Updates appointment status and records cancellation info
   */
  async cancelAppointment(
    input: CancelAppointmentInput,
  ): Promise<BookingResult> {
    const errors: BookingError[] = [];

    // Fetch appointment
    const appointment = await this.appointmentRepo.findOne({
      where: { id: input.appointmentId },
    });

    if (!appointment) {
      errors.push({
        code: BookingErrorCode.PROVIDER_NOT_FOUND,
        message: `Appointment with ID ${input.appointmentId} not found`,
        field: 'appointmentId',
      });
      return { success: false, errors };
    }

    // Check if appointment can be cancelled
    if (!appointment.canBeCancelled()) {
      errors.push({
        code: BookingErrorCode.INVALID_TIME_RANGE,
        message: `Appointment cannot be cancelled (status: ${appointment.status})`,
        field: 'appointmentId',
      });
      return { success: false, errors };
    }

    // Calculate cancellation fee
    const cancellationFee = appointment.calculateCancellationFee();

    // Update appointment
    appointment.status = 'CANCELLED';
    appointment.cancellationInfo = {
      cancelledBy: input.cancelledBy,
      cancelledAt: new Date().toISOString(),
      reason: input.reason,
      cancellationFee,
      refundIssued: cancellationFee === 0,
    };
    appointment.updatedAt = new Date();

    const savedAppointment = await this.appointmentRepo.save(appointment);

    // Publish cancellation event
    await this.pubSubService.publishAppointmentUpdate(
      savedAppointment,
      AppointmentEventType.CANCELLED,
      'SCHEDULED', // previous status
    );

    // Publish calendar update
    await this.pubSubService.publishCalendarUpdate(
      [savedAppointment],
      CalendarEventType.APPOINTMENT_CANCELLED,
      savedAppointment.startTime,
      savedAppointment.providerId,
    );

    // Publish schedule update (slot is now available)
    await this.pubSubService.publishProviderScheduleUpdate(
      savedAppointment.providerId,
      ScheduleEventType.APPOINTMENT_REMOVED,
      [],
    );

    return {
      success: true,
      appointment: savedAppointment,
      warnings:
        cancellationFee > 0
          ? [`Cancellation fee of $${cancellationFee.toFixed(2)} applies`]
          : undefined,
    };
  }

  /**
   * Get appointment by ID
   */
  async getAppointment(appointmentId: string): Promise<Appointment | null> {
    return await this.appointmentRepo.findOne({
      where: { id: appointmentId },
    });
  }

  /**
   * Get all appointments for a client
   */
  async getClientAppointments(
    clientId: string,
    options?: {
      status?: string[];
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<Appointment[]> {
    const query = this.appointmentRepo
      .createQueryBuilder('appointment')
      .where('appointment.clientId = :clientId', { clientId })
      .andWhere('appointment.deletedAt IS NULL');

    if (options?.status) {
      query.andWhere('appointment.status IN (:...statuses)', {
        statuses: options.status,
      });
    }

    if (options?.startDate) {
      query.andWhere('appointment.startTime >= :startDate', {
        startDate: options.startDate,
      });
    }

    if (options?.endDate) {
      query.andWhere('appointment.endTime <= :endDate', {
        endDate: options.endDate,
      });
    }

    return await query.orderBy('appointment.startTime', 'ASC').getMany();
  }

  /**
   * Get all appointments for a provider
   */
  async getProviderAppointments(
    providerId: string,
    options?: {
      status?: string[];
      startDate?: Date;
      endDate?: Date;
    },
  ): Promise<Appointment[]> {
    const query = this.appointmentRepo
      .createQueryBuilder('appointment')
      .where('appointment.providerId = :providerId', { providerId })
      .andWhere('appointment.deletedAt IS NULL');

    if (options?.status) {
      query.andWhere('appointment.status IN (:...statuses)', {
        statuses: options.status,
      });
    }

    if (options?.startDate) {
      query.andWhere('appointment.startTime >= :startDate', {
        startDate: options.startDate,
      });
    }

    if (options?.endDate) {
      query.andWhere('appointment.endTime <= :endDate', {
        endDate: options.endDate,
      });
    }

    return await query.orderBy('appointment.startTime', 'ASC').getMany();
  }

  /**
   * Mark appointment as checked in
   */
  async checkInAppointment(appointmentId: string): Promise<BookingResult> {
    const appointment = await this.appointmentRepo.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return {
        success: false,
        errors: [
          {
            code: BookingErrorCode.PROVIDER_NOT_FOUND,
            message: `Appointment with ID ${appointmentId} not found`,
          },
        ],
      };
    }

    appointment.status = 'CHECKED_IN';
    appointment.updatedAt = new Date();

    const savedAppointment = await this.appointmentRepo.save(appointment);

    return {
      success: true,
      appointment: savedAppointment,
    };
  }

  /**
   * Generate unique appointment number
   * Format: APT-YYYYMMDD-XXXXX
   */
  private async generateAppointmentNumber(): Promise<string> {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');

    // Get count of appointments today
    const count = await this.appointmentRepo
      .createQueryBuilder('appointment')
      .where('appointment.appointmentNumber LIKE :pattern', {
        pattern: `APT-${dateStr}-%`,
      })
      .getCount();

    const sequence = String(count + 1).padStart(5, '0');
    return `APT-${dateStr}-${sequence}`;
  }
}
