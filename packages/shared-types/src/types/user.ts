/**
 * User-related types
 */

export enum UserRole {
  SPA_OWNER = 'SPA_OWNER',
  SPA_MANAGER = 'SPA_MANAGER',
  SPA_STAFF = 'SPA_STAFF',
  SERVICE_PROVIDER = 'SERVICE_PROVIDER',
  CLIENT = 'CLIENT',
  VENDOR = 'VENDOR',
  VENDOR_OWNER = 'VENDOR_OWNER',
  VENDOR_STAFF = 'VENDOR_STAFF',
  ADMIN = 'ADMIN',
}

export enum LicenseType {
  ESTHETICIAN = 'ESTHETICIAN',
  COSMETOLOGIST = 'COSMETOLOGIST',
  MASSAGE_THERAPIST = 'MASSAGE_THERAPIST',
  MEDICAL_DIRECTOR = 'MEDICAL_DIRECTOR',
  NURSE_PRACTITIONER = 'NURSE_PRACTITIONER',
}

export interface LicenseInfo {
  type: LicenseType;
  number: string;
  state: string;
  expirationDate: string;
  verified: boolean;
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REQUIRES_INFO = 'REQUIRES_INFO',
}

/**
 * Base User interface
 */
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
