import { useMemo } from 'react';
import { useOrderStats } from './useOrdersForDashboard';
import { useProductStats } from './useProductsForDashboard';

/**
 * Dashboard Metrics
 * Aggregated statistics for dashboard overview
 */
export interface DashboardMetrics {
  revenue: {
    total: number;
    change: number; // Percentage change from previous period
    trend: 'up' | 'down' | 'stable';
  };
  orders: {
    total: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  products: {
    total: number;
    active: number;
    lowStock: number;
  };
  customers: {
    total: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface ActivityItem {
  id: string;
  type: 'order' | 'product' | 'customer' | 'inventory';
  title: string;
  description: string;
  timestamp: Date;
  icon?: string;
}

/**
 * Hook to get comprehensive dashboard metrics
 *
 * Combines data from multiple sources to provide overview statistics
 *
 * @param dateRange - Date range for metrics calculation
 * @returns { metrics, activities, loading }
 */
export function useDashboardMetrics(dateRange?: { from: Date; to: Date }) {
  const { stats: orderStats, loading: ordersLoading } = useOrderStats(dateRange);
  const { stats: productStats, loading: productsLoading } = useProductStats();

  const loading = ordersLoading || productsLoading;

  const metrics = useMemo((): DashboardMetrics => {
    if (loading) {
      return {
        revenue: { total: 0, change: 0, trend: 'stable' },
        orders: { total: 0, change: 0, trend: 'stable' },
        products: { total: 0, active: 0, lowStock: 0 },
        customers: { total: 0, change: 0, trend: 'stable' },
      };
    }

    // TODO: Calculate actual trends by comparing with previous period
    // For now, using mock trend data
    return {
      revenue: {
        total: orderStats.totalRevenue,
        change: 12.5, // Mock: +12.5% from previous period
        trend: 'up',
      },
      orders: {
        total: orderStats.totalOrders,
        change: 8.3, // Mock: +8.3% from previous period
        trend: 'up',
      },
      products: {
        total: productStats.totalProducts,
        active: productStats.activeProducts,
        lowStock: productStats.lowStockProducts,
      },
      customers: {
        total: 0, // TODO: Implement customer count from API
        change: 5.2, // Mock: +5.2% from previous period
        trend: 'up',
      },
    };
  }, [loading, orderStats, productStats]);

  // Mock activity feed - will be replaced with real data
  const activities = useMemo((): ActivityItem[] => {
    return [
      {
        id: '1',
        type: 'order',
        title: 'New Order Received',
        description: 'Order #1234 from John Doe',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      },
      {
        id: '2',
        type: 'product',
        title: 'Product Updated',
        description: 'HydraFacial Serum stock updated',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      },
      {
        id: '3',
        type: 'inventory',
        title: 'Low Stock Alert',
        description: 'Vitamin C Serum below minimum threshold',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        id: '4',
        type: 'customer',
        title: 'New Customer Registered',
        description: 'Jane Smith created an account',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      },
    ];
  }, []);

  return {
    metrics,
    activities,
    loading,
  };
}

/**
 * Hook to format currency values for display
 */
export function useFormatCurrency() {
  return (value: number, currencyCode: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(value);
  };
}

/**
 * Hook to format relative time (e.g., "5 minutes ago")
 */
export function useFormatRelativeTime() {
  return (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };
}
