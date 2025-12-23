/**
 * Order Detail Panel Component
 * Sprint B.4: Order Management
 *
 * Slide-out panel displaying comprehensive order details including:
 * - Order status and update controls
 * - Spa contact information
 * - Order items breakdown
 * - Shipping information
 * - Order timeline/history
 */

import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import {
  Package,
  MessageSquare,
  Clock,
  MapPin,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { OrderStatus } from '../../graphql/generated';
import { OrderStatusBadge } from './OrderStatusBadge';
import { StatusUpdateDropdown } from './StatusUpdateDropdown';
import { ShippingInfoForm, ShippingInfo } from './ShippingInfoForm';

// This will come from GraphQL generated types
interface VendorOrder {
  id: string;
  orderNumber: string;
  spaId: string;
  spaName: string;
  spaContact: {
    name: string;
    email: string;
    phone?: string | null;
  };
  shippingAddress: {
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    sku: string;
    imageUrl?: string | null;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  statusHistory: Array<{
    status: OrderStatus;
    changedAt: string;
    changedBy: string;
    note?: string | null;
  }>;
  fulfillment?: {
    carrier?: string | null;
    trackingNumber?: string | null;
    trackingUrl?: string | null;
    estimatedDelivery?: string | null;
    actualDelivery?: string | null;
  } | null;
  conversationId?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OrderDetailPanelProps {
  order: VendorOrder | null;
  open: boolean;
  onClose: () => void;
  onStatusUpdate?: (orderId: string, status: OrderStatus, note?: string) => void;
  onSendMessage?: (spaId: string) => void;
  onAddShippingInfo?: (orderId: string, shippingInfo: ShippingInfo) => void;
}

export function OrderDetailPanel({
  order,
  open,
  onClose,
  onStatusUpdate,
  onSendMessage,
  onAddShippingInfo,
}: OrderDetailPanelProps) {
  if (!order) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Order {order.orderNumber}</SheetTitle>
          <SheetDescription>
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status Section */}
          <div>
            <h3 className="text-sm font-medium mb-2">Current Status</h3>
            <OrderStatusBadge status={order.status} />

            {onStatusUpdate && (
              <div className="mt-4">
                <StatusUpdateDropdown
                  orderId={order.id}
                  currentStatus={order.status}
                  onStatusUpdate={onStatusUpdate}
                />
              </div>
            )}
          </div>

          {/* Spa Information */}
          <div>
            <h3 className="text-sm font-medium mb-3">Spa Information</h3>
            <Card className="p-4 border-subtle">
              <div className="space-y-2">
                <div>
                  <p className="font-medium">{order.spaName}</p>
                  <p className="text-sm text-muted-foreground">{order.spaContact.name}</p>
                  <p className="text-sm text-muted-foreground">{order.spaContact.email}</p>
                  {order.spaContact.phone && (
                    <p className="text-sm text-muted-foreground">{order.spaContact.phone}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-subtle">
                  <div className="flex items-start text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p>{order.shippingAddress.line1}</p>
                      {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                        {order.shippingAddress.postalCode}
                      </p>
                    </div>
                  </div>
                </div>

                {onSendMessage && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => onSendMessage(order.spaId)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-sm font-medium mb-3">Order Items</h3>
            <Card className="p-4 border-subtle">
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className={`flex gap-3 ${
                      index < order.items.length - 1 ? 'pb-3 border-b border-subtle' : ''
                    }`}
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded bg-accent flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">
                        SKU: {item.sku} · Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">${item.totalPrice.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">
                        ${item.unitPrice.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-4 pt-4 border-t border-subtle space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-base pt-2 border-t border-subtle">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Shipping Information */}
          <div>
            <h3 className="text-sm font-medium mb-3">Shipping Information</h3>
            <Card className="p-4 border-subtle">
              {order.fulfillment?.trackingNumber ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Carrier</span>
                    <span>{order.fulfillment.carrier || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tracking Number</span>
                    <span className="font-mono text-xs">
                      {order.fulfillment.trackingNumber}
                    </span>
                  </div>
                  {order.fulfillment.trackingUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => window.open(order.fulfillment!.trackingUrl!, '_blank')}
                    >
                      Track Shipment
                    </Button>
                  )}
                  {order.fulfillment.estimatedDelivery && (
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-muted-foreground">Est. Delivery</span>
                      <span>
                        {new Date(order.fulfillment.estimatedDelivery).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              ) : onAddShippingInfo ? (
                <ShippingInfoForm
                  orderId={order.id}
                  onSubmit={onAddShippingInfo}
                />
              ) : (
                <div className="text-sm text-muted-foreground">
                  <p>Shipping information not yet added</p>
                </div>
              )}
            </Card>
          </div>

          {/* Order Timeline */}
          <div>
            <h3 className="text-sm font-medium mb-3">Order Timeline</h3>
            <Card className="p-4 border-subtle">
              <div className="space-y-4">
                {order.statusHistory
                  .slice()
                  .reverse()
                  .map((change, index) => (
                    <div key={`${change.changedAt}-${index}`} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                        {index < order.statusHistory.length - 1 && (
                          <div className="w-0.5 h-full bg-muted mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm font-medium">Status: {change.status}</p>
                        <p className="text-xs text-muted-foreground">
                          by {change.changedBy}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(change.changedAt)}
                        </p>
                        {change.note && (
                          <p className="text-sm text-muted-foreground mt-1 italic">
                            "{change.note}"
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default OrderDetailPanel;
