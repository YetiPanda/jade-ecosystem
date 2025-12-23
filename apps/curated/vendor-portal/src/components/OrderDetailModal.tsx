import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ORDER_DETAIL, UPDATE_ORDER_STATUS } from '../graphql/orders.queries';
import {
  VendorOrder,
  OrderStatus,
  formatOrderTotal,
  formatOrderDate,
  getAvailableTransitions,
  ORDER_STATUS_LABELS,
} from '../types/orders';
import { OrderStatusBadge } from './OrderStatusBadge';
import './OrderDetailModal.css';

export interface OrderDetailModalProps {
  orderId: string;
  onClose: () => void;
  onUpdate?: () => void;
}

export function OrderDetailModal({ orderId, onClose, onUpdate }: OrderDetailModalProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [vendorNotes, setVendorNotes] = useState('');

  const { data, loading, error } = useQuery(GET_ORDER_DETAIL, {
    variables: { orderId },
    fetchPolicy: 'network-only',
  });

  const [updateStatus, { loading: updateLoading }] = useMutation(UPDATE_ORDER_STATUS, {
    onCompleted: () => {
      setIsUpdatingStatus(false);
      setSelectedStatus(null);
      setTrackingNumber('');
      setCarrier('');
      setVendorNotes('');
      onUpdate?.();
    },
  });

  const order: VendorOrder | null = data?.vendorOrder || null;

  const handleUpdateStatus = async () => {
    if (!selectedStatus) return;

    await updateStatus({
      variables: {
        input: {
          orderId,
          status: selectedStatus,
          trackingNumber: trackingNumber || null,
          carrier: carrier || null,
          vendorNotes: vendorNotes || null,
        },
      },
    });
  };

  const availableTransitions = order ? getAvailableTransitions(order.status) : [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container order-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">
              Order {order?.orderNumber || orderId}
            </h2>
            {order && (
              <p className="modal-subtitle">
                Placed {formatOrderDate(order.createdAt)}
              </p>
            )}
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-content">
          {loading && <div className="modal-loading">Loading order details...</div>}

          {error && (
            <div className="modal-error">
              Failed to load order details: {error.message}
            </div>
          )}

          {order && (
            <>
              {/* Status Section */}
              <div className="order-section">
                <div className="order-section-header">
                  <h3>Order Status</h3>
                  {!isUpdatingStatus && availableTransitions.length > 0 && (
                    <button
                      className="btn-secondary"
                      onClick={() => setIsUpdatingStatus(true)}
                    >
                      Update Status
                    </button>
                  )}
                </div>
                <div className="order-section-content">
                  <OrderStatusBadge status={order.status} />

                  {isUpdatingStatus && (
                    <div className="status-update-form">
                      <div className="form-group">
                        <label>New Status</label>
                        <select
                          className="form-select"
                          value={selectedStatus || ''}
                          onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                        >
                          <option value="">Select status...</option>
                          {availableTransitions.map((status) => (
                            <option key={status} value={status}>
                              {ORDER_STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedStatus === OrderStatus.SHIPPED && (
                        <>
                          <div className="form-group">
                            <label>Tracking Number</label>
                            <input
                              type="text"
                              className="form-input"
                              value={trackingNumber}
                              onChange={(e) => setTrackingNumber(e.target.value)}
                              placeholder="1Z999AA10123456784"
                            />
                          </div>
                          <div className="form-group">
                            <label>Carrier</label>
                            <input
                              type="text"
                              className="form-input"
                              value={carrier}
                              onChange={(e) => setCarrier(e.target.value)}
                              placeholder="UPS, FedEx, USPS, etc."
                            />
                          </div>
                        </>
                      )}

                      <div className="form-group">
                        <label>Notes (optional)</label>
                        <textarea
                          className="form-textarea"
                          value={vendorNotes}
                          onChange={(e) => setVendorNotes(e.target.value)}
                          placeholder="Add any notes about this status update..."
                          rows={3}
                        />
                      </div>

                      <div className="form-actions">
                        <button
                          className="btn-secondary"
                          onClick={() => {
                            setIsUpdatingStatus(false);
                            setSelectedStatus(null);
                          }}
                          disabled={updateLoading}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn-primary"
                          onClick={handleUpdateStatus}
                          disabled={!selectedStatus || updateLoading}
                        >
                          {updateLoading ? 'Updating...' : 'Update Status'}
                        </button>
                      </div>
                    </div>
                  )}

                  {order.trackingNumber && (
                    <div className="tracking-info">
                      <p>
                        <strong>Tracking:</strong> {order.trackingNumber}
                      </p>
                      {order.carrier && <p><strong>Carrier:</strong> {order.carrier}</p>}
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Section */}
              <div className="order-section">
                <h3>Customer Information</h3>
                <div className="order-section-content">
                  <p className="customer-name">{order.spaName}</p>
                  <p className="customer-id">ID: {order.spaId}</p>

                  <div className="shipping-address">
                    <h4>Shipping Address</h4>
                    <p>{order.shippingAddress.name}</p>
                    {order.shippingAddress.businessName && (
                      <p>{order.shippingAddress.businessName}</p>
                    )}
                    <p>{order.shippingAddress.addressLine1}</p>
                    {order.shippingAddress.addressLine2 && (
                      <p>{order.shippingAddress.addressLine2}</p>
                    )}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="order-section">
                <h3>Order Items ({order.lineItemCount})</h3>
                <div className="line-items">
                  {order.lineItems.map((item) => (
                    <div key={item.id} className="line-item">
                      {item.productImageUrl && (
                        <img
                          src={item.productImageUrl}
                          alt={item.productName}
                          className="line-item-image"
                        />
                      )}
                      <div className="line-item-details">
                        <p className="line-item-name">{item.productName}</p>
                        {item.variantName && (
                          <p className="line-item-variant">{item.variantName}</p>
                        )}
                        <p className="line-item-sku">SKU: {item.sku}</p>
                      </div>
                      <div className="line-item-quantity">
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <div className="line-item-price">
                        <p className="line-item-unit-price">
                          {formatOrderTotal(item.unitPrice)} ea
                        </p>
                        <p className="line-item-subtotal">
                          {formatOrderTotal(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="order-section">
                <h3>Order Summary</h3>
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatOrderTotal(order.subtotal)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax</span>
                    <span>{formatOrderTotal(order.tax)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>{formatOrderTotal(order.shipping)}</span>
                  </div>
                  <div className="summary-row summary-total">
                    <strong>Total</strong>
                    <strong>{formatOrderTotal(order.total)}</strong>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {(order.customerNotes || order.vendorNotes) && (
                <div className="order-section">
                  <h3>Notes</h3>
                  <div className="order-section-content">
                    {order.customerNotes && (
                      <div className="note-block">
                        <h4>Customer Notes</h4>
                        <p>{order.customerNotes}</p>
                      </div>
                    )}
                    {order.vendorNotes && (
                      <div className="note-block">
                        <h4>Vendor Notes</h4>
                        <p>{order.vendorNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
