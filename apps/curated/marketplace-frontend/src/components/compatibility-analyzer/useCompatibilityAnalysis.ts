/**
 * useCompatibilityAnalysis Hook
 *
 * DermaLogica Intelligence MVP - Phase 6: Compatibility Analyzer
 *
 * React hook for managing compatibility analysis:
 * - GraphQL queries for product search
 * - Compatibility analysis API calls
 * - Local caching of results
 * - Mock data for development
 */

import { useState, useCallback, useMemo } from 'react';
import { SelectableProduct } from './ProductSelector';
import { Interaction, InteractionType } from './CompatibilityMatrix';
import { Synergy, SynergyType, SynergyStrength } from './SynergyCard';
import { Conflict, ConflictType, ConflictSeverity } from './ConflictWarning';
import { SequenceStep, TimeOfDay } from './SequencingTimeline';
import { CompatibilityAnalysisResult } from './CompatibilityAnalyzer';

/**
 * Hook options
 */
export interface UseCompatibilityAnalysisOptions {
  /** Use mock data instead of API */
  useMockData?: boolean;
  /** Cache TTL in milliseconds */
  cacheTTL?: number;
  /** Maximum products to analyze */
  maxProducts?: number;
}

/**
 * Hook return type
 */
export interface UseCompatibilityAnalysisReturn {
  /** Search for products/ingredients */
  searchProducts: (query: string) => Promise<SelectableProduct[]>;
  /** Analyze compatibility of selected products */
  analyzeCompatibility: (products: SelectableProduct[]) => Promise<CompatibilityAnalysisResult>;
  /** Current analysis result */
  analysisResult: CompatibilityAnalysisResult | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Clear cached results */
  clearCache: () => void;
}

/**
 * Known ingredient interactions database (mock)
 */
const KNOWN_INTERACTIONS: Record<string, {
  type: 'synergy' | 'conflict' | 'neutral';
  score: number;
  summary: string;
  mechanism?: string;
  waitTime?: number;
}> = {
  'retinol+vitamin-c': {
    type: 'conflict',
    score: -0.6,
    summary: 'Using retinol and vitamin C together can cause irritation',
    mechanism: 'Both ingredients are active and can over-exfoliate when combined',
    waitTime: 30,
  },
  'retinol+niacinamide': {
    type: 'synergy',
    score: 0.7,
    summary: 'Niacinamide helps reduce retinol irritation while boosting efficacy',
    mechanism: 'Niacinamide strengthens the skin barrier, allowing better retinol tolerance',
  },
  'vitamin-c+vitamin-e': {
    type: 'synergy',
    score: 0.9,
    summary: 'Vitamin C and E work together for enhanced antioxidant protection',
    mechanism: 'Vitamin E regenerates oxidized vitamin C, extending its protective effects',
  },
  'aha+bha': {
    type: 'conflict',
    score: -0.5,
    summary: 'Using both AHA and BHA together may cause over-exfoliation',
    mechanism: 'Both are chemical exfoliants that can compromise skin barrier when combined',
    waitTime: 24 * 60, // 24 hours
  },
  'hyaluronic-acid+vitamin-c': {
    type: 'synergy',
    score: 0.6,
    summary: 'Hyaluronic acid helps vitamin C penetrate and hydrates stressed skin',
    mechanism: 'HA provides moisture that helps vitamin C function optimally',
  },
  'benzoyl-peroxide+retinol': {
    type: 'conflict',
    score: -0.8,
    summary: 'Benzoyl peroxide can deactivate retinol',
    mechanism: 'The oxidizing nature of BP breaks down retinol molecules',
    waitTime: 12 * 60,
  },
  'niacinamide+salicylic-acid': {
    type: 'neutral',
    score: 0.2,
    summary: 'These ingredients can be used together safely',
    mechanism: 'No significant interaction, both work through different pathways',
  },
  'vitamin-c+sunscreen': {
    type: 'synergy',
    score: 0.8,
    summary: 'Vitamin C boosts sunscreen protection against UV damage',
    mechanism: 'Antioxidant protection complements UV filters for comprehensive defense',
  },
};

/**
 * Mock product database
 */
