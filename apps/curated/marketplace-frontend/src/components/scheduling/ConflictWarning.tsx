/**
 * Conflict Warning Component
 * Phase 4: User Story 2 - Appointment Scheduling & Client Management
 * Task: T128
 *
 * Purpose: Display visual warnings for appointment conflicts
 * Features:
 * - Conflict type detection (provider, client, capacity, time)
 * - Visual severity indicators
 * - Detailed conflict messages
 * - Resolution suggestions
 */

import React from 'react';

/**
 * Conflict severity levels
 */
export type ConflictSeverity = 'error' | 'warning' | 'info';

/**
 * Conflict type
 */
export type ConflictType =
  | 'PROVIDER_UNAVAILABLE'
  | 'PROVIDER_AT_CAPACITY'
  | 'CLIENT_CONFLICT'
  | 'OUTSIDE_WORKING_HOURS'
  | 'BLOCKED_TIME'
  | 'MISSING_CONSENT'
  | 'SERVICE_NOT_OFFERED'
  | 'CONTRAINDICATION';

/**
 * Conflict data
 */
export interface AppointmentConflict {
  type: ConflictType;
  severity: ConflictSeverity;
  message: string;
  field?: string;
  suggestions?: string[];
  alternativeTimes?: Date[];
}

/**
 * Conflict Warning Props
 */
interface ConflictWarningProps {
  conflicts: AppointmentConflict[];
  onDismiss?: () => void;
  onSelectAlternative?: (time: Date) => void;
}

/**
 * Get icon for conflict type
 */
function getConflictIcon(type: ConflictType): string {
  const icons: Record<ConflictType, string> = {
    PROVIDER_UNAVAILABLE: '🚫',
    PROVIDER_AT_CAPACITY: '👥',
    CLIENT_CONFLICT: '📅',
    OUTSIDE_WORKING_HOURS: '🕐',
    BLOCKED_TIME: '⏸️',
    MISSING_CONSENT: '📝',
    SERVICE_NOT_OFFERED: '🚧',
    CONTRAINDICATION: '⚠️',
  };

  return icons[type] || '⚠️';
}

/**
 * Get color scheme for severity
 */
function getSeverityStyles(severity: ConflictSeverity): {
  containerClass: string;
  borderClass: string;
  iconClass: string;
  textClass: string;
} {
  const styles = {
    error: {
      containerClass: 'bg-red-50',
      borderClass: 'border-red-300',
      iconClass: 'text-red-600',
      textClass: 'text-red-800',
    },
    warning: {
      containerClass: 'bg-yellow-50',
      borderClass: 'border-yellow-300',
      iconClass: 'text-yellow-600',
      textClass: 'text-yellow-800',
    },
    info: {
      containerClass: 'bg-blue-50',
      borderClass: 'border-blue-300',
      iconClass: 'text-blue-600',
      textClass: 'text-blue-800',
    },
  };

  return styles[severity];
}

/**
 * Conflict Warning Component
 */
