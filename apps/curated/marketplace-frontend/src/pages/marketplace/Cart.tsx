/**
 * Cart Page Component
 * Task: T080 - Create Cart page
 * Features: Shopping cart with vendor grouping, pricing tiers, quantity updates
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Load cart from GraphQL (myCart query)
    setTimeout(() => {
      setCart({
        orderId: '1',
        items: [],
        vendorCarts: [],
        totalItems: 0,
        subtotal: 0,
        total: 0,
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) return <div className="loading">Loading cart...</div>;

  return (
    <div className="cart-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Shopping Cart</h1>
      {cart?.items.length === 0 ? (
        <div className="empty-cart" style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Your cart is empty</p>
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
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">{/* Cart items render here */}</div>
          <div
            className="cart-summary"
            style={{
              marginTop: '2rem',
              padding: '1.5rem',
              background: '#f9fafb',
              borderRadius: '0.5rem',
            }}
          >
            <h3>Order Summary</h3>
            <p>Total: ${(cart?.total / 100 || 0).toFixed(2)}</p>
            <button
              onClick={() => navigate('/marketplace/checkout')}
              style={{
                width: '100%',
                padding: '1rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                marginTop: '1rem',
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
