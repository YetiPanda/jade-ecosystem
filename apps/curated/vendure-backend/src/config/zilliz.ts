/**
 * Zilliz Cloud Configuration
 *
 * Vector database for semantic product search using hybrid embeddings
 * Cluster ID: in03-18f9d73a26a05f6
 * Cloud Region: gcp-us-west1
 *
 * NOTE: Zilliz is optional - the server will start without it, but vector
 * search features will be unavailable until credentials are configured.
 */

import { MilvusClient, DataType } from '@zilliz/milvus2-sdk-node';
import { config } from 'dotenv';

config();

const ZILLIZ_ENDPOINT = process.env.ZILLIZ_ENDPOINT || '';
const ZILLIZ_TOKEN = process.env.ZILLIZ_TOKEN || '';
const ZILLIZ_DATABASE = process.env.ZILLIZ_DATABASE || 'default';

// Check if Zilliz is configured
export const isZillizConfigured = Boolean(ZILLIZ_ENDPOINT && ZILLIZ_TOKEN);

// Lazy-initialized client
let _zillizClient: MilvusClient | null = null;

/**
 * Get the Zilliz client (lazy initialization)
 * Throws an error if Zilliz is not configured
 */
export function getZillizClient(): MilvusClient {
  if (!isZillizConfigured) {
    throw new Error('Zilliz Cloud is not configured. Set ZILLIZ_ENDPOINT and ZILLIZ_TOKEN environment variables.');
  }

  if (!_zillizClient) {
    _zillizClient = new MilvusClient({
      address: ZILLIZ_ENDPOINT,
      token: ZILLIZ_TOKEN,
      database: ZILLIZ_DATABASE,
    });
  }

  return _zillizClient;
}

// For backward compatibility - will throw if not configured
export const zillizClient = new Proxy({} as MilvusClient, {
  get(_target, prop) {
    return (getZillizClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Collection name
export const PRODUCT_COLLECTION = 'jade_products';

/**
 * Product Embedding Schema
 *
 * Hybrid embeddings combining:
 * - Product metadata (brand, category, price)
 * - Ingredient tensor (13D compatibility vector)
 * - Usage context (professional level, skin concerns)
 */
export const ProductCollectionSchema = {
  collection_name: PRODUCT_COLLECTION,
  description: 'JADE Marketplace product embeddings with 13D tensor compatibility',
  fields: [
    {
      name: 'id',
      description: 'Product UUID from PostgreSQL',
      data_type: DataType.VarChar,
      is_primary_key: true,
      max_length: 36,
    },
    {
      name: 'vendure_product_id',
      description: 'Vendure product ID',
      data_type: DataType.VarChar,
      max_length: 36,
    },
    {
      name: 'brand_name',
      description: 'Product brand name',
      data_type: DataType.VarChar,
      max_length: 255,
    },
    {
      name: 'product_name',
      description: 'Product display name',
      data_type: DataType.VarChar,
      max_length: 500,
    },
    {
      name: 'category_path',
      description: 'Hierarchical category (e.g., Skincare > Serums)',
      data_type: DataType.VarChar,
      max_length: 500,
    },
    {
      name: 'primary_functions',
      description: 'JSON array of function IDs',
      data_type: DataType.VarChar,
      max_length: 1000,
    },
    {
      name: 'skin_concerns',
      description: 'JSON array of skin concern IDs',
      data_type: DataType.VarChar,
      max_length: 1000,
    },
    {
      name: 'professional_level',
      description: 'OTC, PROFESSIONAL, MEDICAL_GRADE, IN_OFFICE_ONLY',
      data_type: DataType.VarChar,
      max_length: 50,
    },
    {
      name: 'usage_time',
      description: 'MORNING, EVENING, ANYTIME, NIGHT_ONLY, POST_TREATMENT',
      data_type: DataType.VarChar,
      max_length: 50,
    },
    {
      name: 'price_wholesale',
      description: 'Wholesale price in cents',
      data_type: DataType.Int64,
    },
    {
      name: 'taxonomy_completeness_score',
      description: 'Taxonomy data completeness (0-100)',
      data_type: DataType.Int32,
    },
    {
      name: 'created_at',
      description: 'Product creation timestamp',
      data_type: DataType.Int64,
    },
    {
      name: 'updated_at',
      description: 'Last update timestamp',
      data_type: DataType.Int64,
    },
    {
      name: 'tensor_embedding',
      description: '13D tensor compatibility vector',
      data_type: DataType.FloatVector,
      dim: 13,
    },
    {
      name: 'semantic_embedding',
      description: '768D semantic embedding from text description',
      data_type: DataType.FloatVector,
      dim: 768,
    },
  ],
  enableDynamicField: true,
};

/**
 * Index configuration for vector search
 */
export const ProductIndexConfig = {
  tensor_index: {
    index_name: 'tensor_index',
    field_name: 'tensor_embedding',
    metric_type: 'L2', // Euclidean distance for compatibility matching
    index_type: 'IVF_FLAT',
    params: { nlist: 128 },
  },
  semantic_index: {
    index_name: 'semantic_index',
    field_name: 'semantic_embedding',
    metric_type: 'COSINE', // Cosine similarity for semantic search
    index_type: 'IVF_FLAT',
    params: { nlist: 1024 },
  },
};

/**
 * Initialize Zilliz collection
 * Returns early if Zilliz is not configured
 */
export async function initializeProductCollection(): Promise<void> {
  if (!isZillizConfigured) {
    console.log('⚠️  Zilliz Cloud not configured - skipping vector database initialization');
    return;
  }

  try {
    const client = getZillizClient();
    // Check if collection exists
    const hasCollection = await client.hasCollection({
      collection_name: PRODUCT_COLLECTION,
    });

    if (hasCollection.value) {
      console.log(`✓ Collection "${PRODUCT_COLLECTION}" already exists`);
      return;
    }

    // Create collection
    console.log(`Creating collection "${PRODUCT_COLLECTION}"...`);
    await client.createCollection(ProductCollectionSchema);
    console.log(`✓ Collection created`);

    // Create indexes
    console.log('Creating vector indexes...');

    await client.createIndex({
      collection_name: PRODUCT_COLLECTION,
      ...ProductIndexConfig.tensor_index,
    });
    console.log('✓ Tensor index created');

    await client.createIndex({
      collection_name: PRODUCT_COLLECTION,
      ...ProductIndexConfig.semantic_index,
    });
    console.log('✓ Semantic index created');

    // Load collection
    await client.loadCollection({
      collection_name: PRODUCT_COLLECTION,
    });
    console.log('✓ Collection loaded into memory');

  } catch (error) {
    console.error('Failed to initialize product collection:', error);
    throw error;
  }
}

/**
 * Check Zilliz connection health
 * Returns false if Zilliz is not configured
 */
export async function checkZillizHealth(): Promise<boolean> {
  if (!isZillizConfigured) {
    console.log('⚠️  Zilliz Cloud not configured - health check skipped');
    return false;
  }

  try {
    const client = getZillizClient();
    const version = await client.checkHealth();
    console.log('✓ Zilliz Cloud connected:', version);
    return true;
  } catch (error) {
    console.error('✗ Zilliz Cloud connection failed:', error);
    return false;
  }
}
