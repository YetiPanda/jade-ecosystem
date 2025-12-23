/**
 * Product Tensors Collection
 *
 * Manages 13-dimensional product tensors derived from SKA semantic atoms
 * Used for product similarity and recommendation queries
 */

import { DataType } from '@zilliz/milvus2-sdk-node';
import {
  getZillizClient,
  collectionExists,
  loadCollection,
} from '../client';
import {
  ProductTensor,
  IndexType,
  MetricType,
  VectorSearchQuery,
  VectorSearchResult,
  BatchOperationResult,
} from '../types';

export const PRODUCT_TENSORS_COLLECTION = 'product_tensors';

/**
 * Create product tensors collection
 */
export async function createProductTensorsCollection(): Promise<void> {
  const client = getZillizClient();

  // Check if already exists
  const exists = await collectionExists(PRODUCT_TENSORS_COLLECTION);
  if (exists) {
    console.log(`Collection ${PRODUCT_TENSORS_COLLECTION} already exists`);
    return;
  }

  // Define schema
  await client.createCollection({
    collection_name: PRODUCT_TENSORS_COLLECTION,
    description: '13-dimensional product tensors from SKA semantic atoms',
    fields: [
      {
        name: 'id',
        description: 'Primary key (product UUID)',
        data_type: DataType.VarChar,
        is_primary_key: true,
        max_length: 36,
      },
      {
        name: 'vector',
        description: '13-D tensor from semantic atoms',
        data_type: DataType.FloatVector,
        dim: 13,
      },
      {
        name: 'product_id',
        description: 'Product UUID for reference',
        data_type: DataType.VarChar,
        max_length: 36,
      },
      {
        name: 'sku',
        description: 'Product SKU',
        data_type: DataType.VarChar,
        max_length: 100,
      },
      {
        name: 'brand',
        description: 'Product brand',
        data_type: DataType.VarChar,
        max_length: 100,
      },
      {
        name: 'category',
        description: 'Product category',
        data_type: DataType.VarChar,
        max_length: 100,
      },
      {
        name: 'generated_at',
        description: 'Timestamp when tensor was generated',
        data_type: DataType.Int64,
      },
    ],
  });

  console.log(`✅ Created collection: ${PRODUCT_TENSORS_COLLECTION}`);

  // Create vector index for efficient search
  await createProductTensorIndex();
}

/**
 * Create HNSW index on product tensors
 * HNSW is optimal for small dimensions and high recall
 */
export async function createProductTensorIndex(): Promise<void> {
  const client = getZillizClient();

  await client.createIndex({
    collection_name: PRODUCT_TENSORS_COLLECTION,
    field_name: 'vector',
    index_type: IndexType.HNSW,
    metric_type: MetricType.COSINE,
    params: {
      M: 16, // Number of bi-directional links per node
      efConstruction: 256, // Search effort during index construction
    },
  });

  console.log(`✅ Created HNSW index on ${PRODUCT_TENSORS_COLLECTION}.vector`);
}

/**
 * Insert a single product tensor
 */
export async function insertProductTensor(
  tensor: ProductTensor
): Promise<void> {
  const client = getZillizClient();

  await client.insert({
    collection_name: PRODUCT_TENSORS_COLLECTION,
    data: [
      {
        id: tensor.productId,
        vector: tensor.vector,
        product_id: tensor.productId,
        sku: tensor.metadata?.sku || '',
        brand: tensor.metadata?.brand || '',
        category: tensor.metadata?.category || '',
        generated_at: tensor.generatedAt.getTime(),
      },
    ],
  });
}

/**
 * Insert multiple product tensors in batch
 */
export async function insertProductTensorsBatch(
  tensors: ProductTensor[]
): Promise<BatchOperationResult> {
  if (tensors.length === 0) {
    return { success: true, inserted: 0, failed: 0 };
  }

  const client = getZillizClient();

  try {
    const data = tensors.map((tensor) => ({
      id: tensor.productId,
      vector: tensor.vector,
      product_id: tensor.productId,
      sku: tensor.metadata?.sku || '',
      brand: tensor.metadata?.brand || '',
      category: tensor.metadata?.category || '',
      generated_at: tensor.generatedAt.getTime(),
    }));

    await client.insert({
      collection_name: PRODUCT_TENSORS_COLLECTION,
      data,
    });

    return {
      success: true,
      inserted: tensors.length,
      failed: 0,
    };
  } catch (error) {
    console.error('Batch insert failed:', error);
    return {
      success: false,
      inserted: 0,
      failed: tensors.length,
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
 * Search for similar products using tensor vector
 */
export async function searchSimilarProducts(
  query: VectorSearchQuery
): Promise<VectorSearchResult[]> {
  const client = getZillizClient();

  // Ensure collection is loaded
  await loadCollection(PRODUCT_TENSORS_COLLECTION);

  const results = await client.search({
    collection_name: PRODUCT_TENSORS_COLLECTION,
    vector: query.vector,
    limit: query.topK || 10,
    filter: query.filter,
    output_fields: query.outputFields || [
      'product_id',
      'sku',
      'brand',
      'category',
    ],
    params: {
      ef: 128, // Search effort (higher = more accurate but slower)
    },
  });

  return results.results.map((result: any) => ({
    id: result.id,
    score: result.score,
    fields: result,
  }));
}

/**
 * Delete product tensor by ID
 */
export async function deleteProductTensor(productId: string): Promise<void> {
  const client = getZillizClient();

  await client.delete({
    collection_name: PRODUCT_TENSORS_COLLECTION,
    filter: `id == "${productId}"`,
  });
}

/**
 * Update product tensor (delete + insert)
 */
export async function updateProductTensor(
  tensor: ProductTensor
): Promise<void> {
  await deleteProductTensor(tensor.productId);
  await insertProductTensor(tensor);
}
