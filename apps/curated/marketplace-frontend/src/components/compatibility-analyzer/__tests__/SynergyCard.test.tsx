/**
 * SynergyCard Component Tests
 *
 * DermaLogica Intelligence MVP - Phase 7: Integration & Testing
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SynergyCard, SynergyList, Synergy, SynergyType, SynergyStrength } from '../SynergyCard';

// Mock synergy data
const mockSynergy: Synergy = {
  id: 'synergy-1',
  itemAId: 'p1',
  itemAName: 'Vitamin C Serum',
  itemBId: 'p2',
  itemBName: 'Vitamin E Serum',
  type: 'ENHANCING',
  strength: 'strong',
  benefitMultiplier: 1.5,
  mechanism: 'Vitamin E regenerates oxidized vitamin C, extending its protective effects',
  benefits: [
    'Enhanced antioxidant protection',
    'Extended vitamin C stability',
    'Better UV damage prevention',
  ],
  usage: 'Apply vitamin C first, followed by vitamin E for maximum synergy',
  evidence: {
    level: 'Clinical Studies',
    studyCount: 12,
  },
};

const mockCompactSynergy: Synergy = {
  id: 'synergy-2',
  itemAId: 'p3',
  itemAName: 'Niacinamide',
  itemBId: 'p4',
  itemBName: 'Hyaluronic Acid',
  type: 'COMPLEMENTARY',
  strength: 'moderate',
  mechanism: 'Both work through different pathways to improve skin hydration',
  benefits: ['Improved hydration', 'Better skin barrier'],
};

describe('SynergyCard', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<SynergyCard synergy={mockSynergy} />);
      expect(screen.getByText('Vitamin C Serum')).toBeInTheDocument();
    });

    it('displays both item names', () => {
      render(<SynergyCard synergy={mockSynergy} />);
      expect(screen.getByText('Vitamin C Serum')).toBeInTheDocument();
      expect(screen.getByText('Vitamin E Serum')).toBeInTheDocument();
    });

    it('displays the synergy type badge', () => {
      render(<SynergyCard synergy={mockSynergy} />);
      expect(screen.getByText('Enhancing')).toBeInTheDocument();
    });

    it('displays the mechanism explanation', () => {
      render(<SynergyCard synergy={mockSynergy} />);
      expect(screen.getByText(/Vitamin E regenerates oxidized vitamin C/i)).toBeInTheDocument();
    });

    it('displays benefits list', () => {
      render(<SynergyCard synergy={mockSynergy} />);
      expect(screen.getByText('Enhanced antioxidant protection')).toBeInTheDocument();
      expect(screen.getByText('Extended vitamin C stability')).toBeInTheDocument();
      expect(screen.getByText('Better UV damage prevention')).toBeInTheDocument();
    });

    it('displays usage tip', () => {
      render(<SynergyCard synergy={mockSynergy} />);
      expect(screen.getByText(/Apply vitamin C first/i)).toBeInTheDocument();
    });

    it('displays evidence information', () => {
      render(<SynergyCard synergy={mockSynergy} />);
      expect(screen.getByText(/Clinical Studies/)).toBeInTheDocument();
      expect(screen.getByText(/12 studies/)).toBeInTheDocument();
    });
  });

  describe('Benefit Multiplier', () => {
    it('displays benefit multiplier when greater than 1', () => {
      render(<SynergyCard synergy={mockSynergy} />);
      expect(screen.getByText('+50%')).toBeInTheDocument();
    });

    it('does not display benefit multiplier when not provided', () => {
      render(<SynergyCard synergy={mockCompactSynergy} />);
      expect(screen.queryByText('%')).not.toBeInTheDocument();
    });
  });

  describe('Synergy Types', () => {
    const synergyTypes: SynergyType[] = [
      'ENHANCING',
      'COMPLEMENTARY',
      'STABILIZING',
      'PROTECTIVE',
      'PENETRATION',
      'FORMULATION',
    ];

    synergyTypes.forEach((type) => {
      it(`renders ${type} type correctly`, () => {
        const synergy = { ...mockSynergy, type };
        render(<SynergyCard synergy={synergy} />);
        // Each type should have a badge displayed
        const container = screen.getByText('Vitamin C Serum').closest('div');
        expect(container).toBeInTheDocument();
      });
    });
  });

  describe('Strength Indicators', () => {
    const strengths: SynergyStrength[] = ['mild', 'moderate', 'strong'];

    strengths.forEach((strength) => {
      it(`renders ${strength} strength correctly`, () => {
        const synergy = { ...mockSynergy, strength };
        const { container } = render(<SynergyCard synergy={synergy} />);
        // Should have strength dots
        const dots = container.querySelectorAll('.rounded-full');
        expect(dots.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Compact Mode', () => {
    it('hides benefits in compact mode', () => {
      render(<SynergyCard synergy={mockSynergy} compact />);
      // Benefits should not be displayed
      expect(screen.queryByText('Enhanced antioxidant protection')).not.toBeInTheDocument();
    });

    it('hides usage tip in compact mode', () => {
      render(<SynergyCard synergy={mockSynergy} compact />);
      expect(screen.queryByText(/Apply vitamin C first/i)).not.toBeInTheDocument();
    });

    it('still displays mechanism in compact mode', () => {
      render(<SynergyCard synergy={mockSynergy} compact />);
      expect(screen.getByText(/Vitamin E regenerates/i)).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onClick when card is clicked', () => {
      const handleClick = vi.fn();
      render(<SynergyCard synergy={mockSynergy} onClick={handleClick} />);

      const card = screen.getByText('Vitamin C Serum').closest('div[class*="rounded-xl"]');
      fireEvent.click(card!);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('shows learn more button when onLearnMore is provided', () => {
      const handleLearnMore = vi.fn();
      render(<SynergyCard synergy={mockSynergy} onLearnMore={handleLearnMore} />);
      expect(screen.getByText('Learn more')).toBeInTheDocument();
    });

    it('calls onLearnMore when learn more button is clicked', () => {
      const handleLearnMore = vi.fn();
      render(<SynergyCard synergy={mockSynergy} onLearnMore={handleLearnMore} />);

      fireEvent.click(screen.getByText('Learn more'));
      expect(handleLearnMore).toHaveBeenCalledTimes(1);
    });

    it('does not show learn more button when onLearnMore is not provided', () => {
      render(<SynergyCard synergy={mockSynergy} />);
      expect(screen.queryByText('Learn more')).not.toBeInTheDocument();
    });

    it('has cursor-pointer class when onClick is provided', () => {
      const handleClick = vi.fn();
      render(<SynergyCard synergy={mockSynergy} onClick={handleClick} />);
      const card = screen.getByText('Vitamin C Serum').closest('div[class*="rounded-xl"]');
      expect(card).toHaveClass('cursor-pointer');
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className', () => {
      render(<SynergyCard synergy={mockSynergy} className="custom-class" />);
      const card = screen.getByText('Vitamin C Serum').closest('div[class*="rounded-xl"]');
      expect(card).toHaveClass('custom-class');
    });
  });
});

describe('SynergyList', () => {
  const mockSynergies: Synergy[] = [
    mockSynergy,
    mockCompactSynergy,
    {
      id: 'synergy-3',
      itemAId: 'p5',
      itemAName: 'Retinol',
      itemBId: 'p6',
      itemBName: 'Niacinamide',
      type: 'PROTECTIVE',
      strength: 'moderate',
      mechanism: 'Niacinamide reduces retinol irritation',
      benefits: ['Reduced irritation'],
    },
  ];

  describe('Rendering', () => {
    it('renders all synergies', () => {
      render(<SynergyList synergies={mockSynergies} />);
      expect(screen.getByText('Vitamin C Serum')).toBeInTheDocument();
      // Niacinamide appears twice - once in each synergy card that includes it
      expect(screen.getAllByText('Niacinamide').length).toBeGreaterThan(0);
      expect(screen.getByText('Retinol')).toBeInTheDocument();
    });

    it('displays empty state when no synergies', () => {
      render(<SynergyList synergies={[]} />);
      expect(screen.getByText('No synergies found')).toBeInTheDocument();
    });

    it('respects limit prop', () => {
      render(<SynergyList synergies={mockSynergies} limit={2} />);
      // Should show only 2 synergies
      expect(screen.getByText('Vitamin C Serum')).toBeInTheDocument();
      expect(screen.getByText(/Niacinamide/)).toBeInTheDocument();
      // Should show count of remaining
      expect(screen.getByText('+1 more synergies')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onSynergyClick with correct synergy', () => {
      const handleClick = vi.fn();
      render(<SynergyList synergies={mockSynergies} onSynergyClick={handleClick} />);

      const firstCard = screen.getByText('Vitamin C Serum').closest('div[class*="rounded-xl"]');
      fireEvent.click(firstCard!);
      expect(handleClick).toHaveBeenCalledWith(mockSynergy);
    });
  });

  describe('Compact Mode', () => {
    it('passes compact prop to child cards', () => {
      render(<SynergyList synergies={mockSynergies} compact />);
      // Benefits should not be displayed in compact mode
      expect(screen.queryByText('Enhanced antioxidant protection')).not.toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className to container', () => {
      const { container } = render(
        <SynergyList synergies={mockSynergies} className="custom-list-class" />
      );
      const list = container.firstChild;
      expect(list).toHaveClass('custom-list-class');
    });
  });
});
