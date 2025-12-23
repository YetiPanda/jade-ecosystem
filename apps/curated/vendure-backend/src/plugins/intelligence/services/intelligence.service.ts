/**
 * Intelligence Service for JADE Spa Marketplace
 *
 * DermaLogica Intelligence MVP Integration
 *
 * Handles all intelligence-related operations including:
 * - Causal chain navigation (upstream/downstream)
 * - Evidence and efficacy queries
 * - Knowledge threshold access control
 * - Progressive disclosure content (glance/scan/study)
 * - Claim evidence management
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RequestContext } from '@vendure/core';
import {
  SkincareAtom,
  SkincareRelationship,
  GoldilocksParameter,
} from '../entities/ska';
import { ClaimEvidence } from '../entities/claim-evidence.entity';
import { EfficacyIndicator } from '../entities/efficacy-indicator.entity';
import {
  KnowledgeThreshold,
  EvidenceLevel,
  CausalDirection,
  DisclosureLevel,
  SynergyType,
  ConflictType,
  InteractionType,
  THRESHOLD_METADATA,
  EVIDENCE_METADATA,
} from '../types/intelligence.enums';

/**
 * User access level for knowledge threshold filtering
 */
export type AccessLevel = 'public' | 'registered' | 'professional' | 'expert';

/**
 * Causal chain node for graph traversal
 */
export interface CausalChainNode {
  atom: SkincareAtom;
  relationship?: SkincareRelationship;
  depth: number;
  direction: 'upstream' | 'downstream';
}

/**
 * Progressive disclosure content
 */
export interface ProgressiveContent {
  glance: string;
  scan: string;
  study: string;
}

/**
 * Evidence summary for an atom
 */
export interface EvidenceSummary {
  totalClaims: number;
  averageEvidenceStrength: number;
  highestEvidenceLevel: EvidenceLevel | null;
  claimsByLevel: Record<EvidenceLevel, number>;
}

/**
 * Efficacy summary for an atom
 */
export interface EfficacySummary {
  indicators: EfficacyIndicator[];
  averageImprovement: number;
  shortestTimeframe: string | null;
  highQualityCount: number;
}

/**
 * Causal path step for "Why" explanations
 */
export interface CausalPathStep {
  atom: SkincareAtom;
  relationship: SkincareRelationship | null;
  mechanismSummary: string;
}

/**
 * "Why it works" explanation result
 */
export interface WhyExplanation {
  summary: string;
  path: CausalPathStep[];
  confidenceScore: number;
  evidenceStrength: number;
  disclosureContent: {
    glance: string;
    scan: string;
    study: string;
  };
}

/**
 * Ingredient interaction result
 */
export interface IngredientInteraction {
  atomA: SkincareAtom;
  atomB: SkincareAtom;
  interactionType: InteractionType;
  synergyType?: SynergyType;
  conflictType?: ConflictType;
  severity: number; // 1-10 scale
  mechanism: string;
  recommendation: string;
  waitTime?: string; // e.g., "20 minutes", "use in separate routines"
}

/**
 * Compatibility analysis result
 */
export interface CompatibilityResult {
  overallScore: number; // 0-100
  compatible: boolean;
  interactions: IngredientInteraction[];
  synergies: IngredientInteraction[];
  conflicts: IngredientInteraction[];
  sequenceRecommendation: SkincareAtom[];
  warnings: string[];
  tips: string[];
}

@Injectable()
export class IntelligenceService {
  constructor(
    @InjectRepository(SkincareAtom)
    private atomRepo: Repository<SkincareAtom>,
    @InjectRepository(SkincareRelationship)
    private relationshipRepo: Repository<SkincareRelationship>,
    @InjectRepository(GoldilocksParameter)
    private goldilocksRepo: Repository<GoldilocksParameter>,
    @InjectRepository(ClaimEvidence)
    private claimEvidenceRepo: Repository<ClaimEvidence>,
    @InjectRepository(EfficacyIndicator)
    private efficacyRepo: Repository<EfficacyIndicator>
  ) {}

  // ========================================
  // Knowledge Threshold Access Control
  // ========================================

  /**
   * Check if user has access to content at a given threshold
   */
  hasAccessToThreshold(
    userAccessLevel: AccessLevel,
    threshold: KnowledgeThreshold
  ): boolean {
    const thresholdMeta = THRESHOLD_METADATA[threshold];
    const accessHierarchy: AccessLevel[] = [
      'public',
      'registered',
      'professional',
      'expert',
    ];
    const userIndex = accessHierarchy.indexOf(userAccessLevel);
    const requiredIndex = accessHierarchy.indexOf(thresholdMeta.accessLevel);
    return userIndex >= requiredIndex;
  }