const MOCK_PRODUCTS: SelectableProduct[] = [
  { id: 'p1', name: 'Retinol Serum 0.5%', brand: 'SkinCeuticals', category: 'Treatment', type: 'product' },
  { id: 'p2', name: 'Vitamin C 15% Serum', brand: 'Dermalogica', category: 'Treatment', type: 'product' },
  { id: 'p3', name: 'Niacinamide 10%', brand: 'The Ordinary', category: 'Treatment', type: 'product' },
  { id: 'p4', name: 'Hyaluronic Acid Serum', brand: 'Skinceuticals', category: 'Hydration', type: 'product' },
  { id: 'p5', name: 'AHA/BHA Peel', brand: 'The Ordinary', category: 'Exfoliant', type: 'product' },
  { id: 'p6', name: 'Salicylic Acid Cleanser', brand: 'CeraVe', category: 'Cleanser', type: 'product' },
  { id: 'p7', name: 'Benzoyl Peroxide 2.5%', brand: 'La Roche-Posay', category: 'Acne Treatment', type: 'product' },
  { id: 'p8', name: 'SPF 50 Sunscreen', brand: 'EltaMD', category: 'Sunscreen', type: 'product' },
  { id: 'i1', name: 'Retinol', type: 'ingredient' },
  { id: 'i2', name: 'Vitamin C (L-Ascorbic Acid)', type: 'ingredient' },
  { id: 'i3', name: 'Niacinamide', type: 'ingredient' },
  { id: 'i4', name: 'Hyaluronic Acid', type: 'ingredient' },
  { id: 'i5', name: 'Salicylic Acid (BHA)', type: 'ingredient' },
  { id: 'i6', name: 'Glycolic Acid (AHA)', type: 'ingredient' },
  { id: 'i7', name: 'Benzoyl Peroxide', type: 'ingredient' },
  { id: 'i8', name: 'Vitamin E', type: 'ingredient' },
];

/**
 * Normalize product name for interaction lookup
 */
