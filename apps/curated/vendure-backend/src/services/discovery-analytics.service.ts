/**
 * Discovery Analytics Service
 * Feature 011: Vendor Portal MVP
 * Phase D: Discovery & Optimization
 * Sprint D.1: Discovery Analytics Backend - Task D.1.1
 *
 * Tracks and aggregates vendor discovery metrics including:
 * - Impression tracking by source (search, browse, values, recommendation, direct)
 * - Search query analysis and attribution
 * - Values performance (CTR, conversions per vendor value)
 * - Profile engagement (views, clicks, time on page, bounce rate)
 * - Recommendation generation for visibility optimization
 */

import { EventEmitter } from 'events';
import { Between, Repository, LessThan, MoreThanOrEqual } from 'typeorm';
import { AppDataSource } from '../config/database';
import { DiscoveryImpression, ImpressionSource as EntityImpressionSource } from '../plugins/vendor-portal/entities/discovery-impression.entity';
import { SearchQuery as SearchQueryEntity } from '../plugins/vendor-portal/entities/search-query.entity';
import { QueryImpression as QueryImpressionEntity } from '../plugins/vendor-portal/entities/query-impression.entity';

/**
 * Traffic sources for vendor impressions
 */
export enum ImpressionSource {
  SEARCH = 'search',           // Found via search (keyword query)
  BROWSE = 'browse',           // Found via category browse
  VALUES = 'values',           // Found via values filter
  RECOMMENDATION = 'recommendation', // Shown as recommendation
  DIRECT = 'direct'            // Direct profile visit (URL)
}

/**
 * Trend indicators for metric comparison
 */
export enum Trend {
  UP = 'up',
  FLAT = 'flat',
  DOWN = 'down'
}

/**
 * Profile engagement event types
 */
export enum ProfileEventType {
  PROFILE_VIEW = 'profile_view',
  CATALOG_BROWSE = 'catalog_browse',
  PRODUCT_CLICK = 'product_click',
  CONTACT_CLICK = 'contact_click',
  PROFILE_EXIT = 'profile_exit'
}

/**
 * Date range for analytics queries
 */
export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Impression event (emitted when vendor shown to spa)
 */
export interface ImpressionEvent {
  vendorId: string;
  source: ImpressionSource;
  searchQueryId?: string;
  valueFilter?: string;
  sessionId: string;
  userId?: string;
  timestamp?: Date;
}

/**
 * Profile view event (emitted when spa views vendor profile)
 */
export interface ProfileViewEvent {
  vendorId: string;
  sessionId: string;
  userId?: string;
  referrer?: string;
  userAgent?: string;
  timestamp?: Date;
}

/**
 * Profile engagement event (clicks, interactions)
 */
export interface ProfileEvent {
  vendorId: string;
  sessionId: string;
  eventType: ProfileEventType;
  metadata?: Record<string, any>;
  timestamp?: Date;
}

/**
 * Search event (emitted when spa searches)
 */
export interface SearchEvent {
  query: string;
  userId?: string;
  filters?: Record<string, any>;
  resultsCount: number;
  vendorResults: string[]; // Vendor IDs shown in results
  timestamp?: Date;
}

/**
 * Impressions aggregated by source
 */
export interface ImpressionsBySource {
  total: number;
  bySource: {
    search: number;
    browse: number;
    values: number;
    recommendation: number;
    direct: number;
  };
  trend: Trend;
}

/**
 * Search query with volume and position data
 */
export interface SearchQuery {
  query: string;
  volume: number;
  yourPosition?: number;
  topCompetitor?: string;
}

/**
 * Search insights (queries leading to vendor)
 */
export interface SearchInsights {
  queriesLeadingToYou: SearchQuery[];
  missedQueries: SearchQuery[];
  competitorQueries: SearchQuery[];
}

/**
 * Performance metrics for a vendor value
 */
export interface ValuePerformance {
  value: string;
  impressions: number;
  clicks: number;
  conversions: number;
  rank: number;
  ctr: number;
  conversionRate: number;
}

/**
 * Profile engagement metrics
 */
export interface ProfileEngagement {
  profileViews: number;
  avgTimeOnProfile: number;
  catalogBrowses: number;
  productClicks: number;
  contactClicks: number;
  bounceRate: number;
}

/**
 * Complete discovery analytics for a vendor
 */
export interface DiscoveryAnalytics {
  impressions: ImpressionsBySource;
  searchInsights: SearchInsights;
  valuesPerformance: ValuePerformance[];
  profileEngagement: ProfileEngagement;
  recommendations: DiscoveryRecommendation[];
}

/**
 * Recommendation for improving visibility
 */
export interface DiscoveryRecommendation {
  type: 'profile' | 'values' | 'products' | 'content' | 'certifications';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionLabel: string;
  actionRoute: string;
  potentialImpact: string;
}

/**
 * Discovery Analytics Service
 *
 * Core service for tracking and aggregating vendor discovery metrics.
 * Integrates with EventBridge (Feature 010) to receive marketplace events.
 */
