/**
 * Appointment Entity
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T102
 *
 * Purpose: Represents a scheduled appointment between a client and provider
 * Tracks booking details, status, and treatment outcome
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ServiceProvider } from './service-provider.entity';
import { Client } from './client.entity';

/**
 * Product used during treatment
 */
export interface ProductUsed {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number; // Cents
  notes?: string;
}

/**
 * Treatment outcome tracking
 */
export interface TreatmentOutcome {
  skinConditionBefore: string;
  skinConditionAfter: string;
  productsRecommended: string[];
  homeCarePlan: string;
  nextRecommendedTreatment?: string;
  nextRecommendedDate?: string; // ISO date
  clientSatisfactionRating?: number; // 1-5
  clientFeedback?: string;
  photos: TreatmentPhoto[];
}

/**
 * Before/after photos
 */
export interface TreatmentPhoto {
  url: string; // S3 URL
  caption: string;
  takenAt: string; // ISO timestamp
  type: 'BEFORE' | 'AFTER' | 'DURING';
}

/**
 * Payment information
 */
export interface PaymentInfo {
  amount: number; // Cents
  method: 'CARD' | 'CASH' | 'MEMBERSHIP_CREDIT' | 'GIFT_CARD';
  transactionId?: string;
  paidAt?: string; // ISO timestamp
  refundedAt?: string; // ISO timestamp
  refundAmount?: number; // Cents
}

/**
 * Cancellation details
 */
export interface CancellationInfo {
  cancelledBy: 'CLIENT' | 'PROVIDER' | 'ADMIN';
  cancelledByUserId: string;
  cancelledByName: string;
  cancelledAt: string; // ISO timestamp
  reason: string;
  cancellationFee?: number; // Cents
  refundIssued: boolean;
}

/**
 * Reschedule history
 */
export interface RescheduleRecord {
  rescheduledAt: string; // ISO timestamp
  rescheduledBy: string; // User ID
  previousStartTime: string; // ISO timestamp
  previousEndTime: string; // ISO timestamp
  newStartTime: string; // ISO timestamp
  newEndTime: string; // ISO timestamp
  reason?: string;
}

