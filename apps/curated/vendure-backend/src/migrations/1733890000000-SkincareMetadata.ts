/**
 * Migration: Skincare Metadata Extension
 *
 * Feature: RDF Skincare Taxonomy Integration
 *
 * Extends the product taxonomy system with skincare-specific metadata:
 * - Active ingredients (JSONB array)
 * - Skin types compatibility (JSONB array)
 * - Price tier (ENUM: $, $$, $$$, $$$$)
 * - Volume/size information
 * - Application method and frequency
 * - Product attributes (fragrance-free, vegan, cruelty-free)
 */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class SkincareMetadata1733890000000 implements MigrationInterface {
  name = 'SkincareMetadata1733890000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create price_tier ENUM type
    await queryRunner.query(`
      DO $BODY$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'price_tier' AND typnamespace = 'jade'::regnamespace) THEN
          CREATE TYPE jade.price_tier AS ENUM ('$', '$$', '$$$', '$$$$');
        END IF;
      END$BODY$;
    `);

    // Create skin_type lookup table for reference
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.skin_type (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Seed skin types
    await queryRunner.query(`
      INSERT INTO jade.skin_type (name, description, display_order)
      VALUES
        ('Normal', 'Well-balanced skin with even texture and minimal concerns', 1),
        ('Dry', 'Skin lacking moisture, may feel tight or show flakiness', 2),
        ('Oily', 'Excess sebum production, prone to shine and enlarged pores', 3),
        ('Combination', 'Oily T-zone with dry or normal cheeks', 4),
        ('Sensitive', 'Easily irritated skin, prone to redness and reactions', 5),
        ('Mature', 'Aging skin with fine lines, loss of elasticity', 6),
        ('Acne-Prone', 'Skin prone to breakouts and blemishes', 7),
        ('Dehydrated', 'Lacking water content, different from dry skin', 8)
      ON CONFLICT (name) DO NOTHING;
    `);

    // Add new columns to product_taxonomy for skincare metadata
    await queryRunner.query(`
      ALTER TABLE jade.product_taxonomy
        ADD COLUMN IF NOT EXISTS active_ingredients JSONB,
        ADD COLUMN IF NOT EXISTS skin_types JSONB,
        ADD COLUMN IF NOT EXISTS price_tier VARCHAR(20),
        ADD COLUMN IF NOT EXISTS volume VARCHAR(50),
        ADD COLUMN IF NOT EXISTS application_method VARCHAR(100),
        ADD COLUMN IF NOT EXISTS use_frequency VARCHAR(100),
        ADD COLUMN IF NOT EXISTS fragrance_free BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS vegan BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS cruelty_free BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS key_benefits JSONB,
        ADD COLUMN IF NOT EXISTS texture VARCHAR(50),
        ADD COLUMN IF NOT EXISTS routine_step VARCHAR(50);
    `);

    // Create indexes for skincare-specific queries
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_product_taxonomy_active_ingredients
        ON jade.product_taxonomy USING GIN(active_ingredients);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_product_taxonomy_skin_types
        ON jade.product_taxonomy USING GIN(skin_types);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_product_taxonomy_price_tier
        ON jade.product_taxonomy(price_tier);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_product_taxonomy_attributes
        ON jade.product_taxonomy(fragrance_free, vegan, cruelty_free);
    `);

    // Add new subcategories for skincare products from RDF taxonomy
    await queryRunner.query(`
      INSERT INTO jade.product_category (name, parent_id, level, seo_slug, description, display_order)
      SELECT
        name,
        (SELECT id FROM jade.product_category WHERE seo_slug = 'skincare-cleansers'),
        3,
        seo_slug,
        description,
        display_order
      FROM (VALUES
        ('Gel Cleansers', 'skincare-cleansers-gel', 'Lightweight gel-based cleansers', 1),
        ('Cream Cleansers', 'skincare-cleansers-cream', 'Rich, hydrating cream cleansers', 2),
        ('Foam Cleansers', 'skincare-cleansers-foam', 'Foaming cleansers for deep clean', 3),
        ('Oil Cleansers', 'skincare-cleansers-oil', 'Oil-based cleansers for makeup removal', 4),
        ('Micellar Waters', 'skincare-cleansers-micellar', 'Gentle micellar cleansing waters', 5)
      ) AS t(name, seo_slug, description, display_order)
      ON CONFLICT (seo_slug) DO NOTHING;
    `);

    // Add serum subcategories
    await queryRunner.query(`
      INSERT INTO jade.product_category (name, parent_id, level, seo_slug, description, display_order)
      SELECT
        name,
        (SELECT id FROM jade.product_category WHERE seo_slug = 'skincare-serums'),
        3,
        seo_slug,
        description,
        display_order
      FROM (VALUES
        ('Vitamin C Serums', 'skincare-serums-vitamin-c', 'Brightening vitamin C treatments', 1),
        ('Retinol Serums', 'skincare-serums-retinol', 'Anti-aging retinol formulations', 2),
        ('Hyaluronic Acid Serums', 'skincare-serums-hyaluronic', 'Hydrating HA serums', 3),
        ('Niacinamide Serums', 'skincare-serums-niacinamide', 'Pore-minimizing niacinamide', 4),
        ('Peptide Serums', 'skincare-serums-peptide', 'Firming peptide complexes', 5),
        ('Exfoliating Serums', 'skincare-serums-exfoliating', 'AHA/BHA exfoliating treatments', 6)
      ) AS t(name, seo_slug, description, display_order)
      ON CONFLICT (seo_slug) DO NOTHING;
    `);

    // Add moisturizer subcategories
    await queryRunner.query(`
      INSERT INTO jade.product_category (name, parent_id, level, seo_slug, description, display_order)
      SELECT
        name,
        (SELECT id FROM jade.product_category WHERE seo_slug = 'skincare-moisturizers'),
        3,
        seo_slug,
        description,
        display_order
      FROM (VALUES
        ('Gel Moisturizers', 'skincare-moisturizers-gel', 'Lightweight gel moisturizers', 1),
        ('Cream Moisturizers', 'skincare-moisturizers-cream', 'Rich cream moisturizers', 2),
        ('Lotion Moisturizers', 'skincare-moisturizers-lotion', 'Light lotion formulas', 3),
        ('Night Creams', 'skincare-moisturizers-night', 'Intensive overnight treatments', 4),
        ('Barrier Repair', 'skincare-moisturizers-barrier', 'Barrier-strengthening moisturizers', 5)
      ) AS t(name, seo_slug, description, display_order)
      ON CONFLICT (seo_slug) DO NOTHING;
    `);

    // Add mask subcategories
    await queryRunner.query(`
      INSERT INTO jade.product_category (name, parent_id, level, seo_slug, description, display_order)
      SELECT
        name,
        (SELECT id FROM jade.product_category WHERE seo_slug = 'skincare-masks'),
        3,
        seo_slug,
        description,
        display_order
      FROM (VALUES
        ('Sheet Masks', 'skincare-masks-sheet', 'Pre-soaked sheet masks', 1),
        ('Clay Masks', 'skincare-masks-clay', 'Purifying clay treatments', 2),
        ('Overnight Masks', 'skincare-masks-overnight', 'Leave-on sleeping masks', 3),
        ('Peel-Off Masks', 'skincare-masks-peel', 'Peel-off treatment masks', 4),
        ('Hydrating Masks', 'skincare-masks-hydrating', 'Intensive hydration masks', 5)
      ) AS t(name, seo_slug, description, display_order)
      ON CONFLICT (seo_slug) DO NOTHING;
    `);

    // Add new product functions from RDF taxonomy
    await queryRunner.query(`
      INSERT INTO jade.product_function (name, description, display_order)
      VALUES
        ('Barrier Repair', 'Strengthens and repairs the skin barrier', 11),
        ('Oil Control', 'Regulates sebum production', 12),
        ('Antioxidant', 'Protects against free radical damage', 13),
        ('Clarifying', 'Clears and refines the skin', 14),
        ('Detoxifying', 'Removes impurities and toxins', 15),
        ('Plumping', 'Increases skin volume and fullness', 16),
        ('Resurfacing', 'Smooths and refines skin texture', 17),
        ('Calming', 'Reduces irritation and discomfort', 18),
        ('Rejuvenating', 'Revitalizes and renews the skin', 19),
        ('Mattifying', 'Reduces shine and controls oil', 20)
      ON CONFLICT (name) DO NOTHING;
    `);

    // Add new skin concerns from RDF taxonomy
    await queryRunner.query(`
      INSERT INTO jade.skin_concern (name, description, display_order)
      VALUES
        ('Dehydration', 'Lack of water in the skin', 11),
        ('Texture', 'Uneven skin texture and roughness', 12),
        ('Congestion', 'Clogged pores and blackheads', 13),
        ('Sun Damage', 'UV-related skin damage', 14),
        ('Loss of Firmness', 'Sagging or lax skin', 15),
        ('Uneven Skin Tone', 'Discoloration and uneven coloring', 16),
        ('Fine Lines', 'Early signs of aging', 17),
        ('Wrinkles', 'Deep lines and creases', 18),
        ('Irritation', 'Skin discomfort and reactivity', 19),
        ('Enlarged Pores', 'Visible, enlarged pores', 20)
      ON CONFLICT (name) DO NOTHING;
    `);

    console.log('✅ Skincare metadata schema created successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove new columns from product_taxonomy
    await queryRunner.query(`
      ALTER TABLE jade.product_taxonomy
        DROP COLUMN IF EXISTS active_ingredients,
        DROP COLUMN IF EXISTS skin_types,
        DROP COLUMN IF EXISTS price_tier,
        DROP COLUMN IF EXISTS volume,
        DROP COLUMN IF EXISTS application_method,
        DROP COLUMN IF EXISTS use_frequency,
        DROP COLUMN IF EXISTS fragrance_free,
        DROP COLUMN IF EXISTS vegan,
        DROP COLUMN IF EXISTS cruelty_free,
        DROP COLUMN IF EXISTS key_benefits,
        DROP COLUMN IF EXISTS texture,
        DROP COLUMN IF EXISTS routine_step;
    `);

    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS jade.idx_product_taxonomy_active_ingredients;`);
    await queryRunner.query(`DROP INDEX IF EXISTS jade.idx_product_taxonomy_skin_types;`);
    await queryRunner.query(`DROP INDEX IF EXISTS jade.idx_product_taxonomy_price_tier;`);
    await queryRunner.query(`DROP INDEX IF EXISTS jade.idx_product_taxonomy_attributes;`);

    // Drop skin_type table
    await queryRunner.query(`DROP TABLE IF EXISTS jade.skin_type;`);

    // Drop price_tier ENUM
    await queryRunner.query(`DROP TYPE IF EXISTS jade.price_tier;`);

    // Note: Not removing the new subcategories as they may have associated products

    console.log('✅ Skincare metadata schema rolled back');
  }
}
