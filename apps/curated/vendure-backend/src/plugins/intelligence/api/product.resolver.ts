/**
 * Product Resolvers for JADE Spa Marketplace
 *
 * Tasks: T071, T072
 * - T071: Implement searchProducts resolver
 * - T072: Implement product resolver with progressive disclosure
 */

import { Args, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Ctx, RequestContext, Allow, Permission } from '@vendure/core';
import { ProductService } from '../services/product.service';

/**
 * Product filters input
 */
export interface ProductFiltersInput {
  categoryIds?: string[];
  vendorId?: string;
  priceRange?: { min: number; max: number };
  skinTypes?: string[];
  ingredients?: string[];
  concerns?: string[];
  inStockOnly?: boolean;
  minInventory?: number;
}

/**
 * Pagination input
 */
export interface PaginationInput {
  skip?: number;
  take?: number;
}

/**
 * Marketplace Product Resolver
 */
@Resolver('MarketplaceProduct')
export class MarketplaceProductResolver {
  constructor(private productService: ProductService) {}

  /**
   * Search products with filters
   *
   * Task: T071 - Implement searchProducts resolver
   *
   * @example
   * query {
   *   searchProducts(
   *     query: "serum"
   *     filters: { skinTypes: ["dry"], inStockOnly: true }
   *     pagination: { skip: 0, take: 20 }
   *     includeScan: false
   *   ) {
   *     items {
   *       product { id name }
   *       glance { heroBenefit rating skinTypes }
   *       pricingTiers { minQuantity unitPrice discountPercentage }
   *       inventoryLevel
   *     }
   *     totalItems
   *     hasNextPage
   *   }
   * }
   */
  @Query()
  @Allow(Permission.Public)
  async searchProducts(
    @Ctx() ctx: RequestContext,
    @Args('query') query?: string,
    @Args('filters') filters?: ProductFiltersInput,
    @Args('pagination') pagination?: PaginationInput,
    @Args('includeScan') includeScan?: boolean
  ) {
    const result = await this.productService.searchProducts(
      ctx,
      query,
      filters,
      {
        skip: pagination?.skip,
        take: pagination?.take,
      },
      {
        scan: includeScan || false,
        study: false,
      }
    );

    return {
      items: result.items,
      totalItems: result.totalItems,
      hasNextPage: result.hasNextPage,
      hasPreviousPage: result.hasPreviousPage,
    };
  }

  /**
   * Get single product by ID with progressive disclosure
   *
   * Task: T072 - Implement product resolver with progressive disclosure
   *
   * @example
   * query {
   *   product(id: "1", includeStudy: true) {
   *     product { id name description }
   *     glance { heroBenefit rating reviewCount skinTypes }
   *     scan {
   *       keyIngredients { name percentage purpose }
   *       benefits
   *       howToUse
   *       texture
   *       concerns
   *     }
   *     study {
   *       fullIngredientList
   *       clinicalData { description participants duration results }
   *       certifications
   *       safetyInfo
   *       contraindications
   *     }
   *     pricingTiers { minQuantity unitPrice discountPercentage }
   *     inventoryLevel
   *     vendorId
   *   }
   * }
   */
  @Query()
  @Allow(Permission.Public)
  async product(
    @Ctx() ctx: RequestContext,
    @Args('id') id: string,
    @Args('includeStudy') includeStudy?: boolean
  ) {
    return this.productService.getProduct(ctx, id, includeStudy || false);
  }

  /**
   * Get products by vendor
   *
   * @example
   * query {
   *   productsByVendor(
   *     vendorId: "vendor-123"
   *     pagination: { skip: 0, take: 20 }
   *   ) {
   *     items {
   *       product { id name }
   *       glance { heroBenefit }
   *       inventoryLevel
   *     }
   *     totalItems
   *   }
   * }
   */
  @Query()
  @Allow(Permission.Public)
  async productsByVendor(
    @Ctx() ctx: RequestContext,
    @Args('vendorId') vendorId: string,
    @Args('pagination') pagination?: PaginationInput
  ) {
    const result = await this.productService.getProductsByVendor(
      ctx,
      vendorId,
      {
        skip: pagination?.skip,
        take: pagination?.take,
      }
    );

    return {
      items: result.items,
      totalItems: result.totalItems,
      hasNextPage: result.hasNextPage,
      hasPreviousPage: result.hasPreviousPage,
    };
  }

