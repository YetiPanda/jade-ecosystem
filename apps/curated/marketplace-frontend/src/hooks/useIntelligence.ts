/**
 * Intelligence MVP Hooks
 *
 * DermaLogica Intelligence Integration - Causal Chains, Evidence, Compatibility
 */

import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { useState, useCallback } from 'react';
import {
  INTELLIGENCE_CAUSAL_CHAIN,
  INTELLIGENCE_FIND_PATH,
  INTELLIGENCE_WHY_EXPLANATION,
  INTELLIGENCE_ATOM,
  INTELLIGENCE_CLAIM_EVIDENCE,
  INTELLIGENCE_EVIDENCE_SUMMARY,
  INTELLIGENCE_EFFICACY_INDICATORS,
  INTELLIGENCE_ANALYZE_COMPATIBILITY,
  INTELLIGENCE_SEARCH,
  INTELLIGENCE_FIND_SIMILAR,
  INTELLIGENCE_CHECK_ACCESS,
  INTELLIGENCE_MAX_THRESHOLD,
  INTELLIGENCE_ADD_CLAIM_EVIDENCE,
  INTELLIGENCE_UPDATE_CLAIM_EVIDENCE,
  INTELLIGENCE_DELETE_CLAIM_EVIDENCE,
  INTELLIGENCE_SET_ATOM_THRESHOLD,
  INTELLIGENCE_SET_WHY_IT_WORKS,
  INTELLIGENCE_SYNC_EMBEDDING,
} from '../graphql/intelligence.queries';

// ============================================
// Types
// ============================================

export type KnowledgeThreshold =
  | 'T1_SKIN_BIOLOGY'
  | 'T2_INGREDIENT_SCIENCE'
  | 'T3_PRODUCT_FORMULATION'
  | 'T4_TREATMENT_PROTOCOLS'
  | 'T5_CONTRAINDICATIONS'
  | 'T6_PROFESSIONAL_TECHNIQUES'
  | 'T7_REGULATORY_COMPLIANCE'
  | 'T8_SYSTEMIC_PATTERNS';

export type EvidenceLevel =
  | 'ANECDOTAL'
  | 'IN_VITRO'
  | 'ANIMAL'
  | 'HUMAN_PILOT'
  | 'HUMAN_CONTROLLED'
  | 'META_ANALYSIS'
  | 'GOLD_STANDARD';

export type CausalDirection = 'UPSTREAM' | 'DOWNSTREAM' | 'BOTH';

export type AccessLevel = 'PUBLIC' | 'REGISTERED' | 'PROFESSIONAL' | 'EXPERT';

export type InteractionType = 'SYNERGY' | 'CONFLICT' | 'NEUTRAL' | 'SEQUENCING';

export type SynergyType =
  | 'ENHANCEMENT'
  | 'STABILIZATION'
  | 'PENETRATION'
  | 'PROTECTION'
  | 'COMPLEMENTARY';

export type ConflictType =
  | 'INACTIVATION'
  | 'IRRITATION'
  | 'PH_INCOMPATIBILITY'
  | 'PENETRATION_BARRIER'
  | 'OXIDATION'
  | 'DILUTION';

export interface SkincareAtom {
  id: string;
  title: string;
  slug: string;
  atomType: string;
  glanceText: string;
  scanText: string;
  studyText: string;
  inciName?: string;
  marketSegment?: string;
  knowledgeThreshold?: KnowledgeThreshold;
  whyItWorks?: string;
  causalSummary?: string;
}

export interface SkincareRelationship {
  id: string;
  fromAtomId: string;
  toAtomId: string;
  relationshipType: string;
  strength?: number;
  mechanism?: string;
}

export interface CausalChainNode {
  atom: SkincareAtom;
  relationship?: SkincareRelationship;
  depth: number;
  direction: 'upstream' | 'downstream';
  mechanismSummary?: string;
}

export interface CausalPathStep {
  atom: SkincareAtom;
  relationship?: SkincareRelationship;
  mechanismSummary: string;
}

