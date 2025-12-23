/**
 * EditorialBlock Component Tests
 *
 * Feature: 008-homepage-integration
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { EditorialBlock } from '../EditorialBlock';

const mockProps = {
  title: 'Discover Our New Collection',
  description:
    'Explore our curated selection of premium skincare products from leading spa brands around the world.',
  image: '/assets/editorial/collection.jpg',
  imageAlt: 'New skincare collection',
  ctaText: 'Shop Now',
  ctaLink: '/app/products?collection=new',
};

const RouterWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('EditorialBlock', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<EditorialBlock {...mockProps} />, { wrapper: RouterWrapper });
      expect(screen.getByRole('region', { name: /Editorial content/i })).toBeInTheDocument();
    });

    it('displays the title', () => {
      render(<EditorialBlock {...mockProps} />, { wrapper: RouterWrapper });
      expect(screen.getByText(mockProps.title)).toBeInTheDocument();
    });

    it('displays the description', () => {
      render(<EditorialBlock {...mockProps} />, { wrapper: RouterWrapper });
      expect(screen.getByText(mockProps.description)).toBeInTheDocument();
    });

    it('displays the CTA button with correct text', () => {
      render(<EditorialBlock {...mockProps} />, { wrapper: RouterWrapper });
      const button = screen.getByRole('button', { name: new RegExp(mockProps.ctaText, 'i') });
      expect(button).toBeInTheDocument();
    });

    it('renders image with correct src', () => {
      render(<EditorialBlock {...mockProps} />, { wrapper: RouterWrapper });
      const image = screen.getByAltText(mockProps.imageAlt!) as HTMLImageElement;
      expect(image).toBeInTheDocument();
      expect(image.src).toContain(mockProps.image);
    });

    it('image has lazy loading', () => {
      render(<EditorialBlock {...mockProps} />, { wrapper: RouterWrapper });
      const image = screen.getByAltText(mockProps.imageAlt!);
      expect(image).toHaveAttribute('loading', 'lazy');
    });
  });

  describe('Navigation', () => {
    it('CTA button links to correct URL', () => {
      render(<EditorialBlock {...mockProps} />, { wrapper: RouterWrapper });
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', mockProps.ctaLink);
    });

    it('CTA has correct aria-label', () => {
      render(<EditorialBlock {...mockProps} />, { wrapper: RouterWrapper });
      const button = screen.getByRole('button', {
        name: `${mockProps.ctaText} - ${mockProps.title}`,
      });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Image Alt Text', () => {
    it('uses provided imageAlt when available', () => {
      render(<EditorialBlock {...mockProps} />, { wrapper: RouterWrapper });
      expect(screen.getByAltText(mockProps.imageAlt!)).toBeInTheDocument();
    });

    it('falls back to title when imageAlt is not provided', () => {
      const propsWithoutAlt = { ...mockProps, imageAlt: undefined };
      render(<EditorialBlock {...propsWithoutAlt} />, { wrapper: RouterWrapper });
      expect(screen.getByAltText(mockProps.title)).toBeInTheDocument();
    });
  });

  describe('Layout', () => {
    it('applies default layout (image on left)', () => {
      const { container } = render(<EditorialBlock {...mockProps} />, {
        wrapper: RouterWrapper,
      });
      const section = container.querySelector('section');
      expect(section).not.toHaveClass('md:flex-row-reverse');
    });

    it('applies reversed layout when reversed prop is true', () => {
      const { container } = render(<EditorialBlock {...mockProps} reversed={true} />, {
        wrapper: RouterWrapper,
      });
      const imageContainer = container.querySelector('.aspect-\\[4\\/3\\]');
      expect(imageContainer).toHaveClass('md:order-2');
      const contentContainer = container.querySelector('.space-y-6');
      expect(contentContainer).toHaveClass('md:order-1');
    });

    it('has grid layout classes', () => {
      const { container } = render(<EditorialBlock {...mockProps} />, {
        wrapper: RouterWrapper,
      });
      const section = container.querySelector('section');
      expect(section).toHaveClass('grid', 'md:grid-cols-2', 'gap-8', 'items-center');
    });
  });

  describe('Responsive Design', () => {
    it('title has responsive text size classes', () => {
      render(<EditorialBlock {...mockProps} />, { wrapper: RouterWrapper });
      const title = screen.getByText(mockProps.title);
      expect(title).toHaveClass('text-3xl', 'md:text-4xl');
    });

    it('image has responsive aspect ratio', () => {
      const { container } = render(<EditorialBlock {...mockProps} />, {
        wrapper: RouterWrapper,
      });
      const imageContainer = container.querySelector('.aspect-\\[4\\/3\\]');
      expect(imageContainer).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('applies correct spacing to content', () => {
      const { container } = render(<EditorialBlock {...mockProps} />, {
        wrapper: RouterWrapper,
      });
      const content = container.querySelector('.space-y-6');
      expect(content).toBeInTheDocument();
    });

    it('image has rounded corners', () => {
      const { container } = render(<EditorialBlock {...mockProps} />, {
        wrapper: RouterWrapper,
      });
      const imageContainer = container.querySelector('.aspect-\\[4\\/3\\]');
      expect(imageContainer).toHaveClass('rounded-2xl');
    });

    it('title has correct font weight', () => {
      render(<EditorialBlock {...mockProps} />, { wrapper: RouterWrapper });
      const title = screen.getByText(mockProps.title);
      expect(title).toHaveClass('font-semibold');
    });

    it('description has correct text color', () => {
      render(<EditorialBlock {...mockProps} />, { wrapper: RouterWrapper });
      const description = screen.getByText(mockProps.description);
      expect(description).toHaveClass('text-muted-foreground');
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA label', () => {
      render(<EditorialBlock {...mockProps} />, { wrapper: RouterWrapper });
      expect(screen.getByLabelText('Editorial content')).toBeInTheDocument();
    });

    it('image has descriptive alt text', () => {
      render(<EditorialBlock {...mockProps} />, { wrapper: RouterWrapper });
      const image = screen.getByAltText(mockProps.imageAlt!);
      expect(image).toBeInTheDocument();
    });

    it('CTA button has descriptive aria-label', () => {
      render(<EditorialBlock {...mockProps} />, { wrapper: RouterWrapper });
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label');
    });
  });

  describe('Content Display', () => {
    it('renders title with correct heading level', () => {
      render(<EditorialBlock {...mockProps} />, { wrapper: RouterWrapper });
      const title = screen.getByRole('heading', { level: 2 });
      expect(title).toHaveTextContent(mockProps.title);
    });

    it('renders description as paragraph', () => {
      render(<EditorialBlock {...mockProps} />, { wrapper: RouterWrapper });
      const description = screen.getByText(mockProps.description);
      expect(description.tagName).toBe('P');
    });

    it('CTA button has rounded full class', () => {
      render(<EditorialBlock {...mockProps} />, { wrapper: RouterWrapper });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('rounded-full');
    });
  });
});
