/**
 * Smart Search Service
 * Week 5 Day 5: Advanced search ranking and relevance
 *
 * Combines multiple search strategies:
 * - Natural language query parsing
 * - Semantic vector search
 * - Hybrid tensor + embedding search
 * - Re-ranking based on business rules and taxonomy completeness
 */

import { parseQueryWithAI, ParsedQuery } from './nlp-query-processor';
import { searchProductsBySemantic, findCompatibleProducts, generateQueryEmbedding } from './embedding-service';
import type { ProductEmbeddingData } from './embedding-service';

export interface SmartSearchResult {
  productId: string;
  vendureProductId: string;
  brandName: string;
  productName: string;
  categoryPath: string;
  professionalLevel: string;
  priceWholesale: number;
  taxonomyCompletenessScore: number;

  // Scoring breakdown
  scores: {
    semantic: number;          // 0-1: Vector similarity score
    taxonomy: number;          // 0-1: Taxonomy completeness
    popularity: number;        // 0-1: Usage/sales metrics
    relevance: number;         // 0-1: Filter match score
    final: number;             // 0-1: Weighted composite score
  };

  // Match metadata
  matchType: 'exact' | 'semantic' | 'compatibility' | 'filter';
  parsedQuery?: ParsedQuery;
  rank: number;
}

/**
 * Search configuration
 */
export interface SmartSearchConfig {
  limit?: number;
  useAIParsing?: boolean;     // Use OpenAI for query parsing (default: true)
  weights?: {
    semantic?: number;         // Weight for semantic similarity (default: 0.5)
    taxonomy?: number;         // Weight for taxonomy completeness (default: 0.2)
    popularity?: number;       // Weight for popularity metrics (default: 0.15)
    relevance?: number;        // Weight for filter relevance (default: 0.15)
  };
  boostNewProducts?: boolean;  // Boost recently added products
  minQualityScore?: number;    // Minimum taxonomy completeness (0-100)
}

const DEFAULT_WEIGHTS = {
  semantic: 0.5,
  taxonomy: 0.2,
  popularity: 0.15,
  relevance: 0.15,
};

/**
 * Calculate filter relevance score
 * How well does the product match the extracted filters?
 */
function calculateFilterRelevance(
  product: ProductEmbeddingData,
  parsedQuery: ParsedQuery
): number {
  let score = 0;
  let maxScore = 0;

  // Professional level match
  if (parsedQuery.filters.professionalLevels) {
    maxScore += 1;
    if (parsedQuery.filters.professionalLevels.includes(product.professional_level as any)) {
      score += 1;
    }
  }

  // Price range match
  if (parsedQuery.filters.priceRange) {
    maxScore += 1;
    const { min, max } = parsedQuery.filters.priceRange;
    if (product.price_wholesale >= min && product.price_wholesale <= max) {
      score += 1;
    }
  }

  // Category hint match
  if (parsedQuery.filters.categoryHints && parsedQuery.filters.categoryHints.length > 0) {
    maxScore += 1;
    const hasMatch = parsedQuery.filters.categoryHints.some(hint =>
      product.category_path.toLowerCase().includes(hint.toLowerCase())
    );
    if (hasMatch) {
      score += 1;
    }
  }

  // Normalize to 0-1
  return maxScore > 0 ? score / maxScore : 1.0;
}

/**
 * Calculate popularity score
 * Based on taxonomy completeness and other quality signals
 */
function calculatePopularityScore(product: ProductEmbeddingData): number {
  // For now, use taxonomy completeness as a proxy for quality
  // In production, could incorporate:
  // - Number of views/searches
  // - Purchase frequency
  // - User ratings
  // - Vendor reputation score

  return product.taxonomy_completeness_score / 100;
}

/**
 * Calculate final composite score
 */
function calculateFinalScore(
  semanticScore: number,
  taxonomyScore: number,
  popularityScore: number,
  relevanceScore: number,
  weights: Required<SmartSearchConfig['weights']>
): number {
  return (
    semanticScore * weights.semantic +
    taxonomyScore * weights.taxonomy +
    popularityScore * weights.popularity +
    relevanceScore * weights.relevance
  );
}

/**
 * Apply business rules and boosting
 */
function applyBusinessRules(
  results: SmartSearchResult[],
  config: SmartSearchConfig
): SmartSearchResult[] {
  let processed = [...results];

  // Boost high-quality products (taxonomy completeness > 80)
  processed = processed.map(result => {
    if (result.taxonomyCompletenessScore >= 80) {
      result.scores.final *= 1.1; // 10% boost
    }
    return result;
  });

  // Filter out low-quality products if threshold specified
  if (config.minQualityScore) {
    processed = processed.filter(
      result => result.taxonomyCompletenessScore >= config.minQualityScore!
    );
  }

  // Re-sort by final score
  processed.sort((a, b) => b.scores.final - a.scores.final);

  // Update ranks
  processed.forEach((result, index) => {
    result.rank = index + 1;
  });

  return processed;
}

/**
 * Smart search with natural language understanding
 */
