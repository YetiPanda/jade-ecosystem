/**
 * ConflictDetectorService - Double-Booking Prevention & Conflict Detection
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T108
 *
 * Purpose: Specialized service for detecting and preventing appointment conflicts
 * Uses database-level locking (SELECT FOR UPDATE) to prevent race conditions
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { ServiceProvider } from '../entities/service-provider.entity';
import { Availability } from '../entities/availability.entity';

/**
 * Conflict Check Input
 */
export interface ConflictCheckInput {
  providerId: string;
  clientId?: string;
  startTime: Date;
  endTime: Date;
  excludeAppointmentId?: string; // For rescheduling
}

/**
 * Conflict Type
 */
export enum ConflictType {
  PROVIDER_CONFLICT = 'PROVIDER_CONFLICT',
  CLIENT_CONFLICT = 'CLIENT_CONFLICT',
  CAPACITY_EXCEEDED = 'CAPACITY_EXCEEDED',
  BLOCKED_TIME = 'BLOCKED_TIME',
  OUTSIDE_HOURS = 'OUTSIDE_HOURS',
}

/**
 * Conflict Detail
 */
export interface ConflictDetail {
  type: ConflictType;
  message: string;
  conflictingAppointment?: Appointment;
  conflictingAvailability?: Availability;
}

/**
 * Conflict Check Result
 */
export interface ConflictCheckResult {
  hasConflict: boolean;
  conflicts: ConflictDetail[];
}

/**
 * Bulk Conflict Check Input
 */
export interface BulkConflictCheckInput {
  slots: Array<{
    slotId: string;
    providerId: string;
    startTime: Date;
    endTime: Date;
  }>;
  clientId?: string;
}

