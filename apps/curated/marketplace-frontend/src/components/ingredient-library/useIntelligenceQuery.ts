/**
 * useIntelligenceQuery Hook
 *
 * DermaLogica Intelligence MVP - Phase 5: Ingredient Library
 *
 * Generic hook for querying the Intelligence GraphQL API:
 * - Ingredient search with filters
 * - Single ingredient details
 * - Study/citation fetching
 * - Caching and pagination
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { gql, useQuery, useLazyQuery, useApolloClient, ApolloError } from '@apollo/client';
import type { Ingredient, TensorImpact, ConcernTarget, StudyReference } from './IngredientCard';
import type { IngredientSearchFilters } from './IngredientSearch';
import type { TensorFilters } from './TensorFilterPanel';

/**
 * GraphQL Fragments
 */
const INGREDIENT_FRAGMENT = gql`
  fragment IngredientFields on Ingredient {
    id
    name
    inciName
    aliases
    category
    description
    mechanism
    evidenceLevel
    knowledgeThreshold
    studyCount
    safetyRating
    popularityScore
    fragranceFree
    vegan
    tensorImpacts {
      dimension
      impact
      confidence
    }
    concernTargets {
      concern
      effectiveness
    }
    synergisticWith
    antagonisticWith
    contraindications
  }
`;

const STUDY_FRAGMENT = gql`
  fragment StudyFields on StudyReference {
    id
    title
    authors
    journal
    year
    volume
    issue
    pages
    doi
    pmid
    abstract
    studyType
    evidenceLevel
    sampleSize
    duration
    keyFindings
    methodology
    limitations
  }
`;

/**
 * GraphQL Queries
 */
const SEARCH_INGREDIENTS = gql`
  ${INGREDIENT_FRAGMENT}
  query SearchIngredients(
    $query: String
    $categories: [String!]
    $evidenceLevels: [EvidenceLevel!]
    $knowledgeThresholds: [KnowledgeThreshold!]
    $concerns: [String!]
    $tensorFilters: TensorFilterInput
    $safetyMin: Int
    $fragranceFree: Boolean
    $veganOnly: Boolean
    $sortBy: IngredientSortOption
    $limit: Int
    $offset: Int
  ) {
    searchIngredients(
      query: $query
      categories: $categories
      evidenceLevels: $evidenceLevels
      knowledgeThresholds: $knowledgeThresholds
      concerns: $concerns
      tensorFilters: $tensorFilters
      safetyMin: $safetyMin
      fragranceFree: $fragranceFree
      veganOnly: $veganOnly
      sortBy: $sortBy
      limit: $limit
      offset: $offset
    ) {
      ingredients {
        ...IngredientFields
      }
      totalCount
      hasMore
      suggestions
    }
  }
`;

const GET_INGREDIENT = gql`
  ${INGREDIENT_FRAGMENT}
  ${STUDY_FRAGMENT}
  query GetIngredient($id: ID!, $includeStudies: Boolean = false) {
    ingredient(id: $id) {
      ...IngredientFields
      studies @include(if: $includeStudies) {
        ...StudyFields
      }
    }
  }
`;

const GET_INGREDIENT_STUDIES = gql`
  ${STUDY_FRAGMENT}
  query GetIngredientStudies($ingredientId: ID!, $limit: Int, $offset: Int) {
    ingredientStudies(ingredientId: $ingredientId, limit: $limit, offset: $offset) {
      studies {
        ...StudyFields
      }
      totalCount
      hasMore
    }
  }
`;

const GET_CATEGORIES = gql`
  query GetIngredientCategories {
    ingredientCategories {
      name
      count
    }
  }
`;

const GET_CONCERNS = gql`
  query GetSkinConcerns {
    skinConcerns {
      name
      count
    }
  }
`;

/**
 * Convert frontend filters to GraphQL variables
 */
function filtersToVariables(filters: IngredientSearchFilters, limit: number, offset: number) {
  // Convert tensor filters to GraphQL input format
  let tensorFilters: Record<string, { min: number; max: number }> | null = null;
  if (filters.tensorFilters && Object.keys(filters.tensorFilters).length > 0) {
    tensorFilters = {};
    for (const [key, filter] of Object.entries(filters.tensorFilters)) {
      if (filter?.enabled) {
        tensorFilters[key] = { min: filter.min, max: filter.max };
      }
    }
    if (Object.keys(tensorFilters).length === 0) {
      tensorFilters = null;
    }
  }

  return {
    query: filters.query || null,
    categories: filters.categories.length > 0 ? filters.categories : null,
    evidenceLevels: filters.evidenceLevels.length > 0 ? filters.evidenceLevels : null,
    knowledgeThresholds: filters.knowledgeThresholds.length > 0 ? filters.knowledgeThresholds : null,
    concerns: filters.concerns.length > 0 ? filters.concerns : null,
    tensorFilters,
    safetyMin: filters.safetyMin || null,
    fragranceFree: filters.fragranceFree || null,
    veganOnly: filters.veganOnly || null,
    sortBy: filters.sortBy !== 'relevance' ? filters.sortBy.toUpperCase() : null,
    limit,
    offset,
  };
}

