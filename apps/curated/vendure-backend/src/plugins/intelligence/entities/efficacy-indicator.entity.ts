/**
 * EfficacyIndicator Entity
 * Efficacy metrics and expected improvements for skincare ingredients
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SkincareAtom } from './ska/skincare-atom.entity';
import { EvidenceLevel } from '../types/intelligence.enums';

@Entity({ schema: 'jade', name: 'efficacy_indicator' })
export class EfficacyIndicator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'atom_id', type: 'uuid' })
  atomId: string;

  @ManyToOne(() => SkincareAtom, (atom) => atom.efficacyIndicators, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'atom_id' })
  atom: SkincareAtom;

  /**
   * Type of efficacy indicator
   * e.g., 'visible_improvement', 'barrier_function', 'hydration_level', 'wrinkle_reduction'
   */
  @Column({ name: 'indicator_type', type: 'varchar', length: 100 })
  indicatorType: string;

  /**
   * Metric being measured
   * e.g., 'TEWL reduction', 'skin roughness (Ra)', 'wrinkle depth (mm)'
   */
  @Column({ type: 'varchar', length: 200 })
  metric: string;

  /**
   * Timeframe for expected results
   * e.g., '2 weeks', '4 weeks', '8 weeks', '12 weeks'
   */
  @Column({ type: 'varchar', length: 50 })
  timeframe: string;

  /**
   * Expected improvement percentage or absolute value
   * e.g., 25.5 for 25.5% improvement
   */
  @Column({
    name: 'expected_improvement',
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  expectedImprovement: number;

  /**
   * Confidence interval (if available)
   * e.g., 5.2 for +/- 5.2%
   */
  @Column({
    name: 'confidence_interval',
    type: 'decimal',
    precision: 10,
    scale: 4,
    nullable: true,
  })
  confidenceInterval: number | null;

  @Column({
    name: 'evidence_level',
    type: 'enum',
    enum: EvidenceLevel,
    enumName: 'evidence_level',
  })
  evidenceLevel: EvidenceLevel;

  /**
   * Optimal conditions for achieving this efficacy
   * e.g., 'twice daily application', 'pH 5.5 formulation', 'with vitamin E'
   */
  @Column({ type: 'text', nullable: true })
  conditions: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  /**
   * Calculate the improvement range based on confidence interval
   */
  getImprovementRange(): { min: number; max: number } {
    if (this.confidenceInterval === null) {
      return { min: this.expectedImprovement, max: this.expectedImprovement };
    }
    return {
      min: this.expectedImprovement - this.confidenceInterval,
      max: this.expectedImprovement + this.confidenceInterval,
    };
  }

  /**
   * Format the expected improvement for display
   */
  formatImprovement(): string {
    const base = `${this.expectedImprovement.toFixed(1)}%`;
    if (this.confidenceInterval !== null) {
      return `${base} (±${this.confidenceInterval.toFixed(1)}%)`;
    }
    return base;
  }

  /**
   * Check if the indicator has high-quality evidence
   */
  hasHighQualityEvidence(): boolean {
    const highQualityLevels = [
      EvidenceLevel.HUMAN_CONTROLLED,
      EvidenceLevel.META_ANALYSIS,
      EvidenceLevel.GOLD_STANDARD,
    ];
    return highQualityLevels.includes(this.evidenceLevel);
  }

  /**
   * Parse timeframe into weeks for comparison
   */
  getTimeframeWeeks(): number {
    const match = this.timeframe.match(/(\d+)\s*(week|day|month)/i);
    if (!match) return 0;

    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case 'day':
        return Math.ceil(value / 7);
      case 'week':
        return value;
      case 'month':
        return value * 4;
      default:
        return 0;
    }
  }
}
