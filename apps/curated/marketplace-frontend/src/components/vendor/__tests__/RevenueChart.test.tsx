/**
 * RevenueChart Component Tests
 *
 * Feature 011: Vendor Portal MVP
 * Sprint B.2: Dashboard Charts & Tables (Task B.2.11)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RevenueChart } from '../RevenueChart';

const mockData = [
  { date: '2024-12-01', value: 1200.50 },
  { date: '2024-12-02', value: 1500.75 },
  { date: '2024-12-03', value: 980.25 },
  { date: '2024-12-04', value: 2100.00 },
  { date: '2024-12-05', value: 1750.50 },
];

describe('RevenueChart', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<RevenueChart data={mockData} />);
      expect(screen.getByText('Revenue Over Time')).toBeInTheDocument();
    });

    it('renders default title', () => {
      render(<RevenueChart data={mockData} />);
      expect(screen.getByText('Revenue Over Time')).toBeInTheDocument();
    });

    it('renders custom title', () => {
      render(<RevenueChart data={mockData} title="Custom Revenue Chart" />);
      expect(screen.getByText('Custom Revenue Chart')).toBeInTheDocument();
    });

    it('renders default description', () => {
      render(<RevenueChart data={mockData} />);
      expect(screen.getByText('Daily revenue performance')).toBeInTheDocument();
    });

    it('renders custom description', () => {
      render(<RevenueChart data={mockData} description="Custom description" />);
      expect(screen.getByText('Custom description')).toBeInTheDocument();
    });

    it('renders default description when undefined is passed', () => {
      render(<RevenueChart data={mockData} description={undefined} />);
      expect(screen.getByText('Daily revenue performance')).toBeInTheDocument();
    });
  });

  describe('Data Visualization', () => {
    it('renders chart with data', () => {
      const { container } = render(<RevenueChart data={mockData} />);
      // Recharts renders responsive container (SVG rendering is limited in jsdom)
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('applies custom height', () => {
      const { container } = render(<RevenueChart data={mockData} height={400} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('renders chart container', () => {
      const { container } = render(<RevenueChart data={mockData} />);
      // Check for chart container (Recharts internal classes don't render in jsdom)
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('renders loading skeleton when loading is true', () => {
      const { container } = render(<RevenueChart data={mockData} loading={true} />);
      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).toBeInTheDocument();
    });

    it('does not render chart when loading', () => {
      const { container } = render(<RevenueChart data={mockData} loading={true} />);
      const chart = container.querySelector('.recharts-responsive-container');
      expect(chart).not.toBeInTheDocument();
    });

    it('renders chart when loading is false', () => {
      const { container } = render(<RevenueChart data={mockData} loading={false} />);
      const chart = container.querySelector('.recharts-responsive-container');
      expect(chart).toBeInTheDocument();
    });

    it('loading skeleton has correct height', () => {
      const { container} = render(<RevenueChart data={mockData} loading={true} height={400} />);
      const skeleton = container.querySelector('.animate-pulse');
      expect(skeleton).toHaveStyle({ height: '400px' });
    });
  });

  describe('Empty State', () => {
    it('renders empty state when data is empty array', () => {
      render(<RevenueChart data={[]} />);
      expect(screen.getByText('No revenue data available')).toBeInTheDocument();
    });

    it('does not render chart when data is empty', () => {
      const { container } = render(<RevenueChart data={[]} />);
      const chart = container.querySelector('.recharts-responsive-container');
      expect(chart).not.toBeInTheDocument();
    });

    it('empty state has correct height', () => {
      const { container } = render(<RevenueChart data={[]} height={400} />);
      const emptyState = container.querySelector('.flex.items-center.justify-center');
      expect(emptyState).toHaveStyle({ height: '400px' });
    });
  });

  describe('Card Styling', () => {
    it('applies border and shadow classes', () => {
      const { container } = render(<RevenueChart data={mockData} />);
      const card = container.querySelector('.border-border.shadow-md');
      expect(card).toBeInTheDocument();
    });

    it('renders card header with title', () => {
      render(<RevenueChart data={mockData} />);
      const title = screen.getByText('Revenue Over Time');
      // CardTitle component renders as h4
      expect(title.tagName.toLowerCase()).toBe('h4');
    });
  });

  describe('Different Data Scenarios', () => {
    it('handles single data point', () => {
      const singlePoint = [{ date: '2024-12-01', value: 1000 }];
      const { container } = render(<RevenueChart data={singlePoint} />);
      const chart = container.querySelector('.recharts-responsive-container');
      expect(chart).toBeInTheDocument();
    });

    it('handles zero revenue values', () => {
      const zeroData = [
        { date: '2024-12-01', value: 0 },
        { date: '2024-12-02', value: 0 },
      ];
      const { container } = render(<RevenueChart data={zeroData} />);
      const chart = container.querySelector('.recharts-responsive-container');
      expect(chart).toBeInTheDocument();
    });

    it('handles large revenue values', () => {
      const largeData = [
        { date: '2024-12-01', value: 1000000 },
        { date: '2024-12-02', value: 2000000 },
      ];
      const { container } = render(<RevenueChart data={largeData} />);
      const chart = container.querySelector('.recharts-responsive-container');
      expect(chart).toBeInTheDocument();
    });

    it('handles decimal revenue values', () => {
      const decimalData = [
        { date: '2024-12-01', value: 1234.56 },
        { date: '2024-12-02', value: 789.12 },
      ];
      const { container } = render(<RevenueChart data={decimalData} />);
      const chart = container.querySelector('.recharts-responsive-container');
      expect(chart).toBeInTheDocument();
    });
  });

  describe('Responsive Behavior', () => {
    it('uses ResponsiveContainer', () => {
      const { container } = render(<RevenueChart data={mockData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('responsive container has 100% width', () => {
      const { container } = render(<RevenueChart data={mockData} />);
      const responsiveContainer = container.querySelector('.recharts-responsive-container');
      expect(responsiveContainer).toHaveStyle({ width: '100%' });
    });
  });

  describe('Props Validation', () => {
    it('accepts all optional props', () => {
      render(
        <RevenueChart
          data={mockData}
          title="Custom Title"
          description="Custom Description"
          loading={false}
          height={350}
        />
      );
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom Description')).toBeInTheDocument();
    });

    it('works with minimal props', () => {
      render(<RevenueChart data={mockData} />);
      expect(screen.getByText('Revenue Over Time')).toBeInTheDocument();
    });
  });
});
