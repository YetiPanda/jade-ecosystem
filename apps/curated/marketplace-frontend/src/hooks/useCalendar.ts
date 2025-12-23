/**
 * Custom hooks for calendar and availability data
 * Task: T125 - Create custom hooks for calendar data
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';

// Queries
const PROVIDER_AVAILABILITY = gql`
  query ProviderAvailability(
    $providerId: ID!
    $startDate: DateTime!
    $endDate: DateTime!
    $serviceType: String
  ) {
    providerAvailability(
      providerId: $providerId
      startDate: $startDate
      endDate: $endDate
      serviceType: $serviceType
    ) {
      providerId
      providerName
      availableSlots {
        startTime
        endTime
        duration
        capacity
        bookedCount
        isAvailable
        slotId
      }
      timezone
    }
  }
`;

const AVAILABLE_SLOTS = gql`
  query AvailableSlots(
    $serviceType: String!
    $locationId: ID
    $startDate: DateTime!
    $endDate: DateTime!
    $preferredProviderId: ID
  ) {
    availableSlots(
      serviceType: $serviceType
      locationId: $locationId
      startDate: $startDate
      endDate: $endDate
      preferredProviderId: $preferredProviderId
    ) {
      startTime
      endTime
      duration
      capacity
      bookedCount
      isAvailable
      slotId
    }
  }
`;

const PROVIDER_DAY_SCHEDULE = gql`
  query ProviderDaySchedule($providerId: ID!, $date: DateTime!) {
    providerDaySchedule(providerId: $providerId, date: $date) {
      workingHours {
        startTime
        endTime
      }
      appointments {
        id
        appointmentNumber
        startTime
        endTime
        serviceType
        status
        clientId
      }
      blockedTimes {
        id
        type
        startTime
        endTime
        reason
      }
      availableSlots {
        startTime
        endTime
        isAvailable
      }
    }
  }
`;

const NEXT_AVAILABLE_SLOT = gql`
  query NextAvailableSlot(
    $providerId: ID!
    $serviceType: String!
    $afterDate: DateTime!
    $duration: Int
  ) {
    nextAvailableSlot(
      providerId: $providerId
      serviceType: $serviceType
      afterDate: $afterDate
      duration: $duration
    ) {
      startTime
      endTime
      duration
      capacity
      bookedCount
      isAvailable
      slotId
    }
  }
`;

const PROVIDER_UTILIZATION = gql`
  query ProviderUtilization($providerId: ID!, $startDate: DateTime!, $endDate: DateTime!) {
    providerUtilization(providerId: $providerId, startDate: $startDate, endDate: $endDate)
  }
`;

// Mutations
const BLOCK_PROVIDER_TIME = gql`
  mutation BlockProviderTime($input: BlockTimeInput!) {
    blockProviderTime(input: $input) {
      success
      blockedTime {
        id
        providerId
        type
        startTime
        endTime
        reason
        isRecurring
        recurrenceRule {
          frequency
          interval
          count
          until
          byDay
        }
      }
      errors
    }
  }
`;

const UNBLOCK_PROVIDER_TIME = gql`
  mutation UnblockProviderTime($availabilityId: ID!) {
    unblockProviderTime(availabilityId: $availabilityId) {
      success
      message
      errors
    }
  }
`;

/**
 * Hook for provider availability
 */
