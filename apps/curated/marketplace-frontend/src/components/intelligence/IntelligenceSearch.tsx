/**
 * IntelligenceSearch Component
 *
 * DermaLogica Intelligence MVP - Phase 3
 *
 * Hybrid search interface combining:
 * - Semantic search (768D text embeddings)
 * - Tensor search (17D scientific profile)
 * - Knowledge threshold filtering
 * - Evidence level filtering
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Sliders,
  ChevronDown,
  ChevronUp,
  X,
  Loader2,
  Sparkles,
  FlaskConical,
  BookOpen,
  Target,
  Zap,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Slider } from '../ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import {
  useIntelligenceSearch,
  KnowledgeThreshold,
  EvidenceLevel,
  IntelligenceSearchFilters,
  IntelligenceSearchResult,
  getThresholdLabel,
  getEvidenceLevelLabel,
} from '../../hooks/useIntelligence';

// Atom type labels
const ATOM_TYPE_LABELS: Record<string, string> = {
  INGREDIENT: 'Ingredient',
  PRODUCT: 'Product',
  BRAND: 'Brand',
  COMPANY: 'Company',
  REGULATION: 'Regulation',
  TREND: 'Trend',
  SCIENTIFIC_CONCEPT: 'Scientific Concept',
  MARKET_DATA: 'Market Data',
};

// Atom type colors
const ATOM_TYPE_COLORS: Record<string, string> = {
  INGREDIENT: 'bg-green-100 text-green-800',
  PRODUCT: 'bg-blue-100 text-blue-800',
  BRAND: 'bg-purple-100 text-purple-800',
  COMPANY: 'bg-indigo-100 text-indigo-800',
  REGULATION: 'bg-red-100 text-red-800',
  TREND: 'bg-orange-100 text-orange-800',
  SCIENTIFIC_CONCEPT: 'bg-cyan-100 text-cyan-800',
  MARKET_DATA: 'bg-yellow-100 text-yellow-800',
};

// Knowledge threshold colors
const THRESHOLD_COLORS: Record<string, string> = {
  T1: 'bg-gray-100 text-gray-700',
  T2: 'bg-blue-50 text-blue-700',
  T3: 'bg-indigo-50 text-indigo-700',
  T4: 'bg-purple-50 text-purple-700',
  T5: 'bg-violet-50 text-violet-700',
  T6: 'bg-fuchsia-50 text-fuchsia-700',
  T7: 'bg-pink-50 text-pink-700',
  T8: 'bg-rose-50 text-rose-700',
};

export interface IntelligenceSearchProps {
  onResultSelect?: (result: IntelligenceSearchResult) => void;
  initialQuery?: string;
  initialFilters?: IntelligenceSearchFilters;
  showAdvancedFilters?: boolean;
  limit?: number;
  className?: string;
}

/**
 * SearchResultCard - Single search result display
 */
