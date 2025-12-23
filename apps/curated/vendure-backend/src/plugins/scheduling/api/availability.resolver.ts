/**
 * AvailabilityResolver - Provider Availability Queries
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T111
 *
 * Purpose: GraphQL resolvers for querying provider availability and time slots
 */

import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { CalendarService } from '../services/calendar.service';

/**
 * Query Arguments
 */
interface ProviderAvailabilityArgs {
  providerId: string;
  startDate: Date;
  endDate: Date;
  serviceType?: string;
}

interface AvailableSlotsArgs {
  serviceType: string;
  locationId?: string;
  startDate: Date;
  endDate: Date;
  preferredProviderId?: string;
}

interface BlockTimeArgs {
  input: {
    providerId: string;
    startTime: Date;
    endTime: Date;
    type: 'BLOCKED_TIME' | 'SPECIAL_HOURS' | 'VACATION' | 'UNAVAILABLE' | 'AVAILABLE' | 'GROUP_SESSION';
    reason: string;
    isRecurring?: boolean;
    recurrenceRule?: {
      frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
      interval: number;
      count?: number;
      until?: Date;
      byDay?: string[];
    };
  };
}

interface UnblockTimeArgs {
  availabilityId: string;
}

@Resolver()
export class AvailabilityResolver {
  constructor(private readonly calendarService: CalendarService) {}

  /**
   * Query: providerAvailability
   *
   * Get available time slots for a specific provider within a date range
   *
   * Example query:
   * ```graphql
   * query {
   *   providerAvailability(
   *     providerId: "provider-123"
   *     startDate: "2025-10-20T00:00:00Z"
   *     endDate: "2025-10-27T00:00:00Z"
   *     serviceType: "FACIAL"
   *   ) {
   *     providerId
   *     providerName
   *     timezone
   *     availableSlots {
   *       startTime
   *       endTime
   *       duration
   *       capacity
   *       bookedCount
   *       isAvailable
   *       slotId
   *     }
   *   }
   * }
   * ```
   */
  @Query('providerAvailability')
  async providerAvailability(
    @Args() args: ProviderAvailabilityArgs,
  ): Promise<{
    providerId: string;
    providerName: string;
    availableSlots: Array<{
      startTime: Date;
      endTime: Date;
      duration: number;
      capacity: number;
      bookedCount: number;
      isAvailable: boolean;
      slotId: string;
    }>;
    timezone: string;
  }> {
    const availability = await this.calendarService.getProviderAvailability({
      providerId: args.providerId,
      startDate: args.startDate,
      endDate: args.endDate,
      serviceType: args.serviceType,
    });

    return availability;
  }

  /**
   * Query: availableSlots
   *
   * Search for available time slots across multiple providers for a specific service
   * Useful for client booking portal showing all available times
   *
   * Example query:
   * ```graphql
   * query {
   *   availableSlots(
   *     serviceType: "FACIAL"
   *     startDate: "2025-10-20T00:00:00Z"
   *     endDate: "2025-10-27T00:00:00Z"
   *     preferredProviderId: "provider-123"
   *   ) {
   *     startTime
   *     endTime
   *     duration
   *     capacity
   *     bookedCount
   *     isAvailable
   *     slotId
   *   }
   * }
   * ```
   */
  @Query('availableSlots')
  async availableSlots(
    @Args() args: AvailableSlotsArgs,
  ): Promise<
    Array<{
      startTime: Date;
      endTime: Date;
      duration: number;
      capacity: number;
      bookedCount: number;
      isAvailable: boolean;
      slotId: string;
    }>
  > {
    // If preferred provider specified, get their availability
    if (args.preferredProviderId) {
      const availability = await this.calendarService.getProviderAvailability({
        providerId: args.preferredProviderId,
        startDate: args.startDate,
        endDate: args.endDate,
        serviceType: args.serviceType,
      });

      // Return only available slots
      return availability.availableSlots.filter((slot) => slot.isAvailable);
    }

    // TODO: In a future implementation, this would query multiple providers
    // For now, return empty array if no preferred provider
    // This would integrate with ServiceProvider repository to find all providers
    // offering this service type and aggregate their availability
    return [];
  }

