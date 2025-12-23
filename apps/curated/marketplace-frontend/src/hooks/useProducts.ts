/**
 * Custom hooks for product operations
 * Task: T087 - Create custom hooks for product operations
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useSearchParams } from 'react-router-dom';
import {
  SEARCH_PRODUCTS,
  GET_PRODUCT,
  GET_PRODUCTS_BY_VENDOR,
} from '../graphql/queries/marketplace-products.graphql';

export interface ProductFilters {
  vendorId?: string;
  minPrice?: number;
  maxPrice?: number;
  skinTypes?: string[];
  inStockOnly?: boolean;
  categories?: string[];
}

export interface PaginationOptions {
  skip: number;
  take: number;
}

export interface UseProductsOptions {
  query?: string;
  filters?: ProductFilters;
  pagination?: PaginationOptions;
  includeScan?: boolean;
}

/**
 * Hook for searching products with filters and pagination
 * Automatically syncs with URL search params
 */
export function useProducts(options: UseProductsOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync state with URL params
  const query = options.query || searchParams.get('q') || '';
  const skip = options.pagination?.skip || Number(searchParams.get('skip')) || 0;
  const take = options.pagination?.take || Number(searchParams.get('take')) || 20;

  const { data, loading, error, refetch, fetchMore } = useQuery(SEARCH_PRODUCTS, {
    variables: {
      query,
      filters: options.filters,
      pagination: { skip, take },
      includeScan: options.includeScan || false,
    },
    skip: !query && !options.filters,
  });

  const products = data?.searchProducts?.items || [];
  const totalItems = data?.searchProducts?.totalItems || 0;
  const hasNextPage = data?.searchProducts?.hasNextPage || false;

  // Update URL when search changes
  const updateSearch = useCallback(
    (newQuery: string, newFilters?: ProductFilters) => {
      const params = new URLSearchParams();
      if (newQuery) params.set('q', newQuery);
      if (newFilters?.vendorId) params.set('vendor', newFilters.vendorId);
      if (newFilters?.inStockOnly) params.set('inStock', 'true');
      setSearchParams(params);
    },
    [setSearchParams]
  );

  // Load more products (pagination)
  const loadMore = useCallback(async () => {
    if (!hasNextPage || loading) return;

    await fetchMore({
      variables: {
        pagination: { skip: products.length, take },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          searchProducts: {
            ...fetchMoreResult.searchProducts,
            items: [...prev.searchProducts.items, ...fetchMoreResult.searchProducts.items],
          },
        };
      },
    });
  }, [hasNextPage, loading, fetchMore, products.length, take]);

  return {
    products,
    totalItems,
    hasNextPage,
    loading,
    error,
    refetch,
    loadMore,
    updateSearch,
  };
}

/**
 * Hook for fetching a single product with progressive disclosure
 */
export function useProduct(productId: string, includeStudy: boolean = false) {
  const { data, loading, error, refetch } = useQuery(GET_PRODUCT, {
    variables: { id: productId, includeStudy },
    skip: !productId,
  });

  const product = data?.product;

  // Load study data on demand
  const [loadStudyData, { loading: studyLoading }] = useLazyQuery(GET_PRODUCT, {
    variables: { id: productId, includeStudy: true },
  });

  return {
    product,
    loading,
    error,
    refetch,
    loadStudyData,
    studyLoading,
  };
}

/**
 * Hook for fetching products by vendor
 */
export function useVendorProducts(vendorId: string, pagination?: PaginationOptions) {
  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS_BY_VENDOR, {
    variables: {
      vendorId,
      pagination: pagination || { skip: 0, take: 20 },
    },
    skip: !vendorId,
  });

  const products = data?.productsByVendor?.items || [];
  const totalItems = data?.productsByVendor?.totalItems || 0;

  return {
    products,
    totalItems,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for calculating pricing based on quantity
 */
export function usePricingCalculator(pricingTiers: any[]) {
  const [quantity, setQuantity] = useState(1);

  const calculatePrice = useCallback(
    (qty: number) => {
      if (!pricingTiers || pricingTiers.length === 0) {
        return { unitPrice: 0, totalPrice: 0, tier: null, savings: 0 };
      }

      // Find applicable tier (highest minQuantity that qty meets)
      const sortedTiers = [...pricingTiers].sort((a, b) => b.minQuantity - a.minQuantity);
      const tier = sortedTiers.find(t => qty >= t.minQuantity) || pricingTiers[0];

      const unitPrice = tier.unitPrice;
      const totalPrice = unitPrice * qty;
      const basePrice = pricingTiers[0].unitPrice * qty;
      const savings = basePrice - totalPrice;

      return { unitPrice, totalPrice, tier, savings };
    },
    [pricingTiers]
  );

  const pricing = calculatePrice(quantity);

  return {
    quantity,
    setQuantity,
    pricing,
    calculatePrice,
  };
}

/**
 * Hook for product search with debounce
 */
export function useProductSearch(debounceMs: number = 300) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  const [search, { data, loading, error }] = useLazyQuery(SEARCH_PRODUCTS);

  useEffect(() => {
    if (debouncedTerm) {
      search({
        variables: {
          query: debouncedTerm,
          pagination: { skip: 0, take: 20 },
        },
      });
    }
  }, [debouncedTerm, search]);

  const results = data?.searchProducts?.items || [];

  return {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    error,
  };
}

/**
 * Hook for filtering products
 */
export function useProductFilters() {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [searchParams, setSearchParams] = useSearchParams();

  // Load filters from URL on mount
  useEffect(() => {
    const urlFilters: ProductFilters = {};

    const vendorId = searchParams.get('vendor');
    if (vendorId) urlFilters.vendorId = vendorId;

    const minPrice = searchParams.get('minPrice');
    if (minPrice) urlFilters.minPrice = Number(minPrice);

    const maxPrice = searchParams.get('maxPrice');
    if (maxPrice) urlFilters.maxPrice = Number(maxPrice);

    const inStockOnly = searchParams.get('inStock');
    if (inStockOnly) urlFilters.inStockOnly = inStockOnly === 'true';

    const skinTypes = searchParams.get('skinTypes');
    if (skinTypes) urlFilters.skinTypes = skinTypes.split(',');

    setFilters(urlFilters);
  }, [searchParams]);

  // Update URL when filters change
  const updateFilters = useCallback(
    (newFilters: Partial<ProductFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);

      const params = new URLSearchParams(searchParams);

      if (updatedFilters.vendorId) {
        params.set('vendor', updatedFilters.vendorId);
      } else {
        params.delete('vendor');
      }

      if (updatedFilters.minPrice !== undefined) {
        params.set('minPrice', String(updatedFilters.minPrice));
      } else {
        params.delete('minPrice');
      }

      if (updatedFilters.maxPrice !== undefined) {
        params.set('maxPrice', String(updatedFilters.maxPrice));
      } else {
        params.delete('maxPrice');
      }

      if (updatedFilters.inStockOnly) {
        params.set('inStock', 'true');
      } else {
        params.delete('inStock');
      }

      if (updatedFilters.skinTypes && updatedFilters.skinTypes.length > 0) {
        params.set('skinTypes', updatedFilters.skinTypes.join(','));
      } else {
        params.delete('skinTypes');
      }

      setSearchParams(params);
    },
    [filters, searchParams, setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  const hasActiveFilters = Object.keys(filters).length > 0;

  return {
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  };
}
