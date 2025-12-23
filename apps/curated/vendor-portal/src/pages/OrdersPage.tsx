import './Page.css';

export function OrdersPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Orders</h1>
        <p>Manage and fulfill your orders</p>
      </div>

      <div className="page-content">
        <div className="info-box">
          <h3>📦 Order Management</h3>
          <p>
            This page will display your orders with:
          </p>
          <ul style={{ color: '#aaa', lineHeight: '1.8', marginLeft: '1.5rem' }}>
            <li>Real-time order status tracking (8 status states)</li>
            <li>Filtering by status, date range, and spa</li>
            <li>Order details and line items</li>
            <li>Fulfillment actions and shipping updates</li>
            <li>Order history and export capabilities</li>
          </ul>
          <p className="info-note">
            <strong>Sprint B.4:</strong> Order Management UI (Week 8)<br />
            <strong>GraphQL:</strong> vendorOrders query already defined
          </p>
        </div>
      </div>
    </div>
  );
}
