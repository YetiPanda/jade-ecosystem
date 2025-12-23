/**
 * TensorFilterPanel Component
 *
 * DermaLogica Intelligence MVP - Phase 5: Ingredient Library
 *
 * Filter panel with 17 tensor dimension sliders grouped by category:
 * - Hydration: hydrationLevel, oilProduction, barrierHealth, pHBalance
 * - Aging: elasticity, cellTurnover, collagenDensity, circulation
 * - Clarity: pigmentation, poreSize, surfaceTexture
 * - Sensitivity: inflammationLevel, sensitivityIndex
 * - Protection: antioxidantCapacity, microbiomeBalance, photoaging, environmentalProtection
 */

import React, { useState, useCallback, useMemo } from 'react';

/**
 * Tensor coordinate key type
 */
export type TensorDimensionKey =
  | 'hydrationLevel'
  | 'oilProduction'
  | 'barrierHealth'
  | 'elasticity'
  | 'pigmentation'
  | 'cellTurnover'
  | 'inflammationLevel'
  | 'antioxidantCapacity'
  | 'collagenDensity'
  | 'microbiomeBalance'
  | 'sensitivityIndex'
  | 'poreSize'
  | 'surfaceTexture'
  | 'photoaging'
  | 'pHBalance'
  | 'circulation'
  | 'environmentalProtection';

/**
 * Tensor filter value with min/max range
 */
export interface TensorFilterValue {
  min: number;
  max: number;
  enabled: boolean;
}

/**
 * Full tensor filter state
 */
export type TensorFilters = Record<TensorDimensionKey, TensorFilterValue>;

/**
 * Dimension metadata
 */
interface DimensionMeta {
  key: TensorDimensionKey;
  label: string;
  description: string;
  category: 'hydration' | 'aging' | 'clarity' | 'sensitivity' | 'protection';
  inverted?: boolean; // For dimensions where lower is better (e.g., inflammation)
}

/**
 * All 17 dimensions with metadata
 */
const DIMENSIONS: DimensionMeta[] = [
  // Hydration category
  { key: 'hydrationLevel', label: 'Hydration', description: 'Skin moisture level', category: 'hydration' },
  { key: 'oilProduction', label: 'Oil Production', description: 'Sebum output level', category: 'hydration' },
  { key: 'barrierHealth', label: 'Barrier Health', description: 'Skin barrier integrity', category: 'hydration' },
  { key: 'pHBalance', label: 'pH Balance', description: 'Skin pH equilibrium', category: 'hydration' },

  // Aging category
  { key: 'elasticity', label: 'Elasticity', description: 'Skin firmness and bounce', category: 'aging' },
  { key: 'cellTurnover', label: 'Cell Turnover', description: 'Skin renewal rate', category: 'aging' },
  { key: 'collagenDensity', label: 'Collagen', description: 'Collagen levels', category: 'aging' },
  { key: 'circulation', label: 'Circulation', description: 'Blood flow to skin', category: 'aging' },

  // Clarity category
  { key: 'pigmentation', label: 'Pigmentation', description: 'Melanin distribution', category: 'clarity' },
  { key: 'poreSize', label: 'Pore Size', description: 'Pore visibility', category: 'clarity', inverted: true },
  { key: 'surfaceTexture', label: 'Texture', description: 'Skin smoothness', category: 'clarity' },

  // Sensitivity category
  { key: 'inflammationLevel', label: 'Inflammation', description: 'Inflammation markers', category: 'sensitivity', inverted: true },
  { key: 'sensitivityIndex', label: 'Sensitivity', description: 'Irritation threshold', category: 'sensitivity' },

  // Protection category
  { key: 'antioxidantCapacity', label: 'Antioxidant', description: 'Free radical defense', category: 'protection' },
  { key: 'microbiomeBalance', label: 'Microbiome', description: 'Skin flora health', category: 'protection' },
  { key: 'photoaging', label: 'Photoaging', description: 'Sun damage level', category: 'protection', inverted: true },
  { key: 'environmentalProtection', label: 'Env. Protection', description: 'Pollution defense', category: 'protection' },
];

/**
 * Category colors and metadata
 */
const CATEGORIES = {
  hydration: { label: 'Hydration', color: 'bg-blue-500', textColor: 'text-blue-600 dark:text-blue-400' },
  aging: { label: 'Anti-Aging', color: 'bg-purple-500', textColor: 'text-purple-600 dark:text-purple-400' },
  clarity: { label: 'Clarity', color: 'bg-pink-500', textColor: 'text-pink-600 dark:text-pink-400' },
  sensitivity: { label: 'Sensitivity', color: 'bg-amber-500', textColor: 'text-amber-600 dark:text-amber-400' },
  protection: { label: 'Protection', color: 'bg-green-500', textColor: 'text-green-600 dark:text-green-400' },
};

export interface TensorFilterPanelProps {
  /** Current filter values */
  filters: TensorFilters;
  /** Callback when filters change */
  onFiltersChange: (filters: TensorFilters) => void;
  /** Whether panel is collapsed */
  collapsed?: boolean;
  /** Callback when collapse state changes */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Custom class name */
  className?: string;
  /** Whether to show category grouping */
  showCategories?: boolean;
  /** Whether to show tolerance controls */
  showTolerance?: boolean;
}

