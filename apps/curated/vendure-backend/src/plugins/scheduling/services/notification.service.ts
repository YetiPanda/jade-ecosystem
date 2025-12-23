/**
 * NotificationService - Appointment Reminders & Notifications
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T126
 *
 * Purpose: Send email and SMS reminders for appointments
 * Integrates with email service and SMS provider (e.g., Twilio)
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/repository';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { Client } from '../entities/client.entity';
import { ServiceProvider } from '../entities/service-provider.entity';

/**
 * Notification type
 */
export enum NotificationType {
  APPOINTMENT_CONFIRMATION = 'APPOINTMENT_CONFIRMATION',
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  APPOINTMENT_CANCELLED = 'APPOINTMENT_CANCELLED',
  APPOINTMENT_RESCHEDULED = 'APPOINTMENT_RESCHEDULED',
  APPOINTMENT_CHECKED_IN = 'APPOINTMENT_CHECKED_IN',
  APPOINTMENT_COMPLETED = 'APPOINTMENT_COMPLETED',
}

/**
 * Notification channel
 */
export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
}

/**
 * Notification result
 */
export interface NotificationResult {
  success: boolean;
  channel: NotificationChannel;
  messageId?: string;
  error?: string;
}

/**
 * Email template data
 */
interface EmailTemplateData {
  clientName: string;
  providerName: string;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: string;
  location?: string;
  confirmationUrl?: string;
  cancelUrl?: string;
  rescheduleUrl?: string;
}

/**
 * SMS template data
 */
