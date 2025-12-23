/**
 * ProductCatalog Page Component
 *
 * Task: T076 - Create ProductCatalog page component
 *
 * Features:
 * - Product search with filters
 * - Pagination
 * - Progressive disclosure (glance level in grid)
 * - Vendor filtering
 * - Category filtering
 * - Price range filtering
 * - Skin type filtering
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductSearch from '../../components/marketplace/ProductSearch';
import ProductCard from '../../components/marketplace/ProductCard';

/**
 * Product filters state
 */
interface ProductFilters {
  categoryIds?: string[];
  vendorId?: string;
  priceRange?: { min: number; max: number };
  skinTypes?: string[];
  ingredients?: string[];
  concerns?: string[];
  inStockOnly?: boolean;
  minInventory?: number;
}

/**
 * Pagination state
 */
interface Pagination {
  skip: number;
  take: number;
}

/**
 * Product data from GraphQL
 */
interface MarketplaceProduct {
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
}

/**
 * ProductCatalog Page
 *
 * Main marketplace product browsing experience with search, filters, and pagination
 */
export default function ProductCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState<ProductFilters>({
    inStockOnly: searchParams.get('inStock') === 'true',
  });
  const [pagination, setPagination] = useState<Pagination>({
    skip: parseInt(searchParams.get('skip') || '0'),
    take: 20,
  });
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Derived state
  const currentPage = Math.floor(pagination.skip / pagination.take) + 1;
  const totalPages = Math.ceil(totalItems / pagination.take);

  /**
   * Load products from GraphQL API
   */
  const loadProducts = async () => {
    setLoading(true);

    try {
      // TODO: Replace with actual GraphQL query
      // const { data } = await apolloClient.query({
      //   query: SEARCH_PRODUCTS,
      //   variables: {
      //     query: searchQuery || undefined,
      //     filters,
      //     pagination,
      //     includeScan: false
      //   }
      // });

      // Mock data for now
      const mockProducts: MarketplaceProduct[] = Array.from({ length: 20 }, (_, i) => ({
        product: {
          id: `${i + 1}`,
          name: `Product ${i + 1}`,
          description: 'Premium skincare product',
          featuredAsset: {
            preview: '/placeholder-product.jpg',
          },
        },
        glance: {
          heroBenefit: 'Reduces fine lines in 4 weeks',
          rating: 4.5,
          reviewCount: 128,
          skinTypes: ['dry', 'normal'],
        },
        pricingTiers: [
          { minQuantity: 1, unitPrice: 5000, discountPercentage: 0 },
          { minQuantity: 6, unitPrice: 4500, discountPercentage: 10 },
          { minQuantity: 12, unitPrice: 4000, discountPercentage: 20 },
        ],
        inventoryLevel: 50,
        vendorId: 'vendor-1',
      }));

      setProducts(mockProducts);
      setTotalItems(100); // Mock total
      setHasNextPage(pagination.skip + pagination.take < 100);
      setHasPreviousPage(pagination.skip > 0);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle search submission
   */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPagination({ ...pagination, skip: 0 }); // Reset to first page
    updateUrlParams({ q: query, skip: '0' });
  };

  /**
   * Handle filter changes
   */
  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, skip: 0 }); // Reset to first page
    updateUrlParams({ skip: '0' });
  };

  /**
   * Handle pagination
   */
  const goToPage = (page: number) => {
    const newSkip = (page - 1) * pagination.take;
    setPagination({ ...pagination, skip: newSkip });
    updateUrlParams({ skip: newSkip.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Update URL params
   */
  const updateUrlParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  /**
   * Load products when search/filters/pagination change
   */
  useEffect(() => {
    loadProducts();
  }, [searchQuery, filters, pagination]);

  return (
    <div className="product-catalog">
      {/* Header */}
      <div className="catalog-header">
        <h1>Product Catalog</h1>
        <p className="catalog-subtitle">
          Discover premium professional skincare products
        </p>
      </div>

      {/* Search */}
      <ProductSearch
        initialQuery={searchQuery}
        initialFilters={filters}
        onSearch={handleSearch}
        onFiltersChange={handleFiltersChange}
      />

      {/* Results Count */}
      {!loading && (
        <div className="results-info">
          <p>
            Showing {pagination.skip + 1}-
            {Math.min(pagination.skip + pagination.take, totalItems)} of{' '}
            {totalItems} products
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading products...</p>
        </div>
      )}

      {/* Product Grid */}
      {!loading && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.product.id}
              product={product}
              onAddToCart={(productId, quantity) => {
                console.log('Add to cart:', productId, quantity);
                // TODO: Implement add to cart
              }}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="empty-state">
          <p>No products found</p>
          <p className="empty-state-subtitle">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Pagination */}
      {!loading && products.length > 0 && totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={!hasPreviousPage}
            className="pagination-button"
          >
            Previous
          </button>

          <div className="pagination-pages">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, currentPage - 2) + i;
              if (page > totalPages) return null;

              return (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`pagination-page ${
                    page === currentPage ? 'active' : ''
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={!hasNextPage}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}

      <style jsx>{`
        .product-catalog {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .catalog-header {
          margin-bottom: 2rem;
        }

        .catalog-header h1 {
          font-size: 2.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .catalog-subtitle {
          font-size: 1.125rem;
          color: #6b7280;
        }

        .results-info {
          margin: 1.5rem 0;
          color: #6b7280;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-state p {
          font-size: 1.25rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .empty-state-subtitle {
          color: #6b7280;
          font-size: 1rem;
        }

        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 3rem;
        }

        .pagination-button {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pagination-button:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-pages {
          display: flex;
          gap: 0.25rem;
        }

        .pagination-page {
          width: 2.5rem;
          height: 2.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pagination-page:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .pagination-page.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        @media (max-width: 768px) {
          .product-catalog {
            padding: 1rem;
          }

          .catalog-header h1 {
            font-size: 2rem;
          }

          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
