/**
 * Taxonomy Service for JADE Spa Marketplace
 *
 * Feature: Week 3 - Advanced Product Taxonomy
 *
 * Handles all taxonomy-related operations including:
 * - Category hierarchy management
 * - Product classification (functions, concerns, formats, etc.)
 * - Taxonomy completeness scoring
 * - Quality metrics and statistics
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { RequestContext } from '@vendure/core';
import {
  ProductCategory,
  ProductFunction,
  SkinConcern,
  ProductFormat,
  TargetArea,
  ProductRegion,
  ProductTaxonomy,
} from '../entities/taxonomy.entity';

/**
 * Input for creating/updating product taxonomy
 */
export interface ProductTaxonomyInput {
  productId: string;
  categoryId?: string;
  primaryFunctionIds?: string[];
  skinConcernIds?: string[];
  targetAreaIds?: string[];
  productFormatId?: string;
  regionId?: string;
  usageTime?: string;
  professionalLevel?: string;
  protocolRequired?: boolean;
  formulationBase?: string;
}

/**
 * Bulk taxonomy update input
 */
export interface BulkTaxonomyUpdate {
  productId: string;
  categoryId?: string;
  primaryFunctionIds?: string[];
}

@Injectable()
export class TaxonomyService {
  constructor(
    @InjectRepository(ProductCategory)
    private categoryRepo: Repository<ProductCategory>,
    @InjectRepository(ProductFunction)
    private functionRepo: Repository<ProductFunction>,
    @InjectRepository(SkinConcern)
    private concernRepo: Repository<SkinConcern>,
    @InjectRepository(ProductFormat)
    private formatRepo: Repository<ProductFormat>,
    @InjectRepository(TargetArea)
    private targetAreaRepo: Repository<TargetArea>,
    @InjectRepository(ProductRegion)
    private regionRepo: Repository<ProductRegion>,
    @InjectRepository(ProductTaxonomy)
    private taxonomyRepo: Repository<ProductTaxonomy>
  ) {}

  // ========================================
  // Category Queries
  // ========================================

  /**
   * Get all product categories with optional filters
   */
  async getProductCategories(
    ctx: RequestContext,
    level?: number,
    parentId?: string,
    includeInactive = false
  ): Promise<ProductCategory[]> {
    const where: any = {};

    if (level !== undefined) {
      where.level = level;
    }

    if (parentId !== undefined) {
      where.parentId = parentId === null ? IsNull() : parentId;
    }

    if (!includeInactive) {
      where.isActive = true;
    }

    return this.categoryRepo.find({
      where,
      order: { displayOrder: 'ASC', name: 'ASC' },
    });
  }

  /**
   * Get single category by ID or slug
   */
  async getProductCategory(
    ctx: RequestContext,
    id?: string,
    slug?: string
  ): Promise<ProductCategory | null> {
    if (id) {
      return this.categoryRepo.findOne({ where: { id } });
    }
    if (slug) {
      return this.categoryRepo.findOne({ where: { seoSlug: slug } });
    }
    return null;
  }

  /**
   * Get category hierarchy (parent and children)
   */
  async getCategoryHierarchy(
    ctx: RequestContext,
    categoryId: string
  ): Promise<{ parent: ProductCategory | null; children: ProductCategory[] }> {
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      return { parent: null, children: [] };
    }

    const parent = category.parentId
      ? await this.categoryRepo.findOne({ where: { id: category.parentId } })
      : null;

    const children = await this.categoryRepo.find({
      where: { parentId: categoryId, isActive: true },
      order: { displayOrder: 'ASC' },
    });

