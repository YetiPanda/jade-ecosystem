/**
 * ServiceProvider Entity
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T100
 *
 * Purpose: Represents a service provider (esthetician, massage therapist, etc.)
 * who can perform treatments and has a schedule for appointments.
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

/**
 * License Information
 */
export interface LicenseInfo {
  licenseNumber: string;
  licenseType: string; // 'ESTHETICIAN', 'MASSAGE_THERAPIST', 'LASER_TECHNICIAN', etc.
  state: string; // Two-letter state code
  issuedDate: string; // ISO date
  expirationDate: string; // ISO date
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'PENDING_RENEWAL';
  authorizedServices: string[]; // Service types this license covers
  certifications: string[]; // Additional certifications (e.g., 'MICRONEEDLING_CERT')
  verifiedAt?: string; // Last verification timestamp
  verificationSource?: string; // 'STATE_BOARD_API' | 'MANUAL_UPLOAD'
}

/**
 * Working Hours for a specific day
 */
export interface DaySchedule {
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  isWorkingDay: boolean;
  shifts: TimeSlot[];
}

export interface TimeSlot {
  startTime: string; // HH:MM format (e.g., "09:00")
  endTime: string; // HH:MM format (e.g., "17:00")
}

/**
 * Service offering with pricing
 */
export interface ServiceOffering {
  serviceId: string;
  serviceName: string;
  serviceType: string; // 'FACIAL', 'MASSAGE', 'WAXING', etc.
  duration: number; // Minutes
  price: number; // Cents
  description: string;
  requiresConsent: boolean;
  requiredCertifications: string[];
}

/**
 * Blocked time (vacation, breaks, personal time)
 */
export interface BlockedTime {
  id: string;
  startTime: string; // ISO timestamp
  endTime: string; // ISO timestamp
  reason: string;
  isRecurring: boolean;
  recurrenceRule?: string; // iCal RRULE format
}

@Entity('service_provider')
export class ServiceProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Basic Information
  @Column({ type: 'varchar', length: 100 })
  @Index()
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  @Index()
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  profilePhotoUrl: string;

  @Column({ type: 'int', default: 0 })
  yearsOfExperience: number;

  // Status
  @Column({ type: 'varchar', length: 20, default: 'PENDING_APPROVAL' })
  @Index()
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

  // Licensing (JSONB for flexibility)
  @Column({ type: 'jsonb' })
  licenses: LicenseInfo[];

  // Work Schedule (JSONB array of weekly schedule)
  @Column({ type: 'jsonb' })
  weeklySchedule: DaySchedule[];

  // Services offered
  @Column({ type: 'jsonb' })
  services: ServiceOffering[];

  // Blocked time periods
  @Column({ type: 'jsonb', default: '[]' })
  blockedTimes: BlockedTime[];

  // Capacity settings
  @Column({ type: 'int', default: 1 })
  maxConcurrentAppointments: number; // For group sessions

  @Column({ type: 'int', default: 0 })
  bufferTimeBetweenAppointments: number; // Minutes between appointments

  // Location/Spa association
  @Column({ type: 'uuid', nullable: true })
  @Index()
  spaOrganizationId: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  spaOrganizationName: string;

  // Preferences
  @Column({ type: 'varchar', length: 50, default: 'America/Los_Angeles' })
  timezone: string;

  @Column({ type: 'boolean', default: true })
  acceptOnlineBookings: boolean;

  @Column({ type: 'int', default: 24 })
  minimumNoticeHours: number; // Minimum hours before appointment

  @Column({ type: 'int', default: 168 })
  maxAdvanceBookingHours: number; // Maximum hours in advance (default 7 days)

  // Notification preferences
  @Column({ type: 'jsonb', default: '{}' })
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    reminderHours: number; // Hours before appointment to send reminder
  };

  // Performance metrics (cached)
  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ type: 'int', default: 0 })
  totalReviews: number;

  @Column({ type: 'int', default: 0 })
  totalAppointments: number;

  @Column({ type: 'int', default: 0 })
  cancellationRate: number; // Percentage

  // Soft delete
  @Column({ type: 'timestamp', nullable: true })
  @Index()
  deletedAt: Date | null;
}

/**
 * Helper Functions
 */

/**
 * Check if provider is available at specific time
 */
export function isProviderAvailable(
  provider: ServiceProvider,
  startTime: Date,
  endTime: Date
): boolean {
  // Check if within working hours
  const dayOfWeek = startTime.getDay();
  const schedule = provider.weeklySchedule.find(s => s.dayOfWeek === dayOfWeek);

  if (!schedule || !schedule.isWorkingDay) {
    return false;
  }

  const startTimeStr = formatTime(startTime);
  const endTimeStr = formatTime(endTime);

  // Check if time falls within any shift
  const withinShift = schedule.shifts.some(shift => {
    return startTimeStr >= shift.startTime && endTimeStr <= shift.endTime;
  });

  if (!withinShift) {
    return false;
  }

  // Check blocked times
  const isBlocked = provider.blockedTimes.some(blocked => {
    const blockedStart = new Date(blocked.startTime);
    const blockedEnd = new Date(blocked.endTime);
    return !(endTime <= blockedStart || startTime >= blockedEnd);
  });

  return !isBlocked;
}

