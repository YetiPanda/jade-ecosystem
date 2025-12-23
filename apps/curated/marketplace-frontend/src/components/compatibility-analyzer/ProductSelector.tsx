/**
 * ProductSelector Component
 *
 * DermaLogica Intelligence MVP - Phase 6: Compatibility Analyzer
 *
 * Product/ingredient selection with:
 * - Typeahead search with suggestions
 * - Selected items as removable chips
 * - Maximum product limit enforcement
 * - Product categorization
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Product/Ingredient item for selection
 */
export interface SelectableProduct {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  imageUrl?: string;
  type: 'product' | 'ingredient';
}

export interface ProductSelectorProps {
  /** Currently selected products */
  selected: SelectableProduct[];
  /** Callback when selection changes */
  onChange: (products: SelectableProduct[]) => void;
  /** Search function to get suggestions */
  onSearch: (query: string) => Promise<SelectableProduct[]>;
  /** Maximum number of products allowed */
  maxProducts?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Label text */
  label?: string;
  /** Help text */
  helpText?: string;
  /** Whether selector is disabled */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
  /** Whether to allow mixing products and ingredients */
  allowMixed?: boolean;
  /** Filter to specific type */
  filterType?: 'product' | 'ingredient';
}

/**
 * ProductChip - Removable selected item chip
 */
interface ProductChipProps {
  product: SelectableProduct;
  onRemove: () => void;
  disabled?: boolean;
}

function ProductChip({ product, onRemove, disabled }: ProductChipProps) {
  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full
        bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200
        ${disabled ? 'opacity-50' : ''}
      `}
    >
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt=""
          className="w-5 h-5 rounded-full object-cover"
        />
      )}
      <span className="text-sm font-medium truncate max-w-[150px]" title={product.name}>
        {product.name}
      </span>
      {product.brand && (
        <span className="text-xs text-blue-600 dark:text-blue-400 opacity-75">
          {product.brand}
        </span>
      )}
      <span
        className={`
          px-1.5 py-0.5 rounded text-xs font-medium
          ${product.type === 'product'
            ? 'bg-purple-200 text-purple-800 dark:bg-purple-800 dark:text-purple-200'
            : 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'}
        `}
      >
        {product.type === 'product' ? 'Product' : 'Ingredient'}
      </span>
      {!disabled && (
        <button
          onClick={onRemove}
          className="ml-1 p-0.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          aria-label={`Remove ${product.name}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

/**
 * SuggestionItem - Individual search suggestion
 */
interface SuggestionItemProps {
  product: SelectableProduct;
  isHighlighted: boolean;
  onClick: () => void;
}

function SuggestionItem({ product, isHighlighted, onClick }: SuggestionItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full px-4 py-3 text-left flex items-center gap-3
        ${isHighlighted
          ? 'bg-blue-50 dark:bg-blue-900/30'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
        transition-colors
      `}
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt=""
          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {product.name}
          </span>
          <span
            className={`
              px-1.5 py-0.5 rounded text-xs font-medium flex-shrink-0
              ${product.type === 'product'
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'}
            `}
          >
            {product.type === 'product' ? 'Product' : 'Ingredient'}
          </span>
        </div>
        {(product.brand || product.category) && (
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {product.brand && <span>{product.brand}</span>}
            {product.brand && product.category && <span> • </span>}
            {product.category && <span>{product.category}</span>}
          </div>
        )}
      </div>
    </button>
  );
}

/**
 * ProductSelector - Main component
 */
export function ProductSelector({
  selected,
  onChange,
  onSearch,
  maxProducts = 5,
  placeholder = 'Search products or ingredients...',
  label,
  helpText,
  disabled = false,
  className = '',
  allowMixed = true,
  filterType,
}: ProductSelectorProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SelectableProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAtLimit = selected.length >= maxProducts;

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        let results = await onSearch(query);

        // Filter out already selected items
        results = results.filter(
          (item) => !selected.some((s) => s.id === item.id)
        );

        // Apply type filter if specified
        if (filterType) {
          results = results.filter((item) => item.type === filterType);
        }

        // If not allowing mixed and we have selections, filter to same type
        if (!allowMixed && selected.length > 0) {
          const selectedType = selected[0].type;
          results = results.filter((item) => item.type === selectedType);
        }

        setSuggestions(results);
        setHighlightedIndex(-1);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch, selected, allowMixed, filterType]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle item selection
  const handleSelect = useCallback((product: SelectableProduct) => {
    if (isAtLimit) return;
    onChange([...selected, product]);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }, [selected, onChange, isAtLimit]);

  // Handle item removal
  const handleRemove = useCallback((productId: string) => {
    onChange(selected.filter((p) => p.id !== productId));
  }, [selected, onChange]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown' && suggestions.length > 0) {
        setIsOpen(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelect(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  }, [isOpen, suggestions, highlightedIndex, handleSelect]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {maxProducts > 0 && (
            <span className="ml-2 text-gray-500 font-normal">
              ({selected.length}/{maxProducts})
            </span>
          )}
        </label>
      )}

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selected.map((product) => (
            <ProductChip
              key={product.id}
              product={product}
              onRemove={() => handleRemove(product.id)}
              disabled={disabled}
            />
          ))}
        </div>
      )}

      {/* Search input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isAtLimit}
          placeholder={isAtLimit ? `Maximum ${maxProducts} items selected` : placeholder}
          className={`
            w-full pl-10 pr-4 py-2.5 rounded-lg border
            ${isAtLimit
              ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-not-allowed'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'}
            text-gray-900 dark:text-gray-100 placeholder-gray-500
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          aria-label={label || 'Search products'}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
      </div>

      {/* Help text */}
      {helpText && (
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}

      {/* Limit warning */}
      {isAtLimit && (
        <p className="mt-1.5 text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Maximum {maxProducts} items allowed. Remove an item to add more.
        </p>
      )}

      {/* Suggestions dropdown */}
      {isOpen && !isAtLimit && (query.trim() || suggestions.length > 0) && (
        <div
          className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto"
          role="listbox"
        >
          {loading && suggestions.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              <svg className="w-6 h-6 mx-auto mb-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Searching...
            </div>
          )}

          {!loading && suggestions.length === 0 && query.trim() && (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try a different search term</p>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {suggestions.map((product, index) => (
                <SuggestionItem
                  key={product.id}
                  product={product}
                  isHighlighted={index === highlightedIndex}
                  onClick={() => handleSelect(product)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductSelector;