/**
 * Default filter values (all dimensions disabled with full range)
 */
export function getDefaultFilters(): TensorFilters {
  const filters: Partial<TensorFilters> = {};
  for (const dim of DIMENSIONS) {
    filters[dim.key] = { min: 0, max: 1, enabled: false };
  }
  return filters as TensorFilters;
}

/**
 * Get active filter count
 */
export function getActiveFilterCount(filters: TensorFilters): number {
  return Object.values(filters).filter((f) => f.enabled).length;
}

/**
 * Range slider component for a single dimension
 */
function DimensionSlider({
  dimension,
  value,
  onChange,
}: {
  dimension: DimensionMeta;
  value: TensorFilterValue;
  onChange: (value: TensorFilterValue) => void;
}) {
  const handleToggle = useCallback(() => {
    onChange({ ...value, enabled: !value.enabled });
  }, [value, onChange]);

  const handleMinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseFloat(e.target.value);
    onChange({ ...value, min: Math.min(newMin, value.max - 0.05) });
  }, [value, onChange]);

  const handleMaxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseFloat(e.target.value);
    onChange({ ...value, max: Math.max(newMax, value.min + 0.05) });
  }, [value, onChange]);

  const categoryMeta = CATEGORIES[dimension.category];

  return (
    <div className={`p-3 rounded-lg border transition-colors ${
      value.enabled
        ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
        : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={value.enabled}
            onChange={handleToggle}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className={`text-sm font-medium ${value.enabled ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
            {dimension.label}
          </span>
          {dimension.inverted && (
            <span className="text-xs text-gray-400 dark:text-gray-500">(lower is better)</span>
          )}
        </div>
        <span className={`text-xs px-1.5 py-0.5 rounded ${categoryMeta.color} text-white`}>
          {Math.round(value.min * 100)}-{Math.round(value.max * 100)}%
        </span>
      </div>

      {/* Sliders */}
      {value.enabled && (
        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 w-8">Min</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={value.min}
              onChange={handleMinChange}
              className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-600 dark:text-gray-300 w-10 text-right">
              {Math.round(value.min * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 w-8">Max</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={value.max}
              onChange={handleMaxChange}
              className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-gray-600 dark:text-gray-300 w-10 text-right">
              {Math.round(value.max * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * TensorFilterPanel - Advanced filter panel for tensor dimensions
 */
export function TensorFilterPanel({
  filters,
  onFiltersChange,
  collapsed = false,
  onCollapsedChange,
  className = '',
  showCategories = true,
  showTolerance = false,
}: TensorFilterPanelProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['hydration', 'aging', 'clarity', 'sensitivity', 'protection'])
  );

  /**
   * Update a single dimension filter
   */
  const updateFilter = useCallback((key: TensorDimensionKey, value: TensorFilterValue) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  }, [filters, onFiltersChange]);

  /**
   * Reset all filters
   */
  const resetFilters = useCallback(() => {
    onFiltersChange(getDefaultFilters());
  }, [onFiltersChange]);

  /**
   * Toggle category expansion
   */
  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  /**
   * Group dimensions by category
   */
  const groupedDimensions = useMemo(() => {
    const groups: Record<string, DimensionMeta[]> = {};
    for (const dim of DIMENSIONS) {
      if (!groups[dim.category]) {
        groups[dim.category] = [];
      }
      groups[dim.category].push(dim);
    }
    return groups;
  }, []);

  const activeCount = getActiveFilterCount(filters);

  if (collapsed) {
    return (
      <button
        onClick={() => onCollapsedChange?.(false)}
        className={`flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${className}`}
      >
        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tensor Filters
        </span>
        {activeCount > 0 && (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-full text-xs font-medium">
            {activeCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Tensor Filters
          </h3>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 rounded-full text-xs font-medium">
              {activeCount} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Reset
            </button>
          )}
          {onCollapsedChange && (
            <button
              onClick={() => onCollapsedChange(true)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[500px] overflow-y-auto">
        {showCategories ? (
          <div className="space-y-4">
            {Object.entries(CATEGORIES).map(([category, meta]) => {
              const dimensions = groupedDimensions[category] || [];
              const isExpanded = expandedCategories.has(category);
              const categoryActiveCount = dimensions.filter((d) => filters[d.key].enabled).length;

              return (
                <div key={category}>
                  {/* Category header */}
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${meta.color}`} />
                      <span className={`text-sm font-medium ${meta.textColor}`}>
                        {meta.label}
                      </span>
                      {categoryActiveCount > 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({categoryActiveCount})
                        </span>
                      )}
                    </div>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dimension sliders */}
                  {isExpanded && (
                    <div className="mt-2 space-y-2">
                      {dimensions.map((dim) => (
                        <DimensionSlider
                          key={dim.key}
                          dimension={dim}
                          value={filters[dim.key]}
                          onChange={(value) => updateFilter(dim.key, value)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {DIMENSIONS.map((dim) => (
              <DimensionSlider
                key={dim.key}
                dimension={dim}
                value={filters[dim.key]}
                onChange={(value) => updateFilter(dim.key, value)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TensorFilterPanel;