  /**
   * Get the maximum accessible threshold for a user
   */
  getMaxAccessibleThreshold(userAccessLevel: AccessLevel): KnowledgeThreshold {
    const thresholds = Object.keys(THRESHOLD_METADATA) as KnowledgeThreshold[];
    let maxThreshold = thresholds[0];

    for (const threshold of thresholds) {
      if (this.hasAccessToThreshold(userAccessLevel, threshold)) {
        maxThreshold = threshold;
      }
    }

    return maxThreshold;
  }

  /**
   * Filter atoms by user's access level
   */
  async getAccessibleAtoms(
    ctx: RequestContext,
    userAccessLevel: AccessLevel,
    atomIds?: string[]
  ): Promise<SkincareAtom[]> {
    const where: any = {};
    if (atomIds && atomIds.length > 0) {
      where.id = In(atomIds);
    }

    const atoms = await this.atomRepo.find({ where });

    return atoms.filter((atom) => {
      if (!atom.knowledgeThreshold) return true; // No threshold = public
      return this.hasAccessToThreshold(userAccessLevel, atom.knowledgeThreshold);
    });
  }

  // ========================================
  // Progressive Disclosure
  // ========================================

  /**
   * Get content at specified disclosure level
   */
  getContentAtLevel(
    atom: SkincareAtom,
    level: DisclosureLevel
  ): string {
    switch (level) {
      case DisclosureLevel.GLANCE:
        return atom.glanceText;
      case DisclosureLevel.SCAN:
        return atom.scanText;
      case DisclosureLevel.STUDY:
        return atom.studyText;
      default:
        return atom.glanceText;
    }
  }

  /**
   * Get all progressive content for an atom
   */
  getProgressiveContent(atom: SkincareAtom): ProgressiveContent {
    return {
      glance: atom.glanceText,
      scan: atom.scanText,
      study: atom.studyText,
    };
  }

  // ========================================
  // Causal Chain Navigation
  // ========================================

  /**
   * Navigate causal chain from a starting atom
   */
  async navigateCausalChain(
    ctx: RequestContext,
    atomId: string,
    direction: CausalDirection,
    maxDepth: number = 3,
    userAccessLevel: AccessLevel = 'public'
  ): Promise<CausalChainNode[]> {
    const nodes: CausalChainNode[] = [];
    const visited = new Set<string>();

    const startAtom = await this.atomRepo.findOne({ where: { id: atomId } });
    if (!startAtom) return nodes;

    // Add start node
    nodes.push({
      atom: startAtom,
      depth: 0,
      direction: 'downstream',
    });
    visited.add(atomId);

    // Traverse based on direction
    if (direction === CausalDirection.UPSTREAM || direction === CausalDirection.BOTH) {
      await this.traverseDirection(
        ctx,
        atomId,
        'upstream',
        maxDepth,
        1,
        visited,
        nodes,
        userAccessLevel
      );
    }

    if (direction === CausalDirection.DOWNSTREAM || direction === CausalDirection.BOTH) {
      await this.traverseDirection(
        ctx,
        atomId,
        'downstream',
        maxDepth,
        1,
        visited,
        nodes,
        userAccessLevel
      );
    }

    return nodes;
  }

  /**
   * Internal helper for causal traversal
   */
  private async traverseDirection(
    ctx: RequestContext,
    atomId: string,
    direction: 'upstream' | 'downstream',
    maxDepth: number,
    currentDepth: number,
    visited: Set<string>,
    nodes: CausalChainNode[],
    userAccessLevel: AccessLevel
  ): Promise<void> {
    if (currentDepth > maxDepth) return;

    // Find relationships based on direction
    const relationships = await this.relationshipRepo.find({
      where: direction === 'upstream'
        ? { toAtomId: atomId }
        : { fromAtomId: atomId },
    });

    for (const rel of relationships) {
      const targetId = direction === 'upstream' ? rel.fromAtomId : rel.toAtomId;
      if (visited.has(targetId)) continue;

      const targetAtom = await this.atomRepo.findOne({ where: { id: targetId } });
      if (!targetAtom) continue;

      // Check access level
      if (
        targetAtom.knowledgeThreshold &&
        !this.hasAccessToThreshold(userAccessLevel, targetAtom.knowledgeThreshold)
      ) {
        continue;
      }

      visited.add(targetId);
      nodes.push({
        atom: targetAtom,
        relationship: rel,
        depth: currentDepth,
        direction,
      });

      // Recurse
      await this.traverseDirection(
        ctx,
        targetId,
        direction,
        maxDepth,
        currentDepth + 1,
        visited,
        nodes,
        userAccessLevel
      );
    }
  }

