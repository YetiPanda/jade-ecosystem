/**
 * ProductPerformance Panel
 *
 * Displays product metrics, top performers, and category analysis
 */

import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { MetricCard } from './MetricCard';
import { Package, TrendingUp, TrendingDown, AlertTriangle, Layers } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { cn } from '../../lib/utils';

interface ProductData {
  totalCatalog: number;
  activeProducts: number;
  outOfStock: number;
  lowStock: number;
  topPerformers: Array<{
    productId: string;
    productName: string;
    revenue: number;
    unitsSold: number;
    growthRate: number;
  }>;
  underPerformers: Array<{
    productId: string;
    productName: string;
    revenue: number;
    unitsSold: number;
    daysWithoutSale: number;
  }>;
  categoryPerformance: Array<{
    category: string;
    revenue: number;
    unitsSold: number;
    productCount: number;
  }>;
  crossSellOpportunities: Array<{
    productPair: [string, string];
    cooccurrenceRate: number;
    potentialRevenue: number;
  }>;
}

interface ProductPerformanceProps {
  data?: ProductData;
  loading?: boolean;
}

const CATEGORY_COLORS = [
  '#2E8B57', // Jade green
  '#3CB371', // Medium sea green
  '#66BB6A', // Light green
  '#81C784', // Lighter green
  '#A5D6A7', // Very light green
  '#C8E6C9', // Pale green
];

export function ProductPerformance({ data, loading }: ProductPerformanceProps) {
  if (loading) {
    return <ProductPerformanceSkeleton />;
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No product data available
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Catalog"
          value={data.totalCatalog}
          icon={Package}
          formatType="compact"
        />
        <MetricCard
          title="Active Products"
          value={data.activeProducts ?? 0}
          icon={Layers}
          formatType="compact"
          subtitle={`${(((data.activeProducts ?? 0) / (data.totalCatalog || 1)) * 100).toFixed(0)}% of catalog`}
        />
        <MetricCard
          title="Out of Stock"
          value={data.outOfStock}
          icon={AlertTriangle}
          formatType="compact"
          invertTrendColors
          className={data.outOfStock > 0 ? 'border-red-200 bg-red-50' : ''}
        />
        <MetricCard
          title="Low Stock Alert"
          value={data.lowStock}
          icon={AlertTriangle}
          formatType="compact"
          invertTrendColors
          className={data.lowStock > 5 ? 'border-yellow-200 bg-yellow-50' : ''}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        {data.topPerformers && data.topPerformers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.topPerformers.slice(0, 5).map((product, index) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {product.productName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(product.unitsSold ?? 0).toLocaleString()} units sold
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ${(product.revenue ?? 0).toLocaleString()}
                      </p>
                      <p className={cn(
                        'text-xs font-medium',
                        (product.growthRate ?? 0) > 0 ? 'text-green-600' : 'text-red-600'
                      )}>
                        {(product.growthRate ?? 0) > 0 ? '+' : ''}{(product.growthRate ?? 0).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Under Performers */}
        {data.underPerformers && data.underPerformers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Under Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.underPerformers.slice(0, 5).map((product) => (
                  <div
                    key={product.productId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {product.productName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(product.unitsSold ?? 0).toLocaleString()} units sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ${(product.revenue ?? 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-red-600">
                        {product.daysWithoutSale ?? 0} days without sale
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {data.underPerformers.length > 0 && (
                <p className="mt-4 text-xs text-gray-500 text-center">
                  Consider promotional campaigns or inventory optimization
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Category Performance */}
      {data.categoryPerformance && data.categoryPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.categoryPerformance}
                    layout="vertical"
                    margin={{ left: 100 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="category"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      width={95}
                    />
                    <Tooltip
                      formatter={(value: number) => [`$${(value ?? 0).toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                      {data.categoryPerformance.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="text-left py-2">Category</th>
                      <th className="text-right py-2">Products</th>
                      <th className="text-right py-2">Units</th>
                      <th className="text-right py-2">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.categoryPerformance.map((category, index) => (
                      <tr key={category.category} className="border-t">
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
                            />
                            {category.category}
                          </div>
                        </td>
                        <td className="py-2 text-right">{category.productCount ?? 0}</td>
                        <td className="py-2 text-right">{(category.unitsSold ?? 0).toLocaleString()}</td>
                        <td className="py-2 text-right font-medium">
                          ${(category.revenue ?? 0).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cross-Sell Opportunities */}
      {data.crossSellOpportunities && data.crossSellOpportunities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cross-Sell Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.crossSellOpportunities.slice(0, 6).map((opportunity, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🔗</span>
                    <span className="text-sm font-medium text-gray-900">
                      Frequently Bought Together
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                    {opportunity.productPair[0]} + {opportunity.productPair[1]}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {((opportunity.cooccurrenceRate ?? 0) * 100).toFixed(0)}% co-purchase rate
                    </span>
                    <span className="text-sm font-semibold text-green-700">
                      +${(opportunity.potentialRevenue ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ProductPerformanceSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="h-64 bg-gray-100 rounded" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="h-64 bg-gray-100 rounded" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProductPerformance;
