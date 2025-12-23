/**
 * Embedding Service
 *
 * Generates hybrid embeddings for products:
 * - 13D tensor embeddings (product compatibility)
 * - 768D semantic embeddings (text descriptions)
 *
 * Week 5 Day 2: OpenAI embeddings integration for semantic search
 */

import { OpenAI } from 'openai';
import { zillizClient, PRODUCT_COLLECTION } from '../config/zilliz';
import { calculateProductTensor } from './tensor-calculator';
import type { ProductTaxonomy } from '../types/product';
import type { InsertReq } from '@zilliz/milvus2-sdk-node';

export interface ProductEmbeddingData {
  id: string;
  vendure_product_id: string;
  brand_name: string;
  product_name: string;
  category_path: string;
  primary_functions: string;
  skin_concerns: string;
  professional_level: string;
  usage_time: string;
  price_wholesale: number;
  taxonomy_completeness_score: number;
  created_at: number;
  updated_at: number;
  tensor_embedding: number[];
  semantic_embedding: number[];
  [key: string]: any; // Index signature for Zilliz RowData compatibility
}

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

// Embedding configuration
const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536D by default, can reduce to 768D
const EMBEDDING_DIMENSIONS = 768; // Reduced dimensions for efficiency

/**
 * Generate semantic embedding from product text using OpenAI
 * Uses text-embedding-3-small model with 768 dimensions
 */
async function generateSemanticEmbedding(
  productName: string,
  description: string,
  ingredients: string[]
): Promise<number[]> {
  try {
    // Construct rich text representation of the product
    const text = formatProductText(productName, description, ingredients);

    // Call OpenAI Embeddings API
    const response = await getOpenAI().embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
      dimensions: EMBEDDING_DIMENSIONS,
    });

    // Extract embedding vector
    const embedding = response.data[0].embedding;

    if (embedding.length !== EMBEDDING_DIMENSIONS) {
      throw new Error(
        `Unexpected embedding dimension: ${embedding.length}, expected ${EMBEDDING_DIMENSIONS}`
      );
    }

    return embedding;
  } catch (error) {
    console.error('OpenAI embedding generation failed:', error);

    // Fallback: return zero vector for graceful degradation
    console.warn('Falling back to zero vector for product:', productName);
    return new Array(EMBEDDING_DIMENSIONS).fill(0);
  }
}

/**
 * Format product information into a rich text representation
 * Optimized for semantic search relevance
 */
function formatProductText(
  productName: string,
  description: string,
  ingredients: string[]
): string {
  const parts: string[] = [];

  // Product name (highest weight)
  if (productName) {
    parts.push(`Product: ${productName}`);
  }

  // Description (medium weight)
  if (description) {
    // Truncate to avoid token limits (~2000 chars ≈ 500 tokens)
    const truncatedDesc = description.length > 2000
      ? description.substring(0, 2000) + '...'
      : description;
    parts.push(`Description: ${truncatedDesc}`);
  }

  // Key ingredients (lower weight, but important for formulation matching)
  if (ingredients && ingredients.length > 0) {
    // Take top 20 ingredients to avoid token overflow
    const topIngredients = ingredients.slice(0, 20);
    parts.push(`Key Ingredients: ${topIngredients.join(', ')}`);
  }

  return parts.join('\n\n');
}

/**
 * Insert or update product embedding in Zilliz
 */
