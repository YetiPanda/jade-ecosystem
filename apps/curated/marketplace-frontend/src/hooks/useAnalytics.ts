/**
 * Analytics Hook
 *
 * Custom hook for fetching and managing analytics data
 */

import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { useCallback, useMemo } from 'react';

// GraphQL Documents
const GET_BUSINESS_METRICS = gql`
  query GetBusinessMetrics($timeframe: MetricsTimeframeInput, $filters: MetricsFiltersInput) {
    businessMetrics(timeframe: $timeframe, filters: $filters) {
      financial {
        totalRevenue
        monthlyRecurringRevenue
        averageOrderValue
        customerLifetimeValue
        churnRate
        growthRate
        conversionRate
        retentionRate
        revenueByPeriod {
          period
          revenue
          orderCount
        }
      }
      customers {
        totalActive
        newAcquisitions
        churnedCustomers
        averageCustomerAge
        topSegments {
          segment
          count
          revenue
          growthRate
        }
        geographicDistribution {
          region
          customers
          revenue
        }
        journeyStageDistribution {
          stage
          count
          percentage
        }
      }
      products {
        totalCatalog
        topPerformers {
          productId
          productName
          revenue
          unitsSold
          conversionRate
          returnRate
        }
        underPerformers {
          productId
          productName
          revenue
          unitsSold
          conversionRate
          returnRate
        }
        categoryPerformance {
          category
          revenue
          productCount
          growthRate
        }
      }
      skincare {
        topConcerns {
          concern
          frequency
          growthRate
        }
        popularIngredients {
          ingredient
          productCount
          usage
          satisfaction
        }
        routineComplexity {
          minimal
          basic
          advanced
          expert
        }
        consultationEffectiveness {
          totalSessions
          successRate
          avgSatisfaction
          avgSessionDuration
        }
      }
      ai {
        recommendationPerformance {
          totalGenerated
          acceptanceRate
          conversionRate
          avgConfidenceScore
        }
        analysisMetrics {
          totalAnalyses
          avgProcessingTimeMs
          accuracyScore
          userSatisfaction
        }
        predictionAccuracy {
          churnPrediction
          replenishmentPrediction
          ltvPrediction
        }
      }
      computedAt
      timeframe
    }
  }
`;

const GET_BUSINESS_INSIGHTS = gql`
  query GetBusinessInsights($timeframe: MetricsTimeframeInput, $filters: MetricsFiltersInput) {
    businessInsights(timeframe: $timeframe, filters: $filters) {
      trendAnalysis {
        metric
        trend
        changePercent
        significance
        timeframe
        description
        context
      }
      anomalyDetection {
        metric
        expectedValue
        actualValue
        deviation
        severity
        timestamp
        possibleCauses
        recommendedActions
      }
      predictiveInsights {
        prediction
        confidence
        timeframe
        impact
        recommendation
      }
      actionableRecommendations {
        id
        title
        description
        category
        priority
        estimatedImpact
        implementationEffort
        timeline
      }
      businessAlerts {
        id
        title
        description
        severity
        category
        timestamp
        affectedMetrics
        recommendedActions
        acknowledged
      }
      generatedAt
    }
  }
`;

const GET_DASHBOARD_SUMMARY = gql`
  query GetDashboardSummary($organizationId: ID) {
    dashboardSummary(organizationId: $organizationId) {
      revenue {
        value
        previousValue
        changePercent
        trend
      }
      customers {
        value
        previousValue
        changePercent
        trend
      }
      orders {
        value
        previousValue
        changePercent
        trend
      }
      churnRate {
        value
        previousValue
        changePercent
        trend
      }
      avgOrderValue {
        value
        previousValue
        changePercent
        trend
      }
      aiRecommendationAcceptance {
        value
        previousValue
        changePercent
        trend
      }
      topProducts {
        productId
        productName
        revenue
        unitsSold
      }
      recentAlerts {
        id
        title
        severity
        category
        timestamp
        acknowledged
      }
      keyInsights
    }
  }
`;

const GET_BUSINESS_ALERTS = gql`
  query GetBusinessAlerts(
    $severity: AlertSeverity
    $category: AlertCategory
    $acknowledged: Boolean
    $limit: Int
  ) {
    businessAlerts(
      severity: $severity
      category: $category
      acknowledged: $acknowledged
      limit: $limit
    ) {
      id
      title
      description
      severity
      category
      timestamp
      affectedMetrics
      thresholdValue
      currentValue
      recommendedActions
      acknowledged
      acknowledgedAt
    }
  }
`;

