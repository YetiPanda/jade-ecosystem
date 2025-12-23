import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Update Vendor Application Enum Values to Uppercase
 *
 * Converts enum values in vendor_application table from lowercase/snake_case to UPPERCASE
 * to match GraphQL schema expectations.
 */
export class UpdateVendorApplicationEnums1734811700000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update riskLevel (low → LOW, medium → MEDIUM, etc.)
    await queryRunner.query(`
      UPDATE jade.vendor_application
      SET "riskLevel" = UPPER("riskLevel")
      WHERE "riskLevel" IS NOT NULL;
    `);

    // Update values array (simple-array stored as comma-separated string)
    // Convert 'clean_beauty,organic,vegan' → 'CLEAN_BEAUTY,ORGANIC,VEGAN'
    await queryRunner.query(`
      UPDATE jade.vendor_application
      SET "values" = UPPER("values")
      WHERE "values" IS NOT NULL AND "values" != '';
    `);

    // Update certifications array (simple-array stored as comma-separated string)
    await queryRunner.query(`
      UPDATE jade.vendor_application
      SET "certifications" = UPPER("certifications")
      WHERE "certifications" IS NOT NULL AND "certifications" != '';
    `);

    console.log('Updated vendor_application enum values to uppercase');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert to lowercase
    await queryRunner.query(`
      UPDATE jade.vendor_application
      SET "riskLevel" = LOWER("riskLevel")
      WHERE "riskLevel" IS NOT NULL;
    `);

    await queryRunner.query(`
      UPDATE jade.vendor_application
      SET "values" = LOWER("values")
      WHERE "values" IS NOT NULL AND "values" != '';
    `);

    await queryRunner.query(`
      UPDATE jade.vendor_application
      SET "certifications" = LOWER("certifications")
      WHERE "certifications" IS NOT NULL AND "certifications" != '';
    `);

    console.log('Reverted vendor_application enum values to lowercase');
  }
}
