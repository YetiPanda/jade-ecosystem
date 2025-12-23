/**
 * Client Entity
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T101
 *
 * Purpose: Represents a client who receives spa/wellness treatments
 * Tracks profile, preferences, treatment history, and consent forms
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
 * Skin profile information
 */
export interface SkinProfile {
  skinType: 'DRY' | 'OILY' | 'COMBINATION' | 'SENSITIVE' | 'NORMAL';
  concerns: string[]; // 'ACNE', 'AGING', 'HYPERPIGMENTATION', 'ROSACEA', etc.
  allergies: string[];
  sensitivities: string[];
  currentProducts: string[];
  notes: string;
  lastUpdated: string; // ISO date
}

/**
 * Medical history relevant to treatments
 */
export interface MedicalHistory {
  medications: string[];
  conditions: string[]; // 'DIABETES', 'PREGNANCY', 'SKIN_CONDITION', etc.
  allergies: string[];
  contraindications: string[]; // Treatments to avoid
  notes: string;
  lastUpdated: string; // ISO date
}

/**
 * Consent form record
 */
export interface ConsentForm {
  formId: string;
  formType: string; // 'CHEMICAL_PEEL', 'MICRONEEDLING', 'GENERAL_TREATMENT', etc.
  signedAt: string; // ISO timestamp
  expiresAt?: string; // ISO timestamp (some consent forms expire)
  documentUrl: string; // S3 URL to signed PDF
  ipAddress: string;
  version: string; // Form version number
}

/**
 * Emergency contact information
 */
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

/**
 * Client preferences
 */
export interface ClientPreferences {
  preferredProviders: string[]; // Provider IDs
  preferredDayOfWeek: number[]; // 0-6
  preferredTimeOfDay: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'ANY';
  communicationPreference: 'EMAIL' | 'SMS' | 'PHONE' | 'APP';
  reminderHoursBefore: number; // Hours before appointment
  receivePromotions: boolean;
  receiveEducationalContent: boolean;
}

/**
 * Membership or package information
 */
export interface MembershipInfo {
  membershipId: string;
  membershipType: string; // 'MONTHLY', 'ANNUAL', 'PACKAGE'
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'EXPIRED';
  remainingCredits?: number;
  totalCredits?: number;
}

@Entity('client')
export class Client {
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

  @Column({ type: 'date', nullable: true })
  dateOfBirth: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  gender: string; // 'MALE', 'FEMALE', 'NON_BINARY', 'PREFER_NOT_TO_SAY'

  // Address
  @Column({ type: 'varchar', length: 200, nullable: true })
  street: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  street2: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  @Index()
  state: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  zipCode: string;

  @Column({ type: 'varchar', length: 2, default: 'US' })
  country: string;

  // Profile
  @Column({ type: 'varchar', length: 500, nullable: true })
  profilePhotoUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  skinProfile: SkinProfile | null;

  @Column({ type: 'jsonb', nullable: true })
  medicalHistory: MedicalHistory | null;

  @Column({ type: 'jsonb', default: '[]' })
  consentForms: ConsentForm[];

  @Column({ type: 'jsonb', nullable: true })
  emergencyContact: EmergencyContact | null;

  @Column({ type: 'jsonb', default: '{}' })
  preferences: ClientPreferences;

  // Membership
  @Column({ type: 'jsonb', nullable: true })
  membership: MembershipInfo | null;

  // Status
  @Column({ type: 'varchar', length: 20, default: 'ACTIVE' })
  @Index()
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DECEASED';

  // Spa association
  @Column({ type: 'uuid', nullable: true })
  @Index()
  primarySpaOrganizationId: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  primarySpaOrganizationName: string;

  // Referral tracking
  @Column({ type: 'varchar', length: 100, nullable: true })
  referralSource: string; // 'GOOGLE', 'INSTAGRAM', 'FRIEND', etc.

  @Column({ type: 'uuid', nullable: true })
  referredByClientId: string;

  // Loyalty metrics
  @Column({ type: 'int', default: 0 })
  totalAppointments: number;

  @Column({ type: 'int', default: 0 })
  totalSpent: number; // Cents

  @Column({ type: 'int', default: 0 })
  loyaltyPoints: number;

  @Column({ type: 'timestamp', nullable: true })
  lastAppointmentDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  firstAppointmentDate: Date | null;

  // Communication preferences
  @Column({ type: 'boolean', default: true })
  emailOptIn: boolean;

  @Column({ type: 'boolean', default: true })
  smsOptIn: boolean;

  @Column({ type: 'varchar', length: 50, default: 'America/Los_Angeles' })
  timezone: string;

  // Notes (internal use only, not visible to client)
  @Column({ type: 'text', nullable: true })
  internalNotes: string;

  // Account linking
  @Column({ type: 'uuid', nullable: true })
  @Index()
  userId: string; // Links to User entity if client has account

  // Soft delete
  @Column({ type: 'timestamp', nullable: true })
  @Index()
  deletedAt: Date | null;
}

/**
 * Helper Functions
 */

/**
 * Get client's full name
 */
export function getFullName(client: Client): string {
  return `${client.firstName} ${client.lastName}`;
}

/**
 * Calculate client's age
 */
