/**
 * Intelligence MVP GraphQL Queries
 *
 * DermaLogica Intelligence Integration - Causal Chains, Evidence, Compatibility
 */

import { gql } from '@apollo/client';

// ============================================
// Fragments
// ============================================

export const SKINCARE_ATOM_FRAGMENT = gql`
  fragment SkincareAtomFields on SkincareAtom {
    id
    title
    slug
    atomType
    glanceText
    scanText
    studyText
    inciName
    marketSegment
    knowledgeThreshold
    whyItWorks
    causalSummary
  }
`;

export const CLAIM_EVIDENCE_FRAGMENT = gql`
  fragment ClaimEvidenceFields on ClaimEvidence {
    id
    atomId
    claim
    evidenceLevel
    sourceType
    sourceReference
    publicationYear
    sampleSize
    studyDuration
    confidenceScore
    notes
    createdAt
    updatedAt
  }
`;

export const EFFICACY_INDICATOR_FRAGMENT = gql`
  fragment EfficacyIndicatorFields on EfficacyIndicator {
    id
    atomId
    indicatorName
    measurementType
    baselineValue
    targetValue
    unit
    timeToEffect
    optimalMin
    optimalMax
    goldilocksZone
    evidenceLevel
    notes
    createdAt
    updatedAt
  }
`;

export const CAUSAL_CHAIN_NODE_FRAGMENT = gql`
  ${SKINCARE_ATOM_FRAGMENT}
  fragment CausalChainNodeFields on CausalChainNode {
    atom {
      ...SkincareAtomFields
    }
    relationship {
      id
      fromAtomId
      toAtomId
      relationshipType
      strength
      mechanism
    }
    depth
    direction
    mechanismSummary
  }
`;

export const COMPATIBILITY_RESULT_FRAGMENT = gql`
  ${SKINCARE_ATOM_FRAGMENT}
  fragment CompatibilityResultFields on CompatibilityResult {
    overallScore
    compatible
    interactions {
      atomA {
        ...SkincareAtomFields
      }
      atomB {
        ...SkincareAtomFields
      }
      interactionType
      synergyType
      conflictType
      severity
      mechanism
      recommendation
      waitTime
    }
    synergies {
      atomA {
        ...SkincareAtomFields
      }
      atomB {
        ...SkincareAtomFields
      }
      interactionType
      synergyType
      severity
      mechanism
      recommendation
    }
    conflicts {
      atomA {
        ...SkincareAtomFields
      }
      atomB {
        ...SkincareAtomFields
      }
      interactionType
      conflictType
      severity
      mechanism
      recommendation
      waitTime
    }
    sequenceRecommendation {
      ...SkincareAtomFields
    }
    warnings
    tips
  }
`;

// ============================================
// Queries
// ============================================

/**
 * Navigate causal chain from an atom
 */
export const INTELLIGENCE_CAUSAL_CHAIN = gql`
  ${CAUSAL_CHAIN_NODE_FRAGMENT}
  query IntelligenceCausalChain(
    $atomId: ID!
    $direction: CausalDirection!
    $maxDepth: Int
    $accessLevel: AccessLevel
  ) {
    intelligenceCausalChain(
      atomId: $atomId
      direction: $direction
      maxDepth: $maxDepth
      accessLevel: $accessLevel
    ) {
      ...CausalChainNodeFields
    }
  }
`;

/**
 * Find causal path between two atoms
 */
export const INTELLIGENCE_FIND_PATH = gql`
  ${SKINCARE_ATOM_FRAGMENT}
  query IntelligenceFindPath(
    $fromAtomId: ID!
    $toAtomId: ID!
    $accessLevel: AccessLevel
  ) {
    intelligenceFindPath(
      fromAtomId: $fromAtomId
      toAtomId: $toAtomId
      accessLevel: $accessLevel
    ) {
      atom {
        ...SkincareAtomFields
      }
      relationship {
        id
        relationshipType
        mechanism
      }
      mechanismSummary
    }
  }
`;

