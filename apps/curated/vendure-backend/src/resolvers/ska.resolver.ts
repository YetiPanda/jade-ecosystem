/**
 * SKA (Skincare Knowledge Atoms) GraphQL Resolvers
 *
 * Implements the SKA Knowledge Graph queries and mutations
 * Based on contracts/intelligence.graphql schema
 */

import { AppDataSource } from '../config/database';
import {
  scoreMarketingCopy,
  quickComplianceCheck,
} from '../services/compliance-scoring.service';

// Type definitions for resolver arguments
export interface SKASearchFilters {
  atomTypes?: string[];
  pillars?: number[];
  marketSegments?: string[];
  fdaApproved?: boolean;
  euCompliant?: boolean;
  crueltyFree?: boolean;
  yearRange?: { min?: number; max?: number };
}

export interface SKATensorProfile {
  hydrationIndex?: number;
  sebumRegulation?: number;
  antiAgingPotency?: number;
  brighteningEfficacy?: number;
  antiInflammatory?: number;
  barrierRepair?: number;
  exfoliationStrength?: number;
  antioxidantCapacity?: number;
  collagenStimulation?: number;
  sensitivityRisk?: number;
  photosensitivity?: number;
  phDependency?: number;
  molecularPenetration?: number;
  stabilityRating?: number;
  compatibilityScore?: number;
  clinicalEvidenceLevel?: number;
  marketSaturation?: number;
}

