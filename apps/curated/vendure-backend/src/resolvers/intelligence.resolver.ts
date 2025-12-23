/**
 * Intelligence MVP GraphQL Resolvers
 *
 * Implements the Intelligence MVP queries, mutations, and field resolvers
 * Based on schema/intelligence.graphql
 */

import { AppDataSource } from '../config/database';

// Database row types (exported for type inference)
export interface ClaimEvidenceRow {
  id: string;
  atom_id: string;
  claim: string;
  evidence_level: string;
  source_type: string | null;
  source_reference: string | null;
  publication_year: number | null;
  sample_size: number | null;
  study_duration: string | null;
  confidence_score: number | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

interface EfficacyIndicatorRow {
  id: string;
  atom_id: string;
  indicator_name: string;
  measurement_type: string | null;
  baseline_value: number | null;
  target_value: number | null;
  unit: string | null;
  time_to_effect: string | null;
  optimal_min: number | null;
  optimal_max: number | null;
  goldilocks_zone: string | null;
  evidence_level: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

interface SkincareAtomRow {
  id: string;
  pillar_id: string;
  atom_type: string;
  title: string;
  slug: string;
  glance_text: string;
  scan_text: string;
  study_text: string;
  knowledge_threshold: string | null;
  why_it_works: string | null;
  causal_summary: string | null;
  created_at: Date;
  updated_at: Date;
}

// Helper: Convert database row to GraphQL type
function toClaimEvidence(row: ClaimEvidenceRow) {
  return {
    id: row.id,
    atomId: row.atom_id,
    claim: row.claim,
    evidenceLevel: row.evidence_level,
    sourceType: row.source_type,
    sourceReference: row.source_reference,
    publicationYear: row.publication_year,
    sampleSize: row.sample_size,
    studyDuration: row.study_duration,
    confidenceScore: row.confidence_score,
    notes: row.notes,
    createdAt: row.created_at?.toISOString() || new Date().toISOString(),
    updatedAt: row.updated_at?.toISOString() || new Date().toISOString(),
  };
}

function toEfficacyIndicator(row: EfficacyIndicatorRow) {
  return {
    id: row.id,
    atomId: row.atom_id,
    indicatorName: row.indicator_name,
    measurementType: row.measurement_type,
    baselineValue: row.baseline_value,
    targetValue: row.target_value,
    unit: row.unit,
    timeToEffect: row.time_to_effect,
    optimalMin: row.optimal_min,
    optimalMax: row.optimal_max,
    goldilocksZone: row.goldilocks_zone,
    evidenceLevel: row.evidence_level,
    notes: row.notes,
    createdAt: row.created_at?.toISOString() || new Date().toISOString(),
    updatedAt: row.updated_at?.toISOString() || new Date().toISOString(),
  };
}

// Helper: Check if string is a valid UUID
function isUUID(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

// Helper: Resolve atom ID or slug to UUID
async function resolveAtomId(idOrSlug: string): Promise<string | null> {
  if (isUUID(idOrSlug)) {
    return idOrSlug;
  }
  // Look up by slug
  const result = await AppDataSource.query(
    `SELECT id FROM jade.skincare_atoms WHERE slug = $1`,
    [idOrSlug]
  );
  return result.length > 0 ? result[0].id : null;
}

/**
 * Intelligence Query Resolvers
 */
export const intelligenceQueryResolvers = {
  /**
   * Get atom with full intelligence data
   */
  async intelligenceAtom(
    _: unknown,
    { atomId, accessLevel }: { atomId: string; accessLevel?: string }
  ) {
    // Try UUID first, fall back to slug lookup
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(atomId);

    const result = await AppDataSource.query(
      isUUID
        ? `SELECT sa.* FROM jade.skincare_atoms sa WHERE sa.id = $1::uuid`
        : `SELECT sa.* FROM jade.skincare_atoms sa WHERE sa.slug = $1`,
      [atomId]
    );

    if (result.length === 0) {
      return { atom: null, accessible: false };
    }

    const atom = result[0];

    // Check access based on threshold and access level
    const accessible = checkAccess(atom.knowledge_threshold, accessLevel || 'PUBLIC');

    return {
      atom: {
        id: atom.id,
        pillarId: atom.pillar_id,
        atomType: atom.atom_type,
        title: atom.title,
        slug: atom.slug,
        glanceText: atom.glance_text,
        scanText: atom.scan_text,
        studyText: atom.study_text,
        knowledgeThreshold: atom.knowledge_threshold,
        whyItWorks: atom.why_it_works,
        causalSummary: atom.causal_summary,
      },
      accessible,
      evidenceSummary: await getEvidenceSummary(atom.id),
      efficacySummary: await getEfficacySummary(atom.id),
      goldilocksParameters: [], // TODO: implement
      whyItWorks: atom.why_it_works,
      causalSummary: atom.causal_summary,
    };
  },

  /**
   * Get claim evidence for an atom
   */
  async intelligenceClaimEvidence(
    _: unknown,
    { atomId, minLevel }: { atomId: string; minLevel?: string }
  ) {
    let query = `SELECT * FROM jade.claim_evidence WHERE atom_id = $1`;
    const params: (string | undefined)[] = [atomId];

    if (minLevel) {
      const levels = ['ANECDOTAL', 'IN_VITRO', 'ANIMAL', 'HUMAN_PILOT', 'HUMAN_CONTROLLED', 'META_ANALYSIS', 'GOLD_STANDARD'];
      const minIndex = levels.indexOf(minLevel);
      if (minIndex >= 0) {
        const validLevels = levels.slice(minIndex);
        query += ` AND evidence_level = ANY($2)`;
        params.push(validLevels.join(','));
      }
    }

    query += ` ORDER BY publication_year DESC`;

    const result = await AppDataSource.query(query, params.filter(Boolean));
    return result.map(toClaimEvidence);
  },

  /**
   * Get evidence summary for an atom
   */
  async intelligenceEvidenceSummary(_: unknown, { atomId }: { atomId: string }) {
    return getEvidenceSummary(atomId);
  },

  /**
   * Get efficacy indicators for an atom
   */
  async intelligenceEfficacyIndicators(
    _: unknown,
    { atomId, highQualityOnly }: { atomId: string; highQualityOnly?: boolean }
  ) {
    let query = `SELECT * FROM jade.efficacy_indicator WHERE atom_id = $1`;

    if (highQualityOnly) {
      query += ` AND evidence_level IN ('HUMAN_CONTROLLED', 'META_ANALYSIS', 'GOLD_STANDARD')`;
    }

    const result = await AppDataSource.query(query, [atomId]);
    return result.map(toEfficacyIndicator);
  },

  /**
   * Get efficacy summary for an atom
   */
  async intelligenceEfficacySummary(_: unknown, { atomId }: { atomId: string }) {
    return getEfficacySummary(atomId);
  },

  /**
   * Check if user has access to threshold
   */
  async intelligenceCheckAccess(
    _: unknown,
    { threshold, accessLevel }: { threshold: string; accessLevel: string }
  ) {
    return checkAccess(threshold, accessLevel);
  },

  /**
   * Get max accessible threshold for access level
   */
  async intelligenceMaxThreshold(_: unknown, { accessLevel }: { accessLevel: string }) {
    const maxThresholds: Record<string, string> = {
      PUBLIC: 'T2_INGREDIENT_SCIENCE',
      REGISTERED: 'T4_TREATMENT_PROTOCOLS',
      PROFESSIONAL: 'T6_PROFESSIONAL_TECHNIQUES',
      EXPERT: 'T8_SYSTEMIC_PATTERNS',
    };
    return maxThresholds[accessLevel] || 'T2_INGREDIENT_SCIENCE';
  },

  /**
   * Navigate causal chain from an atom
   */
  async intelligenceCausalChain(
    _: unknown,
    { atomId, direction, maxDepth, accessLevel }: {
      atomId: string;
      direction: string;
      maxDepth?: number;
      accessLevel?: string;
    }
  ) {
    // Resolve slug to UUID if needed
    const resolvedId = await resolveAtomId(atomId);
    if (!resolvedId) {
      return [];
    }

    const depth = maxDepth || 3;
    const results: Array<{
      atom: unknown;
      relationship: unknown;
      depth: number;
      direction: string;
      mechanismSummary: string | null;
    }> = [];

    // Get upstream (prerequisites)
    if (direction === 'UPSTREAM' || direction === 'BOTH') {
      const upstream = await AppDataSource.query(
        `WITH RECURSIVE causal_chain AS (
          SELECT sr.from_atom_id, sr.to_atom_id, sr.relationship_type, sr.evidence_description, sr.strength, 1 as depth
          FROM jade.skincare_relationships sr
          WHERE sr.to_atom_id = $1::uuid AND sr.relationship_type IN ('PREREQUISITE_OF', 'ENABLES', 'SYNERGIZES_WITH')

          UNION ALL

          SELECT sr.from_atom_id, sr.to_atom_id, sr.relationship_type, sr.evidence_description, sr.strength, cc.depth + 1
          FROM jade.skincare_relationships sr
          JOIN causal_chain cc ON sr.to_atom_id = cc.from_atom_id
          WHERE cc.depth < $2 AND sr.relationship_type IN ('PREREQUISITE_OF', 'ENABLES', 'SYNERGIZES_WITH')
        )
        SELECT DISTINCT cc.*, sa.id as atom_id, sa.title, sa.slug, sa.glance_text
        FROM causal_chain cc
        JOIN jade.skincare_atoms sa ON cc.from_atom_id = sa.id
        ORDER BY cc.depth`,
        [resolvedId, depth]
      );

      for (const row of upstream) {
        results.push({
          atom: {
            id: row.atom_id,
            title: row.title,
            slug: row.slug,
            glanceText: row.glance_text,
          },
          relationship: {
            id: `${row.from_atom_id}-${row.to_atom_id}`,
            fromAtomId: row.from_atom_id,
            toAtomId: row.to_atom_id,
            relationshipType: row.relationship_type,
            strength: row.strength,
            evidenceDescription: row.evidence_description,
          },
          depth: row.depth,
          direction: 'UPSTREAM',
          mechanismSummary: row.evidence_description,
        });
      }
    }

    // Get downstream (consequences)
    if (direction === 'DOWNSTREAM' || direction === 'BOTH') {
      const downstream = await AppDataSource.query(
        `WITH RECURSIVE causal_chain AS (
          SELECT sr.from_atom_id, sr.to_atom_id, sr.relationship_type, sr.evidence_description, sr.strength, 1 as depth
          FROM jade.skincare_relationships sr
          WHERE sr.from_atom_id = $1::uuid AND sr.relationship_type IN ('PREREQUISITE_OF', 'ENABLES', 'CONSEQUENCE_OF')

          UNION ALL

          SELECT sr.from_atom_id, sr.to_atom_id, sr.relationship_type, sr.evidence_description, sr.strength, cc.depth + 1
          FROM jade.skincare_relationships sr
          JOIN causal_chain cc ON sr.from_atom_id = cc.to_atom_id
          WHERE cc.depth < $2 AND sr.relationship_type IN ('PREREQUISITE_OF', 'ENABLES', 'CONSEQUENCE_OF')
        )
        SELECT DISTINCT cc.*, sa.id as atom_id, sa.title, sa.slug, sa.glance_text
        FROM causal_chain cc
        JOIN jade.skincare_atoms sa ON cc.to_atom_id = sa.id
        ORDER BY cc.depth`,
        [resolvedId, depth]
      );

      for (const row of downstream) {
        results.push({
          atom: {
            id: row.atom_id,
            title: row.title,
            slug: row.slug,
            glanceText: row.glance_text,
          },
          relationship: {
            id: `${row.from_atom_id}-${row.to_atom_id}`,
            fromAtomId: row.from_atom_id,
            toAtomId: row.to_atom_id,
            relationshipType: row.relationship_type,
            strength: row.strength,
            evidenceDescription: row.evidence_description,
          },
          depth: row.depth,
          direction: 'DOWNSTREAM',
          mechanismSummary: row.evidence_description,
        });
      }
    }

    return results;
  },

  /**
   * Analyze compatibility between ingredients
   */
  async intelligenceAnalyzeCompatibility(
    _: unknown,
    { atomIds, accessLevel }: { atomIds: string[]; accessLevel?: string }
  ) {
    // Resolve all atom IDs (slugs to UUIDs)
    const resolvedIds: string[] = [];
    for (const id of atomIds) {
      const resolved = await resolveAtomId(id);
      if (resolved) {
        resolvedIds.push(resolved);
      }
    }

    if (resolvedIds.length < 2) {
      return {
        overallScore: 100,
        compatible: true,
        interactions: [],
        synergies: [],
        conflicts: [],
        sequenceRecommendation: [],
        warnings: [],
        tips: ['Add more ingredients to check compatibility'],
      };
    }

    const interactions = [];
    const synergies = [];
    const conflicts = [];
    const warnings: string[] = [];
    const tips: string[] = [];

    // Get all relationships between the atoms
    for (let i = 0; i < resolvedIds.length; i++) {
      for (let j = i + 1; j < resolvedIds.length; j++) {
        const result = await AppDataSource.query(
          `SELECT sr.*,
            a1.title as from_title, a1.slug as from_slug, a1.glance_text as from_glance,
            a2.title as to_title, a2.slug as to_slug, a2.glance_text as to_glance
           FROM jade.skincare_relationships sr
           JOIN jade.skincare_atoms a1 ON sr.from_atom_id = a1.id
           JOIN jade.skincare_atoms a2 ON sr.to_atom_id = a2.id
           WHERE (sr.from_atom_id = $1::uuid AND sr.to_atom_id = $2::uuid)
              OR (sr.from_atom_id = $2::uuid AND sr.to_atom_id = $1::uuid)`,
          [resolvedIds[i], resolvedIds[j]]
        );

        for (const row of result) {
          const interaction = {
            atomA: { id: row.from_atom_id, title: row.from_title, slug: row.from_slug },
            atomB: { id: row.to_atom_id, title: row.to_title, slug: row.to_slug },
            interactionType: mapRelationshipToInteraction(row.relationship_type),
            synergyType: row.relationship_type === 'SYNERGIZES_WITH' ? 'ENHANCEMENT' : null,
            conflictType: row.relationship_type === 'CONFLICTS_WITH' ? 'INACTIVATION' : null,
            severity: Math.round((row.strength || 0.5) * 10),
            mechanism: row.evidence_description || 'Interaction detected',
            recommendation: getRecommendation(row.relationship_type),
            waitTime: row.relationship_type === 'CONFLICTS_WITH' ? '30 minutes' : null,
          };

          interactions.push(interaction);

          if (row.relationship_type === 'SYNERGIZES_WITH') {
            synergies.push(interaction);
            tips.push(`${row.from_title} enhances ${row.to_title}`);
          } else if (row.relationship_type === 'CONFLICTS_WITH') {
            conflicts.push(interaction);
            warnings.push(`${row.from_title} may conflict with ${row.to_title}`);
          }
        }
      }
    }

    // Calculate overall score
    const synergyBonus = synergies.length * 10;
    const conflictPenalty = conflicts.length * 20;
    const overallScore = Math.max(0, Math.min(100, 70 + synergyBonus - conflictPenalty));

    return {
      overallScore,
      compatible: conflicts.length === 0,
      interactions,
      synergies,
      conflicts,
      sequenceRecommendation: [], // TODO: implement optimal sequence
      warnings,
      tips,
    };
  },
};

/**
 * Intelligence Mutation Resolvers
 */
export const intelligenceMutationResolvers = {
  /**
   * Add claim evidence to an atom
   */
  async intelligenceAddClaimEvidence(
    _: unknown,
    { atomId, input }: { atomId: string; input: Partial<ClaimEvidenceRow> }
  ) {
    const result = await AppDataSource.query(
      `INSERT INTO jade.claim_evidence (
        atom_id, claim, evidence_level, source_type, source_reference,
        publication_year, sample_size, study_duration, confidence_score, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        atomId,
        input.claim,
        input.evidence_level,
        input.source_type,
        input.source_reference,
        input.publication_year,
        input.sample_size,
        input.study_duration,
        input.confidence_score,
        input.notes,
      ]
    );

    return toClaimEvidence(result[0]);
  },

  /**
   * Update atom knowledge threshold
   */
  async intelligenceSetAtomThreshold(
    _: unknown,
    { atomId, threshold }: { atomId: string; threshold: string }
  ) {
    const result = await AppDataSource.query(
      `UPDATE jade.skincare_atoms
       SET knowledge_threshold = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [threshold, atomId]
    );

    return result[0];
  },

  /**
   * Update atom Why It Works explanation
   */
  async intelligenceSetWhyItWorks(
    _: unknown,
    { atomId, whyItWorks, causalSummary }: { atomId: string; whyItWorks: string; causalSummary?: string }
  ) {
    const result = await AppDataSource.query(
      `UPDATE jade.skincare_atoms
       SET why_it_works = $1, causal_summary = COALESCE($2, causal_summary), updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [whyItWorks, causalSummary, atomId]
    );

    return result[0];
  },
};

/**
 * Intelligence Field Resolvers
 * Extends SkincareAtom with intelligence fields
 */
export const intelligenceFieldResolvers = {
  SkincareAtom: {
    async knowledgeThreshold(parent: { id: string; knowledge_threshold?: string }) {
      if (parent.knowledge_threshold) {
        return parent.knowledge_threshold;
      }

      const result = await AppDataSource.query(
        `SELECT knowledge_threshold FROM jade.skincare_atoms WHERE id = $1`,
        [parent.id]
      );

      return result[0]?.knowledge_threshold || null;
    },

    async whyItWorks(parent: { id: string; why_it_works?: string }) {
      if (parent.why_it_works) {
        return parent.why_it_works;
      }

      const result = await AppDataSource.query(
        `SELECT why_it_works FROM jade.skincare_atoms WHERE id = $1`,
        [parent.id]
      );

      return result[0]?.why_it_works || null;
    },

    async causalSummary(parent: { id: string; causal_summary?: string }) {
      if (parent.causal_summary) {
        return parent.causal_summary;
      }

      const result = await AppDataSource.query(
        `SELECT causal_summary FROM jade.skincare_atoms WHERE id = $1`,
        [parent.id]
      );

      return result[0]?.causal_summary || null;
    },

    async claimEvidences(parent: { id: string }) {
      const result = await AppDataSource.query(
        `SELECT * FROM jade.claim_evidence WHERE atom_id = $1 ORDER BY publication_year DESC`,
        [parent.id]
      );

      return result.map(toClaimEvidence);
    },

    async efficacyIndicators(parent: { id: string }) {
      const result = await AppDataSource.query(
        `SELECT * FROM jade.efficacy_indicator WHERE atom_id = $1`,
        [parent.id]
      );

      return result.map(toEfficacyIndicator);
    },

    async evidenceSummary(parent: { id: string }) {
      return getEvidenceSummary(parent.id);
    },

    async efficacySummary(parent: { id: string }) {
      return getEfficacySummary(parent.id);
    },
  },
};

// Helper functions

async function getEvidenceSummary(atomId: string) {
  const result = await AppDataSource.query(
    `SELECT
      COUNT(*) as total_claims,
      evidence_level,
      COUNT(*) as level_count
     FROM jade.claim_evidence
     WHERE atom_id = $1
     GROUP BY evidence_level`,
    [atomId]
  );

  if (result.length === 0) {
    return {
      totalClaims: 0,
      averageEvidenceStrength: 0,
      highestEvidenceLevel: null,
      claimsByLevel: {},
    };
  }

  const levels = ['ANECDOTAL', 'IN_VITRO', 'ANIMAL', 'HUMAN_PILOT', 'HUMAN_CONTROLLED', 'META_ANALYSIS', 'GOLD_STANDARD'];
  const claimsByLevel: Record<string, number> = {};
  let totalClaims = 0;
  let highestLevelIndex = -1;
  let weightedSum = 0;

  for (const row of result) {
    claimsByLevel[row.evidence_level] = Number(row.level_count);
    totalClaims += Number(row.level_count);

    const levelIndex = levels.indexOf(row.evidence_level);
    if (levelIndex > highestLevelIndex) {
      highestLevelIndex = levelIndex;
    }

    weightedSum += levelIndex * Number(row.level_count);
  }

  return {
    totalClaims,
    averageEvidenceStrength: totalClaims > 0 ? weightedSum / totalClaims / (levels.length - 1) : 0,
    highestEvidenceLevel: highestLevelIndex >= 0 ? levels[highestLevelIndex] : null,
    claimsByLevel,
  };
}

async function getEfficacySummary(atomId: string) {
  const result = await AppDataSource.query(
    `SELECT * FROM jade.efficacy_indicator WHERE atom_id = $1`,
    [atomId]
  );

  const highQualityLevels = ['HUMAN_CONTROLLED', 'META_ANALYSIS', 'GOLD_STANDARD'];
  const highQualityCount = result.filter((r: EfficacyIndicatorRow) =>
    highQualityLevels.includes(r.evidence_level || '')
  ).length;

  return {
    indicators: result.map(toEfficacyIndicator),
    averageImprovement: 0, // TODO: Calculate from target_value - baseline_value
    shortestTimeframe: result.length > 0 ? result[0].time_to_effect : null,
    highQualityCount,
  };
}

function checkAccess(threshold: string | null, accessLevel: string): boolean {
  const thresholdLevels: Record<string, number> = {
    T1_SKIN_BIOLOGY: 1,
    T2_INGREDIENT_SCIENCE: 2,
    T3_PRODUCT_FORMULATION: 3,
    T4_TREATMENT_PROTOCOLS: 4,
    T5_CONTRAINDICATIONS: 5,
    T6_PROFESSIONAL_TECHNIQUES: 6,
    T7_REGULATORY_COMPLIANCE: 7,
    T8_SYSTEMIC_PATTERNS: 8,
  };

  const accessLevels: Record<string, number> = {
    PUBLIC: 2,
    REGISTERED: 4,
    PROFESSIONAL: 6,
    EXPERT: 8,
  };

  const requiredLevel = thresholdLevels[threshold || 'T2_INGREDIENT_SCIENCE'] || 2;
  const userLevel = accessLevels[accessLevel] || 2;

  return userLevel >= requiredLevel;
}

function mapRelationshipToInteraction(relationshipType: string): string {
  const map: Record<string, string> = {
    SYNERGIZES_WITH: 'SYNERGY',
    CONFLICTS_WITH: 'CONFLICT',
    PREREQUISITE_OF: 'SEQUENCING',
    ENABLES: 'SYNERGY',
    INHIBITS: 'CONFLICT',
  };
  return map[relationshipType] || 'NEUTRAL';
}

function getRecommendation(relationshipType: string): string {
  const recommendations: Record<string, string> = {
    SYNERGIZES_WITH: 'Use together for enhanced benefits',
    CONFLICTS_WITH: 'Use at different times of day or alternate days',
    PREREQUISITE_OF: 'Apply in correct sequence',
    ENABLES: 'Combine for best results',
    INHIBITS: 'Avoid combining',
  };
  return recommendations[relationshipType] || 'No specific recommendation';
}
