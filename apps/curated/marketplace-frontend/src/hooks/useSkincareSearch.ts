/**
 * Custom hooks for skincare semantic search
 * Feature: RDF Skincare Taxonomy Integration
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import { gql } from '@apollo/client';
import { useDebounce } from './useDebounce';

// GraphQL queries inline since codegen hasn't run yet
const SKINCARE_PRODUCT_FRAGMENT = gql`
  fragment SkincareProductFields on SkincareProduct {
    id
    productName
    brand
    category
    subcategory
    skinTypes
    concerns
    ingredients
    benefits
    keyBenefits
    priceTier
    texture
    routineStep
    volume
    fragranceFree
    vegan
    crueltyFree
    score
  }
`;

const SEARCH_SKINCARE_PRODUCTS = gql`
  ${SKINCARE_PRODUCT_FRAGMENT}
  query SearchSkincareProducts(
    $query: String!
    $filters: SkincareSearchFilters
    $limit: Int
  ) {
    searchSkincareProducts(query: $query, filters: $filters, limit: $limit) {
      ...SkincareProductFields
    }
  }
`;

const GET_SKINCARE_FILTER_OPTIONS = gql`
  query GetSkincareFilterOptions {
    skincareFilterOptions {
      skinTypes
      concerns
      categories
      subcategories
      textures
      routineSteps
      priceTiers
    }
  }
`;

const FIND_SIMILAR_SKINCARE_PRODUCTS = gql`
  ${SKINCARE_PRODUCT_FRAGMENT}
  query FindSimilarSkincareProducts($productId: ID!, $limit: Int) {
    findSimilarSkincareProducts(productId: $productId, limit: $limit) {
      ...SkincareProductFields
    }
  }
`;

const BUILD_SKINCARE_ROUTINE = gql`
  ${SKINCARE_PRODUCT_FRAGMENT}
  query BuildSkincareRoutine($profile: SkinProfileInput!) {
    buildSkincareRoutine(profile: $profile) {
      steps {
        step
        products {
          ...SkincareProductFields
        }
      }
    }
  }
`;

const GET_SKINCARE_PRODUCT = gql`
  ${SKINCARE_PRODUCT_FRAGMENT}
  query GetSkincareProduct($id: ID!) {
    skincareProduct(id: $id) {
      ...SkincareProductFields
    }
  }
`;

const SKINCARE_PRODUCTS_BY_CATEGORY = gql`
  ${SKINCARE_PRODUCT_FRAGMENT}
  query SkincareProductsByCategory($category: String!, $limit: Int) {
    skincareProductsByCategory(category: $category, limit: $limit) {
      ...SkincareProductFields
    }
  }
`;

/**
 * Skincare product type
 */
export interface SkincareProduct {
  id: string;
  productName: string;
  brand: string;
  category: string;
  subcategory: string;
  skinTypes: string[];
  concerns: string[];
  ingredients: string[];
  benefits: string[];
  keyBenefits: string[];
  priceTier: 'BUDGET' | 'MODERATE' | 'PREMIUM' | 'LUXURY';
  texture: string;
  routineStep: string;
  volume: string;
  fragranceFree: boolean;
  vegan: boolean;
  crueltyFree: boolean;
  score: number;
}

/**
 * Skincare search filters
 */
export interface SkincareSearchFilters {
  skinTypes?: string[];
  concerns?: string[];
  category?: string;
  subcategory?: string;
  priceTier?: string;
  fragranceFree?: boolean;
  vegan?: boolean;
  crueltyFree?: boolean;
  routineStep?: string;
  texture?: string;
}

/**
 * Skin profile for recommendations
 */
export interface SkinProfile {
  skinType: string;
  concerns: string[];
  sensitivities?: string[];
  preferFragranceFree?: boolean;
  preferVegan?: boolean;
  budgetTier?: string;
}

/**
 * Filter options from the API
 */
export interface SkincareFilterOptions {
  skinTypes: string[];
  concerns: string[];
  categories: string[];
  subcategories: string[];
  textures: string[];
  routineSteps: string[];
  priceTiers: string[];
}

/**
 * Hook for semantic skincare product search with debounce
 */
export function useSkincareSearch(debounceMs: number = 300) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<SkincareSearchFilters>({});

  const debouncedTerm = useDebounce(searchTerm, debounceMs);

  const [search, { data, loading, error }] = useLazyQuery(SEARCH_SKINCARE_PRODUCTS);

  // Search when debounced term changes
  useEffect(() => {
    if (debouncedTerm) {
      search({
        variables: {
          query: debouncedTerm,
          filters: Object.keys(filters).length > 0 ? filters : undefined,
          limit: 20,
        },
      });
    }
  }, [debouncedTerm, filters, search]);

  // Update URL when search changes
  const updateSearch = useCallback(
    (newQuery: string) => {
      setSearchTerm(newQuery);
      const params = new URLSearchParams(searchParams);
      if (newQuery) {
        params.set('q', newQuery);
      } else {
        params.delete('q');
      }
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  // Update filters
  const updateFilters = useCallback(
    (newFilters: Partial<SkincareSearchFilters>) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
    },
    []
  );

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const products: SkincareProduct[] = data?.searchSkincareProducts || [];
  const hasActiveFilters = Object.keys(filters).length > 0;

  return {
    searchTerm,
    setSearchTerm: updateSearch,
    products,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  };
}

/**
 * Hook for fetching skincare filter options
 */
export function useSkincareFilterOptions() {
  const { data, loading, error } = useQuery(GET_SKINCARE_FILTER_OPTIONS);

  const filterOptions: SkincareFilterOptions = data?.skincareFilterOptions || {
    skinTypes: [],
    concerns: [],
    categories: [],
    subcategories: [],
    textures: [],
    routineSteps: [],
    priceTiers: [],
  };

  return {
    filterOptions,
    loading,
    error,
  };
}

/**
 * Hook for finding similar skincare products
 */
export function useSimilarSkincareProducts(productId: string, limit: number = 5) {
  const { data, loading, error, refetch } = useQuery(FIND_SIMILAR_SKINCARE_PRODUCTS, {
    variables: { productId, limit },
    skip: !productId,
  });

  const products: SkincareProduct[] = data?.findSimilarSkincareProducts || [];

  return {
    products,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for building a skincare routine based on profile
 */
export function useSkincareRoutine(profile: SkinProfile | null) {
  const [buildRoutine, { data, loading, error }] = useLazyQuery(BUILD_SKINCARE_ROUTINE);

  // Build routine when profile is provided
  useEffect(() => {
    if (profile) {
      buildRoutine({
        variables: { profile },
      });
    }
  }, [profile, buildRoutine]);

  const routine = data?.buildSkincareRoutine?.steps || [];

  return {
    routine,
    loading,
    error,
    buildRoutine: (newProfile: SkinProfile) => buildRoutine({ variables: { profile: newProfile } }),
  };
}

/**
 * Hook for fetching a single skincare product
 */
export function useSkincareProduct(productId: string) {
  const { data, loading, error, refetch } = useQuery(GET_SKINCARE_PRODUCT, {
    variables: { id: productId },
    skip: !productId,
  });

  const product: SkincareProduct | null = data?.skincareProduct || null;

  return {
    product,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for fetching skincare products by category
 */
export function useSkincareByCategory(category: string, limit: number = 20) {
  const { data, loading, error, refetch } = useQuery(SKINCARE_PRODUCTS_BY_CATEGORY, {
    variables: { category, limit },
    skip: !category,
  });

  const products: SkincareProduct[] = data?.skincareProductsByCategory || [];

  return {
    products,
    loading,
    error,
    refetch,
  };
}
