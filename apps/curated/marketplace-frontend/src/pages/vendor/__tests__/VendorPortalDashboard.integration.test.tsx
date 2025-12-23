/**
 * VendorPortalDashboard Integration Tests
 *
 * Feature 011: Vendor Portal MVP
 * Sprint B.1: Dashboard Metrics (Task B.1.12)
 *
 * Tests complete dashboard flow with Apollo GraphQL
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { gql } from '@apollo/client';
import { VendorPortalDashboard } from '../VendorPortalDashboard';

// Define the GraphQL query (same as in useVendorPortalDashboard)
const GET_VENDOR_DASHBOARD = gql`
  query GetVendorDashboard($dateRange: DateRangeInput!) {
    vendorDashboard(dateRange: $dateRange) {
      dateRange {
        startDate
        endDate
      }
      revenue {
        total
        fromNewSpas
        fromRepeatSpas
        trend
        percentChange
      }
      orders {
        count
        fromNewSpas
        fromRepeatSpas
        avgOrderValue
        trend
        percentChange
      }
      spas {
        active
        new
        repeat
        reorderRate
        trend
        percentChange
      }
      impressions {
        total
        bySource {
          search
          browse
          values
          recommendation
          direct
        }
        trend
        percentChange
      }
      topProducts {
        productId
        productName
        productSku
        category
        unitsSold
        revenue
        orderCount
        uniqueSpas
      }
      topCustomers {
        spaId
        spaName
        lifetimeValue
        orderCount
        avgOrderValue
        lastOrderAt
        daysSinceLastOrder
      }
      revenueTimeSeries {
        date
        value
      }
      ordersTimeSeries {
        date
        value
      }
    }
  }
`;

// Mock data matching VendorDashboardData interface
const mockDashboardData = {
  vendorDashboard: {
    __typename: 'VendorDashboard',
    dateRange: {
      __typename: 'DateRange',
      startDate: '2024-12-01',
      endDate: '2024-12-31',
    },
    revenue: {
      __typename: 'RevenueMetrics',
      total: 125430.50,
      fromNewSpas: 42500.00,
      fromRepeatSpas: 82930.50,
      trend: 'UP' as const,
      percentChange: 12.5,
    },
    orders: {
      __typename: 'OrderMetrics',
      count: 145,
      fromNewSpas: 45,
      fromRepeatSpas: 100,
      avgOrderValue: 865.03,
      trend: 'UP' as const,
      percentChange: 8.3,
    },
    spas: {
      __typename: 'SpaMetrics',
      active: 42,
      new: 8,
      repeat: 34,
      reorderRate: 81.0,
      trend: 'UP' as const,
      percentChange: 5.2,
    },
    impressions: {
      __typename: 'ImpressionMetrics',
      total: 12450,
      bySource: {
        __typename: 'ImpressionsBySource',
        search: 5200,
        browse: 3100,
        values: 2400,
        recommendation: 1500,
        direct: 250,
      },
      trend: 'UP' as const,
      percentChange: 18.7,
    },
    topProducts: [
      {
        __typename: 'ProductPerformance',
        productId: 'prod-1',
        productName: 'Hydrating Face Serum',
        productSku: 'HFS-001',
        category: 'Serums',
        unitsSold: 89,
        revenue: 18450.00,
        orderCount: 67,
        uniqueSpas: 23,
      },
      {
        __typename: 'ProductPerformance',
        productId: 'prod-2',
        productName: 'Vitamin C Brightening Cream',
        productSku: 'VCC-002',
        category: 'Creams',
        unitsSold: 156,
        revenue: 12300.00,
        orderCount: 92,
        uniqueSpas: 31,
      },
      {
        __typename: 'ProductPerformance',
        productId: 'prod-3',
        productName: 'Retinol Night Treatment',
        productSku: 'RNT-003',
        category: 'Treatments',
        unitsSold: 45,
        revenue: 24500.00,
        orderCount: 38,
        uniqueSpas: 18,
      },
    ],
    topCustomers: [
      {
        __typename: 'CustomerPerformance',
        spaId: 'spa-1',
        spaName: 'Serenity Day Spa',
        lifetimeValue: 45600.00,
        orderCount: 23,
        avgOrderValue: 1982.61,
        lastOrderAt: '2024-12-20T10:00:00Z',
        daysSinceLastOrder: 5,
      },
      {
        __typename: 'CustomerPerformance',
        spaId: 'spa-2',
        spaName: 'Tranquility Wellness Center',
        lifetimeValue: 38900.00,
        orderCount: 19,
        avgOrderValue: 2047.37,
        lastOrderAt: '2024-12-15T14:30:00Z',
        daysSinceLastOrder: 10,
      },
      {
        __typename: 'CustomerPerformance',
        spaId: 'spa-3',
        spaName: 'Harmony Spa & Salon',
        lifetimeValue: 32100.00,
        orderCount: 15,
        avgOrderValue: 2140.00,
        lastOrderAt: '2024-12-10T09:15:00Z',
        daysSinceLastOrder: 15,
      },
    ],
    revenueTimeSeries: [
      { __typename: 'TimeSeriesDataPoint', date: '2024-12-01', value: 4200.00 },
      { __typename: 'TimeSeriesDataPoint', date: '2024-12-02', value: 3800.00 },
      { __typename: 'TimeSeriesDataPoint', date: '2024-12-03', value: 5100.00 },
    ],
    ordersTimeSeries: [
      { __typename: 'TimeSeriesDataPoint', date: '2024-12-01', value: 5 },
      { __typename: 'TimeSeriesDataPoint', date: '2024-12-02', value: 4 },
      { __typename: 'TimeSeriesDataPoint', date: '2024-12-03', value: 6 },
    ],
  },
};

// Create mock for successful data fetch
const createSuccessMock = (overrides = {}) => {
  // Calculate default date range (last 30 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  return {
    request: {
      query: GET_VENDOR_DASHBOARD,
      variables: {
        dateRange: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        },
      },
    },
    result: {
      data: {
        ...mockDashboardData,
        ...overrides,
      },
    },
  };
};

// Create mock for error state
const createErrorMock = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 30);

  return {
    request: {
      query: GET_VENDOR_DASHBOARD,
      variables: {
        dateRange: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
        },
      },
    },
    error: new Error('Failed to fetch dashboard data'),
  };
};

// Helper to render with Apollo mocks
const renderWithMocks = (mocks: any[] = []) => {
  return render(
    <MockedProvider mocks={mocks}>
      <VendorPortalDashboard />
    </MockedProvider>
  );
};

describe('VendorPortalDashboard Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading State', () => {
    it('renders loading skeletons initially', () => {
      const mock = createSuccessMock();
      renderWithMocks([mock]);

      // Should show loading skeletons with animate-pulse class
      const loadingElements = document.querySelectorAll('.animate-pulse');
      expect(loadingElements.length).toBeGreaterThan(0);
    });

    it('displays dashboard header immediately', () => {
      const mock = createSuccessMock();
      renderWithMocks([mock]);

      expect(screen.getByText('Vendor Dashboard')).toBeInTheDocument();
      expect(screen.getByText(/Track your performance/i)).toBeInTheDocument();
    });
  });

  describe('Successful Data Fetch', () => {
    it('renders all metric cards with correct data', async () => {
      const mock = createSuccessMock();
      renderWithMocks([mock]);

      await waitFor(() => {
        // Revenue metric
        expect(screen.getByText('Total Revenue')).toBeInTheDocument();
        expect(screen.getByText('$125,430.50')).toBeInTheDocument();
        expect(screen.getByText('+12.5%')).toBeInTheDocument();

        // Orders metric
        expect(screen.getByText('Orders')).toBeInTheDocument();
        expect(screen.getByText('145')).toBeInTheDocument();
        expect(screen.getByText('+8.3%')).toBeInTheDocument();

        // Active Spas metric
        expect(screen.getByText('Active Spas')).toBeInTheDocument();
        expect(screen.getByText('42')).toBeInTheDocument();
        expect(screen.getByText('+5.2%')).toBeInTheDocument();

        // Reorder Rate metric
        expect(screen.getByText('Reorder Rate')).toBeInTheDocument();
        expect(screen.getByText('81.0%')).toBeInTheDocument();
      });
    });

    it('renders top products table with correct data', async () => {
      const mock = createSuccessMock();
      renderWithMocks([mock]);

      await waitFor(() => {
        expect(screen.getByText('Top Performing Products')).toBeInTheDocument();
        expect(screen.getByText('Hydrating Face Serum')).toBeInTheDocument();
        expect(screen.getByText('Vitamin C Brightening Cream')).toBeInTheDocument();
        expect(screen.getByText('Retinol Night Treatment')).toBeInTheDocument();

        // Check units sold and revenue for first product
        expect(screen.getByText(/89 units/i)).toBeInTheDocument();
        expect(screen.getByText('$18,450.00')).toBeInTheDocument();
      });
    });

    it('renders top customers table with correct data', async () => {
      const mock = createSuccessMock();
      renderWithMocks([mock]);

      await waitFor(() => {
        expect(screen.getByText('Top Customers')).toBeInTheDocument();
        expect(screen.getByText('Serenity Day Spa')).toBeInTheDocument();
        expect(screen.getByText('Tranquility Wellness Center')).toBeInTheDocument();
        expect(screen.getByText('Harmony Spa & Salon')).toBeInTheDocument();

        // Check lifetime value for first customer
        expect(screen.getByText('$45,600.00')).toBeInTheDocument();
        expect(screen.getByText('5d ago')).toBeInTheDocument();
      });
    });

    it('renders discovery insights with source breakdown', async () => {
      const mock = createSuccessMock();
      renderWithMocks([mock]);

      await waitFor(() => {
        expect(screen.getByText('Discovery Sources')).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();
        expect(screen.getByText('Browse')).toBeInTheDocument();
        expect(screen.getByText('Values')).toBeInTheDocument();
        expect(screen.getByText('Recommendations')).toBeInTheDocument();
        expect(screen.getByText('Direct')).toBeInTheDocument();

        // Check impressions count
        expect(screen.getByText(/5,200/)).toBeInTheDocument(); // Search impressions
        expect(screen.getByText(/3,100/)).toBeInTheDocument(); // Browse impressions
      });
    });

    it('renders secondary metrics correctly', async () => {
      const mock = createSuccessMock();
      renderWithMocks([mock]);

      await waitFor(() => {
        // Profile Impressions
        expect(screen.getByText('Profile Impressions')).toBeInTheDocument();
        expect(screen.getByText('12,450')).toBeInTheDocument();
        expect(screen.getByText('+18.7%')).toBeInTheDocument();

        // Products Sold (sum of units sold from top products)
        expect(screen.getByText('Products Sold')).toBeInTheDocument();
        expect(screen.getByText('290')).toBeInTheDocument(); // 89 + 156 + 45

        // New Spa Revenue
        expect(screen.getByText('New Spa Revenue')).toBeInTheDocument();
        expect(screen.getByText('$42,500.00')).toBeInTheDocument();
      });
    });
  });

  describe('Error State', () => {
    it('renders error message when data fetch fails', async () => {
      const mock = createErrorMock();
      renderWithMocks([mock]);

      await waitFor(() => {
        expect(screen.getByText('Error Loading Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Failed to fetch dashboard data')).toBeInTheDocument();
      });
    });

    it('displays retry button on error', async () => {
      const mock = createErrorMock();
      renderWithMocks([mock]);

      await waitFor(() => {
        const retryButton = screen.getByRole('button', { name: /retry/i });
        expect(retryButton).toBeInTheDocument();
      });
    });

    it('does not render dashboard content on error', async () => {
      const mock = createErrorMock();
      renderWithMocks([mock]);

      await waitFor(() => {
        expect(screen.queryByText('Total Revenue')).not.toBeInTheDocument();
        expect(screen.queryByText('Top Performing Products')).not.toBeInTheDocument();
      });
    });
  });

  describe('Empty Data Scenarios', () => {
    it('handles zero revenue correctly', async () => {
      const mock = createSuccessMock({
        vendorDashboard: {
          ...mockDashboardData.vendorDashboard,
          revenue: {
            ...mockDashboardData.vendorDashboard.revenue,
            total: 0,
          },
        },
      });
      renderWithMocks([mock]);

      await waitFor(() => {
        expect(screen.getByText('$0.00')).toBeInTheDocument();
      });
    });

    it('handles empty top products list', async () => {
      const mock = createSuccessMock({
        vendorDashboard: {
          ...mockDashboardData.vendorDashboard,
          topProducts: [],
        },
      });
      renderWithMocks([mock]);

      await waitFor(() => {
        expect(screen.getByText('Top Performing Products')).toBeInTheDocument();
        // Should not crash with empty array
        expect(screen.queryByText('Hydrating Face Serum')).not.toBeInTheDocument();
      });
    });

    it('handles empty top customers list', async () => {
      const mock = createSuccessMock({
        vendorDashboard: {
          ...mockDashboardData.vendorDashboard,
          topCustomers: [],
        },
      });
      renderWithMocks([mock]);

      await waitFor(() => {
        expect(screen.getByText('Top Customers')).toBeInTheDocument();
        expect(screen.queryByText('Serenity Day Spa')).not.toBeInTheDocument();
      });
    });
  });

  describe('Trend Indicators', () => {
    it('renders UP trend indicators correctly', async () => {
      const mock = createSuccessMock();
      renderWithMocks([mock]);

      await waitFor(() => {
        const upTrends = screen.getAllByText(/\+\d+\.\d+%/);
        expect(upTrends.length).toBeGreaterThan(0);
      });
    });

    it('renders DOWN trend indicators correctly', async () => {
      const mock = createSuccessMock({
        vendorDashboard: {
          ...mockDashboardData.vendorDashboard,
          revenue: {
            ...mockDashboardData.vendorDashboard.revenue,
            trend: 'DOWN' as const,
            percentChange: -8.5,
          },
        },
      });
      renderWithMocks([mock]);

      await waitFor(() => {
        expect(screen.getByText('-8.5%')).toBeInTheDocument();
      });
    });

    it('renders FLAT trend indicators correctly', async () => {
      const mock = createSuccessMock({
        vendorDashboard: {
          ...mockDashboardData.vendorDashboard,
          spas: {
            ...mockDashboardData.vendorDashboard.spas,
            trend: 'FLAT' as const,
            percentChange: 1.2,
          },
        },
      });
      renderWithMocks([mock]);

      await waitFor(() => {
        expect(screen.getByText('+1.2%')).toBeInTheDocument();
      });
    });
  });

  describe('Action Buttons', () => {
    it('renders "View All Products" button', async () => {
      const mock = createSuccessMock();
      renderWithMocks([mock]);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button', { name: /view all products/i });
        expect(buttons.length).toBeGreaterThan(0);
      });
    });

    it('renders "View All Customers" button', async () => {
      const mock = createSuccessMock();
      renderWithMocks([mock]);

      await waitFor(() => {
        const buttons = screen.getAllByRole('button', { name: /view all customers/i });
        expect(buttons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', async () => {
      const mock = createSuccessMock();
      renderWithMocks([mock]);

      await waitFor(() => {
        const mainHeading = screen.getByText('Vendor Dashboard');
        expect(mainHeading).toBeInTheDocument();
        expect(mainHeading.tagName.toLowerCase()).toBe('h1');
      });
    });

    it('metric cards have proper heading structure', async () => {
      const mock = createSuccessMock();
      renderWithMocks([mock]);

      await waitFor(() => {
        const revenueTitle = screen.getByText('Total Revenue');
        expect(revenueTitle.tagName.toLowerCase()).toBe('h4');
      });
    });
  });

  describe('Responsive Layout', () => {
    it('renders metric card grid', async () => {
      const mock = createSuccessMock();
      const { container } = renderWithMocks([mock]);

      await waitFor(() => {
        const grid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4');
        expect(grid).toBeInTheDocument();
      });
    });

    it('renders two-column layout for tables', async () => {
      const mock = createSuccessMock();
      const { container } = renderWithMocks([mock]);

      await waitFor(() => {
        const tableGrid = container.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2');
        expect(tableGrid).toBeInTheDocument();
      });
    });
  });
});
