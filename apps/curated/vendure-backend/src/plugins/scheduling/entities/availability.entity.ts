/**
 * Availability Entity
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T103
 *
 * Purpose: Represents schedule exceptions (blocked time, special hours, vacation)
 * Overrides the provider's regular weekly schedule
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * Recurrence rule (following iCalendar RFC 5545)
 */
export interface RecurrenceRule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval: number; // Every N days/weeks/months/years
  count?: number; // Number of occurrences
  until?: string; // End date (ISO)
  byDay?: string[]; // ['MO', 'WE', 'FR']
  byMonthDay?: number[]; // [1, 15, 30]
  byMonth?: number[]; // [1, 6, 12] for Jan, Jun, Dec
}

@Entity('availability')
export class Availability {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Provider reference
  @Column({ type: 'uuid' })
  @Index()
  providerId: string;

  @Column({ type: 'varchar', length: 200 })
  providerName: string;

  // Type of availability exception
  @Column({ type: 'varchar', length: 30 })
  @Index()
  type:
    | 'BLOCKED_TIME' // Time off, breaks
    | 'SPECIAL_HOURS' // Different hours than usual
    | 'VACATION' // Extended time off
    | 'UNAVAILABLE' // General unavailability
    | 'AVAILABLE' // Override to make available outside normal hours
    | 'GROUP_SESSION'; // Special availability for group sessions

  // Time range
  @Column({ type: 'timestamp' })
  @Index()
  startTime: Date;

  @Column({ type: 'timestamp' })
  @Index()
  endTime: Date;

  // All-day event flag
  @Column({ type: 'boolean', default: false })
  isAllDay: boolean;

  // Reason/Title
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reason: string; // 'VACATION', 'SICK', 'LUNCH', 'MEETING', 'PERSONAL', etc.

  // Recurrence
  @Column({ type: 'boolean', default: false })
  isRecurring: boolean;

  @Column({ type: 'jsonb', nullable: true })
  recurrenceRule: RecurrenceRule | null;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  recurringGroupId: string; // Links all instances of a recurring event

  // Capacity (for AVAILABLE or GROUP_SESSION types)
  @Column({ type: 'int', nullable: true })
  capacity: number;

  @Column({ type: 'int', default: 0 })
  bookedCount: number;

  // Status
  @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
  @Index()
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';

  // Location/Spa (if specific to a location)
  @Column({ type: 'uuid', nullable: true })
  @Index()
  spaOrganizationId: string;

  // Created by (admin/provider)
  @Column({ type: 'uuid' })
  createdByUserId: string;

  @Column({ type: 'varchar', length: 200 })
  createdByName: string;

  // Approval workflow (for time off requests)
  @Column({ type: 'varchar', length: 20, default: 'APPROVED' })
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';

  @Column({ type: 'uuid', nullable: true })
  approvedByUserId: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date | null;

  @Column({ type: 'text', nullable: true })
  approvalNotes: string;

  // Impact tracking
  @Column({ type: 'int', default: 0 })
  affectedAppointmentsCount: number; // Number of appointments that need rescheduling

  // Notes
  @Column({ type: 'text', nullable: true })
  internalNotes: string;

  // Soft delete
  @Column({ type: 'timestamp', nullable: true })
  @Index()
  deletedAt: Date | null;
}

/**
 * Helper Functions
 */

/**
 * Check if availability overlaps with a time range
 */
export function overlapsTimeRange(
  availability: Availability,
  startTime: Date,
  endTime: Date
): boolean {
  return !(availability.endTime <= startTime || availability.startTime >= endTime);
}

/**
 * Check if availability is active at a specific time
 */
export function isActiveAt(availability: Availability, checkTime: Date): boolean {
  if (availability.status !== 'ACTIVE') return false;
  if (availability.deletedAt) return false;

  return checkTime >= availability.startTime && checkTime < availability.endTime;
}

/**
 * Calculate duration in minutes
 */
export function getDurationMinutes(availability: Availability): number {
  return Math.floor(
    (availability.endTime.getTime() - availability.startTime.getTime()) / (1000 * 60)
  );
}

/**
 * Check if availability blocks appointments
 */
export function blocksAppointments(availability: Availability): boolean {
  return ['BLOCKED_TIME', 'VACATION', 'UNAVAILABLE'].includes(availability.type);
}

/**
 * Check if availability allows appointments
 */
export function allowsAppointments(availability: Availability): boolean {
  return ['AVAILABLE', 'SPECIAL_HOURS', 'GROUP_SESSION'].includes(availability.type);
}

/**
 * Check if group session has capacity
 */
export function hasCapacity(availability: Availability): boolean {
  if (availability.type !== 'GROUP_SESSION') return true;
  if (!availability.capacity) return false;

  return availability.bookedCount < availability.capacity;
}

/**
 * Get remaining capacity
 */
export function getRemainingCapacity(availability: Availability): number {
  if (availability.type !== 'GROUP_SESSION' || !availability.capacity) return 0;

  return Math.max(0, availability.capacity - availability.bookedCount);
}

/**
 * Generate recurring instances
 */
