/**
 * ProductDetail Page Component
 *
 * Task: T078 - Create ProductDetail page
 *
 * Features:
 * - Progressive disclosure (glance → scan → study)
 * - Full product information
 * - Pricing tier calculator
 * - Add to cart with quantity selector
 * - Clinical data display
 * - Reviews and ratings
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProgressiveContent } from '../../components/progressive/ProgressiveContent';
import type { ProgressiveLevel } from '../../types/progressive';

/**
 * Product detail data
 */
interface ProductDetail {
  product: {
    id: string;
    name: string;
    description: string;
    featuredAsset?: { preview: string };
  };
  glance: {
    heroBenefit: string;
    rating: number | null;
    reviewCount: number;
    skinTypes: string[];
  };
  scan?: {
    keyIngredients: Array<{ name: string; percentage?: number; purpose?: string }>;
    benefits: string[];
    howToUse: string;
    texture: string;
    concerns: string[];
  };
  study?: {
    fullIngredientList: string;
    clinicalData: Array<{
      description: string;
      participants?: number;
      duration?: string;
      results: string;
    }>;
    certifications: string[];
    safetyInfo?: string;
    contraindications: string[];
    storageInstructions?: string;
  };
  pricingTiers: Array<{
    minQuantity: number;
    unitPrice: number;
    discountPercentage: number;
  }>;
  inventoryLevel: number;
  vendorId: string;
}

/**
 * ProductDetail Page
 *
 * Shows full product information with progressive disclosure
 */
