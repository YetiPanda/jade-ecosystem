/**
 * Discovery Analytics Types
 *
 * Types for vendor discovery metrics, impressions, visibility scoring,
 * and product performance tracking.
 */

export enum ImpressionType {
  SEARCH = 'search',
  BROWSE = 'browse',
  PRODUCT_DETAIL = 'product_detail',
  RECOMMENDATION = 'recommendation',
  HOMEPAGE_FEATURED = 'homepage_featured',
}

export const IMPRESSION_TYPE_LABELS: Record<ImpressionType, string> = {
  [ImpressionType.SEARCH]: 'Search Results',
  [ImpressionType.BROWSE]: 'Category Browse',
  [ImpressionType.PRODUCT_DETAIL]: 'Product Detail',
  [ImpressionType.RECOMMENDATION]: 'Recommended Products',
  [ImpressionType.HOMEPAGE_FEATURED]: 'Homepage Featured',
};

export interface ImpressionMetrics {
  type: ImpressionType;
  count: number;
  clickThroughRate: number; // Percentage (0-100)
  conversionRate: number; // Percentage (0-100)
}

export interface VisibilityScore {
  overall: number; // 0-100 score
  trend: number; // Percentage change from previous period
  rank: number; // Ranking among all vendors (1 = best)
  totalVendors: number; // Total number of vendors for context

  // Component scores
  impressionScore: number; // 0-100 based on impression volume
  engagementScore: number; // 0-100 based on CTR
  conversionScore: number; // 0-100 based on conversion rate
  qualityScore: number; // 0-100 based on values alignment
}

export interface ProductPerformance {
  productId: string;
  productName: string;
  productImage?: string;

  // Metrics
  impressions: number;
  clicks: number;
  orders: number;
  revenue: number; // in cents

  // Rates
  clickThroughRate: number; // Percentage
  conversionRate: number; // Percentage

  // Rankings
  impressionRank: number;
  revenueRank: number;
}

export interface DiscoveryRecommendation {
  id: string;
  type: 'improve_values' | 'optimize_pricing' | 'enhance_images' | 'expand_catalog' | 'engage_customers';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string; // Expected impact description
  effort: 'low' | 'medium' | 'high';
  completedAt?: string; // ISO 8601 if completed
}

export const RECOMMENDATION_PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
};

export const RECOMMENDATION_EFFORT_LABELS = {
  low: 'Quick Win',
  medium: 'Moderate Effort',
  high: 'Long-term Project',
};

export interface TimeSeriesDataPoint {
  date: string; // ISO 8601 date
  impressions: number;
  clicks: number;
  orders: number;
}

export interface VendorDiscoveryMetrics {
  // Current period
  periodStart: string; // ISO 8601
  periodEnd: string; // ISO 8601

  // Visibility
  visibilityScore: VisibilityScore;

  // Impressions
  totalImpressions: number;
  impressionsByType: ImpressionMetrics[];
  impressionsTimeSeries: TimeSeriesDataPoint[];

  // Engagement
  totalClicks: number;
  overallClickThroughRate: number;

  // Products
  totalProducts: number;
  activeProducts: number; // Products with impressions in period
  topPerformingProducts: ProductPerformance[];

  // Recommendations
  recommendations: DiscoveryRecommendation[];
}

export interface DiscoveryFilters {
  startDate?: string;
  endDate?: string;
  impressionType?: ImpressionType;
  productId?: string;
}

export interface DiscoveryQueryInput {
  filters?: DiscoveryFilters;
}

export interface DiscoveryQueryResult {
  metrics: VendorDiscoveryMetrics;
}

/**
 * Helper to format visibility score with color
 */
export function getVisibilityScoreColor(score: number): string {
  if (score >= 80) return '#22c55e'; // green
  if (score >= 60) return '#f59e0b'; // amber
  if (score >= 40) return '#f97316'; // orange
  return '#ef4444'; // red
}

/**
 * Helper to format trend percentage
 */
export function formatTrend(trend: number): string {
  const sign = trend >= 0 ? '+' : '';
  return `${sign}${trend.toFixed(1)}%`;
}

/**
 * Helper to get trend color
 */
export function getTrendColor(trend: number): string {
  if (trend > 0) return '#22c55e'; // green (up is good)
  if (trend < 0) return '#ef4444'; // red (down is bad)
  return '#888'; // gray (no change)
}

/**
 * Helper to format CTR/conversion rate
 */
export function formatRate(rate: number): string {
  return `${rate.toFixed(2)}%`;
}

