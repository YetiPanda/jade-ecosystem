import { VendorOrder, formatOrderTotal, formatOrderDate } from '../types/orders';
import { OrderStatusBadge } from './OrderStatusBadge';
import './OrdersList.css';

export interface OrdersListProps {
  orders: VendorOrder[];
  loading?: boolean;
  onSelectOrder: (order: VendorOrder) => void;
}

export function OrdersList({ orders, loading, onSelectOrder }: OrdersListProps) {
  if (loading) {
    return <OrdersListSkeleton />;
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <div className="orders-empty-icon">📦</div>
        <h3>No Orders Found</h3>
        <p>No orders match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="orders-list-container">
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="order-row" onClick={() => onSelectOrder(order)}>
                <td className="col-order-number">
                  <span className="order-number">{order.orderNumber}</span>
                </td>
                <td className="col-date">
                  <span className="order-date">{formatOrderDate(order.createdAt)}</span>
                </td>
                <td className="col-customer">
                  <div className="customer-info">
                    <span className="customer-name">{order.spaName}</span>
                    <span className="customer-id">ID: {order.spaId}</span>
                  </div>
                </td>
                <td className="col-items">
                  <span className="items-badge">
                    {order.totalUnits} {order.totalUnits === 1 ? 'unit' : 'units'}
                  </span>
                  <span className="items-count">({order.lineItemCount} items)</span>
                </td>
                <td className="col-total">
                  <strong>{formatOrderTotal(order.total)}</strong>
                </td>
                <td className="col-status">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="col-actions">
                  <button
                    type="button"
                    className="order-view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectOrder(order);
                    }}
                  >
                    View →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrdersListSkeleton() {
  return (
    <div className="orders-list-container">
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="order-row skeleton-row">
                <td><div className="skeleton skeleton-text" /></td>
                <td><div className="skeleton skeleton-text" /></td>
                <td><div className="skeleton skeleton-text" /></td>
                <td><div className="skeleton skeleton-text" /></td>
                <td><div className="skeleton skeleton-text" /></td>
                <td><div className="skeleton skeleton-badge" /></td>
                <td><div className="skeleton skeleton-button" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
