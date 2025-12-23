/**
 * Vendor Dashboard Service
 *
 * Feature 011: Vendor Portal MVP
 * Sprint B.1: Dashboard Metrics (Task B.1.5)
 *
 * Provides dashboard metrics and analytics for vendors including:
 * - Revenue, orders, and spa metrics with trends
 * - Time series data for charts
 * - Top products and customers
 * - Discovery and engagement metrics
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { VendorAnalyticsDaily } from '../entities/vendor-analytics-daily.entity';
import { SpaVendorRelationship } from '../entities/spa-vendor-relationship.entity';
import { ProductPerformanceDaily } from '../entities/product-performance-daily.entity';
import { DiscoveryImpression } from '../entities/discovery-impression.entity';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface VendorDashboardMetrics {
  dateRange: DateRange;
  revenue: RevenueMetrics;
  orders: OrderMetrics;
  spas: SpaMetrics;
  impressions: ImpressionMetrics;
  topProducts: ProductPerformance[];
  topCustomers: CustomerSummary[];
  revenueTimeSeries: TimeSeriesDataPoint[];
  ordersTimeSeries: TimeSeriesDataPoint[];
}

export interface RevenueMetrics {
  total: number;
  fromNewSpas: number;
  fromRepeatSpas: number;
  trend: 'UP' | 'FLAT' | 'DOWN';
  percentChange: number;
}

export interface OrderMetrics {
  count: number;
  fromNewSpas: number;
  fromRepeatSpas: number;
  avgOrderValue: number;
  trend: 'UP' | 'FLAT' | 'DOWN';
  percentChange: number;
}

export interface SpaMetrics {
  active: number;
  new: number;
  repeat: number;
  reorderRate: number;
  trend: 'UP' | 'FLAT' | 'DOWN';
  percentChange: number;
}

export interface ImpressionMetrics {
  total: number;
  bySource: {
    search: number;
    browse: number;
    values: number;
    recommendation: number;
    direct: number;
  };
  trend: 'UP' | 'FLAT' | 'DOWN';
  percentChange: number;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

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

export interface CustomerSummary {
  spaId: string;
  spaName: string | null;
  lifetimeValue: number;
  orderCount: number;
  avgOrderValue: number;
  lastOrderAt: Date | null;
  daysSinceLastOrder: number | null;
}

@Injectable()
export class VendorDashboardService {
  constructor(
    @InjectRepository(VendorAnalyticsDaily)
    private analyticsRepo: Repository<VendorAnalyticsDaily>,
    @InjectRepository(SpaVendorRelationship)
    private relationshipRepo: Repository<SpaVendorRelationship>,
    @InjectRepository(ProductPerformanceDaily)
    private productPerfRepo: Repository<ProductPerformanceDaily>,
  ) {}

  /**
   * Get complete dashboard metrics for a vendor
   */
  async getDashboardMetrics(
    vendorId: string,
    dateRange: DateRange,
  ): Promise<VendorDashboardMetrics> {
    // Fetch analytics data for the period
    const analyticsData = await this.analyticsRepo.find({
      where: {
        vendorId,
        date: Between(dateRange.startDate, dateRange.endDate),
      },
      order: { date: 'ASC' },
    });

    // Calculate comparison period (same length before start date)
    const periodLength = this.getDaysDiff(dateRange.startDate, dateRange.endDate);
    const comparisonEndDate = new Date(dateRange.startDate);
    comparisonEndDate.setDate(comparisonEndDate.getDate() - 1);
    const comparisonStartDate = new Date(comparisonEndDate);
    comparisonStartDate.setDate(comparisonStartDate.getDate() - periodLength);

    const comparisonData = await this.analyticsRepo.find({
      where: {
        vendorId,
        date: Between(comparisonStartDate, comparisonEndDate),
      },
    });

    // Aggregate current period metrics
    const currentMetrics = this.aggregateMetrics(analyticsData);
    const comparisonMetrics = this.aggregateMetrics(comparisonData);

    // Get top products and customers
    const [topProducts, topCustomers] = await Promise.all([
      this.getTopProducts(vendorId, dateRange, 10),
      this.getTopCustomers(vendorId, 10),
    ]);

    // Build time series data
    const revenueTimeSeries = analyticsData.map(d => ({
      date: d.date.toISOString().split('T')[0],
      value: Number(d.revenue),
    }));

    const ordersTimeSeries = analyticsData.map(d => ({
      date: d.date.toISOString().split('T')[0],
      value: d.orderCount,
    }));

    return {
      dateRange,
      revenue: this.calculateRevenueMetrics(currentMetrics, comparisonMetrics),
      orders: this.calculateOrderMetrics(currentMetrics, comparisonMetrics),
      spas: this.calculateSpaMetrics(currentMetrics, comparisonMetrics),
      impressions: this.calculateImpressionMetrics(currentMetrics, comparisonMetrics),
      topProducts,
      topCustomers,
      revenueTimeSeries,
      ordersTimeSeries,
    };
  }

  /**
   * Aggregate analytics data into summary metrics
   */
  private aggregateMetrics(data: VendorAnalyticsDaily[]) {
    return data.reduce(
      (acc, day) => ({
        revenue: acc.revenue + Number(day.revenue),
        revenueFromNewSpas: acc.revenueFromNewSpas + Number(day.revenueFromNewSpas),
        revenueFromRepeatSpas: acc.revenueFromRepeatSpas + Number(day.revenueFromRepeatSpas),
        orderCount: acc.orderCount + day.orderCount,
        ordersFromNewSpas: acc.ordersFromNewSpas + day.ordersFromNewSpas,
        ordersFromRepeatSpas: acc.ordersFromRepeatSpas + day.ordersFromRepeatSpas,
        activeSpas: Math.max(acc.activeSpas, day.activeSpas), // Peak active spas
        newSpas: acc.newSpas + day.newSpas,
        repeatSpas: acc.repeatSpas + day.repeatSpas,
        impressions: acc.impressions + day.impressions,
        impressionsFromSearch: acc.impressionsFromSearch + day.impressionsFromSearch,
        impressionsFromBrowse: acc.impressionsFromBrowse + day.impressionsFromBrowse,
        impressionsFromValues: acc.impressionsFromValues + day.impressionsFromValues,
        impressionsFromRecommendations:
          acc.impressionsFromRecommendations + day.impressionsFromRecommendations,
        impressionsFromDirect: acc.impressionsFromDirect + day.impressionsFromDirect,
      }),
      {
        revenue: 0,
        revenueFromNewSpas: 0,
        revenueFromRepeatSpas: 0,
        orderCount: 0,
        ordersFromNewSpas: 0,
        ordersFromRepeatSpas: 0,
        activeSpas: 0,
        newSpas: 0,
        repeatSpas: 0,
        impressions: 0,
        impressionsFromSearch: 0,
        impressionsFromBrowse: 0,
        impressionsFromValues: 0,
        impressionsFromRecommendations: 0,
        impressionsFromDirect: 0,
      },
    );
  }

  /**
   * Calculate revenue metrics with trends
   */
  private calculateRevenueMetrics(current: any, comparison: any): RevenueMetrics {
    const percentChange = this.calculatePercentChange(current.revenue, comparison.revenue);

    return {
      total: current.revenue,
      fromNewSpas: current.revenueFromNewSpas,
      fromRepeatSpas: current.revenueFromRepeatSpas,
      trend: this.getTrend(percentChange),
      percentChange: Math.round(percentChange * 100) / 100,
    };
  }

  /**
   * Calculate order metrics with trends
   */
  private calculateOrderMetrics(current: any, comparison: any): OrderMetrics {
    const percentChange = this.calculatePercentChange(current.orderCount, comparison.orderCount);
    const avgOrderValue = current.orderCount > 0 ? current.revenue / current.orderCount : 0;

    return {
      count: current.orderCount,
      fromNewSpas: current.ordersFromNewSpas,
      fromRepeatSpas: current.ordersFromRepeatSpas,
      avgOrderValue: Math.round(avgOrderValue * 100) / 100,
      trend: this.getTrend(percentChange),
      percentChange: Math.round(percentChange * 100) / 100,
    };
  }

  /**
   * Calculate spa metrics with trends
   */
  private calculateSpaMetrics(current: any, comparison: any): SpaMetrics {
    const percentChange = this.calculatePercentChange(current.activeSpas, comparison.activeSpas);
    const totalOrders = current.ordersFromNewSpas + current.ordersFromRepeatSpas;
    const reorderRate =
      totalOrders > 0 ? (current.ordersFromRepeatSpas / totalOrders) * 100 : 0;

    return {
      active: current.activeSpas,
      new: current.newSpas,
      repeat: current.repeatSpas,
      reorderRate: Math.round(reorderRate * 100) / 100,
      trend: this.getTrend(percentChange),
      percentChange: Math.round(percentChange * 100) / 100,
    };
  }

  /**
   * Calculate impression metrics with trends
   */
  private calculateImpressionMetrics(current: any, comparison: any): ImpressionMetrics {
    const percentChange = this.calculatePercentChange(
      current.impressions,
      comparison.impressions,
    );

    return {
      total: current.impressions,
      bySource: {
        search: current.impressionsFromSearch,
        browse: current.impressionsFromBrowse,
        values: current.impressionsFromValues,
        recommendation: current.impressionsFromRecommendations,
        direct: current.impressionsFromDirect,
      },
      trend: this.getTrend(percentChange),
      percentChange: Math.round(percentChange * 100) / 100,
    };
  }

  /**
   * Get top performing products
   */
  private async getTopProducts(
    vendorId: string,
    dateRange: DateRange,
    limit: number,
  ): Promise<ProductPerformance[]> {
    const products = await this.productPerfRepo
      .createQueryBuilder('perf')
      .select('perf.productId', 'productId')
      .addSelect('perf.productName', 'productName')
      .addSelect('perf.productSku', 'productSku')
      .addSelect('perf.category', 'category')
      .addSelect('SUM(perf.unitsSold)', 'unitsSold')
      .addSelect('SUM(perf.revenue)', 'revenue')
      .addSelect('SUM(perf.orderCount)', 'orderCount')
      .addSelect('COUNT(DISTINCT perf.uniqueSpas)', 'uniqueSpas')
      .where('perf.vendorId = :vendorId', { vendorId })
      .andWhere('perf.date BETWEEN :startDate AND :endDate', {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      })
      .groupBy('perf.productId')
      .addGroupBy('perf.productName')
      .addGroupBy('perf.productSku')
      .addGroupBy('perf.category')
      .orderBy('SUM(perf.revenue)', 'DESC')
      .limit(limit)
      .getRawMany();

    return products.map(p => ({
      productId: p.productId,
      productName: p.productName,
      productSku: p.productSku,
      category: p.category,
      unitsSold: parseInt(p.unitsSold, 10),
      revenue: parseFloat(p.revenue),
      orderCount: parseInt(p.orderCount, 10),
      uniqueSpas: parseInt(p.uniqueSpas, 10),
    }));
  }

  /**
   * Get top customers by lifetime value
   */
  private async getTopCustomers(vendorId: string, limit: number): Promise<CustomerSummary[]> {
    const customers = await this.relationshipRepo.find({
      where: { vendorId },
      order: { lifetimeValue: 'DESC' },
      take: limit,
    });

    return customers.map(c => ({
      spaId: c.spaId,
      spaName: c.spaName,
      lifetimeValue: Number(c.lifetimeValue),
      orderCount: c.orderCount,
      avgOrderValue: Number(c.avgOrderValue),
      lastOrderAt: c.lastOrderAt,
      daysSinceLastOrder: c.daysSinceLastOrder,
    }));
  }

  /**
   * Calculate percent change between two values
   */
  private calculatePercentChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Determine trend direction based on percent change
   */
  private getTrend(percentChange: number): 'UP' | 'FLAT' | 'DOWN' {
    if (percentChange > 5) return 'UP';
    if (percentChange < -5) return 'DOWN';
    return 'FLAT';
  }

  /**
   * Calculate days difference between two dates
   */
  private getDaysDiff(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
