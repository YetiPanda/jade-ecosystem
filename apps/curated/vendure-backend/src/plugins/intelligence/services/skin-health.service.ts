/**
 * SkinHealthService
 *
 * DermaLogica Intelligence MVP - Phase 4: Skin Dashboard
 *
 * Manages skin health profiles including:
 * - Profile CRUD operations
 * - 17D tensor analysis and comparisons
 * - Insight generation from skin data
 * - Concern tracking and management
 * - Product recommendations based on skin profile
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestContext } from '@vendure/core';
import {
  SkinHealthProfile,
  SkinType,
  SkinConcern,
  LifestyleFactor,
  SkinTensorCoordinates,
  SkinConcernEntry,
} from '../entities/skin-health-profile.entity';

/**
 * Input for creating a skin health profile
 */
export interface CreateSkinProfileInput {
  userId: string;
  skinType: SkinType;
  sensitivityLevel?: number;
  concerns?: SkinConcernEntry[];
  lifestyleFactors?: LifestyleFactor[];
  age?: number;
  gender?: string;
  location?: string;
  climate?: string;
  fitzpatrickType?: number;
  allergies?: string[];
  avoidedIngredients?: string[];
}

/**
 * Input for updating a skin health profile
 */
export interface UpdateSkinProfileInput {
  skinType?: SkinType;
  sensitivityLevel?: number;
  currentTensor?: SkinTensorCoordinates;
  idealTensor?: SkinTensorCoordinates;
  concerns?: SkinConcernEntry[];
  lifestyleFactors?: LifestyleFactor[];
  age?: number;
  gender?: string;
  location?: string;
  climate?: string;
  fitzpatrickType?: number;
  currentRoutineDescription?: string;
  productPreferences?: any;
  allergies?: string[];
  avoidedIngredients?: string[];
}

/**
 * Skin insight generated from profile analysis
 */
export interface SkinInsight {
  type: 'recommendation' | 'warning' | 'info' | 'progress';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  relatedConcerns?: SkinConcern[];
  relatedTensorDimensions?: (keyof SkinTensorCoordinates)[];
  actionable?: boolean;
  actionText?: string;
}

/**
 * Tensor dimension metadata
 */
export interface TensorDimensionInfo {
  key: keyof SkinTensorCoordinates;
  label: string;
  description: string;
  idealRange: { min: number; max: number };
  unit?: string;
}

/**
 * All 17 tensor dimensions with metadata
 */
export const TENSOR_DIMENSIONS: TensorDimensionInfo[] = [
  {
    key: 'hydrationLevel',
    label: 'Hydration',
    description: 'Current skin hydration level',
    idealRange: { min: 0.6, max: 0.85 },
  },
  {
    key: 'oilProduction',
    label: 'Oil Production',
    description: 'Sebum production level',
    idealRange: { min: 0.3, max: 0.6 },
  },
  {
    key: 'barrierHealth',
    label: 'Barrier Health',
    description: 'Skin barrier integrity',
    idealRange: { min: 0.7, max: 1.0 },
  },
  {
    key: 'elasticity',
    label: 'Elasticity',
    description: 'Skin elasticity and firmness',
    idealRange: { min: 0.6, max: 0.9 },
  },
  {
    key: 'pigmentation',
    label: 'Pigmentation',
    description: 'Melanin distribution evenness',
    idealRange: { min: 0.7, max: 1.0 },
  },
  {
    key: 'cellTurnover',
    label: 'Cell Turnover',
    description: 'Skin cell renewal rate',
    idealRange: { min: 0.5, max: 0.8 },
  },
  {
    key: 'inflammationLevel',
    label: 'Inflammation',
    description: 'Inflammation markers (lower is better)',
    idealRange: { min: 0.0, max: 0.3 },
  },
  {
    key: 'antioxidantCapacity',
    label: 'Antioxidant Defense',
    description: 'Natural antioxidant capacity',
    idealRange: { min: 0.6, max: 0.9 },
  },
  {
    key: 'collagenDensity',
    label: 'Collagen Density',
    description: 'Collagen levels in skin',
    idealRange: { min: 0.6, max: 0.9 },
  },
  {
    key: 'microbiomeBalance',
    label: 'Microbiome Balance',
    description: 'Skin microbiome health',
    idealRange: { min: 0.6, max: 0.9 },
  },
  {
    key: 'sensitivityIndex',
    label: 'Sensitivity',
    description: 'Irritation threshold (lower = more sensitive)',
    idealRange: { min: 0.6, max: 1.0 },
  },
  {
    key: 'poreSize',
    label: 'Pore Size',
    description: 'Pore visibility (lower is better)',
    idealRange: { min: 0.2, max: 0.5 },
  },
  {
    key: 'surfaceTexture',
    label: 'Surface Texture',
    description: 'Skin smoothness',
    idealRange: { min: 0.7, max: 1.0 },
  },
  {
    key: 'photoaging',
    label: 'Photoaging',
    description: 'Sun damage level (lower is better)',
    idealRange: { min: 0.0, max: 0.3 },
  },
  {
    key: 'pHBalance',
    label: 'pH Balance',
    description: 'Skin pH equilibrium',
    idealRange: { min: 0.7, max: 0.9 },
  },
  {
    key: 'circulation',
    label: 'Circulation',
    description: 'Blood flow to skin',
    idealRange: { min: 0.6, max: 0.85 },
  },
  {
    key: 'environmentalProtection',
    label: 'Environmental Protection',
    description: 'Defense against pollution',
    idealRange: { min: 0.5, max: 0.8 },
  },
];

