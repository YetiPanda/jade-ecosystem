/**
 * AppointmentResolver - Appointment Booking & Management
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T112, T113
 *
 * Purpose: GraphQL resolvers for booking, rescheduling, and canceling appointments
 */

import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { BookingService } from '../services/booking.service';
import { BookingErrorCode } from '../services/booking.service';

/**
 * Mutation Arguments
 */
interface BookAppointmentArgs {
  input: {
    clientId: string;
    providerId: string;
    serviceType: string;
    startTime: Date;
    endTime: Date;
    notes?: string;
    requestedProducts?: string[];
  };
}

interface RescheduleAppointmentArgs {
  input: {
    appointmentId: string;
    newStartTime: Date;
    newEndTime: Date;
    reason?: string;
  };
}

interface CancelAppointmentArgs {
  appointmentId: string;
  reason: string;
  cancelledBy: 'CLIENT' | 'PROVIDER' | 'ADMIN';
}

interface CheckInAppointmentArgs {
  appointmentId: string;
}

interface GetAppointmentArgs {
  id: string;
}

interface GetAppointmentsArgs {
  filters?: {
    clientId?: string;
    providerId?: string;
    locationId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  };
  pagination?: {
    first?: number;
    after?: string;
    last?: number;
    before?: string;
  };
}

/**
 * GraphQL Return Types
 */
interface AppointmentResult {
  success: boolean;
  appointment?: {
    id: string;
    appointmentNumber: string;
    clientId: string;
    providerId: string;
    serviceType: string;
    duration: number;
    startTime: Date;
    endTime: Date;
    timezone: string;
    status: string;
    notes: string;
    requestedProducts: string[];
    productsUsed: Array<{
      productId: string;
      productName: string;
      amountUsed?: string;
      cost?: number;
      notes?: string;
    }>;
    paymentStatus: string;
    createdAt: Date;
    updatedAt: Date;
  };
  errors?: Array<{
    code: string;
    message: string;
    field?: string;
  }>;
  warnings?: string[];
}

@Resolver()
export class AppointmentResolver {
  constructor(private readonly bookingService: BookingService) {}

  /**
   * Mutation: bookAppointment
   *
   * Book a new appointment with full validation and conflict detection
   *
   * Example mutation:
   * ```graphql
   * mutation {
   *   bookAppointment(input: {
   *     clientId: "client-123"
   *     providerId: "provider-456"
   *     serviceType: "FACIAL"
   *     startTime: "2025-10-25T10:00:00Z"
   *     endTime: "2025-10-25T11:00:00Z"
   *     notes: "First time client"
   *     requestedProducts: ["product-001", "product-002"]
   *   }) {
   *     success
   *     appointment {
   *       id
   *       appointmentNumber
   *       startTime
   *       endTime
   *       status
   *     }
   *     errors {
   *       code
   *       message
   *       field
   *     }
   *     warnings
   *   }
   * }
   * ```
   */
  @Mutation('bookAppointment')
  async bookAppointment(
    @Args() args: BookAppointmentArgs,
  ): Promise<AppointmentResult> {
    const result = await this.bookingService.bookAppointment({
      clientId: args.input.clientId,
      providerId: args.input.providerId,
      serviceType: args.input.serviceType,
      startTime: args.input.startTime,
      endTime: args.input.endTime,
      notes: args.input.notes,
      requestedProducts: args.input.requestedProducts,
    });

    if (!result.success) {
      return {
        success: false,
        errors: result.errors?.map((err) => ({
          code: err.code,
          message: err.message,
          field: err.field,
        })),
      };
    }

    return {
      success: true,
      appointment: result.appointment
        ? {
            id: result.appointment.id,
            appointmentNumber: result.appointment.appointmentNumber,
            clientId: result.appointment.clientId,
            providerId: result.appointment.providerId,
            serviceType: result.appointment.serviceType,
            duration: result.appointment.duration,
            startTime: result.appointment.startTime,
            endTime: result.appointment.endTime,
            timezone: result.appointment.timezone,
            status: result.appointment.status,
            notes: result.appointment.notes,
            requestedProducts: result.appointment.requestedProducts,
            productsUsed: result.appointment.productsUsed,
            paymentStatus: result.appointment.paymentStatus,
            createdAt: result.appointment.createdAt,
            updatedAt: result.appointment.updatedAt,
          }
        : undefined,
      warnings: result.warnings,
    };
  }

