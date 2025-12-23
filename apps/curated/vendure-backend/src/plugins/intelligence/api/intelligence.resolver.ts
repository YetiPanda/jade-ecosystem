/**
 * Intelligence Resolvers for JADE Spa Marketplace
 *
 * DermaLogica Intelligence MVP Integration
 *
 * Implements GraphQL resolvers for:
 * - Causal chain navigation
 * - Evidence and efficacy queries
 * - Knowledge threshold access control
 * - Progressive disclosure content
 * - Claim evidence and efficacy indicators
 */

import { Args, Query, Resolver, ResolveField, Parent, Mutation } from '@nestjs/graphql';
import { Ctx, RequestContext, Allow, Permission } from '@vendure/core';
import {
  IntelligenceService,
  AccessLevel,
  CausalChainNode,
  EvidenceSummary,
  EfficacySummary,
  WhyExplanation,
  CompatibilityResult,
  CausalPathStep,
} from '../services/intelligence.service';
import {
  IntelligenceEmbeddingService,
  IntelligenceSearchResult,
} from '../services/intelligence-embedding.service';
import { SkincareAtom, GoldilocksParameter } from '../entities/ska';
import { ClaimEvidence } from '../entities/claim-evidence.entity';
import { EfficacyIndicator } from '../entities/efficacy-indicator.entity';
import {
  KnowledgeThreshold,
  EvidenceLevel,
  CausalDirection,
  DisclosureLevel,
  THRESHOLD_METADATA,
  EVIDENCE_METADATA,
} from '../types/intelligence.enums';

/**
 * Input for adding claim evidence
 */
interface AddClaimEvidenceInput {
  atomId: string;
  claim: string;
  evidenceLevel: EvidenceLevel;
  studyType?: string;
  sampleSize?: number;
  duration?: string;
  findings?: string;
  sourceUrl?: string;
  citation?: string;
  publicationYear?: number;
  peerReviewed?: boolean;
}

/**
 * Input for adding efficacy indicator
 */
interface AddEfficacyIndicatorInput {
  atomId: string;
  indicatorType: string;
  metric: string;
  timeframe: string;
  expectedImprovement: number;
  confidenceInterval?: number;
  evidenceLevel: EvidenceLevel;
  conditions?: string;
}

/**
 * Input for intelligence search filters
 */
interface IntelligenceSearchFiltersInput {
  thresholds?: KnowledgeThreshold[];
  minEvidenceLevel?: EvidenceLevel;
  atomTypes?: string[];
  minHydration?: number;
  minAntiAging?: number;
  maxSensitivity?: number;
}

/**
 * Intelligence Query Resolver
 */
@Resolver()
export class IntelligenceQueryResolver {
  constructor(
    private intelligenceService: IntelligenceService,
    private embeddingService: IntelligenceEmbeddingService
  ) {}

  /**
   * Navigate causal chain from an atom
   */
  @Query('navigateCausalChain')
  @Allow(Permission.Public)
  async navigateCausalChain(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string,
    @Args('direction') direction: CausalDirection = CausalDirection.BOTH,
    @Args('maxDepth') maxDepth: number = 3,
    @Args('accessLevel') accessLevel: AccessLevel = 'public'
  ): Promise<CausalChainNode[]> {
    return this.intelligenceService.navigateCausalChain(
      ctx,
      atomId,
      direction,
      maxDepth,
      accessLevel
    );
  }

  /**
   * Get atom with all intelligence data
   */
  @Query('atomWithIntelligence')
  @Allow(Permission.Public)
  async atomWithIntelligence(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string,
    @Args('accessLevel') accessLevel: AccessLevel = 'public'
  ) {
    return this.intelligenceService.getAtomWithIntelligence(ctx, atomId, accessLevel);
  }

  /**
   * Get claim evidence for an atom
   */
  @Query('claimEvidence')
  @Allow(Permission.Public)
  async claimEvidence(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string,
    @Args('minLevel') minLevel?: EvidenceLevel
  ): Promise<ClaimEvidence[]> {
    return this.intelligenceService.getClaimEvidence(ctx, atomId, minLevel);
  }

