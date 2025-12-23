/**
 * Analytics Resolver
 *
 * GraphQL resolvers for business intelligence and analytics queries
 */

import { GraphQLError } from 'graphql';
import { GraphQLContext } from '../graphql/apollo-server';
import { analyticsService, MetricsTimeframe, MetricsFilters } from '../services/analytics.service';
import { insightsService } from '../services/insights.service';

// =============================================================================
// RESOLVER DEFINITIONS
// =============================================================================

export const analyticsResolvers = {
  Query: {
    /**
     * Get comprehensive business metrics for a timeframe
     */
    businessMetrics: async (
      _parent: unknown,
      {
        timeframe,
        filters,
      }: {
        timeframe?: MetricsTimeframe;
        filters?: MetricsFilters;
      },
      context: GraphQLContext
    ) => {
      try {
        context.logger.info('Fetching business metrics', { timeframe, filters });

        const metrics = await analyticsService.computeBusinessMetrics(
          timeframe || { preset: '30d' },
          filters || {}
        );

        return metrics;
      } catch (error) {
        context.logger.error('Error fetching business metrics', { error, timeframe, filters });
        throw new GraphQLError('Failed to compute business metrics', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },

    /**
     * Get AI-generated insights based on current metrics
     */
    businessInsights: async (
      _parent: unknown,
      {
        timeframe,
        filters,
      }: {
        timeframe?: MetricsTimeframe;
        filters?: MetricsFilters;
      },
      context: GraphQLContext
    ) => {
      try {
        context.logger.info('Generating business insights', { timeframe, filters });

        // First get the metrics
        const metrics = await analyticsService.computeBusinessMetrics(
          timeframe || { preset: '30d' },
          filters || {}
        );

        // Then generate insights based on metrics
        const insights = await insightsService.generateInsights(metrics);

        return insights;
      } catch (error) {
        context.logger.error('Error generating business insights', { error });
        throw new GraphQLError('Failed to generate business insights', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },

    /**
     * Get active business alerts
     */
    businessAlerts: async (
      _parent: unknown,
      {
        severity,
        category,
        acknowledged,
        limit = 50,
      }: {
        severity?: string;
        category?: string;
        acknowledged?: boolean;
        limit?: number;
      },
      context: GraphQLContext
    ) => {
      try {
        context.logger.info('Fetching business alerts', { severity, category, acknowledged, limit });

        const alerts = await insightsService.getBusinessAlerts(
          severity,
          category,
          acknowledged,
          limit
        );

        return alerts;
      } catch (error) {
        context.logger.error('Error fetching business alerts', { error });
        throw new GraphQLError('Failed to fetch business alerts', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },

    /**
     * Get a specific alert by ID
     */
    businessAlert: async (
      _parent: unknown,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      try {
        const alert = await insightsService.getAlertById(id);

        if (!alert) {
          throw new GraphQLError('Alert not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        return alert;
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        context.logger.error('Error fetching business alert', { error, id });
        throw new GraphQLError('Failed to fetch business alert', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },

    /**
     * Get dashboard summary for quick overview
     */
    dashboardSummary: async (
      _parent: unknown,
      { organizationId }: { organizationId?: string },
      context: GraphQLContext
    ) => {
      try {
        context.logger.info('Fetching dashboard summary', { organizationId });

        // Use org from context if not specified
        const orgId = organizationId ||
          context.user?.spaOrganizationId ||
          context.user?.vendorOrganizationId;

        const summary = await analyticsService.getDashboardSummary(orgId);

        return summary;
      } catch (error) {
        context.logger.error('Error fetching dashboard summary', { error, organizationId });
        throw new GraphQLError('Failed to fetch dashboard summary', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },

    /**
     * Get generated reports (placeholder - would need report storage)
     */
    reports: async (
      _parent: unknown,
      {
        type,
        limit = 20,
        offset = 0,
      }: {
        type?: string;
        limit?: number;
        offset?: number;
      },
      context: GraphQLContext
    ) => {
      try {
        // This would query from a reports table
        // For now, return empty array
        return [];
      } catch (error) {
        context.logger.error('Error fetching reports', { error });
        throw new GraphQLError('Failed to fetch reports', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },

    /**
     * Get a specific report by ID
     */
    report: async (
      _parent: unknown,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      try {
        // This would query from a reports table
        return null;
      } catch (error) {
        context.logger.error('Error fetching report', { error, id });
        throw new GraphQLError('Failed to fetch report', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },

    /**
     * Get scheduled reports
     */
    scheduledReports: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext
    ) => {
      try {
        // This would query from a scheduled_reports table
        return [];
      } catch (error) {
        context.logger.error('Error fetching scheduled reports', { error });
        throw new GraphQLError('Failed to fetch scheduled reports', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },
  },

  Mutation: {
    /**
     * Generate a report on demand
     */
    generateReport: async (
      _parent: unknown,
      {
        input,
      }: {
        input: {
          type: string;
          format: string;
          timeframe: MetricsTimeframe;
          filters?: MetricsFilters;
          includeCharts?: boolean;
          includeRawData?: boolean;
          includeRecommendations?: boolean;
        };
      },
      context: GraphQLContext
    ) => {
      try {
        // Check authentication
        if (!context.user) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        context.logger.info('Generating report', { input, userId: context.user.userId });

        // Generate metrics and insights
        const metrics = await analyticsService.computeBusinessMetrics(
          input.timeframe,
          input.filters || {}
        );

        let insights = null;
        if (input.includeRecommendations) {
          insights = await insightsService.generateInsights(metrics);
        }

        // Create report record (placeholder)
        const report = {
          id: `report-${Date.now()}`,
          type: input.type,
          format: input.format,
          timeframe: input.timeframe.preset || 'custom',
          generatedAt: new Date(),
          downloadUrl: null, // Would generate file and upload to storage
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          status: 'COMPLETED',
          metrics,
          insights,
        };

        return report;
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        context.logger.error('Error generating report', { error });
        throw new GraphQLError('Failed to generate report', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },

    /**
     * Schedule recurring reports
     */
    scheduleReport: async (
      _parent: unknown,
      {
        input,
      }: {
        input: {
          name: string;
          type: string;
          format: string;
          frequency: string;
          recipients: string[];
          filters?: MetricsFilters;
        };
      },
      context: GraphQLContext
    ) => {
      try {
        if (!context.user) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        context.logger.info('Scheduling report', { input, userId: context.user.userId });

        // Create scheduled report record (placeholder)
        const scheduledReport = {
          id: `scheduled-${Date.now()}`,
          name: input.name,
          type: input.type,
          format: input.format,
          frequency: input.frequency,
          recipients: input.recipients,
          lastRunAt: null,
          nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          isActive: true,
          createdAt: new Date(),
        };

        return scheduledReport;
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        context.logger.error('Error scheduling report', { error });
        throw new GraphQLError('Failed to schedule report', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },

    /**
     * Update scheduled report
     */
    updateScheduledReport: async (
      _parent: unknown,
      {
        id,
        input,
      }: {
        id: string;
        input: {
          name: string;
          type: string;
          format: string;
          frequency: string;
          recipients: string[];
          filters?: MetricsFilters;
        };
      },
      context: GraphQLContext
    ) => {
      try {
        if (!context.user) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        // Update would go here
        return {
          id,
          ...input,
          lastRunAt: null,
          nextRunAt: new Date(),
          isActive: true,
          createdAt: new Date(),
        };
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        context.logger.error('Error updating scheduled report', { error, id });
        throw new GraphQLError('Failed to update scheduled report', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },

    /**
     * Delete scheduled report
     */
    deleteScheduledReport: async (
      _parent: unknown,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      try {
        if (!context.user) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        context.logger.info('Deleting scheduled report', { id, userId: context.user.userId });
        // Delete would go here
        return true;
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        context.logger.error('Error deleting scheduled report', { error, id });
        throw new GraphQLError('Failed to delete scheduled report', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },

    /**
     * Acknowledge a business alert
     */
    acknowledgeAlert: async (
      _parent: unknown,
      {
        input,
      }: {
        input: {
          alertId: string;
          note?: string;
        };
      },
      context: GraphQLContext
    ) => {
      try {
        if (!context.user) {
          throw new GraphQLError('Authentication required', {
            extensions: { code: 'UNAUTHENTICATED' },
          });
        }

        context.logger.info('Acknowledging alert', {
          alertId: input.alertId,
          userId: context.user.userId,
        });

        const alert = await insightsService.acknowledgeAlert(
          input.alertId,
          context.user.userId,
          input.note
        );

        if (!alert) {
          throw new GraphQLError('Alert not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        return alert;
      } catch (error) {
        if (error instanceof GraphQLError) throw error;
        context.logger.error('Error acknowledging alert', { error });
        throw new GraphQLError('Failed to acknowledge alert', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },

    /**
     * Record an analytics event
     */
    recordAnalyticsEvent: async (
      _parent: unknown,
      {
        eventType,
        eventData,
        organizationId,
      }: {
        eventType: string;
        eventData: Record<string, any>;
        organizationId?: string;
      },
      context: GraphQLContext
    ) => {
      try {
        context.logger.info('Recording analytics event', { eventType, organizationId });

        const success = await analyticsService.recordAnalyticsEvent(
          eventType,
          eventData,
          organizationId || context.user?.spaOrganizationId || context.user?.vendorOrganizationId
        );

        return success;
      } catch (error) {
        context.logger.error('Error recording analytics event', { error, eventType });
        // Don't throw - analytics should fail silently
        return false;
      }
    },
  },

  // Field resolvers for computed fields
  DashboardMetric: {
    trend: (parent: any) => {
      // Ensure trend is uppercase enum value
      return parent.trend?.toUpperCase() || 'STABLE';
    },
  },

  TrendInsight: {
    trend: (parent: any) => parent.trend?.toUpperCase() || 'STABLE',
    significance: (parent: any) => parent.significance?.toUpperCase() || 'MEDIUM',
  },

  AnomalyInsight: {
    severity: (parent: any) => parent.severity?.toUpperCase() || 'WARNING',
  },

  PredictiveInsight: {
    impact: (parent: any) => parent.impact?.toUpperCase() || 'MEDIUM',
  },

  ActionableRecommendation: {
    category: (parent: any) => parent.category?.toUpperCase() || 'OPTIMIZATION',
    priority: (parent: any) => parent.priority?.toUpperCase() || 'MEDIUM',
    implementationEffort: (parent: any) => parent.implementationEffort?.toUpperCase() || 'MEDIUM',
  },

  BusinessAlert: {
    severity: (parent: any) => parent.severity?.toUpperCase() || 'WARNING',
    category: (parent: any) => parent.category?.toUpperCase() || 'OPERATIONAL',
  },
};

export default analyticsResolvers;