function normalizeForLookup(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Get interaction key for two items
 */
function getInteractionKey(nameA: string, nameB: string): string {
  const a = normalizeForLookup(nameA);
  const b = normalizeForLookup(nameB);
  // Sort to ensure consistent key regardless of order
  return a < b ? `${a}+${b}` : `${b}+${a}`;
}

/**
 * Convert interaction score to type
 */
function scoreToInteractionType(score: number): InteractionType {
  if (score >= 0.5) return 'STRONG_SYNERGY';
  if (score >= 0.2) return 'MILD_SYNERGY';
  if (score > -0.2) return 'NEUTRAL';
  if (score > -0.5) return 'MILD_CONFLICT';
  return 'STRONG_CONFLICT';
}

/**
 * Convert score to synergy strength
 */
function scoreToSynergyStrength(score: number): SynergyStrength {
  if (score >= 0.7) return 'strong';
  if (score >= 0.4) return 'moderate';
  return 'mild';
}

/**
 * Convert score to conflict severity
 */
function scoreToConflictSeverity(score: number): ConflictSeverity {
  if (score <= -0.7) return 'severe';
  if (score <= -0.4) return 'moderate';
  return 'mild';
}

/**
 * Infer synergy type from mechanism
 */
function inferSynergyType(mechanism: string): SynergyType {
  const lowerMech = mechanism.toLowerCase();
  if (lowerMech.includes('boost') || lowerMech.includes('enhance')) return 'ENHANCING';
  if (lowerMech.includes('protect') || lowerMech.includes('reduce')) return 'PROTECTIVE';
  if (lowerMech.includes('absorb') || lowerMech.includes('penetrat')) return 'PENETRATION';
  if (lowerMech.includes('stable') || lowerMech.includes('regenerat')) return 'STABILIZING';
  return 'COMPLEMENTARY';
}

/**
 * Infer conflict type from mechanism
 */
function inferConflictType(mechanism: string): ConflictType {
  const lowerMech = mechanism.toLowerCase();
  if (lowerMech.includes('deactiv') || lowerMech.includes('break down')) return 'INACTIVATION';
  if (lowerMech.includes('irritat') || lowerMech.includes('sensitiv')) return 'IRRITATION';
  if (lowerMech.includes('ph')) return 'PH_INCOMPATIBLE';
  if (lowerMech.includes('oxidiz')) return 'OXIDATION';
  if (lowerMech.includes('exfoliat')) return 'OVEREXFOLIATION';
  return 'IRRITATION';
}

/**
 * Generate sequence steps from products
 */
function generateSequenceSteps(
  products: SelectableProduct[],
  timeOfDay: TimeOfDay
): SequenceStep[] {
  // Category order for proper skincare routine
  const categoryOrder: Record<string, number> = {
    'cleanser': 1,
    'toner': 2,
    'treatment': 3,
    'serum': 4,
    'hydration': 5,
    'moisturizer': 6,
    'sunscreen': 7,
    'exfoliant': 8,
    'acne treatment': 9,
  };

  // Filter products based on time of day
  const filteredProducts = products.filter((p) => {
    const category = (p.category || '').toLowerCase();
    // Sunscreen only for morning
    if (category === 'sunscreen' && timeOfDay === 'evening') return false;
    // Heavy treatments typically for evening
    if ((category === 'treatment' || category === 'exfoliant') && timeOfDay === 'morning') {
      // Still include some treatments in AM
      const name = p.name.toLowerCase();
      if (name.includes('retinol') || name.includes('aha') || name.includes('bha')) return false;
    }
    return true;
  });

  return filteredProducts
    .map((p, index) => {
      const category = (p.category || 'serum').toLowerCase();
      const order = categoryOrder[category] || 5;

      // Determine wait time based on product type
      let waitTimeAfter = 0;
      const name = p.name.toLowerCase();
      if (name.includes('vitamin c') || name.includes('retinol')) {
        waitTimeAfter = 5; // Active serums need time to absorb
      } else if (category === 'treatment' || category === 'serum') {
        waitTimeAfter = 2;
      }

      return {
        id: `step-${timeOfDay}-${p.id}`,
        productId: p.id,
        productName: p.name,
        brand: p.brand,
        imageUrl: p.imageUrl,
        category: p.category || 'Serum',
        waitTimeAfter,
        timeOfDay,
        order,
      } as SequenceStep;
    })
    .sort((a, b) => a.order - b.order)
    .map((step, index) => ({
      ...step,
      order: index + 1,
    }));
}

/**
 * Main hook implementation
 */
export function useCompatibilityAnalysis(
  options: UseCompatibilityAnalysisOptions = {}
): UseCompatibilityAnalysisReturn {
  const { useMockData = true, maxProducts = 8 } = options;

  const [analysisResult, setAnalysisResult] = useState<CompatibilityAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [cache] = useState<Map<string, { result: CompatibilityAnalysisResult; timestamp: number }>>(
    new Map()
  );

  /**
   * Search for products/ingredients
   */
  const searchProducts = useCallback(async (query: string): Promise<SelectableProduct[]> => {
    if (useMockData) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 200));

      const lowerQuery = query.toLowerCase();
      return MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.brand?.toLowerCase().includes(lowerQuery) ||
          p.category?.toLowerCase().includes(lowerQuery)
      );
    }

    // TODO: Implement actual GraphQL query
    // const { data } = await client.query({
    //   query: SEARCH_PRODUCTS_QUERY,
    //   variables: { query, limit: 10 },
    // });
    // return data.searchProducts;

    return [];
  }, [useMockData]);

  /**
   * Analyze compatibility of products
   */
  const analyzeCompatibility = useCallback(
    async (products: SelectableProduct[]): Promise<CompatibilityAnalysisResult> => {
      setIsLoading(true);
      setError(null);

      try {
        // Generate cache key
        const cacheKey = products.map((p) => p.id).sort().join(',');

        // Check cache
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < (options.cacheTTL || 5 * 60 * 1000)) {
          setAnalysisResult(cached.result);
          return cached.result;
        }

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Generate pairwise interactions
        const interactions: Interaction[] = [];
        const synergies: Synergy[] = [];
        const conflicts: Conflict[] = [];

        for (let i = 0; i < products.length; i++) {
          for (let j = i + 1; j < products.length; j++) {
            const productA = products[i];
            const productB = products[j];
            const key = getInteractionKey(productA.name, productB.name);

            // Look up known interaction or generate neutral
            const known = KNOWN_INTERACTIONS[key];
            const interactionData = known || {
              type: 'neutral' as const,
              score: 0,
              summary: `No significant interaction between ${productA.name} and ${productB.name}`,
            };

            // Create interaction for matrix
            const interaction: Interaction = {
              itemAId: productA.id,
              itemBId: productB.id,
              type: scoreToInteractionType(interactionData.score),
              score: interactionData.score,
              summary: interactionData.summary,
              mechanism: interactionData.mechanism,
              waitTime: interactionData.waitTime,
            };
            interactions.push(interaction);

            // Create synergy or conflict if applicable
            if (interactionData.type === 'synergy') {
              synergies.push({
                id: `synergy-${productA.id}-${productB.id}`,
                itemAId: productA.id,
                itemAName: productA.name,
                itemBId: productB.id,
                itemBName: productB.name,
                type: inferSynergyType(interactionData.mechanism || ''),
                strength: scoreToSynergyStrength(interactionData.score),
                mechanism: interactionData.mechanism || interactionData.summary,
                benefits: [interactionData.summary],
                benefitMultiplier: 1 + interactionData.score * 0.5,
              });
            } else if (interactionData.type === 'conflict') {
              conflicts.push({
                id: `conflict-${productA.id}-${productB.id}`,
                itemAId: productA.id,
                itemAName: productA.name,
                itemBId: productB.id,
                itemBName: productB.name,
                type: inferConflictType(interactionData.mechanism || ''),
                severity: scoreToConflictSeverity(interactionData.score),
                mechanism: interactionData.mechanism || interactionData.summary,
                risks: [interactionData.summary],
                waitTimeRecommended: interactionData.waitTime,
                mitigation: interactionData.waitTime
                  ? [
                      {
                        type: 'timing',
                        instruction: `Wait ${interactionData.waitTime} minutes between applications`,
                        effectiveness: 'partial',
                      },
                      {
                        type: 'separation',
                        instruction: 'Use on alternate days',
                        effectiveness: 'full',
                      },
                    ]
                  : [
                      {
                        type: 'avoidance',
                        instruction: 'Avoid using these products together',
                        effectiveness: 'full',
                      },
                    ],
              });
            }
          }
        }

        // Calculate overall score
        const totalScore = interactions.reduce((sum, i) => sum + i.score, 0);
        const avgScore = totalScore / Math.max(interactions.length, 1);
        // Normalize to 0-100 scale
        const overallScore = Math.round(((avgScore + 1) / 2) * 100);

        // Generate recommended sequence
        const morningSteps = generateSequenceSteps(products, 'morning');
        const eveningSteps = generateSequenceSteps(products, 'evening');

        const result: CompatibilityAnalysisResult = {
          overallScore,
          interactions,
          synergies,
          conflicts,
          recommendedSequence: {
            morning: morningSteps,
            evening: eveningSteps,
          },
        };

        // Cache result
        cache.set(cacheKey, { result, timestamp: Date.now() });
        setAnalysisResult(result);

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Analysis failed');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [cache, options.cacheTTL]
  );

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    cache.clear();
    setAnalysisResult(null);
  }, [cache]);

  return {
    searchProducts,
    analyzeCompatibility,
    analysisResult,
    isLoading,
    error,
    clearCache,
  };
}

