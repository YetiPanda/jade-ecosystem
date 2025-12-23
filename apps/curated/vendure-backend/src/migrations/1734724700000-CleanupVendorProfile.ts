import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanupVendorProfile1734724700000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop vendor_profile table if it exists
    // This fixes the issue where the table was created with incorrect schema
    await queryRunner.query(`DROP TABLE IF EXISTS jade.vendor_profile CASCADE`);
    
    console.log('Dropped vendor_profile table to allow clean recreation');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // No-op - the next migration will recreate the table
    console.log('Cleanup migration rollback - no action needed');
  }
}