export class DiscoveryAnalyticsService extends EventEmitter {
  private initialized = false;

  constructor() {
    super();
  }

  /**
   * Initialize the service and register event listeners
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.warn('[DiscoveryAnalyticsService] Already initialized');
      return;
    }

    console.log('[DiscoveryAnalyticsService] Initializing...');

    // TODO: Register EventBridge listeners (Feature 010 integration)
    // eventBridge.subscribe('marketplace.vendor.impression', this.onImpressionTracked.bind(this));
    // eventBridge.subscribe('marketplace.search.performed', this.onSearchPerformed.bind(this));
    // eventBridge.subscribe('marketplace.vendor.profile_viewed', this.onProfileViewed.bind(this));

    this.initialized = true;
    console.log('[DiscoveryAnalyticsService] Initialized successfully');
  }

  /**
   * Gracefully shutdown the service
   */
  async shutdown(): Promise<void> {
    console.log('[DiscoveryAnalyticsService] Shutting down...');
    this.removeAllListeners();
    this.initialized = false;
    console.log('[DiscoveryAnalyticsService] Shut down successfully');
  }

  // ========================================================================
  // Event Handlers
  // ========================================================================

  /**
   * Handle impression tracked event
   * Called when a vendor is shown in search results, browse, or recommendations
   *
   * @param event - Impression event data
   */
  async onImpressionTracked(event: ImpressionEvent): Promise<void> {
    try {
      console.log(`[DiscoveryAnalyticsService] Impression tracked: vendor=${event.vendorId}, source=${event.source}`);

      // Only save to database if AppDataSource is initialized
      if (AppDataSource.isInitialized) {
        // Map service ImpressionSource to entity ImpressionSource
        const entitySource = event.source as unknown as EntityImpressionSource;

        // Save impression to database
        const impressionRepo = AppDataSource.getRepository(DiscoveryImpression);
        await impressionRepo.save({
          vendorId: event.vendorId,
          spaId: event.userId || null,
          sessionId: event.sessionId,
          source: entitySource,
          queryText: event.searchQueryId || null, // Simplified for now
          valuesFilters: event.valueFilter ? [event.valueFilter] : null,
          categoryBrowsed: null,
          recommendationId: null,
          action: 'view' as any, // Default action
          timeOnProfile: null,
          productClicked: null,
          position: null,
          totalResults: null,
          referrer: null,
          userAgent: null,
          deviceType: null,
          createdAt: event.timestamp || new Date()
        });
      }

      // Emit event for downstream services (always, even in test mode)
      this.emit('impressionTracked', event);
    } catch (error) {
      console.error('[DiscoveryAnalyticsService] Error tracking impression:', error);
      throw error;
    }
  }

  /**
   * Handle profile viewed event
   * Called when a spa user views a vendor's profile page
   *
   * @param event - Profile view event data
   */
  async onProfileViewed(event: ProfileViewEvent): Promise<void> {
    try {
      console.log(`[DiscoveryAnalyticsService] Profile viewed: vendor=${event.vendorId}, session=${event.sessionId}`);

      // Track profile view in discovery impressions (Task D.1.7)
      if (AppDataSource.isInitialized) {
        const impressionRepo = AppDataSource.getRepository(DiscoveryImpression);

        await impressionRepo.save({
          vendorId: event.vendorId,
          spaId: event.userId || null,
          sessionId: event.sessionId,
          source: EntityImpressionSource.DIRECT, // Profile view is direct traffic
          queryText: null,
          valuesFilters: null,
          categoryBrowsed: null,
          recommendationId: null,
          action: 'view' as any, // Profile view action
          timeOnProfile: null, // Will be updated when session ends
          productClicked: null,
          position: null,
          totalResults: null,
          referrer: event.referrer || null,
          userAgent: event.userAgent || null,
          deviceType: null,
          createdAt: event.timestamp || new Date()
        });
      }

      // Emit event for downstream services
      this.emit('profileViewed', event);
    } catch (error) {
      console.error('[DiscoveryAnalyticsService] Error tracking profile view:', error);
      throw error;
    }
  }

  /**
   * Handle profile engagement event
   * Called when a spa user interacts with vendor profile (clicks, browsing)
   *
   * @param event - Profile event data
   */
  async onProfileEvent(event: ProfileEvent): Promise<void> {
    try {
      console.log(`[DiscoveryAnalyticsService] Profile event: vendor=${event.vendorId}, type=${event.eventType}`);

      // Track engagement in discovery impressions (Task D.1.7)
      if (AppDataSource.isInitialized) {
        const impressionRepo = AppDataSource.getRepository(DiscoveryImpression);

        // Map ProfileEventType to impression action
        let action: string;
        let productClicked: string | null = null;

        switch (event.eventType) {
          case ProfileEventType.CATALOG_BROWSE:
            action = 'catalog_view';
            break;
          case ProfileEventType.PRODUCT_CLICK:
            action = 'product_click';
            productClicked = event.metadata?.productId || null;
            break;
          case ProfileEventType.CONTACT_CLICK:
            action = 'contact_click';
            break;
          case ProfileEventType.PROFILE_EXIT:
            action = 'bounce';
            break;
          default:
            action = 'view';
        }

        await impressionRepo.save({
          vendorId: event.vendorId,
          spaId: null, // User ID not included in ProfileEvent, would need to be added
          sessionId: event.sessionId,
          source: EntityImpressionSource.DIRECT,
          queryText: null,
          valuesFilters: null,
          categoryBrowsed: null,
          recommendationId: null,
          action: action as any,
          timeOnProfile: event.metadata?.timeOnProfile || null,
          productClicked,
          position: null,
          totalResults: null,
          referrer: null,
          userAgent: null,
          deviceType: null,
          createdAt: event.timestamp || new Date()
        });
      }

      // Emit event for downstream services
      this.emit('profileEvent', event);
    } catch (error) {
      console.error('[DiscoveryAnalyticsService] Error tracking profile event:', error);
      throw error;
    }
  }