  /**
   * Get evidence summary for an atom
   */
  @Query('evidenceSummary')
  @Allow(Permission.Public)
  async evidenceSummary(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string
  ): Promise<EvidenceSummary> {
    return this.intelligenceService.getEvidenceSummary(ctx, atomId);
  }

  /**
   * Get efficacy indicators for an atom
   */
  @Query('efficacyIndicators')
  @Allow(Permission.Public)
  async efficacyIndicators(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string,
    @Args('highQualityOnly') highQualityOnly?: boolean
  ): Promise<EfficacyIndicator[]> {
    return this.intelligenceService.getEfficacyIndicators(ctx, atomId, highQualityOnly);
  }

  /**
   * Get efficacy summary for an atom
   */
  @Query('efficacySummary')
  @Allow(Permission.Public)
  async efficacySummary(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string
  ): Promise<EfficacySummary> {
    return this.intelligenceService.getEfficacySummary(ctx, atomId);
  }

  /**
   * Get Goldilocks parameters for an atom
   */
  @Query('goldilocksParameters')
  @Allow(Permission.Public)
  async goldilocksParameters(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string
  ): Promise<GoldilocksParameter[]> {
    return this.intelligenceService.getGoldilocksParameters(ctx, atomId);
  }

  /**
   * Get causal summary for an atom
   */
  @Query('causalSummary')
  @Allow(Permission.Public)
  async causalSummary(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string
  ): Promise<string | null> {
    return this.intelligenceService.getCausalSummary(ctx, atomId);
  }

  /**
   * Get "why it works" explanation
   */
  @Query('whyItWorks')
  @Allow(Permission.Public)
  async whyItWorks(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string
  ): Promise<string | null> {
    return this.intelligenceService.getWhyItWorks(ctx, atomId);
  }

  /**
   * Search atoms with intelligence filters
   */
  @Query('searchAtomsWithIntelligence')
  @Allow(Permission.Public)
  async searchAtomsWithIntelligence(
    @Ctx() ctx: RequestContext,
    @Args('query') query?: string,
    @Args('minEvidenceLevel') minEvidenceLevel?: EvidenceLevel,
    @Args('accessLevel') accessLevel?: AccessLevel,
    @Args('limit') limit?: number,
    @Args('offset') offset?: number
  ) {
    return this.intelligenceService.searchAtoms(ctx, {
      query,
      minEvidenceLevel,
      userAccessLevel: accessLevel,
      limit,
      offset,
    });
  }

  /**
   * Get knowledge threshold metadata
   */
  @Query('knowledgeThresholdMetadata')
  @Allow(Permission.Public)
  async knowledgeThresholdMetadata(): Promise<typeof THRESHOLD_METADATA> {
    return THRESHOLD_METADATA;
  }

  /**
   * Get evidence level metadata
   */
  @Query('evidenceLevelMetadata')
  @Allow(Permission.Public)
  async evidenceLevelMetadata(): Promise<typeof EVIDENCE_METADATA> {
    return EVIDENCE_METADATA;
  }

  /**
   * Check if user has access to a threshold
   */
  @Query('hasAccessToThreshold')
  @Allow(Permission.Public)
  async hasAccessToThreshold(
    @Ctx() ctx: RequestContext,
    @Args('accessLevel') accessLevel: AccessLevel,
    @Args('threshold') threshold: KnowledgeThreshold
  ): Promise<boolean> {
    return this.intelligenceService.hasAccessToThreshold(accessLevel, threshold);
  }

  /**
   * Get maximum accessible threshold for user
   */
  @Query('maxAccessibleThreshold')
  @Allow(Permission.Public)
  async maxAccessibleThreshold(
    @Ctx() ctx: RequestContext,
    @Args('accessLevel') accessLevel: AccessLevel
  ): Promise<KnowledgeThreshold> {
    return this.intelligenceService.getMaxAccessibleThreshold(accessLevel);
  }

  // ========================================
  // Intelligence MVP Queries (Phase 2)
  // ========================================

