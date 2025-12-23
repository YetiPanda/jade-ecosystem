/**
 * Sync SKA Vectors to Zilliz Unified Collection
 *
 * Reads atoms with tensors from PostgreSQL and syncs to a single unified
 * Zilliz collection with both semantic (792-D) and tensor (17-D) embeddings.
 *
 * For semantic embeddings:
 * - Uses OpenAI text-embedding-3-small if OPENAI_API_KEY is set
 * - Falls back to deterministic placeholder embeddings for testing
 *
 * Usage:
 *   pnpm --filter @jade/vendure-backend run ska:sync-vectors
 */

import { config } from 'dotenv';
config();

import { Pool } from 'pg';
import OpenAI from 'openai';
import {
  createSKAZillizClient,
  SKA_ATOMS_COLLECTION,
  SEMANTIC_EMBEDDING_DIM,
  TENSOR_EMBEDDING_DIM,
  getSKAStats,
} from '../config/zilliz-ska';

// Database configuration
const pool = new Pool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'jade_marketplace',
  user: process.env.DATABASE_USER || 'jade_user',
  password: process.env.DATABASE_PASSWORD || 'jade_dev_password',
});

// OpenAI client (optional)
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Batch sizes
const BATCH_SIZE = 50;

interface AtomWithTensorRow {
  // Atom fields
  id: string;
  pillar_id: string;
  atom_type: string;
  title: string;
  slug: string;
  inci_name: string | null;
  market_segment: string | null;
  causes_purging: boolean | null;
  fda_approved: boolean | null;
  eu_compliant: boolean | null;
  efficacy_score: number | null;
  innovation_score: number | null;
  glance_text: string;
  scan_text: string;
  study_text: string;
  created_at: Date;
  updated_at: Date;
  // Tensor fields (17-D)
  hydration_index: number | null;
  sebum_regulation: number | null;
  anti_aging_potency: number | null;
  brightening_efficacy: number | null;
  anti_inflammatory: number | null;
  barrier_repair: number | null;
  exfoliation_strength: number | null;
  antioxidant_capacity: number | null;
  collagen_stimulation: number | null;
  sensitivity_risk: number | null;
  photosensitivity: number | null;
  ph_dependency: number | null;
  molecular_penetration: number | null;
  stability_rating: number | null;
  compatibility_score: number | null;
  clinical_evidence_level: number | null;
  market_saturation: number | null;
}

/**
 * Generate semantic embedding for text
 * Uses OpenAI if available, otherwise falls back to deterministic placeholder
 */
async function generateSemanticEmbedding(text: string): Promise<number[]> {
  // If OpenAI is available, use it
  if (openai) {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text.substring(0, 8000), // Limit input size
        dimensions: SEMANTIC_EMBEDDING_DIM,
      });
      return response.data[0].embedding;
    } catch (error) {
      console.warn('OpenAI embedding failed, using placeholder:', error);
    }
  }

  // Fallback: Generate deterministic placeholder embedding
  return generatePlaceholderEmbedding(text, SEMANTIC_EMBEDDING_DIM);
}

/**
 * Generate a deterministic placeholder embedding from text
 * Uses a simple hash-based approach for consistency
 */
function generatePlaceholderEmbedding(text: string, dim: number): number[] {
  const embedding: number[] = new Array(dim).fill(0);

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  // Generate pseudo-random values based on hash
  const seed = Math.abs(hash);
  for (let i = 0; i < dim; i++) {
    const val = Math.sin(seed * (i + 1) * 0.001) * 0.5;
    embedding[i] = val;
  }

  // Normalize to unit vector
  const magnitude = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
  if (magnitude > 0) {
    for (let i = 0; i < dim; i++) {
      embedding[i] /= magnitude;
    }
  }

  return embedding;
}

/**
 * Fetch atoms with tensor data from PostgreSQL (LEFT JOIN to include atoms without tensors)
 */
async function fetchAtomsWithTensors(): Promise<AtomWithTensorRow[]> {
  const result = await pool.query<AtomWithTensorRow>(`
    SELECT
      a.id, a.pillar_id, a.atom_type, a.title, a.slug, a.inci_name,
      a.market_segment, a.causes_purging, a.fda_approved, a.eu_compliant,
      a.efficacy_score, a.innovation_score,
      a.glance_text, a.scan_text, a.study_text,
      a.created_at, a.updated_at,
      t.hydration_index, t.sebum_regulation, t.anti_aging_potency,
      t.brightening_efficacy, t.anti_inflammatory, t.barrier_repair,
      t.exfoliation_strength, t.antioxidant_capacity, t.collagen_stimulation,
      t.sensitivity_risk, t.photosensitivity, t.ph_dependency,
      t.molecular_penetration, t.stability_rating, t.compatibility_score,
      t.clinical_evidence_level, t.market_saturation
    FROM jade.skincare_atoms a
    LEFT JOIN jade.skincare_atom_tensors t ON t.atom_id = a.id
    ORDER BY a.created_at
  `);
  return result.rows;
}

/**
 * Build 17-D tensor vector from row data
 */
