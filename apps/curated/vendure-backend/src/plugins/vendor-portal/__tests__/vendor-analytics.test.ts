/**
 * Unit Tests: Vendor Analytics Schema
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.3: Analytics Schema (Task A.3.12)
 *
 * Tests analytics entities and data structures for vendor performance tracking.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { VendorAnalyticsDaily } from '../entities/vendor-analytics-daily.entity';
import {
  SpaVendorRelationship,
  RelationshipStatus,
} from '../entities/spa-vendor-relationship.entity';
import { ProductPerformanceDaily } from '../entities/product-performance-daily.entity';
import {
  DiscoveryImpression,
  ImpressionSource,
  ImpressionAction,
} from '../entities/discovery-impression.entity';

describe('Vendor Analytics Schema', () => {
  // ──────────────────────────────────────────────────────────────
  // VENDOR ANALYTICS DAILY
  // ──────────────────────────────────────────────────────────────
  describe('VendorAnalyticsDaily Entity', () => {
    let analytics: VendorAnalyticsDaily;

    beforeEach(() => {
      analytics = new VendorAnalyticsDaily();
    });

    it('should create an analytics instance', () => {
      expect(analytics).toBeDefined();
      expect(analytics).toBeInstanceOf(VendorAnalyticsDaily);
    });

    it('should store daily metrics for a vendor', () => {
      analytics.vendorId = 'vendor-123';
      analytics.date = new Date('2025-12-20');

      // Revenue metrics
      analytics.revenue = 2450.0;
      analytics.revenueFromNewSpas = 980.0;
      analytics.revenueFromRepeatSpas = 1470.0;

      // Order metrics
      analytics.orderCount = 8;
      analytics.ordersFromNewSpas = 3;
      analytics.ordersFromRepeatSpas = 5;
      analytics.avgOrderValue = 306.25;

      // Spa metrics
      analytics.activeSpas = 6;
      analytics.newSpas = 2;
      analytics.repeatSpas = 4;

      expect(analytics.vendorId).toBe('vendor-123');
      expect(analytics.revenue).toBe(2450.0);
      expect(analytics.orderCount).toBe(8);
      expect(analytics.activeSpas).toBe(6);
    });

    it('should track discovery metrics by source', () => {
      analytics.impressions = 245;
      analytics.impressionsFromSearch = 120;
      analytics.impressionsFromBrowse = 45;
      analytics.impressionsFromValues = 60;
      analytics.impressionsFromRecommendations = 15;
      analytics.impressionsFromDirect = 5;

      const totalSourced =
        analytics.impressionsFromSearch +
        analytics.impressionsFromBrowse +
        analytics.impressionsFromValues +
        analytics.impressionsFromRecommendations +
        analytics.impressionsFromDirect;

      expect(totalSourced).toBe(analytics.impressions);
    });

    it('should track engagement metrics', () => {
      analytics.catalogViews = 48;
      analytics.productClicks = 32;
      analytics.contactClicks = 12;
      analytics.totalTimeOnProfile = 18650; // seconds
      analytics.bounces = 55;

      expect(analytics.catalogViews).toBe(48);
      expect(analytics.productClicks).toBe(32);
      expect(analytics.contactClicks).toBe(12);
      expect(analytics.totalTimeOnProfile).toBeGreaterThan(0);
    });

    it('should calculate average time on profile', () => {
      analytics.impressions = 245;
      analytics.totalTimeOnProfile = 18650; // seconds
      analytics.bounces = 55;

      const nonBounceViews = analytics.impressions - analytics.bounces;
      const avgTime = Math.round(analytics.totalTimeOnProfile / nonBounceViews);

      expect(avgTime).toBe(98); // ~1.5 minutes average
    });

    it('should support zero values for days with no activity', () => {
      analytics.vendorId = 'vendor-456';
      analytics.date = new Date('2025-12-21');
      analytics.revenue = 0;
      analytics.orderCount = 0;
      analytics.activeSpas = 0;
      analytics.impressions = 0;

      expect(analytics.revenue).toBe(0);
      expect(analytics.orderCount).toBe(0);
    });

    it('should calculate new vs repeat customer breakdown', () => {
      analytics.revenue = 5000.0;
      analytics.revenueFromNewSpas = 2000.0;
      analytics.revenueFromRepeatSpas = 3000.0;

      const newCustomerPercent = (analytics.revenueFromNewSpas / analytics.revenue) * 100;
      const repeatCustomerPercent = (analytics.revenueFromRepeatSpas / analytics.revenue) * 100;

      expect(newCustomerPercent).toBe(40);
      expect(repeatCustomerPercent).toBe(60);
    });
  });

  // ──────────────────────────────────────────────────────────────
  // SPA-VENDOR RELATIONSHIP
  // ──────────────────────────────────────────────────────────────
  describe('SpaVendorRelationship Entity', () => {
    let relationship: SpaVendorRelationship;

    beforeEach(() => {
      relationship = new SpaVendorRelationship();
    });

    it('should create a relationship instance', () => {
      expect(relationship).toBeDefined();
      expect(relationship).toBeInstanceOf(SpaVendorRelationship);
    });

    it('should track spa-vendor relationship', () => {
      relationship.vendorId = 'vendor-123';
      relationship.spaId = 'spa-456';
      relationship.spaName = 'Luxe Day Spa';
      relationship.status = RelationshipStatus.ACTIVE;

      expect(relationship.vendorId).toBe('vendor-123');
      expect(relationship.spaId).toBe('spa-456');
      expect(relationship.spaName).toBe('Luxe Day Spa');
      expect(relationship.status).toBe(RelationshipStatus.ACTIVE);
    });

    it('should track lifetime value metrics', () => {
      relationship.lifetimeValue = 12500.0;
      relationship.orderCount = 15;
      relationship.avgOrderValue = 833.33;

      expect(relationship.lifetimeValue).toBe(12500.0);
      expect(relationship.orderCount).toBe(15);
      expect(relationship.avgOrderValue).toBeCloseTo(833.33, 2);
    });

    it('should track order timing', () => {
      relationship.firstOrderAt = new Date('2025-06-01');
      relationship.lastOrderAt = new Date('2025-12-15');
      relationship.avgDaysBetweenOrders = 14; // Biweekly orders

      const daysBetween = Math.floor(
        (relationship.lastOrderAt.getTime() - relationship.firstOrderAt.getTime()) /
          (1000 * 60 * 60 * 24),
      );

      expect(daysBetween).toBe(197); // ~6.5 months
      expect(relationship.avgDaysBetweenOrders).toBe(14);
    });

    it('should calculate days since last order for churn risk', () => {
      const today = new Date('2025-12-20');
      const lastOrder = new Date('2025-11-01');

      relationship.lastOrderAt = lastOrder;
      relationship.avgDaysBetweenOrders = 14;

      const daysSince = Math.floor((today.getTime() - lastOrder.getTime()) / (1000 * 60 * 60 * 24));
      relationship.daysSinceLastOrder = daysSince;

      expect(relationship.daysSinceLastOrder).toBe(49);

      // If days since last order > 2x average, spa is at risk
      const isAtRisk = relationship.daysSinceLastOrder > relationship.avgDaysBetweenOrders * 2;
      expect(isAtRisk).toBe(true);
    });

    it('should support status transitions', () => {
      relationship.status = RelationshipStatus.NEW;
      expect(relationship.status).toBe(RelationshipStatus.NEW);

      relationship.status = RelationshipStatus.ACTIVE;
      expect(relationship.status).toBe(RelationshipStatus.ACTIVE);

      relationship.status = RelationshipStatus.AT_RISK;
      expect(relationship.status).toBe(RelationshipStatus.AT_RISK);

      relationship.status = RelationshipStatus.CHURNED;
      expect(relationship.status).toBe(RelationshipStatus.CHURNED);
    });

    it('should track product preferences', () => {
      relationship.favoriteCategories = ['Serums', 'Moisturizers', 'Cleansers'];
      relationship.topProducts = ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5'];

      expect(relationship.favoriteCategories).toHaveLength(3);
      expect(relationship.topProducts).toHaveLength(5);
    });

    it('should track engagement metrics', () => {
      relationship.profileViews = 23;
      relationship.messageCount = 8;
      relationship.lastMessageAt = new Date('2025-12-18');

      expect(relationship.profileViews).toBe(23);
      expect(relationship.messageCount).toBe(8);
      expect(relationship.lastMessageAt).toBeInstanceOf(Date);
    });
  });

  // ──────────────────────────────────────────────────────────────
  // PRODUCT PERFORMANCE DAILY
  // ──────────────────────────────────────────────────────────────
  describe('ProductPerformanceDaily Entity', () => {
    let performance: ProductPerformanceDaily;

    beforeEach(() => {
      performance = new ProductPerformanceDaily();
    });

    it('should create a product performance instance', () => {
      expect(performance).toBeDefined();
      expect(performance).toBeInstanceOf(ProductPerformanceDaily);
    });

    it('should store daily product metrics', () => {
      performance.vendorId = 'vendor-123';
      performance.productId = 'prod-456';
      performance.productName = 'Radiance Vitamin C Serum';
      performance.productSku = 'VCS-001';
      performance.date = new Date('2025-12-20');

      expect(performance.vendorId).toBe('vendor-123');
      expect(performance.productId).toBe('prod-456');
      expect(performance.productName).toBe('Radiance Vitamin C Serum');
    });

    it('should track sales metrics', () => {
      performance.unitsSold = 48;
      performance.revenue = 1920.0;
      performance.orderCount = 32;
      performance.uniqueSpas = 28;

      expect(performance.unitsSold).toBe(48);
      expect(performance.revenue).toBe(1920.0);
      expect(performance.orderCount).toBe(32);
      expect(performance.uniqueSpas).toBe(28);
    });

    it('should calculate average units per order', () => {
      performance.unitsSold = 48;
      performance.orderCount = 32;

      const avgUnitsPerOrder = performance.unitsSold / performance.orderCount;
      expect(avgUnitsPerOrder).toBe(1.5);
    });

    it('should track engagement metrics', () => {
      performance.views = 450;
      performance.addToCartClicks = 85;
      performance.orderCount = 32;

      // Calculate conversion rate
      const conversionRate = (performance.orderCount / performance.views) * 100;
      performance.conversionRate = Math.round(conversionRate * 100) / 100;

      expect(performance.conversionRate).toBeCloseTo(7.11, 2);
    });

    it('should store product context', () => {
      performance.category = 'Serums';
      performance.price = 45.0;

      expect(performance.category).toBe('Serums');
      expect(performance.price).toBe(45.0);
    });

    it('should support zero values for products with no sales', () => {
      performance.vendorId = 'vendor-123';
      performance.productId = 'prod-789';
      performance.date = new Date('2025-12-20');
      performance.unitsSold = 0;
      performance.revenue = 0;
      performance.orderCount = 0;

      expect(performance.unitsSold).toBe(0);
      expect(performance.revenue).toBe(0);
    });

    it('should calculate cart abandonment rate', () => {
      performance.views = 450;
      performance.addToCartClicks = 85;
      performance.orderCount = 32;

      const abandonmentRate = ((performance.addToCartClicks - performance.orderCount) / performance.addToCartClicks) * 100;

      expect(abandonmentRate).toBeCloseTo(62.35, 2); // 62.35% abandoned after adding to cart
    });
  });

  // ──────────────────────────────────────────────────────────────
  // DISCOVERY IMPRESSION
  // ──────────────────────────────────────────────────────────────
  describe('DiscoveryImpression Entity', () => {
    let impression: DiscoveryImpression;

    beforeEach(() => {
      impression = new DiscoveryImpression();
    });

    it('should create an impression instance', () => {
      expect(impression).toBeDefined();
      expect(impression).toBeInstanceOf(DiscoveryImpression);
    });

    it('should track search impressions', () => {
      impression.vendorId = 'vendor-123';
      impression.spaId = 'spa-456';
      impression.source = ImpressionSource.SEARCH;
      impression.queryText = 'vitamin c serum';
      impression.action = ImpressionAction.VIEW;
      impression.position = 3;
      impression.totalResults = 24;

      expect(impression.source).toBe(ImpressionSource.SEARCH);
      expect(impression.queryText).toBe('vitamin c serum');
      expect(impression.position).toBe(3);
    });

    it('should track values filter impressions', () => {
      impression.vendorId = 'vendor-123';
      impression.spaId = 'spa-789';
      impression.source = ImpressionSource.VALUES;
      impression.valuesFilters = ['clean_beauty', 'vegan', 'woman_founded'];
      impression.action = ImpressionAction.VIEW;

      expect(impression.source).toBe(ImpressionSource.VALUES);
      expect(impression.valuesFilters).toHaveLength(3);
      expect(impression.valuesFilters).toContain('clean_beauty');
    });

    it('should track category browse impressions', () => {
      impression.vendorId = 'vendor-123';
      impression.source = ImpressionSource.BROWSE;
      impression.categoryBrowsed = 'Serums';
      impression.action = ImpressionAction.VIEW;
      impression.position = 7;

      expect(impression.source).toBe(ImpressionSource.BROWSE);
      expect(impression.categoryBrowsed).toBe('Serums');
    });

    it('should track recommendation impressions', () => {
      impression.vendorId = 'vendor-123';
      impression.spaId = 'spa-456';
      impression.source = ImpressionSource.RECOMMENDATION;
      impression.recommendationId = 'algo-similar-values';
      impression.action = ImpressionAction.VIEW;

      expect(impression.source).toBe(ImpressionSource.RECOMMENDATION);
      expect(impression.recommendationId).toBe('algo-similar-values');
    });

    it('should track direct profile visits', () => {
      impression.vendorId = 'vendor-123';
      impression.spaId = 'spa-456';
      impression.source = ImpressionSource.DIRECT;
      impression.action = ImpressionAction.VIEW;
      impression.referrer = 'https://example.com/vendor-list';

      expect(impression.source).toBe(ImpressionSource.DIRECT);
      expect(impression.referrer).toBeTruthy();
    });

    it('should track engagement actions', () => {
      // View action
      impression.action = ImpressionAction.VIEW;
      expect(impression.action).toBe(ImpressionAction.VIEW);

      // Click action
      impression.action = ImpressionAction.CLICK;
      expect(impression.action).toBe(ImpressionAction.CLICK);

      // Catalog view
      impression.action = ImpressionAction.CATALOG_VIEW;
      expect(impression.action).toBe(ImpressionAction.CATALOG_VIEW);

      // Product click
      impression.action = ImpressionAction.PRODUCT_CLICK;
      impression.productClicked = 'prod-789';
      expect(impression.action).toBe(ImpressionAction.PRODUCT_CLICK);
      expect(impression.productClicked).toBe('prod-789');

      // Contact click
      impression.action = ImpressionAction.CONTACT_CLICK;
      expect(impression.action).toBe(ImpressionAction.CONTACT_CLICK);

      // Bounce
      impression.action = ImpressionAction.BOUNCE;
      impression.timeOnProfile = null;
      expect(impression.action).toBe(ImpressionAction.BOUNCE);
      expect(impression.timeOnProfile).toBeNull();
    });

    it('should track time on profile', () => {
      impression.action = ImpressionAction.VIEW;
      impression.timeOnProfile = 125; // seconds

      expect(impression.timeOnProfile).toBe(125);
    });

    it('should track ranking context', () => {
      impression.position = 5;
      impression.totalResults = 48;

      const percentilePosition = ((impression.totalResults - impression.position) / impression.totalResults) * 100;

      expect(percentilePosition).toBeCloseTo(89.58, 2); // Ranked in top 10.42%
    });

    it('should support anonymous impressions', () => {
      impression.vendorId = 'vendor-123';
      impression.spaId = null; // Anonymous
      impression.sessionId = 'session-xyz-789';
      impression.source = ImpressionSource.SEARCH;
      impression.action = ImpressionAction.VIEW;

      expect(impression.spaId).toBeNull();
      expect(impression.sessionId).toBeTruthy();
    });

    it('should track device metadata', () => {
      impression.userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)';
      impression.deviceType = 'mobile';

      expect(impression.userAgent).toBeTruthy();
      expect(impression.deviceType).toBe('mobile');
    });
  });

  // ──────────────────────────────────────────────────────────────
  // ANALYTICS QUERIES (Integration-level tests)
  // ──────────────────────────────────────────────────────────────
  describe('Analytics Query Patterns', () => {
    it('should support time-range queries for dashboard', () => {
      const analytics = new VendorAnalyticsDaily();
      analytics.vendorId = 'vendor-123';
      analytics.date = new Date('2025-12-20');
      analytics.revenue = 2450.0;

      // In practice, queries would look like:
      // SELECT * FROM vendor_analytics_daily
      // WHERE vendorId = 'vendor-123'
      // AND date BETWEEN '2025-12-01' AND '2025-12-31'
      // ORDER BY date DESC

      expect(analytics.vendorId).toBe('vendor-123');
      expect(analytics.date).toBeInstanceOf(Date);
    });

    it('should support top customers query', () => {
      const relationships = [
        { spaId: 'spa-1', lifetimeValue: 15000 },
        { spaId: 'spa-2', lifetimeValue: 12000 },
        { spaId: 'spa-3', lifetimeValue: 8500 },
      ];

      const topCustomers = relationships.sort((a, b) => b.lifetimeValue - a.lifetimeValue).slice(0, 5);

      expect(topCustomers[0].spaId).toBe('spa-1');
      expect(topCustomers[0].lifetimeValue).toBe(15000);
    });

    it('should support churn risk detection query', () => {
      const relationship = new SpaVendorRelationship();
      relationship.avgDaysBetweenOrders = 14;
      relationship.daysSinceLastOrder = 35;
      relationship.status = RelationshipStatus.ACTIVE;

      // Churn risk: days since last order > 2x average
      const isAtRisk = relationship.daysSinceLastOrder > relationship.avgDaysBetweenOrders * 2;

      if (isAtRisk && relationship.status === RelationshipStatus.ACTIVE) {
        relationship.status = RelationshipStatus.AT_RISK;
      }

      expect(relationship.status).toBe(RelationshipStatus.AT_RISK);
    });

    it('should support search query aggregation', () => {
      const impressions = [
        { queryText: 'vitamin c serum', vendorId: 'vendor-123' },
        { queryText: 'vitamin c serum', vendorId: 'vendor-123' },
        { queryText: 'anti aging serum', vendorId: 'vendor-123' },
        { queryText: 'vitamin c serum', vendorId: 'vendor-123' },
      ];

      // GROUP BY queryText, COUNT(*)
      const queryGroups = impressions.reduce((acc: Record<string, number>, imp) => {
        if (imp.queryText) {
          acc[imp.queryText] = (acc[imp.queryText] || 0) + 1;
        }
        return acc;
      }, {});

      expect(queryGroups['vitamin c serum']).toBe(3);
      expect(queryGroups['anti aging serum']).toBe(1);
    });
  });
});