@Entity('appointment')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Appointment number (user-friendly identifier)
  @Column({ type: 'varchar', length: 20, unique: true })
  @Index()
  appointmentNumber: string; // e.g., "APT-000123"

  // Participants
  @Column({ type: 'uuid' })
  @Index()
  clientId: string;

  @Column({ type: 'varchar', length: 200 })
  clientName: string;

  @Column({ type: 'uuid' })
  @Index()
  providerId: string;

  @Column({ type: 'varchar', length: 200 })
  providerName: string;

  // Service details
  @Column({ type: 'varchar', length: 100 })
  serviceType: string; // 'FACIAL', 'MASSAGE', etc.

  @Column({ type: 'varchar', length: 200 })
  serviceName: string;

  @Column({ type: 'text', nullable: true })
  serviceDescription: string;

  // Timing
  @Column({ type: 'timestamp' })
  @Index()
  startTime: Date;

  @Column({ type: 'timestamp' })
  @Index()
  endTime: Date;

  @Column({ type: 'int' })
  duration: number; // Minutes

  @Column({ type: 'varchar', length: 50, default: 'America/Los_Angeles' })
  timezone: string;

  // Status
  @Column({ type: 'varchar', length: 20, default: 'SCHEDULED' })
  @Index()
  status:
    | 'SCHEDULED'
    | 'CONFIRMED'
    | 'CHECKED_IN'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'NO_SHOW'
    | 'CANCELLED';

  // Location
  @Column({ type: 'uuid' })
  @Index()
  spaOrganizationId: string;

  @Column({ type: 'varchar', length: 200 })
  spaOrganizationName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  roomNumber: string;

  // Booking details
  @Column({ type: 'uuid' })
  bookedByUserId: string;

  @Column({ type: 'varchar', length: 200 })
  bookedByName: string;

  @Column({ type: 'timestamp' })
  bookedAt: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bookingSource: string; // 'ONLINE', 'PHONE', 'WALK_IN', 'ADMIN'

  // Pricing
  @Column({ type: 'int' })
  price: number; // Cents

  @Column({ type: 'int', default: 0 })
  discount: number; // Cents

  @Column({ type: 'int', default: 0 })
  tax: number; // Cents

  @Column({ type: 'int' })
  total: number; // Cents

  @Column({ type: 'jsonb', nullable: true })
  payment: PaymentInfo | null;

  // Notes
  @Column({ type: 'text', nullable: true })
  clientNotes: string; // Client-provided notes

  @Column({ type: 'text', nullable: true })
  providerNotes: string; // Provider's notes (private)

  @Column({ type: 'text', nullable: true })
  internalNotes: string; // Admin/staff notes (private)

  // Treatment details (filled after completion)
  @Column({ type: 'jsonb', default: '[]' })
  productsUsed: ProductUsed[];

  @Column({ type: 'jsonb', nullable: true })
  treatmentOutcome: TreatmentOutcome | null;

  // Reminders
  @Column({ type: 'boolean', default: false })
  reminderSent: boolean;

  @Column({ type: 'timestamp', nullable: true })
  reminderSentAt: Date | null;

  @Column({ type: 'boolean', default: false })
  confirmationSent: boolean;

  @Column({ type: 'timestamp', nullable: true })
  confirmationSentAt: Date | null;

  // Cancellation
  @Column({ type: 'jsonb', nullable: true })
  cancellation: CancellationInfo | null;

  // Reschedule history
  @Column({ type: 'jsonb', default: '[]' })
  rescheduleHistory: RescheduleRecord[];

  @Column({ type: 'int', default: 0 })
  rescheduleCount: number;

  // Check-in
  @Column({ type: 'timestamp', nullable: true })
  checkedInAt: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date | null; // When provider actually started

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date | null; // When treatment finished

  // Follow-up
  @Column({ type: 'boolean', default: false })
  followUpRequired: boolean;

  @Column({ type: 'timestamp', nullable: true })
  followUpDate: Date | null;

  @Column({ type: 'boolean', default: false })
  followUpCompleted: boolean;

  // Soft delete
  @Column({ type: 'timestamp', nullable: true })
  @Index()
  deletedAt: Date | null;
}

/**
 * Helper Functions
 */

/**
 * Generate appointment number
 */
export function generateAppointmentNumber(sequence: number): string {
  return `APT-${sequence.toString().padStart(6, '0')}`;
}

/**
 * Calculate appointment duration in minutes
 */
export function calculateDuration(startTime: Date, endTime: Date): number {
  return Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60));
}

/**
 * Check if appointment is in the past
 */
export function isPast(appointment: Appointment): boolean {
  return appointment.endTime < new Date();
}

/**
 * Check if appointment is upcoming (within next 24 hours)
 */
export function isUpcoming(appointment: Appointment): boolean {
  const now = new Date();
  const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return appointment.startTime > now && appointment.startTime <= twentyFourHoursFromNow;
}

/**
 * Check if appointment can be cancelled (more than 24 hours away)
 */