// Database row types (exported for TypeScript declaration files)
export interface SkincarePillarRow {
  id: string;
  number: number;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  hex_color: string | null;
  display_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface SkincareAtomRow {
  id: string;
  pillar_id: string;
  atom_type: string;
  title: string;
  slug: string;
  year_established: number | null;
  year_introduced: number | null;
  glance_text: string;
  scan_text: string;
  study_text: string;
  market_segment: string | null;
  price_point: string | null;
  target_demographics: string[] | null;
  key_ingredients: string[] | null;
  inci_name: string | null;
  cas_number: string | null;
  molecular_formula: string | null;
  molecular_weight: number | null;
  max_concentration: number | null;
  ph_range_min: number | null;
  ph_range_max: number | null;
  innovation_score: number | null;
  sustainability_score: number | null;
  efficacy_score: number | null;
  fda_approved: boolean;
  eu_compliant: boolean;
  cruelty_free: boolean;
  clean_beauty: boolean;
  vegan_certified: boolean;
  logo_url: string | null;
  product_image_url: string | null;
  video_url: string | null;
  sources: unknown;
  causes_purging: boolean;
  purging_duration_weeks: number | null;
  purging_description: string | null;
  featured: boolean;
  view_count: number;
  created_at: Date;
  updated_at: Date;
}

interface SkincareTensorRow {
  id: string;
  atom_id: string;
  hydration_index: number;
  sebum_regulation: number;
  anti_aging_potency: number;
  brightening_efficacy: number;
  anti_inflammatory: number;
  barrier_repair: number;
  exfoliation_strength: number;
  antioxidant_capacity: number;
  collagen_stimulation: number;
  sensitivity_risk: number;
  photosensitivity: number;
  ph_dependency: number;
  molecular_penetration: number;
  stability_rating: number;
  compatibility_score: number;
  clinical_evidence_level: number;
  market_saturation: number;
  tensor_vector: number[] | null;
}

export interface SkincareRelationshipRow {
  id: string;
  from_atom_id: string;
  to_atom_id: string;
  relationship_type: string;
  strength: number;
  established_year: number | null;
  evidence_description: string | null;
  source_url: string | null;
  source_type: string | null;
  metadata: unknown;
  created_at: Date;
}

interface GoldilocksParameterRow {
  id: string;
  atom_id: string;
  parameter_name: string;
  parameter_unit: string | null;
  optimal_min: number;
  optimal_max: number;
  absolute_min: number | null;
  absolute_max: number | null;
  context: string | null;
  skin_type: string | null;
  notes: string | null;
}

// Convert database rows to GraphQL types
function pillarToGraphQL(row: SkincarePillarRow) {
  return {
    id: row.id,
    number: row.number,
    name: row.name,
    slug: row.slug,
    description: row.description,
    iconUrl: row.icon_url,
    hexColor: row.hex_color,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function atomToGraphQL(row: SkincareAtomRow, detailLevel: 'GLANCE' | 'SCAN' | 'STUDY' = 'SCAN') {
  const base = {
    id: row.id,
    pillarId: row.pillar_id,
    atomType: row.atom_type,
    title: row.title,
    slug: row.slug,
    featured: row.featured,
    viewCount: row.view_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  switch (detailLevel) {
    case 'GLANCE':
      return {
        ...base,
        glanceText: row.glance_text,
      };
    case 'SCAN':
      return {
        ...base,
        glanceText: row.glance_text,
        scanText: row.scan_text,
        marketSegment: row.market_segment,
        pricePoint: row.price_point,
        innovationScore: row.innovation_score,
        sustainabilityScore: row.sustainability_score,
        efficacyScore: row.efficacy_score,
      };
    case 'STUDY':
    default:
      return {
        ...base,
        glanceText: row.glance_text,
        scanText: row.scan_text,
        studyText: row.study_text,
        marketSegment: row.market_segment,
        pricePoint: row.price_point,
        targetDemographics: row.target_demographics,
        keyIngredients: row.key_ingredients,
        inciName: row.inci_name,
        casNumber: row.cas_number,
        molecularFormula: row.molecular_formula,
        molecularWeight: row.molecular_weight,
        maxConcentration: row.max_concentration,
        phRangeMin: row.ph_range_min,
        phRangeMax: row.ph_range_max,
        yearEstablished: row.year_established,
        yearIntroduced: row.year_introduced,
        innovationScore: row.innovation_score,
        sustainabilityScore: row.sustainability_score,
        efficacyScore: row.efficacy_score,
        fdaApproved: row.fda_approved,
        euCompliant: row.eu_compliant,
        crueltyFree: row.cruelty_free,
        cleanBeauty: row.clean_beauty,
        veganCertified: row.vegan_certified,
        logoUrl: row.logo_url,
        productImageUrl: row.product_image_url,
        videoUrl: row.video_url,
        sources: row.sources,
        causesPurging: row.causes_purging,
        purgingDurationWeeks: row.purging_duration_weeks,
        purgingDescription: row.purging_description,
      };
  }
}

function tensorToGraphQL(row: SkincareTensorRow) {
  return {
    hydrationIndex: row.hydration_index,
    sebumRegulation: row.sebum_regulation,
    antiAgingPotency: row.anti_aging_potency,
    brighteningEfficacy: row.brightening_efficacy,
    antiInflammatory: row.anti_inflammatory,
    barrierRepair: row.barrier_repair,
    exfoliationStrength: row.exfoliation_strength,
    antioxidantCapacity: row.antioxidant_capacity,
    collagenStimulation: row.collagen_stimulation,
    sensitivityRisk: row.sensitivity_risk,
    photosensitivity: row.photosensitivity,
    phDependency: row.ph_dependency,
    molecularPenetration: row.molecular_penetration,
    stabilityRating: row.stability_rating,
    compatibilityScore: row.compatibility_score,
    clinicalEvidenceLevel: row.clinical_evidence_level,
    marketSaturation: row.market_saturation,
  };
}

function relationshipToGraphQL(row: SkincareRelationshipRow) {
  return {
    id: row.id,
    fromAtomId: row.from_atom_id,
    toAtomId: row.to_atom_id,
    relationshipType: row.relationship_type,
    strength: row.strength,
    establishedYear: row.established_year,
    evidenceDescription: row.evidence_description,
    sourceUrl: row.source_url,
    sourceType: row.source_type,
    createdAt: row.created_at,
  };
}

function goldilocksToGraphQL(row: GoldilocksParameterRow) {
  return {
    id: row.id,
    atomId: row.atom_id,
    parameterName: row.parameter_name,
    parameterUnit: row.parameter_unit,
    optimalMin: row.optimal_min,
    optimalMax: row.optimal_max,
    absoluteMin: row.absolute_min,
    absoluteMax: row.absolute_max,
    context: row.context,
    skinType: row.skin_type,
    notes: row.notes,
  };
}

// Query Resolvers
export const skaQueryResolvers = {
  // Get all skincare pillars
  async skincarePillars(): Promise<ReturnType<typeof pillarToGraphQL>[]> {
    const result = await AppDataSource.query(
      'SELECT * FROM jade.skincare_pillars ORDER BY number ASC'
    );
    return (result as SkincarePillarRow[]).map(pillarToGraphQL);
  },

  // Get a single pillar by number
  async skincarePillar(
    _parent: unknown,
    args: { number: number }
  ): Promise<ReturnType<typeof pillarToGraphQL> | null> {
    const result = await AppDataSource.query(
      'SELECT * FROM jade.skincare_pillars WHERE number = $1',
      [args.number]
    );
    const rows = result as SkincarePillarRow[];
    return rows[0] ? pillarToGraphQL(rows[0]) : null;
  },

  // Get atom by ID
  async skincareAtom(
    _parent: unknown,
    args: { id: string }
  ): Promise<ReturnType<typeof atomToGraphQL> | null> {
    const result = await AppDataSource.query(
      'SELECT * FROM jade.skincare_atoms WHERE id = $1',
      [args.id]
    );
    const rows = result as SkincareAtomRow[];
    return rows[0] ? atomToGraphQL(rows[0], 'STUDY') : null;
  },

  // Get atom by slug
  async skincareAtomBySlug(
    _parent: unknown,
    args: { slug: string }
  ): Promise<ReturnType<typeof atomToGraphQL> | null> {
    const result = await AppDataSource.query(
      'SELECT * FROM jade.skincare_atoms WHERE slug = $1',
      [args.slug]
    );
    const rows = result as SkincareAtomRow[];
    return rows[0] ? atomToGraphQL(rows[0], 'STUDY') : null;
  },

  // Get atom by INCI name (for ingredients)
  async skincareAtomByInci(
    _parent: unknown,
    args: { inciName: string }
  ): Promise<ReturnType<typeof atomToGraphQL> | null> {
    const result = await AppDataSource.query(
      'SELECT * FROM jade.skincare_atoms WHERE inci_name = $1',
      [args.inciName]
    );
    const rows = result as SkincareAtomRow[];
    return rows[0] ? atomToGraphQL(rows[0], 'STUDY') : null;
  },

  // Search atoms with filters
  async skaSearchAtoms(
    _parent: unknown,
    args: {
      query?: string;
      filters?: SKASearchFilters;
      limit?: number;
      offset?: number;
    }
  ) {
    const limit = args.limit ?? 20;
    const offset = args.offset ?? 0;
    const params: unknown[] = [];
    let paramIndex = 1;

    let whereClause = 'WHERE 1=1';

    // Text search
    if (args.query) {
      whereClause += ` AND to_tsvector('english', title || ' ' || COALESCE(glance_text, '') || ' ' || COALESCE(scan_text, '')) @@ plainto_tsquery('english', $${paramIndex++})`;
      params.push(args.query);
    }

    // Filters
    if (args.filters) {
      if (args.filters.atomTypes?.length) {
        whereClause += ` AND atom_type = ANY($${paramIndex++}::jade.skincare_atom_type[])`;
        params.push(args.filters.atomTypes);
      }
      if (args.filters.pillars?.length) {
        whereClause += ` AND pillar_id IN (SELECT id FROM jade.skincare_pillars WHERE number = ANY($${paramIndex++}::int[]))`;
        params.push(args.filters.pillars);
      }
      if (args.filters.marketSegments?.length) {
        whereClause += ` AND market_segment = ANY($${paramIndex++}::jade.market_segment[])`;
        params.push(args.filters.marketSegments);
      }
      if (args.filters.fdaApproved !== undefined) {
        whereClause += ` AND fda_approved = $${paramIndex++}`;
        params.push(args.filters.fdaApproved);
      }
      if (args.filters.euCompliant !== undefined) {
        whereClause += ` AND eu_compliant = $${paramIndex++}`;
        params.push(args.filters.euCompliant);
      }
      if (args.filters.crueltyFree !== undefined) {
        whereClause += ` AND cruelty_free = $${paramIndex++}`;
        params.push(args.filters.crueltyFree);
      }
      if (args.filters.yearRange?.min) {
        whereClause += ` AND (year_established >= $${paramIndex} OR year_introduced >= $${paramIndex++})`;
        params.push(args.filters.yearRange.min);
      }
      if (args.filters.yearRange?.max) {
        whereClause += ` AND (year_established <= $${paramIndex} OR year_introduced <= $${paramIndex++})`;
        params.push(args.filters.yearRange.max);
      }
    }

    // Count query
    const countResult = await AppDataSource.query(
      `SELECT COUNT(*) FROM jade.skincare_atoms ${whereClause}`,
      params
    );
    const total = parseInt((countResult as [{ count: string }])[0].count, 10);

    // Main query with pagination
    params.push(limit);
    params.push(offset);
    const result = await AppDataSource.query(
      `SELECT * FROM jade.skincare_atoms ${whereClause} LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      params
    );

    return {
      results: (result as SkincareAtomRow[]).map((row) => ({
        atom: atomToGraphQL(row, 'SCAN'),
        relevanceScore: 1.0,
      })),
      totalCount: total,
      query: args.query || '',
      filters: args.filters,
      pagination: {
        limit,
        offset,
        hasMore: offset + (result as SkincareAtomRow[]).length < total,
      },
    };
  },

  // Causal chain traversal (BFS)
  async skaCausalChain(
    _parent: unknown,
    args: {
      atomId: string;
      maxDepth?: number;
      direction?: 'PREREQUISITES' | 'CONSEQUENCES' | 'BOTH';
    }
  ) {
    const maxDepth = args.maxDepth ?? 3;
    const direction = args.direction ?? 'BOTH';

    // Get root atom
    const rootResult = await AppDataSource.query(
      'SELECT * FROM jade.skincare_atoms WHERE id = $1',
      [args.atomId]
    );
    const rootRows = rootResult as SkincareAtomRow[];
    if (!rootRows[0]) {
      throw new Error('Atom not found');
    }

    const prerequisites: Array<{
      atom: ReturnType<typeof atomToGraphQL>;
      relationship: ReturnType<typeof relationshipToGraphQL>;
      depth: number;
    }> = [];
    const consequences: Array<{
      atom: ReturnType<typeof atomToGraphQL>;
      relationship: ReturnType<typeof relationshipToGraphQL>;
      depth: number;
    }> = [];

    // BFS for prerequisites
    if (direction === 'PREREQUISITES' || direction === 'BOTH') {
      const visited = new Set<string>([args.atomId]);
      const queue: Array<{ id: string; depth: number }> = [{ id: args.atomId, depth: 0 }];

      while (queue.length > 0) {
        const current = queue.shift()!;
        if (current.depth >= maxDepth) continue;

        const rels = await AppDataSource.query(
          `SELECT r.*, a.* FROM jade.skincare_relationships r
           JOIN jade.skincare_atoms a ON r.from_atom_id = a.id
           WHERE r.to_atom_id = $1 AND r.relationship_type IN ('PREREQUISITE_OF', 'ENABLES')`,
          [current.id]
        );

        for (const rel of rels as (SkincareRelationshipRow & SkincareAtomRow)[]) {
          if (!visited.has(rel.from_atom_id)) {
            visited.add(rel.from_atom_id);
            prerequisites.push({
              atom: atomToGraphQL(rel, 'GLANCE'),
              relationship: relationshipToGraphQL(rel),
              depth: current.depth + 1,
            });
            queue.push({ id: rel.from_atom_id, depth: current.depth + 1 });
          }
        }
      }
    }

    // BFS for consequences
    if (direction === 'CONSEQUENCES' || direction === 'BOTH') {
      const visited = new Set<string>([args.atomId]);
      const queue: Array<{ id: string; depth: number }> = [{ id: args.atomId, depth: 0 }];

      while (queue.length > 0) {
        const current = queue.shift()!;
        if (current.depth >= maxDepth) continue;

        const rels = await AppDataSource.query(
          `SELECT r.*, a.* FROM jade.skincare_relationships r
           JOIN jade.skincare_atoms a ON r.to_atom_id = a.id
           WHERE r.from_atom_id = $1 AND r.relationship_type IN ('PREREQUISITE_OF', 'CONSEQUENCE_OF')`,
          [current.id]
        );

        for (const rel of rels as (SkincareRelationshipRow & SkincareAtomRow)[]) {
          if (!visited.has(rel.to_atom_id)) {
            visited.add(rel.to_atom_id);
            consequences.push({
              atom: atomToGraphQL(rel, 'GLANCE'),
              relationship: relationshipToGraphQL(rel),
              depth: current.depth + 1,
            });
            queue.push({ id: rel.to_atom_id, depth: current.depth + 1 });
          }
        }
      }
    }

    return {
      rootAtom: atomToGraphQL(rootRows[0], 'SCAN'),
      prerequisites,
      consequences,
      maxDepth,
      totalNodes: 1 + prerequisites.length + consequences.length,
    };
  },

  // Check ingredient compatibility
  async skaCheckCompatibility(_parent: unknown, args: { atomIds: string[] }) {
    const conflicts: Array<{
      atom1: ReturnType<typeof atomToGraphQL>;
      atom2: ReturnType<typeof atomToGraphQL>;
      reason: string;
    }> = [];
    const synergies: Array<{
      atom1: ReturnType<typeof atomToGraphQL>;
      atom2: ReturnType<typeof atomToGraphQL>;
      benefit: string;
    }> = [];

    // Get all atoms
    const atomsResult = await AppDataSource.query(
      `SELECT * FROM jade.skincare_atoms WHERE id = ANY($1::uuid[])`,
      [args.atomIds]
    );
    const atoms = atomsResult as SkincareAtomRow[];

    // Check all pairs for conflicts and synergies
    for (let i = 0; i < args.atomIds.length; i++) {
      for (let j = i + 1; j < args.atomIds.length; j++) {
        const relsResult = await AppDataSource.query(
          `SELECT * FROM jade.skincare_relationships
           WHERE (from_atom_id = $1 AND to_atom_id = $2) OR (from_atom_id = $2 AND to_atom_id = $1)`,
          [args.atomIds[i], args.atomIds[j]]
        );
        const rels = relsResult as SkincareRelationshipRow[];

        const atom1 = atoms.find((a) => a.id === args.atomIds[i]);
        const atom2 = atoms.find((a) => a.id === args.atomIds[j]);

        if (atom1 && atom2) {
          for (const rel of rels) {
            if (rel.relationship_type === 'CONFLICTS_WITH') {
              conflicts.push({
                atom1: atomToGraphQL(atom1, 'GLANCE'),
                atom2: atomToGraphQL(atom2, 'GLANCE'),
                reason: rel.evidence_description || 'These ingredients may not work well together',
              });
            } else if (rel.relationship_type === 'SYNERGIZES_WITH') {
              synergies.push({
                atom1: atomToGraphQL(atom1, 'GLANCE'),
                atom2: atomToGraphQL(atom2, 'GLANCE'),
                benefit: rel.evidence_description || 'These ingredients work well together',
              });
            }
          }
        }
      }
    }

    return {
      compatible: conflicts.length === 0,
      conflicts,
      synergies,
      atoms: atoms.map((a) => atomToGraphQL(a, 'GLANCE')),
    };
  },

  // Get purging information for an ingredient
  async skaGetPurgingInfo(_parent: unknown, args: { ingredientId: string }) {
    const result = await AppDataSource.query(
      'SELECT * FROM jade.skincare_atoms WHERE id = $1',
      [args.ingredientId]
    );
    const rows = result as SkincareAtomRow[];

    if (!rows[0]) {
      return null;
    }

    return {
      causesPurging: rows[0].causes_purging,
      durationWeeks: rows[0].purging_duration_weeks,
      description: rows[0].purging_description,
      ingredient: atomToGraphQL(rows[0], 'SCAN'),
    };
  },

  // Knowledge graph statistics
  async skaKnowledgeGraphStats() {
    const [pillarCount, atomCount, relationshipCount, goldilocksCount] = await Promise.all([
      AppDataSource.query('SELECT COUNT(*) FROM jade.skincare_pillars'),
      AppDataSource.query('SELECT COUNT(*) FROM jade.skincare_atoms'),
      AppDataSource.query('SELECT COUNT(*) FROM jade.skincare_relationships'),
      AppDataSource.query('SELECT COUNT(*) FROM jade.goldilocks_parameters'),
    ]);

    // Count by atom type
    const typeCounts = await AppDataSource.query(
      `SELECT atom_type as type, COUNT(*) as count FROM jade.skincare_atoms GROUP BY atom_type`
    );

    return {
      totalPillars: parseInt((pillarCount as [{ count: string }])[0].count, 10),
      totalAtoms: parseInt((atomCount as [{ count: string }])[0].count, 10),
      totalRelationships: parseInt((relationshipCount as [{ count: string }])[0].count, 10),
      totalGoldilocksParameters: parseInt((goldilocksCount as [{ count: string }])[0].count, 10),
      atomsByType: (typeCounts as { type: string; count: string }[]).reduce(
        (acc: Record<string, number>, { type, count }) => ({ ...acc, [type]: parseInt(count, 10) }),
        {}
      ),
    };
  },

  // Marketing Compliance Scoring - AI-powered claim analysis
  async skaScoreCompliance(
    _parent: unknown,
    args: { copy: string; productId?: string }
  ) {
    return scoreMarketingCopy(args.copy, args.productId);
  },

  // Quick compliance check - pass/fail with critical issues only
  async skaQuickComplianceCheck(
    _parent: unknown,
    args: { copy: string }
  ) {
    return quickComplianceCheck(args.copy);
  },
};

// Mutation Resolvers
export const skaMutationResolvers = {
  // Create a new skincare atom
  async skaCreateAtom(
    _parent: unknown,
    args: {
      input: {
        pillarId: string;
        atomType: string;
        title: string;
        slug: string;
        glanceText: string;
        scanText: string;
        studyText: string;
        marketSegment?: string;
        pricePoint?: string;
        inciName?: string;
        fdaApproved?: boolean;
        euCompliant?: boolean;
        crueltyFree?: boolean;
      };
    }
  ) {
    const { input } = args;
    const result = await AppDataSource.query(
      `INSERT INTO jade.skincare_atoms (
        pillar_id, atom_type, title, slug, glance_text, scan_text, study_text,
        market_segment, price_point, inci_name, fda_approved, eu_compliant, cruelty_free
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        input.pillarId,
        input.atomType,
        input.title,
        input.slug,
        input.glanceText,
        input.scanText,
        input.studyText,
        input.marketSegment || null,
        input.pricePoint || null,
        input.inciName || null,
        input.fdaApproved ?? false,
        input.euCompliant ?? false,
        input.crueltyFree ?? false,
      ]
    );
    return atomToGraphQL((result as SkincareAtomRow[])[0], 'STUDY');
  },

  // Update an existing atom
  async skaUpdateAtom(
    _parent: unknown,
    args: { id: string; input: Record<string, unknown> }
  ) {
    const { id, input } = args;
    const updates: string[] = [];
    const params: unknown[] = [];
    let paramIndex = 1;

    // Build dynamic update query
    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) {
        updates.push(`${key} = $${paramIndex++}`);
        params.push(value);
      }
    }

    if (updates.length === 0) {
      const result = await AppDataSource.query(
        'SELECT * FROM jade.skincare_atoms WHERE id = $1',
        [id]
      );
      const rows = result as SkincareAtomRow[];
      return rows[0] ? atomToGraphQL(rows[0], 'STUDY') : null;
    }

    params.push(id);
    const result = await AppDataSource.query(
      `UPDATE jade.skincare_atoms SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`,
      params
    );
    const rows = result as SkincareAtomRow[];
    return rows[0] ? atomToGraphQL(rows[0], 'STUDY') : null;
  },

  // Delete an atom
  async skaDeleteAtom(_parent: unknown, args: { id: string }) {
    const result = await AppDataSource.query(
      'DELETE FROM jade.skincare_atoms WHERE id = $1',
      [args.id]
    );
    return (result as { rowCount: number }).rowCount === 1;
  },

  // Create a relationship between atoms
  async skaCreateRelationship(
    _parent: unknown,
    args: {
      input: {
        fromAtomId: string;
        toAtomId: string;
        relationshipType: string;
        strength?: number;
        evidenceDescription?: string;
        sourceUrl?: string;
      };
    }
  ) {
    const { input } = args;
    const result = await AppDataSource.query(
      `INSERT INTO jade.skincare_relationships (
        from_atom_id, to_atom_id, relationship_type, strength, evidence_description, source_url
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        input.fromAtomId,
        input.toAtomId,
        input.relationshipType,
        input.strength ?? 0.5,
        input.evidenceDescription || null,
        input.sourceUrl || null,
      ]
    );
    return relationshipToGraphQL((result as SkincareRelationshipRow[])[0]);
  },

  // Delete a relationship
  async skaDeleteRelationship(_parent: unknown, args: { id: string }) {
    const result = await AppDataSource.query(
      'DELETE FROM jade.skincare_relationships WHERE id = $1',
      [args.id]
    );
    return (result as { rowCount: number }).rowCount === 1;
  },

  // Set a Goldilocks parameter
  async skaSetGoldilocksParameter(
    _parent: unknown,
    args: {
      input: {
        atomId: string;
        parameterName: string;
        parameterUnit?: string;
        optimalMin: number;
        optimalMax: number;
        absoluteMin?: number;
        absoluteMax?: number;
        context?: string;
        skinType?: string;
        notes?: string;
      };
    }
  ) {
    const { input } = args;
    const result = await AppDataSource.query(
      `INSERT INTO jade.goldilocks_parameters (
        atom_id, parameter_name, parameter_unit, optimal_min, optimal_max,
        absolute_min, absolute_max, context, skin_type, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (atom_id, parameter_name, context, skin_type)
      DO UPDATE SET
        parameter_unit = $3, optimal_min = $4, optimal_max = $5,
        absolute_min = $6, absolute_max = $7, notes = $10, updated_at = NOW()
      RETURNING *`,
      [
        input.atomId,
        input.parameterName,
        input.parameterUnit || null,
        input.optimalMin,
        input.optimalMax,
        input.absoluteMin || null,
        input.absoluteMax || null,
        input.context || null,
        input.skinType || null,
        input.notes || null,
      ]
    );
    return goldilocksToGraphQL((result as GoldilocksParameterRow[])[0]);
  },

  // Generate or update 17-D tensor for an atom
  async skaGenerateTensor17D(
    _parent: unknown,
    args: { atomId: string; tensor: SKATensorProfile }
  ) {
    const { atomId, tensor } = args;

    const result = await AppDataSource.query(
      `INSERT INTO jade.skincare_atom_tensors (
        atom_id, hydration_index, sebum_regulation, anti_aging_potency,
        brightening_efficacy, anti_inflammatory, barrier_repair, exfoliation_strength,
        antioxidant_capacity, collagen_stimulation, sensitivity_risk, photosensitivity,
        ph_dependency, molecular_penetration, stability_rating, compatibility_score,
        clinical_evidence_level, market_saturation
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      ON CONFLICT (atom_id)
      DO UPDATE SET
        hydration_index = $2, sebum_regulation = $3, anti_aging_potency = $4,
        brightening_efficacy = $5, anti_inflammatory = $6, barrier_repair = $7,
        exfoliation_strength = $8, antioxidant_capacity = $9, collagen_stimulation = $10,
        sensitivity_risk = $11, photosensitivity = $12, ph_dependency = $13,
        molecular_penetration = $14, stability_rating = $15, compatibility_score = $16,
        clinical_evidence_level = $17, market_saturation = $18, updated_at = NOW()
      RETURNING *`,
      [
        atomId,
        tensor.hydrationIndex ?? 0,
        tensor.sebumRegulation ?? 0,
        tensor.antiAgingPotency ?? 0,
        tensor.brighteningEfficacy ?? 0,
        tensor.antiInflammatory ?? 0,
        tensor.barrierRepair ?? 0,
        tensor.exfoliationStrength ?? 0,
        tensor.antioxidantCapacity ?? 0,
        tensor.collagenStimulation ?? 0,
        tensor.sensitivityRisk ?? 0,
        tensor.photosensitivity ?? 0,
        tensor.phDependency ?? 0,
        tensor.molecularPenetration ?? 0,
        tensor.stabilityRating ?? 0,
        tensor.compatibilityScore ?? 0,
        tensor.clinicalEvidenceLevel ?? 0,
        tensor.marketSaturation ?? 0,
      ]
    );
    return tensorToGraphQL((result as SkincareTensorRow[])[0]);
  },
};

// Field resolvers for nested types
export const skaFieldResolvers = {
  SkincarePillar: {
    async atoms(pillar: { id: string }, args: { limit?: number }) {
      const limit = args.limit ?? 50;
      const result = await AppDataSource.query(
        'SELECT * FROM jade.skincare_atoms WHERE pillar_id = $1 LIMIT $2',
        [pillar.id, limit]
      );
      return (result as SkincareAtomRow[]).map((row) => atomToGraphQL(row, 'GLANCE'));
    },
    async atomCount(pillar: { id: string }) {
      const result = await AppDataSource.query(
        'SELECT COUNT(*) FROM jade.skincare_atoms WHERE pillar_id = $1',
        [pillar.id]
      );
      return parseInt((result as [{ count: string }])[0].count, 10);
    },
  },
  SkincareAtom: {
    async pillar(atom: { pillarId: string }) {
      const result = await AppDataSource.query(
        'SELECT * FROM jade.skincare_pillars WHERE id = $1',
        [atom.pillarId]
      );
      const rows = result as SkincarePillarRow[];
      return rows[0] ? pillarToGraphQL(rows[0]) : null;
    },
    async tensor(atom: { id: string }) {
      const result = await AppDataSource.query(
        'SELECT * FROM jade.skincare_atom_tensors WHERE atom_id = $1',
        [atom.id]
      );
      const rows = result as SkincareTensorRow[];
      return rows[0] ? tensorToGraphQL(rows[0]) : null;
    },
    async goldilocksParameters(atom: { id: string }) {
      const result = await AppDataSource.query(
        'SELECT * FROM jade.goldilocks_parameters WHERE atom_id = $1',
        [atom.id]
      );
      return (result as GoldilocksParameterRow[]).map(goldilocksToGraphQL);
    },
    async relationships(atom: { id: string }) {
      const result = await AppDataSource.query(
        `SELECT * FROM jade.skincare_relationships
         WHERE from_atom_id = $1 OR to_atom_id = $1
         LIMIT 20`,
        [atom.id]
      );
      return (result as SkincareRelationshipRow[]).map(relationshipToGraphQL);
    },
  },
};