const SearchResultCard: React.FC<{
  result: IntelligenceSearchResult;
  onClick?: () => void;
}> = ({ result, onClick }) => {
  const { atom, semanticScore, tensorScore, combinedScore, knowledgeThreshold } = result;
  const atomColor = ATOM_TYPE_COLORS[atom.atomType] || 'bg-gray-100 text-gray-800';
  const thresholdColor = knowledgeThreshold
    ? THRESHOLD_COLORS[knowledgeThreshold] || THRESHOLD_COLORS.T1
    : THRESHOLD_COLORS.T1;

  return (
    <button
      className="w-full text-left p-4 rounded-lg border bg-white hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge className={`text-xs ${atomColor}`}>
              {ATOM_TYPE_LABELS[atom.atomType] || atom.atomType}
            </Badge>
            {knowledgeThreshold && (
              <Badge className={`text-xs ${thresholdColor}`}>
                {knowledgeThreshold}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h4 className="font-medium text-gray-900 line-clamp-1">{atom.title}</h4>

          {/* INCI name */}
          {atom.inciName && (
            <p className="text-xs text-gray-500 mt-0.5">INCI: {atom.inciName}</p>
          )}

          {/* Glance text */}
          {atom.glanceText && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {atom.glanceText}
            </p>
          )}
        </div>

        {/* Scores */}
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-600">
                    {Math.round(combinedScore * 100)}%
                  </span>
                  <p className="text-xs text-gray-500">Match</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between gap-4">
                    <span>Semantic:</span>
                    <span>{Math.round(semanticScore * 100)}%</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span>Tensor:</span>
                    <span>{Math.round(tensorScore * 100)}%</span>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Score bars */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Semantic
            </span>
            <span className="text-gray-600">{Math.round(semanticScore * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${semanticScore * 100}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-500 flex items-center gap-1">
              <FlaskConical className="w-3 h-3" /> Tensor
            </span>
            <span className="text-gray-600">{Math.round(tensorScore * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${tensorScore * 100}%` }}
            />
          </div>
        </div>
      </div>
    </button>
  );
};

/**
 * FilterPanel - Advanced filters for search
 */
const FilterPanel: React.FC<{
  filters: IntelligenceSearchFilters;
  onFiltersChange: (filters: IntelligenceSearchFilters) => void;
  weights: { semantic: number; tensor: number };
  onWeightsChange: (weights: { semantic: number; tensor: number }) => void;
}> = ({ filters, onFiltersChange, weights, onWeightsChange }) => {
  // Toggle atom type
  const toggleAtomType = (type: string) => {
    const current = filters.atomTypes || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onFiltersChange({ ...filters, atomTypes: updated.length > 0 ? updated : undefined });
  };

  // Toggle threshold
  const toggleThreshold = (threshold: KnowledgeThreshold) => {
    const current = filters.thresholdFilter || [];
    const updated = current.includes(threshold)
      ? current.filter((t) => t !== threshold)
      : [...current, threshold];
    onFiltersChange({ ...filters, thresholdFilter: updated.length > 0 ? updated : undefined });
  };

  // Handle weight slider change
  const handleWeightChange = (value: number[]) => {
    const semantic = value[0] / 100;
    onWeightsChange({ semantic, tensor: 1 - semantic });
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      {/* Atom Types */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Atom Types</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(ATOM_TYPE_LABELS).map(([type, label]) => {
            const isSelected = filters.atomTypes?.includes(type);
            return (
              <button
                key={type}
                className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                  isSelected
                    ? ATOM_TYPE_COLORS[type]
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => toggleAtomType(type)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Knowledge Thresholds */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Knowledge Threshold</h4>
        <div className="flex flex-wrap gap-2">
          {(['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'] as KnowledgeThreshold[]).map(
            (threshold) => {
              const isSelected = filters.thresholdFilter?.includes(threshold);
              return (
                <TooltipProvider key={threshold}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                          isSelected
                            ? THRESHOLD_COLORS[threshold]
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => toggleThreshold(threshold)}
                      >
                        {threshold}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getThresholdLabel(threshold)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }
          )}
        </div>
      </div>

      {/* Search Weight Slider */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Search Balance</h4>
        <div className="px-2">
          <Slider
            value={[weights.semantic * 100]}
            onValueChange={handleWeightChange}
            min={0}
            max={100}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <FlaskConical className="w-3 h-3" />
              Tensor ({Math.round(weights.tensor * 100)}%)
            </span>
            <span className="flex items-center gap-1">
              Semantic ({Math.round(weights.semantic * 100)}%)
              <BookOpen className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Tensor Filters */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Scientific Profile</h4>
        <div className="grid grid-cols-2 gap-3">
          {/* Min Hydration */}
          <div>
            <label className="text-xs text-gray-500">Min Hydration</label>
            <Input
              type="number"
              min={0}
              max={1}
              step={0.1}
              placeholder="0.0"
              value={filters.tensorFilters?.minHydration || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  tensorFilters: {
                    ...filters.tensorFilters,
                    minHydration: e.target.value ? parseFloat(e.target.value) : undefined,
                  },
                })
              }
              className="h-8 text-sm"
            />
          </div>
          {/* Min Anti-Aging */}
          <div>
            <label className="text-xs text-gray-500">Min Anti-Aging</label>
            <Input
              type="number"
              min={0}
              max={1}
              step={0.1}
              placeholder="0.0"
              value={filters.tensorFilters?.minAntiAging || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  tensorFilters: {
                    ...filters.tensorFilters,
                    minAntiAging: e.target.value ? parseFloat(e.target.value) : undefined,
                  },
                })
              }
              className="h-8 text-sm"
            />
          </div>
          {/* Max Sensitivity */}
          <div>
            <label className="text-xs text-gray-500">Max Sensitivity</label>
            <Input
              type="number"
              min={0}
              max={1}
              step={0.1}
              placeholder="1.0"
              value={filters.tensorFilters?.maxSensitivity || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  tensorFilters: {
                    ...filters.tensorFilters,
                    maxSensitivity: e.target.value ? parseFloat(e.target.value) : undefined,
                  },
                })
              }
              className="h-8 text-sm"
            />
          </div>
          {/* Min Brightening */}
          <div>
            <label className="text-xs text-gray-500">Min Brightening</label>
            <Input
              type="number"
              min={0}
              max={1}
              step={0.1}
              placeholder="0.0"
              value={filters.tensorFilters?.minBrightening || ''}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  tensorFilters: {
                    ...filters.tensorFilters,
                    minBrightening: e.target.value ? parseFloat(e.target.value) : undefined,
                  },
                })
              }
              className="h-8 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * IntelligenceSearch - Main search component
 */
export const IntelligenceSearch: React.FC<IntelligenceSearchProps> = ({
  onResultSelect,
  initialQuery = '',
  initialFilters = {},
  showAdvancedFilters = true,
  limit = 20,
  className = '',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<IntelligenceSearchFilters>(initialFilters);
  const [weights, setWeights] = useState({ semantic: 0.6, tensor: 0.4 });
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const { results, loading, error, totalCount } = useIntelligenceSearch(
    debouncedQuery,
    filters,
    limit,
    weights.semantic,
    weights.tensor
  );

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.atomTypes?.length) count++;
    if (filters.thresholdFilter?.length) count++;
    if (filters.tensorFilters) {
      if (filters.tensorFilters.minHydration !== undefined) count++;
      if (filters.tensorFilters.minAntiAging !== undefined) count++;
      if (filters.tensorFilters.maxSensitivity !== undefined) count++;
      if (filters.tensorFilters.minBrightening !== undefined) count++;
    }
    return count;
  }, [filters]);

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setWeights({ semantic: 0.6, tensor: 0.4 });
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Intelligence Search
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <BarChart3 className="w-4 h-4" />
                  Hybrid Search
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Combines semantic (text meaning) and tensor (scientific profile)
                  search for more accurate results.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search ingredients, concepts, products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
            )}
          </div>
          {showAdvancedFilters && (
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <Sliders className="w-4 h-4 mr-1" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          )}
        </div>

        {/* Active filters badges */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">Active:</span>
            {filters.atomTypes?.map((type) => (
              <Badge
                key={type}
                variant="outline"
                className="text-xs cursor-pointer hover:bg-gray-100"
                onClick={() =>
                  setFilters({
                    ...filters,
                    atomTypes: filters.atomTypes?.filter((t) => t !== type),
                  })
                }
              >
                {ATOM_TYPE_LABELS[type]}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
            {filters.thresholdFilter?.map((threshold) => (
              <Badge
                key={threshold}
                variant="outline"
                className="text-xs cursor-pointer hover:bg-gray-100"
                onClick={() =>
                  setFilters({
                    ...filters,
                    thresholdFilter: filters.thresholdFilter?.filter((t) => t !== threshold),
                  })
                }
              >
                {threshold}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-6">
              Clear All
            </Button>
          </div>
        )}

        {/* Filter panel */}
        {showFilters && (
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            weights={weights}
            onWeightsChange={setWeights}
          />
        )}

        {/* Results count */}
        {debouncedQuery && !loading && (
          <div className="text-sm text-gray-600">
            {totalCount !== undefined ? (
              <>
                Found <span className="font-medium">{totalCount}</span> results
                {results.length < totalCount && ` (showing ${results.length})`}
              </>
            ) : results.length > 0 ? (
              <>Showing {results.length} results</>
            ) : null}
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="space-y-3">
            {results.map((result) => (
              <SearchResultCard
                key={result.atom.id}
                result={result}
                onClick={() => onResultSelect?.(result)}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && debouncedQuery && results.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No results found for "{debouncedQuery}"</p>
            <p className="text-xs text-gray-400 mt-1">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}

        {/* Initial state */}
        {!loading && !debouncedQuery && (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-300" />
            <p className="text-sm">Enter a search term to find skincare knowledge</p>
            <p className="text-xs text-gray-400 mt-1">
              Search ingredients, concepts, or products
            </p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-8 text-red-500">
            <p className="text-sm">Search failed. Please try again.</p>
          </div>
        )}

        {/* Search tips */}
        {!debouncedQuery && (
          <div className="pt-4 border-t">
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
              Search Tips
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>Search by ingredient name (e.g., "niacinamide")</span>
              </div>
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>Search by concept (e.g., "hydration mechanism")</span>
              </div>
              <div className="flex items-start gap-2">
                <FlaskConical className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>Use tensor filters for scientific properties</span>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>Adjust weights to favor semantic or tensor search</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IntelligenceSearch;
