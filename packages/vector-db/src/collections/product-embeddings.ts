/**
 * Product Embeddings Collection
 *
 * Manages 792-dimensional semantic embeddings for NLP-based search
 * Generated from product names and descriptions using text-embedding-3-small
 */

import { DataType } from '@zilliz/milvus2-sdk-node';
import {
  getZillizClient,
  collectionExists,
  loadCollection,
} from '../client';
import {
  ProductEmbedding,
  IndexType,
  MetricType,
  VectorSearchQuery,
  VectorSearchResult,
  BatchOperationResult,
} from '../types';

export const PRODUCT_EMBEDDINGS_COLLECTION = 'product_embeddings';

/**
 * Create product embeddings collection
 */
export async function createProductEmbeddingsCollection(): Promise<void> {
  const client = getZillizClient();

  // Check if already exists
  const exists = await collectionExists(PRODUCT_EMBEDDINGS_COLLECTION);
  if (exists) {
    console.log(`Collection ${PRODUCT_EMBEDDINGS_COLLECTION} already exists`);
    return;
  }

  // Define schema
  await client.createCollection({
    collection_name: PRODUCT_EMBEDDINGS_COLLECTION,
    description:
      '792-dimensional semantic embeddings for text-based product search',
    fields: [
      {
        name: 'id',
        description: 'Primary key (product UUID + text source)',
        data_type: DataType.VarChar,
        is_primary_key: true,
        max_length: 50,
      },
      {
        name: 'vector',
        description: '792-D embedding from text-embedding-3-small',
        data_type: DataType.FloatVector,
        dim: 792,
      },
      {
        name: 'product_id',
        description: 'Product UUID for reference',
        data_type: DataType.VarChar,
        max_length: 36,
      },
      {
        name: 'text_source',
        description: 'Source of embedding (name/description/combined)',
        data_type: DataType.VarChar,
        max_length: 20,
      },
      {
        name: 'language',
        description: 'Text language code',
        data_type: DataType.VarChar,
        max_length: 10,
      },
      {
        name: 'model_version',
        description: 'Embedding model version',
        data_type: DataType.VarChar,
        max_length: 50,
      },
      {
        name: 'generated_at',
        description: 'Timestamp when embedding was generated',
        data_type: DataType.Int64,
      },
    ],
  });

  console.log(`✅ Created collection: ${PRODUCT_EMBEDDINGS_COLLECTION}`);

  // Create vector index
  await createProductEmbeddingIndex();
}

/**
 * Create HNSW index on product embeddings
 * HNSW provides good balance of speed and accuracy for high-dimensional vectors
 */
export async function createProductEmbeddingIndex(): Promise<void> {
  const client = getZillizClient();

  await client.createIndex({
    collection_name: PRODUCT_EMBEDDINGS_COLLECTION,
    field_name: 'vector',
    index_type: IndexType.HNSW,
    metric_type: MetricType.COSINE,
    params: {
      M: 16,
      efConstruction: 512, // Higher for better quality with larger dimensions
    },
  });

  console.log(
    `✅ Created HNSW index on ${PRODUCT_EMBEDDINGS_COLLECTION}.vector`
  );
}

/**
 * Insert a single product embedding
 */
export async function insertProductEmbedding(
  embedding: ProductEmbedding
): Promise<void> {
  const client = getZillizClient();

  // Create composite ID: productId + text source
  const id = `${embedding.productId}_${embedding.textSource}`;

  await client.insert({
    collection_name: PRODUCT_EMBEDDINGS_COLLECTION,
    data: [
      {
        id,
        vector: embedding.vector,
        product_id: embedding.productId,
        text_source: embedding.textSource,
        language: embedding.metadata?.language || 'en',
        model_version:
          embedding.metadata?.modelVersion || 'text-embedding-3-small',
        generated_at: embedding.generatedAt.getTime(),
      },
    ],
  });
}

/**
 * Insert multiple product embeddings in batch
 */
export async function insertProductEmbeddingsBatch(
  embeddings: ProductEmbedding[]
): Promise<BatchOperationResult> {
  if (embeddings.length === 0) {
    return { success: true, inserted: 0, failed: 0 };
  }

  const client = getZillizClient();

  try {
    const data = embeddings.map((embedding) => ({
      id: `${embedding.productId}_${embedding.textSource}`,
      vector: embedding.vector,
      product_id: embedding.productId,
      text_source: embedding.textSource,
      language: embedding.metadata?.language || 'en',
      model_version:
        embedding.metadata?.modelVersion || 'text-embedding-3-small',
      generated_at: embedding.generatedAt.getTime(),
    }));

    await client.insert({
      collection_name: PRODUCT_EMBEDDINGS_COLLECTION,
      data,
    });

    return {
      success: true,
      inserted: embeddings.length,
      failed: 0,
    };
  } catch (error) {
    console.error('Batch insert failed:', error);
    return {
      success: false,
      inserted: 0,
      failed: embeddings.length,
      errors: [
        {
          index: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      ],
    };
  }
}

/**
 * Semantic search using text embedding
 */
export async function searchProductsByText(
  query: VectorSearchQuery
): Promise<VectorSearchResult[]> {
  const client = getZillizClient();

  // Ensure collection is loaded
  await loadCollection(PRODUCT_EMBEDDINGS_COLLECTION);

  const results = await client.search({
    collection_name: PRODUCT_EMBEDDINGS_COLLECTION,
    vector: query.vector,
    limit: query.topK || 10,
    filter: query.filter,
    output_fields: query.outputFields || [
      'product_id',
      'text_source',
      'language',
    ],
    params: {
      ef: 256, // Higher search effort for embeddings
    },
  });

  return results.results.map((result: any) => ({
    id: result.product_id,
    score: result.score,
    fields: result,
  }));
}

/**
 * Delete product embeddings by product ID (all text sources)
 */
export async function deleteProductEmbeddings(
  productId: string
): Promise<void> {
  const client = getZillizClient();

  await client.delete({
    collection_name: PRODUCT_EMBEDDINGS_COLLECTION,
    filter: `product_id == "${productId}"`,
  });
}

/**
 * Delete specific product embedding by product ID and text source
 */
export async function deleteProductEmbedding(
  productId: string,
  textSource: 'name' | 'description' | 'combined'
): Promise<void> {
  const client = getZillizClient();
  const id = `${productId}_${textSource}`;

  await client.delete({
    collection_name: PRODUCT_EMBEDDINGS_COLLECTION,
    filter: `id == "${id}"`,
  });
}

/**
 * Update product embedding (delete + insert)
 */
export async function updateProductEmbedding(
  embedding: ProductEmbedding
): Promise<void> {
  await deleteProductEmbedding(embedding.productId, embedding.textSource);
  await insertProductEmbedding(embedding);
}
