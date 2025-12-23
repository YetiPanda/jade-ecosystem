/**
 * User Types and Enums
 *
 * Custom user types for JADE Spa Marketplace
 */

/**
 * User roles in the JADE ecosystem
 */
export enum UserRole {
  // System roles
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',

  // Spa-related roles
  SPA_OWNER = 'SPA_OWNER',
  SPA_STAFF = 'SPA_STAFF',

  // Vendor-related roles
  VENDOR_OWNER = 'VENDOR_OWNER',
  VENDOR_STAFF = 'VENDOR_STAFF',
}

/**
 * Extended User interface with passwordHash
 */
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