/**
 * Helper to calculate CTR
 */
export function calculateCTR(clicks: number, impressions: number): number {
  if (impressions === 0) return 0;
  return (clicks / impressions) * 100;
}

/**
 * Helper to calculate conversion rate
 */
export function calculateConversionRate(orders: number, clicks: number): number {
  if (clicks === 0) return 0;
  return (orders / clicks) * 100;
}

/**
 * Search Query Analytics Types
 */

export interface SearchQuery {
  query: string;
  impressions: number;
  clicks: number;
  orders: number;
  revenue: number; // in cents
  clickThroughRate: number;
  conversionRate: number;
  averagePosition: number; // 1-based position in search results
  trend: number; // Percentage change from previous period
}

export interface SearchQueryTrend {
  date: string; // ISO 8601
  query: string;
  impressions: number;
  clicks: number;
}

export interface ProductQueryMatch {
  productId: string;
  productName: string;
  query: string;
  impressions: number;
  clicks: number;
  position: number;
  relevanceScore: number; // 0-100
}

export enum OptimizationOpportunityType {
  HIGH_IMPRESSIONS_LOW_CTR = 'high_impressions_low_ctr',
  TRENDING_QUERY = 'trending_query',
  COMPETITOR_QUERY = 'competitor_query',
  UNDERUTILIZED_KEYWORD = 'underutilized_keyword',
  SEASONAL_OPPORTUNITY = 'seasonal_opportunity',
}

export const OPTIMIZATION_OPPORTUNITY_LABELS: Record<OptimizationOpportunityType, string> = {
  [OptimizationOpportunityType.HIGH_IMPRESSIONS_LOW_CTR]: 'High Impressions, Low CTR',
  [OptimizationOpportunityType.TRENDING_QUERY]: 'Trending Query',
  [OptimizationOpportunityType.COMPETITOR_QUERY]: 'Competitor Advantage',
  [OptimizationOpportunityType.UNDERUTILIZED_KEYWORD]: 'Underutilized Keyword',
  [OptimizationOpportunityType.SEASONAL_OPPORTUNITY]: 'Seasonal Opportunity',
};

export interface OptimizationOpportunity {
  id: string;
  type: OptimizationOpportunityType;
  query: string;
  currentImpressions: number;
  currentCTR: number;
  potentialImpressions: number;
  potentialRevenue: number; // in cents
  recommendation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SearchAnalytics {
  // Period
  periodStart: string;
  periodEnd: string;

  // Top queries
  topQueries: SearchQuery[];
  totalQueries: number;

  // Trends
  queryTrends: SearchQueryTrend[];

  // Product matching
  productQueryMatches: ProductQueryMatch[];

  // Optimization
  opportunities: OptimizationOpportunity[];

  // Summary stats
  totalSearchImpressions: number;
  totalSearchClicks: number;
  averageSearchCTR: number;
  averageSearchPosition: number;
}

export interface SearchAnalyticsFilters {
  startDate?: string;
  endDate?: string;
  query?: string;
  productId?: string;
  minImpressions?: number;
}

export interface SearchAnalyticsQueryInput {
  filters?: SearchAnalyticsFilters;
  limit?: number;
  offset?: number;
}

export interface SearchAnalyticsQueryResult {
  analytics: SearchAnalytics;
}

/**
 * Helper to get optimization opportunity color
 */
export function getOpportunityColor(type: OptimizationOpportunityType): string {
  switch (type) {
    case OptimizationOpportunityType.HIGH_IMPRESSIONS_LOW_CTR:
      return '#ef4444'; // red - urgent
    case OptimizationOpportunityType.TRENDING_QUERY:
      return '#22c55e'; // green - good opportunity
    case OptimizationOpportunityType.COMPETITOR_QUERY:
      return '#f59e0b'; // amber - competitive
    case OptimizationOpportunityType.UNDERUTILIZED_KEYWORD:
      return '#3b82f6'; // blue - potential
    case OptimizationOpportunityType.SEASONAL_OPPORTUNITY:
      return '#8b5cf6'; // purple - timely
  }
}

/**
 * Helper to get difficulty badge color
 */
export function getDifficultyColor(difficulty: 'easy' | 'medium' | 'hard'): string {
  switch (difficulty) {
    case 'easy':
      return '#22c55e';
    case 'medium':
      return '#f59e0b';
    case 'hard':
      return '#ef4444';
  }
}

/**
 * Helper to format search position
 */
export function formatPosition(position: number): string {
  return `#${position.toFixed(1)}`;
}