/**
 * Maps skin concerns to relevant tensor dimensions
 */
const CONCERN_TENSOR_MAP: Record<SkinConcern, (keyof SkinTensorCoordinates)[]> = {
  [SkinConcern.ACNE]: ['oilProduction', 'inflammationLevel', 'microbiomeBalance', 'poreSize'],
  [SkinConcern.AGING]: ['collagenDensity', 'elasticity', 'cellTurnover'],
  [SkinConcern.DARK_SPOTS]: ['pigmentation', 'photoaging', 'cellTurnover'],
  [SkinConcern.DRYNESS]: ['hydrationLevel', 'barrierHealth', 'oilProduction'],
  [SkinConcern.DULLNESS]: ['cellTurnover', 'circulation', 'hydrationLevel'],
  [SkinConcern.ENLARGED_PORES]: ['poreSize', 'oilProduction', 'elasticity'],
  [SkinConcern.FINE_LINES]: ['hydrationLevel', 'collagenDensity', 'elasticity'],
  [SkinConcern.HYPERPIGMENTATION]: ['pigmentation', 'cellTurnover', 'photoaging'],
  [SkinConcern.OILINESS]: ['oilProduction', 'poreSize', 'pHBalance'],
  [SkinConcern.REDNESS]: ['inflammationLevel', 'sensitivityIndex', 'barrierHealth'],
  [SkinConcern.SENSITIVITY]: ['sensitivityIndex', 'barrierHealth', 'inflammationLevel'],
  [SkinConcern.TEXTURE]: ['surfaceTexture', 'cellTurnover', 'poreSize'],
  [SkinConcern.WRINKLES]: ['collagenDensity', 'elasticity', 'photoaging'],
  [SkinConcern.DEHYDRATION]: ['hydrationLevel', 'barrierHealth', 'pHBalance'],
  [SkinConcern.DARK_CIRCLES]: ['circulation', 'pigmentation', 'hydrationLevel'],
  [SkinConcern.SAGGING]: ['elasticity', 'collagenDensity', 'circulation'],
};

@Injectable()
export class SkinHealthService {
  constructor(
    @InjectRepository(SkinHealthProfile)
    private profileRepo: Repository<SkinHealthProfile>
  ) {}

  // ========================================
  // Profile CRUD Operations
  // ========================================

  /**
   * Create a new skin health profile
   */
  async createProfile(
    ctx: RequestContext,
    input: CreateSkinProfileInput
  ): Promise<SkinHealthProfile> {
    // Check if user already has a profile
    const existing = await this.profileRepo.findOne({
      where: { userId: input.userId, isActive: true },
    });

    if (existing) {
      throw new Error('User already has an active skin health profile');
    }

    const profile = this.profileRepo.create({
      ...input,
      concerns: input.concerns || [],
      lifestyleFactors: input.lifestyleFactors || [],
      allergies: input.allergies || [],
      avoidedIngredients: input.avoidedIngredients || [],
      sensitivityLevel: input.sensitivityLevel || 5,
      profileCompleteness: this.calculateCompleteness(input),
    });

    // Generate ideal tensor based on skin type
    profile.idealTensor = this.generateIdealTensor(input.skinType);

    return this.profileRepo.save(profile);
  }