  /**
   * Navigate causal chain from an atom (Intelligence schema)
   */
  @Query('intelligenceCausalChain')
  @Allow(Permission.Public)
  async intelligenceCausalChain(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string,
    @Args('direction') direction: CausalDirection = CausalDirection.BOTH,
    @Args('maxDepth') maxDepth: number = 3,
    @Args('accessLevel') accessLevel: AccessLevel = 'public'
  ): Promise<CausalChainNode[]> {
    return this.intelligenceService.navigateCausalChain(
      ctx,
      atomId,
      direction,
      maxDepth,
      accessLevel
    );
  }

  /**
   * Find causal path between two atoms
   */
  @Query('intelligenceFindPath')
  @Allow(Permission.Public)
  async intelligenceFindPath(
    @Ctx() ctx: RequestContext,
    @Args('fromAtomId') fromAtomId: string,
    @Args('toAtomId') toAtomId: string,
    @Args('accessLevel') accessLevel: AccessLevel = 'public'
  ): Promise<CausalPathStep[]> {
    return this.intelligenceService.findCausalPath(
      ctx,
      fromAtomId,
      toAtomId,
      accessLevel
    );
  }

  /**
   * Get "Why It Works" explanation
   */
  @Query('intelligenceWhyExplanation')
  @Allow(Permission.Public)
  async intelligenceWhyExplanation(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string,
    @Args('targetAtomId') targetAtomId?: string,
    @Args('accessLevel') accessLevel: AccessLevel = 'public'
  ): Promise<WhyExplanation | null> {
    return this.intelligenceService.generateWhyExplanation(
      ctx,
      atomId,
      targetAtomId,
      accessLevel
    );
  }

  /**
   * Get atom with full intelligence data
   */
  @Query('intelligenceAtom')
  @Allow(Permission.Public)
  async intelligenceAtom(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string,
    @Args('accessLevel') accessLevel: AccessLevel = 'public'
  ) {
    return this.intelligenceService.getAtomWithIntelligence(ctx, atomId, accessLevel);
  }

  /**
   * Get claim evidence for an atom (Intelligence schema)
   */
  @Query('intelligenceClaimEvidence')
  @Allow(Permission.Public)
  async intelligenceClaimEvidence(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string,
    @Args('minLevel') minLevel?: EvidenceLevel
  ): Promise<ClaimEvidence[]> {
    return this.intelligenceService.getClaimEvidence(ctx, atomId, minLevel);
  }

  /**
   * Get evidence summary for an atom (Intelligence schema)
   */
  @Query('intelligenceEvidenceSummary')
  @Allow(Permission.Public)
  async intelligenceEvidenceSummary(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string
  ): Promise<EvidenceSummary> {
    return this.intelligenceService.getEvidenceSummary(ctx, atomId);
  }

  /**
   * Get efficacy indicators for an atom (Intelligence schema)
   */
  @Query('intelligenceEfficacyIndicators')
  @Allow(Permission.Public)
  async intelligenceEfficacyIndicators(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string,
    @Args('highQualityOnly') highQualityOnly?: boolean
  ): Promise<EfficacyIndicator[]> {
    return this.intelligenceService.getEfficacyIndicators(ctx, atomId, highQualityOnly);
  }

  /**
   * Get efficacy summary for an atom (Intelligence schema)
   */
  @Query('intelligenceEfficacySummary')
  @Allow(Permission.Public)
  async intelligenceEfficacySummary(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string
  ): Promise<EfficacySummary> {
    return this.intelligenceService.getEfficacySummary(ctx, atomId);
  }

  /**
   * Analyze compatibility between ingredients
   */
  @Query('intelligenceAnalyzeCompatibility')
  @Allow(Permission.Public)
  async intelligenceAnalyzeCompatibility(
    @Ctx() ctx: RequestContext,
    @Args('atomIds') atomIds: string[],
    @Args('accessLevel') accessLevel: AccessLevel = 'public'
  ): Promise<CompatibilityResult> {
    return this.intelligenceService.analyzeCompatibility(ctx, atomIds, accessLevel);
  }

