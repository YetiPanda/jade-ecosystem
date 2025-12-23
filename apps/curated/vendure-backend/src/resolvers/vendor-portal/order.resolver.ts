/**
 * Vendor Portal Order Resolvers
 * Feature 011: Vendor Portal MVP
 * Sprint B.4: Order Management
 *
 * Implements order status updates and shipping information management
 */

import { AppDataSource } from '../../config/database';
import { orderNotificationService } from '../../services/order-notification.service';

interface Context {
  user?: {
    id: string;
    role: string;
    vendorId?: string;
  };
}

interface UpdateOrderStatusInput {
  orderId: string;
  status: string;
  note?: string;
}

interface AddShippingInfoInput {
  orderId: string;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery?: string;
}

/**
 * Status transition rules
 * Matches frontend StatusUpdateDropdown logic
 */
const STATUS_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'RETURNED'],
  DELIVERED: ['RETURNED', 'DISPUTED'],
  CANCELLED: [], // Terminal state
  RETURNED: ['DISPUTED'],
  DISPUTED: [], // Terminal state
};

/**
 * Validate status transition
 */
function isValidStatusTransition(currentStatus: string, newStatus: string): boolean {
  const allowedTransitions = STATUS_TRANSITIONS[currentStatus] || [];
  return allowedTransitions.includes(newStatus);
}

/**
 * Update order status mutation
 *
 * @example
 * mutation {
 *   updateOrderStatus(input: {
 *     orderId: "123"
 *     status: PROCESSING
 *     note: "Order is being prepared"
 *   }) {
 *     id
 *     status
 *     statusHistory {
 *       status
 *       changedAt
 *       changedBy
 *       note
 *     }
 *   }
 * }
 */
export async function updateOrderStatus(
  _parent: any,
  args: { input: UpdateOrderStatusInput },
  context: Context
) {
  console.log('[updateOrderStatus] Mutation called with input:', args.input);
  console.log('[updateOrderStatus] Context:', context);

  // TODO: Re-enable authentication once auth is properly set up
  // For now, allow unauthenticated access to test the integration
  // if (!context.user) {
  //   throw new Error('Authentication required');
  // }

  const { orderId, status, note } = args.input;
  const userId = context.user?.id || 'system';
  const vendorId = context.user?.vendorId || context.user?.id;

  try {
    // Get current order status
    // Note: In a real implementation, this would query Vendure's order table
    // For now, we'll use a mock implementation that demonstrates the workflow
    const currentOrder = await AppDataSource.query(
      `
      SELECT id, status, vendor_id as "vendorId"
      FROM jade.vendor_order
      WHERE id = $1
      `,
      [orderId]
    );

    if (!currentOrder[0]) {
      throw new Error(`Order ${orderId} not found`);
    }

    const currentStatus = currentOrder[0].status;

    // Verify vendor owns this order
    // TODO: Re-enable once vendor authentication is set up
    // if (currentOrder[0].vendorId !== vendorId) {
    //   throw new Error('You do not have permission to update this order');
    // }

    // Validate status transition
    if (!isValidStatusTransition(currentStatus, status)) {
      throw new Error(
        `Invalid status transition from ${currentStatus} to ${status}. ` +
        `Allowed transitions: ${STATUS_TRANSITIONS[currentStatus].join(', ')}`
      );
    }

    // Update order status
    await AppDataSource.query(
      `
      UPDATE jade.vendor_order
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      `,
      [status, orderId]
    );

    // Add status change to history
    await AppDataSource.query(
      `
      INSERT INTO jade.order_status_history (
        order_id, status, changed_by, changed_at, note
      )
      VALUES ($1, $2, $3, NOW(), $4)
      `,
      [orderId, status, userId, note || null]
    );

    console.log(`[updateOrderStatus] Order ${orderId} status updated to ${status}`);

    // Send notification (Task B.4.10)
    await orderNotificationService.notifyOrderStatusChanged({
      orderId,
      oldStatus: currentStatus,
      newStatus: status,
      changedBy: userId,
      note,
      timestamp: new Date(),
    });

    // Return updated order with status history
    return getVendorOrderById(orderId);
  } catch (error) {
    console.error('[updateOrderStatus] Error:', error);
    throw error;
  }
}

/**
 * Add shipping information mutation
 *
 * @example
 * mutation {
 *   addShippingInfo(input: {
 *     orderId: "123"
 *     carrier: "FedEx"
 *     trackingNumber: "1Z999AA10123456789"
 *     estimatedDelivery: "2025-01-05"
 *   }) {
 *     id
 *     fulfillment {
 *       carrier
 *       trackingNumber
 *       estimatedDelivery
 *     }
 *   }
 * }
 */