  /**
   * Get profile by ID
   */
  async getProfile(
    ctx: RequestContext,
    profileId: string
  ): Promise<SkinHealthProfile | null> {
    return this.profileRepo.findOne({ where: { id: profileId } });
  }

  /**
   * Get profile by user ID
   */
  async getProfileByUserId(
    ctx: RequestContext,
    userId: string
  ): Promise<SkinHealthProfile | null> {
    return this.profileRepo.findOne({
      where: { userId, isActive: true },
    });
  }

  /**
   * Update a skin health profile
   */
  async updateProfile(
    ctx: RequestContext,
    profileId: string,
    input: UpdateSkinProfileInput
  ): Promise<SkinHealthProfile> {
    const profile = await this.profileRepo.findOne({ where: { id: profileId } });

    if (!profile) {
      throw new Error(`Profile with id ${profileId} not found`);
    }

    // Update fields
    Object.assign(profile, input);

    // Recalculate ideal tensor if skin type changed
    if (input.skinType && input.skinType !== profile.skinType) {
      profile.idealTensor = this.generateIdealTensor(input.skinType);
    }

    // Update completeness
    profile.profileCompleteness = this.calculateProfileCompleteness(profile);

    // Update assessment date if tensor was updated
    if (input.currentTensor) {
      profile.lastAssessmentDate = new Date();
    }

    return this.profileRepo.save(profile);
  }

  /**
   * Delete (deactivate) a profile
   */
  async deleteProfile(
    ctx: RequestContext,
    profileId: string
  ): Promise<boolean> {
    const profile = await this.profileRepo.findOne({ where: { id: profileId } });

    if (!profile) {
      return false;
    }

    profile.isActive = false;
    await this.profileRepo.save(profile);
    return true;
  }

  // ========================================
  // Tensor Analysis
  // ========================================

  /**
   * Generate ideal tensor based on skin type
   */
  generateIdealTensor(skinType: SkinType): SkinTensorCoordinates {
    const baseIdeal: SkinTensorCoordinates = {
      hydrationLevel: 0.75,
      oilProduction: 0.45,
      barrierHealth: 0.85,
      elasticity: 0.8,
      pigmentation: 0.85,
      cellTurnover: 0.65,
      inflammationLevel: 0.15,
      antioxidantCapacity: 0.75,
      collagenDensity: 0.75,
      microbiomeBalance: 0.8,
      sensitivityIndex: 0.8,
      poreSize: 0.35,
      surfaceTexture: 0.85,
      photoaging: 0.15,
      pHBalance: 0.8,
      circulation: 0.75,
      environmentalProtection: 0.7,
    };

    // Adjust based on skin type
    switch (skinType) {
      case SkinType.DRY:
        return {
          ...baseIdeal,
          hydrationLevel: 0.85,
          oilProduction: 0.3,
          barrierHealth: 0.9,
        };

      case SkinType.OILY:
        return {
          ...baseIdeal,
          oilProduction: 0.35,
          poreSize: 0.3,
          pHBalance: 0.85,
        };

      case SkinType.COMBINATION:
        return {
          ...baseIdeal,
          oilProduction: 0.4,
          hydrationLevel: 0.8,
        };

      case SkinType.SENSITIVE:
        return {
          ...baseIdeal,
          sensitivityIndex: 0.9,
          barrierHealth: 0.9,
          inflammationLevel: 0.1,
        };

      case SkinType.MATURE:
        return {
          ...baseIdeal,
          collagenDensity: 0.8,
          elasticity: 0.85,
          cellTurnover: 0.7,
          antioxidantCapacity: 0.8,
        };

      default:
        return baseIdeal;
    }
  }

