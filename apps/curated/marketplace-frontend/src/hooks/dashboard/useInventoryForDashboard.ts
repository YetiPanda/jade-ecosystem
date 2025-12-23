import { useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { toast } from 'sonner';

/**
 * Dashboard Inventory Item Type
 * Combines product and variant data for inventory management
 */
export interface DashboardInventoryItem {
  id: string;
  variantId: string;
  productId: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstocked';
  lastRestocked?: Date;
  avgDailySales: number;
  daysOfStock: number;
  price: number;
  wholesalePrice: number;
}

export interface InventoryFilters {
  status?: string;
  category?: string;
  searchTerm?: string;
  lowStockOnly?: boolean;
}

const GET_INVENTORY_FOR_DASHBOARD = gql`
  query GetInventoryForDashboard($filters: ProductFilters) {
    products(filters: $filters, pagination: { limit: 1000 }) {
      edges {
        node {
          id
          name
          variants {
            id
            sku
            name
            stockLevel
            price
            updatedAt
            customFields {
              wholesalePrice
              minOrderQty
              reorderPoint
              maxStockLevel
            }
          }
          facetValues {
            id
            name
            facet {
              code
            }
          }
          customFields {
            totalSold
            avgDailySales
          }
        }
      }
      totalCount
    }
  }
`;

const UPDATE_STOCK_LEVEL = gql`
  mutation UpdateStockLevel($variantId: ID!, $stockLevel: Int!) {
    updateProductVariant(id: $variantId, input: { stockLevel: $stockLevel }) {
      id
      sku
      stockLevel
      updatedAt
    }
  }
`;

const BULK_UPDATE_STOCK = gql`
  mutation BulkUpdateStock($updates: [StockUpdateInput!]!) {
    bulkUpdateStock(updates: $updates) {
      success
      updated
      errors {
        variantId
        message
      }
    }
  }
`;

/**
 * Calculate inventory status based on stock levels
 */
function calculateInventoryStatus(
  currentStock: number,
  minStock: number,
  maxStock: number,
  reorderPoint: number
): DashboardInventoryItem['status'] {
  if (currentStock === 0) return 'out-of-stock';
  if (currentStock <= reorderPoint) return 'low-stock';
  if (maxStock && currentStock > maxStock) return 'overstocked';
  return 'in-stock';
}

/**
 * Calculate days of stock remaining based on average daily sales
 */
function calculateDaysOfStock(currentStock: number, avgDailySales: number): number {
  if (avgDailySales === 0) return 999; // No sales data
  return Math.floor(currentStock / avgDailySales);
}

/**
 * Hook to fetch and transform inventory data for dashboard display
 */
export function useInventoryForDashboard(filters?: InventoryFilters) {
  const { data, loading, error, refetch } = useQuery(GET_INVENTORY_FOR_DASHBOARD, {
    variables: {
      filters: filters || {},
    },
    fetchPolicy: 'cache-and-network',
  });

  const inventory = useMemo((): DashboardInventoryItem[] => {
    if (!data?.products?.edges) return [];

    const items: DashboardInventoryItem[] = [];

    data.products.edges.forEach(({ node: product }: any) => {
      // Get category from facet values
      const categoryFacet = product.facetValues?.find(
        (fv: any) => fv.facet.code === 'category'
      );
      const category = categoryFacet?.name || 'Uncategorized';

      // Process each variant as separate inventory item
      product.variants?.forEach((variant: any) => {
        const currentStock = variant.stockLevel || 0;
        const minStock = variant.customFields?.minOrderQty || 10;
        const maxStock = variant.customFields?.maxStockLevel || 1000;
        const reorderPoint = variant.customFields?.reorderPoint || minStock * 2;
        const avgDailySales = product.customFields?.avgDailySales || 0;

        const item: DashboardInventoryItem = {
          id: `${product.id}-${variant.id}`,
          variantId: variant.id,
          productId: product.id,
          name: variant.name || product.name,
          sku: variant.sku,
          category,
          currentStock,
          minStock,
          maxStock,
          reorderPoint,
          status: calculateInventoryStatus(currentStock, minStock, maxStock, reorderPoint),
          lastRestocked: variant.updatedAt ? new Date(variant.updatedAt) : undefined,
          avgDailySales,
          daysOfStock: calculateDaysOfStock(currentStock, avgDailySales),
          price: variant.price / 100, // Convert from cents
          wholesalePrice: (variant.customFields?.wholesalePrice || 0) / 100,
        };

        items.push(item);
      });
    });

    // Apply filters
    let filteredItems = items;

    if (filters?.status && filters.status !== 'all') {
      filteredItems = filteredItems.filter(item => item.status === filters.status);
    }

    if (filters?.category && filters.category !== 'all') {
      filteredItems = filteredItems.filter(item => item.category === filters.category);
    }

    if (filters?.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filteredItems = filteredItems.filter(
        item =>
          item.name.toLowerCase().includes(term) ||
          item.sku.toLowerCase().includes(term)
      );
    }

    if (filters?.lowStockOnly) {
      filteredItems = filteredItems.filter(
        item => item.status === 'low-stock' || item.status === 'out-of-stock'
      );
    }

    return filteredItems;
  }, [data, filters]);

  return {
    inventory,
    loading,
    error,
    refetch,
    totalCount: data?.products?.totalCount || 0,
  };
}

/**
 * Hook for inventory mutations (stock updates)
 */
export function useInventoryMutations() {
  const [updateStockMutation, { loading: updating }] = useMutation(UPDATE_STOCK_LEVEL);
  const [bulkUpdateMutation, { loading: bulkUpdating }] = useMutation(BULK_UPDATE_STOCK);

  const updateStock = async (variantId: string, newStockLevel: number) => {
    try {
      const result = await updateStockMutation({
        variables: {
          variantId,
          stockLevel: newStockLevel,
        },
        refetchQueries: ['GetInventoryForDashboard', 'GetProductsForDashboard'],
      });

      toast.success('Stock level updated successfully');
      return result.data?.updateProductVariant;
    } catch (error: any) {
      toast.error(`Failed to update stock: ${error.message}`);
      throw error;
    }
  };

  const bulkUpdateStock = async (updates: Array<{ variantId: string; stockLevel: number }>) => {
    try {
      const result = await bulkUpdateMutation({
        variables: { updates },
        refetchQueries: ['GetInventoryForDashboard', 'GetProductsForDashboard'],
      });

      const response = result.data?.bulkUpdateStock;
      if (response?.success) {
        toast.success(`Updated ${response.updated} items successfully`);
      } else {
        toast.error('Some items failed to update');
      }

      return response;
    } catch (error: any) {
      toast.error(`Bulk update failed: ${error.message}`);
      throw error;
    }
  };

  return {
    updateStock,
    bulkUpdateStock,
    loading: updating || bulkUpdating,
  };
}

/**
 * Hook to get inventory statistics
 */
export function useInventoryStats() {
  const { inventory, loading } = useInventoryForDashboard();

  const stats = useMemo(() => {
    if (loading || !inventory.length) {
      return {
        totalItems: 0,
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
        overstocked: 0,
        totalValue: 0,
        needsReorder: 0,
      };
    }

    return {
      totalItems: inventory.length,
      inStock: inventory.filter(i => i.status === 'in-stock').length,
      lowStock: inventory.filter(i => i.status === 'low-stock').length,
      outOfStock: inventory.filter(i => i.status === 'out-of-stock').length,
      overstocked: inventory.filter(i => i.status === 'overstocked').length,
      totalValue: inventory.reduce((sum, i) => sum + (i.currentStock * i.wholesalePrice), 0),
      needsReorder: inventory.filter(i => i.currentStock <= i.reorderPoint).length,
    };
  }, [inventory, loading]);

  return { stats, loading };
}
