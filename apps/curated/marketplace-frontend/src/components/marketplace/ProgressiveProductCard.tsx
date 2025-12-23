/**
 * ProgressiveProductCard Component
 *
 * Task: Day 3 - Priority 1: ProductCard Integration
 *
 * Progressive Disclosure Product Card with hover expansion
 * Features:
 * - Glance: Quick product overview (default state)
 * - Scan: Hover reveals ingredients, benefits, detailed info (on hover)
 * - Study: Navigate to product detail page (on click)
 *
 * Based on SKA framework principles:
 * - Glance: 3 seconds - Hero info, price, rating
 * - Scan: 30 seconds - Key ingredients, benefits, certifications
 * - Study: 5+ minutes - Full detail page with clinical data
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressiveContent } from '../products/progressive/ProgressiveContent';
import { mapGlanceData, mapScanData, mapStudyData } from '../../utils/productDataAdapter';
import type { Product } from '../../graphql/generated';
import type {
  ProductGlanceData,
  ProductScanData,
  ProductStudyData,
} from '../products/progressive/types';

/**
 * Progressive Product Card props
 */
interface ProgressiveProductCardProps {
  product: Product;
  onAddToCart?: (productId: string, quantity: number) => void;
  className?: string;
}

/**
 * Glance View Renderer (3 second view)
 * Quick scanning - hero information only
 */
