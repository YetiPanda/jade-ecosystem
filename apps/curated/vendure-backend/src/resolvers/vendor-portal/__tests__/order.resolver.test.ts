/**
 * Order Resolver Tests
 * Feature 011: Vendor Portal MVP
 * Sprint B.4: Order Management - Task B.4.11
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { updateOrderStatus, addShippingInfo } from '../order.resolver';
import { AppDataSource } from '../../../config/database';
import { orderNotificationService } from '../../../services/order-notification.service';

// Mock dependencies
vi.mock('../../../config/database', () => ({
  AppDataSource: {
    query: vi.fn(),
  },
}));

vi.mock('../../../services/order-notification.service', () => ({
  orderNotificationService: {
    notifyOrderStatusChanged: vi.fn(),
    notifyShippingInfoAdded: vi.fn(),
  },
}));

describe('Order Resolver', () => {
  const mockContext = {
    user: {
      id: 'user-123',
      role: 'vendor',
      vendorId: 'vendor-456',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('updateOrderStatus', () => {
    it('should successfully update order status with valid transition', async () => {
      // Mock database responses
      const mockOrder = {
        id: 'order-123',
        status: 'PENDING',
        vendorId: 'vendor-456',
      };

      const mockUpdatedOrder = {
        id: 'order-123',
        orderNumber: 'ORD-001',
        status: 'CONFIRMED',
        spaId: 'spa-123',
        spaName: 'Serenity Spa',
        spaContactName: 'Jane Doe',
        spaContactEmail: 'jane@serenity.com',
        spaContactPhone: '+1-555-0100',
        shippingLine1: '123 Main St',
        shippingCity: 'Austin',
        shippingState: 'TX',
        shippingPostalCode: '78701',
        shippingCountry: 'US',
        subtotal: 100,
        shipping: 10,
        tax: 8,
        total: 118,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (AppDataSource.query as any)
        .mockResolvedValueOnce([mockOrder]) // Get current order
        .mockResolvedValueOnce([]) // Update status
        .mockResolvedValueOnce([]) // Insert status history
        .mockResolvedValueOnce([mockUpdatedOrder]) // Get updated order
        .mockResolvedValueOnce([]) // Get status history
        .mockResolvedValueOnce([]) // Get fulfillment
        .mockResolvedValueOnce([]); // Get items

      const result = await updateOrderStatus(
        {},
        {
          input: {
            orderId: 'order-123',
            status: 'CONFIRMED',
            note: 'Order confirmed by vendor',
          },
        },
        mockContext
      );

      // Verify database calls
      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT id, status'),
        ['order-123']
      );

      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE jade.vendor_order'),
        ['CONFIRMED', 'order-123']
      );

      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO jade.order_status_history'),
        ['order-123', 'CONFIRMED', 'user-123', 'Order confirmed by vendor']
      );

      // Verify notification was sent
      expect(orderNotificationService.notifyOrderStatusChanged).toHaveBeenCalledWith({
        orderId: 'order-123',
        oldStatus: 'PENDING',
        newStatus: 'CONFIRMED',
        changedBy: 'user-123',
        note: 'Order confirmed by vendor',
        timestamp: expect.any(Date),
      });

      // Verify result
      expect(result).toBeDefined();
      expect(result.id).toBe('order-123');
    });

    it('should reject invalid status transition', async () => {
      const mockOrder = {
        id: 'order-123',
        status: 'PENDING',
        vendorId: 'vendor-456',
      };

      (AppDataSource.query as any).mockResolvedValueOnce([mockOrder]);

      await expect(
        updateOrderStatus(
          {},
          {
            input: {
              orderId: 'order-123',
              status: 'DELIVERED', // Invalid: PENDING -> DELIVERED
              note: 'Attempting invalid transition',
            },
          },
          mockContext
        )
      ).rejects.toThrow('Invalid status transition from PENDING to DELIVERED');

      // Verify no update was made
      expect(AppDataSource.query).toHaveBeenCalledTimes(1); // Only the SELECT query
      expect(orderNotificationService.notifyOrderStatusChanged).not.toHaveBeenCalled();
    });

    it('should reject transition from terminal state', async () => {
      const mockOrder = {
        id: 'order-123',
        status: 'CANCELLED',
        vendorId: 'vendor-456',
      };

      (AppDataSource.query as any).mockResolvedValueOnce([mockOrder]);

      await expect(
        updateOrderStatus(
          {},
          {
            input: {
              orderId: 'order-123',
              status: 'PROCESSING',
              note: 'Attempting to reactivate cancelled order',
            },
          },
          mockContext
        )
      ).rejects.toThrow('Invalid status transition from CANCELLED to PROCESSING');
    });

    it('should handle order not found', async () => {
      (AppDataSource.query as any).mockResolvedValueOnce([]); // Empty result

      await expect(
        updateOrderStatus(
          {},
          {
            input: {
              orderId: 'nonexistent-order',
              status: 'CONFIRMED',
            },
          },
          mockContext
        )
      ).rejects.toThrow('Order nonexistent-order not found');
    });

    it('should allow all valid transitions from PROCESSING', async () => {
      const validTransitions = ['SHIPPED', 'CANCELLED'];

      for (const newStatus of validTransitions) {
        vi.clearAllMocks();

        const mockOrder = {
          id: 'order-123',
          status: 'PROCESSING',
          vendorId: 'vendor-456',
        };

        (AppDataSource.query as any)
          .mockResolvedValueOnce([mockOrder])
          .mockResolvedValue([]);

        await updateOrderStatus(
          {},
          {
            input: {
              orderId: 'order-123',
              status: newStatus,
            },
          },
          mockContext
        );

        expect(orderNotificationService.notifyOrderStatusChanged).toHaveBeenCalledWith(
          expect.objectContaining({
            oldStatus: 'PROCESSING',
            newStatus,
          })
        );
      }
    });
  });

  describe('addShippingInfo', () => {
    it('should successfully add shipping information', async () => {
      const mockOrder = {
        id: 'order-123',
        vendorId: 'vendor-456',
      };

      const mockUpdatedOrder = {
        id: 'order-123',
        orderNumber: 'ORD-001',
        status: 'SHIPPED',
        spaId: 'spa-123',
        spaName: 'Serenity Spa',
        spaContactName: 'Jane Doe',
        spaContactEmail: 'jane@serenity.com',
        shippingLine1: '123 Main St',
        shippingCity: 'Austin',
        shippingState: 'TX',
        shippingPostalCode: '78701',
        shippingCountry: 'US',
        subtotal: 100,
        shipping: 10,
        tax: 8,
        total: 118,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (AppDataSource.query as any)
        .mockResolvedValueOnce([mockOrder]) // Get order
        .mockResolvedValueOnce([]) // Insert fulfillment
        .mockResolvedValueOnce([mockUpdatedOrder]) // Get updated order
        .mockResolvedValueOnce([]) // Get status history
        .mockResolvedValueOnce([
          {
            carrier: 'FedEx',
            trackingNumber: '1Z999AA10123456789',
            trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr=1Z999AA10123456789',
            estimatedDelivery: '2025-01-05',
          },
        ]) // Get fulfillment
        .mockResolvedValueOnce([]); // Get items

      const result = await addShippingInfo(
        {},
        {
          input: {
            orderId: 'order-123',
            carrier: 'FedEx',
            trackingNumber: '1Z999AA10123456789',
            estimatedDelivery: '2025-01-05',
          },
        },
        mockContext
      );

      // Verify database calls
      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT id, vendor_id'),
        ['order-123']
      );

      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO jade.order_fulfillment'),
        [
          'order-123',
          'FedEx',
          '1Z999AA10123456789',
          'https://www.fedex.com/fedextrack/?trknbr=1Z999AA10123456789',
          '2025-01-05',
        ]
      );

      // Verify notification was sent
      expect(orderNotificationService.notifyShippingInfoAdded).toHaveBeenCalledWith({
        orderId: 'order-123',
        carrier: 'FedEx',
        trackingNumber: '1Z999AA10123456789',
        estimatedDelivery: '2025-01-05',
        timestamp: expect.any(Date),
      });

      // Verify result
      expect(result).toBeDefined();
      expect(result.id).toBe('order-123');
      expect(result.fulfillment).toBeDefined();
      expect(result.fulfillment.carrier).toBe('FedEx');
    });

    it('should generate correct tracking URL for UPS', async () => {
      const mockOrder = {
        id: 'order-123',
        vendorId: 'vendor-456',
      };

      (AppDataSource.query as any)
        .mockResolvedValueOnce([mockOrder])
        .mockResolvedValue([]);

      await addShippingInfo(
        {},
        {
          input: {
            orderId: 'order-123',
            carrier: 'UPS',
            trackingNumber: '1Z999AA10123456789',
          },
        },
        mockContext
      );

      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO jade.order_fulfillment'),
        expect.arrayContaining([
          expect.anything(),
          'UPS',
          '1Z999AA10123456789',
          'https://www.ups.com/track?tracknum=1Z999AA10123456789',
          null,
        ])
      );
    });

    it('should handle order not found for shipping info', async () => {
      (AppDataSource.query as any).mockResolvedValueOnce([]); // Empty result

      await expect(
        addShippingInfo(
          {},
          {
            input: {
              orderId: 'nonexistent-order',
              carrier: 'FedEx',
              trackingNumber: '1Z999AA10123456789',
            },
          },
          mockContext
        )
      ).rejects.toThrow('Order nonexistent-order not found');
    });

    it('should handle shipping info without estimated delivery', async () => {
      const mockOrder = {
        id: 'order-123',
        vendorId: 'vendor-456',
      };

      (AppDataSource.query as any)
        .mockResolvedValueOnce([mockOrder])
        .mockResolvedValue([]);

      await addShippingInfo(
        {},
        {
          input: {
            orderId: 'order-123',
            carrier: 'USPS',
            trackingNumber: '9400111202555599999999',
          },
        },
        mockContext
      );

      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO jade.order_fulfillment'),
        expect.arrayContaining([
          expect.anything(),
          'USPS',
          '9400111202555599999999',
          expect.any(String),
          null, // No estimated delivery
        ])
      );

      expect(orderNotificationService.notifyShippingInfoAdded).toHaveBeenCalledWith(
        expect.objectContaining({
          estimatedDelivery: undefined,
        })
      );
    });
  });

  describe('Status Transition Matrix', () => {
    const transitionTests = [
      { from: 'PENDING', to: 'CONFIRMED', valid: true },
      { from: 'PENDING', to: 'CANCELLED', valid: true },
      { from: 'PENDING', to: 'PROCESSING', valid: false },
      { from: 'CONFIRMED', to: 'PROCESSING', valid: true },
      { from: 'CONFIRMED', to: 'CANCELLED', valid: true },
      { from: 'PROCESSING', to: 'SHIPPED', valid: true },
      { from: 'PROCESSING', to: 'CANCELLED', valid: true },
      { from: 'SHIPPED', to: 'DELIVERED', valid: true },
      { from: 'SHIPPED', to: 'RETURNED', valid: true },
      { from: 'DELIVERED', to: 'RETURNED', valid: true },
      { from: 'DELIVERED', to: 'DISPUTED', valid: true },
      { from: 'RETURNED', to: 'DISPUTED', valid: true },
      { from: 'CANCELLED', to: 'PROCESSING', valid: false },
      { from: 'DISPUTED', to: 'PROCESSING', valid: false },
    ];

    transitionTests.forEach(({ from, to, valid }) => {
      it(`should ${valid ? 'allow' : 'reject'} transition from ${from} to ${to}`, async () => {
        const mockOrder = {
          id: 'order-123',
          status: from,
          vendorId: 'vendor-456',
        };

        (AppDataSource.query as any)
          .mockResolvedValueOnce([mockOrder])
          .mockResolvedValue([]);

        if (valid) {
          await updateOrderStatus(
            {},
            {
              input: {
                orderId: 'order-123',
                status: to,
              },
            },
            mockContext
          );

          expect(orderNotificationService.notifyOrderStatusChanged).toHaveBeenCalled();
        } else {
          await expect(
            updateOrderStatus(
              {},
              {
                input: {
                  orderId: 'order-123',
                  status: to,
                },
              },
              mockContext
            )
          ).rejects.toThrow(`Invalid status transition from ${from} to ${to}`);

          expect(orderNotificationService.notifyOrderStatusChanged).not.toHaveBeenCalled();
        }
      });
    });
  });
});
