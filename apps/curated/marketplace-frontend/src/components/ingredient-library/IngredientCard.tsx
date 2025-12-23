/**
 * IngredientCard Component
 *
 * DermaLogica Intelligence MVP - Phase 5: Ingredient Library
 *
 * Displays individual ingredient information with:
 * - Evidence level indicator
 * - Knowledge threshold badge
 * - Tensor impact mini-visualization
 * - Progressive disclosure (Glance/Scan/Study)
 * - Skin concern tags
 */

import React, { useState } from 'react';

/**
 * Evidence Level enum matching backend
 * 7 tiers from ANECDOTAL to GOLD_STANDARD
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
 * Knowledge Threshold T1-T8
 */
export type KnowledgeThreshold = 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7' | 'T8';

/**
 * Tensor impact on skin dimensions
 */
export interface TensorImpact {
  dimension: string;
  impact: number; // -1 to 1, negative = reduces, positive = increases
  confidence: number; // 0 to 1
}

/**
 * Skin concern targeting
 */
export interface ConcernTarget {
  concern: string;
  effectiveness: number; // 0 to 1
}

/**
 * Study/Citation reference
 */
export interface StudyReference {
  id: string;
  title: string;
  authors: string[];
  journal?: string;
  year: number;
  doi?: string;
  abstract?: string;
}

/**
 * Ingredient data structure
 */
export interface Ingredient {
  id: string;
  name: string;
  inciName: string;
  aliases?: string[];
  category: string;
  description: string;
  mechanism?: string;
  evidenceLevel: EvidenceLevel;
  knowledgeThreshold: KnowledgeThreshold;
  tensorImpacts: TensorImpact[];
  concernTargets: ConcernTarget[];
  contraindications?: string[];
  synergisticWith?: string[];
  antagonisticWith?: string[];
  studies?: StudyReference[];
  studyCount: number;
  safetyRating?: number; // 1-5
  popularityScore?: number;
}

export interface IngredientCardProps {
  /** The ingredient to display */
  ingredient: Ingredient;
  /** View mode: glance (minimal), scan (moderate), study (detailed) */
  viewMode?: 'glance' | 'scan' | 'study';
  /** Callback when card is clicked */
  onClick?: () => void;
  /** Callback when "View Studies" is clicked */
  onViewStudies?: () => void;
  /** Custom class name */
  className?: string;
  /** Whether to show tensor impacts */
  showTensorImpacts?: boolean;
}

/**
 * Evidence level metadata
 */
const EVIDENCE_LEVELS: Record<
  EvidenceLevel,
  { label: string; color: string; bgColor: string; level: number }
> = {
  ANECDOTAL: {
    label: 'Anecdotal',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    level: 1,
  },
  OBSERVATIONAL: {
    label: 'Observational',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    level: 2,
  },
  IN_VITRO: {
    label: 'In Vitro',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100',
    level: 3,
  },
  ANIMAL_STUDY: {
    label: 'Animal Study',
    color: 'text-teal-600',
    bgColor: 'bg-teal-100',
    level: 4,
  },
  SMALL_CLINICAL: {
    label: 'Small Clinical',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    level: 5,
  },
  LARGE_CLINICAL: {
    label: 'Large Clinical',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    level: 6,
  },
  GOLD_STANDARD: {
    label: 'Gold Standard',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    level: 7,
  },
};

/**
 * Knowledge threshold metadata
 */
const KNOWLEDGE_THRESHOLDS: Record<
  KnowledgeThreshold,
  { label: string; description: string; color: string }
> = {
  T1: { label: 'T1', description: 'Basic consumer knowledge', color: 'bg-green-500' },
  T2: { label: 'T2', description: 'Informed consumer', color: 'bg-green-400' },
  T3: { label: 'T3', description: 'Skincare enthusiast', color: 'bg-lime-500' },
  T4: { label: 'T4', description: 'Advanced enthusiast', color: 'bg-yellow-500' },
  T5: { label: 'T5', description: 'Esthetician level', color: 'bg-amber-500' },
  T6: { label: 'T6', description: 'Advanced professional', color: 'bg-orange-500' },
  T7: { label: 'T7', description: 'Formulator level', color: 'bg-red-500' },
  T8: { label: 'T8', description: 'Research scientist', color: 'bg-purple-500' },
};

/**
 * Evidence Level Meter - Visual indicator of evidence strength
 */
