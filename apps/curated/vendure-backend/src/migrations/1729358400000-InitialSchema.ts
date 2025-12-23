import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Initial database schema migration for JADE Spa Marketplace
 *
 * Creates core tables based on data-model.md:
 * - User extensions (spa/vendor organizations)
 * - Service providers and clients
 * - Products with progressive disclosure
 * - Appointments and scheduling
 * - Orders and fulfillment
 */
export class InitialSchema1729358400000 implements MigrationInterface {
  name = 'InitialSchema1729358400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Note: Schema creation is now handled by docker-entrypoint.sh before migrations run
    // This ensures proper permissions using admin credentials

    // Set schema
    await queryRunner.query(`SET search_path TO jade, public`);

    // Create enum types FIRST (before tables that reference them)
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.approval_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REQUIRES_INFO');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.appointment_status AS ENUM ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create SpaOrganization table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.spa_organization (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        display_name VARCHAR(255) NOT NULL,
        contact_email VARCHAR(255) NOT NULL,
        contact_phone VARCHAR(50),
        address JSONB NOT NULL,
        logo_url VARCHAR(500),
        subscription_tier VARCHAR(50) DEFAULT 'BASIC',
        subscription_status VARCHAR(50) DEFAULT 'ACTIVE',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT spa_org_email_unique UNIQUE (contact_email)
      )
    `);

    // Create VendorOrganization table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.vendor_organization (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_name VARCHAR(255) NOT NULL,
        display_name VARCHAR(255) NOT NULL,
        contact_email VARCHAR(255) NOT NULL,
        contact_phone VARCHAR(50),
        address JSONB NOT NULL,
        business_license JSONB NOT NULL,
        certifications JSONB DEFAULT '[]',
        insurance JSONB NOT NULL,
        approval_status jade.approval_status DEFAULT 'PENDING',
        quality_score DECIMAL(3,2) DEFAULT 0.0,
        fulfillment_settings JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        approved_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT vendor_org_email_unique UNIQUE (contact_email)
      )
    `);

    // Create Location table (for spa chains)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.location (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        spa_organization_id UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        address JSONB NOT NULL,
        phone VARCHAR(50),
        timezone VARCHAR(50) DEFAULT 'America/New_York',
        operating_hours JSONB DEFAULT '{}',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT fk_location_spa FOREIGN KEY (spa_organization_id)
          REFERENCES jade.spa_organization(id) ON DELETE CASCADE
      )
    `);

    // Create ServiceProvider table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.service_provider (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        spa_organization_id UUID NOT NULL,
        location_id UUID,
        license_info JSONB NOT NULL,
        specialties TEXT[] DEFAULT '{}',
        bio TEXT,
        avatar_url VARCHAR(500),
        availability_windows JSONB DEFAULT '[]',
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT fk_provider_spa FOREIGN KEY (spa_organization_id)
          REFERENCES jade.spa_organization(id) ON DELETE CASCADE,
        CONSTRAINT fk_provider_location FOREIGN KEY (location_id)
          REFERENCES jade.location(id) ON DELETE SET NULL
      )
    `);

    // Create Client table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.client (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID,
        spa_organization_id UUID NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        date_of_birth DATE,
        skin_profile JSONB DEFAULT '{}',
        allergies TEXT[] DEFAULT '{}',
        preferences JSONB DEFAULT '{}',
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT fk_client_spa FOREIGN KEY (spa_organization_id)
          REFERENCES jade.spa_organization(id) ON DELETE CASCADE
      )
    `);

    // Create Appointment table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.appointment (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        client_id UUID NOT NULL,
        service_provider_id UUID NOT NULL,
        location_id UUID NOT NULL,
        service_type VARCHAR(255) NOT NULL,
        scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
        scheduled_end TIMESTAMP WITH TIME ZONE NOT NULL,
        actual_start TIMESTAMP WITH TIME ZONE,
        actual_end TIMESTAMP WITH TIME ZONE,
        status jade.appointment_status DEFAULT 'PENDING',
        products_used JSONB DEFAULT '[]',
        notes TEXT,
        client_feedback JSONB,
        cancellation_reason VARCHAR(255),
        cancelled_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT fk_appointment_client FOREIGN KEY (client_id)
          REFERENCES jade.client(id) ON DELETE CASCADE,
        CONSTRAINT fk_appointment_provider FOREIGN KEY (service_provider_id)
          REFERENCES jade.service_provider(id) ON DELETE RESTRICT,
        CONSTRAINT fk_appointment_location FOREIGN KEY (location_id)
          REFERENCES jade.location(id) ON DELETE RESTRICT
      )
    `);

    // Create TreatmentPlan table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.treatment_plan (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        client_id UUID NOT NULL,
        service_provider_id UUID NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        total_sessions INT NOT NULL,
        completed_sessions INT DEFAULT 0,
        status VARCHAR(50) DEFAULT 'ACTIVE',
        sessions JSONB DEFAULT '[]',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT fk_plan_client FOREIGN KEY (client_id)
          REFERENCES jade.client(id) ON DELETE CASCADE,
        CONSTRAINT fk_plan_provider FOREIGN KEY (service_provider_id)
          REFERENCES jade.service_provider(id) ON DELETE RESTRICT
      )
    `);

    // Create Product table (extends Vendure Product)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.product_extension (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        vendure_product_id UUID NOT NULL UNIQUE,
        vendor_organization_id UUID NOT NULL,
        glance_data JSONB NOT NULL,
        scan_data JSONB NOT NULL,
        study_data JSONB,
        tensor_vector FLOAT[] DEFAULT '{}',
        tensor_generated_at TIMESTAMP WITH TIME ZONE,
        semantic_embedding FLOAT[] DEFAULT '{}',
        embedding_generated_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT fk_product_vendor FOREIGN KEY (vendor_organization_id)
          REFERENCES jade.vendor_organization(id) ON DELETE RESTRICT
      )
    `);

    // Create indexes for performance
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_spa_org_active ON jade.spa_organization(is_active);
      CREATE INDEX IF NOT EXISTS idx_vendor_org_status ON jade.vendor_organization(approval_status, is_active);
      CREATE INDEX IF NOT EXISTS idx_location_spa ON jade.location(spa_organization_id);
      CREATE INDEX IF NOT EXISTS idx_provider_spa ON jade.service_provider(spa_organization_id);
      CREATE INDEX IF NOT EXISTS idx_provider_location ON jade.service_provider(location_id);
      CREATE INDEX IF NOT EXISTS idx_client_spa ON jade.client(spa_organization_id);
      CREATE INDEX IF NOT EXISTS idx_appointment_provider_date ON jade.appointment(service_provider_id, scheduled_start);
      CREATE INDEX IF NOT EXISTS idx_appointment_client ON jade.appointment(client_id);
      CREATE INDEX IF NOT EXISTS idx_appointment_status ON jade.appointment(status);
      CREATE INDEX IF NOT EXISTS idx_product_vendor ON jade.product_extension(vendor_organization_id);
      CREATE INDEX IF NOT EXISTS idx_product_vendure ON jade.product_extension(vendure_product_id);
    `);

    // Create GIN indexes for JSONB columns
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_product_glance_gin ON jade.product_extension USING GIN (glance_data);
      CREATE INDEX IF NOT EXISTS idx_product_scan_gin ON jade.product_extension USING GIN (scan_data);
    `);

    console.log('✅ Initial schema migration completed successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SET search_path TO jade, public`);

    // Drop tables in reverse order (respecting foreign keys)
    await queryRunner.query(`DROP TABLE IF EXISTS jade.product_extension CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.treatment_plan CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.appointment CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.client CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.service_provider CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.location CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.vendor_organization CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.spa_organization CASCADE`);

    console.log('✅ Initial schema migration rolled back successfully');
  }
}
