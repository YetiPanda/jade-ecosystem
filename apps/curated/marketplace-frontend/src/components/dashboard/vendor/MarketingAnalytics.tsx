import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Progress } from '../../ui/progress';
import {
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Mail,
  MousePointer,
  Eye,
  ShoppingCart,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  Download,
  Loader2
} from 'lucide-react';
import { useAnalyticsForDashboard, useAnalyticsSummary } from '../../../hooks/dashboard';
import { useDashboard } from '../../../contexts/DashboardContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useVendorCampaignsQuery, useCampaignPerformanceSummaryQuery } from '../../../graphql/generated';

export function MarketingAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  const { filters } = useDashboard();
  const { salesData, categoryPerformance, topProducts: apiTopProducts, customerMetrics } = useAnalyticsForDashboard(filters.dateRange);
  const { summary } = useAnalyticsSummary(filters.dateRange);

  // Fetch real marketing campaigns using generated hooks
  const { data: campaignsData, loading: campaignsLoading } = useVendorCampaignsQuery({
    variables: { limit: 20 }
  });

  // Fetch campaign performance summary using generated hooks
  const { data: summaryData, loading: summaryLoading } = useCampaignPerformanceSummaryQuery({
    variables: {
      dateRange: {
        startDate: filters.dateRange.startDate,
        endDate: filters.dateRange.endDate
      }
    }
  });

  // Transform API data to component format
  const topProducts = apiTopProducts.map(product => ({
    name: product.name,
    revenue: product.revenue,
    conversions: product.unitsSold,
    avgOrderValue: product.unitsSold > 0 ? Math.round(product.revenue / product.unitsSold) : 0,
    growth: `+${product.growth.toFixed(1)}%`
  }));

  // Chart colors using Jade brand palette
  const COLORS = ['#2E8B57', '#9CAF88', '#8B9A6B', '#B5A642', '#C65D4A'];

  // Transform GraphQL campaigns to component format
  const campaigns = useMemo(() => {
    if (!campaignsData?.vendorCampaigns) return [];

    return campaignsData.vendorCampaigns.map(campaign => ({
      id: campaign.id,
      name: campaign.name,
      type: campaign.type.toLowerCase(),
      status: campaign.status.toLowerCase(),
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      budget: campaign.budgetDollars,
      spent: campaign.spentDollars,
      impressions: campaign.impressions,
      clicks: campaign.clicks,
      conversions: campaign.conversions,
      revenue: campaign.revenueDollars,
      ctr: campaign.ctr,
      cpc: campaign.cpcDollars,
      roas: campaign.roas,
      audienceSize: campaign.audienceSize
    }));
  }, [campaignsData]);

  // Use summary data if available, otherwise calculate from campaigns
  const overallMetrics = useMemo(() => {
    if (summaryData?.campaignPerformanceSummary) {
      const summary = summaryData.campaignPerformanceSummary;
      return {
        totalRevenue: summary.totalRevenue,
        totalSpent: summary.totalSpent,
        totalConversions: campaigns.reduce((sum, c) => sum + c.conversions, 0),
        totalImpressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
        totalClicks: campaigns.reduce((sum, c) => sum + c.clicks, 0)
      };
    }

    return {
      totalRevenue: campaigns.reduce((sum, c) => sum + c.revenue, 0),
      totalSpent: campaigns.reduce((sum, c) => sum + c.spent, 0),
      totalConversions: campaigns.reduce((sum, c) => sum + c.conversions, 0),
      totalImpressions: campaigns.reduce((sum, c) => sum + c.impressions, 0),
      totalClicks: campaigns.reduce((sum, c) => sum + c.clicks, 0)
    };
  }, [summaryData, campaigns]);

  const avgROAS = summaryData?.campaignPerformanceSummary?.overallROAS ||
    (overallMetrics.totalSpent > 0 ? overallMetrics.totalRevenue / overallMetrics.totalSpent : 0);
  const avgCTR = summaryData?.campaignPerformanceSummary?.overallCTR ||
    (overallMetrics.totalImpressions > 0 ? (overallMetrics.totalClicks / overallMetrics.totalImpressions) * 100 : 0);
  const conversionRate = summaryData?.campaignPerformanceSummary?.overallConversionRate ||
    (overallMetrics.totalClicks > 0 ? (overallMetrics.totalConversions / overallMetrics.totalClicks) * 100 : 0);

  // Transform channel performance from summary data
  const channelPerformance = useMemo(() => {
    if (summaryData?.campaignPerformanceSummary?.channelPerformance) {
      const colors = ['#30B7D2', '#114538', '#958673', '#2b251c', '#9CAF88', '#8B9A6B'];
      return summaryData.campaignPerformanceSummary.channelPerformance.map((channel, index) => ({
        channel: channel.channel.replace('_', ' ').split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' '),
        campaigns: channel.campaigns,
        revenue: channel.revenue,
        spent: channel.spent,
        roas: channel.roas,
        share: overallMetrics.totalRevenue > 0 ? (channel.revenue / overallMetrics.totalRevenue) * 100 : 0,
        color: colors[index % colors.length]
      }));
    }
    return [];
  }, [summaryData, overallMetrics]);

  const loading = campaignsLoading || summaryLoading;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-[#114538] bg-[#aaaa8a]';
      case 'completed': return 'text-[#958673] bg-[#ded7c9]';
      case 'paused': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'social': return Users;
      case 'content': return BarChart3;
      case 'paid_search': return Target;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light mb-2">Marketing Analytics</h1>
          <p className="text-muted-foreground font-light">
            Track campaign performance and marketing ROI
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32 rounded-full border-subtle">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-full">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="rounded-full px-6" style={{backgroundColor: '#30B7D2', color: '#ffffff'}}>
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4" style={{color: '#30B7D2'}} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light">${overallMetrics.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center space-x-2 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-sm text-green-600">+23.5%</span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                ROAS
              </CardTitle>
              <TrendingUp className="h-4 w-4" style={{color: '#114538'}} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light">{avgROAS.toFixed(2)}x</div>
            <div className="flex items-center space-x-2 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-sm text-green-600">+0.8x</span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Conversion Rate
              </CardTitle>
              <Target className="h-4 w-4" style={{color: '#958673'}} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light">{conversionRate.toFixed(1)}%</div>
            <div className="flex items-center space-x-2 mt-1">
              <ArrowUpRight className="h-3 w-3 text-green-600" />
              <span className="text-sm text-green-600">+1.2%</span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Click-Through Rate
              </CardTitle>
              <MousePointer className="h-4 w-4" style={{color: '#2b251c'}} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light">{avgCTR.toFixed(1)}%</div>
            <div className="flex items-center space-x-2 mt-1">
              <ArrowDownRight className="h-3 w-3 text-red-600" />
              <span className="text-sm text-red-600">-0.3%</span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign Performance */}
        <div className="lg:col-span-2">
          <Card className="border-subtle shadow-warm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-normal">Campaign Performance</CardTitle>
                  <CardDescription className="font-light">
                    Detailed metrics for all active and recent campaigns
                  </CardDescription>
                </div>
                <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                  <SelectTrigger className="w-40 rounded-full border-subtle">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Campaigns</SelectItem>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id.toString()}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => {
                  const IconComponent = getCampaignTypeIcon(campaign.type);
                  const budgetUsed = (campaign.spent / campaign.budget) * 100;
                  
                  return (
                    <div key={campaign.id} className="p-4 rounded-lg border border-subtle hover:bg-accent/30 transition-colors">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#ded7c9'}}>
                              <IconComponent className="h-5 w-5" style={{color: '#2b251c'}} />
                            </div>
                            <div>
                              <h3 className="font-medium">{campaign.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {campaign.startDate} - {campaign.endDate}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Revenue</span>
                            <div className="font-medium">${campaign.revenue.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">ROAS</span>
                            <div className="font-medium text-green-600">{campaign.roas}x</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Conversions</span>
                            <div className="font-medium">{campaign.conversions}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">CTR</span>
                            <div className="font-medium">{campaign.ctr}%</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">CPC</span>
                            <div className="font-medium">${campaign.cpc}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Budget Used</span>
                            <span>${campaign.spent.toLocaleString()} / ${campaign.budget.toLocaleString()}</span>
                          </div>
                          <Progress value={budgetUsed} className="h-2" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            Audience: {campaign.audienceSize?.toLocaleString() || 'N/A'} contacts
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="rounded-full px-4">
                              <Eye className="h-3 w-3 mr-1" />
                              Details
                            </Button>
                            <Button size="sm" variant="outline" className="rounded-full px-4">
                              <BarChart3 className="h-3 w-3 mr-1" />
                              Report
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Channel Performance & Top Products */}
        <div className="space-y-8">
          {/* Channel Performance */}
          <Card className="border-subtle shadow-warm">
            <CardHeader>
              <CardTitle className="font-normal">Channel Performance</CardTitle>
              <CardDescription className="font-light">
                Revenue by marketing channel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channelPerformance.map((channel, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{channel.channel}</span>
                      <span>${channel.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>ROAS: {channel.roas}x</span>
                      <span>{channel.share}% of total</span>
                    </div>
                    <Progress 
                      value={channel.share} 
                      className="h-2"
                      style={{
                        backgroundColor: `${channel.color}20`
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Products */}
          <Card className="border-subtle shadow-warm">
            <CardHeader>
              <CardTitle className="font-normal">Top Products</CardTitle>
              <CardDescription className="font-light">
                Best performing products by revenue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="p-3 rounded-lg border border-subtle">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{product.name}</h4>
                        <Badge variant="secondary" className="text-xs" style={{color: '#114538', backgroundColor: '#aaaa8a'}}>
                          {product.growth}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Revenue</span>
                          <div className="font-medium">${product.revenue.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Orders</span>
                          <div className="font-medium">{product.conversions}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">AOV</span>
                          <div className="font-medium">${product.avgOrderValue}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}