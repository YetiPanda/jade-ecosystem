/**
 * PubSubService - Real-time Event Broadcasting
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T127
 *
 * Purpose: Manage GraphQL subscriptions for real-time updates
 * Uses in-memory PubSub for development (switch to Redis PubSub for production)
 */

import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { Appointment } from '../entities/appointment.entity';
import { AvailableSlot } from '../services/calendar.service';
import { BlockedTime } from '../entities/availability.entity';

/**
 * Subscription topics
 */
export enum SubscriptionTopic {
  APPOINTMENT_UPDATED = 'APPOINTMENT_UPDATED',
  PROVIDER_SCHEDULE_UPDATED = 'PROVIDER_SCHEDULE_UPDATED',
  CALENDAR_UPDATED = 'CALENDAR_UPDATED',
}

/**
 * Event types for appointments
 */
export enum AppointmentEventType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  STATUS_CHANGED = 'STATUS_CHANGED',
  RESCHEDULED = 'RESCHEDULED',
  CANCELLED = 'CANCELLED',
  CHECKED_IN = 'CHECKED_IN',
  COMPLETED = 'COMPLETED',
}

/**
 * Event types for schedule
 */
export enum ScheduleEventType {
  TIME_BLOCKED = 'TIME_BLOCKED',
  TIME_UNBLOCKED = 'TIME_UNBLOCKED',
  APPOINTMENT_ADDED = 'APPOINTMENT_ADDED',
  APPOINTMENT_REMOVED = 'APPOINTMENT_REMOVED',
  SCHEDULE_CHANGED = 'SCHEDULE_CHANGED',
}

/**
 * Event types for calendar
 */
export enum CalendarEventType {
  APPOINTMENT_CREATED = 'APPOINTMENT_CREATED',
  APPOINTMENT_UPDATED = 'APPOINTMENT_UPDATED',
  APPOINTMENT_CANCELLED = 'APPOINTMENT_CANCELLED',
  BULK_UPDATE = 'BULK_UPDATE',
}

/**
 * Appointment update payload
 */
export interface AppointmentUpdatePayload {
  eventType: AppointmentEventType;
  appointment: Appointment;
  previousStatus?: string;
  timestamp: Date;
}

/**
 * Provider schedule update payload
 */
export interface ProviderScheduleUpdatePayload {
  eventType: ScheduleEventType;
  providerId: string;
  affectedSlots: AvailableSlot[];
  blockedTime?: BlockedTime;
  timestamp: Date;
}

/**
 * Calendar update payload
 */
export interface CalendarUpdatePayload {
  eventType: CalendarEventType;
  appointments: Appointment[];
  affectedDate: Date;
  providerId?: string;
  timestamp: Date;
}

@Injectable()
export class PubSubService implements OnModuleDestroy {
  private pubsub: PubSub;

  constructor() {
    // In-memory PubSub for development
    // TODO: For production, use Redis PubSub for horizontal scaling
    // import { RedisPubSub } from 'graphql-redis-subscriptions';
    // this.pubsub = new RedisPubSub({
    //   connection: {
    //     host: process.env.REDIS_HOST || 'localhost',
    //     port: parseInt(process.env.REDIS_PORT || '6379'),
    //   },
    // });
    this.pubsub = new PubSub();
  }

  async onModuleDestroy() {
    // Clean up subscriptions
    await this.pubsub.close?.();
  }

  /**
   * Get the underlying PubSub instance
   * Used by subscription resolvers
   */
  getPubSub(): PubSub {
    return this.pubsub;
  }

  /**
   * Publish appointment update event
   */
  async publishAppointmentUpdate(
    appointment: Appointment,
    eventType: AppointmentEventType,
    previousStatus?: string,
  ): Promise<void> {
    const payload: AppointmentUpdatePayload = {
      eventType,
      appointment,
      previousStatus,
      timestamp: new Date(),
    };

    await this.pubsub.publish(SubscriptionTopic.APPOINTMENT_UPDATED, {
      appointmentUpdated: payload,
    });

    console.log(`📡 Published appointment update: ${eventType} for ${appointment.id}`);
  }

  /**
   * Publish provider schedule update event
   */
  async publishProviderScheduleUpdate(
    providerId: string,
    eventType: ScheduleEventType,
    affectedSlots: AvailableSlot[],
    blockedTime?: BlockedTime,
  ): Promise<void> {
    const payload: ProviderScheduleUpdatePayload = {
      eventType,
      providerId,
      affectedSlots,
      blockedTime,
      timestamp: new Date(),
    };

    await this.pubsub.publish(SubscriptionTopic.PROVIDER_SCHEDULE_UPDATED, {
      providerScheduleUpdated: payload,
    });

    console.log(`📡 Published schedule update: ${eventType} for provider ${providerId}`);
  }

  /**
   * Publish calendar update event
   */
  async publishCalendarUpdate(
    appointments: Appointment[],
    eventType: CalendarEventType,
    affectedDate: Date,
    providerId?: string,
  ): Promise<void> {
    const payload: CalendarUpdatePayload = {
      eventType,
      appointments,
      affectedDate,
      providerId,
      timestamp: new Date(),
    };

    await this.pubsub.publish(SubscriptionTopic.CALENDAR_UPDATED, {
      calendarUpdated: payload,
    });

    console.log(
      `📡 Published calendar update: ${eventType} for date ${affectedDate.toISOString().split('T')[0]}`,
    );
  }

  /**
   * Create async iterator for subscriptions
   * Used by subscription resolvers to filter events
   */
  asyncIterator<T>(triggers: string | string[]): AsyncIterator<T> {
    return this.pubsub.asyncIterator(triggers);
  }
}
