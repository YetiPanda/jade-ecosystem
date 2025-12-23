/**
 * Product Performance Table Component
 *
 * Feature 011: Vendor Portal MVP
 * Sprint B.2: Dashboard Charts & Tables (Task B.2.8, B.2.9)
 *
 * Displays product performance metrics with sortable columns
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/badge';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { formatCurrency, formatNumber } from '../../hooks/useVendorPortalDashboard';

export interface ProductPerformance {
  productId: string;
  productName: string;
  productSku: string | null;
  category: string | null;
  unitsSold: number;
  revenue: number;
  orderCount: number;
  uniqueSpas: number;
}

export interface ProductPerformanceTableProps {
  products: ProductPerformance[];
  loading?: boolean;
  maxItems?: number;
}

type SortField = 'productName' | 'unitsSold' | 'revenue' | 'orderCount' | 'uniqueSpas';
type SortDirection = 'asc' | 'desc';

/**
 * Sortable Column Header
 */
function SortableHeader({
  label,
  field,
  currentField,
  direction,
  onSort,
}: {
  label: string;
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
}) {
  const isActive = currentField === field;

  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center space-x-1 hover:text-foreground transition-colors group"
    >
      <span className="text-xs font-medium uppercase tracking-wider">
        {label}
      </span>
      {isActive ? (
        direction === 'asc' ? (
          <ArrowUp className="h-3 w-3 text-jade" />
        ) : (
          <ArrowDown className="h-3 w-3 text-jade" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
}

/**
 * Table Row Component
 */
function ProductRow({ product, rank }: { product: ProductPerformance; rank: number }) {
  const avgRevenuePerOrder = product.orderCount > 0 ? product.revenue / product.orderCount : 0;

  return (
    <tr className="border-b border-border hover:bg-accent/30 transition-colors">
      {/* Rank */}
      <td className="py-3 px-4">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
          style={{
            backgroundColor: rank <= 3 ? '#2E8B5710' : '#9CAF8810',
            color: rank <= 3 ? '#2E8B57' : '#8B9A6B',
          }}
        >
          {rank}
        </div>
      </td>

      {/* Product Info */}
      <td className="py-3 px-4">
        <div>
          <p className="font-medium text-sm">{product.productName}</p>
          <div className="flex items-center space-x-2 mt-1">
            {product.productSku && (
              <span className="text-xs text-muted-foreground">SKU: {product.productSku}</span>
            )}
            {product.category && (
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            )}
          </div>
        </div>
      </td>

      {/* Units Sold */}
      <td className="py-3 px-4 text-right">
        <span className="font-medium">{formatNumber(product.unitsSold)}</span>
      </td>

      {/* Revenue */}
      <td className="py-3 px-4 text-right">
        <div>
          <p className="font-medium">{formatCurrency(product.revenue)}</p>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(avgRevenuePerOrder)}/order
          </p>
        </div>
      </td>

      {/* Orders */}
      <td className="py-3 px-4 text-right">
        <span className="font-medium">{product.orderCount}</span>
      </td>

      {/* Unique Spas */}
      <td className="py-3 px-4 text-right">
        <span className="font-medium">{product.uniqueSpas}</span>
      </td>
    </tr>
  );
}

/**
 * Loading Skeleton
 */
function TableSkeleton({ rows }: { rows: number }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-border">
          <td colSpan={6} className="py-3 px-4">
            <div className="h-12 bg-muted animate-pulse rounded" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

/**
 * Main ProductPerformanceTable Component
 */
export function ProductPerformanceTable({
  products,
  loading = false,
  maxItems = 20,
}: ProductPerformanceTableProps) {
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedProducts = useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortField) {
        case 'productName':
          aValue = a.productName.toLowerCase();
          bValue = b.productName.toLowerCase();
          break;
        case 'unitsSold':
          aValue = a.unitsSold;
          bValue = b.unitsSold;
          break;
        case 'revenue':
          aValue = a.revenue;
          bValue = b.revenue;
          break;
        case 'orderCount':
          aValue = a.orderCount;
          bValue = b.orderCount;
          break;
        case 'uniqueSpas':
          aValue = a.uniqueSpas;
          bValue = b.uniqueSpas;
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted.slice(0, maxItems);
  }, [products, sortField, sortDirection, maxItems]);

  return (
    <Card className="border-border shadow-md">
      <CardHeader>
        <CardTitle className="font-normal">Product Performance</CardTitle>
        <CardDescription className="font-light">
          Detailed metrics for all your products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="py-3 px-4 text-left">
                  <span className="text-xs font-medium uppercase tracking-wider">Rank</span>
                </th>
                <th className="py-3 px-4 text-left">
                  <SortableHeader
                    label="Product"
                    field="productName"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="py-3 px-4 text-right">
                  <SortableHeader
                    label="Units Sold"
                    field="unitsSold"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="py-3 px-4 text-right">
                  <SortableHeader
                    label="Revenue"
                    field="revenue"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="py-3 px-4 text-right">
                  <SortableHeader
                    label="Orders"
                    field="orderCount"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                </th>
                <th className="py-3 px-4 text-right">
                  <SortableHeader
                    label="Spas"
                    field="uniqueSpas"
                    currentField={sortField}
                    direction={sortDirection}
                    onSort={handleSort}
                  />
                </th>
              </tr>
            </thead>

            {loading ? (
              <TableSkeleton rows={5} />
            ) : sortedProducts.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={6} className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">No product data available</p>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {sortedProducts.map((product, index) => (
                  <ProductRow
                    key={product.productId}
                    product={product}
                    rank={index + 1}
                  />
                ))}
              </tbody>
            )}
          </table>
        </div>

        {!loading && products.length > maxItems && (
          <div className="mt-4 text-center border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Showing {maxItems} of {products.length} products
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