/**
 * Mock search function for standalone use
 */
export async function mockSearchProducts(query: string): Promise<SelectableProduct[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const lowerQuery = query.toLowerCase();
  return MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.brand?.toLowerCase().includes(lowerQuery) ||
      p.category?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Mock analyze function for standalone use
 */
export async function mockAnalyzeCompatibility(
  products: SelectableProduct[]
): Promise<CompatibilityAnalysisResult> {
  const hook = { analyzeCompatibility: null as any };

  // Create a simple mock implementation
  await new Promise((resolve) => setTimeout(resolve, 500));

  const interactions: Interaction[] = [];
  const synergies: Synergy[] = [];
  const conflicts: Conflict[] = [];

  for (let i = 0; i < products.length; i++) {
    for (let j = i + 1; j < products.length; j++) {
      const productA = products[i];
      const productB = products[j];
      const key = getInteractionKey(productA.name, productB.name);

      const known = KNOWN_INTERACTIONS[key];
      const interactionData = known || {
        type: 'neutral' as const,
        score: 0,
        summary: `No significant interaction between ${productA.name} and ${productB.name}`,
      };

      interactions.push({
        itemAId: productA.id,
        itemBId: productB.id,
        type: scoreToInteractionType(interactionData.score),
        score: interactionData.score,
        summary: interactionData.summary,
        mechanism: interactionData.mechanism,
        waitTime: interactionData.waitTime,
      });

      if (interactionData.type === 'synergy') {
        synergies.push({
          id: `synergy-${productA.id}-${productB.id}`,
          itemAId: productA.id,
          itemAName: productA.name,
          itemBId: productB.id,
          itemBName: productB.name,
          type: inferSynergyType(interactionData.mechanism || ''),
          strength: scoreToSynergyStrength(interactionData.score),
          mechanism: interactionData.mechanism || interactionData.summary,
          benefits: [interactionData.summary],
        });
      } else if (interactionData.type === 'conflict') {
        conflicts.push({
          id: `conflict-${productA.id}-${productB.id}`,
          itemAId: productA.id,
          itemAName: productA.name,
          itemBId: productB.id,
          itemBName: productB.name,
          type: inferConflictType(interactionData.mechanism || ''),
          severity: scoreToConflictSeverity(interactionData.score),
          mechanism: interactionData.mechanism || interactionData.summary,
          risks: [interactionData.summary],
          waitTimeRecommended: interactionData.waitTime,
          mitigation: [],
        });
      }
    }
  }

  const totalScore = interactions.reduce((sum, i) => sum + i.score, 0);
  const avgScore = totalScore / Math.max(interactions.length, 1);
  const overallScore = Math.round(((avgScore + 1) / 2) * 100);

  return {
    overallScore,
    interactions,
    synergies,
    conflicts,
    recommendedSequence: {
      morning: generateSequenceSteps(products, 'morning'),
      evening: generateSequenceSteps(products, 'evening'),
    },
  };
}

export default useCompatibilityAnalysis;
