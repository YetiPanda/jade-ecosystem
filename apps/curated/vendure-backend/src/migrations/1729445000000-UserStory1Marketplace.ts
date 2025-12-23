import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * User Story 1: Spa Owner Product Discovery & Ordering
 *
 * This migration adds custom fields to Vendure's core entities (User, Product, Order)
 * to support the marketplace functionality:
 *
 * User Extensions:
 * - spaOrganizationId: Links user to their spa organization
 * - licenseInfo: Professional licensing information (JSONB)
 * - phoneNumber: Contact phone
 * - lastLoginAt: Last authentication timestamp
 *
 * Product Extensions:
 * - vendorId: Links product to vendor organization
 * - glanceData: Quick-view product info (JSONB)
 * - scanData: Detailed product info (JSONB)
 * - studyData: In-depth product info (JSONB)
 * - pricingTiers: Wholesale pricing tiers (JSONB)
 * - inventoryLevel: Stock quantity
 * - tensorVector: 13-D product characteristics (for AI recommendations)
 * - semanticEmbedding: 792-D text embedding (for semantic search)
 *
 * Order Extensions:
 * - spaOrganizationId: Which spa placed the order
 * - placedByUserId: User who created the order
 * - vendorOrders: Multi-vendor order splits (JSONB)
 * - shippingAddress: Delivery address (JSONB)
 * - billingAddress: Billing address (JSONB)
 * - discountAmount: Total discount in cents
 * - fulfillmentStatus: Overall order status
 * - paymentStatus: Payment processing status
 * - notes: Special instructions
 * - placedAt: Order creation timestamp
 * - fulfilledAt: Order completion timestamp
 */
export class UserStory1Marketplace1729445000000 implements MigrationInterface {
  name = 'UserStory1Marketplace1729445000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SET search_path TO jade, public`);

    console.log('🔄 User Story 1 Marketplace Migration...');
    console.log('  Note: Vendure custom fields (User, Product, Order) are managed by vendure-config.ts');
    console.log('  This migration only updates our custom organization tables.');

    // ==========================================
    // UPDATE SPA/VENDOR ORGANIZATIONS
    // ==========================================

    console.log('  Updating SpaOrganization and VendorOrganization tables...');

    // Ensure spa_organization table has all required fields from entity
    await queryRunner.query(`
      ALTER TABLE jade.spa_organization
      ADD COLUMN IF NOT EXISTS business_name VARCHAR(200)
    `);

    await queryRunner.query(`
      ALTER TABLE jade.spa_organization
      ADD COLUMN IF NOT EXISTS locations JSONB DEFAULT '[]'
    `);

    await queryRunner.query(`
      ALTER TABLE jade.spa_organization
      ADD COLUMN IF NOT EXISTS service_offerings JSONB DEFAULT '[]'
    `);

    await queryRunner.query(`
      ALTER TABLE jade.spa_organization
      ADD COLUMN IF NOT EXISTS owner_user_id VARCHAR(255)
    `);

    // Update vendor_organization to match entity definition
    await queryRunner.query(`
      ALTER TABLE jade.vendor_organization
      ADD COLUMN IF NOT EXISTS credentials JSONB DEFAULT '{}'
    `);

    await queryRunner.query(`
      ALTER TABLE jade.vendor_organization
      ADD COLUMN IF NOT EXISTS commission_rate DECIMAL(5,2) DEFAULT 15.00
    `);

    await queryRunner.query(`
      ALTER TABLE jade.vendor_organization
      ADD COLUMN IF NOT EXISTS terms_of_service TEXT
    `);

    // Create additional indexes for performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_spa_org_business_name
      ON jade.spa_organization(business_name)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_spa_org_subscription
      ON jade.spa_organization(subscription_tier, subscription_status)
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_spa_org_owner
      ON jade.spa_organization(owner_user_id)
      WHERE owner_user_id IS NOT NULL
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_vendor_org_commission
      ON jade.vendor_organization(commission_rate)
    `);

    console.log('✅ User Story 1 migration completed successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SET search_path TO jade, public`);

    console.log('🔄 Rolling back User Story 1 migration...');
    console.log('  Note: Vendure custom fields will be removed when vendure-config.ts is updated');

    // Drop organization indexes
    console.log('  Dropping organization indexes...');
    await queryRunner.query(`DROP INDEX IF EXISTS jade.idx_spa_org_business_name`);
    await queryRunner.query(`DROP INDEX IF EXISTS jade.idx_spa_org_subscription`);
    await queryRunner.query(`DROP INDEX IF EXISTS jade.idx_spa_org_owner`);
    await queryRunner.query(`DROP INDEX IF EXISTS jade.idx_vendor_org_commission`);

    // Drop organization table columns
    console.log('  Dropping organization table columns...');
    await queryRunner.query(`ALTER TABLE jade.spa_organization DROP COLUMN IF EXISTS business_name`);
    await queryRunner.query(`ALTER TABLE jade.spa_organization DROP COLUMN IF EXISTS locations`);
    await queryRunner.query(`ALTER TABLE jade.spa_organization DROP COLUMN IF EXISTS service_offerings`);
    await queryRunner.query(`ALTER TABLE jade.spa_organization DROP COLUMN IF EXISTS owner_user_id`);

    await queryRunner.query(`ALTER TABLE jade.vendor_organization DROP COLUMN IF EXISTS credentials`);
    await queryRunner.query(`ALTER TABLE jade.vendor_organization DROP COLUMN IF EXISTS commission_rate`);
    await queryRunner.query(`ALTER TABLE jade.vendor_organization DROP COLUMN IF EXISTS terms_of_service`);

    console.log('✅ User Story 1 migration rolled back successfully');
  }
}