export async function addShippingInfo(
  _parent: any,
  args: { input: AddShippingInfoInput },
  context: Context
) {
  console.log('[addShippingInfo] Mutation called with input:', args.input);
  console.log('[addShippingInfo] Context:', context);

  // TODO: Re-enable authentication once auth is properly set up
  // if (!context.user) {
  //   throw new Error('Authentication required');
  // }

  const { orderId, carrier, trackingNumber, estimatedDelivery } = args.input;
  const vendorId = context.user?.vendorId || context.user?.id;

  try {
    // Verify order exists and vendor owns it
    const order = await AppDataSource.query(
      `
      SELECT id, vendor_id as "vendorId"
      FROM jade.vendor_order
      WHERE id = $1
      `,
      [orderId]
    );

    if (!order[0]) {
      throw new Error(`Order ${orderId} not found`);
    }

    // TODO: Re-enable once vendor authentication is set up
    // if (order[0].vendorId !== vendorId) {
    //   throw new Error('You do not have permission to update this order');
    // }

    // Generate tracking URL based on carrier
    const trackingUrl = generateTrackingUrl(carrier, trackingNumber);

    // Update or insert fulfillment information
    await AppDataSource.query(
      `
      INSERT INTO jade.order_fulfillment (
        order_id, carrier, tracking_number, tracking_url, estimated_delivery
      )
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (order_id)
      DO UPDATE SET
        carrier = EXCLUDED.carrier,
        tracking_number = EXCLUDED.tracking_number,
        tracking_url = EXCLUDED.tracking_url,
        estimated_delivery = EXCLUDED.estimated_delivery,
        updated_at = NOW()
      `,
      [orderId, carrier, trackingNumber, trackingUrl, estimatedDelivery || null]
    );

    console.log(`[addShippingInfo] Shipping info added to order ${orderId}`);

    // Send notification (Task B.4.10)
    await orderNotificationService.notifyShippingInfoAdded({
      orderId,
      carrier,
      trackingNumber,
      estimatedDelivery,
      timestamp: new Date(),
    });

    // Return updated order
    return getVendorOrderById(orderId);
  } catch (error) {
    console.error('[addShippingInfo] Error:', error);
    throw error;
  }
}

/**
 * Helper: Generate tracking URL based on carrier
 */
function generateTrackingUrl(carrier: string, trackingNumber: string): string {
  const carrierUrls: Record<string, string> = {
    'FedEx': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    'UPS': `https://www.ups.com/track?tracknum=${trackingNumber}`,
    'USPS': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
    'DHL': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
  };

  return carrierUrls[carrier] || `https://www.google.com/search?q=${carrier}+${trackingNumber}`;
}

/**
 * Helper: Get vendor order by ID with all related data
 */
async function getVendorOrderById(orderId: string) {
  // Get order details
  const orderResult = await AppDataSource.query(
    `
    SELECT
      vo.id,
      vo.order_number as "orderNumber",
      vo.spa_id as "spaId",
      vo.spa_name as "spaName",
      vo.status,
      vo.subtotal,
      vo.shipping,
      vo.tax,
      vo.total,
      vo.created_at as "createdAt",
      vo.updated_at as "updatedAt",
      -- Spa contact
      vo.spa_contact_name as "spaContactName",
      vo.spa_contact_email as "spaContactEmail",
      vo.spa_contact_phone as "spaContactPhone",
      -- Shipping address
      vo.shipping_line1 as "shippingLine1",
      vo.shipping_line2 as "shippingLine2",
      vo.shipping_city as "shippingCity",
      vo.shipping_state as "shippingState",
      vo.shipping_postal_code as "shippingPostalCode",
      vo.shipping_country as "shippingCountry"
    FROM jade.vendor_order vo
    WHERE vo.id = $1
    `,
    [orderId]
  );

  if (!orderResult[0]) {
    throw new Error(`Order ${orderId} not found`);
  }

  const order = orderResult[0];

  // Get status history
  const statusHistory = await AppDataSource.query(
    `
    SELECT
      status,
      changed_at as "changedAt",
      changed_by as "changedBy",
      note
    FROM jade.order_status_history
    WHERE order_id = $1
    ORDER BY changed_at DESC
    `,
    [orderId]
  );

  // Get fulfillment info
  const fulfillmentResult = await AppDataSource.query(
    `
    SELECT
      carrier,
      tracking_number as "trackingNumber",
      tracking_url as "trackingUrl",
      estimated_delivery as "estimatedDelivery",
      actual_delivery as "actualDelivery"
    FROM jade.order_fulfillment
    WHERE order_id = $1
    `,
    [orderId]
  );

  // Get order items
  const items = await AppDataSource.query(
    `
    SELECT
      product_id as "productId",
      product_name as "productName",
      sku,
      image_url as "imageUrl",
      quantity,
      unit_price as "unitPrice",
      total_price as "totalPrice"
    FROM jade.order_item
    WHERE order_id = $1
    ORDER BY id
    `,
    [orderId]
  );

  // Return complete order object matching VendorOrder GraphQL type
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    spaId: order.spaId,
    spaName: order.spaName,
    spaContact: {
      name: order.spaContactName,
      email: order.spaContactEmail,
      phone: order.spaContactPhone,
    },
    shippingAddress: {
      line1: order.shippingLine1,
      line2: order.shippingLine2,
      city: order.shippingCity,
      state: order.shippingState,
      postalCode: order.shippingPostalCode,
      country: order.shippingCountry,
    },
    items,
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    total: order.total,
    status: order.status,
    statusHistory,
    fulfillment: fulfillmentResult[0] || null,
    conversationId: null, // TODO: Add conversation support in Sprint C
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}
