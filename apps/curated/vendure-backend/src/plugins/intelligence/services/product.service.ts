/**
 * ProductService for JADE Spa Marketplace
 *
 * Task: T065 - Implement ProductService for catalog operations
 *
 * Handles product catalog operations including:
 * - Product search with filters
 * - Progressive disclosure data loading (glance/scan/study)
 * - Pricing tier application
 * - Inventory management
 * - Vendor-specific product queries
 */

import { Injectable, Inject } from '@nestjs/common';
import {
  RequestContext,
  TransactionalConnection,
  Product,
  ProductVariant,
  ListQueryBuilder,
  ListQueryOptions,
  PaginatedList,
  ID,
} from '@vendure/core';
import {
  ProductGlance,
  ProductScan,
  ProductStudy,
  PricingTier,
  parseGlanceData,
  parseScanData,
  parseStudyData,
  parsePricingTiers,
  getApplicableTier,
} from '../entities/product.entity';

/**
 * Product search filters
 */
export interface ProductFilters {
  /** Filter by category IDs */
  categoryIds?: ID[];

  /** Filter by vendor ID */
  vendorId?: ID;

  /** Price range in cents */
  priceRange?: {
    min: number;
    max: number;
  };

  /** Filter by skin types */
  skinTypes?: string[];

  /** Filter by ingredients (must contain all) */
  ingredients?: string[];

  /** Filter by product concerns (e.g., "acne", "aging") */
  concerns?: string[];

  /** Only show products in stock */
  inStockOnly?: boolean;

  /** Minimum inventory level */
  minInventory?: number;
}

/**
 * Product with progressive disclosure data
 */
export interface ProductWithDisclosure {
  /** Base product data */
  product: Product;

  /** Glance level data (always included) */
  glance: ProductGlance;

  /** Scan level data (optional) */
  scan?: ProductScan;

  /** Study level data (optional) */
  study?: ProductStudy;

  /** Pricing tiers */
  pricingTiers: PricingTier[];

  /** Current inventory level */
  inventoryLevel: number;

  /** Vendor ID */
  vendorId: string;
}

/**
 * Paginated product search results
 */
export interface ProductSearchResult {
  items: ProductWithDisclosure[];
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

@Injectable()
export class ProductService {
  constructor(
    @Inject(TransactionalConnection) private connection: TransactionalConnection,
    @Inject(ListQueryBuilder) private listQueryBuilder: ListQueryBuilder
  ) {}

  /**
   * Search products with filters and pagination
   *
   * @param ctx - Request context
   * @param searchTerm - Text search term
   * @param filters - Product filters
   * @param options - Pagination and sorting options
   * @param includeDisclosure - Which disclosure levels to include (glance, scan, study)
   * @returns Paginated product results with progressive disclosure
   */
  async searchProducts(
    ctx: RequestContext,
    searchTerm?: string,
    filters?: ProductFilters,
    options?: ListQueryOptions<Product>,
    includeDisclosure: { scan?: boolean; study?: boolean } = {}
  ): Promise<ProductSearchResult> {
    // Build base query
    const qb = this.connection
      .getRepository(ctx, Product)
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'variant')
      .leftJoinAndSelect('product.assets', 'asset')
      .leftJoinAndSelect('product.featuredAsset', 'featuredAsset')
      .leftJoinAndSelect('product.facetValues', 'facetValue')
      .where('product.deletedAt IS NULL');

    // Apply text search
    if (searchTerm) {
      qb.andWhere(
        '(product.name ILIKE :searchTerm OR product.description ILIKE :searchTerm)',
        { searchTerm: `%${searchTerm}%` }
      );
    }

    // Apply vendor filter
    if (filters?.vendorId) {
      qb.andWhere('product.customFieldsVendorid = :vendorId', {
        vendorId: filters.vendorId,
      });
    }

    // Apply skin type filter (JSONB query)
    if (filters?.skinTypes && filters.skinTypes.length > 0) {
      qb.andWhere(
        "product.customFieldsGlancedata::jsonb @> :skinTypes",
        { skinTypes: JSON.stringify({ skinTypes: filters.skinTypes }) }
      );
    }

    // Apply in-stock filter
    if (filters?.inStockOnly) {
      qb.andWhere('product.customFieldsInventorylevel > 0');
    }

