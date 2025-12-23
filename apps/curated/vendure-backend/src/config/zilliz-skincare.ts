/**
 * Zilliz Cloud Configuration for Skincare Products
 *
 * Vector database collection for semantic skincare product search
 * Enables natural language queries like:
 * - "Find gentle gel cleansers for oily skin under $20"
 * - "Best vitamin C serums for hyperpigmentation"
 * - "Fragrance-free moisturizers for sensitive skin"
 */

import { MilvusClient, DataType } from '@zilliz/milvus2-sdk-node';
import { config } from 'dotenv';

config();

const ZILLIZ_ENDPOINT = process.env.ZILLIZ_ENDPOINT || '';
const ZILLIZ_TOKEN = process.env.ZILLIZ_TOKEN || '';
const ZILLIZ_DATABASE = process.env.ZILLIZ_DATABASE || 'default';

// Check if Zilliz is configured
export const isSkincareZillizConfigured = Boolean(ZILLIZ_ENDPOINT && ZILLIZ_TOKEN);

// Collection name for skincare products
export const SKINCARE_COLLECTION = 'jade_skincare_products';

// Lazy-initialized client
let _skincareZillizClient: MilvusClient | null = null;

/**
 * Skincare Product Collection Schema
 *
 * Optimized for semantic search on skincare product attributes:
 * - Product metadata (name, brand, category)
 * - Skin compatibility (types, concerns)
 * - Ingredients and benefits
 * - Semantic embeddings for natural language search
 */
export const SkincareCollectionSchema = {
  collection_name: SKINCARE_COLLECTION,
  description: 'JADE Marketplace skincare products with semantic embeddings',
  fields: [
    // Primary key
    {
      name: 'id',
      description: 'Unique product identifier',
      data_type: DataType.VarChar,
      is_primary_key: true,
      max_length: 100,
    },
    // Product metadata
    {
      name: 'product_name',
      description: 'Full product name',
      data_type: DataType.VarChar,
      max_length: 255,
    },
    {
      name: 'brand',
      description: 'Product brand name',
      data_type: DataType.VarChar,
      max_length: 100,
    },
    {
      name: 'category',
      description: 'Main category (Cleansers, Treatments, etc.)',
      data_type: DataType.VarChar,
      max_length: 100,
    },
    {
      name: 'subcategory',
      description: 'Subcategory (Gel Cleanser, Vitamin C Serum, etc.)',
      data_type: DataType.VarChar,
      max_length: 100,
    },
    // Skin compatibility (stored as JSON strings)
    {
      name: 'skin_types',
      description: 'JSON array of compatible skin types',
      data_type: DataType.VarChar,
      max_length: 500,
    },
    {
      name: 'concerns',
      description: 'JSON array of targeted skin concerns',
      data_type: DataType.VarChar,
      max_length: 1000,
    },
    // Product composition
    {
      name: 'ingredients',
      description: 'JSON array of active ingredients',
      data_type: DataType.VarChar,
      max_length: 1000,
    },
    {
      name: 'benefits',
      description: 'JSON array of functional benefits',
      data_type: DataType.VarChar,
      max_length: 1000,
    },
    {
      name: 'key_benefits',
      description: 'JSON array of key product benefits',
      data_type: DataType.VarChar,
      max_length: 1000,
    },
    // Product attributes
    {
      name: 'price_tier',
      description: 'Price tier ($, $$, $$$, $$$$)',
      data_type: DataType.VarChar,
      max_length: 10,
    },
    {
      name: 'texture',
      description: 'Product texture (Gel, Cream, Serum, etc.)',
      data_type: DataType.VarChar,
      max_length: 50,
    },
    {
      name: 'routine_step',
      description: 'Step in skincare routine (Cleanse, Treat, Moisturize, etc.)',
      data_type: DataType.VarChar,
      max_length: 50,
    },
    {
      name: 'volume',
      description: 'Product size/volume',
      data_type: DataType.VarChar,
      max_length: 50,
    },
    // Boolean attributes
    {
      name: 'fragrance_free',
      description: 'Is fragrance-free',
      data_type: DataType.Bool,
    },
    {
      name: 'vegan',
      description: 'Is vegan',
      data_type: DataType.Bool,
    },
    {
      name: 'cruelty_free',
      description: 'Is cruelty-free',
      data_type: DataType.Bool,
    },
    // Search text for embedding generation
    {
      name: 'search_text',
      description: 'Combined text for embedding generation',
      data_type: DataType.VarChar,
      max_length: 5000,
    },
    // Vector embedding for semantic search
    {
      name: 'semantic_embedding',
      description: '768D semantic embedding for natural language search',
      data_type: DataType.FloatVector,
      dim: 768,
    },
    // Timestamps
    {
      name: 'created_at',
      description: 'Creation timestamp',
      data_type: DataType.Int64,
    },
    {
      name: 'updated_at',
      description: 'Last update timestamp',
      data_type: DataType.Int64,
    },
  ],
  enableDynamicField: true,
};

/**
 * Index configuration for vector search
 */
export const SkincareIndexConfig = {
  semantic_index: {
    index_name: 'skincare_semantic_index',
    field_name: 'semantic_embedding',
    metric_type: 'COSINE', // Cosine similarity for semantic search
    index_type: 'IVF_FLAT',
    params: { nlist: 1024 },
  },
};

