/**
 * Database Seed Script - Test User Accounts
 *
 * Creates test users for all RBAC roles to support local development and testing.
 *
 * Usage:
 *   pnpm run seed              # Seed test data
 *   pnpm run seed:reset        # Clear and reseed
 *
 * IMPORTANT: This script is for DEVELOPMENT/TESTING only.
 * DO NOT run in production environments.
 */

import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { UserRole } from '@jade/shared-types';
import { logger } from '../lib/logger';

const SALT_ROUNDS = 12;

// Test user credentials (documented in docs/DEVELOPMENT.md)
const TEST_USERS = [
  {
    email: 'admin@jade-marketplace.test',
    password: 'Admin123!',
    firstName: 'System',
    lastName: 'Administrator',
    role: UserRole.ADMIN,
    description: 'Full system access - platform administration',
  },
  {
    email: 'spa-owner@jade-marketplace.test',
    password: 'SpaOwner123!',
    firstName: 'Jane',
    lastName: 'Owner',
    role: UserRole.SPA_OWNER,
    description: 'Spa organization owner - Luxury Day Spa',
    spaOrgName: 'Luxury Day Spa',
  },
  {
    email: 'spa-manager@jade-marketplace.test',
    password: 'SpaManager123!',
    firstName: 'Michael',
    lastName: 'Manager',
    role: UserRole.SPA_MANAGER,
    description: 'Spa operations manager - Luxury Day Spa',
    spaOrgName: 'Luxury Day Spa',
  },
  {
    email: 'provider@jade-marketplace.test',
    password: 'Provider123!',
    firstName: 'Sarah',
    lastName: 'Esthetician',
    role: UserRole.SERVICE_PROVIDER,
    description: 'Licensed esthetician - Luxury Day Spa',
    spaOrgName: 'Luxury Day Spa',
  },
  {
    email: 'client@jade-marketplace.test',
    password: 'Client123!',
    firstName: 'Emily',
    lastName: 'Client',
    role: UserRole.CLIENT,
    description: 'Spa client/customer',
  },
  {
    email: 'vendor@jade-marketplace.test',
    password: 'Vendor123!',
    firstName: 'Robert',
    lastName: 'Supplier',
    role: UserRole.VENDOR,
    description: 'Product vendor - Premium Skincare Co',
    vendorOrgName: 'Premium Skincare Co',
  },
];

// Test organizations
const TEST_SPA_ORGANIZATIONS = [
  {
    name: 'Luxury Day Spa',
    businessName: 'Luxury Day Spa LLC',
    email: 'contact@luxurydayspa.test',
    phone: '(310) 555-0100',
    address: '123 Spa Boulevard, Beverly Hills, CA 90210',
    description: 'Premier luxury spa offering comprehensive skincare and wellness services',
  },
  {
    name: 'Urban Wellness Center',
    businessName: 'Urban Wellness LLC',
    email: 'info@urbanwellness.test',
    phone: '(415) 555-0200',
    address: '456 Market Street, San Francisco, CA 94102',
    description: 'Modern urban wellness and beauty center',
  },
];

const TEST_VENDOR_ORGANIZATIONS = [
  {
    name: 'Premium Skincare Co',
    businessName: 'Premium Skincare Company Inc',
    email: 'sales@premiumskincare.test',
    phone: '(800) 555-0300',
    address: '789 Industry Drive, Los Angeles, CA 90001',
    description: 'Professional-grade skincare products for spas and clinics',
    website: 'https://premiumskincare.test',
  },
  {
    name: 'Natural Beauty Supply',
    businessName: 'Natural Beauty Supply LLC',
    email: 'orders@naturalbeauty.test',
    phone: '(800) 555-0400',
    address: '321 Organic Way, Portland, OR 97201',
    description: 'Organic and natural beauty products',
    website: 'https://naturalbeauty.test',
  },
];

/**
 * Initialize database connection
 */
async function initializeDatabase(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    logger.info('Database connection initialized');
  }
}

/**
 * Create spa organizations
 */
