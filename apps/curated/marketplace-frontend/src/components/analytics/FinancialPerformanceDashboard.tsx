/**
 * Financial Performance Dashboard
 * Week 6 Day 1: Analytics with Progressive Disclosure (Glance → Scan → Study)
 */

import { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, Percent, Package } from 'lucide-react';
import { cn } from '../../lib/utils';

type DisclosureLevel = 'glance' | 'scan' | 'study';

interface FinancialMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  grossProfitMargin: number;
  netIncomeMargin: number;
  topProducts: Array<{
    id: string;
    name: string;
    revenue: number;
    growth: number;
  }>;
  // Scan level
  aovByAccountType: {
    professional: number;
    retail: number;
  };
  cogsBreakdown: {
    materials: number;
    labor: number;
    overhead: number;
  };
  cacVsClv: {
    cac: number;
    clv: number;
    ratio: number;
  };
  accountsReceivable: {
    current: number;
    aging30: number;
    aging60: number;
    aging90plus: number;
  };
  // Study level
  revenueByCategory: Array<{
    category: string;
    revenue: number;
    growth: number;
  }>;
  productLineROI: Array<{
    productLine: string;
    roi: number;
    investment: number;
    return: number;
  }>;
}

// Mock data for demonstration
const MOCK_METRICS: FinancialMetrics = {
  totalRevenue: 2847650,
  revenueGrowth: 23.5,
  grossProfitMargin: 42.3,
  netIncomeMargin: 18.7,
  topProducts: [
    { id: '1', name: 'Advanced Retinol Serum', revenue: 342500, growth: 45.2 },
    { id: '2', name: 'Vitamin C Brightening Complex', revenue: 298750, growth: 32.1 },
    { id: '3', name: 'Hyaluronic Acid Hydrator', revenue: 256800, growth: 28.9 },
    { id: '4', name: 'Chemical Peel Treatment', revenue: 234100, growth: 19.3 },
    { id: '5', name: 'Peptide Repair Cream', revenue: 198650, growth: 15.7 },
  ],
  aovByAccountType: {
    professional: 1247,
    retail: 342,
  },
  cogsBreakdown: {
    materials: 42.5,
    labor: 28.3,
    overhead: 29.2,
  },
  cacVsClv: {
    cac: 145,
    clv: 1876,
    ratio: 12.9,
  },
  accountsReceivable: {
    current: 342500,
    aging30: 87650,
    aging60: 23400,
    aging90plus: 12300,
  },
  revenueByCategory: [
    { category: 'Professional Treatments', revenue: 847200, growth: 34.2 },
    { category: 'Serums & Actives', revenue: 723400, growth: 28.5 },
    { category: 'Cleansers', revenue: 456300, growth: 18.3 },
    { category: 'Moisturizers', revenue: 398700, growth: 15.9 },
    { category: 'Masks & Peels', revenue: 267100, growth: 12.4 },
  ],
  productLineROI: [
    { productLine: 'Anti-Aging', roi: 287, investment: 125000, return: 358750 },
    { productLine: 'Acne Treatment', roi: 245, investment: 98000, return: 240100 },
    { productLine: 'Brightening', roi: 198, investment: 87000, return: 172260 },
    { productLine: 'Hydration', roi: 165, investment: 76000, return: 125400 },
  ],
};