export function canBeCancelled(appointment: Appointment, cancellationPolicyHours: number = 24): boolean {
  if (appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED') {
    return false;
  }

  const now = new Date();
  const hoursUntilAppointment =
    (appointment.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  return hoursUntilAppointment >= cancellationPolicyHours;
}

/**
 * Check if appointment can be rescheduled
 */
export function canBeRescheduled(appointment: Appointment, maxReschedules: number = 3): boolean {
  if (appointment.status === 'CANCELLED' || appointment.status === 'COMPLETED') {
    return false;
  }

  if (appointment.rescheduleCount >= maxReschedules) {
    return false;
  }

  // Must be at least 2 hours away
  const now = new Date();
  const hoursUntilAppointment =
    (appointment.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  return hoursUntilAppointment >= 2;
}

/**
 * Calculate cancellation fee based on policy
 */
export function calculateCancellationFee(
  appointment: Appointment,
  cancellationPolicyHours: number = 24
): number {
  const now = new Date();
  const hoursUntilAppointment =
    (appointment.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  // No fee if cancelled more than policy hours in advance
  if (hoursUntilAppointment >= cancellationPolicyHours) {
    return 0;
  }

  // Less than 24 hours: 50% fee
  if (hoursUntilAppointment >= 12) {
    return Math.floor(appointment.price * 0.5);
  }

  // Less than 12 hours: 100% fee (no refund)
  return appointment.price;
}

/**
 * Check if reminder should be sent
 */
export function shouldSendReminder(
  appointment: Appointment,
  reminderHours: number = 24
): boolean {
  if (appointment.reminderSent) return false;
  if (appointment.status === 'CANCELLED') return false;

  const now = new Date();
  const reminderTime = new Date(appointment.startTime.getTime() - reminderHours * 60 * 60 * 1000);

  return now >= reminderTime && now < appointment.startTime;
}

/**
 * Get appointment status color for UI
 */
export function getStatusColor(status: Appointment['status']): string {
  const colors: Record<Appointment['status'], string> = {
    SCHEDULED: 'blue',
    CONFIRMED: 'green',
    CHECKED_IN: 'purple',
    IN_PROGRESS: 'orange',
    COMPLETED: 'gray',
    NO_SHOW: 'red',
    CANCELLED: 'red',
  };

  return colors[status];
}

/**
 * Calculate total products cost
 */
export function calculateProductsCost(appointment: Appointment): number {
  return appointment.productsUsed.reduce((total, product) => {
    return total + product.unitPrice * product.quantity;
  }, 0);
}

/**
 * Check if appointment overlaps with another
 */
export function overlaps(apt1: Appointment, apt2: Appointment): boolean {
  return !(apt1.endTime <= apt2.startTime || apt1.startTime >= apt2.endTime);
}

/**
 * Format appointment time for display
 */
export function formatAppointmentTime(appointment: Appointment): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: appointment.timezone,
  };

  return appointment.startTime.toLocaleDateString('en-US', options);
}

/**
 * Get time until appointment
 */
export function getTimeUntilAppointment(appointment: Appointment): {
  days: number;
  hours: number;
  minutes: number;
  isPast: boolean;
} {
  const now = new Date();
  const diff = appointment.startTime.getTime() - now.getTime();

  if (diff < 0) {
    return { days: 0, hours: 0, minutes: 0, isPast: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, isPast: false };
}

/**
 * Validate appointment booking
 */
export function validateAppointment(appointment: Partial<Appointment>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!appointment.clientId) {
    errors.push('Client ID is required');
  }

  if (!appointment.providerId) {
    errors.push('Provider ID is required');
  }

  if (!appointment.startTime) {
    errors.push('Start time is required');
  }

  if (!appointment.endTime) {
    errors.push('End time is required');
  }

  if (appointment.startTime && appointment.endTime) {
    if (appointment.startTime >= appointment.endTime) {
      errors.push('End time must be after start time');
    }

    // Check if start time is in the past
    if (appointment.startTime < new Date()) {
      errors.push('Cannot book appointment in the past');
    }
  }

  if (appointment.price !== undefined && appointment.price < 0) {
    errors.push('Price cannot be negative');
  }

  if (appointment.duration !== undefined && appointment.duration <= 0) {
    errors.push('Duration must be positive');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Create reschedule record
 */
export function createRescheduleRecord(
  appointment: Appointment,
  newStartTime: Date,
  newEndTime: Date,
  rescheduledBy: string,
  reason?: string
): RescheduleRecord {
  return {
    rescheduledAt: new Date().toISOString(),
    rescheduledBy,
    previousStartTime: appointment.startTime.toISOString(),
    previousEndTime: appointment.endTime.toISOString(),
    newStartTime: newStartTime.toISOString(),
    newEndTime: newEndTime.toISOString(),
    reason,
  };
}