async function seedSpaOrganizations(): Promise<Map<string, string>> {
  const orgMap = new Map<string, string>();

  for (const org of TEST_SPA_ORGANIZATIONS) {
    try {
      const result = await AppDataSource.query(
        `INSERT INTO jade.spa_organization
         (name, display_name, contact_email, contact_phone, address, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5::jsonb, NOW(), NOW())
         ON CONFLICT (contact_email) DO UPDATE SET updated_at = NOW()
         RETURNING id`,
        [org.name, org.businessName, org.email, org.phone, JSON.stringify({ street: org.address, description: org.description })]
      );

      orgMap.set(org.name, result[0].id);
      logger.info(`✓ Spa organization created: ${org.name}`);
    } catch (error) {
      logger.error(`Failed to create spa organization: ${org.name}`, error);
    }
  }

  return orgMap;
}

/**
 * Create vendor organizations
 */
async function seedVendorOrganizations(): Promise<Map<string, string>> {
  const orgMap = new Map<string, string>();

  for (const org of TEST_VENDOR_ORGANIZATIONS) {
    try {
      const result = await AppDataSource.query(
        `INSERT INTO jade.vendor_organization
         (company_name, display_name, contact_email, contact_phone, address, business_license, insurance, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7::jsonb, NOW(), NOW())
         ON CONFLICT (contact_email) DO UPDATE SET updated_at = NOW()
         RETURNING id`,
        [
          org.name,
          org.businessName,
          org.email,
          org.phone,
          JSON.stringify({ street: org.address, description: org.description, website: org.website }),
          JSON.stringify({ number: 'N/A', state: 'CA' }),
          JSON.stringify({ provider: 'Test Insurance', policyNumber: 'TEST-001' })
        ]
      );

      orgMap.set(org.name, result[0].id);
      logger.info(`✓ Vendor organization created: ${org.name}`);
    } catch (error) {
      logger.error(`Failed to create vendor organization: ${org.name}`, error);
    }
  }

  return orgMap;
}

/**
 * Create test users
 */
async function seedUsers(
  spaOrgs: Map<string, string>,
  vendorOrgs: Map<string, string>
): Promise<Map<string, string>> {
  const userIdMap = new Map<string, string>();

  for (const user of TEST_USERS) {
    try {
      // Get organization ID if needed
      let spaOrgId = null;
      let vendorOrgId = null;

      if (user.spaOrgName) {
        spaOrgId = spaOrgs.get(user.spaOrgName);
      }

      if (user.vendorOrgName) {
        vendorOrgId = vendorOrgs.get(user.vendorOrgName);
      }

      // Hash password
      const passwordHash = await bcrypt.hash(user.password, SALT_ROUNDS);

      // Insert or update user
      const result = await AppDataSource.query(
        `INSERT INTO jade.user
         (email, password_hash, first_name, last_name, role, spa_organization_id, vendor_organization_id, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW(), NOW())
         ON CONFLICT (email)
         DO UPDATE SET
           password_hash = EXCLUDED.password_hash,
           first_name = EXCLUDED.first_name,
           last_name = EXCLUDED.last_name,
           role = EXCLUDED.role,
           spa_organization_id = EXCLUDED.spa_organization_id,
           vendor_organization_id = EXCLUDED.vendor_organization_id,
           updated_at = NOW()
         RETURNING id`,
        [user.email, passwordHash, user.firstName, user.lastName, user.role, spaOrgId, vendorOrgId]
      );

      userIdMap.set(user.email, result[0].id);
      logger.info(`✓ User created: ${user.email} (${user.role})`);
    } catch (error) {
      logger.error(`Failed to create user: ${user.email}`, error);
      throw error;
    }
  }

  return userIdMap;
}

/**
 * Create vendor profiles
 */
