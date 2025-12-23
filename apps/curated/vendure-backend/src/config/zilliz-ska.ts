/**
 * SKA (Skincare Knowledge Atoms) Zilliz Configuration
 *
 * Vector database collections for skincare intelligence:
 * - 792-D semantic embeddings (text understanding)
 * - 17-D domain tensors (scientific profile matching)
 */

import { MilvusClient, DataType, MetricType, IndexType } from '@zilliz/milvus2-sdk-node';
import { config } from 'dotenv';

config();

// Environment configuration
const ZILLIZ_ENDPOINT = process.env.ZILLIZ_ENDPOINT || '';
const ZILLIZ_USERNAME = process.env.ZILLIZ_USERNAME || '';
const ZILLIZ_PASSWORD = process.env.ZILLIZ_PASSWORD || '';
const ZILLIZ_TOKEN = process.env.ZILLIZ_TOKEN || '';
const ZILLIZ_DATABASE = process.env.ZILLIZ_DATABASE || 'default';

// Collection name - unified with both embeddings
export const SKA_ATOMS_COLLECTION = 'ska_atoms_unified';
// Deprecated - kept for backwards compatibility
export const SKA_TENSORS_COLLECTION = 'ska_tensors';

// Vector dimensions
export const SEMANTIC_EMBEDDING_DIM = 792;  // Text semantic embeddings
export const TENSOR_EMBEDDING_DIM = 17;      // Domain-specific tensor

/**
 * Initialize Zilliz client with credentials
 */
export function createSKAZillizClient(): MilvusClient {
  if (!ZILLIZ_ENDPOINT) {
    throw new Error('Missing ZILLIZ_ENDPOINT environment variable');
  }

  // Support both token and username/password auth
  const clientConfig: any = {
    address: ZILLIZ_ENDPOINT,
    database: ZILLIZ_DATABASE,
    timeout: 30000,
  };

  if (ZILLIZ_TOKEN) {
    clientConfig.token = ZILLIZ_TOKEN;
  } else if (ZILLIZ_USERNAME && ZILLIZ_PASSWORD) {
    clientConfig.username = ZILLIZ_USERNAME;
    clientConfig.password = ZILLIZ_PASSWORD;
  } else {
    throw new Error('Missing Zilliz credentials. Set ZILLIZ_TOKEN or ZILLIZ_USERNAME + ZILLIZ_PASSWORD');
  }

  return new MilvusClient(clientConfig);
}

/**
 * SKA Unified Collection Schema
 *
 * Single collection with both embeddings for hybrid search:
 * - 792-D semantic embeddings (text understanding)
 * - 17-D domain tensors (scientific profile matching)
 */
export const SKAAtomsCollectionSchema = {
  collection_name: SKA_ATOMS_COLLECTION,
  description: 'SKA unified collection with 792-D semantic + 17-D tensor embeddings',
  fields: [
    {
      name: 'id',
      description: 'Atom UUID from PostgreSQL',
      data_type: DataType.VarChar,
      is_primary_key: true,
      max_length: 36,
    },
    {
      name: 'pillar_id',
      description: 'Pillar foreign key',
      data_type: DataType.VarChar,
      max_length: 36,
    },
    {
      name: 'atom_type',
      description: 'COMPANY, BRAND, PRODUCT, INGREDIENT, etc.',
      data_type: DataType.VarChar,
      max_length: 50,
    },
    {
      name: 'title',
      description: 'Atom title',
      data_type: DataType.VarChar,
      max_length: 500,
    },
    {
      name: 'slug',
      description: 'URL-friendly slug',
      data_type: DataType.VarChar,
      max_length: 200,
    },
    {
      name: 'inci_name',
      description: 'INCI name for ingredients',
      data_type: DataType.VarChar,
      max_length: 500,
    },
    {
      name: 'market_segment',
      description: 'MASS, PRESTIGE, LUXURY, MEDICAL, NATURAL',
      data_type: DataType.VarChar,
      max_length: 50,
    },
    {
      name: 'causes_purging',
      description: 'Whether ingredient causes purging',
      data_type: DataType.Bool,
    },
    {
      name: 'fda_approved',
      description: 'FDA approval status',
      data_type: DataType.Bool,
    },
    {
      name: 'eu_compliant',
      description: 'EU regulatory compliance',
      data_type: DataType.Bool,
    },
    {
      name: 'efficacy_score',
      description: 'Efficacy rating 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'innovation_score',
      description: 'Innovation rating 0-1',
      data_type: DataType.Float,
    },
    // 17-D Tensor dimensions (for filtering)
    {
      name: 'hydration_index',
      description: 'Hydration efficacy 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'anti_aging_potency',
      description: 'Anti-aging strength 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'brightening_efficacy',
      description: 'Brightening effect 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'sensitivity_risk',
      description: 'Irritation risk 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'exfoliation_strength',
      description: 'Exfoliation intensity 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'created_at',
      description: 'Creation timestamp (epoch ms)',
      data_type: DataType.Int64,
    },
    {
      name: 'updated_at',
      description: 'Update timestamp (epoch ms)',
      data_type: DataType.Int64,
    },
    // Dual vector embeddings
    {
      name: 'semantic_embedding',
      description: '792-D semantic embedding from text (glance+scan+study)',
      data_type: DataType.FloatVector,
      dim: SEMANTIC_EMBEDDING_DIM,
    },
    {
      name: 'tensor_embedding',
      description: '17-D domain tensor for scientific profile matching',
      data_type: DataType.FloatVector,
      dim: TENSOR_EMBEDDING_DIM,
    },
  ],
  enableDynamicField: true,
};

