/**
 * ConflictWarning Component Tests
 *
 * DermaLogica Intelligence MVP - Phase 7: Integration & Testing
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ConflictWarning,
  ConflictList,
  Conflict,
  ConflictType,
  ConflictSeverity,
} from '../ConflictWarning';

// Mock conflict data
const mockSevereConflict: Conflict = {
  id: 'conflict-1',
  itemAId: 'p1',
  itemAName: 'Retinol Serum',
  itemBId: 'p2',
  itemBName: 'Vitamin C Serum',
  type: 'INACTIVATION',
  severity: 'severe',
  mechanism: 'The acidic pH of vitamin C can deactivate retinol molecules',
  risks: [
    'Reduced efficacy of both ingredients',
    'Potential skin irritation',
    'Wasted product',
  ],
  mitigation: {
    canUseAlternating: true,
    waitTimeBetween: 30,
    alternateProducts: ['Niacinamide Serum', 'Hyaluronic Acid'],
    advice: 'Use vitamin C in the morning and retinol at night for best results',
  },
  evidence: {
    level: 'Dermatological Studies',
    studyCount: 8,
  },
};

const mockModerateConflict: Conflict = {
  id: 'conflict-2',
  itemAId: 'p3',
  itemAName: 'AHA Peel',
  itemBId: 'p4',
  itemBName: 'BHA Cleanser',
  type: 'OVEREXFOLIATION',
  severity: 'moderate',
  mechanism: 'Combined exfoliation from AHA and BHA can compromise the skin barrier',
  risks: ['Skin irritation', 'Dryness', 'Increased sensitivity'],
};

const mockMildConflict: Conflict = {
  id: 'conflict-3',
  itemAId: 'p5',
  itemAName: 'Glycolic Acid',
  itemBId: 'p6',
  itemBName: 'Lactic Acid',
  type: 'PH_INCOMPATIBLE',
  severity: 'mild',
  mechanism: 'Both products have similar pH requirements but can over-exfoliate together',
  risks: ['Mild irritation'],
  mitigation: {
    advice: 'Alternate usage or reduce frequency when using both',
  },
};

describe('ConflictWarning', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<ConflictWarning conflict={mockSevereConflict} />);
      expect(screen.getByText('Retinol Serum')).toBeInTheDocument();
    });

    it('displays both item names', () => {
      render(<ConflictWarning conflict={mockSevereConflict} />);
      expect(screen.getByText('Retinol Serum')).toBeInTheDocument();
      expect(screen.getByText('Vitamin C Serum')).toBeInTheDocument();
    });

    it('displays severity label', () => {
      render(<ConflictWarning conflict={mockSevereConflict} />);
      expect(screen.getByText('Severe Conflict')).toBeInTheDocument();
    });

    it('displays conflict type', () => {
      render(<ConflictWarning conflict={mockSevereConflict} />);
      expect(screen.getByText('Inactivation')).toBeInTheDocument();
    });

    it('displays mechanism explanation', () => {
      render(<ConflictWarning conflict={mockSevereConflict} />);
      expect(screen.getByText(/acidic pH of vitamin C/i)).toBeInTheDocument();
    });

    it('displays risks list', () => {
      render(<ConflictWarning conflict={mockSevereConflict} />);
      expect(screen.getByText('Reduced efficacy of both ingredients')).toBeInTheDocument();
      expect(screen.getByText('Potential skin irritation')).toBeInTheDocument();
      expect(screen.getByText('Wasted product')).toBeInTheDocument();
    });

    it('displays mitigation advice', () => {
      render(<ConflictWarning conflict={mockSevereConflict} />);
      expect(screen.getByText(/vitamin C in the morning/i)).toBeInTheDocument();
    });

    it('displays wait time when provided', () => {
      render(<ConflictWarning conflict={mockSevereConflict} />);
      expect(screen.getByText('Wait 30 min')).toBeInTheDocument();
    });

    it('displays alternate days option when available', () => {
      render(<ConflictWarning conflict={mockSevereConflict} />);
      expect(screen.getByText('Can alternate days')).toBeInTheDocument();
    });

    it('displays alternate product suggestions', () => {
      render(<ConflictWarning conflict={mockSevereConflict} />);
      expect(screen.getByText(/Niacinamide Serum, Hyaluronic Acid/)).toBeInTheDocument();
    });

    it('displays evidence information', () => {
      render(<ConflictWarning conflict={mockSevereConflict} />);
      expect(screen.getByText(/Dermatological Studies/)).toBeInTheDocument();
      expect(screen.getByText(/8 studies/)).toBeInTheDocument();
    });
  });

  describe('Severity Levels', () => {
    it('renders severe conflict with correct styling', () => {
      const { container } = render(<ConflictWarning conflict={mockSevereConflict} />);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-red-50', 'border-red-200');
    });

    it('renders moderate conflict with correct styling', () => {
      const { container } = render(<ConflictWarning conflict={mockModerateConflict} />);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-orange-50', 'border-orange-200');
    });

    it('renders mild conflict with correct styling', () => {
      const { container } = render(<ConflictWarning conflict={mockMildConflict} />);
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-amber-50', 'border-amber-200');
    });
  });

  describe('Conflict Types', () => {
    const conflictTypes: ConflictType[] = [
      'INACTIVATION',
      'IRRITATION',
      'PH_INCOMPATIBLE',
      'OXIDATION',
      'PRECIPITATION',
      'ABSORPTION_BLOCK',
      'OVEREXFOLIATION',
    ];

    conflictTypes.forEach((type) => {
      it(`renders ${type} type correctly`, () => {
        const conflict = { ...mockSevereConflict, type };
        render(<ConflictWarning conflict={conflict} />);
        expect(screen.getByText('Retinol Serum')).toBeInTheDocument();
      });
    });
  });

  describe('Compact Mode', () => {
    it('hides risks in compact mode', () => {
      render(<ConflictWarning conflict={mockSevereConflict} compact />);
      expect(screen.queryByText('Reduced efficacy of both ingredients')).not.toBeInTheDocument();
    });

    it('hides alternate products in compact mode', () => {
      render(<ConflictWarning conflict={mockSevereConflict} compact />);
      expect(screen.queryByText(/Niacinamide Serum, Hyaluronic Acid/)).not.toBeInTheDocument();
    });

    it('still displays mechanism in compact mode', () => {
      render(<ConflictWarning conflict={mockSevereConflict} compact />);
      expect(screen.getByText(/acidic pH of vitamin C/i)).toBeInTheDocument();
    });

    it('still displays mitigation advice in compact mode', () => {
      render(<ConflictWarning conflict={mockSevereConflict} compact />);
      expect(screen.getByText(/vitamin C in the morning/i)).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when card is clicked', () => {
      const handleClick = vi.fn();
      render(<ConflictWarning conflict={mockSevereConflict} onClick={handleClick} />);

      const card = screen.getByText('Retinol Serum').closest('div[class*="rounded-xl"]');
      fireEvent.click(card!);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('shows causal map button when onViewCausalMap is provided', () => {
      const handleViewCausalMap = vi.fn();
      render(
        <ConflictWarning conflict={mockSevereConflict} onViewCausalMap={handleViewCausalMap} />
      );
      expect(screen.getByText('Explore in Causal Map')).toBeInTheDocument();
    });

    it('calls onViewCausalMap when button is clicked', () => {
      const handleViewCausalMap = vi.fn();
      render(
        <ConflictWarning conflict={mockSevereConflict} onViewCausalMap={handleViewCausalMap} />
      );

      fireEvent.click(screen.getByText('Explore in Causal Map'));
      expect(handleViewCausalMap).toHaveBeenCalledTimes(1);
    });

    it('does not show causal map button when onViewCausalMap is not provided', () => {
      render(<ConflictWarning conflict={mockSevereConflict} />);
      expect(screen.queryByText('Explore in Causal Map')).not.toBeInTheDocument();
    });

    it('has cursor-pointer class when onClick is provided', () => {
      const handleClick = vi.fn();
      render(<ConflictWarning conflict={mockSevereConflict} onClick={handleClick} />);
      const card = screen.getByText('Retinol Serum').closest('div[class*="rounded-xl"]');
      expect(card).toHaveClass('cursor-pointer');
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(<ConflictWarning conflict={mockSevereConflict} className="custom-class" />);
      const card = screen.getByText('Retinol Serum').closest('div[class*="rounded-xl"]');
      expect(card).toHaveClass('custom-class');
    });
  });
});

describe('ConflictList', () => {
  const mockConflicts: Conflict[] = [
    mockSevereConflict,
    mockModerateConflict,
    mockMildConflict,
  ];

  describe('Rendering', () => {
    it('renders all conflicts', () => {
      render(<ConflictList conflicts={mockConflicts} />);
      expect(screen.getByText('Retinol Serum')).toBeInTheDocument();
      expect(screen.getByText('AHA Peel')).toBeInTheDocument();
      expect(screen.getByText('Glycolic Acid')).toBeInTheDocument();
    });

    it('displays empty state when no conflicts', () => {
      render(<ConflictList conflicts={[]} />);
      expect(screen.getByText('No conflicts detected')).toBeInTheDocument();
      expect(screen.getByText('Your selection is compatible')).toBeInTheDocument();
    });

    it('sorts conflicts by severity (severe first)', () => {
      const { container } = render(<ConflictList conflicts={mockConflicts} />);
      const cards = container.querySelectorAll('div[class*="rounded-xl"]');
      // First card should be the severe conflict
      expect(cards[0]).toHaveClass('bg-red-50');
    });

    it('respects limit prop', () => {
      render(<ConflictList conflicts={mockConflicts} limit={2} />);
      expect(screen.getByText('Retinol Serum')).toBeInTheDocument();
      expect(screen.getByText('AHA Peel')).toBeInTheDocument();
      expect(screen.getByText('+1 more conflicts')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onConflictClick with correct conflict', () => {
      const handleClick = vi.fn();
      render(<ConflictList conflicts={mockConflicts} onConflictClick={handleClick} />);

      const firstCard = screen.getByText('Retinol Serum').closest('div[class*="rounded-xl"]');
      fireEvent.click(firstCard!);
      expect(handleClick).toHaveBeenCalledWith(mockSevereConflict);
    });

    it('calls onViewCausalMap with correct conflict', () => {
      const handleViewCausalMap = vi.fn();
      render(<ConflictList conflicts={mockConflicts} onViewCausalMap={handleViewCausalMap} />);

      // Click the first "Explore in Causal Map" button
      const causalMapButtons = screen.getAllByText('Explore in Causal Map');
      fireEvent.click(causalMapButtons[0]);
      expect(handleViewCausalMap).toHaveBeenCalledWith(mockSevereConflict);
    });
  });

  describe('Compact Mode', () => {
    it('passes compact prop to child cards', () => {
      render(<ConflictList conflicts={mockConflicts} compact />);
      // Risks should not be displayed in compact mode
      expect(screen.queryByText('Reduced efficacy of both ingredients')).not.toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className to container', () => {
      const { container } = render(
        <ConflictList conflicts={mockConflicts} className="custom-list-class" />
      );
      const list = container.firstChild;
      expect(list).toHaveClass('custom-list-class');
    });
  });
});
