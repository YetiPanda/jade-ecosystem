import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_VENDOR_ORDERS } from '../graphql/orders.queries';
import { OrderFilters } from '../components/OrderFilters';
import { OrdersList } from '../components/OrdersList';
import { OrderDetailModal } from '../components/OrderDetailModal';
import { OrderFilters as OrderFiltersType, VendorOrder, OrdersQueryResult } from '../types/orders';
import './Page.css';

const PAGE_SIZE = 20;

export function OrdersPage() {
  const [filters, setFilters] = useState<OrderFiltersType>({});
  const [page, setPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null);

  const { data, loading, error, refetch } = useQuery<{ vendorOrders: OrdersQueryResult }>(
    GET_VENDOR_ORDERS,
    {
      variables: {
        input: {
          filters,
          limit: PAGE_SIZE,
          offset: page * PAGE_SIZE,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        },
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    }
  );

  const result = data?.vendorOrders;
  const orders = result?.orders || [];
  const totalCount = result?.totalCount || 0;
  const hasMore = result?.hasMore || false;

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const currentPage = page + 1;

  const handleFilterChange = (newFilters: OrderFiltersType) => {
    setFilters(newFilters);
    setPage(0); // Reset to first page when filters change
  };

  const handleResetFilters = () => {
    setFilters({});
    setPage(0);
  };

  const handleOrderSelect = (order: VendorOrder) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleOrderUpdate = () => {
    refetch();
    setSelectedOrder(null);
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>Manage and fulfill your orders</p>
        </div>
        {totalCount > 0 && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.875rem', color: '#888', marginBottom: '0.25rem' }}>
              Total Orders
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#646cff' }}>
              {totalCount.toLocaleString()}
            </div>
          </div>
        )}
      </div>

      <div className="page-content">
        {/* Error State */}
        {error && (
          <div className="info-box" style={{ borderColor: '#ef4444' }}>
            <h3>⚠️ Error Loading Orders</h3>
            <p style={{ color: '#ef4444' }}>
              {error.message || 'Failed to load orders. Please try again.'}
            </p>
            <p className="info-note">
              <strong>Tip:</strong> Make sure the backend GraphQL server is running and accessible.
            </p>
          </div>
        )}

        {/* Filters */}
        <OrderFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Orders List */}
        <OrdersList orders={orders} loading={loading} onSelectOrder={handleOrderSelect} />

        {/* Pagination */}
        {!loading && totalCount > 0 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, totalCount)} of{' '}
              {totalCount.toLocaleString()} orders
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-btn"
                onClick={handlePreviousPage}
                disabled={page === 0}
              >
                ← Previous
              </button>
              <div className="pagination-pages">
                Page {currentPage} of {totalPages}
              </div>
              <button className="pagination-btn" onClick={handleNextPage} disabled={!hasMore}>
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Sprint Completion Info */}
        {!loading && !error && orders.length > 0 && (
          <div className="info-box">
            <h3>✅ Sprint B.4 Complete - Order Management</h3>
            <p>
              Full order management system is now operational. View order details, update status,
              add tracking information, and manage fulfillment.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <strong>Total Orders:</strong> {totalCount.toLocaleString()}
              <br />
              <strong>Page Size:</strong> {PAGE_SIZE} orders per page
              <br />
              <strong>Features:</strong> 8 order statuses, filtering, search, status updates, tracking
            </div>
            <p className="info-note">
              <strong>Next Sprint (C.1):</strong> Messaging System - Vendor-spa communication,
              message threads, notifications.
            </p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          orderId={selectedOrder.id}
          onClose={handleCloseModal}
          onUpdate={handleOrderUpdate}
        />
      )}
    </div>
  );
}
