/**
 * SubscriptionResolver - Real-time GraphQL Subscriptions
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T127
 *
 * Purpose: Resolve GraphQL subscriptions for real-time updates
 */

import { Args, Resolver, Subscription } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import {
  PubSubService,
  SubscriptionTopic,
  AppointmentUpdatePayload,
  ProviderScheduleUpdatePayload,
  CalendarUpdatePayload,
} from '../services/pubsub.service';

/**
 * Subscription filter context
 */
interface SubscriptionContext {
  appointmentId?: string;
  clientId?: string;
  providerId?: string;
  startDate?: Date;
  endDate?: Date;
}

@Resolver()
export class SubscriptionResolver {
  constructor(
    @Inject(PubSubService)
    private readonly pubSubService: PubSubService,
  ) {}

  /**
   * Subscribe to appointment updates
   * Optional filters: appointmentId, clientId, providerId
   */
  @Subscription('appointmentUpdated', {
    filter: (payload: { appointmentUpdated: AppointmentUpdatePayload }, variables: SubscriptionContext) => {
      const { appointment } = payload.appointmentUpdated;

      // If appointmentId filter is provided, only pass matching appointments
      if (variables.appointmentId && appointment.id !== variables.appointmentId) {
        return false;
      }

      // If clientId filter is provided, only pass appointments for that client
      if (variables.clientId && appointment.clientId !== variables.clientId) {
        return false;
      }

      // If providerId filter is provided, only pass appointments for that provider
      if (variables.providerId && appointment.providerId !== variables.providerId) {
        return false;
      }

      return true;
    },
  })
  appointmentUpdated(
    @Args('appointmentId') appointmentId?: string,
    @Args('clientId') clientId?: string,
    @Args('providerId') providerId?: string,
  ) {
    return this.pubSubService.asyncIterator<{ appointmentUpdated: AppointmentUpdatePayload }>(
      SubscriptionTopic.APPOINTMENT_UPDATED,
    );
  }

  /**
   * Subscribe to provider schedule updates
   * Required filter: providerId
   */
  @Subscription('providerScheduleUpdated', {
    filter: (
      payload: { providerScheduleUpdated: ProviderScheduleUpdatePayload },
      variables: { providerId: string },
    ) => {
      return payload.providerScheduleUpdated.providerId === variables.providerId;
    },
  })
  providerScheduleUpdated(@Args('providerId') providerId: string) {
    return this.pubSubService.asyncIterator<{ providerScheduleUpdated: ProviderScheduleUpdatePayload }>(
      SubscriptionTopic.PROVIDER_SCHEDULE_UPDATED,
    );
  }

  /**
   * Subscribe to calendar updates for a date range
   * Optional filter: providerId
   * Required filters: startDate, endDate
   */
  @Subscription('calendarUpdated', {
    filter: (payload: { calendarUpdated: CalendarUpdatePayload }, variables: SubscriptionContext) => {
      const { affectedDate, providerId } = payload.calendarUpdated;

      // If providerId filter is provided, only pass matching provider updates
      if (variables.providerId && providerId !== variables.providerId) {
        return false;
      }

      // Check if affected date is within the requested range
      if (variables.startDate && variables.endDate) {
        const start = new Date(variables.startDate);
        const end = new Date(variables.endDate);
        const affected = new Date(affectedDate);

        if (affected < start || affected > end) {
          return false;
        }
      }

      return true;
    },
  })
  calendarUpdated(
    @Args('providerId') providerId?: string,
    @Args('startDate') startDate?: string,
    @Args('endDate') endDate?: string,
  ) {
    return this.pubSubService.asyncIterator<{ calendarUpdated: CalendarUpdatePayload }>(
      SubscriptionTopic.CALENDAR_UPDATED,
    );
  }
}