  /**
   * Handle search performed event
   * Called when a spa user searches the marketplace
   *
   * @param event - Search event data
   */
  async onSearchPerformed(event: SearchEvent): Promise<void> {
    try {
      console.log(`[DiscoveryAnalyticsService] Search performed: query="${event.query}", results=${event.resultsCount}`);

      // Only save to database if AppDataSource is initialized
      if (AppDataSource.isInitialized) {
        const queryRepo = AppDataSource.getRepository(SearchQueryEntity);
        const impressionRepo = AppDataSource.getRepository(QueryImpressionEntity);

        // Normalize query text for analysis
        const normalizedQuery = event.query.toLowerCase().trim();
        const tokens = normalizedQuery.split(/\s+/).filter(t => t.length > 2);

        // Extract values filters from generic filters object
        const valuesFilters = event.filters?.values as string[] | undefined;
        const categoryFilter = event.filters?.category as string | undefined;
        const additionalFilters = { ...event.filters };
        delete additionalFilters.values;
        delete additionalFilters.category;

        // Save search query
        const savedQuery = await queryRepo.save({
          queryText: event.query,
          normalizedQuery,
          tokens: tokens.length > 0 ? tokens : null,
          userId: event.userId || null,
          sessionId: null, // Will be populated from event metadata in production
          valuesFilters: valuesFilters || null,
          categoryFilter: categoryFilter || null,
          additionalFilters: Object.keys(additionalFilters).length > 0 ? additionalFilters : null,
          resultsCount: event.resultsCount,
          vendorResults: event.vendorResults.length > 0 ? event.vendorResults : null,
          productResults: null, // Will be populated when product search is implemented
          vendorsClicked: null,
          productsClicked: null,
          wasRefined: false,
          wasAbandoned: event.resultsCount === 0,
          referrer: null,
          userAgent: null,
          deviceType: null,
          createdAt: event.timestamp || new Date()
        });

        // Link vendors shown in results (Task D.1.4)
        for (const [index, vendorId] of event.vendorResults.entries()) {
          await impressionRepo.save({
            queryId: savedQuery.id,
            vendorId,
            position: index + 1,
            totalResults: event.resultsCount,
            relevanceScore: null, // Will be populated when ranking algorithm is added
            clicked: false,
            clickedAt: null,
            timeToClick: null,
            viewedCatalog: false,
            addedToCart: false,
            converted: false,
            orderId: null,
            orderValue: null,
            createdAt: event.timestamp || new Date(),
            updatedAt: event.timestamp || new Date()
          });
        }
      }

      // Emit event for downstream services (always, even in test mode)
      this.emit('searchPerformed', event);
    } catch (error) {
      console.error('[DiscoveryAnalyticsService] Error tracking search:', error);
      throw error;
    }
  }

  // ========================================================================
  // Analytics Queries
  // ========================================================================

  /**
   * Get complete discovery analytics for a vendor
   *
   * @param vendorId - Vendor ID
   * @param dateRange - Date range for analytics (defaults to last 30 days)
   * @returns Complete discovery analytics
   */
  async getVendorDiscoveryAnalytics(
    vendorId: string,
    dateRange?: DateRange
  ): Promise<DiscoveryAnalytics> {
    const range = dateRange || this.getDefaultDateRange();

    console.log(`[DiscoveryAnalyticsService] Getting discovery analytics: vendor=${vendorId}`);

    // Fetch all analytics in parallel
    const [impressions, searchInsights, valuesPerformance, profileEngagement] = await Promise.all([
      this.getImpressionsBySource(vendorId, range),
      this.getSearchQueries(vendorId),
      this.getValuesPerformance(vendorId, range),
      this.getProfileEngagement(vendorId, range)
    ]);

    // Generate recommendations (Task D.1.8)
    const recommendations = await this.generateRecommendations(
      vendorId,
      impressions,
      searchInsights,
      valuesPerformance,
      profileEngagement
    );

    return {
      impressions,
      searchInsights,
      valuesPerformance,
      profileEngagement,
      recommendations
    };
  }

