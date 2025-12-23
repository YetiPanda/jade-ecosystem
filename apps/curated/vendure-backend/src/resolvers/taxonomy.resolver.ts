/**
 * GraphQL Resolvers for Product Taxonomy
 */

import { AppDataSource } from '../config/database';
import type {
  ProductCategory,
  ProductFunction,
  SkinConcern,
  ProductFormat,
  TargetArea,
  ProductRegion,
  ProductTaxonomy,
} from '../types/product';

export const taxonomyResolvers = {
  Query: {
    // ========================================
    // Category Queries
    // ========================================
    async productCategories(
      _parent: any,
      args: { parentId?: string; level?: number; isActive?: boolean }
    ): Promise<ProductCategory[]> {
      let query = 'SELECT * FROM jade.product_category WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (args.parentId) {
        query += ` AND parent_id = $${paramIndex++}`;
        params.push(args.parentId);
      }

      if (args.level !== undefined) {
        query += ` AND level = $${paramIndex++}`;
        params.push(args.level);
      }

      if (args.isActive !== undefined) {
        query += ` AND is_active = $${paramIndex++}`;
        params.push(args.isActive);
      }

      query += ' ORDER BY display_order ASC';

      const result = await AppDataSource.query(query, params);
      return result;
    },

    async productCategory(_parent: any, args: { id?: string; slug?: string }): Promise<ProductCategory | null> {
      if (args.id) {
        const result = await AppDataSource.query(
          'SELECT * FROM jade.product_category WHERE id = $1',
          [args.id]
        );
        return result[0] || null;
      } else if (args.slug) {
        const result = await AppDataSource.query(
          'SELECT * FROM jade.product_category WHERE seo_slug = $1',
          [args.slug]
        );
        return result[0] || null;
      }
      return null;
    },

    // ========================================
    // Function Queries
    // ========================================
    async productFunctions(
      _parent: any,
      args: { isActive?: boolean }
    ): Promise<ProductFunction[]> {
      let query = 'SELECT * FROM jade.product_function WHERE 1=1';
      const params: any[] = [];

      if (args.isActive !== undefined) {
        query += ' AND is_active = $1';
        params.push(args.isActive);
      }

      query += ' ORDER BY display_order ASC';

      const result = await AppDataSource.query(query, params);
      return result;
    },

    // ========================================
    // Skin Concern Queries
    // ========================================
    async skinConcerns(_parent: any, args: { isActive?: boolean }): Promise<SkinConcern[]> {
      let query = 'SELECT * FROM jade.skin_concern WHERE 1=1';
      const params: any[] = [];

      if (args.isActive !== undefined) {
        query += ' AND is_active = $1';
        params.push(args.isActive);
      }

      query += ' ORDER BY display_order ASC';

      const result = await AppDataSource.query(query, params);
      return result;
    },

    // ========================================
    // Format Queries
    // ========================================
    async productFormats(
      _parent: any,
      args: { isActive?: boolean; category?: string }
    ): Promise<ProductFormat[]> {
      let query = 'SELECT * FROM jade.product_format WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (args.isActive !== undefined) {
        query += ` AND is_active = $${paramIndex++}`;
        params.push(args.isActive);
      }

      if (args.category) {
        query += ` AND category = $${paramIndex++}`;
        params.push(args.category);
      }

      query += ' ORDER BY name ASC';

      const result = await AppDataSource.query(query, params);
      return result;
    },

    // ========================================
    // Target Area Queries
    // ========================================
    async targetAreas(_parent: any, args: { isActive?: boolean }): Promise<TargetArea[]> {
      let query = 'SELECT * FROM jade.target_area WHERE 1=1';
      const params: any[] = [];

      if (args.isActive !== undefined) {
        query += ' AND is_active = $1';
        params.push(args.isActive);
      }

      query += ' ORDER BY name ASC';

      const result = await AppDataSource.query(query, params);
      return result;
    },

    // ========================================
    // Region Queries
    // ========================================
    async productRegions(_parent: any, args: { isActive?: boolean }): Promise<ProductRegion[]> {
      let query = 'SELECT * FROM jade.product_region WHERE 1=1';
      const params: any[] = [];

      if (args.isActive !== undefined) {
        query += ' AND is_active = $1';
        params.push(args.isActive);
      }

      query += ' ORDER BY name ASC';

      const result = await AppDataSource.query(query, params);
      return result;
    },

    // ========================================
    // Taxonomy Queries
    // ========================================
    async productTaxonomy(_parent: any, args: { productId: string }): Promise<ProductTaxonomy | null> {
      const result = await AppDataSource.query(
        'SELECT * FROM jade.product_taxonomy WHERE product_id = $1',
        [args.productId]
      );
      return result[0] || null;
    },

    // ========================================
    // Statistics
    // ========================================
    async taxonomyStats() {
      const totalProductsResult = await AppDataSource.query(
        'SELECT COUNT(*) as count FROM jade.product_taxonomy'
      );

      const avgScoreResult = await AppDataSource.query(
        'SELECT AVG(taxonomy_completeness_score) as avg FROM jade.product_taxonomy WHERE taxonomy_completeness_score IS NOT NULL'
      );

      const categoryCounts = await AppDataSource.query(`
        SELECT category_id, COUNT(*) as count
        FROM jade.product_taxonomy
        WHERE category_id IS NOT NULL
        GROUP BY category_id
        ORDER BY count DESC
      `);

      return {
        totalProducts: parseInt(totalProductsResult[0].count, 10),
        averageCompletenessScore: parseFloat(avgScoreResult[0].avg || 0),
        categoryCounts: categoryCounts.map((row: any) => ({
          categoryId: row.category_id,
          count: parseInt(row.count, 10),
        })),
        functionCounts: [],
        concernCounts: [],
      };
    },

    // ========================================
    // Search Queries - Temporarily commented out due to schema conflicts
    // ========================================
    /* async taxonomySearchProducts(
      _parent: any,
      args: { query: string; limit?: number; filters?: any }
    ): Promise<any[]> {
      // Basic text search using PostgreSQL full-text search
      const limit = args.limit || 20;
      const query = args.query.toLowerCase();

      // Simple LIKE search for now
      // TODO: Implement proper full-text search with PostgreSQL ts_vector
      const results = await AppDataSource.query(
        `
        SELECT DISTINCT
          pt.product_id as "productId",
          pe.vendure_product_id as "vendureProductId",
          pe.brand_name as "brandName",
          'Search Result' as "productName",
          pc.name as "categoryPath",
          pt.professional_level as "professionalLevel",
          0 as "priceWholesale",
          pt.taxonomy_completeness_score as "taxonomyCompletenessScore",
          1.0 as "relevanceScore",
          'text_match' as "matchType"
        FROM jade.product_taxonomy pt
        LEFT JOIN jade.product_extension pe ON pt.product_id = pe.id
        LEFT JOIN jade.product_category pc ON pt.category_id = pc.id
        WHERE LOWER(pe.brand_name) LIKE $1
           OR LOWER(pc.name) LIKE $1
        LIMIT $2
        `,
        [`%${query}%`, limit]
      );

      return results;
    },

    async taxonomySearchSemantic(
      _parent: any,
      args: { query: string; limit?: number; filters?: any }
    ): Promise<any[]> {
      // Semantic search using Zilliz vector database
      const limit = args.limit || 20;

      try {
        const { searchProductsBySemantic } = await import('../services/embedding-service');

        const results = await searchProductsBySemantic(
          args.query,
          limit,
          args.filters
        );

        return results.map((result: any) => ({
          productId: result.id,
          vendureProductId: result.vendure_product_id,
          brandName: result.brand_name,
          productName: result.product_name,
          categoryPath: result.category_path,
          professionalLevel: result.professional_level,
          priceWholesale: result.price_wholesale,
          taxonomyCompletenessScore: result.taxonomy_completeness_score,
          relevanceScore: result.distance || 1.0,
          matchType: 'semantic_vector',
        }));
      } catch (error) {
        console.error('Semantic search failed:', error);
        // Fallback to basic text search
        return [];
      }
    },

    async taxonomyFindCompatible(
      _parent: any,
      args: { productId: string; limit?: number }
    ): Promise<any[]> {
      // Find compatible products using 13D tensor similarity
      const limit = args.limit || 10;

      try {
        const { findCompatibleProducts } = await import('../services/embedding-service');

        const results = await findCompatibleProducts(
          args.productId,
          limit
        );

        return results.map((result: any) => ({
          productId: result.id,
          vendureProductId: result.vendure_product_id,
          brandName: result.brand_name,
          productName: result.product_name,
          categoryPath: result.category_path,
          professionalLevel: result.professional_level,
          priceWholesale: result.price_wholesale,
          taxonomyCompletenessScore: result.taxonomy_completeness_score,
          relevanceScore: 1 - (result.distance || 0),
          matchType: 'tensor_compatibility',
        }));
      } catch (error) {
        console.error('Compatibility search failed:', error);
        return [];
      }
    }, */
  },

  Mutation: {
    // ========================================
    // Update Taxonomy
    // ========================================
    async updateProductTaxonomy(
      _parent: any,
      args: { productId: string; input: any }
    ): Promise<ProductTaxonomy> {
      const { productId, input } = args;

      // Build dynamic update query
      const updateFields: string[] = [];
      const params: any[] = [productId];
      let paramIndex = 2;

      if (input.categoryId !== undefined) {
        updateFields.push(`category_id = $${paramIndex++}`);
        params.push(input.categoryId);
      }

      if (input.primaryFunctionIds !== undefined) {
        updateFields.push(`primary_function_ids = $${paramIndex++}`);
        params.push(input.primaryFunctionIds);
      }

      if (input.skinConcernIds !== undefined) {
        updateFields.push(`skin_concern_ids = $${paramIndex++}`);
        params.push(input.skinConcernIds);
      }

      if (input.targetAreaIds !== undefined) {
        updateFields.push(`target_area_ids = $${paramIndex++}`);
        params.push(input.targetAreaIds);
      }

      if (input.productFormatId !== undefined) {
        updateFields.push(`product_format_id = $${paramIndex++}`);
        params.push(input.productFormatId);
      }

      if (input.regionId !== undefined) {
        updateFields.push(`region_id = $${paramIndex++}`);
        params.push(input.regionId);
      }

      if (input.usageTime !== undefined) {
        updateFields.push(`usage_time = $${paramIndex++}`);
        params.push(input.usageTime);
      }

      if (input.professionalLevel !== undefined) {
        updateFields.push(`professional_level = $${paramIndex++}`);
        params.push(input.professionalLevel);
      }

      if (input.protocolRequired !== undefined) {
        updateFields.push(`protocol_required = $${paramIndex++}`);
        params.push(input.protocolRequired);
      }

      if (input.formulationBase !== undefined) {
        updateFields.push(`formulation_base = $${paramIndex++}`);
        params.push(input.formulationBase);
      }

      const query = `
        UPDATE jade.product_taxonomy
        SET ${updateFields.join(', ')}
        WHERE product_id = $1
        RETURNING *
      `;

      const result = await AppDataSource.query(query, params);
      return result[0];
    },
  },

  // ========================================
  // Field Resolvers
  // ========================================
  ProductCategory: {
    async parent(category: ProductCategory): Promise<ProductCategory | null> {
      if (!category.parent_id) return null;
      const result = await AppDataSource.query(
        'SELECT * FROM jade.product_category WHERE id = $1',
        [category.parent_id]
      );
      return result[0] || null;
    },

    async children(category: ProductCategory): Promise<ProductCategory[]> {
      const result = await AppDataSource.query(
        'SELECT * FROM jade.product_category WHERE parent_id = $1 ORDER BY display_order',
        [category.id]
      );
      return result;
    },

    async productCount(category: ProductCategory): Promise<number> {
      const result = await AppDataSource.query(
        'SELECT COUNT(*) as count FROM jade.product_taxonomy WHERE category_id = $1',
        [category.id]
      );
      return parseInt(result[0].count, 10);
    },
  },

  ProductTaxonomy: {
    async category(taxonomy: ProductTaxonomy): Promise<ProductCategory | null> {
      if (!taxonomy.category_id) return null;
      const result = await AppDataSource.query(
        'SELECT * FROM jade.product_category WHERE id = $1',
        [taxonomy.category_id]
      );
      return result[0] || null;
    },

    async primaryFunctions(taxonomy: ProductTaxonomy): Promise<ProductFunction[]> {
      if (!taxonomy.primary_function_ids || taxonomy.primary_function_ids.length === 0) {
        return [];
      }
      const result = await AppDataSource.query(
        'SELECT * FROM jade.product_function WHERE id = ANY($1) ORDER BY display_order',
        [taxonomy.primary_function_ids]
      );
      return result;
    },

    async skinConcerns(taxonomy: ProductTaxonomy): Promise<SkinConcern[]> {
      if (!taxonomy.skin_concern_ids || taxonomy.skin_concern_ids.length === 0) {
        return [];
      }
      const result = await AppDataSource.query(
        'SELECT * FROM jade.skin_concern WHERE id = ANY($1) ORDER BY display_order',
        [taxonomy.skin_concern_ids]
      );
      return result;
    },

    async targetAreas(taxonomy: ProductTaxonomy): Promise<TargetArea[]> {
      if (!taxonomy.target_area_ids || taxonomy.target_area_ids.length === 0) {
        return [];
      }
      const result = await AppDataSource.query(
        'SELECT * FROM jade.target_area WHERE id = ANY($1) ORDER BY name',
        [taxonomy.target_area_ids]
      );
      return result;
    },

    async productFormat(taxonomy: ProductTaxonomy): Promise<ProductFormat | null> {
      if (!taxonomy.product_format_id) return null;
      const result = await AppDataSource.query(
        'SELECT * FROM jade.product_format WHERE id = $1',
        [taxonomy.product_format_id]
      );
      return result[0] || null;
    },

    async region(taxonomy: ProductTaxonomy): Promise<ProductRegion | null> {
      if (!taxonomy.region_id) return null;
      const result = await AppDataSource.query(
        'SELECT * FROM jade.product_region WHERE id = $1',
        [taxonomy.region_id]
      );
      return result[0] || null;
    },
  },
};