/**
 * SKA Tensors Collection Schema
 *
 * Stores 17-D domain tensors for scientific profile matching
 * Separate collection enables fast tensor-only searches
 */
export const SKATensorsCollectionSchema = {
  collection_name: SKA_TENSORS_COLLECTION,
  description: 'SKA 17-D domain tensors for scientific profile matching',
  fields: [
    {
      name: 'id',
      description: 'Tensor UUID from PostgreSQL',
      data_type: DataType.VarChar,
      is_primary_key: true,
      max_length: 36,
    },
    {
      name: 'atom_id',
      description: 'Parent atom foreign key',
      data_type: DataType.VarChar,
      max_length: 36,
    },
    {
      name: 'atom_type',
      description: 'Parent atom type',
      data_type: DataType.VarChar,
      max_length: 50,
    },
    {
      name: 'title',
      description: 'Atom title for display',
      data_type: DataType.VarChar,
      max_length: 500,
    },
    // Individual tensor dimensions for filtering
    {
      name: 'hydration_index',
      description: 'Hydration efficacy 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'sebum_regulation',
      description: 'Sebum control 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'anti_aging_potency',
      description: 'Anti-aging strength 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'brightening_efficacy',
      description: 'Brightening effect 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'anti_inflammatory',
      description: 'Anti-inflammatory 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'barrier_repair',
      description: 'Barrier support 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'exfoliation_strength',
      description: 'Exfoliation intensity 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'antioxidant_capacity',
      description: 'Antioxidant level 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'collagen_stimulation',
      description: 'Collagen boost 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'sensitivity_risk',
      description: 'Irritation risk 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'photosensitivity',
      description: 'Sun sensitivity risk 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'ph_dependency',
      description: 'pH sensitivity 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'molecular_penetration',
      description: 'Skin penetration depth 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'stability_rating',
      description: 'Formulation stability 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'compatibility_score',
      description: 'Layering compatibility 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'clinical_evidence_level',
      description: 'Research backing 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'market_saturation',
      description: 'Market presence 0-1',
      data_type: DataType.Float,
    },
    {
      name: 'tensor_vector',
      description: '17-D domain tensor for similarity search',
      data_type: DataType.FloatVector,
      dim: TENSOR_EMBEDDING_DIM,
    },
  ],
  enableDynamicField: true,
};

/**
 * Index configurations for optimal search performance
 */
