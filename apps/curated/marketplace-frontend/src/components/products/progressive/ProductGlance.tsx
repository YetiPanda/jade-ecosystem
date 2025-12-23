/**
 * Progressive Disclosure - Glance Level Component
 *
 * 3-second quick view: Essential information for rapid scanning
 * - Product image
 * - Name and price
 * - Hero benefit (single most important claim)
 * - Rating and availability
 */

import React from 'react';
import type { ProductGlanceData } from './types';

export interface ProductGlanceProps {
  data: ProductGlanceData;
  className?: string;
}

/**
 * ProductGlance - Minimal information for quick scanning
 *
 * Design principles:
 * - Maximum 5 data points
 * - Large, clear typography
 * - High-contrast visuals
 * - Instant comprehension
 */
export function ProductGlance({ data, className = '' }: ProductGlanceProps) {
  const {
    id,
    name,
    image,
    price,
    heroBenefit,
    rating,
    reviewCount,
    inStock,
  } = data;

  /**
   * Format price for display
   */
  const formatPrice = (priceValue: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(priceValue);
  };

  /**
   * Generate star rating display
   */
  const renderStars = (ratingValue: number) => {
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="product-glance__rating-stars" aria-label={`${ratingValue} out of 5 stars`}>
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`full-${i}`} className="star star--full" aria-hidden="true">
            
          </span>
        ))}
        {/* Half star */}
        {hasHalfStar && (
          <span className="star star--half" aria-hidden="true">
            
          </span>
        )}
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className="star star--empty" aria-hidden="true">
            
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={`product-glance ${className}`} data-product-id={id}>
      {/* Product Image */}
      <div className="product-glance__image-container">
        <img
          src={image}
          alt={name}
          className="product-glance__image"
          loading="lazy"
        />
        {!inStock && (
          <div className="product-glance__stock-badge product-glance__stock-badge--out">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="product-glance__info">
        {/* Name */}
        <h3 className="product-glance__name">{name}</h3>

        {/* Hero Benefit - Single most important claim */}
        <p className="product-glance__hero-benefit">{heroBenefit}</p>

        {/* Rating */}
        <div className="product-glance__rating">
          {renderStars(rating)}
          <span className="product-glance__review-count">
            ({reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="product-glance__price-container">
          <span className="product-glance__price">{formatPrice(price)}</span>
          {inStock && (
            <span className="product-glance__stock-badge product-glance__stock-badge--in">
              In Stock
            </span>
          )}
        </div>
      </div>

      {/* Hover hint */}
      <div className="product-glance__hint" aria-hidden="true">
        Hover for details
      </div>
    </div>
  );
}

/**
 * Default export for convenience
 */
export default ProductGlance;
