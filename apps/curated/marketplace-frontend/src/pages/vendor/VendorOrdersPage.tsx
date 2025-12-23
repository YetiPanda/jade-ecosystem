/**
 * Vendor Orders Page
 * Week 7: Order Management & Fulfillment
 *
 * Features:
 * - View all orders containing vendor's products
 * - Filter by fulfillment status
 * - Quick fulfillment actions
 * - Order search
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@jade/ui/components';
import { Button } from '@jade/ui/components';
import { useAuth } from '../../contexts/AuthContext';
import {
  Package,
  Truck,
  Check,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  DollarSign,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';
import {
  useVendorOrdersQuery,
  useOrderStatusCountsQuery,
  useUpdateOrderStatusMutation,
  OrderStatus,
} from '../../graphql/generated';
import { OrderSearchFilter } from '../../components/vendor/OrderSearchFilter';
import { DateRange } from '../../components/vendor/DateRangePicker';
import { OrderStatusBadge } from '../../components/vendor/OrderStatusBadge';

interface VendorOrdersPageProps {
  /**
   * When true, removes standalone page chrome (header, container)
   * for seamless integration within tab layout
   */
  isTabView?: boolean;
}

export function VendorOrdersPage({ isTabView = false }: VendorOrdersPageProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [spaId, setSpaId] = useState<string>('all');
  const [pageSize] = useState(20); // Items per page
  const [cursors, setCursors] = useState<string[]>([]); // Stack of cursors for going back
  const { user } = useAuth();

  // Get vendor ID from auth context
  const vendorId = user?.vendorOrganization?.id;

  // Current cursor is the last one in the stack (or undefined for first page)
  const currentCursor = cursors.length > 0 ? cursors[cursors.length - 1] : undefined;

  // Fetch vendor orders with cursor-based pagination
  const { data, loading, error, refetch } = useVendorOrdersQuery({
    variables: {
      filter: {
        ...(filterStatus !== 'all' && { status: [filterStatus] }),
        ...(dateRange && { dateRange: { from: dateRange.from, to: dateRange.to } }),
        ...(spaId !== 'all' && { spaId }),
      },
      pagination: {
        after: currentCursor,
        first: pageSize,
      },
    },
    skip: !vendorId,
  });

  // Fetch order status counts
  const { data: statusCountsData } = useOrderStatusCountsQuery({
    skip: !vendorId,
  });

  // Update order status mutation
  const [updateOrderStatus] = useUpdateOrderStatusMutation({
    onCompleted: () => {
      refetch();
    },
  });

  const orders = data?.vendorOrders?.edges?.map((edge) => edge.node) || [];
  const totalCount = data?.vendorOrders?.totalCount || 0;
  const pageInfo = data?.vendorOrders?.pageInfo;

  // Extract unique spas from orders for filter dropdown
  const spaOptions = useMemo(() => {
    const uniqueSpas = new Map<string, string>();
    orders.forEach((order) => {
      if (!uniqueSpas.has(order.spaId)) {
        uniqueSpas.set(order.spaId, order.spaName);
      }
    });
    return Array.from(uniqueSpas.entries()).map(([id, name]) => ({ id, name }));
  }, [orders]);

  // Pagination handlers
  const handleNextPage = () => {
    if (pageInfo?.hasNextPage && pageInfo.endCursor) {
      setCursors([...cursors, pageInfo.endCursor]);
    }
  };

  const handlePreviousPage = () => {
    if (cursors.length > 0) {
      setCursors(cursors.slice(0, -1));
    }
  };

  // Reset pagination when filters change
  const handleFilterChange = (status: OrderStatus | 'all') => {
    setFilterStatus(status);
    setCursors([]); // Reset to first page
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCursors([]); // Reset to first page
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setCursors([]); // Reset to first page
  };

  const handleSpaChange = (newSpaId: string) => {
    setSpaId(newSpaId);
    setCursors([]); // Reset to first page
  };

  // Filter orders by search term (status filtering is handled in query)
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !searchTerm ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.spaName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Get statistics from orderStatusCounts query
  const statusCounts = statusCountsData?.orderStatusCounts;
  const stats = {
    totalOrders: totalCount,
    pending: statusCounts?.pending || 0,
    processing: statusCounts?.processing || 0,
    confirmed: statusCounts?.confirmed || 0,
    shipped: statusCounts?.shipped || 0,
    revenue: orders.reduce((sum, order) => sum + order.total, 0),
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return Clock;
      case OrderStatus.Confirmed:
      case OrderStatus.Processing:
        return Package;
      case OrderStatus.Shipped:
        return Truck;
      case OrderStatus.Delivered:
        return CheckCircle;
      case OrderStatus.Cancelled:
      case OrderStatus.Returned:
        return XCircle;
      case OrderStatus.Disputed:
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const handleQuickAction = async (orderId: string, status: OrderStatus) => {
    if (!vendorId) return;

    await updateOrderStatus({
      variables: {
        input: {
          orderId,
          status,
        },
      },
    });
  };

  // Check if user has vendor organization
  if (!vendorId && !loading) {
    return (
      <div className={`flex items-center justify-center ${isTabView ? 'py-12' : 'min-h-screen'}`}>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Vendor Profile Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              You need to complete your vendor profile setup to access order management.
            </p>
            <Button onClick={() => navigate('/app/vendor/dashboard')} variant="outline">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${isTabView ? 'py-12' : 'min-h-screen'}`}>
        <div className="text-center">
          <Package className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center ${isTabView ? 'py-12' : 'min-h-screen'}`}>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Error Loading Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={isTabView ? 'space-y-6' : 'container mx-auto px-4 py-8 space-y-8'}>
      {/* Header - only show in standalone mode */}
      {!isTabView && (
        <div>
          <h1 className="text-3xl font-light mb-2">Order Management</h1>
          <p className="text-muted-foreground font-light">
            Manage your orders and fulfillment
          </p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light">{stats.totalOrders}</div>
            <p className="text-sm text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Pending
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light">{stats.pending}</div>
            <p className="text-sm text-muted-foreground">Need action</p>
          </CardContent>
        </Card>

        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Processing
              </CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light">{stats.processing}</div>
            <p className="text-sm text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card className="border-subtle shadow-warm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-light">
              ${(stats.revenue / 100).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total sales</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <OrderSearchFilter
        searchTerm={searchTerm}
        filterStatus={filterStatus}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        spaId={spaId}
        onSpaChange={handleSpaChange}
        spaOptions={spaOptions}
      />

      {/* Orders List */}
      <Card className="border-subtle shadow-warm">
        <CardHeader>
          <CardTitle className="font-normal">
            Orders ({filteredOrders.length})
          </CardTitle>
          <CardDescription className="font-light">
            Manage fulfillment and track shipments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);

                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-lg border border-subtle hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                          <StatusIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{order.orderNumber}</h3>
                          <p className="text-sm text-muted-foreground">
                            {order.spaName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <OrderStatusBadge status={order.status} />
                        <div className="text-lg font-medium mt-1">
                          ${order.total.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {order.fulfillment?.trackingNumber && (
                      <div className="mb-3 p-2 bg-accent/30 rounded">
                        <p className="text-xs text-muted-foreground">
                          Tracking: <span className="font-mono">{order.fulfillment.trackingNumber}</span>
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-subtle">
                      <div className="text-sm text-muted-foreground">
                        Subtotal: ${order.subtotal.toFixed(2)} + $
                        {order.shipping.toFixed(2)} shipping + $
                        {order.tax.toFixed(2)} tax
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => navigate(`/app/vendor/orders/${order.id}`)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {order.status === OrderStatus.Pending && (
                          <Button
                            size="sm"
                            className="rounded-full"
                            onClick={() => handleQuickAction(order.id, OrderStatus.Processing)}
                          >
                            Start Processing
                          </Button>
                        )}
                        {order.status === OrderStatus.Processing && (
                          <Button
                            size="sm"
                            className="rounded-full"
                            onClick={() => navigate(`/app/vendor/orders/${order.id}`)}
                          >
                            Mark as Shipped
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {filteredOrders.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-subtle">
              <div className="text-sm text-muted-foreground">
                Showing {filteredOrders.length} of {totalCount} orders
                {cursors.length > 0 && ` (Page ${cursors.length + 1})`}
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={handlePreviousPage}
                  disabled={cursors.length === 0 || loading}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  onClick={handleNextPage}
                  disabled={!pageInfo?.hasNextPage || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default VendorOrdersPage;