  /**
   * Search with intelligence filters (hybrid search)
   */
  @Query('intelligenceSearch')
  @Allow(Permission.Public)
  async intelligenceSearch(
    @Ctx() ctx: RequestContext,
    @Args('query') query: string,
    @Args('filters') filters?: IntelligenceSearchFiltersInput,
    @Args('limit') limit: number = 10,
    @Args('semanticWeight') semanticWeight: number = 0.6,
    @Args('tensorWeight') tensorWeight: number = 0.4
  ): Promise<{ results: IntelligenceSearchResult[]; totalCount: number; query: string; executionTimeMs: number }> {
    const startTime = Date.now();
    const results = await this.embeddingService.intelligenceSearch({
      query,
      limit,
      semanticWeight,
      tensorWeight,
      thresholdFilter: filters?.thresholds,
      minEvidenceLevel: filters?.minEvidenceLevel,
      atomTypes: filters?.atomTypes,
      tensorFilters: {
        minHydration: filters?.minHydration,
        minAntiAging: filters?.minAntiAging,
        maxSensitivity: filters?.maxSensitivity,
      },
    });
    const executionTimeMs = Date.now() - startTime;

    return {
      results,
      totalCount: results.length,
      query,
      executionTimeMs,
    };
  }

  /**
   * Find similar atoms by tensor profile
   */
  @Query('intelligenceFindSimilar')
  @Allow(Permission.Public)
  async intelligenceFindSimilar(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string,
    @Args('limit') limit: number = 10
  ): Promise<IntelligenceSearchResult[]> {
    return this.embeddingService.findSimilarByTensor(atomId, limit);
  }

  /**
   * Get Goldilocks parameters for an atom (Intelligence schema)
   */
  @Query('intelligenceGoldilocksParameters')
  @Allow(Permission.Public)
  async intelligenceGoldilocksParameters(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string
  ): Promise<GoldilocksParameter[]> {
    return this.intelligenceService.getGoldilocksParameters(ctx, atomId);
  }

  /**
   * Check if user has access to threshold (Intelligence schema)
   */
  @Query('intelligenceCheckAccess')
  @Allow(Permission.Public)
  async intelligenceCheckAccess(
    @Ctx() ctx: RequestContext,
    @Args('threshold') threshold: KnowledgeThreshold,
    @Args('accessLevel') accessLevel: AccessLevel
  ): Promise<boolean> {
    return this.intelligenceService.hasAccessToThreshold(accessLevel, threshold);
  }

  /**
   * Get max accessible threshold for access level (Intelligence schema)
   */
  @Query('intelligenceMaxThreshold')
  @Allow(Permission.Public)
  async intelligenceMaxThreshold(
    @Ctx() ctx: RequestContext,
    @Args('accessLevel') accessLevel: AccessLevel
  ): Promise<KnowledgeThreshold> {
    return this.intelligenceService.getMaxAccessibleThreshold(accessLevel);
  }
}

/**
 * Intelligence Mutation Resolver
 */
@Resolver()
export class IntelligenceMutationResolver {
  constructor(
    private intelligenceService: IntelligenceService,
    private embeddingService: IntelligenceEmbeddingService
  ) {}

  /**
   * Add claim evidence to an atom
   */
  @Mutation('addClaimEvidence')
  @Allow(Permission.UpdateCatalog, Permission.SuperAdmin)
  async addClaimEvidence(
    @Ctx() ctx: RequestContext,
    @Args('input') input: AddClaimEvidenceInput
  ): Promise<ClaimEvidence> {
    return this.intelligenceService.addClaimEvidence(ctx, input.atomId, {
      claim: input.claim,
      evidenceLevel: input.evidenceLevel,
      studyType: input.studyType,
      sampleSize: input.sampleSize,
      duration: input.duration,
      findings: input.findings,
      sourceUrl: input.sourceUrl,
      citation: input.citation,
      publicationYear: input.publicationYear,
      peerReviewed: input.peerReviewed ?? false,
    });
  }

  /**
   * Add efficacy indicator to an atom
   */
  @Mutation('addEfficacyIndicator')
  @Allow(Permission.UpdateCatalog, Permission.SuperAdmin)
  async addEfficacyIndicator(
    @Ctx() ctx: RequestContext,
    @Args('input') input: AddEfficacyIndicatorInput
  ): Promise<EfficacyIndicator> {
    return this.intelligenceService.addEfficacyIndicator(ctx, input.atomId, {
      indicatorType: input.indicatorType,
      metric: input.metric,
      timeframe: input.timeframe,
      expectedImprovement: input.expectedImprovement,
      confidenceInterval: input.confidenceInterval,
      evidenceLevel: input.evidenceLevel,
      conditions: input.conditions,
    });
  }

