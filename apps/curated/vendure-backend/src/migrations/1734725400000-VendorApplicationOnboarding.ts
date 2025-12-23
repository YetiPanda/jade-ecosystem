/**
 * Migration: Vendor Application & Onboarding Schema
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.2: Application & Onboarding Schema (Task A.2.7)
 *
 * Creates tables for vendor application review and onboarding tracking:
 * - vendor_application: Stores vendor applications with 3-day SLA tracking
 * - vendor_onboarding: Tracks onboarding progress after approval
 * - onboarding_step: Individual onboarding checklist items (8 steps)
 *
 * Marketing claims supported:
 * - "~3 Day Application Review" - SLA tracking in vendor_application
 * - "2 Weeks to First Order" - Onboarding checklist with target completion date
 */

import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class VendorApplicationOnboarding1734725400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ──────────────────────────────────────────────────────────────
    // 1. CREATE VENDOR_APPLICATION TABLE
    // ──────────────────────────────────────────────────────────────
    await queryRunner.createTable(
      new Table({
        schema: 'jade',
        name: 'vendor_application',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          // Application Status
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'submitted'",
            isNullable: false,
            comment: 'Enum: submitted, under_review, additional_info_requested, approved, conditionally_approved, rejected, withdrawn',
          },
          // Contact Information
          {
            name: 'contactFirstName',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'contactLastName',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'contactEmail',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'contactPhone',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'contactRole',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          // Company Information
          {
            name: 'brandName',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'legalName',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'website',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'yearFounded',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'headquarters',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'employeeCount',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'annualRevenue',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          // Product Information
          {
            name: 'productCategories',
            type: 'text',
            isNullable: false,
            comment: 'Comma-separated list',
          },
          {
            name: 'skuCount',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'priceRange',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'targetMarket',
            type: 'text',
            isNullable: false,
            comment: 'Comma-separated list',
          },
          {
            name: 'currentDistribution',
            type: 'text',
            isNullable: true,
            comment: 'Comma-separated list',
          },
          // Values & Certifications
          {
            name: 'values',
            type: 'text',
            isNullable: false,
            comment: 'Comma-separated vendor values',
          },
          {
            name: 'certifications',
            type: 'text',
            isNullable: true,
            comment: 'Comma-separated certification types claimed',
          },
          // Why Jade
          {
            name: 'whyJade',
            type: 'text',
            isNullable: false,
          },
          // Documents
          {
            name: 'documents',
            type: 'jsonb',
            isNullable: true,
            comment: '{productCatalogUrl, lineSheetUrl, insuranceCertificateUrl, businessLicenseUrl}',
          },
          // Review & Decision
          {
            name: 'assignedReviewerId',
            type: 'uuid',
            isNullable: true,
            comment: 'FK to admin users (to be created in admin phase)',
          },
          {
            name: 'assignedReviewerName',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'riskLevel',
            type: 'varchar',
            length: '20',
            isNullable: true,
            comment: 'Enum: low, medium, high, critical',
          },
          {
            name: 'riskAssessment',
            type: 'jsonb',
            isNullable: true,
            comment: '{overallScore, factors: [{category, level, description}]}',
          },
          {
            name: 'decisionNote',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'rejectionReason',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'approvalConditions',
            type: 'text',
            isNullable: true,
            comment: 'Comma-separated conditions for conditional approval',
          },
          // SLA Tracking
          {
            name: 'slaDeadline',
            type: 'timestamptz',
            isNullable: true,
            comment: 'Submission + 3 business days',
          },
          {
            name: 'decidedAt',
            type: 'timestamptz',
            isNullable: true,
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

    // Create indexes for vendor_application
    await queryRunner.createIndex(
      'jade.vendor_application',
      new TableIndex({
        name: 'idx_vendor_app_status',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'jade.vendor_application',
      new TableIndex({
        name: 'idx_vendor_app_email',
        columnNames: ['contactEmail'],
      }),
    );

    await queryRunner.createIndex(
      'jade.vendor_application',
      new TableIndex({
        name: 'idx_vendor_app_brand_name',
        columnNames: ['brandName'],
      }),
    );

    await queryRunner.createIndex(
      'jade.vendor_application',
      new TableIndex({
        name: 'idx_vendor_app_assignee',
        columnNames: ['assignedReviewerId'],
      }),
    );

    await queryRunner.createIndex(
      'jade.vendor_application',
      new TableIndex({
        name: 'idx_vendor_app_sla_deadline',
        columnNames: ['slaDeadline'],
      }),
    );

    // ──────────────────────────────────────────────────────────────
    // 2. CREATE VENDOR_ONBOARDING TABLE
    // ──────────────────────────────────────────────────────────────
    await queryRunner.createTable(
      new Table({
        schema: 'jade',
        name: 'vendor_onboarding',
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
            isNullable: true,
            isUnique: true,
            comment: 'FK to Vendure Seller ID (set when vendor profile created)',
          },
          // Application Link
          {
            name: 'application_id',
            type: 'uuid',
            isNullable: false,
            comment: 'FK to vendor_application',
          },
          {
            name: 'applicationId',
            type: 'uuid',
            isNullable: false,
          },
          // Progress Tracking
          {
            name: 'completedSteps',
            type: 'int',
            default: 0,
            isNullable: false,
          },
          {
            name: 'totalSteps',
            type: 'int',
            default: 8,
            isNullable: false,
          },
          {
            name: 'requiredStepsRemaining',
            type: 'int',
            default: 6,
            isNullable: false,
          },
          {
            name: 'percentComplete',
            type: 'int',
            default: 0,
            isNullable: false,
          },
          // Support
          {
            name: 'successManagerName',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'successManagerEmail',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          // Timeline
          {
            name: 'startedAt',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'targetCompletionDate',
            type: 'timestamptz',
            isNullable: true,
            comment: 'startedAt + 2 weeks',
          },
          {
            name: 'completedAt',
            type: 'timestamptz',
            isNullable: true,
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

    // Create indexes for vendor_onboarding
    await queryRunner.createIndex(
      'jade.vendor_onboarding',
      new TableIndex({
        name: 'idx_vendor_onboarding_vendor_id',
        columnNames: ['vendorId'],
      }),
    );

    // Create foreign key
    await queryRunner.createForeignKey(
      'jade.vendor_onboarding',
      new TableForeignKey({
        name: 'fk_vendor_onboarding_application',
        columnNames: ['application_id'],
        referencedTableName: 'vendor_application',
        referencedSchema: 'jade',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // ──────────────────────────────────────────────────────────────
    // 3. CREATE ONBOARDING_STEP TABLE
    // ──────────────────────────────────────────────────────────────
    await queryRunner.createTable(
      new Table({
        schema: 'jade',
        name: 'onboarding_step',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          // Onboarding Link
          {
            name: 'onboarding_id',
            type: 'uuid',
            isNullable: false,
            comment: 'FK to vendor_onboarding',
          },
          {
            name: 'onboardingId',
            type: 'uuid',
            isNullable: false,
          },
          // Step Details
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'order',
            type: 'int',
            isNullable: false,
            comment: '1-8',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '20',
            default: "'pending'",
            isNullable: false,
            comment: 'Enum: pending, in_progress, completed, skipped',
          },
          {
            name: 'required',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'helpArticleUrl',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          // Completion Tracking
          {
            name: 'completedAt',
            type: 'timestamptz',
            isNullable: true,
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

    // Create indexes for onboarding_step
    await queryRunner.createIndex(
      'jade.onboarding_step',
      new TableIndex({
        name: 'idx_onboarding_step_onboarding_id',
        columnNames: ['onboarding_id'],
      }),
    );

    await queryRunner.createIndex(
      'jade.onboarding_step',
      new TableIndex({
        name: 'idx_onboarding_step_status',
        columnNames: ['status'],
      }),
    );

    // Create foreign key
    await queryRunner.createForeignKey(
      'jade.onboarding_step',
      new TableForeignKey({
        name: 'fk_onboarding_step_onboarding',
        columnNames: ['onboarding_id'],
        referencedTableName: 'vendor_onboarding',
        referencedSchema: 'jade',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order (handle FK constraints)
    await queryRunner.dropTable('jade.onboarding_step', true);
    await queryRunner.dropTable('jade.vendor_onboarding', true);
    await queryRunner.dropTable('jade.vendor_application', true);
  }
}
