/**
 * Vendor Certification Entity
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.1: Vendor Profile Schema (Tasks A.1.7-A.1.9)
 *
 * Stores vendor certifications that require human-in-the-loop verification.
 * Each certification submission goes through a 3 business day review process
 * before being displayed as a trust badge on the vendor profile.
 *
 * Decision from decisions.md:
 * "Human-in-the-loop verification for final decision"
 * - Workflow: Vendor Uploads → Auto Pre-Check → Human Review → Decision
 * - SLA: 3 business days
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { CertificationType, CertificationStatus } from '../types/vendor.enums';
import { VendorProfile } from './vendor-profile.entity';

/**
 * Vendor Certification
 *
 * Represents an official certification submitted by a vendor for verification.
 * Certifications affect:
 * - Visibility score (+25% weight)
 * - Trust signals in vendor profile
 * - Values-based discovery ranking
 */
@Entity({ schema: 'jade', name: 'vendor_certification' })
export class VendorCertification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ──────────────────────────────────────────────────────────────
  // VENDOR RELATIONSHIP
  // ──────────────────────────────────────────────────────────────

  /**
   * Reference to vendor profile
   */
  @Index('idx_vendor_cert_profile_id')
  @ManyToOne(() => VendorProfile, profile => profile.certifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vendor_profile_id' })
  vendorProfile: VendorProfile;

  @Column({ type: 'uuid', nullable: false })
  vendorProfileId: string;

  // ──────────────────────────────────────────────────────────────
  // CERTIFICATION DETAILS (Task A.1.8)
  // ──────────────────────────────────────────────────────────────

  /**
   * Type of certification
   * Examples: USDA_ORGANIC, LEAPING_BUNNY, B_CORP
   */
  @Index('idx_vendor_cert_type')
  @Column({
    type: 'enum',
    enum: CertificationType,
    nullable: false,
  })
  type: CertificationType;

  /**
   * Certificate number (if applicable)
   * Example: "LB-2024-5847" for Leaping Bunny
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  certificateNumber: string | null;

  /**
   * Issuing body
   * Example: "Leaping Bunny Program", "USDA", "B Lab"
   * Populated from CertificationTypeMetadata
   */
  @Column({ type: 'varchar', length: 255, nullable: false })
  issuingBody: string;

  /**
   * Expiration date (if applicable)
   * Some certifications require annual renewal
   */
  @Column({ type: 'date', nullable: true })
  expirationDate: Date | null;

  // ──────────────────────────────────────────────────────────────
  // VERIFICATION WORKFLOW (Task A.1.9)
  // ──────────────────────────────────────────────────────────────

  /**
   * Verification status
   * Workflow: PENDING → UNDER_REVIEW → VERIFIED | REJECTED | EXPIRED
   */
  @Index('idx_vendor_cert_status')
  @Column({
    type: 'enum',
    enum: CertificationStatus,
    default: CertificationStatus.PENDING,
    nullable: false,
  })
  verificationStatus: CertificationStatus;

  /**
   * Document URL (proof of certification)
   * Required: PDF, JPG, or PNG upload to S3
   * Max 10MB
   */
  @Column({ type: 'varchar', length: 500, nullable: true })
  documentUrl: string | null;

  /**
   * Date when verification was completed
   * Set when status changes to VERIFIED or REJECTED
   */
  @Column({ type: 'timestamptz', nullable: true })
  verifiedAt: Date | null;

  /**
   * Admin user who verified the certification
   * FK to admin users table (to be created in admin phase)
   */
  @Column({ type: 'uuid', nullable: true })
  verifiedBy: string | null;

  /**
   * Reviewer name (for audit trail)
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  verifierName: string | null;

  /**
   * Rejection reason (if status = REJECTED)
   * Provides feedback to vendor on why certification was rejected
   */
  @Column({ type: 'text', nullable: true })
  rejectionReason: string | null;

  // ──────────────────────────────────────────────────────────────
  // SLA TRACKING
  // ──────────────────────────────────────────────────────────────

  /**
   * SLA deadline for verification (submitted + 3 business days)
   * Calculated at submission time
   */
  @Column({ type: 'timestamptz', nullable: true })
  slaDeadline: Date | null;

  // ──────────────────────────────────────────────────────────────
  // TIMESTAMPS
  // ──────────────────────────────────────────────────────────────

  /**
   * Submission date
   */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  /**
   * Last update date (status changes, etc.)
   */
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
