/**
 * Onboarding Step Entity
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.2: Application & Onboarding Schema (Task A.2.6)
 *
 * Represents individual steps in the vendor onboarding checklist.
 * Each onboarding has 8 steps (6 required, 2 optional).
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
import { OnboardingStepStatus } from '../types/vendor.enums';
import { VendorOnboarding } from './vendor-onboarding.entity';

/**
 * Onboarding Step
 *
 * Tracks completion status of individual onboarding tasks.
 * Steps are created when VendorOnboarding is initialized.
 */
@Entity({ schema: 'jade', name: 'onboarding_step' })
export class OnboardingStep {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // ──────────────────────────────────────────────────────────────
  // ONBOARDING RELATIONSHIP
  // ──────────────────────────────────────────────────────────────

  /**
   * Link to parent onboarding
   */
  @Index('idx_onboarding_step_onboarding_id')
  @ManyToOne(() => VendorOnboarding, onboarding => onboarding.steps, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'onboarding_id' })
  onboarding: VendorOnboarding;

  @Column({ type: 'uuid', nullable: false })
  onboardingId: string;

  // ──────────────────────────────────────────────────────────────
  // STEP DETAILS
  // ──────────────────────────────────────────────────────────────

  /**
   * Step name (e.g., "Complete Brand Profile")
   */
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  /**
   * Step description
   */
  @Column({ type: 'text', nullable: true })
  description: string | null;

  /**
   * Display order (1-8)
   */
  @Column({ type: 'int', nullable: false })
  order: number;

  /**
   * Status (PENDING, IN_PROGRESS, COMPLETED, SKIPPED)
   */
  @Index('idx_onboarding_step_status')
  @Column({
    type: 'enum',
    enum: OnboardingStepStatus,
    default: OnboardingStepStatus.PENDING,
    nullable: false,
  })
  status: OnboardingStepStatus;

  /**
   * Whether this step is required (cannot skip)
   * 6 required steps, 2 optional steps
   */
  @Column({ type: 'boolean', default: true, nullable: false })
  required: boolean;

  /**
   * Help article URL
   * Link to documentation for this step
   */
  @Column({ type: 'varchar', length: 500, nullable: true })
  helpArticleUrl: string | null;

  // ──────────────────────────────────────────────────────────────
  // COMPLETION TRACKING
  // ──────────────────────────────────────────────────────────────

  /**
   * Date when step was completed
   */
  @Column({ type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  // ──────────────────────────────────────────────────────────────
  // TIMESTAMPS
  // ──────────────────────────────────────────────────────────────

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
