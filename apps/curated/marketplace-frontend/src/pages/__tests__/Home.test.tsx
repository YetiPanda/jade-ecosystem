/**
 * HomePage Integration Tests
 *
 * Feature: 008-homepage-integration
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../Home';

// Mock the GraphQL queries
const mockBestsellersData = {
  searchProducts: {
    items: [
      {
        product: {
          id: '1',
          name: 'Hydrating Serum',
          slug: 'hydrating-serum',
          description: 'Deep hydration serum',
          featuredAsset: {
            preview: '/products/serum1.jpg',
          },
        },
        glance: {
          heroBenefit: 'Deep hydration',
          rating: 4.5,
          reviewCount: 120,
          skinTypes: ['dry', 'normal'],
        },
        pricingTiers: [
          {
            minQuantity: 1,
            unitPrice: 4999,
            discountPercentage: 0,
          },
        ],
        inventoryLevel: 50,
      },
    ],
    totalItems: 1,
    hasNextPage: false,
  },
};

const mockNewArrivalsData = {
  searchProducts: {
    items: [
      {
        product: {
          id: '2',
          name: 'Vitamin C Cream',
          slug: 'vitamin-c-cream',
          description: 'Brightening cream',
          featuredAsset: {
            preview: '/products/cream1.jpg',
          },
        },
        glance: {
          heroBenefit: 'Brightens skin',
          rating: 4.8,
          reviewCount: 89,
          skinTypes: ['all'],
        },
        pricingTiers: [
          {
            minQuantity: 1,
            unitPrice: 3999,
            discountPercentage: 0,
          },
        ],
        inventoryLevel: 30,
      },
    ],
    totalItems: 1,
    hasNextPage: false,
  },
};

const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('HomePage Integration', () => {
  it('renders without crashing', async () => {
    const mocks: any[] = [];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HomePage />
      </MockedProvider>,
      { wrapper: RouterWrapper }
    );

    // Check that hero section renders
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('displays all main sections', async () => {
    const mocks: any[] = [];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HomePage />
      </MockedProvider>,
      { wrapper: RouterWrapper }
    );

    // Hero
    expect(screen.getByRole('banner')).toBeInTheDocument();

    // Section titles
    expect(screen.getByText('Featured Skincare Brands')).toBeInTheDocument();
    expect(screen.getByText('Bestselling spa products')).toBeInTheDocument();
    expect(screen.getByText('New arrivals')).toBeInTheDocument();
  });

  it('displays editorial content', async () => {
    const mocks: any[] = [];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HomePage />
      </MockedProvider>,
      { wrapper: RouterWrapper }
    );

    // Editorial block title from mock data
    expect(screen.getByText('Discover Our Curated Collection')).toBeInTheDocument();
  });

  it('renders brand strip with actual brand logos', async () => {
    const mocks: any[] = [];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HomePage />
      </MockedProvider>,
      { wrapper: RouterWrapper }
    );

    // Check for actual brand logos from /public/assets/brands
    expect(screen.getByAltText(/Circadia logo/i)).toBeInTheDocument();
  });

  it('has correct navigation links', async () => {
    const mocks: any[] = [];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HomePage />
      </MockedProvider>,
      { wrapper: RouterWrapper }
    );

    // "View all" links
    const viewAllLinks = screen.getAllByText(/View all/i);
    expect(viewAllLinks.length).toBeGreaterThan(0);
  });

  it('displays mock products when GraphQL is unavailable', async () => {
    const mocks: any[] = [];

    const { container } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HomePage />
      </MockedProvider>,
      { wrapper: RouterWrapper }
    );

    // Wait for component to render
    await waitFor(() => {
      // Check that product grids are rendered (not showing error or loading states)
      const productGrids = container.querySelectorAll('.grid');
      expect(productGrids.length).toBeGreaterThan(0);
    });
  });

  it('has proper layout structure', () => {
    const mocks: any[] = [];

    const { container } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HomePage />
      </MockedProvider>,
      { wrapper: RouterWrapper }
    );

    // Main container has correct classes
    const mainContainer = container.querySelector('.max-w-7xl');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass('px-4', 'py-8', 'space-y-16');
  });

  it('sections have proper spacing', () => {
    const mocks: any[] = [];

    const { container } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <HomePage />
      </MockedProvider>,
      { wrapper: RouterWrapper }
    );

    // Check for space-y-16 on main container
    const mainContainer = container.querySelector('.space-y-16');
    expect(mainContainer).toBeInTheDocument();
  });
});
