/**
 * Seed Skincare Products from RDF Taxonomy
 *
 * Seeds skincare products to Zilliz for semantic search.
 * Products are loaded from the skincare-taxonomy.json data file.
 *
 * Usage:
 *   pnpm --filter @jade/vendure-backend skincare:seed
 *   pnpm --filter @jade/vendure-backend skincare:seed --drop  # Drop and recreate
 */

import { config } from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
config();

// Import Zilliz utilities
import {
  getSkincareZillizClient,
  initializeSkincareCollection,
  dropSkincareCollection,
  SKINCARE_COLLECTION,
  generateSearchText,
} from '../config/zilliz-skincare';

interface SkincareProduct {
  id?: string;
  name: string;
  brand: string;
  category: string;
  subCategory: string;
  functionalBenefits: string[];
  activeIngredients: string[];
  skinTypes: string[];
  concerns: string[];
  priceTier: string;
  volume: string;
  texture: string;
  routineStep: string;
  applicationMethod: string;
  useFrequency: string;
  fragranceFree: boolean;
  vegan: boolean;
  crueltyFree: boolean;
  keyBenefits: string[];
}

interface TaxonomyData {
  metadata: {
    version: string;
    totalProducts: number;
  };
  products: SkincareProduct[];
}

/**
 * Load skincare taxonomy data from JSON
 */
function loadTaxonomyData(): TaxonomyData {
  const dataPath = path.join(__dirname, '../data/skincare-taxonomy.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(rawData);
}

/**
 * Generate a mock 768D embedding (in production, use OpenAI or similar)
 */
function generateMockEmbedding(): number[] {
  // Create a 768-dimensional normalized vector
  const embedding = Array.from({ length: 768 }, () => Math.random() - 0.5);
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map((val) => val / magnitude);
}

/**
 * Seed products to Zilliz
 */
async function seedProductsToZilliz(products: SkincareProduct[]): Promise<number> {
  const client = getSkincareZillizClient();
  const now = Date.now();
  let seededCount = 0;

  const records = products.map((product) => {
    const productId = product.id || uuidv4();
    return {
      id: productId,
      product_name: product.name,
      brand: product.brand,
      category: product.category,
      subcategory: product.subCategory,
      skin_types: JSON.stringify(product.skinTypes),
      concerns: JSON.stringify(product.concerns),
      ingredients: JSON.stringify(product.activeIngredients),
      benefits: JSON.stringify(product.functionalBenefits),
      key_benefits: JSON.stringify(product.keyBenefits),
      price_tier: product.priceTier,
      texture: product.texture,
      routine_step: product.routineStep,
      volume: product.volume,
      fragrance_free: product.fragranceFree,
      vegan: product.vegan,
      cruelty_free: product.crueltyFree,
      search_text: generateSearchText(product),
      semantic_embedding: generateMockEmbedding(),
      created_at: now,
      updated_at: now,
    };
  });

  // Insert in batches of 100
  const batchSize = 100;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    await client.insert({
      collection_name: SKINCARE_COLLECTION,
      data: batch,
    });
    seededCount += batch.length;
    console.log(`  Inserted batch ${Math.floor(i / batchSize) + 1} (${seededCount} products)`);
  }

  // Flush to ensure data is persisted
  await client.flush({
    collection_names: [SKINCARE_COLLECTION],
  });

  return seededCount;
}

/**
 * Main seeding function
 */
async function seedSkincareProducts(): Promise<void> {
  const args = process.argv.slice(2);
  const shouldDrop = args.includes('--drop');

  console.log('🌱 Starting Skincare Products Seed (Zilliz)...\n');

  try {
    // Load taxonomy data
    console.log('1. Loading taxonomy data...');
    const data = loadTaxonomyData();
    console.log(`   ✓ Loaded ${data.products.length} products\n`);

    // Initialize Zilliz collection
    console.log('2. Initializing Zilliz collection...');
    if (shouldDrop) {
      console.log('   Dropping existing collection...');
      await dropSkincareCollection();
    }
    await initializeSkincareCollection();
    console.log('   ✓ Collection ready\n');

    // Seed products to Zilliz
    console.log('3. Seeding products to Zilliz...');
    const seededCount = await seedProductsToZilliz(data.products);
    console.log(`   ✓ Seeded ${seededCount} products to Zilliz\n`);

    // Print summary
    console.log('═══════════════════════════════════════');
    console.log('✅ Skincare Products Seed Complete!');
    console.log('═══════════════════════════════════════');
    console.log(`Products seeded: ${seededCount}`);
    console.log(`Categories: Cleansers, Treatments, Moisturizers, Mists & Toners, Masks`);
    console.log(`\nTo search products:`);
    console.log(`  GraphQL: searchSkincareProducts(query: "vitamin C serum")`);
    console.log(`  Or use the semantic search service`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run the seeder
seedSkincareProducts();
