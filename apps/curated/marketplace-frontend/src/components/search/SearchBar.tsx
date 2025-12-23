/**
 * Intelligent Search Bar Component
 *
 * Features:
 * - Debounced search input
 * - Auto-complete suggestions
 * - Semantic search toggle
 * - Search history
 * - Progressive disclosure
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearchProducts, type SearchResult } from '../../hooks/useTaxonomy';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchBarProps {
  placeholder?: string;
  onResultSelect?: (result: SearchResult) => void;
  showSemanticToggle?: boolean;
  initialQuery?: string;
  initialSemanticMode?: boolean;
  onSearch?: (query: string, semanticMode: boolean) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search products by name, brand, or category...',
  onResultSelect,
  showSemanticToggle = true,
  initialQuery = '',
  initialSemanticMode = false,
  onSearch,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const [useSemanticSearch, setUseSemanticSearch] = useState(initialSemanticMode);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Update local state when props change
  useEffect(() => {
    setQuery(initialQuery);
    setUseSemanticSearch(initialSemanticMode);
  }, [initialQuery, initialSemanticMode]);

  const debouncedQuery = useDebounce(query, 300);

  // Fetch search results
  const { data, loading } = useSearchProducts({
    query: debouncedQuery,
    limit: 8,
  });

  const results = data?.searchProducts || [];

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // Add to search history
    const newHistory = [searchQuery, ...searchHistory.filter((h) => h !== searchQuery)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    // Call onSearch callback if provided, otherwise navigate
    if (onSearch) {
      onSearch(searchQuery, useSemanticSearch);
    } else {
      navigate(`/app/search?q=${encodeURIComponent(searchQuery)}&semantic=${useSemanticSearch}`);
      setQuery('');
    }
    setIsOpen(false);
  };

  const handleResultClick = (result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
    } else {
      navigate(`/app/products/${result.productId}`);
    }
    setIsOpen(false);
    setQuery('');
  };

  const handleHistoryClick = (historyQuery: string) => {
    setQuery(historyQuery);
    handleSearch(historyQuery);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const showDropdown = isOpen && (query.length > 0 || searchHistory.length > 0);

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch(query);
            }
            if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          placeholder={placeholder}
          className="w-full pl-12 pr-24 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-3">
          {showSemanticToggle && (
            <button
              onClick={() => setUseSemanticSearch(!useSemanticSearch)}
              className={`p-1.5 rounded-md transition-colors ${
                useSemanticSearch
                  ? 'bg-purple-100 text-purple-600'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
              title={useSemanticSearch ? 'Using AI semantic search' : 'Using basic text search'}
            >
              <Sparkles className="h-4 w-4" />
            </button>
          )}

          {query && (
            <button
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {/* Search Results */}
          {query.length > 0 && (
            <div className="p-2">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Search Results
                  </div>
                  {results.map((result) => (
                    <button
                      key={result.productId}
                      onClick={() => handleResultClick(result)}
                      className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors text-left"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md"></div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {result.productName}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {result.brandName}
                          {result.categoryPath && ` • ${result.categoryPath}`}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                          <TrendingUp className="h-3 w-3" />
                          {Math.round(result.relevanceScore * 100)}%
                        </span>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => handleSearch(query)}
                    className="w-full mt-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-left font-medium"
                  >
                    View all results for "{query}"
                  </button>
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No results found for "{query}"
                </div>
              )}
            </div>
          )}

          {/* Search History */}
          {query.length === 0 && searchHistory.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Recent Searches
                </div>
                <button
                  onClick={clearHistory}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>
              {searchHistory.map((historyQuery, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(historyQuery)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors text-left"
                >
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-700">{historyQuery}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