function EvidenceMeter({ level }: { level: EvidenceLevel }) {
  const evidence = EVIDENCE_LEVELS[level];
  const maxLevel = 7;

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: maxLevel }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-4 rounded-sm transition-colors ${
              i < evidence.level
                ? level === 'GOLD_STANDARD'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${evidence.color}`}>{evidence.label}</span>
    </div>
  );
}

/**
 * Tensor Impact Bar - Shows impact on a single dimension
 */
function TensorImpactBar({ impact }: { impact: TensorImpact }) {
  const percentage = Math.abs(impact.impact) * 50;
  const isPositive = impact.impact > 0;

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-24 text-gray-600 dark:text-gray-400 truncate" title={impact.dimension}>
        {formatDimensionName(impact.dimension)}
      </span>
      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden relative">
        <div className="absolute inset-y-0 left-1/2 w-px bg-gray-300 dark:bg-gray-600" />
        <div
          className={`absolute inset-y-0 ${
            isPositive ? 'left-1/2' : 'right-1/2'
          } rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span
        className={`w-10 text-right font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {isPositive ? '+' : ''}
        {(impact.impact * 100).toFixed(0)}%
      </span>
    </div>
  );
}

/**
 * Format camelCase dimension name to Title Case
 */
function formatDimensionName(dimension: string): string {
  return dimension.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();
}

/**
 * IngredientCard - Displays ingredient with progressive disclosure
 */
export function IngredientCard({
  ingredient,
  viewMode = 'scan',
  onClick,
  onViewStudies,
  className = '',
  showTensorImpacts = true,
}: IngredientCardProps) {
  const [expanded, setExpanded] = useState(false);
  const evidence = EVIDENCE_LEVELS[ingredient.evidenceLevel];
  const threshold = KNOWLEDGE_THRESHOLDS[ingredient.knowledgeThreshold];

  // Sort tensor impacts by absolute impact value
  const sortedImpacts = [...ingredient.tensorImpacts].sort(
    (a, b) => Math.abs(b.impact) - Math.abs(a.impact)
  );
  const topImpacts = sortedImpacts.slice(0, 4);

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
        shadow-sm hover:shadow-md transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {ingredient.name}
              </h3>
              {/* Knowledge Threshold Badge */}
              <span
                className={`px-1.5 py-0.5 text-xs font-bold text-white rounded ${threshold.color}`}
                title={threshold.description}
              >
                {threshold.label}
              </span>
            </div>
            {viewMode !== 'glance' && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {ingredient.inciName}
              </p>
            )}
          </div>

          {/* Evidence Meter */}
          <EvidenceMeter level={ingredient.evidenceLevel} />
        </div>

        {/* Category & Study Count */}
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
            {ingredient.category}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {ingredient.studyCount} {ingredient.studyCount === 1 ? 'study' : 'studies'}
          </span>
          {ingredient.safetyRating && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Safety: {ingredient.safetyRating}/5
            </span>
          )}
        </div>
      </div>

      {/* Body - Scan/Study Mode */}
      {viewMode !== 'glance' && (
        <div className="p-4 space-y-4">
          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
            {ingredient.description}
          </p>

          {/* Concern Targets */}
          {ingredient.concernTargets.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {ingredient.concernTargets.slice(0, 5).map((target) => (
                <span
                  key={target.concern}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                >
                  {target.concern}
                  <span className="ml-1 opacity-70">{Math.round(target.effectiveness * 100)}%</span>
                </span>
              ))}
              {ingredient.concernTargets.length > 5 && (
                <span className="text-xs text-gray-500">
                  +{ingredient.concernTargets.length - 5} more
                </span>
              )}
            </div>
          )}

          {/* Tensor Impacts */}
          {showTensorImpacts && topImpacts.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Skin Impact
              </h4>
              <div className="space-y-1.5">
                {topImpacts.map((impact) => (
                  <TensorImpactBar key={impact.dimension} impact={impact} />
                ))}
              </div>
            </div>
          )}

          {/* Expanded Study Mode Content */}
          {viewMode === 'study' && (
            <>
              {/* Mechanism of Action */}
              {ingredient.mechanism && (
                <div>
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Mechanism of Action
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {ingredient.mechanism}
                  </p>
                </div>
              )}

              {/* Interactions */}
              <div className="grid grid-cols-2 gap-4">
                {ingredient.synergisticWith && ingredient.synergisticWith.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                      Works well with
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {ingredient.synergisticWith.map((name) => (
                        <span
                          key={name}
                          className="text-xs px-1.5 py-0.5 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {ingredient.antagonisticWith && ingredient.antagonisticWith.length > 0 && (
                  <div>
                    <h4 className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">
                      Avoid combining with
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {ingredient.antagonisticWith.map((name) => (
                        <span
                          key={name}
                          className="text-xs px-1.5 py-0.5 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contraindications */}
              {ingredient.contraindications && ingredient.contraindications.length > 0 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <h4 className="text-xs font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1 mb-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    Contraindications
                  </h4>
                  <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-0.5">
                    {ingredient.contraindications.map((c, i) => (
                      <li key={i}>• {c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Footer Actions */}
      {viewMode !== 'glance' && (
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
          >
            {viewMode === 'study' ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                Less detail
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                More detail
              </>
            )}
          </button>

          {ingredient.studyCount > 0 && onViewStudies && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewStudies();
              }}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
            >
              View Studies
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * IngredientCardSkeleton - Loading state
 */
export function IngredientCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48" />
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="w-2 h-4 bg-gray-200 dark:bg-gray-700 rounded-sm" />
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * IngredientGrid - Grid layout for multiple ingredient cards
 */
export interface IngredientGridProps {
  /** Array of ingredients to display */
  ingredients: Ingredient[];
  /** View mode for all cards */
  viewMode?: 'glance' | 'scan' | 'study';
  /** Callback when ingredient is clicked */
  onIngredientClick?: (ingredient: Ingredient) => void;
  /** Callback when "View Studies" is clicked */
  onViewStudies?: (ingredient: Ingredient) => void;
  /** Loading state */
  loading?: boolean;
  /** Number of skeleton items to show while loading */
  skeletonCount?: number;
  /** Custom class name */
  className?: string;
}

export function IngredientGrid({
  ingredients,
  viewMode = 'scan',
  onIngredientClick,
  onViewStudies,
  loading = false,
  skeletonCount = 6,
  className = '',
}: IngredientGridProps) {
  if (loading) {
    return (
      <div
        className={`grid gap-4 ${
          viewMode === 'glance'
            ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        } ${className}`}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <IngredientCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (ingredients.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <svg
          className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
          No ingredients found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-4 ${
        viewMode === 'glance'
          ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      } ${className}`}
    >
      {ingredients.map((ingredient) => (
        <IngredientCard
          key={ingredient.id}
          ingredient={ingredient}
          viewMode={viewMode}
          onClick={() => onIngredientClick?.(ingredient)}
          onViewStudies={() => onViewStudies?.(ingredient)}
        />
      ))}
    </div>
  );
}

export default IngredientCard;
