/**
 * Migration: Product Taxonomy System
 *
 * Feature: Week 3 - Advanced Product Taxonomy
 *
 * Creates comprehensive taxonomy structure for products including:
 * - Product categories (hierarchical)
 * - Product functions (multi-select)
 * - Skin concerns (with severity levels)
 * - Product formats and usage metadata
 * - Taxonomy completeness scoring
 */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProductTaxonomy1730000000003 implements MigrationInterface {
  name = 'ProductTaxonomy1730000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create ENUM types (with IF NOT EXISTS check)
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'usage_time' AND typnamespace = 'jade'::regnamespace) THEN
          CREATE TYPE jade.usage_time AS ENUM (
            'MORNING',
            'EVENING',
            'ANYTIME',
            'NIGHT_ONLY',
            'POST_TREATMENT'
          );
        END IF;
      END$$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'professional_level' AND typnamespace = 'jade'::regnamespace) THEN
          CREATE TYPE jade.professional_level AS ENUM (
            'OTC',
            'PROFESSIONAL',
            'MEDICAL_GRADE',
            'IN_OFFICE_ONLY'
          );
        END IF;
      END$$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'concern_severity' AND typnamespace = 'jade'::regnamespace) THEN
          CREATE TYPE jade.concern_severity AS ENUM (
            'MILD',
            'MODERATE',
            'SEVERE'
          );
        END IF;
      END$$;
    `);

    // Product Category Hierarchy Table
    await queryRunner.query(`
      CREATE TABLE jade.product_category (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        parent_id UUID REFERENCES jade.product_category(id) ON DELETE CASCADE,
        level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 3),
        description TEXT,
        seo_slug VARCHAR(255) UNIQUE NOT NULL,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Create indexes for category hierarchy queries
    await queryRunner.query(`
      CREATE INDEX idx_product_category_parent
        ON jade.product_category(parent_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_product_category_level
        ON jade.product_category(level);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_product_category_slug
        ON jade.product_category(seo_slug);
    `);

    // Product Functions Table (multi-select)
    await queryRunner.query(`
      CREATE TABLE jade.product_function (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        category_compatibility JSONB,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Skin Concerns Table
    await queryRunner.query(`
      CREATE TABLE jade.skin_concern (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        severity_levels JSONB,
        related_ingredients JSONB,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Product Format/Type Lookup Table
    await queryRunner.query(`
      CREATE TABLE jade.product_format (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL UNIQUE,
        category VARCHAR(50),
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Target Area Lookup Table
    await queryRunner.query(`
      CREATE TABLE jade.target_area (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Region/Origin Lookup Table
    await queryRunner.query(`
      CREATE TABLE jade.product_region (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) NOT NULL UNIQUE,
        country_code VARCHAR(2),
        description TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Product Taxonomy Junction Table (main taxonomy data)
    await queryRunner.query(`
      CREATE TABLE jade.product_taxonomy (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID REFERENCES jade.product_extension(id) ON DELETE CASCADE,
        category_id UUID REFERENCES jade.product_category(id),

        -- Multi-select fields (array of UUIDs)
        primary_function_ids UUID[],
        skin_concern_ids UUID[],
        target_area_ids UUID[],

        -- Single-select fields
        product_format_id UUID REFERENCES jade.product_format(id),
        region_id UUID REFERENCES jade.product_region(id),

        -- Usage metadata
        usage_time jade.usage_time DEFAULT 'ANYTIME',
        professional_level jade.professional_level DEFAULT 'OTC',
        protocol_required BOOLEAN DEFAULT FALSE,
        formulation_base VARCHAR(100),

        -- Quality metrics
        taxonomy_completeness_score INTEGER CHECK (taxonomy_completeness_score BETWEEN 0 AND 100),
        last_reviewed_at TIMESTAMP,
        reviewed_by UUID,

        -- Timestamps
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),

        -- Ensure one taxonomy per product
        UNIQUE(product_id)
      );
    `);

    // Create indexes for taxonomy queries
    await queryRunner.query(`
      CREATE INDEX idx_product_taxonomy_product
        ON jade.product_taxonomy(product_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_product_taxonomy_category
        ON jade.product_taxonomy(category_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_product_taxonomy_format
        ON jade.product_taxonomy(product_format_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_product_taxonomy_region
        ON jade.product_taxonomy(region_id);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_product_taxonomy_professional_level
        ON jade.product_taxonomy(professional_level);
    `);

    // GIN indexes for array fields (for fast "contains" queries)
    await queryRunner.query(`
      CREATE INDEX idx_product_taxonomy_functions
        ON jade.product_taxonomy USING GIN(primary_function_ids);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_product_taxonomy_concerns
        ON jade.product_taxonomy USING GIN(skin_concern_ids);
    `);

    await queryRunner.query(`
      CREATE INDEX idx_product_taxonomy_targets
        ON jade.product_taxonomy USING GIN(target_area_ids);
    `);

    // Taxonomy Completeness Trigger Function
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION jade.calculate_taxonomy_completeness()
      RETURNS TRIGGER AS $$
      DECLARE
        score INTEGER := 0;
      BEGIN
        -- Required fields (20 points each)
        IF NEW.category_id IS NOT NULL THEN score := score + 20; END IF;
        IF NEW.product_format_id IS NOT NULL THEN score := score + 20; END IF;

        -- Important fields (15 points each)
        IF NEW.primary_function_ids IS NOT NULL AND array_length(NEW.primary_function_ids, 1) > 0
          THEN score := score + 15; END IF;
        IF NEW.skin_concern_ids IS NOT NULL AND array_length(NEW.skin_concern_ids, 1) > 0
          THEN score := score + 15; END IF;

        -- Optional but valuable fields (10 points each)
        IF NEW.target_area_ids IS NOT NULL AND array_length(NEW.target_area_ids, 1) > 0
          THEN score := score + 10; END IF;
        IF NEW.region_id IS NOT NULL THEN score := score + 10; END IF;
        IF NEW.formulation_base IS NOT NULL THEN score := score + 10; END IF;

        NEW.taxonomy_completeness_score := score;
        NEW.updated_at := NOW();

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Attach trigger to product_taxonomy table
    await queryRunner.query(`
      CREATE TRIGGER trigger_calculate_taxonomy_completeness
      BEFORE INSERT OR UPDATE ON jade.product_taxonomy
      FOR EACH ROW
      EXECUTE FUNCTION jade.calculate_taxonomy_completeness();
    `);

    // Seed initial product categories (5 main categories from requirements)
    await queryRunner.query(`
      INSERT INTO jade.product_category (name, level, seo_slug, description, display_order) VALUES
      -- Level 1: Main Categories
      ('Skincare', 1, 'skincare', 'Professional skincare products for face and body', 1),
      ('Body Care', 1, 'body-care', 'Body treatments, lotions, and scrubs', 2),
      ('Supplements', 1, 'supplements', 'Ingestible beauty and wellness supplements', 3),
      ('Home', 1, 'home', 'Home spa essentials, candles, and aromatherapy', 4),
      ('Wellness Tools', 1, 'wellness-tools', 'Facial tools, devices, and equipment', 5);
    `);

    // Seed skincare subcategories
    await queryRunner.query(`
      INSERT INTO jade.product_category (name, parent_id, level, seo_slug, description, display_order)
      SELECT
        name,
        (SELECT id FROM jade.product_category WHERE seo_slug = 'skincare'),
        2,
        seo_slug,
        description,
        display_order
      FROM (VALUES
        ('Cleansers', 'skincare-cleansers', 'Face and body cleansing products', 1),
        ('Toners & Essences', 'skincare-toners', 'pH balancing and hydrating toners', 2),
        ('Serums', 'skincare-serums', 'Concentrated active treatments', 3),
        ('Moisturizers', 'skincare-moisturizers', 'Face and eye creams, lotions, and hydrators', 4),
        ('Masks', 'skincare-masks', 'Treatment masks and peels', 5),
        ('Exfoliants', 'skincare-exfoliants', 'Chemical and physical exfoliating treatments', 6),
        ('Sun Protection', 'skincare-sunscreen', 'SPF products and sun care', 7),
        ('Eye Care', 'skincare-eye', 'Eye creams, serums, and treatments', 8),
        ('Lip Care', 'skincare-lip', 'Lip balms, treatments, and masks', 9),
        ('Treatments', 'skincare-treatments', 'Specialty treatments and boosters', 10)
      ) AS t(name, seo_slug, description, display_order);
    `);

    // Seed common product functions
    await queryRunner.query(`
      INSERT INTO jade.product_function (name, description, display_order) VALUES
      ('Hydrating', 'Provides moisture and prevents water loss', 1),
      ('Exfoliating', 'Removes dead skin cells and promotes cell turnover', 2),
      ('Anti-Aging', 'Reduces signs of aging like wrinkles and fine lines', 3),
      ('Brightening', 'Evens skin tone and reduces hyperpigmentation', 4),
      ('Soothing', 'Calms irritation and reduces redness', 5),
      ('Acne-Fighting', 'Treats and prevents breakouts', 6),
      ('Pore Minimizing', 'Reduces appearance of pores', 7),
      ('Firming', 'Improves skin elasticity and firmness', 8),
      ('Protecting', 'Shields skin from environmental damage', 9),
      ('Nourishing', 'Provides essential nutrients to skin', 10);
    `);

    // Seed common skin concerns
    await queryRunner.query(`
      INSERT INTO jade.skin_concern (name, description, display_order) VALUES
      ('Acne', 'Breakouts, blackheads, and blemishes', 1),
      ('Aging', 'Fine lines, wrinkles, and loss of elasticity', 2),
      ('Hyperpigmentation', 'Dark spots, melasma, and uneven tone', 3),
      ('Dryness', 'Dehydrated, flaky, or rough skin', 4),
      ('Sensitivity', 'Reactive, irritated, or easily inflamed skin', 5),
      ('Redness', 'Rosacea, flushing, or visible capillaries', 6),
      ('Large Pores', 'Enlarged or visible pores', 7),
      ('Dullness', 'Lack of radiance or uneven texture', 8),
      ('Dark Circles', 'Under-eye discoloration', 9),
      ('Scarring', 'Acne scars or textural irregularities', 10);
    `);

    // Seed product formats
    await queryRunner.query(`
      INSERT INTO jade.product_format (name, category, description) VALUES
      ('Cream', 'skincare', 'Rich, emollient cream texture'),
      ('Lotion', 'skincare', 'Lightweight, fluid cream'),
      ('Gel', 'skincare', 'Water-based gel texture'),
      ('Serum', 'skincare', 'Concentrated liquid treatment'),
      ('Oil', 'skincare', 'Pure or blended facial oil'),
      ('Balm', 'skincare', 'Solid or semi-solid emollient'),
      ('Foam', 'skincare', 'Foaming or mousse texture'),
      ('Mask (Sheet)', 'skincare', 'Pre-soaked sheet mask'),
      ('Mask (Clay)', 'skincare', 'Clay-based treatment mask'),
      ('Mask (Gel)', 'skincare', 'Gel or hydrogel mask'),
      ('Spray/Mist', 'skincare', 'Spray or mist application'),
      ('Powder', 'skincare', 'Dry powder formula'),
      ('Capsule', 'supplements', 'Oral capsule or tablet');
    `);

    // Seed target areas
    await queryRunner.query(`
      INSERT INTO jade.target_area (name, description) VALUES
      ('Face', 'Entire facial area'),
      ('Eye Area', 'Around the eyes, orbital bone'),
      ('Lips', 'Lip area and vermillion border'),
      ('Neck', 'Neck and décolletage'),
      ('Body', 'Body skin excluding face'),
      ('Hands', 'Hand and nail care'),
      ('Feet', 'Foot care'),
      ('Scalp', 'Scalp treatments');
    `);

    // Seed regions (K-Beauty, J-Beauty, French Pharmacy, etc.)
    await queryRunner.query(`
      INSERT INTO jade.product_region (name, country_code, description) VALUES
      ('K-Beauty', 'KR', 'Korean skincare'),
      ('J-Beauty', 'JP', 'Japanese skincare'),
      ('French Pharmacy', 'FR', 'French dermatological brands'),
      ('USA', 'US', 'American brands'),
      ('UK', 'GB', 'British brands'),
      ('Germany', 'DE', 'German skincare'),
      ('Italy', 'IT', 'Italian brands'),
      ('Australia', 'AU', 'Australian brands'),
      ('Switzerland', 'CH', 'Swiss skincare'),
      ('Israel', 'IL', 'Israeli brands');
    `);

    console.log('✅ Product taxonomy schema created successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop trigger and function
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_calculate_taxonomy_completeness ON jade.product_taxonomy;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS jade.calculate_taxonomy_completeness();`);

    // Drop tables in reverse order (respecting foreign keys)
    await queryRunner.query(`DROP TABLE IF EXISTS jade.product_taxonomy;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.product_region;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.target_area;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.product_format;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.skin_concern;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.product_function;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.product_category;`);

    // Drop ENUM types
    await queryRunner.query(`DROP TYPE IF EXISTS jade.concern_severity;`);
    await queryRunner.query(`DROP TYPE IF EXISTS jade.professional_level;`);
    await queryRunner.query(`DROP TYPE IF EXISTS jade.usage_time;`);

    console.log('✅ Product taxonomy schema rolled back');
  }
}