  /**
   * Analyze tensor deviation from ideal
   */
  analyzeTensorDeviation(
    current: SkinTensorCoordinates,
    ideal: SkinTensorCoordinates
  ): {
    overallDeviation: number;
    dimensionDeviations: Array<{
      dimension: keyof SkinTensorCoordinates;
      current: number;
      ideal: number;
      deviation: number;
      status: 'optimal' | 'suboptimal' | 'concerning';
    }>;
    priorityDimensions: (keyof SkinTensorCoordinates)[];
  } {
    const dimensionDeviations: Array<{
      dimension: keyof SkinTensorCoordinates;
      current: number;
      ideal: number;
      deviation: number;
      status: 'optimal' | 'suboptimal' | 'concerning';
    }> = [];

    let totalDeviation = 0;

    for (const dim of TENSOR_DIMENSIONS) {
      const currentVal = current[dim.key] || 0;
      const idealVal = ideal[dim.key] || 0;
      const deviation = Math.abs(currentVal - idealVal);

      let status: 'optimal' | 'suboptimal' | 'concerning';
      if (deviation <= 0.1) {
        status = 'optimal';
      } else if (deviation <= 0.25) {
        status = 'suboptimal';
      } else {
        status = 'concerning';
      }

      dimensionDeviations.push({
        dimension: dim.key,
        current: currentVal,
        ideal: idealVal,
        deviation,
        status,
      });

      totalDeviation += deviation;
    }

    const overallDeviation = totalDeviation / TENSOR_DIMENSIONS.length;

    // Sort by deviation to get priority dimensions
    const priorityDimensions = dimensionDeviations
      .filter((d) => d.status !== 'optimal')
      .sort((a, b) => b.deviation - a.deviation)
      .slice(0, 5)
      .map((d) => d.dimension);

    return {
      overallDeviation,
      dimensionDeviations,
      priorityDimensions,
    };
  }

  /**
   * Calculate tensor distance between two profiles
   */
  calculateTensorDistance(
    tensorA: SkinTensorCoordinates,
    tensorB: SkinTensorCoordinates
  ): number {
    let sumSquares = 0;

    for (const dim of TENSOR_DIMENSIONS) {
      const a = tensorA[dim.key] || 0;
      const b = tensorB[dim.key] || 0;
      sumSquares += Math.pow(a - b, 2);
    }

    return Math.sqrt(sumSquares / TENSOR_DIMENSIONS.length);
  }

  // ========================================
  // Insight Generation
  // ========================================