  /**
   * Mutation: rescheduleAppointment
   *
   * Reschedule an existing appointment to a new time
   *
   * Example mutation:
   * ```graphql
   * mutation {
   *   rescheduleAppointment(input: {
   *     appointmentId: "apt-123"
   *     newStartTime: "2025-10-26T14:00:00Z"
   *     newEndTime: "2025-10-26T15:00:00Z"
   *     reason: "Client requested different time"
   *   }) {
   *     success
   *     appointment {
   *       id
   *       appointmentNumber
   *       startTime
   *       endTime
   *       status
   *     }
   *     errors {
   *       code
   *       message
   *     }
   *     warnings
   *   }
   * }
   * ```
   */
  @Mutation('rescheduleAppointment')
  async rescheduleAppointment(
    @Args() args: RescheduleAppointmentArgs,
  ): Promise<AppointmentResult> {
    const result = await this.bookingService.rescheduleAppointment({
      appointmentId: args.input.appointmentId,
      newStartTime: args.input.newStartTime,
      newEndTime: args.input.newEndTime,
      reason: args.input.reason,
    });

    if (!result.success) {
      return {
        success: false,
        errors: result.errors?.map((err) => ({
          code: err.code,
          message: err.message,
          field: err.field,
        })),
      };
    }

    return {
      success: true,
      appointment: result.appointment
        ? {
            id: result.appointment.id,
            appointmentNumber: result.appointment.appointmentNumber,
            clientId: result.appointment.clientId,
            providerId: result.appointment.providerId,
            serviceType: result.appointment.serviceType,
            duration: result.appointment.duration,
            startTime: result.appointment.startTime,
            endTime: result.appointment.endTime,
            timezone: result.appointment.timezone,
            status: result.appointment.status,
            notes: result.appointment.notes,
            requestedProducts: result.appointment.requestedProducts,
            productsUsed: result.appointment.productsUsed,
            paymentStatus: result.appointment.paymentStatus,
            createdAt: result.appointment.createdAt,
            updatedAt: result.appointment.updatedAt,
          }
        : undefined,
      warnings: result.warnings,
    };
  }

  /**
   * Mutation: cancelAppointment
   *
   * Cancel an existing appointment with reason
   *
   * Example mutation:
   * ```graphql
   * mutation {
   *   cancelAppointment(
   *     appointmentId: "apt-123"
   *     reason: "Client requested cancellation"
   *     cancelledBy: CLIENT
   *   ) {
   *     success
   *     appointment {
   *       id
   *       status
   *       cancellationInfo {
   *         cancelledBy
   *         cancelledAt
   *         reason
   *         cancellationFee
   *         refundIssued
   *       }
   *     }
   *     warnings
   *   }
   * }
   * ```
   */
  @Mutation('cancelAppointment')
  async cancelAppointment(
    @Args() args: CancelAppointmentArgs,
  ): Promise<AppointmentResult> {
    const result = await this.bookingService.cancelAppointment({
      appointmentId: args.appointmentId,
      reason: args.reason,
      cancelledBy: args.cancelledBy,
    });

    if (!result.success) {
      return {
        success: false,
        errors: result.errors?.map((err) => ({
          code: err.code,
          message: err.message,
          field: err.field,
        })),
      };
    }

    return {
      success: true,
      appointment: result.appointment
        ? {
            id: result.appointment.id,
            appointmentNumber: result.appointment.appointmentNumber,
            clientId: result.appointment.clientId,
            providerId: result.appointment.providerId,
            serviceType: result.appointment.serviceType,
            duration: result.appointment.duration,
            startTime: result.appointment.startTime,
            endTime: result.appointment.endTime,
            timezone: result.appointment.timezone,
            status: result.appointment.status,
            notes: result.appointment.notes,
            requestedProducts: result.appointment.requestedProducts,
            productsUsed: result.appointment.productsUsed,
            paymentStatus: result.appointment.paymentStatus,
            createdAt: result.appointment.createdAt,
            updatedAt: result.appointment.updatedAt,
          }
        : undefined,
      warnings: result.warnings,
    };
  }

  /**
   * Mutation: checkInAppointment
   *
   * Mark appointment as checked in when client arrives
   *
   * Example mutation:
   * ```graphql
   * mutation {
   *   checkInAppointment(appointmentId: "apt-123") {
   *     success
   *     appointment {
   *       id
   *       status
   *     }
   *   }
   * }
   * ```
   */
  @Mutation('checkInAppointment')
  async checkInAppointment(
    @Args() args: CheckInAppointmentArgs,
  ): Promise<AppointmentResult> {
    const result = await this.bookingService.checkInAppointment(
      args.appointmentId,
    );

    if (!result.success) {
      return {
        success: false,
        errors: result.errors?.map((err) => ({
          code: err.code,
          message: err.message,
          field: err.field,
        })),
      };
    }

    return {
      success: true,
      appointment: result.appointment
        ? {
            id: result.appointment.id,
            appointmentNumber: result.appointment.appointmentNumber,
            clientId: result.appointment.clientId,
            providerId: result.appointment.providerId,
            serviceType: result.appointment.serviceType,
            duration: result.appointment.duration,
            startTime: result.appointment.startTime,
            endTime: result.appointment.endTime,
            timezone: result.appointment.timezone,
            status: result.appointment.status,
            notes: result.appointment.notes,
            requestedProducts: result.appointment.requestedProducts,
            productsUsed: result.appointment.productsUsed,
            paymentStatus: result.appointment.paymentStatus,
            createdAt: result.appointment.createdAt,
            updatedAt: result.appointment.updatedAt,
          }
        : undefined,
    };
  }