export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentLevel, setCurrentLevel] = useState<ProgressiveLevel>('glance');

  /**
   * Load product from GraphQL API
   */
  const loadProduct = async () => {
    setLoading(true);

    try {
      // TODO: Replace with actual GraphQL query
      // const { data } = await apolloClient.query({
      //   query: GET_PRODUCT,
      //   variables: { id: productId, includeStudy: true }
      // });

      // Mock data with full progressive disclosure
      const mockProduct: ProductDetail = {
        product: {
          id: productId!,
          name: 'Advanced Vitamin C Serum',
          description: 'Professional-grade vitamin C serum with 20% L-Ascorbic Acid',
          featuredAsset: { preview: '/placeholder-product.jpg' },
        },
        glance: {
          heroBenefit: 'Reduces fine lines and brightens skin in 4 weeks',
          rating: 4.7,
          reviewCount: 342,
          skinTypes: ['dry', 'normal', 'combination'],
        },
        scan: {
          keyIngredients: [
            { name: 'L-Ascorbic Acid', percentage: 20, purpose: 'Antioxidant, brightening' },
            { name: 'Hyaluronic Acid', percentage: 2, purpose: 'Hydration' },
            { name: 'Vitamin E', percentage: 1, purpose: 'Antioxidant protection' },
            { name: 'Ferulic Acid', percentage: 0.5, purpose: 'Stabilizer, antioxidant' },
          ],
          benefits: [
            'Reduces appearance of fine lines and wrinkles',
            'Brightens and evens skin tone',
            'Boosts collagen production',
            'Protects against environmental damage',
            'Improves skin texture and radiance',
          ],
          howToUse: 'Apply 4-5 drops to clean, dry skin in the morning. Follow with moisturizer and SPF. Allow 2-3 minutes for absorption.',
          texture: 'Lightweight, fast-absorbing serum',
          concerns: ['Fine lines', 'Hyperpigmentation', 'Dullness', 'Uneven tone'],
        },
        study: {
          fullIngredientList: 'Aqua, L-Ascorbic Acid, Ethoxydiglycol, Glycerin, Propylene Glycol, Sodium Hyaluronate, Tocopherol, Ferulic Acid, Panthenol, Sodium Hydroxide',
          clinicalData: [
            {
              description: 'Improvement in fine lines and wrinkles',
              participants: 120,
              duration: '8 weeks',
              results: '78% of participants saw visible reduction in fine lines after 4 weeks. 92% saw improvement after 8 weeks.',
            },
            {
              description: 'Skin brightness and tone evenness',
              participants: 150,
              duration: '12 weeks',
              results: '85% reported brighter, more even skin tone within 6 weeks.',
            },
          ],
          certifications: ['Cruelty-free', 'Paraben-free', 'Dermatologist tested'],
          safetyInfo: 'Patch test recommended. May cause slight tingling upon first use. Discontinue if irritation occurs.',
          contraindications: [
            'Not suitable for sensitive or reactive skin',
            'Avoid if allergic to vitamin C derivatives',
            'Do not use with retinol in the same routine',
          ],
          storageInstructions: 'Store in a cool, dark place. Refrigeration recommended to maintain potency.',
        },
        pricingTiers: [
          { minQuantity: 1, unitPrice: 8500, discountPercentage: 0 },
          { minQuantity: 6, unitPrice: 7650, discountPercentage: 10 },
          { minQuantity: 12, unitPrice: 6800, discountPercentage: 20 },
        ],
        inventoryLevel: 45,
        vendorId: 'vendor-1',
      };

      setProduct(mockProduct);
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Product Not Found</h2>
        <button onClick={() => navigate('/marketplace')}>Back to Catalog</button>
      </div>
    );
  }

  const getApplicableTier = (qty: number) => {
    const sorted = [...product.pricingTiers].sort((a, b) => b.minQuantity - a.minQuantity);
    for (const tier of sorted) {
      if (qty >= tier.minQuantity) return tier;
    }
    return product.pricingTiers[0];
  };

  const tier = getApplicableTier(quantity);
  const unitPrice = tier.unitPrice / 100;
  const totalPrice = unitPrice * quantity;
  const savings = tier.discountPercentage > 0
    ? ((product.pricingTiers[0].unitPrice - tier.unitPrice) / 100) * quantity
    : 0;

  return (
    <div className="product-detail">
      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <button onClick={() => navigate('/marketplace')}>Products</button>
        <span>/</span>
        <span>{product.product.name}</span>
      </div>

      {/* Main Product Section */}
      <div className="product-main">
        {/* Image Gallery */}
        <div className="product-gallery">
          <img
            src={product.product.featuredAsset?.preview || '/placeholder-product.jpg'}
            alt={product.product.name}
          />
        </div>

        {/* Product Info - Glance Level (Always Visible) */}
        <div className="product-summary">
          <h1>{product.product.name}</h1>
          <p className="description">{product.product.description}</p>

          {/* Hero Benefit */}
          <div className="hero-benefit">
            <strong>Key Benefit:</strong> {product.glance.heroBenefit}
          </div>

          {/* Rating */}
          <div className="rating">
            <div className="stars">
              {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={i < Math.round(product.glance.rating || 0) ? 'filled' : ''}>★</span>
              ))}
            </div>
            <span>{product.glance.rating?.toFixed(1)} ({product.glance.reviewCount} reviews)</span>
          </div>

          {/* Skin Types */}
          <div className="skin-types">
            <strong>Suitable for:</strong> {product.glance.skinTypes.join(', ')}
          </div>

          {/* Pricing Calculator */}
          <div className="pricing-section">
            <h3>Wholesale Pricing</h3>
            <div className="tier-calculator">
              {product.pricingTiers.map((t, i) => (
                <div key={i} className={`tier ${quantity >= t.minQuantity ? 'active' : ''}`}>
                  <span>{t.minQuantity}+ units</span>
                  <span className="price">${(t.unitPrice / 100).toFixed(2)}/unit</span>
                  {t.discountPercentage > 0 && (
                    <span className="discount">-{t.discountPercentage}%</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="add-to-cart">
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className="price-summary">
              <div className="price-row">
                <span>Unit Price:</span>
                <span className="price">${unitPrice.toFixed(2)}</span>
              </div>
              {savings > 0 && (
                <div className="price-row savings">
                  <span>You Save:</span>
                  <span className="price">${savings.toFixed(2)}</span>
                </div>
              )}
              <div className="price-row total">
                <span>Total:</span>
                <span className="price">${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button className="add-to-cart-button">Add to Cart</button>
            <p className="stock-info">{product.inventoryLevel} units in stock</p>
          </div>
        </div>
      </div>

      {/* Progressive Disclosure - Glance → Scan → Study */}
      <div className="progressive-disclosure-section">
        <ProgressiveContent
          data={product.glance}
          glanceRenderer={(glanceData) => (
            <div className="glance-view">
              <div className="section-header">
                <h2>Quick Overview</h2>
                <p className="level-indicator">Glance Level - Click for more details</p>
              </div>
              <div className="glance-content">
                <div className="hero-benefit-card">
                  <h3>Key Benefit</h3>
                  <p>{glanceData.heroBenefit}</p>
                </div>
                <div className="quick-info">
                  <div className="info-item">
                    <strong>Suitable for:</strong>
                    <span>{glanceData.skinTypes.join(', ')}</span>
                  </div>
                  <div className="info-item">
                    <strong>Rating:</strong>
                    <span>{glanceData.rating?.toFixed(1)} / 5.0 ({glanceData.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          scanRenderer={(scanData) => product.scan && (
            <div className="scan-view">
              <div className="section-header">
                <h2>Detailed Information</h2>
                <p className="level-indicator">Scan Level - Click for clinical data & full ingredients</p>
              </div>

              <section>
                <h3>Key Ingredients</h3>
                <div className="ingredients-grid">
                  {product.scan.keyIngredients.map((ing, i) => (
                    <div key={i} className="ingredient">
                      <strong>{ing.name}</strong>
                      {ing.percentage && <span className="percentage">{ing.percentage}%</span>}
                      <p>{ing.purpose}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3>Benefits</h3>
                <ul className="benefits-list">
                  {product.scan.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h3>How to Use</h3>
                <p>{product.scan.howToUse}</p>
              </section>

              <section>
                <h3>Texture</h3>
                <p>{product.scan.texture}</p>
              </section>

              <section>
                <h3>Targets</h3>
                <div className="concerns-tags">
                  {product.scan.concerns.map((concern, i) => (
                    <span key={i} className="tag">{concern}</span>
                  ))}
                </div>
              </section>
            </div>
          )}
          studyRenderer={(studyData) => product.study && (
            <div className="study-view">
              <div className="section-header">
                <h2>In-Depth Research & Analysis</h2>
                <p className="level-indicator">Study Level - Complete scientific information</p>
              </div>

              <section>
                <h3>Clinical Studies</h3>
                {product.study.clinicalData.map((study, i) => (
                  <div key={i} className="clinical-study">
                    <h4>{study.description}</h4>
                    <div className="study-meta">
                      {study.participants && <span>{study.participants} participants</span>}
                      {study.duration && <span>{study.duration}</span>}
                    </div>
                    <p className="results">{study.results}</p>
                  </div>
                ))}
              </section>

              <section>
                <h3>Complete Ingredient List (INCI)</h3>
                <p className="inci-list">{product.study.fullIngredientList}</p>
              </section>

              <section>
                <h3>Certifications</h3>
                <div className="certifications">
                  {product.study.certifications.map((cert, i) => (
                    <span key={i} className="cert-badge">{cert}</span>
                  ))}
                </div>
              </section>

              {product.study.safetyInfo && (
                <section>
                  <h3>Safety Information</h3>
                  <p>{product.study.safetyInfo}</p>
                </section>
              )}

              {product.study.contraindications.length > 0 && (
                <section>
                  <h3>Contraindications</h3>
                  <ul>
                    {product.study.contraindications.map((contra, i) => (
                      <li key={i}>{contra}</li>
                    ))}
                  </ul>
                </section>
              )}

              {product.study.storageInstructions && (
                <section>
                  <h3>Storage</h3>
                  <p>{product.study.storageInstructions}</p>
                </section>
              )}
            </div>
          )}
          onLevelChange={(level) => {
            setCurrentLevel(level);
            console.log('Product detail level changed to:', level);
          }}
        />
      </div>

      <style jsx>{`
        .product-detail {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          font-size: 0.875rem;
        }

        .breadcrumbs button {
          background: none;
          border: none;
          color: #3b82f6;
          cursor: pointer;
          padding: 0;
        }

        .product-main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .product-gallery img {
          width: 100%;
          border-radius: 0.5rem;
        }

        .product-summary h1 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .description {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        .hero-benefit {
          background: #eff6ff;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .stars {
          display: flex;
          gap: 0.125rem;
        }

        .stars span {
          color: #d1d5db;
          font-size: 1.25rem;
        }

        .stars span.filled {
          color: #fbbf24;
        }

        .skin-types {
          margin-bottom: 2rem;
        }

        .pricing-section {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
        }

        .tier-calculator {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .tier {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          background: white;
          border: 2px solid transparent;
          border-radius: 0.375rem;
        }

        .tier.active {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .tier .discount {
          color: #10b981;
          font-weight: 600;
        }

        .add-to-cart {
          border-top: 1px solid #e5e7eb;
          padding-top: 2rem;
        }

        .quantity-selector {
          margin-bottom: 1rem;
        }

        .quantity-selector .controls {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .quantity-selector button {
          width: 2.5rem;
          height: 2.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          background: white;
          cursor: pointer;
        }

        .quantity-selector input {
          width: 5rem;
          text-align: center;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          padding: 0.5rem;
        }

        .price-summary {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
        }

        .price-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .price-row.savings {
          color: #10b981;
        }

        .price-row.total {
          font-size: 1.25rem;
          font-weight: 700;
          padding-top: 0.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .add-to-cart-button {
          width: 100%;
          padding: 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
        }

        .stock-info {
          text-align: center;
          color: #6b7280;
          margin-top: 0.5rem;
        }

        .progressive-disclosure-section {
          border-top: 1px solid #e5e7eb;
          padding-top: 2rem;
          margin-top: 2rem;
        }

        .section-header {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .section-header h2 {
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .level-indicator {
          color: #6b7280;
          font-size: 0.875rem;
          font-style: italic;
        }

        .glance-view,
        .scan-view,
        .study-view {
          padding: 1.5rem;
          background: #ffffff;
          border-radius: 0.5rem;
        }

        .glance-view {
          background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
        }

        .scan-view {
          background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
        }

        .study-view {
          background: linear-gradient(135deg, #fef3c7 0%, #ffffff 100%);
        }

        .glance-view section,
        .scan-view section,
        .study-view section {
          margin-bottom: 2rem;
        }

        .hero-benefit-card {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
        }

        .hero-benefit-card h3 {
          font-size: 0.875rem;
          text-transform: uppercase;
          color: #3b82f6;
          margin-bottom: 0.5rem;
        }

        .hero-benefit-card p {
          font-size: 1.125rem;
          line-height: 1.6;
          color: #111827;
        }

        .quick-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          background: white;
          border-radius: 0.375rem;
        }

        .info-item strong {
          color: #374151;
        }

        .info-item span {
          color: #111827;
        }

        .ingredients-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }

        .ingredient {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .percentage {
          color: #3b82f6;
          font-weight: 600;
          margin-left: 0.5rem;
        }

        .benefits-list {
          list-style: none;
          padding: 0;
        }

        .benefits-list li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .benefits-list li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: 700;
        }

        .concerns-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          background: #eff6ff;
          color: #3b82f6;
          padding: 0.5rem 1rem;
          border-radius: 1rem;
          font-size: 0.875rem;
        }

        .clinical-study {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .study-meta {
          display: flex;
          gap: 1rem;
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0.5rem 0;
        }

        .results {
          margin-top: 1rem;
          line-height: 1.6;
        }

        .certifications {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .cert-badge {
          background: #10b981;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          font-weight: 500;
        }

        .inci-list {
          line-height: 1.8;
          color: #374151;
        }

        @media (max-width: 768px) {
          .product-main {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
