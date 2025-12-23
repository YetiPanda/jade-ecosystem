/**
 * Search Results Component
 *
 * Displays search results in a responsive grid layout per FR-045
 * Uses consistent product card styling per FR-047
 *
 * Features:
 * - Responsive grid (1 col mobile, 2 col tablet, 3 col desktop) - FR-045
 * - Product cards with complete glance-level data - FR-046
 * - Result count display - FR-048
 * - Navigation to product detail - FR-046
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

// Product type from GraphQL generated types (readonly for GraphQL compatibility)
interface Product {
  readonly id: string;
  readonly vendureProductId: string;
  readonly glance?: {
    readonly heroBenefit?: string | null;
    readonly skinTypes?: readonly string[] | null;
    readonly rating?: number | null;
    readonly reviewCount?: number | null;
    readonly price?: {
      readonly amount: number;
      readonly currency: string;
    } | null;
    readonly thumbnail?: string | null;
  } | null;
  readonly tensorGenerated: boolean;
  readonly embeddingGenerated: boolean;
  readonly createdAt: string;
}

export interface SearchResultsProps {
  products: readonly Product[];
  loading?: boolean;
  resultCount?: number;
}

/**
 * ProductCard Component
 * Consistent styling with ProductListPage per FR-047
 * Displays glance-level information per FR-046
 */
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { glance } = product;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 flex flex-col h-full">
      {/* Thumbnail - FR-046 */}
      {glance?.thumbnail && (
        <div className="w-full h-48 bg-gray-100 overflow-hidden rounded-t-lg">
          <img
            src={glance.thumbnail}
            alt={glance.heroBenefit || 'Product'}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardHeader className="flex-grow">
        {/* Hero Benefit / Product Name - FR-046 */}
        <CardTitle className="text-lg line-clamp-2">
          {glance?.heroBenefit || `Product ${product.id.substring(0, 8)}`}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Price - FR-046 */}
        {glance?.price && (
          <div className="text-2xl font-bold text-primary-600">
            {glance.price.currency === 'USD' ? '$' : glance.price.currency}
            {(glance.price.amount / 100).toFixed(2)}
          </div>
        )}

        {/* Star Rating & Review Count - FR-046 */}
        {glance?.rating !== null && glance?.rating !== undefined && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, idx) => (
                <Star
                  key={idx}
                  className={`h-4 w-4 ${
                    idx < Math.floor(glance.rating!)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {glance.rating.toFixed(1)}
            </span>
            {glance?.reviewCount !== null && glance?.reviewCount !== undefined && (
              <span className="text-sm text-gray-500">
                ({glance.reviewCount} reviews)
              </span>
            )}
          </div>
        )}

        {/* Skin Type Badges - FR-046 */}
        {glance?.skinTypes && glance.skinTypes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {glance.skinTypes.map((skinType) => (
              <span
                key={skinType}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {skinType}
              </span>
            ))}
          </div>
        )}

        {/* Vector Status Badges (for debugging) */}
        <div className="flex items-center gap-2">
          {product.tensorGenerated ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Visual ✓
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              No Visual
            </span>
          )}

          {product.embeddingGenerated ? (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Text ✓
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              No Text
            </span>
          )}
        </div>

        {/* View Details Button - FR-046 */}
        <Link to={`/app/products/${product.id}`} className="block mt-4">
          <Button variant="primary" size="sm" className="w-full">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

/**
 * SearchResults Component
 * Renders grid of product cards per FR-045
 */
export const SearchResults: React.FC<SearchResultsProps> = ({
  products,
  resultCount,
}) => {
  return (
    <div>
      {/* Result Count - FR-048 */}
      {resultCount !== undefined && resultCount > 0 && (
        <div
          className="mb-4 text-sm text-gray-600"
          aria-live="polite" // FR-069
        >
          {resultCount} {resultCount === 1 ? 'product' : 'products'} found
        </div>
      )}

      {/* Responsive Grid - FR-045 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