  // ========================================
  // Intelligence MVP Mutations (Phase 2)
  // ========================================

  /**
   * Add claim evidence (Intelligence schema)
   */
  @Mutation('intelligenceAddClaimEvidence')
  @Allow(Permission.UpdateCatalog, Permission.SuperAdmin)
  async intelligenceAddClaimEvidence(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string,
    @Args('input') input: AddClaimEvidenceInput
  ): Promise<ClaimEvidence> {
    return this.intelligenceService.addClaimEvidence(ctx, atomId, {
      claim: input.claim,
      evidenceLevel: input.evidenceLevel,
      studyType: input.studyType,
      sampleSize: input.sampleSize,
      duration: input.duration,
      findings: input.findings,
      sourceUrl: input.sourceUrl,
      citation: input.citation,
      publicationYear: input.publicationYear,
      peerReviewed: input.peerReviewed ?? false,
    });
  }

  /**
   * Update claim evidence
   */
  @Mutation('intelligenceUpdateClaimEvidence')
  @Allow(Permission.UpdateCatalog, Permission.SuperAdmin)
  async intelligenceUpdateClaimEvidence(
    @Ctx() ctx: RequestContext,
    @Args('id') id: string,
    @Args('input') input: AddClaimEvidenceInput
  ): Promise<ClaimEvidence> {
    return this.intelligenceService.updateClaimEvidence(ctx, id, {
      claim: input.claim,
      evidenceLevel: input.evidenceLevel,
      studyType: input.studyType,
      sampleSize: input.sampleSize,
      duration: input.duration,
      findings: input.findings,
      sourceUrl: input.sourceUrl,
      citation: input.citation,
      publicationYear: input.publicationYear,
      peerReviewed: input.peerReviewed,
    });
  }

  /**
   * Delete claim evidence
   */
  @Mutation('intelligenceDeleteClaimEvidence')
  @Allow(Permission.UpdateCatalog, Permission.SuperAdmin)
  async intelligenceDeleteClaimEvidence(
    @Ctx() ctx: RequestContext,
    @Args('id') id: string
  ): Promise<boolean> {
    return this.intelligenceService.deleteClaimEvidence(ctx, id);
  }

  /**
   * Add efficacy indicator (Intelligence schema)
   */
  @Mutation('intelligenceAddEfficacyIndicator')
  @Allow(Permission.UpdateCatalog, Permission.SuperAdmin)
  async intelligenceAddEfficacyIndicator(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string,
    @Args('input') input: AddEfficacyIndicatorInput
  ): Promise<EfficacyIndicator> {
    return this.intelligenceService.addEfficacyIndicator(ctx, atomId, {
      indicatorType: input.indicatorType,
      metric: input.metric,
      timeframe: input.timeframe,
      expectedImprovement: input.expectedImprovement,
      confidenceInterval: input.confidenceInterval,
      evidenceLevel: input.evidenceLevel,
      conditions: input.conditions,
    });
  }

  /**
   * Update efficacy indicator
   */
  @Mutation('intelligenceUpdateEfficacyIndicator')
  @Allow(Permission.UpdateCatalog, Permission.SuperAdmin)
  async intelligenceUpdateEfficacyIndicator(
    @Ctx() ctx: RequestContext,
    @Args('id') id: string,
    @Args('input') input: AddEfficacyIndicatorInput
  ): Promise<EfficacyIndicator> {
    return this.intelligenceService.updateEfficacyIndicator(ctx, id, {
      indicatorType: input.indicatorType,
      metric: input.metric,
      timeframe: input.timeframe,
      expectedImprovement: input.expectedImprovement,
      confidenceInterval: input.confidenceInterval,
      evidenceLevel: input.evidenceLevel,
      conditions: input.conditions,
    });
  }