  /**
   * Get causal summary text for an atom
   */
  async getCausalSummary(
    ctx: RequestContext,
    atomId: string
  ): Promise<string | null> {
    const atom = await this.atomRepo.findOne({ where: { id: atomId } });
    return atom?.causalSummary || null;
  }

  /**
   * Get "why it works" explanation
   */
  async getWhyItWorks(
    ctx: RequestContext,
    atomId: string
  ): Promise<string | null> {
    const atom = await this.atomRepo.findOne({ where: { id: atomId } });
    return atom?.whyItWorks || null;
  }

  // ========================================
  // Evidence Management
  // ========================================

  /**
   * Get all claim evidence for an atom
   */
  async getClaimEvidence(
    ctx: RequestContext,
    atomId: string,
    minLevel?: EvidenceLevel
  ): Promise<ClaimEvidence[]> {
    const evidence = await this.claimEvidenceRepo.find({
      where: { atomId },
      order: { createdAt: 'DESC' },
    });

    if (minLevel) {
      const levels = Object.values(EvidenceLevel);
      const minIndex = levels.indexOf(minLevel);
      return evidence.filter((e) => {
        const eIndex = levels.indexOf(e.evidenceLevel);
        return eIndex >= minIndex;
      });
    }

    return evidence;
  }

  /**
   * Get evidence summary for an atom
   */
  async getEvidenceSummary(
    ctx: RequestContext,
    atomId: string
  ): Promise<EvidenceSummary> {
    const evidence = await this.claimEvidenceRepo.find({
      where: { atomId },
    });

    const claimsByLevel: Record<EvidenceLevel, number> = {
      [EvidenceLevel.ANECDOTAL]: 0,
      [EvidenceLevel.IN_VITRO]: 0,
      [EvidenceLevel.ANIMAL]: 0,
      [EvidenceLevel.HUMAN_PILOT]: 0,
      [EvidenceLevel.HUMAN_CONTROLLED]: 0,
      [EvidenceLevel.META_ANALYSIS]: 0,
      [EvidenceLevel.GOLD_STANDARD]: 0,
    };

    let totalStrength = 0;
    let highestLevel: EvidenceLevel | null = null;
    let highestIndex = -1;

    const levels = Object.values(EvidenceLevel);

    for (const e of evidence) {
      claimsByLevel[e.evidenceLevel]++;
      totalStrength += EVIDENCE_METADATA[e.evidenceLevel].strength;

      const levelIndex = levels.indexOf(e.evidenceLevel);
      if (levelIndex > highestIndex) {
        highestIndex = levelIndex;
        highestLevel = e.evidenceLevel;
      }
    }

    return {
      totalClaims: evidence.length,
      averageEvidenceStrength: evidence.length > 0 ? totalStrength / evidence.length : 0,
      highestEvidenceLevel: highestLevel,
      claimsByLevel,
    };
  }

  /**
   * Add claim evidence to an atom
   */
  async addClaimEvidence(
    ctx: RequestContext,
    atomId: string,
    data: Partial<ClaimEvidence>
  ): Promise<ClaimEvidence> {
    const evidence = this.claimEvidenceRepo.create({
      ...data,
      atomId,
    });
    return this.claimEvidenceRepo.save(evidence);
  }

  // ========================================
  // Efficacy Management
  // ========================================

  /**
   * Get efficacy indicators for an atom
   */
  async getEfficacyIndicators(
    ctx: RequestContext,
    atomId: string,
    highQualityOnly?: boolean
  ): Promise<EfficacyIndicator[]> {
    const indicators = await this.efficacyRepo.find({
      where: { atomId },
      order: { expectedImprovement: 'DESC' },
    });

    if (highQualityOnly) {
      const highQualityLevels = [
        EvidenceLevel.HUMAN_CONTROLLED,
        EvidenceLevel.META_ANALYSIS,
        EvidenceLevel.GOLD_STANDARD,
      ];
      return indicators.filter((i) =>
        highQualityLevels.includes(i.evidenceLevel)
      );
    }

    return indicators;
  }