    // Apply minimum inventory filter
    if (filters?.minInventory !== undefined) {
      qb.andWhere('product.customFieldsInventorylevel >= :minInventory', {
        minInventory: filters.minInventory,
      });
    }

    // Apply category filter
    if (filters?.categoryIds && filters.categoryIds.length > 0) {
      qb.innerJoin('product.productCategories', 'category')
        .andWhere('category.id IN (:...categoryIds)', {
          categoryIds: filters.categoryIds,
        });
    }

    // Apply price range filter (using first variant's price)
    if (filters?.priceRange) {
      qb.andWhere('variant.price >= :minPrice', { minPrice: filters.priceRange.min })
        .andWhere('variant.price <= :maxPrice', { maxPrice: filters.priceRange.max });
    }

    // Apply pagination and sorting
    const defaultOptions: ListQueryOptions<Product> = {
      skip: 0,
      take: 20,
      sort: { name: 'ASC' },
    };
    const queryOptions = { ...defaultOptions, ...options };

    qb.skip(queryOptions.skip || 0).take(queryOptions.take || 20);

    // Apply sorting
    if (queryOptions.sort) {
      Object.entries(queryOptions.sort).forEach(([field, direction]) => {
        qb.addOrderBy(`product.${field}`, direction as 'ASC' | 'DESC');
      });
    }

    // Execute query
    const [products, totalItems] = await qb.getManyAndCount();

    // Transform to ProductWithDisclosure
    const items = products.map(product =>
      this.transformProductWithDisclosure(product, includeDisclosure)
    );

    // Calculate pagination info
    const skip = queryOptions.skip || 0;
    const take = queryOptions.take || 20;
    const hasNextPage = skip + take < totalItems;
    const hasPreviousPage = skip > 0;

    return {
      items,
      totalItems,
      hasNextPage,
      hasPreviousPage,
    };
  }

  /**
   * Get a single product by ID with full disclosure
   *
   * @param ctx - Request context
   * @param productId - Product ID
   * @param includeStudy - Whether to include study-level data
   * @returns Product with full disclosure data
   */
  async getProduct(
    ctx: RequestContext,
    productId: ID,
    includeStudy: boolean = true
  ): Promise<ProductWithDisclosure | null> {
    const product = await this.connection
      .getRepository(ctx, Product)
      .findOne({
        where: { id: productId as string },
        relations: ['variants', 'assets', 'featuredAsset', 'facetValues'],
      });

    if (!product) {
      return null;
    }

    return this.transformProductWithDisclosure(product, {
      scan: true,
      study: includeStudy,
    });
  }

  /**
   * Get products by vendor ID
   *
   * @param ctx - Request context
   * @param vendorId - Vendor organization ID
   * @param options - Pagination options
   * @returns Paginated list of vendor's products
   */
  async getProductsByVendor(
    ctx: RequestContext,
    vendorId: ID,
    options?: ListQueryOptions<Product>
  ): Promise<ProductSearchResult> {
    return this.searchProducts(
      ctx,
      undefined,
      { vendorId },
      options,
      { scan: false, study: false }
    );
  }

  /**
   * Calculate price for a product at a given quantity
   *
   * @param product - Product with pricing tiers
   * @param quantity - Quantity to purchase
   * @returns Applicable unit price and tier info
   */
  calculatePrice(
    product: ProductWithDisclosure,
    quantity: number
  ): { unitPrice: number; tier: PricingTier; totalPrice: number } {
    const tier = getApplicableTier(product.pricingTiers, quantity);
    const totalPrice = tier.unitPrice * quantity;

    return {
      unitPrice: tier.unitPrice,
      tier,
      totalPrice,
    };
  }

  /**
   * Check if product has sufficient inventory
   *
   * @param product - Product to check
   * @param quantity - Requested quantity
   * @returns True if inventory is sufficient
   */
  hasInventory(product: ProductWithDisclosure, quantity: number): boolean {
    return product.inventoryLevel >= quantity;
  }

