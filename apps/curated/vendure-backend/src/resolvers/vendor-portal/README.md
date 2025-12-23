# Vendor Portal Resolvers

Feature 011: Vendor Portal MVP

## Implemented Resolvers

### Queries

- `vendorDashboard` (Sprint B.2) - Dashboard metrics with date range filtering

### Mutations

#### Order Management (Sprint B.4)

- `updateOrderStatus` - Update order status with validation
- `addShippingInfo` - Add carrier and tracking information

## Order Status Workflow

The `updateOrderStatus` mutation enforces the following status transitions:

```
PENDING → CONFIRMED | CANCELLED
CONFIRMED → PROCESSING | CANCELLED
PROCESSING → SHIPPED | CANCELLED
SHIPPED → DELIVERED | RETURNED
DELIVERED → RETURNED | DISPUTED
RETURNED → DISPUTED
CANCELLED → (terminal state)
DISPUTED → (terminal state)
```

Invalid transitions are rejected with a clear error message.

## Database Schema Requirements

The order resolvers expect the following tables:

### `jade.vendor_order`
- Primary order table with spa info, totals, status
- Fields: id, order_number, spa_id, spa_name, status, subtotal, shipping, tax, total
- Spa contact: spa_contact_name, spa_contact_email, spa_contact_phone
- Shipping address: shipping_line1, shipping_line2, shipping_city, shipping_state, shipping_postal_code, shipping_country

### `jade.order_status_history`
- Audit trail of all status changes
- Fields: order_id, status, changed_by, changed_at, note

### `jade.order_fulfillment`
- Shipping and tracking information
- Fields: order_id, carrier, tracking_number, tracking_url, estimated_delivery, actual_delivery

### `jade.order_item`
- Line items for each order
- Fields: order_id, product_id, product_name, sku, image_url, quantity, unit_price, total_price

## Integration Notes

Currently using mock database queries. These tables either need to be created via migration, or the resolvers should be updated to query Vendure's native order tables.

For production use:
1. Create migration for the required tables, OR
2. Adapt resolvers to use Vendure's existing order system
3. Enable authentication checks (currently commented out for testing)

## Testing

To test the mutations:

```graphql
# Update order status
mutation {
  updateOrderStatus(input: {
    orderId: "123"
    status: PROCESSING
    note: "Order is being prepared"
  }) {
    id
    status
    statusHistory {
      status
      changedAt
      changedBy
      note
    }
  }
}

# Add shipping info
mutation {
  addShippingInfo(input: {
    orderId: "123"
    carrier: "FedEx"
    trackingNumber: "1Z999AA10123456789"
    estimatedDelivery: "2025-01-05"
  }) {
    id
    fulfillment {
      carrier
      trackingNumber
      trackingUrl
      estimatedDelivery
    }
  }
}
```
