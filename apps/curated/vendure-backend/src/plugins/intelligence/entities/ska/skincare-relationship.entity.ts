/**
 * SkincareRelationship Entity
 * Semantic and causal relationships between atoms
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SkincareAtom } from './skincare-atom.entity';

export enum SkincareRelationshipType {
  ENABLES = 'ENABLES',
  INHIBITS = 'INHIBITS',
  PREREQUISITE_OF = 'PREREQUISITE_OF',
  CONSEQUENCE_OF = 'CONSEQUENCE_OF',
  FORMULATED_WITH = 'FORMULATED_WITH',
  SYNERGIZES_WITH = 'SYNERGIZES_WITH',
  CONFLICTS_WITH = 'CONFLICTS_WITH',
  REPLACES = 'REPLACES',
  ACQUIRES = 'ACQUIRES',
  COMPETES_WITH = 'COMPETES_WITH',
  OWNED_BY = 'OWNED_BY',
  REGULATES = 'REGULATES',
  RESTRICTS = 'RESTRICTS',
  APPROVES = 'APPROVES',
  INFLUENCES = 'INFLUENCES',
  DISRUPTS = 'DISRUPTS',
}

export enum SourceType {
  PEER_REVIEWED = 'PEER_REVIEWED',
  REGULATORY_DOCUMENT = 'REGULATORY_DOCUMENT',
  PATENT = 'PATENT',
  MARKET_RESEARCH = 'MARKET_RESEARCH',
  COMPANY_FILING = 'COMPANY_FILING',
  INDUSTRY_REPORT = 'INDUSTRY_REPORT',
}

@Entity({ schema: 'jade', name: 'skincare_relationships' })
export class SkincareRelationship {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'from_atom_id', type: 'uuid' })
  fromAtomId: string;

  @ManyToOne(() => SkincareAtom, (atom) => atom.outgoingRelationships)
  @JoinColumn({ name: 'from_atom_id' })
  fromAtom: SkincareAtom;

  @Column({ name: 'to_atom_id', type: 'uuid' })
  toAtomId: string;

  @ManyToOne(() => SkincareAtom, (atom) => atom.incomingRelationships)
  @JoinColumn({ name: 'to_atom_id' })
  toAtom: SkincareAtom;

  @Column({
    name: 'relationship_type',
    type: 'enum',
    enum: SkincareRelationshipType,
    enumName: 'skincare_relationship_type',
  })
  relationshipType: SkincareRelationshipType;

  @Column({ type: 'decimal', precision: 5, scale: 4, default: 0.5 })
  strength: number;

  @Column({ name: 'established_year', type: 'integer', nullable: true })
  establishedYear: number | null;

  @Column({ name: 'evidence_description', type: 'text', nullable: true })
  evidenceDescription: string | null;

  @Column({ name: 'source_url', type: 'varchar', length: 500, nullable: true })
  sourceUrl: string | null;

  @Column({
    name: 'source_type',
    type: 'enum',
    enum: SourceType,
    enumName: 'source_type',
    nullable: true,
  })
  sourceType: SourceType | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