  /**
   * Update product inventory level
   *
   * @param ctx - Request context
   * @param productId - Product ID
   * @param newLevel - New inventory level
   */
  async updateInventory(
    ctx: RequestContext,
    productId: ID,
    newLevel: number
  ): Promise<void> {
    await this.connection
      .getRepository(ctx, Product)
      .update(productId, {
        customFields: {
          inventoryLevel: newLevel,
        } as any,
      });
  }

  /**
   * Reserve inventory for an order (decrease inventory)
   *
   * @param ctx - Request context
   * @param productId - Product ID
   * @param quantity - Quantity to reserve
   * @returns True if reservation successful
   */
  async reserveInventory(
    ctx: RequestContext,
    productId: ID,
    quantity: number
  ): Promise<boolean> {
    const product = await this.getProduct(ctx, productId, false);

    if (!product || !this.hasInventory(product, quantity)) {
      return false;
    }

    await this.updateInventory(
      ctx,
      productId,
      product.inventoryLevel - quantity
    );

    return true;
  }

  /**
   * Release reserved inventory (increase inventory)
   *
   * @param ctx - Request context
   * @param productId - Product ID
   * @param quantity - Quantity to release
   */
  async releaseInventory(
    ctx: RequestContext,
    productId: ID,
    quantity: number
  ): Promise<void> {
    const product = await this.getProduct(ctx, productId, false);

    if (!product) {
      return;
    }

    await this.updateInventory(
      ctx,
      productId,
      product.inventoryLevel + quantity
    );
  }

  /**
   * Transform a Vendure Product to ProductWithDisclosure
   *
   * @private
   */
  private transformProductWithDisclosure(
    product: Product,
    includeDisclosure: { scan?: boolean; study?: boolean }
  ): ProductWithDisclosure {
    const customFields = (product as any).customFields || {};

    // Parse progressive disclosure data
    const glance = parseGlanceData(customFields.glanceData);
    const scan = includeDisclosure.scan
      ? parseScanData(customFields.scanData)
      : undefined;
    const study = includeDisclosure.study
      ? parseStudyData(customFields.studyData)
      : undefined;

    // Parse pricing tiers
    const pricingTiers = parsePricingTiers(customFields.pricingTiers);

    return {
      product,
      glance,
      scan,
      study,
      pricingTiers,
      inventoryLevel: customFields.inventoryLevel || 0,
      vendorId: customFields.vendorId || '',
    };
  }

  /**
   * Get products by category
   *
   * @param ctx - Request context
   * @param categoryId - Category ID
   * @param options - Pagination options
   * @returns Products in the category
   */
  async getProductsByCategory(
    ctx: RequestContext,
    categoryId: ID,
    options?: ListQueryOptions<Product>
  ): Promise<ProductSearchResult> {
    return this.searchProducts(
      ctx,
      undefined,
      { categoryIds: [categoryId] },
      options,
      { scan: false, study: false }
    );
  }

  /**
   * Get products by skin type
   *
   * @param ctx - Request context
   * @param skinType - Skin type (e.g., "dry", "oily", "combination")
   * @param options - Pagination options
   * @returns Products suitable for the skin type
   */
  async getProductsBySkinType(
    ctx: RequestContext,
    skinType: string,
    options?: ListQueryOptions<Product>
  ): Promise<ProductSearchResult> {
    return this.searchProducts(
      ctx,
      undefined,
      { skinTypes: [skinType] },
      options,
      { scan: false, study: false }
    );
  }

  /**
   * Get low stock products for a vendor
   *
   * @param ctx - Request context
   * @param vendorId - Vendor ID
   * @param threshold - Low stock threshold (default: 10)
   * @returns Products with inventory below threshold
   */
  async getLowStockProducts(
    ctx: RequestContext,
    vendorId: ID,
    threshold: number = 10
  ): Promise<ProductWithDisclosure[]> {
    const products = await this.connection
      .getRepository(ctx, Product)
      .createQueryBuilder('product')
      .where('product.customFieldsVendorid = :vendorId', { vendorId })
      .andWhere('product.customFieldsInventorylevel < :threshold', { threshold })
      .andWhere('product.customFieldsInventorylevel > 0')
      .orderBy('product.customFieldsInventorylevel', 'ASC')
      .getMany();

    return products.map(product =>
      this.transformProductWithDisclosure(product, { scan: false, study: false })
    );
  }
}
