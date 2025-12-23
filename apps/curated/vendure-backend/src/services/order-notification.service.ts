/**
 * Order Notification Service
 * Feature 011: Vendor Portal MVP
 * Sprint B.4: Order Management - Task B.4.10
 *
 * Handles notifications for order status changes and shipping updates
 */

import { EventEmitter } from 'events';
import { AppDataSource } from '../config/database';

export interface OrderStatusChangedEvent {
  orderId: string;
  oldStatus: string;
  newStatus: string;
  changedBy: string;
  note?: string;
  timestamp: Date;
}

export interface ShippingInfoAddedEvent {
  orderId: string;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery?: string;
  timestamp: Date;
}

/**
 * Order Notification Service
 *
 * Provides pub/sub mechanism for order events
 * Can be used for:
 * - GraphQL subscriptions
 * - Email notifications
 * - Webhook calls
 * - Analytics tracking
 */
class OrderNotificationService extends EventEmitter {
  /**
   * Emit order status changed event
   */
  async notifyOrderStatusChanged(event: OrderStatusChangedEvent): Promise<void> {
    console.log('[OrderNotification] Status changed:', {
      orderId: event.orderId,
      oldStatus: event.oldStatus,
      newStatus: event.newStatus,
      changedBy: event.changedBy,
    });

    // Emit event for subscribers
    this.emit('orderStatusChanged', event);

    // Store notification in database for spa to see
    await this.createNotification({
      orderId: event.orderId,
      type: 'ORDER_STATUS_CHANGED',
      title: `Order status updated to ${event.newStatus}`,
      message: event.note || `Your order has been updated to ${event.newStatus}`,
      metadata: {
        oldStatus: event.oldStatus,
        newStatus: event.newStatus,
        changedBy: event.changedBy,
      },
    });

    // Determine if this status change requires email notification
    const emailStatuses = ['SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (emailStatuses.includes(event.newStatus)) {
      await this.sendStatusChangeEmail(event);
    }
  }

  /**
   * Emit shipping info added event
   */
  async notifyShippingInfoAdded(event: ShippingInfoAddedEvent): Promise<void> {
    console.log('[OrderNotification] Shipping info added:', {
      orderId: event.orderId,
      carrier: event.carrier,
      trackingNumber: event.trackingNumber,
    });

    // Emit event for subscribers
    this.emit('shippingInfoAdded', event);

    // Store notification in database
    await this.createNotification({
      orderId: event.orderId,
      type: 'SHIPPING_INFO_ADDED',
      title: 'Tracking information available',
      message: `Your order has shipped via ${event.carrier}. Tracking: ${event.trackingNumber}`,
      metadata: {
        carrier: event.carrier,
        trackingNumber: event.trackingNumber,
        estimatedDelivery: event.estimatedDelivery,
      },
    });

    // Send shipping notification email
    await this.sendShippingEmail(event);
  }

  /**
   * Create notification record in database
   */
  private async createNotification(notification: {
    orderId: string;
    type: string;
    title: string;
    message: string;
    metadata: any;
  }): Promise<void> {
    try {
      // Get spa ID from order
      const orderResult = await AppDataSource.query(
        `SELECT spa_id FROM jade.vendor_order WHERE id = $1`,
        [notification.orderId]
      );

      if (!orderResult[0]) {
        console.error('[OrderNotification] Order not found:', notification.orderId);
        return;
      }

      const spaId = orderResult[0].spa_id;

      // Insert notification
      await AppDataSource.query(
        `
        INSERT INTO jade.notification (
          user_id, type, title, message, metadata, related_entity_type, related_entity_id, is_read
        )
        VALUES ($1, $2, $3, $4, $5, 'ORDER', $6, false)
        `,
        [
          spaId,
          notification.type,
          notification.title,
          notification.message,
          JSON.stringify(notification.metadata),
          notification.orderId,
        ]
      );

      console.log('[OrderNotification] Notification created for spa:', spaId);
    } catch (error) {
      console.error('[OrderNotification] Failed to create notification:', error);
      // Don't throw - notification failure shouldn't block order updates
    }
  }

