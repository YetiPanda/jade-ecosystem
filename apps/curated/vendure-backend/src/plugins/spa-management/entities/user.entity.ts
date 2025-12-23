/**
 * User Entity Extensions for JADE Spa Marketplace
 *
 * Task: T059 - Create User entity extending Vendure User
 *
 * Extends Vendure's base User entity with spa-specific fields:
 * - spaOrganizationId: Link to spa organization (for spa team members)
 * - vendorOrganizationId: Link to vendor organization (for vendor team)
 * - licenseInfo: Professional license details (for service providers)
 * - phoneNumber: Contact phone
 * - lastLoginAt: Last successful login timestamp
 *
 * These extensions are implemented via Vendure's custom fields mechanism
 * to maintain compatibility with Vendure's authentication system.
 */

import { User } from '@vendure/core';

/**
 * License information for service providers
 * Stored as JSONB for flexibility across different license types
 */
export interface LicenseInfo {
  /** State where license was issued */
  state: string;

  /** License number */
  licenseNumber: string;

  /** License type (e.g., "esthetician", "massage_therapist", "cosmetologist") */
  type: string;

  /** License expiration date (ISO 8601) */
  expirationDate: string;

  /** URL to license verification (optional) */
  verificationUrl?: string;

  /** Multi-state licenses */
  additionalStates?: Array<{
    state: string;
    licenseNumber: string;
    expirationDate: string;
  }>;
}

/**
 * Extended User entity with spa marketplace fields
 *
 * NOTE: Vendure User extensions are done via custom fields in vendure-config.ts
 * This entity serves as a TypeScript type reference for the extended fields
 *
 * The actual implementation uses Vendure's CustomFields API:
 * - spaOrganizationId -> User.customFields.spaOrganizationId
 * - vendorOrganizationId -> User.customFields.vendorOrganizationId
 * - licenseInfo -> User.customFields.licenseInfo (JSONB)
 * - phoneNumber -> User.customFields.phoneNumber
 * - lastLoginAt -> User.customFields.lastLoginAt
 */
export interface JadeUser extends User {
  customFields: {
    /** Link to spa organization (nullable) */
    spaOrganizationId?: string;

    /** Link to vendor organization (nullable) */
    vendorOrganizationId?: string;

    /** Professional license details (nullable, JSONB) */
    licenseInfo?: LicenseInfo;

    /** Contact phone number (nullable) */
    phoneNumber?: string;

    /** Last successful login timestamp (nullable) */
    lastLoginAt?: Date;
  };
}

/**
 * Custom fields configuration for User entity
 * This is used in vendure-config.ts to extend the User entity
 */
export const UserCustomFields = [
  {
    name: 'spaOrganizationId',
    type: 'string' as const,
    label: [{ languageCode: 'en' as const, value: 'Spa Organization ID' }],
    description: [{ languageCode: 'en' as const, value: 'Associated spa organization for team members' }],
    nullable: true,
    public: false,
  },
  {
    name: 'vendorOrganizationId',
    type: 'string' as const,
    label: [{ languageCode: 'en' as const, value: 'Vendor Organization ID' }],
    description: [{ languageCode: 'en' as const, value: 'Associated vendor organization for vendor team' }],
    nullable: true,
    public: false,
  },
  {
    name: 'licenseInfo',
    type: 'text' as const,
    label: [{ languageCode: 'en' as const, value: 'License Information (JSON)' }],
    description: [{ languageCode: 'en' as const, value: 'Professional license details for service providers' }],
    nullable: true,
    public: false,
    ui: { component: 'textarea-form-input' },
  },
  {
    name: 'phoneNumber',
    type: 'string' as const,
    label: [{ languageCode: 'en' as const, value: 'Phone Number' }],
    description: [{ languageCode: 'en' as const, value: 'Contact phone number' }],
    nullable: true,
    public: true,
    validate: (value: string) => {
      if (value && !/^\+?[1-9]\d{1,14}$/.test(value)) {
        return 'Phone number must be in E.164 format';
      }
      return true;
    },
  },
  {
    name: 'lastLoginAt',
    type: 'datetime' as const,
    label: [{ languageCode: 'en' as const, value: 'Last Login' }],
    description: [{ languageCode: 'en' as const, value: 'Last successful login timestamp' }],
    nullable: true,
    public: false,
  },
];

/**
 * User role enum matching the roles in data-model.md
 * These are used with Vendure's built-in Role system
 */
export enum UserRole {
  /** Spa business owner */
  SPA_OWNER = 'spa_owner',

  /** Spa location manager */
  SPA_MANAGER = 'spa_manager',

  /** Licensed service provider (esthetician, massage therapist, etc.) */
  SERVICE_PROVIDER = 'service_provider',

  /** Spa concierge/receptionist */
  CONCIERGE = 'concierge',

  /** Spa client/customer */
  CLIENT = 'client',

  /** Product vendor (supplier) */
  VENDOR = 'vendor',

  /** Platform administrator */
  ADMIN = 'admin',
}

/**
 * Type guard to check if a user has a specific role
 */
export function hasRole(user: User, role: UserRole): boolean {
  return user.roles.some(r => r.code === role);
}

/**
 * Type guard to check if user is spa team member
 */
export function isSpaTeamMember(user: JadeUser): boolean {
  return hasRole(user, UserRole.SPA_OWNER) ||
         hasRole(user, UserRole.SPA_MANAGER) ||
         hasRole(user, UserRole.SERVICE_PROVIDER) ||
         hasRole(user, UserRole.CONCIERGE);
}

/**
 * Type guard to check if user is vendor team member
 */
export function isVendorTeamMember(user: JadeUser): boolean {
  return hasRole(user, UserRole.VENDOR);
}

/**
 * Type guard to check if user requires professional license
 */
export function requiresLicense(user: User): boolean {
  return hasRole(user, UserRole.SERVICE_PROVIDER);
}

/**
 * Validation helper for license info
 */
export function validateLicenseInfo(licenseInfo: LicenseInfo): string[] {
  const errors: string[] = [];

  if (!licenseInfo.state) {
    errors.push('License state is required');
  }

  if (!licenseInfo.licenseNumber) {
    errors.push('License number is required');
  }

  if (!licenseInfo.type) {
    errors.push('License type is required');
  }

  if (!licenseInfo.expirationDate) {
    errors.push('License expiration date is required');
  } else {
    const expirationDate = new Date(licenseInfo.expirationDate);
    if (expirationDate <= new Date()) {
      errors.push('License has expired');
    }
  }

  return errors;
}

/**
 * Helper to format user display name
 */
export function getUserDisplayName(user: JadeUser): string {
  // Vendure User doesn't have firstName/lastName by default
  // Return identifier (email) instead
  return user.identifier;
}

/**
 * Helper to check if license is expiring soon (within 30 days)
 */
export function isLicenseExpiringSoon(licenseInfo: LicenseInfo): boolean {
  const expirationDate = new Date(licenseInfo.expirationDate);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  return expirationDate <= thirtyDaysFromNow;
}
