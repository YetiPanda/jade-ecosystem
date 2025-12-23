/**
 * Similar Products Component
 *
 * Displays similar products based on vector similarity per FR-049
 * Shows on ProductDetailPage below progressive disclosure tabs
 *
 * Features:
 * - Exactly 6 similar products - FR-050
 * - Responsive grid (2 mobile, 3 tablet, 6 desktop) - FR-050
 * - Horizontal scroll on mobile with scroll-snap - FR-074
 * - Compact card format - FR-052
 * - Empty state for products without vectors - FR-051
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Package } from 'lucide-react';
import { useSearchProductsQuery } from '../../graphql/generated';
import { Card, CardContent } from '../ui/Card';

// Compact product type for similar products
interface SimilarProduct {
  id: string;
  vendureProductId: string;
  glance?: {
    heroBenefit?: string | null;
    price?: {
      amount: number;
      currency: string;
    } | null;
    rating?: number | null;
    thumbnail?: string | null;
  } | null;
}

export interface SimilarProductsProps {
  currentProductId: string;
  currentProductTensor?: number[] | null;
  currentProductEmbedding?: number[] | null;
  tensorGenerated: boolean;
  embeddingGenerated: boolean;
  limit?: number; // Default 6 per FR-050
}

/**
 * Compact Product Card for Similar Products
 * Smaller format per FR-052: thumbnail, name, price, rating
 */
const CompactProductCard: React.FC<{ product: SimilarProduct }> = ({
  product,
}) => {
  const { glance } = product;

  return (
    <Link to={`/app/products/${product.id}`} className="block group">
      <Card className="hover:shadow-md transition-all duration-200 h-full group-hover:scale-105">
        {/* Thumbnail - FR-052 */}
        {glance?.thumbnail && (
          <div className="w-full h-32 bg-gray-100 overflow-hidden rounded-t-lg">
            <img
              src={glance.thumbnail}
              alt={glance.heroBenefit || 'Product'}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <CardContent className="p-3 space-y-2">
          {/* Product Name - FR-052 */}
          <h4 className="text-sm font-medium line-clamp-2 text-gray-900 group-hover:text-primary-600 transition-colors">
            {glance?.heroBenefit || `Product ${product.id.substring(0, 8)}`}
          </h4>

          {/* Price - FR-052 */}
          {glance?.price && (
            <div className="text-lg font-bold text-primary-600">
              {glance.price.currency === 'USD' ? '$' : glance.price.currency}
              {(glance.price.amount / 100).toFixed(2)}
            </div>
          )}

          {/* Rating - FR-052 */}
          {glance?.rating !== null && glance?.rating !== undefined && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600">
                {glance.rating.toFixed(1)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

/**
 * SimilarProducts Component
 * Uses vector search to find similar products
 */
export const SimilarProducts: React.FC<SimilarProductsProps> = ({
  currentProductId,
  currentProductTensor,
  currentProductEmbedding,
  tensorGenerated,
  embeddingGenerated,
  limit = 6,
}) => {
  // Check if product has vectors - FR-051
  const hasVectors = tensorGenerated && embeddingGenerated;

  // Query for similar products using current product's vectors
  const { data, loading, error } = useSearchProductsQuery({
    variables: {
      tensor: currentProductTensor || undefined,
      embedding: currentProductEmbedding || undefined,
      tensorWeight: 0.5, // Balanced search
      limit: limit + 1, // Get one extra to filter out current product
    },
    skip: !hasVectors || !currentProductTensor || !currentProductEmbedding,
  });

  // Filter out current product and limit to exact count (FR-050)
  const similarProducts = (data?.searchProducts || [])
    .filter((p) => p.id !== currentProductId)
    .slice(0, limit);

  // Empty state when product has no vectors - FR-051
  if (!hasVectors) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Similar Products You Might Like
        </h2>
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-sm">
              Similar products coming soon
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Similar Products You Might Like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, idx) => (
            <Card key={idx} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-3 space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return null; // Silent fail - don't block product detail page
  }

  // No results
  if (similarProducts.length === 0) {
    return null; // Hide section if no similar products found
  }

  return (
    <div className="mt-12">
      {/* Heading - FR-051 */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Similar Products You Might Like
      </h2>

      {/* Desktop & Tablet Grid - FR-050 */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4">
        {similarProducts.map((product) => (
          <CompactProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mobile Horizontal Scroll - FR-074 */}
      <div className="md:hidden overflow-x-auto scrollbar-hide">
        <div
          className="flex gap-4 pb-4"
          style={{
            scrollSnapType: 'x mandatory', // FR-074: scroll-snap
          }}
        >
          {similarProducts.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-40"
              style={{
                scrollSnapAlign: 'start', // FR-074: scroll-snap
              }}
            >
              <CompactProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Add to hide scrollbar on mobile */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default SimilarProducts;
