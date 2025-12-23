/**
 * Migration: Marketing Campaign Schema
 *
 * Feature 011: Vendor Portal MVP
 * Sprint: Marketing Analytics Integration
 *
 * Creates table for vendor marketing campaigns with performance tracking:
 * - marketing_campaign: Stores campaigns with budget, metrics, and ROAS data
 *
 * Supports Marketing Analytics dashboard with:
 * - Campaign performance tracking (impressions, clicks, conversions, revenue)
 * - Budget management and utilization monitoring
 * - ROAS calculation and optimization insights
 * - Multi-channel campaign support (EMAIL, SOCIAL, CONTENT, PAID_SEARCH, DISPLAY, AFFILIATE)
 */

import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class MarketingCampaignSchema1734812000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ──────────────────────────────────────────────────────────────
    // CREATE MARKETING_CAMPAIGN TABLE
    // ──────────────────────────────────────────────────────────────
    await queryRunner.createTable(
      new Table({
        schema: 'jade',
        name: 'marketing_campaign',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          // ──────────────────────────────────────────────────────────────
          // VENDOR RELATIONSHIP
          // ──────────────────────────────────────────────────────────────
          {
            name: 'vendorId',
            type: 'uuid',
            isNullable: false,
            comment: 'FK to Vendure Customer ID (vendor)',
          },
          // ──────────────────────────────────────────────────────────────
          // CAMPAIGN DETAILS
          // ──────────────────────────────────────────────────────────────
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'varchar',
            length: '50',
            isNullable: false,
            comment: 'Enum: EMAIL, SOCIAL, CONTENT, PAID_SEARCH, DISPLAY, AFFILIATE',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'DRAFT'",
            isNullable: false,
            comment: 'Enum: DRAFT, SCHEDULED, ACTIVE, PAUSED, COMPLETED, CANCELLED',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          // ──────────────────────────────────────────────────────────────
          // CAMPAIGN DATES
          // ──────────────────────────────────────────────────────────────
          {
            name: 'startDate',
            type: 'timestamptz',
            isNullable: false,
          },
          {
            name: 'endDate',
            type: 'timestamptz',
            isNullable: false,
          },
          // ──────────────────────────────────────────────────────────────
          // BUDGET & SPEND (in cents for precision)
          // ──────────────────────────────────────────────────────────────
          {
            name: 'budgetCents',
            type: 'int',
            isNullable: false,
            comment: 'Total budget allocated in cents',
          },
          {
            name: 'spentCents',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Amount spent so far in cents',
          },
          // ──────────────────────────────────────────────────────────────
          // PERFORMANCE METRICS
          // ──────────────────────────────────────────────────────────────
          {
            name: 'impressions',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Total ad views',
          },
          {
            name: 'clicks',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Total clicks',
          },
          {
            name: 'conversions',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Total completed purchases',
          },
          {
            name: 'revenueCents',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Total revenue generated in cents',
          },
          // ──────────────────────────────────────────────────────────────
          // CALCULATED METRICS (Stored for performance)
          // ──────────────────────────────────────────────────────────────
          {
            name: 'ctr',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 0,
            isNullable: false,
            comment: 'Click-Through Rate: (clicks / impressions) * 100',
          },
          {
            name: 'cpcCents',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Cost Per Click in cents: spent / clicks',
          },
          {
            name: 'roas',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
            isNullable: false,
            comment: 'Return on Ad Spend: revenue / spent',
          },
          {
            name: 'conversionRate',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 0,
            isNullable: false,
            comment: 'Conversion Rate: (conversions / clicks) * 100',
          },
          // ──────────────────────────────────────────────────────────────
          // AUDIENCE
          // ──────────────────────────────────────────────────────────────
          {
            name: 'audienceSize',
            type: 'int',
            isNullable: true,
            comment: 'Target audience size',
          },
          {
            name: 'audienceDetails',
            type: 'jsonb',
            isNullable: true,
            comment: 'Audience segment details: {segments: [], targeting: {}}',
          },
          // ──────────────────────────────────────────────────────────────
          // METADATA
          // ──────────────────────────────────────────────────────────────
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
            comment: 'Platform-specific data, UTM parameters, etc.',
          },
          // ──────────────────────────────────────────────────────────────
          // TIMESTAMPS
          // ──────────────────────────────────────────────────────────────
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

    // ──────────────────────────────────────────────────────────────
    // CREATE INDEXES
    // ──────────────────────────────────────────────────────────────

    // Vendor lookup - most common query
    await queryRunner.createIndex(
      'jade.marketing_campaign',
      new TableIndex({
        name: 'idx_campaign_vendor',
        columnNames: ['vendorId'],
      }),
    );

    // Status filtering
    await queryRunner.createIndex(
      'jade.marketing_campaign',
      new TableIndex({
        name: 'idx_campaign_status',
        columnNames: ['status'],
      }),
    );

    // Date range queries
    await queryRunner.createIndex(
      'jade.marketing_campaign',
      new TableIndex({
        name: 'idx_campaign_dates',
        columnNames: ['startDate', 'endDate'],
      }),
    );

    // Composite index for vendor + status (common filter combination)
    await queryRunner.createIndex(
      'jade.marketing_campaign',
      new TableIndex({
        name: 'idx_campaign_vendor_status',
        columnNames: ['vendorId', 'status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop table (indexes are dropped automatically)
    await queryRunner.dropTable('jade.marketing_campaign', true);
  }
}
