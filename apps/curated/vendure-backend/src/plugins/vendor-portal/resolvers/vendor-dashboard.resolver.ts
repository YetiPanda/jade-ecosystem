/**
 * Vendor Dashboard Resolver
 *
 * Feature 011: Vendor Portal MVP
 * Sprint B.1: Dashboard Metrics (Task B.1.5)
 *
 * GraphQL resolver for vendor dashboard queries
 */

import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { VendorDashboardService, DateRange } from '../services/vendor-dashboard.service';

// TODO: Import actual auth guards when implementing authentication
// import { VendorAuthGuard } from '../guards/vendor-auth.guard';
// import { CurrentVendor } from '../decorators/current-vendor.decorator';

@Resolver()
export class VendorDashboardResolver {
  constructor(private dashboardService: VendorDashboardService) {}

  @Query()
  // @UseGuards(VendorAuthGuard) // TODO: Enable when auth is implemented
  async vendorDashboard(
    // @CurrentVendor() vendorId: string, // TODO: Get from authenticated session
    @Args('dateRange') dateRange: { startDate: string; endDate: string },
  ) {
    // TODO: Replace hardcoded vendorId with actual authenticated vendor
    const vendorId = 'vendor-123'; // Placeholder

    const parsedDateRange: DateRange = {
      startDate: new Date(dateRange.startDate),
      endDate: new Date(dateRange.endDate),
    };

    const metrics = await this.dashboardService.getDashboardMetrics(vendorId, parsedDateRange);

    return {
      dateRange: {
        startDate: metrics.dateRange.startDate.toISOString(),
        endDate: metrics.dateRange.endDate.toISOString(),
      },
      revenue: metrics.revenue,
      orders: metrics.orders,
      spas: metrics.spas,
      impressions: metrics.impressions,
      topProducts: metrics.topProducts,
      topCustomers: metrics.topCustomers,
      revenueTimeSeries: metrics.revenueTimeSeries,
      ordersTimeSeries: metrics.ordersTimeSeries,
    };
  }
}
