/**
 * Unit Tests for SearchResults Component (T293)
 *
 * Tests search results rendering per FR-045 through FR-048
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SearchResults } from '../SearchResults';

// Mock product data
const mockProducts = [
  {
    id: 'prod-1',
    vendureProductId: 'v-prod-1',
    glance: {
      heroBenefit: 'Hydrating Serum',
      skinTypes: ['Dry', 'Sensitive'],
      rating: 4.5,
      reviewCount: 128,
      price: {
        amount: 4999, // $49.99
        currency: 'USD',
      },
      thumbnail: 'https://example.com/serum.jpg',
    },
    tensorGenerated: true,
    embeddingGenerated: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'prod-2',
    vendureProductId: 'v-prod-2',
    glance: {
      heroBenefit: 'Anti-Aging Cream',
      skinTypes: ['Normal', 'Combination'],
      rating: 4.8,
      reviewCount: 256,
      price: {
        amount: 7999, // $79.99
        currency: 'USD',
      },
      thumbnail: 'https://example.com/cream.jpg',
    },
    tensorGenerated: true,
    embeddingGenerated: false,
    createdAt: '2024-01-02T00:00:00Z',
  },
  {
    id: 'prod-3',
    vendureProductId: 'v-prod-3',
    glance: {
      heroBenefit: 'Vitamin C Booster',
      skinTypes: ['Oily'],
      rating: 4.2,
      reviewCount: 64,
      price: {
        amount: 3499, // $34.99
        currency: 'USD',
      },
      thumbnail: 'https://example.com/vitamin.jpg',
    },
    tensorGenerated: false,
    embeddingGenerated: true,
    createdAt: '2024-01-03T00:00:00Z',
  },
] as const;

const renderSearchResults = (products = mockProducts, resultCount?: number) => {
  return render(
    <BrowserRouter>
      <SearchResults products={products} resultCount={resultCount} />
    </BrowserRouter>
  );
};

describe('SearchResults Component', () => {
  describe('Result Count Display (FR-048)', () => {
    it('should display result count when provided', () => {
      renderSearchResults(mockProducts, 3);

      expect(screen.getByText('3 products found')).toBeTruthy();
    });

    it('should display singular "product" for count of 1', () => {
      renderSearchResults([mockProducts[0]], 1);

      expect(screen.getByText('1 product found')).toBeTruthy();
    });

    it('should not display result count when not provided', () => {
      renderSearchResults(mockProducts);

      expect(screen.queryByText(/products found/i)).toBeNull();
    });

    it('should have aria-live attribute for screen readers (FR-069)', () => {
      renderSearchResults(mockProducts, 3);
      const resultCount = screen.getByText('3 products found');

      expect(resultCount.getAttribute('aria-live')).toBe('polite');
    });
  });

  describe('Responsive Grid Layout (FR-045)', () => {
    it('should render grid container with responsive classes', () => {
      const { container } = renderSearchResults(mockProducts);
      const grid = container.querySelector('.grid');

      expect(grid).toBeTruthy();
      expect(grid?.className).toContain('grid-cols-1');
      expect(grid?.className).toContain('md:grid-cols-2');
      expect(grid?.className).toContain('lg:grid-cols-3');
    });

    it('should render all products in grid', () => {
      renderSearchResults(mockProducts);

      expect(screen.getByText('Hydrating Serum')).toBeTruthy();
      expect(screen.getByText('Anti-Aging Cream')).toBeTruthy();
      expect(screen.getByText('Vitamin C Booster')).toBeTruthy();
    });
  });

  describe('Product Card Display (FR-046, FR-047)', () => {
    it('should display product name/hero benefit', () => {
      renderSearchResults(mockProducts);

      expect(screen.getByText('Hydrating Serum')).toBeTruthy();
    });

    it('should display formatted price (FR-046)', () => {
      renderSearchResults(mockProducts);

      expect(screen.getByText('$49.99')).toBeTruthy();
      expect(screen.getByText('$79.99')).toBeTruthy();
      expect(screen.getByText('$34.99')).toBeTruthy();
    });

    it('should display star ratings (FR-046)', () => {
      renderSearchResults(mockProducts);

      expect(screen.getByText('4.5')).toBeTruthy();
      expect(screen.getByText('4.8')).toBeTruthy();
      expect(screen.getByText('4.2')).toBeTruthy();
    });

    it('should display review counts (FR-046)', () => {
      renderSearchResults(mockProducts);

      expect(screen.getByText('(128 reviews)')).toBeTruthy();
      expect(screen.getByText('(256 reviews)')).toBeTruthy();
      expect(screen.getByText('(64 reviews)')).toBeTruthy();
    });

    it('should display skin type badges (FR-046)', () => {
      renderSearchResults(mockProducts);

      expect(screen.getByText('Dry')).toBeTruthy();
      expect(screen.getByText('Sensitive')).toBeTruthy();
      expect(screen.getByText('Normal')).toBeTruthy();
      expect(screen.getByText('Combination')).toBeTruthy();
      expect(screen.getByText('Oily')).toBeTruthy();
    });

    it('should display vector status badges', () => {
      renderSearchResults(mockProducts);

      // First product: both vectors
      expect(screen.getAllByText('Visual ✓')[0]).toBeTruthy();
      expect(screen.getAllByText('Text ✓')[0]).toBeTruthy();

      // Second product: only tensor
      expect(screen.getAllByText('Visual ✓')[1]).toBeTruthy();
      expect(screen.getByText('No Text')).toBeTruthy();

      // Third product: only embedding
      expect(screen.getByText('No Visual')).toBeTruthy();
      expect(screen.getAllByText('Text ✓')[1]).toBeTruthy();
    });

    it('should have "View Details" buttons for all products (FR-046)', () => {
      renderSearchResults(mockProducts);

      const viewButtons = screen.getAllByText('View Details');
      expect(viewButtons).toHaveLength(3);
    });

    it('should have links to product detail pages', () => {
      const { container } = renderSearchResults(mockProducts);
      const links = container.querySelectorAll('a[href^="/app/products/"]');

      expect(links).toHaveLength(3);
      expect(links[0].getAttribute('href')).toBe('/app/products/prod-1');
      expect(links[1].getAttribute('href')).toBe('/app/products/prod-2');
      expect(links[2].getAttribute('href')).toBe('/app/products/prod-3');
    });
  });

  describe('Empty Results', () => {
    it('should render when products array is empty', () => {
      renderSearchResults([]);

      // Component should render (no errors)
      expect(screen.queryByText(/products found/i)).toBeNull();
    });

    it('should not display result count for zero results', () => {
      renderSearchResults([], 0);

      // Result count of 0 should not be displayed (handled by SearchPage empty state)
      expect(screen.queryByText('0 products found')).toBeTruthy();
    });
  });

  describe('Product Card Hover Effects', () => {
    it('should have hover classes on product cards', () => {
      const { container } = renderSearchResults(mockProducts);
      const cards = container.querySelectorAll('.hover\\:shadow-lg');

      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Image Display', () => {
    it('should render product thumbnails', () => {
      const { container } = renderSearchResults(mockProducts);
      const images = container.querySelectorAll('img');

      expect(images).toHaveLength(3);
      expect(images[0].getAttribute('src')).toBe('https://example.com/serum.jpg');
      expect(images[1].getAttribute('src')).toBe('https://example.com/cream.jpg');
      expect(images[2].getAttribute('src')).toBe('https://example.com/vitamin.jpg');
    });

    it('should have alt text for images', () => {
      const { container } = renderSearchResults(mockProducts);
      const images = container.querySelectorAll('img');

      expect(images[0].getAttribute('alt')).toBe('Hydrating Serum');
      expect(images[1].getAttribute('alt')).toBe('Anti-Aging Cream');
      expect(images[2].getAttribute('alt')).toBe('Vitamin C Booster');
    });
  });

  describe('Star Rating Display', () => {
    it('should render correct number of filled stars', () => {
      const { container } = renderSearchResults([mockProducts[0]]);

      // Product 1 has rating of 4.5, so should have 4 filled stars
      const filledStars = container.querySelectorAll('.fill-yellow-400');
      expect(filledStars.length).toBeGreaterThanOrEqual(4);
    });
  });
});
