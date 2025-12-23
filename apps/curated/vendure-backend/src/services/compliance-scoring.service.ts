/**
 * Marketing Compliance Scoring Service
 *
 * AI-powered service for analyzing marketing copy against FDA/FTC regulations
 * Uses OpenAI for claim extraction and semantic analysis against regulatory atoms
 *
 * Part of Pillar 6: Regulations & Compliance in the SKA Knowledge Graph
 */

import { AppDataSource } from '../config/database';
import { zillizClient } from '../config/zilliz';
import {
  extractClaimsFromText,
  generateComplianceSuggestions,
  generateEmbedding,
  type ExtractedClaim,
  type ComplianceSuggestion,
} from './openai.service';

// Zilliz collection for regulatory atoms
const REGULATORY_COLLECTION = 'jade_regulatory_atoms';

/**
 * Severity levels for compliance warnings
 */
export type ComplianceSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

/**
 * Single compliance warning
 */
export interface ComplianceWarning {
  claim: string;
  claimType: string;
  issue: string;
  regulation: string;
  severity: ComplianceSeverity;
  suggestion: string;
  confidence: number;
  matchedAtomId?: string;
  matchedAtomTitle?: string;
}

/**
 * Full compliance score result
 */
export interface ComplianceScoreResult {
  overallScore: number; // 0-100
  passed: boolean;
  totalClaims: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
  warnings: ComplianceWarning[];
  suggestions: ComplianceSuggestion[];
  analyzedAt: string;
  processingTimeMs: number;
}

/**
 * Regulatory atom from database
 */
interface RegulatoryAtom {
  id: string;
  title: string;
  regulation_code: string;
  regulation_body: string;
  claim_pattern: string;
  severity: string;
  description: string;
  safe_alternative: string;
}

/**
 * Built-in regulatory rules for when Zilliz/DB atoms aren't available
 * These provide baseline compliance checking without external dependencies
 */
