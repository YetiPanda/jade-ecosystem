/**
 * VendorOrganization Entity for JADE Spa Marketplace
 *
 * Task: T061 - Create VendorOrganization entity
 *
 * Represents a product supplier/vendor in the marketplace.
 * Vendors supply professional skincare products to spa organizations.
 */

import { DeepPartial } from '@vendure/core';
import { Entity, Column, Index, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Business address structure
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Vendor credentials and certifications
 */
export interface VendorCredentials {
  /** Business license */
  businessLicense: {
    number: string;
    state: string;
    expirationDate: string; // ISO 8601
    documentUrl: string;
  };

  /** Industry certifications */
  certifications: Array<{
    type: string; // e.g., "organic", "gmp", "iso"
    issuer: string;
    number: string;
    issuedDate: string;
    expirationDate?: string;
    documentUrl: string;
  }>;

  /** Business insurance */
  insurance: {
    provider: string;
    policyNumber: string;
    coverageAmount: number;
    expirationDate: string;
  };
}

/**
 * Fulfillment and shipping settings
 */
export interface FulfillmentSettings {
  /** Days to ship after order placement */
  processingTime: number;

  /** Available shipping methods */
  shippingMethods: Array<{
    carrier: string;
    service: string;
    estimatedDays: number;
  }>;

  /** Free shipping threshold (optional) */
  freeShippingThreshold?: number;

  /** Handling fee (optional) */
  handlingFee?: number;

  /** Packaging options */
  packagingOptions: string[];
}

/**
 * Vendor quality and performance metrics
 */
export interface VendorQualityMetrics {
  /** Average rating from spa reviews (0-5) */
  averageRating: number;

  /** Total number of orders fulfilled */
  totalOrders: number;

  /** On-time shipment percentage */
  onTimeShipmentRate: number;

  /** Product accuracy percentage (correct items shipped) */
  productAccuracyRate: number;

  /** Average response time in hours */
  responseTime: number;

  /** Return rate percentage */
  returnRate: number;

  /** Last metrics update timestamp */
  lastUpdated: string; // ISO 8601
}

/**
 * Payment information (Stripe Connect)
 */
export interface PaymentInfo {
  /** Stripe Connect account ID */
  stripeAccountId: string;

  /** Account status */
  accountStatus: 'pending' | 'active' | 'restricted';

  /** Payouts enabled */
  payoutsEnabled: boolean;

  /** Charges enabled */
  chargesEnabled: boolean;

  /** Last verified */
  lastVerified: string; // ISO 8601
}

/**
 * Approval status enum
 */
export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  SUSPENDED = 'suspended',
  REJECTED = 'rejected',
}

/**
 * VendorOrganization Entity
 *
 * Represents product suppliers in the marketplace.
 * Vendors must be approved before they can sell products.
 */
@Entity('vendor_organization')
export class VendorOrganization {
  constructor(input?: DeepPartial<VendorOrganization>) {
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
   * Legal company name
   */
  @Column({ type: 'varchar', length: 200 })
  @Index()
  companyName: string;

  /**
   * Brand/display name
   */
  @Column({ type: 'varchar', length: 200 })
  displayName: string;

  /**
   * Business credentials and certifications (JSONB)
   */
  @Column({ type: 'jsonb' })
  credentials: VendorCredentials;

  /**
   * Primary contact email
   */
  @Column({ type: 'varchar', length: 255 })
  contactEmail: string;

  /**
   * Contact phone number
   */
  @Column({ type: 'varchar', length: 20, nullable: true })
  contactPhone: string | null;

  /**
   * Business address (JSONB)
   */
  @Column({ type: 'jsonb' })
  address: Address;

  /**
   * Tax ID / EIN (encrypted at application layer)
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  taxId: string | null;

  /**
   * Fulfillment and shipping settings (JSONB)
   */
  @Column({ type: 'jsonb' })
  fulfillmentSettings: FulfillmentSettings;

  /**
   * Quality ratings and performance metrics (JSONB, nullable)
   */
  @Column({ type: 'jsonb', nullable: true })
  qualityRatings: VendorQualityMetrics | null;

  /**
   * Marketplace commission rate (percentage, e.g., 15.00 for 15%)
   */
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 15.00 })
  commissionRate: number;

  /**
   * Payment information (JSONB)
   */
  @Column({ type: 'jsonb' })
  paymentInfo: PaymentInfo;

  /**
   * Vendor approval status
   */
  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.PENDING,
  })
  @Index()
  approvalStatus: ApprovalStatus;

  /**
   * Approval timestamp
   */
  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date | null;

  /**
   * Account active status
   */
  @Column({ type: 'boolean', default: true })
  @Index()
  isActive: boolean;

  // Relationships defined via Product.vendorId
  // Managed by services rather than TypeORM for flexibility
}

