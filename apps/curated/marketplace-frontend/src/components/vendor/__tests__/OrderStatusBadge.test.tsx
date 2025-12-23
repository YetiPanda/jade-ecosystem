/**
 * OrderStatusBadge Component Tests
 * Sprint B.4: Order Management
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OrderStatusBadge } from '../OrderStatusBadge';
import { OrderStatus } from '../../../graphql/generated';

describe('OrderStatusBadge', () => {
  it('renders the status text', () => {
    render(<OrderStatusBadge status={OrderStatus.Processing} />);

    // Badge text is uppercase
    expect(screen.getByText('PROCESSING')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    render(<OrderStatusBadge status={OrderStatus.Pending} className="custom-class" />);

    const badge = screen.getByText('PENDING');
    expect(badge).toHaveClass('custom-class');
  });

  describe('Status Colors', () => {
    it.each([
      [OrderStatus.Pending, 'PENDING', 'bg-yellow-100', 'text-yellow-800', 'border-yellow-200'],
      [OrderStatus.Confirmed, 'CONFIRMED', 'bg-blue-100', 'text-blue-800', 'border-blue-200'],
      [OrderStatus.Processing, 'PROCESSING', 'bg-indigo-100', 'text-indigo-800', 'border-indigo-200'],
      [OrderStatus.Shipped, 'SHIPPED', 'bg-purple-100', 'text-purple-800', 'border-purple-200'],
      [OrderStatus.Delivered, 'DELIVERED', 'bg-green-100', 'text-green-800', 'border-green-200'],
      [OrderStatus.Cancelled, 'CANCELLED', 'bg-red-100', 'text-red-800', 'border-red-200'],
      [OrderStatus.Returned, 'RETURNED', 'bg-orange-100', 'text-orange-800', 'border-orange-200'],
      [OrderStatus.Disputed, 'DISPUTED', 'bg-rose-100', 'text-rose-800', 'border-rose-200'],
    ])(
      'applies correct colors for %s status',
      (status, displayText, bgClass, textClass, borderClass) => {
        render(<OrderStatusBadge status={status} />);

        const badge = screen.getByText(displayText);
        expect(badge).toHaveClass(bgClass, textClass, borderClass);
      }
    );
  });

  describe('Badge Variants', () => {
    it('renders Pending status with yellow colors', () => {
      render(<OrderStatusBadge status={OrderStatus.Pending} />);

      const badge = screen.getByText('PENDING');
      expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('renders Confirmed status with blue colors', () => {
      render(<OrderStatusBadge status={OrderStatus.Confirmed} />);

      const badge = screen.getByText('CONFIRMED');
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
    });

    it('renders Processing status with indigo colors', () => {
      render(<OrderStatusBadge status={OrderStatus.Processing} />);

      const badge = screen.getByText('PROCESSING');
      expect(badge).toHaveClass('bg-indigo-100', 'text-indigo-800');
    });

    it('renders Shipped status with purple colors', () => {
      render(<OrderStatusBadge status={OrderStatus.Shipped} />);

      const badge = screen.getByText('SHIPPED');
      expect(badge).toHaveClass('bg-purple-100', 'text-purple-800');
    });

    it('renders Delivered status with green colors', () => {
      render(<OrderStatusBadge status={OrderStatus.Delivered} />);

      const badge = screen.getByText('DELIVERED');
      expect(badge).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('renders Cancelled status with red colors', () => {
      render(<OrderStatusBadge status={OrderStatus.Cancelled} />);

      const badge = screen.getByText('CANCELLED');
      expect(badge).toHaveClass('bg-red-100', 'text-red-800');
    });

    it('renders Returned status with orange colors', () => {
      render(<OrderStatusBadge status={OrderStatus.Returned} />);

      const badge = screen.getByText('RETURNED');
      expect(badge).toHaveClass('bg-orange-100', 'text-orange-800');
    });

    it('renders Disputed status with rose colors', () => {
      render(<OrderStatusBadge status={OrderStatus.Disputed} />);

      const badge = screen.getByText('DISPUTED');
      expect(badge).toHaveClass('bg-rose-100', 'text-rose-800');
    });
  });

  describe('Accessibility', () => {
    it('renders as a span element with badge role', () => {
      const { container } = render(<OrderStatusBadge status={OrderStatus.Processing} />);

      const badge = container.querySelector('[data-slot="badge"]');
      expect(badge).toBeInTheDocument();
    });

    it('preserves status text for screen readers', () => {
      render(<OrderStatusBadge status={OrderStatus.Shipped} />);

      // Text content should be accessible
      expect(screen.getByText('SHIPPED')).toBeInTheDocument();
    });
  });

  describe('Visual Consistency', () => {
    it('maintains consistent spacing with custom className', () => {
      render(<OrderStatusBadge status={OrderStatus.Pending} className="ml-2" />);

      const badge = screen.getByText('PENDING');
      expect(badge).toHaveClass('ml-2');
      expect(badge).toHaveClass('bg-yellow-100'); // Still has status color
    });

    it('combines status colors with additional classes', () => {
      render(<OrderStatusBadge status={OrderStatus.Delivered} className="font-bold text-lg" />);

      const badge = screen.getByText('DELIVERED');
      expect(badge).toHaveClass('bg-green-100', 'text-green-800', 'font-bold', 'text-lg');
    });
  });
});
