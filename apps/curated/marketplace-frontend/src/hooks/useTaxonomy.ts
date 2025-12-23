/**
 * Custom hook for Product Taxonomy queries
 */

import { useQuery, useMutation, type QueryResult } from '@apollo/client';
import {
  GET_TAXONOMY_FILTER_OPTIONS,
  GET_PRODUCT_CATEGORIES,
  GET_PRODUCT_CATEGORY,
  GET_PRODUCT_CATEGORY_BY_SLUG,
  GET_PRODUCT_FUNCTIONS,
  GET_SKIN_CONCERNS,
  GET_PRODUCT_FORMATS,
  GET_PRODUCT_TAXONOMY,
  GET_TAXONOMY_STATS,
  CREATE_PRODUCT_TAXONOMY,
  UPDATE_PRODUCT_TAXONOMY,
  DELETE_PRODUCT_TAXONOMY,
  GENERATE_PRODUCT_EMBEDDING,
  GENERATE_ALL_PRODUCT_EMBEDDINGS,
  SEARCH_PRODUCTS,
  SEARCH_PRODUCTS_BY_SEMANTIC,
  FIND_COMPATIBLE_PRODUCTS,
} from '../graphql/taxonomy.queries';

// ========================================
// Types
// ========================================

export interface ProductCategory {
  id: string;
  name: string;
  seoSlug: string;
  description?: string;
  level: number;
  displayOrder: number;
  isActive: boolean;
  productCount?: number;
  parent?: ProductCategory;
  children?: ProductCategory[];
}

export interface ProductFunction {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  productCount?: number;
}

export interface SkinConcern {
  id: string;
  name: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  productCount?: number;
}

export interface ProductFormat {
  id: string;
  name: string;
  category?: string;
  description?: string;
  isActive: boolean;
  productCount?: number;
}

