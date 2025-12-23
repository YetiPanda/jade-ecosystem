/**
 * Taxonomy Resolvers for JADE Spa Marketplace
 *
 * Feature: Week 3 - Advanced Product Taxonomy
 *
 * Implements GraphQL resolvers for:
 * - Category hierarchy queries
 * - Taxonomy lookup data (functions, concerns, formats, etc.)
 * - Product taxonomy queries and mutations
 * - Taxonomy statistics and quality metrics
 */

import { Args, Query, Resolver, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { Ctx, RequestContext, Allow, Permission } from '@vendure/core';
import { TaxonomyService, ProductTaxonomyInput, BulkTaxonomyUpdate } from '../services/taxonomy.service';
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
 * Product Category Resolver
 */
@Resolver('ProductCategory')
export class ProductCategoryResolver {
  constructor(private taxonomyService: TaxonomyService) {}

  /**
   * Get all product categories with optional filters
   */
  @Query()
  @Allow(Permission.Public)
  async productCategories(
    @Ctx() ctx: RequestContext,
    @Args('level') level?: number,
    @Args('parentId') parentId?: string,
    @Args('includeInactive') includeInactive?: boolean
  ): Promise<ProductCategory[]> {
    return this.taxonomyService.getProductCategories(ctx, level, parentId, includeInactive);
  }

  /**
   * Get single category by ID or slug
   */
  @Query()
  @Allow(Permission.Public)
  async productCategory(
    @Ctx() ctx: RequestContext,
    @Args('id') id?: string,
    @Args('slug') slug?: string
  ): Promise<ProductCategory | null> {
    return this.taxonomyService.getProductCategory(ctx, id, slug);
  }

  /**
   * Field resolver for parent category
   */
  @ResolveField()
  async parent(
    @Ctx() ctx: RequestContext,
    @Parent() category: ProductCategory
  ): Promise<ProductCategory | null> {
    if (!category.parentId) {
      return null;
    }
    return this.taxonomyService.getProductCategory(ctx, category.parentId);
  }

  /**
   * Field resolver for child categories
   */
  @ResolveField()
  async children(
    @Ctx() ctx: RequestContext,
    @Parent() category: ProductCategory
  ): Promise<ProductCategory[]> {
    const hierarchy = await this.taxonomyService.getCategoryHierarchy(ctx, category.id);
    return hierarchy.children;
  }

  /**
   * Field resolver for full category path
   */
  @ResolveField()
  async fullPath(
    @Ctx() ctx: RequestContext,
    @Parent() category: ProductCategory
  ): Promise<string> {
    return this.taxonomyService.getCategoryFullPath(ctx, category.id);
  }

  /**
   * Field resolver for product count
   */
  @ResolveField()
  async productCount(
    @Ctx() ctx: RequestContext,
    @Parent() category: ProductCategory
  ): Promise<number> {
    return this.taxonomyService.getProductCountForCategory(ctx, category.id);
  }
}

/**
 * Product Function Resolver
 */
@Resolver('ProductFunction')
export class ProductFunctionResolver {
  constructor(private taxonomyService: TaxonomyService) {}

  /**
   * Get all product functions
   */
  @Query()
  @Allow(Permission.Public)
  async productFunctions(
    @Ctx() ctx: RequestContext,
    @Args('categoryId') categoryId?: string,
    @Args('includeInactive') includeInactive?: boolean
  ): Promise<ProductFunction[]> {
    return this.taxonomyService.getProductFunctions(ctx, categoryId, includeInactive);
  }

  /**
   * Field resolver for product count
   */
  @ResolveField()
  async productCount(
    @Ctx() ctx: RequestContext,
    @Parent() func: ProductFunction
  ): Promise<number> {
    return this.taxonomyService.getProductCountForFunction(ctx, func.id);
  }
}

/**
 * Skin Concern Resolver
 */
@Resolver('SkinConcern')
export class SkinConcernResolver {
  constructor(private taxonomyService: TaxonomyService) {}

  /**
   * Get all skin concerns
   */
  @Query()
  @Allow(Permission.Public)
  async skinConcerns(
    @Ctx() ctx: RequestContext,
    @Args('includeInactive') includeInactive?: boolean
  ): Promise<SkinConcern[]> {
    return this.taxonomyService.getSkinConcerns(ctx, includeInactive);
  }

  /**
   * Field resolver for product count
   */
  @ResolveField()
  async productCount(
    @Ctx() ctx: RequestContext,
    @Parent() concern: SkinConcern
  ): Promise<number> {
    return this.taxonomyService.getProductCountForConcern(ctx, concern.id);
  }
}

/**
 * Product Format Resolver
 */
@Resolver('ProductFormat')
export class ProductFormatResolver {
  constructor(private taxonomyService: TaxonomyService) {}

  /**
   * Get all product formats
   */
  @Query()
  @Allow(Permission.Public)
  async productFormats(
    @Ctx() ctx: RequestContext,
    @Args('category') category?: string,
    @Args('includeInactive') includeInactive?: boolean
  ): Promise<ProductFormat[]> {
    return this.taxonomyService.getProductFormats(ctx, category, includeInactive);
  }

  /**
   * Field resolver for product count
   */
  @ResolveField()
  async productCount(
    @Ctx() ctx: RequestContext,
    @Parent() format: ProductFormat
  ): Promise<number> {
    return this.taxonomyService.getProductCountForFormat(ctx, format.id);
  }
}

/**
 * Target Area Resolver
 */
@Resolver('TargetArea')
export class TargetAreaResolver {
  constructor(private taxonomyService: TaxonomyService) {}

  /**
   * Get all target areas
   */
  @Query()
  @Allow(Permission.Public)
  async targetAreas(
    @Ctx() ctx: RequestContext,
    @Args('includeInactive') includeInactive?: boolean
  ): Promise<TargetArea[]> {
    return this.taxonomyService.getTargetAreas(ctx, includeInactive);
  }

  /**
   * Field resolver for product count
   */
  @ResolveField()
  async productCount(
    @Ctx() ctx: RequestContext,
    @Parent() area: TargetArea
  ): Promise<number> {
    // Count products targeting this area
    const allTaxonomies = await this.taxonomyService['taxonomyRepo'].find();
    return allTaxonomies.filter(
      (t) => t.targetAreaIds && t.targetAreaIds.includes(area.id)
    ).length;
  }
}

/**
 * Product Region Resolver
 */
@Resolver('ProductRegion')
export class ProductRegionResolver {
  constructor(private taxonomyService: TaxonomyService) {}

  /**
   * Get all product regions
   */
  @Query()
  @Allow(Permission.Public)
  async productRegions(
    @Ctx() ctx: RequestContext,
    @Args('includeInactive') includeInactive?: boolean
  ): Promise<ProductRegion[]> {
    return this.taxonomyService.getProductRegions(ctx, includeInactive);
  }

  /**
   * Field resolver for product count
   */
  @ResolveField()
  async productCount(
    @Ctx() ctx: RequestContext,
    @Parent() region: ProductRegion
  ): Promise<number> {
    return this.taxonomyService.getProductCountForRegion(ctx, region.id);
  }
}

/**
 * Product Taxonomy Resolver
 */
@Resolver('ProductTaxonomy')
export class ProductTaxonomyResolver {
  constructor(private taxonomyService: TaxonomyService) {}

  /**
   * Get product taxonomy for a specific product
   */
  @Query()
  @Allow(Permission.Public)
  async productTaxonomy(
    @Ctx() ctx: RequestContext,
    @Args('productId') productId: string
  ): Promise<ProductTaxonomy | null> {
    return this.taxonomyService.getProductTaxonomy(ctx, productId);
  }

  /**
   * Get taxonomy statistics
   */
  @Query()
  @Allow(Permission.Authenticated)
  async taxonomyStats(@Ctx() ctx: RequestContext) {
    return this.taxonomyService.getTaxonomyStats(ctx);
  }

  /**
   * Field resolver for category
   */
  @ResolveField()
  async category(
    @Ctx() ctx: RequestContext,
    @Parent() taxonomy: ProductTaxonomy
  ): Promise<ProductCategory | null> {
    if (!taxonomy.categoryId) {
      return null;
    }
    return this.taxonomyService.getProductCategory(ctx, taxonomy.categoryId);
  }

  /**
   * Field resolver for primary functions
   */
  @ResolveField()
  async primaryFunctions(
    @Ctx() ctx: RequestContext,
    @Parent() taxonomy: ProductTaxonomy
  ): Promise<ProductFunction[]> {
    const data = await this.taxonomyService.getProductTaxonomyWithRelations(
      ctx,
      taxonomy.productId
    );
    return data.primaryFunctions;
  }

  /**
   * Field resolver for skin concerns
   */
  @ResolveField()
  async skinConcerns(
    @Ctx() ctx: RequestContext,
    @Parent() taxonomy: ProductTaxonomy
  ): Promise<SkinConcern[]> {
    const data = await this.taxonomyService.getProductTaxonomyWithRelations(
      ctx,
      taxonomy.productId
    );
    return data.skinConcerns;
  }

  /**
   * Field resolver for target areas
   */
  @ResolveField()
  async targetAreas(
    @Ctx() ctx: RequestContext,
    @Parent() taxonomy: ProductTaxonomy
  ): Promise<TargetArea[]> {
    const data = await this.taxonomyService.getProductTaxonomyWithRelations(
      ctx,
      taxonomy.productId
    );
    return data.targetAreas;
  }

  /**
   * Field resolver for product format
   */
  @ResolveField()
  async productFormat(
    @Ctx() ctx: RequestContext,
    @Parent() taxonomy: ProductTaxonomy
  ): Promise<ProductFormat | null> {
    const data = await this.taxonomyService.getProductTaxonomyWithRelations(
      ctx,
      taxonomy.productId
    );
    return data.productFormat;
  }

  /**
   * Field resolver for region
   */
  @ResolveField()
  async region(
    @Ctx() ctx: RequestContext,
    @Parent() taxonomy: ProductTaxonomy
  ): Promise<ProductRegion | null> {
    const data = await this.taxonomyService.getProductTaxonomyWithRelations(
      ctx,
      taxonomy.productId
    );
    return data.region;
  }

  /**
   * Update product taxonomy
   */
  @Mutation()
  @Allow(Permission.UpdateCatalog, Permission.SuperAdmin)
  async updateProductTaxonomy(
    @Ctx() ctx: RequestContext,
    @Args('input') input: ProductTaxonomyInput
  ): Promise<ProductTaxonomy> {
    return this.taxonomyService.updateProductTaxonomy(ctx, input);
  }

  /**
   * Bulk update taxonomy for multiple products
   */
  @Mutation()
  @Allow(Permission.SuperAdmin)
  async bulkUpdateTaxonomy(
    @Ctx() ctx: RequestContext,
    @Args('updates') updates: BulkTaxonomyUpdate[]
  ) {
    return this.taxonomyService.bulkUpdateTaxonomy(ctx, updates);
  }
}

/**
 * Taxonomy Stats Resolver
 */
@Resolver('TaxonomyStats')
export class TaxonomyStatsResolver {
  /**
   * Field resolver for score distribution
   */
  @ResolveField()
  async scoreDistribution(@Parent() stats: any) {
    return stats.scoreDistribution;
  }

  /**
   * Field resolver for category coverage
   * Note: This would require additional implementation to get per-category stats
   */
  @ResolveField()
  async categoryCoverage(@Parent() stats: any) {
    // Return empty array for now - can be implemented later if needed
    return [];
  }
}

/**
 * Product Type Extension - Add taxonomy field to Product
 */
@Resolver('Product')
export class ProductTaxonomyExtensionResolver {
  constructor(private taxonomyService: TaxonomyService) {}

  /**
   * Field resolver to add taxonomy to Product type
   */
  @ResolveField()
  async taxonomy(
    @Ctx() ctx: RequestContext,
    @Parent() product: any
  ): Promise<ProductTaxonomy | null> {
    return this.taxonomyService.getProductTaxonomy(ctx, product.id);
  }
}
