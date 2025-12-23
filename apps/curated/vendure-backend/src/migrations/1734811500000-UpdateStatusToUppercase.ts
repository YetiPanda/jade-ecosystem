import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateStatusToUppercase1734811500000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update all status values to uppercase (column is VARCHAR, not enum)
    await queryRunner.query(`
      UPDATE jade.vendor_application
      SET status = UPPER(status);
    `);

    console.log('Updated all application status values to uppercase');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert to lowercase
    await queryRunner.query(`
      UPDATE jade.vendor_application
      SET status = LOWER(status);
    `);

    console.log('Reverted application status values to lowercase');
  }
}
