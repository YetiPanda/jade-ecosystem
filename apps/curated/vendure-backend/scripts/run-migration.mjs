/**
 * Simple migration runner using pg directly
 * Run with: node scripts/run-migration.mjs
 */

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Client } = pg;

async function runMigration() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'jade_marketplace',
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✓ Database connected\n');

    // Read SQL file
    const sqlPath = path.join(__dirname, '../sql/003-product-taxonomy.sql');
    console.log(`📝 Reading SQL from: ${sqlPath}\n`);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Execute the entire SQL script
    console.log('⚙️  Executing migration...\n');
    await client.query(sql);

    console.log('\n✅ Migration completed successfully!\n');

    // Verify with counts
    console.log('📊 Verification:');

    const categoryResult = await client.query('SELECT COUNT(*) as count FROM jade.product_category');
    console.log(`  Categories: ${categoryResult.rows[0].count}`);

    const functionResult = await client.query('SELECT COUNT(*) as count FROM jade.product_function');
    console.log(`  Functions: ${functionResult.rows[0].count}`);

    const concernResult = await client.query('SELECT COUNT(*) as count FROM jade.skin_concern');
    console.log(`  Skin Concerns: ${concernResult.rows[0].count}`);

    const formatResult = await client.query('SELECT COUNT(*) as count FROM jade.product_format');
    console.log(`  Product Formats: ${formatResult.rows[0].count}`);

    const areaResult = await client.query('SELECT COUNT(*) as count FROM jade.target_area');
    console.log(`  Target Areas: ${areaResult.rows[0].count}`);

    const regionResult = await client.query('SELECT COUNT(*) as count FROM jade.product_region');
    console.log(`  Regions: ${regionResult.rows[0].count}\n`);

    // Show sample categories
    const categories = await client.query('SELECT name, seo_slug, level FROM jade.product_category ORDER BY display_order LIMIT 10');
    console.log('📂 Sample Categories:');
    categories.rows.forEach(cat => {
      console.log(`  ${cat.level === 1 ? '📁' : '  📄'} ${cat.name} (${cat.seo_slug})`);
    });

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);

    // Check if tables already exist
    if (error.message.includes('already exists')) {
      console.log('\n⚠️  Tables already exist. Migration may have been run previously.');
      console.log('   If you need to re-run, drop the tables first or modify the migration.\n');
    }

    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Database connection closed');
  }
}

runMigration();
