/**
 * Search Skeleton Component
 *
 * Loading skeleton that matches final product card dimensions per FR-055
 * Prevents layout shift during loading per FR-055
 *
 * Features:
 * - Matches final product card dimensions - FR-055
 * - 6-12 skeleton cards displayed - FR-056, FR-057
 * - No layout shift on load completion - FR-055
 */

import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/Card';

/**
 * ProductCardSkeleton
 * Matches ProductCard dimensions from SearchResults component
 */
const ProductCardSkeleton: React.FC = () => {
  return (
    <Card className="flex flex-col h-full animate-pulse">
      {/* Thumbnail skeleton - matches 48px (h-48) from ProductCard */}
      <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>

      <CardHeader>
        {/* Title skeleton - 2 lines */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Price skeleton */}
        <div className="h-8 bg-gray-200 rounded w-24"></div>

        {/* Rating skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>

        {/* Skin type badges skeleton */}
        <div className="flex gap-1">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>

        {/* Vector status badges skeleton */}
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>

        {/* Button skeleton */}
        <div className="h-9 bg-gray-200 rounded w-full mt-4"></div>
      </CardContent>
    </Card>
  );
};

export interface SearchSkeletonProps {
  count?: number; // Number of skeleton cards to show (default 6)
}

/**
 * SearchSkeleton Component
 * Displays 6-12 skeleton cards in responsive grid
 */
export const SearchSkeleton: React.FC<SearchSkeletonProps> = ({
  count = 6,
}) => {
  // Clamp count between 6-12 per FR-056, FR-057
  const skeletonCount = Math.min(Math.max(count, 6), 12);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(skeletonCount)].map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export default SearchSkeleton;