export function generateRecurringInstances(
  availability: Availability,
  startDate: Date,
  endDate: Date
): Date[] {
  if (!availability.isRecurring || !availability.recurrenceRule) {
    return [availability.startTime];
  }

  const instances: Date[] = [];
  const rule = availability.recurrenceRule;

  let currentDate = new Date(availability.startTime);
  let count = 0;

  while (currentDate <= endDate) {
    if (currentDate >= startDate) {
      instances.push(new Date(currentDate));
    }

    // Check count limit
    if (rule.count && count >= rule.count) break;

    // Check until date
    if (rule.until && currentDate > new Date(rule.until)) break;

    // Increment based on frequency
    switch (rule.frequency) {
      case 'DAILY':
        currentDate.setDate(currentDate.getDate() + (rule.interval || 1));
        break;
      case 'WEEKLY':
        currentDate.setDate(currentDate.getDate() + 7 * (rule.interval || 1));
        break;
      case 'MONTHLY':
        currentDate.setMonth(currentDate.getMonth() + (rule.interval || 1));
        break;
      case 'YEARLY':
        currentDate.setFullYear(currentDate.getFullYear() + (rule.interval || 1));
        break;
    }

    count++;

    // Safety limit
    if (count > 1000) break;
  }

  return instances;
}

/**
 * Check if availability requires approval
 */
export function requiresApproval(availability: Availability): boolean {
  // Vacations and extended blocked time require approval
  if (availability.type === 'VACATION') return true;

  const durationDays = getDurationMinutes(availability) / (60 * 24);
  if (durationDays > 3) return true; // More than 3 days requires approval

  return false;
}

/**
 * Validate availability doesn't conflict with existing appointments
 */
export function validateNoAppointmentConflicts(
  availability: Availability,
  existingAppointments: Array<{ startTime: Date; endTime: Date }>
): { valid: boolean; conflicts: number } {
  if (!blocksAppointments(availability)) {
    return { valid: true, conflicts: 0 };
  }

  const conflicts = existingAppointments.filter(apt =>
    overlapsTimeRange(availability, apt.startTime, apt.endTime)
  );

  return {
    valid: conflicts.length === 0,
    conflicts: conflicts.length,
  };
}

/**
 * Format recurrence rule for display
 */
export function formatRecurrenceRule(rule: RecurrenceRule): string {
  if (!rule) return 'Does not repeat';

  let text = '';

  switch (rule.frequency) {
    case 'DAILY':
      text = rule.interval === 1 ? 'Daily' : `Every ${rule.interval} days`;
      break;
    case 'WEEKLY':
      text = rule.interval === 1 ? 'Weekly' : `Every ${rule.interval} weeks`;
      if (rule.byDay && rule.byDay.length > 0) {
        text += ` on ${rule.byDay.join(', ')}`;
      }
      break;
    case 'MONTHLY':
      text = rule.interval === 1 ? 'Monthly' : `Every ${rule.interval} months`;
      if (rule.byMonthDay && rule.byMonthDay.length > 0) {
        text += ` on day ${rule.byMonthDay.join(', ')}`;
      }
      break;
    case 'YEARLY':
      text = rule.interval === 1 ? 'Yearly' : `Every ${rule.interval} years`;
      break;
  }

  if (rule.count) {
    text += `, ${rule.count} times`;
  } else if (rule.until) {
    const untilDate = new Date(rule.until).toLocaleDateString();
    text += `, until ${untilDate}`;
  }

  return text;
}

/**
 * Create a blocked time entry
 */
export function createBlockedTime(params: {
  providerId: string;
  providerName: string;
  startTime: Date;
  endTime: Date;
  reason: string;
  title: string;
  isRecurring?: boolean;
  recurrenceRule?: RecurrenceRule;
}): Partial<Availability> {
  return {
    providerId: params.providerId,
    providerName: params.providerName,
    type: 'BLOCKED_TIME',
    startTime: params.startTime,
    endTime: params.endTime,
    reason: params.reason,
    title: params.title,
    isRecurring: params.isRecurring || false,
    recurrenceRule: params.recurrenceRule || null,
    status: 'ACTIVE',
    approvalStatus: requiresApproval({
      type: 'BLOCKED_TIME',
      startTime: params.startTime,
      endTime: params.endTime,
    } as Availability)
      ? 'PENDING'
      : 'APPROVED',
  };
}

/**
 * Create a vacation entry
 */
export function createVacation(params: {
  providerId: string;
  providerName: string;
  startDate: Date;
  endDate: Date;
  title: string;
  description?: string;
}): Partial<Availability> {
  return {
    providerId: params.providerId,
    providerName: params.providerName,
    type: 'VACATION',
    startTime: params.startDate,
    endTime: params.endDate,
    isAllDay: true,
    title: params.title,
    description: params.description,
    reason: 'VACATION',
    status: 'ACTIVE',
    approvalStatus: 'PENDING', // Vacations always require approval
  };
}

/**
 * Calculate total blocked hours for a provider
 */
export function calculateTotalBlockedHours(availabilities: Availability[]): number {
  return availabilities
    .filter(a => blocksAppointments(a) && a.status === 'ACTIVE')
    .reduce((total, a) => total + getDurationMinutes(a) / 60, 0);
}

/**
 * Get availability conflicts
 */
export function findConflicts(
  newAvailability: Availability,
  existingAvailabilities: Availability[]
): Availability[] {
  return existingAvailabilities.filter(existing => {
    if (existing.id === newAvailability.id) return false;
    if (existing.status !== 'ACTIVE') return false;
    if (existing.deletedAt) return false;

    return overlapsTimeRange(existing, newAvailability.startTime, newAvailability.endTime);
  });
}

/**
 * Check if availability is in the past
 */
export function isPast(availability: Availability): boolean {
  return availability.endTime < new Date();
}

/**
 * Check if availability is current
 */
export function isCurrent(availability: Availability): boolean {
  const now = new Date();
  return availability.startTime <= now && availability.endTime > now;
}

/**
 * Check if availability is upcoming
 */
export function isUpcoming(availability: Availability): boolean {
  return availability.startTime > new Date();
}
