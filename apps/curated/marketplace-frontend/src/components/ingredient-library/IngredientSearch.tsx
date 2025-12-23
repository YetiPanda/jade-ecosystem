/**
 * IngredientSearch Component
 *
 * DermaLogica Intelligence MVP - Phase 5: Ingredient Library
 *
 * Combines search functionality with tensor filtering:
 * - Text search with autocomplete suggestions
 * - Category and evidence level filters
 * - Skin concern targeting filters
 * - Tensor dimension range filters
 * - Sort options
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TensorFilterPanel, TensorFilters } from './TensorFilterPanel';

/**
 * Evidence Level for filtering
 */
export type EvidenceLevel =
  | 'ANECDOTAL'
  | 'OBSERVATIONAL'
  | 'IN_VITRO'
  | 'ANIMAL_STUDY'
  | 'SMALL_CLINICAL'
  | 'LARGE_CLINICAL'
  | 'GOLD_STANDARD';

/**
 * Knowledge Threshold for filtering
 */
export type KnowledgeThreshold = 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7' | 'T8';

/**
 * Sort options
 */
export type SortOption =
  | 'relevance'
  | 'name_asc'
  | 'name_desc'
  | 'evidence_high'
  | 'evidence_low'
  | 'studies_high'
  | 'studies_low'
  | 'popularity';

/**
 * Complete search/filter state
 */
export interface IngredientSearchFilters {
  query: string;
  categories: string[];
  evidenceLevels: EvidenceLevel[];
  knowledgeThresholds: KnowledgeThreshold[];
  concerns: string[];
  tensorFilters: TensorFilters;
  safetyMin?: number;
  fragranceFree?: boolean;
  veganOnly?: boolean;
  sortBy: SortOption;
}

export interface IngredientSearchProps {
  /** Current filters */
  filters: IngredientSearchFilters;
  /** Callback when filters change */
  onFiltersChange: (filters: IngredientSearchFilters) => void;
  /** Available categories for filtering */
  categories?: string[];
  /** Available concerns for filtering */
  concerns?: string[];
  /** Search suggestions */
  suggestions?: string[];
  /** Whether search is loading */
  loading?: boolean;
  /** Total results count */
  totalResults?: number;
  /** Custom class name */
  className?: string;
  /** Whether to show advanced filters by default */
  showAdvancedByDefault?: boolean;
}

/**
 * Category metadata
 */
const INGREDIENT_CATEGORIES = [
  'Humectant',
  'Emollient',
  'Occlusive',
  'Antioxidant',
  'Retinoid',
  'AHA',
  'BHA',
  'Peptide',
  'Vitamin',
  'Botanical',
  'Ceramide',
  'Niacinamide',
  'Enzyme',
  'SPF Active',
  'Preservative',
  'Surfactant',
  'Other',
];

/**
 * Skin concerns for filtering
 */
const SKIN_CONCERNS = [
  'Acne',
  'Aging',
  'Dark Spots',
  'Dryness',
  'Dullness',
  'Enlarged Pores',
  'Fine Lines',
  'Hyperpigmentation',
  'Oiliness',
  'Redness',
  'Sensitivity',
  'Texture',
  'Wrinkles',
  'Dehydration',
];

/**
 * Evidence level options
 */
const EVIDENCE_OPTIONS: { value: EvidenceLevel; label: string; level: number }[] = [
  { value: 'GOLD_STANDARD', label: 'Gold Standard', level: 7 },
  { value: 'LARGE_CLINICAL', label: 'Large Clinical', level: 6 },
  { value: 'SMALL_CLINICAL', label: 'Small Clinical', level: 5 },
  { value: 'ANIMAL_STUDY', label: 'Animal Study', level: 4 },
  { value: 'IN_VITRO', label: 'In Vitro', level: 3 },
  { value: 'OBSERVATIONAL', label: 'Observational', level: 2 },
  { value: 'ANECDOTAL', label: 'Anecdotal', level: 1 },
];

/**
 * Knowledge threshold options
 */
const THRESHOLD_OPTIONS: { value: KnowledgeThreshold; label: string; description: string }[] = [
  { value: 'T1', label: 'T1', description: 'Basic consumer' },
  { value: 'T2', label: 'T2', description: 'Informed consumer' },
  { value: 'T3', label: 'T3', description: 'Enthusiast' },
  { value: 'T4', label: 'T4', description: 'Advanced enthusiast' },
  { value: 'T5', label: 'T5', description: 'Esthetician' },
  { value: 'T6', label: 'T6', description: 'Advanced pro' },
  { value: 'T7', label: 'T7', description: 'Formulator' },
  { value: 'T8', label: 'T8', description: 'Research scientist' },
];

/**
 * Sort options
 */
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  { value: 'evidence_high', label: 'Evidence (High-Low)' },
  { value: 'evidence_low', label: 'Evidence (Low-High)' },
  { value: 'studies_high', label: 'Most Studies' },
  { value: 'studies_low', label: 'Fewest Studies' },
  { value: 'popularity', label: 'Most Popular' },
];

/**
 * Default filters factory
 */
export function getDefaultFilters(): IngredientSearchFilters {
  return {
    query: '',
    categories: [],
    evidenceLevels: [],
    knowledgeThresholds: [],
    concerns: [],
    tensorFilters: {},
    sortBy: 'relevance',
  };
}

/**
 * Count active filters
 */