export default function ConflictWarning({
  conflicts,
  onDismiss,
  onSelectAlternative,
}: ConflictWarningProps) {
  if (conflicts.length === 0) return null;

  // Group conflicts by severity
  const errors = conflicts.filter((c) => c.severity === 'error');
  const warnings = conflicts.filter((c) => c.severity === 'warning');
  const infos = conflicts.filter((c) => c.severity === 'info');

  return (
    <div className="space-y-3">
      {/* Error conflicts */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((conflict, index) => (
            <ConflictItem
              key={`error-${index}`}
              conflict={conflict}
              onSelectAlternative={onSelectAlternative}
            />
          ))}
        </div>
      )}

      {/* Warning conflicts */}
      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((conflict, index) => (
            <ConflictItem
              key={`warning-${index}`}
              conflict={conflict}
              onSelectAlternative={onSelectAlternative}
            />
          ))}
        </div>
      )}

      {/* Info conflicts */}
      {infos.length > 0 && (
        <div className="space-y-2">
          {infos.map((conflict, index) => (
            <ConflictItem
              key={`info-${index}`}
              conflict={conflict}
              onSelectAlternative={onSelectAlternative}
            />
          ))}
        </div>
      )}

      {/* Dismiss button */}
      {onDismiss && (
        <div className="flex justify-end">
          <button
            onClick={onDismiss}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Individual conflict item
 */
function ConflictItem({
  conflict,
  onSelectAlternative,
}: {
  conflict: AppointmentConflict;
  onSelectAlternative?: (time: Date) => void;
}) {
  const styles = getSeverityStyles(conflict.severity);
  const icon = getConflictIcon(conflict.type);

  return (
    <div
      className={`${styles.containerClass} ${styles.borderClass} border-l-4 p-4 rounded-r-md`}
      role="alert"
    >
      <div className="flex items-start">
        {/* Icon */}
        <div className={`flex-shrink-0 ${styles.iconClass} text-2xl mr-3`}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Message */}
          <p className={`${styles.textClass} font-medium`}>{conflict.message}</p>

          {/* Suggestions */}
          {conflict.suggestions && conflict.suggestions.length > 0 && (
            <div className="mt-2">
              <p className={`${styles.textClass} text-sm font-semibold`}>
                Suggestions:
              </p>
              <ul className={`${styles.textClass} text-sm list-disc list-inside mt-1`}>
                {conflict.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Alternative times */}
          {conflict.alternativeTimes && conflict.alternativeTimes.length > 0 && (
            <div className="mt-3">
              <p className={`${styles.textClass} text-sm font-semibold mb-2`}>
                Alternative times available:
              </p>
              <div className="flex flex-wrap gap-2">
                {conflict.alternativeTimes.map((time, index) => (
                  <button
                    key={index}
                    onClick={() => onSelectAlternative?.(time)}
                    className={`px-3 py-1 text-sm rounded-md ${styles.textClass} bg-white border ${styles.borderClass} hover:bg-gray-50 transition-colors`}
                  >
                    {time.toLocaleString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Inline conflict badge for calendar time slots
 */
interface ConflictBadgeProps {
  conflictType: ConflictType;
  severity: ConflictSeverity;
  tooltip?: string;
}

export function ConflictBadge({ conflictType, severity, tooltip }: ConflictBadgeProps) {
  const styles = getSeverityStyles(severity);
  const icon = getConflictIcon(conflictType);

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles.containerClass} ${styles.textClass} border ${styles.borderClass}`}
      title={tooltip}
    >
      <span className="mr-1">{icon}</span>
      <span>{conflictType.replace(/_/g, ' ')}</span>
    </div>
  );
}

/**
 * Conflict summary badge (count indicator)
 */
interface ConflictSummaryProps {
  errorCount: number;
  warningCount: number;
  onClick?: () => void;
}

export function ConflictSummary({ errorCount, warningCount, onClick }: ConflictSummaryProps) {
  if (errorCount === 0 && warningCount === 0) return null;

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200 transition-colors"
    >
      <span className="mr-2">⚠️</span>
      {errorCount > 0 && (
        <span className="mr-2">
          {errorCount} error{errorCount !== 1 ? 's' : ''}
        </span>
      )}
      {warningCount > 0 && (
        <span>
          {warningCount} warning{warningCount !== 1 ? 's' : ''}
        </span>
      )}
    </button>
  );
}

/**
 * Time slot conflict indicator (for calendar grid)
 */
interface TimeSlotConflictProps {
  hasConflict: boolean;
  conflictSeverity?: ConflictSeverity;
  tooltip?: string;
}

export function TimeSlotConflict({
  hasConflict,
  conflictSeverity = 'warning',
  tooltip,
}: TimeSlotConflictProps) {
  if (!hasConflict) return null;

  const styles = getSeverityStyles(conflictSeverity);

  return (
    <div
      className={`absolute top-0 right-0 w-3 h-3 rounded-full ${styles.containerClass} border-2 ${styles.borderClass}`}
      title={tooltip}
    />
  );
}
