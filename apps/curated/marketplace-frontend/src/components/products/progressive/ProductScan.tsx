/**
 * Progressive Disclosure - Scan Level Component
 *
 * 30-second detailed view: Information for evaluation and comparison
 * - Everything from Glance level
 * - Key ingredients and benefits
 * - Skin type compatibility
 * - Certifications and badges
 * - Size and price per unit
 */

import React from 'react';
import type { ProductScanData } from './types';

export interface ProductScanProps {
  data: ProductScanData;
  className?: string;
}

/**
 * ProductScan - Detailed information for product evaluation
 *
 * Design principles:
 * - Scannable layout with clear sections
 * - Visual hierarchy for quick navigation
 * - Key facts highlighted
 * - Comparison-friendly data points
 */
export function ProductScan({ data, className = '' }: ProductScanProps) {
  const {
    id,
    name,
    image,
    price,
    heroBenefit,
    rating,
    reviewCount,
    inStock,
    brand,
    keyIngredients,
    skinTypes,
    certifications,
    size,
    pricePerUnit,
    benefits,
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
   * Render star rating
   */
  const renderStars = (ratingValue: number) => {
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="product-scan__rating-stars" aria-label={`${ratingValue} out of 5 stars`}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`full-${i}`} className="star star--full" aria-hidden="true"></span>
        ))}
        {hasHalfStar && (
          <span className="star star--half" aria-hidden="true"></span>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className="star star--empty" aria-hidden="true"></span>
        ))}
      </div>
    );
  };

  /**
   * Format skin type for display
   */
  const formatSkinType = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className={`product-scan ${className}`} data-product-id={id}>
      {/* Header Section - Similar to Glance */}
      <div className="product-scan__header">
        <div className="product-scan__image-container">
          <img
            src={image}
            alt={name}
            className="product-scan__image"
            loading="lazy"
          />
          {brand.logo && (
            <img
              src={brand.logo}
              alt={brand.name}
              className="product-scan__brand-logo"
            />
          )}
        </div>

        <div className="product-scan__header-info">
          <div className="product-scan__brand">{brand.name}</div>
          <h3 className="product-scan__name">{name}</h3>
          <p className="product-scan__hero-benefit">{heroBenefit}</p>

          <div className="product-scan__rating">
            {renderStars(rating)}
            <span className="product-scan__review-count">
              ({reviewCount.toLocaleString()} reviews)
            </span>
          </div>

          <div className="product-scan__price-info">
            <span className="product-scan__price">{formatPrice(price)}</span>
            <span className="product-scan__size">
              {size.value} {size.unit}
            </span>
            {pricePerUnit && (
              <span className="product-scan__price-per-unit">
                ({formatPrice(pricePerUnit.value)} / {pricePerUnit.unit})
              </span>
            )}
          </div>

          <div className="product-scan__stock">
            {inStock ? (
              <span className="product-scan__stock-badge product-scan__stock-badge--in">
                 In Stock
              </span>
            ) : (
              <span className="product-scan__stock-badge product-scan__stock-badge--out">
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="product-scan__section product-scan__benefits">
        <h4 className="product-scan__section-title">Key Benefits</h4>
        <ul className="product-scan__benefits-list">
          {benefits.map((benefit, index) => (
            <li key={index} className="product-scan__benefit-item">
              <span className="product-scan__benefit-icon" aria-hidden="true"></span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Key Ingredients Section */}
      <div className="product-scan__section product-scan__ingredients">
        <h4 className="product-scan__section-title">Key Ingredients</h4>
        <div className="product-scan__ingredients-list">
          {keyIngredients.map((ingredient, index) => (
            <div
              key={index}
              className={`product-scan__ingredient ${
                ingredient.isActive ? 'product-scan__ingredient--active' : ''
              }`}
            >
              <span className="product-scan__ingredient-name">
                {ingredient.name}
              </span>
              <span className="product-scan__ingredient-purpose">
                {ingredient.purpose}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Skin Types Section */}
      <div className="product-scan__section product-scan__skin-types">
        <h4 className="product-scan__section-title">Suitable For</h4>
        <div className="product-scan__skin-types-list">
          {skinTypes.map((type, index) => (
            <span key={index} className="product-scan__skin-type-badge">
              {formatSkinType(type)}
            </span>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      {certifications.length > 0 && (
        <div className="product-scan__section product-scan__certifications">
          <h4 className="product-scan__section-title">Certifications</h4>
          <div className="product-scan__certifications-list">
            {certifications.map((cert, index) => (
              <div key={index} className="product-scan__certification">
                {cert.icon && (
                  <img
                    src={cert.icon}
                    alt=""
                    className="product-scan__certification-icon"
                    aria-hidden="true"
                  />
                )}
                <div className="product-scan__certification-info">
                  <span className="product-scan__certification-name">
                    {cert.name}
                  </span>
                  <span className="product-scan__certification-description">
                    {cert.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Hint */}
      <div className="product-scan__hint" aria-hidden="true">
        Click for detailed analysis
      </div>
    </div>
  );
}

/**
 * Default export for convenience
 */
export default ProductScan;
