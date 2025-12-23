/**
 * AI System Registry Entity
 *
 * Sprint G1.2: AI System Inventory (ISO 42001 T1: AIMS Foundation)
 *
 * Maintains a registry of all AI systems in scope for governance.
 * Each AI system (Product Recommendation Engine, Ingredient Analyzer, etc.)
 * must be registered with risk assessment and oversight requirements.
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '@vendure/core';
import {
  AISystemType,
  RiskCategory,
  OversightLevel,
} from '../types/governance.enums';
import { AIComplianceState } from './ai-compliance-state.entity';
import { AIIncident } from './ai-incident.entity';
import { HumanOversightAction } from './human-oversight-action.entity';

/**
 * AI System Registry
 *
 * Tracks all AI systems requiring governance oversight per ISO 42001
 */
@Entity({ schema: 'jade', name: 'ai_system_registry' })
export class AISystemRegistry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * System name (e.g., "Product Recommendation Engine")
   */
  @Column({ type: 'varchar', length: 255, nullable: false })
  systemName: string;

  /**
   * AI system type classification
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    enum: AISystemType,
  })
  systemType: AISystemType;

  /**
   * Risk category per EU AI Act / ISO 42001
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    enum: RiskCategory,
  })
  riskCategory: RiskCategory;

  /**
   * Intended purpose of the AI system
   */
  @Column({ type: 'text', nullable: false })
  intendedPurpose: string;

  /**
   * Operational domain (e.g., "skincare_recommendations")
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  operationalDomain?: string;

  /**
   * Human oversight level required (ISO 42001 A.9)
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    enum: OversightLevel,
  })
  humanOversightLevel: OversightLevel;

  /**
   * Date of last risk assessment
   */
  @Column({ type: 'date', nullable: true })
  lastRiskAssessmentDate?: Date;

  /**
   * Next scheduled review date
   */
  @Column({ type: 'date', nullable: true })
  nextReviewDate?: Date;

  /**
   * Deployment date (when system went live)
   */
  @Column({ type: 'date', nullable: true })
  deploymentDate?: Date;

  /**
   * Whether the system is currently active/operational
   */
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  /**
   * System owner (User ID)
   */
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'owner_id' })
  owner?: User;

  @Column({ type: 'uuid', nullable: true })
  ownerId?: string;

  /**
   * Compliance states for this system
   */
  @OneToMany(() => AIComplianceState, (state) => state.system)
  complianceStates: AIComplianceState[];

  /**
   * Incidents affecting this system
   */
  @OneToMany(() => AIIncident, (incident) => incident.affectedSystem)
  incidents: AIIncident[];

  /**
   * Human oversight actions for this system
   */
  @OneToMany(() => HumanOversightAction, (action) => action.system)
  oversightActions: HumanOversightAction[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