/**
 * Hook options
 */
export interface UseIntelligenceQueryOptions {
  /** Initial filters */
  initialFilters?: IngredientSearchFilters;
  /** Items per page */
  pageSize?: number;
  /** Whether to auto-fetch on mount */
  autoFetch?: boolean;
  /** Callback on error */
  onError?: (error: ApolloError) => void;
}

/**
 * Hook return type
 */
export interface UseIntelligenceQueryReturn {
  // Data
  ingredients: Ingredient[];
  totalCount: number;
  hasMore: boolean;
  suggestions: string[];
  categories: Array<{ name: string; count: number }>;
  concerns: Array<{ name: string; count: number }>;

  // State
  loading: boolean;
  loadingMore: boolean;
  error: ApolloError | null;

  // Actions
  search: (filters: IngredientSearchFilters) => Promise<void>;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
  getIngredient: (id: string, includeStudies?: boolean) => Promise<Ingredient | null>;
  getStudies: (ingredientId: string, limit?: number, offset?: number) => Promise<{
    studies: StudyReference[];
    totalCount: number;
    hasMore: boolean;
  }>;

  // Pagination
  currentPage: number;
  setPage: (page: number) => void;
  totalPages: number;
}

/**
 * useIntelligenceQuery - Hook for querying ingredient data
 */
export function useIntelligenceQuery(
  options: UseIntelligenceQueryOptions = {}
): UseIntelligenceQueryReturn {
  const { pageSize = 12, autoFetch = true, onError } = options;

  const client = useApolloClient();

  // State
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<IngredientSearchFilters | null>(null);

  // Categories query
  const { data: categoriesData } = useQuery(GET_CATEGORIES, {
    skip: !autoFetch,
  });

  // Concerns query
  const { data: concernsData } = useQuery(GET_CONCERNS, {
    skip: !autoFetch,
  });

  // Lazy queries
  const [searchQuery, { loading, error }] = useLazyQuery(SEARCH_INGREDIENTS, {
    onCompleted: (data) => {
      if (data?.searchIngredients) {
        setIngredients(data.searchIngredients.ingredients || []);
        setTotalCount(data.searchIngredients.totalCount || 0);
        setHasMore(data.searchIngredients.hasMore || false);
        setSuggestions(data.searchIngredients.suggestions || []);
      }
    },
    onError: (err) => {
      onError?.(err);
    },
    fetchPolicy: 'cache-and-network',
  });

  const [fetchIngredient] = useLazyQuery(GET_INGREDIENT);
  const [fetchStudies] = useLazyQuery(GET_INGREDIENT_STUDIES);

  /**
   * Search with filters
   */
  const search = useCallback(
    async (filters: IngredientSearchFilters) => {
      setCurrentFilters(filters);
      setCurrentPage(1);
      await searchQuery({
        variables: filtersToVariables(filters, pageSize, 0),
      });
    },
    [searchQuery, pageSize]
  );

  /**
   * Load more results
   */
  const loadMore = useCallback(async () => {
    if (!currentFilters || loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const offset = ingredients.length;
      const { data } = await searchQuery({
        variables: filtersToVariables(currentFilters, pageSize, offset),
      });

      if (data?.searchIngredients) {
        setIngredients((prev) => [...prev, ...(data.searchIngredients.ingredients || [])]);
        setHasMore(data.searchIngredients.hasMore || false);
      }
    } finally {
      setLoadingMore(false);
    }
  }, [currentFilters, loadingMore, hasMore, ingredients.length, searchQuery, pageSize]);

  /**
   * Refetch current query
   */
  const refetch = useCallback(async () => {
    if (!currentFilters) return;
    await search(currentFilters);
  }, [currentFilters, search]);

  /**
   * Set page (for paginated mode)
   */
  const setPage = useCallback(
    async (page: number) => {
      if (!currentFilters) return;
      setCurrentPage(page);
      const offset = (page - 1) * pageSize;
      await searchQuery({
        variables: filtersToVariables(currentFilters, pageSize, offset),
      });
    },
    [currentFilters, pageSize, searchQuery]
  );

  /**
   * Get single ingredient by ID
   */
  const getIngredient = useCallback(
    async (id: string, includeStudies = false): Promise<Ingredient | null> => {
      try {
        const { data } = await fetchIngredient({
          variables: { id, includeStudies },
        });
        return data?.ingredient || null;
      } catch {
        return null;
      }
    },
    [fetchIngredient]
  );

  /**
   * Get studies for an ingredient
   */
  const getStudies = useCallback(
    async (
      ingredientId: string,
      limit = 10,
      offset = 0
    ): Promise<{
      studies: StudyReference[];
      totalCount: number;
      hasMore: boolean;
    }> => {
      try {
        const { data } = await fetchStudies({
          variables: { ingredientId, limit, offset },
        });
        return {
          studies: data?.ingredientStudies?.studies || [],
          totalCount: data?.ingredientStudies?.totalCount || 0,
          hasMore: data?.ingredientStudies?.hasMore || false,
        };
      } catch {
        return { studies: [], totalCount: 0, hasMore: false };
      }
    },
    [fetchStudies]
  );

  // Computed values
  const totalPages = useMemo(() => Math.ceil(totalCount / pageSize), [totalCount, pageSize]);

  const categories = useMemo(
    () => categoriesData?.ingredientCategories || [],
    [categoriesData]
  );

  const concerns = useMemo(
    () => concernsData?.skinConcerns || [],
    [concernsData]
  );

  return {
    // Data
    ingredients,
    totalCount,
    hasMore,
    suggestions,
    categories,
    concerns,

    // State
    loading,
    loadingMore,
    error: error || null,

    // Actions
    search,
    loadMore,
    refetch,
    getIngredient,
    getStudies,

    // Pagination
    currentPage,
    setPage,
    totalPages,
  };
}

