/**
 * Vendor Application Entity
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.2: Application & Onboarding Schema (Tasks A.2.2-A.2.4)
 *
 * Stores vendor applications for marketplace admission.
 * Each application goes through a 3 business day review process with SLA tracking.
 *
 * Marketing claim supported:
 * "~3 Day Application Review" - SLA tracking ensures timely decisions
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApplicationStatus, RiskLevel, VendorValue, CertificationType } from '../types/vendor.enums';
import { VendorOnboarding } from './vendor-onboarding.entity';

/**
 * Application Documents
 */
interface ApplicationDocuments {
  productCatalogUrl?: string;
  lineSheetUrl?: string;
  insuranceCertificateUrl?: string;
  businessLicenseUrl?: string;
}

/**
 * Vendor Application
 *
 * Represents a vendor's application to join the JADE marketplace.
 * Tracks all submitted information, review status, and SLA compliance.
 */
@Entity({ schema: 'jade', name: 'vendor_application' })
export class VendorApplication {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ──────────────────────────────────────────────────────────────
  // APPLICATION STATUS (Task A.2.2)
  // ──────────────────────────────────────────────────────────────

  /**
   * Current application status
   * Workflow: SUBMITTED → UNDER_REVIEW → APPROVED | CONDITIONALLY_APPROVED | REJECTED
   */
  @Index('idx_vendor_app_status')
  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.SUBMITTED,
    nullable: false,
  })
  status: ApplicationStatus;

  // ──────────────────────────────────────────────────────────────
  // CONTACT INFORMATION (Task A.2.2)
  // ──────────────────────────────────────────────────────────────

  @Column({ type: 'varchar', length: 100, nullable: false })
  contactFirstName: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  contactLastName: string;

  @Index('idx_vendor_app_email')
  @Column({ type: 'varchar', length: 255, nullable: false })
  contactEmail: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contactPhone: string | null;

  @Column({ type: 'varchar', length: 100, nullable: false })
  contactRole: string;

  // ──────────────────────────────────────────────────────────────
  // COMPANY INFORMATION (Task A.2.2)
  // ──────────────────────────────────────────────────────────────

  @Index('idx_vendor_app_brand_name')
  @Column({ type: 'varchar', length: 255, nullable: false })
  brandName: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  legalName: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  website: string;

  @Column({ type: 'int', nullable: false })
  yearFounded: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  headquarters: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  employeeCount: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  annualRevenue: string | null;

  // ──────────────────────────────────────────────────────────────
  // PRODUCT INFORMATION (Task A.2.2)
  // ──────────────────────────────────────────────────────────────

  @Column({ type: 'simple-array', nullable: false })
  productCategories: string[];

  @Column({ type: 'varchar', length: 50, nullable: false })
  skuCount: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  priceRange: string;

  @Column({ type: 'simple-array', nullable: false })
  targetMarket: string[];

  @Column({ type: 'simple-array', nullable: true })
  currentDistribution: string[] | null;

  // ──────────────────────────────────────────────────────────────
  // VALUES & CERTIFICATIONS (Task A.2.2)
  // ──────────────────────────────────────────────────────────────

  @Column({ type: 'simple-array', nullable: false })
  values: string[];

  @Column({ type: 'simple-array', nullable: true })
  certifications: string[] | null;

  // ──────────────────────────────────────────────────────────────
  // WHY JADE (Task A.2.2)
  // ──────────────────────────────────────────────────────────────

  @Column({ type: 'text', nullable: false })
  whyJade: string;

  // ──────────────────────────────────────────────────────────────
  // DOCUMENTS (Task A.2.3)
  // ──────────────────────────────────────────────────────────────

  /**
   * Uploaded documents (S3 URLs)
   * {productCatalogUrl, lineSheetUrl, insuranceCertificateUrl, businessLicenseUrl}
   */
  @Column({ type: 'jsonb', nullable: true })
  documents: ApplicationDocuments | null;

  // ──────────────────────────────────────────────────────────────
  // REVIEW & DECISION (Task A.2.2)
  // ──────────────────────────────────────────────────────────────

  /**
   * Admin user assigned to review this application
   */
  @Index('idx_vendor_app_assignee')
  @Column({ type: 'uuid', nullable: true })
  assignedReviewerId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  assignedReviewerName: string | null;

  /**
   * Risk assessment (LOW, MEDIUM, HIGH, CRITICAL)
   * Auto-calculated based on business verification, financial checks, etc.
   */
  @Column({
    type: 'enum',
    enum: RiskLevel,
    nullable: true,
  })
  riskLevel: RiskLevel | null;

  /**
   * Risk assessment details (JSON)
   * {overallScore, factors: [{category, level, description}]}
   */
  @Column({ type: 'jsonb', nullable: true })
  riskAssessment: object | null;

  /**
   * Decision note from reviewer
   */
  @Column({ type: 'text', nullable: true })
  decisionNote: string | null;

  /**
   * Rejection reason (if status = REJECTED)
   */
  @Column({ type: 'text', nullable: true })
  rejectionReason: string | null;

  /**
   * Conditions (if status = CONDITIONALLY_APPROVED)
   * Array of conditions that must be met before full approval
   */
  @Column({ type: 'simple-array', nullable: true })
  approvalConditions: string[] | null;

  // ──────────────────────────────────────────────────────────────
  // SLA TRACKING (Task A.2.4)
  // ──────────────────────────────────────────────────────────────

  /**
   * SLA deadline (submitted + 3 business days)
   * Calculated at submission time
   */
  @Index('idx_vendor_app_sla_deadline')
  @Column({ type: 'timestamptz', nullable: true })
  slaDeadline: Date | null;

  /**
   * Date when decision was made (status changed to final state)
   */
  @Column({ type: 'timestamptz', nullable: true })
  decidedAt: Date | null;

  /**
   * Days in current status
   * Calculated field for admin dashboard
   */
  // This will be calculated in the service layer

  // ──────────────────────────────────────────────────────────────
  // RELATIONSHIPS
  // ──────────────────────────────────────────────────────────────

  /**
   * Link to onboarding (one-to-one)
   * Created when application is APPROVED
   */
  @OneToOne(() => VendorOnboarding, onboarding => onboarding.application, {
    nullable: true,
  })
  onboarding: VendorOnboarding | null;

  // ──────────────────────────────────────────────────────────────
  // TIMESTAMPS
  // ──────────────────────────────────────────────────────────────

  /**
   * Submission date
   */
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  /**
   * Last update date
   */
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
