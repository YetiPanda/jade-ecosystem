/**
 * Product Service
 *
 * Handles product-related database operations and vector search
 */

import { AppDataSource } from '../config/database';
import { logger } from '../lib/logger';
import { searchHybrid, searchByTensor, searchByEmbedding } from '@jade/vector-db';

export interface ProductGlanceData {
  name: string;
  brandName: string;
  tagline: string;
  heroImageUrl: string;
  price: {
    amount: number;
    currency: string;
  };
  rating?: {
    average: number;
    count: number;
  };
  primaryBenefits: string[];
  suitableFor: string[];
}

export interface ProductScanData {
  description: string;
  keyIngredients: Array<{
    name: string;
    concentration: number;
    benefits: string[];
  }>;
  usage: {
    howToUse: string;
    frequency: string;
    timeOfDay: string[];
  };
  sizeVariants: Array<{
    size: string;
    price: number;
  }>;
  imageGallery: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface ProductStudyData {
  fullIngredientList: string[];
  clinicalStudies?: Array<{
    title: string;
    summary: string;
    resultsUrl?: string;
  }>;
  certifications?: string[];
  manufacturingInfo?: {
    country: string;
    facilityType: string;
  };
  safetyInfo: {
    warnings?: string[];
    contraindications?: string[];
    allergens?: string[];
  };
  professionalNotes?: string;
}

export interface Product {
  id: string;
  vendureProductId: string;
  vendorOrganizationId: string;
  glance: ProductGlanceData;
  scan: ProductScanData;
  study?: ProductStudyData;
  tensorGenerated: boolean;
  embeddingGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface VectorSearchParams {
  tensor?: number[];
  embedding?: number[];
  tensorWeight?: number;
  limit?: number;
}

export class ProductService {
  /**
   * Find product by ID
   */
  async findById(id: string): Promise<Product | null> {
    try {
      const result = await AppDataSource.query(
        `SELECT
          id,
          vendure_product_id as "vendureProductId",
          vendor_organization_id as "vendorOrganizationId",
          glance_data as glance,
          scan_data as scan,
          study_data as study,
          tensor_generated_at IS NOT NULL as "tensorGenerated",
          embedding_generated_at IS NOT NULL as "embeddingGenerated",
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM jade.product_extension
        WHERE id = $1`,
        [id]
      );

      return result[0] || null;
    } catch (error) {
      logger.error('Error finding product by ID', { id, error });
      throw error;
    }
  }

  /**
   * Find all products with pagination
   */
  async findAll(limit = 20, offset = 0): Promise<Product[]> {
    try {
      const result = await AppDataSource.query(
        `SELECT
          id,
          vendure_product_id as "vendureProductId",
          vendor_organization_id as "vendorOrganizationId",
          glance_data as glance,
          scan_data as scan,
          study_data as study,
          tensor_generated_at IS NOT NULL as "tensorGenerated",
          embedding_generated_at IS NOT NULL as "embeddingGenerated",
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM jade.product_extension
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2`,
        [limit, offset]
      );

      return result;
    } catch (error) {
      logger.error('Error finding all products', { error });
      throw error;
    }
  }

  /**
   * Search products by vendor organization
   */
  async findByVendor(vendorOrganizationId: string, limit = 20): Promise<Product[]> {
    try {
      const result = await AppDataSource.query(
        `SELECT
          id,
          vendure_product_id as "vendureProductId",
          vendor_organization_id as "vendorOrganizationId",
          glance_data as glance,
          scan_data as scan,
          study_data as study,
          tensor_generated_at IS NOT NULL as "tensorGenerated",
          embedding_generated_at IS NOT NULL as "embeddingGenerated",
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM jade.product_extension
        WHERE vendor_organization_id = $1
        ORDER BY created_at DESC
        LIMIT $2`,
        [vendorOrganizationId, limit]
      );

      return result;
    } catch (error) {
      logger.error('Error finding products by vendor', { vendorOrganizationId, error });
      throw error;
    }
  }

  /**
   * Vector search for similar products
   */
  async vectorSearch(params: VectorSearchParams): Promise<Product[]> {
    try {
      const { tensor, embedding, tensorWeight = 0.5, limit = 10 } = params;

      let productIds: string[];

      if (tensor && embedding) {
        // Hybrid search
        logger.info('Performing hybrid vector search', { tensorWeight, limit });
        const results = await searchHybrid(tensor, embedding, {
          tensorWeight,
          topK: limit,
        });
        productIds = results.map((r) => r.productId);
      } else if (tensor) {
        // Tensor-only search
        logger.info('Performing tensor-based vector search', { limit });
        const results = await searchByTensor(tensor, { topK: limit });
        productIds = results.map((r) => r.productId);
      } else if (embedding) {
        // Embedding-only search
        logger.info('Performing embedding-based vector search', { limit });
        const results = await searchByEmbedding(embedding, { topK: limit });
        productIds = results.map((r) => r.productId);
      } else {
        throw new Error('Either tensor or embedding vector must be provided');
      }

      if (productIds.length === 0) {
        return [];
      }

      // Fetch products from database in the order returned by vector search
      const result = await AppDataSource.query(
        `SELECT
          id,
          vendure_product_id as "vendureProductId",
          vendor_organization_id as "vendorOrganizationId",
          glance_data as glance,
          scan_data as scan,
          study_data as study,
          tensor_generated_at IS NOT NULL as "tensorGenerated",
          embedding_generated_at IS NOT NULL as "embeddingGenerated",
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM jade.product_extension
        WHERE id = ANY($1::uuid[])
        ORDER BY array_position($1::uuid[], id::uuid)`,
        [productIds]
      );

      return result;
    } catch (error) {
      logger.error('Error in vector search', { params, error });
      throw error;
    }
  }

