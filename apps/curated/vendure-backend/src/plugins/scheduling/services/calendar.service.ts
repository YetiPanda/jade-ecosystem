/**
 * CalendarService - Provider Availability & Schedule Management
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T106
 *
 * Purpose: Calculate provider availability, generate time slots, manage schedules
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceProvider, TimeSlot } from '../entities/service-provider.entity';
import { Appointment } from '../entities/appointment.entity';
import { Availability } from '../entities/availability.entity';

/**
 * Available Time Slot
 */
export interface AvailableSlot {
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  capacity: number;
  bookedCount: number;
  isAvailable: boolean;
  slotId: string;
}

/**
 * Provider Availability Result
 */
export interface ProviderAvailability {
  providerId: string;
  providerName: string;
  availableSlots: AvailableSlot[];
  timezone: string;
}

/**
 * Availability Query Input
 */
export interface GetAvailabilityInput {
  providerId: string;
  startDate: Date;
  endDate: Date;
  serviceType?: string;
  duration?: number; // minutes, defaults to service duration
}

/**
 * Block Time Input
 */
export interface BlockTimeInput {
  providerId: string;
  startTime: Date;
  endTime: Date;
  type: 'BLOCKED_TIME' | 'VACATION' | 'UNAVAILABLE';
  reason: string;
  isRecurring?: boolean;
  recurrenceRule?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    interval: number;
    until?: Date;
  };
}

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(ServiceProvider)
    private readonly providerRepo: Repository<ServiceProvider>,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Availability)
    private readonly availabilityRepo: Repository<Availability>,
  ) {}

  /**
   * Get provider availability for a date range
   *
   * Returns available time slots considering:
   * - Provider's weekly schedule
   * - Existing appointments
   * - Blocked time periods
   * - Provider capacity
   * - Service-specific requirements
   */
  async getProviderAvailability(
    input: GetAvailabilityInput,
  ): Promise<ProviderAvailability> {
    // Fetch provider
    const provider = await this.providerRepo.findOne({
      where: { id: input.providerId },
    });

    if (!provider) {
      throw new Error(`Provider with ID ${input.providerId} not found`);
    }

    // Get service details if specified
    let serviceDuration = input.duration || 60; // default 60 minutes
    let serviceCapacity = 1;

    if (input.serviceType) {
      const service = provider.services.find(
        (s) => s.serviceType === input.serviceType,
      );
      if (service) {
        serviceDuration = service.duration;
        serviceCapacity = service.capacity || 1;
      }
    }

    // Generate potential time slots from provider's schedule
    const potentialSlots = this.generatePotentialSlots(
      provider,
      input.startDate,
      input.endDate,
      serviceDuration,
    );

    // Fetch existing appointments in this range
    const existingAppointments = await this.appointmentRepo
      .createQueryBuilder('appointment')
      .where('appointment.providerId = :providerId', {
        providerId: input.providerId,
      })
      .andWhere('appointment.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: ['CANCELLED', 'NO_SHOW'],
      })
      .andWhere('appointment.deletedAt IS NULL')
      .andWhere('appointment.startTime < :endDate', {
        endDate: input.endDate,
      })
      .andWhere('appointment.endTime > :startDate', {
        startDate: input.startDate,
      })
      .getMany();

    // Fetch blocked time periods
    const blockedPeriods = await this.availabilityRepo
      .createQueryBuilder('availability')
      .where('availability.providerId = :providerId', {
        providerId: input.providerId,
      })
      .andWhere('availability.startTime < :endDate', {
        endDate: input.endDate,
      })
      .andWhere('availability.endTime > :startDate', {
        startDate: input.startDate,
      })
      .getMany();

    // Calculate availability for each slot
    const availableSlots: AvailableSlot[] = potentialSlots.map((slot) => {
      // Count appointments overlapping this slot
      const overlappingAppointments = existingAppointments.filter((apt) =>
        this.timesOverlap(
          apt.startTime,
          apt.endTime,
          slot.startTime,
          slot.endTime,
        ),
      );

      const bookedCount = overlappingAppointments.length;

      // Check if any blocked periods overlap this slot
      const hasBlockedPeriod = blockedPeriods.some(
        (blocked) =>
          blocked.blocksAppointments() &&
          this.timesOverlap(
            blocked.startTime,
            blocked.endTime,
            slot.startTime,
            slot.endTime,
          ),
      );

      // Slot is available if:
      // 1. Booked count < capacity
      // 2. No blocking periods
      const isAvailable = bookedCount < serviceCapacity && !hasBlockedPeriod;

      return {
        startTime: slot.startTime,
        endTime: slot.endTime,
        duration: serviceDuration,
        capacity: serviceCapacity,
        bookedCount,
        isAvailable,
        slotId: `${provider.id}-${slot.startTime.toISOString()}`,
      };
    });

    return {
      providerId: provider.id,
      providerName: provider.name,
      availableSlots,
      timezone: provider.timezone || 'America/Los_Angeles',
    };
  }

  /**
   * Get availability for multiple providers
   */
  async getMultiProviderAvailability(
    providerIds: string[],
    startDate: Date,
    endDate: Date,
    serviceType?: string,
  ): Promise<ProviderAvailability[]> {
    const results = await Promise.all(
      providerIds.map((providerId) =>
        this.getProviderAvailability({
          providerId,
          startDate,
          endDate,
          serviceType,
        }),
      ),
    );

    return results;
  }

  /**
   * Block a time period for a provider
   */
  async blockProviderTime(input: BlockTimeInput): Promise<Availability> {
    // Validate provider exists
    const provider = await this.providerRepo.findOne({
      where: { id: input.providerId },
    });

    if (!provider) {
      throw new Error(`Provider with ID ${input.providerId} not found`);
    }

    // Create blocked time record
    const availability = this.availabilityRepo.create({
      providerId: input.providerId,
      type: input.type,
      startTime: input.startTime,
      endTime: input.endTime,
      reason: input.reason,
      isRecurring: input.isRecurring || false,
      recurrenceRule: input.recurrenceRule
        ? {
            frequency: input.recurrenceRule.frequency,
            interval: input.recurrenceRule.interval,
            until: input.recurrenceRule.until?.toISOString(),
          }
        : null,
      requiresApproval: false,
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.availabilityRepo.save(availability);
  }

  /**
   * Unblock a time period
   */
  async unblockProviderTime(availabilityId: string): Promise<void> {
    const availability = await this.availabilityRepo.findOne({
      where: { id: availabilityId },
    });

    if (!availability) {
      throw new Error(`Availability record with ID ${availabilityId} not found`);
    }

    // Soft delete
    availability.deletedAt = new Date();
    await this.availabilityRepo.save(availability);
  }

  /**
   * Get all blocked time periods for a provider
   */
  async getBlockedTimes(
    providerId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Availability[]> {
    const query = this.availabilityRepo
      .createQueryBuilder('availability')
      .where('availability.providerId = :providerId', { providerId })
      .andWhere('availability.deletedAt IS NULL');

    if (startDate) {
      query.andWhere('availability.endTime > :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('availability.startTime < :endDate', { endDate });
    }

    return await query.orderBy('availability.startTime', 'ASC').getMany();
  }

  /**
   * Find next available slot for a provider
   */
  async findNextAvailableSlot(
    providerId: string,
    serviceType: string,
    afterDate: Date,
    duration?: number,
  ): Promise<AvailableSlot | null> {
    // Search for next 30 days
    const endDate = new Date(afterDate);
    endDate.setDate(endDate.getDate() + 30);

    const availability = await this.getProviderAvailability({
      providerId,
      startDate: afterDate,
      endDate,
      serviceType,
      duration,
    });

    // Find first available slot
    const nextSlot = availability.availableSlots.find((slot) => slot.isAvailable);

    return nextSlot || null;
  }

  /**
   * Get provider schedule summary for a day
   */
  async getProviderDaySchedule(
    providerId: string,
    date: Date,
  ): Promise<{
    workingHours: TimeSlot[];
    appointments: Appointment[];
    blockedTimes: Availability[];
    availableSlots: AvailableSlot[];
  }> {
    const provider = await this.providerRepo.findOne({
      where: { id: providerId },
    });

    if (!provider) {
      throw new Error(`Provider with ID ${providerId} not found`);
    }

    // Get working hours for this day
    const dayOfWeek = date.getDay();
    const daySchedule = provider.weeklySchedule.find(
      (d) => d.dayOfWeek === dayOfWeek,
    );
    const workingHours = daySchedule?.isWorkingDay ? daySchedule.shifts : [];

    // Get appointments for this day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await this.appointmentRepo
      .createQueryBuilder('appointment')
      .where('appointment.providerId = :providerId', { providerId })
      .andWhere('appointment.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: ['CANCELLED', 'NO_SHOW'],
      })
      .andWhere('appointment.deletedAt IS NULL')
      .andWhere('appointment.startTime >= :startOfDay', { startOfDay })
      .andWhere('appointment.startTime < :endOfDay', { endOfDay })
      .orderBy('appointment.startTime', 'ASC')
      .getMany();

    // Get blocked times for this day
    const blockedTimes = await this.getBlockedTimes(
      providerId,
      startOfDay,
      endOfDay,
    );

    // Get available slots
    const availability = await this.getProviderAvailability({
      providerId,
      startDate: startOfDay,
      endDate: endOfDay,
    });

    return {
      workingHours,
      appointments,
      blockedTimes,
      availableSlots: availability.availableSlots.filter((s) => s.isAvailable),
    };
  }

  /**
   * Generate potential time slots based on provider's schedule
   */
  private generatePotentialSlots(
    provider: ServiceProvider,
    startDate: Date,
    endDate: Date,
    slotDuration: number,
  ): Array<{ startTime: Date; endTime: Date }> {
    const slots: Array<{ startTime: Date; endTime: Date }> = [];
    const currentDate = new Date(startDate);

    // Iterate through each day in the range
    while (currentDate < endDate) {
      const dayOfWeek = currentDate.getDay();
      const daySchedule = provider.weeklySchedule.find(
        (d) => d.dayOfWeek === dayOfWeek,
      );

      // If provider works this day, generate slots for each shift
      if (daySchedule?.isWorkingDay && daySchedule.shifts.length > 0) {
        for (const shift of daySchedule.shifts) {
          // Parse shift times
          const shiftStart = this.parseTimeString(
            shift.startTime,
            new Date(currentDate),
          );
          const shiftEnd = this.parseTimeString(
            shift.endTime,
            new Date(currentDate),
          );

          // Generate slots within this shift
          let slotStart = new Date(shiftStart);

          while (slotStart < shiftEnd) {
            const slotEnd = new Date(slotStart);
            slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

            // Only add slot if it fits within shift and date range
            if (slotEnd <= shiftEnd && slotStart >= startDate && slotEnd <= endDate) {
              slots.push({
                startTime: new Date(slotStart),
                endTime: new Date(slotEnd),
              });
            }

            // Move to next slot (use slotDuration as interval)
            slotStart.setMinutes(slotStart.getMinutes() + slotDuration);
          }
        }
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return slots;
  }

  /**
   * Parse time string (HH:MM) and combine with date
   */
  private parseTimeString(timeStr: string, date: Date): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const result = new Date(date);
    result.setHours(hours, minutes, 0, 0);
    return result;
  }

  /**
   * Check if two time ranges overlap
   */
  private timesOverlap(
    start1: Date,
    end1: Date,
    start2: Date,
    end2: Date,
  ): boolean {
    return start1 < end2 && end1 > start2;
  }

  /**
   * Calculate total working hours for a provider in a date range
   */
  async calculateWorkingHours(
    providerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const provider = await this.providerRepo.findOne({
      where: { id: providerId },
    });

    if (!provider) {
      throw new Error(`Provider with ID ${providerId} not found`);
    }

    let totalMinutes = 0;
    const currentDate = new Date(startDate);

    while (currentDate < endDate) {
      const dayOfWeek = currentDate.getDay();
      const daySchedule = provider.weeklySchedule.find(
        (d) => d.dayOfWeek === dayOfWeek,
      );

      if (daySchedule?.isWorkingDay) {
        for (const shift of daySchedule.shifts) {
          const shiftStart = this.parseTimeString(
            shift.startTime,
            new Date(currentDate),
          );
          const shiftEnd = this.parseTimeString(
            shift.endTime,
            new Date(currentDate),
          );

          const shiftMinutes =
            (shiftEnd.getTime() - shiftStart.getTime()) / 60000;
          totalMinutes += shiftMinutes;
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return totalMinutes / 60; // Return hours
  }

  /**
   * Get provider utilization rate
   * Returns percentage of working hours that are booked
   */
  async getProviderUtilization(
    providerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const workingHours = await this.calculateWorkingHours(
      providerId,
      startDate,
      endDate,
    );

    const appointments = await this.appointmentRepo
      .createQueryBuilder('appointment')
      .where('appointment.providerId = :providerId', { providerId })
      .andWhere('appointment.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: ['CANCELLED', 'NO_SHOW'],
      })
      .andWhere('appointment.deletedAt IS NULL')
      .andWhere('appointment.startTime >= :startDate', { startDate })
      .andWhere('appointment.endTime <= :endDate', { endDate })
      .getMany();

    const bookedMinutes = appointments.reduce((sum, apt) => {
      return sum + (apt.endTime.getTime() - apt.startTime.getTime()) / 60000;
    }, 0);

    const bookedHours = bookedMinutes / 60;

    return workingHours > 0 ? (bookedHours / workingHours) * 100 : 0;
  }
}