  /**
   * Mutation: blockProviderTime
   *
   * Block a time period for a provider (vacation, breaks, PTO, etc.)
   *
   * Example mutation:
   * ```graphql
   * mutation {
   *   blockProviderTime(input: {
   *     providerId: "provider-123"
   *     startTime: "2025-10-25T09:00:00Z"
   *     endTime: "2025-10-25T17:00:00Z"
   *     type: VACATION
   *     reason: "Family vacation"
   *     isRecurring: false
   *   }) {
   *     success
   *     blockedTime {
   *       id
   *       type
   *       startTime
   *       endTime
   *       reason
   *     }
   *     errors
   *   }
   * }
   * ```
   */
  @Mutation('blockProviderTime')
  async blockProviderTime(
    @Args() args: BlockTimeArgs,
  ): Promise<{
    success: boolean;
    blockedTime?: {
      id: string;
      providerId: string;
      type: string;
      startTime: Date;
      endTime: Date;
      reason: string;
      isRecurring: boolean;
      recurrenceRule?: {
        frequency: string;
        interval: number;
        count?: number;
        until?: string;
      };
    };
    errors?: string[];
  }> {
    try {
      const blockedTime = await this.calendarService.blockProviderTime({
        providerId: args.input.providerId,
        startTime: args.input.startTime,
        endTime: args.input.endTime,
        type: args.input.type,
        reason: args.input.reason,
        isRecurring: args.input.isRecurring,
        recurrenceRule: args.input.recurrenceRule
          ? {
              frequency: args.input.recurrenceRule.frequency,
              interval: args.input.recurrenceRule.interval,
              until: args.input.recurrenceRule.until,
            }
          : undefined,
      });

      return {
        success: true,
        blockedTime: {
          id: blockedTime.id,
          providerId: blockedTime.providerId,
          type: blockedTime.type,
          startTime: blockedTime.startTime,
          endTime: blockedTime.endTime,
          reason: blockedTime.reason || '',
          isRecurring: blockedTime.isRecurring,
          recurrenceRule: blockedTime.recurrenceRule
            ? {
                frequency: blockedTime.recurrenceRule.frequency,
                interval: blockedTime.recurrenceRule.interval,
                count: blockedTime.recurrenceRule.count,
                until: blockedTime.recurrenceRule.until,
              }
            : undefined,
        },
      };
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
      };
    }
  }

  /**
   * Mutation: unblockProviderTime
   *
   * Remove a blocked time period
   *
   * Example mutation:
   * ```graphql
   * mutation {
   *   unblockProviderTime(availabilityId: "avail-123") {
   *     success
   *     message
   *     errors
   *   }
   * }
   * ```
   */
  @Mutation('unblockProviderTime')
  async unblockProviderTime(
    @Args() args: UnblockTimeArgs,
  ): Promise<{
    success: boolean;
    message?: string;
    errors?: string[];
  }> {
    try {
      await this.calendarService.unblockProviderTime(args.availabilityId);

      return {
        success: true,
        message: 'Time period unblocked successfully',
      };
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
      };
    }
  }

  /**
   * Helper query: Get provider's day schedule
   * Useful for calendar UI showing daily view
   *
   * Example query:
   * ```graphql
   * query {
   *   providerDaySchedule(
   *     providerId: "provider-123"
   *     date: "2025-10-25"
   *   ) {
   *     workingHours {
   *       startTime
   *       endTime
   *     }
   *     appointments {
   *       id
   *       startTime
   *       endTime
   *       serviceType
   *     }
   *     blockedTimes {
   *       id
   *       type
   *       startTime
   *       endTime
   *       reason
   *     }
   *     availableSlots {
   *       startTime
   *       endTime
   *       isAvailable
   *     }
   *   }
   * }
   * ```
   */
  @Query('providerDaySchedule')
  async providerDaySchedule(
    @Args('providerId') providerId: string,
    @Args('date') date: Date,
  ): Promise<{
    workingHours: Array<{ startTime: string; endTime: string }>;
    appointments: Array<{
      id: string;
      startTime: Date;
      endTime: Date;
      serviceType: string;
    }>;
    blockedTimes: Array<{
      id: string;
      type: string;
      startTime: Date;
      endTime: Date;
      reason: string;
    }>;
    availableSlots: Array<{
      startTime: Date;
      endTime: Date;
      isAvailable: boolean;
    }>;
  }> {
    const schedule = await this.calendarService.getProviderDaySchedule(
      providerId,
      date,
    );

    return {
      workingHours: schedule.workingHours,
      appointments: schedule.appointments.map((apt) => ({
        id: apt.id,
        startTime: apt.startTime,
        endTime: apt.endTime,
        serviceType: apt.serviceType,
      })),
      blockedTimes: schedule.blockedTimes.map((blocked) => ({
        id: blocked.id,
        type: blocked.type,
        startTime: blocked.startTime,
        endTime: blocked.endTime,
        reason: blocked.reason || '',
      })),
      availableSlots: schedule.availableSlots,
    };
  }

  /**
   * Helper query: Find next available slot
   * Useful for "next available" button in booking UI
   *
   * Example query:
   * ```graphql
   * query {
   *   nextAvailableSlot(
   *     providerId: "provider-123"
   *     serviceType: "FACIAL"
   *     afterDate: "2025-10-20T00:00:00Z"
   *   ) {
   *     startTime
   *     endTime
   *     duration
   *     isAvailable
   *   }
   * }
   * ```
   */
  @Query('nextAvailableSlot')
  async nextAvailableSlot(
    @Args('providerId') providerId: string,
    @Args('serviceType') serviceType: string,
    @Args('afterDate') afterDate: Date,
    @Args('duration') duration?: number,
  ): Promise<{
    startTime: Date;
    endTime: Date;
    duration: number;
    capacity: number;
    bookedCount: number;
    isAvailable: boolean;
    slotId: string;
  } | null> {
    const nextSlot = await this.calendarService.findNextAvailableSlot(
      providerId,
      serviceType,
      afterDate,
      duration,
    );

    return nextSlot;
  }

  /**
   * Helper query: Get provider utilization
   * Useful for analytics dashboard
   *
   * Example query:
   * ```graphql
   * query {
   *   providerUtilization(
   *     providerId: "provider-123"
   *     startDate: "2025-10-01T00:00:00Z"
   *     endDate: "2025-10-31T23:59:59Z"
   *   )
   * }
   * ```
   */
  @Query('providerUtilization')
  async providerUtilization(
    @Args('providerId') providerId: string,
    @Args('startDate') startDate: Date,
    @Args('endDate') endDate: Date,
  ): Promise<number> {
    const utilization = await this.calendarService.getProviderUtilization(
      providerId,
      startDate,
      endDate,
    );

    return utilization;
  }
}