/**
 * Get "Why It Works" explanation
 */
export const INTELLIGENCE_WHY_EXPLANATION = gql`
  ${SKINCARE_ATOM_FRAGMENT}
  query IntelligenceWhyExplanation(
    $atomId: ID!
    $targetAtomId: ID
    $accessLevel: AccessLevel
  ) {
    intelligenceWhyExplanation(
      atomId: $atomId
      targetAtomId: $targetAtomId
      accessLevel: $accessLevel
    ) {
      summary
      path {
        atom {
          ...SkincareAtomFields
        }
        mechanismSummary
      }
      confidenceScore
      evidenceStrength
      disclosureContent {
        glance
        scan
        study
      }
    }
  }
`;

/**
 * Get atom with full intelligence data
 */
export const INTELLIGENCE_ATOM = gql`
  ${SKINCARE_ATOM_FRAGMENT}
  ${EFFICACY_INDICATOR_FRAGMENT}
  query IntelligenceAtom($atomId: ID!, $accessLevel: AccessLevel) {
    intelligenceAtom(atomId: $atomId, accessLevel: $accessLevel) {
      atom {
        ...SkincareAtomFields
      }
      accessible
      evidenceSummary {
        totalClaims
        averageEvidenceStrength
        highestEvidenceLevel
        claimsByLevel
      }
      efficacySummary {
        indicators {
          ...EfficacyIndicatorFields
        }
        averageImprovement
        shortestTimeframe
        highQualityCount
      }
      goldilocksParameters {
        id
        parameterName
        minValue
        maxValue
        optimalValue
        unit
        description
      }
      whyItWorks
      causalSummary
    }
  }
`;

/**
 * Get claim evidence for an atom
 */
export const INTELLIGENCE_CLAIM_EVIDENCE = gql`
  ${CLAIM_EVIDENCE_FRAGMENT}
  query IntelligenceClaimEvidence($atomId: ID!, $minLevel: EvidenceLevel) {
    intelligenceClaimEvidence(atomId: $atomId, minLevel: $minLevel) {
      ...ClaimEvidenceFields
    }
  }
`;

/**
 * Get evidence summary for an atom
 */
export const INTELLIGENCE_EVIDENCE_SUMMARY = gql`
  query IntelligenceEvidenceSummary($atomId: ID!) {
    intelligenceEvidenceSummary(atomId: $atomId) {
      totalClaims
      averageEvidenceStrength
      highestEvidenceLevel
      claimsByLevel
    }
  }
`;

/**
 * Get efficacy indicators for an atom
 */
export const INTELLIGENCE_EFFICACY_INDICATORS = gql`
  ${EFFICACY_INDICATOR_FRAGMENT}
  query IntelligenceEfficacyIndicators($atomId: ID!, $highQualityOnly: Boolean) {
    intelligenceEfficacyIndicators(atomId: $atomId, highQualityOnly: $highQualityOnly) {
      ...EfficacyIndicatorFields
    }
  }
`;

/**
 * Analyze compatibility between ingredients
 */
export const INTELLIGENCE_ANALYZE_COMPATIBILITY = gql`
  ${COMPATIBILITY_RESULT_FRAGMENT}
  query IntelligenceAnalyzeCompatibility($atomIds: [ID!]!, $accessLevel: AccessLevel) {
    intelligenceAnalyzeCompatibility(atomIds: $atomIds, accessLevel: $accessLevel) {
      ...CompatibilityResultFields
    }
  }
`;

/**
 * Intelligence search (hybrid semantic + tensor)
 */
export const INTELLIGENCE_SEARCH = gql`
  ${SKINCARE_ATOM_FRAGMENT}
  query IntelligenceSearch(
    $query: String!
    $filters: IntelligenceSearchFilters
    $limit: Int
    $semanticWeight: Float
    $tensorWeight: Float
  ) {
    intelligenceSearch(
      query: $query
      filters: $filters
      limit: $limit
      semanticWeight: $semanticWeight
      tensorWeight: $tensorWeight
    ) {
      results {
        atom {
          ...SkincareAtomFields
        }
        semanticScore
        tensorScore
        combinedScore
        knowledgeThreshold
        evidenceStrength
      }
      totalCount
      query
      executionTimeMs
    }
  }
`;