@Injectable()
export class ConflictDetectorService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(ServiceProvider)
    private readonly providerRepo: Repository<ServiceProvider>,
    @InjectRepository(Availability)
    private readonly availabilityRepo: Repository<Availability>,
  ) {}

  /**
   * Check for conflicts with database locking
   *
   * This method uses SERIALIZABLE transaction isolation and pessimistic locking
   * to prevent race conditions during concurrent booking attempts.
   *
   * Returns detailed conflict information if any conflicts are found.
   */
  async checkConflicts(
    input: ConflictCheckInput,
  ): Promise<ConflictCheckResult> {
    const conflicts: ConflictDetail[] = [];

    // Use SERIALIZABLE transaction for maximum isolation
    await this.appointmentRepo.manager.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager: EntityManager) => {
        // Check 1: Provider Conflicts
        const providerConflicts = await this.checkProviderConflicts(
          transactionalEntityManager,
          input,
        );
        conflicts.push(...providerConflicts);

        // Check 2: Client Conflicts (if clientId provided)
        if (input.clientId) {
          const clientConflicts = await this.checkClientConflicts(
            transactionalEntityManager,
            input,
          );
          conflicts.push(...clientConflicts);
        }

        // Check 3: Capacity Check
        const capacityConflicts = await this.checkCapacity(
          transactionalEntityManager,
          input,
        );
        conflicts.push(...capacityConflicts);

        // Check 4: Blocked Time
        const blockedTimeConflicts = await this.checkBlockedTime(
          transactionalEntityManager,
          input,
        );
        conflicts.push(...blockedTimeConflicts);

        // Check 5: Working Hours
        const workingHoursConflict = await this.checkWorkingHours(
          transactionalEntityManager,
          input,
        );
        if (workingHoursConflict) {
          conflicts.push(workingHoursConflict);
        }
      },
    );

    return {
      hasConflict: conflicts.length > 0,
      conflicts,
    };
  }

  /**
   * Check for provider conflicts
   * Uses SELECT FOR UPDATE to lock rows during check
   */
  private async checkProviderConflicts(
    manager: EntityManager,
    input: ConflictCheckInput,
  ): Promise<ConflictDetail[]> {
    const conflicts: ConflictDetail[] = [];

    // Lock and fetch overlapping appointments for this provider
    const query = manager
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
      );

    // Exclude specific appointment for rescheduling
    if (input.excludeAppointmentId) {
      query.andWhere('appointment.id != :excludeId', {
        excludeId: input.excludeAppointmentId,
      });
    }

    const overlappingAppointments = await query.getMany();

    // Add conflicts
    for (const apt of overlappingAppointments) {
      conflicts.push({
        type: ConflictType.PROVIDER_CONFLICT,
        message: `Provider has an existing appointment from ${apt.startTime.toISOString()} to ${apt.endTime.toISOString()}`,
        conflictingAppointment: apt,
      });
    }

    return conflicts;
  }

  /**
   * Check for client conflicts
   */
  private async checkClientConflicts(
    manager: EntityManager,
    input: ConflictCheckInput,
  ): Promise<ConflictDetail[]> {
    if (!input.clientId) return [];

    const conflicts: ConflictDetail[] = [];

    // Lock and fetch overlapping appointments for this client
    const query = manager
      .createQueryBuilder(Appointment, 'appointment')
      .setLock('pessimistic_write')
      .where('appointment.clientId = :clientId', { clientId: input.clientId })
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
      );

    // Exclude specific appointment for rescheduling
    if (input.excludeAppointmentId) {
      query.andWhere('appointment.id != :excludeId', {
        excludeId: input.excludeAppointmentId,
      });
    }

    const overlappingAppointments = await query.getMany();

    // Add conflicts
    for (const apt of overlappingAppointments) {
      conflicts.push({
        type: ConflictType.CLIENT_CONFLICT,
        message: `Client has an existing appointment from ${apt.startTime.toISOString()} to ${apt.endTime.toISOString()}`,
        conflictingAppointment: apt,
      });
    }

    return conflicts;
  }

  /**
   * Check if provider has reached capacity for this time slot
   */
  private async checkCapacity(
    manager: EntityManager,
    input: ConflictCheckInput,
  ): Promise<ConflictDetail[]> {
    const conflicts: ConflictDetail[] = [];

    // Fetch provider to get service capacity
    const provider = await manager.findOne(ServiceProvider, {
      where: { id: input.providerId },
    });

    if (!provider) {
      return []; // Provider not found, will be caught by other validation
    }

    // Get max capacity across all services (default to 1)
    const maxCapacity = Math.max(
      ...provider.services.map((s) => s.capacity || 1),
      1,
    );

    // Count overlapping appointments
    const query = manager
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
      );

    // Exclude specific appointment for rescheduling
    if (input.excludeAppointmentId) {
      query.andWhere('appointment.id != :excludeId', {
        excludeId: input.excludeAppointmentId,
      });
    }

    const overlappingCount = await query.getCount();

    // Check if at capacity
    if (overlappingCount >= maxCapacity) {
      conflicts.push({
        type: ConflictType.CAPACITY_EXCEEDED,
        message: `Provider is at maximum capacity (${maxCapacity}) for this time slot`,
      });
    }

    return conflicts;
  }

  /**
   * Check for blocked time periods
   */
  private async checkBlockedTime(
    manager: EntityManager,
    input: ConflictCheckInput,
  ): Promise<ConflictDetail[]> {
    const conflicts: ConflictDetail[] = [];

    // Fetch overlapping blocked time periods
    const blockedPeriods = await manager
      .createQueryBuilder(Availability, 'availability')
      .where('availability.providerId = :providerId', {
        providerId: input.providerId,
      })
      .andWhere('availability.deletedAt IS NULL')
      .andWhere(
        '(availability.startTime < :endTime AND availability.endTime > :startTime)',
        {
          startTime: input.startTime,
          endTime: input.endTime,
        },
      )
      .getMany();

    // Check if any blocked periods prevent appointments
    for (const blocked of blockedPeriods) {
      if (blocked.blocksAppointments()) {
        conflicts.push({
          type: ConflictType.BLOCKED_TIME,
          message: `Time slot is blocked: ${blocked.type} - ${blocked.reason || 'No reason provided'}`,
          conflictingAvailability: blocked,
        });
      }
    }

    return conflicts;
  }

  /**
   * Check if time is within provider's working hours
   */
  private async checkWorkingHours(
    manager: EntityManager,
    input: ConflictCheckInput,
  ): Promise<ConflictDetail | null> {
    // Fetch provider
    const provider = await manager.findOne(ServiceProvider, {
      where: { id: input.providerId },
    });

    if (!provider) {
      return null; // Provider not found, will be caught by other validation
    }

    // Check if provider is available during this time
    const isAvailable = provider.isProviderAvailable(
      input.startTime,
      input.endTime,
    );

    if (!isAvailable) {
      return {
        type: ConflictType.OUTSIDE_HOURS,
        message: 'Requested time is outside provider working hours',
      };
    }

    return null;
  }

  /**
   * Check multiple time slots at once
   * Useful for batch validation and calendar UI
   */
  async checkBulkConflicts(
    input: BulkConflictCheckInput,
  ): Promise<
    Record<
      string,
      {
        slotId: string;
        hasConflict: boolean;
        conflicts: ConflictDetail[];
      }
    >
  > {
    const results: Record<
      string,
      {
        slotId: string;
        hasConflict: boolean;
        conflicts: ConflictDetail[];
      }
    > = {};

    // Check each slot
    for (const slot of input.slots) {
      const conflictCheck = await this.checkConflicts({
        providerId: slot.providerId,
        clientId: input.clientId,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });

      results[slot.slotId] = {
        slotId: slot.slotId,
        hasConflict: conflictCheck.hasConflict,
        conflicts: conflictCheck.conflicts,
      };
    }

    return results;
  }

  /**
   * Find available time slots (no conflicts)
   * Returns all slots from input that have no conflicts
   */
  async findAvailableSlots(
    input: BulkConflictCheckInput,
  ): Promise<
    Array<{
      slotId: string;
      providerId: string;
      startTime: Date;
      endTime: Date;
    }>
  > {
    const bulkResults = await this.checkBulkConflicts(input);

    return input.slots.filter((slot) => {
      const result = bulkResults[slot.slotId];
      return result && !result.hasConflict;
    });
  }

  /**
   * Get conflict statistics for a provider
   * Useful for analytics and optimization
   */
  async getProviderConflictStats(
    providerId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    totalAttempts: number;
    successfulBookings: number;
    providerConflicts: number;
    capacityIssues: number;
    blockedTimeConflicts: number;
    outsideHoursAttempts: number;
  }> {
    // This would typically be tracked in a separate analytics table
    // For now, return placeholder data
    return {
      totalAttempts: 0,
      successfulBookings: 0,
      providerConflicts: 0,
      capacityIssues: 0,
      blockedTimeConflicts: 0,
      outsideHoursAttempts: 0,
    };
  }

  /**
   * Simulate concurrent booking attempts (for testing)
   * This method is primarily for integration tests
   */
  async simulateConcurrentBooking(
    inputs: ConflictCheckInput[],
  ): Promise<ConflictCheckResult[]> {
    // Run all checks concurrently to test race conditions
    const results = await Promise.all(
      inputs.map((input) => this.checkConflicts(input)),
    );

    return results;
  }

  /**
   * Get all overlapping appointments for debugging
   */
  async getOverlappingAppointments(
    providerId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Appointment[]> {
    return await this.appointmentRepo
      .createQueryBuilder('appointment')
      .where('appointment.providerId = :providerId', { providerId })
      .andWhere('appointment.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: ['CANCELLED', 'NO_SHOW'],
      })
      .andWhere('appointment.deletedAt IS NULL')
      .andWhere(
        '(appointment.startTime < :endTime AND appointment.endTime > :startTime)',
        {
          startTime,
          endTime,
        },
      )
      .orderBy('appointment.startTime', 'ASC')
      .getMany();
  }
}
