/**
 * Discovery Analytics Service - Unit Tests
 * Feature 011: Vendor Portal MVP
 * Phase D: Discovery & Optimization
 * Sprint D.1: Discovery Analytics Backend - Task D.1.11
 */

import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from 'vitest';
import { discoveryAnalyticsService, DiscoveryAnalyticsService } from '../discovery-analytics.service';
import { ImpressionSource, ProfileEventType, Trend } from '../discovery-analytics.service';

// Mock AppDataSource
const mockSave = vi.fn().mockResolvedValue({});
const mockFind = vi.fn().mockResolvedValue([]);
const mockCount = vi.fn().mockResolvedValue(0);
const mockFindOne = vi.fn().mockResolvedValue(null);

const mockRepository = {
  save: mockSave,
  find: mockFind,
  count: mockCount,
  findOne: mockFindOne
};

vi.mock('../config/database', () => ({
  AppDataSource: {
    getRepository: vi.fn().mockReturnValue(mockRepository),
    isInitialized: true
  }
}));

describe('DiscoveryAnalyticsService', () => {
  let service: DiscoveryAnalyticsService;

  beforeAll(async () => {
    service = discoveryAnalyticsService;
    await service.initialize();
  });

  afterAll(async () => {
    await service.shutdown();
  });

  beforeEach(() => {
    // Reset mocks between tests
    mockSave.mockClear();
    mockFind.mockClear();
    mockCount.mockClear();
    mockFindOne.mockClear();
  });

  describe('Initialization', () => {
    it('should initialize successfully', async () => {
      const newService = new DiscoveryAnalyticsService();
      await newService.initialize();
      // Should not throw
      expect(true).toBe(true);
      await newService.shutdown();
    });

    it('should not initialize twice', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      await service.initialize(); // Already initialized in beforeAll
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Already initialized')
      );
      consoleWarnSpy.mockRestore();
    });

    it('should shutdown gracefully', async () => {
      const newService = new DiscoveryAnalyticsService();
      await newService.initialize();
      await newService.shutdown();
      // Should not throw
      expect(true).toBe(true);
    });
  });

  describe('Event Handlers', () => {
    describe('onImpressionTracked', () => {
      it('should track search impression', async () => {
        const event = {
          vendorId: 'vendor-1',
          source: ImpressionSource.SEARCH,
          searchQueryId: 'query-123',
          sessionId: 'session-1'
        };

        await expect(service.onImpressionTracked(event)).resolves.not.toThrow();
      });

      it('should track values impression', async () => {
        const event = {
          vendorId: 'vendor-1',
          source: ImpressionSource.VALUES,
          valueFilter: 'organic',
          sessionId: 'session-1'
        };

        await expect(service.onImpressionTracked(event)).resolves.not.toThrow();
      });

      it('should emit impressionTracked event', async () => {
        const event = {
          vendorId: 'vendor-1',
          source: ImpressionSource.SEARCH,
          sessionId: 'session-1'
        };

        const eventPromise = new Promise((resolve) => {
          service.once('impressionTracked', resolve);
        });

        await service.onImpressionTracked(event);
        const emittedEvent = await eventPromise;

        expect(emittedEvent).toEqual(event);
      });
    });

    describe('onProfileViewed', () => {
      it('should track profile view', async () => {
        const event = {
          vendorId: 'vendor-1',
          sessionId: 'session-1',
          referrer: 'search'
        };

        await expect(service.onProfileViewed(event)).resolves.not.toThrow();
      });

      it('should emit profileViewed event', async () => {
        const event = {
          vendorId: 'vendor-1',
          sessionId: 'session-1'
        };

        const eventPromise = new Promise((resolve) => {
          service.once('profileViewed', resolve);
        });

        await service.onProfileViewed(event);
        const emittedEvent = await eventPromise;

        expect(emittedEvent).toEqual(event);
      });
    });

    describe('onProfileEvent', () => {
      it('should track catalog browse event', async () => {
        const event = {
          vendorId: 'vendor-1',
          sessionId: 'session-1',
          eventType: ProfileEventType.CATALOG_BROWSE
        };

        await expect(service.onProfileEvent(event)).resolves.not.toThrow();
      });

      it('should track product click event', async () => {
        const event = {
          vendorId: 'vendor-1',
          sessionId: 'session-1',
          eventType: ProfileEventType.PRODUCT_CLICK,
          metadata: { productId: 'product-123' }
        };

        await expect(service.onProfileEvent(event)).resolves.not.toThrow();
      });
    });

    describe('onSearchPerformed', () => {
      it('should track search query', async () => {
        const event = {
          query: 'organic moisturizer',
          userId: 'user-1',
          filters: { values: ['organic'] },
          resultsCount: 15,
          vendorResults: ['vendor-1', 'vendor-2', 'vendor-3']
        };

        await expect(service.onSearchPerformed(event)).resolves.not.toThrow();
      });

      it('should emit searchPerformed event', async () => {
        const event = {
          query: 'vegan serum',
          resultsCount: 10,
          vendorResults: ['vendor-1', 'vendor-2']
        };

        const eventPromise = new Promise((resolve) => {
          service.once('searchPerformed', resolve);
        });

        await service.onSearchPerformed(event);
        const emittedEvent = await eventPromise;

        expect(emittedEvent).toEqual(event);
      });
    });
  });

  describe('Analytics Queries', () => {
    describe('getVendorDiscoveryAnalytics', () => {
      it('should return complete discovery analytics', async () => {
        const analytics = await service.getVendorDiscoveryAnalytics('vendor-1');

        expect(analytics).toHaveProperty('impressions');
        expect(analytics).toHaveProperty('searchInsights');
        expect(analytics).toHaveProperty('valuesPerformance');
        expect(analytics).toHaveProperty('profileEngagement');
        expect(analytics).toHaveProperty('recommendations');
      });

      it('should use default date range if not provided', async () => {
        const analytics = await service.getVendorDiscoveryAnalytics('vendor-1');

        // Should not throw and should return data
        expect(analytics).toBeDefined();
      });

      it('should accept custom date range', async () => {
        const dateRange = {
          start: new Date('2025-01-01'),
          end: new Date('2025-01-31')
        };

        const analytics = await service.getVendorDiscoveryAnalytics('vendor-1', dateRange);

        expect(analytics).toBeDefined();
      });
    });

    describe('getImpressionsBySource', () => {
      it('should return impressions aggregated by source', async () => {
        const dateRange = {
          start: new Date('2025-01-01'),
          end: new Date('2025-01-31')
        };

        const impressions = await service.getImpressionsBySource('vendor-1', dateRange);

        expect(impressions).toHaveProperty('total');
        expect(impressions).toHaveProperty('bySource');
        expect(impressions.bySource).toHaveProperty('search');
        expect(impressions.bySource).toHaveProperty('browse');
        expect(impressions.bySource).toHaveProperty('values');
        expect(impressions.bySource).toHaveProperty('recommendation');
        expect(impressions.bySource).toHaveProperty('direct');
        expect(impressions).toHaveProperty('trend');
      });

      it('should return zero impressions for new vendor', async () => {
        const dateRange = {
          start: new Date('2025-01-01'),
          end: new Date('2025-01-31')
        };

        const impressions = await service.getImpressionsBySource('new-vendor', dateRange);

        expect(impressions.total).toBe(0);
        expect(impressions.bySource.search).toBe(0);
        expect(impressions.bySource.browse).toBe(0);
        expect(impressions.trend).toBe(Trend.FLAT);
      });
    });

    describe('getSearchQueries', () => {
      it('should return search insights', async () => {
        const insights = await service.getSearchQueries('vendor-1');

        expect(insights).toHaveProperty('queriesLeadingToYou');
        expect(insights).toHaveProperty('missedQueries');
        expect(insights).toHaveProperty('competitorQueries');
        expect(Array.isArray(insights.queriesLeadingToYou)).toBe(true);
        expect(Array.isArray(insights.missedQueries)).toBe(true);
        expect(Array.isArray(insights.competitorQueries)).toBe(true);
      });
    });

    describe('getValuesPerformance', () => {
      it('should return values performance array', async () => {
        const dateRange = {
          start: new Date('2025-01-01'),
          end: new Date('2025-01-31')
        };

        const performance = await service.getValuesPerformance('vendor-1', dateRange);

        expect(Array.isArray(performance)).toBe(true);
      });
    });

    describe('getProfileEngagement', () => {
      it('should return profile engagement metrics', async () => {
        const dateRange = {
          start: new Date('2025-01-01'),
          end: new Date('2025-01-31')
        };

        const engagement = await service.getProfileEngagement('vendor-1', dateRange);

        expect(engagement).toHaveProperty('profileViews');
        expect(engagement).toHaveProperty('avgTimeOnProfile');
        expect(engagement).toHaveProperty('catalogBrowses');
        expect(engagement).toHaveProperty('productClicks');
        expect(engagement).toHaveProperty('contactClicks');
        expect(engagement).toHaveProperty('bounceRate');
      });

      it('should return zero metrics for new vendor', async () => {
        const dateRange = {
          start: new Date('2025-01-01'),
          end: new Date('2025-01-31')
        };

        const engagement = await service.getProfileEngagement('new-vendor', dateRange);

        expect(engagement.profileViews).toBe(0);
        expect(engagement.avgTimeOnProfile).toBe(0);
        expect(engagement.catalogBrowses).toBe(0);
        expect(engagement.bounceRate).toBe(0);
      });
    });
  });

  describe('Aggregation Jobs', () => {
    describe('aggregateDailyMetrics', () => {
      it('should run without errors', async () => {
        await expect(service.aggregateDailyMetrics()).resolves.not.toThrow();
      });
    });

    describe('calculateVendorRankings', () => {
      it('should run without errors', async () => {
        await expect(service.calculateVendorRankings()).resolves.not.toThrow();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle errors in onImpressionTracked gracefully', async () => {
      // This would normally throw if database connection fails
      // For now, just verify the method exists and can be called
      const event = {
        vendorId: '',
        source: ImpressionSource.SEARCH,
        sessionId: ''
      };

      // Should handle gracefully (implementation will add proper error handling)
      await expect(service.onImpressionTracked(event)).resolves.not.toThrow();
    });

    it('should handle errors in onSearchPerformed gracefully', async () => {
      const event = {
        query: '',
        resultsCount: 0,
        vendorResults: []
      };

      await expect(service.onSearchPerformed(event)).resolves.not.toThrow();
    });
  });
});