export async function upsertProductEmbedding(
  taxonomy: ProductTaxonomy,
  productData: {
    vendureProductId: string;
    brandName: string;
    productName: string;
    categoryPath: string;
    description: string;
    ingredients: string[];
    priceWholesale: number;
    createdAt: Date;
    updatedAt: Date;
  }
): Promise<void> {
  try {
    // Calculate 13D tensor embedding
    const tensorData = calculateProductTensor(taxonomy, productData.ingredients);

    // Generate 768D semantic embedding
    const semanticEmbedding = await generateSemanticEmbedding(
      productData.productName,
      productData.description,
      productData.ingredients
    );

    // Prepare embedding data
    const embeddingData: ProductEmbeddingData = {
      id: taxonomy.product_id,
      vendure_product_id: productData.vendureProductId,
      brand_name: productData.brandName,
      product_name: productData.productName,
      category_path: productData.categoryPath,
      primary_functions: JSON.stringify(taxonomy.primary_function_ids || []),
      skin_concerns: JSON.stringify(taxonomy.skin_concern_ids || []),
      professional_level: taxonomy.professional_level || 'OTC',
      usage_time: taxonomy.usage_time || 'ANYTIME',
      price_wholesale: productData.priceWholesale,
      taxonomy_completeness_score: taxonomy.taxonomy_completeness_score || 0,
      created_at: productData.createdAt.getTime(),
      updated_at: productData.updatedAt.getTime(),
      tensor_embedding: tensorData.tensor,
      semantic_embedding: semanticEmbedding,
    };

    // Insert into Zilliz
    const insertReq: InsertReq = {
      collection_name: PRODUCT_COLLECTION,
      data: [embeddingData],
    };

    await zillizClient.insert(insertReq);

    console.log(`✓ Embedded product: ${productData.productName} (${taxonomy.product_id})`);

  } catch (error) {
    console.error(`Failed to embed product ${taxonomy.product_id}:`, error);
    throw error;
  }
}

/**
 * Batch insert product embeddings
 */
export async function batchUpsertProductEmbeddings(
  products: Array<{
    taxonomy: ProductTaxonomy;
    productData: {
      vendureProductId: string;
      brandName: string;
      productName: string;
      categoryPath: string;
      description: string;
      ingredients: string[];
      priceWholesale: number;
      createdAt: Date;
      updatedAt: Date;
    };
  }>
): Promise<void> {
  try {
    const embeddingDataBatch: ProductEmbeddingData[] = [];

    for (const { taxonomy, productData } of products) {
      const tensorData = calculateProductTensor(taxonomy, productData.ingredients);
      const semanticEmbedding = await generateSemanticEmbedding(
        productData.productName,
        productData.description,
        productData.ingredients
      );

      embeddingDataBatch.push({
        id: taxonomy.product_id,
        vendure_product_id: productData.vendureProductId,
        brand_name: productData.brandName,
        product_name: productData.productName,
        category_path: productData.categoryPath,
        primary_functions: JSON.stringify(taxonomy.primary_function_ids || []),
        skin_concerns: JSON.stringify(taxonomy.skin_concern_ids || []),
        professional_level: taxonomy.professional_level || 'OTC',
        usage_time: taxonomy.usage_time || 'ANYTIME',
        price_wholesale: productData.priceWholesale,
        taxonomy_completeness_score: taxonomy.taxonomy_completeness_score || 0,
        created_at: productData.createdAt.getTime(),
        updated_at: productData.updatedAt.getTime(),
        tensor_embedding: tensorData.tensor,
        semantic_embedding: semanticEmbedding,
      });
    }

    const insertReq: InsertReq = {
      collection_name: PRODUCT_COLLECTION,
      data: embeddingDataBatch,
    };

    await zillizClient.insert(insertReq);

    console.log(`✓ Batch embedded ${embeddingDataBatch.length} products`);

  } catch (error) {
    console.error('Failed to batch embed products:', error);
    throw error;
  }
}

/**
 * Generate embedding for search query
 * Uses OpenAI embeddings to convert natural language queries to vectors
 */