    return { parent, children };
  }

  /**
   * Get category full path (e.g., "Skincare > Serums > Vitamin C Serums")
   */
  async getCategoryFullPath(
    ctx: RequestContext,
    categoryId: string
  ): Promise<string> {
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      return '';
    }

    const parts: string[] = [category.name];
    let currentCategory = category;

    while (currentCategory.parentId) {
      const parent = await this.categoryRepo.findOne({
        where: { id: currentCategory.parentId },
      });
      if (!parent) break;
      parts.unshift(parent.name);
      currentCategory = parent;
    }

    return parts.join(' > ');
  }

  // ========================================
  // Taxonomy Lookup Queries
  // ========================================

  /**
   * Get all product functions
   */
  async getProductFunctions(
    ctx: RequestContext,
    categoryId?: string,
    includeInactive = false
  ): Promise<ProductFunction[]> {
    const where: any = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    const functions = await this.functionRepo.find({
      where,
      order: { displayOrder: 'ASC', name: 'ASC' },
    });

    // Filter by category compatibility if provided
    if (categoryId) {
      return functions.filter((fn) => {
        if (!fn.categoryCompatibility) return true;
        const compatibility = fn.categoryCompatibility as any;
        return !Array.isArray(compatibility) || compatibility.includes(categoryId);
      });
    }

    return functions;
  }

  /**
   * Get all skin concerns
   */
  async getSkinConcerns(
    ctx: RequestContext,
    includeInactive = false
  ): Promise<SkinConcern[]> {
    const where: any = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    return this.concernRepo.find({
      where,
      order: { displayOrder: 'ASC', name: 'ASC' },
    });
  }

  /**
   * Get all product formats
   */
  async getProductFormats(
    ctx: RequestContext,
    category?: string,
    includeInactive = false
  ): Promise<ProductFormat[]> {
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (!includeInactive) {
      where.isActive = true;
    }

    return this.formatRepo.find({
      where,
      order: { name: 'ASC' },
    });
  }

  /**
   * Get all target areas
   */
  async getTargetAreas(
    ctx: RequestContext,
    includeInactive = false
  ): Promise<TargetArea[]> {
    const where: any = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    return this.targetAreaRepo.find({
      where,
      order: { name: 'ASC' },
    });
  }

  /**
   * Get all product regions
   */
  async getProductRegions(
    ctx: RequestContext,
    includeInactive = false
  ): Promise<ProductRegion[]> {
    const where: any = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    return this.regionRepo.find({
      where,
      order: { name: 'ASC' },
    });
  }

  // ========================================
  // Product Taxonomy Queries
  // ========================================

  /**
   * Get product taxonomy for a specific product
   */
  async getProductTaxonomy(
    ctx: RequestContext,
    productId: string
  ): Promise<ProductTaxonomy | null> {
    return this.taxonomyRepo.findOne({
      where: { productId },
    });
  }

  /**
   * Get full taxonomy data with all relationships
   */
  async getProductTaxonomyWithRelations(
    ctx: RequestContext,
    productId: string
  ): Promise<{
    taxonomy: ProductTaxonomy | null;
    category: ProductCategory | null;
    primaryFunctions: ProductFunction[];
    skinConcerns: SkinConcern[];
    targetAreas: TargetArea[];
    productFormat: ProductFormat | null;
    region: ProductRegion | null;
  }> {
    const taxonomy = await this.getProductTaxonomy(ctx, productId);

    if (!taxonomy) {
      return {
        taxonomy: null,
        category: null,
        primaryFunctions: [],
        skinConcerns: [],
        targetAreas: [],
        productFormat: null,
        region: null,
      };
    }

    const [category, primaryFunctions, skinConcerns, targetAreas, productFormat, region] =
      await Promise.all([
        taxonomy.categoryId
          ? this.categoryRepo.findOne({ where: { id: taxonomy.categoryId } })
          : null,
        taxonomy.primaryFunctionIds && taxonomy.primaryFunctionIds.length > 0
          ? this.functionRepo.find({ where: { id: In(taxonomy.primaryFunctionIds) } })
          : [],
        taxonomy.skinConcernIds && taxonomy.skinConcernIds.length > 0
          ? this.concernRepo.find({ where: { id: In(taxonomy.skinConcernIds) } })
          : [],
        taxonomy.targetAreaIds && taxonomy.targetAreaIds.length > 0
          ? this.targetAreaRepo.find({ where: { id: In(taxonomy.targetAreaIds) } })
          : [],
        taxonomy.productFormatId
          ? this.formatRepo.findOne({ where: { id: taxonomy.productFormatId } })
          : null,
        taxonomy.regionId
          ? this.regionRepo.findOne({ where: { id: taxonomy.regionId } })
          : null,
      ]);

    return {
      taxonomy,
      category,
      primaryFunctions,
      skinConcerns,
      targetAreas,
      productFormat,
      region,
    };
  }

  // ========================================
  // Taxonomy Statistics
  // ========================================

  /**
   * Get taxonomy completeness statistics
   */
  async getTaxonomyStats(ctx: RequestContext): Promise<{
    totalProducts: number;
    productsWithTaxonomy: number;
    productsWithoutTaxonomy: number;
    averageCompletenessScore: number;
    scoreDistribution: {
      excellent: number;
      good: number;
      fair: number;
      poor: number;
    };
    missingCategories: number;
    missingFunctions: number;
    missingFormats: number;
    needsReview: number;
  }> {
    // Get all taxonomies
    const allTaxonomies = await this.taxonomyRepo.find();

    const totalProducts = allTaxonomies.length;
    const productsWithTaxonomy = allTaxonomies.filter(
      (t) => t.taxonomyCompletenessScore && t.taxonomyCompletenessScore > 0
    ).length;
    const productsWithoutTaxonomy = totalProducts - productsWithTaxonomy;

    // Calculate average completeness score
    const totalScore = allTaxonomies.reduce(
      (sum, t) => sum + (t.taxonomyCompletenessScore || 0),
      0
    );
    const averageCompletenessScore =
      totalProducts > 0 ? totalScore / totalProducts : 0;

    // Score distribution
    const scoreDistribution = {
      excellent: allTaxonomies.filter(
        (t) => t.taxonomyCompletenessScore && t.taxonomyCompletenessScore >= 90
      ).length,
      good: allTaxonomies.filter(
        (t) =>
          t.taxonomyCompletenessScore &&
          t.taxonomyCompletenessScore >= 70 &&
          t.taxonomyCompletenessScore < 90
      ).length,
      fair: allTaxonomies.filter(
        (t) =>
          t.taxonomyCompletenessScore &&
          t.taxonomyCompletenessScore >= 50 &&
          t.taxonomyCompletenessScore < 70
      ).length,
      poor: allTaxonomies.filter(
        (t) => !t.taxonomyCompletenessScore || t.taxonomyCompletenessScore < 50
      ).length,
    };

    // Data quality issues
    const missingCategories = allTaxonomies.filter((t) => !t.categoryId).length;
    const missingFunctions = allTaxonomies.filter(
      (t) => !t.primaryFunctionIds || t.primaryFunctionIds.length === 0
    ).length;
    const missingFormats = allTaxonomies.filter((t) => !t.productFormatId).length;
    const needsReview = allTaxonomies.filter(
      (t) => !t.lastReviewedAt || t.taxonomyCompletenessScore! < 70
    ).length;

    return {
      totalProducts,
      productsWithTaxonomy,
      productsWithoutTaxonomy,
      averageCompletenessScore,
      scoreDistribution,
      missingCategories,
      missingFunctions,
      missingFormats,
      needsReview,
    };
  }

  // ========================================
  // Taxonomy Mutations
  // ========================================

  /**
   * Create or update product taxonomy
   */
  async updateProductTaxonomy(
    ctx: RequestContext,
    input: ProductTaxonomyInput
  ): Promise<ProductTaxonomy> {
    // Check if taxonomy exists
    let taxonomy = await this.taxonomyRepo.findOne({
      where: { productId: input.productId },
    });

    if (taxonomy) {
      // Update existing taxonomy
      Object.assign(taxonomy, {
        categoryId: input.categoryId ?? taxonomy.categoryId,
        primaryFunctionIds: input.primaryFunctionIds ?? taxonomy.primaryFunctionIds,
        skinConcernIds: input.skinConcernIds ?? taxonomy.skinConcernIds,
        targetAreaIds: input.targetAreaIds ?? taxonomy.targetAreaIds,
        productFormatId: input.productFormatId ?? taxonomy.productFormatId,
        regionId: input.regionId ?? taxonomy.regionId,
        usageTime: input.usageTime ?? taxonomy.usageTime,
        professionalLevel: input.professionalLevel ?? taxonomy.professionalLevel,
        protocolRequired: input.protocolRequired ?? taxonomy.protocolRequired,
        formulationBase: input.formulationBase ?? taxonomy.formulationBase,
      });
    } else {
      // Create new taxonomy
      taxonomy = this.taxonomyRepo.create({
        productId: input.productId,
        categoryId: input.categoryId,
        primaryFunctionIds: input.primaryFunctionIds,
        skinConcernIds: input.skinConcernIds,
        targetAreaIds: input.targetAreaIds,
        productFormatId: input.productFormatId,
        regionId: input.regionId,
        usageTime: input.usageTime as any,
        professionalLevel: input.professionalLevel as any,
        protocolRequired: input.protocolRequired,
        formulationBase: input.formulationBase,
      });
    }

    // Save (trigger will calculate completeness score)
    return this.taxonomyRepo.save(taxonomy);
  }

  /**
   * Bulk update taxonomy for multiple products
   */
  async bulkUpdateTaxonomy(
    ctx: RequestContext,
    updates: BulkTaxonomyUpdate[]
  ): Promise<{
    success: boolean;
    updatedCount: number;
    errors: Array<{ productId: string; message: string }>;
  }> {
    const errors: Array<{ productId: string; message: string }> = [];
    let updatedCount = 0;

    for (const update of updates) {
      try {
        await this.updateProductTaxonomy(ctx, update);
        updatedCount++;
      } catch (error) {
        errors.push({
          productId: update.productId,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      success: errors.length === 0,
      updatedCount,
      errors,
    };
  }

  /**
   * Get product count for a category
   */
  async getProductCountForCategory(
    ctx: RequestContext,
    categoryId: string
  ): Promise<number> {
    return this.taxonomyRepo.count({
      where: { categoryId },
    });
  }

  /**
   * Get product count for a function
   */
  async getProductCountForFunction(
    ctx: RequestContext,
    functionId: string
  ): Promise<number> {
    const taxonomies = await this.taxonomyRepo.find();
    return taxonomies.filter(
      (t) => t.primaryFunctionIds && t.primaryFunctionIds.includes(functionId)
    ).length;
  }

  /**
   * Get product count for a concern
   */
  async getProductCountForConcern(
    ctx: RequestContext,
    concernId: string
  ): Promise<number> {
    const taxonomies = await this.taxonomyRepo.find();
    return taxonomies.filter(
      (t) => t.skinConcernIds && t.skinConcernIds.includes(concernId)
    ).length;
  }

  /**
   * Get product count for a format
   */
  async getProductCountForFormat(
    ctx: RequestContext,
    formatId: string
  ): Promise<number> {
    return this.taxonomyRepo.count({
      where: { productFormatId: formatId },
    });
  }

  /**
   * Get product count for a region
   */
  async getProductCountForRegion(
    ctx: RequestContext,
    regionId: string
  ): Promise<number> {
    return this.taxonomyRepo.count({
      where: { regionId },
    });
  }
}