  /**
   * Get efficacy summary for an atom
   */
  async getEfficacySummary(
    ctx: RequestContext,
    atomId: string
  ): Promise<EfficacySummary> {
    const indicators = await this.efficacyRepo.find({
      where: { atomId },
    });

    const highQualityLevels = [
      EvidenceLevel.HUMAN_CONTROLLED,
      EvidenceLevel.META_ANALYSIS,
      EvidenceLevel.GOLD_STANDARD,
    ];

    let totalImprovement = 0;
    let shortestWeeks = Infinity;
    let shortestTimeframe: string | null = null;
    let highQualityCount = 0;

    for (const ind of indicators) {
      totalImprovement += Number(ind.expectedImprovement);

      // Parse timeframe
      const weeks = ind.getTimeframeWeeks();
      if (weeks > 0 && weeks < shortestWeeks) {
        shortestWeeks = weeks;
        shortestTimeframe = ind.timeframe;
      }

      if (highQualityLevels.includes(ind.evidenceLevel)) {
        highQualityCount++;
      }
    }

    return {
      indicators,
      averageImprovement:
        indicators.length > 0 ? totalImprovement / indicators.length : 0,
      shortestTimeframe,
      highQualityCount,
    };
  }

  /**
   * Add efficacy indicator to an atom
   */
  async addEfficacyIndicator(
    ctx: RequestContext,
    atomId: string,
    data: Partial<EfficacyIndicator>
  ): Promise<EfficacyIndicator> {
    const indicator = this.efficacyRepo.create({
      ...data,
      atomId,
    });
    return this.efficacyRepo.save(indicator);
  }

  /**
   * Update claim evidence
   */
  async updateClaimEvidence(
    ctx: RequestContext,
    id: string,
    data: Partial<ClaimEvidence>
  ): Promise<ClaimEvidence> {
    const evidence = await this.claimEvidenceRepo.findOne({ where: { id } });
    if (!evidence) {
      throw new Error(`ClaimEvidence with id ${id} not found`);
    }
    Object.assign(evidence, data);
    return this.claimEvidenceRepo.save(evidence);
  }

  /**
   * Delete claim evidence
   */
  async deleteClaimEvidence(
    ctx: RequestContext,
    id: string
  ): Promise<boolean> {
    const result = await this.claimEvidenceRepo.delete({ id });
    return (result.affected || 0) > 0;
  }

  /**
   * Update efficacy indicator
   */
  async updateEfficacyIndicator(
    ctx: RequestContext,
    id: string,
    data: Partial<EfficacyIndicator>
  ): Promise<EfficacyIndicator> {
    const indicator = await this.efficacyRepo.findOne({ where: { id } });
    if (!indicator) {
      throw new Error(`EfficacyIndicator with id ${id} not found`);
    }
    Object.assign(indicator, data);
    return this.efficacyRepo.save(indicator);
  }

  /**
   * Delete efficacy indicator
   */
  async deleteEfficacyIndicator(
    ctx: RequestContext,
    id: string
  ): Promise<boolean> {
    const result = await this.efficacyRepo.delete({ id });
    return (result.affected || 0) > 0;
  }

  /**
   * Set knowledge threshold for an atom
   */
  async setAtomThreshold(
    ctx: RequestContext,
    atomId: string,
    threshold: KnowledgeThreshold
  ): Promise<SkincareAtom> {
    const atom = await this.atomRepo.findOne({ where: { id: atomId } });
    if (!atom) {
      throw new Error(`SkincareAtom with id ${atomId} not found`);
    }
    atom.knowledgeThreshold = threshold;
    return this.atomRepo.save(atom);
  }

  /**
   * Set "Why It Works" explanation for an atom
   */
  async setWhyItWorks(
    ctx: RequestContext,
    atomId: string,
    whyItWorks: string,
    causalSummary?: string
  ): Promise<SkincareAtom> {
    const atom = await this.atomRepo.findOne({ where: { id: atomId } });
    if (!atom) {
      throw new Error(`SkincareAtom with id ${atomId} not found`);
    }
    atom.whyItWorks = whyItWorks;
    if (causalSummary !== undefined) {
      atom.causalSummary = causalSummary;
    }
    return this.atomRepo.save(atom);
  }

  /**
   * Get atom by ID
   */
  async getAtomById(
    ctx: RequestContext,
    atomId: string
  ): Promise<SkincareAtom | null> {
    return this.atomRepo.findOne({ where: { id: atomId } });
  }

  // ========================================
  // Goldilocks Parameters
  // ========================================

