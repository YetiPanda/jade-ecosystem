/**
 * RecommendationsFeed Component Tests
 * Feature 011: Vendor Portal MVP
 * Sprint D.2: Discovery Analytics Frontend (Task D.2.10)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { RecommendationsFeed } from '../RecommendationsFeed';

// Wrapper to provide router context
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('RecommendationsFeed', () => {
  const mockRecommendations = [
    {
      type: 'PROFILE' as const,
      priority: 'HIGH' as const,
      title: 'Complete Your Profile',
      description: 'Your profile is only 60% complete. Add missing information to improve visibility.',
      actionLabel: 'Complete Profile',
      actionRoute: '/app/vendor/profile',
      potentialImpact: '+40% more profile views',
    },
    {
      type: 'VALUES' as const,
      priority: 'MEDIUM' as const,
      title: 'Add More Values',
      description: 'You have selected only 3 values. Add more to match with more spa searches.',
      actionLabel: 'Select Values',
      actionRoute: '/app/vendor/profile#values',
      potentialImpact: '+25% more impressions',
    },
    {
      type: 'PRODUCTS' as const,
      priority: 'LOW' as const,
      title: 'Improve Product Photos',
      description: 'Products with high-quality photos get 3x more clicks.',
      actionLabel: 'Upload Photos',
      actionRoute: '/app/vendor/submit-product',
      potentialImpact: '+15% more clicks',
    },
  ];

  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      expect(screen.getByText('Complete Your Profile')).toBeInTheDocument();
    });

    it('renders all recommendation cards', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      expect(screen.getByText('Complete Your Profile')).toBeInTheDocument();
      expect(screen.getByText('Add More Values')).toBeInTheDocument();
      expect(screen.getByText('Improve Product Photos')).toBeInTheDocument();
    });

    it('displays recommendation descriptions', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      expect(screen.getByText(/Your profile is only 60% complete/)).toBeInTheDocument();
      expect(screen.getByText(/You have selected only 3 values/)).toBeInTheDocument();
      expect(screen.getByText(/Products with high-quality photos/)).toBeInTheDocument();
    });

    it('displays potential impact for each recommendation', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      expect(screen.getByText('+40% more profile views')).toBeInTheDocument();
      expect(screen.getByText('+25% more impressions')).toBeInTheDocument();
      expect(screen.getByText('+15% more clicks')).toBeInTheDocument();
    });
  });

  describe('Priority Grouping', () => {
    it('groups high priority recommendations under "Action Required"', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      expect(screen.getByText('Action Required')).toBeInTheDocument();
    });

    it('groups medium priority recommendations under "Optimization Opportunities"', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      expect(screen.getByText('Optimization Opportunities')).toBeInTheDocument();
    });

    it('groups low priority recommendations under "Nice to Have"', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      expect(screen.getByText('Nice to Have')).toBeInTheDocument();
    });

    it('displays count for each priority group', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      expect(screen.getByText('(1)')).toBeInTheDocument(); // High priority count
    });

    it('does not render group if no recommendations of that priority', () => {
      const highOnlyRecs = [mockRecommendations[0]];
      renderWithRouter(<RecommendationsFeed recommendations={highOnlyRecs} />);

      expect(screen.getByText('Action Required')).toBeInTheDocument();
      expect(screen.queryByText('Optimization Opportunities')).not.toBeInTheDocument();
      expect(screen.queryByText('Nice to Have')).not.toBeInTheDocument();
    });
  });

  describe('Priority Badges', () => {
    it('displays "High Priority" badge for high priority recommendations', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      expect(screen.getByText('High Priority')).toBeInTheDocument();
    });

    it('displays "Medium Priority" badge for medium priority recommendations', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      expect(screen.getByText('Medium Priority')).toBeInTheDocument();
    });

    it('displays "Low Priority" badge for low priority recommendations', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      expect(screen.getByText('Low Priority')).toBeInTheDocument();
    });

    it('applies red styling to high priority badges', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      const highBadge = screen.getByText('High Priority');
      expect(highBadge.closest('span')).toHaveClass('bg-red-100', 'text-red-700');
    });

    it('applies amber styling to medium priority badges', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      const mediumBadge = screen.getByText('Medium Priority');
      expect(mediumBadge.closest('span')).toHaveClass('bg-amber-100', 'text-amber-700');
    });

    it('applies blue styling to low priority badges', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      const lowBadge = screen.getByText('Low Priority');
      expect(lowBadge.closest('span')).toHaveClass('bg-blue-100', 'text-blue-700');
    });
  });

  describe('Recommendation Types', () => {
    it('displays PROFILE type with correct icon', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      const profileRec = screen.getByText('Complete Your Profile');
      expect(profileRec).toBeInTheDocument();
    });

    it('displays VALUES type with correct icon', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      const valuesRec = screen.getByText('Add More Values');
      expect(valuesRec).toBeInTheDocument();
    });

    it('displays PRODUCTS type with correct icon', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      const productsRec = screen.getByText('Improve Product Photos');
      expect(productsRec).toBeInTheDocument();
    });

    it('handles CONTENT type recommendations', () => {
      const contentRec = [
        {
          type: 'CONTENT' as const,
          priority: 'MEDIUM' as const,
          title: 'Improve Brand Story',
          description: 'Add a compelling brand story to connect with spas.',
          actionLabel: 'Edit Story',
          actionRoute: '/app/vendor/profile#story',
          potentialImpact: '+30% engagement',
        },
      ];

      renderWithRouter(<RecommendationsFeed recommendations={contentRec} />);

      expect(screen.getByText('Improve Brand Story')).toBeInTheDocument();
    });

    it('handles CERTIFICATIONS type recommendations', () => {
      const certRec = [
        {
          type: 'CERTIFICATIONS' as const,
          priority: 'HIGH' as const,
          title: 'Add Certifications',
          description: 'Certifications build trust with potential clients.',
          actionLabel: 'Add Certification',
          actionRoute: '/app/vendor/profile#certifications',
          potentialImpact: '+50% credibility',
        },
      ];

      renderWithRouter(<RecommendationsFeed recommendations={certRec} />);

      expect(screen.getByText('Add Certifications')).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('renders action button for each recommendation', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      expect(screen.getByText('Complete Profile')).toBeInTheDocument();
      expect(screen.getByText('Select Values')).toBeInTheDocument();
      expect(screen.getByText('Upload Photos')).toBeInTheDocument();
    });

    it('creates link with correct route', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      const completeProfileLink = screen.getByText('Complete Profile').closest('a');
      expect(completeProfileLink).toHaveAttribute('href', '/app/vendor/profile');
    });

    it('applies red button styling to high priority recommendations', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      const highPriorityButton = screen.getByText('Complete Profile');
      expect(highPriorityButton).toHaveClass('bg-red-600', 'text-white', 'hover:bg-red-700');
    });

    it('applies amber button styling to medium priority recommendations', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      const mediumPriorityButton = screen.getByText('Select Values');
      expect(mediumPriorityButton).toHaveClass('bg-amber-600', 'text-white', 'hover:bg-amber-700');
    });

    it('applies blue button styling to low priority recommendations', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      const lowPriorityButton = screen.getByText('Upload Photos');
      expect(lowPriorityButton).toHaveClass('bg-blue-600', 'text-white', 'hover:bg-blue-700');
    });

    it('includes arrow icon in action buttons', () => {
      const { container } = renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      const buttons = container.querySelectorAll('a.flex.items-center');
      expect(buttons.length).toBe(mockRecommendations.length);
    });
  });

  describe('Empty State', () => {
    it('renders empty state when no recommendations', () => {
      renderWithRouter(<RecommendationsFeed recommendations={[]} />);

      expect(screen.getByText('All Set!')).toBeInTheDocument();
      expect(screen.getByText(/Your profile is optimized/)).toBeInTheDocument();
    });

    it('does not render priority groups when empty', () => {
      renderWithRouter(<RecommendationsFeed recommendations={[]} />);

      expect(screen.queryByText('Action Required')).not.toBeInTheDocument();
      expect(screen.queryByText('Optimization Opportunities')).not.toBeInTheDocument();
      expect(screen.queryByText('Nice to Have')).not.toBeInTheDocument();
    });

    it('shows checkmark icon in empty state', () => {
      const { container } = renderWithRouter(<RecommendationsFeed recommendations={[]} />);

      const checkmark = container.querySelector('svg.h-12.w-12.text-green-600');
      expect(checkmark).toBeInTheDocument();
    });
  });

  describe('Footer Tip', () => {
    it('shows pro tip when recommendations exist', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      expect(screen.getByText('Pro Tip:')).toBeInTheDocument();
      expect(screen.getByText(/Focus on high-priority recommendations/)).toBeInTheDocument();
    });

    it('does not show pro tip when no recommendations', () => {
      renderWithRouter(<RecommendationsFeed recommendations={[]} />);

      expect(screen.queryByText('Pro Tip:')).not.toBeInTheDocument();
    });

    it('renders info icon in pro tip', () => {
      const { container } = renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      const tipSection = screen.getByText('Pro Tip:').closest('div');
      const icon = tipSection?.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies proper spacing between priority groups', () => {
      const { container } = renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('space-y-6');
    });

    it('applies border styling to recommendation cards', () => {
      const { container } = renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      const cards = container.querySelectorAll('.border-2.rounded-lg');
      expect(cards.length).toBe(mockRecommendations.length);
    });

    it('applies hover effect to recommendation cards', () => {
      const { container } = renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      const cards = container.querySelectorAll('.hover\\:shadow-lg');
      expect(cards.length).toBe(mockRecommendations.length);
    });

    it('applies color-coded border to cards based on priority', () => {
      const { container } = renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      const highPriorityCard = screen.getByText('Complete Your Profile').closest('div.border-red-200');
      const mediumPriorityCard = screen.getByText('Add More Values').closest('div.border-amber-200');
      const lowPriorityCard = screen.getByText('Improve Product Photos').closest('div.border-blue-200');

      expect(highPriorityCard).toBeInTheDocument();
      expect(mediumPriorityCard).toBeInTheDocument();
      expect(lowPriorityCard).toBeInTheDocument();
    });
  });

  describe('Multiple Recommendations', () => {
    const manyRecommendations = [
      ...mockRecommendations,
      {
        type: 'CONTENT' as const,
        priority: 'HIGH' as const,
        title: 'Second High Priority',
        description: 'Another urgent action.',
        actionLabel: 'Take Action',
        actionRoute: '/app/vendor/profile',
        potentialImpact: '+20% impact',
      },
      {
        type: 'CERTIFICATIONS' as const,
        priority: 'MEDIUM' as const,
        title: 'Second Medium Priority',
        description: 'Another optimization.',
        actionLabel: 'Optimize',
        actionRoute: '/app/vendor/profile',
        potentialImpact: '+10% impact',
      },
    ];

    it('groups multiple high priority recommendations together', () => {
      renderWithRouter(<RecommendationsFeed recommendations={manyRecommendations} />);

      expect(screen.getByText('(2)')).toBeInTheDocument(); // High priority count
    });

    it('renders all recommendations in correct groups', () => {
      renderWithRouter(<RecommendationsFeed recommendations={manyRecommendations} />);

      expect(screen.getByText('Complete Your Profile')).toBeInTheDocument();
      expect(screen.getByText('Second High Priority')).toBeInTheDocument();
      expect(screen.getByText('Add More Values')).toBeInTheDocument();
      expect(screen.getByText('Second Medium Priority')).toBeInTheDocument();
      expect(screen.getByText('Improve Product Photos')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      const groupHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(groupHeadings.length).toBeGreaterThan(0);
    });

    it('renders accessible links', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      const links = screen.getAllByRole('link');
      expect(links.length).toBe(mockRecommendations.length);
    });

    it('has proper color contrast for action buttons', () => {
      renderWithRouter(<RecommendationsFeed recommendations={mockRecommendations} />);

      const highButton = screen.getByText('Complete Profile');
      expect(highButton).toHaveClass('text-white');
    });
  });
});