function countActiveFilters(filters: IngredientSearchFilters): number {
  let count = 0;
  if (filters.categories.length > 0) count += filters.categories.length;
  if (filters.evidenceLevels.length > 0) count += filters.evidenceLevels.length;
  if (filters.knowledgeThresholds.length > 0) count += filters.knowledgeThresholds.length;
  if (filters.concerns.length > 0) count += filters.concerns.length;
  if (filters.safetyMin) count++;
  if (filters.fragranceFree) count++;
  if (filters.veganOnly) count++;
  // Count tensor filters
  Object.values(filters.tensorFilters).forEach((tf) => {
    if (tf?.enabled) count++;
  });
  return count;
}

/**
 * IngredientSearch - Main search and filter component
 */
export function IngredientSearch({
  filters,
  onFiltersChange,
  categories = INGREDIENT_CATEGORIES,
  concerns = SKIN_CONCERNS,
  suggestions = [],
  loading = false,
  totalResults,
  className = '',
  showAdvancedByDefault = false,
}: IngredientSearchProps) {
  const [showAdvanced, setShowAdvanced] = useState(showAdvancedByDefault);
  const [showTensorFilters, setShowTensorFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [localQuery, setLocalQuery] = useState(filters.query);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery !== filters.query) {
        onFiltersChange({ ...filters, query: localQuery });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localQuery, filters, onFiltersChange]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle array filter helper
  const toggleArrayFilter = useCallback(
    <K extends keyof IngredientSearchFilters>(key: K, value: string) => {
      const current = filters[key] as string[];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      onFiltersChange({ ...filters, [key]: updated });
    },
    [filters, onFiltersChange]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    onFiltersChange(getDefaultFilters());
    setLocalQuery('');
  }, [onFiltersChange]);

  const activeFilterCount = countActiveFilters(filters);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div ref={searchRef} className="relative">
        <div className="flex gap-2">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {loading ? (
                <svg
                  className="w-5 h-5 text-gray-400 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
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
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              )}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search ingredients by name, INCI, or function..."
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {localQuery && (
              <button
                onClick={() => {
                  setLocalQuery('');
                  inputRef.current?.focus();
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`
              px-4 py-2.5 rounded-lg border flex items-center gap-2 font-medium
              ${
                showAdvanced || activeFilterCount > 0
                  ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300'
                  : 'bg-white border-gray-300 text-gray-700 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
              }
              hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
            `}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-blue-600 text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFiltersChange({ ...filters, sortBy: e.target.value as SortOption })
            }
            className="px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && localQuery && (
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.slice(0, 8).map((suggestion, i) => (
              <button
                key={i}
                onClick={() => {
                  setLocalQuery(suggestion);
                  setShowSuggestions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results count & Clear */}
      {(totalResults !== undefined || activeFilterCount > 0) && (
        <div className="flex items-center justify-between text-sm">
          {totalResults !== undefined && (
            <span className="text-gray-600 dark:text-gray-400">
              {totalResults.toLocaleString()} {totalResults === 1 ? 'ingredient' : 'ingredients'}{' '}
              found
            </span>
          )}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-4 border border-gray-200 dark:border-gray-700">
          {/* Categories */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleArrayFilter('categories', category)}
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium transition-colors
                    ${
                      filters.categories.includes(category)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-blue-400'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Evidence Level */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Evidence Level (minimum)
            </h4>
            <div className="flex flex-wrap gap-2">
              {EVIDENCE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleArrayFilter('evidenceLevels', option.value)}
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium transition-colors
                    ${
                      filters.evidenceLevels.includes(option.value)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-emerald-400'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Knowledge Threshold */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Knowledge Level (max complexity)
            </h4>
            <div className="flex flex-wrap gap-2">
              {THRESHOLD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleArrayFilter('knowledgeThresholds', option.value)}
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium transition-colors
                    ${
                      filters.knowledgeThresholds.includes(option.value)
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-purple-400'
                    }
                  `}
                  title={option.description}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Skin Concerns */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Targets Concern
            </h4>
            <div className="flex flex-wrap gap-2">
              {concerns.map((concern) => (
                <button
                  key={concern}
                  onClick={() => toggleArrayFilter('concerns', concern)}
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium transition-colors
                    ${
                      filters.concerns.includes(concern)
                        ? 'bg-rose-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-rose-400'
                    }
                  `}
                >
                  {concern}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Options */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.fragranceFree || false}
                onChange={(e) =>
                  onFiltersChange({ ...filters, fragranceFree: e.target.checked || undefined })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Fragrance-free only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.veganOnly || false}
                onChange={(e) =>
                  onFiltersChange({ ...filters, veganOnly: e.target.checked || undefined })
                }
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Vegan only</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Min safety:</span>
              <select
                value={filters.safetyMin || ''}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    safetyMin: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              >
                <option value="">Any</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5 only</option>
              </select>
            </div>
          </div>

          {/* Tensor Filters Toggle */}
          <div>
            <button
              onClick={() => setShowTensorFilters(!showTensorFilters)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600"
            >
              <svg
                className={`w-4 h-4 transition-transform ${showTensorFilters ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              Advanced: Filter by Skin Impact (Tensor Dimensions)
            </button>

            {showTensorFilters && (
              <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-3">
                <TensorFilterPanel
                  filters={filters.tensorFilters}
                  onChange={(tensorFilters) => onFiltersChange({ ...filters, tensorFilters })}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default IngredientSearch;
