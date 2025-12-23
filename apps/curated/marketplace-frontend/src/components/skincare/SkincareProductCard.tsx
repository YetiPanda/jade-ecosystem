/**
 * SkincareProductCard Component
 *
 * Feature: RDF Skincare Taxonomy Integration
 *
 * Displays skincare products from semantic search
 * with progressive disclosure (glance/scan/study)
 */

import { useState } from 'react';
import { SkincareProduct } from '../../hooks/useSkincareSearch';

interface SkincareProductCardProps {
  product: SkincareProduct;
  onViewDetails?: (product: SkincareProduct) => void;
}

/**
 * Map price tier to display text and color
 */
const PRICE_TIER_MAP: Record<string, { label: string; color: string }> = {
  BUDGET: { label: '$', color: '#10b981' },
  MODERATE: { label: '$$', color: '#3b82f6' },
  PREMIUM: { label: '$$$', color: '#8b5cf6' },
  LUXURY: { label: '$$$$', color: '#ec4899' },
};

/**
 * SkincareProductCard Component
 */
export default function SkincareProductCard({
  product,
  onViewDetails,
}: SkincareProductCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const priceTierInfo = PRICE_TIER_MAP[product.priceTier] || {
    label: product.priceTier,
    color: '#6b7280',
  };

  /**
   * Format relevance score as percentage
   */
  const formatScore = (score: number) => {
    return Math.round(score * 100);
  };

  return (
    <div
      className="skincare-card"
      onClick={() => setIsExpanded(!isExpanded)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setIsExpanded(!isExpanded)}
    >
      {/* GLANCE Level - Always visible */}
      <div className="card-header">
        {/* Category Badge */}
        <div className="category-badge">
          {product.category}
        </div>

        {/* Price Tier */}
        <div
          className="price-tier"
          style={{ backgroundColor: priceTierInfo.color }}
        >
          {priceTierInfo.label}
        </div>
      </div>

      {/* Product Image Placeholder */}
      <div className="product-image">
        <div className="image-placeholder">
          <span className="brand-initial">{product.brand.charAt(0)}</span>
        </div>

        {/* Relevance Score */}
        {product.score > 0 && (
          <div className="relevance-score">
            {formatScore(product.score)}% match
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="product-info">
        {/* Brand */}
        <span className="brand">{product.brand}</span>

        {/* Product Name */}
        <h3 className="product-name">{product.productName}</h3>

        {/* Subcategory */}
        <span className="subcategory">{product.subcategory}</span>

        {/* Key Benefits - First 2 */}
        <div className="key-benefits">
          {product.keyBenefits.slice(0, 2).map((benefit, idx) => (
            <span key={idx} className="benefit-tag">
              {benefit}
            </span>
          ))}
        </div>

        {/* Skin Types */}
        <div className="skin-types">
          <span className="label">For:</span>
          <span className="types">
            {product.skinTypes.slice(0, 3).join(', ')}
            {product.skinTypes.length > 3 && '...'}
          </span>
        </div>

        {/* Certifications */}
        <div className="certifications">
          {product.fragranceFree && (
            <span className="cert fragrance-free" title="Fragrance-Free">FF</span>
          )}
          {product.vegan && (
            <span className="cert vegan" title="Vegan">V</span>
          )}
          {product.crueltyFree && (
            <span className="cert cruelty-free" title="Cruelty-Free">CF</span>
          )}
        </div>
      </div>

      {/* SCAN Level - Expanded details */}
      {isExpanded && (
        <div className="expanded-details">
          <div className="divider" />

          {/* Concerns */}
          <div className="detail-section">
            <h4>Targets</h4>
            <div className="tags">
              {product.concerns.map((concern, idx) => (
                <span key={idx} className="concern-tag">
                  {concern}
                </span>
              ))}
            </div>
          </div>

          {/* Active Ingredients */}
          <div className="detail-section">
            <h4>Key Ingredients</h4>
            <div className="tags">
              {product.ingredients.map((ingredient, idx) => (
                <span key={idx} className="ingredient-tag">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="detail-section">
            <h4>Benefits</h4>
            <div className="tags">
              {product.benefits.map((benefit, idx) => (
                <span key={idx} className="benefit-pill">
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="product-details">
            <div className="detail-row">
              <span className="label">Texture:</span>
              <span className="value">{product.texture}</span>
            </div>
            <div className="detail-row">
              <span className="label">Routine Step:</span>
              <span className="value">{product.routineStep}</span>
            </div>
            <div className="detail-row">
              <span className="label">Size:</span>
              <span className="value">{product.volume}</span>
            </div>
          </div>

          {/* View Details Button */}
          {onViewDetails && (
            <button
              className="view-details-btn"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
            >
              View Full Details
            </button>
          )}
        </div>
      )}

      {/* Expand Indicator */}
      <div className="expand-indicator">
        <span className={`chevron ${isExpanded ? 'up' : 'down'}`}>
          {isExpanded ? '▲' : '▼'}
        </span>
        <span className="hint">
          {isExpanded ? 'Less' : 'More details'}
        </span>
      </div>

      <style jsx>{`
        .skincare-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          overflow: hidden;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .skincare-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: #f9fafb;
        }

        .category-badge {
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
          background: white;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          border: 1px solid #e5e7eb;
        }

        .price-tier {
          font-size: 0.75rem;
          font-weight: 700;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }

        .product-image {
          position: relative;
          width: 100%;
          padding-bottom: 60%;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          overflow: hidden;
        }

        .image-placeholder {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .brand-initial {
          font-size: 2rem;
          font-weight: 700;
          color: #9ca3af;
        }

        .relevance-score {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: rgba(16, 185, 129, 0.9);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .product-info {
          padding: 1rem;
        }

        .brand {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .product-name {
          margin: 0.25rem 0 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: #111827;
          line-height: 1.3;
        }

        .subcategory {
          display: inline-block;
          font-size: 0.75rem;
          color: #3b82f6;
          background: #eff6ff;
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
          margin-bottom: 0.75rem;
        }

        .key-benefits {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
          margin-bottom: 0.75rem;
        }

        .benefit-tag {
          font-size: 0.75rem;
          color: #059669;
          background: #ecfdf5;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }

        .skin-types {
          display: flex;
          gap: 0.5rem;
          font-size: 0.8125rem;
          margin-bottom: 0.5rem;
        }

        .skin-types .label {
          color: #6b7280;
          font-weight: 500;
        }

        .skin-types .types {
          color: #374151;
        }

        .certifications {
          display: flex;
          gap: 0.375rem;
        }

        .cert {
          font-size: 0.625rem;
          font-weight: 700;
          padding: 0.25rem 0.375rem;
          border-radius: 0.25rem;
        }

        .fragrance-free {
          background: #fef3c7;
          color: #92400e;
        }

        .vegan {
          background: #d1fae5;
          color: #065f46;
        }

        .cruelty-free {
          background: #fce7f3;
          color: #9d174d;
        }

        /* Expanded Details */
        .expanded-details {
          padding: 0 1rem 1rem;
        }

        .divider {
          height: 1px;
          background: #e5e7eb;
          margin-bottom: 1rem;
        }

        .detail-section {
          margin-bottom: 1rem;
        }

        .detail-section h4 {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 0.5rem;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }

        .concern-tag {
          font-size: 0.75rem;
          color: #9333ea;
          background: #f3e8ff;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }

        .ingredient-tag {
          font-size: 0.75rem;
          color: #0369a1;
          background: #e0f2fe;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }

        .benefit-pill {
          font-size: 0.75rem;
          color: #374151;
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }

        .product-details {
          background: #f9fafb;
          padding: 0.75rem;
          border-radius: 0.375rem;
          margin-bottom: 1rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8125rem;
          padding: 0.25rem 0;
        }

        .detail-row .label {
          color: #6b7280;
        }

        .detail-row .value {
          font-weight: 500;
          color: #374151;
        }

        .view-details-btn {
          width: 100%;
          padding: 0.75rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.375rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .view-details-btn:hover {
          background: #2563eb;
        }

        /* Expand Indicator */
        .expand-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }

        .chevron {
          font-size: 0.625rem;
          color: #6b7280;
        }

        .hint {
          font-size: 0.75rem;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}
