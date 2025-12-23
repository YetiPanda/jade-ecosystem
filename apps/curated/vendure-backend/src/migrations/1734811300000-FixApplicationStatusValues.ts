import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixApplicationStatusValues1734811300000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Update all existing application status values to uppercase
    await queryRunner.query(`
      UPDATE jade.vendor_application 
      SET status = UPPER(status)
      WHERE status IN ('submitted', 'under_review', 'additional_info_requested', 'approved', 'conditionally_approved', 'rejected', 'withdrawn');
    `);
    
    console.log('Updated application status values to uppercase');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert to lowercase
    await queryRunner.query(`
      UPDATE jade.vendor_application 
      SET status = LOWER(status)
      WHERE status IN ('SUBMITTED', 'UNDER_REVIEW', 'ADDITIONAL_INFO_REQUESTED', 'APPROVED', 'CONDITIONALLY_APPROVED', 'REJECTED', 'WITHDRAWN');
    `);
    
    console.log('Reverted application status values to lowercase');
  }
}