  /**
   * Field resolver for product base data
   */
  @ResolveField()
  async product(@Parent() marketplaceProduct: any) {
    return marketplaceProduct.product;
  }

  /**
   * Field resolver for glance data
   */
  @ResolveField()
  async glance(@Parent() marketplaceProduct: any) {
    return marketplaceProduct.glance;
  }

  /**
   * Field resolver for scan data (lazy loaded)
   */
  @ResolveField()
  async scan(@Parent() marketplaceProduct: any) {
    return marketplaceProduct.scan || null;
  }

  /**
   * Field resolver for study data (lazy loaded)
   */
  @ResolveField()
  async study(@Parent() marketplaceProduct: any) {
    return marketplaceProduct.study || null;
  }

  /**
   * Field resolver for pricing tiers
   */
  @ResolveField()
  async pricingTiers(@Parent() marketplaceProduct: any) {
    return marketplaceProduct.pricingTiers;
  }

  /**
   * Field resolver for inventory level
   */
  @ResolveField()
  async inventoryLevel(@Parent() marketplaceProduct: any) {
    return marketplaceProduct.inventoryLevel;
  }

  /**
   * Field resolver for vendor ID
   */
  @ResolveField()
  async vendorId(@Parent() marketplaceProduct: any) {
    return marketplaceProduct.vendorId;
  }
}

/**
 * Product Glance Resolver
 */
@Resolver('ProductGlance')
export class ProductGlanceResolver {
  @ResolveField()
  async heroBenefit(@Parent() glance: any) {
    return glance.heroBenefit;
  }

  @ResolveField()
  async rating(@Parent() glance: any) {
    return glance.rating;
  }

  @ResolveField()
  async reviewCount(@Parent() glance: any) {
    return glance.reviewCount;
  }

  @ResolveField()
  async skinTypes(@Parent() glance: any) {
    return glance.skinTypes;
  }
}

/**
 * Product Scan Resolver
 */
@Resolver('ProductScan')
export class ProductScanResolver {
  @ResolveField()
  async keyIngredients(@Parent() scan: any) {
    return scan.keyIngredients;
  }

  @ResolveField()
  async benefits(@Parent() scan: any) {
    return scan.benefits;
  }

  @ResolveField()
  async howToUse(@Parent() scan: any) {
    return scan.howToUse;
  }

  @ResolveField()
  async texture(@Parent() scan: any) {
    return scan.texture;
  }

  @ResolveField()
  async concerns(@Parent() scan: any) {
    return scan.concerns;
  }
}

/**
 * Product Study Resolver
 */
@Resolver('ProductStudy')
export class ProductStudyResolver {
  @ResolveField()
  async fullIngredientList(@Parent() study: any) {
    return study.fullIngredientList;
  }

  @ResolveField()
  async clinicalData(@Parent() study: any) {
    return study.clinicalData;
  }

  @ResolveField()
  async certifications(@Parent() study: any) {
    return study.certifications;
  }

  @ResolveField()
  async safetyInfo(@Parent() study: any) {
    return study.safetyInfo;
  }

  @ResolveField()
  async contraindications(@Parent() study: any) {
    return study.contraindications;
  }

  @ResolveField()
  async storageInstructions(@Parent() study: any) {
    return study.storageInstructions;
  }
}

/**
 * Pricing Tier Resolver
 */
@Resolver('PricingTier')
export class PricingTierResolver {
  @ResolveField()
  async minQuantity(@Parent() tier: any) {
    return tier.minQuantity;
  }

  @ResolveField()
  async unitPrice(@Parent() tier: any) {
    return tier.unitPrice;
  }

  @ResolveField()
  async discountPercentage(@Parent() tier: any) {
    return tier.discountPercentage;
  }
}
