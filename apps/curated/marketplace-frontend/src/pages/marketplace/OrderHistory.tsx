/**
 * OrderHistory Page Component
 * Task: T082 - Create OrderHistory page
 * Features: Order list, tracking, reorder functionality
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Load orders from GraphQL (myOrders query)
    setTimeout(() => {
      setOrders([
        {
          id: '1',
          orderNumber: 'ORD-2025-001',
          placedAt: new Date('2025-01-15'),
          fulfillmentStatus: 'SHIPPED',
          total: 45000,
          itemCount: 3,
          vendorCount: 2,
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleReorder = async (orderId: string) => {
    // TODO: Call reorder mutation
    navigate('/marketplace/cart');
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="order-history" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Order History</h1>

      {orders.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>No orders yet</p>
          <button
            onClick={() => navigate('/marketplace')}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
            }}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              className="order-card"
              style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3>{order.orderNumber}</h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {new Date(order.placedAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                    ${(order.total / 100).toFixed(2)}
                  </p>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      background: '#10b981',
                      color: 'white',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                    }}
                  >
                    {order.fulfillmentStatus}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={() => navigate(`/marketplace/orders/${order.id}`)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                  }}
                >
                  View Details
                </button>
                <button
                  onClick={() => handleReorder(order.id)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                  }}
                >
                  Reorder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
