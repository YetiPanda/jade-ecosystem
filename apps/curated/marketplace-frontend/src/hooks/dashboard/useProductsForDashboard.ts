import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

/**
 * Dashboard Product Type
 * Transforms Vendure Product API response to Figma component format
 */
export interface DashboardProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  wholesalePrice: number;
  minOrderQty: number;
  stock: number;
  sold: number;
  rating: number;
  reviews: number;
  status: 'active' | 'inactive';
  image: string;
  sku?: string;
  variantId?: string; // Primary variant ID for price/stock updates
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductFilters {
  category?: string;
  status?: string;
  searchTerm?: string;
  priceMin?: number;
  priceMax?: number;
}

const GET_PRODUCTS_FOR_DASHBOARD = gql`
  query GetProductsForDashboard($filters: ProductFilters, $pagination: PaginationInput) {
    products(filters: $filters, pagination: $pagination) {
      edges {
        node {
          id
          name
          description
          slug
          enabled
          createdAt
          updatedAt
          variants {
            id
            sku
            name
            price
            stockLevel
            customFields {
              wholesalePrice
              minOrderQty
            }
          }
          featuredAsset {
            id
            source
            preview
          }
          facetValues {
            id
            code
            name
            facet {
              id
              code
              name
            }
          }
          customFields {
            brand
            rating
            reviewCount
            totalSold
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
`;

/**
 * Hook to fetch and transform products for dashboard display
 *
 * Transforms Vendure GraphQL Product data into the format expected by
 * Figma ProductManagement component
 *
 * @param filters - Product filter criteria
 * @returns { products, loading, error, refetch }
 */
export function useProductsForDashboard(filters?: ProductFilters) {
  const { data, loading, error, refetch } = useQuery(GET_PRODUCTS_FOR_DASHBOARD, {
    variables: {
      filters: filters || {},
      pagination: {
        limit: 100,
        offset: 0,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const products = useMemo((): DashboardProduct[] => {
    if (!data?.products?.edges) return [];

    return data.products.edges.map(({ node: product }: any) => {
      // Get primary variant (first variant)
      const primaryVariant = product.variants?.[0];

      // Extract category from facet values
      const categoryFacet = product.facetValues?.find(
        (fv: any) => fv.facet.code === 'category'
      );

      // Calculate average stock across all variants
      const totalStock = product.variants?.reduce(
        (sum: number, v: any) => sum + (v.stockLevel || 0),
        0
      ) || 0;

      return {
        id: parseInt(product.id, 10),
        name: product.name,
        brand: product.customFields?.brand || 'Unknown',
        category: categoryFacet?.name || 'Uncategorized',
        price: primaryVariant?.price ? primaryVariant.price / 100 : 0, // Convert from cents
        wholesalePrice: primaryVariant?.customFields?.wholesalePrice
          ? primaryVariant.customFields.wholesalePrice / 100
          : 0,
        minOrderQty: primaryVariant?.customFields?.minOrderQty || 1,
        stock: totalStock,
        sold: product.customFields?.totalSold || 0,
        rating: product.customFields?.rating || 0,
        reviews: product.customFields?.reviewCount || 0,
        status: product.enabled ? 'active' : 'inactive',
        image: product.featuredAsset?.preview || product.featuredAsset?.source || '',
        sku: primaryVariant?.sku,
        variantId: primaryVariant?.id, // Primary variant ID for price/stock updates
        createdAt: product.createdAt ? new Date(product.createdAt) : undefined,
        updatedAt: product.updatedAt ? new Date(product.updatedAt) : undefined,
      };
    });
  }, [data]);

  return {
    products,
    loading,
    error,
    refetch,
    totalCount: data?.products?.totalCount || 0,
  };
}

/**
 * Hook to get product statistics for dashboard metrics
 */
export function useProductStats() {
  const { products, loading } = useProductsForDashboard();

  const stats = useMemo(() => {
    if (loading || !products.length) {
      return {
        totalProducts: 0,
        activeProducts: 0,
        lowStockProducts: 0,
        totalValue: 0,
      };
    }

    return {
      totalProducts: products.length,
      activeProducts: products.filter(p => p.status === 'active').length,
      lowStockProducts: products.filter(p => p.stock < p.minOrderQty * 2).length,
      totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    };
  }, [products, loading]);

  return { stats, loading };
}