function buildTensorVector(row: AtomWithTensorRow): number[] {
  return [
    row.hydration_index ?? 0,
    row.sebum_regulation ?? 0,
    row.anti_aging_potency ?? 0,
    row.brightening_efficacy ?? 0,
    row.anti_inflammatory ?? 0,
    row.barrier_repair ?? 0,
    row.exfoliation_strength ?? 0,
    row.antioxidant_capacity ?? 0,
    row.collagen_stimulation ?? 0,
    row.sensitivity_risk ?? 0,
    row.photosensitivity ?? 0,
    row.ph_dependency ?? 0,
    row.molecular_penetration ?? 0,
    row.stability_rating ?? 0,
    row.compatibility_score ?? 0,
    row.clinical_evidence_level ?? 0,
    row.market_saturation ?? 0,
  ];
}

/**
 * Sync atoms to unified Zilliz collection (with both semantic and tensor embeddings)
 */
async function syncToUnifiedCollection(
  client: ReturnType<typeof createSKAZillizClient>,
  atoms: AtomWithTensorRow[]
): Promise<number> {
  console.log(`\nSyncing ${atoms.length} atoms to ${SKA_ATOMS_COLLECTION}...`);
  console.log(`  Embedding dimensions: semantic=${SEMANTIC_EMBEDDING_DIM}, tensor=${TENSOR_EMBEDDING_DIM}`);

  let synced = 0;

  // Process in batches
  for (let i = 0; i < atoms.length; i += BATCH_SIZE) {
    const batch = atoms.slice(i, i + BATCH_SIZE);
    const records: Record<string, unknown>[] = [];

    for (const atom of batch) {
      // Combine text for semantic embedding
      const fullText = `${atom.title}. ${atom.glance_text} ${atom.scan_text} ${atom.study_text}`;

      // Generate semantic embedding
      const semanticEmbedding = await generateSemanticEmbedding(fullText);

      // Build 17-D tensor vector
      const tensorEmbedding = buildTensorVector(atom);

      records.push({
        id: atom.id,
        pillar_id: atom.pillar_id,
        atom_type: atom.atom_type,
        title: atom.title,
        slug: atom.slug,
        inci_name: atom.inci_name || '',
        market_segment: atom.market_segment || '',
        causes_purging: atom.causes_purging || false,
        fda_approved: atom.fda_approved || false,
        eu_compliant: atom.eu_compliant || false,
        efficacy_score: atom.efficacy_score || 0,
        innovation_score: atom.innovation_score || 0,
        // Key tensor dimensions for filtering
        hydration_index: atom.hydration_index ?? 0,
        anti_aging_potency: atom.anti_aging_potency ?? 0,
        brightening_efficacy: atom.brightening_efficacy ?? 0,
        sensitivity_risk: atom.sensitivity_risk ?? 0,
        exfoliation_strength: atom.exfoliation_strength ?? 0,
        // Timestamps
        created_at: atom.created_at.getTime(),
        updated_at: atom.updated_at.getTime(),
        // Dual embeddings
        semantic_embedding: semanticEmbedding,
        tensor_embedding: tensorEmbedding,
      });
    }

    // Upsert to Zilliz unified collection
    await client.upsert({
      collection_name: SKA_ATOMS_COLLECTION,
      data: records,
    });

    synced += batch.length;
    process.stdout.write(`  Progress: ${synced}/${atoms.length}\r`);
  }

  console.log(`  Completed: ${synced}/${atoms.length} atoms synced`);
  return synced;
}

async function main() {
  console.log('');
  console.log('==================================================');
  console.log('  SKA UNIFIED VECTOR SYNC');
  console.log('==================================================');
  console.log('');

  // Show embedding mode
  if (openai) {
    console.log('Semantic embedding: OpenAI text-embedding-3-small');
  } else {
    console.log('Semantic embedding: Placeholder (set OPENAI_API_KEY for real embeddings)');
  }
  console.log('Tensor embedding: 17-D domain tensor from PostgreSQL');
  console.log('');

  try {
    // Connect to Zilliz
    console.log('Connecting to Zilliz Cloud...');
    const client = createSKAZillizClient();
    const version = await client.getVersion();
    console.log(`  Connected! Server version: ${version.version}`);

    // Fetch data from PostgreSQL
    console.log('\nFetching atoms with tensors from PostgreSQL...');
    const atoms = await fetchAtomsWithTensors();
    console.log(`  Found ${atoms.length} atoms`);

    const atomsWithTensors = atoms.filter(a => a.hydration_index !== null);
    console.log(`  With tensor data: ${atomsWithTensors.length}`);

    if (atoms.length === 0) {
      console.log('\nNo atoms to sync. Run ska:seed first.');
      await pool.end();
      return;
    }

    // Sync to unified collection
    const synced = await syncToUnifiedCollection(client, atoms);

    // Show final stats
    console.log('\n==================================================');
    console.log('  SYNC COMPLETE');
    console.log('==================================================\n');

    const stats = await getSKAStats(client);

    console.log(`Collection: ${SKA_ATOMS_COLLECTION}`);
    console.log(`  Total vectors: ${stats.atoms.rowCount.toLocaleString()}`);
    console.log(`  Synced this run: ${synced}`);
    console.log('');

    console.log('Dual-vector search is now available:');
    console.log('  - Semantic search (792-D): Natural language queries');
    console.log('  - Tensor search (17-D): Scientific profile matching');
    console.log('');

  } catch (error) {
    console.error('\n❌ Sync failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);