export function calculateAge(client: Client): number | null {
  if (!client.dateOfBirth) return null;

  const birthDate = new Date(client.dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Check if client has valid consent for specific treatment
 */
export function hasValidConsent(client: Client, treatmentType: string): boolean {
  if (!client.consentForms || client.consentForms.length === 0) {
    return false;
  }

  const now = new Date();

  return client.consentForms.some(form => {
    if (form.formType !== treatmentType && form.formType !== 'GENERAL_TREATMENT') {
      return false;
    }

    // Check if expired
    if (form.expiresAt && new Date(form.expiresAt) < now) {
      return false;
    }

    return true;
  });
}

/**
 * Check if client's medical history has contraindications for treatment
 */
export function hasContraindications(client: Client, treatmentType: string): {
  hasContraindications: boolean;
  contraindications: string[];
} {
  if (!client.medicalHistory) {
    return { hasContraindications: false, contraindications: [] };
  }

  const relevantContraindications = client.medicalHistory.contraindications.filter(
    contraindication => contraindication.includes(treatmentType)
  );

  return {
    hasContraindications: relevantContraindications.length > 0,
    contraindications: relevantContraindications,
  };
}

/**
 * Check if medical history needs update (older than 6 months)
 */
export function needsMedicalHistoryUpdate(client: Client): boolean {
  if (!client.medicalHistory || !client.medicalHistory.lastUpdated) {
    return true;
  }

  const lastUpdated = new Date(client.medicalHistory.lastUpdated);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return lastUpdated < sixMonthsAgo;
}

/**
 * Check if skin profile needs update (older than 3 months)
 */
export function needsSkinProfileUpdate(client: Client): boolean {
  if (!client.skinProfile || !client.skinProfile.lastUpdated) {
    return true;
  }

  const lastUpdated = new Date(client.skinProfile.lastUpdated);
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

  return lastUpdated < threeMonthsAgo;
}

/**
 * Get client's tier based on total appointments
 */
export function getClientTier(client: Client): 'NEW' | 'REGULAR' | 'VIP' | 'ELITE' {
  if (client.totalAppointments === 0) return 'NEW';
  if (client.totalAppointments < 5) return 'REGULAR';
  if (client.totalAppointments < 15) return 'VIP';
  return 'ELITE';
}

/**
 * Calculate lifetime value
 */
export function calculateLifetimeValue(client: Client): {
  totalSpent: number;
  averagePerVisit: number;
  projectedAnnualValue: number;
} {
  const totalSpent = client.totalSpent / 100; // Convert cents to dollars

  const averagePerVisit =
    client.totalAppointments > 0 ? totalSpent / client.totalAppointments : 0;

  // Calculate projected annual value based on visit frequency
  let projectedAnnualValue = 0;
  if (client.firstAppointmentDate && client.lastAppointmentDate) {
    const daysSinceFirst =
      (new Date().getTime() - new Date(client.firstAppointmentDate).getTime()) /
      (1000 * 60 * 60 * 24);

    const visitsPerYear = daysSinceFirst > 0 ? (client.totalAppointments / daysSinceFirst) * 365 : 0;

    projectedAnnualValue = visitsPerYear * averagePerVisit;
  }

  return {
    totalSpent,
    averagePerVisit,
    projectedAnnualValue,
  };
}

/**
 * Check if client is at risk of churn (no appointment in 90 days)
 */
export function isAtRiskOfChurn(client: Client): boolean {
  if (!client.lastAppointmentDate) return false;

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  return new Date(client.lastAppointmentDate) < ninetyDaysAgo;
}

/**
 * Get recommended next appointment date based on last visit
 */
export function getRecommendedNextAppointment(
  client: Client,
  serviceType: string
): Date | null {
  if (!client.lastAppointmentDate) return null;

  const lastVisit = new Date(client.lastAppointmentDate);

  // Recommended frequency by service type
  const frequencies: Record<string, number> = {
    FACIAL: 30, // 30 days
    MASSAGE: 14, // 2 weeks
    WAXING: 21, // 3 weeks
    CHEMICAL_PEEL: 60, // 2 months
    MICRONEEDLING: 90, // 3 months
  };

  const daysToAdd = frequencies[serviceType] || 30; // Default 30 days

  const recommendedDate = new Date(lastVisit);
  recommendedDate.setDate(recommendedDate.getDate() + daysToAdd);

  return recommendedDate;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format (E.164)
 */
export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s()-]/g, '');
  return /^\+?[1-9]\d{1,14}$/.test(cleaned);
}

/**
 * Format phone for display
 */
export function formatPhoneForDisplay(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return phone; // Return as-is if not 10 digits
}

/**
 * Check if client has active membership
 */
export function hasActiveMembership(client: Client): boolean {
  if (!client.membership) return false;

  if (client.membership.status !== 'ACTIVE') return false;

  if (client.membership.endDate) {
    const endDate = new Date(client.membership.endDate);
    if (endDate < new Date()) return false;
  }

  return true;
}

/**
 * Get available membership credits
 */
export function getAvailableCredits(client: Client): number {
  if (!hasActiveMembership(client)) return 0;

  return client.membership?.remainingCredits || 0;
}
