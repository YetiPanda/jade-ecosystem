/**
 * ConflictWarning Component
 *
 * DermaLogica Intelligence MVP - Phase 6: Compatibility Analyzer
 *
 * Displays negative ingredient/product interactions:
 * - Severity indicator (mild, moderate, severe)
 * - Conflict type classification
 * - Mitigation advice
 * - Link to causal map for deeper understanding
 */

import React from 'react';

/**
 * Conflict type classification
 */
export type ConflictType =
  | 'INACTIVATION' // One inactivates the other
  | 'IRRITATION' // Combined causes irritation
  | 'PH_INCOMPATIBLE' // pH requirements conflict
  | 'OXIDATION' // One causes oxidation of the other
  | 'PRECIPITATION' // Form insoluble precipitate
  | 'ABSORPTION_BLOCK' // One blocks absorption of other
  | 'OVEREXFOLIATION'; // Combined over-exfoliation risk

/**
 * Conflict severity level
 */
export type ConflictSeverity = 'mild' | 'moderate' | 'severe';

/**
 * Conflict data structure
 */
export interface Conflict {
  id: string;
  itemAId: string;
  itemAName: string;
  itemBId: string;
  itemBName: string;
  type: ConflictType;
  severity: ConflictSeverity;
  mechanism: string;
  risks: string[];
  mitigation?: {
    canUseAlternating?: boolean;
    waitTimeBetween?: number; // Minutes
    alternateProducts?: string[];
    advice: string;
  };
  evidence?: {
    level: string;
    studyCount: number;
  };
}

