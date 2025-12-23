/**
 * ProductGrid Component
 *
 * Feature: 008-homepage-integration
 * Updated: Day 7 - Progressive Disclosure Integration
 *
 * Responsive product grid with optional Progressive Disclosure support
 * - Standard mode: Simple product cards with basic info
 * - Progressive mode: Hover-based progressive disclosure (glance → scan → study)
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { ProgressiveContent } from '../products/progressive/ProgressiveContent';
import { adaptJADEProduct } from '../../utils/productDataAdapter';
import type { JADEProduct } from '../../types/homepage';
import type {
  ProductGlanceData,
  ProductScanData,
} from '../products/progressive/types';

/**
 * Product interface for the grid (legacy)
 */
export interface GridProduct {
  id: string;
  name: string;
  slug?: string;
  image: string;
  price: number;
  currencyCode?: string;
  rating?: number;
  reviewCount?: number;
  heroBenefit?: string;
}

/**
 * Props for ProductGrid component
 */
export interface ProductGridProps {
  products: (GridProduct | JADEProduct)[];
  columns?: 2 | 3 | 4;
  loading?: boolean;
  error?: Error | null;
  useProgressiveDisclosure?: boolean;
}

/**
 * Loading skeleton for product card
 */
const ProductSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg overflow-hidden border border-border animate-pulse">
    <div className="aspect-square bg-muted" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-1/2" />
    </div>
  </div>
);

/**
 * Type guard to check if product is JADEProduct
 */
const isJADEProduct = (product: GridProduct | JADEProduct): product is JADEProduct => {
  return 'vendureProductId' in product && 'glance' in product && 'scan' in product;
};

/**
 * Progressive Disclosure Product Card Renderers
 */
const ProgressiveGlanceRenderer: React.FC<{ data: ProductGlanceData }> = ({ data }) => (
  <div className="p-0">
    {/* Product Image */}
    <div className="aspect-square bg-muted overflow-hidden">
      <img
        src={data.image || 'https://via.placeholder.com/300'}
        alt={data.name}
        className="w-full h-full object-cover transition-transform duration-300"
        loading="lazy"
      />
    </div>

    {/* Product Info */}
    <div className="p-4 space-y-2">
      <h3 className="font-semibold text-foreground line-clamp-2">
        {data.name}
      </h3>

      {data.heroBenefit && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {data.heroBenefit}
        </p>
      )}

      {data.rating > 0 && (
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-medium text-foreground">{data.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">({data.reviewCount})</span>
        </div>
      )}

      <div className="pt-2">
        <span className="text-lg font-bold text-foreground">
          ${data.price.toFixed(2)}
        </span>
      </div>
    </div>
  </div>
);

const ProgressiveScanRenderer: React.FC<{ data: ProductScanData }> = ({ data }) => (
  <div className="p-0 bg-gradient-to-b from-white to-blue-50">
    {/* Product Image with brand overlay */}
    <div className="aspect-square bg-muted overflow-hidden relative">
      <img
        src={data.image || 'https://via.placeholder.com/300'}
        alt={data.name}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {data.brand && (
        <div className="absolute top-2 right-2 bg-white/90 rounded-lg px-2 py-1 text-xs font-medium">
          {data.brand.name}
        </div>
      )}
    </div>

    {/* Enhanced Product Info */}
    <div className="p-4 space-y-3">
      <h3 className="font-semibold text-foreground text-lg">
        {data.name}
      </h3>

      {data.heroBenefit && (
        <p className="text-sm text-muted-foreground font-medium">
          {data.heroBenefit}
        </p>
      )}

      {/* Key Ingredients */}
      {data.keyIngredients && data.keyIngredients.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Key Ingredients
          </p>
          <div className="flex flex-wrap gap-1">
            {data.keyIngredients.slice(0, 3).map((ing, idx) => (
              <span
                key={idx}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
              >
                {ing.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Benefits */}
      {data.benefits && data.benefits.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
            Benefits
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            {data.benefits.slice(0, 2).map((benefit, idx) => (
              <li key={idx} className="flex items-start">
                <span className="mr-1">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.certifications.map((cert, idx) => (
            <span
              key={idx}
              className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
            >
              {cert.name}
            </span>
          ))}
        </div>
      )}

      {data.rating > 0 && (
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="font-medium text-foreground">{data.rating.toFixed(1)}</span>
          <span className="text-muted-foreground">({data.reviewCount})</span>
        </div>
      )}

      <div className="pt-2 flex items-center justify-between">
        <span className="text-xl font-bold text-foreground">
          ${data.price.toFixed(2)}
        </span>
        <span className="text-xs text-blue-600 font-medium">
          Click for full details →
        </span>
      </div>
    </div>
  </div>
);

/**
 * ProductGrid displays products in a responsive grid layout
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  columns = 4,
  loading = false,
  error = null,
  useProgressiveDisclosure = false,
}) => {
  const navigate = useNavigate();

  /**
   * Get grid column classes based on column count
   */
  const getGridClasses = () => {
    const baseClasses = 'grid gap-6';
    switch (columns) {
      case 2:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2`;
      case 3:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`;
      case 4:
      default:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
    }
  };

  /**
   * Format price with currency
   */
  const formatPrice = (price: number, currencyCode: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price);
  };

  /**
   * Render star rating
   */
  const renderRating = (rating: number, reviewCount: number) => (
    <div className="flex items-center gap-1 text-sm">
      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
      <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
      <span className="text-muted-foreground">({reviewCount})</span>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className={getGridClasses()}>
        {Array.from({ length: columns * 2 }).map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-lg p-6 text-center">
        <p className="text-error font-medium mb-2">Failed to load products</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  // Empty state
  if (!products || products.length === 0) {
    return (
      <div className="bg-muted/50 rounded-lg p-12 text-center">
        <p className="text-muted-foreground">No products available</p>
      </div>
    );
  }

  // Render product grid
  return (
    <div className={getGridClasses()}>
      {products.map((product) => {
        // Progressive Disclosure Mode (for JADE Products)
        if (useProgressiveDisclosure && isJADEProduct(product)) {
          const { glance, scan } = adaptJADEProduct(product);

          return (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden border border-border hover:shadow-xl transition-shadow duration-300"
            >
              <ProgressiveContent
                data={glance}
                glanceRenderer={(data) => <ProgressiveGlanceRenderer data={data} />}
                scanRenderer={() => <ProgressiveScanRenderer data={scan} />}
                studyRenderer={() => <ProgressiveGlanceRenderer data={glance} />}
                onLevelChange={(level) => {
                  if (level === 'study') {
                    navigate(`/marketplace/products/${product.id}`);
                  }
                }}
                transitionDuration={300}
              />
            </div>
          );
        }

        // Standard Mode (for GridProduct or fallback)
        const gridProduct = product as GridProduct;
        const productUrl = `/marketplace/products/${gridProduct.slug || gridProduct.id}`;

        return (
          <Link
            key={gridProduct.id}
            to={productUrl}
            className="group bg-white rounded-lg overflow-hidden border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {/* Product Image */}
            <div className="aspect-square bg-muted overflow-hidden">
              <img
                src={gridProduct.image}
                alt={gridProduct.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {gridProduct.name}
              </h3>

              {gridProduct.heroBenefit && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {gridProduct.heroBenefit}
                </p>
              )}

              {gridProduct.rating && gridProduct.reviewCount !== undefined && (
                <div>{renderRating(gridProduct.rating, gridProduct.reviewCount)}</div>
              )}

              <div className="pt-2">
                <span className="text-lg font-bold text-foreground">
                  {formatPrice(gridProduct.price, gridProduct.currencyCode)}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;