export const SKAIndexConfigs = {
  // Semantic embedding index - COSINE for text similarity
  semantic_index: {
    index_name: 'ska_semantic_idx',
    field_name: 'semantic_embedding',
    metric_type: MetricType.COSINE,
    index_type: IndexType.IVF_FLAT,
    params: { nlist: 256 }, // Higher nlist for better accuracy with 792-D
  },
  // Tensor index - L2 for profile matching
  tensor_index: {
    index_name: 'ska_tensor_idx',
    field_name: 'tensor_embedding',
    metric_type: MetricType.L2, // Euclidean for numeric compatibility
    index_type: IndexType.IVF_FLAT,
    params: { nlist: 64 }, // Lower nlist sufficient for 17-D
  },
};

/**
 * Search parameters
 */
export const SKASearchParams = {
  semantic: {
    metric_type: MetricType.COSINE,
    params: { nprobe: 16 },
  },
  tensor: {
    metric_type: MetricType.L2,
    params: { nprobe: 8 },
  },
};

/**
 * Initialize SKA unified collection with dual embeddings
 */
export async function initializeSKACollections(client: MilvusClient): Promise<void> {
  console.log('Initializing SKA Zilliz unified collection...\n');

  // Initialize unified collection with both indexes
  await initializeCollection(
    client,
    SKA_ATOMS_COLLECTION,
    SKAAtomsCollectionSchema,
    [SKAIndexConfigs.semantic_index, SKAIndexConfigs.tensor_index]
  );

  console.log('\n✅ SKA unified collection initialized successfully!');
}

/**
 * Initialize a single collection with schema and indexes
 */
async function initializeCollection(
  client: MilvusClient,
  collectionName: string,
  schema: any,
  indexes: any[]
): Promise<void> {
  console.log(`\n📦 Processing collection: ${collectionName}`);

  // Check if exists
  const hasCollection = await client.hasCollection({
    collection_name: collectionName,
  });

  if (hasCollection.value) {
    console.log(`  ✓ Collection "${collectionName}" already exists`);

    // Get stats
    const stats = await client.getCollectionStatistics({
      collection_name: collectionName,
    });
    console.log(`  📊 Row count: ${stats.data.row_count}`);
    return;
  }

  // Create collection
  console.log(`  Creating collection...`);
  await client.createCollection(schema);
  console.log(`  ✓ Collection created`);

  // Create indexes
  for (const indexConfig of indexes) {
    console.log(`  Creating index: ${indexConfig.index_name}...`);
    await client.createIndex({
      collection_name: collectionName,
      ...indexConfig,
    });
    console.log(`  ✓ Index created`);
  }

  // Load collection into memory
  console.log(`  Loading collection into memory...`);
  await client.loadCollection({
    collection_name: collectionName,
  });
  console.log(`  ✓ Collection loaded`);
}

/**
 * Drop SKA unified collection (use with caution!)
 */
export async function dropSKACollections(client: MilvusClient): Promise<void> {
  console.log('⚠️  Dropping SKA collections...');

  // Drop unified collection and any legacy collections
  const collections = [SKA_ATOMS_COLLECTION, 'ska_atoms', SKA_TENSORS_COLLECTION];

  for (const collectionName of collections) {
    const hasCollection = await client.hasCollection({
      collection_name: collectionName,
    });

    if (hasCollection.value) {
      await client.dropCollection({ collection_name: collectionName });
      console.log(`  ✓ Dropped: ${collectionName}`);
    } else {
      console.log(`  - Skipped (not found): ${collectionName}`);
    }
  }

  console.log('✅ SKA collections dropped');
}

/**
 * Get SKA collection statistics
 */
export async function getSKAStats(client: MilvusClient): Promise<{
  atoms: { exists: boolean; rowCount: number };
  tensors: { exists: boolean; rowCount: number };
}> {
  const result = {
    atoms: { exists: false, rowCount: 0 },
    tensors: { exists: false, rowCount: 0 }, // Same as atoms in unified collection
  };

  // Check unified collection
  const hasAtoms = await client.hasCollection({
    collection_name: SKA_ATOMS_COLLECTION,
  });
  if (hasAtoms.value) {
    result.atoms.exists = true;
    result.tensors.exists = true; // Unified collection has both
    const stats = await client.getCollectionStatistics({
      collection_name: SKA_ATOMS_COLLECTION,
    });
    const count = parseInt(stats.data.row_count, 10);
    result.atoms.rowCount = count;
    result.tensors.rowCount = count; // Same count for unified
  }

  return result;
}
