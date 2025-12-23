/**
 * SkincareAtomTensor Entity
 * 17-D domain-specific tensor vectors for skincare matching
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { SkincareAtom } from './skincare-atom.entity';

@Entity({ schema: 'jade', name: 'skincare_atom_tensors' })
export class SkincareAtomTensor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'atom_id', type: 'uuid', unique: true })
  atomId: string;

  @OneToOne(() => SkincareAtom, (atom) => atom.tensor)
  @JoinColumn({ name: 'atom_id' })
  atom: SkincareAtom;

  // 17-D Skincare Domain Tensor
  @Column({ name: 'hydration_index', type: 'decimal', precision: 5, scale: 4, default: 0 })
  hydrationIndex: number;

  @Column({ name: 'sebum_regulation', type: 'decimal', precision: 5, scale: 4, default: 0 })
  sebumRegulation: number;

  @Column({ name: 'anti_aging_potency', type: 'decimal', precision: 5, scale: 4, default: 0 })
  antiAgingPotency: number;

  @Column({ name: 'brightening_efficacy', type: 'decimal', precision: 5, scale: 4, default: 0 })
  brighteningEfficacy: number;

  @Column({ name: 'anti_inflammatory', type: 'decimal', precision: 5, scale: 4, default: 0 })
  antiInflammatory: number;

  @Column({ name: 'barrier_repair', type: 'decimal', precision: 5, scale: 4, default: 0 })
  barrierRepair: number;

  @Column({ name: 'exfoliation_strength', type: 'decimal', precision: 5, scale: 4, default: 0 })
  exfoliationStrength: number;

  @Column({ name: 'antioxidant_capacity', type: 'decimal', precision: 5, scale: 4, default: 0 })
  antioxidantCapacity: number;

  @Column({ name: 'collagen_stimulation', type: 'decimal', precision: 5, scale: 4, default: 0 })
  collagenStimulation: number;

  @Column({ name: 'sensitivity_risk', type: 'decimal', precision: 5, scale: 4, default: 0 })
  sensitivityRisk: number;

  @Column({ name: 'photosensitivity', type: 'decimal', precision: 5, scale: 4, default: 0 })
  photosensitivity: number;

  @Column({ name: 'ph_dependency', type: 'decimal', precision: 5, scale: 4, default: 0 })
  phDependency: number;

  @Column({ name: 'molecular_penetration', type: 'decimal', precision: 5, scale: 4, default: 0 })
  molecularPenetration: number;

  @Column({ name: 'stability_rating', type: 'decimal', precision: 5, scale: 4, default: 0 })
  stabilityRating: number;

  @Column({ name: 'compatibility_score', type: 'decimal', precision: 5, scale: 4, default: 0 })
  compatibilityScore: number;

  @Column({ name: 'clinical_evidence_level', type: 'decimal', precision: 5, scale: 4, default: 0 })
  clinicalEvidenceLevel: number;

  @Column({ name: 'market_saturation', type: 'decimal', precision: 5, scale: 4, default: 0 })
  marketSaturation: number;

  // Precomputed 17-D vector for fast search
  @Column({ name: 'tensor_vector', type: 'real', array: true, nullable: true })
  tensorVector: number[] | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Get tensor as array for vector operations
   */
  toArray(): number[] {
    return [
      this.hydrationIndex,
      this.sebumRegulation,
      this.antiAgingPotency,
      this.brighteningEfficacy,
      this.antiInflammatory,
      this.barrierRepair,
      this.exfoliationStrength,
      this.antioxidantCapacity,
      this.collagenStimulation,
      this.sensitivityRisk,
      this.photosensitivity,
      this.phDependency,
      this.molecularPenetration,
      this.stabilityRating,
      this.compatibilityScore,
      this.clinicalEvidenceLevel,
      this.marketSaturation,
    ];
  }
}
