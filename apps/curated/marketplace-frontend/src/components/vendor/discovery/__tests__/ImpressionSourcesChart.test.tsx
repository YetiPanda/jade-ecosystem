/**
 * ImpressionSourcesChart Component Tests
 * Feature 011: Vendor Portal MVP
 * Sprint D.2: Discovery Analytics Frontend (Task D.2.10)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImpressionSourcesChart } from '../ImpressionSourcesChart';

describe('ImpressionSourcesChart', () => {
  const mockImpressions = {
    total: 10000,
    bySource: [
      { source: 'SEARCH', count: 4500, percentage: 45.0 },
      { source: 'VALUES', count: 2500, percentage: 25.0 },
      { source: 'CATEGORY', count: 1500, percentage: 15.0 },
      { source: 'RECOMMENDED', count: 1000, percentage: 10.0 },
      { source: 'DIRECT', count: 500, percentage: 5.0 },
    ],
    trend: 'UP' as const,
    percentChange: 12.5,
  };

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<ImpressionSourcesChart impressions={mockImpressions} />);

      expect(screen.getByText('Traffic Sources')).toBeInTheDocument();
    });

    it('displays total impressions count', () => {
      render(<ImpressionSourcesChart impressions={mockImpressions} />);

      expect(screen.getByText('10,000')).toBeInTheDocument();
    });

    it('displays trend indicator when trend is UP', () => {
      render(<ImpressionSourcesChart impressions={mockImpressions} />);

      expect(screen.getByText('+12.5%')).toBeInTheDocument();
    });

    it('displays trend indicator when trend is DOWN', () => {
      const downImpressions = {
        ...mockImpressions,
        trend: 'DOWN' as const,
        percentChange: -8.3,
      };

      render(<ImpressionSourcesChart impressions={downImpressions} />);

      expect(screen.getByText('-8.3%')).toBeInTheDocument();
    });

    it('displays trend indicator when trend is FLAT', () => {
      const flatImpressions = {
        ...mockImpressions,
        trend: 'FLAT' as const,
        percentChange: 0.5,
      };

      render(<ImpressionSourcesChart impressions={flatImpressions} />);

      expect(screen.getByText('+0.5%')).toBeInTheDocument();
    });

    it('renders SVG donut chart', () => {
      const { container } = render(<ImpressionSourcesChart impressions={mockImpressions} />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Source Legend', () => {
    it('renders all 5 traffic sources in legend', () => {
      render(<ImpressionSourcesChart impressions={mockImpressions} />);

      expect(screen.getByText('Search Results')).toBeInTheDocument();
      expect(screen.getByText('Values Match')).toBeInTheDocument();
      expect(screen.getByText('Category Browse')).toBeInTheDocument();
      expect(screen.getByText('Recommended')).toBeInTheDocument();
      expect(screen.getByText('Direct Traffic')).toBeInTheDocument();
    });

    it('displays percentage for each source', () => {
      render(<ImpressionSourcesChart impressions={mockImpressions} />);

      expect(screen.getByText('45.0%')).toBeInTheDocument();
      expect(screen.getByText('25.0%')).toBeInTheDocument();
      expect(screen.getByText('15.0%')).toBeInTheDocument();
      expect(screen.getByText('10.0%')).toBeInTheDocument();
      expect(screen.getByText('5.0%')).toBeInTheDocument();
    });

    it('displays count for each source', () => {
      render(<ImpressionSourcesChart impressions={mockImpressions} />);

      expect(screen.getByText('4,500')).toBeInTheDocument();
      expect(screen.getByText('2,500')).toBeInTheDocument();
      expect(screen.getByText('1,500')).toBeInTheDocument();
      expect(screen.getByText('1,000')).toBeInTheDocument();
      expect(screen.getByText('500')).toBeInTheDocument();
    });
  });

  describe('SVG Chart Structure', () => {
    it('renders circle elements for donut segments', () => {
      const { container } = render(<ImpressionSourcesChart impressions={mockImpressions} />);

      const circles = container.querySelectorAll('circle');
      // Should have background circle + 5 source segments
      expect(circles.length).toBeGreaterThanOrEqual(5);
    });

    it('applies different colors to each segment', () => {
      const { container } = render(<ImpressionSourcesChart impressions={mockImpressions} />);

      const circles = container.querySelectorAll('circle[stroke]:not([stroke="rgb(229, 231, 235)"])');
      expect(circles.length).toBe(5);
    });

    it('has proper viewBox dimensions', () => {
      const { container } = render(<ImpressionSourcesChart impressions={mockImpressions} />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 200 200');
    });
  });

  describe('Empty States', () => {
    it('handles zero total impressions', () => {
      const emptyImpressions = {
        total: 0,
        bySource: [],
        trend: 'FLAT' as const,
        percentChange: 0,
      };

      render(<ImpressionSourcesChart impressions={emptyImpressions} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles missing trend data', () => {
      const noTrendImpressions = {
        ...mockImpressions,
        trend: undefined as any,
        percentChange: undefined as any,
      };

      render(<ImpressionSourcesChart impressions={noTrendImpressions} />);

      expect(screen.getByText('Traffic Sources')).toBeInTheDocument();
    });

    it('handles empty bySource array', () => {
      const noSourcesImpressions = {
        total: 1000,
        bySource: [],
        trend: 'UP' as const,
        percentChange: 5.0,
      };

      render(<ImpressionSourcesChart impressions={noSourcesImpressions} />);

      expect(screen.getByText('1,000')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies proper container styling', () => {
      const { container } = render(<ImpressionSourcesChart impressions={mockImpressions} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('bg-white', 'rounded-lg', 'border');
    });

    it('applies proper heading styling', () => {
      render(<ImpressionSourcesChart impressions={mockImpressions} />);

      const heading = screen.getByText('Traffic Sources');
      expect(heading).toHaveClass('text-lg', 'font-semibold');
    });

    it('applies trend badge styling for UP trend', () => {
      render(<ImpressionSourcesChart impressions={mockImpressions} />);

      const badge = screen.getByText('+12.5%');
      expect(badge.closest('span')).toHaveClass('bg-green-100', 'text-green-700');
    });

    it('applies trend badge styling for DOWN trend', () => {
      const downImpressions = {
        ...mockImpressions,
        trend: 'DOWN' as const,
        percentChange: -5.0,
      };

      render(<ImpressionSourcesChart impressions={downImpressions} />);

      const badge = screen.getByText('-5.0%');
      expect(badge.closest('span')).toHaveClass('bg-red-100', 'text-red-700');
    });
  });

  describe('Data Formatting', () => {
    it('formats large numbers with commas', () => {
      const largeImpressions = {
        ...mockImpressions,
        total: 1234567,
        bySource: [
          { source: 'SEARCH', count: 1234567, percentage: 100.0 },
        ],
      };

      render(<ImpressionSourcesChart impressions={largeImpressions} />);

      expect(screen.getByText('1,234,567')).toBeInTheDocument();
    });

    it('displays percentage with one decimal place', () => {
      const preciseImpressions = {
        ...mockImpressions,
        bySource: [
          { source: 'SEARCH', count: 333, percentage: 33.3 },
          { source: 'VALUES', count: 667, percentage: 66.7 },
        ],
      };

      render(<ImpressionSourcesChart impressions={preciseImpressions} />);

      expect(screen.getByText('33.3%')).toBeInTheDocument();
      expect(screen.getByText('66.7%')).toBeInTheDocument();
    });

    it('handles percentage less than 1%', () => {
      const smallPercentImpressions = {
        ...mockImpressions,
        bySource: [
          ...mockImpressions.bySource,
          { source: 'OTHER', count: 5, percentage: 0.05 },
        ],
      };

      render(<ImpressionSourcesChart impressions={smallPercentImpressions} />);

      expect(screen.getByText('0.1%')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<ImpressionSourcesChart impressions={mockImpressions} />);

      const heading = screen.getByText('Traffic Sources');
      expect(heading.tagName.toLowerCase()).toBe('h3');
    });

    it('renders accessible SVG', () => {
      const { container } = render(<ImpressionSourcesChart impressions={mockImpressions} />);

      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('role', 'img');
    });
  });
});
