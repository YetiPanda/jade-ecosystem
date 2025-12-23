/**
 * SkinHealthProfile Entity
 *
 * DermaLogica Intelligence MVP - Phase 4: Skin Dashboard
 *
 * Tracks user skin profiles with:
 * - Skin type classification
 * - 17D tensor coordinates for current state
 * - Active skin concerns
 * - Lifestyle factors
 * - Historical observations
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

/**
 * Skin Type Classification
 */
export enum SkinType {
  NORMAL = 'NORMAL',
  DRY = 'DRY',
  OILY = 'OILY',
  COMBINATION = 'COMBINATION',
  SENSITIVE = 'SENSITIVE',
  MATURE = 'MATURE',
}

/**
 * Skin Concern Categories
 */
export enum SkinConcern {
  ACNE = 'ACNE',
  AGING = 'AGING',
  DARK_SPOTS = 'DARK_SPOTS',
  DRYNESS = 'DRYNESS',
  DULLNESS = 'DULLNESS',
  ENLARGED_PORES = 'ENLARGED_PORES',
  FINE_LINES = 'FINE_LINES',
  HYPERPIGMENTATION = 'HYPERPIGMENTATION',
  OILINESS = 'OILINESS',
  REDNESS = 'REDNESS',
  SENSITIVITY = 'SENSITIVITY',
  TEXTURE = 'TEXTURE',
  WRINKLES = 'WRINKLES',
  DEHYDRATION = 'DEHYDRATION',
  DARK_CIRCLES = 'DARK_CIRCLES',
  SAGGING = 'SAGGING',
}

/**
 * Lifestyle Factors
 */
export enum LifestyleFactor {
  HIGH_STRESS = 'HIGH_STRESS',
  POOR_SLEEP = 'POOR_SLEEP',
  HIGH_SUN_EXPOSURE = 'HIGH_SUN_EXPOSURE',
  SMOKER = 'SMOKER',
  HIGH_POLLUTION = 'HIGH_POLLUTION',
  ACTIVE_LIFESTYLE = 'ACTIVE_LIFESTYLE',
  DIET_BALANCED = 'DIET_BALANCED',
  DIET_HIGH_SUGAR = 'DIET_HIGH_SUGAR',
  HORMONAL_CHANGES = 'HORMONAL_CHANGES',
  MEDICATIONS = 'MEDICATIONS',
}

/**
 * 17D Tensor Coordinates for Skin State
 * All values are 0-1 scale
 */
export interface SkinTensorCoordinates {
  hydrationLevel: number;          // Current skin hydration
  oilProduction: number;           // Sebum production level
  barrierHealth: number;           // Skin barrier integrity
  elasticity: number;              // Skin elasticity/firmness
  pigmentation: number;            // Melanin distribution
  cellTurnover: number;            // Skin cell renewal rate
  inflammationLevel: number;       // Inflammation markers
  antioxidantCapacity: number;     // Natural antioxidant defense
  collagenDensity: number;         // Collagen levels
  microbiomeBalance: number;       // Skin microbiome health
  sensitivityIndex: number;        // Irritation threshold
  poreSize: number;                // Pore visibility
  surfaceTexture: number;          // Skin smoothness
  photoaging: number;              // Sun damage level
  pHBalance: number;               // Skin pH equilibrium
  circulation: number;             // Blood flow to skin
  environmentalProtection: number; // Defense against pollution
}

/**
 * Skin Concern with Severity
 */
export interface SkinConcernEntry {
  concern: SkinConcern;
  severity: number;     // 1-10 scale
  duration: string;     // "weeks", "months", "years"
  notes?: string;
}

