/**
 * BrandStrip Component Tests
 *
 * Feature: 008-homepage-integration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrandStrip, Brand } from '../BrandStrip';

const mockBrands: Brand[] = [
  { id: '1', name: 'Brand One', logo: '/assets/brands/brand1.png' },
  { id: '2', name: 'Brand Two', logo: '/assets/brands/brand2.png' },
  { id: '3', name: 'Brand Three', logo: '/assets/brands/brand3.png' },
  { id: '4', name: 'Brand Four', logo: '/assets/brands/brand4.png' },
  { id: '5', name: 'Brand Five', logo: '/assets/brands/brand5.png' },
];

// Mock scrollBy for all tests
beforeEach(() => {
  Element.prototype.scrollBy = vi.fn() as any;
});

describe('BrandStrip', () => {
  it('renders without crashing', () => {
    render(<BrandStrip brands={mockBrands} />);
    expect(screen.getByRole('list', { name: /Brand logos/i })).toBeInTheDocument();
  });

  it('displays the default title', () => {
    render(<BrandStrip brands={mockBrands} />);
    expect(screen.getByText('Featured Skincare Brands')).toBeInTheDocument();
  });

  it('displays custom title when provided', () => {
    render(<BrandStrip brands={mockBrands} title="Top Spa Brands" />);
    expect(screen.getByText('Top Spa Brands')).toBeInTheDocument();
  });

  it('renders all brand logos', () => {
    render(<BrandStrip brands={mockBrands} />);
    mockBrands.forEach((brand) => {
      const logo = screen.getByAltText(`${brand.name} logo`);
      expect(logo).toBeInTheDocument();
    });
  });

  it('brand logos have correct src attributes', () => {
    render(<BrandStrip brands={mockBrands} />);
    mockBrands.forEach((brand) => {
      const logo = screen.getByAltText(`${brand.name} logo`) as HTMLImageElement;
      expect(logo.src).toContain(brand.logo);
    });
  });

  it('brand images are lazy loaded', () => {
    render(<BrandStrip brands={mockBrands} />);
    const firstLogo = screen.getByAltText(`${mockBrands[0].name} logo`);
    expect(firstLogo).toHaveAttribute('loading', 'lazy');
  });

  it('renders navigation buttons', () => {
    render(<BrandStrip brands={mockBrands} />);
    expect(screen.getByLabelText('Scroll to previous brands')).toBeInTheDocument();
    expect(screen.getByLabelText('Scroll to next brands')).toBeInTheDocument();
  });

  it('previous button scrolls left when clicked', () => {
    render(<BrandStrip brands={mockBrands} />);
    const container = screen.getByRole('list', { name: /Brand logos/i });
    const scrollBySpy = vi.spyOn(container, 'scrollBy');

    const prevButton = screen.getByLabelText('Scroll to previous brands');
    fireEvent.click(prevButton);

    expect(scrollBySpy).toHaveBeenCalledWith({
      left: -200,
      behavior: 'smooth',
    });
  });

  it('next button scrolls right when clicked', () => {
    render(<BrandStrip brands={mockBrands} />);
    const container = screen.getByRole('list', { name: /Brand logos/i });
    const scrollBySpy = vi.spyOn(container, 'scrollBy');

    const nextButton = screen.getByLabelText('Scroll to next brands');
    fireEvent.click(nextButton);

    expect(scrollBySpy).toHaveBeenCalledWith({
      left: 200,
      behavior: 'smooth',
    });
  });

  it('handles Enter key on navigation buttons', () => {
    render(<BrandStrip brands={mockBrands} />);
    const container = screen.getByRole('list', { name: /Brand logos/i });
    const scrollBySpy = vi.spyOn(container, 'scrollBy');

    const prevButton = screen.getByLabelText('Scroll to previous brands');
    fireEvent.keyDown(prevButton, { key: 'Enter' });

    expect(scrollBySpy).toHaveBeenCalled();
  });

  it('handles Space key on navigation buttons', () => {
    render(<BrandStrip brands={mockBrands} />);
    const container = screen.getByRole('list', { name: /Brand logos/i });
    const scrollBySpy = vi.spyOn(container, 'scrollBy');

    const nextButton = screen.getByLabelText('Scroll to next brands');
    fireEvent.keyDown(nextButton, { key: ' ' });

    expect(scrollBySpy).toHaveBeenCalled();
  });

  it('returns null when brands array is empty', () => {
    const { container } = render(<BrandStrip brands={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when brands is undefined', () => {
    const { container } = render(<BrandStrip brands={undefined as any} />);
    expect(container.firstChild).toBeNull();
  });

  it('applies correct styling classes to brand container', () => {
    render(<BrandStrip brands={mockBrands} />);
    const container = screen.getByRole('list', { name: /Brand logos/i });
    expect(container).toHaveClass('flex', 'gap-8', 'overflow-x-auto', 'scrollbar-hide', 'scroll-smooth');
  });

  it('applies grayscale and opacity effects to brand items', () => {
    const { container } = render(<BrandStrip brands={mockBrands} />);
    const brandItems = container.querySelectorAll('[role="listitem"]');
    expect(brandItems[0]).toHaveClass('grayscale', 'opacity-70', 'hover:grayscale-0', 'hover:opacity-100');
  });

  it('has correct ARIA labels', () => {
    render(<BrandStrip brands={mockBrands} />);
    expect(screen.getByLabelText('Featured brands section')).toBeInTheDocument();
    expect(screen.getByRole('list', { name: /Brand logos/i })).toBeInTheDocument();
  });

  it('renders correct number of brand items', () => {
    const { container } = render(<BrandStrip brands={mockBrands} />);
    const brandItems = container.querySelectorAll('[role="listitem"]');
    expect(brandItems).toHaveLength(mockBrands.length);
  });

  it('handles single brand correctly', () => {
    const singleBrand = [mockBrands[0]];
    render(<BrandStrip brands={singleBrand} />);
    expect(screen.getByAltText(`${singleBrand[0].name} logo`)).toBeInTheDocument();
  });

  it('brand container has fixed dimensions', () => {
    const { container } = render(<BrandStrip brands={mockBrands} />);
    const brandItems = container.querySelectorAll('[role="listitem"]');
    expect(brandItems[0]).toHaveClass('w-32', 'h-16');
  });
});
