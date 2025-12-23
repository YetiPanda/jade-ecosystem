/**
 * InsightCard Component
 *
 * DermaLogica Intelligence MVP - Phase 4: Skin Dashboard
 *
 * Displays individual skin health insights with:
 * - Priority-based styling
 * - Type-specific icons
 * - Related concerns and tensor dimensions
 * - Actionable call-to-action buttons
 */

import React from 'react';

/**
 * Skin concern enum matching backend
 */
export type SkinConcern =
  | 'ACNE'
  | 'AGING'
  | 'DARK_SPOTS'
  | 'DRYNESS'
  | 'DULLNESS'
  | 'ENLARGED_PORES'
  | 'FINE_LINES'
  | 'HYPERPIGMENTATION'
  | 'OILINESS'
  | 'REDNESS'
  | 'SENSITIVITY'
  | 'TEXTURE'
  | 'WRINKLES'
  | 'DEHYDRATION'
  | 'DARK_CIRCLES'
  | 'SAGGING';

/**
 * Insight data structure matching backend
 */
export interface SkinInsight {
  type: 'recommendation' | 'warning' | 'info' | 'progress';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  relatedConcerns?: SkinConcern[];
  relatedTensorDimensions?: string[];
  actionable?: boolean;
  actionText?: string;
}

export interface InsightCardProps {
  /** The insight to display */
  insight: SkinInsight;
  /** Callback when action button is clicked */
  onAction?: () => void;
  /** Callback when card is clicked */
  onClick?: () => void;
  /** Whether the card is in compact mode */
  compact?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Get icon for insight type
 */
function getTypeIcon(type: SkinInsight['type']): React.ReactNode {
  switch (type) {
    case 'recommendation':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    case 'warning':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case 'info':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'progress':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
}

/**
 * Get styling classes for priority
 */
function getPriorityStyles(priority: SkinInsight['priority']): {
  border: string;
  bg: string;
  iconBg: string;
  iconColor: string;
  badgeColor: string;
} {
  switch (priority) {
    case 'high':
      return {
        border: 'border-red-200 dark:border-red-800',
        bg: 'bg-red-50 dark:bg-red-900/20',
        iconBg: 'bg-red-100 dark:bg-red-900/50',
        iconColor: 'text-red-600 dark:text-red-400',
        badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
      };
    case 'medium':
      return {
        border: 'border-amber-200 dark:border-amber-800',
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        iconBg: 'bg-amber-100 dark:bg-amber-900/50',
        iconColor: 'text-amber-600 dark:text-amber-400',
        badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
      };
    case 'low':
      return {
        border: 'border-green-200 dark:border-green-800',
        bg: 'bg-green-50 dark:bg-green-900/20',
        iconBg: 'bg-green-100 dark:bg-green-900/50',
        iconColor: 'text-green-600 dark:text-green-400',
        badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
      };
    default:
      return {
        border: 'border-gray-200 dark:border-gray-700',
        bg: 'bg-gray-50 dark:bg-gray-800',
        iconBg: 'bg-gray-100 dark:bg-gray-700',
        iconColor: 'text-gray-600 dark:text-gray-400',
        badgeColor: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
      };
  }
}

/**
 * Format concern name for display
 */
function formatConcernName(concern: SkinConcern): string {
  return concern
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Format tensor dimension name for display
 */
function formatDimensionName(dimension: string): string {
  // Convert camelCase to Title Case
  return dimension
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * InsightCard - Displays a single skin health insight
 */
export function InsightCard({
  insight,
  onAction,
  onClick,
  compact = false,
  className = '',
}: InsightCardProps) {
  const styles = getPriorityStyles(insight.priority);

  return (
    <div
      className={`
        rounded-lg border ${styles.border} ${styles.bg}
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
        ${compact ? 'p-3' : 'p-4'}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 p-2 rounded-lg ${styles.iconBg} ${styles.iconColor}`}>
          {getTypeIcon(insight.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <h4 className={`font-medium text-gray-900 dark:text-gray-100 ${compact ? 'text-sm' : ''}`}>
              {insight.title}
            </h4>
            <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${styles.badgeColor}`}>
              {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)}
            </span>
          </div>

          {/* Description */}
          <p className={`mt-1 text-gray-600 dark:text-gray-400 ${compact ? 'text-xs line-clamp-2' : 'text-sm'}`}>
            {insight.description}
          </p>

          {/* Related tags */}
          {!compact && (insight.relatedConcerns?.length || insight.relatedTensorDimensions?.length) && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {insight.relatedConcerns?.map((concern) => (
                <span
                  key={concern}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                >
                  {formatConcernName(concern)}
                </span>
              ))}
              {insight.relatedTensorDimensions?.map((dim) => (
                <span
                  key={dim}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                >
                  {formatDimensionName(dim)}
                </span>
              ))}
            </div>
          )}

          {/* Action button */}
          {insight.actionable && insight.actionText && !compact && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAction?.();
              }}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {insight.actionText}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * InsightList - Displays a list of insights
 */
export interface InsightListProps {
  /** Array of insights to display */
  insights: SkinInsight[];
  /** Maximum number of insights to show */
  limit?: number;
  /** Whether to use compact cards */
  compact?: boolean;
  /** Callback when action button is clicked */
  onAction?: (insight: SkinInsight) => void;
  /** Callback when card is clicked */
  onInsightClick?: (insight: SkinInsight) => void;
  /** Custom class name */
  className?: string;
  /** Empty state message */
  emptyMessage?: string;
}

export function InsightList({
  insights,
  limit,
  compact = false,
  onAction,
  onInsightClick,
  className = '',
  emptyMessage = 'No insights available',
}: InsightListProps) {
  const displayedInsights = limit ? insights.slice(0, limit) : insights;

  if (displayedInsights.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 dark:text-gray-400 ${className}`}>
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
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {displayedInsights.map((insight, index) => (
        <InsightCard
          key={`${insight.title}-${index}`}
          insight={insight}
          compact={compact}
          onAction={() => onAction?.(insight)}
          onClick={() => onInsightClick?.(insight)}
        />
      ))}
      {limit && insights.length > limit && (
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 pt-2">
          +{insights.length - limit} more insights
        </p>
      )}
    </div>
  );
}

export default InsightCard;
