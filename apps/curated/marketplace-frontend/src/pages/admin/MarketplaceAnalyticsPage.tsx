/**
 * Marketplace Analytics Page
 * Week 9: Advanced Analytics - Admin-level marketplace insights
 */

import { useState } from 'react';
import { Card } from '@jade/ui/components';
import { Button } from '@jade/ui/components';
import {
  RevenueChart,
  CategoryDistributionChart,
  PerformanceBarChart,
} from '../../components/analytics/charts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Download,
  Calendar,
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  trend?: 'up' | 'down';
}

function MetricCard({ title, value, change, icon: Icon, trend = 'up' }: MetricCardProps) {
  const isPositive = change > 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            <TrendIcon
              className={`h-4 w-4 ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            />
            <span
              className={`text-sm font-medium ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {Math.abs(change)}%
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </Card>
  );
}

export function MarketplaceAnalyticsPage() {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Mock data - in production, this would come from GraphQL queries
  const revenueData = [
    { date: 'Jan', revenue: 125000, previousPeriod: 98000 },
    { date: 'Feb', revenue: 142000, previousPeriod: 105000 },
    { date: 'Mar', revenue: 158000, previousPeriod: 112000 },
    { date: 'Apr', revenue: 176000, previousPeriod: 125000 },
    { date: 'May', revenue: 198000, previousPeriod: 145000 },
    { date: 'Jun', revenue: 224000, previousPeriod: 162000 },
  ];

  const categoryData = [
    { name: 'Serums & Actives', value: 723400 },
    { name: 'Professional Treatments', value: 847200 },
    { name: 'Cleansers', value: 456300 },
    { name: 'Moisturizers', value: 398700 },
    { name: 'Masks & Peels', value: 267100 },
  ];

  const topVendorsData = [
    { name: 'Circadia', value: 342500, target: 400000 },
    { name: 'Dermalogica', value: 298750, target: 350000 },
    { name: 'SkinCeuticals', value: 256800, target: 300000 },
    { name: 'Obagi', value: 234100, target: 250000 },
    { name: 'PCA Skin', value: 198650, target: 200000 },
  ];

  const topProductsData = [
    { name: 'Advanced Retinol Serum', value: 45200, comparison: 38500 },
    { name: 'Vitamin C Complex', value: 39800, comparison: 35200 },
    { name: 'Hyaluronic Hydrator', value: 34500, comparison: 31800 },
    { name: 'Chemical Peel Treatment', value: 29700, comparison: 28400 },
    { name: 'Peptide Repair Cream', value: 25300, comparison: 23100 },
  ];

  const handleExportReport = () => {
    // In production, this would generate a CSV or PDF report
    console.log('Exporting analytics report...');
    alert('Report export functionality coming soon!');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Marketplace Analytics
              </h1>
              <p className="mt-2 text-gray-600">
                Comprehensive insights into marketplace performance and trends
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Date Range Selector */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                {(['7d', '30d', '90d', '1y'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      dateRange === range
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {range === '7d' && 'Last 7 days'}
                    {range === '30d' && 'Last 30 days'}
                    {range === '90d' && 'Last 90 days'}
                    {range === '1y' && 'Last year'}
                  </button>
                ))}
              </div>

              {/* Export Button */}
              <Button onClick={handleExportReport} className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(2847650)}
            change={23.5}
            icon={DollarSign}
          />
          <MetricCard
            title="Total Orders"
            value="1,234"
            change={18.2}
            icon={ShoppingCart}
          />
          <MetricCard
            title="Active Vendors"
            value="89"
            change={12.5}
            icon={Users}
          />
          <MetricCard
            title="Total Products"
            value="427"
            change={8.9}
            icon={Package}
          />
        </div>

        {/* Revenue Trend */}
        <div className="mb-8">
          <RevenueChart
            data={revenueData}
            title="Revenue Trend"
            subtitle="Monthly revenue compared to previous period"
            showComparison
            type="area"
            height={350}
          />
        </div>

        {/* Category Distribution & Top Vendors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CategoryDistributionChart
            data={categoryData}
            title="Revenue by Category"
            subtitle="Product category performance breakdown"
            type="donut"
            height={350}
          />

          <PerformanceBarChart
            data={topVendorsData}
            title="Top Vendors by Revenue"
            subtitle="Vendor performance vs targets"
            showTarget
            height={350}
            valueFormatter={formatCurrency}
          />
        </div>

        {/* Top Products */}
        <div className="mb-8">
          <PerformanceBarChart
            data={topProductsData}
            title="Top Performing Products"
            subtitle="Best-selling products by revenue"
            showComparison
            layout="vertical"
            height={350}
            valueFormatter={formatCurrency}
          />
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Average Order Value */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Average Order Value</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Professional</span>
                  <span className="text-sm font-medium">$1,247</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: '78%' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Retail</span>
                  <span className="text-sm font-medium">$342</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: '22%' }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Conversion Rate */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Conversion Rate</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                12.3%
              </div>
              <div className="flex items-center justify-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">+2.4% vs last month</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">1,234</span> orders from{' '}
                  <span className="font-medium">10,032</span> visitors
                </div>
              </div>
            </div>
          </Card>

          {/* Customer Retention */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Customer Retention</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                68.5%
              </div>
              <div className="flex items-center justify-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">+5.2% vs last month</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">846</span> repeat customers out
                  of <span className="font-medium">1,234</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default MarketplaceAnalyticsPage;
