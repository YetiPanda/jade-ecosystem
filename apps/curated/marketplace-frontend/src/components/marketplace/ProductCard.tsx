/**
 * ProductCard Component
 *
 * Task: T077 - Create ProductCard component
 *
 * Features:
 * - Display glance-level product data
 * - Show pricing tiers
 * - Quick add to cart
 * - Hover for scan data (future enhancement)
 * - Link to product detail
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Product card props
 */
interface ProductCardProps {
  product: {
    product: {
      id: string;
      name: string;
      description: string;
      featuredAsset?: {
        preview: string;
      };
    };
    glance: {
      heroBenefit: string;
      rating: number | null;
      reviewCount: number;
      skinTypes: string[];
    };
    pricingTiers: Array<{
      minQuantity: number;
      unitPrice: number;
      discountPercentage: number;
    }>;
    inventoryLevel: number;
    vendorId: string;
  };
  onAddToCart: (productId: string, quantity: number) => void;
}

/**
 * ProductCard Component
 *
 * Displays a product in grid/list view with glance-level information
 */
export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const { product: baseProduct, glance, pricingTiers, inventoryLevel } = product;

  /**
   * Get applicable pricing tier based on quantity
   */
  const getApplicableTier = (qty: number) => {
    const sortedTiers = [...pricingTiers].sort((a, b) => b.minQuantity - a.minQuantity);
    for (const tier of sortedTiers) {
      if (qty >= tier.minQuantity) {
        return tier;
      }
    }
    return pricingTiers[0];
  };

  const applicableTier = getApplicableTier(quantity);
  const unitPrice = applicableTier.unitPrice / 100; // Convert cents to dollars
  const totalPrice = unitPrice * quantity;

  /**
   * Handle add to cart
   */
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to detail page
    e.stopPropagation();

    setIsAdding(true);
    try {
      await onAddToCart(baseProduct.id, quantity);
      // Reset quantity after successful add
      setQuantity(1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  /**
   * Format skin types for display
   */
  const formatSkinTypes = (types: string[]) => {
    return types.map(type => type.charAt(0).toUpperCase() + type.slice(1)).join(', ');
  };

  /**
   * Render star rating
   */
  const renderStars = (rating: number | null) => {
    if (!rating) return null;

    return (
      <div className="stars">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`star ${i < Math.round(rating) ? 'filled' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <Link to={`/marketplace/products/${baseProduct.id}`} className="product-card">
      {/* Product Image */}
      <div className="product-image">
        <img
          src={baseProduct.featuredAsset?.preview || '/placeholder-product.jpg'}
          alt={baseProduct.name}
        />

        {/* Discount Badge */}
        {applicableTier.discountPercentage > 0 && (
          <div className="discount-badge">
            {applicableTier.discountPercentage}% OFF
          </div>
        )}

        {/* Low Stock Badge */}
        {inventoryLevel > 0 && inventoryLevel <= 10 && (
          <div className="low-stock-badge">
            Only {inventoryLevel} left
          </div>
        )}

        {/* Out of Stock Badge */}
        {inventoryLevel === 0 && (
          <div className="out-of-stock-badge">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="product-info">
        {/* Name */}
        <h3 className="product-name">{baseProduct.name}</h3>

        {/* Hero Benefit */}
        <p className="hero-benefit">{glance.heroBenefit}</p>

        {/* Rating */}
        <div className="rating-section">
          {renderStars(glance.rating)}
          <span className="review-count">
            {glance.rating ? glance.rating.toFixed(1) : 'N/A'} ({glance.reviewCount})
          </span>
        </div>

        {/* Skin Types */}
        <div className="skin-types">
          <span className="label">For:</span>
          <span className="types">{formatSkinTypes(glance.skinTypes)}</span>
        </div>

        {/* Pricing Tiers */}
        <div className="pricing-tiers">
          <div className="tier-info">
            {pricingTiers.map((tier, index) => (
              <div key={index} className="tier">
                <span className="tier-qty">{tier.minQuantity}+ units:</span>
                <span className="tier-price">
                  ${(tier.unitPrice / 100).toFixed(2)}
                  {tier.discountPercentage > 0 && (
                    <span className="tier-discount">
                      {' '}(-{tier.discountPercentage}%)
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Add to Cart Section */}
        <div className="add-to-cart-section" onClick={(e) => e.preventDefault()}>
          <div className="quantity-price">
            <div className="quantity-selector">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setQuantity(Math.max(1, quantity - 1));
                }}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setQuantity(Math.max(1, Math.min(inventoryLevel, val)));
                }}
                min="1"
                max={inventoryLevel}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setQuantity(Math.min(inventoryLevel, quantity + 1));
                }}
                disabled={quantity >= inventoryLevel}
              >
                +
              </button>
            </div>

            <div className="total-price">
              <span className="price-label">Total:</span>
              <span className="price-value">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={inventoryLevel === 0 || isAdding}
            className="add-to-cart-button"
          >
            {isAdding ? 'Adding...' : inventoryLevel === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .product-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          overflow: hidden;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: inherit;
        }

        .product-card:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                      0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transform: translateY(-2px);
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
        }

        .discount-badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: #ef4444;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .low-stock-badge {
          position: absolute;
          bottom: 0.75rem;
          left: 0.75rem;
          background: #f59e0b;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
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
        }

        .product-info {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
        }

        .product-name {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0;
          line-height: 1.4;
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

        .skin-types {
          display: flex;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .skin-types .label {
          color: #6b7280;
          font-weight: 500;
        }

        .skin-types .types {
          color: #374151;
        }

        .pricing-tiers {
          background: #f9fafb;
          padding: 0.75rem;
          border-radius: 0.375rem;
        }

        .tier-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .tier {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
        }

        .tier-qty {
          color: #6b7280;
        }

        .tier-price {
          font-weight: 600;
          color: #374151;
        }

        .tier-discount {
          color: #10b981;
          font-size: 0.75rem;
        }

        .add-to-cart-section {
          margin-top: auto;
          padding-top: 0.75rem;
          border-top: 1px solid #e5e7eb;
        }

        .quantity-price {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .quantity-selector {
          display: flex;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          overflow: hidden;
        }

        .quantity-selector button {
          width: 2rem;
          height: 2rem;
          border: none;
          background: white;
          cursor: pointer;
          font-size: 1.125rem;
          transition: background 0.2s;
        }

        .quantity-selector button:hover:not(:disabled) {
          background: #f9fafb;
        }

        .quantity-selector button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-selector input {
          width: 3rem;
          text-align: center;
          border: none;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          font-weight: 500;
        }

        .total-price {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .price-label {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .price-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #374151;
        }

        .add-to-cart-button {
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

        .add-to-cart-button:hover:not(:disabled) {
          background: #2563eb;
        }

        .add-to-cart-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
    </Link>
  );
}
