/**
 * BrandStrip Component
 *
 * Feature: 008-homepage-integration
 *
 * Horizontal scrollable brand strip with navigation controls.
 * Displays brand logos that transition from grayscale to color on hover.
 */

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Brand interface for the brand strip
 */
export interface Brand {
  id: string;
  name: string;
  logo: string;
}

/**
 * Props for BrandStrip component
 */
export interface BrandStripProps {
  brands: Brand[];
  title?: string;
}

/**
 * BrandStrip displays a horizontal scrollable list of brand logos
 *
 * Features:
 * - Horizontal scroll with smooth behavior
 * - Previous/Next navigation buttons
 * - Hover effects (grayscale to color transition)
 * - Keyboard navigation support
 * - Empty state handling
 * - Accessible ARIA labels
 */
export const BrandStrip: React.FC<BrandStripProps> = ({
  brands,
  title = 'Featured Skincare Brands',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  /**
   * Scroll the brand strip left or right
   */
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (event: React.KeyboardEvent, direction: 'left' | 'right') => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scroll(direction);
    }
  };

  // Handle empty state
  if (!brands || brands.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4" aria-label="Featured brands section">
      {/* Header with Navigation Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            onKeyDown={(e) => handleKeyDown(e, 'left')}
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Scroll to previous brands"
            type="button"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => scroll('right')}
            onKeyDown={(e) => handleKeyDown(e, 'right')}
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Scroll to next brands"
            type="button"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Scrollable Brand Container */}
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth"
        role="list"
        aria-label="Brand logos"
      >
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="flex-none w-32 h-16 relative grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
            role="listitem"
          >
            <img
              src={brand.logo}
              alt={`${brand.name} logo`}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrandStrip;