interface SMSTemplateData {
  clientName: string;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  location?: string;
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
    @InjectRepository(ServiceProvider)
    private readonly providerRepo: Repository<ServiceProvider>,
  ) {}

  /**
   * Send appointment confirmation
   */
  async sendAppointmentConfirmation(
    appointmentId: string,
  ): Promise<NotificationResult[]> {
    const appointment = await this.appointmentRepo.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return [
        {
          success: false,
          channel: NotificationChannel.EMAIL,
          error: 'Appointment not found',
        },
      ];
    }

    const client = await this.clientRepo.findOne({
      where: { id: appointment.clientId },
    });

    if (!client) {
      return [
        {
          success: false,
          channel: NotificationChannel.EMAIL,
          error: 'Client not found',
        },
      ];
    }

    const provider = await this.providerRepo.findOne({
      where: { id: appointment.providerId },
    });

    const results: NotificationResult[] = [];

    // Send based on client preferences
    const preferredMethod = client.preferences?.communicationMethod || 'EMAIL';

    if (preferredMethod === 'EMAIL' || preferredMethod === 'APP') {
      const emailResult = await this.sendConfirmationEmail(
        appointment,
        client,
        provider,
      );
      results.push(emailResult);
    }

    if (preferredMethod === 'SMS') {
      const smsResult = await this.sendConfirmationSMS(
        appointment,
        client,
        provider,
      );
      results.push(smsResult);
    }

    return results;
  }

  /**
   * Send appointment reminder
   * Called by scheduled job (e.g., 24 hours before appointment)
   */
  async sendAppointmentReminder(
    appointmentId: string,
  ): Promise<NotificationResult[]> {
    const appointment = await this.appointmentRepo.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return [
        {
          success: false,
          channel: NotificationChannel.EMAIL,
          error: 'Appointment not found',
        },
      ];
    }

    // Don't send reminders for cancelled or completed appointments
    if (
      appointment.status === 'CANCELLED' ||
      appointment.status === 'COMPLETED'
    ) {
      return [
        {
          success: false,
          channel: NotificationChannel.EMAIL,
          error: 'Appointment is not active',
        },
      ];
    }

    const client = await this.clientRepo.findOne({
      where: { id: appointment.clientId },
    });

    if (!client) {
      return [
        {
          success: false,
          channel: NotificationChannel.EMAIL,
          error: 'Client not found',
        },
      ];
    }

    const provider = await this.providerRepo.findOne({
      where: { id: appointment.providerId },
    });

    // Check reminder settings
    if (!client.preferences?.reminderSettings?.enabled) {
      return [
        {
          success: false,
          channel: NotificationChannel.EMAIL,
          error: 'Client has reminders disabled',
        },
      ];
    }

    const results: NotificationResult[] = [];
    const reminderMethod = client.preferences.reminderSettings.method;

    if (reminderMethod === 'EMAIL') {
      const emailResult = await this.sendReminderEmail(
        appointment,
        client,
        provider,
      );
      results.push(emailResult);
    } else if (reminderMethod === 'SMS') {
      const smsResult = await this.sendReminderSMS(
        appointment,
        client,
        provider,
      );
      results.push(smsResult);
    }

    return results;
  }

  /**
   * Send cancellation notification
   */
  async sendCancellationNotification(
    appointmentId: string,
  ): Promise<NotificationResult[]> {
    const appointment = await this.appointmentRepo.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return [];
    }

    const client = await this.clientRepo.findOne({
      where: { id: appointment.clientId },
    });

    if (!client) {
      return [];
    }

    const provider = await this.providerRepo.findOne({
      where: { id: appointment.providerId },
    });

    const results: NotificationResult[] = [];

    // Always send cancellation notification via email
    const emailResult = await this.sendCancellationEmail(
      appointment,
      client,
      provider,
    );
    results.push(emailResult);

    return results;
  }

  /**
   * Send reschedule notification
   */
  async sendRescheduleNotification(
    oldAppointment: Appointment,
    newAppointment: Appointment,
  ): Promise<NotificationResult[]> {
    const client = await this.clientRepo.findOne({
      where: { id: newAppointment.clientId },
    });

    if (!client) {
      return [];
    }

    const provider = await this.providerRepo.findOne({
      where: { id: newAppointment.providerId },
    });

    const results: NotificationResult[] = [];

    const emailResult = await this.sendRescheduleEmail(
      oldAppointment,
      newAppointment,
      client,
      provider,
    );
    results.push(emailResult);

    return results;
  }

  /**
   * Find appointments needing reminders
   * Called by cron job
   */
  async findAppointmentsNeedingReminders(
    hoursBeforeAppointment: number = 24,
  ): Promise<Appointment[]> {
    const now = new Date();
    const reminderTime = new Date(now.getTime() + hoursBeforeAppointment * 60 * 60 * 1000);

    // Find appointments in the reminder window that haven't been reminded yet
    const appointments = await this.appointmentRepo
      .createQueryBuilder('appointment')
      .where('appointment.status IN (:...statuses)', {
        statuses: ['SCHEDULED', 'CONFIRMED'],
      })
      .andWhere('appointment.startTime <= :reminderTime', { reminderTime })
      .andWhere('appointment.startTime > :now', { now })
      .andWhere('appointment.reminderSentAt IS NULL')
      .getMany();

    return appointments;
  }

  /**
   * Mark reminder as sent
   */
  async markReminderSent(appointmentId: string): Promise<void> {
    await this.appointmentRepo.update(
      { id: appointmentId },
      { reminderSentAt: new Date() },
    );
  }

  /**
   * Private: Send confirmation email
   */
  private async sendConfirmationEmail(
    appointment: Appointment,
    client: Client,
    provider: ServiceProvider | null,
  ): Promise<NotificationResult> {
    try {
      const templateData: EmailTemplateData = {
        clientName: `${client.firstName} ${client.lastName}`,
        providerName: provider?.name || 'Our Team',
        serviceType: appointment.serviceType,
        appointmentDate: appointment.startTime.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        appointmentTime: appointment.startTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        duration: `${appointment.duration} minutes`,
        confirmationUrl: `${process.env.FRONTEND_URL}/appointments/${appointment.id}`,
        cancelUrl: `${process.env.FRONTEND_URL}/appointments/${appointment.id}/cancel`,
        rescheduleUrl: `${process.env.FRONTEND_URL}/appointments/${appointment.id}/reschedule`,
      };

      // TODO: Integrate with actual email service (SendGrid, AWS SES, etc.)
      // const messageId = await emailService.send({
      //   to: client.email,
      //   subject: `Appointment Confirmation - ${appointment.serviceType}`,
      //   template: 'appointment-confirmation',
      //   data: templateData,
      // });

      console.log('📧 Email would be sent to:', client.email);
      console.log('Template data:', templateData);

      return {
        success: true,
        channel: NotificationChannel.EMAIL,
        messageId: `mock-${Date.now()}`,
      };
    } catch (error) {
      return {
        success: false,
        channel: NotificationChannel.EMAIL,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Private: Send reminder email
   */
  private async sendReminderEmail(
    appointment: Appointment,
    client: Client,
    provider: ServiceProvider | null,
  ): Promise<NotificationResult> {
    try {
      const templateData: EmailTemplateData = {
        clientName: `${client.firstName} ${client.lastName}`,
        providerName: provider?.name || 'Our Team',
        serviceType: appointment.serviceType,
        appointmentDate: appointment.startTime.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        appointmentTime: appointment.startTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        duration: `${appointment.duration} minutes`,
        confirmationUrl: `${process.env.FRONTEND_URL}/appointments/${appointment.id}`,
        rescheduleUrl: `${process.env.FRONTEND_URL}/appointments/${appointment.id}/reschedule`,
      };

      // TODO: Integrate with email service
      console.log('📧 Reminder email would be sent to:', client.email);
      console.log('Template data:', templateData);

      return {
        success: true,
        channel: NotificationChannel.EMAIL,
        messageId: `mock-${Date.now()}`,
      };
    } catch (error) {
      return {
        success: false,
        channel: NotificationChannel.EMAIL,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Private: Send confirmation SMS
   */
  private async sendConfirmationSMS(
    appointment: Appointment,
    client: Client,
    provider: ServiceProvider | null,
  ): Promise<NotificationResult> {
    try {
      const message = `Appointment confirmed! ${appointment.serviceType} with ${provider?.name || 'us'} on ${appointment.startTime.toLocaleDateString()} at ${appointment.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}. Reply CANCEL to cancel.`;

      // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
      // const messageId = await smsService.send({
      //   to: client.phone,
      //   body: message,
      // });

      console.log('📱 SMS would be sent to:', client.phone);
      console.log('Message:', message);

      return {
        success: true,
        channel: NotificationChannel.SMS,
        messageId: `mock-sms-${Date.now()}`,
      };
    } catch (error) {
      return {
        success: false,
        channel: NotificationChannel.SMS,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Private: Send reminder SMS
   */
  private async sendReminderSMS(
    appointment: Appointment,
    client: Client,
    provider: ServiceProvider | null,
  ): Promise<NotificationResult> {
    try {
      const message = `Reminder: Your ${appointment.serviceType} appointment is tomorrow at ${appointment.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} with ${provider?.name || 'us'}. Reply CONFIRM or CANCEL.`;

      // TODO: Integrate with SMS service
      console.log('📱 Reminder SMS would be sent to:', client.phone);
      console.log('Message:', message);

      return {
        success: true,
        channel: NotificationChannel.SMS,
        messageId: `mock-sms-${Date.now()}`,
      };
    } catch (error) {
      return {
        success: false,
        channel: NotificationChannel.SMS,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Private: Send cancellation email
   */
  private async sendCancellationEmail(
    appointment: Appointment,
    client: Client,
    provider: ServiceProvider | null,
  ): Promise<NotificationResult> {
    try {
      const cancellationFee = appointment.cancellationInfo?.cancellationFee || 0;

      const templateData = {
        clientName: `${client.firstName} ${client.lastName}`,
        providerName: provider?.name || 'Our Team',
        serviceType: appointment.serviceType,
        appointmentDate: appointment.startTime.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        appointmentTime: appointment.startTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        cancellationReason: appointment.cancellationInfo?.reason || 'No reason provided',
        cancellationFee: cancellationFee > 0 ? `$${cancellationFee.toFixed(2)}` : 'None',
        rebookUrl: `${process.env.FRONTEND_URL}/book`,
      };

      // TODO: Integrate with email service
      console.log('📧 Cancellation email would be sent to:', client.email);
      console.log('Template data:', templateData);

      return {
        success: true,
        channel: NotificationChannel.EMAIL,
        messageId: `mock-${Date.now()}`,
      };
    } catch (error) {
      return {
        success: false,
        channel: NotificationChannel.EMAIL,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Private: Send reschedule email
   */
  private async sendRescheduleEmail(
    oldAppointment: Appointment,
    newAppointment: Appointment,
    client: Client,
    provider: ServiceProvider | null,
  ): Promise<NotificationResult> {
    try {
      const templateData = {
        clientName: `${client.firstName} ${client.lastName}`,
        providerName: provider?.name || 'Our Team',
        serviceType: newAppointment.serviceType,
        oldDate: oldAppointment.startTime.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        }),
        oldTime: oldAppointment.startTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        newDate: newAppointment.startTime.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        newTime: newAppointment.startTime.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }),
        confirmationUrl: `${process.env.FRONTEND_URL}/appointments/${newAppointment.id}`,
      };

      // TODO: Integrate with email service
      console.log('📧 Reschedule email would be sent to:', client.email);
      console.log('Template data:', templateData);

      return {
        success: true,
        channel: NotificationChannel.EMAIL,
        messageId: `mock-${Date.now()}`,
      };
    } catch (error) {
      return {
        success: false,
        channel: NotificationChannel.EMAIL,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
