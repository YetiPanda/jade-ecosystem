/**
 * Vendor Analytics Schema Migration
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.3: Analytics Schema (Task A.3.11)
 *
 * Creates 4 tables for vendor analytics and discovery tracking:
 * 1. vendor_analytics_daily - Daily aggregated vendor metrics
 * 2. spa_vendor_relationship - Spa-vendor relationship tracking
 * 3. product_performance_daily - Product-level daily metrics
 * 4. discovery_impression - Individual impression events
 *
 * Also creates indexes for time-range queries and dashboard performance.
 */

import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class VendorAnalyticsSchema1734726000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ──────────────────────────────────────────────────────────────
    // TABLE 1: vendor_analytics_daily
    // ──────────────────────────────────────────────────────────────
    await queryRunner.createTable(
      new Table({
        schema: 'jade',
        name: 'vendor_analytics_daily',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'vendorId',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
            comment: 'The day these metrics represent (UTC)',
          },
          // Revenue Metrics
          {
            name: 'revenue',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
            isNullable: false,
            comment: 'Total revenue for this day',
          },
          {
            name: 'revenueFromNewSpas',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
            isNullable: false,
            comment: 'Revenue from new spa customers',
          },
          {
            name: 'revenueFromRepeatSpas',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
            isNullable: false,
            comment: 'Revenue from repeat spa customers',
          },
          // Order Metrics
          {
            name: 'orderCount',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Total orders placed',
          },
          {
            name: 'ordersFromNewSpas',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Orders from new spa customers',
          },
          {
            name: 'ordersFromRepeatSpas',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Orders from repeat spa customers',
          },
          {
            name: 'avgOrderValue',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
            isNullable: false,
            comment: 'Average order value for this day',
          },
          // Spa Metrics
          {
            name: 'activeSpas',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Unique spas that placed orders',
          },
          {
            name: 'newSpas',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'New spas who ordered',
          },
          {
            name: 'repeatSpas',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Spas who reordered (previously ordered)',
          },
          // Discovery Metrics
          {
            name: 'impressions',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Profile views (from any source)',
          },
          {
            name: 'impressionsFromSearch',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Views from search results',
          },
          {
            name: 'impressionsFromBrowse',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Views from category browse',
          },
          {
            name: 'impressionsFromValues',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Views from values filter',
          },
          {
            name: 'impressionsFromRecommendations',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Views from recommendations',
          },
          {
            name: 'impressionsFromDirect',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Direct profile visits',
          },
          // Engagement Metrics
          {
            name: 'catalogViews',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Clicks to product catalog',
          },
          {
            name: 'productClicks',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Individual product clicks',
          },
          {
            name: 'contactClicks',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Contact button clicks',
          },
          {
            name: 'totalTimeOnProfile',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Total seconds spent on profile (sum of all sessions)',
          },
          {
            name: 'bounces',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Number of profile visits that bounced',
          },
          // Timestamps
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create indexes for vendor_analytics_daily
    await queryRunner.createIndex(
      'jade.vendor_analytics_daily',
      new TableIndex({
        name: 'idx_analytics_vendor_date',
        columnNames: ['vendorId', 'date'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'jade.vendor_analytics_daily',
      new TableIndex({
        name: 'idx_analytics_date',
        columnNames: ['date'],
      }),
    );

    // ──────────────────────────────────────────────────────────────
    // TABLE 2: spa_vendor_relationship
    // ──────────────────────────────────────────────────────────────
    await queryRunner.createTable(
      new Table({
        schema: 'jade',
        name: 'spa_vendor_relationship',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'vendorId',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'spaId',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'spaName',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: 'Spa business name',
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'new'",
            isNullable: false,
            comment: 'Enum: active, churned, at_risk, new',
          },
          // Lifetime Metrics
          {
            name: 'lifetimeValue',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
            isNullable: false,
            comment: 'Total revenue from this spa',
          },
          {
            name: 'orderCount',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Total number of orders placed',
          },
          {
            name: 'avgOrderValue',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
            isNullable: false,
            comment: 'Average order value across all orders',
          },
          // Order Timing
          {
            name: 'firstOrderAt',
            type: 'timestamptz',
            isNullable: true,
            comment: 'First order date',
          },
          {
            name: 'lastOrderAt',
            type: 'timestamptz',
            isNullable: true,
            comment: 'Most recent order date',
          },
          {
            name: 'avgDaysBetweenOrders',
            type: 'int',
            isNullable: true,
            comment: 'Average days between orders',
          },
          {
            name: 'daysSinceLastOrder',
            type: 'int',
            isNullable: true,
            comment: 'Days since last order (used for churn risk)',
          },
          // Product Preferences
          {
            name: 'favoriteCategories',
            type: 'text',
            isNullable: true,
            comment: 'Most frequently ordered product categories (comma-separated)',
          },
          {
            name: 'topProducts',
            type: 'text',
            isNullable: true,
            comment: 'Top 5 most ordered product IDs (comma-separated)',
          },
          // Engagement Metrics
          {
            name: 'profileViews',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Number of times spa viewed vendor profile',
          },
          {
            name: 'messageCount',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Number of messages exchanged',
          },
          {
            name: 'lastMessageAt',
            type: 'timestamptz',
            isNullable: true,
            comment: 'Last message sent/received',
          },
          // Timestamps
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
            comment: 'Relationship start date',
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
            comment: 'Last update to this record',
          },
        ],
      }),
      true,
    );

    // Create indexes for spa_vendor_relationship
    await queryRunner.createIndex(
      'jade.spa_vendor_relationship',
      new TableIndex({
        name: 'idx_relationship_vendor',
        columnNames: ['vendorId'],
      }),
    );

    await queryRunner.createIndex(
      'jade.spa_vendor_relationship',
      new TableIndex({
        name: 'idx_relationship_spa',
        columnNames: ['spaId'],
      }),
    );

    await queryRunner.createIndex(
      'jade.spa_vendor_relationship',
      new TableIndex({
        name: 'idx_relationship_status',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'jade.spa_vendor_relationship',
      new TableIndex({
        name: 'idx_relationship_last_order',
        columnNames: ['lastOrderAt'],
      }),
    );

    // ──────────────────────────────────────────────────────────────
    // TABLE 3: product_performance_daily
    // ──────────────────────────────────────────────────────────────
    await queryRunner.createTable(
      new Table({
        schema: 'jade',
        name: 'product_performance_daily',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'vendorId',
            type: 'varchar',
            length: '255',
            isNullable: false,
            comment: 'Vendor who owns product',
          },
          {
            name: 'productId',
            type: 'varchar',
            length: '255',
            isNullable: false,
            comment: 'Product ID',
          },
          {
            name: 'productName',
            type: 'varchar',
            length: '500',
            isNullable: true,
            comment: 'Product name (denormalized)',
          },
          {
            name: 'productSku',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: 'Product SKU (denormalized)',
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
            comment: 'The day these metrics represent (UTC)',
          },
          // Sales Metrics
          {
            name: 'unitsSold',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Total units sold',
          },
          {
            name: 'revenue',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
            isNullable: false,
            comment: 'Total revenue from this product',
          },
          {
            name: 'orderCount',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Number of orders containing this product',
          },
          {
            name: 'uniqueSpas',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Unique spas that ordered this product',
          },
          // Engagement Metrics
          {
            name: 'views',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Product detail page views',
          },
          {
            name: 'addToCartClicks',
            type: 'int',
            default: 0,
            isNullable: false,
            comment: 'Add to cart clicks',
          },
          {
            name: 'conversionRate',
            type: 'decimal',
            precision: 5,
            scale: 2,
            isNullable: true,
            comment: 'Conversion rate (orders / views * 100)',
          },
          // Product Context
          {
            name: 'category',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: 'Product category (denormalized)',
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
            comment: 'Product price on this day',
          },
          // Timestamps
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Create indexes for product_performance_daily
    await queryRunner.createIndex(
      'jade.product_performance_daily',
      new TableIndex({
        name: 'idx_product_perf_vendor_date',
        columnNames: ['vendorId', 'date'],
      }),
    );

    await queryRunner.createIndex(
      'jade.product_performance_daily',
      new TableIndex({
        name: 'idx_product_perf_product_date',
        columnNames: ['productId', 'date'],
      }),
    );

    await queryRunner.createIndex(
      'jade.product_performance_daily',
      new TableIndex({
        name: 'idx_product_perf_date',
        columnNames: ['date'],
      }),
    );

    // ──────────────────────────────────────────────────────────────
    // TABLE 4: discovery_impression
    // ──────────────────────────────────────────────────────────────
    await queryRunner.createTable(
      new Table({
        schema: 'jade',
        name: 'discovery_impression',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          // Who & What
          {
            name: 'vendorId',
            type: 'varchar',
            length: '255',
            isNullable: false,
            comment: 'Vendor profile viewed',
          },
          {
            name: 'spaId',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: 'Spa user viewing (null if anonymous)',
          },
          {
            name: 'sessionId',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: 'Session ID for anonymous tracking',
          },
          // How They Found The Vendor
          {
            name: 'source',
            type: 'varchar',
            length: '50',
            isNullable: false,
            comment: 'Enum: search, browse, values, recommendation, direct',
          },
          {
            name: 'queryText',
            type: 'varchar',
            length: '500',
            isNullable: true,
            comment: 'Search query text (if source=search)',
          },
          {
            name: 'valuesFilters',
            type: 'text',
            isNullable: true,
            comment: 'Active values filters (comma-separated, if source=values)',
          },
          {
            name: 'categoryBrowsed',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: 'Category browsed (if source=browse)',
          },
          {
            name: 'recommendationId',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: 'Recommendation algorithm ID (if source=recommendation)',
          },
          // What They Did
          {
            name: 'action',
            type: 'varchar',
            length: '50',
            default: "'view'",
            isNullable: false,
            comment: 'Enum: view, click, catalog_view, product_click, contact_click, bounce',
          },
          {
            name: 'timeOnProfile',
            type: 'int',
            isNullable: true,
            comment: 'Seconds spent on profile (null if bounced immediately)',
          },
          {
            name: 'productClicked',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: 'Product ID clicked (if action=product_click)',
          },
          // Ranking Context
          {
            name: 'position',
            type: 'int',
            isNullable: true,
            comment: 'Position in search/browse results (1-indexed)',
          },
          {
            name: 'totalResults',
            type: 'int',
            isNullable: true,
            comment: 'Total results shown in search/browse',
          },
          // Metadata
          {
            name: 'referrer',
            type: 'varchar',
            length: '500',
            isNullable: true,
            comment: 'Referrer URL',
          },
          {
            name: 'userAgent',
            type: 'varchar',
            length: '255',
            isNullable: true,
            comment: 'User agent string',
          },
          {
            name: 'deviceType',
            type: 'varchar',
            length: '100',
            isNullable: true,
            comment: 'Device type (mobile, tablet, desktop)',
          },
          // Timestamps
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
            comment: 'When the impression occurred',
          },
        ],
      }),
      true,
    );

    // Create indexes for discovery_impression
    await queryRunner.createIndex(
      'jade.discovery_impression',
      new TableIndex({
        name: 'idx_impression_vendor_created',
        columnNames: ['vendorId', 'createdAt'],
      }),
    );

    await queryRunner.createIndex(
      'jade.discovery_impression',
      new TableIndex({
        name: 'idx_impression_spa_vendor',
        columnNames: ['spaId', 'vendorId'],
      }),
    );

    await queryRunner.createIndex(
      'jade.discovery_impression',
      new TableIndex({
        name: 'idx_impression_source',
        columnNames: ['source'],
      }),
    );

    await queryRunner.createIndex(
      'jade.discovery_impression',
      new TableIndex({
        name: 'idx_impression_query',
        columnNames: ['queryText'],
      }),
    );

    await queryRunner.createIndex(
      'jade.discovery_impression',
      new TableIndex({
        name: 'idx_impression_created',
        columnNames: ['createdAt'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order
    await queryRunner.dropTable('jade.discovery_impression', true);
    await queryRunner.dropTable('jade.product_performance_daily', true);
    await queryRunner.dropTable('jade.spa_vendor_relationship', true);
    await queryRunner.dropTable('jade.vendor_analytics_daily', true);
  }
}
