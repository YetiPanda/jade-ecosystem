/**
 * Marketing Campaign Resolvers
 * Marketing Analytics Integration
 *
 * Implements CRUD operations for vendor marketing campaigns with performance tracking
 */

import { AppDataSource } from '../../config/database';
import {
  MarketingCampaign,
  CampaignType,
  CampaignStatus,
} from '../../plugins/vendor-portal/entities/marketing-campaign.entity';
import { Between, In } from 'typeorm';

interface Context {
  user?: {
    id: string;
    role: string;
    vendorId?: string;
  };
}

interface CampaignFilterInput {
  type?: string;
  status?: string[];
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

interface CreateCampaignInput {
  name: string;
  type: string;
  description?: string;
  startDate: string;
  endDate: string;
  budgetDollars: number;
  audienceSize?: number;
  audienceDetails?: any;
  metadata?: any;
}

interface UpdateCampaignInput {
  campaignId: string;
  name?: string;
  type?: string;
  status?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  budgetDollars?: number;
  audienceSize?: number;
  audienceDetails?: any;
  metadata?: any;
}

interface UpdateCampaignMetricsInput {
  campaignId: string;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  revenueDollars?: number;
  spentDollars?: number;
}

interface DateRangeInput {
  startDate: string;
  endDate: string;
}

/**
 * Get vendor's marketing campaigns
 *
 * @example
 * query {
 *   vendorCampaigns(filter: { status: [ACTIVE] }, limit: 10) {
 *     id
 *     name
 *     type
 *     status
 *     budgetDollars
 *     spentDollars
 *     roas
 *   }
 * }
 */
export async function vendorCampaigns(
  _parent: any,
  args: { filter?: CampaignFilterInput; limit?: number; offset?: number },
  context: Context
) {
  console.log('[vendorCampaigns] Query called');
  console.log('[vendorCampaigns] Args:', args);

  // Use a valid UUID for testing - in production, this should come from authenticated user
  const vendorId = context.user?.vendorId || context.user?.id || '00000000-0000-0000-0000-000000000001';
  const { filter, limit = 20, offset = 0 } = args;

  try {
    const repository = AppDataSource.getRepository(MarketingCampaign);
    const queryBuilder = repository.createQueryBuilder('campaign');

    queryBuilder.where('campaign.vendorId = :vendorId', { vendorId });

    // Apply filters
    if (filter?.type) {
      queryBuilder.andWhere('campaign.type = :type', { type: filter.type });
    }

    if (filter?.status && filter.status.length > 0) {
      queryBuilder.andWhere('campaign.status IN (:...statuses)', {
        statuses: filter.status,
      });
    }

    if (filter?.dateRange) {
      queryBuilder.andWhere(
        'campaign.startDate >= :startDate AND campaign.endDate <= :endDate',
        {
          startDate: new Date(filter.dateRange.startDate),
          endDate: new Date(filter.dateRange.endDate),
        }
      );
    }

    // Order by most recent first
    queryBuilder.orderBy('campaign.createdAt', 'DESC');
    queryBuilder.skip(offset);
    queryBuilder.take(limit);

    const campaigns = await queryBuilder.getMany();

    // Calculate metrics for each campaign
    campaigns.forEach((campaign) => campaign.calculateMetrics());

    console.log(`[vendorCampaigns] Found ${campaigns.length} campaigns`);
    return campaigns;
  } catch (error) {
    console.error('[vendorCampaigns] Error:', error);
    throw new Error(`Failed to fetch campaigns: ${error.message}`);
  }
}

/**
 * Get a single marketing campaign by ID
 *
 * @example
 * query {
 *   vendorCampaign(id: "campaign-123") {
 *     id
 *     name
 *     impressions
 *     clicks
 *     conversions
 *     roas
 *   }
 * }
 */
export async function vendorCampaign(
  _parent: any,
  args: { id: string },
  context: Context
) {
  console.log('[vendorCampaign] Query called');
  console.log('[vendorCampaign] Campaign ID:', args.id);

  const vendorId = context.user?.vendorId || context.user?.id || '00000000-0000-0000-0000-000000000001';

  try {
    const repository = AppDataSource.getRepository(MarketingCampaign);
    const campaign = await repository.findOne({
      where: {
        id: args.id,
        vendorId: vendorId,
      },
    });

    if (!campaign) {
      console.log('[vendorCampaign] Campaign not found');
      return null;
    }

    // Calculate metrics
    campaign.calculateMetrics();

    console.log('[vendorCampaign] Campaign found:', campaign.name);
    return campaign;
  } catch (error) {
    console.error('[vendorCampaign] Error:', error);
    throw new Error(`Failed to fetch campaign: ${error.message}`);
  }
}

/**
 * Get campaign performance summary
 *
 * @example
 * query {
 *   campaignPerformanceSummary(dateRange: {
 *     startDate: "2024-01-01"
 *     endDate: "2024-12-31"
 *   }) {
 *     totalRevenue
 *     totalSpent
 *     overallROAS
 *     activeCampaigns
 *     channelPerformance {
 *       channel
 *       spent
 *       revenue
 *       roas
 *     }
 *   }
 * }
 */
export async function campaignPerformanceSummary(
  _parent: any,
  args: { dateRange: DateRangeInput },
  context: Context
) {
  console.log('[campaignPerformanceSummary] Query called');
  console.log('[campaignPerformanceSummary] Date range:', args.dateRange);

  const vendorId = context.user?.vendorId || context.user?.id || '00000000-0000-0000-0000-000000000001';

  try {
    const repository = AppDataSource.getRepository(MarketingCampaign);

    // Get all campaigns in date range
    const campaigns = await repository.find({
      where: {
        vendorId: vendorId,
        startDate: Between(
          new Date(args.dateRange.startDate),
          new Date(args.dateRange.endDate)
        ),
      },
    });

    // Calculate aggregate metrics
    let totalRevenueCents = 0;
    let totalSpentCents = 0;
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalConversions = 0;
    let activeCampaigns = 0;
    let completedCampaigns = 0;

    const channelStats: Record<
      string,
      { campaigns: number; spent: number; revenue: number; conversions: number }
    > = {};

    campaigns.forEach((campaign) => {
      campaign.calculateMetrics();

      totalRevenueCents += campaign.revenueCents;
      totalSpentCents += campaign.spentCents;
      totalImpressions += campaign.impressions;
      totalClicks += campaign.clicks;
      totalConversions += campaign.conversions;

      if (campaign.status === 'ACTIVE') activeCampaigns++;
      if (campaign.status === 'COMPLETED') completedCampaigns++;

      // Channel stats
      if (!channelStats[campaign.type]) {
        channelStats[campaign.type] = {
          campaigns: 0,
          spent: 0,
          revenue: 0,
          conversions: 0,
        };
      }

      channelStats[campaign.type].campaigns++;
      channelStats[campaign.type].spent += campaign.spentCents;
      channelStats[campaign.type].revenue += campaign.revenueCents;
      channelStats[campaign.type].conversions += campaign.conversions;
    });

    // Calculate overall metrics
    const totalRevenue = totalRevenueCents / 100;
    const totalSpent = totalSpentCents / 100;
    const overallROAS = totalSpent > 0 ? totalRevenue / totalSpent : 0;
    const overallCTR =
      totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const overallConversionRate =
      totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    // Build channel performance array
    const channelPerformance = Object.entries(channelStats).map(
      ([channel, stats]) => ({
        channel,
        campaigns: stats.campaigns,
        spent: stats.spent / 100,
        revenue: stats.revenue / 100,
        roas: stats.spent > 0 ? stats.revenue / stats.spent : 0,
        conversions: stats.conversions,
      })
    );

    // Sort campaigns by ROAS and revenue
    const sortedByROAS = [...campaigns]
      .sort((a, b) => b.roas - a.roas)
      .slice(0, 5);
    const sortedByRevenue = [...campaigns]
      .sort((a, b) => b.revenueCents - a.revenueCents)
      .slice(0, 5);

    const summary = {
      dateRange: {
        startDate: new Date(args.dateRange.startDate),
        endDate: new Date(args.dateRange.endDate),
      },
      totalRevenue,
      totalSpent,
      overallROAS,
      overallCTR,
      overallConversionRate,
      activeCampaigns,
      completedCampaigns,
      channelPerformance,
      topCampaignsByROAS: sortedByROAS,
      topCampaignsByRevenue: sortedByRevenue,
    };

    console.log(
      `[campaignPerformanceSummary] Summary calculated for ${campaigns.length} campaigns`
    );
    return summary;
  } catch (error) {
    console.error('[campaignPerformanceSummary] Error:', error);
    throw new Error(`Failed to calculate performance summary: ${error.message}`);
  }
}

/**
 * Create a new marketing campaign
 *
 * @example
 * mutation {
 *   createCampaign(input: {
 *     name: "Summer Sale Email"
 *     type: EMAIL
 *     startDate: "2024-06-01"
 *     endDate: "2024-06-30"
 *     budgetDollars: 500
 *   }) {
 *     success
 *     campaign {
 *       id
 *       name
 *     }
 *   }
 * }
 */
export async function createCampaign(
  _parent: any,
  args: { input: CreateCampaignInput },
  context: Context
) {
  console.log('[createCampaign] Mutation called');
  console.log('[createCampaign] Input:', args.input);

  const vendorId = context.user?.vendorId || context.user?.id || '00000000-0000-0000-0000-000000000001';

  try {
    const repository = AppDataSource.getRepository(MarketingCampaign);

    const campaign = repository.create({
      vendorId,
      name: args.input.name,
      type: args.input.type as CampaignType,
      description: args.input.description || null,
      startDate: new Date(args.input.startDate),
      endDate: new Date(args.input.endDate),
      budgetCents: Math.round(args.input.budgetDollars * 100),
      audienceSize: args.input.audienceSize || null,
      audienceDetails: args.input.audienceDetails || null,
      metadata: args.input.metadata || null,
    });

    await repository.save(campaign);

    console.log('[createCampaign] Campaign created:', campaign.id);
    return {
      success: true,
      campaign,
      errors: [],
    };
  } catch (error) {
    console.error('[createCampaign] Error:', error);
    return {
      success: false,
      campaign: null,
      errors: [
        {
          code: 'INTERNAL_ERROR',
          message: `Failed to create campaign: ${error.message}`,
        },
      ],
    };
  }
}

/**
 * Update an existing marketing campaign
 */
export async function updateCampaign(
  _parent: any,
  args: { input: UpdateCampaignInput },
  context: Context
) {
  console.log('[updateCampaign] Mutation called');
  console.log('[updateCampaign] Input:', args.input);

  const vendorId = context.user?.vendorId || context.user?.id || '00000000-0000-0000-0000-000000000001';

  try {
    const repository = AppDataSource.getRepository(MarketingCampaign);

    const campaign = await repository.findOne({
      where: {
        id: args.input.campaignId,
        vendorId: vendorId,
      },
    });

    if (!campaign) {
      return {
        success: false,
        campaign: null,
        errors: [
          {
            code: 'CAMPAIGN_NOT_FOUND',
            message: 'Campaign not found',
          },
        ],
      };
    }

    // Update fields if provided
    if (args.input.name) campaign.name = args.input.name;
    if (args.input.type) campaign.type = args.input.type as any;
    if (args.input.status) campaign.status = args.input.status as any;
    if (args.input.description !== undefined)
      campaign.description = args.input.description;
    if (args.input.startDate)
      campaign.startDate = new Date(args.input.startDate);
    if (args.input.endDate) campaign.endDate = new Date(args.input.endDate);
    if (args.input.budgetDollars)
      campaign.budgetCents = Math.round(args.input.budgetDollars * 100);
    if (args.input.audienceSize !== undefined)
      campaign.audienceSize = args.input.audienceSize;
    if (args.input.audienceDetails !== undefined)
      campaign.audienceDetails = args.input.audienceDetails;
    if (args.input.metadata !== undefined)
      campaign.metadata = args.input.metadata;

    await repository.save(campaign);

    console.log('[updateCampaign] Campaign updated:', campaign.id);
    return {
      success: true,
      campaign,
      errors: [],
    };
  } catch (error) {
    console.error('[updateCampaign] Error:', error);
    return {
      success: false,
      campaign: null,
      errors: [
        {
          code: 'INTERNAL_ERROR',
          message: `Failed to update campaign: ${error.message}`,
        },
      ],
    };
  }
}

/**
 * Update campaign performance metrics
 */
export async function updateCampaignMetrics(
  _parent: any,
  args: { input: UpdateCampaignMetricsInput },
  context: Context
) {
  console.log('[updateCampaignMetrics] Mutation called');
  console.log('[updateCampaignMetrics] Input:', args.input);

  const vendorId = context.user?.vendorId || context.user?.id || '00000000-0000-0000-0000-000000000001';

  try {
    const repository = AppDataSource.getRepository(MarketingCampaign);

    const campaign = await repository.findOne({
      where: {
        id: args.input.campaignId,
        vendorId: vendorId,
      },
    });

    if (!campaign) {
      return {
        success: false,
        campaign: null,
        errors: [
          {
            code: 'CAMPAIGN_NOT_FOUND',
            message: 'Campaign not found',
          },
        ],
      };
    }

    // Update metrics if provided
    if (args.input.impressions !== undefined)
      campaign.impressions = args.input.impressions;
    if (args.input.clicks !== undefined) campaign.clicks = args.input.clicks;
    if (args.input.conversions !== undefined)
      campaign.conversions = args.input.conversions;
    if (args.input.revenueDollars !== undefined)
      campaign.revenueCents = Math.round(args.input.revenueDollars * 100);
    if (args.input.spentDollars !== undefined)
      campaign.spentCents = Math.round(args.input.spentDollars * 100);

    // Recalculate derived metrics
    campaign.calculateMetrics();

    await repository.save(campaign);

    console.log('[updateCampaignMetrics] Metrics updated:', campaign.id);
    return {
      success: true,
      campaign,
      errors: [],
    };
  } catch (error) {
    console.error('[updateCampaignMetrics] Error:', error);
    return {
      success: false,
      campaign: null,
      errors: [
        {
          code: 'INTERNAL_ERROR',
          message: `Failed to update metrics: ${error.message}`,
        },
      ],
    };
  }
}

/**
 * Delete a marketing campaign
 */
export async function deleteCampaign(
  _parent: any,
  args: { campaignId: string },
  context: Context
) {
  console.log('[deleteCampaign] Mutation called');
  console.log('[deleteCampaign] Campaign ID:', args.campaignId);

  const vendorId = context.user?.vendorId || context.user?.id || '00000000-0000-0000-0000-000000000001';

  try {
    const repository = AppDataSource.getRepository(MarketingCampaign);

    const campaign = await repository.findOne({
      where: {
        id: args.campaignId,
        vendorId: vendorId,
      },
    });

    if (!campaign) {
      return {
        success: false,
        campaign: null,
        errors: [
          {
            code: 'CAMPAIGN_NOT_FOUND',
            message: 'Campaign not found',
          },
        ],
      };
    }

    await repository.remove(campaign);

    console.log('[deleteCampaign] Campaign deleted:', args.campaignId);
    return {
      success: true,
      campaign: null,
      errors: [],
    };
  } catch (error) {
    console.error('[deleteCampaign] Error:', error);
    return {
      success: false,
      campaign: null,
      errors: [
        {
          code: 'INTERNAL_ERROR',
          message: `Failed to delete campaign: ${error.message}`,
        },
      ],
    };
  }
}