/**
 * Get Zilliz client for skincare operations (lazy initialization)
 * Throws an error if Zilliz is not configured
 */
export function getSkincareZillizClient(): MilvusClient {
  if (!isSkincareZillizConfigured) {
    throw new Error('Zilliz Cloud is not configured for skincare search. Set ZILLIZ_ENDPOINT and ZILLIZ_TOKEN environment variables.');
  }

  if (!_skincareZillizClient) {
    _skincareZillizClient = new MilvusClient({
      address: ZILLIZ_ENDPOINT,
      token: ZILLIZ_TOKEN,
      database: ZILLIZ_DATABASE,
    });
  }

  return _skincareZillizClient;
}

/**
 * Initialize skincare products collection
 * Returns early if Zilliz is not configured
 */
export async function initializeSkincareCollection(): Promise<void> {
  if (!isSkincareZillizConfigured) {
    console.log('⚠️  Zilliz Cloud not configured - skipping skincare collection initialization');
    return;
  }

  const client = getSkincareZillizClient();

  try {
    // Check if collection exists
    const hasCollection = await client.hasCollection({
      collection_name: SKINCARE_COLLECTION,
    });

    if (hasCollection.value) {
      console.log(`✓ Skincare collection "${SKINCARE_COLLECTION}" already exists`);
      return;
    }

    // Create collection
    console.log(`Creating skincare collection "${SKINCARE_COLLECTION}"...`);
    await client.createCollection(SkincareCollectionSchema);
    console.log(`✓ Skincare collection created`);

    // Create semantic index
    console.log('Creating semantic vector index...');
    await client.createIndex({
      collection_name: SKINCARE_COLLECTION,
      ...SkincareIndexConfig.semantic_index,
    });
    console.log('✓ Semantic index created');

    // Load collection into memory
    await client.loadCollection({
      collection_name: SKINCARE_COLLECTION,
    });
    console.log('✓ Skincare collection loaded into memory');

  } catch (error) {
    console.error('Failed to initialize skincare collection:', error);
    throw error;
  }
}

/**
 * Drop skincare collection (for testing/reset)
 * Returns early if Zilliz is not configured
 */
export async function dropSkincareCollection(): Promise<void> {
  if (!isSkincareZillizConfigured) {
    console.log('⚠️  Zilliz Cloud not configured - cannot drop skincare collection');
    return;
  }

  const client = getSkincareZillizClient();

  try {
    const hasCollection = await client.hasCollection({
      collection_name: SKINCARE_COLLECTION,
    });

    if (hasCollection.value) {
      await client.dropCollection({
        collection_name: SKINCARE_COLLECTION,
      });
      console.log(`✓ Skincare collection "${SKINCARE_COLLECTION}" dropped`);
    }
  } catch (error) {
    console.error('Failed to drop skincare collection:', error);
    throw error;
  }
}

/**
 * Check skincare collection health
 * Returns false values if Zilliz is not configured
 */
export async function checkSkincareCollectionHealth(): Promise<{
  exists: boolean;
  loaded: boolean;
  rowCount: number;
}> {
  if (!isSkincareZillizConfigured) {
    console.log('⚠️  Zilliz Cloud not configured - health check skipped');
    return { exists: false, loaded: false, rowCount: 0 };
  }

  const client = getSkincareZillizClient();

  try {
    const hasCollection = await client.hasCollection({
      collection_name: SKINCARE_COLLECTION,
    });

    if (!hasCollection.value) {
      return { exists: false, loaded: false, rowCount: 0 };
    }

    const collectionInfo = await client.getCollectionStatistics({
      collection_name: SKINCARE_COLLECTION,
    });

    const loadState = await client.getLoadState({
      collection_name: SKINCARE_COLLECTION,
    });

    return {
      exists: true,
      loaded: loadState.state === 'LoadStateLoaded',
      rowCount: parseInt(collectionInfo.data.row_count || '0', 10),
    };
  } catch (error) {
    console.error('Failed to check skincare collection health:', error);
    return { exists: false, loaded: false, rowCount: 0 };
  }
}

/**
 * Generate search text from product data for embedding
 */
export function generateSearchText(product: {
  name: string;
  brand: string;
  category: string;
  subCategory: string;
  activeIngredients: string[];
  skinTypes: string[];
  concerns: string[];
  functionalBenefits: string[];
  keyBenefits?: string[];
  texture?: string;
  priceTier?: string;
}): string {
  const parts = [
    product.name,
    product.brand,
    product.category,
    product.subCategory,
    `Ingredients: ${product.activeIngredients.join(', ')}`,
    `For skin types: ${product.skinTypes.join(', ')}`,
    `Targets: ${product.concerns.join(', ')}`,
    `Benefits: ${product.functionalBenefits.join(', ')}`,
  ];

  if (product.keyBenefits && product.keyBenefits.length > 0) {
    parts.push(`Key benefits: ${product.keyBenefits.join(', ')}`);
  }

  if (product.texture) {
    parts.push(`Texture: ${product.texture}`);
  }

  if (product.priceTier) {
    const tierLabels: Record<string, string> = {
      '$': 'budget-friendly affordable',
      '$$': 'mid-range moderate price',
      '$$$': 'premium high-end',
      '$$$$': 'luxury prestige',
    };
    parts.push(`Price: ${tierLabels[product.priceTier] || product.priceTier}`);
  }

  return parts.join('. ');
}
