/**
 * Skincare Semantic Search Service
 *
 * Provides natural language search capabilities for skincare products using Zilliz.
 * Enables queries like:
 * - "Find gentle gel cleansers for oily skin under $20"
 * - "Best vitamin C serums for hyperpigmentation"
 * - "Fragrance-free moisturizers for sensitive skin"
 */

import { config } from 'dotenv';
import OpenAI from 'openai';
import {
  getSkincareZillizClient,
  isSkincareZillizConfigured,
  SKINCARE_COLLECTION,
  generateSearchText,
} from '../config/zilliz-skincare';
import { MilvusClient } from '@zilliz/milvus2-sdk-node';

config();

// Check if OpenAI is configured
const isOpenAIConfigured = Boolean(process.env.OPENAI_API_KEY);

// Lazy-initialized OpenAI client
let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!isOpenAIConfigured) {
    throw new Error('OpenAI is not configured. Set OPENAI_API_KEY environment variable.');
  }
  if (!_openai) {
    _openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return _openai;
}

/**
 * Search filters for skincare products
 */
export interface SkincareSearchFilters {
  skinTypes?: string[];
  concerns?: string[];
  category?: string;
  subcategory?: string;
  priceTier?: string;
  fragranceFree?: boolean;
  vegan?: boolean;
  crueltyFree?: boolean;
  routineStep?: string;
  texture?: string;
}

/**
 * Skincare product result
 */
export interface SkincareProductResult {
  id: string;
  productName: string;
  brand: string;
  category: string;
  subcategory: string;
  skinTypes: string[];
  concerns: string[];
  ingredients: string[];
  benefits: string[];
  keyBenefits: string[];
  priceTier: string;
  texture: string;
  routineStep: string;
  volume: string;
  fragranceFree: boolean;
  vegan: boolean;
  crueltyFree: boolean;
  score: number;
}

/**
 * Skin profile for recommendations
 */
export interface SkinProfile {
  skinType: string;
  concerns: string[];
  sensitivities?: string[];
  preferFragranceFree?: boolean;
  preferVegan?: boolean;
  budgetTier?: string;
}

/**
 * Generate embedding for search query using OpenAI
 */
async function generateQueryEmbedding(query: string): Promise<number[]> {
  try {
    const response = await getOpenAI().embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
      dimensions: 768,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Failed to generate query embedding:', error);
    // Fall back to mock embedding if OpenAI fails
    return generateMockEmbedding();
  }
}

/**
 * Generate mock embedding (for testing without OpenAI)
 */
function generateMockEmbedding(): number[] {
  const embedding = Array.from({ length: 768 }, () => Math.random() - 0.5);
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map((val) => val / magnitude);
}

/**
 * Build filter expression for Zilliz query
 */
function buildFilterExpression(filters: SkincareSearchFilters): string {
  const conditions: string[] = [];

  if (filters.category) {
    conditions.push(`category == "${filters.category}"`);
  }

  if (filters.subcategory) {
    conditions.push(`subcategory == "${filters.subcategory}"`);
  }

  if (filters.priceTier) {
    conditions.push(`price_tier == "${filters.priceTier}"`);
  }

  if (filters.fragranceFree !== undefined) {
    conditions.push(`fragrance_free == ${filters.fragranceFree}`);
  }

  if (filters.vegan !== undefined) {
    conditions.push(`vegan == ${filters.vegan}`);
  }

  if (filters.crueltyFree !== undefined) {
    conditions.push(`cruelty_free == ${filters.crueltyFree}`);
  }

  if (filters.routineStep) {
    conditions.push(`routine_step == "${filters.routineStep}"`);
  }

  if (filters.texture) {
    conditions.push(`texture == "${filters.texture}"`);
  }

  // For skin types and concerns, we need to use JSON contains
  // Note: Zilliz stores these as JSON strings, so we use LIKE for matching
  if (filters.skinTypes && filters.skinTypes.length > 0) {
    const skinTypeConditions = filters.skinTypes.map((st) => `skin_types like "%${st}%"`);
    conditions.push(`(${skinTypeConditions.join(' or ')})`);
  }

  if (filters.concerns && filters.concerns.length > 0) {
    const concernConditions = filters.concerns.map((c) => `concerns like "%${c}%"`);
    conditions.push(`(${concernConditions.join(' or ')})`);
  }

  return conditions.length > 0 ? conditions.join(' and ') : '';
}

/**
 * Parse Zilliz result into SkincareProductResult
 */
