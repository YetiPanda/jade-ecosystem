import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

/**
 * Dashboard Order Type
 * Transforms Vendure Order API response to Figma component format
 */
export interface DashboardOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: Date;
  shippingAddress?: {
    fullName: string;
    streetLine1: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
}

export interface OrderFilters {
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  customerId?: string;
}

const GET_ORDERS_FOR_DASHBOARD = gql`
  query GetOrdersForDashboard($filters: OrderFilters, $pagination: PaginationInput) {
    orders(filters: $filters, pagination: $pagination) {
      edges {
        node {
          id
          code
          state
          total
          totalWithTax
          currencyCode
          createdAt
          updatedAt
          customer {
            id
            firstName
            lastName
            emailAddress
          }
          lines {
            id
            quantity
            productVariant {
              id
              name
              sku
            }
          }
          shippingAddress {
            fullName
            streetLine1
            streetLine2
            city
            province
            postalCode
            country
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      totalCount
    }
  }
`;

/**
 * Maps Vendure order state to dashboard status
 */
function mapOrderStatus(vendureState: string): DashboardOrder['status'] {
  const stateMap: Record<string, DashboardOrder['status']> = {
    'AddingItems': 'pending',
    'ArrangingPayment': 'pending',
    'PaymentAuthorized': 'processing',
    'PaymentSettled': 'processing',
    'PartiallyShipped': 'processing',
    'Shipped': 'shipped',
    'PartiallyDelivered': 'shipped',
    'Delivered': 'delivered',
    'Cancelled': 'cancelled',
  };

  return stateMap[vendureState] || 'pending';
}

/**
 * Hook to fetch and transform orders for dashboard display
 *
 * Transforms Vendure GraphQL Order data into the format expected by
 * Figma OrderManagement component
 *
 * @param filters - Order filter criteria
 * @returns { orders, loading, error, refetch }
 */
export function useOrdersForDashboard(filters?: OrderFilters) {
  const { data, loading, error, refetch } = useQuery(GET_ORDERS_FOR_DASHBOARD, {
    variables: {
      filters: filters || {},
      pagination: {
        limit: 100,
        offset: 0,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const orders = useMemo((): DashboardOrder[] => {
    if (!data?.orders?.edges) return [];

    return data.orders.edges.map(({ node: order }: any) => {
      const customer = order.customer;
      const customerName = customer
        ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
        : 'Guest';

      return {
        id: order.id,
        orderNumber: order.code,
        customerName,
        customerEmail: customer?.emailAddress || '',
        items: order.lines?.reduce((sum: number, line: any) => sum + line.quantity, 0) || 0,
        total: order.totalWithTax / 100, // Convert from cents
        status: mapOrderStatus(order.state),
        date: new Date(order.createdAt),
        shippingAddress: order.shippingAddress
          ? {
              fullName: order.shippingAddress.fullName,
              streetLine1: order.shippingAddress.streetLine1,
              city: order.shippingAddress.city,
              province: order.shippingAddress.province,
              postalCode: order.shippingAddress.postalCode,
              country: order.shippingAddress.country,
            }
          : undefined,
      };
    });
  }, [data]);

  return {
    orders,
    loading,
    error,
    refetch,
    totalCount: data?.orders?.totalCount || 0,
  };
}

/**
 * Hook to get order statistics for dashboard metrics
 */
export function useOrderStats(dateRange?: { from: Date; to: Date }) {
  const { orders, loading } = useOrdersForDashboard({
    dateFrom: dateRange?.from,
    dateTo: dateRange?.to,
  });

  const stats = useMemo(() => {
    if (loading || !orders.length) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
      };
    }

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    return {
      totalOrders: orders.length,
      totalRevenue,
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      processingOrders: orders.filter(o => o.status === 'processing').length,
      shippedOrders: orders.filter(o => o.status === 'shipped').length,
      deliveredOrders: orders.filter(o => o.status === 'delivered').length,
    };
  }, [orders, loading]);

  return { stats, loading };
}
