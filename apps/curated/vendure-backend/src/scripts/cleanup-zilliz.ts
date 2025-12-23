/**
 * Cleanup old Zilliz collections
 * Drops unused collections to make room for SKA
 */

import { config } from 'dotenv';
config();

import { createSKAZillizClient } from '../config/zilliz-ska';

// Collections to remove (old/unused)
const COLLECTIONS_TO_DROP = [
  'pangaea_knowledge_atoms',
  'skincare_atoms_792d',
  'knowledge_atoms_792d',
  'jade_products',
];

async function main() {
  console.log('Cleaning up old Zilliz collections...\n');

  const client = createSKAZillizClient();

  for (const collectionName of COLLECTIONS_TO_DROP) {
    console.log(`Dropping: ${collectionName}...`);

    try {
      const has = await client.hasCollection({ collection_name: collectionName });
      if (has.value) {
        await client.dropCollection({ collection_name: collectionName });
        console.log(`  ✓ Dropped`);
      } else {
        console.log(`  - Not found (skipping)`);
      }
    } catch (error) {
      console.log(`  ✗ Error:`, error);
    }
  }

  // List remaining collections
  console.log('\nRemaining collections:');
  const collections = await client.listCollections();
  for (const c of collections.data) {
    console.log(`  - ${c.name}`);
  }

  console.log(`\nAvailable slots: ${5 - collections.data.length}`);
}

main().catch(console.error);