function parseResult(record: any, score: number): SkincareProductResult {
  return {
    id: record.id,
    productName: record.product_name,
    brand: record.brand,
    category: record.category,
    subcategory: record.subcategory,
    skinTypes: safeJsonParse(record.skin_types, []),
    concerns: safeJsonParse(record.concerns, []),
    ingredients: safeJsonParse(record.ingredients, []),
    benefits: safeJsonParse(record.benefits, []),
    keyBenefits: safeJsonParse(record.key_benefits, []),
    priceTier: record.price_tier,
    texture: record.texture,
    routineStep: record.routine_step,
    volume: record.volume,
    fragranceFree: record.fragrance_free,
    vegan: record.vegan,
    crueltyFree: record.cruelty_free,
    score,
  };
}

/**
 * Safely parse JSON string
 */
function safeJsonParse<T>(value: string | null | undefined, defaultValue: T): T {
  if (!value) return defaultValue;
  try {
    return JSON.parse(value);
  } catch {
    return defaultValue;
  }
}

/**
 * Skincare Search Service
 */
export class SkincareSearchService {
  private _client: MilvusClient | null = null;

  /**
   * Get the Zilliz client (lazy initialization)
   */
  private getClient(): MilvusClient {
    if (!isSkincareZillizConfigured) {
      throw new Error('Skincare search is not available. Zilliz Cloud is not configured.');
    }
    if (!this._client) {
      this._client = getSkincareZillizClient();
    }
    return this._client;
  }

  /**
   * Semantic search for skincare products
   *
   * @param query - Natural language search query
   * @param filters - Optional filters to narrow results
   * @param limit - Maximum number of results (default: 10)
   * @returns Array of matching products sorted by relevance
   */
  async search(
    query: string,
    filters?: SkincareSearchFilters,
    limit: number = 10
  ): Promise<SkincareProductResult[]> {
    try {
      // Generate embedding for the query
      const queryEmbedding = await generateQueryEmbedding(query);

      // Build filter expression
      const filterExpr = filters ? buildFilterExpression(filters) : '';

      // Search in Zilliz
      const results = await this.getClient().search({
        collection_name: SKINCARE_COLLECTION,
        data: [queryEmbedding],
        anns_field: 'semantic_embedding',
        metric_type: 'COSINE',
        limit,
        output_fields: [
          'id',
          'product_name',
          'brand',
          'category',
          'subcategory',
          'skin_types',
          'concerns',
          'ingredients',
          'benefits',
          'key_benefits',
          'price_tier',
          'texture',
          'routine_step',
          'volume',
          'fragrance_free',
          'vegan',
          'cruelty_free',
        ],
        filter: filterExpr || undefined,
      });

      // Parse results
      if (!results.results || results.results.length === 0) {
        return [];
      }

      return results.results.map((result: any) => parseResult(result, result.score || 0));
    } catch (error) {
      console.error('Skincare search failed:', error);
      throw new Error(`Search failed: ${(error as Error).message}`);
    }
  }

