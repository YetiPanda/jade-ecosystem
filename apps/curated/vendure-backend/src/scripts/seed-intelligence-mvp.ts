/**
 * Intelligence MVP Seeder
 *
 * DermaLogica Intelligence MVP - Phase 7: Integration & Testing
 *
 * Seeds curated skincare concepts with:
 * - Knowledge threshold classification (T1-T8)
 * - Evidence citations with real studies
 * - Causal relationships between concepts
 * - Efficacy indicators
 *
 * Run: pnpm --filter @jade/vendure-backend intelligence:seed
 */

import { AppDataSource } from '../config/database';
import intelligenceData from '../data/intelligence-concepts.json';

/**
 * Type definitions for seed data
 */
interface EvidenceData {
  claim: string;
  evidenceLevel: string;
  studyType: string;
  sampleSize: number;
  durationWeeks: number;
  findings: string;
  citation: string;
  doi?: string;
  year: number;
  peerReviewed: boolean;
}

interface EfficacyData {
  indicatorType: string;
  metric: string;
  timeframe: string;
  expectedImprovement: string;
  confidenceInterval: string;
  evidenceLevel: string;
  conditions: string;
}

interface RelationshipData {
  targetId: string;
  type: string;
  mechanism: string;
  strength: number;
}

interface ConceptData {
  id: string;
  name: string;
  knowledgeThreshold: string;
  category: string;
  glanceText: string;
  scanText: string;
  studyText: string;
  whyItWorks: string;
  causalSummary: string;
  evidence: EvidenceData[];
  efficacyIndicators: EfficacyData[];
  relationships: RelationshipData[];
}

/**
 * Knowledge threshold enum mapping (JSON to DB enum values)
 */
const THRESHOLD_MAP: Record<string, string> = {
  T1: 'T1_SKIN_BIOLOGY',
  T2: 'T2_INGREDIENT_SCIENCE',
  T3: 'T3_PRODUCT_FORMULATION',
  T4: 'T4_TREATMENT_PROTOCOLS',
  T5: 'T5_CONTRAINDICATIONS',
  T6: 'T6_PROFESSIONAL_TECHNIQUES',
  T7: 'T7_REGULATORY_COMPLIANCE',
  T8: 'T8_SYSTEMIC_PATTERNS',
};

/**
 * Relationship type mapping (JSON to DB enum values)
 */
const RELATIONSHIP_MAP: Record<string, string> = {
  SYNERGY: 'SYNERGIZES_WITH',
  CONFLICT: 'CONFLICTS_WITH',
  REQUIRES: 'PREREQUISITE_OF',
  CAUTION: 'CONFLICTS_WITH',  // Map caution to conflicts
  NEUTRAL: 'INFLUENCES',       // Map neutral to influences
};

/**
 * Pillar ID for Ingredient Intelligence (for seeding ingredients)
 */
const INGREDIENT_PILLAR_ID = '0eff5f25-6695-4a10-ade1-8c6a818443c1';

/**
 * Evidence level mapping (JSON to DB enum values)
 * DB values: ANECDOTAL, IN_VITRO, ANIMAL, HUMAN_PILOT, HUMAN_CONTROLLED, META_ANALYSIS, GOLD_STANDARD
 */
const EVIDENCE_MAP: Record<string, string> = {
  ANECDOTAL: 'ANECDOTAL',
  LOW_QUALITY: 'ANIMAL',
  MODERATE: 'HUMAN_PILOT',
  HIGH_QUALITY: 'HUMAN_CONTROLLED',
  VERY_HIGH: 'META_ANALYSIS',
  SYSTEMATIC_REVIEW: 'META_ANALYSIS',
  GOLD_STANDARD: 'GOLD_STANDARD',
};

/**
 * Main seeder function
 */