  /**
   * Get Goldilocks parameters for an atom
   */
  async getGoldilocksParameters(
    ctx: RequestContext,
    atomId: string
  ): Promise<GoldilocksParameter[]> {
    return this.goldilocksRepo.find({
      where: { atomId },
      order: { parameterName: 'ASC' },
    });
  }

  /**
   * Check if a value is within Goldilocks range
   */
  isInGoldilocksRange(
    param: GoldilocksParameter,
    value: number
  ): { inRange: boolean; status: 'low' | 'optimal' | 'high' } {
    if (value < Number(param.minValue)) {
      return { inRange: false, status: 'low' };
    }
    if (value > Number(param.maxValue)) {
      return { inRange: false, status: 'high' };
    }
    return { inRange: true, status: 'optimal' };
  }

  // ========================================
  // Atom Queries
  // ========================================

  /**
   * Get atom by ID with intelligence data
   */
  async getAtomWithIntelligence(
    ctx: RequestContext,
    atomId: string,
    userAccessLevel: AccessLevel = 'public'
  ): Promise<{
    atom: SkincareAtom | null;
    accessible: boolean;
    evidenceSummary: EvidenceSummary | null;
    efficacySummary: EfficacySummary | null;
    goldilocksParameters: GoldilocksParameter[];
  }> {
    const atom = await this.atomRepo.findOne({ where: { id: atomId } });

    if (!atom) {
      return {
        atom: null,
        accessible: false,
        evidenceSummary: null,
        efficacySummary: null,
        goldilocksParameters: [],
      };
    }

    const accessible =
      !atom.knowledgeThreshold ||
      this.hasAccessToThreshold(userAccessLevel, atom.knowledgeThreshold);

    if (!accessible) {
      return {
        atom,
        accessible: false,
        evidenceSummary: null,
        efficacySummary: null,
        goldilocksParameters: [],
      };
    }

    const [evidenceSummary, efficacySummary, goldilocksParameters] =
      await Promise.all([
        this.getEvidenceSummary(ctx, atomId),
        this.getEfficacySummary(ctx, atomId),
        this.getGoldilocksParameters(ctx, atomId),
      ]);

    return {
      atom,
      accessible,
      evidenceSummary,
      efficacySummary,
      goldilocksParameters,
    };
  }

  /**
   * Search atoms with intelligence filters
   */
  async searchAtoms(
    ctx: RequestContext,
    options: {
      query?: string;
      minEvidenceLevel?: EvidenceLevel;
      thresholdRange?: { min: KnowledgeThreshold; max: KnowledgeThreshold };
      userAccessLevel?: AccessLevel;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ atoms: SkincareAtom[]; total: number }> {
    const {
      query,
      userAccessLevel = 'public',
      limit = 20,
      offset = 0,
    } = options;

    let queryBuilder = this.atomRepo.createQueryBuilder('atom');

    // Text search
    if (query) {
      queryBuilder = queryBuilder.andWhere(
        '(atom.title ILIKE :query OR atom.glanceText ILIKE :query OR atom.scanText ILIKE :query)',
        { query: `%${query}%` }
      );
    }

    // Get total before pagination
    const total = await queryBuilder.getCount();

    // Apply pagination
    queryBuilder = queryBuilder.skip(offset).take(limit);

    const atoms = await queryBuilder.getMany();

    // Filter by access level
    const accessibleAtoms = atoms.filter((atom) => {
      if (!atom.knowledgeThreshold) return true;
      return this.hasAccessToThreshold(userAccessLevel, atom.knowledgeThreshold);
    });

    return { atoms: accessibleAtoms, total };
  }

  // ========================================
  // Why Explanation (T015)
  // ========================================

  /**
   * Generate a "Why It Works" explanation for an atom
   * Finds causal paths and builds multi-level explanations
   */
  async generateWhyExplanation(
    ctx: RequestContext,
    atomId: string,
    targetAtomId?: string,
    userAccessLevel: AccessLevel = 'public'
  ): Promise<WhyExplanation | null> {
    const atom = await this.atomRepo.findOne({ where: { id: atomId } });
    if (!atom) return null;

    // If target specified, find path between atoms
    let path: CausalPathStep[] = [];
    if (targetAtomId) {
      path = await this.findCausalPath(ctx, atomId, targetAtomId, userAccessLevel);
    } else {
      // Find most significant downstream path
      const chain = await this.navigateCausalChain(
        ctx,
        atomId,
        CausalDirection.DOWNSTREAM,
        4,
        userAccessLevel
      );
      path = chain.map((node) => ({
        atom: node.atom,
        relationship: node.relationship || null,
        mechanismSummary: node.relationship?.mechanism || '',
      }));
    }

    // Calculate confidence based on path evidence
    const confidenceScore = await this.calculatePathConfidence(ctx, path);
    const evidenceStrength = await this.calculatePathEvidenceStrength(ctx, path);

    // Build progressive disclosure content
    const disclosureContent = this.buildWhyDisclosureContent(atom, path);

    return {
      summary: atom.whyItWorks || atom.causalSummary || this.generateAutoSummary(path),
      path,
      confidenceScore,
      evidenceStrength,
      disclosureContent,
    };
  }

  /**
   * Find shortest causal path between two atoms using BFS
   */
  async findCausalPath(
    ctx: RequestContext,
    fromAtomId: string,
    toAtomId: string,
    userAccessLevel: AccessLevel = 'public'
  ): Promise<CausalPathStep[]> {
    const visited = new Set<string>();
    const queue: Array<{ atomId: string; path: CausalPathStep[] }> = [];

    const startAtom = await this.atomRepo.findOne({ where: { id: fromAtomId } });
    if (!startAtom) return [];

    queue.push({
      atomId: fromAtomId,
      path: [{ atom: startAtom, relationship: null, mechanismSummary: '' }],
    });
    visited.add(fromAtomId);

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.atomId === toAtomId) {
        return current.path;
      }

      // Get all outgoing relationships
      const relationships = await this.relationshipRepo.find({
        where: { fromAtomId: current.atomId },
      });

      for (const rel of relationships) {
        if (visited.has(rel.toAtomId)) continue;

        const targetAtom = await this.atomRepo.findOne({ where: { id: rel.toAtomId } });
        if (!targetAtom) continue;

        // Check access
        if (
          targetAtom.knowledgeThreshold &&
          !this.hasAccessToThreshold(userAccessLevel, targetAtom.knowledgeThreshold)
        ) {
          continue;
        }

        visited.add(rel.toAtomId);
        queue.push({
          atomId: rel.toAtomId,
          path: [
            ...current.path,
            {
              atom: targetAtom,
              relationship: rel,
              mechanismSummary: rel.mechanism || '',
            },
          ],
        });
      }
    }