export interface TargetArea {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface ProductRegion {
  id: string;
  name: string;
  countryCode?: string;
  description?: string;
  isActive: boolean;
}

export type UsageTime = 'MORNING' | 'EVENING' | 'ANYTIME' | 'NIGHT_ONLY' | 'POST_TREATMENT';
export type ProfessionalLevel = 'OTC' | 'PROFESSIONAL' | 'MEDICAL_GRADE' | 'IN_OFFICE_ONLY';

export interface TaxonomyFilterOptions {
  categories: ProductCategory[];
  functions: ProductFunction[];
  concerns: SkinConcern[];
  formats: ProductFormat[];
  targetAreas: TargetArea[];
  regions: ProductRegion[];
  usageTimes: UsageTime[];
  professionalLevels: ProfessionalLevel[];
}

export interface ProductTaxonomy {
  id: string;
  productId: string;
  category?: ProductCategory;
  primaryFunctions: ProductFunction[];
  skinConcerns: SkinConcern[];
  targetAreas: TargetArea[];
  productFormat?: ProductFormat;
  region?: ProductRegion;
  usageTime: UsageTime;
  professionalLevel: ProfessionalLevel;
  protocolRequired: boolean;
  formulationBase?: string;
  taxonomyCompletenessScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaxonomyStats {
  totalProducts: number;
  averageCompletenessScore: number;
  categoryCounts: Array<{ count: number }>;
}

// ========================================
// Query Hooks
// ========================================

/**
 * Get all taxonomy filter options
 */
export function useTaxonomyFilterOptions() {
  return useQuery<{ taxonomyFilterOptions: TaxonomyFilterOptions }>(
    GET_TAXONOMY_FILTER_OPTIONS,
    {
      fetchPolicy: 'cache-first',
    }
  );
}

/**
 * Get product categories
 */
export function useProductCategories(variables?: {
  parentId?: string;
  level?: number;
  isActive?: boolean;
}) {
  return useQuery<{ productCategories: ProductCategory[] }>(
    GET_PRODUCT_CATEGORIES,
    {
      variables,
      fetchPolicy: 'cache-first',
    }
  );
}

/**
 * Get single product category
 */
export function useProductCategory(id: string) {
  return useQuery<{ productCategory: ProductCategory }>(GET_PRODUCT_CATEGORY, {
    variables: { id },
    skip: !id,
  });
}

/**
 * Get product category by slug
 */
export function useProductCategoryBySlug(slug: string) {
  return useQuery<{ productCategoryBySlug: ProductCategory }>(
    GET_PRODUCT_CATEGORY_BY_SLUG,
    {
      variables: { slug },
      skip: !slug,
    }
  );
}

/**
 * Get product functions
 */
export function useProductFunctions(isActive?: boolean) {
  return useQuery<{ productFunctions: ProductFunction[] }>(
    GET_PRODUCT_FUNCTIONS,
    {
      variables: { isActive },
      fetchPolicy: 'cache-first',
    }
  );
}

/**
 * Get skin concerns
 */
export function useSkinConcerns(isActive?: boolean) {
  return useQuery<{ skinConcerns: SkinConcern[] }>(GET_SKIN_CONCERNS, {
    variables: { isActive },
    fetchPolicy: 'cache-first',
  });
}

/**
 * Get product formats
 */
export function useProductFormats(variables?: {
  isActive?: boolean;
  category?: string;
}) {
  return useQuery<{ productFormats: ProductFormat[] }>(GET_PRODUCT_FORMATS, {
    variables,
    fetchPolicy: 'cache-first',
  });
}

/**
 * Get product taxonomy
 */
export function useProductTaxonomy(productId: string) {
  return useQuery<{ productTaxonomy: ProductTaxonomy }>(GET_PRODUCT_TAXONOMY, {
    variables: { productId },
    skip: !productId,
  });
}

/**
 * Get taxonomy statistics
 */
export function useTaxonomyStats() {
  return useQuery<{ taxonomyStats: TaxonomyStats }>(GET_TAXONOMY_STATS);
}

// ========================================
// Mutation Hooks
// ========================================

/**
 * Create product taxonomy
 */
export function useCreateProductTaxonomy() {
  return useMutation(CREATE_PRODUCT_TAXONOMY, {
    refetchQueries: ['GetTaxonomyStats'],
  });
}

/**
 * Update product taxonomy
 */
export function useUpdateProductTaxonomy() {
  return useMutation(UPDATE_PRODUCT_TAXONOMY);
}

/**
 * Delete product taxonomy
 */
export function useDeleteProductTaxonomy() {
  return useMutation(DELETE_PRODUCT_TAXONOMY, {
    refetchQueries: ['GetTaxonomyStats'],
  });
}

/**
 * Generate product embedding
 */
export function useGenerateProductEmbedding() {
  return useMutation(GENERATE_PRODUCT_EMBEDDING);
}

/**
 * Generate all product embeddings
 */
export function useGenerateAllProductEmbeddings() {
  return useMutation(GENERATE_ALL_PRODUCT_EMBEDDINGS);
}

// ========================================
// Search Hooks
// ========================================

export interface SearchResult {
  productId: string;
  vendureProductId: string;
  brandName: string;
  productName: string;
  categoryPath?: string;
  professionalLevel: ProfessionalLevel;
  priceWholesale: number;
  taxonomyCompletenessScore?: number;
  relevanceScore: number;
  matchType: string;
}

/**
 * Basic text search
 */
export function useSearchProducts(variables: {
  query: string;
  limit?: number;
  filters?: any;
}) {
  return useQuery<{ searchProducts: SearchResult[] }>(
    SEARCH_PRODUCTS,
    {
      variables,
      skip: !variables.query || variables.query.length < 2,
    }
  );
}

/**
 * Semantic vector search
 */
export function useSearchProductsBySemantic(variables: {
  query: string;
  limit?: number;
  filters?: any;
}) {
  return useQuery<{ searchProductsBySemantic: SearchResult[] }>(
    SEARCH_PRODUCTS_BY_SEMANTIC,
    {
      variables,
      skip: !variables.query || variables.query.length < 2,
    }
  );
}

/**
 * Find compatible products using tensor similarity
 */
export function useFindCompatibleProducts(variables: {
  productId: string;
  limit?: number;
}) {
  return useQuery<{ findCompatibleProducts: SearchResult[] }>(
    FIND_COMPATIBLE_PRODUCTS,
    {
      variables,
      skip: !variables.productId,
    }
  );
}
