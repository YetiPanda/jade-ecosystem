/**
 * Product Performance Analytics
 * Week 6 Day 2: Taxonomy-driven insights with Progressive Disclosure
 */

import { useState } from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown, Package, Tag, AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

type DisclosureLevel = 'glance' | 'scan' | 'study';

interface CategoryPerformance {
  category: string;
  conversionRate: number;
  averageOrderValue: number;
  totalSales: number;
  growthRate: number;
  productCount: number;
}

interface IngredientTrend {
  ingredient: string;
  popularity: number;
  products: number;
  trend: 'rising' | 'stable' | 'declining';
  growthRate: number;
}

interface ProfessionalVsOTC {
  professional: {
    sales: number;
    products: number;
    averagePrice: number;
    conversionRate: number;
  };
  otc: {
    sales: number;
    products: number;
    averagePrice: number;
    conversionRate: number;
  };
}

interface ConcernPurchasePattern {
  concern: string;
  purchaseFrequency: number;
  averageBasketSize: number;
  topCategories: string[];
  seasonalTrend: 'high' | 'medium' | 'low';
}

// Mock data
const CATEGORY_PERFORMANCE: CategoryPerformance[] = [
  { category: 'Professional Treatments', conversionRate: 8.5, averageOrderValue: 1247, totalSales: 847200, growthRate: 34.2, productCount: 42 },
  { category: 'Serums & Actives', conversionRate: 12.3, averageOrderValue: 487, totalSales: 723400, growthRate: 28.5, productCount: 87 },
  { category: 'Cleansers', conversionRate: 15.7, averageOrderValue: 234, totalSales: 456300, growthRate: 18.3, productCount: 52 },
  { category: 'Moisturizers', conversionRate: 14.2, averageOrderValue: 298, totalSales: 398700, growthRate: 15.9, productCount: 64 },
  { category: 'Masks & Peels', conversionRate: 9.8, averageOrderValue: 356, totalSales: 267100, growthRate: 12.4, productCount: 38 },
];

const INGREDIENT_TRENDS: IngredientTrend[] = [
  { ingredient: 'Niacinamide', popularity: 94, products: 47, trend: 'rising', growthRate: 45.2 },
  { ingredient: 'Hyaluronic Acid', popularity: 89, products: 52, trend: 'stable', growthRate: 12.3 },
  { ingredient: 'Vitamin C', popularity: 87, products: 38, trend: 'rising', growthRate: 28.7 },
  { ingredient: 'Retinol', popularity: 82, products: 29, trend: 'stable', growthRate: 8.9 },
  { ingredient: 'Peptides', popularity: 76, products: 34, trend: 'rising', growthRate: 52.1 },
  { ingredient: 'AHA/BHA', popularity: 71, products: 41, trend: 'stable', growthRate: 15.4 },
];

const PROFESSIONAL_VS_OTC: ProfessionalVsOTC = {
  professional: {
    sales: 1247800,
    products: 89,
    averagePrice: 187.50,
    conversionRate: 7.8,
  },
  otc: {
    sales: 1599850,
    products: 158,
    averagePrice: 42.30,
    conversionRate: 14.5,
  },
};

const CONCERN_PATTERNS: ConcernPurchasePattern[] = [
  { concern: 'Acne', purchaseFrequency: 3.2, averageBasketSize: 287, topCategories: ['Cleansers', 'Serums', 'Treatments'], seasonalTrend: 'high' },
  { concern: 'Aging', purchaseFrequency: 2.8, averageBasketSize: 412, topCategories: ['Serums', 'Moisturizers', 'Eye Care'], seasonalTrend: 'medium' },
  { concern: 'Hyperpigmentation', purchaseFrequency: 2.5, averageBasketSize: 356, topCategories: ['Serums', 'Peels', 'Brightening'], seasonalTrend: 'low' },
  { concern: 'Sensitivity', purchaseFrequency: 2.9, averageBasketSize: 298, topCategories: ['Gentle Cleansers', 'Calming Serums', 'Barrier Repair'], seasonalTrend: 'medium' },
];

