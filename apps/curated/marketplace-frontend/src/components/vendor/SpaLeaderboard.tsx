/**
 * Spa Leaderboard Component
 *
 * Feature 011: Vendor Portal MVP
 * Sprint B.2: Dashboard Charts & Tables (Task B.2.6, B.2.7)
 *
 * Displays top spa customers with expandable detail rows
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/badge';
import { ChevronDown, ChevronUp, TrendingUp, Calendar } from 'lucide-react';
import { formatCurrency } from '../../hooks/useVendorPortalDashboard';

export interface SpaCustomer {
  spaId: string;
  spaName: string | null;
  lifetimeValue: number;
  orderCount: number;
  avgOrderValue: number;
  lastOrderAt: string | null;
  daysSinceLastOrder: number | null;
}

export interface SpaLeaderboardProps {
  customers: SpaCustomer[];
  loading?: boolean;
  maxItems?: number;
}

/**
 * Expandable Row Component
 */
function ExpandableRow({ customer, rank }: { customer: SpaCustomer; rank: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatLastOrder = (dateString: string | null, daysSince: number | null): string => {
    if (!dateString || daysSince === null) {
      return 'Never ordered';
    }

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getActivityBadge = (daysSince: number | null) => {
    if (daysSince === null) {
      return <Badge variant="outline" className="text-xs">Inactive</Badge>;
    }
    if (daysSince <= 7) {
      return (
        <Badge
          variant="secondary"
          className="text-xs"
          style={{ backgroundColor: '#2E8B5720', color: '#2E8B57', borderColor: '#2E8B5740' }}
        >
          Very Active
        </Badge>
      );
    }
    if (daysSince <= 30) {
      return (
        <Badge
          variant="secondary"
          className="text-xs"
          style={{ backgroundColor: '#9CAF8820', color: '#9CAF88', borderColor: '#9CAF8840' }}
        >
          Active
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="text-xs text-muted-foreground"
      >
        At Risk
      </Badge>
    );
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden hover:border-jade/30 transition-colors">
      {/* Main Row */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-center space-x-4">
          {/* Rank Badge */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-medium"
            style={{
              backgroundColor: rank <= 3 ? '#2E8B5710' : '#9CAF8810',
              color: rank <= 3 ? '#2E8B57' : '#8B9A6B',
            }}
          >
            #{rank}
          </div>

          {/* Spa Info */}
          <div className="text-left">
            <h4 className="font-medium text-sm">
              {customer.spaName || `Spa ${customer.spaId.slice(0, 8)}`}
            </h4>
            <div className="flex items-center space-x-2 mt-1">
              {getActivityBadge(customer.daysSinceLastOrder)}
              <span className="text-xs text-muted-foreground">
                {customer.orderCount} orders
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Lifetime Value */}
          <div className="text-right">
            <div className="font-medium text-lg">{formatCurrency(customer.lifetimeValue)}</div>
            <p className="text-xs text-muted-foreground">Lifetime Value</p>
          </div>

          {/* Expand Icon */}
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-border bg-muted/30 p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Average Order Value</p>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-jade" />
                <span className="font-medium">{formatCurrency(customer.avgOrderValue)}</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{customer.orderCount}</span>
                <span className="text-xs text-muted-foreground">
                  ({formatCurrency(customer.lifetimeValue / customer.orderCount)} avg)
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Last Order</p>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">
                  {formatLastOrder(customer.lastOrderAt, customer.daysSinceLastOrder)}
                </span>
              </div>
            </div>
          </div>

          {customer.daysSinceLastOrder !== null && customer.daysSinceLastOrder > 30 && (
            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>At Risk:</strong> This spa hasn't ordered in {customer.daysSinceLastOrder} days.
                Consider reaching out to maintain the relationship.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Loading Skeleton
 */
function LeaderboardSkeleton({ count }: { count: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  );
}

/**
 * Main SpaLeaderboard Component
 */
export function SpaLeaderboard({
  customers,
  loading = false,
  maxItems = 10,
}: SpaLeaderboardProps) {
  const displayedCustomers = customers.slice(0, maxItems);

  return (
    <Card className="border-border shadow-md">
      <CardHeader>
        <CardTitle className="font-normal">Top Spa Partners</CardTitle>
        <CardDescription className="font-light">
          Your highest value customers ranked by lifetime value
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LeaderboardSkeleton count={5} />
        ) : displayedCustomers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No customer data available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedCustomers.map((customer, index) => (
              <ExpandableRow
                key={customer.spaId}
                customer={customer}
                rank={index + 1}
              />
            ))}
          </div>
        )}

        {!loading && customers.length > maxItems && (
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              Showing {maxItems} of {customers.length} spa partners
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
