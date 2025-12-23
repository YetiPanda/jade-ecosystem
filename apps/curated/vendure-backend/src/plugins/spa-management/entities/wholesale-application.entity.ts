/**
 * Wholesale Application Entity
 * Week 8: Practitioner Verification System
 *
 * Manages wholesale account applications from licensed professionals.
 * Supports:
 * - Business information collection
 * - License document uploads
 * - Location photo uploads
 * - Curator review workflow
 * - Third-party license verification
 */

import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { VendureEntity, ID, User, DeepPartial } from '@vendure/core';

/**
 * Application status enum
 */
export enum ApplicationStatus {
  /** Application submitted, awaiting review */
  PENDING = 'PENDING',

  /** Under review by curator */
  UNDER_REVIEW = 'UNDER_REVIEW',

  /** Additional information requested */
  INFO_REQUESTED = 'INFO_REQUESTED',

  /** Approved and account activated */
  APPROVED = 'APPROVED',

  /** Rejected */
  REJECTED = 'REJECTED',

  /** Application withdrawn by applicant */
  WITHDRAWN = 'WITHDRAWN',
}

/**
 * Business type enum
 */
export enum BusinessType {
  DAY_SPA = 'DAY_SPA',
  MEDICAL_SPA = 'MEDICAL_SPA',
  SALON = 'SALON',
  WELLNESS_CENTER = 'WELLNESS_CENTER',
  CLINIC = 'CLINIC',
  INDEPENDENT_PRACTITIONER = 'INDEPENDENT_PRACTITIONER',
  RETAIL_STORE = 'RETAIL_STORE',
  OTHER = 'OTHER',
}

/**
 * License type enum
 */
export enum LicenseType {
  ESTHETICIAN = 'ESTHETICIAN',
  COSMETOLOGIST = 'COSMETOLOGIST',
  MASSAGE_THERAPIST = 'MASSAGE_THERAPIST',
  MEDICAL_DIRECTOR = 'MEDICAL_DIRECTOR',
  NURSE_PRACTITIONER = 'NURSE_PRACTITIONER',
  BUSINESS_LICENSE = 'BUSINESS_LICENSE',
  OTHER = 'OTHER',
}

/**
 * Business address interface
 */
export interface BusinessAddress {
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Document upload interface
 */
export interface UploadedDocument {
  /** Unique file ID */
  id: string;

  /** Original filename */
  filename: string;

  /** File URL */
  url: string;

  /** File size in bytes */
  size: number;

  /** MIME type */
  mimeType: string;

  /** Upload timestamp */
  uploadedAt: string;

  /** Document type/category */
  documentType: LicenseType | 'LOCATION_PHOTO' | 'RESALE_CERTIFICATE' | 'OTHER';
}

/**
 * License verification result from third-party service
 */
export interface LicenseVerificationResult {
  /** Whether verification was successful */
  verified: boolean;

  /** Verification provider (e.g., "StateBoard", "Manual") */
  provider: string;

  /** Verification timestamp */
  verifiedAt: string;

  /** License number from verification */
  licenseNumber?: string;

  /** License expiration date from verification */
  expirationDate?: string;

  /** Additional verification details */
  details?: Record<string, any>;

  /** Error message if verification failed */
  error?: string;
}

/**
 * Wholesale Application Entity
 */
@Entity('wholesale_application')
export class WholesaleApplication extends VendureEntity {
  constructor(input?: DeepPartial<WholesaleApplication>) {
    super(input);
  }

  /** User who submitted the application */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('varchar')
  userId: ID;

  /** Business legal name */
  @Column({ type: 'varchar', length: 255 })
  businessName: string;

  /** Business type */
  @Column({
    type: 'enum',
    enum: BusinessType,
  })
  businessType: BusinessType;

  /** Tax ID / EIN */
  @Column({ type: 'varchar', length: 50, nullable: true })
  taxId: string;

  /** Business address */
  @Column({ type: 'jsonb' })
  businessAddress: BusinessAddress;

  /** Years in operation */
  @Column({ type: 'int', nullable: true })
  yearsInOperation: number;

  /** Website URL */
  @Column({ type: 'varchar', length: 255, nullable: true })
  websiteUrl: string;

  /** Phone number */
  @Column({ type: 'varchar', length: 50 })
  phoneNumber: string;

  /** License documents (array of uploaded documents) */
  @Column({ type: 'jsonb', default: [] })
  licenseDocuments: UploadedDocument[];

  /** Location photos (array of uploaded photos) */
  @Column({ type: 'jsonb', default: [] })
  locationPhotos: UploadedDocument[];

  /** Wholesale paperwork signed */
  @Column({ type: 'boolean', default: false })
  wholesalePaperworkSigned: boolean;

  /** Application status */
  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  /** Curator who reviewed the application */
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'reviewed_by' })
  reviewedBy: User;

  @Column({ type: 'varchar', nullable: true })
  reviewedById: ID;

  /** Curator's review notes */
  @Column({ type: 'text', nullable: true })
  reviewNotes: string;

  /** Rejection reason (if rejected) */
  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  /** Third-party license verification result */
  @Column({ type: 'jsonb', nullable: true })
  verificationResult: LicenseVerificationResult;

  /** Submitted at timestamp */
  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date;

  /** Reviewed at timestamp */
  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  /** Approved at timestamp */
  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  /** Additional notes from applicant */
  @Column({ type: 'text', nullable: true })
  applicantNotes: string;

  /**
   * Helper: Check if application is pending review
   */
  isPending(): boolean {
    return this.status === ApplicationStatus.PENDING ||
           this.status === ApplicationStatus.UNDER_REVIEW;
  }

  /**
   * Helper: Check if application is approved
   */
  isApproved(): boolean {
    return this.status === ApplicationStatus.APPROVED;
  }

  /**
   * Helper: Check if application can be reviewed
   */
  canBeReviewed(): boolean {
    return this.status === ApplicationStatus.PENDING ||
           this.status === ApplicationStatus.UNDER_REVIEW ||
           this.status === ApplicationStatus.INFO_REQUESTED;
  }

  /**
   * Helper: Get total document count
   */
  getTotalDocumentCount(): number {
    return (this.licenseDocuments?.length || 0) +
           (this.locationPhotos?.length || 0);
  }

  /**
   * Helper: Check if has minimum required documents
   * Requirement: At least 1 license document and 3 location photos
   */
  hasMinimumDocuments(): boolean {
    return (this.licenseDocuments?.length || 0) >= 1 &&
           (this.locationPhotos?.length || 0) >= 3;
  }
}