export interface ConflictWarningProps {
  /** The conflict to display */
  conflict: Conflict;
  /** Callback when card is clicked */
  onClick?: () => void;
  /** Callback when "View Causal Map" is clicked */
  onViewCausalMap?: () => void;
  /** Whether to show compact view */
  compact?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Conflict type metadata
 */
const CONFLICT_TYPE_INFO: Record<
  ConflictType,
  { label: string; icon: React.ReactNode; description: string }
> = {
  INACTIVATION: {
    label: 'Inactivation',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    description: 'One ingredient deactivates the other',
  },
  IRRITATION: {
    label: 'Irritation Risk',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    description: 'Combined use may cause skin irritation',
  },
  PH_INCOMPATIBLE: {
    label: 'pH Incompatible',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    description: 'pH requirements conflict',
  },
  OXIDATION: {
    label: 'Oxidation',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    description: 'One causes oxidation of the other',
  },
  PRECIPITATION: {
    label: 'Precipitation',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    description: 'Forms insoluble particles',
  },
  ABSORPTION_BLOCK: {
    label: 'Absorption Block',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    description: 'One blocks absorption of the other',
  },
  OVEREXFOLIATION: {
    label: 'Over-exfoliation',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    description: 'Combined exfoliation may be too harsh',
  },
};

/**
 * Severity metadata
 */
const SEVERITY_INFO: Record<
  ConflictSeverity,
  { label: string; color: string; bgColor: string; borderColor: string; textColor: string }
> = {
  mild: {
    label: 'Mild',
    color: '#F59E0B',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-200 dark:border-amber-800',
    textColor: 'text-amber-700 dark:text-amber-400',
  },
  moderate: {
    label: 'Moderate',
    color: '#F97316',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-700 dark:text-orange-400',
  },
  severe: {
    label: 'Severe',
    color: '#EF4444',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
    textColor: 'text-red-700 dark:text-red-400',
  },
};

/**
 * ConflictWarning - Displays negative interaction warning
 */
export function ConflictWarning({
  conflict,
  onClick,
  onViewCausalMap,
  compact = false,
  className = '',
}: ConflictWarningProps) {
  const typeInfo = CONFLICT_TYPE_INFO[conflict.type];
  const severityInfo = SEVERITY_INFO[conflict.severity];

  return (
    <div
      className={`
        ${severityInfo.bgColor} rounded-xl border-2 ${severityInfo.borderColor}
        shadow-sm hover:shadow-md transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Header */}
      <div className={`p-4 border-b ${severityInfo.borderColor}`}>
        <div className="flex items-start justify-between gap-3">
          {/* Severity badge */}
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${severityInfo.bgColor} ${severityInfo.textColor}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <span className={`font-semibold ${severityInfo.textColor}`}>
                {severityInfo.label} Conflict
              </span>
              <span className={`block text-xs ${severityInfo.textColor} opacity-75`}>
                {typeInfo.label}
              </span>
            </div>
          </div>

          {/* Type icon */}
          <div className={`p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 ${severityInfo.textColor}`}>
            {typeInfo.icon}
          </div>
        </div>

        {/* Item names */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {conflict.itemAName}
          </span>
          <svg className={`w-4 h-4 ${severityInfo.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {conflict.itemBName}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className={`p-4 ${compact ? 'space-y-2' : 'space-y-3'}`}>
        {/* Mechanism */}
        <div>
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Why they conflict
          </h4>
          <p className={`text-sm text-gray-700 dark:text-gray-300 ${compact ? 'line-clamp-2' : ''}`}>
            {conflict.mechanism}
          </p>
        </div>

        {/* Risks */}
        {!compact && conflict.risks.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Potential risks
            </h4>
            <ul className="space-y-1">
              {conflict.risks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className={`w-4 h-4 ${severityInfo.textColor} flex-shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mitigation */}
        {conflict.mitigation && (
          <div className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <h4 className="text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wide mb-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              How to mitigate
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              {conflict.mitigation.advice}
            </p>

            <div className="flex flex-wrap gap-3 text-xs">
              {conflict.mitigation.canUseAlternating && (
                <div className="flex items-center gap-1 text-green-700 dark:text-green-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Can alternate days
                </div>
              )}
              {conflict.mitigation.waitTimeBetween && (
                <div className="flex items-center gap-1 text-blue-700 dark:text-blue-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Wait {conflict.mitigation.waitTimeBetween} min
                </div>
              )}
            </div>

            {/* Alternative suggestions */}
            {!compact && conflict.mitigation.alternateProducts && conflict.mitigation.alternateProducts.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Consider instead:{' '}
                </span>
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  {conflict.mitigation.alternateProducts.join(', ')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Evidence */}
        {conflict.evidence && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>
              {conflict.evidence.level} • {conflict.evidence.studyCount}{' '}
              {conflict.evidence.studyCount === 1 ? 'study' : 'studies'}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      {onViewCausalMap && (
        <div className={`px-4 py-3 border-t ${severityInfo.borderColor}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewCausalMap();
            }}
            className={`text-sm font-medium ${severityInfo.textColor} hover:opacity-80 flex items-center gap-1`}
          >
            Explore in Causal Map
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * ConflictList - Display multiple conflicts
 */
export interface ConflictListProps {
  conflicts: Conflict[];
  onConflictClick?: (conflict: Conflict) => void;
  onViewCausalMap?: (conflict: Conflict) => void;
  compact?: boolean;
  limit?: number;
  className?: string;
}

export function ConflictList({
  conflicts,
  onConflictClick,
  onViewCausalMap,
  compact = false,
  limit,
  className = '',
}: ConflictListProps) {
  // Sort by severity (severe first)
  const sortedConflicts = [...conflicts].sort((a, b) => {
    const severityOrder: Record<ConflictSeverity, number> = { severe: 0, moderate: 1, mild: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  const displayedConflicts = limit ? sortedConflicts.slice(0, limit) : sortedConflicts;

  if (conflicts.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 dark:text-gray-400 ${className}`}>
        <svg className="w-12 h-12 mx-auto mb-3 text-green-300 dark:text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-green-600 dark:text-green-400 font-medium">No conflicts detected</p>
        <p className="text-sm">Your selection is compatible</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {displayedConflicts.map((conflict) => (
        <ConflictWarning
          key={conflict.id}
          conflict={conflict}
          onClick={onConflictClick ? () => onConflictClick(conflict) : undefined}
          onViewCausalMap={onViewCausalMap ? () => onViewCausalMap(conflict) : undefined}
          compact={compact}
        />
      ))}
      {limit && conflicts.length > limit && (
        <p className="text-sm text-center text-red-500 dark:text-red-400 pt-2">
          +{conflicts.length - limit} more conflicts
        </p>
      )}
    </div>
  );
}

export default ConflictWarning;
