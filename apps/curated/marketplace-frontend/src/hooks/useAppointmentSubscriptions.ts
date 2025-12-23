/**
 * Custom hooks for real-time appointment subscriptions
 * Task: T127 - Real-time subscription for appointment updates
 */

import { useEffect, useCallback } from 'react';
import { useSubscription } from '@apollo/client';
import gql from 'graphql-tag';

// Subscription queries
const APPOINTMENT_UPDATED = gql`
  subscription AppointmentUpdated(
    $appointmentId: ID
    $clientId: ID
    $providerId: ID
  ) {
    appointmentUpdated(
      appointmentId: $appointmentId
      clientId: $clientId
      providerId: $providerId
    ) {
      eventType
      appointment {
        id
        appointmentNumber
        clientId
        providerId
        serviceType
        duration
        startTime
        endTime
        timezone
        status
        notes
        requestedProducts
        paymentStatus
        createdAt
        updatedAt
      }
      previousStatus
      timestamp
    }
  }
`;

const PROVIDER_SCHEDULE_UPDATED = gql`
  subscription ProviderScheduleUpdated($providerId: ID!) {
    providerScheduleUpdated(providerId: $providerId) {
      eventType
      providerId
      affectedSlots {
        startTime
        endTime
        duration
        capacity
        bookedCount
        isAvailable
        slotId
      }
      blockedTime {
        id
        providerId
        type
        startTime
        endTime
        reason
        isRecurring
      }
      timestamp
    }
  }
`;

const CALENDAR_UPDATED = gql`
  subscription CalendarUpdated(
    $providerId: ID
    $startDate: DateTime!
    $endDate: DateTime!
  ) {
    calendarUpdated(
      providerId: $providerId
      startDate: $startDate
      endDate: $endDate
    ) {
      eventType
      appointments {
        id
        appointmentNumber
        clientId
        providerId
        serviceType
        duration
        startTime
        endTime
        timezone
        status
        notes
        paymentStatus
        createdAt
      }
      affectedDate
      providerId
      timestamp
    }
  }
`;

/**
 * Hook for subscribing to appointment updates
 * Can filter by appointmentId, clientId, or providerId
 */
export function useAppointmentUpdates(
  options?: {
    appointmentId?: string;
    clientId?: string;
    providerId?: string;
    onUpdate?: (data: any) => void;
  }
) {
  const { data, loading, error } = useSubscription(APPOINTMENT_UPDATED, {
    variables: {
      appointmentId: options?.appointmentId,
      clientId: options?.clientId,
      providerId: options?.providerId,
    },
    skip: !options?.appointmentId && !options?.clientId && !options?.providerId,
  });

  // Call callback when update is received
  useEffect(() => {
    if (data?.appointmentUpdated && options?.onUpdate) {
      options.onUpdate(data.appointmentUpdated);
    }
  }, [data, options]);

  return {
    update: data?.appointmentUpdated,
    loading,
    error,
  };
}

/**
 * Hook for subscribing to provider schedule changes
 */
export function useProviderScheduleUpdates(
  providerId: string | null,
  onUpdate?: (data: any) => void
) {
  const { data, loading, error } = useSubscription(PROVIDER_SCHEDULE_UPDATED, {
    variables: { providerId },
    skip: !providerId,
  });

  // Call callback when update is received
  useEffect(() => {
    if (data?.providerScheduleUpdated && onUpdate) {
      onUpdate(data.providerScheduleUpdated);
    }
  }, [data, onUpdate]);

  return {
    update: data?.providerScheduleUpdated,
    loading,
    error,
  };
}

/**
 * Hook for subscribing to calendar updates for a date range
 */
export function useCalendarUpdates(
  startDate: Date,
  endDate: Date,
  options?: {
    providerId?: string;
    onUpdate?: (data: any) => void;
  }
) {
  const { data, loading, error } = useSubscription(CALENDAR_UPDATED, {
    variables: {
      providerId: options?.providerId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
  });

  // Call callback when update is received
  useEffect(() => {
    if (data?.calendarUpdated && options?.onUpdate) {
      options.onUpdate(data.calendarUpdated);
    }
  }, [data, options]);

  return {
    update: data?.calendarUpdated,
    loading,
    error,
  };
}

/**
 * Hook for handling real-time notifications with toast messages
 */
export function useAppointmentNotifications(
  providerId?: string,
  clientId?: string
) {
  const handleAppointmentUpdate = useCallback((update: any) => {
    const { eventType, appointment } = update;

    // Show toast notification based on event type
    const messages = {
      CREATED: `New appointment scheduled for ${new Date(appointment.startTime).toLocaleString()}`,
      UPDATED: `Appointment ${appointment.appointmentNumber} updated`,
      STATUS_CHANGED: `Appointment ${appointment.appointmentNumber} status changed to ${appointment.status}`,
      RESCHEDULED: `Appointment ${appointment.appointmentNumber} rescheduled`,
      CANCELLED: `Appointment ${appointment.appointmentNumber} cancelled`,
      CHECKED_IN: `Client checked in for appointment ${appointment.appointmentNumber}`,
      COMPLETED: `Appointment ${appointment.appointmentNumber} completed`,
    };

    const message = messages[eventType as keyof typeof messages] || 'Appointment updated';

    // TODO: Show toast notification
    console.log(`📬 ${message}`, appointment);

    // Play notification sound
    // TODO: Add audio notification
    // new Audio('/notification.mp3').play();
  }, []);

  // Subscribe to updates
  useAppointmentUpdates({
    providerId,
    clientId,
    onUpdate: handleAppointmentUpdate,
  });
}

/**
 * Hook for auto-refreshing calendar when updates occur
 */
export function useCalendarAutoRefresh(
  startDate: Date,
  endDate: Date,
  providerId: string | null,
  refetchCallback: () => void
) {
  const handleCalendarUpdate = useCallback((update: any) => {
    console.log('📅 Calendar update received:', update.eventType);

    // Refetch calendar data
    refetchCallback();
  }, [refetchCallback]);

  useCalendarUpdates(startDate, endDate, {
    providerId: providerId || undefined,
    onUpdate: handleCalendarUpdate,
  });
}
