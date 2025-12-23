/**
 * CompatibilityMatrix Component
 *
 * DermaLogica Intelligence MVP - Phase 6: Compatibility Analyzer
 *
 * Displays pairwise interaction grid for products/ingredients:
 * - Color-coded cells (synergy=green, neutral=gray, conflict=red)
 * - Click to expand interaction details
 * - Hover tooltips with quick summary
 * - Overall compatibility score
 */

import React, { useMemo } from 'react';

/**
 * Interaction type classification
 */
export type InteractionType =
  | 'STRONG_SYNERGY'
  | 'MILD_SYNERGY'
  | 'NEUTRAL'
  | 'MILD_CONFLICT'
  | 'STRONG_CONFLICT'
  | 'UNKNOWN';

/**
 * Individual pairwise interaction
 */
export interface Interaction {
  itemAId: string;
  itemBId: string;
  type: InteractionType;
  score: number; // -1 to 1 (-1=strong conflict, 0=neutral, 1=strong synergy)
  summary: string;
  mechanism?: string;
  recommendation?: string;
  waitTime?: number; // Minutes to wait between application
  evidence?: {
    level: string;
    studyCount: number;
  };
}

/**
 * Item in the matrix (product or ingredient)
 */
export interface MatrixItem {
  id: string;
  name: string;
  shortName?: string;
  type: 'product' | 'ingredient';
}

export interface CompatibilityMatrixProps {
  /** Items to compare */
  items: MatrixItem[];
  /** Pairwise interactions */
  interactions: Interaction[];
  /** Overall compatibility score (0-100) */
  overallScore?: number;
  /** Callback when cell is clicked */
  onCellClick?: (itemA: MatrixItem, itemB: MatrixItem, interaction: Interaction | null) => void;
  /** Whether to show the score header */
  showScoreHeader?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Interaction type metadata
 */
const INTERACTION_INFO: Record<
  InteractionType,
  { label: string; color: string; bgColor: string; textColor: string; icon: string }
> = {
  STRONG_SYNERGY: {
    label: 'Strong Synergy',
    color: '#10B981',
    bgColor: 'bg-emerald-500',
    textColor: 'text-white',
    icon: '++',
  },
  MILD_SYNERGY: {
    label: 'Mild Synergy',
    color: '#34D399',
    bgColor: 'bg-emerald-300',
    textColor: 'text-emerald-900',
    icon: '+',
  },
  NEUTRAL: {
    label: 'Neutral',
    color: '#9CA3AF',
    bgColor: 'bg-gray-300',
    textColor: 'text-gray-700',
    icon: '=',
  },
  MILD_CONFLICT: {
    label: 'Mild Conflict',
    color: '#FBBF24',
    bgColor: 'bg-amber-400',
    textColor: 'text-amber-900',
    icon: '-',
  },
  STRONG_CONFLICT: {
    label: 'Strong Conflict',
    color: '#EF4444',
    bgColor: 'bg-red-500',
    textColor: 'text-white',
    icon: '!',
  },
  UNKNOWN: {
    label: 'Unknown',
    color: '#D1D5DB',
    bgColor: 'bg-gray-200',
    textColor: 'text-gray-500',
    icon: '?',
  },
};

/**
 * Get overall score color
 */
function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-green-600';
  if (score >= 40) return 'text-amber-600';
  if (score >= 20) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Get score background gradient
 */
function getScoreGradient(score: number): string {
  if (score >= 80) return 'from-emerald-500 to-emerald-600';
  if (score >= 60) return 'from-green-500 to-green-600';
  if (score >= 40) return 'from-amber-500 to-amber-600';
  if (score >= 20) return 'from-orange-500 to-orange-600';
  return 'from-red-500 to-red-600';
}

/**
 * MatrixCell - Individual cell in the matrix
 */
interface MatrixCellProps {
  interaction: Interaction | null;
  onClick?: () => void;
  isDiagonal?: boolean;
}

function MatrixCell({ interaction, onClick, isDiagonal }: MatrixCellProps) {
  if (isDiagonal) {
    return (
      <div className="w-full h-full bg-gray-100 dark:bg-gray-800 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-gray-300 dark:bg-gray-600 transform rotate-45" />
        </div>
      </div>
    );
  }

  const info = interaction ? INTERACTION_INFO[interaction.type] : INTERACTION_INFO.UNKNOWN;

  return (
    <button
      onClick={onClick}
      className={`
        w-full h-full ${info.bgColor} ${info.textColor}
        flex items-center justify-center
        hover:ring-2 hover:ring-blue-500 hover:ring-inset
        transition-all duration-150
        group relative
      `}
      title={interaction?.summary || 'Unknown interaction'}
    >
      <span className="font-bold text-lg">{info.icon}</span>

      {/* Tooltip */}
      <div className="absolute z-30 hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs rounded-lg p-2 shadow-lg">
          <div className="font-medium mb-1">{info.label}</div>
          {interaction?.summary && (
            <div className="text-gray-300 line-clamp-2">{interaction.summary}</div>
          )}
          {interaction?.waitTime && interaction.waitTime > 0 && (
            <div className="mt-1 text-amber-300">
              Wait {interaction.waitTime}min between use
            </div>
          )}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
            <div className="border-8 border-transparent border-t-gray-900" />
          </div>
        </div>
      </div>
    </button>
  );
}

/**
 * CompatibilityMatrix - Main component
 */
export function CompatibilityMatrix({
  items,
  interactions,
  overallScore,
  onCellClick,
  showScoreHeader = true,
  className = '',
}: CompatibilityMatrixProps) {
  // Build interaction lookup map
  const interactionMap = useMemo(() => {
    const map = new Map<string, Interaction>();
    for (const interaction of interactions) {
      // Store both directions for easy lookup
      map.set(`${interaction.itemAId}:${interaction.itemBId}`, interaction);
      map.set(`${interaction.itemBId}:${interaction.itemAId}`, interaction);
    }
    return map;
  }, [interactions]);

  // Get interaction for a pair
  const getInteraction = (itemA: MatrixItem, itemB: MatrixItem): Interaction | null => {
    return interactionMap.get(`${itemA.id}:${itemB.id}`) || null;
  };

  // Count interaction types
  const interactionCounts = useMemo(() => {
    const counts: Record<InteractionType, number> = {
      STRONG_SYNERGY: 0,
      MILD_SYNERGY: 0,
      NEUTRAL: 0,
      MILD_CONFLICT: 0,
      STRONG_CONFLICT: 0,
      UNKNOWN: 0,
    };

    for (const interaction of interactions) {
      counts[interaction.type]++;
    }

    return counts;
  }, [interactions]);

  if (items.length < 2) {
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
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
          Select at least 2 items
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Add products or ingredients to see compatibility analysis
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Score Header */}
      {showScoreHeader && overallScore !== undefined && (
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Overall Compatibility
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {items.length} items, {interactions.length} interactions analyzed
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Interaction summary */}
            <div className="flex items-center gap-2">
              {interactionCounts.STRONG_SYNERGY + interactionCounts.MILD_SYNERGY > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    {interactionCounts.STRONG_SYNERGY + interactionCounts.MILD_SYNERGY} synergies
                  </span>
                </div>
              )}
              {interactionCounts.STRONG_CONFLICT + interactionCounts.MILD_CONFLICT > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-red-600 dark:text-red-400 font-medium">
                    {interactionCounts.STRONG_CONFLICT + interactionCounts.MILD_CONFLICT} conflicts
                  </span>
                </div>
              )}
            </div>

