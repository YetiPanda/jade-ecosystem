/**
 * Product Resolvers
 *
 * Handles product queries with progressive disclosure and vector search
 */

import { GraphQLError } from 'graphql';
import { GraphQLContext } from '../graphql/apollo-server';
import { productService } from '../services/product.service';
import { logger } from '../lib/logger';

export const productResolvers = {
  // Field resolvers for Product type
  Product: {
    /**
     * Map JSONB glance_data to ProductGlance type
     * The data is already in the correct structure from the database
     */
    glance: (parent: any) => {
      return parent.glance;
    },

    /**
     * Map JSONB scan_data to ProductScan type
     */
    scan: (parent: any) => {
      return parent.scan;
    },

    /**
     * Map JSONB study_data to ProductStudy type (nullable)
     */
    study: (parent: any) => {
      return parent.study || null;
    },

    /**
     * Resolve vendor organization
     */
    vendorOrganization: async (parent: any) => {
      // For now, return minimal vendor org data
      // TODO: Implement full vendor organization resolver
      return {
        id: parent.vendorOrganizationId,
        companyName: 'Vendor Organization',
        displayName: 'Vendor',
      };
    },
  },

  Query: {
    /**
     * Get product by ID
     */
    product: async (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      try {
        const product = await productService.findById(id);

        if (!product) {
          throw new GraphQLError('Product not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        return product;
      } catch (error) {
        context.logger.error('Error fetching product', { id, error });
        throw error;
      }
    },

    /**
     * List all products with pagination
     */
    products: async (
      _parent: unknown,
      { limit = 20, offset = 0 }: { limit?: number; offset?: number },
      context: GraphQLContext
    ) => {
      try {
        const products = await productService.findAll(limit, offset);
        return products;
      } catch (error) {
        context.logger.error('Error fetching products', { error });
        throw error;
      }
    },

    /**
     * Search products by vendor
     */
    productsByVendor: async (
      _parent: unknown,
      { vendorId, limit = 20 }: { vendorId: string; limit?: number },
      context: GraphQLContext
    ) => {
      try {
        const products = await productService.findByVendor(vendorId, limit);
        return products;
      } catch (error) {
        context.logger.error('Error fetching products by vendor', { vendorId, error });
        throw error;
      }
    },

    /**
     * Vector search for similar products
     */
    searchProducts: async (
      _parent: unknown,
      {
        tensor,
        embedding,
        tensorWeight = 0.5,
        limit = 10,
      }: {
        tensor?: number[];
        embedding?: number[];
        tensorWeight?: number;
        limit?: number;
      },
      context: GraphQLContext
    ) => {
      try {
        if (!tensor && !embedding) {
          throw new GraphQLError('Either tensor or embedding must be provided', {
            extensions: { code: 'BAD_REQUEST' },
          });
        }

        const products = await productService.vectorSearch({
          tensor,
          embedding,
          tensorWeight,
          limit,
        });

        logger.info('Vector search completed', {
          resultCount: products.length,
          hasTensor: !!tensor,
          hasEmbedding: !!embedding,
        });

        return products;
      } catch (error) {
        context.logger.error('Error in product vector search', { error });
        throw error;
      }
    },
  },

  Mutation: {
    /**
     * Create a mock product for testing
     */
    createMockProduct: async (
      _parent: unknown,
      { vendorOrganizationId }: { vendorOrganizationId: string },
      context: GraphQLContext
    ) => {
      try {
        // Check authentication
        if (!context.user) {
          throw new GraphQLError('Not authenticated', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        const product = await productService.createMockProduct(vendorOrganizationId);

        logger.info('Created mock product', {
          productId: product.id,
          userId: context.user.userId,
        });

        return {
          success: true,
          product,
          errors: null,
        };
      } catch (error) {
        context.logger.error('Error creating mock product', { error });
        return {
          success: false,
          product: null,
          errors: [
            {
              code: 'CREATION_FAILED',
              message: 'Failed to create product',
            },
          ],
        };
      }
    },
  },
};
