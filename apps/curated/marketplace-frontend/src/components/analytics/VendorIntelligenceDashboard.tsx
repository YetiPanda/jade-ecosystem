/**
 * Vendor Intelligence Dashboard
 * Week 6 Day 3-4: Vendor metrics and operational efficiency
 */

import { useState } from 'react';
import { Card } from '../ui/Card';
import { Users, RefreshCw, Star, TrendingUp, TrendingDown, Package, Truck, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

type DisclosureLevel = 'glance' | 'scan' | 'study';

interface VendorMetrics {
  accountRetentionRate: number;
  churnRate: number;
  averageOrderFrequency: number;
  partnerSatisfactionScore: number;
  taxonomyAccuracyScore: number;
  activeAccounts: number;
  newAccountsThisMonth: number;
  churnedAccountsThisMonth: number;
}

interface OperationalEfficiency {
  inventoryTurnover: {
    overall: number;
    byCategory: Array<{
      category: string;
      turnoverRate: number;
      daysInInventory: number;
    }>;
  };
  orderFillRate: number;
  onTimeDeliveryRate: number;
  backorderRate: number;
  averageProcessingTime: number;
}

interface AccountEngagement {
  account: string;
  lastOrderDate: string;
  orderFrequency: number;
  totalOrders: number;
  lifetimeValue: number;
  engagementScore: number;
  status: 'active' | 'at-risk' | 'churned';
}

// Mock data
const VENDOR_METRICS: VendorMetrics = {
  accountRetentionRate: 87.5,
  churnRate: 12.5,
  averageOrderFrequency: 2.3,
  partnerSatisfactionScore: 4.2,
  taxonomyAccuracyScore: 92,
  activeAccounts: 247,
  newAccountsThisMonth: 18,
  churnedAccountsThisMonth: 6,
};

const OPERATIONAL_EFFICIENCY: OperationalEfficiency = {
  inventoryTurnover: {
    overall: 8.4,
    byCategory: [
      { category: 'Professional Treatments', turnoverRate: 12.3, daysInInventory: 29 },
      { category: 'Serums & Actives', turnoverRate: 9.7, daysInInventory: 38 },
      { category: 'Cleansers', turnoverRate: 7.2, daysInInventory: 51 },
      { category: 'Moisturizers', turnoverRate: 6.8, daysInInventory: 54 },
      { category: 'Masks & Peels', turnoverRate: 5.4, daysInInventory: 68 },
    ],
  },
  orderFillRate: 94.7,
  onTimeDeliveryRate: 96.2,
  backorderRate: 2.3,
  averageProcessingTime: 1.8,
};

const ACCOUNT_ENGAGEMENT: AccountEngagement[] = [
  { account: 'Spa Luxe Miami', lastOrderDate: '2025-11-05', orderFrequency: 4.2, totalOrders: 87, lifetimeValue: 45200, engagementScore: 95, status: 'active' },
  { account: 'Beauty Bar NYC', lastOrderDate: '2025-11-03', orderFrequency: 3.8, totalOrders: 124, lifetimeValue: 78900, engagementScore: 92, status: 'active' },
  { account: 'Glow Spa LA', lastOrderDate: '2025-10-15', orderFrequency: 2.1, totalOrders: 34, lifetimeValue: 23400, engagementScore: 65, status: 'at-risk' },
  { account: 'Wellness Center SF', lastOrderDate: '2025-11-01', orderFrequency: 3.2, totalOrders: 56, lifetimeValue: 34100, engagementScore: 88, status: 'active' },
  { account: 'Skin Studio Chicago', lastOrderDate: '2025-08-22', orderFrequency: 1.2, totalOrders: 18, lifetimeValue: 12300, engagementScore: 42, status: 'at-risk' },
];

export function VendorIntelligenceDashboard() {
  const [disclosureLevel, setDisclosureLevel] = useState<DisclosureLevel>('glance');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header with Progressive Disclosure Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vendor Intelligence</h2>
          <p className="text-gray-600 mt-1">Account metrics and operational efficiency</p>
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

      {/* Glance Level - Key Vendor Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Account Retention"
          value={`${VENDOR_METRICS.accountRetentionRate}%`}
          change={3.2}
          icon={Users}
          trend="up"
          subtitle={`${VENDOR_METRICS.activeAccounts} active accounts`}
        />
        <MetricCard
          title="Order Frequency"
          value={`${VENDOR_METRICS.averageOrderFrequency}x`}
          change={0.4}
          icon={RefreshCw}
          trend="up"
          subtitle="per month average"
        />
        <MetricCard
          title="Partner Satisfaction"
          value={`${VENDOR_METRICS.partnerSatisfactionScore}/5.0`}
          change={0.2}
          icon={Star}
          trend="up"
          subtitle="based on surveys"
        />
        <MetricCard
          title="Taxonomy Accuracy"
          value={`${VENDOR_METRICS.taxonomyAccuracyScore}%`}
          change={5.1}
          icon={Package}
          trend="up"
          subtitle="quality score"
        />
      </div>

      {/* Account Growth Trend */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Growth This Month</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-600 mb-1">Active Accounts</div>
            <div className="text-3xl font-bold text-gray-900">{VENDOR_METRICS.activeAccounts}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">New Accounts</div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-green-600">
                +{VENDOR_METRICS.newAccountsThisMonth}
              </div>
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Churned Accounts</div>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-red-600">
                -{VENDOR_METRICS.churnedAccountsThisMonth}
              </div>
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Net Growth</span>
            <span className="font-semibold text-green-600">
              +{VENDOR_METRICS.newAccountsThisMonth - VENDOR_METRICS.churnedAccountsThisMonth} accounts
            </span>
          </div>
        </div>
      </Card>

      {/* Scan Level - Operational Efficiency */}
      {(disclosureLevel === 'scan' || disclosureLevel === 'study') && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Operational KPIs */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Operational Efficiency KPIs
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Order Fill Rate</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    {OPERATIONAL_EFFICIENCY.orderFillRate}%
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">On-Time Delivery</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {OPERATIONAL_EFFICIENCY.onTimeDeliveryRate}%
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Inventory Turnover</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">
                    {OPERATIONAL_EFFICIENCY.inventoryTurnover.overall}x
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-700">Backorder Rate</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-600">
                    {OPERATIONAL_EFFICIENCY.backorderRate}%
                  </span>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg Processing Time</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {OPERATIONAL_EFFICIENCY.averageProcessingTime} days
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Inventory Turnover by Category */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Inventory Turnover by Category
              </h3>
              <div className="space-y-3">
                {OPERATIONAL_EFFICIENCY.inventoryTurnover.byCategory.map((item) => (
                  <div key={item.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">{item.daysInInventory} days</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {item.turnoverRate}x
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={cn(
                          'h-2 rounded-full',
                          item.turnoverRate >= 10 ? 'bg-green-500' :
                          item.turnoverRate >= 7 ? 'bg-blue-500' :
                          'bg-yellow-500'
                        )}
                        style={{ width: `${(item.turnoverRate / 12) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Package className="w-4 h-4" />
                  <span>
                    Higher turnover rates indicate better inventory management and product demand
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Account Engagement Overview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Engagement Overview</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Account
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Orders
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      Frequency
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                      LTV
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ACCOUNT_ENGAGEMENT.map((account) => (
                    <tr key={account.account} className="border-b last:border-0">
                      <td className="py-3 px-4 text-sm text-gray-900">{account.account}</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-700">
                        {account.totalOrders}
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-700">
                        {account.orderFrequency}x/mo
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-medium text-gray-900">
                        {formatCurrency(account.lifetimeValue)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={cn(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                            account.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : account.status === 'at-risk'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          )}
                        >
                          {account.status}
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

      {/* Study Level - Detailed Analysis */}
      {disclosureLevel === 'study' && (
        <>
          {/* Churn Risk Analysis */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Churn Risk Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">At-Risk Accounts</h4>
                <div className="space-y-2">
                  {ACCOUNT_ENGAGEMENT.filter(a => a.status === 'at-risk').map((account) => (
                    <div key={account.account} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{account.account}</span>
                        <span className="text-xs text-gray-500">
                          Last order: {new Date(account.lastOrderDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Engagement Score</span>
                        <span className="font-semibold text-yellow-600">{account.engagementScore}/100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Retention Strategies</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          Re-engagement Campaign
                        </div>
                        <div className="text-xs text-gray-600">
                          Target accounts with no orders in 45+ days with personalized offers
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          Account Check-ins
                        </div>
                        <div className="text-xs text-gray-600">
                          Schedule quarterly business reviews with top 20% of accounts
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          Loyalty Incentives
                        </div>
                        <div className="text-xs text-gray-600">
                          Implement tiered pricing based on order frequency and volume
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Performance Insights */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Strong retention rate of 87.5%</strong> exceeds industry average of 75%.
                  Continue focusing on customer success initiatives.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  !
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Professional Treatments</strong> show highest inventory turnover (12.3x)
                  but also highest backorder rate. Consider safety stock optimization.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  i
                </div>
                <p className="text-sm text-gray-700">
                  <strong>2 accounts at churn risk</strong> represent $35,700 in potential LTV loss.
                  Immediate outreach recommended.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  →
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Taxonomy accuracy at 92%</strong> shows strong data quality.
                  Focus training on remaining 8% for complete compliance.
                </p>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  trend: 'up' | 'down';
  subtitle: string;
}

function MetricCard({ title, value, change, icon: Icon, trend, subtitle }: MetricCardProps) {
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
        <div className="flex items-center justify-between">
          <span
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            )}
          >
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{change > 0 ? '+' : ''}{change}%</span>
          </span>
          <span className="text-xs text-gray-500">{subtitle}</span>
        </div>
      </div>
    </Card>
  );
}
