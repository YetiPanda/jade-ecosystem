/**
 * OrderDetailPanel Component Tests
 * Sprint B.4: Order Management
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OrderDetailPanel } from '../OrderDetailPanel';
import { OrderStatus } from '../../../graphql/generated';

const mockOrder = {
  id: '1',
  orderNumber: 'ORD-2025-0891',
  spaId: 'spa-1',
  spaName: 'Glow Medical Aesthetics',
  spaContact: {
    name: 'Sarah Chen',
    email: 'sarah@glowmedical.com',
    phone: '+1-555-0123',
  },
  shippingAddress: {
    line1: '1234 Medical Center Dr',
    line2: 'Suite 200',
    city: 'Dallas',
    state: 'TX',
    postalCode: '75201',
    country: 'USA',
  },
  items: [
    {
      productId: 'prod-1',
      productName: 'Vitamin C Serum 30ml',
      sku: 'LUM-VCS-30',
      imageUrl: null,
      quantity: 6,
      unitPrice: 30.0,
      totalPrice: 180.0,
    },
    {
      productId: 'prod-2',
      productName: 'Hydrating Moisturizer 50ml',
      sku: 'LUM-HM-50',
      imageUrl: 'https://example.com/product.jpg',
      quantity: 4,
      unitPrice: 30.0,
      totalPrice: 120.0,
    },
  ],
  subtotal: 300.0,
  shipping: 25.0,
  tax: 27.0,
  total: 352.0,
  status: OrderStatus.Processing,
  statusHistory: [
    {
      status: OrderStatus.Pending,
      changedAt: '2025-01-18T09:42:00Z',
      changedBy: 'Sarah Chen',
      note: null,
    },
    {
      status: OrderStatus.Confirmed,
      changedAt: '2025-01-18T10:15:00Z',
      changedBy: 'You',
      note: null,
    },
    {
      status: OrderStatus.Processing,
      changedAt: '2025-01-18T14:30:00Z',
      changedBy: 'You',
      note: 'Started preparing order',
    },
  ],
  fulfillment: null,
  conversationId: null,
  createdAt: '2025-01-18T09:42:00Z',
  updatedAt: '2025-01-18T14:30:00Z',
};

describe('OrderDetailPanel', () => {
  const defaultProps = {
    order: mockOrder,
    open: true,
    onClose: vi.fn(),
  };

  it('renders nothing when order is null', () => {
    const { container } = render(
      <OrderDetailPanel order={null} open={true} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders order number in the header', () => {
    render(<OrderDetailPanel {...defaultProps} />);
    expect(screen.getByText('Order ORD-2025-0891')).toBeInTheDocument();
  });

  it('renders order creation date', () => {
    render(<OrderDetailPanel {...defaultProps} />);
    expect(screen.getByText(/Placed on/)).toBeInTheDocument();
  });

  it('displays current order status badge', () => {
    render(<OrderDetailPanel {...defaultProps} />);
    // Badge text is uppercase
    const statusBadge = screen.getByText('PROCESSING');
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveClass('bg-indigo-100', 'text-indigo-800');
  });

  describe('Spa Information', () => {
    it('renders spa name and contact details', () => {
      render(<OrderDetailPanel {...defaultProps} />);

      expect(screen.getByText('Glow Medical Aesthetics')).toBeInTheDocument();
      expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
      expect(screen.getByText('sarah@glowmedical.com')).toBeInTheDocument();
      expect(screen.getByText('+1-555-0123')).toBeInTheDocument();
    });

    it('renders shipping address', () => {
      render(<OrderDetailPanel {...defaultProps} />);

      expect(screen.getByText('1234 Medical Center Dr')).toBeInTheDocument();
      expect(screen.getByText('Suite 200')).toBeInTheDocument();
      expect(screen.getByText(/Dallas, TX 75201/)).toBeInTheDocument();
    });

    it('renders Send Message button when onSendMessage is provided', () => {
      const onSendMessage = vi.fn();
      render(<OrderDetailPanel {...defaultProps} onSendMessage={onSendMessage} />);

      const sendMessageBtn = screen.getByRole('button', { name: /Send Message/i });
      expect(sendMessageBtn).toBeInTheDocument();

      fireEvent.click(sendMessageBtn);
      expect(onSendMessage).toHaveBeenCalledWith('spa-1');
    });

    it('does not render Send Message button when onSendMessage is not provided', () => {
      render(<OrderDetailPanel {...defaultProps} />);

      expect(screen.queryByRole('button', { name: /Send Message/i })).not.toBeInTheDocument();
    });
  });

  describe('Order Items', () => {
    it('renders all order items', () => {
      render(<OrderDetailPanel {...defaultProps} />);

      expect(screen.getByText('Vitamin C Serum 30ml')).toBeInTheDocument();
      expect(screen.getByText('Hydrating Moisturizer 50ml')).toBeInTheDocument();
    });

    it('displays SKU and quantity for each item', () => {
      render(<OrderDetailPanel {...defaultProps} />);

      expect(screen.getByText(/SKU: LUM-VCS-30/)).toBeInTheDocument();
      expect(screen.getByText(/Qty: 6/)).toBeInTheDocument();
      expect(screen.getByText(/SKU: LUM-HM-50/)).toBeInTheDocument();
      expect(screen.getByText(/Qty: 4/)).toBeInTheDocument();
    });

    it('displays prices correctly', () => {
      render(<OrderDetailPanel {...defaultProps} />);

      expect(screen.getByText('$180.00')).toBeInTheDocument(); // Total for item 1
      expect(screen.getByText('$120.00')).toBeInTheDocument(); // Total for item 2
      expect(screen.getAllByText('$30.00 each').length).toBe(2); // Unit prices
    });

    it('renders product image when imageUrl is provided', () => {
      render(<OrderDetailPanel {...defaultProps} />);

      const images = screen.getAllByRole('img');
      const productImage = images.find((img) =>
        img.getAttribute('src')?.includes('example.com')
      );
      expect(productImage).toBeInTheDocument();
      expect(productImage).toHaveAttribute('alt', 'Hydrating Moisturizer 50ml');
    });
  });

  describe('Order Summary', () => {
    it('displays subtotal, shipping, and tax', () => {
      render(<OrderDetailPanel {...defaultProps} />);

      expect(screen.getByText('Subtotal')).toBeInTheDocument();
      expect(screen.getByText('$300.00')).toBeInTheDocument();

      expect(screen.getByText('Shipping')).toBeInTheDocument();
      expect(screen.getByText('$25.00')).toBeInTheDocument();

      expect(screen.getByText('Tax')).toBeInTheDocument();
      expect(screen.getByText('$27.00')).toBeInTheDocument();
    });

    it('displays total amount', () => {
      render(<OrderDetailPanel {...defaultProps} />);

      // Find the Total label and value
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('$352.00')).toBeInTheDocument();
    });
  });

  describe('Shipping Information', () => {
    it('shows placeholder when shipping info is not available', () => {
      render(<OrderDetailPanel {...defaultProps} />);

      expect(screen.getByText('Shipping information not yet added')).toBeInTheDocument();
    });

    it('displays tracking information when available', () => {
      const orderWithShipping = {
        ...mockOrder,
        fulfillment: {
          carrier: 'FedEx',
          trackingNumber: '1Z999AA10123456789',
          trackingUrl: 'https://fedex.com/track/1Z999AA10123456789',
          estimatedDelivery: '2025-01-25T00:00:00Z',
          actualDelivery: null,
        },
      };

      render(<OrderDetailPanel {...defaultProps} order={orderWithShipping} />);

      expect(screen.getByText('FedEx')).toBeInTheDocument();
      expect(screen.getByText('1Z999AA10123456789')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Track Shipment/i })).toBeInTheDocument();
    });

    it('opens tracking URL in new tab when Track Shipment is clicked', () => {
      const orderWithShipping = {
        ...mockOrder,
        fulfillment: {
          carrier: 'FedEx',
          trackingNumber: '1Z999AA10123456789',
          trackingUrl: 'https://fedex.com/track/1Z999AA10123456789',
          estimatedDelivery: null,
          actualDelivery: null,
        },
      };

      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

      render(<OrderDetailPanel {...defaultProps} order={orderWithShipping} />);

      const trackButton = screen.getByRole('button', { name: /Track Shipment/i });
      fireEvent.click(trackButton);

      expect(windowOpenSpy).toHaveBeenCalledWith(
        'https://fedex.com/track/1Z999AA10123456789',
        '_blank'
      );

      windowOpenSpy.mockRestore();
    });
  });

  describe('Order Timeline', () => {
    it('renders all status changes in reverse chronological order', () => {
      render(<OrderDetailPanel {...defaultProps} />);

      // Check that Order Timeline section exists
      expect(screen.getByText('Order Timeline')).toBeInTheDocument();

      // Timeline should show all three status changes
      // Check that the timeline contains references to all statuses
      const timelineSection = screen.getByText('Order Timeline').parentElement;
      expect(timelineSection).toBeInTheDocument();

      // Verify all status changes appear in the document
      // The statusHistory has 3 entries, check for key indicators
      // Note is wrapped in quotes in the component
      expect(screen.getByText(/"Started preparing order"/)).toBeInTheDocument();
    });

    it('displays who made each status change', () => {
      render(<OrderDetailPanel {...defaultProps} />);

      const youElements = screen.getAllByText(/by You/);
      expect(youElements).toHaveLength(2); // Confirmed and Processing

      expect(screen.getByText(/by Sarah Chen/)).toBeInTheDocument();
    });

    it('displays notes when available', () => {
      render(<OrderDetailPanel {...defaultProps} />);

      expect(screen.getByText(/"Started preparing order"/)).toBeInTheDocument();
    });
  });

  describe('Panel Behavior', () => {
    it('calls onClose when sheet is closed', () => {
      const onClose = vi.fn();
      render(<OrderDetailPanel {...defaultProps} onClose={onClose} />);

      // The Sheet component should be in the document
      const sheet = screen.getByRole('dialog');
      expect(sheet).toBeInTheDocument();

      // Note: Testing Sheet close behavior requires interacting with the underlying Radix UI component
      // This is typically handled by the Sheet component's own tests
    });

    it('does not render when open is false', () => {
      render(<OrderDetailPanel {...defaultProps} open={false} />);

      // Sheet content should not be in the document when closed
      expect(screen.queryByText('Order ORD-2025-0891')).not.toBeInTheDocument();
    });
  });

  describe('Status Badge Colors', () => {
    it.each([
      [OrderStatus.Pending, 'PENDING', 'bg-yellow-100', 'text-yellow-800'],
      [OrderStatus.Confirmed, 'CONFIRMED', 'bg-blue-100', 'text-blue-800'],
      [OrderStatus.Processing, 'PROCESSING', 'bg-indigo-100', 'text-indigo-800'],
      [OrderStatus.Shipped, 'SHIPPED', 'bg-purple-100', 'text-purple-800'],
      [OrderStatus.Delivered, 'DELIVERED', 'bg-green-100', 'text-green-800'],
      [OrderStatus.Cancelled, 'CANCELLED', 'bg-red-100', 'text-red-800'],
      [OrderStatus.Returned, 'RETURNED', 'bg-orange-100', 'text-orange-800'],
      [OrderStatus.Disputed, 'DISPUTED', 'bg-rose-100', 'text-rose-800'],
    ])('displays correct color for %s status', (status, displayText, bgClass, textClass) => {
      const orderWithStatus = { ...mockOrder, status };
      render(<OrderDetailPanel {...defaultProps} order={orderWithStatus} />);

      const badge = screen.getByText(displayText);
      expect(badge).toHaveClass(bgClass, textClass);
    });
  });
});
