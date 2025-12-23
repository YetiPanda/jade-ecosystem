import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Analytics Schema Migration
 *
 * Adds analytics-related columns to client and appointment tables:
 * - Client: skin_type, skin_concerns, acquisition_channel, total_spent, visit_count
 * - Appointment: spa_organization_id, service_name, service_price, duration_minutes, completed_at, marketing_channel
 */
export class AnalyticsSchema1733860800000 implements MigrationInterface {
  name = 'AnalyticsSchema1733860800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add analytics columns to client table
    await queryRunner.query(`
      ALTER TABLE jade.client
      ADD COLUMN IF NOT EXISTS skin_type VARCHAR(50),
      ADD COLUMN IF NOT EXISTS skin_concerns TEXT[] DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS acquisition_channel VARCHAR(50),
      ADD COLUMN IF NOT EXISTS total_spent INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS visit_count INTEGER DEFAULT 0
    `);

    // Add analytics columns to appointment table
    await queryRunner.query(`
      ALTER TABLE jade.appointment
      ADD COLUMN IF NOT EXISTS spa_organization_id UUID,
      ADD COLUMN IF NOT EXISTS service_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS service_price INTEGER,
      ADD COLUMN IF NOT EXISTS duration_minutes INTEGER,
      ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS marketing_channel VARCHAR(50)
    `);

    // Add foreign key for spa_organization_id in appointment (if not exists)
    await queryRunner.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'fk_appointment_spa_org'
        ) THEN
          ALTER TABLE jade.appointment
          ADD CONSTRAINT fk_appointment_spa_org
          FOREIGN KEY (spa_organization_id) REFERENCES jade.spa_organization(id) ON DELETE SET NULL;
        END IF;
      END $$;
    `);

    // Create indexes for analytics queries
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_client_acquisition_channel ON jade.client(acquisition_channel);
      CREATE INDEX IF NOT EXISTS idx_client_skin_type ON jade.client(skin_type);
      CREATE INDEX IF NOT EXISTS idx_client_total_spent ON jade.client(total_spent);
      CREATE INDEX IF NOT EXISTS idx_appointment_marketing_channel ON jade.appointment(marketing_channel);
      CREATE INDEX IF NOT EXISTS idx_appointment_completed_at ON jade.appointment(completed_at);
      CREATE INDEX IF NOT EXISTS idx_appointment_spa_org ON jade.appointment(spa_organization_id);
    `);

    console.log('✓ Analytics schema columns added to client and appointment tables');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove indexes
    await queryRunner.query(`
      DROP INDEX IF EXISTS jade.idx_client_acquisition_channel;
      DROP INDEX IF EXISTS jade.idx_client_skin_type;
      DROP INDEX IF EXISTS jade.idx_client_total_spent;
      DROP INDEX IF EXISTS jade.idx_appointment_marketing_channel;
      DROP INDEX IF EXISTS jade.idx_appointment_completed_at;
      DROP INDEX IF EXISTS jade.idx_appointment_spa_org;
    `);

    // Remove foreign key constraint
    await queryRunner.query(`
      ALTER TABLE jade.appointment DROP CONSTRAINT IF EXISTS fk_appointment_spa_org;
    `);

    // Remove columns from appointment table
    await queryRunner.query(`
      ALTER TABLE jade.appointment
      DROP COLUMN IF EXISTS spa_organization_id,
      DROP COLUMN IF EXISTS service_name,
      DROP COLUMN IF EXISTS service_price,
      DROP COLUMN IF EXISTS duration_minutes,
      DROP COLUMN IF EXISTS completed_at,
      DROP COLUMN IF EXISTS marketing_channel
    `);

    // Remove columns from client table
    await queryRunner.query(`
      ALTER TABLE jade.client
      DROP COLUMN IF EXISTS skin_type,
      DROP COLUMN IF EXISTS skin_concerns,
      DROP COLUMN IF EXISTS acquisition_channel,
      DROP COLUMN IF EXISTS total_spent,
      DROP COLUMN IF EXISTS visit_count
    `);

    console.log('✓ Analytics schema columns removed');
  }
}