    return []; // No path found
  }

  /**
   * Calculate confidence score for a causal path
   */
  private async calculatePathConfidence(
    ctx: RequestContext,
    path: CausalPathStep[]
  ): Promise<number> {
    if (path.length === 0) return 0;

    let totalConfidence = 0;
    for (const step of path) {
      // Get evidence for this step
      const evidenceSummary = await this.getEvidenceSummary(ctx, step.atom.id);
      totalConfidence += evidenceSummary.averageEvidenceStrength;
    }

    // Average confidence, penalize longer paths slightly
    const avgConfidence = totalConfidence / path.length;
    const lengthPenalty = Math.max(0, 1 - (path.length - 1) * 0.1);

    return Math.round(avgConfidence * lengthPenalty * 100);
  }

  /**
   * Calculate overall evidence strength for a path
   */
  private async calculatePathEvidenceStrength(
    ctx: RequestContext,
    path: CausalPathStep[]
  ): Promise<number> {
    if (path.length === 0) return 0;

    let totalStrength = 0;
    for (const step of path) {
      const evidenceSummary = await this.getEvidenceSummary(ctx, step.atom.id);
      totalStrength += evidenceSummary.averageEvidenceStrength;
    }

    return Math.round((totalStrength / path.length) * 100) / 100;
  }

  /**
   * Build progressive disclosure content for "Why" explanation
   */
  private buildWhyDisclosureContent(
    startAtom: SkincareAtom,
    path: CausalPathStep[]
  ): { glance: string; scan: string; study: string } {
    // Glance: One sentence summary
    const glance = startAtom.whyItWorks
      ? startAtom.whyItWorks.split('.')[0] + '.'
      : `${startAtom.title} works through ${path.length - 1} connected mechanisms.`;

    // Scan: Key steps in the path
    const mechanisms = path
      .filter((s) => s.mechanismSummary)
      .map((s) => s.mechanismSummary)
      .slice(0, 3);
    const scan = mechanisms.length > 0
      ? `Key mechanisms: ${mechanisms.join(' → ')}`
      : startAtom.scanText || glance;

    // Study: Full path with details
    const studyParts = path.map((step, i) => {
      if (i === 0) return `Starting point: ${step.atom.title}`;
      return `→ ${step.atom.title}${step.mechanismSummary ? ` (${step.mechanismSummary})` : ''}`;
    });
    const study = studyParts.join('\n');

    return { glance, scan, study };
  }

  /**
   * Generate automatic summary from path
   */
  private generateAutoSummary(path: CausalPathStep[]): string {
    if (path.length === 0) return 'No causal information available.';
    if (path.length === 1) return `${path[0].atom.title} is a foundational concept.`;

    const start = path[0].atom.title;
    const end = path[path.length - 1].atom.title;
    return `${start} leads to ${end} through ${path.length - 1} causal step${path.length > 2 ? 's' : ''}.`;
  }

  // ========================================
  // Compatibility Analysis (T016)
  // ========================================

  /**
   * Analyze compatibility between multiple ingredients/products
   */
  async analyzeCompatibility(
    ctx: RequestContext,
    atomIds: string[],
    userAccessLevel: AccessLevel = 'public'
  ): Promise<CompatibilityResult> {
    const atoms = await this.atomRepo.find({
      where: { id: In(atomIds) },
    });

    // Filter by access level
    const accessibleAtoms = atoms.filter((atom) => {
      if (!atom.knowledgeThreshold) return true;
      return this.hasAccessToThreshold(userAccessLevel, atom.knowledgeThreshold);
    });

    const interactions: IngredientInteraction[] = [];
    const synergies: IngredientInteraction[] = [];
    const conflicts: IngredientInteraction[] = [];
    const warnings: string[] = [];
    const tips: string[] = [];

    // Check all pairwise interactions
    for (let i = 0; i < accessibleAtoms.length; i++) {
      for (let j = i + 1; j < accessibleAtoms.length; j++) {
        const interaction = await this.checkInteraction(
          ctx,
          accessibleAtoms[i],
          accessibleAtoms[j]
        );

        if (interaction) {
          interactions.push(interaction);

          if (interaction.interactionType === InteractionType.SYNERGY) {
            synergies.push(interaction);
            tips.push(interaction.recommendation);
          } else if (interaction.interactionType === InteractionType.CONFLICT) {
            conflicts.push(interaction);
            warnings.push(`${interaction.atomA.title} + ${interaction.atomB.title}: ${interaction.mechanism}`);
          }
        }
      }
    }

    // Calculate overall compatibility score
    const overallScore = this.calculateCompatibilityScore(synergies, conflicts, accessibleAtoms.length);

    // Generate sequence recommendation (sort by pH, weight, etc.)
    const sequenceRecommendation = this.generateSequenceRecommendation(accessibleAtoms, interactions);

    return {
      overallScore,
      compatible: overallScore >= 60 && conflicts.filter((c) => c.severity >= 7).length === 0,
      interactions,
      synergies,
      conflicts,
      sequenceRecommendation,
      warnings,
      tips: tips.slice(0, 5), // Top 5 tips
    };
  }

  /**
   * Check for interaction between two atoms
   */
  private async checkInteraction(
    ctx: RequestContext,
    atomA: SkincareAtom,
    atomB: SkincareAtom
  ): Promise<IngredientInteraction | null> {
    // Look for direct relationship between atoms
    const relationship = await this.relationshipRepo.findOne({
      where: [
        { fromAtomId: atomA.id, toAtomId: atomB.id },
        { fromAtomId: atomB.id, toAtomId: atomA.id },
      ],
    });

    if (!relationship) {
      return null; // No known interaction
    }

    // Determine interaction type from relationship metadata
    const interactionType = this.determineInteractionType(relationship);
    const severity = this.calculateSeverity(relationship);

    return {
      atomA,
      atomB,
      interactionType,
      synergyType: interactionType === InteractionType.SYNERGY
        ? this.determineSynergyType(relationship)
        : undefined,
      conflictType: interactionType === InteractionType.CONFLICT
        ? this.determineConflictType(relationship)
        : undefined,
      severity,
      mechanism: relationship.mechanism || 'Unknown mechanism',
      recommendation: this.generateRecommendation(interactionType, atomA, atomB, relationship),
      waitTime: this.determineWaitTime(interactionType, severity),
    };
  }

  /**
   * Determine interaction type from relationship
   */
  private determineInteractionType(relationship: SkincareRelationship): InteractionType {
    const relType = relationship.relationshipType?.toLowerCase() || '';

    if (relType.includes('enhance') || relType.includes('boost') || relType.includes('synerg')) {
      return InteractionType.SYNERGY;
    }
    if (relType.includes('conflict') || relType.includes('inhibit') || relType.includes('neutral')) {
      return InteractionType.CONFLICT;
    }
    if (relType.includes('sequence') || relType.includes('timing')) {
      return InteractionType.SEQUENCING;
    }

    return InteractionType.NEUTRAL;
  }

  /**
   * Determine synergy type
   */
  private determineSynergyType(relationship: SkincareRelationship): SynergyType {
    const mechanism = (relationship.mechanism || '').toLowerCase();

    if (mechanism.includes('enhance') || mechanism.includes('amplif')) {
      return SynergyType.ENHANCEMENT;
    }
    if (mechanism.includes('stabil')) {
      return SynergyType.STABILIZATION;
    }
    if (mechanism.includes('penetr') || mechanism.includes('absorb')) {
      return SynergyType.PENETRATION;
    }
    if (mechanism.includes('protect') || mechanism.includes('buffer')) {
      return SynergyType.PROTECTION;
    }

    return SynergyType.COMPLEMENTARY;
  }

  /**
   * Determine conflict type
   */
  private determineConflictType(relationship: SkincareRelationship): ConflictType {
    const mechanism = (relationship.mechanism || '').toLowerCase();

    if (mechanism.includes('inactiv') || mechanism.includes('cancel')) {
      return ConflictType.INACTIVATION;
    }
    if (mechanism.includes('irritat') || mechanism.includes('sensitiz')) {
      return ConflictType.IRRITATION;
    }
    if (mechanism.includes('ph') || mechanism.includes('acid') || mechanism.includes('base')) {
      return ConflictType.PH_INCOMPATIBILITY;
    }
    if (mechanism.includes('penetr') || mechanism.includes('absorb')) {
      return ConflictType.PENETRATION_BARRIER;
    }
    if (mechanism.includes('oxid') || mechanism.includes('degrad')) {
      return ConflictType.OXIDATION;
    }

    return ConflictType.DILUTION;
  }

  /**
   * Calculate severity of interaction (1-10)
   */
  private calculateSeverity(relationship: SkincareRelationship): number {
    // Base severity on relationship strength if available
    const strength = Number(relationship.strength) || 5;
    return Math.min(10, Math.max(1, Math.round(strength)));
  }

  /**
   * Generate recommendation based on interaction
   */
  private generateRecommendation(
    interactionType: InteractionType,
    atomA: SkincareAtom,
    atomB: SkincareAtom,
    relationship: SkincareRelationship
  ): string {
    switch (interactionType) {
      case InteractionType.SYNERGY:
        return `Great combination! ${atomA.title} and ${atomB.title} work well together.`;
      case InteractionType.CONFLICT:
        return `Avoid using ${atomA.title} and ${atomB.title} in the same routine. Use them at different times of day.`;
      case InteractionType.SEQUENCING:
        return `Apply ${atomA.title} before ${atomB.title} for best results.`;
      default:
        return `${atomA.title} and ${atomB.title} can be used together safely.`;
    }
  }

  /**
   * Determine wait time between applications
   */
  private determineWaitTime(interactionType: InteractionType, severity: number): string | undefined {
    if (interactionType === InteractionType.CONFLICT) {
      if (severity >= 8) return '12 hours (use in separate routines)';
      if (severity >= 5) return '20-30 minutes';
      return '10-15 minutes';
    }
    if (interactionType === InteractionType.SEQUENCING) {
      return '1-2 minutes';
    }
    return undefined;
  }

  /**
   * Calculate overall compatibility score
   */
  private calculateCompatibilityScore(
    synergies: IngredientInteraction[],
    conflicts: IngredientInteraction[],
    totalAtoms: number
  ): number {
    if (totalAtoms < 2) return 100;

    const maxPairs = (totalAtoms * (totalAtoms - 1)) / 2;
    const synergyBonus = synergies.reduce((sum, s) => sum + s.severity, 0) * 2;
    const conflictPenalty = conflicts.reduce((sum, c) => sum + c.severity * 3, 0);

    const baseScore = 70;
    const adjustedScore = baseScore + (synergyBonus / maxPairs) * 15 - (conflictPenalty / maxPairs) * 20;

    return Math.round(Math.min(100, Math.max(0, adjustedScore)));
  }

  /**
   * Generate optimal application sequence
   */
  private generateSequenceRecommendation(
    atoms: SkincareAtom[],
    interactions: IngredientInteraction[]
  ): SkincareAtom[] {
    // Simple heuristic: sort by typical skincare order
    // (cleansers -> toners -> serums -> moisturizers -> SPF)
    // For now, return atoms in original order
    // A more sophisticated implementation would use graph sorting
    return [...atoms];
  }
}
