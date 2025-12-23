/**
 * Setup script for Zilliz Cloud collections
 *
 * Run this script to:
 * 1. Test connection to Zilliz Cloud
 * 2. Create product tensors collection (13-D vectors)
 * 3. Create product embeddings collection (792-D vectors)
 * 4. Create indexes for efficient search
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import {
  initializeZillizClient,
  checkZillizHealth,
  closeZillizClient,
} from './client';
import {
  createProductTensorsCollection,
  PRODUCT_TENSORS_COLLECTION,
} from './collections/product-tensors';
import {
  createProductEmbeddingsCollection,
  PRODUCT_EMBEDDINGS_COLLECTION,
} from './collections/product-embeddings';
import { performHealthCheck, formatHealthReport } from './health';

async function setupCollections() {
  console.log('🚀 Starting Zilliz Cloud collection setup...\n');

  try {
    // Load environment variables from backend
    const envPath = path.join(__dirname, '../../../apps/vendure-backend/.env');
    console.log(`📝 Loading environment from: ${envPath}`);
    dotenv.config({ path: envPath });

    // Initialize client
    console.log('\n🔌 Connecting to Zilliz Cloud...');
    initializeZillizClient();

    // Check connection health
    console.log('\n🏥 Performing health check...');
    const connectionHealth = await checkZillizHealth();

    if (!connectionHealth.connected) {
      console.error('❌ Connection failed:', connectionHealth.error);
      process.exit(1);
    }

    console.log('✅ Connected successfully!');
    console.log(`   Database: ${connectionHealth.database}`);
    console.log(`   Version: ${connectionHealth.version}`);

    // Create product tensors collection
    console.log(`\n📦 Creating ${PRODUCT_TENSORS_COLLECTION} collection...`);
    await createProductTensorsCollection();

    // Create product embeddings collection
    console.log(`\n📦 Creating ${PRODUCT_EMBEDDINGS_COLLECTION} collection...`);
    await createProductEmbeddingsCollection();

    // Perform final health check
    console.log('\n🔍 Verifying collection setup...');
    const healthReport = await performHealthCheck();
    console.log('\n' + formatHealthReport(healthReport));

    if (healthReport.healthy) {
      console.log('\n✅ All collections created and healthy!');
      console.log('\n📊 Summary:');
      healthReport.collections.forEach((col) => {
        console.log(`   - ${col.name}: ${col.exists ? '✅' : '❌'} ${col.loaded ? '(loaded)' : '(not loaded)'}`);
      });
    } else {
      console.error('\n⚠️ Some collections have issues. Check the health report above.');
    }

    // Close connection
    await closeZillizClient();
    console.log('\n👋 Connection closed.');

  } catch (error) {
    console.error('\n❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run setup
setupCollections();
