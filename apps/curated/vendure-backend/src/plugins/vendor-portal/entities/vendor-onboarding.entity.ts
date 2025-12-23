/**
 * Vendor Onboarding Entity
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.2: Application & Onboarding Schema (Task A.2.5)
 *
 * Tracks vendor onboarding progress after application approval.
 * Supports the marketing claim: "2 Weeks to First Order" - structured onboarding checklist.
 *
 * Onboarding consists of 8 required steps that vendors must complete
 * before their storefront goes live.
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { VendorApplication } from './vendor-application.entity';
import { OnboardingStep } from './onboarding-step.entity';

/**
 * Vendor Onboarding
 *
 * Created when application is APPROVED.
 * Tracks completion of onboarding steps with target 2-week completion.
 */
@Entity({ schema: 'jade', name: 'vendor_onboarding' })
export class VendorOnboarding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ──────────────────────────────────────────────────────────────
  // VENDOR REFERENCE
  // ──────────────────────────────────────────────────────────────

  /**
   * Reference to Vendure Seller ID
   * Set when vendor profile is created during onboarding
   */
  @Index('idx_vendor_onboarding_vendor_id')
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  vendorId: string | null;

  // ──────────────────────────────────────────────────────────────
  // APPLICATION LINK
  // ──────────────────────────────────────────────────────────────

  /**
   * Link to original application (one-to-one)
   */
  @OneToOne(() => VendorApplication, application => application.onboarding, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'application_id' })
  application: VendorApplication;

  @Column({ type: 'uuid', nullable: false })
  applicationId: string;

  // ──────────────────────────────────────────────────────────────
  // ONBOARDING STEPS
  // ──────────────────────────────────────────────────────────────

  /**
   * Onboarding steps (one-to-many)
   * 8 steps created on onboarding initialization
   */
  @OneToMany(() => OnboardingStep, step => step.onboarding, {
    cascade: true,
  })
  steps: OnboardingStep[];

  // ──────────────────────────────────────────────────────────────
  // PROGRESS TRACKING
  // ──────────────────────────────────────────────────────────────

  /**
   * Number of steps completed
   */
  @Column({ type: 'int', default: 0, nullable: false })
  completedSteps: number;

  /**
   * Total number of steps (always 8)
   */
  @Column({ type: 'int', default: 8, nullable: false })
  totalSteps: number;

  /**
   * Number of required steps remaining
   * Some steps are optional (like "Schedule Launch Call")
   */
  @Column({ type: 'int', default: 6, nullable: false })
  requiredStepsRemaining: number;

  /**
   * Percentage complete (0-100)
   */
  @Column({ type: 'int', default: 0, nullable: false })
  percentComplete: number;

  // ──────────────────────────────────────────────────────────────
  // SUPPORT
  // ──────────────────────────────────────────────────────────────

  /**
   * Assigned success manager
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  successManagerName: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  successManagerEmail: string | null;

  // ──────────────────────────────────────────────────────────────
  // TIMELINE
  // ──────────────────────────────────────────────────────────────

  /**
   * Onboarding start date (when application was approved)
   */
  @CreateDateColumn({ type: 'timestamptz' })
  startedAt: Date;

  /**
   * Target completion date (startedAt + 2 weeks)
   */
  @Column({ type: 'timestamptz', nullable: true })
  targetCompletionDate: Date | null;

  /**
   * Actual completion date (when all required steps are completed)
   */
  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  /**
   * Last update date
   */
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
