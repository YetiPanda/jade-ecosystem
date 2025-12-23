/**
 * Vendor Portal Dashboard Resolver
 * Feature 011: Vendor Portal MVP
 * Sprint B.2: Dashboard Charts & Tables - Data Integration
 *
 * Provides real-time dashboard metrics for vendors
 */

import { AppDataSource } from '../../config/database';
import { discoveryAnalyticsService } from '../../services/discovery-analytics.service';

interface DateRangeInput {
  startDate: string;
  endDate: string;
}

interface Context {
  user?: {
    id: string;
    role: string;
    vendorId?: string;
  };
}

/**
 * Get vendor dashboard metrics
 */
export async function vendorDashboard(
  _parent: any,
  args: { dateRange: DateRangeInput },
  context: Context
) {
  console.log('[vendorDashboard] Resolver called with args:', args);
  console.log('[vendorDashboard] Context:', context);

  // TODO: Re-enable authentication once auth is properly set up
  // For now, allow unauthenticated access to test the integration
  // if (!context.user) {
  //   throw new Error('Authentication required');
  // }

  // For now, use mock data since we don't have the actual tables yet
  // TODO: Replace with real database queries once vendor_profile table is created

  const { startDate, endDate } = args.dateRange;
  const mockVendorId = context.user?.vendorId || context.user?.id || 'vendor-1';

  console.log('[vendorDashboard] Mock vendor ID:', mockVendorId);

  // Calculate mock time series data based on date range
  const days = Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const revenueTimeSeries = Array.from({ length: Math.min(days, 30) }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      value: Math.random() * 3000 + 1000,
    };
  });

  const ordersTimeSeries = Array.from({ length: Math.min(days, 30) }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 20 + 5),
    };
  });

  return {
    dateRange: {
      startDate,
      endDate,
    },
    revenue: {
      total: 127543.50,
      fromNewSpas: 45231.20,
      fromRepeatSpas: 82312.30,
      trend: 'UP',
      percentChange: 12.5,
    },
    orders: {
      count: 324,
      fromNewSpas: 89,
      fromRepeatSpas: 235,
      avgOrderValue: 393.52,
      trend: 'UP',
      percentChange: 8.3,
    },
    spas: {
      active: 47,
      new: 12,
      repeat: 35,
      reorderRate: 74.5,
      trend: 'UP',
      percentChange: 15.2,
    },
    impressions: {
      total: 8945,
      bySource: {
        search: 3421,
        browse: 2156,
        values: 1823,
        recommendation: 1245,
        direct: 300,
      },
      trend: 'UP',
      percentChange: 22.1,
    },
    topProducts: [
      {
        productId: '1',
        productName: 'Hydrating Facial Serum',
        productSku: 'HFS-001',
        category: 'Serums',
        unitsSold: 234,
        revenue: 11234.50,
        orderCount: 156,
        uniqueSpas: 42,
        views: 1234,
        addToCartClicks: 456,
        conversionRate: 36.9,
        price: 48.00,
      },
      {
        productId: '2',
        productName: 'Anti-Aging Night Cream',
        productSku: 'ANC-002',
        category: 'Moisturizers',
        unitsSold: 198,
        revenue: 9504.00,
        orderCount: 134,
        uniqueSpas: 38,
        views: 1098,
        addToCartClicks: 398,
        conversionRate: 36.2,
        price: 48.00,
      },
      {
        productId: '3',
        productName: 'Vitamin C Brightening Serum',
        productSku: 'VCS-003',
        category: 'Serums',
        unitsSold: 187,
        revenue: 8976.00,
        orderCount: 128,
        uniqueSpas: 36,
        views: 982,
        addToCartClicks: 367,
        conversionRate: 37.4,
        price: 48.00,
      },
    ],
    topCustomers: [
      {
        id: '1',
        vendorId: mockVendorId,
        spaId: 'spa-1',
        spaName: 'Serenity Day Spa',
        status: 'ACTIVE',
        lifetimeValue: 12543.20,
        orderCount: 34,
        avgOrderValue: 368.92,
        firstOrderAt: '2024-01-15T00:00:00Z',
        lastOrderAt: '2024-12-15T00:00:00Z',
        avgDaysBetweenOrders: 10,
        daysSinceLastOrder: 5,
        favoriteCategories: ['Serums', 'Moisturizers'],
        topProducts: ['1', '2'],
        profileViews: 45,
        messageCount: 12,
        lastMessageAt: '2024-12-10T00:00:00Z',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-12-15T00:00:00Z',
      },
      {
        id: '2',
        vendorId: mockVendorId,
        spaId: 'spa-2',
        spaName: 'Tranquil Touch Wellness',
        status: 'ACTIVE',
        lifetimeValue: 10234.50,
        orderCount: 28,
        avgOrderValue: 365.52,
        firstOrderAt: '2024-02-01T00:00:00Z',
        lastOrderAt: '2024-12-12T00:00:00Z',
        avgDaysBetweenOrders: 12,
        daysSinceLastOrder: 8,
        favoriteCategories: ['Cleansers', 'Masks'],
        topProducts: ['3', '5'],
        profileViews: 38,
        messageCount: 8,
        lastMessageAt: '2024-12-05T00:00:00Z',
        createdAt: '2024-02-01T00:00:00Z',
        updatedAt: '2024-12-12T00:00:00Z',
      },
    ],
    revenueTimeSeries,
    ordersTimeSeries,
  };
}

/**
 * Get discovery analytics (how spas find vendor)
 * Sprint D.1: Discovery Analytics Backend - Task D.1.10
 */
export async function discoveryAnalytics(
  _parent: any,
  args: { dateRange: DateRangeInput },
  context: Context
) {
  console.log('[discoveryAnalytics] Resolver called with args:', args);
  console.log('[discoveryAnalytics] Context:', context);

  // TODO: Re-enable authentication once auth is properly set up
  // For now, allow unauthenticated access to test the integration
  // if (!context.user) {
  //   throw new Error('Authentication required');
  // }

  const { startDate, endDate } = args.dateRange;
  const vendorId = context.user?.vendorId || context.user?.id || 'vendor-1';

  console.log('[discoveryAnalytics] Fetching analytics for vendor:', vendorId);

  // Convert date strings to Date objects
  const dateRange = {
    start: new Date(startDate),
    end: new Date(endDate)
  };

  // Get analytics from discovery analytics service
  const analytics = await discoveryAnalyticsService.getVendorDiscoveryAnalytics(
    vendorId,
    dateRange
  );

  // Transform service response to match GraphQL schema
  // The schema expects queriesLeadingToYou and missedQueries as separate fields
  return {
    impressions: {
      total: analytics.impressions.total,
      bySource: analytics.impressions.bySource,
      trend: analytics.impressions.trend.toUpperCase() as 'UP' | 'FLAT' | 'DOWN',
      percentChange: 0 // TODO: Calculate from trend data
    },
    queriesLeadingToYou: analytics.searchInsights.queriesLeadingToYou,
    missedQueries: analytics.searchInsights.missedQueries,
    valuesPerformance: analytics.valuesPerformance,
    profileEngagement: analytics.profileEngagement,
    recommendations: analytics.recommendations.map(rec => ({
      type: rec.type.toUpperCase(),
      priority: rec.priority.toUpperCase(),
      title: rec.title,
      description: rec.description,
      actionLabel: rec.actionLabel,
      actionRoute: rec.actionRoute,
      potentialImpact: rec.potentialImpact
    }))
  };
}
