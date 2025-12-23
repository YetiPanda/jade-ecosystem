/**
 * ValuesPerformanceGrid Component Tests
 * Feature 011: Vendor Portal MVP
 * Sprint D.2: Discovery Analytics Frontend (Task D.2.10)
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ValuesPerformanceGrid } from '../ValuesPerformanceGrid';

describe('ValuesPerformanceGrid', () => {
  const mockValues = [
    {
      value: 'ORGANIC',
      impressions: 5000,
      clicks: 800,
      conversions: 120,
      rank: 1,
      ctr: 16.0,
      conversionRate: 15.0,
    },
    {
      value: 'CRUELTY_FREE',
      impressions: 3500,
      clicks: 420,
      conversions: 63,
      rank: 2,
      ctr: 12.0,
      conversionRate: 15.0,
    },
    {
      value: 'VEGAN',
      impressions: 2800,
      clicks: 224,
      conversions: 28,
      rank: 3,
      ctr: 8.0,
      conversionRate: 12.5,
    },
    {
      value: 'SUSTAINABLE',
      impressions: 1200,
      clicks: 48,
      conversions: 5,
      rank: 4,
      ctr: 4.0,
      conversionRate: 10.4,
    },
    {
      value: 'LOCAL',
      impressions: 800,
      clicks: 24,
      conversions: 2,
      rank: 5,
      ctr: 3.0,
      conversionRate: 8.3,
    },
  ];

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      expect(screen.getByText('Values Performance')).toBeInTheDocument();
    });

    it('renders all value cards', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      expect(screen.getByText('Organic')).toBeInTheDocument();
      expect(screen.getByText('Cruelty-Free')).toBeInTheDocument();
      expect(screen.getByText('Vegan')).toBeInTheDocument();
      expect(screen.getByText('Sustainable')).toBeInTheDocument();
      expect(screen.getByText('Local')).toBeInTheDocument();
    });

    it('displays impressions for each value', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      expect(screen.getByText('5,000')).toBeInTheDocument();
      expect(screen.getByText('3,500')).toBeInTheDocument();
      expect(screen.getByText('2,800')).toBeInTheDocument();
    });

    it('displays CTR for each value', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      expect(screen.getByText('16.0%')).toBeInTheDocument();
      expect(screen.getByText('12.0%')).toBeInTheDocument();
      expect(screen.getByText('8.0%')).toBeInTheDocument();
    });

    it('displays conversion rate for each value', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      expect(screen.getByText('15.0%')).toBeInTheDocument();
      expect(screen.getByText('12.5%')).toBeInTheDocument();
      expect(screen.getByText('10.4%')).toBeInTheDocument();
    });
  });

  describe('Rank Badges', () => {
    it('displays rank 1 with gold styling', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      const rank1Badge = screen.getByText('#1');
      expect(rank1Badge).toBeInTheDocument();
      expect(rank1Badge.closest('span')).toHaveClass('bg-yellow-100', 'text-yellow-700');
    });

    it('displays rank 2 with silver styling', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      const rank2Badge = screen.getByText('#2');
      expect(rank2Badge).toBeInTheDocument();
      expect(rank2Badge.closest('span')).toHaveClass('bg-gray-200', 'text-gray-700');
    });

    it('displays rank 3 with bronze styling', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      const rank3Badge = screen.getByText('#3');
      expect(rank3Badge).toBeInTheDocument();
      expect(rank3Badge.closest('span')).toHaveClass('bg-orange-100', 'text-orange-700');
    });

    it('displays other ranks with standard styling', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      const rank4Badge = screen.getByText('#4');
      expect(rank4Badge).toBeInTheDocument();
      expect(rank4Badge.closest('span')).toHaveClass('bg-gray-100', 'text-gray-600');
    });
  });

  describe('Performance Indicators', () => {
    it('shows "Excellent" for high CTR', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      // Organic has 16% CTR which is > 15%, should be Excellent
      expect(screen.getByText('Excellent')).toBeInTheDocument();
    });

    it('shows "Good" for medium CTR', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      // Cruelty-Free has 12% CTR which is > 5% but < 15%, should be Good
      expect(screen.getByText('Good')).toBeInTheDocument();
    });

    it('shows "Needs Work" for low CTR', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      // Local has 3% CTR which is < 5%, should be Needs Work
      expect(screen.getByText('Needs Work')).toBeInTheDocument();
    });

    it('applies appropriate icon for each performance level', () => {
      const { container } = render(<ValuesPerformanceGrid values={mockValues} />);

      // Should have trend indicators (up, down, minus)
      const icons = container.querySelectorAll('svg.h-3.w-3');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe('Sorting Functionality', () => {
    it('renders sort buttons', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      expect(screen.getByText('Sort by Impressions')).toBeInTheDocument();
      expect(screen.getByText('Sort by CTR')).toBeInTheDocument();
      expect(screen.getByText('Sort by Conversion')).toBeInTheDocument();
    });

    it('changes active sort when clicking Sort by Impressions', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      const impressionsButton = screen.getByText('Sort by Impressions');
      fireEvent.click(impressionsButton);

      expect(impressionsButton).toHaveClass('bg-indigo-600', 'text-white');
    });

    it('changes active sort when clicking Sort by CTR', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      const ctrButton = screen.getByText('Sort by CTR');
      fireEvent.click(ctrButton);

      expect(ctrButton).toHaveClass('bg-indigo-600', 'text-white');
    });

    it('changes active sort when clicking Sort by Conversion', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      const conversionButton = screen.getByText('Sort by Conversion');
      fireEvent.click(conversionButton);

      expect(conversionButton).toHaveClass('bg-indigo-600', 'text-white');
    });
  });

  describe('Show More/Less Functionality', () => {
    const manyValues = Array.from({ length: 10 }, (_, i) => ({
      value: `VALUE_${i}`,
      impressions: 1000 - i * 100,
      clicks: 100 - i * 10,
      conversions: 10 - i,
      rank: i + 1,
      ctr: 10.0 - i,
      conversionRate: 10.0 - i,
    }));

    it('initially shows only 6 values when there are more than 6', () => {
      render(<ValuesPerformanceGrid values={manyValues} />);

      // Should have 6 cards visible
      const cards = screen.getAllByText(/Value/);
      expect(cards.length).toBeLessThanOrEqual(6);
    });

    it('shows "Show More" button when there are more than 6 values', () => {
      render(<ValuesPerformanceGrid values={manyValues} />);

      expect(screen.getByText('Show More')).toBeInTheDocument();
    });

    it('does not show "Show More" button when there are 6 or fewer values', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      expect(screen.queryByText('Show More')).not.toBeInTheDocument();
    });

    it('expands to show all values when "Show More" is clicked', () => {
      render(<ValuesPerformanceGrid values={manyValues} />);

      const showMoreButton = screen.getByText('Show More');
      fireEvent.click(showMoreButton);

      // Now should show all 10 values
      const cards = screen.getAllByText(/Value/);
      expect(cards.length).toBe(10);
    });

    it('shows "Show Less" button after expanding', () => {
      render(<ValuesPerformanceGrid values={manyValues} />);

      const showMoreButton = screen.getByText('Show More');
      fireEvent.click(showMoreButton);

      expect(screen.getByText('Show Less')).toBeInTheDocument();
    });

    it('collapses back to 6 values when "Show Less" is clicked', () => {
      render(<ValuesPerformanceGrid values={manyValues} />);

      // Expand
      const showMoreButton = screen.getByText('Show More');
      fireEvent.click(showMoreButton);

      // Collapse
      const showLessButton = screen.getByText('Show Less');
      fireEvent.click(showLessButton);

      // Should be back to 6 or fewer
      const cards = screen.getAllByText(/Value/);
      expect(cards.length).toBeLessThanOrEqual(6);
    });
  });

  describe('Empty State', () => {
    it('renders empty state when values array is empty', () => {
      render(<ValuesPerformanceGrid values={[]} />);

      expect(screen.getByText('No Values Data Yet')).toBeInTheDocument();
      expect(screen.getByText(/Select values in your profile/)).toBeInTheDocument();
    });

    it('does not render grid when values array is empty', () => {
      const { container } = render(<ValuesPerformanceGrid values={[]} />);

      const grid = container.querySelector('.grid');
      expect(grid).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies proper container styling', () => {
      const { container } = render(<ValuesPerformanceGrid values={mockValues} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('bg-white', 'rounded-lg', 'border');
    });

    it('applies grid layout classes', () => {
      const { container } = render(<ValuesPerformanceGrid values={mockValues} />);

      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
    });

    it('applies card styling to each value', () => {
      const { container } = render(<ValuesPerformanceGrid values={mockValues} />);

      const cards = container.querySelectorAll('.border.rounded-lg');
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Data Formatting', () => {
    it('formats large impression numbers with commas', () => {
      const largeImpressions = [
        {
          value: 'ORGANIC',
          impressions: 123456,
          clicks: 1000,
          conversions: 100,
          rank: 1,
          ctr: 10.0,
          conversionRate: 10.0,
        },
      ];

      render(<ValuesPerformanceGrid values={largeImpressions} />);

      expect(screen.getByText('123,456')).toBeInTheDocument();
    });

    it('formats percentages with one decimal place', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      expect(screen.getByText('16.0%')).toBeInTheDocument();
      expect(screen.getByText('12.5%')).toBeInTheDocument();
    });

    it('handles zero impressions', () => {
      const zeroImpressions = [
        {
          value: 'NEW_VALUE',
          impressions: 0,
          clicks: 0,
          conversions: 0,
          rank: 1,
          ctr: 0.0,
          conversionRate: 0.0,
        },
      ];

      render(<ValuesPerformanceGrid values={zeroImpressions} />);

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('0.0%')).toBeInTheDocument();
    });
  });

  describe('Value Name Formatting', () => {
    it('formats ORGANIC as "Organic"', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      expect(screen.getByText('Organic')).toBeInTheDocument();
    });

    it('formats CRUELTY_FREE as "Cruelty-Free"', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      expect(screen.getByText('Cruelty-Free')).toBeInTheDocument();
    });

    it('formats multi-word values correctly', () => {
      const multiWordValues = [
        {
          value: 'WOMAN_OWNED',
          impressions: 1000,
          clicks: 100,
          conversions: 10,
          rank: 1,
          ctr: 10.0,
          conversionRate: 10.0,
        },
      ];

      render(<ValuesPerformanceGrid values={multiWordValues} />);

      expect(screen.getByText('Woman-Owned')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      const heading = screen.getByText('Values Performance');
      expect(heading.tagName.toLowerCase()).toBe('h3');
    });

    it('renders accessible sort buttons', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('has proper color contrast for performance indicators', () => {
      render(<ValuesPerformanceGrid values={mockValues} />);

      const excellent = screen.getByText('Excellent');
      expect(excellent).toHaveClass('text-green-600');
    });
  });
});