async function seedVendorProfiles(userIds: Map<string, string>): Promise<void> {
  const vendorUserId = userIds.get('vendor@jade-marketplace.test');

  if (!vendorUserId) {
    logger.warn('Vendor user not found, skipping vendor profile creation');
    return;
  }

  try {
    // Create vendor profile with sample statistics
    await AppDataSource.query(
      `INSERT INTO jade.vendor_profile
       (vendure_seller_id, company_name, contact_name, contact_email, contact_phone,
        website_url, description, specializations, established_year,
        taxonomy_accuracy_score, product_approval_rate, average_response_time_hours,
        is_active, is_verified, verification_date, onboarding_completed, onboarding_completed_at,
        created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::text[], $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), NOW())
       ON CONFLICT (vendure_seller_id) DO UPDATE SET updated_at = NOW()`,
      [
        vendorUserId, // vendure_seller_id
        'Premium Skincare Co', // company_name
        'Robert Supplier', // contact_name
        'vendor@jade-marketplace.test', // contact_email
        '(800) 555-0300', // contact_phone
        'https://premiumskincare.test', // website_url
        'Professional-grade skincare products for spas and clinics. Specializing in clinical treatments and advanced formulations.', // description
        '{Clinical Skincare,Professional Treatments,Anti-Aging,Medical Grade}', // specializations (PostgreSQL array format)
        2015, // established_year
        92, // taxonomy_accuracy_score
        0.88, // product_approval_rate
        4, // average_response_time_hours
        true, // is_active
        true, // is_verified
        '2024-01-15', // verification_date
        true, // onboarding_completed
        '2024-01-20', // onboarding_completed_at
      ]
    );

    logger.info('✓ Vendor profile created for Premium Skincare Co');

    // Get the vendor profile ID
    const profileResult = await AppDataSource.query(
      `SELECT id FROM jade.vendor_profile WHERE vendure_seller_id = $1`,
      [vendorUserId]
    );

    const vendorProfileId = profileResult[0]?.id;

    if (vendorProfileId) {
      // Create vendor statistics (only if not exists)
      const statsCheck = await AppDataSource.query(
        `SELECT id FROM jade.vendor_statistics WHERE vendor_profile_id = $1`,
        [vendorProfileId]
      );

      if (statsCheck.length === 0) {
        await AppDataSource.query(
          `INSERT INTO jade.vendor_statistics
           (vendor_profile_id, total_products, active_products, pending_approval_products, rejected_products,
            total_sales_amount, monthly_sales_amount, yearly_sales_amount, total_orders, average_order_value,
            total_customers, repeat_customers, customer_retention_rate,
            products_with_complete_taxonomy, products_with_protocols, professional_products,
            calculated_at, period_start_date, period_end_date, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW(), $17, $18, NOW(), NOW())`,
        [
          vendorProfileId, // vendor_profile_id
          45, // total_products
          38, // active_products
          3, // pending_approval_products
          4, // rejected_products
          1245000, // total_sales_amount (in cents = $12,450.00)
          285000, // monthly_sales_amount (in cents = $2,850.00)
          2890000, // yearly_sales_amount (in cents = $28,900.00)
          156, // total_orders
          7980, // average_order_value (in cents = $79.80)
          89, // total_customers
          62, // repeat_customers
          69.7, // customer_retention_rate
          41, // products_with_complete_taxonomy
          35, // products_with_protocols
          42, // professional_products
          '2024-01-01', // period_start_date
          '2024-12-31', // period_end_date
        ]
      );

        logger.info('✓ Vendor statistics created');
      }

      // Create vendor quality metrics (only if not exists)
      const metricsCheck = await AppDataSource.query(
        `SELECT id FROM jade.vendor_quality_metrics WHERE vendor_profile_id = $1`,
        [vendorProfileId]
      );

      if (metricsCheck.length === 0) {
        await AppDataSource.query(
          `INSERT INTO jade.vendor_quality_metrics
           (vendor_profile_id, correct_category_assignments, incorrect_category_assignments,
            correct_function_assignments, incorrect_function_assignments,
            protocols_provided, protocols_missing, protocol_quality_score,
            high_quality_images, low_quality_images, missing_images,
            complete_descriptions, incomplete_descriptions, description_quality_score,
            compliant_products, non_compliant_products, overall_quality_score,
            period_start_date, period_end_date, calculated_at, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW(), NOW(), NOW())`,
          [
            vendorProfileId, // vendor_profile_id
            41, // correct_category_assignments
            4, // incorrect_category_assignments
            39, // correct_function_assignments
            6, // incorrect_function_assignments
            35, // protocols_provided
            10, // protocols_missing
            87, // protocol_quality_score
            40, // high_quality_images
            3, // low_quality_images
            2, // missing_images
            43, // complete_descriptions
            2, // incomplete_descriptions
            94, // description_quality_score
            43, // compliant_products
            2, // non_compliant_products
            89, // overall_quality_score
            '2024-01-01', // period_start_date
            '2024-12-31', // period_end_date
          ]
        );

        logger.info('✓ Vendor quality metrics created');
      }
    }
  } catch (error) {
    logger.error('Failed to create vendor profiles', error);
    throw error;
  }
}

