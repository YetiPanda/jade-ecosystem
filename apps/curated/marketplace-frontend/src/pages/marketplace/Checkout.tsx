/**
 * Checkout Page Component
 * Task: T081 - Create Checkout page
 * Features: Address input, payment, order review, multi-vendor order confirmation
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    phone: '',
  });

  const handleCheckout = async () => {
    // TODO: Call checkout mutation
    navigate('/marketplace/orders?success=true');
  };

  return (
    <div className="checkout-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Checkout</h1>

      <div className="checkout-steps" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setStep('shipping')}
          style={{
            flex: 1,
            padding: '0.75rem',
            background: step === 'shipping' ? '#3b82f6' : '#e5e7eb',
            color: step === 'shipping' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          1. Shipping
        </button>
        <button
          onClick={() => setStep('payment')}
          style={{
            flex: 1,
            padding: '0.75rem',
            background: step === 'payment' ? '#3b82f6' : '#e5e7eb',
            color: step === 'payment' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          2. Payment
        </button>
        <button
          onClick={() => setStep('review')}
          style={{
            flex: 1,
            padding: '0.75rem',
            background: step === 'review' ? '#3b82f6' : '#e5e7eb',
            color: step === 'review' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
          }}
        >
          3. Review
        </button>
      </div>

      {step === 'shipping' && (
        <div className="shipping-form">
          <h2>Shipping Address</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <input type="text" placeholder="First Name" style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }} />
            <input type="text" placeholder="Last Name" style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }} />
            <input type="text" placeholder="Street Address" style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input type="text" placeholder="City" style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }} />
              <input type="text" placeholder="State" style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }} />
            </div>
            <input type="text" placeholder="ZIP Code" style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }} />
            <input type="tel" placeholder="Phone" style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }} />
          </div>
          <button
            onClick={() => setStep('payment')}
            style={{
              width: '100%',
              marginTop: '1rem',
              padding: '1rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
            }}
          >
            Continue to Payment
          </button>
        </div>
      )}

      {step === 'payment' && (
        <div className="payment-form">
          <h2>Payment Information</h2>
          <p>Payment processing form would go here</p>
          <button
            onClick={() => setStep('review')}
            style={{
              width: '100%',
              marginTop: '1rem',
              padding: '1rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
            }}
          >
            Continue to Review
          </button>
        </div>
      )}

      {step === 'review' && (
        <div className="order-review">
          <h2>Review Order</h2>
          <p>Order summary would go here</p>
          <button
            onClick={handleCheckout}
            style={{
              width: '100%',
              marginTop: '1rem',
              padding: '1rem',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1.125rem',
              fontWeight: '600',
            }}
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}
