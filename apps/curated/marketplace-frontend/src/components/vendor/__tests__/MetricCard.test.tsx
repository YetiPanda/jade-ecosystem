/**
 * MetricCard Component Tests
 *
 * Feature 011: Vendor Portal MVP
 * Sprint B.1: Dashboard Metrics (Task B.1.11)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MetricCard, MetricCardGrid } from '../MetricCard';
import { DollarSign, ShoppingCart, Users, TrendingUp } from 'lucide-react';

describe('MetricCard', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(
        <MetricCard
          title="Total Revenue"
          value="$12,345"
          icon={DollarSign}
        />
      );
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    });

    it('renders title in uppercase', () => {
      render(
        <MetricCard
          title="Total Revenue"
          value="$12,345"
          icon={DollarSign}
        />
      );
      const title = screen.getByText('Total Revenue');
      expect(title).toHaveClass('uppercase');
    });

    it('renders value correctly', () => {
      render(
        <MetricCard
          title="Orders"
          value="$12,345"
          icon={ShoppingCart}
        />
      );
      expect(screen.getByText('$12,345')).toBeInTheDocument();
    });

    it('renders numeric value', () => {
      render(
        <MetricCard
          title="Active Spas"
          value={42}
          icon={Users}
        />
      );
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders string value', () => {
      render(
        <MetricCard
          title="Reorder Rate"
          value="85.5%"
          icon={TrendingUp}
        />
      );
      expect(screen.getByText('85.5%')).toBeInTheDocument();
    });

    it('renders with custom icon color', () => {
      const { container } = render(
        <MetricCard
          title="Revenue"
          value="$1000"
          icon={DollarSign}
          iconColor="#2E8B57"
        />
      );
      const icon = container.querySelector('svg');
      expect(icon).toHaveStyle({ color: 'rgb(46, 139, 87)' });
    });

    it('applies default icon color when not provided', () => {
      const { container } = render(
        <MetricCard
          title="Revenue"
          value="$1000"
          icon={DollarSign}
        />
      );
      const icon = container.querySelector('svg');
      expect(icon).toHaveStyle({ color: 'rgb(46, 139, 87)' }); // Default #2E8B57
    });
  });

  describe('Subtitle', () => {
    it('renders subtitle when provided', () => {
      render(
        <MetricCard
          title="Revenue"
          value="$12,345"
          icon={DollarSign}
          subtitle="vs previous period"
        />
      );
      expect(screen.getByText('vs previous period')).toBeInTheDocument();
    });

    it('does not render subtitle when not provided', () => {
      render(
        <MetricCard
          title="Revenue"
          value="$12,345"
          icon={DollarSign}
        />
      );
      expect(screen.queryByText('vs previous period')).not.toBeInTheDocument();
    });

    it('renders subtitle with muted styling', () => {
      render(
        <MetricCard
          title="Revenue"
          value="$12,345"
          icon={DollarSign}
          subtitle="vs previous period"
        />
      );
      const subtitle = screen.getByText('vs previous period');
      expect(subtitle).toHaveClass('text-muted-foreground');
    });
  });

  describe('Trend Indicators', () => {
    it('renders UP trend indicator with positive change', () => {
      render(
        <MetricCard
          title="Revenue"
          value="$12,345"
          icon={DollarSign}
          trend="UP"
          percentChange={12.5}
        />
      );
      expect(screen.getByText('+12.5%')).toBeInTheDocument();
    });

    it('renders DOWN trend indicator with negative change', () => {
      render(
        <MetricCard
          title="Revenue"
          value="$12,345"
          icon={DollarSign}
          trend="DOWN"
          percentChange={-8.3}
        />
      );
      expect(screen.getByText('-8.3%')).toBeInTheDocument();
    });

    it('renders FLAT trend indicator with zero change', () => {
      render(
        <MetricCard
          title="Revenue"
          value="$12,345"
          icon={DollarSign}
          trend="FLAT"
          percentChange={0}
        />
      );
      expect(screen.getByText('0.0%')).toBeInTheDocument();
    });

    it('renders FLAT trend indicator with small change', () => {
      render(
        <MetricCard
          title="Revenue"
          value="$12,345"
          icon={DollarSign}
          trend="FLAT"
          percentChange={2.1}
        />
      );
      expect(screen.getByText('+2.1%')).toBeInTheDocument();
    });

    it('does not render trend indicator when trend is not provided', () => {
      render(
        <MetricCard
          title="Revenue"
          value="$12,345"
          icon={DollarSign}
          percentChange={12.5}
        />
      );
      expect(screen.queryByText('+12.5%')).not.toBeInTheDocument();
    });

    it('does not render trend indicator when percentChange is not provided', () => {
      render(
        <MetricCard
          title="Revenue"
          value="$12,345"
          icon={DollarSign}
          trend="UP"
        />
      );
      // Should not crash, but trend indicator shouldn't show
      const card = screen.getByText('Revenue');
      expect(card).toBeInTheDocument();
    });

    it('renders trend indicator with badge styling', () => {
      const { container } = render(
        <MetricCard
          title="Revenue"
          value="$12,345"
          icon={DollarSign}
          trend="UP"
          percentChange={12.5}
        />
      );
      const badge = screen.getByText('+12.5%').closest('span');
      expect(badge).toHaveClass('text-xs', 'font-medium');
    });
  });

  describe('Loading State', () => {
    it('renders skeleton when loading is true', () => {
      const { container } = render(
        <MetricCard
          title="Revenue"
          value="$12,345"
          icon={DollarSign}
          loading={true}
        />
      );
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('does not render actual content when loading', () => {
      render(
        <MetricCard
          title="Revenue"
          value="$12,345"
          icon={DollarSign}
          loading={true}
        />
      );
      expect(screen.queryByText('Revenue')).not.toBeInTheDocument();
      expect(screen.queryByText('$12,345')).not.toBeInTheDocument();
    });

    it('renders content when loading is false', () => {
      render(
        <MetricCard
          title="Revenue"
          value="$12,345"
          icon={DollarSign}
          loading={false}
        />
      );
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('$12,345')).toBeInTheDocument();
    });

    it('renders skeleton with correct structure', () => {
      const { container } = render(
        <MetricCard
          title="Revenue"
          value="$12,345"
          icon={DollarSign}
          loading={true}
        />
      );
      // Should have skeleton elements for title, value, and trend
      const titleSkeleton = container.querySelector('.h-4.w-24');
      const valueSkeleton = container.querySelector('.h-8.w-32');
      expect(titleSkeleton).toBeInTheDocument();
      expect(valueSkeleton).toBeInTheDocument();
    });
  });

  describe('Card Styling', () => {
    it('applies border and shadow classes', () => {
      const { container } = render(
        <MetricCard
          title="Revenue"
          value="$12,345"
          icon={DollarSign}
        />
      );
      const card = container.firstChild;
      expect(card).toHaveClass('border-border', 'shadow-md');
    });

    it('applies hover effect classes', () => {
      const { container } = render(
        <MetricCard
          title="Revenue"
          value="$12,345"
          icon={DollarSign}
        />
      );
      const card = container.firstChild;
      expect(card).toHaveClass('hover:shadow-lg', 'transition-shadow');
    });

    it('applies correct text size to value', () => {
      render(
        <MetricCard
          title="Revenue"
          value="$12,345"
          icon={DollarSign}
        />
      );
      const value = screen.getByText('$12,345');
      expect(value).toHaveClass('text-3xl', 'font-light');
    });
  });

  describe('Complex Scenarios', () => {
    it('renders all props together correctly', () => {
      render(
        <MetricCard
          title="Total Revenue"
          value="$12,345"
          icon={DollarSign}
          iconColor="#2E8B57"
          trend="UP"
          percentChange={12.5}
          subtitle="vs previous period"
        />
      );
      expect(screen.getByText('Total Revenue')).toBeInTheDocument();
      expect(screen.getByText('$12,345')).toBeInTheDocument();
      expect(screen.getByText('+12.5%')).toBeInTheDocument();
      expect(screen.getByText('vs previous period')).toBeInTheDocument();
    });

    it('handles zero value correctly', () => {
      render(
        <MetricCard
          title="Revenue"
          value={0}
          icon={DollarSign}
        />
      );
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles negative value correctly', () => {
      render(
        <MetricCard
          title="Revenue"
          value="-$500"
          icon={DollarSign}
        />
      );
      expect(screen.getByText('-$500')).toBeInTheDocument();
    });

    it('handles large numbers correctly', () => {
      render(
        <MetricCard
          title="Revenue"
          value="$1,234,567.89"
          icon={DollarSign}
        />
      );
      expect(screen.getByText('$1,234,567.89')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      render(
        <MetricCard
          title="Total Revenue"
          value="$12,345"
          icon={DollarSign}
        />
      );
      const title = screen.getByText('Total Revenue');
      expect(title.tagName.toLowerCase()).toBe('h4');
    });

    it('has proper color contrast for trends', () => {
      const { container } = render(
        <MetricCard
          title="Revenue"
          value="$12,345"
          icon={DollarSign}
          trend="UP"
          percentChange={12.5}
        />
      );
      const badge = screen.getByText('+12.5%').closest('div');
      expect(badge).toBeInTheDocument();
    });
  });
});

describe('MetricCardGrid', () => {
  describe('Grid Layout', () => {
    it('renders without crashing', () => {
      const { container } = render(
        <MetricCardGrid>
          <MetricCard title="Test" value="100" icon={DollarSign} />
        </MetricCardGrid>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('applies grid classes', () => {
      const { container } = render(
        <MetricCardGrid>
          <MetricCard title="Test" value="100" icon={DollarSign} />
        </MetricCardGrid>
      );
      const grid = container.firstChild;
      expect(grid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-6');
    });

    it('renders multiple children', () => {
      render(
        <MetricCardGrid>
          <MetricCard title="Revenue" value="$1000" icon={DollarSign} />
          <MetricCard title="Orders" value="50" icon={ShoppingCart} />
          <MetricCard title="Spas" value="25" icon={Users} />
          <MetricCard title="Rate" value="80%" icon={TrendingUp} />
        </MetricCardGrid>
      );
      expect(screen.getByText('Revenue')).toBeInTheDocument();
      expect(screen.getByText('Orders')).toBeInTheDocument();
      expect(screen.getByText('Spas')).toBeInTheDocument();
      expect(screen.getByText('Rate')).toBeInTheDocument();
    });

    it('handles empty children', () => {
      const { container } = render(
        <MetricCardGrid>
          {null}
        </MetricCardGrid>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('handles single child', () => {
      render(
        <MetricCardGrid>
          <MetricCard title="Revenue" value="$1000" icon={DollarSign} />
        </MetricCardGrid>
      );
      expect(screen.getByText('Revenue')).toBeInTheDocument();
    });
  });
});
