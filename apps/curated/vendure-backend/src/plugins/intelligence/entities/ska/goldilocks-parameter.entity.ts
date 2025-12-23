/**
 * GoldilocksParameter Entity
 * Optimal range parameters for ingredients and protocols
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
import { SkincareAtom } from './skincare-atom.entity';
import { SourceType } from './skincare-relationship.entity';

@Entity({ schema: 'jade', name: 'goldilocks_parameters' })
export class GoldilocksParameter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'atom_id', type: 'uuid' })
  atomId: string;

  @ManyToOne(() => SkincareAtom, (atom) => atom.goldilocksParameters)
  @JoinColumn({ name: 'atom_id' })
  atom: SkincareAtom;

  @Column({ name: 'parameter_name', type: 'varchar', length: 255 })
  parameterName: string;

  @Column({ name: 'parameter_unit', type: 'varchar', length: 50, nullable: true })
  parameterUnit: string | null;

  // Goldilocks range (optimal zone)
  @Column({ name: 'optimal_min', type: 'decimal', precision: 12, scale: 4 })
  optimalMin: number;

  @Column({ name: 'optimal_max', type: 'decimal', precision: 12, scale: 4 })
  optimalMax: number;

  @Column({ name: 'absolute_min', type: 'decimal', precision: 12, scale: 4, nullable: true })
  absoluteMin: number | null;

  @Column({ name: 'absolute_max', type: 'decimal', precision: 12, scale: 4, nullable: true })
  absoluteMax: number | null;

  // Context
  @Column({ type: 'varchar', length: 255, nullable: true })
  context: string | null; // 'face', 'body', 'professional', 'home'

  @Column({ name: 'skin_type', type: 'varchar', length: 100, nullable: true })
  skinType: string | null; // 'oily', 'dry', 'sensitive', 'all'

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  // Evidence
  @Column({
    name: 'source_type',
    type: 'enum',
    enum: SourceType,
    enumName: 'source_type',
    nullable: true,
  })
  sourceType: SourceType | null;

  @Column({ name: 'source_url', type: 'varchar', length: 500, nullable: true })
  sourceUrl: string | null;

  @Column({ name: 'evidence_level', type: 'varchar', length: 50, nullable: true })
  evidenceLevel: string | null; // 'clinical_trial', 'observational', 'expert_consensus'

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Check if a value is within the optimal range
   */
  isOptimal(value: number): boolean {
    return value >= this.optimalMin && value <= this.optimalMax;
  }

  /**
   * Check if a value is within the absolute safe range
   */
  isSafe(value: number): boolean {
    const min = this.absoluteMin ?? this.optimalMin;
    const max = this.absoluteMax ?? this.optimalMax;
    return value >= min && value <= max;
  }

  /**
   * Get the deviation from optimal range
   * Returns 0 if within range, negative if below, positive if above
   */
  getDeviation(value: number): number {
    if (value < this.optimalMin) {
      return value - this.optimalMin;
    }
    if (value > this.optimalMax) {
      return value - this.optimalMax;
    }
    return 0;
  }
}
