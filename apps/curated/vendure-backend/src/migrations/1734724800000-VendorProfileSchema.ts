/**
 * Migration: Vendor Profile Schema
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.1: Vendor Profile Schema (Task A.1.10)
 *
 * Creates tables for vendor profiles and certifications:
 * - vendor_profile: Stores brand identity, visual assets, business info
 * - vendor_certification: Stores certifications requiring verification
 * - vendor_profile_values: Junction table for many-to-many values relationship
 *
 * Note: This migration creates the foundation for vendor-facing features
 * supporting marketing claims around brand profile control and values-based discovery.
 */

import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class VendorProfileSchema1734724800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ──────────────────────────────────────────────────────────────
    // 1. CREATE VENDOR_PROFILE TABLE
    // ──────────────────────────────────────────────────────────────
    await queryRunner.createTable(
      new Table({
        schema: 'jade',
        name: 'vendor_profile',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          // Vendor Reference
          {
            name: 'vendorId',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
            comment: 'FK to Vendure Seller ID',
          },
          // Brand Identity
          {
            name: 'brandName',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'tagline',
            type: 'varchar',
            length: '200',
            isNullable: true,
          },
          {
            name: 'founderStory',
            type: 'text',
            isNullable: true,
            comment: 'Rich text, supports markdown, 2000 char limit',
          },
          {
            name: 'missionStatement',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'brandVideoUrl',
            type: 'varchar',
            length: '500',
            isNullable: true,
            comment: 'YouTube/Vimeo embed URL',
          },
          // Visual Identity
          {
            name: 'logoUrl',
            type: 'varchar',
            length: '500',
            isNullable: true,
            comment: 'S3/CDN URL, recommended 400x400px',
          },
          {
            name: 'heroImageUrl',
            type: 'varchar',
            length: '500',
            isNullable: true,
            comment: 'S3/CDN URL, recommended 1920x600px',
          },
          {
            name: 'brandColorPrimary',
            type: 'varchar',
            length: '7',
            isNullable: true,
            comment: 'Hex color code',
          },
          {
            name: 'brandColorSecondary',
            type: 'varchar',
            length: '7',
            isNullable: true,
            comment: 'Hex color code',
          },
          {
            name: 'galleryImages',
            type: 'text',
            isNullable: true,
            comment: 'Comma-separated URLs, max 10 images',
          },
          // Contact & Links
          {
            name: 'websiteUrl',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'socialLinks',
            type: 'jsonb',
            isNullable: true,
            comment: '{instagram, facebook, tiktok, linkedin}',
          },
          // Business Info
          {
            name: 'foundedYear',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'headquarters',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: 'City, State/Country',
          },
          {
            name: 'teamSize',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: 'Enum: solo, 2-10, 11-50, 51-200, 200+',
          },
          // Profile Health
          {
            name: 'completenessScore',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: '0-100, calculated based on filled fields',
          },
          // Timestamps
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      'jade.vendor_profile',
      new TableIndex({
        name: 'idx_vendor_profile_vendor_id',
        columnNames: ['vendorId'],
      }),
    );

    // ──────────────────────────────────────────────────────────────
    // 2. CREATE VENDOR_CERTIFICATION TABLE
    // ──────────────────────────────────────────────────────────────
    await queryRunner.createTable(
      new Table({
        schema: 'jade',
        name: 'vendor_certification',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          // Vendor Relationship
          {
            name: 'vendor_profile_id',
            type: 'uuid',
            isNullable: false,
            comment: 'FK to vendor_profile',
          },
          {
            name: 'vendorProfileId',
            type: 'uuid',
            isNullable: false,
          },
          // Certification Details
          {
            name: 'type',
            type: 'varchar',
            length: '50',
            isNullable: false,
            comment: 'Enum: usda_organic, leaping_bunny, b_corp, etc.',
          },
          {
            name: 'certificateNumber',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'issuingBody',
            type: 'varchar',
            length: '255',
            isNullable: false,
            comment: 'Populated from metadata: "USDA", "Leaping Bunny Program", etc.',
          },
          {
            name: 'expirationDate',
            type: 'date',
            isNullable: true,
          },
          // Verification Workflow
          {
            name: 'verificationStatus',
            type: 'varchar',
            length: '20',
            default: "'pending'",
            isNullable: false,
            comment: 'Enum: pending, under_review, verified, rejected, expired',
          },
          {
            name: 'documentUrl',
            type: 'varchar',
            length: '500',
            isNullable: true,
            comment: 'S3 URL for uploaded proof (PDF/JPG/PNG, max 10MB)',
          },
          {
            name: 'verifiedAt',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'verifiedBy',
            type: 'uuid',
            isNullable: true,
            comment: 'FK to admin users (to be created in admin phase)',
          },
          {
            name: 'verifierName',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: 'Audit trail: name of reviewer',
          },
          {
            name: 'rejectionReason',
            type: 'text',
            isNullable: true,
          },
          // SLA Tracking
          {
            name: 'slaDeadline',
            type: 'timestamptz',
            isNullable: true,
            comment: 'Submission + 3 business days',
          },
          // Timestamps
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      'jade.vendor_certification',
      new TableIndex({
        name: 'idx_vendor_cert_profile_id',
        columnNames: ['vendor_profile_id'],
      }),
    );

    await queryRunner.createIndex(
      'jade.vendor_certification',
      new TableIndex({
        name: 'idx_vendor_cert_type',
        columnNames: ['type'],
      }),
    );

    await queryRunner.createIndex(
      'jade.vendor_certification',
      new TableIndex({
        name: 'idx_vendor_cert_status',
        columnNames: ['verificationStatus'],
      }),
    );

    // Create foreign key
    await queryRunner.createForeignKey(
      'jade.vendor_certification',
      new TableForeignKey({
        name: 'fk_vendor_cert_profile',
        columnNames: ['vendor_profile_id'],
        referencedTableName: 'vendor_profile',
        referencedSchema: 'jade',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // ──────────────────────────────────────────────────────────────
    // 3. CREATE VENDOR_PROFILE_VALUES JUNCTION TABLE (Task A.1.6)
    // ──────────────────────────────────────────────────────────────
    await queryRunner.createTable(
      new Table({
        schema: 'jade',
        name: 'vendor_profile_values',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'vendor_profile_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'value',
            type: 'varchar',
            length: '50',
            isNullable: false,
            comment: 'Enum: clean_beauty, vegan, woman_founded, etc. (25 total values)',
          },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create indexes for junction table
    await queryRunner.createIndex(
      'jade.vendor_profile_values',
      new TableIndex({
        name: 'idx_vendor_values_profile_id',
        columnNames: ['vendor_profile_id'],
      }),
    );

    await queryRunner.createIndex(
      'jade.vendor_profile_values',
      new TableIndex({
        name: 'idx_vendor_values_value',
        columnNames: ['value'],
      }),
    );

    // Unique constraint: one value per profile
    await queryRunner.createIndex(
      'jade.vendor_profile_values',
      new TableIndex({
        name: 'idx_vendor_values_unique',
        columnNames: ['vendor_profile_id', 'value'],
        isUnique: true,
      }),
    );

    // Create foreign key
    await queryRunner.createForeignKey(
      'jade.vendor_profile_values',
      new TableForeignKey({
        name: 'fk_vendor_values_profile',
        columnNames: ['vendor_profile_id'],
        referencedTableName: 'vendor_profile',
        referencedSchema: 'jade',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order (handle FK constraints)
    await queryRunner.dropTable('jade.vendor_profile_values', true);
    await queryRunner.dropTable('jade.vendor_certification', true);
    await queryRunner.dropTable('jade.vendor_profile', true);
  }
}
