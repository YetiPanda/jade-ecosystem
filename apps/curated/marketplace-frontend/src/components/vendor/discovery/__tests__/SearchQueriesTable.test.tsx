/**
 * SearchQueriesTable Component Tests
 * Feature 011: Vendor Portal MVP
 * Sprint D.2: Discovery Analytics Frontend (Task D.2.10)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchQueriesTable } from '../SearchQueriesTable';

describe('SearchQueriesTable', () => {
  const mockQueries = [
    {
      query: 'organic face serum',
      volume: 1250,
      yourPosition: 1,
      topCompetitor: 'GreenBeauty Co.',
    },
    {
      query: 'anti-aging cream',
      volume: 890,
      yourPosition: 3,
      topCompetitor: 'Youth Labs',
    },
    {
      query: 'vitamin c moisturizer',
      volume: 650,
      yourPosition: 5,
      topCompetitor: 'Radiant Skin',
    },
    {
      query: 'hydrating toner',
      volume: 420,
      yourPosition: null,
      topCompetitor: 'Pure Essence',
    },
  ];

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      expect(screen.getByText('Top Search Queries')).toBeInTheDocument();
    });

    it('renders table headers', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      expect(screen.getByText('Query')).toBeInTheDocument();
      expect(screen.getByText('Volume')).toBeInTheDocument();
      expect(screen.getByText('Your Position')).toBeInTheDocument();
      expect(screen.getByText('Top Competitor')).toBeInTheDocument();
    });

    it('renders all query rows', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      expect(screen.getByText('organic face serum')).toBeInTheDocument();
      expect(screen.getByText('anti-aging cream')).toBeInTheDocument();
      expect(screen.getByText('vitamin c moisturizer')).toBeInTheDocument();
      expect(screen.getByText('hydrating toner')).toBeInTheDocument();
    });

    it('displays volume counts', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      expect(screen.getByText('1,250')).toBeInTheDocument();
      expect(screen.getByText('890')).toBeInTheDocument();
      expect(screen.getByText('650')).toBeInTheDocument();
      expect(screen.getByText('420')).toBeInTheDocument();
    });

    it('displays competitor names', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      expect(screen.getByText('GreenBeauty Co.')).toBeInTheDocument();
      expect(screen.getByText('Youth Labs')).toBeInTheDocument();
      expect(screen.getByText('Radiant Skin')).toBeInTheDocument();
      expect(screen.getByText('Pure Essence')).toBeInTheDocument();
    });
  });

  describe('Position Badges', () => {
    it('displays position 1 with trophy icon and gold styling', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      const firstPosition = screen.getByText('#1');
      expect(firstPosition).toBeInTheDocument();
      expect(firstPosition.closest('span')).toHaveClass('bg-yellow-100', 'text-yellow-700');
    });

    it('displays position 3 with appropriate styling', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      const thirdPosition = screen.getByText('#3');
      expect(thirdPosition).toBeInTheDocument();
      expect(thirdPosition.closest('span')).toHaveClass('bg-blue-100', 'text-blue-700');
    });

    it('displays position 5 with appropriate styling', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      const fifthPosition = screen.getByText('#5');
      expect(fifthPosition).toBeInTheDocument();
      expect(fifthPosition.closest('span')).toHaveClass('bg-green-100', 'text-green-700');
    });

    it('displays "Not Ranked" for null position', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      expect(screen.getByText('Not Ranked')).toBeInTheDocument();
    });

    it('renders trophy icon for position 1', () => {
      const { container } = render(<SearchQueriesTable queries={mockQueries} />);

      const firstPositionBadge = screen.getByText('#1').closest('span');
      const icon = firstPositionBadge?.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Sorting Functionality', () => {
    it('renders sort buttons', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      expect(screen.getByText('Sort by Volume')).toBeInTheDocument();
      expect(screen.getByText('Sort by Position')).toBeInTheDocument();
    });

    it('changes active sort when Sort by Volume is clicked', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      const volumeButton = screen.getByText('Sort by Volume');
      fireEvent.click(volumeButton);

      // Button should have active styling
      expect(volumeButton).toHaveClass('bg-indigo-600', 'text-white');
    });

    it('changes active sort when Sort by Position is clicked', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      const positionButton = screen.getByText('Sort by Position');
      fireEvent.click(positionButton);

      // Button should have active styling
      expect(positionButton).toHaveClass('bg-indigo-600', 'text-white');
    });

    it('sorts queries by volume in descending order', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      const volumeButton = screen.getByText('Sort by Volume');
      fireEvent.click(volumeButton);

      const rows = screen.getAllByRole('row');
      // First row is header, second should have highest volume
      expect(rows[1]).toHaveTextContent('1,250');
    });

    it('sorts queries by position in ascending order', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      const positionButton = screen.getByText('Sort by Position');
      fireEvent.click(positionButton);

      const rows = screen.getAllByRole('row');
      // First row is header, second should have best position (#1)
      expect(rows[1]).toHaveTextContent('#1');
    });

    it('places unranked queries at the end when sorting by position', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      const positionButton = screen.getByText('Sort by Position');
      fireEvent.click(positionButton);

      const rows = screen.getAllByRole('row');
      // Last row should be unranked
      expect(rows[rows.length - 1]).toHaveTextContent('Not Ranked');
    });
  });

  describe('Empty State', () => {
    it('renders empty state when queries array is empty', () => {
      render(<SearchQueriesTable queries={[]} />);

      expect(screen.getByText('No Search Data Yet')).toBeInTheDocument();
      expect(screen.getByText(/Once spas start searching/)).toBeInTheDocument();
    });

    it('does not render table when queries array is empty', () => {
      render(<SearchQueriesTable queries={[]} />);

      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('renders table when queries array has items', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies proper container styling', () => {
      const { container } = render(<SearchQueriesTable queries={mockQueries} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('bg-white', 'rounded-lg', 'border');
    });

    it('applies proper table styling', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      const table = screen.getByRole('table');
      expect(table).toHaveClass('w-full');
    });

    it('applies hover effect to table rows', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      const rows = screen.getAllByRole('row');
      // Skip header row
      rows.slice(1).forEach(row => {
        expect(row).toHaveClass('hover:bg-gray-50');
      });
    });

    it('applies proper heading styling', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      const heading = screen.getByText('Top Search Queries');
      expect(heading).toHaveClass('text-lg', 'font-semibold');
    });
  });

  describe('Data Formatting', () => {
    it('formats volume with commas', () => {
      const largeVolumeQueries = [
        {
          query: 'popular search',
          volume: 123456,
          yourPosition: 1,
          topCompetitor: 'Competitor',
        },
      ];

      render(<SearchQueriesTable queries={largeVolumeQueries} />);

      expect(screen.getByText('123,456')).toBeInTheDocument();
    });

    it('handles single digit volumes', () => {
      const lowVolumeQueries = [
        {
          query: 'niche search',
          volume: 5,
          yourPosition: 1,
          topCompetitor: 'Competitor',
        },
      ];

      render(<SearchQueriesTable queries={lowVolumeQueries} />);

      expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('handles zero volume', () => {
      const zeroVolumeQueries = [
        {
          query: 'no results',
          volume: 0,
          yourPosition: null,
          topCompetitor: 'Competitor',
        },
      ];

      render(<SearchQueriesTable queries={zeroVolumeQueries} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('Complex Scenarios', () => {
    it('handles queries with same volume', () => {
      const sameVolumeQueries = [
        {
          query: 'query 1',
          volume: 100,
          yourPosition: 1,
          topCompetitor: 'Comp 1',
        },
        {
          query: 'query 2',
          volume: 100,
          yourPosition: 2,
          topCompetitor: 'Comp 2',
        },
      ];

      render(<SearchQueriesTable queries={sameVolumeQueries} />);

      expect(screen.getByText('query 1')).toBeInTheDocument();
      expect(screen.getByText('query 2')).toBeInTheDocument();
    });

    it('handles queries with same position', () => {
      const samePositionQueries = [
        {
          query: 'query 1',
          volume: 100,
          yourPosition: 1,
          topCompetitor: 'Comp 1',
        },
        {
          query: 'query 2',
          volume: 50,
          yourPosition: 1,
          topCompetitor: 'Comp 2',
        },
      ];

      render(<SearchQueriesTable queries={samePositionQueries} />);

      const positions = screen.getAllByText('#1');
      expect(positions.length).toBe(2);
    });

    it('handles long query text', () => {
      const longQueryQueries = [
        {
          query: 'very long search query that should wrap or truncate properly',
          volume: 100,
          yourPosition: 1,
          topCompetitor: 'Competitor',
        },
      ];

      render(<SearchQueriesTable queries={longQueryQueries} />);

      expect(screen.getByText(/very long search query/)).toBeInTheDocument();
    });

    it('handles long competitor names', () => {
      const longCompetitorQueries = [
        {
          query: 'search',
          volume: 100,
          yourPosition: 1,
          topCompetitor: 'Very Long Competitor Name That Might Need Truncation',
        },
      ];

      render(<SearchQueriesTable queries={longCompetitorQueries} />);

      expect(screen.getByText(/Very Long Competitor Name/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper table structure', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toBe(4);
    });

    it('has proper heading hierarchy', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      const heading = screen.getByText('Top Search Queries');
      expect(heading.tagName.toLowerCase()).toBe('h3');
    });

    it('renders accessible sort buttons', () => {
      render(<SearchQueriesTable queries={mockQueries} />);

      const volumeButton = screen.getByRole('button', { name: /Sort by Volume/i });
      const positionButton = screen.getByRole('button', { name: /Sort by Position/i });

      expect(volumeButton).toBeInTheDocument();
      expect(positionButton).toBeInTheDocument();
    });
  });
});
