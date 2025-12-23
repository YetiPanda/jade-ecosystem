/**
 * AI Compliance State Entity
 *
 * Sprint G1.3: Compliance Assessment Tracking (ISO 42001 T3-T4)
 *
 * Tracks the compliance state for each ISO 42001 requirement clause
 * per AI system. Enables gap analysis and remediation planning.
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@vendure/core';
import { ComplianceStatus } from '../types/governance.enums';
import { AISystemRegistry } from './ai-system-registry.entity';

/**
 * AI Compliance State
 *
 * Represents the compliance status of a specific ISO 42001 requirement
 * for a specific AI system.
 */
@Entity({ schema: 'jade', name: 'ai_compliance_state' })
export class AIComplianceState {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * AI System being assessed
   */
  @ManyToOne(() => AISystemRegistry, (system) => system.complianceStates, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'system_id' })
  system: AISystemRegistry;

  @Column({ type: 'uuid', nullable: false })
  systemId: string;

  /**
   * ISO 42001 requirement clause (e.g., "iso42001_8.4.2", "iso42001_A.9")
   */
  @Column({ type: 'varchar', length: 50, nullable: false })
  requirementClause: string;

  /**
   * Human-readable title of the requirement
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  requirementTitle?: string;

  /**
   * Compliance status for this requirement
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    enum: ComplianceStatus,
  })
  complianceStatus: ComplianceStatus;

  /**
   * Notes about evidence collected for compliance
   */
  @Column({ type: 'text', nullable: true })
  evidenceNotes?: string;

  /**
   * Evidence artifact IDs (UUIDs pointing to document storage)
   * Stored as array for flexibility
   */
  @Column({ type: 'uuid', array: true, nullable: true })
  evidenceIds?: string[];

  /**
   * Assessor who performed the compliance assessment
   */
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assessed_by' })
  assessedBy?: User;

  @Column({ type: 'uuid', nullable: true })
  assessedById?: string;

  /**
   * Assessment timestamp
   */
  @Column({ type: 'timestamptz', nullable: true })
  assessedAt?: Date;

  /**
   * Gap analysis findings
   */
  @Column({ type: 'text', nullable: true })
  gapAnalysis?: string;

  /**
   * Remediation plan to address gaps
   */
  @Column({ type: 'text', nullable: true })
  remediationPlan?: string;

  /**
   * Target date for remediation completion
   */
  @Column({ type: 'date', nullable: true })
  targetDate?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