  /**
   * Delete efficacy indicator
   */
  @Mutation('intelligenceDeleteEfficacyIndicator')
  @Allow(Permission.UpdateCatalog, Permission.SuperAdmin)
  async intelligenceDeleteEfficacyIndicator(
    @Ctx() ctx: RequestContext,
    @Args('id') id: string
  ): Promise<boolean> {
    return this.intelligenceService.deleteEfficacyIndicator(ctx, id);
  }

  /**
   * Set atom knowledge threshold
   */
  @Mutation('intelligenceSetAtomThreshold')
  @Allow(Permission.UpdateCatalog, Permission.SuperAdmin)
  async intelligenceSetAtomThreshold(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string,
    @Args('threshold') threshold: KnowledgeThreshold
  ): Promise<SkincareAtom> {
    return this.intelligenceService.setAtomThreshold(ctx, atomId, threshold);
  }

  /**
   * Set "Why It Works" explanation
   */
  @Mutation('intelligenceSetWhyItWorks')
  @Allow(Permission.UpdateCatalog, Permission.SuperAdmin)
  async intelligenceSetWhyItWorks(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string,
    @Args('whyItWorks') whyItWorks: string,
    @Args('causalSummary') causalSummary?: string
  ): Promise<SkincareAtom> {
    return this.intelligenceService.setWhyItWorks(ctx, atomId, whyItWorks, causalSummary);
  }

  /**
   * Sync atom embedding to vector database
   */
  @Mutation('intelligenceSyncEmbedding')
  @Allow(Permission.UpdateCatalog, Permission.SuperAdmin)
  async intelligenceSyncEmbedding(
    @Ctx() ctx: RequestContext,
    @Args('atomId') atomId: string
  ): Promise<boolean> {
    try {
      const atom = await this.intelligenceService.getAtomById(ctx, atomId);
      if (!atom) {
        return false;
      }
      await this.embeddingService.upsertAtomEmbedding(atom);
      return true;
    } catch (error) {
      console.error('Failed to sync embedding:', error);
      return false;
    }
  }

  /**
   * Batch sync embeddings
   */
  @Mutation('intelligenceBatchSyncEmbeddings')
  @Allow(Permission.UpdateCatalog, Permission.SuperAdmin)
  async intelligenceBatchSyncEmbeddings(
    @Ctx() ctx: RequestContext,
    @Args('atomIds') atomIds: string[]
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    const atoms: SkincareAtom[] = [];
    for (const atomId of atomIds) {
      const atom = await this.intelligenceService.getAtomById(ctx, atomId);
      if (atom) {
        atoms.push(atom);
      }
    }
    return this.embeddingService.batchUpsertEmbeddings(atoms);
  }
}

/**
 * SkincareAtom Intelligence Extension Resolver
 */
@Resolver('SkincareAtom')
export class SkincareAtomIntelligenceResolver {
  constructor(private intelligenceService: IntelligenceService) {}

  /**
   * Field resolver for claim evidence
   */
  @ResolveField('claimEvidences')
  async claimEvidences(
    @Ctx() ctx: RequestContext,
    @Parent() atom: SkincareAtom
  ): Promise<ClaimEvidence[]> {
    return this.intelligenceService.getClaimEvidence(ctx, atom.id);
  }

  /**
   * Field resolver for efficacy indicators
   */
  @ResolveField('efficacyIndicators')
  async efficacyIndicators(
    @Ctx() ctx: RequestContext,
    @Parent() atom: SkincareAtom
  ): Promise<EfficacyIndicator[]> {
    return this.intelligenceService.getEfficacyIndicators(ctx, atom.id);
  }

  /**
   * Field resolver for evidence summary
   */
  @ResolveField('evidenceSummary')
  async evidenceSummary(
    @Ctx() ctx: RequestContext,
    @Parent() atom: SkincareAtom
  ): Promise<EvidenceSummary> {
    return this.intelligenceService.getEvidenceSummary(ctx, atom.id);
  }

  /**
   * Field resolver for efficacy summary
   */
  @ResolveField('efficacySummary')
  async efficacySummary(
    @Ctx() ctx: RequestContext,
    @Parent() atom: SkincareAtom
  ): Promise<EfficacySummary> {
    return this.intelligenceService.getEfficacySummary(ctx, atom.id);
  }