/**
 * Default fulfillment settings
 */
export const DEFAULT_FULFILLMENT_SETTINGS: FulfillmentSettings = {
  processingTime: 2, // 2 business days
  shippingMethods: [
    {
      carrier: 'USPS',
      service: 'Priority Mail',
      estimatedDays: 3,
    },
  ],
  packagingOptions: ['standard'],
};

/**
 * Validation helper for vendor credentials
 */
export function validateVendorCredentials(credentials: VendorCredentials): string[] {
  const errors: string[] = [];

  // Validate business license
  if (!credentials.businessLicense) {
    errors.push('Business license is required');
  } else {
    if (!credentials.businessLicense.number) {
      errors.push('Business license number is required');
    }
    if (!credentials.businessLicense.state) {
      errors.push('Business license state is required');
    }
    if (!credentials.businessLicense.expirationDate) {
      errors.push('Business license expiration date is required');
    } else {
      const expirationDate = new Date(credentials.businessLicense.expirationDate);
      if (expirationDate <= new Date()) {
        errors.push('Business license has expired');
      }
    }
  }

  // Validate insurance
  if (!credentials.insurance) {
    errors.push('Business insurance is required');
  } else {
    if (!credentials.insurance.policyNumber) {
      errors.push('Insurance policy number is required');
    }
    if (!credentials.insurance.coverageAmount || credentials.insurance.coverageAmount <= 0) {
      errors.push('Insurance coverage amount must be greater than 0');
    }
    if (!credentials.insurance.expirationDate) {
      errors.push('Insurance expiration date is required');
    } else {
      const expirationDate = new Date(credentials.insurance.expirationDate);
      if (expirationDate <= new Date()) {
        errors.push('Insurance has expired');
      }
    }
  }

  return errors;
}

/**
 * Helper to check if vendor is approved and active
 */
export function isVendorActive(vendor: VendorOrganization): boolean {
  return (
    vendor.isActive &&
    vendor.approvalStatus === ApprovalStatus.APPROVED &&
    vendor.paymentInfo?.payoutsEnabled === true
  );
}

/**
 * Helper to check if vendor can accept orders
 */
export function canAcceptOrders(vendor: VendorOrganization): boolean {
  return (
    isVendorActive(vendor) &&
    vendor.paymentInfo?.chargesEnabled === true
  );
}

/**
 * Helper to format vendor display name
 */
export function getVendorDisplayName(vendor: VendorOrganization): string {
  return vendor.displayName || vendor.companyName;
}

/**
 * Helper to calculate vendor payout amount after commission
 */
export function calculateVendorPayout(orderTotal: number, commissionRate: number): number {
  const commission = orderTotal * (commissionRate / 100);
  return orderTotal - commission;
}

/**
 * Helper to check if credentials are expiring soon (within 30 days)
 */
export function hasExpiringCredentials(vendor: VendorOrganization): boolean {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  // Check business license
  const licenseExpiration = new Date(vendor.credentials.businessLicense.expirationDate);
  if (licenseExpiration <= thirtyDaysFromNow) {
    return true;
  }

  // Check insurance
  const insuranceExpiration = new Date(vendor.credentials.insurance.expirationDate);
  if (insuranceExpiration <= thirtyDaysFromNow) {
    return true;
  }

  // Check certifications
  for (const cert of vendor.credentials.certifications) {
    if (cert.expirationDate) {
      const certExpiration = new Date(cert.expirationDate);
      if (certExpiration <= thirtyDaysFromNow) {
        return true;
      }
    }
  }

  return false;
}
