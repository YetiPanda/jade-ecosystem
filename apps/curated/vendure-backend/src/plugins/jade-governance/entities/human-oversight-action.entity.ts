/**
 * Human Oversight Action Entity
 *
 * Sprint G1.5: Human Oversight Tracking (ISO 42001 A.9 Control)
 *
 * Records human interventions, overrides, and approvals for AI decisions.
 * This provides evidence of human oversight required by ISO 42001 Annex A.9.
 *
 * Integration with existing JADE tables:
 * - Can link to data_corrections table for curator overrides
 * - Provides audit trail for compliance demonstration
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@vendure/core';
import { OversightActionType } from '../types/governance.enums';
import { AISystemRegistry } from './ai-system-registry.entity';

/**
 * Human Oversight Action
 *
 * Documents human oversight activities per ISO 42001 A.9 control.
 * Tracks when humans intervene in AI decision-making processes.
 */
@Entity({ schema: 'jade', name: 'human_oversight_action' })
export class HumanOversightAction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * AI System for which oversight was exercised
   */
  @ManyToOne(() => AISystemRegistry, (system) => system.oversightActions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'system_id' })
  system: AISystemRegistry;

  @Column({ type: 'uuid', nullable: false })
  systemId: string;

  /**
   * Type of oversight action
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    enum: OversightActionType,
  })
  actionType: OversightActionType;

  /**
   * User who triggered the oversight action
   */
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'triggered_by_id' })
  triggeredBy: User;

  @Column({ type: 'uuid', nullable: false })
  triggeredById: string;

  /**
   * ID of the recommendation or output that was subject to oversight
   * (Could be product recommendation ID, ingredient analysis ID, etc.)
   */
  @Column({ type: 'uuid', nullable: true })
  recommendationId?: string;

  /**
   * Original AI output before human intervention
   * Stored as JSONB for flexibility across different AI systems
   */
  @Column({ type: 'jsonb', nullable: true })
  originalOutput?: Record<string, any>;

  /**
   * Modified output after human intervention
   * Stored as JSONB for flexibility
   */
  @Column({ type: 'jsonb', nullable: true })
  modifiedOutput?: Record<string, any>;

  /**
   * Human justification for the oversight action
   * Required for compliance demonstration
   */
  @Column({ type: 'text', nullable: false })
  justification: string;

  /**
   * Risk assessment notes (optional)
   */
  @Column({ type: 'text', nullable: true })
  riskAssessment?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}

/**
 * Helper to create oversight action from data correction
 * Bridges the existing data_corrections table with governance tracking
 */
export interface DataCorrectionInput {
  correctionId: string;
  curatorId: string;
  originalValue: any;
  correctedValue: any;
  reason: string;
  entityType: string;
}

/**
 * Maps data correction types to AI systems
 */
export function mapCorrectionToSystem(entityType: string): string | null {
  const mapping: Record<string, string> = {
    product_recommendation: 'product-recommendation-engine',
    ingredient_analysis: 'ingredient-analyzer',
    constraint_violation: 'constraint-checker',
    tensor_search: 'tensor-similarity-search',
  };

  return mapping[entityType] || null;
}