  /**
   * Send status change email
   */
  private async sendStatusChangeEmail(event: OrderStatusChangedEvent): Promise<void> {
    try {
      // Get order and spa details
      const orderResult = await AppDataSource.query(
        `
        SELECT
          vo.order_number as "orderNumber",
          vo.spa_id as "spaId",
          vo.spa_name as "spaName",
          vo.spa_contact_email as "spaContactEmail",
          vo.spa_contact_name as "spaContactName"
        FROM jade.vendor_order vo
        WHERE vo.id = $1
        `,
        [event.orderId]
      );

      if (!orderResult[0]) {
        console.error('[OrderNotification] Order not found for email:', event.orderId);
        return;
      }

      const order = orderResult[0];

      console.log('[OrderNotification] Would send email to:', {
        email: order.spaContactEmail,
        subject: `Order ${order.orderNumber} status: ${event.newStatus}`,
      });

      // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
      // For now, just log what would be sent
      const emailContent = {
        to: order.spaContactEmail,
        subject: `Order ${order.orderNumber} status updated`,
        template: 'order-status-changed',
        data: {
          spaName: order.spaName,
          spaContactName: order.spaContactName,
          orderNumber: order.orderNumber,
          newStatus: event.newStatus,
          note: event.note,
          timestamp: event.timestamp,
        },
      };

      console.log('[OrderNotification] Email content:', JSON.stringify(emailContent, null, 2));
    } catch (error) {
      console.error('[OrderNotification] Failed to send status email:', error);
      // Don't throw - email failure shouldn't block order updates
    }
  }

  /**
   * Send shipping notification email
   */
  private async sendShippingEmail(event: ShippingInfoAddedEvent): Promise<void> {
    try {
      // Get order and spa details
      const orderResult = await AppDataSource.query(
        `
        SELECT
          vo.order_number as "orderNumber",
          vo.spa_contact_email as "spaContactEmail",
          vo.spa_contact_name as "spaContactName",
          of.tracking_url as "trackingUrl"
        FROM jade.vendor_order vo
        LEFT JOIN jade.order_fulfillment of ON of.order_id = vo.id
        WHERE vo.id = $1
        `,
        [event.orderId]
      );

      if (!orderResult[0]) {
        console.error('[OrderNotification] Order not found for shipping email:', event.orderId);
        return;
      }

      const order = orderResult[0];

      console.log('[OrderNotification] Would send shipping email to:', {
        email: order.spaContactEmail,
        subject: `Order ${order.orderNumber} has shipped`,
      });

      // TODO: Integrate with email service
      const emailContent = {
        to: order.spaContactEmail,
        subject: `Order ${order.orderNumber} has shipped`,
        template: 'order-shipped',
        data: {
          spaContactName: order.spaContactName,
          orderNumber: order.orderNumber,
          carrier: event.carrier,
          trackingNumber: event.trackingNumber,
          trackingUrl: order.trackingUrl,
          estimatedDelivery: event.estimatedDelivery,
        },
      };

      console.log('[OrderNotification] Shipping email content:', JSON.stringify(emailContent, null, 2));
    } catch (error) {
      console.error('[OrderNotification] Failed to send shipping email:', error);
      // Don't throw - email failure shouldn't block order updates
    }
  }

  /**
   * Subscribe to order events (for GraphQL subscriptions)
   */
  subscribeToOrderEvents(
    callback: (event: OrderStatusChangedEvent | ShippingInfoAddedEvent) => void
  ): () => void {
    const statusHandler = (event: OrderStatusChangedEvent) => callback(event);
    const shippingHandler = (event: ShippingInfoAddedEvent) => callback(event);

    this.on('orderStatusChanged', statusHandler);
    this.on('shippingInfoAdded', shippingHandler);

    // Return unsubscribe function
    return () => {
      this.off('orderStatusChanged', statusHandler);
      this.off('shippingInfoAdded', shippingHandler);
    };
  }
}

// Export singleton instance
export const orderNotificationService = new OrderNotificationService();
