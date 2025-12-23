/**
 * SkincareSearchPage
 *
 * Feature: RDF Skincare Taxonomy Integration
 *
 * Semantic search page for skincare products using Zilliz vector database.
 * Supports natural language queries like:
 * - "Find gentle gel cleansers for oily skin"
 * - "Best vitamin C serums for hyperpigmentation"
 * - "Fragrance-free moisturizers for sensitive skin"
 */

import React, { useState } from 'react';
import {
  useSkincareSearch,
  useSkincareFilterOptions,
  SkincareSearchFilters,
} from '../../hooks/useSkincareSearch';
import SkincareProductCard from '../../components/skincare/SkincareProductCard';

/**
 * Category quick filters
 */
const CATEGORIES = [
  'Cleansers',
  'Treatments',
  'Moisturizers',
  'Mists & Toners',
  'Masks',
];

/**
 * Example queries for inspiration
 */
const EXAMPLE_QUERIES = [
  'gentle cleanser for sensitive skin',
  'vitamin C serum for dark spots',
  'hydrating moisturizer for dry skin',
  'fragrance-free products for acne',
  'anti-aging night cream',
];

export default function SkincareSearchPage() {
  const {
    searchTerm,
    setSearchTerm,
    products,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    hasActiveFilters,
  } = useSkincareSearch();

  const { filterOptions } = useSkincareFilterOptions();

  const [showFilters, setShowFilters] = useState(false);

  /**
   * Handle search form submission
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is automatic via debounce
  };

  /**
   * Handle example query click
   */
  const handleExampleQuery = (query: string) => {
    setSearchTerm(query);
  };

  /**
   * Handle category filter
   */
  const handleCategoryFilter = (category: string) => {
    if (filters.category === category) {
      updateFilters({ category: undefined });
    } else {
      updateFilters({ category });
    }
  };

  /**
   * Handle checkbox filter
   */
  const handleCheckboxFilter = (
    key: keyof SkincareSearchFilters,
    value: boolean
  ) => {
    updateFilters({ [key]: value ? true : undefined });
  };

  /**
   * Handle array filter (skin types, concerns)
   */
  const handleArrayFilter = (
    key: 'skinTypes' | 'concerns',
    value: string,
    add: boolean
  ) => {
    const current = filters[key] || [];
    if (add) {
      updateFilters({ [key]: [...current, value] });
    } else {
      updateFilters({ [key]: current.filter((v) => v !== value) });
    }
  };

  return (
    <div className="skincare-search-page">
      {/* Header */}
      <header className="page-header">
        <h1>Skincare Search</h1>
        <p className="subtitle">
          Find the perfect skincare products using natural language search
        </p>
      </header>

      {/* Search Bar */}
      <section className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <span className="search-icon">&#128269;</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for skincare products..."
              className="search-input"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="clear-btn"
              >
                &times;
              </button>
            )}
          </div>
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Example Queries */}
        {!searchTerm && (
          <div className="example-queries">
            <span className="hint">Try:</span>
            {EXAMPLE_QUERIES.map((query, idx) => (
              <button
                key={idx}
                onClick={() => handleExampleQuery(query)}
                className="example-btn"
              >
                {query}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Category Quick Filters */}
      <section className="category-filters">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryFilter(category)}
            className={`category-btn ${
              filters.category === category ? 'active' : ''
            }`}
          >
            {category}
          </button>
        ))}
      </section>

      {/* Main Content */}
      <div className="main-content">
        {/* Filters Sidebar */}
        <aside className={`filters-sidebar ${showFilters ? 'open' : ''}`}>
          <div className="filters-header">
            <h3>Filters</h3>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear All
              </button>
            )}
          </div>

          {/* Skin Type Filter */}
          <div className="filter-group">
            <h4>Skin Type</h4>
            <div className="filter-options">
              {filterOptions.skinTypes.map((type) => (
                <label key={type} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.skinTypes?.includes(type) || false}
                    onChange={(e) =>
                      handleArrayFilter('skinTypes', type, e.target.checked)
                    }
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Concerns Filter */}
          <div className="filter-group">
            <h4>Concerns</h4>
            <div className="filter-options">
              {filterOptions.concerns.slice(0, 8).map((concern) => (
                <label key={concern} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filters.concerns?.includes(concern) || false}
                    onChange={(e) =>
                      handleArrayFilter('concerns', concern, e.target.checked)
                    }
                  />
                  <span>{concern}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferences Filter */}
          <div className="filter-group">
            <h4>Preferences</h4>
            <div className="filter-options">
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.fragranceFree || false}
                  onChange={(e) =>
                    handleCheckboxFilter('fragranceFree', e.target.checked)
                  }
                />
                <span>Fragrance-Free</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.vegan || false}
                  onChange={(e) =>
                    handleCheckboxFilter('vegan', e.target.checked)
                  }
                />
                <span>Vegan</span>
              </label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={filters.crueltyFree || false}
                  onChange={(e) =>
                    handleCheckboxFilter('crueltyFree', e.target.checked)
                  }
                />
                <span>Cruelty-Free</span>
              </label>
            </div>
          </div>

          {/* Price Tier Filter */}
          <div className="filter-group">
            <h4>Price Range</h4>
            <div className="filter-options price-tiers">
              {['BUDGET', 'MODERATE', 'PREMIUM', 'LUXURY'].map((tier) => (
                <button
                  key={tier}
                  onClick={() =>
                    updateFilters({
                      priceTier: filters.priceTier === tier ? undefined : tier,
                    })
                  }
                  className={`price-tier-btn ${
                    filters.priceTier === tier ? 'active' : ''
                  }`}
                >
                  {tier === 'BUDGET' && '$'}
                  {tier === 'MODERATE' && '$$'}
                  {tier === 'PREMIUM' && '$$$'}
                  {tier === 'LUXURY' && '$$$$'}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="results-section">
          {/* Mobile Filter Toggle */}
          <button
            className="mobile-filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {hasActiveFilters && <span className="filter-count">*</span>}
          </button>

          {/* Results Header */}
          <div className="results-header">
            <span className="results-count">
              {loading
                ? 'Searching...'
                : `${products.length} products found`}
            </span>
            {hasActiveFilters && (
              <span className="active-filters-hint">
                Filters applied
              </span>
            )}
          </div>

          {/* Error State */}
          {error && (
            <div className="error-message">
              <p>Failed to search products: {error.message}</p>
              <button onClick={() => setSearchTerm(searchTerm)}>
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && searchTerm && (
            <div className="empty-state">
              <div className="empty-icon">&#128270;</div>
              <h3>No products found</h3>
              <p>Try a different search term or adjust your filters</p>
            </div>
          )}

          {/* Welcome State */}
          {!loading && !error && products.length === 0 && !searchTerm && (
            <div className="welcome-state">
              <div className="welcome-icon">&#127807;</div>
              <h3>Start your skincare search</h3>
              <p>
                Use natural language to find the perfect products for your skin
              </p>
              <div className="welcome-examples">
                <p>Example searches:</p>
                <ul>
                  <li>"gentle cleanser for sensitive skin"</li>
                  <li>"vitamin C serum for dark spots"</li>
                  <li>"fragrance-free moisturizer"</li>
                </ul>
              </div>
            </div>
          )}

          {/* Products Grid */}
          {products.length > 0 && (
            <div className="products-grid">
              {products.map((product) => (
                <SkincareProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={(p) =>
                    console.log('View details:', p.productName)
                  }
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .skincare-search-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 0.5rem;
        }

        .subtitle {
          color: #6b7280;
          font-size: 1rem;
        }

        /* Search Section */
        .search-section {
          margin-bottom: 1.5rem;
        }

        .search-form {
          display: flex;
          gap: 0.75rem;
          max-width: 800px;
          margin: 0 auto 1rem;
        }

        .search-input-wrapper {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          font-size: 1.25rem;
          color: #9ca3af;
        }

        .search-input {
          width: 100%;
          padding: 0.875rem 2.5rem 0.875rem 3rem;
          font-size: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .clear-btn {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #9ca3af;
          cursor: pointer;
        }

        .clear-btn:hover {
          color: #6b7280;
        }

        .search-btn {
          padding: 0.875rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .search-btn:hover:not(:disabled) {
          background: #2563eb;
        }

        .search-btn:disabled {
          background: #9ca3af;
        }

        .example-queries {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .hint {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .example-btn {
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 1rem;
          padding: 0.375rem 0.75rem;
          font-size: 0.8125rem;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }

        .example-btn:hover {
          background: #e5e7eb;
          border-color: #d1d5db;
        }

        /* Category Filters */
        .category-filters {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .category-btn {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .category-btn.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        /* Main Content */
        .main-content {
          display: flex;
          gap: 2rem;
        }

        /* Filters Sidebar */
        .filters-sidebar {
          width: 260px;
          flex-shrink: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
          height: fit-content;
          position: sticky;
          top: 1rem;
        }

        @media (max-width: 768px) {
          .filters-sidebar {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            border-radius: 0;
            z-index: 100;
            overflow-y: auto;
          }

          .filters-sidebar.open {
            display: block;
          }
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .filters-header h3 {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
        }

        .clear-filters-btn {
          font-size: 0.75rem;
          color: #3b82f6;
          background: none;
          border: none;
          cursor: pointer;
        }

        .filter-group {
          margin-bottom: 1.25rem;
        }

        .filter-group h4 {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #374151;
          margin: 0 0 0.75rem;
        }

        .filter-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .filter-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          color: #374151;
          cursor: pointer;
        }

        .filter-checkbox input {
          width: 1rem;
          height: 1rem;
        }

        .price-tiers {
          flex-direction: row;
          flex-wrap: wrap;
        }

        .price-tier-btn {
          padding: 0.375rem 0.75rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .price-tier-btn:hover {
          background: #f3f4f6;
        }

        .price-tier-btn.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        /* Results Section */
        .results-section {
          flex: 1;
          min-width: 0;
        }

        .mobile-filter-toggle {
          display: none;
          width: 100%;
          padding: 0.75rem;
          margin-bottom: 1rem;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .mobile-filter-toggle {
            display: block;
          }
        }

        .filter-count {
          color: #3b82f6;
          margin-left: 0.25rem;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .results-count {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .active-filters-hint {
          font-size: 0.75rem;
          color: #3b82f6;
        }

        /* States */
        .error-message {
          text-align: center;
          padding: 2rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 0.5rem;
          color: #dc2626;
        }

        .error-message button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 0.25rem;
          cursor: pointer;
        }

        .empty-state,
        .welcome-state {
          text-align: center;
          padding: 3rem 2rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }

        .empty-icon,
        .welcome-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .empty-state h3,
        .welcome-state h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin: 0 0 0.5rem;
        }

        .empty-state p,
        .welcome-state p {
          color: #6b7280;
          margin: 0;
        }

        .welcome-examples {
          margin-top: 1.5rem;
          text-align: left;
          display: inline-block;
        }

        .welcome-examples p {
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .welcome-examples ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .welcome-examples li {
          font-size: 0.875rem;
          color: #6b7280;
          padding: 0.25rem 0;
        }

        .welcome-examples li::before {
          content: '"';
        }

        .welcome-examples li::after {
          content: '"';
        }

        /* Products Grid */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        @media (max-width: 640px) {
          .skincare-search-page {
            padding: 1rem;
          }

          .search-form {
            flex-direction: column;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