            {/* Score badge */}
            <div
              className={`
                relative w-20 h-20 rounded-full
                bg-gradient-to-br ${getScoreGradient(overallScore)}
                flex items-center justify-center shadow-lg
              `}
            >
              <div className="absolute inset-1 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                    {overallScore}
                  </div>
                  <div className="text-xs text-gray-500">/ 100</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Matrix Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div
            className="grid gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden"
            style={{
              gridTemplateColumns: `auto repeat(${items.length}, minmax(60px, 1fr))`,
              gridTemplateRows: `auto repeat(${items.length}, minmax(60px, 1fr))`,
            }}
          >
            {/* Empty corner */}
            <div className="bg-white dark:bg-gray-800 p-2" />

            {/* Column headers */}
            {items.map((item) => (
              <div
                key={`col-${item.id}`}
                className="bg-white dark:bg-gray-800 p-2 flex items-center justify-center"
              >
                <span
                  className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center truncate max-w-[80px] transform -rotate-45 origin-center"
                  title={item.name}
                >
                  {item.shortName || item.name}
                </span>
              </div>
            ))}

            {/* Rows */}
            {items.map((rowItem, rowIndex) => (
              <React.Fragment key={`row-${rowItem.id}`}>
                {/* Row header */}
                <div className="bg-white dark:bg-gray-800 p-2 flex items-center justify-end">
                  <span
                    className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[100px]"
                    title={rowItem.name}
                  >
                    {rowItem.shortName || rowItem.name}
                  </span>
                </div>

                {/* Cells */}
                {items.map((colItem, colIndex) => {
                  const isDiagonal = rowIndex === colIndex;
                  const interaction = isDiagonal ? null : getInteraction(rowItem, colItem);

                  return (
                    <div key={`cell-${rowItem.id}-${colItem.id}`} className="aspect-square">
                      <MatrixCell
                        interaction={interaction}
                        isDiagonal={isDiagonal}
                        onClick={
                          !isDiagonal && onCellClick
                            ? () => onCellClick(rowItem, colItem, interaction)
                            : undefined
                        }
                      />
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        {Object.entries(INTERACTION_INFO).map(([type, info]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div
              className={`w-5 h-5 rounded ${info.bgColor} ${info.textColor} flex items-center justify-center text-xs font-bold`}
            >
              {info.icon}
            </div>
            <span className="text-gray-600 dark:text-gray-400">{info.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompatibilityMatrix;
