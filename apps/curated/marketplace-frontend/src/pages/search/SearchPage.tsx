/**
 * Search Page Component
 *
 * AI-powered product search with hybrid text and semantic search
 * Uses taxonomy-based filtering and vector similarity
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Sparkles, SlidersHorizontal, X } from 'lucide-react';
import { SearchBar } from '../../components/search/SearchBar';
import { useSearchProducts, useSearchProductsBySemantic } from '../../hooks/useTaxonomy';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const semanticParam = searchParams.get('semantic') === 'true';

  const [query, setQuery] = useState(queryParam);
  const [useSemanticSearch, setUseSemanticSearch] = useState(semanticParam);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProfessionalLevel, setSelectedProfessionalLevel] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  // Update query when URL params change
  useEffect(() => {
    setQuery(queryParam);
    setUseSemanticSearch(semanticParam);
  }, [queryParam, semanticParam]);

  // Build filter object
  const filters = {
    categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
    professionalLevels: selectedProfessionalLevel.length > 0 ? selectedProfessionalLevel : undefined,
    priceMin: priceRange[0] > 0 ? priceRange[0] : undefined,
    priceMax: priceRange[1] < 1000 ? priceRange[1] : undefined,
  };

  // Execute search based on mode
  const textSearch = useSearchProducts({
    query,
    limit: 20,
    filters: Object.keys(filters).length > 0 ? filters : undefined,
  });

  const semanticSearch = useSearchProductsBySemantic({
    query,
    limit: 20,
    filters: Object.keys(filters).length > 0 ? filters : undefined,
  });

  const { data, loading, error } = useSemanticSearch ? semanticSearch : textSearch;
  const products = data?.[useSemanticSearch ? 'searchProductsBySemantic' : 'searchProducts'] || [];

  const handleSearch = (searchQuery: string, semantic: boolean) => {
    setQuery(searchQuery);
    setUseSemanticSearch(semantic);
    setSearchParams({ q: searchQuery, semantic: semantic.toString() });
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedProfessionalLevel([]);
    setPriceRange([0, 1000]);
  };

  const hasFilters =
    selectedCategories.length > 0 ||
    selectedProfessionalLevel.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 1000;

  const hasSearched = query.length >= 2;
  const showEmptyState = hasSearched && !loading && products.length === 0;
  const showResults = hasSearched && !loading && products.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Products</h1>
        <p className="text-gray-600">
          Use AI-powered semantic search or traditional text search to find products
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          placeholder="Search for products by name, brand, category, or description..."
          onResultSelect={(result) => {
            // Navigate to product detail page if needed
            console.log('Selected product:', result);
          }}
          showSemanticToggle={true}
          initialQuery={query}
          initialSemanticMode={useSemanticSearch}
          onSearch={handleSearch}
        />
      </div>

      {/* Search Mode Indicator */}
      {hasSearched && (
        <div className="mb-6 flex items-center gap-2 text-sm">
          <span className="text-gray-600">Search mode:</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700">
            {useSemanticSearch ? (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span className="font-medium">AI Semantic Search</span>
              </>
            ) : (
              <>
                <SearchIcon className="h-3.5 w-3.5" />
                <span className="font-medium">Text Search</span>
              </>
            )}
          </div>
          {products.length > 0 && (
            <span className="text-gray-600">
              • Found {products.length} result{products.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      {/* Filters Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {hasFilters && (
              <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-primary-600 rounded-full">
                {selectedCategories.length + selectedProfessionalLevel.length + (priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0)}
              </span>
            )}
          </Button>
          {hasFilters && (
            <Button onClick={clearFilters} variant="ghost" size="sm">
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>

        {showFilters && (
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Professional Level Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Professional Level
                  </label>
                  <div className="space-y-2">
                    {['RETAIL', 'PROFESSIONAL', 'CLINICAL'].map((level) => (
                      <label key={level} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedProfessionalLevel.includes(level)}
                          onChange={() => {
                            setSelectedProfessionalLevel((prev) =>
                              prev.includes(level)
                                ? prev.filter((l) => l !== level)
                                : [...prev, level]
                            );
                          }}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Price Range
                  </label>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-600">${priceRange[0]}</span>
                      <span className="text-sm font-medium text-gray-900">${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Placeholder for more filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    More Filters
                  </label>
                  <p className="text-sm text-gray-500">Additional filters coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="p-8 text-center">
            <div className="text-red-600 mb-4">
              <SearchIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Search unavailable</h3>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <Button onClick={() => window.location.reload()} variant="primary">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {showEmptyState && (
        <Card>
          <CardContent className="p-12 text-center">
            <SearchIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters, or switch to{' '}
              {useSemanticSearch ? 'text search' : 'semantic search'}
            </p>
            {hasFilters && (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {showResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.productId} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {product.productName}
                  </h3>
                  <p className="text-sm text-gray-600">{product.brandName}</p>
                </div>
                {product.categoryPath && (
                  <p className="text-xs text-gray-500 mb-2">{product.categoryPath}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary-600">
                    ${(product.priceWholesale / 100).toFixed(2)}
                  </span>
                  {product.relevanceScore > 0 && (
                    <span className="text-xs text-gray-500">
                      {(product.relevanceScore * 100).toFixed(0)}% match
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{product.professionalLevel}</span>
                  <span className="px-2 py-1 bg-gray-100 rounded">
                    {product.matchType.replace('_', ' ')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Initial State */}
      {!hasSearched && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <SearchIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Start your search</h3>
            <p className="text-gray-600 mb-4">
              Enter a search term above to find products using AI-powered semantic search
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Sparkles className="h-4 w-4" />
              <span>Try semantic search for intelligent, context-aware results</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchPage;