const ACKNOWLEDGE_ALERT = gql`
  mutation AcknowledgeAlert($input: AcknowledgeAlertInput!) {
    acknowledgeAlert(input: $input) {
      id
      acknowledged
      acknowledgedAt
    }
  }
`;

// Types
export type TimeframePreset = '7d' | '30d' | '90d' | '1y' | 'mtd' | 'ytd';

export interface AnalyticsOptions {
  timeframe?: TimeframePreset;
  organizationId?: string;
  filters?: {
    productCategory?: string;
    skinType?: string;
    region?: string;
  };
}

export interface DashboardMetric {
  value: number;
  previousValue: number;
  changePercent: number;
  trend: 'INCREASING' | 'DECREASING' | 'STABLE' | 'VOLATILE';
}

// Main Hook
export function useAnalytics(options: AnalyticsOptions = {}) {
  const { timeframe = '30d', organizationId, filters } = options;

  const timeframeInput = useMemo(
    () => ({ preset: timeframe }),
    [timeframe]
  );

  const filtersInput = useMemo(
    () => (filters ? { ...filters, organizationId } : { organizationId }),
    [filters, organizationId]
  );

  // Fetch business metrics
  const {
    data: metricsData,
    loading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics,
  } = useQuery(GET_BUSINESS_METRICS, {
    variables: { timeframe: timeframeInput, filters: filtersInput },
    fetchPolicy: 'cache-and-network',
  });

  // Fetch business insights
  const {
    data: insightsData,
    loading: insightsLoading,
    error: insightsError,
    refetch: refetchInsights,
  } = useQuery(GET_BUSINESS_INSIGHTS, {
    variables: { timeframe: timeframeInput, filters: filtersInput },
    fetchPolicy: 'cache-and-network',
  });

  // Fetch dashboard summary
  const {
    data: summaryData,
    loading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useQuery(GET_DASHBOARD_SUMMARY, {
    variables: { organizationId },
    fetchPolicy: 'cache-and-network',
  });

  // Refetch all data
  const refetchAll = useCallback(() => {
    refetchMetrics();
    refetchInsights();
    refetchSummary();
  }, [refetchMetrics, refetchInsights, refetchSummary]);

  return {
    // Data
    metrics: metricsData?.businessMetrics,
    insights: insightsData?.businessInsights,
    summary: summaryData?.dashboardSummary,

    // Loading states
    loading: metricsLoading || insightsLoading || summaryLoading,
    metricsLoading,
    insightsLoading,
    summaryLoading,

    // Errors
    error: metricsError || insightsError || summaryError,
    metricsError,
    insightsError,
    summaryError,

    // Actions
    refetch: refetchAll,
    refetchMetrics,
    refetchInsights,
    refetchSummary,
  };
}

// Hook for alerts only
export function useBusinessAlerts(options: {
  severity?: string;
  category?: string;
  acknowledged?: boolean;
  limit?: number;
} = {}) {
  const { severity, category, acknowledged, limit = 50 } = options;

  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(GET_BUSINESS_ALERTS, {
    variables: { severity, category, acknowledged, limit },
    fetchPolicy: 'cache-and-network',
  });

  const [acknowledgeAlertMutation, { loading: acknowledging }] = useMutation(
    ACKNOWLEDGE_ALERT,
    {
      refetchQueries: [{ query: GET_BUSINESS_ALERTS }],
    }
  );

  const acknowledgeAlert = useCallback(
    async (alertId: string, note?: string) => {
      await acknowledgeAlertMutation({
        variables: { input: { alertId, note } },
      });
    },
    [acknowledgeAlertMutation]
  );

  return {
    alerts: data?.businessAlerts || [],
    loading,
    error,
    refetch,
    acknowledgeAlert,
    acknowledging,
  };
}

// Hook for dashboard summary only (lightweight)
export function useDashboardSummary(organizationId?: string) {
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(GET_DASHBOARD_SUMMARY, {
    variables: { organizationId },
    fetchPolicy: 'cache-and-network',
  });

  return {
    summary: data?.dashboardSummary,
    loading,
    error,
    refetch,
  };
}

// Lazy query for on-demand metrics fetch
export function useLazyBusinessMetrics() {
  const [fetchMetrics, { data, loading, error }] = useLazyQuery(
    GET_BUSINESS_METRICS
  );

  const getMetrics = useCallback(
    (timeframe: TimeframePreset = '30d', filters?: AnalyticsOptions['filters']) => {
      fetchMetrics({
        variables: {
          timeframe: { preset: timeframe },
          filters,
        },
      });
    },
    [fetchMetrics]
  );

  return {
    getMetrics,
    metrics: data?.businessMetrics,
    loading,
    error,
  };
}

export default useAnalytics;