/**
 * Get provider's active license for a specific service and state
 */
export function getActiveLicense(
  provider: ServiceProvider,
  serviceType: string,
  state: string
): LicenseInfo | null {
  const now = new Date();

  return (
    provider.licenses.find(license => {
      if (license.state !== state) return false;
      if (license.status !== 'ACTIVE') return false;
      if (new Date(license.expirationDate) < now) return false;
      if (!license.authorizedServices.includes(serviceType)) return false;
      return true;
    }) || null
  );
}

/**
 * Check if provider has required certifications for service
 */
export function hasRequiredCertifications(
  provider: ServiceProvider,
  requiredCertifications: string[]
): boolean {
  const providerCerts = new Set(
    provider.licenses.flatMap(license => license.certifications || [])
  );

  return requiredCertifications.every(cert => providerCerts.has(cert));
}

/**
 * Calculate time slots for a day
 */
export function calculateTimeSlots(
  provider: ServiceProvider,
  date: Date,
  serviceDuration: number
): TimeSlot[] {
  const dayOfWeek = date.getDay();
  const schedule = provider.weeklySchedule.find(s => s.dayOfWeek === dayOfWeek);

  if (!schedule || !schedule.isWorkingDay) {
    return [];
  }

  const slots: TimeSlot[] = [];
  const slotDuration = serviceDuration + provider.bufferTimeBetweenAppointments;

  schedule.shifts.forEach(shift => {
    const shiftStart = parseTime(shift.startTime);
    const shiftEnd = parseTime(shift.endTime);

    let currentTime = shiftStart;

    while (currentTime + slotDuration <= shiftEnd) {
      const slotStart = formatTimeFromMinutes(currentTime);
      const slotEnd = formatTimeFromMinutes(currentTime + serviceDuration);

      // Check if slot is blocked
      const slotDate = new Date(date);
      const [startHour, startMin] = slotStart.split(':').map(Number);
      slotDate.setHours(startHour, startMin, 0, 0);

      const endDate = new Date(slotDate);
      endDate.setMinutes(endDate.getMinutes() + serviceDuration);

      if (isProviderAvailable(provider, slotDate, endDate)) {
        slots.push({ startTime: slotStart, endTime: slotEnd });
      }

      currentTime += slotDuration;
    }
  });

  return slots;
}

/**
 * Check if license is expiring soon (within days)
 */
export function isLicenseExpiringSoon(license: LicenseInfo, days: number = 30): boolean {
  const expirationDate = new Date(license.expirationDate);
  const now = new Date();
  const daysUntilExpiration = Math.floor(
    (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysUntilExpiration > 0 && daysUntilExpiration <= days;
}

/**
 * Utility: Format time from Date to HH:MM
 */
function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Utility: Parse HH:MM to minutes since midnight
 */
function parseTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Utility: Format minutes since midnight to HH:MM
 */
function formatTimeFromMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Validate weekly schedule
 */
export function validateWeeklySchedule(schedule: DaySchedule[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (schedule.length !== 7) {
    errors.push('Schedule must have exactly 7 days');
  }

  schedule.forEach((day, index) => {
    if (day.dayOfWeek !== index) {
      errors.push(`Day ${index} has incorrect dayOfWeek value`);
    }

    if (day.isWorkingDay && day.shifts.length === 0) {
      errors.push(`Working day ${index} has no shifts defined`);
    }

    // Check for overlapping shifts
    for (let i = 0; i < day.shifts.length; i++) {
      for (let j = i + 1; j < day.shifts.length; j++) {
        const shift1Start = parseTime(day.shifts[i].startTime);
        const shift1End = parseTime(day.shifts[i].endTime);
        const shift2Start = parseTime(day.shifts[j].startTime);
        const shift2End = parseTime(day.shifts[j].endTime);

        if (!(shift1End <= shift2Start || shift1Start >= shift2End)) {
          errors.push(`Day ${index} has overlapping shifts`);
        }
      }
    }

    // Validate time format
    day.shifts.forEach((shift, shiftIndex) => {
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(shift.startTime)) {
        errors.push(`Day ${index}, shift ${shiftIndex}: Invalid startTime format`);
      }
      if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(shift.endTime)) {
        errors.push(`Day ${index}, shift ${shiftIndex}: Invalid endTime format`);
      }

      if (parseTime(shift.startTime) >= parseTime(shift.endTime)) {
        errors.push(`Day ${index}, shift ${shiftIndex}: startTime must be before endTime`);
      }
    });
  });

  return { valid: errors.length === 0, errors };
}
