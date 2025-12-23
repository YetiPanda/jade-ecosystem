/**
 * IngredientLibrary Component
 *
 * DermaLogica Intelligence MVP - Phase 5: Ingredient Library
 *
 * Main component that combines all ingredient library features:
 * - Search and filtering
 * - Ingredient grid display
 * - Pagination
 * - Detail modal/drawer
 * - Evidence accordion
 */

import React, { useState, useCallback, useMemo } from 'react';
import { IngredientSearch, IngredientSearchFilters, getDefaultFilters } from './IngredientSearch';
import { IngredientCard, IngredientGrid, Ingredient } from './IngredientCard';
import { EvidenceAccordion, EvidenceSummaryCard, StudyReference } from './EvidenceAccordion';

/**
 * View mode toggle options
 */
export type ViewMode = 'glance' | 'scan' | 'study';

export interface IngredientLibraryProps {
  /** Array of ingredients to display */
  ingredients: Ingredient[];
  /** Whether data is loading */
  loading?: boolean;
  /** Error message if any */
  error?: string | null;
  /** Callback to fetch more ingredients */
  onLoadMore?: () => void;
  /** Whether there are more ingredients to load */
  hasMore?: boolean;
  /** Callback when search/filters change */
  onSearch?: (filters: IngredientSearchFilters) => void;
  /** Available categories */
  categories?: string[];
  /** Available concerns */
  concerns?: string[];
  /** Search suggestions */
  suggestions?: string[];
  /** Custom class name */
  className?: string;
}

/**
 * Pagination component
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = useMemo(() => {
    const result: (number | 'ellipsis')[] = [];
    const showPages = 5;
    const half = Math.floor(showPages / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start < showPages - 1) {
      start = Math.max(1, end - showPages + 1);
    }

    if (start > 1) {
      result.push(1);
      if (start > 2) result.push('ellipsis');
    }

    for (let i = start; i <= end; i++) {
      result.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) result.push('ellipsis');
      result.push(totalPages);
    }

    return result;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {pages.map((page, i) =>
        page === 'ellipsis' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
              ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }
            `}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}

/**
 * View mode toggle
 */
interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  const modes: { value: ViewMode; label: string; icon: React.ReactNode }[] = [
    {
      value: 'glance',
      label: 'Glance',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      value: 'scan',
      label: 'Scan',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      ),
    },
    {
      value: 'study',
      label: 'Study',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="inline-flex rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors
            first:rounded-l-lg last:rounded-r-lg
            ${
              mode === m.value
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
          title={`${m.label} view - ${m.value === 'glance' ? 'minimal info' : m.value === 'scan' ? 'moderate detail' : 'full detail'}`}
        >
          {m.icon}
          <span className="hidden sm:inline">{m.label}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Ingredient detail drawer/modal
 */
interface IngredientDetailProps {
  ingredient: Ingredient;
  onClose: () => void;
}

function IngredientDetail({ ingredient, onClose }: IngredientDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'studies' | 'interactions'>('overview');

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-xl h-full bg-white dark:bg-gray-900 shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {ingredient.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{ingredient.inciName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
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
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-4 -mb-4">
            {(['overview', 'studies', 'interactions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  pb-3 text-sm font-medium border-b-2 transition-colors
                  ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Category & Evidence */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                  {ingredient.category}
                </span>
                <span className="px-3 py-1 rounded-full text-sm bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                  {ingredient.evidenceLevel.replace(/_/g, ' ')}
                </span>
                <span className="px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                  {ingredient.knowledgeThreshold}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300">{ingredient.description}</p>
              </div>

              {/* Mechanism */}
              {ingredient.mechanism && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Mechanism of Action
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">{ingredient.mechanism}</p>
                </div>
              )}

              {/* Concern Targets */}
              {ingredient.concernTargets.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Targets
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {ingredient.concernTargets.map((target) => (
                      <div
                        key={target.concern}
                        className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                      >
                        <span className="text-sm text-purple-700 dark:text-purple-300">
                          {target.concern}
                        </span>
                        <div className="flex items-center gap-1">
                          <div className="w-16 h-1.5 bg-purple-200 dark:bg-purple-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-600 rounded-full"
                              style={{ width: `${target.effectiveness * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-purple-600 dark:text-purple-400">
                            {Math.round(target.effectiveness * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tensor Impacts */}
              {ingredient.tensorImpacts.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Skin Impact Profile
                  </h3>
                  <div className="space-y-2">
                    {ingredient.tensorImpacts.map((impact) => (
                      <div key={impact.dimension} className="flex items-center gap-3">
                        <span className="w-32 text-sm text-gray-600 dark:text-gray-400 truncate">
                          {impact.dimension
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, (s) => s.toUpperCase())
                            .trim()}
                        </span>
                        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full relative">
                          <div className="absolute inset-y-0 left-1/2 w-px bg-gray-300 dark:bg-gray-600" />
                          <div
                            className={`absolute inset-y-0 ${impact.impact > 0 ? 'left-1/2' : 'right-1/2'} rounded-full ${impact.impact > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.abs(impact.impact) * 50}%` }}
                          />
                        </div>
                        <span
                          className={`w-12 text-right text-sm font-medium ${impact.impact > 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {impact.impact > 0 ? '+' : ''}
                          {(impact.impact * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contraindications */}
              {ingredient.contraindications && ingredient.contraindications.length > 0 && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    Contraindications
                  </h3>
                  <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-400">
                    {ingredient.contraindications.map((c, i) => (
                      <li key={i}>• {c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {activeTab === 'studies' && (
            <>
              {ingredient.studies && ingredient.studies.length > 0 ? (
                <EvidenceAccordion
                  studies={ingredient.studies}
                  groupByType
                  title={`${ingredient.studyCount} Studies`}
                />
              ) : (
                <div className="text-center py-12">
                  <svg
                    className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400">
                    {ingredient.studyCount} studies referenced
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                    Full study data not loaded
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'interactions' && (
            <div className="space-y-6">
              {/* Synergistic */}
              {ingredient.synergisticWith && ingredient.synergisticWith.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Works Well With
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {ingredient.synergisticWith.map((name) => (
                      <div
                        key={name}
                        className="px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-300"
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Antagonistic */}
              {ingredient.antagonisticWith && ingredient.antagonisticWith.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2 mb-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                    Avoid Combining With
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {ingredient.antagonisticWith.map((name) => (
                      <div
                        key={name}
                        className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300"
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No interactions */}
              {(!ingredient.synergisticWith || ingredient.synergisticWith.length === 0) &&
                (!ingredient.antagonisticWith || ingredient.antagonisticWith.length === 0) && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">
                      No known interactions documented
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * IngredientLibrary - Main component
 */
export function IngredientLibrary({
  ingredients,
  loading = false,
  error = null,
  onLoadMore,
  hasMore = false,
  onSearch,
  categories,
  concerns,
  suggestions,
  className = '',
}: IngredientLibraryProps) {
  const [filters, setFilters] = useState<IngredientSearchFilters>(getDefaultFilters());
  const [viewMode, setViewMode] = useState<ViewMode>('scan');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Handle filter changes
  const handleFiltersChange = useCallback(
    (newFilters: IngredientSearchFilters) => {
      setFilters(newFilters);
      setCurrentPage(1);
      onSearch?.(newFilters);
    },
    [onSearch]
  );

  // Paginate ingredients
  const paginatedIngredients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return ingredients.slice(start, start + itemsPerPage);
  }, [ingredients, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(ingredients.length / itemsPerPage);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Ingredient Library
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Evidence-based skincare ingredient database with scientific research
          </p>
        </div>
        <ViewModeToggle mode={viewMode} onChange={setViewMode} />
      </div>

      {/* Search & Filters */}
      <IngredientSearch
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={categories}
        concerns={concerns}
        suggestions={suggestions}
        loading={loading}
        totalResults={ingredients.length}
      />

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Ingredient Grid */}
      <IngredientGrid
        ingredients={paginatedIngredients}
        viewMode={viewMode}
        loading={loading}
        onIngredientClick={setSelectedIngredient}
        onViewStudies={setSelectedIngredient}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Load More (for infinite scroll alternative) */}
      {hasMore && !loading && onLoadMore && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Load More
          </button>
        </div>
      )}

      {/* Detail Drawer */}
      {selectedIngredient && (
        <IngredientDetail
          ingredient={selectedIngredient}
          onClose={() => setSelectedIngredient(null)}
        />
      )}
    </div>
  );
}

export default IngredientLibrary;