const BUILTIN_RULES: Array<{
  pattern: RegExp;
  claimType: string;
  severity: ComplianceSeverity;
  regulation: string;
  issue: string;
  suggestion: string;
}> = [
  // Disease claims (FDA - 21 CFR 740)
  {
    pattern: /\b(cure|cures|curing|treat|treats|treating|heals?|healing)\b.*\b(acne|eczema|psoriasis|dermatitis|rosacea|cancer|disease|infection|condition)\b/i,
    claimType: 'disease',
    severity: 'CRITICAL',
    regulation: 'FDA 21 CFR 740 - Cosmetic claims may not reference disease treatment',
    issue: 'Disease treatment claim - implies drug-like efficacy',
    suggestion: 'Replace with "helps improve the appearance of" or "addresses visible signs of"',
  },
  {
    pattern: /\b(prevent|prevents|preventing)\b.*\b(acne|aging|wrinkles|cancer|disease)\b/i,
    claimType: 'disease',
    severity: 'CRITICAL',
    regulation: 'FDA 21 CFR 740 - Disease prevention claims require drug approval',
    issue: 'Disease prevention claim - requires FDA drug approval',
    suggestion: 'Replace with "helps minimize the appearance of" or "designed to address"',
  },

  // Drug efficacy claims
  {
    pattern: /\b(eliminates?|eradicates?|destroys?)\b.*\b(wrinkles?|fine lines?|acne|blemishes?|dark spots?)\b/i,
    claimType: 'drug',
    severity: 'CRITICAL',
    regulation: 'FTC Act Section 5 - Unsubstantiated efficacy claims',
    issue: 'Absolute efficacy claim - implies guaranteed results',
    suggestion: 'Replace with "reduces the appearance of" or "helps diminish visible"',
  },
  {
    pattern: /\b(permanently|forever|eternal|lasting)\b.*\b(removes?|eliminates?|results?)\b/i,
    claimType: 'permanence',
    severity: 'WARNING',
    regulation: 'FTC Act Section 5 - Permanence claims require substantiation',
    issue: 'Unsubstantiated permanence claim',
    suggestion: 'Add qualifier "with continued use" or specify timeframe',
  },

  // Unsubstantiated claims
  {
    pattern: /\b(100%|guarantee[ds]?|proven|clinically proven)\b/i,
    claimType: 'unsubstantiated',
    severity: 'WARNING',
    regulation: 'FTC Act Section 5 - Claims must be substantiated',
    issue: 'Absolute claim requiring clinical evidence',
    suggestion: 'Add qualifier like "in consumer testing" or cite specific study',
  },
  {
    pattern: /\b(instant(ly)?|immediate(ly)?|overnight)\b.*\b(results?|transformation|change)\b/i,
    claimType: 'unsubstantiated',
    severity: 'WARNING',
    regulation: 'FTC Act Section 5 - Time-based claims need substantiation',
    issue: 'Unsubstantiated time-based efficacy claim',
    suggestion: 'Specify realistic timeframe or add "visible improvement"',
  },

  // Comparative claims
  {
    pattern: /\b(#1|number one|best|most effective|superior|better than)\b/i,
    claimType: 'comparative',
    severity: 'INFO',
    regulation: 'FTC Act Section 5 - Comparative claims need substantiation',
    issue: 'Comparative claim requiring evidence',
    suggestion: 'Add substantiation source or remove comparative language',
  },

  // Medical/drug terminology
  {
    pattern: /\b(prescription strength|medical grade|pharmaceutical|therapeutic)\b/i,
    claimType: 'drug',
    severity: 'WARNING',
    regulation: 'FDA - Drug-like terminology in cosmetic marketing',
    issue: 'Drug-like terminology may mislead consumers',
    suggestion: 'Use "professional strength" or "advanced formula" instead',
  },

  // Anti-aging specific
  {
    pattern: /\b(reverse|reverses|reversing)\b.*\b(aging|age|wrinkles?)\b/i,
    claimType: 'drug',
    severity: 'WARNING',
    regulation: 'FDA 21 CFR 740 - Reversal claims imply structural change',
    issue: 'Age reversal claim implies biological change',
    suggestion: 'Replace with "reduces visible signs of aging" or "rejuvenates appearance"',
  },

  // Collagen/structural claims
  {
    pattern: /\b(rebuilds?|regenerates?|restores?)\b.*\b(collagen|elastin|skin cells?)\b/i,
    claimType: 'drug',
    severity: 'WARNING',
    regulation: 'FDA - Claims affecting skin structure may be drug claims',
    issue: 'Structural regeneration claim may be considered drug claim',
    suggestion: 'Use "supports skin\'s natural processes" or "helps maintain"',
  },
];

/**
 * Main entry point: Score marketing copy for compliance
 */
export async function scoreMarketingCopy(
  copy: string,
  productId?: string
): Promise<ComplianceScoreResult> {
  const startTime = Date.now();

  // Step 1: Extract claims using AI
  const extractedClaims = await extractClaimsFromText(copy);

  // Step 2: Also check against built-in rules for reliability
  const builtinWarnings = checkBuiltinRules(copy);

  // Step 3: Search for similar violations in regulatory atoms (if available)
  let atomWarnings: ComplianceWarning[] = [];
  try {
    atomWarnings = await searchRegulatoryAtoms(extractedClaims);
  } catch (error) {
    console.warn('Regulatory atom search unavailable, using built-in rules only:', error);
  }

  // Step 4: Combine and deduplicate warnings
  const allWarnings = mergeWarnings([
    ...builtinWarnings,
    ...atomWarnings,
    ...extractedClaimsToWarnings(extractedClaims),
  ]);

  // Step 5: Generate AI suggestions for violations
  const suggestions = await generateComplianceSuggestions(
    extractedClaims,
    productId ? `Product ID: ${productId}` : undefined
  );

  // Step 6: Calculate overall score
  const { score, criticalCount, warningCount, infoCount } = calculateScore(allWarnings);

  return {
    overallScore: score,
    passed: score >= 70 && criticalCount === 0,
    totalClaims: extractedClaims.length,
    criticalCount,
    warningCount,
    infoCount,
    warnings: allWarnings,
    suggestions,
    analyzedAt: new Date().toISOString(),
    processingTimeMs: Date.now() - startTime,
  };
}

/**
 * Check marketing copy against built-in rules
 */
function checkBuiltinRules(copy: string): ComplianceWarning[] {
  const warnings: ComplianceWarning[] = [];

  for (const rule of BUILTIN_RULES) {
    const match = copy.match(rule.pattern);
    if (match) {
      warnings.push({
        claim: match[0],
        claimType: rule.claimType,
        issue: rule.issue,
        regulation: rule.regulation,
        severity: rule.severity,
        suggestion: rule.suggestion,
        confidence: 0.9,
      });
    }
  }

  return warnings;
}

/**
 * Search Zilliz for similar regulatory violations
 */
async function searchRegulatoryAtoms(claims: ExtractedClaim[]): Promise<ComplianceWarning[]> {
  const warnings: ComplianceWarning[] = [];

  // Check if collection exists
  try {
    const hasCollection = await zillizClient.hasCollection({
      collection_name: REGULATORY_COLLECTION,
    });

    if (!hasCollection.value) {
      return []; // Collection not created yet
    }
  } catch {
    return []; // Zilliz not available
  }

  // Search for each non-safe claim
  for (const claim of claims.filter(c => c.claimType !== 'safe')) {
    try {
      const embedding = await generateEmbedding(claim.claim);

      const searchResult = await zillizClient.search({
        collection_name: REGULATORY_COLLECTION,
        vector: embedding,
        limit: 3,
        output_fields: ['id', 'title', 'regulation_code', 'severity', 'description', 'safe_alternative'],
        metric_type: 'COSINE',
      });

      for (const result of searchResult.results) {
        if (result.score > 0.75) { // High similarity threshold
          warnings.push({
            claim: claim.claim,
            claimType: claim.claimType,
            issue: String(result.description || 'Potential regulatory violation'),
            regulation: String(result.regulation_code || 'FDA/FTC'),
            severity: mapSeverity(String(result.severity)),
            suggestion: String(result.safe_alternative || 'Consider revising this claim'),
            confidence: result.score,
            matchedAtomId: String(result.id),
            matchedAtomTitle: String(result.title),
          });
        }
      }
    } catch (error) {
      console.warn('Vector search failed for claim:', claim.claim, error);
    }
  }

  return warnings;
}

/**
 * Convert extracted claims to warnings
 */
function extractedClaimsToWarnings(claims: ExtractedClaim[]): ComplianceWarning[] {
  return claims
    .filter(c => c.claimType !== 'safe')
    .map(claim => ({
      claim: claim.claim,
      claimType: claim.claimType,
      issue: getIssueDescription(claim.claimType),
      regulation: getRegulationReference(claim.claimType),
      severity: getSeverityFromClaimType(claim.claimType),
      suggestion: getDefaultSuggestion(claim.claimType),
      confidence: claim.confidence,
    }));
}

/**
 * Merge and deduplicate warnings from multiple sources
 */
function mergeWarnings(warnings: ComplianceWarning[]): ComplianceWarning[] {
  const seen = new Map<string, ComplianceWarning>();

  for (const warning of warnings) {
    // Skip invalid warnings
    if (!warning || !warning.claim) continue;

    const key = warning.claim.toLowerCase().trim();
    const existing = seen.get(key);

    if (!existing || severityRank(warning.severity) > severityRank(existing.severity)) {
      seen.set(key, warning);
    }
  }

  return Array.from(seen.values()).sort(
    (a, b) => severityRank(b.severity) - severityRank(a.severity)
  );
}

/**
 * Calculate overall compliance score
 */
function calculateScore(warnings: ComplianceWarning[]): {
  score: number;
  criticalCount: number;
  warningCount: number;
  infoCount: number;
} {
  let criticalCount = 0;
  let warningCount = 0;
  let infoCount = 0;

  for (const warning of warnings) {
    switch (warning.severity) {
      case 'CRITICAL':
        criticalCount++;
        break;
      case 'WARNING':
        warningCount++;
        break;
      case 'INFO':
        infoCount++;
        break;
    }
  }

  // Scoring formula:
  // Start at 100, deduct points for violations
  // CRITICAL: -30 points each
  // WARNING: -10 points each
  // INFO: -2 points each
  let score = 100;
  score -= criticalCount * 30;
  score -= warningCount * 10;
  score -= infoCount * 2;

  return {
    score: Math.max(0, Math.min(100, score)),
    criticalCount,
    warningCount,
    infoCount,
  };
}

/**
 * Helper functions
 */
function severityRank(severity: ComplianceSeverity): number {
  switch (severity) {
    case 'CRITICAL': return 3;
    case 'WARNING': return 2;
    case 'INFO': return 1;
    default: return 0;
  }
}

function mapSeverity(severity: string): ComplianceSeverity {
  const upper = severity.toUpperCase();
  if (upper === 'CRITICAL' || upper === 'HIGH') return 'CRITICAL';
  if (upper === 'WARNING' || upper === 'MEDIUM') return 'WARNING';
  return 'INFO';
}

function getSeverityFromClaimType(claimType: string): ComplianceSeverity {
  switch (claimType) {
    case 'disease':
    case 'drug':
      return 'CRITICAL';
    case 'unsubstantiated':
    case 'permanence':
      return 'WARNING';
    case 'comparative':
    case 'efficacy':
      return 'INFO';
    default:
      return 'INFO';
  }
}

function getIssueDescription(claimType: string): string {
  switch (claimType) {
    case 'disease':
      return 'Disease-related claim - cosmetics may not claim to treat/cure diseases';
    case 'drug':
      return 'Drug-like claim - implies pharmaceutical efficacy';
    case 'unsubstantiated':
      return 'Unsubstantiated claim - requires clinical evidence';
    case 'permanence':
      return 'Permanence claim - unsubstantiated lasting effects';
    case 'comparative':
      return 'Comparative claim - requires substantiation';
    case 'efficacy':
      return 'Efficacy claim - may require evidence';
    default:
      return 'Potential compliance concern';
  }
}

function getRegulationReference(claimType: string): string {
  switch (claimType) {
    case 'disease':
      return 'FDA 21 CFR 740 - Cosmetic vs Drug Claims';
    case 'drug':
      return 'FDA 21 CFR 740 - Drug Efficacy Claims';
    case 'unsubstantiated':
      return 'FTC Act Section 5 - Substantiation Required';
    case 'permanence':
      return 'FTC Act Section 5 - Permanence Claims';
    case 'comparative':
      return 'FTC Act Section 5 - Comparative Advertising';
    default:
      return 'FDA/FTC Marketing Guidelines';
  }
}

function getDefaultSuggestion(claimType: string): string {
  switch (claimType) {
    case 'disease':
      return 'Replace with appearance-based language: "helps improve the look of"';
    case 'drug':
      return 'Use cosmetic language: "designed to", "helps", "may help"';
    case 'unsubstantiated':
      return 'Add substantiation or qualifier: "in consumer testing", "with regular use"';
    case 'permanence':
      return 'Add timeframe: "with continued use", specify duration';
    case 'comparative':
      return 'Remove comparison or add substantiation source';
    case 'efficacy':
      return 'Consider adding qualification or evidence reference';
    default:
      return 'Review claim for regulatory compliance';
  }
}

/**
 * Quick compliance check - returns just pass/fail and critical issues
 */
export async function quickComplianceCheck(copy: string): Promise<{
  passed: boolean;
  criticalIssues: string[];
}> {
  const warnings = checkBuiltinRules(copy);
  const criticalIssues = warnings
    .filter(w => w.severity === 'CRITICAL')
    .map(w => w.issue);

  return {
    passed: criticalIssues.length === 0,
    criticalIssues,
  };
}

export default {
  scoreMarketingCopy,
  quickComplianceCheck,
};
