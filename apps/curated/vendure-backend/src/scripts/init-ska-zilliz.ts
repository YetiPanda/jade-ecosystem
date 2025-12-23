/**
 * Initialize SKA Zilliz Collections
 *
 * Creates the vector database collections for:
 * - ska_atoms: 792-D semantic embeddings for text search
 * - ska_tensors: 17-D domain tensors for profile matching
 *
 * Usage:
 *   pnpm --filter @jade/vendure-backend run ska:init-zilliz
 *   pnpm --filter @jade/vendure-backend run ska:init-zilliz --drop (recreate)
 */

import { config } from 'dotenv';
config();

import {
  createSKAZillizClient,
  initializeSKACollections,
  dropSKACollections,
  getSKAStats,
  SKA_ATOMS_COLLECTION,
  SKA_TENSORS_COLLECTION,
  SEMANTIC_EMBEDDING_DIM,
  TENSOR_EMBEDDING_DIM,
} from '../config/zilliz-ska';

async function main() {
  console.log('');
  console.log('==================================================');
  console.log('  SKA ZILLIZ COLLECTION SETUP');
  console.log('==================================================');
  console.log('');

  // Check for --drop flag
  const shouldDrop = process.argv.includes('--drop');

  // Display configuration
  console.log('Configuration:');
  console.log(`  Endpoint: ${process.env.ZILLIZ_ENDPOINT}`);
  console.log(`  Database: ${process.env.ZILLIZ_DATABASE || 'default'}`);
  console.log(`  Auth: ${process.env.ZILLIZ_TOKEN ? 'Token' : 'Username/Password'}`);
  console.log('');

  console.log('Collections to create:');
  console.log(`  1. ${SKA_ATOMS_COLLECTION}`);
  console.log(`     - Semantic embeddings: ${SEMANTIC_EMBEDDING_DIM}-D`);
  console.log(`     - For text-based knowledge search`);
  console.log(`  2. ${SKA_TENSORS_COLLECTION}`);
  console.log(`     - Domain tensors: ${TENSOR_EMBEDDING_DIM}-D`);
  console.log(`     - For scientific profile matching`);
  console.log('');

  try {
    // Create client
    console.log('Connecting to Zilliz Cloud...');
    const client = createSKAZillizClient();

    // Test connection
    const version = await client.getVersion();
    console.log(`  Connected! Server version: ${version.version}\n`);

    // Drop collections if --drop flag provided
    if (shouldDrop) {
      console.log('--drop flag detected. Dropping existing collections...\n');
      await dropSKACollections(client);
      console.log('');
    }

    // Initialize collections
    await initializeSKACollections(client);

    // Show final stats
    console.log('\n==================================================');
    console.log('  COLLECTION STATUS');
    console.log('==================================================\n');

    const stats = await getSKAStats(client);

    console.log(`${SKA_ATOMS_COLLECTION}:`);
    console.log(`  Status: ${stats.atoms.exists ? '✅ Active' : '❌ Not found'}`);
    console.log(`  Vectors: ${stats.atoms.rowCount.toLocaleString()}`);
    console.log('');

    console.log(`${SKA_TENSORS_COLLECTION}:`);
    console.log(`  Status: ${stats.tensors.exists ? '✅ Active' : '❌ Not found'}`);
    console.log(`  Vectors: ${stats.tensors.rowCount.toLocaleString()}`);
    console.log('');

    console.log('==================================================');
    console.log('  SETUP COMPLETE');
    console.log('==================================================');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Run: pnpm --filter @jade/vendure-backend run ska:sync-vectors');
    console.log('  2. This will populate vectors from PostgreSQL atoms');
    console.log('');

  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);