/**
 * useIngredientDetail - Hook for fetching single ingredient with studies
 */
export interface UseIngredientDetailOptions {
  /** Ingredient ID to fetch */
  ingredientId?: string;
  /** Whether to include studies */
  includeStudies?: boolean;
  /** Whether to auto-fetch on mount */
  autoFetch?: boolean;
}

export interface UseIngredientDetailReturn {
  ingredient: Ingredient | null;
  loading: boolean;
  error: ApolloError | null;
  refetch: () => Promise<void>;
  loadStudies: () => Promise<void>;
  studies: StudyReference[];
  studiesLoading: boolean;
  hasMoreStudies: boolean;
  loadMoreStudies: () => Promise<void>;
}

export function useIngredientDetail(
  options: UseIngredientDetailOptions = {}
): UseIngredientDetailReturn {
  const { ingredientId, includeStudies = false, autoFetch = true } = options;

  const [studies, setStudies] = useState<StudyReference[]>([]);
  const [studiesLoading, setStudiesLoading] = useState(false);
  const [hasMoreStudies, setHasMoreStudies] = useState(false);

  const {
    data,
    loading,
    error,
    refetch: refetchQuery,
  } = useQuery(GET_INGREDIENT, {
    variables: { id: ingredientId, includeStudies },
    skip: !ingredientId || !autoFetch,
  });

  const [fetchStudiesQuery] = useLazyQuery(GET_INGREDIENT_STUDIES);

  const ingredient = data?.ingredient || null;

  // Set initial studies from ingredient query
  useEffect(() => {
    if (data?.ingredient?.studies) {
      setStudies(data.ingredient.studies);
    }
  }, [data?.ingredient?.studies]);

  const refetch = useCallback(async () => {
    await refetchQuery();
  }, [refetchQuery]);

  const loadStudies = useCallback(async () => {
    if (!ingredientId) return;

    setStudiesLoading(true);
    try {
      const { data: studiesData } = await fetchStudiesQuery({
        variables: { ingredientId, limit: 10, offset: 0 },
      });
      if (studiesData?.ingredientStudies) {
        setStudies(studiesData.ingredientStudies.studies || []);
        setHasMoreStudies(studiesData.ingredientStudies.hasMore || false);
      }
    } finally {
      setStudiesLoading(false);
    }
  }, [ingredientId, fetchStudiesQuery]);

  const loadMoreStudies = useCallback(async () => {
    if (!ingredientId || studiesLoading || !hasMoreStudies) return;

    setStudiesLoading(true);
    try {
      const { data: studiesData } = await fetchStudiesQuery({
        variables: { ingredientId, limit: 10, offset: studies.length },
      });
      if (studiesData?.ingredientStudies) {
        setStudies((prev) => [...prev, ...(studiesData.ingredientStudies.studies || [])]);
        setHasMoreStudies(studiesData.ingredientStudies.hasMore || false);
      }
    } finally {
      setStudiesLoading(false);
    }
  }, [ingredientId, studiesLoading, hasMoreStudies, studies.length, fetchStudiesQuery]);

  return {
    ingredient,
    loading,
    error: error || null,
    refetch,
    loadStudies,
    studies,
    studiesLoading,
    hasMoreStudies,
    loadMoreStudies,
  };
}

export default useIntelligenceQuery;
