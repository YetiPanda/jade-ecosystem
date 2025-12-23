/**
 * Initialize Zilliz Cloud Collection
 *
 * Run with: pnpm tsx scripts/init-zilliz.ts
 */

import {
  checkZillizHealth,
  initializeProductCollection,
  zillizClient,
} from '../src/config/zilliz';

async function main() {
  console.log('🚀 Initializing Zilliz Cloud for JADE Marketplace\n');

  try {
    // Step 1: Check connection
    console.log('📡 Step 1: Testing connection to Zilliz Cloud...');
    const isHealthy = await checkZillizHealth();

    if (!isHealthy) {
      throw new Error('Zilliz Cloud connection failed');
    }
    console.log('✓ Connection successful\n');

    // Step 2: Initialize collection
    console.log('📦 Step 2: Initializing product collection...');
    await initializeProductCollection();
    console.log('✓ Product collection ready\n');

    // Step 3: Verify collection
    console.log('🔍 Step 3: Verifying collection setup...');
    const collectionInfo = await zillizClient.describeCollection({
      collection_name: 'jade_products',
    });

    console.log('Collection Details:');
    console.log(`  Name: ${collectionInfo.collection_name}`);
    console.log(`  Description: ${collectionInfo.description || 'N/A'}`);
    console.log(`  Fields: ${collectionInfo.schema?.fields?.length || 'N/A'}`);
    console.log(`  Auto ID: ${collectionInfo.autoID}`);
    console.log();

    // List all fields
    if (collectionInfo.schema?.fields) {
      console.log('📋 Collection Schema:');
      collectionInfo.schema.fields.forEach((field: any, index: number) => {
        console.log(`  ${index + 1}. ${field.name}`);
        console.log(`     Type: ${field.data_type}`);
        if (field.is_primary_key) console.log(`     Primary Key: true`);
        if (field.dim) console.log(`     Dimensions: ${field.dim}`);
      });
      console.log();
    }

    // Step 4: Check indexes
    console.log('🔎 Step 4: Checking indexes...');
    const indexes = await zillizClient.describeIndex({
      collection_name: 'jade_products',
      field_name: 'tensor_embedding',
    });
    console.log('  Tensor Index:', indexes);

    const semanticIndexes = await zillizClient.describeIndex({
      collection_name: 'jade_products',
      field_name: 'semantic_embedding',
    });
    console.log('  Semantic Index:', semanticIndexes);
    console.log();

    // Step 5: Get collection stats
    console.log('📊 Step 5: Collection Statistics...');
    const stats = await zillizClient.getCollectionStatistics({
      collection_name: 'jade_products',
    });
    console.log('  Row Count:', stats.data.row_count || 0);
    console.log();

    console.log('✅ Zilliz Cloud initialization complete!\n');
    console.log('🎯 Next Steps:');
    console.log('  1. Add products to PostgreSQL taxonomy tables');
    console.log('  2. Run embedding indexer to populate vector database');
    console.log('  3. Test semantic search functionality\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Initialization failed:', error);
    console.error('\nTroubleshooting:');
    console.error('  1. Check ZILLIZ_ENDPOINT and ZILLIZ_TOKEN in .env');
    console.error('  2. Verify Zilliz Cloud cluster is running');
    console.error('  3. Ensure firewall allows connection to Zilliz Cloud\n');
    process.exit(1);
  }
}

main();
