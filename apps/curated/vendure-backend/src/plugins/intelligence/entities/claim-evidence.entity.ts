/**
 * ClaimEvidence Entity
 * Scientific citations and evidence for skincare claims
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
import { SkincareAtom } from './ska/skincare-atom.entity';
import { EvidenceLevel } from '../types/intelligence.enums';

@Entity({ schema: 'jade', name: 'claim_evidence' })
export class ClaimEvidence {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'atom_id', type: 'uuid' })
  atomId: string;

  @ManyToOne(() => SkincareAtom, (atom) => atom.claimEvidences, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'atom_id' })
  atom: SkincareAtom;

  @Column({ type: 'varchar', length: 500 })
  claim: string;

  @Column({
    name: 'evidence_level',
    type: 'enum',
    enum: EvidenceLevel,
    enumName: 'evidence_level',
  })
  evidenceLevel: EvidenceLevel;

  @Column({ name: 'study_type', type: 'varchar', length: 100, nullable: true })
  studyType: string | null;

  @Column({ name: 'sample_size', type: 'integer', nullable: true })
  sampleSize: number | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  duration: string | null;

  @Column({ type: 'text', nullable: true })
  findings: string | null;

  @Column({ name: 'source_url', type: 'varchar', length: 500, nullable: true })
  sourceUrl: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  citation: string | null;

  @Column({ name: 'publication_year', type: 'integer', nullable: true })
  publicationYear: number | null;

  @Column({ name: 'peer_reviewed', type: 'boolean', default: false })
  peerReviewed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Get the evidence strength as a number (0-1)
   */
  getEvidenceStrength(): number {
    const strengthMap: Record<EvidenceLevel, number> = {
      [EvidenceLevel.ANECDOTAL]: 0.14,
      [EvidenceLevel.IN_VITRO]: 0.28,
      [EvidenceLevel.ANIMAL]: 0.42,
      [EvidenceLevel.HUMAN_PILOT]: 0.57,
      [EvidenceLevel.HUMAN_CONTROLLED]: 0.71,
      [EvidenceLevel.META_ANALYSIS]: 0.85,
      [EvidenceLevel.GOLD_STANDARD]: 1.0,
    };
    return strengthMap[this.evidenceLevel] ?? 0;
  }

  /**
   * Check if evidence meets a minimum threshold
   */
  meetsMinimumLevel(minLevel: EvidenceLevel): boolean {
    const levels = Object.values(EvidenceLevel);
    const currentIndex = levels.indexOf(this.evidenceLevel);
    const minIndex = levels.indexOf(minLevel);
    return currentIndex >= minIndex;
  }

  /**
   * Format citation for display
   */
  formatCitation(): string {
    if (this.citation) {
      return this.citation;
    }

    const parts: string[] = [];
    if (this.studyType) parts.push(this.studyType);
    if (this.sampleSize) parts.push(`n=${this.sampleSize}`);
    if (this.duration) parts.push(this.duration);
    if (this.publicationYear) parts.push(`(${this.publicationYear})`);

    return parts.join(', ') || 'No citation available';
  }
}