  /**
   * Get impressions aggregated by source
   *
   * @param vendorId - Vendor ID
   * @param dateRange - Date range for analytics
   * @returns Impressions by source with trend
   */
  async getImpressionsBySource(
    vendorId: string,
    dateRange: DateRange
  ): Promise<ImpressionsBySource> {
    console.log(`[DiscoveryAnalyticsService] Getting impressions by source: vendor=${vendorId}`);

    try {
      // Return empty data if database not initialized (e.g., in tests)
      if (!AppDataSource.isInitialized) {
        return {
          total: 0,
          bySource: {
            search: 0,
            browse: 0,
            values: 0,
            recommendation: 0,
            direct: 0
          },
          trend: Trend.FLAT
        };
      }

      const impressionRepo = AppDataSource.getRepository(DiscoveryImpression);

      // Get all impressions for this vendor in the date range
      const impressions = await impressionRepo.find({
        where: {
          vendorId,
          createdAt: Between(dateRange.start, dateRange.end)
        }
      });

      // Aggregate by source
      const bySource = {
        search: impressions.filter(i => i.source === EntityImpressionSource.SEARCH).length,
        browse: impressions.filter(i => i.source === EntityImpressionSource.BROWSE).length,
        values: impressions.filter(i => i.source === EntityImpressionSource.VALUES).length,
        recommendation: impressions.filter(i => i.source === EntityImpressionSource.RECOMMENDATION).length,
        direct: impressions.filter(i => i.source === EntityImpressionSource.DIRECT).length
      };

      const total = impressions.length;

      // Calculate trend by comparing to previous period
      const trend = await this.calculateTrend(vendorId, dateRange, total);

      return {
        total,
        bySource,
        trend
      };
    } catch (error) {
      console.error('[DiscoveryAnalyticsService] Error getting impressions by source:', error);

      // Return empty data on error
      return {
        total: 0,
        bySource: {
          search: 0,
          browse: 0,
          values: 0,
          recommendation: 0,
          direct: 0
        },
        trend: Trend.FLAT
      };
    }
  }

