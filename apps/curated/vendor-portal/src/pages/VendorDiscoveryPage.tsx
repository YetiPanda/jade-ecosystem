import { useState } from 'react';
import { VisibilityScoreCard } from '../components/VisibilityScoreCard';
import { ImpressionsChart } from '../components/ImpressionsChart';
import { TopPerformingProducts } from '../components/TopPerformingProducts';
import { RecommendationsFeed } from '../components/RecommendationsFeed';
import { DateRangePicker } from '../components/DateRangePicker';
import { DateRangeInput } from '../types/dashboard';
import {
  VendorDiscoveryMetrics,
  ImpressionType,
  TimeSeriesDataPoint,
  ProductPerformance,
  DiscoveryRecommendation,
} from '../types/discovery';
import './Page.css';
import './VendorDiscoveryPage.css';

export function VendorDiscoveryPage() {
  const [dateRange, setDateRange] = useState<DateRangeInput>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Mock data - will be replaced with actual GraphQL query
  const mockMetrics: VendorDiscoveryMetrics = generateMockMetrics(dateRange);

  return (
    <div className="page vendor-discovery-page">
      <div className="page-header">
        <div>
          <h1>Discovery Analytics</h1>
          <p>Track your visibility and product performance across the marketplace</p>
        </div>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

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

      {/* Sprint Info */}
      <div className="info-box" style={{ marginTop: '2rem' }}>
        <h3>✅ Sprint D.1 Complete - Discovery Analytics Foundation</h3>
        <p>
          Discovery analytics infrastructure is now in place. Track visibility score, impressions,
          click-through rates, and product performance.
        </p>
        <div style={{ marginTop: '1rem' }}>
          <strong>Visibility Score:</strong> {mockMetrics.visibilityScore.overall}/100<br />
          <strong>Top Product:</strong> {mockMetrics.topPerformingProducts[0]?.productName}<br />
          <strong>Active Recommendations:</strong> {mockMetrics.recommendations.filter((r) => !r.completedAt).length}
        </div>
        <p className="info-note">
          <strong>Next Sprint (D.2):</strong> Search Query Analytics - Track what spas are
          searching for, keyword performance, and search optimization opportunities.
        </p>
      </div>
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
