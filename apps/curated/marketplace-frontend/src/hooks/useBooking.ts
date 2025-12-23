/**
 * Custom hooks for appointment booking operations
 * Task: T124 - Create custom hooks for booking state
 */

import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';

// Import queries and mutations
const BOOK_APPOINTMENT = gql`
  mutation BookAppointment($input: BookAppointmentInput!) {
    bookAppointment(input: $input) {
      success
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
      errors {
        code
        message
        field
      }
      warnings
    }
  }
`;

const RESCHEDULE_APPOINTMENT = gql`
  mutation RescheduleAppointment($input: RescheduleInput!) {
    rescheduleAppointment(input: $input) {
      success
      appointment {
        id
        appointmentNumber
        startTime
        endTime
        status
        updatedAt
      }
      errors {
        code
        message
        field
      }
      warnings
    }
  }
`;

const CANCEL_APPOINTMENT = gql`
  mutation CancelAppointment(
    $appointmentId: ID!
    $reason: String!
    $cancelledBy: CancelledBy!
  ) {
    cancelAppointment(
      appointmentId: $appointmentId
      reason: $reason
      cancelledBy: $cancelledBy
    ) {
      success
      appointment {
        id
        appointmentNumber
        status
        cancellationInfo {
          cancelledBy
          cancelledAt
          reason
          cancellationFee
          refundIssued
        }
      }
      errors {
        code
        message
        field
      }
      warnings
    }
  }
`;

const CHECK_IN_APPOINTMENT = gql`
  mutation CheckInAppointment($appointmentId: ID!) {
    checkInAppointment(appointmentId: $appointmentId) {
      success
      appointment {
        id
        appointmentNumber
        status
        updatedAt
      }
      errors {
        code
        message
        field
      }
    }
  }
`;

const GET_APPOINTMENT = gql`
  query GetAppointment($id: ID!) {
    appointment(id: $id) {
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
      productsUsed {
        productId
        productName
        amountUsed
        cost
        notes
      }
      treatmentOutcome {
        skinConditionBefore
        skinConditionAfter
        productsRecommended
        homeCarePlan
        clientSatisfactionRating
        photos {
          url
          type
          takenAt
          notes
        }
      }
      paymentStatus
      paymentInfo {
        amount
        depositAmount
        method
        transactionId
        paidAt
      }
      cancellationInfo {
        cancelledBy
        cancelledAt
        reason
        cancellationFee
        refundIssued
      }
      createdAt
      updatedAt
    }
  }
`;