  /**
   * Find products similar to a given product
   *
   * @param productId - ID of the product to find similar items for
   * @param limit - Maximum number of results (default: 5)
   * @returns Array of similar products
   */
  async findSimilar(productId: string, limit: number = 5): Promise<SkincareProductResult[]> {
    try {
      // First, get the source product's embedding
      const sourceProduct = await this.getClient().query({
        collection_name: SKINCARE_COLLECTION,
        filter: `id == "${productId}"`,
        output_fields: ['semantic_embedding'],
      });

      if (!sourceProduct.data || sourceProduct.data.length === 0) {
        throw new Error(`Product not found: ${productId}`);
      }

      const embedding = sourceProduct.data[0].semantic_embedding;

      // Search for similar products (excluding the source)
      const results = await this.getClient().search({
        collection_name: SKINCARE_COLLECTION,
        data: [embedding],
        anns_field: 'semantic_embedding',
        metric_type: 'COSINE',
        limit: limit + 1, // +1 to account for the source product
        output_fields: [
          'id',
          'product_name',
          'brand',
          'category',
          'subcategory',
          'skin_types',
          'concerns',
          'ingredients',
          'benefits',
          'key_benefits',
          'price_tier',
          'texture',
          'routine_step',
          'volume',
          'fragrance_free',
          'vegan',
          'cruelty_free',
        ],
        filter: `id != "${productId}"`,
      });

      if (!results.results || results.results.length === 0) {
        return [];
      }

      return results.results.slice(0, limit).map((result: any) => parseResult(result, result.score || 0));
    } catch (error) {
      console.error('Find similar failed:', error);
      throw new Error(`Find similar failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get product recommendations based on skin profile
   *
   * @param profile - User's skin profile
   * @param limit - Maximum number of recommendations (default: 10)
   * @returns Personalized product recommendations
   */
  async recommend(profile: SkinProfile, limit: number = 10): Promise<SkincareProductResult[]> {
    try {
      // Build a natural language query from the profile
      const queryParts = [
        `products for ${profile.skinType} skin`,
        profile.concerns.length > 0 ? `targeting ${profile.concerns.join(', ')}` : '',
        profile.preferFragranceFree ? 'fragrance-free' : '',
        profile.preferVegan ? 'vegan' : '',
        profile.budgetTier ? `${profile.budgetTier} price range` : '',
      ].filter(Boolean);

      const query = queryParts.join(' ');

      // Build filters from profile
      const filters: SkincareSearchFilters = {
        skinTypes: [profile.skinType],
      };

      if (profile.preferFragranceFree) {
        filters.fragranceFree = true;
      }

      if (profile.preferVegan) {
        filters.vegan = true;
      }

      if (profile.budgetTier) {
        filters.priceTier = profile.budgetTier;
      }

      // Search with profile-based query and filters
      return this.search(query, filters, limit);
    } catch (error) {
      console.error('Recommendation failed:', error);
      throw new Error(`Recommendation failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get products by category
   *
   * @param category - Product category
   * @param limit - Maximum number of results (default: 20)
   * @returns Products in the specified category
   */
  async getByCategory(category: string, limit: number = 20): Promise<SkincareProductResult[]> {
    try {
      const results = await this.getClient().query({
        collection_name: SKINCARE_COLLECTION,
        filter: `category == "${category}"`,
        limit,
        output_fields: [
          'id',
          'product_name',
          'brand',
          'category',
          'subcategory',
          'skin_types',
          'concerns',
          'ingredients',
          'benefits',
          'key_benefits',
          'price_tier',
          'texture',
          'routine_step',
          'volume',
          'fragrance_free',
          'vegan',
          'cruelty_free',
        ],
      });

      if (!results.data || results.data.length === 0) {
        return [];
      }

      return results.data.map((record: any) => parseResult(record, 1.0));
    } catch (error) {
      console.error('Get by category failed:', error);
      throw new Error(`Get by category failed: ${(error as Error).message}`);
    }
  }

  /**
   * Get product by ID
   *
   * @param productId - Product ID
   * @returns Product details or null if not found
   */
  async getById(productId: string): Promise<SkincareProductResult | null> {
    try {
      const results = await this.getClient().query({
        collection_name: SKINCARE_COLLECTION,
        filter: `id == "${productId}"`,
        limit: 1,
        output_fields: [
          'id',
          'product_name',
          'brand',
          'category',
          'subcategory',
          'skin_types',
          'concerns',
          'ingredients',
          'benefits',
          'key_benefits',
          'price_tier',
          'texture',
          'routine_step',
          'volume',
          'fragrance_free',
          'vegan',
          'cruelty_free',
        ],
      });

      if (!results.data || results.data.length === 0) {
        return null;
      }

      return parseResult(results.data[0], 1.0);
    } catch (error) {
      console.error('Get by ID failed:', error);
      throw new Error(`Get by ID failed: ${(error as Error).message}`);
    }
  }

  /**
   * Build a skincare routine recommendation
   *
   * @param profile - User's skin profile
   * @returns Recommended routine with products for each step
   */
  async buildRoutine(
    profile: SkinProfile
  ): Promise<{ step: string; products: SkincareProductResult[] }[]> {
    const routineSteps = ['Cleanse', 'Treat', 'Moisturize', 'Protect'];
    const routine: { step: string; products: SkincareProductResult[] }[] = [];

    for (const step of routineSteps) {
      const filters: SkincareSearchFilters = {
        skinTypes: [profile.skinType],
        routineStep: step,
      };

      if (profile.preferFragranceFree) {
        filters.fragranceFree = true;
      }

      if (profile.preferVegan) {
        filters.vegan = true;
      }

      if (profile.budgetTier) {
        filters.priceTier = profile.budgetTier;
      }

      const query = `${step.toLowerCase()} products for ${profile.skinType} skin`;
      const products = await this.search(query, filters, 3);

      routine.push({ step, products });
    }

    return routine;
  }
}

// Export singleton instance
export const skincareSearchService = new SkincareSearchService();