export async function generateQueryEmbedding(queryText: string): Promise<number[]> {
  try {
    const response = await getOpenAI().embeddings.create({
      model: EMBEDDING_MODEL,
      input: queryText,
      dimensions: EMBEDDING_DIMENSIONS,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Query embedding generation failed:', error);
    // Fallback to zero vector
    return new Array(EMBEDDING_DIMENSIONS).fill(0);
  }
}

/**
 * Search products by semantic similarity
 */
export async function searchProductsBySemantic(
  queryText: string,
  limit: number = 10,
  filters?: {
    professionalLevel?: string[];
    priceRange?: { min: number; max: number };
    categoryPath?: string;
  }
): Promise<ProductEmbeddingData[]> {
  try {
    // Generate embedding for query text using dedicated query function
    const queryEmbedding = await generateQueryEmbedding(queryText);

    // Build filter expression
    let filterExpr = '';
    if (filters) {
      const conditions: string[] = [];

      if (filters.professionalLevel && filters.professionalLevel.length > 0) {
        const levels = filters.professionalLevel.map(l => `"${l}"`).join(', ');
        conditions.push(`professional_level in [${levels}]`);
      }

      if (filters.priceRange) {
        conditions.push(
          `price_wholesale >= ${filters.priceRange.min} && price_wholesale <= ${filters.priceRange.max}`
        );
      }

      if (filters.categoryPath) {
        conditions.push(`category_path like "%${filters.categoryPath}%"`);
      }

      filterExpr = conditions.join(' && ');
    }

    // Perform vector search
    const searchResult = await zillizClient.search({
      collection_name: PRODUCT_COLLECTION,
      vector: queryEmbedding,
      filter: filterExpr || undefined,
      limit,
      output_fields: [
        'id', 'vendure_product_id', 'brand_name', 'product_name',
        'category_path', 'professional_level', 'price_wholesale',
        'taxonomy_completeness_score'
      ],
      metric_type: 'COSINE',
    });

    return searchResult.results as unknown as ProductEmbeddingData[];

  } catch (error) {
    console.error('Semantic search failed:', error);
    throw error;
  }
}

/**
 * Find compatible products based on tensor similarity
 */
export async function findCompatibleProducts(
  productId: string,
  limit: number = 10
): Promise<ProductEmbeddingData[]> {
  try {
    // Fetch the source product's tensor
    const queryResult = await zillizClient.query({
      collection_name: PRODUCT_COLLECTION,
      filter: `id == "${productId}"`,
      output_fields: ['tensor_embedding'],
    });

    if (queryResult.data.length === 0) {
      throw new Error(`Product ${productId} not found in vector database`);
    }

    const sourceTensor = queryResult.data[0].tensor_embedding as number[];

    // Search for similar tensors
    const searchResult = await zillizClient.search({
      collection_name: PRODUCT_COLLECTION,
      vector: sourceTensor,
      limit: limit + 1, // +1 to exclude self
      output_fields: [
        'id', 'vendure_product_id', 'brand_name', 'product_name',
        'category_path', 'professional_level', 'price_wholesale'
      ],
      metric_type: 'L2',
    });

    // Filter out the source product
    const compatibleProducts = searchResult.results.filter(
      (result: any) => result.id !== productId
    );

    return compatibleProducts.slice(0, limit) as unknown as ProductEmbeddingData[];

  } catch (error) {
    console.error('Compatibility search failed:', error);
    throw error;
  }
}

/**
 * Delete product embedding from Zilliz
 */
export async function deleteProductEmbedding(productId: string): Promise<void> {
  try {
    await zillizClient.delete({
      collection_name: PRODUCT_COLLECTION,
      filter: `id == "${productId}"`,
    });

    console.log(`✓ Deleted product embedding: ${productId}`);

  } catch (error) {
    console.error(`Failed to delete product embedding ${productId}:`, error);
    throw error;
  }
}

/**
 * Get collection statistics
 */
export async function getCollectionStats(): Promise<{
  totalProducts: number;
  lastUpdated: Date;
}> {
  try {
    const stats = await zillizClient.getCollectionStatistics({
      collection_name: PRODUCT_COLLECTION,
    });

    return {
      totalProducts: parseInt(stats.data.row_count || '0', 10),
      lastUpdated: new Date(),
    };

  } catch (error) {
    console.error('Failed to get collection stats:', error);
    throw error;
  }
}