const GlanceRenderer: React.FC<{ data: ProductGlanceData }> = ({ data }) => {
  return (
    <div className="glance-view">
      {/* Product Image */}
      <div className="product-image">
        <img src={data.image || '/placeholder-product.jpg'} alt={data.name} />

        {/* Stock Badge */}
        {!data.inStock && (
          <div className="out-of-stock-badge">Out of Stock</div>
        )}
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-name">{data.name}</h3>
        <p className="hero-benefit">{data.heroBenefit}</p>

        {/* Rating */}
        <div className="rating-section">
          <div className="stars">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={`star ${i < Math.round(data.rating) ? 'filled' : ''}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="review-count">
            {data.rating.toFixed(1)} ({data.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="price-section">
          <span className="price">${data.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Scan View Renderer (30 second view)
 * Detailed evaluation - ingredients, benefits, certifications
 */
const ScanRenderer: React.FC<{ data: ProductScanData }> = ({ data }) => {
  return (
    <div className="scan-view">
      {/* Image with brand overlay */}
      <div className="product-image">
        <img src={data.image || '/placeholder-product.jpg'} alt={data.name} />
        {data.brand.logo && (
          <div className="brand-logo">
            <img src={data.brand.logo} alt={data.brand.name} />
          </div>
        )}
      </div>

      {/* Expanded Info */}
      <div className="product-info-expanded">
        <div className="header">
          <div>
            <p className="brand-name">{data.brand.name}</p>
            <h3 className="product-name">{data.name}</h3>
          </div>
          <div className="price-section">
            <span className="price">${data.price.toFixed(2)}</span>
            {data.size && (
              <span className="size">{data.size.value}{data.size.unit}</span>
            )}
          </div>
        </div>

        {/* Key Ingredients */}
        {data.keyIngredients.length > 0 && (
          <div className="key-ingredients">
            <h4>Key Ingredients</h4>
            <div className="ingredients-list">
              {data.keyIngredients.slice(0, 3).map((ingredient, idx) => (
                <div key={idx} className="ingredient">
                  <span className="ingredient-name">{ingredient.name}</span>
                  <span className="ingredient-purpose">{ingredient.purpose}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Benefits */}
        {data.benefits.length > 0 && (
          <div className="benefits">
            <h4>Benefits</h4>
            <ul>
              {data.benefits.slice(0, 3).map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div className="certifications">
            {data.certifications.map((cert, idx) => (
              <span key={idx} className="cert-badge" title={cert.description}>
                {cert.name}
              </span>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="cta-hint">
          <span>Click for full details →</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Study View (redirects to detail page)
 * This component doesn't render study level - clicking navigates to detail page
 */
const StudyRenderer: React.FC<{ data: ProductStudyData }> = ({ data }) => {
  return <div>Redirecting to product detail...</div>;
};

/**
 * Progressive Product Card Component
 *
 * Implements progressive disclosure pattern:
 * - Default: Glance view (3s scan)
 * - Hover: Scan view (30s evaluation)
 * - Click: Navigate to study view (detail page)
 */
export const ProgressiveProductCard: React.FC<ProgressiveProductCardProps> = ({
  product,
  onAddToCart,
  className,
}) => {
  const navigate = useNavigate();

  // Map GraphQL product to progressive disclosure data
  const glanceData = mapGlanceData(product);
  const scanData = mapScanData(product);
  const studyData = mapStudyData(product);

  // Handle level change - navigate to detail page on study level
  const handleLevelChange = (level: 'glance' | 'scan' | 'study') => {
    if (level === 'study') {
      navigate(`/marketplace/products/${product.id}`);
    }
  };

  return (
    <ProgressiveContent
      data={glanceData}
      glanceRenderer={(data) => <GlanceRenderer data={data} />}
      scanRenderer={(data) => <ScanRenderer data={scanData} />}
      studyRenderer={(data) => <StudyRenderer data={studyData} />}
      onLevelChange={handleLevelChange}
      className={`progressive-product-card ${className || ''}`}
      transitionDuration={300}
    >
      <style jsx>{`
        /* Glance View Styles */
        .glance-view {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          overflow: hidden;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .product-image {
          position: relative;
          width: 100%;
          padding-bottom: 100%; /* 1:1 aspect ratio */
          background: #f9fafb;
          overflow: hidden;
        }

        .product-image img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .glance-view:hover .product-image img {
          transform: scale(1.05);
        }

        .out-of-stock-badge {
          position: absolute;
          bottom: 0.75rem;
          left: 0.75rem;
          background: #6b7280;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 10;
        }

        .brand-logo {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 3rem;
          height: 3rem;
          background: white;
          border-radius: 0.375rem;
          padding: 0.25rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .brand-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .product-info,
        .product-info-expanded {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .product-name {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0;
          line-height: 1.4;
          color: #111827;
        }

        .hero-benefit {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
        }

        .rating-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .stars {
          display: flex;
          gap: 0.125rem;
        }

        .star {
          color: #d1d5db;
          font-size: 1rem;
        }

        .star.filled {
          color: #fbbf24;
        }

        .review-count {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .price-section {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
        }

        .size {
          font-size: 0.875rem;
          color: #6b7280;
        }

        /* Scan View Styles */
        .scan-view {
          background: white;
          border: 2px solid #3b82f6;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                      0 4px 6px -2px rgba(0, 0, 0, 0.05);
          cursor: pointer;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .brand-name {
          font-size: 0.75rem;
          font-weight: 500;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 0.25rem 0;
        }

        .key-ingredients,
        .benefits,
        .certifications {
          margin-top: 0.75rem;
        }

        .key-ingredients h4,
        .benefits h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin: 0 0 0.5rem 0;
        }

        .ingredients-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .ingredient {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .ingredient-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
        }

        .ingredient-purpose {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .benefits ul {
          margin: 0;
          padding-left: 1.25rem;
        }

        .benefits li {
          font-size: 0.875rem;
          color: #374151;
          line-height: 1.5;
          margin-bottom: 0.25rem;
        }

        .certifications {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .cert-badge {
          display: inline-block;
          background: #dbeafe;
          color: #1e40af;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .cta-hint {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }

        .cta-hint span {
          font-size: 0.875rem;
          color: #3b82f6;
          font-weight: 500;
        }

        /* Progressive Content Wrapper */
        :global(.progressive-product-card) {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        :global(.progressive-product-card.progressive-transitioning) {
          transition: all 0.3s ease;
        }

        /* Animation classes */
        :global(.progressive-product-card.progressive-scan) {
          transform: translateY(-4px);
        }
      `}</style>
    </ProgressiveContent>
  );
};

export default ProgressiveProductCard;