export function FinancialPerformanceDashboard() {
  const [disclosureLevel, setDisclosureLevel] = useState<DisclosureLevel>('glance');
  const metrics = MOCK_METRICS;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header with Progressive Disclosure Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Performance</h2>
          <p className="text-gray-600 mt-1">Revenue and profitability metrics</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">View Level:</span>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setDisclosureLevel('glance')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                disclosureLevel === 'glance'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Glance
            </button>
            <button
              onClick={() => setDisclosureLevel('scan')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                disclosureLevel === 'scan'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Scan
            </button>
            <button
              onClick={() => setDisclosureLevel('study')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                disclosureLevel === 'study'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              Study
            </button>
          </div>
        </div>
      </div>

      {/* Glance Level - Executive Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          change={metrics.revenueGrowth}
          icon={DollarSign}
          trend={metrics.revenueGrowth > 0 ? 'up' : 'down'}
        />
        <KPICard
          title="Gross Profit Margin"
          value={`${metrics.grossProfitMargin}%`}
          change={5.2}
          icon={Percent}
          trend="up"
        />
        <KPICard
          title="Net Income Margin"
          value={`${metrics.netIncomeMargin}%`}
          change={3.1}
          icon={TrendingUp}
          trend="up"
        />
        <KPICard
          title="Active Products"
          value="247"
          change={12.3}
          icon={Package}
          trend="up"
        />
      </div>

      {/* Top Products - Glance Level */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Performing Products</h3>
        <div className="space-y-3">
          {metrics.topProducts.map((product, index) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-500 w-6">#{index + 1}</span>
                <span className="font-medium text-gray-900">{product.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-900">
                  {formatCurrency(product.revenue)}
                </span>
                <span
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    product.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {product.growth >= 0 ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {formatPercent(product.growth)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Scan Level - Detailed Metrics */}
      {(disclosureLevel === 'scan' || disclosureLevel === 'study') && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AOV by Account Type */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Average Order Value by Account Type
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Professional Accounts</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(metrics.aovByAccountType.professional)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Retail Accounts</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(metrics.aovByAccountType.retail)}
                  </span>
                </div>
                <div className="pt-3 border-t">
                  <span className="text-sm text-gray-500">
                    Professional AOV is {((metrics.aovByAccountType.professional / metrics.aovByAccountType.retail) * 100 - 100).toFixed(0)}% higher
                  </span>
                </div>
              </div>
            </Card>

            {/* CAC vs CLV */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">CAC vs CLV Analysis</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Customer Acquisition Cost</span>
                  <span className="text-xl font-semibold text-red-600">
                    {formatCurrency(metrics.cacVsClv.cac)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Customer Lifetime Value</span>
                  <span className="text-xl font-semibold text-green-600">
                    {formatCurrency(metrics.cacVsClv.clv)}
                  </span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">CLV:CAC Ratio</span>
                    <span className="text-2xl font-bold text-green-600">
                      {metrics.cacVsClv.ratio.toFixed(1)}:1
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Healthy ratio (target: {'>'} 3:1)
                  </p>
                </div>
              </div>
            </Card>

            {/* COGS Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">COGS Breakdown</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Materials</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {metrics.cogsBreakdown.materials}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${metrics.cogsBreakdown.materials}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Labor</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {metrics.cogsBreakdown.labor}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${metrics.cogsBreakdown.labor}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Overhead</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {metrics.cogsBreakdown.overhead}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${metrics.cogsBreakdown.overhead}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Accounts Receivable Aging */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Accounts Receivable Aging
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm text-gray-700">Current</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(metrics.accountsReceivable.current)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <span className="text-sm text-gray-700">30 Days</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(metrics.accountsReceivable.aging30)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                  <span className="text-sm text-gray-700">60 Days</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(metrics.accountsReceivable.aging60)}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <span className="text-sm text-gray-700">90+ Days</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(metrics.accountsReceivable.aging90plus)}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Study Level - Deep Dive Analytics */}
      {disclosureLevel === 'study' && (
        <>
          {/* Revenue by Category */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Revenue by Taxonomy Category
            </h3>
            <div className="space-y-3">
              {metrics.revenueByCategory.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {category.category}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(category.revenue)}
                      </span>
                      <span
                        className={cn(
                          'text-xs font-medium',
                          category.growth >= 0 ? 'text-green-600' : 'text-red-600'
                        )}
                      >
                        {formatPercent(category.growth)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{
                        width: `${(category.revenue / metrics.revenueByCategory[0].revenue) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Product Line ROI */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Line ROI Analysis</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Product Line
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Investment
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Return
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      ROI
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.productLineROI.map((line) => (
                    <tr key={line.productLine} className="border-b last:border-0">
                      <td className="py-3 px-4 text-sm text-gray-900">{line.productLine}</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-700">
                        {formatCurrency(line.investment)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-900 font-medium">
                        {formatCurrency(line.return)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        <span
                          className={cn(
                            'font-semibold',
                            line.roi >= 200 ? 'text-green-600' : 'text-yellow-600'
                          )}
                        >
                          {line.roi}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  trend: 'up' | 'down';
}

function KPICard({ title, value, change, icon: Icon, trend }: KPICardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div
          className={cn(
            'flex items-center gap-1 text-sm font-medium',
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          )}
        >
          {trend === 'up' ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          <span>{Math.abs(change).toFixed(1)}% vs last period</span>
        </div>
      </div>
    </Card>
  );
}
