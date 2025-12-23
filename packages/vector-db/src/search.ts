/**
 * Vector Search Abstraction Layer
 *
 * Provides unified interface for both tensor and embedding searches
 * Supports hybrid search combining both vector types
 */

import {
  searchSimilarProducts,
  PRODUCT_TENSORS_COLLECTION,
} from './collections/product-tensors';
import {
  searchProductsByText,
  PRODUCT_EMBEDDINGS_COLLECTION,
} from './collections/product-embeddings';
import { loadCollection } from './client';
import { VectorSearchQuery } from './types';

/**
 * Search mode for product queries
 */
export enum SearchMode {
  /** Tensor-based similarity search (13-D SKA vectors) */
  TENSOR = 'tensor',
  /** Text embedding search (792-D NLP vectors) */
  EMBEDDING = 'embedding',
  /** Hybrid search combining both methods */
  HYBRID = 'hybrid',
}

/**
 * Search configuration
 */
export interface SearchConfig {
  mode: SearchMode;
  topK?: number;
  filter?: string;
  /** Weight for tensor results in hybrid mode (0-1, default 0.5) */
  tensorWeight?: number;
}

/**
 * Unified product search result
 */
export interface ProductSearchResult {
  productId: string;
  score: number;
  rank: number;
  metadata?: Record<string, any>;
}

/**
 * Initialize vector search collections
 * Loads both collections into memory for searching
 */
export async function initializeVectorSearch(): Promise<void> {
  await Promise.all([
    loadCollection(PRODUCT_TENSORS_COLLECTION),
    loadCollection(PRODUCT_EMBEDDINGS_COLLECTION),
  ]);
  console.log('✅ Vector search collections loaded');
}

/**
 * Search products using tensor vectors
 */
export async function searchByTensor(
  tensorVector: number[],
  config: Partial<SearchConfig> = {}
): Promise<ProductSearchResult[]> {
  if (tensorVector.length !== 13) {
    throw new Error(
      `Invalid tensor dimension. Expected 13, got ${tensorVector.length}`
    );
  }

  const query: VectorSearchQuery = {
    vector: tensorVector,
    topK: config.topK || 10,
    filter: config.filter,
    outputFields: ['product_id', 'sku', 'brand', 'category'],
  };

  const results = await searchSimilarProducts(query);

  return results.map((result, index) => ({
    productId: result.fields.product_id,
    score: result.score,
    rank: index + 1,
    metadata: {
      sku: result.fields.sku,
      brand: result.fields.brand,
      category: result.fields.category,
    },
  }));
}

/**
 * Search products using text embeddings
 */
export async function searchByEmbedding(
  embeddingVector: number[],
  config: Partial<SearchConfig> = {}
): Promise<ProductSearchResult[]> {
  if (embeddingVector.length !== 792) {
    throw new Error(
      `Invalid embedding dimension. Expected 792, got ${embeddingVector.length}`
    );
  }

  const query: VectorSearchQuery = {
    vector: embeddingVector,
    topK: config.topK || 10,
    filter: config.filter,
    outputFields: ['product_id', 'text_source', 'language'],
  };

  const results = await searchProductsByText(query);

  // Deduplicate by product_id (keep highest score)
  const deduped = new Map<string, ProductSearchResult>();

  results.forEach((result, index) => {
    const productId = result.id;
    if (!deduped.has(productId) || result.score > deduped.get(productId)!.score) {
      deduped.set(productId, {
        productId,
        score: result.score,
        rank: index + 1,
        metadata: {
          textSource: result.fields.text_source,
          language: result.fields.language,
        },
      });
    }
  });

  return Array.from(deduped.values()).sort((a, b) => b.score - a.score);
}

/**
 * Hybrid search combining tensor and embedding vectors
 * Uses weighted score fusion
 */
export async function searchHybrid(
  tensorVector: number[],
  embeddingVector: number[],
  config: Partial<SearchConfig> = {}
): Promise<ProductSearchResult[]> {
  const tensorWeight = config.tensorWeight ?? 0.5;
  const embeddingWeight = 1 - tensorWeight;
  const topK = config.topK || 10;

  // Execute both searches in parallel
  const [tensorResults, embeddingResults] = await Promise.all([
    searchByTensor(tensorVector, { ...config, topK: topK * 2 }),
    searchByEmbedding(embeddingVector, { ...config, topK: topK * 2 }),
  ]);

  // Normalize scores to 0-1 range
  const normalizeTensor = normalizeScores(tensorResults);
  const normalizeEmbedding = normalizeScores(embeddingResults);

  // Combine results with weighted scores
  const combined = new Map<string, ProductSearchResult>();

  normalizeTensor.forEach((result) => {
    combined.set(result.productId, {
      ...result,
      score: result.score * tensorWeight,
      metadata: {
        ...result.metadata,
        tensorScore: result.score,
      },
    });
  });

  normalizeEmbedding.forEach((result) => {
    const existing = combined.get(result.productId);
    if (existing) {
      // Product found in both searches - combine scores
      existing.score += result.score * embeddingWeight;
      existing.metadata = {
        ...existing.metadata,
        embeddingScore: result.score,
        hybridScore: existing.score,
      };
    } else {
      // Product only in embedding search
      combined.set(result.productId, {
        ...result,
        score: result.score * embeddingWeight,
        metadata: {
          ...result.metadata,
          embeddingScore: result.score,
        },
      });
    }
  });

  // Sort by combined score and return top K
  return Array.from(combined.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((result, index) => ({
      ...result,
      rank: index + 1,
    }));
}

/**
 * Unified search interface
 */
export async function searchProducts(
  tensorVector: number[] | null,
  embeddingVector: number[] | null,
  config: Partial<SearchConfig> = {}
): Promise<ProductSearchResult[]> {
  const mode = config.mode || SearchMode.HYBRID;

  if (mode === SearchMode.TENSOR) {
    if (!tensorVector) {
      throw new Error('Tensor vector required for TENSOR search mode');
    }
    return searchByTensor(tensorVector, config);
  }

  if (mode === SearchMode.EMBEDDING) {
    if (!embeddingVector) {
      throw new Error('Embedding vector required for EMBEDDING search mode');
    }
    return searchByEmbedding(embeddingVector, config);
  }

  // Hybrid mode
  if (!tensorVector || !embeddingVector) {
    throw new Error('Both vectors required for HYBRID search mode');
  }
  return searchHybrid(tensorVector, embeddingVector, config);
}

/**
 * Normalize scores to 0-1 range using min-max normalization
 */
function normalizeScores(
  results: ProductSearchResult[]
): ProductSearchResult[] {
  if (results.length === 0) return [];

  const scores = results.map((r) => r.score);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min;

  if (range === 0) {
    // All scores are the same
    return results.map((r) => ({ ...r, score: 1 }));
  }

  return results.map((result) => ({
    ...result,
    score: (result.score - min) / range,
  }));
}
