/**
 * SkincareAtom Entity
 * Knowledge units with progressive disclosure for skincare domain
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { SkincarePillar } from './skincare-pillar.entity';
import { SkincareAtomTensor } from './skincare-tensor.entity';
import { SkincareRelationship } from './skincare-relationship.entity';
import { GoldilocksParameter } from './goldilocks-parameter.entity';
import { ClaimEvidence } from '../claim-evidence.entity';
import { EfficacyIndicator } from '../efficacy-indicator.entity';
import { KnowledgeThreshold } from '../../types/intelligence.enums';

export enum SkincareAtomType {
  COMPANY = 'COMPANY',
  BRAND = 'BRAND',
  PRODUCT = 'PRODUCT',
  INGREDIENT = 'INGREDIENT',
  REGULATION = 'REGULATION',
  TREND = 'TREND',
  SCIENTIFIC_CONCEPT = 'SCIENTIFIC_CONCEPT',
  MARKET_DATA = 'MARKET_DATA',
}

export enum MarketSegment {
  MASS = 'MASS',
  PRESTIGE = 'PRESTIGE',
  LUXURY = 'LUXURY',
  MEDICAL = 'MEDICAL',
  NATURAL = 'NATURAL',
}

export enum PricePoint {
  BUDGET = 'BUDGET',
  MID_RANGE = 'MID_RANGE',
  PREMIUM = 'PREMIUM',
  LUXURY = 'LUXURY',
}

@Entity({ schema: 'jade', name: 'skincare_atoms' })
export class SkincareAtom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'pillar_id', type: 'uuid' })
  pillarId: string;

  @ManyToOne(() => SkincarePillar, (pillar) => pillar.atoms)
  @JoinColumn({ name: 'pillar_id' })
  pillar: SkincarePillar;

  @Column({
    name: 'atom_type',
    type: 'enum',
    enum: SkincareAtomType,
    enumName: 'skincare_atom_type',
  })
  atomType: SkincareAtomType;

  // Core identification
  @Column({ type: 'varchar', length: 500 })
  title: string;

  @Column({ type: 'varchar', length: 500, unique: true })
  slug: string;

  // Temporal data
  @Column({ name: 'year_established', type: 'integer', nullable: true })
  yearEstablished: number | null;

  @Column({ name: 'year_introduced', type: 'integer', nullable: true })
  yearIntroduced: number | null;

  @Column({ name: 'patent_year', type: 'integer', nullable: true })
  patentYear: number | null;

  @Column({ name: 'regulation_year', type: 'integer', nullable: true })
  regulationYear: number | null;

  @Column({ name: 'trend_emergence_year', type: 'integer', nullable: true })
  trendEmergenceYear: number | null;

  // Progressive disclosure content
  @Column({ name: 'glance_text', type: 'varchar', length: 500 })
  glanceText: string;

  @Column({ name: 'scan_text', type: 'varchar', length: 2000 })
  scanText: string;

  @Column({ name: 'study_text', type: 'text' })
  studyText: string;

  // Skincare classification
  @Column({
    name: 'market_segment',
    type: 'enum',
    enum: MarketSegment,
    enumName: 'market_segment',
    nullable: true,
  })
  marketSegment: MarketSegment | null;

  @Column({
    name: 'price_point',
    type: 'enum',
    enum: PricePoint,
    enumName: 'price_point',
    nullable: true,
  })
  pricePoint: PricePoint | null;

  @Column({ name: 'target_demographics', type: 'text', array: true, nullable: true })
  targetDemographics: string[] | null;

  @Column({ name: 'key_ingredients', type: 'text', array: true, nullable: true })
  keyIngredients: string[] | null;

  // Ingredient-specific fields
  @Column({ name: 'inci_name', type: 'varchar', length: 500, nullable: true })
  inciName: string | null;

  @Column({ name: 'cas_number', type: 'varchar', length: 50, nullable: true })
  casNumber: string | null;

  @Column({ name: 'molecular_formula', type: 'varchar', length: 100, nullable: true })
  molecularFormula: string | null;

  @Column({ name: 'molecular_weight', type: 'decimal', precision: 12, scale: 4, nullable: true })
  molecularWeight: number | null;

  @Column({ name: 'max_concentration', type: 'decimal', precision: 5, scale: 2, nullable: true })
  maxConcentration: number | null;

  @Column({ name: 'ph_range_min', type: 'decimal', precision: 4, scale: 2, nullable: true })
  phRangeMin: number | null;

  @Column({ name: 'ph_range_max', type: 'decimal', precision: 4, scale: 2, nullable: true })
  phRangeMax: number | null;

  // Market metrics
  @Column({ name: 'market_cap', type: 'bigint', nullable: true })
  marketCap: number | null;

  @Column({ name: 'annual_revenue', type: 'bigint', nullable: true })
  annualRevenue: number | null;

  @Column({ name: 'market_share', type: 'decimal', precision: 5, scale: 4, nullable: true })
  marketShare: number | null;

  @Column({ name: 'growth_rate', type: 'decimal', precision: 7, scale: 4, nullable: true })
  growthRate: number | null;

  // Scores (0-1)
  @Column({ name: 'innovation_score', type: 'decimal', precision: 5, scale: 4, nullable: true })
  innovationScore: number | null;

  @Column({ name: 'sustainability_score', type: 'decimal', precision: 5, scale: 4, nullable: true })
  sustainabilityScore: number | null;

  @Column({ name: 'efficacy_score', type: 'decimal', precision: 5, scale: 4, nullable: true })
  efficacyScore: number | null;

  // Regulatory compliance
  @Column({ name: 'fda_approved', type: 'boolean', default: false })
  fdaApproved: boolean;

  @Column({ name: 'eu_compliant', type: 'boolean', default: false })
  euCompliant: boolean;

  @Column({ name: 'cruelty_free', type: 'boolean', default: false })
  crueltyFree: boolean;

  @Column({ name: 'clean_beauty', type: 'boolean', default: false })
  cleanBeauty: boolean;

  @Column({ name: 'vegan_certified', type: 'boolean', default: false })
  veganCertified: boolean;

  // Media assets
  @Column({ name: 'logo_url', type: 'varchar', length: 500, nullable: true })
  logoUrl: string | null;

  @Column({ name: 'product_image_url', type: 'varchar', length: 500, nullable: true })
  productImageUrl: string | null;

  @Column({ name: 'infographic_url', type: 'varchar', length: 500, nullable: true })
  infographicUrl: string | null;

  @Column({ name: 'video_url', type: 'varchar', length: 500, nullable: true })
  videoUrl: string | null;

  @Column({ name: 'banner_image_url', type: 'varchar', length: 500, nullable: true })
  bannerImageUrl: string | null;

  @Column({ name: 'image_urls', type: 'text', array: true, nullable: true })
  imageUrls: string[] | null;

  // Hierarchical relationships
  @Column({ name: 'parent_company_id', type: 'uuid', nullable: true })
  parentCompanyId: string | null;

  @ManyToOne(() => SkincareAtom, { nullable: true })
  @JoinColumn({ name: 'parent_company_id' })
  parentCompany: SkincareAtom | null;

  // Vector embeddings
  @Column({ name: 'embedding_792d', type: 'real', array: true, nullable: true })
  embedding792d: number[] | null;

  @Column({ name: 'embedding_id', type: 'varchar', length: 100, nullable: true })
  embeddingId: string | null;

  // Featured content
  @Column({ type: 'boolean', default: false })
  featured: boolean;

  @Column({ name: 'featured_order', type: 'integer', nullable: true })
  featuredOrder: number | null;

  @Column({ name: 'view_count', type: 'integer', default: 0 })
  viewCount: number;

  // Sources and metadata
  @Column({ type: 'jsonb', nullable: true })
  sources: any;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  // Purging information
  @Column({ name: 'causes_purging', type: 'boolean', default: false })
  causesPurging: boolean;

  @Column({ name: 'purging_duration_weeks', type: 'integer', nullable: true })
  purgingDurationWeeks: number | null;

  @Column({ name: 'purging_description', type: 'text', nullable: true })
  purgingDescription: string | null;

  // Relations
  @OneToOne(() => SkincareAtomTensor, (tensor) => tensor.atom)
  tensor: SkincareAtomTensor;

  @OneToMany(() => SkincareRelationship, (rel) => rel.fromAtom)
  outgoingRelationships: SkincareRelationship[];

  @OneToMany(() => SkincareRelationship, (rel) => rel.toAtom)
  incomingRelationships: SkincareRelationship[];

  @OneToMany(() => GoldilocksParameter, (param) => param.atom)
  goldilocksParameters: GoldilocksParameter[];

  // Intelligence MVP relations
  @OneToMany(() => ClaimEvidence, (evidence) => evidence.atom)
  claimEvidences: ClaimEvidence[];

  @OneToMany(() => EfficacyIndicator, (indicator) => indicator.atom)
  efficacyIndicators: EfficacyIndicator[];

  // Intelligence MVP columns
  /**
   * Knowledge Threshold (T1-T8)
   * Determines access level and knowledge depth for this atom
   */
  @Column({
    name: 'knowledge_threshold',
    type: 'enum',
    enum: KnowledgeThreshold,
    enumName: 'knowledge_threshold',
    nullable: true,
  })
  knowledgeThreshold: KnowledgeThreshold | null;

  /**
   * Explanation of how/why an ingredient or concept works
   * Used for causal chain navigation and mechanism explanation
   */
  @Column({ name: 'why_it_works', type: 'text', nullable: true })
  whyItWorks: string | null;

  /**
   * Brief summary of causal relationships
   * e.g., "Inhibits tyrosinase → Reduces melanin → Brightens skin"
   */
  @Column({ name: 'causal_summary', type: 'text', nullable: true })
  causalSummary: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
