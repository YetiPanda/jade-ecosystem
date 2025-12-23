import { useQuery } from '@apollo/client';
import { GET_VENDOR_DASHBOARD } from '../graphql/dashboard.queries';
import type { VendorDashboardMetrics, DateRangeInput } from '../types/dashboard';

interface UseDashboardMetricsResult {
  metrics: VendorDashboardMetrics | null;
  loading: boolean;
  error: Error | undefined;
  refetch: () => void;
}

/**
 * Custom hook to fetch vendor dashboard metrics
 *
 * @param dateRange - The date range for the metrics
 * @returns Dashboard metrics, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * const { metrics, loading, error } = useDashboardMetrics({
 *   startDate: '2025-01-01',
 *   endDate: '2025-01-31'
 * });
 * ```
 */
export function useDashboardMetrics(
  dateRange: DateRangeInput
): UseDashboardMetricsResult {
  const { data, loading, error, refetch } = useQuery(GET_VENDOR_DASHBOARD, {
    variables: { dateRange },
    // Fetch policy: check cache first, then network
    fetchPolicy: 'cache-and-network',
    // Refetch on window focus
    notifyOnNetworkStatusChange: true,
  });

  return {
    metrics: data?.vendorDashboard || null,
    loading,
    error,
    refetch: () => {
      refetch();
    },
  };
}

/**
 * Get default date range (last 30 days)
 */
export function getDefaultDateRange(): DateRangeInput {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

/**
 * Get date range for a specific period
 */
export function getDateRangeForPeriod(
  period: 'today' | 'week' | 'month' | 'quarter' | 'year'
): DateRangeInput {
  const endDate = new Date();
  const startDate = new Date();

  switch (period) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case 'quarter':
      startDate.setDate(startDate.getDate() - 90);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}
