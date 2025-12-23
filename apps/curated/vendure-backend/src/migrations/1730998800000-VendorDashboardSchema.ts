import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Week 4 Day 1: Vendor Dashboard Schema
 *
 * Creates tables for vendor portal functionality:
 * - Vendor profiles
 * - Product statistics
 * - Sales metrics
 * - Taxonomy quality scores
 */
export class VendorDashboardSchema1730998800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create vendor_profile table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.vendor_profile (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vendure_seller_id VARCHAR(255) UNIQUE NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        contact_name VARCHAR(255),
        contact_email VARCHAR(255) NOT NULL,
        contact_phone VARCHAR(50),
        business_license_number VARCHAR(100),
        tax_id VARCHAR(50),
        website_url VARCHAR(255),
        logo_url VARCHAR(255),
        description TEXT,

        -- Business details
        established_year INTEGER,
        specializations TEXT[], -- e.g., ['anti-aging', 'acne', 'professional-treatments']
        certifications JSONB, -- Professional certifications

        -- Performance metrics
        taxonomy_accuracy_score INTEGER DEFAULT 0, -- 0-100
        product_approval_rate DECIMAL(5,2) DEFAULT 0.00, -- percentage
        average_response_time_hours INTEGER DEFAULT 0,

        -- Account status
        is_active BOOLEAN DEFAULT true,
        is_verified BOOLEAN DEFAULT false,
        verification_date TIMESTAMP,
        onboarding_completed BOOLEAN DEFAULT false,
        onboarding_completed_at TIMESTAMP,

        -- Timestamps
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),

        CONSTRAINT valid_taxonomy_score CHECK (taxonomy_accuracy_score >= 0 AND taxonomy_accuracy_score <= 100),
        CONSTRAINT valid_approval_rate CHECK (product_approval_rate >= 0 AND product_approval_rate <= 100)
      );

      CREATE INDEX idx_vendor_profile_seller_id ON jade.vendor_profile(vendure_seller_id);
      CREATE INDEX idx_vendor_profile_active ON jade.vendor_profile(is_active);
      CREATE INDEX idx_vendor_profile_verified ON jade.vendor_profile(is_verified);
    `);

    // Create vendor_statistics table for dashboard metrics
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.vendor_statistics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vendor_profile_id UUID NOT NULL REFERENCES jade.vendor_profile(id) ON DELETE CASCADE,

        -- Product metrics
        total_products INTEGER DEFAULT 0,
        active_products INTEGER DEFAULT 0,
        pending_approval_products INTEGER DEFAULT 0,
        rejected_products INTEGER DEFAULT 0,

        -- Sales metrics
        total_sales_amount BIGINT DEFAULT 0, -- in cents
        monthly_sales_amount BIGINT DEFAULT 0, -- in cents
        yearly_sales_amount BIGINT DEFAULT 0, -- in cents
        total_orders INTEGER DEFAULT 0,
        average_order_value BIGINT DEFAULT 0, -- in cents

        -- Customer metrics
        total_customers INTEGER DEFAULT 0,
        repeat_customers INTEGER DEFAULT 0,
        customer_retention_rate DECIMAL(5,2) DEFAULT 0.00,

        -- Taxonomy metrics
        products_with_complete_taxonomy INTEGER DEFAULT 0,
        products_with_protocols INTEGER DEFAULT 0,
        professional_products INTEGER DEFAULT 0,

        -- Last calculated timestamp
        calculated_at TIMESTAMP DEFAULT NOW(),

        -- Period tracking
        period_start_date DATE,
        period_end_date DATE,

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),

        UNIQUE(vendor_profile_id, period_start_date, period_end_date)
      );

      CREATE INDEX idx_vendor_statistics_profile ON jade.vendor_statistics(vendor_profile_id);
      CREATE INDEX idx_vendor_statistics_period ON jade.vendor_statistics(period_start_date, period_end_date);
    `);

    // Create product_submission table for tracking submission workflow
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.product_submission (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vendor_profile_id UUID NOT NULL REFERENCES jade.vendor_profile(id) ON DELETE CASCADE,
        product_id UUID REFERENCES jade.product_extension(id) ON DELETE SET NULL,

        -- Submission details
        submission_status VARCHAR(50) NOT NULL DEFAULT 'draft',
        -- Status values: draft, pending_review, approved, rejected, changes_requested

        -- Validation results
        taxonomy_completeness_score INTEGER DEFAULT 0,
        validation_errors JSONB, -- Array of validation error objects
        validation_warnings JSONB, -- Array of validation warning objects

        -- Review information
        reviewed_by VARCHAR(255), -- Admin user ID
        reviewed_at TIMESTAMP,
        review_notes TEXT,
        rejection_reason TEXT,

        -- Training and guidance
        training_completed BOOLEAN DEFAULT false,
        training_completed_at TIMESTAMP,
        guidance_steps_completed JSONB, -- Track which wizard steps were completed

        -- Timestamps
        submitted_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),

        CONSTRAINT valid_submission_status CHECK (
          submission_status IN ('draft', 'pending_review', 'approved', 'rejected', 'changes_requested')
        )
      );

      CREATE INDEX idx_product_submission_vendor ON jade.product_submission(vendor_profile_id);
      CREATE INDEX idx_product_submission_status ON jade.product_submission(submission_status);
      CREATE INDEX idx_product_submission_product ON jade.product_submission(product_id);
    `);

    // Create vendor_training_progress table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.vendor_training_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vendor_profile_id UUID NOT NULL REFERENCES jade.vendor_profile(id) ON DELETE CASCADE,

        -- Training modules
        module_id VARCHAR(100) NOT NULL,
        module_name VARCHAR(255) NOT NULL,
        module_category VARCHAR(100), -- e.g., 'taxonomy', 'protocols', 'quality'

        -- Progress tracking
        status VARCHAR(50) DEFAULT 'not_started',
        -- Status values: not_started, in_progress, completed, certified
        progress_percentage INTEGER DEFAULT 0,

        -- Completion details
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        time_spent_minutes INTEGER DEFAULT 0,

        -- Assessment results
        quiz_score INTEGER, -- 0-100
        quiz_attempts INTEGER DEFAULT 0,
        certification_earned BOOLEAN DEFAULT false,
        certification_expires_at TIMESTAMP,

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),

        UNIQUE(vendor_profile_id, module_id),
        CONSTRAINT valid_training_status CHECK (
          status IN ('not_started', 'in_progress', 'completed', 'certified')
        ),
        CONSTRAINT valid_progress CHECK (progress_percentage >= 0 AND progress_percentage <= 100)
      );

      CREATE INDEX idx_vendor_training_vendor ON jade.vendor_training_progress(vendor_profile_id);
      CREATE INDEX idx_vendor_training_status ON jade.vendor_training_progress(status);
    `);

    // Create vendor_quality_metrics table for detailed quality tracking
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.vendor_quality_metrics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        vendor_profile_id UUID NOT NULL REFERENCES jade.vendor_profile(id) ON DELETE CASCADE,

        -- Taxonomy quality
        correct_category_assignments INTEGER DEFAULT 0,
        incorrect_category_assignments INTEGER DEFAULT 0,
        correct_function_assignments INTEGER DEFAULT 0,
        incorrect_function_assignments INTEGER DEFAULT 0,

        -- Protocol quality
        protocols_provided INTEGER DEFAULT 0,
        protocols_missing INTEGER DEFAULT 0,
        protocol_quality_score INTEGER DEFAULT 0, -- 0-100

        -- Image quality
        high_quality_images INTEGER DEFAULT 0,
        low_quality_images INTEGER DEFAULT 0,
        missing_images INTEGER DEFAULT 0,

        -- Description quality
        complete_descriptions INTEGER DEFAULT 0,
        incomplete_descriptions INTEGER DEFAULT 0,
        description_quality_score INTEGER DEFAULT 0, -- 0-100

        -- Compliance
        compliant_products INTEGER DEFAULT 0,
        non_compliant_products INTEGER DEFAULT 0,
        compliance_issues JSONB, -- Array of compliance issue objects

        -- Overall quality score (weighted average)
        overall_quality_score INTEGER DEFAULT 0, -- 0-100

        -- Period tracking
        period_start_date DATE,
        period_end_date DATE,
        calculated_at TIMESTAMP DEFAULT NOW(),

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),

        UNIQUE(vendor_profile_id, period_start_date, period_end_date)
      );

      CREATE INDEX idx_vendor_quality_profile ON jade.vendor_quality_metrics(vendor_profile_id);
      CREATE INDEX idx_vendor_quality_period ON jade.vendor_quality_metrics(period_start_date, period_end_date);
    `);

    // Link products to vendor profiles
    await queryRunner.query(`
      ALTER TABLE jade.product_extension
      ADD COLUMN IF NOT EXISTS vendor_profile_id UUID REFERENCES jade.vendor_profile(id) ON DELETE SET NULL;

      CREATE INDEX IF NOT EXISTS idx_product_extension_vendor ON jade.product_extension(vendor_profile_id);
    `);

    // Create function to update vendor statistics
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION jade.update_vendor_statistics(p_vendor_profile_id UUID)
      RETURNS void AS $$
      BEGIN
        INSERT INTO jade.vendor_statistics (
          vendor_profile_id,
          total_products,
          active_products,
          pending_approval_products,
          products_with_complete_taxonomy,
          professional_products,
          calculated_at
        )
        SELECT
          p_vendor_profile_id,
          COUNT(*) as total_products,
          COUNT(*) FILTER (WHERE enabled = true) as active_products,
          COUNT(*) FILTER (WHERE submission_status = 'pending_review') as pending_approval_products,
          COUNT(*) FILTER (WHERE pt.taxonomy_completeness_score >= 85) as products_with_complete_taxonomy,
          COUNT(*) FILTER (WHERE pt.professional_level IN ('PROFESSIONAL', 'CLINICAL')) as professional_products,
          NOW()
        FROM jade.product_extension pe
        LEFT JOIN jade.product_taxonomy pt ON pe.id = pt.product_id
        LEFT JOIN jade.product_submission ps ON pe.id = ps.product_id
        WHERE pe.vendor_profile_id = p_vendor_profile_id
        ON CONFLICT (vendor_profile_id, period_start_date, period_end_date)
        WHERE period_start_date = CURRENT_DATE AND period_end_date = CURRENT_DATE
        DO UPDATE SET
          total_products = EXCLUDED.total_products,
          active_products = EXCLUDED.active_products,
          pending_approval_products = EXCLUDED.pending_approval_products,
          products_with_complete_taxonomy = EXCLUDED.products_with_complete_taxonomy,
          professional_products = EXCLUDED.professional_products,
          calculated_at = NOW(),
          updated_at = NOW();
      END;
      $$ LANGUAGE plpgsql;
    `);

    console.log('✅ Vendor Dashboard Schema migration completed successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop function
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS jade.update_vendor_statistics(UUID);
    `);

    // Remove vendor_profile_id column from product_extension
    await queryRunner.query(`
      ALTER TABLE jade.product_extension
      DROP COLUMN IF EXISTS vendor_profile_id;
    `);

    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS jade.vendor_quality_metrics CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.vendor_training_progress CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.product_submission CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.vendor_statistics CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.vendor_profile CASCADE;`);

    console.log('✅ Vendor Dashboard Schema migration rolled back successfully');
  }
}