async function seedIntelligenceMVP() {
  console.log('🧬 Starting Intelligence MVP seeding...\n');

  // Initialize database connection
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const concepts = intelligenceData.concepts as ConceptData[];
    const stats = {
      concepts: 0,
      evidence: 0,
      efficacy: 0,
      relationships: 0,
    };

    console.log(`📚 Processing ${concepts.length} skincare concepts...\n`);

    // Step 1: Insert all concepts first
    const conceptIdMap = new Map<string, string>(); // maps our id to database uuid

    for (const concept of concepts) {
      console.log(`  📖 Seeding: ${concept.name} (${concept.knowledgeThreshold})`);

      // Map knowledge threshold to DB enum value
      const dbThreshold = THRESHOLD_MAP[concept.knowledgeThreshold] || 'T2_INGREDIENT_SCIENCE';
      // Determine atom_type based on category
      const atomType = concept.category === 'product-type' ? 'PRODUCT' : 'INGREDIENT';

      // Check if concept already exists
      const existing = await queryRunner.query(
        `SELECT id FROM jade.skincare_atoms WHERE slug = $1`,
        [concept.id]
      );

      let conceptDbId: string;

      if (existing.length > 0) {
        conceptDbId = existing[0].id;
        console.log(`     ⏩ Already exists, updating...`);

        // Update existing concept
        await queryRunner.query(
          `UPDATE jade.skincare_atoms SET
            title = $1,
            glance_text = $2,
            scan_text = $3,
            study_text = $4,
            knowledge_threshold = $5,
            why_it_works = $6,
            causal_summary = $7,
            updated_at = NOW()
          WHERE id = $8`,
          [
            concept.name,
            concept.glanceText,
            concept.scanText,
            concept.studyText,
            dbThreshold,
            concept.whyItWorks,
            concept.causalSummary,
            conceptDbId,
          ]
        );
      } else {
        // Insert new concept (requires pillar_id and atom_type)
        const result = await queryRunner.query(
          `INSERT INTO jade.skincare_atoms (
            pillar_id,
            atom_type,
            slug,
            title,
            glance_text,
            scan_text,
            study_text,
            knowledge_threshold,
            why_it_works,
            causal_summary,
            created_at,
            updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
          RETURNING id`,
          [
            INGREDIENT_PILLAR_ID,
            atomType,
            concept.id,
            concept.name,
            concept.glanceText,
            concept.scanText,
            concept.studyText,
            dbThreshold,
            concept.whyItWorks,
            concept.causalSummary,
          ]
        );
        conceptDbId = result[0].id;
        stats.concepts++;
      }

      conceptIdMap.set(concept.id, conceptDbId);

      // Step 2: Insert evidence citations
      // Actual schema: atom_id, claim, evidence_level, source_type, source_reference,
      //                publication_year, sample_size, study_duration, confidence_score, notes
      if (concept.evidence && concept.evidence.length > 0) {
        // Clear existing evidence for this concept
        await queryRunner.query(
          `DELETE FROM jade.claim_evidence WHERE atom_id = $1`,
          [conceptDbId]
        );

        for (const evidence of concept.evidence) {
          // Build notes with extra info (findings, doi, peer review status)
          const notes = [
            evidence.findings,
            evidence.doi ? `DOI: ${evidence.doi}` : null,
            evidence.peerReviewed ? 'Peer-reviewed' : 'Not peer-reviewed'
          ].filter(Boolean).join(' | ');

          // Map evidence level to DB enum
          const dbEvidenceLevel = EVIDENCE_MAP[evidence.evidenceLevel] || 'HUMAN_PILOT';

          await queryRunner.query(
            `INSERT INTO jade.claim_evidence (
              atom_id,
              claim,
              evidence_level,
              source_type,
              source_reference,
              publication_year,
              sample_size,
              study_duration,
              notes
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              conceptDbId,
              evidence.claim,
              dbEvidenceLevel,
              evidence.studyType,
              evidence.citation,
              evidence.year,
              evidence.sampleSize,
              `${evidence.durationWeeks} weeks`,
              notes,
            ]
          );
          stats.evidence++;
        }
      }

      // Step 3: Insert efficacy indicators
      // Actual schema: atom_id, indicator_name, measurement_type, baseline_value,
      //                target_value, unit, time_to_effect, evidence_level, notes
      if (concept.efficacyIndicators && concept.efficacyIndicators.length > 0) {
        // Clear existing indicators for this concept
        await queryRunner.query(
          `DELETE FROM jade.efficacy_indicator WHERE atom_id = $1`,
          [conceptDbId]
        );

        for (const indicator of concept.efficacyIndicators) {
          // Build notes with conditions and confidence
          const notes = [
            indicator.conditions,
            `Expected improvement: ${indicator.expectedImprovement}`,
            indicator.confidenceInterval ? `CI: ${indicator.confidenceInterval}` : null
          ].filter(Boolean).join(' | ');

          // Map evidence level to DB enum
          const dbEvidenceLevel = EVIDENCE_MAP[indicator.evidenceLevel] || 'HUMAN_PILOT';

          await queryRunner.query(
            `INSERT INTO jade.efficacy_indicator (
              atom_id,
              indicator_name,
              measurement_type,
              time_to_effect,
              evidence_level,
              notes
            ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              conceptDbId,
              indicator.metric,
              indicator.indicatorType,
              indicator.timeframe,
              dbEvidenceLevel,
              notes,
            ]
          );
          stats.efficacy++;
        }
      }
    }

    // Step 4: Insert relationships (after all concepts exist)
    console.log('\n🔗 Seeding causal relationships...\n');

    for (const concept of concepts) {
      const sourceId = conceptIdMap.get(concept.id);
      if (!sourceId) continue;

      if (concept.relationships && concept.relationships.length > 0) {
        // Clear existing relationships from this concept
        await queryRunner.query(
          `DELETE FROM jade.skincare_relationships WHERE from_atom_id = $1`,
          [sourceId]
        );

        for (const rel of concept.relationships) {
          const targetId = conceptIdMap.get(rel.targetId);
          if (!targetId) {
            console.log(`     ⚠️  Target not found: ${rel.targetId}, skipping relationship`);
            continue;
          }

          // Map relationship type to DB enum value
          const dbRelType = RELATIONSHIP_MAP[rel.type] || 'INFLUENCES';

          await queryRunner.query(
            `INSERT INTO jade.skincare_relationships (
              from_atom_id,
              to_atom_id,
              relationship_type,
              evidence_description,
              strength,
              created_at
            ) VALUES ($1, $2, $3, $4, $5, NOW())
            ON CONFLICT (from_atom_id, to_atom_id, relationship_type) DO UPDATE SET
              evidence_description = EXCLUDED.evidence_description,
              strength = EXCLUDED.strength`,
            [
              sourceId,
              targetId,
              dbRelType,
              rel.mechanism,
              rel.strength,
            ]
          );
          stats.relationships++;
        }
      }
    }

    await queryRunner.commitTransaction();

    console.log('\n✅ Intelligence MVP seeding complete!\n');
    console.log('📊 Statistics:');
    console.log(`   • Concepts seeded: ${stats.concepts}`);
    console.log(`   • Evidence citations: ${stats.evidence}`);
    console.log(`   • Efficacy indicators: ${stats.efficacy}`);
    console.log(`   • Relationships created: ${stats.relationships}`);
    console.log('');

  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

/**
 * Clear Intelligence MVP data
 */
async function clearIntelligenceData() {
  console.log('🗑️  Clearing Intelligence MVP data...\n');

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Get concept IDs from our seed data
    const conceptSlugs = (intelligenceData.concepts as ConceptData[]).map(c => c.id);

    // Clear relationships
    await queryRunner.query(
      `DELETE FROM jade.skincare_relationships
       WHERE from_atom_id IN (SELECT id FROM jade.skincare_atoms WHERE slug = ANY($1))
       OR to_atom_id IN (SELECT id FROM jade.skincare_atoms WHERE slug = ANY($1))`,
      [conceptSlugs]
    );

    // Clear efficacy indicators
    await queryRunner.query(
      `DELETE FROM jade.efficacy_indicator
       WHERE atom_id IN (SELECT id FROM jade.skincare_atoms WHERE slug = ANY($1))`,
      [conceptSlugs]
    );

    // Clear evidence
    await queryRunner.query(
      `DELETE FROM jade.claim_evidence
       WHERE atom_id IN (SELECT id FROM jade.skincare_atoms WHERE slug = ANY($1))`,
      [conceptSlugs]
    );

    // Clear concepts
    await queryRunner.query(
      `DELETE FROM jade.skincare_atoms WHERE slug = ANY($1)`,
      [conceptSlugs]
    );

    await queryRunner.commitTransaction();
    console.log('✅ Intelligence MVP data cleared!\n');

  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Clear failed:', error);
    throw error;
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

/**
 * CLI entry point
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--clear') || args.includes('clear')) {
    await clearIntelligenceData();
  } else if (args.includes('--reset') || args.includes('reset')) {
    await clearIntelligenceData();
    await seedIntelligenceMVP();
  } else {
    await seedIntelligenceMVP();
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