/**
 * Find similar atoms by tensor profile
 */
export const INTELLIGENCE_FIND_SIMILAR = gql`
  ${SKINCARE_ATOM_FRAGMENT}
  query IntelligenceFindSimilar($atomId: ID!, $limit: Int) {
    intelligenceFindSimilar(atomId: $atomId, limit: $limit) {
      atom {
        ...SkincareAtomFields
      }
      semanticScore
      tensorScore
      combinedScore
      knowledgeThreshold
      evidenceStrength
    }
  }
`;

/**
 * Check user access to threshold
 */
export const INTELLIGENCE_CHECK_ACCESS = gql`
  query IntelligenceCheckAccess(
    $threshold: KnowledgeThreshold!
    $accessLevel: AccessLevel!
  ) {
    intelligenceCheckAccess(threshold: $threshold, accessLevel: $accessLevel)
  }
`;

/**
 * Get max accessible threshold
 */
export const INTELLIGENCE_MAX_THRESHOLD = gql`
  query IntelligenceMaxThreshold($accessLevel: AccessLevel!) {
    intelligenceMaxThreshold(accessLevel: $accessLevel)
  }
`;

// ============================================
// Mutations
// ============================================

/**
 * Add claim evidence to an atom
 */
export const INTELLIGENCE_ADD_CLAIM_EVIDENCE = gql`
  ${CLAIM_EVIDENCE_FRAGMENT}
  mutation IntelligenceAddClaimEvidence($atomId: ID!, $input: ClaimEvidenceInput!) {
    intelligenceAddClaimEvidence(atomId: $atomId, input: $input) {
      ...ClaimEvidenceFields
    }
  }
`;

/**
 * Update claim evidence
 */
export const INTELLIGENCE_UPDATE_CLAIM_EVIDENCE = gql`
  ${CLAIM_EVIDENCE_FRAGMENT}
  mutation IntelligenceUpdateClaimEvidence($id: ID!, $input: ClaimEvidenceInput!) {
    intelligenceUpdateClaimEvidence(id: $id, input: $input) {
      ...ClaimEvidenceFields
    }
  }
`;

/**
 * Delete claim evidence
 */
export const INTELLIGENCE_DELETE_CLAIM_EVIDENCE = gql`
  mutation IntelligenceDeleteClaimEvidence($id: ID!) {
    intelligenceDeleteClaimEvidence(id: $id)
  }
`;

/**
 * Set atom knowledge threshold
 */
export const INTELLIGENCE_SET_ATOM_THRESHOLD = gql`
  ${SKINCARE_ATOM_FRAGMENT}
  mutation IntelligenceSetAtomThreshold($atomId: ID!, $threshold: KnowledgeThreshold!) {
    intelligenceSetAtomThreshold(atomId: $atomId, threshold: $threshold) {
      ...SkincareAtomFields
    }
  }
`;

/**
 * Set "Why It Works" explanation
 */
export const INTELLIGENCE_SET_WHY_IT_WORKS = gql`
  ${SKINCARE_ATOM_FRAGMENT}
  mutation IntelligenceSetWhyItWorks(
    $atomId: ID!
    $whyItWorks: String!
    $causalSummary: String
  ) {
    intelligenceSetWhyItWorks(
      atomId: $atomId
      whyItWorks: $whyItWorks
      causalSummary: $causalSummary
    ) {
      ...SkincareAtomFields
    }
  }
`;

/**
 * Sync atom embedding to vector database
 */
export const INTELLIGENCE_SYNC_EMBEDDING = gql`
  mutation IntelligenceSyncEmbedding($atomId: ID!) {
    intelligenceSyncEmbedding(atomId: $atomId)
  }
`;
