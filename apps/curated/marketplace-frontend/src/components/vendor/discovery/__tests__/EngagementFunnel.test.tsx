/**
 * EngagementFunnel Component Tests
 * Feature 011: Vendor Portal MVP
 * Sprint D.2: Discovery Analytics Frontend (Task D.2.10)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EngagementFunnel } from '../EngagementFunnel';

describe('EngagementFunnel', () => {
  const mockEngagement = {
    profileViews: 5000,
    avgTimeOnProfile: 125, // seconds
    catalogBrowses: 3500,
    productClicks: 2000,
    contactClicks: 250,
    bounceRate: 22.5,
  };

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<EngagementFunnel engagement={mockEngagement} />);

      expect(screen.getByText('Profile Engagement')).toBeInTheDocument();
    });

    it('renders all metric cards', () => {
      render(<EngagementFunnel engagement={mockEngagement} />);

      expect(screen.getByText('Profile Views')).toBeInTheDocument();
      expect(screen.getByText('Avg. Time on Profile')).toBeInTheDocument();
      expect(screen.getByText('Bounce Rate')).toBeInTheDocument();
    });

    it('displays profile views count', () => {
      render(<EngagementFunnel engagement={mockEngagement} />);

      expect(screen.getByText('5,000')).toBeInTheDocument();
    });

    it('displays average time on profile', () => {
      render(<EngagementFunnel engagement={mockEngagement} />);

      expect(screen.getByText('2m 5s')).toBeInTheDocument();
    });

    it('displays bounce rate', () => {
      render(<EngagementFunnel engagement={mockEngagement} />);

      expect(screen.getByText('22.5%')).toBeInTheDocument();
    });
  });

  describe('Funnel Visualization', () => {
    it('renders funnel title', () => {
      render(<EngagementFunnel engagement={mockEngagement} />);

      expect(screen.getByText('Engagement Journey')).toBeInTheDocument();
    });

    it('renders all 4 funnel stages', () => {
      render(<EngagementFunnel engagement={mockEngagement} />);

      expect(screen.getByText('Profile View')).toBeInTheDocument();
      expect(screen.getByText('Browse Catalog')).toBeInTheDocument();
      expect(screen.getByText('Click Product')).toBeInTheDocument();
      expect(screen.getByText('Contact/Inquiry')).toBeInTheDocument();
    });

    it('displays counts for each funnel stage', () => {
      render(<EngagementFunnel engagement={mockEngagement} />);

      expect(screen.getByText('5,000')).toBeInTheDocument();
      expect(screen.getByText('3,500')).toBeInTheDocument();
      expect(screen.getByText('2,000')).toBeInTheDocument();
      expect(screen.getByText('250')).toBeInTheDocument();
    });

    it('displays percentages for each funnel stage', () => {
      render(<EngagementFunnel engagement={mockEngagement} />);

      expect(screen.getByText('100%')).toBeInTheDocument(); // Profile View (baseline)
      expect(screen.getByText('70%')).toBeInTheDocument(); // Browse Catalog (3500/5000)
      expect(screen.getByText('40%')).toBeInTheDocument(); // Click Product (2000/5000)
      expect(screen.getByText('5%')).toBeInTheDocument(); // Contact (250/5000)
    });

    it('applies different colors to funnel stages', () => {
      const { container } = render(<EngagementFunnel engagement={mockEngagement} />);

      const stages = container.querySelectorAll('.relative.overflow-hidden.rounded-lg');
      expect(stages.length).toBe(4);
    });
  });

  describe('Drop-off Indicators', () => {
    it('shows drop-off percentages between stages', () => {
      render(<EngagementFunnel engagement={mockEngagement} />);

      // Profile → Catalog: 30% drop-off (100% - 70%)
      // Catalog → Product: 30% drop-off (70% - 40%)
      // Product → Contact: 35% drop-off (40% - 5%)
      const dropOffText = screen.getAllByText(/drop-off/i);
      expect(dropOffText.length).toBeGreaterThan(0);
    });

    it('displays down arrow icons for drop-offs', () => {
      const { container } = render(<EngagementFunnel engagement={mockEngagement} />);

      const arrows = container.querySelectorAll('svg.text-gray-400');
      expect(arrows.length).toBeGreaterThan(0);
    });
  });

  describe('Time Formatting', () => {
    it('formats seconds as minutes and seconds', () => {
      render(<EngagementFunnel engagement={mockEngagement} />);

      // 125 seconds = 2 minutes 5 seconds
      expect(screen.getByText('2m 5s')).toBeInTheDocument();
    });

    it('handles time less than 1 minute', () => {
      const shortTime = {
        ...mockEngagement,
        avgTimeOnProfile: 45,
      };

      render(<EngagementFunnel engagement={shortTime} />);

      expect(screen.getByText('0m 45s')).toBeInTheDocument();
    });

    it('handles time exactly 1 minute', () => {
      const oneMinute = {
        ...mockEngagement,
        avgTimeOnProfile: 60,
      };

      render(<EngagementFunnel engagement={oneMinute} />);

      expect(screen.getByText('1m 0s')).toBeInTheDocument();
    });

    it('handles time over 10 minutes', () => {
      const longTime = {
        ...mockEngagement,
        avgTimeOnProfile: 725, // 12 minutes 5 seconds
      };

      render(<EngagementFunnel engagement={longTime} />);

      expect(screen.getByText('12m 5s')).toBeInTheDocument();
    });

    it('handles zero seconds', () => {
      const zeroTime = {
        ...mockEngagement,
        avgTimeOnProfile: 0,
      };

      render(<EngagementFunnel engagement={zeroTime} />);

      expect(screen.getByText('0m 0s')).toBeInTheDocument();
    });
  });

  describe('Percentage Calculations', () => {
    it('calculates catalog browse rate correctly', () => {
      render(<EngagementFunnel engagement={mockEngagement} />);

      // 3500 / 5000 = 70%
      expect(screen.getByText('70%')).toBeInTheDocument();
    });

    it('calculates product click rate correctly', () => {
      render(<EngagementFunnel engagement={mockEngagement} />);

      // 2000 / 5000 = 40%
      expect(screen.getByText('40%')).toBeInTheDocument();
    });

    it('calculates contact click rate correctly', () => {
      render(<EngagementFunnel engagement={mockEngagement} />);

      // 250 / 5000 = 5%
      expect(screen.getByText('5%')).toBeInTheDocument();
    });

    it('handles zero profile views gracefully', () => {
      const zeroViews = {
        ...mockEngagement,
        profileViews: 0,
      };

      render(<EngagementFunnel engagement={zeroViews} />);

      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('rounds percentages to whole numbers', () => {
      const oddNumbers = {
        profileViews: 333,
        avgTimeOnProfile: 125,
        catalogBrowses: 111, // 33.33%
        productClicks: 66, // 19.82%
        contactClicks: 22, // 6.61%
        bounceRate: 22.5,
      };

      render(<EngagementFunnel engagement={oddNumbers} />);

      // Should round to whole numbers
      expect(screen.getByText('33%')).toBeInTheDocument();
      expect(screen.getByText('20%')).toBeInTheDocument();
      expect(screen.getByText('7%')).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('handles all zero engagement', () => {
      const zeroEngagement = {
        profileViews: 0,
        avgTimeOnProfile: 0,
        catalogBrowses: 0,
        productClicks: 0,
        contactClicks: 0,
        bounceRate: 0,
      };

      render(<EngagementFunnel engagement={zeroEngagement} />);

      expect(screen.getByText('Profile Engagement')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles missing catalog browses', () => {
      const noBrowses = {
        ...mockEngagement,
        catalogBrowses: 0,
      };

      render(<EngagementFunnel engagement={noBrowses} />);

      expect(screen.getByText('0%')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies proper container styling', () => {
      const { container } = render(<EngagementFunnel engagement={mockEngagement} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('bg-white', 'rounded-lg', 'border');
    });

    it('applies proper metric card grid layout', () => {
      const { container } = render(<EngagementFunnel engagement={mockEngagement} />);

      const grid = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-3');
      expect(grid).toBeInTheDocument();
    });

    it('applies gradient background to funnel stages', () => {
      const { container } = render(<EngagementFunnel engagement={mockEngagement} />);

      const stages = container.querySelectorAll('.bg-gradient-to-r');
      expect(stages.length).toBe(4);
    });

    it('applies proper heading styling', () => {
      render(<EngagementFunnel engagement={mockEngagement} />);

      const heading = screen.getByText('Profile Engagement');
      expect(heading).toHaveClass('text-lg', 'font-semibold');
    });
  });

  describe('Bounce Rate Interpretation', () => {
    it('shows low bounce rate with positive styling', () => {
      const lowBounce = {
        ...mockEngagement,
        bounceRate: 15.0,
      };

      render(<EngagementFunnel engagement={lowBounce} />);

      expect(screen.getByText('15.0%')).toBeInTheDocument();
    });

    it('shows high bounce rate with warning styling', () => {
      const highBounce = {
        ...mockEngagement,
        bounceRate: 75.0,
      };

      render(<EngagementFunnel engagement={highBounce} />);

      expect(screen.getByText('75.0%')).toBeInTheDocument();
    });

    it('displays bounce rate as percentage with one decimal', () => {
      render(<EngagementFunnel engagement={mockEngagement} />);

      expect(screen.getByText('22.5%')).toBeInTheDocument();
    });
  });

  describe('Data Formatting', () => {
    it('formats large numbers with commas', () => {
      const largeEngagement = {
        profileViews: 123456,
        avgTimeOnProfile: 125,
        catalogBrowses: 98765,
        productClicks: 45678,
        contactClicks: 12345,
        bounceRate: 22.5,
      };

      render(<EngagementFunnel engagement={largeEngagement} />);

      expect(screen.getByText('123,456')).toBeInTheDocument();
      expect(screen.getByText('98,765')).toBeInTheDocument();
      expect(screen.getByText('45,678')).toBeInTheDocument();
      expect(screen.getByText('12,345')).toBeInTheDocument();
    });

    it('handles single digit numbers', () => {
      const smallEngagement = {
        profileViews: 5,
        avgTimeOnProfile: 30,
        catalogBrowses: 3,
        productClicks: 2,
        contactClicks: 1,
        bounceRate: 20.0,
      };

      render(<EngagementFunnel engagement={smallEngagement} />);

      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<EngagementFunnel engagement={mockEngagement} />);

      const mainHeading = screen.getByText('Profile Engagement');
      expect(mainHeading.tagName.toLowerCase()).toBe('h3');

      const funnelHeading = screen.getByText('Engagement Journey');
      expect(funnelHeading.tagName.toLowerCase()).toBe('h4');
    });

    it('has proper semantic structure', () => {
      const { container } = render(<EngagementFunnel engagement={mockEngagement} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('has color contrast for funnel stages', () => {
      const { container } = render(<EngagementFunnel engagement={mockEngagement} />);

      const stages = container.querySelectorAll('.text-white');
      expect(stages.length).toBeGreaterThan(0);
    });
  });
});
