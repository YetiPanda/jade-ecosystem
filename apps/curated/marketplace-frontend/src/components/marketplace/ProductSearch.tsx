/**
 * ProductSearch Component
 * Task: T079 - Create ProductSearch component with advanced filters
 */

import React, { useState } from 'react';

interface ProductFilters {
  categoryIds?: string[];
  vendorId?: string;
  priceRange?: { min: number; max: number };
  skinTypes?: string[];
  inStockOnly?: boolean;
}

interface ProductSearchProps {
  initialQuery: string;
  initialFilters: ProductFilters;
  onSearch: (query: string) => void;
  onFiltersChange: (filters: ProductFilters) => void;
}

export default function ProductSearch({
  initialQuery,
  initialFilters,
  onSearch,
  onFiltersChange,
}: ProductSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="product-search">
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="filter-toggle"
        >
          Filters {showFilters ? '▲' : '▼'}
        </button>
      </form>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={filters.inStockOnly || false}
                onChange={(e) => handleFilterChange('inStockOnly', e.target.checked)}
              />
              In Stock Only
            </label>
          </div>

          <div className="filter-group">
            <label>Skin Type</label>
            <select
              onChange={(e) => handleFilterChange('skinTypes', e.target.value ? [e.target.value] : undefined)}
            >
              <option value="">All Types</option>
              <option value="dry">Dry</option>
              <option value="oily">Oily</option>
              <option value="combination">Combination</option>
              <option value="sensitive">Sensitive</option>
            </select>
          </div>
        </div>
      )}

      <style jsx>{`
        .product-search { margin-bottom: 2rem; }
        .search-form { display: flex; gap: 0.5rem; }
        .search-input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
        }
        .search-button, .filter-toggle {
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
        }
        .filter-toggle { background: #6b7280; }
        .filters-panel {
          margin-top: 1rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.375rem;
          display: flex;
          gap: 1rem;
        }
        .filter-group label { display: block; margin-bottom: 0.5rem; }
        select {
          width: 200px;
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
        }
      `}</style>
    </div>
  );
}
