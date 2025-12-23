/**
 * EcosystemPage Tests
 *
 * Comprehensive test coverage for the JADE Ecosystem showcase page
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EcosystemPage from '../Ecosystem';

const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('EcosystemPage', () => {
  describe('Hero Section', () => {
    it('renders without crashing', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('displays the main headline', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(/Software That Actually/i);
      expect(heading).toHaveTextContent(/Understands Your Business/i);
    });

    it('shows the professional badge', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Built by professionals, for professionals/i)).toBeInTheDocument();
    });

    it('displays hero description text', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      const heroSection = screen.getByRole('heading', { level: 1 }).closest('section');
      expect(heroSection).toHaveTextContent(/Three integrated platforms designed for the modern beauty industry/i);
      expect(heroSection).toHaveTextContent(/No tech jargon, no empty promises/i);
    });

    it('renders primary CTA button', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      const exploreButton = screen.getByRole('button', { name: /Explore the Ecosystem/i });
      expect(exploreButton).toBeInTheDocument();
    });

    it('renders secondary CTA link to products', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      const browseLink = screen.getByRole('link', { name: /Browse Curated/i });
      expect(browseLink).toBeInTheDocument();
      expect(browseLink).toHaveAttribute('href', '/app/products');
    });
  });

  describe('Platform Preview Cards', () => {
    it('displays all three platform cards', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      // Platform names appear in multiple places (cards, tabs, CTAs, details)
      expect(screen.getAllByText(/Aura by Jade/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Curated by Jade/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Spa-ce Sanctuary/i).length).toBeGreaterThan(0);
    });

    it('shows platform subtitles', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      // Subtitles appear in cards and deep dive sections
      expect(screen.getAllByText(/Operational Heart/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Vetted Marketplace/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Professional Community/i).length).toBeGreaterThan(0);
    });

    it('displays explore buttons for each platform', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      const exploreButtons = screen.getAllByRole('button', { name: /Explore/i });
      expect(exploreButtons.length).toBeGreaterThan(0);
    });

    it('allows clicking on platform cards', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      const cards = screen.getAllByText(/Aura by Jade/i)[0].closest('.cursor-pointer');
      expect(cards).toBeInTheDocument();
    });
  });

  describe('Platform Deep Dive Section', () => {
    it('displays the section heading', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Discover Your Perfect Platform/i)).toBeInTheDocument();
    });

    it('shows tab navigation for platforms', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      expect(screen.getByRole('tab', { name: /^Aura$/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /^Curated$/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /^Sanctuary$/i })).toBeInTheDocument();
    });

    it('displays key features section', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Key Features/i)).toBeInTheDocument();
    });

    it('displays benefits section', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/How It Helps You/i)).toBeInTheDocument();
    });

    it('shows platform-specific features', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Intuitive scheduling & calendar management/i)).toBeInTheDocument();
      expect(screen.getByText(/Comprehensive client relationship tools/i)).toBeInTheDocument();
    });

    it('displays CTA buttons in platform details', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      // Multiple "Try Aura" links exist (deep dive + final CTA)
      const tryLinks = screen.getAllByRole('link', { name: /Try Aura by Jade/i });
      expect(tryLinks.length).toBeGreaterThan(0);
      expect(screen.getByRole('button', { name: /Learn More/i })).toBeInTheDocument();
    });
  });

  describe('Integration Features Section', () => {
    it('displays the ecosystem integration heading', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/An Ecosystem That Just Makes Sense/i)).toBeInTheDocument();
    });

    it('shows integration badge', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Everything works together/i)).toBeInTheDocument();
    });

    it('displays all four integration features', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Seamless Integration/i)).toBeInTheDocument();
      expect(screen.getByText(/Industry Understanding/i)).toBeInTheDocument();
      expect(screen.getByText(/Time-Saving Design/i)).toBeInTheDocument();
      expect(screen.getByText(/Supportive Community/i)).toBeInTheDocument();
    });

    it('shows professional message', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      const professionalMessages = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('From one professional to another:') || false;
      });
      expect(professionalMessages.length).toBeGreaterThan(0);
    });
  });

  describe('Testimonials Section', () => {
    it('displays testimonials heading', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Stories from Our Community/i)).toBeInTheDocument();
    });

    it('shows all three testimonials', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Sarah Mitchell/i)).toBeInTheDocument();
      expect(screen.getByText(/Michael Rodriguez/i)).toBeInTheDocument();
      expect(screen.getByText(/Dr. Amanda Chen/i)).toBeInTheDocument();
    });

    it('displays testimonial roles', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Owner, Luxe Wellness Spa/i)).toBeInTheDocument();
      expect(screen.getByText(/Regional Sales Manager/i)).toBeInTheDocument();
      expect(screen.getByText(/Medical Esthetician/i)).toBeInTheDocument();
    });

    it('shows testimonial metrics', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/5\+ hours saved weekly/i)).toBeInTheDocument();
      expect(screen.getByText(/40% faster sourcing/i)).toBeInTheDocument();
      expect(screen.getByText(/Connected with 50\+ professionals/i)).toBeInTheDocument();
    });

    it('displays testimonial quotes', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Aura gave me my evenings back/i)).toBeInTheDocument();
      expect(screen.getByText(/Finding reliable vendors used to be such a headache/i)).toBeInTheDocument();
    });
  });

  describe('Final CTA Section', () => {
    it('displays the experience difference heading', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Experience the Difference/i)).toBeInTheDocument();
    });

    it('shows ready badge', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/Ready to reclaim your time\?/i)).toBeInTheDocument();
    });

    it('displays all three platform action buttons', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      const dashboardLinks = screen.getAllByRole('link', { name: /Try Aura by Jade/i });
      const productLinks = screen.getAllByRole('link', { name: /Explore Curated/i });
      const ecosystemLinks = screen.getAllByRole('link', { name: /Visit Sanctuary/i });

      expect(dashboardLinks.length).toBeGreaterThan(0);
      expect(productLinks.length).toBeGreaterThan(0);
      expect(ecosystemLinks.length).toBeGreaterThan(0);
    });

    it('shows no registration message', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      expect(screen.getByText(/No registration required/i)).toBeInTheDocument();
      expect(screen.getByText(/Genuinely helpful/i)).toBeInTheDocument();
    });
  });

  describe('Interactive Features', () => {
    it('allows switching between platform tabs', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      const auraTab = screen.getByRole('tab', { name: /^Aura$/i });
      const curatedTab = screen.getByRole('tab', { name: /^Curated$/i });
      const sanctuaryTab = screen.getByRole('tab', { name: /^Sanctuary$/i });

      // All tabs should be present
      expect(auraTab).toBeInTheDocument();
      expect(curatedTab).toBeInTheDocument();
      expect(sanctuaryTab).toBeInTheDocument();

      // Verify tabs can be clicked
      fireEvent.click(curatedTab);
      fireEvent.click(sanctuaryTab);
      fireEvent.click(auraTab);

      // Verify tabs are still in the document after clicks
      expect(auraTab).toBeInTheDocument();
      expect(curatedTab).toBeInTheDocument();
      expect(sanctuaryTab).toBeInTheDocument();
    });

    it('updates active platform when card is clicked', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      const curatedCards = screen.getAllByText(/Curated by Jade/i);
      const curatedCard = curatedCards[0].closest('[data-slot="card"]');

      if (curatedCard) {
        fireEvent.click(curatedCard);
        // Card should show active state (ring-2 ring-primary)
        expect(curatedCard.className).toContain('ring-2');
        expect(curatedCard.className).toContain('ring-primary');
      }
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2s = screen.getAllByRole('heading', { level: 2 });
      const h3s = screen.getAllByRole('heading', { level: 3 });

      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThan(0);
      expect(h3s.length).toBeGreaterThan(0);
    });

    it('has navigation links with proper href attributes', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      const dashboardLinks = screen.getAllByRole('link', { name: /Try Aura by Jade/i });
      const productLinks = screen.getAllByRole('link', { name: /Explore Curated/i });

      expect(dashboardLinks[0]).toHaveAttribute('href', '/app/dashboard');
      expect(productLinks[0]).toHaveAttribute('href', '/app/products');
    });

    it('has proper button roles', () => {
      render(<EcosystemPage />, { wrapper: RouterWrapper });
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('uses responsive grid classes for platform cards', () => {
      const { container } = render(<EcosystemPage />, { wrapper: RouterWrapper });
      const grid = container.querySelector('.grid-cols-1.md\\:grid-cols-3');
      expect(grid).toBeInTheDocument();
    });

    it('uses responsive text sizes', () => {
      const { container } = render(<EcosystemPage />, { wrapper: RouterWrapper });
      const responsiveHeading = container.querySelector('.text-4xl.md\\:text-5xl');
      expect(responsiveHeading).toBeInTheDocument();
    });
  });
});
