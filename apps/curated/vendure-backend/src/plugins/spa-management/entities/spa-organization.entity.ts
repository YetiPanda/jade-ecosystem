/**
 * SpaOrganization Entity for JADE Spa Marketplace
 *
 * Task: T060 - Create SpaOrganization entity
 *
 * Represents a spa or medspa business (tenant entity).
 * Each spa organization can have multiple:
 * - Locations (physical addresses)
 * - Team members (users)
 * - Service providers
 * - Clients
 * - Appointments
 * - Orders
 */

import { DeepPartial } from '@vendure/core';
import { Entity, Column, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Physical location within a spa organization
 */
export interface Location {
  /** Unique location identifier */
  id: string;

  /** Location name (e.g., "Downtown Beverly Hills") */
  name: string;

  /** Physical address */
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  /** Contact phone */
  phone: string;

  /** Timezone (IANA format, e.g., "America/Los_Angeles") */
  timezone: string;

  /** Operating hours by day of week */
  operatingHours: {
    [day: string]: { open: string; close: string } | 'closed';
  };
}

/**
 * Service offered by the spa
 */
export interface ServiceOffering {
  /** Unique service identifier */
  id: string;

  /** Service name */
  name: string;

  /** Service category (e.g., "facial", "massage", "body_treatment") */
  category: string;

  /** Duration in minutes */
  duration: number;

  /** Base price */
  price: number;

  /** Whether service requires professional license */
  requiresLicense: boolean;

  /** Required license types (e.g., ["esthetician", "massage_therapist"]) */
  licenseTypes: string[];
}

/**
 * Organization settings and preferences
 */
export interface OrgSettings {
  /** Minutes of buffer between appointments */
  bookingBuffer: number;

  /** Hours notice required for cancellation */
  cancellationPolicy: number;

  /** Enable automated reminders */
  reminderEnabled: boolean;

  /** Hours before appointment to send reminder */
  reminderHours: number;

  /** Allow clients to self-book online */
  allowClientSelfBooking: boolean;

  /** Require deposit for new clients */
  requireDepositForNewClients: boolean;

  /** Deposit percentage (0-100) */
  depositPercentage: number;
}

/**
 * Subscription tier enum
 */
export enum SubscriptionTier {
  BASIC = 'basic',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

/**
 * Subscription status enum
 */
export enum SubscriptionStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CANCELLED = 'cancelled',
}

/**
 * Business type enum
 */
export enum BusinessType {
  SPA = 'spa',
  MEDSPA = 'medspa',
  SALON = 'salon',
}

/**
 * SpaOrganization Entity
 *
 * Primary tenant entity for the multi-tenant architecture.
 * Each spa organization operates independently with isolated data.
 */
@Entity('spa_organization')
export class SpaOrganization {
  constructor(input?: DeepPartial<SpaOrganization>) {
    if (input) {
      Object.assign(this, input);
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Legal business name
   */
  @Column({ type: 'varchar', length: 200 })
  @Index()
  businessName: string;

  /**
   * Public-facing display name
   */
  @Column({ type: 'varchar', length: 200 })
  displayName: string;

  /**
   * Type of business
   */
  @Column({
    type: 'enum',
    enum: BusinessType,
    default: BusinessType.SPA,
  })
  businessType: BusinessType;

  /**
   * Tax ID / EIN (encrypted at application layer before storage)
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  taxId: string | null;

  /**
   * Physical locations (JSONB array)
   */
  @Column({ type: 'jsonb' })
  locations: Location[];

  /**
   * Services offered (JSONB array)
   */
  @Column({ type: 'jsonb' })
  serviceOfferings: ServiceOffering[];

  /**
   * Subscription tier
   */
  @Column({
    type: 'enum',
    enum: SubscriptionTier,
    default: SubscriptionTier.BASIC,
  })
  subscriptionTier: SubscriptionTier;

  /**
   * Subscription status
   */
  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  @Index()
  subscriptionStatus: SubscriptionStatus;

  /**
   * Billing contact email
   */
  @Column({ type: 'varchar', length: 255 })
  billingEmail: string;

  /**
   * Organization settings and preferences (JSONB)
   */
  @Column({ type: 'jsonb' })
  settings: OrgSettings;

  /**
   * Account active status
   */
  @Column({ type: 'boolean', default: true })
  @Index()
  isActive: boolean;

  /**
   * Onboarding completion timestamp
   */
  @Column({ type: 'timestamp', nullable: true })
  onboardedAt: Date | null;

  // Relationships defined via User.customFields.spaOrganizationId
  // OneToMany relationships managed by services rather than TypeORM
  // to maintain flexibility with Vendure's architecture
}

/**
 * Default organization settings
 */
export const DEFAULT_ORG_SETTINGS: OrgSettings = {
  bookingBuffer: 15, // 15 minutes between appointments
  cancellationPolicy: 24, // 24 hours notice
  reminderEnabled: true,
  reminderHours: 24, // Remind 24 hours before
  allowClientSelfBooking: true,
  requireDepositForNewClients: false,
  depositPercentage: 0,
};

/**
 * Validation helper for location
 */
export function validateLocation(location: Location): string[] {
  const errors: string[] = [];

  if (!location.name) {
    errors.push('Location name is required');
  }

  if (!location.address?.street) {
    errors.push('Street address is required');
  }

  if (!location.address?.city) {
    errors.push('City is required');
  }

  if (!location.address?.state) {
    errors.push('State is required');
  }

  if (!location.address?.zipCode) {
    errors.push('Zip code is required');
  }

  if (!location.phone) {
    errors.push('Phone number is required');
  }

  if (!location.timezone) {
    errors.push('Timezone is required');
  }

  return errors;
}

/**
 * Validation helper for service offering
 */
export function validateServiceOffering(service: ServiceOffering): string[] {
  const errors: string[] = [];

  if (!service.name) {
    errors.push('Service name is required');
  }

  if (!service.category) {
    errors.push('Service category is required');
  }

  if (!service.duration || service.duration <= 0) {
    errors.push('Service duration must be greater than 0');
  }

  if (!service.price || service.price < 0) {
    errors.push('Service price must be 0 or greater');
  }

  if (service.requiresLicense && (!service.licenseTypes || service.licenseTypes.length === 0)) {
    errors.push('License-required services must specify license types');
  }

  return errors;
}

/**
 * Helper to check if organization is active and in good standing
 */
export function isOrganizationActive(org: SpaOrganization): boolean {
  return org.isActive && org.subscriptionStatus === SubscriptionStatus.ACTIVE;
}

/**
 * Helper to get primary location
 */
export function getPrimaryLocation(org: SpaOrganization): Location | null {
  return org.locations && org.locations.length > 0 ? org.locations[0] : null;
}

/**
 * Helper to format organization display name
 */
export function getOrganizationDisplayName(org: SpaOrganization): string {
  return org.displayName || org.businessName;
}
