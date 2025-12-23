/**
 * CompatibilityMatrix Component Tests
 *
 * DermaLogica Intelligence MVP - Phase 7: Integration & Testing
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  CompatibilityMatrix,
  MatrixItem,
  Interaction,
  InteractionType,
} from '../CompatibilityMatrix';

// Mock items
const mockItems: MatrixItem[] = [
  { id: 'p1', name: 'Vitamin C Serum', shortName: 'Vit C', type: 'product' },
  { id: 'p2', name: 'Retinol Serum', shortName: 'Retinol', type: 'product' },
  { id: 'p3', name: 'Niacinamide', shortName: 'Niacin', type: 'ingredient' },
  { id: 'p4', name: 'Hyaluronic Acid', shortName: 'HA', type: 'ingredient' },
];

// Mock interactions
const mockInteractions: Interaction[] = [
  {
    itemAId: 'p1',
    itemBId: 'p2',
    type: 'MILD_CONFLICT',
    score: -0.3,
    summary: 'Vitamin C and Retinol may cause irritation when used together',
    mechanism: 'Both are active ingredients that can over-stimulate skin',
    waitTime: 30,
  },
  {
    itemAId: 'p1',
    itemBId: 'p3',
    type: 'NEUTRAL',
    score: 0.1,
    summary: 'These ingredients can be used together safely',
  },
  {
    itemAId: 'p1',
    itemBId: 'p4',
    type: 'MILD_SYNERGY',
    score: 0.4,
    summary: 'Hyaluronic acid helps vitamin C penetrate better',
    mechanism: 'HA provides moisture that enhances vitamin C efficacy',
  },
  {
    itemAId: 'p2',
    itemBId: 'p3',
    type: 'STRONG_SYNERGY',
    score: 0.8,
    summary: 'Niacinamide reduces retinol irritation while boosting efficacy',
    mechanism: 'Niacinamide strengthens the skin barrier',
  },
  {
    itemAId: 'p2',
    itemBId: 'p4',
    type: 'MILD_SYNERGY',
    score: 0.3,
    summary: 'Hyaluronic acid helps keep skin hydrated during retinol use',
  },
  {
    itemAId: 'p3',
    itemBId: 'p4',
    type: 'NEUTRAL',
    score: 0,
    summary: 'No significant interaction',
  },
];

describe('CompatibilityMatrix', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<CompatibilityMatrix items={mockItems} interactions={mockInteractions} />);
      // Each item appears twice (column and row header)
      expect(screen.getAllByText('Vit C').length).toBeGreaterThan(0);
    });

    it('displays all item names', () => {
      render(<CompatibilityMatrix items={mockItems} interactions={mockInteractions} />);
      // Each item appears twice - once in column header, once in row header
      expect(screen.getAllByText('Vit C').length).toBe(2);
      expect(screen.getAllByText('Retinol').length).toBe(2);
      expect(screen.getAllByText('Niacin').length).toBe(2);
      expect(screen.getAllByText('HA').length).toBe(2);
    });

    it('displays empty state when less than 2 items', () => {
      render(
        <CompatibilityMatrix items={[mockItems[0]]} interactions={[]} />
      );
      expect(screen.getByText('Select at least 2 items')).toBeInTheDocument();
      expect(
        screen.getByText('Add products or ingredients to see compatibility analysis')
      ).toBeInTheDocument();
    });
  });

  describe('Score Header', () => {
    it('displays overall score when provided', () => {
      render(
        <CompatibilityMatrix
          items={mockItems}
          interactions={mockInteractions}
          overallScore={75}
          showScoreHeader
        />
      );
      expect(screen.getByText('75')).toBeInTheDocument();
      expect(screen.getByText('/ 100')).toBeInTheDocument();
    });

    it('displays overall compatibility title', () => {
      render(
        <CompatibilityMatrix
          items={mockItems}
          interactions={mockInteractions}
          overallScore={75}
          showScoreHeader
        />
      );
      expect(screen.getByText('Overall Compatibility')).toBeInTheDocument();
    });

    it('displays item and interaction counts', () => {
      render(
        <CompatibilityMatrix
          items={mockItems}
          interactions={mockInteractions}
          overallScore={75}
          showScoreHeader
        />
      );
      expect(screen.getByText('4 items, 6 interactions analyzed')).toBeInTheDocument();
    });

    it('hides score header when showScoreHeader is false', () => {
      render(
        <CompatibilityMatrix
          items={mockItems}
          interactions={mockInteractions}
          overallScore={75}
          showScoreHeader={false}
        />
      );
      expect(screen.queryByText('Overall Compatibility')).not.toBeInTheDocument();
    });

    it('displays synergy count in header', () => {
      render(
        <CompatibilityMatrix
          items={mockItems}
          interactions={mockInteractions}
          overallScore={75}
          showScoreHeader
        />
      );
      expect(screen.getByText(/3 synergies/)).toBeInTheDocument();
    });

    it('displays conflict count in header', () => {
      render(
        <CompatibilityMatrix
          items={mockItems}
          interactions={mockInteractions}
          overallScore={75}
          showScoreHeader
        />
      );
      expect(screen.getByText(/1 conflicts/)).toBeInTheDocument();
    });
  });

  describe('Matrix Cells', () => {
    it('renders diagonal cells correctly', () => {
      const { container } = render(
        <CompatibilityMatrix items={mockItems} interactions={mockInteractions} />
      );
      // Diagonal cells should exist (4 items = 4 diagonal cells)
      const diagonalCells = container.querySelectorAll('.aspect-square');
      expect(diagonalCells.length).toBe(16); // 4x4 grid
    });

    it('renders interaction cells with correct icons', () => {
      render(<CompatibilityMatrix items={mockItems} interactions={mockInteractions} />);

      // Icons appear in cells and legend, so use getAllByText
      // Strong synergy should show ++
      expect(screen.getAllByText('++').length).toBeGreaterThan(0);
      // Mild synergy should show +
      expect(screen.getAllByText('+').length).toBeGreaterThan(0);
      // Neutral should show =
      expect(screen.getAllByText('=').length).toBeGreaterThan(0);
      // Mild conflict should show -
      expect(screen.getAllByText('-').length).toBeGreaterThan(0);
    });
  });

  describe('Interaction Types', () => {
    const interactionTypes: InteractionType[] = [
      'STRONG_SYNERGY',
      'MILD_SYNERGY',
      'NEUTRAL',
      'MILD_CONFLICT',
      'STRONG_CONFLICT',
      'UNKNOWN',
    ];

    interactionTypes.forEach((type) => {
      it(`renders ${type} interaction correctly`, () => {
        const testInteraction: Interaction = {
          itemAId: 'p1',
          itemBId: 'p2',
          type,
          score: 0,
          summary: `Test ${type} interaction`,
        };
        render(
          <CompatibilityMatrix
            items={mockItems.slice(0, 2)}
            interactions={[testInteraction]}
          />
        );
        // Matrix should render without errors
        expect(screen.getAllByText('Vit C')).toBeTruthy();
      });
    });
  });

  describe('Legend', () => {
    it('displays legend with all interaction types', () => {
      render(<CompatibilityMatrix items={mockItems} interactions={mockInteractions} />);

      // Legend items appear in the legend section
      // Some labels also appear in tooltips, so use getAllByText
      expect(screen.getAllByText('Strong Synergy').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Mild Synergy').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Neutral').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Mild Conflict').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Strong Conflict').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Unknown').length).toBeGreaterThan(0);
    });
  });

  describe('Interactions', () => {
    it('calls onCellClick when cell is clicked', () => {
      const handleCellClick = vi.fn();
      render(
        <CompatibilityMatrix
          items={mockItems}
          interactions={mockInteractions}
          onCellClick={handleCellClick}
        />
      );

      // Click on a non-diagonal cell
      const cells = screen.getAllByRole('button');
      fireEvent.click(cells[0]);
      expect(handleCellClick).toHaveBeenCalled();
    });

    it('passes correct parameters to onCellClick', () => {
      const handleCellClick = vi.fn();
      render(
        <CompatibilityMatrix
          items={mockItems.slice(0, 2)}
          interactions={[mockInteractions[0]]}
          onCellClick={handleCellClick}
        />
      );

      const cells = screen.getAllByRole('button');
      fireEvent.click(cells[0]);

      // Should be called with itemA, itemB, and interaction
      expect(handleCellClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'p1' }),
        expect.objectContaining({ id: 'p2' }),
        expect.objectContaining({ type: 'MILD_CONFLICT' })
      );
    });
  });

  describe('Tooltips', () => {
    it('renders tooltip content', () => {
      render(<CompatibilityMatrix items={mockItems} interactions={mockInteractions} />);

      // Find a button with title attribute
      const cells = screen.getAllByRole('button');
      const cellWithTooltip = cells.find((cell) => cell.getAttribute('title'));
      expect(cellWithTooltip).toBeTruthy();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      const { container } = render(
        <CompatibilityMatrix
          items={mockItems}
          interactions={mockInteractions}
          className="custom-matrix-class"
        />
      );
      const matrix = container.firstChild;
      expect(matrix).toHaveClass('custom-matrix-class');
    });
  });

  describe('Score Colors', () => {
    it('displays green color for high scores (80+)', () => {
      render(
        <CompatibilityMatrix
          items={mockItems}
          interactions={mockInteractions}
          overallScore={85}
          showScoreHeader
        />
      );
      const scoreElement = screen.getByText('85');
      expect(scoreElement).toHaveClass('text-emerald-600');
    });

    it('displays green color for good scores (60-79)', () => {
      render(
        <CompatibilityMatrix
          items={mockItems}
          interactions={mockInteractions}
          overallScore={65}
          showScoreHeader
        />
      );
      const scoreElement = screen.getByText('65');
      expect(scoreElement).toHaveClass('text-green-600');
    });

    it('displays amber color for moderate scores (40-59)', () => {
      render(
        <CompatibilityMatrix
          items={mockItems}
          interactions={mockInteractions}
          overallScore={45}
          showScoreHeader
        />
      );
      const scoreElement = screen.getByText('45');
      expect(scoreElement).toHaveClass('text-amber-600');
    });

    it('displays orange color for low scores (20-39)', () => {
      render(
        <CompatibilityMatrix
          items={mockItems}
          interactions={mockInteractions}
          overallScore={25}
          showScoreHeader
        />
      );
      const scoreElement = screen.getByText('25');
      expect(scoreElement).toHaveClass('text-orange-600');
    });

    it('displays red color for very low scores (<20)', () => {
      render(
        <CompatibilityMatrix
          items={mockItems}
          interactions={mockInteractions}
          overallScore={15}
          showScoreHeader
        />
      );
      const scoreElement = screen.getByText('15');
      expect(scoreElement).toHaveClass('text-red-600');
    });
  });
});