export async function smartSearch(
  query: string,
  config: SmartSearchConfig = {}
): Promise<SmartSearchResult[]> {
  const {
    limit = 20,
    useAIParsing = true,
    weights = DEFAULT_WEIGHTS,
    boostNewProducts = false,
    minQualityScore,
  } = config;

  try {
    // Step 1: Parse the natural language query
    console.log(`🔍 Parsing query: "${query}"`);
    const parsedQuery = useAIParsing
      ? await parseQueryWithAI(query)
      : await import('./nlp-query-processor').then(m => m.parseQuery(query));

    console.log('✓ Query parsed:', {
      searchTerms: parsedQuery.searchTerms,
      intent: parsedQuery.intent,
      filters: parsedQuery.filters,
    });

    // Step 2: Execute semantic search
    const searchText = parsedQuery.searchTerms || query;
    const vectorResults = await searchProductsBySemantic(
      searchText,
      limit * 2, // Fetch 2x for re-ranking
      {
        professionalLevel: parsedQuery.filters.professionalLevels,
        priceRange: parsedQuery.filters.priceRange,
      }
    );

    console.log(`✓ Found ${vectorResults.length} initial results`);

    // Step 3: Score and rank results
    const scoredResults: SmartSearchResult[] = vectorResults.map((product, index) => {
      // Semantic score: Normalize distance to 0-1 similarity
      // Zilliz returns cosine distance (0 = identical, 2 = opposite)
      // Convert to similarity: 1 - (distance / 2)
      const semanticScore = 1 - ((product as any).distance || 0) / 2;

      // Taxonomy completeness score (already 0-100, normalize to 0-1)
      const taxonomyScore = product.taxonomy_completeness_score / 100;

      // Popularity score
      const popularityScore = calculatePopularityScore(product);

      // Filter relevance score
      const relevanceScore = calculateFilterRelevance(product, parsedQuery);

      // Calculate final composite score
      const finalScore = calculateFinalScore(
        semanticScore,
        taxonomyScore,
        popularityScore,
        relevanceScore,
        weights as Required<SmartSearchConfig['weights']>
      );

      return {
        productId: product.id,
        vendureProductId: product.vendure_product_id,
        brandName: product.brand_name,
        productName: product.product_name,
        categoryPath: product.category_path,
        professionalLevel: product.professional_level,
        priceWholesale: product.price_wholesale,
        taxonomyCompletenessScore: product.taxonomy_completeness_score,
        scores: {
          semantic: semanticScore,
          taxonomy: taxonomyScore,
          popularity: popularityScore,
          relevance: relevanceScore,
          final: finalScore,
        },
        matchType: 'semantic' as const,
        parsedQuery,
        rank: index + 1, // Temporary rank, will be updated after sorting
      };
    });

    // Step 4: Apply business rules and re-ranking
    const rerankedResults = applyBusinessRules(scoredResults, {
      ...config,
      weights: weights as Required<SmartSearchConfig['weights']>,
    });

    // Step 5: Return top K results
    const finalResults = rerankedResults.slice(0, limit);

    console.log(`✓ Returning ${finalResults.length} ranked results`);

    return finalResults;
  } catch (error) {
    console.error('Smart search failed:', error);
    throw error;
  }
}

/**
 * Compatibility-based search
 * Find products that work well with a given product
 */
export async function compatibilitySearch(
  productId: string,
  config: SmartSearchConfig = {}
): Promise<SmartSearchResult[]> {
  const { limit = 10 } = config;

  try {
    console.log(`🔗 Finding compatible products for: ${productId}`);

    // Use tensor-based compatibility search
    const compatibleProducts = await findCompatibleProducts(productId, limit * 2);

    // Score and rank
    const scoredResults: SmartSearchResult[] = compatibleProducts.map((product, index) => {
      // Compatibility uses L2 distance (lower = more similar)
      // Normalize to 0-1 similarity score
      const tensorDistance = (product as any).distance || 0;
      const compatibilityScore = 1 / (1 + tensorDistance); // Inverse distance

      const taxonomyScore = product.taxonomy_completeness_score / 100;
      const popularityScore = calculatePopularityScore(product);

      // For compatibility, weights are different
      const finalScore =
        compatibilityScore * 0.7 +
        taxonomyScore * 0.2 +
        popularityScore * 0.1;

      return {
        productId: product.id,
        vendureProductId: product.vendure_product_id,
        brandName: product.brand_name,
        productName: product.product_name,
        categoryPath: product.category_path,
        professionalLevel: product.professional_level,
        priceWholesale: product.price_wholesale,
        taxonomyCompletenessScore: product.taxonomy_completeness_score,
        scores: {
          semantic: compatibilityScore,
          taxonomy: taxonomyScore,
          popularity: popularityScore,
          relevance: 1.0,
          final: finalScore,
        },
        matchType: 'compatibility' as const,
        rank: index + 1,
      };
    });

    // Sort by final score
    scoredResults.sort((a, b) => b.scores.final - a.scores.final);

    // Update ranks
    scoredResults.forEach((result, index) => {
      result.rank = index + 1;
    });

    const finalResults = scoredResults.slice(0, limit);

    console.log(`✓ Found ${finalResults.length} compatible products`);

    return finalResults;
  } catch (error) {
    console.error('Compatibility search failed:', error);
    throw error;
  }
}

/**
 * Export both search functions
 */
export default {
  smartSearch,
  compatibilitySearch,
};
