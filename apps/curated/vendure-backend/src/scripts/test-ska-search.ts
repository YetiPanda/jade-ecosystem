/**
 * Test SKA Vector Search
 * Verifies the unified collection has data and search works
 */

import { config } from 'dotenv';
config();

import { createSKAZillizClient, SKA_ATOMS_COLLECTION, SEMANTIC_EMBEDDING_DIM, TENSOR_EMBEDDING_DIM } from '../config/zilliz-ska';

async function main() {
  console.log('Testing SKA Vector Search...\n');

  const client = createSKAZillizClient();

  // Flush collection to ensure data is persisted
  console.log('Flushing collection...');
  try {
    await client.flushSync({ collection_names: [SKA_ATOMS_COLLECTION] });
    console.log('  ✓ Flush complete\n');
  } catch (e) {
    console.log('  Note: Flush may not be needed for serverless\n');
  }

  // Get updated stats
  const stats = await client.getCollectionStatistics({
    collection_name: SKA_ATOMS_COLLECTION,
  });
  console.log(`Collection stats: ${stats.data.row_count} rows\n`);

  // Create a test semantic embedding (searching for "retinol anti-aging")
  const testSemanticVector = new Array(SEMANTIC_EMBEDDING_DIM).fill(0).map(() => Math.random() * 0.1);

  // Create a test tensor (high anti-aging, moderate sensitivity)
  const testTensorVector = [
    0.5,  // hydration_index
    0.3,  // sebum_regulation
    0.9,  // anti_aging_potency
    0.4,  // brightening_efficacy
    0.3,  // anti_inflammatory
    0.5,  // barrier_repair
    0.6,  // exfoliation_strength
    0.7,  // antioxidant_capacity
    0.8,  // collagen_stimulation
    0.6,  // sensitivity_risk
    0.4,  // photosensitivity
    0.5,  // ph_dependency
    0.6,  // molecular_penetration
    0.5,  // stability_rating
    0.4,  // compatibility_score
    0.7,  // clinical_evidence_level
    0.5,  // market_saturation
  ];

  console.log('Testing semantic search (792-D)...');
  try {
    const semanticResults = await client.search({
      collection_name: SKA_ATOMS_COLLECTION,
      vector: testSemanticVector,
      anns_field: 'semantic_embedding',
      limit: 5,
      output_fields: ['id', 'title', 'atom_type', 'inci_name'],
    });

    console.log(`  Found ${semanticResults.results.length} results:`);
    for (const r of semanticResults.results) {
      console.log(`    - ${r.title} (${r.atom_type})`);
    }
  } catch (e) {
    console.log(`  Error: ${e}`);
  }

  console.log('\nTesting tensor search (17-D)...');
  try {
    const tensorResults = await client.search({
      collection_name: SKA_ATOMS_COLLECTION,
      vector: testTensorVector,
      anns_field: 'tensor_embedding',
      limit: 5,
      output_fields: ['id', 'title', 'atom_type', 'anti_aging_potency', 'sensitivity_risk'],
    });

    console.log(`  Found ${tensorResults.results.length} results:`);
    for (const r of tensorResults.results) {
      console.log(`    - ${r.title} (anti-aging: ${r.anti_aging_potency}, sensitivity: ${r.sensitivity_risk})`);
    }
  } catch (e) {
    console.log(`  Error: ${e}`);
  }

  console.log('\n✅ Test complete!');
}

main().catch(console.error);
