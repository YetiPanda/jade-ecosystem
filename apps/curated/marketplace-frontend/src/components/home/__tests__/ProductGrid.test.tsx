/**
 * ProductGrid Component Tests
 *
 * Feature: 008-homepage-integration
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProductGrid, GridProduct } from '../ProductGrid';

const mockProducts: GridProduct[] = [
  {
    id: '1',
    name: 'Hydrating Face Serum',
    slug: 'hydrating-face-serum',
    image: '/assets/products/serum1.jpg',
    price: 49.99,
    currencyCode: 'USD',
    rating: 4.5,
    reviewCount: 120,
    heroBenefit: 'Deep hydration for all skin types',
  },
  {
    id: '2',
    name: 'Vitamin C Brightening Cream',
    slug: 'vitamin-c-cream',
    image: '/assets/products/cream1.jpg',
    price: 39.99,
    currencyCode: 'USD',
    rating: 4.8,
    reviewCount: 89,
    heroBenefit: 'Brightens and evens skin tone',
  },
  {
    id: '3',
    name: 'Gentle Cleansing Oil',
    slug: 'cleansing-oil',
    image: '/assets/products/oil1.jpg',
    price: 29.99,
    currencyCode: 'USD',
    rating: 4.3,
    reviewCount: 45,
    heroBenefit: 'Removes makeup without stripping',
  },
  {
    id: '4',
    name: 'Retinol Night Treatment',
    slug: 'retinol-treatment',
    image: '/assets/products/retinol1.jpg',
    price: 59.99,
    currencyCode: 'USD',
    rating: 4.7,
    reviewCount: 156,
    heroBenefit: 'Anti-aging overnight treatment',
  },
];

const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('ProductGrid', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<ProductGrid products={mockProducts} />, { wrapper: RouterWrapper });
      expect(screen.getAllByRole('link')).toHaveLength(mockProducts.length);
    });

    it('renders all products', () => {
      render(<ProductGrid products={mockProducts} />, { wrapper: RouterWrapper });
      mockProducts.forEach((product) => {
        expect(screen.getByText(product.name)).toBeInTheDocument();
      });
    });

    it('renders product images with correct attributes', () => {
      render(<ProductGrid products={mockProducts} />, { wrapper: RouterWrapper });
      mockProducts.forEach((product) => {
        const image = screen.getByAltText(product.name) as HTMLImageElement;
        expect(image).toBeInTheDocument();
        expect(image.src).toContain(product.image);
        expect(image).toHaveAttribute('loading', 'lazy');
      });
    });

    it('renders product prices', () => {
      render(<ProductGrid products={mockProducts} />, { wrapper: RouterWrapper });
      expect(screen.getByText('$49.99')).toBeInTheDocument();
      expect(screen.getByText('$39.99')).toBeInTheDocument();
    });

    it('renders hero benefits when provided', () => {
      render(<ProductGrid products={mockProducts} />, { wrapper: RouterWrapper });
      mockProducts.forEach((product) => {
        if (product.heroBenefit) {
          expect(screen.getByText(product.heroBenefit)).toBeInTheDocument();
        }
      });
    });

    it('renders ratings when provided', () => {
      render(<ProductGrid products={mockProducts} />, { wrapper: RouterWrapper });
      expect(screen.getByText('4.5')).toBeInTheDocument();
      expect(screen.getByText('(120)')).toBeInTheDocument();
    });
  });

  describe('Grid Layout', () => {
    it('applies correct classes for 4 column grid', () => {
      const { container } = render(<ProductGrid products={mockProducts} columns={4} />, {
        wrapper: RouterWrapper,
      });
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4');
    });

    it('applies correct classes for 3 column grid', () => {
      const { container } = render(<ProductGrid products={mockProducts} columns={3} />, {
        wrapper: RouterWrapper,
      });
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3');
    });

    it('applies correct classes for 2 column grid', () => {
      const { container } = render(<ProductGrid products={mockProducts} columns={2} />, {
        wrapper: RouterWrapper,
      });
      const grid = container.firstChild as HTMLElement;
      expect(grid).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2');
    });
  });

  describe('Loading State', () => {
    it('renders skeleton loaders when loading', () => {
      const { container } = render(<ProductGrid products={[]} loading={true} />, {
        wrapper: RouterWrapper,
      });
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('does not render products when loading', () => {
      render(<ProductGrid products={mockProducts} loading={true} />, {
        wrapper: RouterWrapper,
      });
      expect(screen.queryByText(mockProducts[0].name)).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('renders error message when error is provided', () => {
      const error = new Error('Failed to fetch products');
      render(<ProductGrid products={[]} error={error} />, { wrapper: RouterWrapper });
      expect(screen.getByText('Failed to load products')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch products')).toBeInTheDocument();
    });

    it('does not render products when error exists', () => {
      const error = new Error('Network error');
      render(<ProductGrid products={mockProducts} error={error} />, {
        wrapper: RouterWrapper,
      });
      expect(screen.queryByText(mockProducts[0].name)).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('renders empty state when products array is empty', () => {
      render(<ProductGrid products={[]} />, { wrapper: RouterWrapper });
      expect(screen.getByText('No products available')).toBeInTheDocument();
    });

    it('renders empty state when products is undefined', () => {
      render(<ProductGrid products={undefined as any} />, { wrapper: RouterWrapper });
      expect(screen.getByText('No products available')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('links to product detail page with slug', () => {
      render(<ProductGrid products={mockProducts} />, { wrapper: RouterWrapper });
      const firstLink = screen.getAllByRole('link')[0];
      expect(firstLink).toHaveAttribute(
        'href',
        `/marketplace/products/${mockProducts[0].slug}`
      );
    });

    it('links to product detail page with id when slug is missing', () => {
      const productsWithoutSlug = mockProducts.map((p) => ({ ...p, slug: undefined }));
      render(<ProductGrid products={productsWithoutSlug} />, { wrapper: RouterWrapper });
      const firstLink = screen.getAllByRole('link')[0];
      expect(firstLink).toHaveAttribute('href', `/marketplace/products/${productsWithoutSlug[0].id}`);
    });
  });

  describe('Product Cards', () => {
    it('applies hover classes to product cards', () => {
      render(<ProductGrid products={mockProducts} />, { wrapper: RouterWrapper });
      const cards = screen.getAllByRole('link');
      cards.forEach((card) => {
        expect(card).toHaveClass('hover:shadow-lg', 'hover:-translate-y-1');
      });
    });

    it('renders product cards with correct structure', () => {
      const { container } = render(<ProductGrid products={mockProducts} />, {
        wrapper: RouterWrapper,
      });
      const cards = container.querySelectorAll('a');
      expect(cards).toHaveLength(mockProducts.length);
    });
  });

  describe('Price Formatting', () => {
    it('formats USD prices correctly', () => {
      render(<ProductGrid products={mockProducts} />, { wrapper: RouterWrapper });
      expect(screen.getByText('$49.99')).toBeInTheDocument();
    });

    it('handles products without currency code', () => {
      const productsWithoutCurrency = mockProducts.map((p) => ({
        ...p,
        currencyCode: undefined,
      }));
      render(<ProductGrid products={productsWithoutCurrency} />, {
        wrapper: RouterWrapper,
      });
      expect(screen.getByText('$49.99')).toBeInTheDocument(); // Default to USD
    });
  });

  describe('Optional Fields', () => {
    it('renders correctly without hero benefit', () => {
      const productsWithoutBenefit = mockProducts.map((p) => ({
        ...p,
        heroBenefit: undefined,
      }));
      render(<ProductGrid products={productsWithoutBenefit} />, {
        wrapper: RouterWrapper,
      });
      expect(screen.getByText(mockProducts[0].name)).toBeInTheDocument();
    });

    it('renders correctly without rating', () => {
      const productsWithoutRating = mockProducts.map((p) => ({
        ...p,
        rating: undefined,
        reviewCount: undefined,
      }));
      render(<ProductGrid products={productsWithoutRating} />, {
        wrapper: RouterWrapper,
      });
      expect(screen.getByText(mockProducts[0].name)).toBeInTheDocument();
      expect(screen.queryByText('4.5')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('all images have alt text', () => {
      render(<ProductGrid products={mockProducts} />, { wrapper: RouterWrapper });
      mockProducts.forEach((product) => {
        const image = screen.getByAltText(product.name);
        expect(image).toBeInTheDocument();
      });
    });

    it('all product cards are links', () => {
      render(<ProductGrid products={mockProducts} />, { wrapper: RouterWrapper });
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(mockProducts.length);
    });
  });
});