export interface ClaimEvidence {
  id: string;
  atomId: string;
  claim: string;
  evidenceLevel: EvidenceLevel;
  sourceType?: string;
  sourceReference?: string;
  publicationYear?: number;
  sampleSize?: number;
  studyDuration?: string;
  confidenceScore?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EfficacyIndicator {
  id: string;
  atomId: string;
  indicatorName: string;
  measurementType?: string;
  baselineValue?: number;
  targetValue?: number;
  unit?: string;
  timeToEffect?: string;
  optimalMin?: number;
  optimalMax?: number;
  goldilocksZone?: string;
  evidenceLevel?: EvidenceLevel;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GoldilocksParameter {
  id: string;
  parameterName: string;
  minValue: number;
  maxValue: number;
  optimalValue: number;
  unit?: string;
  description?: string;
}

export interface EvidenceSummary {
  totalClaims: number;
  averageEvidenceStrength: number;
  highestEvidenceLevel?: EvidenceLevel;
  claimsByLevel: Record<EvidenceLevel, number>;
}

export interface EfficacySummary {
  indicators: EfficacyIndicator[];
  averageImprovement: number;
  shortestTimeframe?: string;
  highQualityCount: number;
}

export interface DisclosureContent {
  glance: string;
  scan: string;
  study: string;
}

export interface WhyExplanation {
  summary: string;
  path: CausalPathStep[];
  confidenceScore: number;
  evidenceStrength: number;
  disclosureContent: DisclosureContent;
}

export interface IngredientInteraction {
  atomA: SkincareAtom;
  atomB: SkincareAtom;
  interactionType: InteractionType;
  synergyType?: SynergyType;
  conflictType?: ConflictType;
  severity: number;
  mechanism: string;
  recommendation: string;
  waitTime?: string;
}

export interface CompatibilityResult {
  overallScore: number;
  compatible: boolean;
  interactions: IngredientInteraction[];
  synergies: IngredientInteraction[];
  conflicts: IngredientInteraction[];
  sequenceRecommendation: SkincareAtom[];
  warnings: string[];
  tips: string[];
}

export interface IntelligenceSearchResult {
  atom: SkincareAtom;
  semanticScore: number;
  tensorScore: number;
  combinedScore: number;
  knowledgeThreshold?: KnowledgeThreshold;
  evidenceStrength: number;
}

export interface IntelligenceSearchResponse {
  results: IntelligenceSearchResult[];
  totalCount: number;
  query: string;
  executionTimeMs: number;
}

export interface AtomWithIntelligence {
  atom?: SkincareAtom;
  accessible: boolean;
  evidenceSummary?: EvidenceSummary;
  efficacySummary?: EfficacySummary;
  goldilocksParameters: GoldilocksParameter[];
  whyItWorks?: string;
  causalSummary?: string;
}

export interface IntelligenceSearchFilters {
  thresholds?: KnowledgeThreshold[];
  minEvidenceLevel?: EvidenceLevel;
  atomTypes?: string[];
  minHydration?: number;
  minAntiAging?: number;
  maxSensitivity?: number;
}

export interface ClaimEvidenceInput {
  claim: string;
  evidenceLevel: EvidenceLevel;
  sourceType?: string;
  sourceReference?: string;
  publicationYear?: number;
  sampleSize?: number;
  studyDuration?: string;
  confidenceScore?: number;
  notes?: string;
}

// ============================================
// Causal Chain Hooks
// ============================================

/**
 * Hook for navigating causal chains
 */
export function useCausalChain(
  atomId: string,
  direction: CausalDirection = 'BOTH',
  maxDepth: number = 3,
  accessLevel: AccessLevel = 'PUBLIC'
) {
  const { data, loading, error, refetch } = useQuery(INTELLIGENCE_CAUSAL_CHAIN, {
    variables: { atomId, direction, maxDepth, accessLevel },
    skip: !atomId,
  });

  const nodes: CausalChainNode[] = data?.intelligenceCausalChain || [];

  return {
    nodes,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for finding causal path between two atoms
 */
export function useCausalPath(
  fromAtomId: string,
  toAtomId: string,
  accessLevel: AccessLevel = 'PUBLIC'
) {
  const { data, loading, error, refetch } = useQuery(INTELLIGENCE_FIND_PATH, {
    variables: { fromAtomId, toAtomId, accessLevel },
    skip: !fromAtomId || !toAtomId,
  });

  const path: CausalPathStep[] = data?.intelligenceFindPath || [];

  return {
    path,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for "Why It Works" explanations
 */
export function useWhyExplanation(
  atomId: string,
  targetAtomId?: string,
  accessLevel: AccessLevel = 'PUBLIC'
) {
  const { data, loading, error, refetch } = useQuery(INTELLIGENCE_WHY_EXPLANATION, {
    variables: { atomId, targetAtomId, accessLevel },
    skip: !atomId,
  });

  const explanation: WhyExplanation | null = data?.intelligenceWhyExplanation || null;

  return {
    explanation,
    loading,
    error,
    refetch,
  };
}

// ============================================
// Atom Intelligence Hooks
// ============================================

/**
 * Hook for getting atom with full intelligence data
 */
export function useAtomWithIntelligence(
  atomId: string,
  accessLevel: AccessLevel = 'PUBLIC'
) {
  const { data, loading, error, refetch } = useQuery(INTELLIGENCE_ATOM, {
    variables: { atomId, accessLevel },
    skip: !atomId,
  });

  const atomData: AtomWithIntelligence | null = data?.intelligenceAtom || null;

  return {
    atomData,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for getting claim evidence
 */
export function useClaimEvidence(atomId: string, minLevel?: EvidenceLevel) {
  const { data, loading, error, refetch } = useQuery(INTELLIGENCE_CLAIM_EVIDENCE, {
    variables: { atomId, minLevel },
    skip: !atomId,
  });

  const evidence: ClaimEvidence[] = data?.intelligenceClaimEvidence || [];

  return {
    evidence,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for getting evidence summary
 */
export function useEvidenceSummary(atomId: string) {
  const { data, loading, error, refetch } = useQuery(INTELLIGENCE_EVIDENCE_SUMMARY, {
    variables: { atomId },
    skip: !atomId,
  });

  const summary: EvidenceSummary | null = data?.intelligenceEvidenceSummary || null;

  return {
    summary,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for getting efficacy indicators
 */
export function useEfficacyIndicators(atomId: string, highQualityOnly?: boolean) {
  const { data, loading, error, refetch } = useQuery(INTELLIGENCE_EFFICACY_INDICATORS, {
    variables: { atomId, highQualityOnly },
    skip: !atomId,
  });

  const indicators: EfficacyIndicator[] = data?.intelligenceEfficacyIndicators || [];

  return {
    indicators,
    loading,
    error,
    refetch,
  };
}

// ============================================
// Compatibility Hooks
// ============================================

/**
 * Hook for analyzing compatibility between ingredients
 */
export function useCompatibilityAnalysis(
  atomIds: string[],
  accessLevel: AccessLevel = 'PUBLIC'
) {
  const { data, loading, error, refetch } = useQuery(INTELLIGENCE_ANALYZE_COMPATIBILITY, {
    variables: { atomIds, accessLevel },
    skip: !atomIds || atomIds.length < 2,
  });

  const result: CompatibilityResult | null = data?.intelligenceAnalyzeCompatibility || null;

  return {
    result,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for lazy compatibility analysis
 */
export function useLazyCompatibilityAnalysis() {
  const [analyze, { data, loading, error }] = useLazyQuery(
    INTELLIGENCE_ANALYZE_COMPATIBILITY
  );

  const analyzeCompatibility = useCallback(
    (atomIds: string[], accessLevel: AccessLevel = 'PUBLIC') => {
      return analyze({ variables: { atomIds, accessLevel } });
    },
    [analyze]
  );

  const result: CompatibilityResult | null = data?.intelligenceAnalyzeCompatibility || null;

  return {
    analyzeCompatibility,
    result,
    loading,
    error,
  };
}

// ============================================
// Search Hooks
// ============================================

/**
 * Hook for intelligence search
 */
export function useIntelligenceSearch(
  query: string,
  filters?: IntelligenceSearchFilters,
  limit: number = 10,
  semanticWeight: number = 0.6,
  tensorWeight: number = 0.4
) {
  const { data, loading, error, refetch } = useQuery(INTELLIGENCE_SEARCH, {
    variables: { query, filters, limit, semanticWeight, tensorWeight },
    skip: !query || query.length < 2,
  });

  const response: IntelligenceSearchResponse | null = data?.intelligenceSearch || null;

  return {
    results: response?.results || [],
    totalCount: response?.totalCount || 0,
    executionTimeMs: response?.executionTimeMs || 0,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for lazy intelligence search
 */
export function useLazyIntelligenceSearch() {
  const [searchQuery, { data, loading, error }] = useLazyQuery(INTELLIGENCE_SEARCH);
  const [lastQuery, setLastQuery] = useState<string>('');

  const search = useCallback(
    async (
      query: string,
      filters?: IntelligenceSearchFilters,
      limit: number = 10,
      semanticWeight: number = 0.6,
      tensorWeight: number = 0.4
    ) => {
      setLastQuery(query);
      return searchQuery({
        variables: { query, filters, limit, semanticWeight, tensorWeight },
      });
    },
    [searchQuery]
  );

  const response: IntelligenceSearchResponse | null = data?.intelligenceSearch || null;

  return {
    search,
    results: response?.results || [],
    totalCount: response?.totalCount || 0,
    executionTimeMs: response?.executionTimeMs || 0,
    query: lastQuery,
    loading,
    error,
  };
}

/**
 * Hook for finding similar atoms
 */
export function useFindSimilar(atomId: string, limit: number = 10) {
  const { data, loading, error, refetch } = useQuery(INTELLIGENCE_FIND_SIMILAR, {
    variables: { atomId, limit },
    skip: !atomId,
  });

  const results: IntelligenceSearchResult[] = data?.intelligenceFindSimilar || [];

  return {
    results,
    loading,
    error,
    refetch,
  };
}

// ============================================
// Access Control Hooks
// ============================================

/**
 * Hook for checking access to threshold
 */
export function useCheckAccess(threshold: KnowledgeThreshold, accessLevel: AccessLevel) {
  const { data, loading, error } = useQuery(INTELLIGENCE_CHECK_ACCESS, {
    variables: { threshold, accessLevel },
  });

  return {
    hasAccess: data?.intelligenceCheckAccess || false,
    loading,
    error,
  };
}

/**
 * Hook for getting max accessible threshold
 */
export function useMaxThreshold(accessLevel: AccessLevel) {
  const { data, loading, error } = useQuery(INTELLIGENCE_MAX_THRESHOLD, {
    variables: { accessLevel },
  });

  return {
    maxThreshold: data?.intelligenceMaxThreshold as KnowledgeThreshold | null,
    loading,
    error,
  };
}

// ============================================
// Mutation Hooks
// ============================================

/**
 * Hook for claim evidence mutations
 */
export function useClaimEvidenceMutations() {
  const [addMutation, { loading: adding }] = useMutation(INTELLIGENCE_ADD_CLAIM_EVIDENCE);
  const [updateMutation, { loading: updating }] = useMutation(
    INTELLIGENCE_UPDATE_CLAIM_EVIDENCE
  );
  const [deleteMutation, { loading: deleting }] = useMutation(
    INTELLIGENCE_DELETE_CLAIM_EVIDENCE
  );

  const addClaimEvidence = useCallback(
    async (atomId: string, input: ClaimEvidenceInput) => {
      const { data } = await addMutation({
        variables: { atomId, input },
        refetchQueries: ['IntelligenceClaimEvidence', 'IntelligenceEvidenceSummary'],
      });
      return data?.intelligenceAddClaimEvidence;
    },
    [addMutation]
  );

  const updateClaimEvidence = useCallback(
    async (id: string, input: ClaimEvidenceInput) => {
      const { data } = await updateMutation({
        variables: { id, input },
        refetchQueries: ['IntelligenceClaimEvidence', 'IntelligenceEvidenceSummary'],
      });
      return data?.intelligenceUpdateClaimEvidence;
    },
    [updateMutation]
  );

  const deleteClaimEvidence = useCallback(
    async (id: string) => {
      const { data } = await deleteMutation({
        variables: { id },
        refetchQueries: ['IntelligenceClaimEvidence', 'IntelligenceEvidenceSummary'],
      });
      return data?.intelligenceDeleteClaimEvidence;
    },
    [deleteMutation]
  );

  return {
    addClaimEvidence,
    updateClaimEvidence,
    deleteClaimEvidence,
    loading: adding || updating || deleting,
  };
}

/**
 * Hook for setting atom threshold
 */
export function useSetAtomThreshold() {
  const [mutation, { loading, error }] = useMutation(INTELLIGENCE_SET_ATOM_THRESHOLD);

  const setThreshold = useCallback(
    async (atomId: string, threshold: KnowledgeThreshold) => {
      const { data } = await mutation({
        variables: { atomId, threshold },
        refetchQueries: ['IntelligenceAtom'],
      });
      return data?.intelligenceSetAtomThreshold;
    },
    [mutation]
  );

  return {
    setThreshold,
    loading,
    error,
  };
}

/**
 * Hook for setting "Why It Works" explanation
 */
export function useSetWhyItWorks() {
  const [mutation, { loading, error }] = useMutation(INTELLIGENCE_SET_WHY_IT_WORKS);

  const setWhyItWorks = useCallback(
    async (atomId: string, whyItWorks: string, causalSummary?: string) => {
      const { data } = await mutation({
        variables: { atomId, whyItWorks, causalSummary },
        refetchQueries: ['IntelligenceAtom', 'IntelligenceWhyExplanation'],
      });
      return data?.intelligenceSetWhyItWorks;
    },
    [mutation]
  );

  return {
    setWhyItWorks,
    loading,
    error,
  };
}

/**
 * Hook for syncing atom embedding
 */
export function useSyncEmbedding() {
  const [mutation, { loading, error }] = useMutation(INTELLIGENCE_SYNC_EMBEDDING);

  const syncEmbedding = useCallback(
    async (atomId: string) => {
      const { data } = await mutation({
        variables: { atomId },
      });
      return data?.intelligenceSyncEmbedding;
    },
    [mutation]
  );

  return {
    syncEmbedding,
    loading,
    error,
  };
}

// ============================================
// Utility Functions
// ============================================

/**
 * Get human-readable label for knowledge threshold
 */
export function getThresholdLabel(threshold: KnowledgeThreshold): string {
  const labels: Record<KnowledgeThreshold, string> = {
    T1_SKIN_BIOLOGY: 'Skin Biology',
    T2_INGREDIENT_SCIENCE: 'Ingredient Science',
    T3_PRODUCT_FORMULATION: 'Product Formulation',
    T4_TREATMENT_PROTOCOLS: 'Treatment Protocols',
    T5_CONTRAINDICATIONS: 'Contraindications',
    T6_PROFESSIONAL_TECHNIQUES: 'Professional Techniques',
    T7_REGULATORY_COMPLIANCE: 'Regulatory Compliance',
    T8_SYSTEMIC_PATTERNS: 'Systemic Patterns',
  };
  return labels[threshold] || threshold;
}

/**
 * Get human-readable label for evidence level
 */
export function getEvidenceLevelLabel(level: EvidenceLevel): string {
  const labels: Record<EvidenceLevel, string> = {
    ANECDOTAL: 'Anecdotal',
    IN_VITRO: 'In Vitro',
    ANIMAL: 'Animal Study',
    HUMAN_PILOT: 'Human Pilot Study',
    HUMAN_CONTROLLED: 'Human Controlled Study',
    META_ANALYSIS: 'Meta-Analysis',
    GOLD_STANDARD: 'Gold Standard',
  };
  return labels[level] || level;
}

/**
 * Get color for evidence level (for UI)
 */
export function getEvidenceLevelColor(level: EvidenceLevel): string {
  const colors: Record<EvidenceLevel, string> = {
    ANECDOTAL: 'gray',
    IN_VITRO: 'yellow',
    ANIMAL: 'orange',
    HUMAN_PILOT: 'blue',
    HUMAN_CONTROLLED: 'indigo',
    META_ANALYSIS: 'purple',
    GOLD_STANDARD: 'green',
  };
  return colors[level] || 'gray';
}

/**
 * Get color for interaction type (for UI)
 */
export function getInteractionColor(type: InteractionType): string {
  const colors: Record<InteractionType, string> = {
    SYNERGY: 'green',
    CONFLICT: 'red',
    NEUTRAL: 'gray',
    SEQUENCING: 'blue',
  };
  return colors[type] || 'gray';
}
