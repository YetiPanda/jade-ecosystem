/**
 * Vendor Order Detail Page
 * Week 7: Order Management & Fulfillment
 *
 * Features:
 * - View complete order details
 * - Update fulfillment status
 * - Add tracking information
 * - Print shipping labels
 * - View customer shipping information
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useAuth } from '../../contexts/AuthContext';
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Printer,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Calendar,
  Download,
} from 'lucide-react';

// GraphQL Queries
const VENDOR_ORDER_DETAIL = gql`
  query VendorOrderDetail($id: ID!) {
    order(id: $id) {
      id
      orderNumber
      placedAt
      fulfillmentStatus
      paymentStatus
      total
      vendorOrders {
        vendorId
        orderLineIds
        subtotal
        shippingCost
        vendorTotal
        fulfillmentStatus
        trackingNumber
        shippedAt
      }
      lines {
        id
        productVariant {
          id
          name
          sku
          product {
            id
            name
            featuredAsset {
              preview
            }
          }
        }
        quantity
        unitPrice
        linePrice
      }
      shippingAddress {
        firstName
        lastName
        company
        street
        street2
        city
        state
        zipCode
        country
        phone
      }
      subtotal
      tax
      shipping
      discount
      notes
    }
  }
`;

const UPDATE_FULFILLMENT = gql`
  mutation UpdateVendorFulfillment(
    $orderId: ID!
    $vendorId: ID!
    $status: FulfillmentStatus!
    $trackingNumber: String
  ) {
    updateFulfillment(
      orderId: $orderId
      vendorId: $vendorId
      status: $status
      trackingNumber: $trackingNumber
    ) {
      id
      orderNumber
      fulfillmentStatus
      vendorOrders {
        vendorId
        fulfillmentStatus
        trackingNumber
        shippedAt
      }
    }
  }
`;

enum FulfillmentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
}

export function VendorOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('USPS');
  const { user } = useAuth();

  // Get vendor ID from auth context
  const vendorId = user?.vendorOrganization?.id;

  const { data, loading, error, refetch } = useQuery(VENDOR_ORDER_DETAIL, {
    variables: { id: orderId },
    skip: !orderId, // Don't run query if no order ID
  });

  const [updateFulfillment, { loading: updating }] = useMutation(UPDATE_FULFILLMENT, {
    onCompleted: () => {
      refetch();
      setTrackingNumber('');
    },
  });

  // Check if user has vendor organization
  if (!vendorId && !loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Order Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {error?.message || 'This order could not be loaded.'}
            </p>
            <Button onClick={() => navigate('/app/vendor/orders')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const order = data.order;
  const vendorOrder = order.vendorOrders.find((vo: any) => vo.vendorId === vendorId);

  if (!vendorOrder) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Not Your Order
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This order does not contain any of your products.
            </p>
            <Button onClick={() => navigate('/app/vendor/orders')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter order lines to only show this vendor's products
  const vendorLines = order.lines.filter((line: any) =>
    vendorOrder.orderLineIds.includes(line.id)
  );

  const handleUpdateStatus = async (status: FulfillmentStatus) => {
    if (!vendorId) return;

    await updateFulfillment({
      variables: {
        orderId: order.id,
        vendorId,
        status,
        trackingNumber: status === FulfillmentStatus.SHIPPED ? trackingNumber : undefined,
      },
    });
  };

  const handlePrintLabel = () => {
    // TODO: Integrate with shipping label API (ShipStation, EasyPost, etc.)
    console.log('Print shipping label for', order.orderNumber);
    alert('Shipping label generation will be integrated with ShipStation API');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'FULFILLED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/app/vendor/orders')}
            className="rounded-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-light">Order {order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground">
              Placed {new Date(order.placedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Badge className={getStatusColor(vendorOrder.fulfillmentStatus)}>
          {vendorOrder.fulfillmentStatus}
        </Badge>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Items and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="border-subtle shadow-warm">
            <CardHeader>
              <CardTitle className="font-normal">Your Items</CardTitle>
              <CardDescription className="font-light">
                {vendorLines.length} product{vendorLines.length !== 1 ? 's' : ''} to fulfill
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vendorLines.map((line: any) => (
                  <div
                    key={line.id}
                    className="flex items-start space-x-4 p-4 rounded-lg bg-accent/20"
                  >
                    <div className="w-20 h-20 bg-accent rounded-lg overflow-hidden flex-shrink-0">
                      {line.productVariant.product.featuredAsset?.preview ? (
                        <img
                          src={line.productVariant.product.featuredAsset.preview}
                          alt={line.productVariant.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{line.productVariant.product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {line.productVariant.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        SKU: {line.productVariant.sku}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm">
                          Quantity: <span className="font-medium">{line.quantity}</span>
                        </p>
                        <p className="font-medium">
                          ${(line.linePrice / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Summary */}
              <div className="mt-6 pt-6 border-t border-subtle space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${(vendorOrder.subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${(vendorOrder.shippingCost / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-medium pt-2 border-t">
                  <span>Your Total</span>
                  <span>${(vendorOrder.vendorTotal / 100).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="border-subtle shadow-warm">
            <CardHeader>
              <CardTitle className="font-normal">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    {order.shippingAddress.company && (
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.company}
                      </p>
                    )}
                    <p className="text-sm mt-1">{order.shippingAddress.street}</p>
                    {order.shippingAddress.street2 && (
                      <p className="text-sm">{order.shippingAddress.street2}</p>
                    )}
                    <p className="text-sm">
                      {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.zipCode}
                    </p>
                    <p className="text-sm">{order.shippingAddress.country}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 pt-3 border-t">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm">{order.shippingAddress.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order.notes && (
            <Card className="border-subtle shadow-warm">
              <CardHeader>
                <CardTitle className="font-normal">Special Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Fulfillment Actions */}
        <div className="space-y-6">
          {/* Fulfillment Status */}
          <Card className="border-subtle shadow-warm">
            <CardHeader>
              <CardTitle className="font-normal">Fulfillment</CardTitle>
              <CardDescription className="font-light">
                Update order status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Timeline */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  {vendorOrder.fulfillmentStatus === 'PENDING' ? (
                    <Clock className="h-5 w-5 text-yellow-600" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">Order Received</p>
                    <p className="text-xs text-muted-foreground">Awaiting processing</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {vendorOrder.fulfillmentStatus === 'PROCESSING' ? (
                    <Package className="h-5 w-5 text-blue-600" />
                  ) : vendorOrder.fulfillmentStatus === 'PENDING' ? (
                    <Package className="h-5 w-5 text-gray-400" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">Processing</p>
                    <p className="text-xs text-muted-foreground">Preparing for shipment</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {vendorOrder.fulfillmentStatus === 'SHIPPED' ||
                  vendorOrder.fulfillmentStatus === 'FULFILLED' ? (
                    <Truck className="h-5 w-5 text-purple-600" />
                  ) : (
                    <Truck className="h-5 w-5 text-gray-400" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">Shipped</p>
                    {vendorOrder.shippedAt && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(vendorOrder.shippedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tracking Number */}
              {vendorOrder.trackingNumber && (
                <div className="p-3 bg-accent/30 rounded-lg">
                  <Label className="text-xs text-muted-foreground">Tracking Number</Label>
                  <p className="font-mono text-sm mt-1">{vendorOrder.trackingNumber}</p>
                </div>
              )}

              {/* Actions based on current status */}
              <div className="space-y-3 pt-4 border-t">
                {vendorOrder.fulfillmentStatus === 'PENDING' && (
                  <Button
                    onClick={() => handleUpdateStatus(FulfillmentStatus.PROCESSING)}
                    disabled={updating}
                    className="w-full rounded-full"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Start Processing
                  </Button>
                )}

                {vendorOrder.fulfillmentStatus === 'PROCESSING' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="tracking">Tracking Number</Label>
                      <Input
                        id="tracking"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        placeholder="Enter tracking number"
                        className="rounded-full"
                      />
                    </div>
                    <Button
                      onClick={() => handleUpdateStatus(FulfillmentStatus.SHIPPED)}
                      disabled={updating || !trackingNumber}
                      className="w-full rounded-full"
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Mark as Shipped
                    </Button>
                  </>
                )}

                {(vendorOrder.fulfillmentStatus === 'SHIPPED' ||
                  vendorOrder.fulfillmentStatus === 'FULFILLED') && (
                  <div className="text-center py-4">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium">Order Shipped</p>
                    <p className="text-xs text-muted-foreground">
                      Tracking: {vendorOrder.trackingNumber}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Label */}
          <Card className="border-subtle shadow-warm">
            <CardHeader>
              <CardTitle className="font-normal">Shipping Label</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handlePrintLabel}
                variant="outline"
                className="w-full rounded-full"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Shipping Label
              </Button>
              <Button variant="outline" className="w-full rounded-full">
                <Download className="h-4 w-4 mr-2" />
                Download Packing Slip
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Labels are generated via ShipStation
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default VendorOrderDetailPage;