/**
 * Clear all test data
 */
async function clearTestData(): Promise<void> {
  logger.info('Clearing test data...');

  try {
    // Delete vendor profiles (will cascade to statistics and quality metrics)
    await AppDataSource.query(
      `DELETE FROM jade.vendor_profile WHERE contact_email LIKE '%@jade-marketplace.test'`
    );
    logger.info('✓ Test vendor profiles deleted');

    // Delete users with test emails
    await AppDataSource.query(
      `DELETE FROM jade.user WHERE email LIKE '%@jade-marketplace.test'`
    );
    logger.info('✓ Test users deleted');

    // Delete test organizations
    await AppDataSource.query(
      `DELETE FROM jade.spa_organization WHERE email LIKE '%@%.test'`
    );
    logger.info('✓ Test spa organizations deleted');

    await AppDataSource.query(
      `DELETE FROM jade.vendor_organization WHERE email LIKE '%@%.test'`
    );
    logger.info('✓ Test vendor organizations deleted');
  } catch (error) {
    logger.error('Error clearing test data', error);
    throw error;
  }
}

/**
 * Display seed results
 */
function displayResults(): void {
  console.log('\n' + '='.repeat(80));
  console.log('🌱 Test Data Seeded Successfully!');
  console.log('='.repeat(80));
  console.log('\nTest User Credentials:\n');

  TEST_USERS.forEach(user => {
    console.log(`📧 ${user.email}`);
    console.log(`   Password: ${user.password}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Description: ${user.description}\n`);
  });

  console.log('='.repeat(80));
  console.log('⚠️  IMPORTANT: These credentials are for DEVELOPMENT/TESTING only!');
  console.log('='.repeat(80));
  console.log('\nFor more details, see: docs/DEVELOPMENT.md\n');
}

/**
 * Main seed function
 */
async function seed(): Promise<void> {
  try {
    logger.info('Starting database seed...');

    await initializeDatabase();

    // Seed organizations first
    logger.info('Creating test organizations...');
    const spaOrgs = await seedSpaOrganizations();
    const vendorOrgs = await seedVendorOrganizations();

    // Seed users
    logger.info('Creating test users...');
    const userIds = await seedUsers(spaOrgs, vendorOrgs);

    // Seed vendor profiles
    logger.info('Creating vendor profiles...');
    await seedVendorProfiles(userIds);

    displayResults();

    logger.info('✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

/**
 * Reset and reseed
 */
async function reset(): Promise<void> {
  try {
    logger.info('Starting database reset...');

    await initializeDatabase();
    await clearTestData();

    // Re-seed
    const spaOrgs = await seedSpaOrganizations();
    const vendorOrgs = await seedVendorOrganizations();
    const userIds = await seedUsers(spaOrgs, vendorOrgs);
    await seedVendorProfiles(userIds);

    displayResults();

    logger.info('✅ Reset completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Reset failed:', error);
    process.exit(1);
  }
}

/**
 * Clear test data only (without reseeding)
 */
async function clear(): Promise<void> {
  try {
    logger.info('Clearing test data...');

    await initializeDatabase();
    await clearTestData();

    console.log('\n' + '='.repeat(80));
    console.log('🗑️  Test Data Cleared Successfully!');
    console.log('='.repeat(80));
    console.log('\nAll test users and organizations have been removed.');
    console.log('Run `pnpm run seed` to recreate test data.\n');

    logger.info('✅ Clear completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Clear failed:', error);
    process.exit(1);
  }
}

// Run based on command
const command = process.argv[2];

if (command === 'reset') {
  reset();
} else if (command === 'clear') {
  clear();
} else {
  seed();
}
