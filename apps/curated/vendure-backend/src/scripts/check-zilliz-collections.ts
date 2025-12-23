/**
 * Check Zilliz Collections
 * Lists all existing collections and their stats
 */

import { config } from 'dotenv';
config();

import { createSKAZillizClient } from '../config/zilliz-ska';

async function main() {
  console.log('Checking Zilliz collections...\n');

  const client = createSKAZillizClient();

  // List all collections
  const collections = await client.listCollections();
  console.log(`Found ${collections.data.length} collections:\n`);

  for (const collection of collections.data) {
    console.log(`  - ${collection.name}`);

    // Get stats
    try {
      const stats = await client.getCollectionStatistics({
        collection_name: collection.name,
      });
      console.log(`    Rows: ${stats.data.row_count}`);
    } catch (e) {
      console.log(`    (unable to get stats)`);
    }
  }

  console.log('\nCollection limit: 5 (free tier)');
  console.log(`Available slots: ${5 - collections.data.length}`);
}

main().catch(console.error);
