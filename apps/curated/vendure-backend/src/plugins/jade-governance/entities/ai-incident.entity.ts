/**
 * AI Incident Entity
 *
 * Sprint G1.4: AI Incident Tracking with Tensor Positioning
 *
 * Tracks AI-related incidents through a 7-step response workflow.
 * Links to user-reported outcomes and positions incidents in 13-D space
 * for similarity search and pattern detection.
 *
 * Integration with existing JADE tables:
 * - Links to outcome_events table for user-reported adverse outcomes
 * - Can be triggered automatically when adverse outcome is reported
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
import {
  IncidentSeverity,
  IncidentStep,
  DetectionMethod,
} from '../types/governance.enums';
import { AISystemRegistry } from './ai-system-registry.entity';

/**
 * AI Incident
 *
 * Represents an AI-related incident requiring response and investigation
 * per ISO 42001 continual improvement requirements (T5).
 */
@Entity({ schema: 'jade', name: 'ai_incident' })
export class AIIncident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Incident title
   */
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  /**
   * Incident description
   */
  @Column({ type: 'text', nullable: false })
  description: string;

  /**
   * Link to user-reported outcome event (jade.outcome_events)
   * This connects AI incidents to user feedback loop
   */
  @Column({ type: 'uuid', nullable: true })
  outcomeEventId?: string;

  /**
   * Affected AI system
   */
  @ManyToOne(() => AISystemRegistry, (system) => system.incidents, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'affected_system_id' })
  affectedSystem: AISystemRegistry;

  @Column({ type: 'uuid', nullable: false })
  affectedSystemId: string;

  /**
   * Incident severity (FMEA-style)
   */
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    enum: IncidentSeverity,
  })
  severity: IncidentSeverity;

  /**
   * Current step in 7-step incident response workflow
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    enum: IncidentStep,
  })
  currentStep: IncidentStep;

  /**
   * How the incident was detected
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    enum: DetectionMethod,
  })
  detectionMethod?: DetectionMethod;

  /**
   * When the incident occurred
   */
  @Column({ type: 'timestamptz', nullable: false })
  occurredAt: Date;

  /**
   * When the incident was detected (may differ from occurredAt)
   */
  @Column({ type: 'timestamptz', nullable: false })
  detectedAt: Date;

  /**
   * When the incident was resolved (null if still open)
   */
  @Column({ type: 'timestamptz', nullable: true })
  resolvedAt?: Date;

  /**
   * Root cause analysis findings
   */
  @Column({ type: 'text', nullable: true })
  rootCause?: string;

  /**
   * Corrective actions taken
   */
  @Column({ type: 'text', nullable: true })
  correctiveAction?: string;

  /**
   * Lessons learned documentation
   */
  @Column({ type: 'text', nullable: true })
  lessonsLearned?: string;

  /**
   * Whether stakeholder notification was sent
   */
  @Column({ type: 'boolean', default: false })
  notificationSent: boolean;

  /**
   * 13-D incident tensor position for similarity search
   *
   * Dimensions (from FraseAI):
   * 0: severity_score (0-1)
   * 1: impact_breadth (0-1)
   * 2: impact_depth (0-1)
   * 3: detection_lag_hours (normalized)
   * 4: resolution_time_hours (normalized)
   * 5: regulatory_exposure (0-1)
   * 6: reputational_risk (0-1)
   * 7: technical_complexity (0-1)
   * 8: data_sensitivity (0-1)
   * 9: user_affected_count (normalized)
   * 10: financial_impact (normalized)
   * 11: recurrence_likelihood (0-1)
   * 12: systemic_risk (0-1)
   *
   * Stored as ARRAY for PostgreSQL pgvector compatibility
   */
  @Column({ type: 'float8', array: true, nullable: true })
  tensorPosition?: number[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

/**
 * Helper to initialize a 13-D tensor position for an incident
 * Returns a zero-initialized tensor that can be populated during assessment
 */
export function initializeIncidentTensor(): number[] {
  return new Array(13).fill(0);
}

/**
 * Tensor dimension indices for clarity
 */
export const TENSOR_DIMENSIONS = {
  SEVERITY_SCORE: 0,
  IMPACT_BREADTH: 1,
  IMPACT_DEPTH: 2,
  DETECTION_LAG: 3,
  RESOLUTION_TIME: 4,
  REGULATORY_EXPOSURE: 5,
  REPUTATIONAL_RISK: 6,
  TECHNICAL_COMPLEXITY: 7,
  DATA_SENSITIVITY: 8,
  USER_AFFECTED_COUNT: 9,
  FINANCIAL_IMPACT: 10,
  RECURRENCE_LIKELIHOOD: 11,
  SYSTEMIC_RISK: 12,
} as const;