  /**
   * Create mock product for testing
   * TODO: Replace with actual Vendure product creation
   */
  async createMockProduct(vendorOrganizationId: string): Promise<Product> {
    try {
      // Ensure vendor organization exists (for testing)
      await AppDataSource.query(
        `INSERT INTO jade.vendor_organization (
          id, company_name, display_name, contact_email, contact_phone,
          address, business_license, insurance, approval_status, is_active
         )
         VALUES (
          $1, $2, $2, $3, $4,
          $5::jsonb, $6::jsonb, $7::jsonb, 'APPROVED', true
         )
         ON CONFLICT (id) DO NOTHING`,
        [
          vendorOrganizationId,
          'Test Vendor Organization',
          'test@vendor.com',
          '+1234567890',
          JSON.stringify({ street: '123 Test St', city: 'Test City', state: 'TS', zip: '12345' }),
          JSON.stringify({ number: 'TEST-123', expiresAt: '2025-12-31' }),
          JSON.stringify({ provider: 'Test Insurance', policyNumber: 'TEST-INS-123' })
        ]
      );

      // Mock data matching GraphQL schema exactly
      const mockGlance = {
        heroBenefit: 'Deep hydration for radiant, youthful skin',
        skinTypes: ['DRY', 'NORMAL', 'SENSITIVE'],
        rating: 4.7,
        reviewCount: 1243,
        price: {
          amount: 89.99,
          currency: 'USD',
        },
        thumbnail: 'https://example.com/products/hydrating-serum-thumb.jpg',
      };

      const mockScan = {
        ingredients: {
          inci: [
            {
              name: 'Water',
              concentration: 70.0,
              function: 'Solvent',
              warnings: [],
            },
            {
              name: 'Hyaluronic Acid',
              concentration: 2.0,
              function: 'Humectant',
              warnings: [],
            },
            {
              name: 'Vitamin C (Ascorbic Acid)',
              concentration: 15.0,
              function: 'Antioxidant',
              warnings: ['May cause sensitivity in high concentrations'],
            },
            {
              name: 'Glycerin',
              concentration: 5.0,
              function: 'Moisturizer',
              warnings: [],
            },
          ],
          actives: [
            {
              name: 'Hyaluronic Acid',
              concentration: 2.0,
              type: 'Humectant',
            },
            {
              name: 'Vitamin C',
              concentration: 15.0,
              type: 'Antioxidant',
            },
          ],
          allergens: [],
          vegan: true,
          crueltyFree: true,
        },
        usageInstructions: {
          application: 'Apply 2-3 drops to clean, damp skin. Gently massage until absorbed.',
          frequency: 'Twice daily',
          timeOfDay: 'BOTH',
          patchTestRequired: true,
        },
        keyActives: [
          {
            name: 'Hyaluronic Acid',
            concentration: 2.0,
            type: 'Hydrating Agent',
          },
          {
            name: 'Vitamin C',
            concentration: 15.0,
            type: 'Brightening Agent',
          },
        ],
        warnings: [
          'For external use only',
          'Avoid contact with eyes',
          'Discontinue use if irritation occurs',
        ],
        images: [
          'https://example.com/products/hydrating-serum-1.jpg',
          'https://example.com/products/hydrating-serum-2.jpg',
          'https://example.com/products/hydrating-serum-3.jpg',
        ],
      };

      const mockStudy = {
        clinicalData: {
          trials: [
            {
              studyName: 'Efficacy of Hyaluronic Acid in Skin Hydration',
              participants: 50,
              duration: '12 weeks',
              results: '87% improvement in skin hydration levels',
              publicationUrl: 'https://example.com/studies/ha-study.pdf',
            },
          ],
          certifications: ['Cruelty-Free', 'Vegan', 'Dermatologist Tested'],
          testReports: [
            {
              testType: 'Dermatological Safety Test',
              reportUrl: 'https://example.com/reports/safety-test.pdf',
              testedAt: new Date().toISOString(),
            },
          ],
        },
        formulationScience:
          'This serum uses a patented delivery system for maximum penetration of hyaluronic acid molecules.',
        contraindications: [
          'Do not use if allergic to any ingredients',
          'Avoid during active skin infections',
        ],
        professionalNotes:
          'Recommended for professional spa treatments. Can be combined with microneedling for enhanced results.',
        detailedSteps: [
          'Cleanse face thoroughly',
          'Apply 2-3 drops to fingertips',
          'Gently press into skin',
          'Allow 30 seconds to absorb',
          'Follow with moisturizer',
        ],
        expectedResults: 'Visible improvement in skin hydration and plumpness within 2 weeks',
        timeToResults: '2-4 weeks for optimal results',
      };

      const result = await AppDataSource.query(
        `INSERT INTO jade.product_extension
          (vendure_product_id, vendor_organization_id, glance_data, scan_data, study_data)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
          id,
          vendure_product_id as "vendureProductId",
          vendor_organization_id as "vendorOrganizationId",
          glance_data as glance,
          scan_data as scan,
          study_data as study,
          tensor_generated_at IS NOT NULL as "tensorGenerated",
          embedding_generated_at IS NOT NULL as "embeddingGenerated",
          created_at as "createdAt",
          updated_at as "updatedAt"`,
        [
          '00000000-0000-0000-0000-000000000001', // Mock Vendure product ID
          vendorOrganizationId,
          JSON.stringify(mockGlance),
          JSON.stringify(mockScan),
          JSON.stringify(mockStudy),
        ]
      );

      logger.info('Created mock product', { productId: result[0].id });
      return result[0];
    } catch (error) {
      logger.error('Error creating mock product', { error });
      throw error;
    }
  }
}

export const productService = new ProductService();