  /**
   * Field resolver for progressive content
   */
  @ResolveField('progressiveContent')
  async progressiveContent(
    @Ctx() ctx: RequestContext,
    @Parent() atom: SkincareAtom
  ) {
    return this.intelligenceService.getProgressiveContent(atom);
  }

  /**
   * Field resolver for content at specific disclosure level
   */
  @ResolveField('contentAtLevel')
  async contentAtLevel(
    @Ctx() ctx: RequestContext,
    @Parent() atom: SkincareAtom,
    @Args('level') level: DisclosureLevel = DisclosureLevel.GLANCE
  ): Promise<string> {
    return this.intelligenceService.getContentAtLevel(atom, level);
  }

  /**
   * Field resolver for threshold metadata
   */
  @ResolveField('thresholdMetadata')
  async thresholdMetadata(
    @Ctx() ctx: RequestContext,
    @Parent() atom: SkincareAtom
  ) {
    if (!atom.knowledgeThreshold) {
      return null;
    }
    return THRESHOLD_METADATA[atom.knowledgeThreshold];
  }
}

/**
 * ClaimEvidence Resolver
 */
@Resolver('ClaimEvidence')
export class ClaimEvidenceResolver {
  /**
   * Field resolver for evidence strength (0-1)
   */
  @ResolveField('evidenceStrength')
  async evidenceStrength(
    @Parent() evidence: ClaimEvidence
  ): Promise<number> {
    return evidence.getEvidenceStrength();
  }

  /**
   * Field resolver for formatted citation
   */
  @ResolveField('formattedCitation')
  async formattedCitation(
    @Parent() evidence: ClaimEvidence
  ): Promise<string> {
    return evidence.formatCitation();
  }

  /**
   * Field resolver for evidence level metadata
   */
  @ResolveField('levelMetadata')
  async levelMetadata(
    @Parent() evidence: ClaimEvidence
  ) {
    return EVIDENCE_METADATA[evidence.evidenceLevel];
  }
}

/**
 * EfficacyIndicator Resolver
 */
@Resolver('EfficacyIndicator')
export class EfficacyIndicatorResolver {
  /**
   * Field resolver for improvement range
   */
  @ResolveField('improvementRange')
  async improvementRange(
    @Parent() indicator: EfficacyIndicator
  ) {
    return indicator.getImprovementRange();
  }

  /**
   * Field resolver for formatted improvement
   */
  @ResolveField('formattedImprovement')
  async formattedImprovement(
    @Parent() indicator: EfficacyIndicator
  ): Promise<string> {
    return indicator.formatImprovement();
  }

  /**
   * Field resolver for high quality evidence check
   */
  @ResolveField('hasHighQualityEvidence')
  async hasHighQualityEvidence(
    @Parent() indicator: EfficacyIndicator
  ): Promise<boolean> {
    return indicator.hasHighQualityEvidence();
  }

  /**
   * Field resolver for timeframe in weeks
   */
  @ResolveField('timeframeWeeks')
  async timeframeWeeks(
    @Parent() indicator: EfficacyIndicator
  ): Promise<number> {
    return indicator.getTimeframeWeeks();
  }

  /**
   * Field resolver for evidence level metadata
   */
  @ResolveField('levelMetadata')
  async levelMetadata(
    @Parent() indicator: EfficacyIndicator
  ) {
    return EVIDENCE_METADATA[indicator.evidenceLevel];
  }
}

/**
 * CausalChainNode Resolver
 */
@Resolver('CausalChainNode')
export class CausalChainNodeResolver {
  /**
   * Field resolver for atom's progressive content
   */
  @ResolveField('glanceText')
  async glanceText(
    @Parent() node: CausalChainNode
  ): Promise<string> {
    return node.atom.glanceText;
  }

  /**
   * Field resolver for relationship type
   */
  @ResolveField('relationshipType')
  async relationshipType(
    @Parent() node: CausalChainNode
  ): Promise<string | null> {
    return node.relationship?.relationshipType || null;
  }
}
