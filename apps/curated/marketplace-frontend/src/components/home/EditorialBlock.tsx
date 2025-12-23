/**
 * EditorialBlock Component
 *
 * Feature: 008-homepage-integration
 *
 * Editorial content block for homepage featuring promotional content
 * with image, text, and CTA button.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

/**
 * Props for EditorialBlock component
 */
export interface EditorialBlockProps {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  ctaText: string;
  ctaLink: string;
  reversed?: boolean;
}

/**
 * EditorialBlock displays promotional/editorial content
 *
 * Features:
 * - Image and text layout
 * - CTA button with routing
 * - Responsive behavior
 * - Lazy-loaded images
 * - Optional reversed layout (image on right)
 */
export const EditorialBlock: React.FC<EditorialBlockProps> = ({
  title,
  description,
  image,
  imageAlt,
  ctaText,
  ctaLink,
  reversed = false,
}) => {
  return (
    <section
      className={`grid md:grid-cols-2 gap-8 items-center ${
        reversed ? 'md:flex-row-reverse' : ''
      }`}
      aria-label="Editorial content"
    >
      {/* Image */}
      <div
        className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted ${
          reversed ? 'md:order-2' : ''
        }`}
      >
        <img
          src={image}
          alt={imageAlt || title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className={`space-y-6 ${reversed ? 'md:order-1' : ''}`}>
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground leading-tight">
          {title}
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
        <Link to={ctaLink} className="inline-block">
          <Button
            size="lg"
            className="rounded-full px-8"
            aria-label={`${ctaText} - ${title}`}
          >
            {ctaText}
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default EditorialBlock;