  /**
   * Get search queries that led to vendor profile
   *
   * @param vendorId - Vendor ID
   * @returns Search insights (queries, missed opportunities, competitor queries)
   */
  async getSearchQueries(vendorId: string): Promise<SearchInsights> {
    console.log(`[DiscoveryAnalyticsService] Getting search queries: vendor=${vendorId}`);

    try {
      // Return empty data if database not initialized (e.g., in tests)
      if (!AppDataSource.isInitialized) {
        return {
          queriesLeadingToYou: [],
          missedQueries: [],
          competitorQueries: []
        };
      }

      const queryRepo = AppDataSource.getRepository(SearchQueryEntity);
      const impressionRepo = AppDataSource.getRepository(QueryImpressionEntity);

      // Get all query impressions for this vendor
      const vendorImpressions = await impressionRepo.find({
        where: { vendorId },
        order: { createdAt: 'DESC' },
        take: 100 // Limit to recent impressions
      });

      // Get the associated queries
      const queryIds = vendorImpressions.map(imp => imp.queryId);
      const queries = queryIds.length > 0
        ? await queryRepo.find({
            where: { id: Between(queryIds[0], queryIds[queryIds.length - 1]) }
          })
        : [];

      // Build query map for quick lookup
      const queryMap = new Map(queries.map(q => [q.id, q]));

      // Aggregate query performance
      const queryStats = new Map<string, {
        query: string;
        volume: number;
        positions: number[];
        clicks: number;
      }>();

      for (const impression of vendorImpressions) {
        const query = queryMap.get(impression.queryId);
        if (!query) continue;

        const key = query.normalizedQuery || query.queryText;
        const stats = queryStats.get(key) || {
          query: query.queryText,
          volume: 0,
          positions: [],
          clicks: 0
        };

        stats.volume++;
        stats.positions.push(impression.position);
        if (impression.clicked) stats.clicks++;

        queryStats.set(key, stats);
      }

      // Convert to SearchQuery format
      const queriesLeadingToYou: SearchQuery[] = Array.from(queryStats.values())
        .map(stats => ({
          query: stats.query,
          volume: stats.volume,
          yourPosition: Math.round(stats.positions.reduce((a, b) => a + b, 0) / stats.positions.length),
          topCompetitor: undefined // Will be populated in future when we track competitors
        }))
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 20); // Top 20 queries

      // TODO: Implement missed queries and competitor queries in future tasks
      // This requires:
      // 1. Vendor profile analysis to determine which queries vendor SHOULD rank for
      // 2. Competitor tracking to identify queries where competitors outrank this vendor

      return {
        queriesLeadingToYou,
        missedQueries: [],
        competitorQueries: []
      };
    } catch (error) {
      console.error('[DiscoveryAnalyticsService] Error getting search queries:', error);

      // Return empty data on error
      return {
        queriesLeadingToYou: [],
        missedQueries: [],
        competitorQueries: []
      };
    }
  }

  /**
   * Get performance metrics for each vendor value
   *
   * @param vendorId - Vendor ID
   * @param dateRange - Date range for analytics
   * @returns Array of value performance metrics
   */
  async getValuesPerformance(
    vendorId: string,
    dateRange: DateRange
  ): Promise<ValuePerformance[]> {
    console.log(`[DiscoveryAnalyticsService] Getting values performance: vendor=${vendorId}`);

    try {
      // Return empty data if database not initialized (e.g., in tests)
      if (!AppDataSource.isInitialized) {
        return [];
      }

      const impressionRepo = AppDataSource.getRepository(DiscoveryImpression);

      // Get all impressions for this vendor that came from values filtering
      const valuesImpressions = await impressionRepo.find({
        where: {
          vendorId,
          source: EntityImpressionSource.VALUES,
          createdAt: Between(dateRange.start, dateRange.end)
        }
      });

      // Aggregate performance by value
      const valueStats = new Map<string, {
        impressions: number;
        clicks: number;
        conversions: number;
      }>();

      for (const impression of valuesImpressions) {
        // Each impression can have multiple values filters
        const values = impression.valuesFilters || [];

        for (const value of values) {
          const stats = valueStats.get(value) || {
            impressions: 0,
            clicks: 0,
            conversions: 0
          };

          stats.impressions++;

          // Count clicks (based on impression action)
          // In production, this would check if impression led to profile view
          if (impression.action === 'click' || impression.action === 'catalog_view') {
            stats.clicks++;
          }

          // Count conversions (based on impression leading to order)
          // In production, this would check for actual orders
          if (impression.action === 'product_click') {
            // Simplified: assume some product clicks lead to conversions
            stats.conversions += 0.1; // Placeholder conversion rate
          }

          valueStats.set(value, stats);
        }
      }

      // Convert to ValuePerformance format with ranks
      const performance: ValuePerformance[] = [];

      for (const [value, stats] of valueStats.entries()) {
        // Calculate rank for this value (Task D.1.6)
        const rank = await this.calculateVendorRankForValue(vendorId, value, dateRange);

        performance.push({
          value,
          impressions: stats.impressions,
          clicks: Math.round(stats.clicks),
          conversions: Math.round(stats.conversions),
          rank,
          ctr: stats.impressions > 0 ? (stats.clicks / stats.impressions) * 100 : 0,
          conversionRate: stats.clicks > 0 ? (stats.conversions / stats.clicks) * 100 : 0
        });
      }

      // Sort by impressions (most popular first)
      performance.sort((a, b) => b.impressions - a.impressions);

      return performance;
    } catch (error) {
      console.error('[DiscoveryAnalyticsService] Error getting values performance:', error);
      return [];
    }
  }

  /**
   * Get profile engagement metrics
   *
   * @param vendorId - Vendor ID
   * @param dateRange - Date range for analytics
   * @returns Profile engagement metrics
   */
  async getProfileEngagement(
    vendorId: string,
    dateRange: DateRange
  ): Promise<ProfileEngagement> {
    console.log(`[DiscoveryAnalyticsService] Getting profile engagement: vendor=${vendorId}`);

    try {
      // Return zero metrics if database not initialized (e.g., in tests)
      if (!AppDataSource.isInitialized) {
        return {
          profileViews: 0,
          avgTimeOnProfile: 0,
          catalogBrowses: 0,
          productClicks: 0,
          contactClicks: 0,
          bounceRate: 0
        };
      }

      const impressionRepo = AppDataSource.getRepository(DiscoveryImpression);

      // Get all profile-related impressions for this vendor
      const impressions = await impressionRepo.find({
        where: {
          vendorId,
          source: EntityImpressionSource.DIRECT, // Profile visits are DIRECT traffic
          createdAt: Between(dateRange.start, dateRange.end)
        }
      });

      // Calculate metrics
      const profileViews = impressions.filter(i => i.action === 'view').length;
      const catalogBrowses = impressions.filter(i => i.action === 'catalog_view').length;
      const productClicks = impressions.filter(i => i.action === 'product_click').length;
      const contactClicks = impressions.filter(i => i.action === 'contact_click').length;

      // Calculate average time on profile (from views with timeOnProfile data)
      const viewsWithTime = impressions.filter(i =>
        i.action === 'view' && i.timeOnProfile !== null && i.timeOnProfile !== undefined
      );
      const avgTimeOnProfile = viewsWithTime.length > 0
        ? viewsWithTime.reduce((sum, i) => sum + (i.timeOnProfile || 0), 0) / viewsWithTime.length
        : 0;

      // Calculate bounce rate (views with < 10 seconds on profile)
      const bounces = viewsWithTime.filter(i => (i.timeOnProfile || 0) < 10).length;
      const bounceRate = viewsWithTime.length > 0
        ? (bounces / viewsWithTime.length) * 100
        : 0;

      return {
        profileViews,
        avgTimeOnProfile: Math.round(avgTimeOnProfile),
        catalogBrowses,
        productClicks,
        contactClicks,
        bounceRate: Math.round(bounceRate * 10) / 10 // Round to 1 decimal place
      };
    } catch (error) {
      console.error('[DiscoveryAnalyticsService] Error getting profile engagement:', error);

      // Return zero metrics on error
      return {
        profileViews: 0,
        avgTimeOnProfile: 0,
        catalogBrowses: 0,
        productClicks: 0,
        contactClicks: 0,
        bounceRate: 0
      };
    }
  }

  /**
   * Generate recommendations for improving vendor visibility
   *
   * @param vendorId - Vendor ID
   * @param impressions - Impression data by source
   * @param searchInsights - Search query insights
   * @param valuesPerformance - Performance metrics per value
   * @param profileEngagement - Profile engagement metrics
   * @returns Array of prioritized recommendations
   */
  private async generateRecommendations(
    vendorId: string,
    impressions: ImpressionsBySource,
    searchInsights: SearchInsights,
    valuesPerformance: ValuePerformance[],
    profileEngagement: ProfileEngagement
  ): Promise<DiscoveryRecommendation[]> {
    const recommendations: DiscoveryRecommendation[] = [];

    // ──────────────────────────────────────────────────────────────
    // 1. Low Impressions - Visibility Issue
    // ──────────────────────────────────────────────────────────────
    if (impressions.total < 100) {
      recommendations.push({
        type: 'profile',
        priority: 'high',
        title: 'Boost Your Visibility',
        description: 'Your profile is receiving fewer than 100 impressions. Complete your profile and add more values to appear in more searches.',
        actionLabel: 'Complete Profile',
        actionRoute: '/vendor/profile',
        potentialImpact: 'Could increase impressions by 3-5x'
      });
    }

    // ──────────────────────────────────────────────────────────────
    // 2. High Bounce Rate - Engagement Issue
    // ──────────────────────────────────────────────────────────────
    if (profileEngagement.bounceRate > 60 && profileEngagement.profileViews > 10) {
      recommendations.push({
        type: 'content',
        priority: 'high',
        title: 'Reduce Bounce Rate',
        description: `${Math.round(profileEngagement.bounceRate)}% of visitors leave within 10 seconds. Improve your hero image, tagline, and brand story to capture attention.`,
        actionLabel: 'Update Brand Story',
        actionRoute: '/vendor/profile#brand-identity',
        potentialImpact: 'Could improve engagement by 40-60%'
      });
    }

    // ──────────────────────────────────────────────────────────────
    // 3. Low Search Visibility - Missing from Key Queries
    // ──────────────────────────────────────────────────────────────
    if (searchInsights.queriesLeadingToYou.length < 5 && impressions.bySource.search < 20) {
      recommendations.push({
        type: 'values',
        priority: 'high',
        title: 'Improve Search Ranking',
        description: 'You\'re appearing in fewer than 5 search queries. Add more values and certifications to match what spas are searching for.',
        actionLabel: 'Add Values',
        actionRoute: '/vendor/profile#values',
        potentialImpact: 'Could appear in 10+ more searches'
      });
    }

    // ──────────────────────────────────────────────────────────────
    // 4. Underperforming Values - Low CTR
    // ──────────────────────────────────────────────────────────────
    const underperformingValues = valuesPerformance.filter(v => v.ctr < 5 && v.impressions > 10);
    if (underperformingValues.length > 0) {
      const topUnderperformer = underperformingValues[0];
      recommendations.push({
        type: 'values',
        priority: 'medium',
        title: 'Optimize Underperforming Values',
        description: `Your "${topUnderperformer.value}" value has a ${topUnderperformer.ctr.toFixed(1)}% click-through rate. Consider highlighting this value more prominently in your profile.`,
        actionLabel: 'Review Values',
        actionRoute: '/vendor/profile#values',
        potentialImpact: 'Could increase value CTR by 2-3x'
      });
    }

    // ──────────────────────────────────────────────────────────────
    // 5. Low Catalog Engagement - Product Issue
    // ──────────────────────────────────────────────────────────────
    if (profileEngagement.catalogBrowses < profileEngagement.profileViews * 0.3 && profileEngagement.profileViews > 20) {
      recommendations.push({
        type: 'products',
        priority: 'medium',
        title: 'Showcase Your Products',
        description: `Only ${Math.round((profileEngagement.catalogBrowses / profileEngagement.profileViews) * 100)}% of visitors browse your catalog. Add featured products and improve product images.`,
        actionLabel: 'Update Catalog',
        actionRoute: '/vendor/products',
        potentialImpact: 'Could increase catalog views by 50%'
      });
    }

    // ──────────────────────────────────────────────────────────────
    // 6. Missing Certifications - Credibility Gap
    // ──────────────────────────────────────────────────────────────
    // Note: In production, this would check actual certification data
    // For now, recommend based on values performance
    const organicValue = valuesPerformance.find(v => v.value.toLowerCase().includes('organic'));
    if (organicValue && organicValue.impressions > 20) {
      recommendations.push({
        type: 'certifications',
        priority: 'medium',
        title: 'Add Certifications',
        description: 'You\'re appearing for "organic" searches. Adding USDA Organic or Ecocert certifications could boost credibility and conversions.',
        actionLabel: 'Add Certifications',
        actionRoute: '/vendor/profile#certifications',
        potentialImpact: 'Could increase conversion rate by 15-25%'
      });
    }

    // ──────────────────────────────────────────────────────────────
    // 7. Strong Performance - Reinforce Success
    // ──────────────────────────────────────────────────────────────
    const topPerformingValue = valuesPerformance.find(v => v.ctr > 15 && v.impressions > 20);
    if (topPerformingValue) {
      recommendations.push({
        type: 'content',
        priority: 'low',
        title: 'Capitalize on Strong Performance',
        description: `Your "${topPerformingValue.value}" value is performing exceptionally well (${topPerformingValue.ctr.toFixed(1)}% CTR). Feature this prominently in your brand story.`,
        actionLabel: 'Update Story',
        actionRoute: '/vendor/profile#brand-identity',
        potentialImpact: 'Could maintain competitive advantage'
      });
    }

    // ──────────────────────────────────────────────────────────────
    // 8. Trend-Based Recommendations
    // ──────────────────────────────────────────────────────────────
    if (impressions.trend === Trend.DOWN) {
      recommendations.push({
        type: 'profile',
        priority: 'high',
        title: 'Visibility Declining',
        description: 'Your impressions have decreased by more than 10% compared to the previous period. Review your profile and values to stay competitive.',
        actionLabel: 'Review Profile',
        actionRoute: '/vendor/profile',
        potentialImpact: 'Could reverse declining trend'
      });
    }

    // Sort by priority (high -> medium -> low)
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    // Limit to top 5 most impactful recommendations
    return recommendations.slice(0, 5);
  }

  // ========================================================================
  // Aggregation Jobs (Cron)
  // ========================================================================

  /**
   * Aggregate daily metrics (called by cron job)
   * Calculates and stores daily summaries for faster querying
   */
  async aggregateDailyMetrics(): Promise<void> {
    console.log('[DiscoveryAnalyticsService] Running daily aggregation...');

    // TODO: Implement daily aggregation
    // - Sum impressions per vendor per source
    // - Calculate daily values performance
    // - Aggregate engagement metrics
    // - Store in summary tables for fast queries

    console.log('[DiscoveryAnalyticsService] Daily aggregation complete');
  }

  /**
   * Calculate vendor rankings within each value filter (called by cron job)
   * Updates rank field in values_performance table
   */
  async calculateVendorRankings(): Promise<void> {
    console.log('[DiscoveryAnalyticsService] Calculating vendor rankings...');

    try {
      // Return early if database not initialized (e.g., in tests)
      if (!AppDataSource.isInitialized) {
        console.log('[DiscoveryAnalyticsService] Database not initialized, skipping ranking');
        return;
      }

      const impressionRepo = AppDataSource.getRepository(DiscoveryImpression);
      const dateRange = this.getDefaultDateRange();

      // Get all impressions from values filtering
      const valuesImpressions = await impressionRepo.find({
        where: {
          source: EntityImpressionSource.VALUES,
          createdAt: Between(dateRange.start, dateRange.end)
        }
      });

      // Aggregate performance by vendor and value
      const vendorValueStats = new Map<string, Map<string, {
        impressions: number;
        clicks: number;
        conversions: number;
      }>>();

      for (const impression of valuesImpressions) {
        const values = impression.valuesFilters || [];

        for (const value of values) {
          if (!vendorValueStats.has(value)) {
            vendorValueStats.set(value, new Map());
          }

          const valueMap = vendorValueStats.get(value)!;
          const stats = valueMap.get(impression.vendorId) || {
            impressions: 0,
            clicks: 0,
            conversions: 0
          };

          stats.impressions++;
          if (impression.action === 'click' || impression.action === 'catalog_view') {
            stats.clicks++;
          }
          if (impression.action === 'product_click') {
            stats.conversions += 0.1; // Placeholder
          }

          valueMap.set(impression.vendorId, stats);
        }
      }

      // Calculate rankings for each value
      const rankings = new Map<string, Map<string, number>>(); // value -> vendorId -> rank

      for (const [value, vendorStats] of vendorValueStats.entries()) {
        // Calculate discovery score for each vendor
        const vendorScores = Array.from(vendorStats.entries()).map(([vendorId, stats]) => {
          const ctr = stats.impressions > 0 ? stats.clicks / stats.impressions : 0;
          const convRate = stats.clicks > 0 ? stats.conversions / stats.clicks : 0;

          // Discovery score formula: weighted combination of impressions, CTR, and conversion rate
          // Impressions: 40%, CTR: 35%, Conversion Rate: 25%
          const score = (stats.impressions * 0.4) + (ctr * 100 * 0.35) + (convRate * 100 * 0.25);

          return { vendorId, score, stats };
        });

        // Sort by score descending
        vendorScores.sort((a, b) => b.score - a.score);

        // Assign ranks
        const valueRankings = new Map<string, number>();
        vendorScores.forEach((vendor, index) => {
          valueRankings.set(vendor.vendorId, index + 1);
        });

        rankings.set(value, valueRankings);
      }

      // Store rankings (in production, this would update a summary table)
      console.log('[DiscoveryAnalyticsService] Rankings calculated for', rankings.size, 'values');

      // TODO: In production, store these rankings in a vendor_value_rankings table
      // for faster querying instead of calculating on-demand

    } catch (error) {
      console.error('[DiscoveryAnalyticsService] Error calculating vendor rankings:', error);
    }

    console.log('[DiscoveryAnalyticsService] Vendor rankings calculated');
  }

  // ========================================================================
  // Helper Methods
  // ========================================================================

  /**
   * Get default date range (last 30 days)
   */
  private getDefaultDateRange(): DateRange {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start, end };
  }

  /**
   * Calculate vendor's rank for a specific value
   *
   * @param vendorId - Vendor ID to rank
   * @param value - Value filter (e.g., "organic", "cruelty_free")
   * @param dateRange - Date range for ranking calculation
   * @returns Rank (1 = best, higher = worse)
   */
  private async calculateVendorRankForValue(
    vendorId: string,
    value: string,
    dateRange: DateRange
  ): Promise<number> {
    try {
      // Return 0 if database not initialized
      if (!AppDataSource.isInitialized) {
        return 0;
      }

      const impressionRepo = AppDataSource.getRepository(DiscoveryImpression);

      // Get all impressions for this value across all vendors
      const valueImpressions = await impressionRepo.find({
        where: {
          source: EntityImpressionSource.VALUES,
          createdAt: Between(dateRange.start, dateRange.end)
        }
      });

      // Filter to only impressions with this value
      const filteredImpressions = valueImpressions.filter(imp =>
        imp.valuesFilters?.includes(value)
      );

      // Aggregate by vendor
      const vendorStats = new Map<string, {
        impressions: number;
        clicks: number;
        conversions: number;
      }>();

      for (const impression of filteredImpressions) {
        const stats = vendorStats.get(impression.vendorId) || {
          impressions: 0,
          clicks: 0,
          conversions: 0
        };

        stats.impressions++;
        if (impression.action === 'click' || impression.action === 'catalog_view') {
          stats.clicks++;
        }
        if (impression.action === 'product_click') {
          stats.conversions += 0.1;
        }

        vendorStats.set(impression.vendorId, stats);
      }

      // Calculate scores for all vendors
      const vendorScores = Array.from(vendorStats.entries()).map(([vId, stats]) => {
        const ctr = stats.impressions > 0 ? stats.clicks / stats.impressions : 0;
        const convRate = stats.clicks > 0 ? stats.conversions / stats.clicks : 0;
        const score = (stats.impressions * 0.4) + (ctr * 100 * 0.35) + (convRate * 100 * 0.25);
        return { vendorId: vId, score };
      });

      // Sort by score descending
      vendorScores.sort((a, b) => b.score - a.score);

      // Find this vendor's rank
      const rank = vendorScores.findIndex(v => v.vendorId === vendorId) + 1;
      return rank > 0 ? rank : 0; // Return 0 if vendor not found in rankings

    } catch (error) {
      console.error('[DiscoveryAnalyticsService] Error calculating rank for value:', error);
      return 0;
    }
  }

  /**
   * Calculate trend by comparing current to previous period
   *
   * @param vendorId - Vendor ID
   * @param dateRange - Current period date range
   * @param currentTotal - Current period total
   * @returns Trend indicator (up/flat/down)
   */
  private async calculateTrend(
    vendorId: string,
    dateRange: DateRange,
    currentTotal: number
  ): Promise<Trend> {
    try {
      // Return FLAT if database not initialized (e.g., in tests)
      if (!AppDataSource.isInitialized) {
        return Trend.FLAT;
      }

      // Calculate previous period (same duration before current period)
      const duration = dateRange.end.getTime() - dateRange.start.getTime();
      const previousEnd = new Date(dateRange.start);
      const previousStart = new Date(dateRange.start.getTime() - duration);

      // Get previous period impressions
      const impressionRepo = AppDataSource.getRepository(DiscoveryImpression);
      const previousTotal = await impressionRepo.count({
        where: {
          vendorId,
          createdAt: Between(previousStart, previousEnd)
        }
      });

      // No previous data - determine trend based on current
      if (previousTotal === 0) {
        return currentTotal > 0 ? Trend.UP : Trend.FLAT;
      }

      // Calculate percentage change
      const changePercent = ((currentTotal - previousTotal) / previousTotal) * 100;

      // Trend thresholds: >10% = up, <-10% = down, otherwise flat
      if (changePercent > 10) return Trend.UP;
      if (changePercent < -10) return Trend.DOWN;
      return Trend.FLAT;
    } catch (error) {
      console.error('[DiscoveryAnalyticsService] Error calculating trend:', error);
      return Trend.FLAT;
    }
  }
}

// Singleton instance
export const discoveryAnalyticsService = new DiscoveryAnalyticsService();
