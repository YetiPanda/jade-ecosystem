/**
 * HeroSection Component
 *
 * Feature: 008-homepage-integration
 *
 * Hero section for the homepage with background video or image, overlay, headline,
 * subheadline, and primary CTA button.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { DualLoginNav } from '../auth/DualLoginNav';

/**
 * HeroSection displays the main hero banner on the homepage
 *
 * Features:
 * - Video background with fallback image
 * - Auto-playing, muted, looping video
 * - Semi-transparent overlay for text readability
 * - Responsive layout (52vh on desktop, adaptive on mobile)
 * - Primary CTA button linking to products
 */
export const HeroSection: React.FC = () => {
  return (
    <section
      className="relative h-[52vh] min-h-[400px] rounded-3xl overflow-hidden"
      role="banner"
      aria-label="Hero banner"
    >
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/hero-background.jpg"
          className="w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
          <source src="/assets/hero-video.webm" type="video/webm" />
          {/* Fallback image for browsers that don't support video */}
          <img
            src="/assets/hero-background.jpg"
            alt="Premium spa treatments and skincare products"
            className="w-full h-full object-cover"
          />
        </video>
      </div>

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/25" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 flex items-end h-full px-6 sm:px-12 md:px-16 pb-8 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-7xl">
          {/* Left Column: Logo, Headline, and CTA - Centered Vertically */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Jade Logo */}
            <div className="mb-6">
              <img
                src="/assets/jade-logo-6x-enhanced.png"
                alt="Jade Software"
                className="h-12 sm:h-16 md:h-20 w-auto"
              />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-3">
              Find your next bestselling spa product.
            </h1>
            <p className="text-base sm:text-lg opacity-90 mb-8">
              Shop premium skincare from independent brands worldwide.
            </p>

            {/* Browse Products CTA */}
            <Link to="/app/marketplace" className="inline-block w-fit">
              <Button
                variant="ghost"
                className="rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/30 transition-all px-6 py-3 text-sm font-medium"
                size="md"
                aria-label="Browse all products"
              >
                or browse all products →
              </Button>
            </Link>
          </div>

          {/* Right Column: Dual Login Navigation - Bottom Aligned */}
          <div className="lg:col-span-7 flex justify-end items-end">
            <DualLoginNav variant="hero" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
