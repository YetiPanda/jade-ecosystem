/**
 * iCalExportService - Calendar Export to iCal Format
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T129
 *
 * Purpose: Generate iCalendar (.ics) files for appointments
 * Implements RFC 5545 (iCalendar specification)
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { ServiceProvider } from '../entities/service-provider.entity';
import { Client } from '../entities/client.entity';
import { Availability } from '../entities/availability.entity';

/**
 * iCal export options
 */
export interface ICalExportOptions {
  includeReminders?: boolean;
  reminderMinutes?: number;
  timezone?: string;
  method?: 'PUBLISH' | 'REQUEST' | 'REPLY' | 'CANCEL';
}

/**
 * iCal service for exporting appointments to .ics format
 */
@Injectable()
export class ICalExportService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(ServiceProvider)
    private readonly providerRepo: Repository<ServiceProvider>,
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
    @InjectRepository(Availability)
    private readonly availabilityRepo: Repository<Availability>,
  ) {}

  /**
   * Export single appointment to iCal format
   */
  async exportAppointment(
    appointmentId: string,
    options?: ICalExportOptions,
  ): Promise<string> {
    const appointment = await this.appointmentRepo.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    const provider = await this.providerRepo.findOne({
      where: { id: appointment.providerId },
    });

    const client = await this.clientRepo.findOne({
      where: { id: appointment.clientId },
    });

    return this.generateICalEvent(appointment, provider, client, options);
  }

  /**
   * Export multiple appointments to iCal format
   */
  async exportAppointments(
    appointmentIds: string[],
    options?: ICalExportOptions,
  ): Promise<string> {
    const appointments = await this.appointmentRepo
      .createQueryBuilder('appointment')
      .whereInIds(appointmentIds)
      .getMany();

    if (appointments.length === 0) {
      throw new Error('No appointments found');
    }

    // Fetch providers and clients in parallel
    const providerIds = [...new Set(appointments.map((a) => a.providerId))];
    const clientIds = [...new Set(appointments.map((a) => a.clientId))];

    const providers = await this.providerRepo
      .createQueryBuilder('provider')
      .whereInIds(providerIds)
      .getMany();

    const clients = await this.clientRepo
      .createQueryBuilder('client')
      .whereInIds(clientIds)
      .getMany();

    const providerMap = new Map(providers.map((p) => [p.id, p]));
    const clientMap = new Map(clients.map((c) => [c.id, c]));

    // Generate events
    const events = appointments.map((appointment) =>
      this.generateICalEvent(
        appointment,
        providerMap.get(appointment.providerId) || null,
        clientMap.get(appointment.clientId) || null,
        options,
      ),
    );

    return this.wrapInCalendar(events, options);
  }

  /**
   * Export all appointments for a provider within date range
   */
  async exportProviderCalendar(
    providerId: string,
    startDate: Date,
    endDate: Date,
    options?: ICalExportOptions,
  ): Promise<string> {
    const appointments = await this.appointmentRepo
      .createQueryBuilder('appointment')
      .where('appointment.providerId = :providerId', { providerId })
      .andWhere('appointment.startTime >= :startDate', { startDate })
      .andWhere('appointment.startTime <= :endDate', { endDate })
      .andWhere('appointment.status NOT IN (:...statuses)', {
        statuses: ['CANCELLED', 'NO_SHOW'],
      })
      .orderBy('appointment.startTime', 'ASC')
      .getMany();

    const provider = await this.providerRepo.findOne({ where: { id: providerId } });

    if (!provider) {
      throw new Error('Provider not found');
    }

    // Fetch clients for appointments
    const clientIds = [...new Set(appointments.map((a) => a.clientId))];
    const clients = await this.clientRepo
      .createQueryBuilder('client')
      .whereInIds(clientIds)
      .getMany();

    const clientMap = new Map(clients.map((c) => [c.id, c]));

    // Generate events
    const events = appointments.map((appointment) =>
      this.generateICalEvent(
        appointment,
        provider,
        clientMap.get(appointment.clientId) || null,
        options,
      ),
    );

    // Include blocked time periods
    const blockedTimes = await this.availabilityRepo
      .createQueryBuilder('availability')
      .where('availability.providerId = :providerId', { providerId })
      .andWhere('availability.type IN (:...types)', {
        types: ['BLOCKED_TIME', 'VACATION', 'UNAVAILABLE'],
      })
      .andWhere('availability.startTime >= :startDate', { startDate })
      .andWhere('availability.startTime <= :endDate', { endDate })
      .getMany();

    blockedTimes.forEach((blocked) => {
      events.push(this.generateBlockedTimeEvent(blocked, provider));
    });

    return this.wrapInCalendar(events, {
      ...options,
      method: 'PUBLISH',
    });
  }

  /**
   * Generate iCal event for a single appointment
   */
  private generateICalEvent(
    appointment: Appointment,
    provider: ServiceProvider | null,
    client: Client | null,
    options?: ICalExportOptions,
  ): string {
    const tz = options?.timezone || appointment.timezone || 'America/Los_Angeles';
    const reminderMinutes = options?.reminderMinutes || 60;

    // Format dates in iCal format (YYYYMMDDTHHMMSS)
    const startDate = this.formatICalDate(appointment.startTime, tz);
    const endDate = this.formatICalDate(appointment.endTime, tz);
    const createdDate = this.formatICalDate(appointment.createdAt, 'UTC');
    const modifiedDate = this.formatICalDate(appointment.updatedAt, 'UTC');

    // Generate unique ID
    const uid = `appointment-${appointment.id}@spa-marketplace.com`;

    // Summary and description
    const summary = `${appointment.serviceType} - ${client ? `${client.firstName} ${client.lastName}` : 'Client'}`;
    const description = [
      `Service: ${appointment.serviceType}`,
      `Duration: ${appointment.duration} minutes`,
      provider ? `Provider: ${provider.name}` : '',
      appointment.notes ? `Notes: ${appointment.notes}` : '',
      `Status: ${appointment.status}`,
      `Appointment #: ${appointment.appointmentNumber}`,
    ]
      .filter(Boolean)
      .join('\\n');

    // Location
    const location = provider?.location || 'Spa Location';

    // Organizer
    const organizer = provider
      ? `ORGANIZER;CN="${provider.name}":mailto:${provider.email || 'noreply@spa.com'}`
      : '';

    // Attendee
    const attendee = client
      ? `ATTENDEE;CN="${client.firstName} ${client.lastName}";RSVP=TRUE:mailto:${client.email}`
      : '';

    // Alarm/Reminder
    const alarm = options?.includeReminders
      ? [
          'BEGIN:VALARM',
          'ACTION:DISPLAY',
          `DESCRIPTION:Reminder: ${summary}`,
          `TRIGGER:-PT${reminderMinutes}M`,
          'END:VALARM',
        ].join('\r\n')
      : '';

    // Status
    const status =
      appointment.status === 'CONFIRMED'
        ? 'STATUS:CONFIRMED'
        : appointment.status === 'CANCELLED'
          ? 'STATUS:CANCELLED'
          : 'STATUS:TENTATIVE';

    const event = [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${createdDate}`,
      `DTSTART;TZID=${tz}:${startDate}`,
      `DTEND;TZID=${tz}:${endDate}`,
      `CREATED:${createdDate}`,
      `LAST-MODIFIED:${modifiedDate}`,
      `SUMMARY:${this.escapeText(summary)}`,
      `DESCRIPTION:${this.escapeText(description)}`,
      `LOCATION:${this.escapeText(location)}`,
      organizer,
      attendee,
      status,
      'TRANSP:OPAQUE',
      `SEQUENCE:${appointment.updatedAt ? 1 : 0}`,
      alarm,
      'END:VEVENT',
    ]
      .filter(Boolean)
      .join('\r\n');

    return event;
  }

  /**
   * Generate iCal event for blocked time
   */
  private generateBlockedTimeEvent(
    availability: Availability,
    provider: ServiceProvider | null,
  ): string {
    const tz = availability.timezone || 'America/Los_Angeles';
    const startDate = this.formatICalDate(availability.startTime, tz);
    const endDate = this.formatICalDate(availability.endTime, tz);
    const createdDate = this.formatICalDate(availability.createdAt, 'UTC');

    const uid = `blocked-${availability.id}@spa-marketplace.com`;
    const summary = `${availability.type} - ${provider?.name || 'Provider'}`;
    const description = availability.reason || 'Blocked time period';

    const event = [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${createdDate}`,
      `DTSTART;TZID=${tz}:${startDate}`,
      `DTEND;TZID=${tz}:${endDate}`,
      `SUMMARY:${this.escapeText(summary)}`,
      `DESCRIPTION:${this.escapeText(description)}`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'CLASS:PRIVATE',
      'END:VEVENT',
    ].join('\r\n');

    return event;
  }

  /**
   * Wrap events in full iCalendar structure
   */
  private wrapInCalendar(events: string[], options?: ICalExportOptions): string {
    const method = options?.method || 'PUBLISH';
    const tz = options?.timezone || 'America/Los_Angeles';

    const calendar = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Spa Marketplace//Appointment Calendar//EN',
      'CALSCALE:GREGORIAN',
      `METHOD:${method}`,
      `X-WR-CALNAME:Spa Appointments`,
      `X-WR-TIMEZONE:${tz}`,
      ...events,
      'END:VCALENDAR',
    ].join('\r\n');

    return calendar;
  }

  /**
   * Format date to iCal format (YYYYMMDDTHHMMSS)
   */
  private formatICalDate(date: Date, timezone: string): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    if (timezone === 'UTC') {
      return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    }

    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  }

  /**
   * Escape special characters in iCal text
   */
  private escapeText(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '');
  }
}