  /**
   * Query: appointment
   *
   * Get single appointment by ID
   *
   * Example query:
   * ```graphql
   * query {
   *   appointment(id: "apt-123") {
   *     id
   *     appointmentNumber
   *     clientId
   *     providerId
   *     serviceType
   *     startTime
   *     endTime
   *     status
   *     notes
   *   }
   * }
   * ```
   */
  @Query('appointment')
  async appointment(@Args() args: GetAppointmentArgs): Promise<{
    id: string;
    appointmentNumber: string;
    clientId: string;
    providerId: string;
    serviceType: string;
    duration: number;
    startTime: Date;
    endTime: Date;
    timezone: string;
    status: string;
    notes: string;
    requestedProducts: string[];
    productsUsed: Array<{
      productId: string;
      productName: string;
      amountUsed?: string;
      cost?: number;
      notes?: string;
    }>;
    paymentStatus: string;
    createdAt: Date;
    updatedAt: Date;
  } | null> {
    const appointment = await this.bookingService.getAppointment(args.id);

    if (!appointment) {
      return null;
    }

    return {
      id: appointment.id,
      appointmentNumber: appointment.appointmentNumber,
      clientId: appointment.clientId,
      providerId: appointment.providerId,
      serviceType: appointment.serviceType,
      duration: appointment.duration,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      timezone: appointment.timezone,
      status: appointment.status,
      notes: appointment.notes,
      requestedProducts: appointment.requestedProducts,
      productsUsed: appointment.productsUsed,
      paymentStatus: appointment.paymentStatus,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    };
  }

  /**
   * Query: appointments
   *
   * Get list of appointments with filters and pagination
   *
   * Example query:
   * ```graphql
   * query {
   *   appointments(
   *     filters: {
   *       providerId: "provider-123"
   *       status: SCHEDULED
   *       startDate: "2025-10-20T00:00:00Z"
   *       endDate: "2025-10-27T23:59:59Z"
   *     }
   *     pagination: {
   *       first: 20
   *     }
   *   ) {
   *     edges {
   *       node {
   *         id
   *         appointmentNumber
   *         startTime
   *         endTime
   *         status
   *       }
   *       cursor
   *     }
   *     pageInfo {
   *       hasNextPage
   *       hasPreviousPage
   *       startCursor
   *       endCursor
   *     }
   *     totalCount
   *   }
   * }
   * ```
   */
  @Query('appointments')
  async appointments(@Args() args: GetAppointmentsArgs): Promise<{
    edges: Array<{
      node: {
        id: string;
        appointmentNumber: string;
        clientId: string;
        providerId: string;
        serviceType: string;
        startTime: Date;
        endTime: Date;
        status: string;
      };
      cursor: string;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string;
      endCursor?: string;
    };
    totalCount: number;
  }> {
    // Get appointments based on filters
    let appointments;

    if (args.filters?.clientId) {
      appointments = await this.bookingService.getClientAppointments(
        args.filters.clientId,
        {
          status: args.filters.status ? [args.filters.status] : undefined,
          startDate: args.filters.startDate,
          endDate: args.filters.endDate,
        },
      );
    } else if (args.filters?.providerId) {
      appointments = await this.bookingService.getProviderAppointments(
        args.filters.providerId,
        {
          status: args.filters.status ? [args.filters.status] : undefined,
          startDate: args.filters.startDate,
          endDate: args.filters.endDate,
        },
      );
    } else {
      // Default to empty array if no filters provided
      appointments = [];
    }

    // Simple pagination (in production, use proper cursor-based pagination)
    const limit = args.pagination?.first || 20;
    const paginatedAppointments = appointments.slice(0, limit);

    const edges = paginatedAppointments.map((apt, index) => ({
      node: {
        id: apt.id,
        appointmentNumber: apt.appointmentNumber,
        clientId: apt.clientId,
        providerId: apt.providerId,
        serviceType: apt.serviceType,
        startTime: apt.startTime,
        endTime: apt.endTime,
        status: apt.status,
      },
      cursor: Buffer.from(`${index}`).toString('base64'),
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage: appointments.length > limit,
        hasPreviousPage: false,
        startCursor: edges.length > 0 ? edges[0].cursor : undefined,
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : undefined,
      },
      totalCount: appointments.length,
    };
  }
}