export function ProductPerformanceAnalytics() {
  const [disclosureLevel, setDisclosureLevel] = useState<DisclosureLevel>('glance');

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
          <h2 className="text-2xl font-bold text-gray-900">Product Performance</h2>
          <p className="text-gray-600 mt-1">Taxonomy-driven product insights</p>
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

      {/* Glance Level - Category Performance Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Conversion Rates</h3>
        <div className="space-y-3">
          {CATEGORY_PERFORMANCE.map((category) => (
            <div key={category.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{category.category}</span>
                  <span className="text-xs text-gray-500">({category.productCount} products)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-900">
                    {category.conversionRate}%
                  </span>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      category.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {formatPercent(category.growthRate)}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${category.conversionRate * 5}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Scan Level - Ingredient Trends & Professional vs OTC */}
      {(disclosureLevel === 'scan' || disclosureLevel === 'study') && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ingredient Popularity Trends */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ingredient Popularity Trends
              </h3>
              <div className="space-y-4">
                {INGREDIENT_TRENDS.map((ingredient) => (
                  <div key={ingredient.ingredient} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {ingredient.ingredient}
                        </span>
                        <div className="flex items-center gap-2">
                          {ingredient.trend === 'rising' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : ingredient.trend === 'declining' ? (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          ) : (
                            <div className="w-4 h-4" />
                          )}
                          <span className="text-xs text-gray-500">{ingredient.products} products</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={cn(
                            'h-1.5 rounded-full',
                            ingredient.trend === 'rising' ? 'bg-green-500' :
                            ingredient.trend === 'declining' ? 'bg-red-500' :
                            'bg-blue-500'
                          )}
                          style={{ width: `${ingredient.popularity}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Professional vs OTC Split */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Professional vs OTC Sales Split
              </h3>
              <div className="space-y-6">
                {/* Professional */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Professional Products</span>
                    <span className="text-lg font-bold text-purple-600">
                      {formatCurrency(PROFESSIONAL_VS_OTC.professional.sales)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                    <div>
                      <div className="text-gray-500">Products</div>
                      <div className="font-semibold text-gray-900">
                        {PROFESSIONAL_VS_OTC.professional.products}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Avg Price</div>
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(PROFESSIONAL_VS_OTC.professional.averagePrice)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Conv. Rate</div>
                      <div className="font-semibold text-gray-900">
                        {PROFESSIONAL_VS_OTC.professional.conversionRate}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* OTC */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">OTC Products</span>
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(PROFESSIONAL_VS_OTC.otc.sales)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                    <div>
                      <div className="text-gray-500">Products</div>
                      <div className="font-semibold text-gray-900">
                        {PROFESSIONAL_VS_OTC.otc.products}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Avg Price</div>
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(PROFESSIONAL_VS_OTC.otc.averagePrice)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">Conv. Rate</div>
                      <div className="font-semibold text-gray-900">
                        {PROFESSIONAL_VS_OTC.otc.conversionRate}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparison */}
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>
                      OTC products convert {((PROFESSIONAL_VS_OTC.otc.conversionRate / PROFESSIONAL_VS_OTC.professional.conversionRate) * 100 - 100).toFixed(0)}% better,
                      but Professional products have {((PROFESSIONAL_VS_OTC.professional.averagePrice / PROFESSIONAL_VS_OTC.otc.averagePrice) * 100 - 100).toFixed(0)}% higher AOV
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Category Performance Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Category Performance Details
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Total Sales
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      AOV
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Conv. Rate
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Growth
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {CATEGORY_PERFORMANCE.map((category) => (
                    <tr key={category.category} className="border-b last:border-0">
                      <td className="py-3 px-4 text-sm text-gray-900">{category.category}</td>
                      <td className="py-3 px-4 text-sm text-right font-medium text-gray-900">
                        {formatCurrency(category.totalSales)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-700">
                        {formatCurrency(category.averageOrderValue)}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-900">
                        {category.conversionRate}%
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        <span
                          className={cn(
                            'font-semibold',
                            category.growthRate >= 20 ? 'text-green-600' :
                            category.growthRate >= 10 ? 'text-yellow-600' :
                            'text-gray-600'
                          )}
                        >
                          {formatPercent(category.growthRate)}
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

      {/* Study Level - Concern-Based Purchase Patterns */}
      {disclosureLevel === 'study' && (
        <>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Concern-Based Purchase Patterns
            </h3>
            <div className="space-y-4">
              {CONCERN_PATTERNS.map((pattern) => (
                <div key={pattern.concern} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{pattern.concern}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Seasonal trend: <span className={cn(
                          'font-medium',
                          pattern.seasonalTrend === 'high' ? 'text-green-600' :
                          pattern.seasonalTrend === 'low' ? 'text-blue-600' :
                          'text-gray-600'
                        )}>{pattern.seasonalTrend}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Avg Basket</div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrency(pattern.averageBasketSize)}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Purchase Frequency</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {pattern.purchaseFrequency}x per month
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Top Categories</div>
                      <div className="flex flex-wrap gap-1">
                        {pattern.topCategories.map((cat) => (
                          <span
                            key={cat}
                            className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Key Insights */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  1
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Professional Treatments</strong> have the highest growth rate (34.2%) but
                  lowest conversion rate (8.5%). Consider improving product education and consultation
                  support.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  2
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Niacinamide and Peptides</strong> are trending ingredients with 45.2% and
                  52.1% growth respectively. Consider expanding product lines featuring these actives.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  3
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Acne-focused customers</strong> purchase 3.2x per month with high seasonal
                  demand. Optimize inventory and marketing campaigns accordingly.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  4
                </div>
                <p className="text-sm text-gray-700">
                  OTC products drive higher volume (158 vs 89 products) and better conversion rates
                  (14.5% vs 7.8%), while Professional products command 4.4x higher average prices.
                </p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
