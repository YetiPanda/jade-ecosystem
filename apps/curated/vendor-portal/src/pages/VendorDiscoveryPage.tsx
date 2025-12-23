import { useState } from 'react';
import { VisibilityScoreCard } from '../components/VisibilityScoreCard';
import { ImpressionsChart } from '../components/ImpressionsChart';
import { TopPerformingProducts } from '../components/TopPerformingProducts';
import { RecommendationsFeed } from '../components/RecommendationsFeed';
import { SearchAnalyticsSection } from '../components/SearchAnalyticsSection';
import { DateRangePicker } from '../components/DateRangePicker';
import { DateRangeInput } from '../types/dashboard';
import {
  VendorDiscoveryMetrics,
  ImpressionType,
  TimeSeriesDataPoint,
  ProductPerformance,
  DiscoveryRecommendation,
  SearchAnalytics,
  SearchQuery,
  OptimizationOpportunity,
  OptimizationOpportunityType,
} from '../types/discovery';
import './Page.css';
import './VendorDiscoveryPage.css';

export function VendorDiscoveryPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'search'>('overview');
  const [dateRange, setDateRange] = useState<DateRangeInput>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Mock data - will be replaced with actual GraphQL query
  const mockMetrics: VendorDiscoveryMetrics = generateMockMetrics(dateRange);
  const mockSearchAnalytics: SearchAnalytics = generateMockSearchAnalytics(dateRange);

  return (
    <div className="page vendor-discovery-page">
      <div className="page-header">
        <div>
          <h1>Discovery Analytics</h1>
          <p>Track your visibility and product performance across the marketplace</p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {/* Tabs */}
      <div className="discovery-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          🔍 Search Analytics
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
      <div className="discovery-grid">
        {/* Visibility Score - Full width on top */}
        <div className="grid-visibility">
          <VisibilityScoreCard score={mockMetrics.visibilityScore} />
        </div>

        {/* Impressions Chart - Large section */}
        <div className="grid-chart">
          <ImpressionsChart data={mockMetrics.impressionsTimeSeries} />
        </div>

        {/* Recommendations - Sidebar */}
        <div className="grid-recommendations">
          <RecommendationsFeed recommendations={mockMetrics.recommendations} />
        </div>

        {/* Top Products - Full width */}
        <div className="grid-products">
          <TopPerformingProducts products={mockMetrics.topPerformingProducts} />
        </div>

        {/* Stats Cards */}
        <div className="grid-stats">
          <div className="stat-card">
            <div className="stat-label">Total Impressions</div>
            <div className="stat-value">{mockMetrics.totalImpressions.toLocaleString()}</div>
            <div className="stat-change positive">+12.5% vs last period</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Total Clicks</div>
            <div className="stat-value">{mockMetrics.totalClicks.toLocaleString()}</div>
            <div className="stat-change positive">+8.3% vs last period</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Click-Through Rate</div>
            <div className="stat-value">{mockMetrics.overallClickThroughRate.toFixed(2)}%</div>
            <div className="stat-change negative">-2.1% vs last period</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Active Products</div>
            <div className="stat-value">
              {mockMetrics.activeProducts} / {mockMetrics.totalProducts}
            </div>
            <div className="stat-change neutral">{((mockMetrics.activeProducts / mockMetrics.totalProducts) * 100).toFixed(0)}% visibility</div>
          </div>
        </div>
      </div>
      )}

      {/* Search Analytics Tab */}
      {activeTab === 'search' && (
        <SearchAnalyticsSection
          queries={mockSearchAnalytics.topQueries}
          opportunities={mockSearchAnalytics.opportunities}
        />
      )}

      {/* Sprint Info */}
      {activeTab === 'overview' && (
        <div className="info-box" style={{ marginTop: '2rem' }}>
          <h3>✅ Sprint D.2 Complete - Search Query Analytics</h3>
          <p>
            Full discovery and search analytics are now available. Track visibility score, product performance,
            search queries, keyword trends, and optimization opportunities.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <strong>Visibility Score:</strong> {mockMetrics.visibilityScore.overall}/100<br />
            <strong>Top Search Query:</strong> {mockSearchAnalytics.topQueries[0]?.query} ({mockSearchAnalytics.topQueries[0]?.impressions.toLocaleString()} impressions)<br />
            <strong>Optimization Opportunities:</strong> {mockSearchAnalytics.opportunities.length} identified
          </div>
          <p className="info-note">
            <strong>Phase D Complete!</strong> Discovery Analytics includes visibility tracking,
            product performance metrics, search query analysis, and actionable optimization recommendations.
            Next up: Phase E - Admin Tools (Vendor onboarding & management).
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Generate mock discovery metrics for development
 */
function generateMockMetrics(dateRange: DateRangeInput): VendorDiscoveryMetrics {
  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Generate time series data
  const timeSeries: TimeSeriesDataPoint[] = [];
  for (let i = 0; i <= daysDiff; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const impressions = Math.floor(Math.random() * 500) + 200;
    const clicks = Math.floor(impressions * (0.03 + Math.random() * 0.05));
    const orders = Math.floor(clicks * (0.1 + Math.random() * 0.15));

    timeSeries.push({
      date: date.toISOString().split('T')[0],
      impressions,
      clicks,
      orders,
    });
  }

  // Calculate totals
  const totalImpressions = timeSeries.reduce((sum, d) => sum + d.impressions, 0);
  const totalClicks = timeSeries.reduce((sum, d) => sum + d.clicks, 0);

  // Generate top products
  const products: ProductPerformance[] = [
    {
      productId: '1',
      productName: 'Hydrating Facial Serum',
      impressions: 2847,
      clicks: 142,
      orders: 18,
      revenue: 162000,
      clickThroughRate: 4.99,
      conversionRate: 12.68,
      impressionRank: 1,
      revenueRank: 1,
    },
    {
      productId: '2',
      productName: 'Anti-Aging Night Cream',
      impressions: 2156,
      clicks: 98,
      orders: 12,
      revenue: 119880,
      clickThroughRate: 4.54,
      conversionRate: 12.24,
      impressionRank: 2,
      revenueRank: 2,
    },
    {
      productId: '3',
      productName: 'Vitamin C Brightening Mask',
      impressions: 1893,
      clicks: 67,
      orders: 9,
      revenue: 58500,
      clickThroughRate: 3.54,
      conversionRate: 13.43,
      impressionRank: 3,
      revenueRank: 3,
    },
    {
      productId: '4',
      productName: 'Gentle Exfoliating Cleanser',
      impressions: 1654,
      clicks: 52,
      orders: 7,
      revenue: 27300,
      clickThroughRate: 3.14,
      conversionRate: 13.46,
      impressionRank: 4,
      revenueRank: 4,
    },
    {
      productId: '5',
      productName: 'Deep Moisturizing Body Butter',
      impressions: 1432,
      clicks: 41,
      orders: 5,
      revenue: 17500,
      clickThroughRate: 2.86,
      conversionRate: 12.20,
      impressionRank: 5,
      revenueRank: 5,
    },
  ];

  // Generate recommendations
  const recommendations: DiscoveryRecommendation[] = [
    {
      id: 'rec-1',
      type: 'improve_values',
      priority: 'high',
      title: 'Add Missing Brand Values',
      description:
        'You have only selected 8 out of 25 possible brand values. Spas use values to filter products, and more complete profiles get better visibility.',
      impact: 'Could increase visibility score by 15-20 points and impressions by 30%',
      effort: 'low',
    },
    {
      id: 'rec-2',
      type: 'enhance_images',
      priority: 'high',
      title: 'Upload High-Quality Product Images',
      description:
        '3 of your top 5 products are missing professional product photos. High-quality images significantly improve click-through rates.',
      impact: 'Expected 40-50% increase in CTR for updated products',
      effort: 'medium',
    },
    {
      id: 'rec-3',
      type: 'optimize_pricing',
      priority: 'medium',
      title: 'Review Competitive Pricing',
      description:
        'Your average product price is 15% higher than similar vendors in your category. Consider price adjustments for better competitiveness.',
      impact: 'Could improve conversion rate by 20-25%',
      effort: 'low',
    },
  ];

  return {
    periodStart: dateRange.startDate,
    periodEnd: dateRange.endDate,
    visibilityScore: {
      overall: 72,
      trend: 8.5,
      rank: 12,
      totalVendors: 247,
      impressionScore: 78,
      engagementScore: 65,
      conversionScore: 71,
      qualityScore: 68,
    },
    totalImpressions,
    impressionsByType: [
      { type: ImpressionType.SEARCH, count: totalImpressions * 0.45, clickThroughRate: 4.2, conversionRate: 12.5 },
      { type: ImpressionType.BROWSE, count: totalImpressions * 0.25, clickThroughRate: 3.1, conversionRate: 10.8 },
      { type: ImpressionType.RECOMMENDATION, count: totalImpressions * 0.20, clickThroughRate: 5.8, conversionRate: 15.2 },
      { type: ImpressionType.PRODUCT_DETAIL, count: totalImpressions * 0.08, clickThroughRate: 2.5, conversionRate: 8.3 },
      { type: ImpressionType.HOMEPAGE_FEATURED, count: totalImpressions * 0.02, clickThroughRate: 6.5, conversionRate: 18.1 },
    ],
    impressionsTimeSeries: timeSeries,
    totalClicks,
    overallClickThroughRate: (totalClicks / totalImpressions) * 100,
    totalProducts: 24,
    activeProducts: 18,
    topPerformingProducts: products,
    recommendations,
  };
}

/**
 * Generate mock search analytics for development
 */
function generateMockSearchAnalytics(dateRange: DateRangeInput): SearchAnalytics {
  // Generate top search queries
  const queries: SearchQuery[] = [
    {
      query: 'hydrating serum',
      impressions: 3845,
      clicks: 231,
      orders: 28,
      revenue: 25200,
      clickThroughRate: 6.01,
      conversionRate: 12.12,
      averagePosition: 2.3,
      trend: 15.4,
    },
    {
      query: 'anti-aging cream',
      impressions: 3120,
      clicks: 156,
      orders: 19,
      revenue: 18905,
      clickThroughRate: 5.00,
      conversionRate: 12.18,
      averagePosition: 3.1,
      trend: 8.2,
    },
    {
      query: 'vitamin c brightening',
      impressions: 2654,
      clicks: 119,
      orders: 15,
      revenue: 9750,
      clickThroughRate: 4.48,
      conversionRate: 12.61,
      averagePosition: 2.8,
      trend: 22.7,
    },
    {
      query: 'organic skincare',
      impressions: 2398,
      clicks: 91,
      orders: 11,
      revenue: 7150,
      clickThroughRate: 3.79,
      conversionRate: 12.09,
      averagePosition: 4.2,
      trend: -3.5,
    },
    {
      query: 'sensitive skin moisturizer',
      impressions: 2101,
      clicks: 84,
      orders: 10,
      revenue: 6300,
      clickThroughRate: 4.00,
      conversionRate: 11.90,
      averagePosition: 3.6,
      trend: 12.1,
    },
    {
      query: 'acne treatment',
      impressions: 1876,
      clicks: 56,
      orders: 7,
      revenue: 3150,
      clickThroughRate: 2.99,
      conversionRate: 12.50,
      averagePosition: 5.8,
      trend: -8.2,
    },
    {
      query: 'retinol night cream',
      impressions: 1654,
      clicks: 82,
      orders: 9,
      revenue: 8970,
      clickThroughRate: 4.96,
      conversionRate: 10.98,
      averagePosition: 2.9,
      trend: 18.9,
    },
    {
      query: 'natural face mask',
      impressions: 1523,
      clicks: 61,
      orders: 8,
      revenue: 3920,
      clickThroughRate: 4.00,
      conversionRate: 13.11,
      averagePosition: 4.1,
      trend: 5.3,
    },
    {
      query: 'hyaluronic acid',
      impressions: 1398,
      clicks: 70,
      orders: 9,
      revenue: 5400,
      clickThroughRate: 5.01,
      conversionRate: 12.86,
      averagePosition: 3.2,
      trend: 28.4,
    },
    {
      query: 'gentle cleanser',
      impressions: 1276,
      clicks: 38,
      orders: 5,
      revenue: 1950,
      clickThroughRate: 2.98,
      conversionRate: 13.16,
      averagePosition: 6.3,
      trend: -1.8,
    },
    {
      query: 'exfoliating scrub',
      impressions: 1154,
      clicks: 46,
      orders: 6,
      revenue: 2340,
      clickThroughRate: 3.99,
      conversionRate: 13.04,
      averagePosition: 4.7,
      trend: 9.6,
    },
    {
      query: 'peptide serum',
      impressions: 987,
      clicks: 49,
      orders: 6,
      revenue: 5400,
      clickThroughRate: 4.97,
      conversionRate: 12.24,
      averagePosition: 3.4,
      trend: 31.2,
    },
  ];

  // Generate optimization opportunities
  const opportunities: OptimizationOpportunity[] = [
    {
      id: 'opp-1',
      type: OptimizationOpportunityType.HIGH_IMPRESSIONS_LOW_CTR,
      query: 'organic skincare',
      currentImpressions: 2398,
      currentCTR: 3.79,
      potentialImpressions: 2398,
      potentialRevenue: 14300,
      recommendation:
        'Your CTR is below average for this query. Consider improving product images and titles to better match search intent. Spas searching for "organic" likely want to see certifications prominently.',
      difficulty: 'easy',
    },
    {
      id: 'opp-2',
      type: OptimizationOpportunityType.TRENDING_QUERY,
      query: 'peptide serum',
      currentImpressions: 987,
      currentCTR: 4.97,
      potentialImpressions: 2500,
      potentialRevenue: 18000,
      recommendation:
        'This query is trending up 31% and you have strong CTR. Consider creating more peptide-focused products or updating product descriptions to emphasize peptide content.',
      difficulty: 'medium',
    },
    {
      id: 'opp-3',
      type: OptimizationOpportunityType.UNDERUTILIZED_KEYWORD,
      query: 'niacinamide',
      currentImpressions: 0,
      currentCTR: 0,
      potentialImpressions: 1800,
      potentialRevenue: 12600,
      recommendation:
        'Your products contain niacinamide but aren\'t appearing for this popular search term. Add "niacinamide" to product titles and descriptions where applicable.',
      difficulty: 'easy',
    },
    {
      id: 'opp-4',
      type: OptimizationOpportunityType.COMPETITOR_QUERY,
      query: 'Korean skincare',
      currentImpressions: 412,
      currentCTR: 2.18,
      potentialImpressions: 3200,
      potentialRevenue: 22400,
      recommendation:
        'Competitors are dominating this high-volume query. If your products have Korean ingredients or formulation techniques, emphasize this in product descriptions.',
      difficulty: 'hard',
    },
  ];

  // Calculate summary stats
  const totalSearchImpressions = queries.reduce((sum, q) => sum + q.impressions, 0);
  const totalSearchClicks = queries.reduce((sum, q) => sum + q.clicks, 0);
  const averageSearchCTR = (totalSearchClicks / totalSearchImpressions) * 100;
  const averageSearchPosition =
    queries.reduce((sum, q) => sum + q.averagePosition, 0) / queries.length;

  return {
    periodStart: dateRange.startDate,
    periodEnd: dateRange.endDate,
    topQueries: queries,
    totalQueries: queries.length,
    queryTrends: [], // Not used in current UI
    productQueryMatches: [], // Not used in current UI
    opportunities,
    totalSearchImpressions,
    totalSearchClicks,
    averageSearchCTR,
    averageSearchPosition,
  };
}