export function useProviderAvailability(
  providerId: string | null,
  startDate: Date,
  endDate: Date,
  serviceType?: string
) {
  const { data, loading, error, refetch } = useQuery(PROVIDER_AVAILABILITY, {
    variables: {
      providerId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      serviceType,
    },
    skip: !providerId,
    fetchPolicy: 'cache-and-network',
  });

  const availability = data?.providerAvailability;
  const availableSlots = availability?.availableSlots || [];
  const timezone = availability?.timezone || 'America/Los_Angeles';

  return {
    availability,
    availableSlots,
    timezone,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for searching available slots across providers
 */
export function useAvailableSlots(
  serviceType: string,
  startDate: Date,
  endDate: Date,
  options?: {
    locationId?: string;
    preferredProviderId?: string;
  }
) {
  const { data, loading, error, refetch } = useQuery(AVAILABLE_SLOTS, {
    variables: {
      serviceType,
      locationId: options?.locationId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      preferredProviderId: options?.preferredProviderId,
    },
    fetchPolicy: 'cache-and-network',
  });

  const slots = data?.availableSlots || [];

  // Group slots by date for easier rendering
  const slotsByDate = useMemo(() => {
    const grouped: Record<string, any[]> = {};

    slots.forEach((slot: any) => {
      const date = new Date(slot.startTime).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });

    return grouped;
  }, [slots]);

  return {
    slots,
    slotsByDate,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for provider day schedule
 */
export function useProviderDaySchedule(providerId: string | null, date: Date) {
  const { data, loading, error, refetch } = useQuery(PROVIDER_DAY_SCHEDULE, {
    variables: {
      providerId,
      date: date.toISOString(),
    },
    skip: !providerId,
    fetchPolicy: 'cache-and-network',
  });

  const schedule = data?.providerDaySchedule;

  return {
    workingHours: schedule?.workingHours || [],
    appointments: schedule?.appointments || [],
    blockedTimes: schedule?.blockedTimes || [],
    availableSlots: schedule?.availableSlots || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for finding next available slot
 */
export function useNextAvailableSlot(
  providerId: string | null,
  serviceType: string,
  afterDate?: Date,
  duration?: number
) {
  const { data, loading, error, refetch } = useQuery(NEXT_AVAILABLE_SLOT, {
    variables: {
      providerId,
      serviceType,
      afterDate: (afterDate || new Date()).toISOString(),
      duration,
    },
    skip: !providerId,
    fetchPolicy: 'cache-and-network',
  });

  const nextSlot = data?.nextAvailableSlot;

  return {
    nextSlot,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for provider utilization metrics
 */
export function useProviderUtilization(
  providerId: string | null,
  startDate: Date,
  endDate: Date
) {
  const { data, loading, error, refetch } = useQuery(PROVIDER_UTILIZATION, {
    variables: {
      providerId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
    skip: !providerId,
    fetchPolicy: 'cache-and-network',
  });

  const utilization = data?.providerUtilization || 0;

  return {
    utilization,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for blocking/unblocking provider time
 */
export function useBlockTime() {
  const [blockTimeMutation, { loading: blocking }] = useMutation(BLOCK_PROVIDER_TIME);
  const [unblockTimeMutation, { loading: unblocking }] = useMutation(UNBLOCK_PROVIDER_TIME);

  /**
   * Block a time period
   */
  const blockTime = useCallback(
    async (input: {
      providerId: string;
      startTime: Date;
      endTime: Date;
      type: 'BLOCKED_TIME' | 'VACATION' | 'UNAVAILABLE';
      reason: string;
      isRecurring?: boolean;
      recurrenceRule?: {
        frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
        interval: number;
        count?: number;
        until?: Date;
        byDay?: string[];
      };
    }) => {
      try {
        const result = await blockTimeMutation({
          variables: {
            input: {
              ...input,
              startTime: input.startTime.toISOString(),
              endTime: input.endTime.toISOString(),
              recurrenceRule: input.recurrenceRule
                ? {
                    ...input.recurrenceRule,
                    until: input.recurrenceRule.until?.toISOString(),
                  }
                : null,
            },
          },
        });

        if (result.data?.blockProviderTime?.success) {
          return {
            success: true,
            blockedTime: result.data.blockProviderTime.blockedTime,
          };
        } else {
          return {
            success: false,
            errors: result.data?.blockProviderTime?.errors || ['Failed to block time'],
          };
        }
      } catch (err: any) {
        return {
          success: false,
          errors: [err.message],
        };
      }
    },
    [blockTimeMutation]
  );

  /**
   * Unblock a time period
   */
  const unblockTime = useCallback(
    async (availabilityId: string) => {
      try {
        const result = await unblockTimeMutation({
          variables: { availabilityId },
        });

        if (result.data?.unblockProviderTime?.success) {
          return {
            success: true,
            message: result.data.unblockProviderTime.message,
          };
        } else {
          return {
            success: false,
            errors: result.data?.unblockProviderTime?.errors || ['Failed to unblock time'],
          };
        }
      } catch (err: any) {
        return {
          success: false,
          errors: [err.message],
        };
      }
    },
    [unblockTimeMutation]
  );

  return {
    blockTime,
    unblockTime,
    loading: blocking || unblocking,
    blocking,
    unblocking,
  };
}

/**
 * Hook for multi-provider calendar view
 */
export function useMultiProviderCalendar(
  providerIds: string[],
  startDate: Date,
  endDate: Date
) {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // This would typically make parallel queries for each provider
  // For now, returning placeholder structure

  return {
    providers,
    loading,
    refetch: async () => {
      // Refetch all provider data
    },
  };
}