const GET_APPOINTMENTS = gql`
  query GetAppointments($filters: AppointmentFilters, $pagination: PaginationInput) {
    appointments(filters: $filters, pagination: $pagination) {
      edges {
        node {
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
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

/**
 * Hook for managing appointment bookings
 */
export function useBooking() {
  const [bookAppointmentMutation, { loading: booking }] = useMutation(BOOK_APPOINTMENT);
  const [rescheduleAppointmentMutation, { loading: rescheduling }] = useMutation(RESCHEDULE_APPOINTMENT);
  const [cancelAppointmentMutation, { loading: cancelling }] = useMutation(CANCEL_APPOINTMENT);
  const [checkInAppointmentMutation, { loading: checkingIn }] = useMutation(CHECK_IN_APPOINTMENT);

  /**
   * Book a new appointment
   */
  const bookAppointment = useCallback(
    async (input: {
      clientId: string;
      providerId: string;
      serviceType: string;
      startTime: Date;
      endTime: Date;
      notes?: string;
      requestedProducts?: string[];
    }) => {
      try {
        const result = await bookAppointmentMutation({
          variables: { input },
        });

        if (result.data?.bookAppointment?.success) {
          return {
            success: true,
            appointment: result.data.bookAppointment.appointment,
            warnings: result.data.bookAppointment.warnings,
          };
        } else {
          return {
            success: false,
            errors: result.data?.bookAppointment?.errors || [{ message: 'Failed to book appointment' }],
          };
        }
      } catch (err: any) {
        return {
          success: false,
          errors: [{ code: 'UNKNOWN_ERROR', message: err.message }],
        };
      }
    },
    [bookAppointmentMutation]
  );

  /**
   * Reschedule an existing appointment
   */
  const rescheduleAppointment = useCallback(
    async (input: {
      appointmentId: string;
      newStartTime: Date;
      newEndTime: Date;
      reason?: string;
    }) => {
      try {
        const result = await rescheduleAppointmentMutation({
          variables: { input },
        });

        if (result.data?.rescheduleAppointment?.success) {
          return {
            success: true,
            appointment: result.data.rescheduleAppointment.appointment,
            warnings: result.data.rescheduleAppointment.warnings,
          };
        } else {
          return {
            success: false,
            errors: result.data?.rescheduleAppointment?.errors || [{ message: 'Failed to reschedule appointment' }],
          };
        }
      } catch (err: any) {
        return {
          success: false,
          errors: [{ code: 'UNKNOWN_ERROR', message: err.message }],
        };
      }
    },
    [rescheduleAppointmentMutation]
  );

  /**
   * Cancel an appointment
   */
  const cancelAppointment = useCallback(
    async (appointmentId: string, reason: string, cancelledBy: 'CLIENT' | 'PROVIDER' | 'ADMIN') => {
      try {
        const result = await cancelAppointmentMutation({
          variables: { appointmentId, reason, cancelledBy },
        });

        if (result.data?.cancelAppointment?.success) {
          return {
            success: true,
            appointment: result.data.cancelAppointment.appointment,
            warnings: result.data.cancelAppointment.warnings,
          };
        } else {
          return {
            success: false,
            errors: result.data?.cancelAppointment?.errors || [{ message: 'Failed to cancel appointment' }],
          };
        }
      } catch (err: any) {
        return {
          success: false,
          errors: [{ code: 'UNKNOWN_ERROR', message: err.message }],
        };
      }
    },
    [cancelAppointmentMutation]
  );

  /**
   * Check in a client for their appointment
   */
  const checkInAppointment = useCallback(
    async (appointmentId: string) => {
      try {
        const result = await checkInAppointmentMutation({
          variables: { appointmentId },
        });

        if (result.data?.checkInAppointment?.success) {
          return {
            success: true,
            appointment: result.data.checkInAppointment.appointment,
          };
        } else {
          return {
            success: false,
            errors: result.data?.checkInAppointment?.errors || [{ message: 'Failed to check in' }],
          };
        }
      } catch (err: any) {
        return {
          success: false,
          errors: [{ code: 'UNKNOWN_ERROR', message: err.message }],
        };
      }
    },
    [checkInAppointmentMutation]
  );

  return {
    bookAppointment,
    rescheduleAppointment,
    cancelAppointment,
    checkInAppointment,
    loading: booking || rescheduling || cancelling || checkingIn,
    booking,
    rescheduling,
    cancelling,
    checkingIn,
  };
}

/**
 * Hook for fetching a single appointment
 */
export function useAppointment(appointmentId: string | null) {
  const { data, loading, error, refetch } = useQuery(GET_APPOINTMENT, {
    variables: { id: appointmentId },
    skip: !appointmentId,
    fetchPolicy: 'cache-and-network',
  });

  return {
    appointment: data?.appointment,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for fetching appointments with filters
 */
export function useAppointments(
  filters?: {
    clientId?: string;
    providerId?: string;
    locationId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  },
  pagination?: {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
  }
) {
  const { data, loading, error, refetch, fetchMore } = useQuery(GET_APPOINTMENTS, {
    variables: { filters, pagination },
    fetchPolicy: 'cache-and-network',
  });

  const appointments = data?.appointments?.edges?.map((edge: any) => edge.node) || [];
  const pageInfo = data?.appointments?.pageInfo;
  const totalCount = data?.appointments?.totalCount || 0;

  /**
   * Load more appointments
   */
  const loadMore = useCallback(async () => {
    if (!pageInfo?.hasNextPage) return;

    await fetchMore({
      variables: {
        filters,
        pagination: {
          ...pagination,
          after: pageInfo.endCursor,
        },
      },
    });
  }, [fetchMore, filters, pagination, pageInfo]);

  return {
    appointments,
    loading,
    error,
    refetch,
    loadMore,
    hasMore: pageInfo?.hasNextPage || false,
    totalCount,
  };
}