@Entity({ schema: 'jade', name: 'skin_health_profile' })
@Index('idx_skin_profile_user', ['userId'])
export class SkinHealthProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'varchar', length: 36 })
  userId: string;

  @Column({
    name: 'skin_type',
    type: 'enum',
    enum: SkinType,
    enumName: 'skin_type',
  })
  skinType: SkinType;

  @Column({ name: 'sensitivity_level', type: 'integer', default: 5 })
  sensitivityLevel: number; // 1-10 scale

  @Column({
    name: 'current_tensor',
    type: 'jsonb',
    nullable: true,
  })
  currentTensor: SkinTensorCoordinates | null;

  @Column({
    name: 'ideal_tensor',
    type: 'jsonb',
    nullable: true,
  })
  idealTensor: SkinTensorCoordinates | null;

  @Column({
    name: 'concerns',
    type: 'jsonb',
    default: [],
  })
  concerns: SkinConcernEntry[];

  @Column({
    name: 'lifestyle_factors',
    type: 'simple-array',
    default: '',
  })
  lifestyleFactors: LifestyleFactor[];

  @Column({ type: 'integer', nullable: true })
  age: number | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  gender: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  location: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  climate: string | null;

  @Column({ name: 'fitzpatrick_type', type: 'integer', nullable: true })
  fitzpatrickType: number | null; // 1-6 Fitzpatrick scale

  @Column({ name: 'current_routine_description', type: 'text', nullable: true })
  currentRoutineDescription: string | null;

  @Column({ name: 'product_preferences', type: 'jsonb', nullable: true })
  productPreferences: any | null;

  @Column({ name: 'allergies', type: 'simple-array', default: '' })
  allergies: string[];

  @Column({ name: 'avoided_ingredients', type: 'simple-array', default: '' })
  avoidedIngredients: string[];

  @Column({ name: 'last_assessment_date', type: 'timestamp', nullable: true })
  lastAssessmentDate: Date | null;

  @Column({ name: 'profile_completeness', type: 'integer', default: 0 })
  profileCompleteness: number; // 0-100 percentage

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  /**
   * Get primary skin concerns (severity >= 7)
   */
  getPrimaryConcerns(): SkinConcernEntry[] {
    return this.concerns.filter((c) => c.severity >= 7);
  }

  /**
   * Get average concern severity
   */
  getAverageSeverity(): number {
    if (this.concerns.length === 0) return 0;
    const total = this.concerns.reduce((sum, c) => sum + c.severity, 0);
    return total / this.concerns.length;
  }

  /**
   * Calculate tensor deviation from ideal
   */
  getTensorDeviation(): number {
    if (!this.currentTensor || !this.idealTensor) return 0;

    const keys = Object.keys(this.currentTensor) as (keyof SkinTensorCoordinates)[];
    let totalDeviation = 0;

    for (const key of keys) {
      const current = this.currentTensor[key] || 0;
      const ideal = this.idealTensor[key] || 0;
      totalDeviation += Math.abs(current - ideal);
    }

    return totalDeviation / keys.length;
  }

  /**
   * Get tensor as array for visualization
   */
  getTensorArray(): number[] {
    if (!this.currentTensor) return new Array(17).fill(0);

    return [
      this.currentTensor.hydrationLevel || 0,
      this.currentTensor.oilProduction || 0,
      this.currentTensor.barrierHealth || 0,
      this.currentTensor.elasticity || 0,
      this.currentTensor.pigmentation || 0,
      this.currentTensor.cellTurnover || 0,
      this.currentTensor.inflammationLevel || 0,
      this.currentTensor.antioxidantCapacity || 0,
      this.currentTensor.collagenDensity || 0,
      this.currentTensor.microbiomeBalance || 0,
      this.currentTensor.sensitivityIndex || 0,
      this.currentTensor.poreSize || 0,
      this.currentTensor.surfaceTexture || 0,
      this.currentTensor.photoaging || 0,
      this.currentTensor.pHBalance || 0,
      this.currentTensor.circulation || 0,
      this.currentTensor.environmentalProtection || 0,
    ];
  }

  /**
   * Check if profile needs update
   */
  needsUpdate(): boolean {
    if (!this.lastAssessmentDate) return true;
    const daysSinceAssessment =
      (Date.now() - this.lastAssessmentDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceAssessment > 30; // Recommend update after 30 days
  }
}
