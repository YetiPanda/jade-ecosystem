/**
 * Skin Health Resolvers
 *
 * DermaLogica Intelligence MVP - Phase 4: Skin Dashboard
 *
 * Implements GraphQL resolvers for:
 * - Skin health profile CRUD
 * - 17D tensor operations
 * - Insight generation
 * - Concern management
 * - Skin health scoring
 */

import { Args, Query, Resolver, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { Ctx, RequestContext, Allow, Permission } from '@vendure/core';
import {
  SkinHealthService,
  CreateSkinProfileInput,
  UpdateSkinProfileInput,
  SkinInsight,
  TensorDimensionInfo,
  TENSOR_DIMENSIONS,
} from '../services/skin-health.service';
import {
  SkinHealthProfile,
  SkinType,
  SkinConcern,
  LifestyleFactor,
  SkinTensorCoordinates,
  SkinConcernEntry,
} from '../entities/skin-health-profile.entity';

/**
 * GraphQL Input for creating a skin profile
 */
interface CreateSkinProfileGQLInput {
  userId: string;
  skinType: SkinType;
  sensitivityLevel?: number;
  concerns?: SkinConcernEntryInput[];
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
 * GraphQL Input for updating a skin profile
 */
interface UpdateSkinProfileGQLInput {
  skinType?: SkinType;
  sensitivityLevel?: number;
  currentTensor?: SkinTensorCoordinatesInput;
  idealTensor?: SkinTensorCoordinatesInput;
  concerns?: SkinConcernEntryInput[];
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
 * GraphQL Input for tensor coordinates
 */
interface SkinTensorCoordinatesInput {
  hydrationLevel: number;
  oilProduction: number;
  barrierHealth: number;
  elasticity: number;
  pigmentation: number;
  cellTurnover: number;
  inflammationLevel: number;
  antioxidantCapacity: number;
  collagenDensity: number;
  microbiomeBalance: number;
  sensitivityIndex: number;
  poreSize: number;
  surfaceTexture: number;
  photoaging: number;
  pHBalance: number;
  circulation: number;
  environmentalProtection: number;
}

/**
 * GraphQL Input for skin concern entry
 */
interface SkinConcernEntryInput {
  concern: SkinConcern;
  severity: number;
  duration: string;
  notes?: string;
}

/**
 * Skin Health Query Resolver
 */
@Resolver()
export class SkinHealthQueryResolver {
  constructor(private skinHealthService: SkinHealthService) {}

  /**
   * Get skin health profile by ID
   */
  @Query('skinHealthProfile')
  @Allow(Permission.Public)
  async skinHealthProfile(
    @Ctx() ctx: RequestContext,
    @Args('profileId') profileId: string
  ): Promise<SkinHealthProfile | null> {
    return this.skinHealthService.getProfile(ctx, profileId);
  }

  /**
   * Get skin health profile by user ID
   */
  @Query('skinHealthProfileByUser')
  @Allow(Permission.Public)
  async skinHealthProfileByUser(
    @Ctx() ctx: RequestContext,
    @Args('userId') userId: string
  ): Promise<SkinHealthProfile | null> {
    return this.skinHealthService.getProfileByUserId(ctx, userId);
  }

  /**
   * Get insights for a skin profile
   */
  @Query('skinHealthInsights')
  @Allow(Permission.Public)
  async skinHealthInsights(
    @Ctx() ctx: RequestContext,
    @Args('profileId') profileId: string
  ): Promise<SkinInsight[]> {
    return this.skinHealthService.generateInsights(ctx, profileId);
  }

  /**
   * Get skin health score
   */
  @Query('skinHealthScore')
  @Allow(Permission.Public)
  async skinHealthScore(
    @Ctx() ctx: RequestContext,
    @Args('profileId') profileId: string
  ): Promise<{
    overall: number;
    byCategory: Record<string, number>;
    trend?: 'improving' | 'stable' | 'declining';
  }> {
    return this.skinHealthService.getSkinHealthScore(ctx, profileId);
  }

  /**
   * Get all tensor dimension metadata
   */
  @Query('tensorDimensions')
  @Allow(Permission.Public)
  async tensorDimensions(): Promise<TensorDimensionInfo[]> {
    return TENSOR_DIMENSIONS;
  }

  /**
   * Get tensor dimension by key
   */
  @Query('tensorDimension')
  @Allow(Permission.Public)
  async tensorDimension(
    @Ctx() ctx: RequestContext,
    @Args('key') key: string
  ): Promise<TensorDimensionInfo | null> {
    return this.skinHealthService.getTensorDimension(
      key as keyof SkinTensorCoordinates
    ) || null;
  }

  /**
   * Analyze tensor deviation from ideal
   */
  @Query('analyzeTensorDeviation')
  @Allow(Permission.Public)
  async analyzeTensorDeviation(
    @Ctx() ctx: RequestContext,
    @Args('profileId') profileId: string
  ): Promise<{
    overallDeviation: number;
    dimensionDeviations: Array<{
      dimension: string;
      current: number;
      ideal: number;
      deviation: number;
      status: string;
    }>;
    priorityDimensions: string[];
  } | null> {
    const profile = await this.skinHealthService.getProfile(ctx, profileId);
    if (!profile || !profile.currentTensor || !profile.idealTensor) {
      return null;
    }

    const analysis = this.skinHealthService.analyzeTensorDeviation(
      profile.currentTensor,
      profile.idealTensor
    );

    return {
      overallDeviation: analysis.overallDeviation,
      dimensionDeviations: analysis.dimensionDeviations.map((d) => ({
        dimension: d.dimension,
        current: d.current,
        ideal: d.ideal,
        deviation: d.deviation,
        status: d.status,
      })),
      priorityDimensions: analysis.priorityDimensions,
    };
  }

  /**
   * Get ideal tensor for a skin type
   */
  @Query('idealTensorForSkinType')
  @Allow(Permission.Public)
  async idealTensorForSkinType(
    @Ctx() ctx: RequestContext,
    @Args('skinType') skinType: SkinType
  ): Promise<SkinTensorCoordinates> {
    return this.skinHealthService.generateIdealTensor(skinType);
  }

  /**
   * Get all skin types
   */
  @Query('skinTypes')
  @Allow(Permission.Public)
  async skinTypes(): Promise<string[]> {
    return Object.values(SkinType);
  }

  /**
   * Get all skin concerns
   */
  @Query('skinConcerns')
  @Allow(Permission.Public)
  async skinConcerns(): Promise<string[]> {
    return Object.values(SkinConcern);
  }

  /**
   * Get all lifestyle factors
   */
  @Query('lifestyleFactors')
  @Allow(Permission.Public)
  async lifestyleFactors(): Promise<string[]> {
    return Object.values(LifestyleFactor);
  }
}

/**
 * Skin Health Mutation Resolver
 */
@Resolver()
export class SkinHealthMutationResolver {
  constructor(private skinHealthService: SkinHealthService) {}

  /**
   * Create a new skin health profile
   */
  @Mutation('createSkinHealthProfile')
  @Allow(Permission.Authenticated)
  async createSkinHealthProfile(
    @Ctx() ctx: RequestContext,
    @Args('input') input: CreateSkinProfileGQLInput
  ): Promise<SkinHealthProfile> {
    return this.skinHealthService.createProfile(ctx, {
      userId: input.userId,
      skinType: input.skinType,
      sensitivityLevel: input.sensitivityLevel,
      concerns: input.concerns as SkinConcernEntry[],
      lifestyleFactors: input.lifestyleFactors,
      age: input.age,
      gender: input.gender,
      location: input.location,
      climate: input.climate,
      fitzpatrickType: input.fitzpatrickType,
      allergies: input.allergies,
      avoidedIngredients: input.avoidedIngredients,
    });
  }

  /**
   * Update a skin health profile
   */
  @Mutation('updateSkinHealthProfile')
  @Allow(Permission.Authenticated)
  async updateSkinHealthProfile(
    @Ctx() ctx: RequestContext,
    @Args('profileId') profileId: string,
    @Args('input') input: UpdateSkinProfileGQLInput
  ): Promise<SkinHealthProfile> {
    return this.skinHealthService.updateProfile(ctx, profileId, {
      skinType: input.skinType,
      sensitivityLevel: input.sensitivityLevel,
      currentTensor: input.currentTensor as SkinTensorCoordinates,
      idealTensor: input.idealTensor as SkinTensorCoordinates,
      concerns: input.concerns as SkinConcernEntry[],
      lifestyleFactors: input.lifestyleFactors,
      age: input.age,
      gender: input.gender,
      location: input.location,
      climate: input.climate,
      fitzpatrickType: input.fitzpatrickType,
      currentRoutineDescription: input.currentRoutineDescription,
      productPreferences: input.productPreferences,
      allergies: input.allergies,
      avoidedIngredients: input.avoidedIngredients,
    });
  }

  /**
   * Delete (deactivate) a skin health profile
   */
  @Mutation('deleteSkinHealthProfile')
  @Allow(Permission.Authenticated)
  async deleteSkinHealthProfile(
    @Ctx() ctx: RequestContext,
    @Args('profileId') profileId: string
  ): Promise<boolean> {
    return this.skinHealthService.deleteProfile(ctx, profileId);
  }

  /**
   * Update tensor coordinates
   */
  @Mutation('updateSkinTensor')
  @Allow(Permission.Authenticated)
  async updateSkinTensor(
    @Ctx() ctx: RequestContext,
    @Args('profileId') profileId: string,
    @Args('tensor') tensor: SkinTensorCoordinatesInput
  ): Promise<SkinHealthProfile> {
    return this.skinHealthService.updateTensor(
      ctx,
      profileId,
      tensor as SkinTensorCoordinates
    );
  }

  /**
   * Add a concern to a profile
   */
  @Mutation('addSkinConcern')
  @Allow(Permission.Authenticated)
  async addSkinConcern(
    @Ctx() ctx: RequestContext,
    @Args('profileId') profileId: string,
    @Args('concern') concern: SkinConcernEntryInput
  ): Promise<SkinHealthProfile> {
    return this.skinHealthService.addConcern(
      ctx,
      profileId,
      concern as SkinConcernEntry
    );
  }

  /**
   * Remove a concern from a profile
   */
  @Mutation('removeSkinConcern')
  @Allow(Permission.Authenticated)
  async removeSkinConcern(
    @Ctx() ctx: RequestContext,
    @Args('profileId') profileId: string,
    @Args('concern') concern: SkinConcern
  ): Promise<SkinHealthProfile> {
    return this.skinHealthService.removeConcern(ctx, profileId, concern);
  }

  /**
   * Update concern severity
   */
  @Mutation('updateConcernSeverity')
  @Allow(Permission.Authenticated)
  async updateConcernSeverity(
    @Ctx() ctx: RequestContext,
    @Args('profileId') profileId: string,
    @Args('concern') concern: SkinConcern,
    @Args('severity') severity: number
  ): Promise<SkinHealthProfile> {
    return this.skinHealthService.updateConcernSeverity(
      ctx,
      profileId,
      concern,
      severity
    );
  }
}

/**
 * SkinHealthProfile Type Resolver
 */
@Resolver('SkinHealthProfile')
export class SkinHealthProfileResolver {
  constructor(private skinHealthService: SkinHealthService) {}

  /**
   * Field resolver for primary concerns
   */
  @ResolveField('primaryConcerns')
  async primaryConcerns(
    @Parent() profile: SkinHealthProfile
  ): Promise<SkinConcernEntry[]> {
    return profile.getPrimaryConcerns();
  }

  /**
   * Field resolver for average concern severity
   */
  @ResolveField('averageSeverity')
  async averageSeverity(
    @Parent() profile: SkinHealthProfile
  ): Promise<number> {
    return profile.getAverageSeverity();
  }

  /**
   * Field resolver for tensor deviation
   */
  @ResolveField('tensorDeviation')
  async tensorDeviation(
    @Parent() profile: SkinHealthProfile
  ): Promise<number> {
    return profile.getTensorDeviation();
  }

  /**
   * Field resolver for tensor array (for visualization)
   */
  @ResolveField('tensorArray')
  async tensorArray(
    @Parent() profile: SkinHealthProfile
  ): Promise<number[]> {
    return profile.getTensorArray();
  }

  /**
   * Field resolver for needsUpdate check
   */
  @ResolveField('needsUpdate')
  async needsUpdate(
    @Parent() profile: SkinHealthProfile
  ): Promise<boolean> {
    return profile.needsUpdate();
  }

  /**
   * Field resolver for insights
   */
  @ResolveField('insights')
  async insights(
    @Ctx() ctx: RequestContext,
    @Parent() profile: SkinHealthProfile
  ): Promise<SkinInsight[]> {
    return this.skinHealthService.generateInsights(ctx, profile.id);
  }

  /**
   * Field resolver for health score
   */
  @ResolveField('healthScore')
  async healthScore(
    @Ctx() ctx: RequestContext,
    @Parent() profile: SkinHealthProfile
  ): Promise<{
    overall: number;
    byCategory: Record<string, number>;
    trend?: 'improving' | 'stable' | 'declining';
  }> {
    return this.skinHealthService.getSkinHealthScore(ctx, profile.id);
  }

  /**
   * Field resolver for tensor dimension labels
   */
  @ResolveField('tensorDimensionLabels')
  async tensorDimensionLabels(): Promise<string[]> {
    return TENSOR_DIMENSIONS.map((d) => d.label);
  }

  /**
   * Field resolver for skin type display name
   */
  @ResolveField('skinTypeDisplayName')
  async skinTypeDisplayName(
    @Parent() profile: SkinHealthProfile
  ): Promise<string> {
    const displayNames: Record<SkinType, string> = {
      [SkinType.NORMAL]: 'Normal',
      [SkinType.DRY]: 'Dry',
      [SkinType.OILY]: 'Oily',
      [SkinType.COMBINATION]: 'Combination',
      [SkinType.SENSITIVE]: 'Sensitive',
      [SkinType.MATURE]: 'Mature',
    };
    return displayNames[profile.skinType] || profile.skinType;
  }
}

/**
 * SkinInsight Type Resolver
 */
@Resolver('SkinInsight')
export class SkinInsightResolver {
  /**
   * Field resolver for priority color
   */
  @ResolveField('priorityColor')
  async priorityColor(
    @Parent() insight: SkinInsight
  ): Promise<string> {
    const colors = {
      high: '#EF4444',
      medium: '#F59E0B',
      low: '#10B981',
    };
    return colors[insight.priority] || colors.medium;
  }

  /**
   * Field resolver for type icon
   */
  @ResolveField('typeIcon')
  async typeIcon(
    @Parent() insight: SkinInsight
  ): Promise<string> {
    const icons = {
      recommendation: 'lightbulb',
      warning: 'alert-triangle',
      info: 'info',
      progress: 'trending-up',
    };
    return icons[insight.type] || icons.info;
  }
}

/**
 * TensorDimensionInfo Type Resolver
 */
@Resolver('TensorDimensionInfo')
export class TensorDimensionInfoResolver {
  /**
   * Field resolver for ideal range midpoint
   */
  @ResolveField('idealMidpoint')
  async idealMidpoint(
    @Parent() dim: TensorDimensionInfo
  ): Promise<number> {
    return (dim.idealRange.min + dim.idealRange.max) / 2;
  }

  /**
   * Field resolver for ideal range width
   */
  @ResolveField('idealRangeWidth')
  async idealRangeWidth(
    @Parent() dim: TensorDimensionInfo
  ): Promise<number> {
    return dim.idealRange.max - dim.idealRange.min;
  }
}
