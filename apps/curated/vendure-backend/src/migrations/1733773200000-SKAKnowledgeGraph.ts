import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * SKA Knowledge Graph Schema Migration
 *
 * Creates tables for Skincare Knowledge Atoms (SKA) integration:
 * - skincare_pillars: 7 categorical pillars organizing knowledge
 * - skincare_atoms: Knowledge units with progressive disclosure
 * - skincare_relationships: Semantic/causal relationships between atoms
 * - goldilocks_parameters: Optimal range parameters for ingredients/protocols
 * - skincare_atom_tensors: 17-D domain-specific tensor vectors
 *
 * Based on UNIFIED-INTELLIGENCE-ARCHITECTURE.md specification
 */
export class SKAKnowledgeGraph1733773200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types for SKA
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.skincare_atom_type AS ENUM (
          'COMPANY',
          'BRAND',
          'PRODUCT',
          'INGREDIENT',
          'REGULATION',
          'TREND',
          'SCIENTIFIC_CONCEPT',
          'MARKET_DATA'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.skincare_relationship_type AS ENUM (
          'ENABLES',
          'INHIBITS',
          'PREREQUISITE_OF',
          'CONSEQUENCE_OF',
          'FORMULATED_WITH',
          'SYNERGIZES_WITH',
          'CONFLICTS_WITH',
          'REPLACES',
          'ACQUIRES',
          'COMPETES_WITH',
          'OWNED_BY',
          'REGULATES',
          'RESTRICTS',
          'APPROVES',
          'INFLUENCES',
          'DISRUPTS'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.market_segment AS ENUM (
          'MASS',
          'PRESTIGE',
          'LUXURY',
          'MEDICAL',
          'NATURAL'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.price_point AS ENUM (
          'BUDGET',
          'MID_RANGE',
          'PREMIUM',
          'LUXURY'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.source_type AS ENUM (
          'PEER_REVIEWED',
          'REGULATORY_DOCUMENT',
          'PATENT',
          'MARKET_RESEARCH',
          'COMPANY_FILING',
          'INDUSTRY_REPORT'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    // Create skincare_pillars table (7 categorical pillars)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.skincare_pillars (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        number INTEGER NOT NULL UNIQUE CHECK (number >= 1 AND number <= 7),
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        icon_url VARCHAR(500),
        hex_color VARCHAR(7), -- '#8B5CF6'
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_skincare_pillars_number ON jade.skincare_pillars(number);
      CREATE INDEX IF NOT EXISTS idx_skincare_pillars_slug ON jade.skincare_pillars(slug);
    `);

    // Create skincare_atoms table (knowledge units)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.skincare_atoms (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        pillar_id UUID NOT NULL REFERENCES jade.skincare_pillars(id) ON DELETE RESTRICT,
        atom_type jade.skincare_atom_type NOT NULL,

        -- Core identification
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500) NOT NULL UNIQUE,

        -- Temporal data (years, not billions of years)
        year_established INTEGER,
        year_introduced INTEGER,
        patent_year INTEGER,
        regulation_year INTEGER,
        trend_emergence_year INTEGER,

        -- Progressive disclosure content (Constitution Article IV)
        glance_text VARCHAR(500) NOT NULL, -- 3 seconds
        scan_text VARCHAR(2000) NOT NULL,  -- 30 seconds
        study_text TEXT NOT NULL,          -- 5 minutes

        -- Skincare-specific classification
        market_segment jade.market_segment,
        price_point jade.price_point,
        target_demographics TEXT[], -- ['gen-z', 'millennials', 'mature-skin']
        key_ingredients TEXT[],     -- INCI names

        -- Ingredient-specific fields
        inci_name VARCHAR(500),     -- Official INCI name for ingredients
        cas_number VARCHAR(50),     -- CAS registry number
        molecular_formula VARCHAR(100),
        molecular_weight DECIMAL(12,4),
        max_concentration DECIMAL(5,2), -- FDA/EU max %
        ph_range_min DECIMAL(4,2),
        ph_range_max DECIMAL(4,2),

        -- Market metrics
        market_cap BIGINT,         -- In USD cents
        annual_revenue BIGINT,     -- In USD cents
        market_share DECIMAL(5,4), -- 0-1
        growth_rate DECIMAL(7,4),  -- Allow negative growth

        -- Scores (0-1 scale)
        innovation_score DECIMAL(5,4),
        sustainability_score DECIMAL(5,4),
        efficacy_score DECIMAL(5,4),

        -- Regulatory compliance
        fda_approved BOOLEAN DEFAULT false,
        eu_compliant BOOLEAN DEFAULT false,
        cruelty_free BOOLEAN DEFAULT false,
        clean_beauty BOOLEAN DEFAULT false,
        vegan_certified BOOLEAN DEFAULT false,

        -- Media assets
        logo_url VARCHAR(500),
        product_image_url VARCHAR(500),
        infographic_url VARCHAR(500),
        video_url VARCHAR(500),
        banner_image_url VARCHAR(500),
        image_urls TEXT[], -- Multiple images for gallery

        -- Hierarchical relationships
        parent_company_id UUID REFERENCES jade.skincare_atoms(id) ON DELETE SET NULL,

        -- Vector embeddings
        embedding_792d REAL[], -- 792-dimensional semantic embedding
        embedding_id VARCHAR(100), -- External embedding ID (Zilliz)

        -- Featured content
        featured BOOLEAN DEFAULT false,
        featured_order INTEGER,
        view_count INTEGER DEFAULT 0,

        -- Sources and metadata
        sources JSONB, -- Array of source metadata objects
        metadata JSONB, -- Additional flexible metadata

        -- Purging information (for ingredients)
        causes_purging BOOLEAN DEFAULT false,
        purging_duration_weeks INTEGER,
        purging_description TEXT,

        -- Timestamps
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),

        CONSTRAINT valid_scores CHECK (
          (innovation_score IS NULL OR (innovation_score >= 0 AND innovation_score <= 1)) AND
          (sustainability_score IS NULL OR (sustainability_score >= 0 AND sustainability_score <= 1)) AND
          (efficacy_score IS NULL OR (efficacy_score >= 0 AND efficacy_score <= 1))
        )
      );

      CREATE INDEX IF NOT EXISTS idx_skincare_atoms_pillar ON jade.skincare_atoms(pillar_id);
      CREATE INDEX IF NOT EXISTS idx_skincare_atoms_type ON jade.skincare_atoms(atom_type);
      CREATE INDEX IF NOT EXISTS idx_skincare_atoms_slug ON jade.skincare_atoms(slug);
      CREATE INDEX IF NOT EXISTS idx_skincare_atoms_inci ON jade.skincare_atoms(inci_name);
      CREATE INDEX IF NOT EXISTS idx_skincare_atoms_featured ON jade.skincare_atoms(featured) WHERE featured = true;
      CREATE INDEX IF NOT EXISTS idx_skincare_atoms_market_segment ON jade.skincare_atoms(market_segment);
      CREATE INDEX IF NOT EXISTS idx_skincare_atoms_fts ON jade.skincare_atoms USING gin(to_tsvector('english', title || ' ' || COALESCE(glance_text, '') || ' ' || COALESCE(scan_text, '')));
    `);

    // Create skincare_atom_tensors table (17-D domain vectors)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.skincare_atom_tensors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        atom_id UUID NOT NULL UNIQUE REFERENCES jade.skincare_atoms(id) ON DELETE CASCADE,

        -- 17-D Skincare Domain Tensor
        hydration_index DECIMAL(5,4) DEFAULT 0,
        sebum_regulation DECIMAL(5,4) DEFAULT 0,
        anti_aging_potency DECIMAL(5,4) DEFAULT 0,
        brightening_efficacy DECIMAL(5,4) DEFAULT 0,
        anti_inflammatory DECIMAL(5,4) DEFAULT 0,
        barrier_repair DECIMAL(5,4) DEFAULT 0,
        exfoliation_strength DECIMAL(5,4) DEFAULT 0,
        antioxidant_capacity DECIMAL(5,4) DEFAULT 0,
        collagen_stimulation DECIMAL(5,4) DEFAULT 0,
        sensitivity_risk DECIMAL(5,4) DEFAULT 0,
        photosensitivity DECIMAL(5,4) DEFAULT 0,
        ph_dependency DECIMAL(5,4) DEFAULT 0,
        molecular_penetration DECIMAL(5,4) DEFAULT 0,
        stability_rating DECIMAL(5,4) DEFAULT 0,
        compatibility_score DECIMAL(5,4) DEFAULT 0,
        clinical_evidence_level DECIMAL(5,4) DEFAULT 0,
        market_saturation DECIMAL(5,4) DEFAULT 0,

        -- Precomputed vector for fast search
        tensor_vector REAL[], -- 17-dimensional array

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),

        CONSTRAINT valid_tensor_values CHECK (
          hydration_index >= 0 AND hydration_index <= 1 AND
          sebum_regulation >= 0 AND sebum_regulation <= 1 AND
          anti_aging_potency >= 0 AND anti_aging_potency <= 1 AND
          brightening_efficacy >= 0 AND brightening_efficacy <= 1 AND
          anti_inflammatory >= 0 AND anti_inflammatory <= 1 AND
          barrier_repair >= 0 AND barrier_repair <= 1 AND
          exfoliation_strength >= 0 AND exfoliation_strength <= 1 AND
          antioxidant_capacity >= 0 AND antioxidant_capacity <= 1 AND
          collagen_stimulation >= 0 AND collagen_stimulation <= 1 AND
          sensitivity_risk >= 0 AND sensitivity_risk <= 1 AND
          photosensitivity >= 0 AND photosensitivity <= 1 AND
          ph_dependency >= 0 AND ph_dependency <= 1 AND
          molecular_penetration >= 0 AND molecular_penetration <= 1 AND
          stability_rating >= 0 AND stability_rating <= 1 AND
          compatibility_score >= 0 AND compatibility_score <= 1 AND
          clinical_evidence_level >= 0 AND clinical_evidence_level <= 1 AND
          market_saturation >= 0 AND market_saturation <= 1
        )
      );

      CREATE INDEX IF NOT EXISTS idx_skincare_tensors_atom ON jade.skincare_atom_tensors(atom_id);
    `);

    // Create skincare_relationships table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.skincare_relationships (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        from_atom_id UUID NOT NULL REFERENCES jade.skincare_atoms(id) ON DELETE CASCADE,
        to_atom_id UUID NOT NULL REFERENCES jade.skincare_atoms(id) ON DELETE CASCADE,
        relationship_type jade.skincare_relationship_type NOT NULL,
        strength DECIMAL(5,4) DEFAULT 0.5, -- 0-1
        established_year INTEGER,
        evidence_description TEXT,
        source_url VARCHAR(500),
        source_type jade.source_type,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),

        CONSTRAINT no_self_reference CHECK (from_atom_id != to_atom_id),
        CONSTRAINT unique_relationship UNIQUE (from_atom_id, to_atom_id, relationship_type),
        CONSTRAINT valid_strength CHECK (strength >= 0 AND strength <= 1)
      );

      CREATE INDEX IF NOT EXISTS idx_skincare_rel_from ON jade.skincare_relationships(from_atom_id);
      CREATE INDEX IF NOT EXISTS idx_skincare_rel_to ON jade.skincare_relationships(to_atom_id);
      CREATE INDEX IF NOT EXISTS idx_skincare_rel_type ON jade.skincare_relationships(relationship_type);
    `);

    // Create goldilocks_parameters table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.goldilocks_parameters (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        atom_id UUID NOT NULL REFERENCES jade.skincare_atoms(id) ON DELETE CASCADE,
        parameter_name VARCHAR(255) NOT NULL,
        parameter_unit VARCHAR(50),

        -- Goldilocks range (optimal zone)
        optimal_min DECIMAL(12,4) NOT NULL,
        optimal_max DECIMAL(12,4) NOT NULL,
        absolute_min DECIMAL(12,4), -- Hard lower limit
        absolute_max DECIMAL(12,4), -- Hard upper limit

        -- Context
        context VARCHAR(255), -- e.g., 'face', 'body', 'professional', 'home'
        skin_type VARCHAR(100), -- e.g., 'oily', 'dry', 'sensitive', 'all'
        notes TEXT,

        -- Evidence
        source_type jade.source_type,
        source_url VARCHAR(500),
        evidence_level VARCHAR(50), -- 'clinical_trial', 'observational', 'expert_consensus'

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),

        CONSTRAINT valid_range CHECK (optimal_min <= optimal_max),
        CONSTRAINT valid_absolute_range CHECK (
          (absolute_min IS NULL OR absolute_min <= optimal_min) AND
          (absolute_max IS NULL OR absolute_max >= optimal_max)
        ),
        UNIQUE(atom_id, parameter_name, context, skin_type)
      );

      CREATE INDEX IF NOT EXISTS idx_goldilocks_atom ON jade.goldilocks_parameters(atom_id);
      CREATE INDEX IF NOT EXISTS idx_goldilocks_parameter ON jade.goldilocks_parameters(parameter_name);
    `);

    // Create skincare_sources table for detailed source tracking
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.skincare_sources (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        source_type jade.source_type NOT NULL,
        title VARCHAR(500) NOT NULL,
        authors TEXT[],
        publication_year INTEGER,
        journal_name VARCHAR(255),
        publisher VARCHAR(255),
        doi VARCHAR(100),
        url VARCHAR(500),
        isbn VARCHAR(20),
        peer_reviewed BOOLEAN DEFAULT false,
        impact_factor DECIMAL(6,3),
        citation_count INTEGER DEFAULT 0,
        abstract TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_skincare_sources_type ON jade.skincare_sources(source_type);
      CREATE INDEX IF NOT EXISTS idx_skincare_sources_doi ON jade.skincare_sources(doi);
      CREATE INDEX IF NOT EXISTS idx_skincare_sources_year ON jade.skincare_sources(publication_year);
    `);

    // Create junction table for atom sources
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.skincare_atom_sources (
        atom_id UUID NOT NULL REFERENCES jade.skincare_atoms(id) ON DELETE CASCADE,
        source_id UUID NOT NULL REFERENCES jade.skincare_sources(id) ON DELETE CASCADE,
        citation_context TEXT, -- Where in the atom content this source is cited
        created_at TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (atom_id, source_id)
      );

      CREATE INDEX IF NOT EXISTS idx_atom_sources_atom ON jade.skincare_atom_sources(atom_id);
      CREATE INDEX IF NOT EXISTS idx_atom_sources_source ON jade.skincare_atom_sources(source_id);
    `);

    // Create function to compute and update tensor vector
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION jade.update_tensor_vector()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.tensor_vector := ARRAY[
          NEW.hydration_index,
          NEW.sebum_regulation,
          NEW.anti_aging_potency,
          NEW.brightening_efficacy,
          NEW.anti_inflammatory,
          NEW.barrier_repair,
          NEW.exfoliation_strength,
          NEW.antioxidant_capacity,
          NEW.collagen_stimulation,
          NEW.sensitivity_risk,
          NEW.photosensitivity,
          NEW.ph_dependency,
          NEW.molecular_penetration,
          NEW.stability_rating,
          NEW.compatibility_score,
          NEW.clinical_evidence_level,
          NEW.market_saturation
        ]::REAL[];
        NEW.updated_at := NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS trigger_update_tensor_vector ON jade.skincare_atom_tensors;
      CREATE TRIGGER trigger_update_tensor_vector
        BEFORE INSERT OR UPDATE ON jade.skincare_atom_tensors
        FOR EACH ROW EXECUTE FUNCTION jade.update_tensor_vector();
    `);

    // Create function to update updated_at timestamp
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION jade.update_skincare_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS trigger_skincare_atoms_updated ON jade.skincare_atoms;
      CREATE TRIGGER trigger_skincare_atoms_updated
        BEFORE UPDATE ON jade.skincare_atoms
        FOR EACH ROW EXECUTE FUNCTION jade.update_skincare_timestamp();

      DROP TRIGGER IF EXISTS trigger_skincare_pillars_updated ON jade.skincare_pillars;
      CREATE TRIGGER trigger_skincare_pillars_updated
        BEFORE UPDATE ON jade.skincare_pillars
        FOR EACH ROW EXECUTE FUNCTION jade.update_skincare_timestamp();

      DROP TRIGGER IF EXISTS trigger_goldilocks_updated ON jade.goldilocks_parameters;
      CREATE TRIGGER trigger_goldilocks_updated
        BEFORE UPDATE ON jade.goldilocks_parameters
        FOR EACH ROW EXECUTE FUNCTION jade.update_skincare_timestamp();
    `);

    console.log('✅ SKA Knowledge Graph schema migration completed successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop triggers
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_update_tensor_vector ON jade.skincare_atom_tensors;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_skincare_atoms_updated ON jade.skincare_atoms;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_skincare_pillars_updated ON jade.skincare_pillars;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_goldilocks_updated ON jade.goldilocks_parameters;`);

    // Drop functions
    await queryRunner.query(`DROP FUNCTION IF EXISTS jade.update_tensor_vector();`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS jade.update_skincare_timestamp();`);

    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS jade.skincare_atom_sources CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.skincare_sources CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.goldilocks_parameters CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.skincare_relationships CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.skincare_atom_tensors CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.skincare_atoms CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.skincare_pillars CASCADE;`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE IF EXISTS jade.source_type;`);
    await queryRunner.query(`DROP TYPE IF EXISTS jade.price_point;`);
    await queryRunner.query(`DROP TYPE IF EXISTS jade.market_segment;`);
    await queryRunner.query(`DROP TYPE IF EXISTS jade.skincare_relationship_type;`);
    await queryRunner.query(`DROP TYPE IF EXISTS jade.skincare_atom_type;`);

    console.log('✅ SKA Knowledge Graph schema migration rolled back successfully');
  }
}
