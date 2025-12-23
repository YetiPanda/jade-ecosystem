/**
 * Script to run Product Taxonomy migration
 *
 * Usage: pnpm tsx scripts/run-taxonomy-migration.ts
 */

import { initializeDatabase, AppDataSource } from '../src/config/database';
import * as fs from 'fs';
import * as path from 'path';

async function runMigration() {
  try {
    console.log('🔌 Connecting to database...');
    await initializeDatabase();
    console.log('✓ Database connected\n');

    const sqlPath = path.join(__dirname, '../sql/003-product-taxonomy.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📝 Running taxonomy migration SQL...\n');

    // Split by semicolons and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/**'));

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.length > 0) {
        try {
          console.log(`[${i + 1}/${statements.length}] Executing statement...`);
          await AppDataSource.query(statement);
        } catch (error: any) {
          // Ignore "already exists" errors (for idempotency)
          if (error.message.includes('already exists')) {
            console.log(`  ⚠️  Already exists, skipping...`);
          } else {
            throw error;
          }
        }
      }
    }

    console.log('\n✅ Taxonomy migration completed successfully!\n');

    // Verify with counts
    const categoryCount = await AppDataSource.query('SELECT COUNT(*) as count FROM jade.product_category');
    const functionCount = await AppDataSource.query('SELECT COUNT(*) as count FROM jade.product_function');
    const concernCount = await AppDataSource.query('SELECT COUNT(*) as count FROM jade.skin_concern');

    console.log('📊 Verification:');
    console.log(`  Categories: ${categoryCount[0].count}`);
    console.log(`  Functions: ${functionCount[0].count}`);
    console.log(`  Skin Concerns: ${concernCount[0].count}`);

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
