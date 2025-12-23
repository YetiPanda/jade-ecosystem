/**
 * Run Analytics Schema Migration
 *
 * Adds analytics-related columns to client and appointment tables
 */

import { config } from 'dotenv';
config();

import { AppDataSource } from '../config/database';

async function runMigration(): Promise<void> {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  JADE - Running Analytics Schema Migration');
  console.log('═══════════════════════════════════════════════════════════════');

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✓ Database connected');
    }

    // Add analytics columns to client table
    await AppDataSource.query(`
      ALTER TABLE jade.client
      ADD COLUMN IF NOT EXISTS skin_type VARCHAR(50),
      ADD COLUMN IF NOT EXISTS skin_concerns TEXT[] DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS acquisition_channel VARCHAR(50),
      ADD COLUMN IF NOT EXISTS total_spent INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS visit_count INTEGER DEFAULT 0
    `);
    console.log('✓ Client table updated with analytics columns');

    // Add analytics columns to appointment table
    await AppDataSource.query(`
      ALTER TABLE jade.appointment
      ADD COLUMN IF NOT EXISTS spa_organization_id UUID,
      ADD COLUMN IF NOT EXISTS service_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS service_price INTEGER,
      ADD COLUMN IF NOT EXISTS duration_minutes INTEGER,
      ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS marketing_channel VARCHAR(50)
    `);
    console.log('✓ Appointment table updated with analytics columns');

    // Create indexes for analytics queries
    await AppDataSource.query(`
      CREATE INDEX IF NOT EXISTS idx_client_acquisition_channel ON jade.client(acquisition_channel);
      CREATE INDEX IF NOT EXISTS idx_client_skin_type ON jade.client(skin_type);
      CREATE INDEX IF NOT EXISTS idx_client_total_spent ON jade.client(total_spent);
      CREATE INDEX IF NOT EXISTS idx_appointment_marketing_channel ON jade.appointment(marketing_channel);
      CREATE INDEX IF NOT EXISTS idx_appointment_completed_at ON jade.appointment(completed_at);
      CREATE INDEX IF NOT EXISTS idx_appointment_spa_org ON jade.appointment(spa_organization_id);
    `);
    console.log('✓ Analytics indexes created');

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  ✅ Analytics schema migration complete!');
    console.log('═══════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

runMigration().catch(console.error);
