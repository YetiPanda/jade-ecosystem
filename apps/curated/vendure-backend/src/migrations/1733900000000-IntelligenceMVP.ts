import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Intelligence MVP Schema Migration
 *
 * Creates tables and extends existing schema for DermaLogica Intelligence MVP:
 * - knowledge_threshold enum (T1-T8)
 * - evidence_level enum (7 levels)
 * - claim_evidence table for scientific citations
 * - efficacy_indicator table for efficacy metrics
 * - Extends skincare_atoms with knowledge_threshold, why_it_works, causal_summary
 *
 * Based on SPECKIT-INTELLIGENCE-MVP.md specification
 */
export class IntelligenceMVP1733900000000 implements MigrationInterface {
  name = 'IntelligenceMVP1733900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create knowledge threshold enum (T1-T8)
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.knowledge_threshold AS ENUM (
          'T1_SKIN_BIOLOGY',
          'T2_INGREDIENT_SCIENCE',
          'T3_PRODUCT_FORMULATION',
          'T4_TREATMENT_PROTOCOLS',
          'T5_CONTRAINDICATIONS',
          'T6_PROFESSIONAL_TECHNIQUES',
          'T7_REGULATORY_COMPLIANCE',
          'T8_SYSTEMIC_PATTERNS'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    // Create evidence level enum (7 levels from anecdotal to gold standard)
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.evidence_level AS ENUM (
          'ANECDOTAL',
          'IN_VITRO',
          'ANIMAL',
          'HUMAN_PILOT',
          'HUMAN_CONTROLLED',
          'META_ANALYSIS',
          'GOLD_STANDARD'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    // Add Intelligence MVP columns to skincare_atoms
    await queryRunner.query(`
      ALTER TABLE jade.skincare_atoms
      ADD COLUMN IF NOT EXISTS knowledge_threshold jade.knowledge_threshold DEFAULT 'T2_INGREDIENT_SCIENCE',
      ADD COLUMN IF NOT EXISTS why_it_works VARCHAR(500),
      ADD COLUMN IF NOT EXISTS causal_summary VARCHAR(1000);
    `);

    // Create claim_evidence table for scientific citations
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.claim_evidence (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        atom_id UUID NOT NULL REFERENCES jade.skincare_atoms(id) ON DELETE CASCADE,
        claim VARCHAR(500) NOT NULL,
        evidence_level jade.evidence_level NOT NULL,
        study_type VARCHAR(100),
        sample_size INTEGER,
        duration VARCHAR(50),
        findings TEXT,
        source_url VARCHAR(500),
        citation VARCHAR(200),
        publication_year INTEGER,
        peer_reviewed BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_claim_evidence_atom ON jade.claim_evidence(atom_id);
      CREATE INDEX IF NOT EXISTS idx_claim_evidence_level ON jade.claim_evidence(evidence_level);
      CREATE INDEX IF NOT EXISTS idx_claim_evidence_year ON jade.claim_evidence(publication_year);
    `);

    // Create efficacy_indicator table for efficacy metrics
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.efficacy_indicator (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        atom_id UUID NOT NULL REFERENCES jade.skincare_atoms(id) ON DELETE CASCADE,
        indicator_type VARCHAR(100) NOT NULL,
        metric VARCHAR(200) NOT NULL,
        timeframe VARCHAR(50) NOT NULL,
        expected_improvement DECIMAL(10,4) NOT NULL,
        confidence_interval DECIMAL(10,4),
        evidence_level jade.evidence_level NOT NULL,
        conditions TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_efficacy_indicator_atom ON jade.efficacy_indicator(atom_id);
      CREATE INDEX IF NOT EXISTS idx_efficacy_indicator_type ON jade.efficacy_indicator(indicator_type);
    `);

    // Create index for knowledge_threshold on skincare_atoms
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_skincare_atom_threshold ON jade.skincare_atoms(knowledge_threshold);
    `);

    // Create trigger for claim_evidence updated_at
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION jade.update_claim_evidence_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS trigger_claim_evidence_updated ON jade.claim_evidence;
      CREATE TRIGGER trigger_claim_evidence_updated
        BEFORE UPDATE ON jade.claim_evidence
        FOR EACH ROW EXECUTE FUNCTION jade.update_claim_evidence_timestamp();
    `);

    console.log('✅ Intelligence MVP schema migration completed successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop trigger
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_claim_evidence_updated ON jade.claim_evidence;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS jade.update_claim_evidence_timestamp();`);

    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS jade.idx_skincare_atom_threshold;`);
    await queryRunner.query(`DROP INDEX IF EXISTS jade.idx_efficacy_indicator_type;`);
    await queryRunner.query(`DROP INDEX IF EXISTS jade.idx_efficacy_indicator_atom;`);
    await queryRunner.query(`DROP INDEX IF EXISTS jade.idx_claim_evidence_year;`);
    await queryRunner.query(`DROP INDEX IF EXISTS jade.idx_claim_evidence_level;`);
    await queryRunner.query(`DROP INDEX IF EXISTS jade.idx_claim_evidence_atom;`);

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS jade.efficacy_indicator CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.claim_evidence CASCADE;`);

    // Remove columns from skincare_atoms
    await queryRunner.query(`
      ALTER TABLE jade.skincare_atoms
      DROP COLUMN IF EXISTS knowledge_threshold,
      DROP COLUMN IF EXISTS why_it_works,
      DROP COLUMN IF EXISTS causal_summary;
    `);

    // Drop enum types
    await queryRunner.query(`DROP TYPE IF EXISTS jade.evidence_level;`);
    await queryRunner.query(`DROP TYPE IF EXISTS jade.knowledge_threshold;`);

    console.log('✅ Intelligence MVP schema migration rolled back successfully');
  }
}