  /**
   * Generate insights from a skin health profile
   */
  async generateInsights(
    ctx: RequestContext,
    profileId: string
  ): Promise<SkinInsight[]> {
    const profile = await this.profileRepo.findOne({ where: { id: profileId } });

    if (!profile) {
      return [];
    }

    const insights: SkinInsight[] = [];

    // Profile completeness insight
    if (profile.profileCompleteness < 50) {
      insights.push({
        type: 'info',
        priority: 'medium',
        title: 'Complete Your Profile',
        description: `Your profile is ${profile.profileCompleteness}% complete. Complete it for more accurate recommendations.`,
        actionable: true,
        actionText: 'Complete Profile',
      });
    }

    // Assessment freshness insight
    if (profile.needsUpdate()) {
      insights.push({
        type: 'recommendation',
        priority: 'medium',
        title: 'Time for a Skin Check',
        description: 'Your last skin assessment was over 30 days ago. Update your tensor coordinates for better recommendations.',
        actionable: true,
        actionText: 'Update Assessment',
      });
    }

    // Tensor-based insights
    if (profile.currentTensor && profile.idealTensor) {
      const analysis = this.analyzeTensorDeviation(
        profile.currentTensor,
        profile.idealTensor
      );

      for (const dim of analysis.priorityDimensions.slice(0, 3)) {
        const dimInfo = TENSOR_DIMENSIONS.find((d) => d.key === dim);
        const devData = analysis.dimensionDeviations.find((d) => d.dimension === dim);

        if (dimInfo && devData) {
          insights.push({
            type: devData.status === 'concerning' ? 'warning' : 'recommendation',
            priority: devData.status === 'concerning' ? 'high' : 'medium',
            title: `${dimInfo.label} Needs Attention`,
            description: `Your ${dimInfo.label.toLowerCase()} (${Math.round(devData.current * 100)}%) is ${devData.deviation > 0 ? 'below' : 'above'} optimal (${Math.round(devData.ideal * 100)}%).`,
            relatedTensorDimensions: [dim],
          });
        }
      }
    }

    // Concern-based insights
    const primaryConcerns = profile.getPrimaryConcerns();
    for (const concern of primaryConcerns.slice(0, 2)) {
      const relatedDims = CONCERN_TENSOR_MAP[concern.concern];
      insights.push({
        type: 'recommendation',
        priority: concern.severity >= 8 ? 'high' : 'medium',
        title: `Address ${this.formatConcernName(concern.concern)}`,
        description: `${this.formatConcernName(concern.concern)} (severity: ${concern.severity}/10) is a primary concern. Focus on products targeting ${relatedDims.map((d) => this.getDimensionLabel(d)).join(', ')}.`,
        relatedConcerns: [concern.concern],
        relatedTensorDimensions: relatedDims,
      });
    }

    // Lifestyle factor insights
    if (profile.lifestyleFactors.includes(LifestyleFactor.HIGH_SUN_EXPOSURE)) {
      insights.push({
        type: 'warning',
        priority: 'high',
        title: 'Sun Protection Required',
        description: 'Your high sun exposure increases photoaging risk. Always use SPF 30+ daily.',
        relatedTensorDimensions: ['photoaging', 'pigmentation', 'antioxidantCapacity'],
      });
    }

    if (profile.lifestyleFactors.includes(LifestyleFactor.HIGH_STRESS)) {
      insights.push({
        type: 'info',
        priority: 'medium',
        title: 'Stress Impact on Skin',
        description: 'High stress can increase inflammation and affect barrier health. Consider calming ingredients like niacinamide.',
        relatedTensorDimensions: ['inflammationLevel', 'barrierHealth', 'microbiomeBalance'],
      });
    }

    // Sensitivity-based insights
    if (profile.sensitivityLevel >= 7) {
      insights.push({
        type: 'warning',
        priority: 'high',
        title: 'High Sensitivity Detected',
        description: 'Your skin is highly sensitive. Avoid harsh actives and always patch test new products.',
        relatedTensorDimensions: ['sensitivityIndex', 'barrierHealth', 'inflammationLevel'],
      });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return insights;
  }

  // ========================================
  // Concern Management
  // ========================================

  /**
   * Add a concern to a profile
   */
  async addConcern(
    ctx: RequestContext,
    profileId: string,
    concern: SkinConcernEntry
  ): Promise<SkinHealthProfile> {
    const profile = await this.profileRepo.findOne({ where: { id: profileId } });

    if (!profile) {
      throw new Error(`Profile with id ${profileId} not found`);
    }

    // Check if concern already exists
    const existingIndex = profile.concerns.findIndex(
      (c) => c.concern === concern.concern
    );

    if (existingIndex >= 0) {
      // Update existing concern
      profile.concerns[existingIndex] = concern;
    } else {
      // Add new concern
      profile.concerns.push(concern);
    }

    return this.profileRepo.save(profile);
  }

  /**
   * Remove a concern from a profile
   */
  async removeConcern(
    ctx: RequestContext,
    profileId: string,
    concern: SkinConcern
  ): Promise<SkinHealthProfile> {
    const profile = await this.profileRepo.findOne({ where: { id: profileId } });

    if (!profile) {
      throw new Error(`Profile with id ${profileId} not found`);
    }

    profile.concerns = profile.concerns.filter((c) => c.concern !== concern);

    return this.profileRepo.save(profile);
  }

  /**
   * Update concern severity
   */
  async updateConcernSeverity(
    ctx: RequestContext,
    profileId: string,
    concern: SkinConcern,
    severity: number
  ): Promise<SkinHealthProfile> {
    const profile = await this.profileRepo.findOne({ where: { id: profileId } });

    if (!profile) {
      throw new Error(`Profile with id ${profileId} not found`);
    }

    const concernEntry = profile.concerns.find((c) => c.concern === concern);

    if (concernEntry) {
      concernEntry.severity = Math.min(10, Math.max(1, severity));
    }

    return this.profileRepo.save(profile);
  }

  // ========================================
  // Tensor Updates
  // ========================================

  /**
   * Update current tensor coordinates
   */
  async updateTensor(
    ctx: RequestContext,
    profileId: string,
    tensor: SkinTensorCoordinates
  ): Promise<SkinHealthProfile> {
    const profile = await this.profileRepo.findOne({ where: { id: profileId } });

    if (!profile) {
      throw new Error(`Profile with id ${profileId} not found`);
    }

    // Validate tensor values (0-1 range)
    const validatedTensor: SkinTensorCoordinates = {} as SkinTensorCoordinates;
    for (const dim of TENSOR_DIMENSIONS) {
      const value = tensor[dim.key];
      validatedTensor[dim.key] = Math.min(1, Math.max(0, value || 0));
    }

    profile.currentTensor = validatedTensor;
    profile.lastAssessmentDate = new Date();

    return this.profileRepo.save(profile);
  }

  /**
   * Get tensor dimension metadata
   */
  getTensorDimensions(): TensorDimensionInfo[] {
    return TENSOR_DIMENSIONS;
  }

  /**
   * Get tensor dimension by key
   */
  getTensorDimension(key: keyof SkinTensorCoordinates): TensorDimensionInfo | undefined {
    return TENSOR_DIMENSIONS.find((d) => d.key === key);
  }

  // ========================================
  // Helper Methods
  // ========================================

  /**
   * Calculate profile completeness from input
   */
  private calculateCompleteness(input: CreateSkinProfileInput): number {
    let fields = 0;
    let filled = 0;

    // Required fields
    fields += 2; // userId, skinType
    filled += 2;

    // Optional fields
    const optionalFields: (keyof CreateSkinProfileInput)[] = [
      'sensitivityLevel',
      'concerns',
      'lifestyleFactors',
      'age',
      'gender',
      'location',
      'climate',
      'fitzpatrickType',
      'allergies',
      'avoidedIngredients',
    ];

    for (const field of optionalFields) {
      fields++;
      const value = input[field];
      if (value !== undefined && value !== null) {
        if (Array.isArray(value) && value.length > 0) {
          filled++;
        } else if (!Array.isArray(value)) {
          filled++;
        }
      }
    }

    return Math.round((filled / fields) * 100);
  }

  /**
   * Calculate profile completeness from existing profile
   */
  private calculateProfileCompleteness(profile: SkinHealthProfile): number {
    let fields = 0;
    let filled = 0;

    // Core fields
    const checkFields = [
      { value: profile.skinType, weight: 1 },
      { value: profile.sensitivityLevel, weight: 1 },
      { value: profile.currentTensor, weight: 2 },
      { value: profile.concerns.length > 0, weight: 1 },
      { value: profile.lifestyleFactors.length > 0, weight: 1 },
      { value: profile.age, weight: 0.5 },
      { value: profile.gender, weight: 0.5 },
      { value: profile.fitzpatrickType, weight: 0.5 },
      { value: profile.allergies.length > 0, weight: 0.5 },
    ];

    for (const field of checkFields) {
      fields += field.weight;
      if (field.value) {
        filled += field.weight;
      }
    }

    return Math.round((filled / fields) * 100);
  }

  /**
   * Format concern name for display
   */
  private formatConcernName(concern: SkinConcern): string {
    return concern
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Get dimension label by key
   */
  private getDimensionLabel(key: keyof SkinTensorCoordinates): string {
    const dim = TENSOR_DIMENSIONS.find((d) => d.key === key);
    return dim?.label || key;
  }

  // ========================================
  // Statistics & Analytics
  // ========================================

  /**
   * Get skin health score (0-100)
   */
  async getSkinHealthScore(
    ctx: RequestContext,
    profileId: string
  ): Promise<{
    overall: number;
    byCategory: Record<string, number>;
    trend?: 'improving' | 'stable' | 'declining';
  }> {
    const profile = await this.profileRepo.findOne({ where: { id: profileId } });

    if (!profile || !profile.currentTensor) {
      return {
        overall: 0,
        byCategory: {},
      };
    }

    const ideal = profile.idealTensor || this.generateIdealTensor(profile.skinType);
    const analysis = this.analyzeTensorDeviation(profile.currentTensor, ideal);

    // Overall score (inverse of deviation)
    const overall = Math.round((1 - analysis.overallDeviation) * 100);

    // Category scores
    const byCategory: Record<string, number> = {
      hydration: this.categoryScore(profile.currentTensor, ideal, ['hydrationLevel', 'barrierHealth']),
      aging: this.categoryScore(profile.currentTensor, ideal, ['collagenDensity', 'elasticity', 'cellTurnover']),
      clarity: this.categoryScore(profile.currentTensor, ideal, ['pigmentation', 'surfaceTexture', 'poreSize']),
      sensitivity: this.categoryScore(profile.currentTensor, ideal, ['sensitivityIndex', 'inflammationLevel']),
      protection: this.categoryScore(profile.currentTensor, ideal, ['antioxidantCapacity', 'environmentalProtection', 'photoaging']),
    };

    return {
      overall,
      byCategory,
      trend: 'stable', // Would need historical data to calculate trend
    };
  }

  /**
   * Calculate category score
   */
  private categoryScore(
    current: SkinTensorCoordinates,
    ideal: SkinTensorCoordinates,
    dimensions: (keyof SkinTensorCoordinates)[]
  ): number {
    let totalDeviation = 0;

    for (const dim of dimensions) {
      const c = current[dim] || 0;
      const i = ideal[dim] || 0;
      totalDeviation += Math.abs(c - i);
    }

    const avgDeviation = totalDeviation / dimensions.length;
    return Math.round((1 - avgDeviation) * 100);
  }
}
