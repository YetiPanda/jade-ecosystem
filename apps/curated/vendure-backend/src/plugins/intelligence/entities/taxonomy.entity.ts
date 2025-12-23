/**
 * Taxonomy Entities for Product Classification
 * Week 3: Advanced Product Taxonomy
 *
 * TypeORM entities for the taxonomy lookup tables
 */

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

/**
 * Product Category - Hierarchical Categories (3 levels)
 */
@Entity({ schema: 'jade', name: 'product_category' })
export class ProductCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId: string | null;

  @ManyToOne(() => ProductCategory, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: ProductCategory | null;

  @Column({ type: 'integer' })
  level: number; // 1, 2, or 3

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'seo_slug', type: 'varchar', length: 255, unique: true })
  seoSlug: string;

  @Column({ name: 'display_order', type: 'integer', default: 0 })
  displayOrder: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

/**
 * Product Function - Multi-select functions (Hydrating, Exfoliating, etc.)
 */
@Entity({ schema: 'jade', name: 'product_function' })
export class ProductFunction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'category_compatibility', type: 'jsonb', nullable: true })
  categoryCompatibility: any; // Array of category IDs this function applies to

  @Column({ name: 'display_order', type: 'integer', default: 0 })
  displayOrder: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

/**
 * Skin Concern - Skin concerns (Acne, Aging, etc.)
 */
@Entity({ schema: 'jade', name: 'skin_concern' })
export class SkinConcern {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'severity_levels', type: 'jsonb', nullable: true })
  severityLevels: any; // Array of severity levels

  @Column({ name: 'related_ingredients', type: 'jsonb', nullable: true })
  relatedIngredients: any; // Array of ingredient names

  @Column({ name: 'display_order', type: 'integer', default: 0 })
  displayOrder: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

/**
 * Product Format - Product format/texture (Cream, Gel, Serum, etc.)
 */
@Entity({ schema: 'jade', name: 'product_format' })
export class ProductFormat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  category: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

/**
 * Target Area - Body areas (Face, Eye, Neck, etc.)
 */
@Entity({ schema: 'jade', name: 'target_area' })
export class TargetArea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

/**
 * Product Region - Geographic origin (K-Beauty, J-Beauty, etc.)
 */
@Entity({ schema: 'jade', name: 'product_region' })
export class ProductRegion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ name: 'country_code', type: 'varchar', length: 2, nullable: true })
  countryCode: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

/**
 * Usage Time Enum
 */
export enum UsageTime {
  MORNING = 'MORNING',
  EVENING = 'EVENING',
  ANYTIME = 'ANYTIME',
  NIGHT_ONLY = 'NIGHT_ONLY',
  POST_TREATMENT = 'POST_TREATMENT',
}

/**
 * Professional Level Enum
 */
export enum ProfessionalLevel {
  OTC = 'OTC',
  PROFESSIONAL = 'PROFESSIONAL',
  MEDICAL_GRADE = 'MEDICAL_GRADE',
  IN_OFFICE_ONLY = 'IN_OFFICE_ONLY',
}

/**
 * Product Taxonomy - Main junction table linking products to taxonomy
 */
@Entity({ schema: 'jade', name: 'product_taxonomy' })
export class ProductTaxonomy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string | null;

  @ManyToOne(() => ProductCategory)
  @JoinColumn({ name: 'category_id' })
  category: ProductCategory | null;

  // Multi-select fields (arrays of UUIDs)
  @Column({ name: 'primary_function_ids', type: 'uuid', array: true, nullable: true })
  primaryFunctionIds: string[] | null;

  @Column({ name: 'skin_concern_ids', type: 'uuid', array: true, nullable: true })
  skinConcernIds: string[] | null;

  @Column({ name: 'target_area_ids', type: 'uuid', array: true, nullable: true })
  targetAreaIds: string[] | null;

  // Single-select fields
  @Column({ name: 'product_format_id', type: 'uuid', nullable: true })
  productFormatId: string | null;

  @ManyToOne(() => ProductFormat)
  @JoinColumn({ name: 'product_format_id' })
  productFormat: ProductFormat | null;

  @Column({ name: 'region_id', type: 'uuid', nullable: true })
  regionId: string | null;

  @ManyToOne(() => ProductRegion)
  @JoinColumn({ name: 'region_id' })
  region: ProductRegion | null;

  // Usage metadata
  @Column({
    name: 'usage_time',
    type: 'enum',
    enum: UsageTime,
    default: UsageTime.ANYTIME,
  })
  usageTime: UsageTime;

  @Column({
    name: 'professional_level',
    type: 'enum',
    enum: ProfessionalLevel,
    default: ProfessionalLevel.OTC,
  })
  professionalLevel: ProfessionalLevel;

  @Column({ name: 'protocol_required', type: 'boolean', default: false })
  protocolRequired: boolean;

  @Column({ name: 'formulation_base', type: 'varchar', length: 100, nullable: true })
  formulationBase: string | null;

  // ========================================
  // Skincare-Specific Metadata (RDF Taxonomy)
  // ========================================

  @Column({ name: 'active_ingredients', type: 'jsonb', nullable: true })
  activeIngredients: any | null; // Array of ingredient names/objects

  @Column({ name: 'skin_types', type: 'jsonb', nullable: true })
  skinTypes: any | null; // Array of compatible skin types

  @Column({ name: 'price_tier', type: 'varchar', length: 20, nullable: true })
  priceTier: string | null; // $, $$, $$$, $$$$

  @Column({ type: 'varchar', length: 50, nullable: true })
  volume: string | null; // e.g., "30ml", "50ml", "1oz"

  @Column({ name: 'application_method', type: 'varchar', length: 100, nullable: true })
  applicationMethod: string | null; // e.g., "Apply to damp skin", "Massage gently"

  @Column({ name: 'use_frequency', type: 'varchar', length: 100, nullable: true })
  useFrequency: string | null; // e.g., "Twice daily", "Once daily evening"

  @Column({ name: 'fragrance_free', type: 'boolean', default: false })
  fragranceFree: boolean;

  @Column({ type: 'boolean', default: false })
  vegan: boolean;

  @Column({ name: 'cruelty_free', type: 'boolean', default: false })
  crueltyFree: boolean;

  @Column({ name: 'key_benefits', type: 'jsonb', nullable: true })
  keyBenefits: any | null; // Array of benefit strings

  @Column({ type: 'varchar', length: 50, nullable: true })
  texture: string | null; // e.g., "Gel", "Cream", "Serum", "Oil"

  @Column({ name: 'routine_step', type: 'varchar', length: 50, nullable: true })
  routineStep: string | null; // e.g., "Cleanse", "Treat", "Moisturize", "Protect"

  // Quality metrics
  @Column({ name: 'taxonomy_completeness_score', type: 'integer', nullable: true })
  taxonomyCompletenessScore: number | null;

  @Column({ name: 'last_reviewed_at', type: 'timestamp', nullable: true })
  lastReviewedAt: Date | null;

  @Column({ name: 'reviewed_by', type: 'uuid', nullable: true })
  reviewedBy: string | null;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

/**
 * Skin Type - Skin type compatibility for products
 */
@Entity({ schema: 'jade', name: 'skin_type' })
export class SkinType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'display_order', type: 'integer', default: 0 })
  displayOrder: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

/**
 * Export all taxonomy entities
 */
export const TaxonomyEntities = [
  ProductCategory,
  ProductFunction,
  SkinConcern,
  ProductFormat,
  TargetArea,
  ProductRegion,
  ProductTaxonomy,
  SkinType,
];
