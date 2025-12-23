/**
 * Onboarding Progress Bar Component
 * Feature 011: Vendor Portal MVP
 * Sprint E.1: Application & Onboarding (Task E.1.10)
 *
 * Compact, reusable progress indicator for onboarding status.
 * Can be used in headers, dashboards, or sidebars.
 * Shows completion percentage, steps completed, and target date.
 */

import { AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface OnboardingProgressBarProps {
  completedSteps: number;
  totalSteps: number;
  percentComplete: number;
  targetCompletionDate?: Date | null;
  requiredStepsRemaining?: number;
  compact?: boolean;
  showTarget?: boolean;
  className?: string;
}

export function OnboardingProgressBar({
  completedSteps,
  totalSteps,
  percentComplete,
  targetCompletionDate,
  requiredStepsRemaining = 0,
  compact = false,
  showTarget = false,
  className,
}: OnboardingProgressBarProps) {
  const isComplete = requiredStepsRemaining === 0;
  const isNearComplete = percentComplete >= 75;
  const isBehindSchedule = targetCompletionDate
    ? new Date() > new Date(targetCompletionDate) && !isComplete
    : false;

  const getProgressColor = () => {
    if (isComplete) return 'from-green-500 to-emerald-600';
    if (isBehindSchedule) return 'from-red-500 to-orange-600';
    if (isNearComplete) return 'from-amber-500 to-yellow-600';
    return 'from-indigo-500 to-purple-600';
  };

  const formatTargetDate = (date: Date) => {
    const now = new Date();
    const target = new Date(date);
    const daysUntil = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) {
      return `${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? 's' : ''} overdue`;
    } else if (daysUntil === 0) {
      return 'Due today';
    } else if (daysUntil <= 7) {
      return `${daysUntil} day${daysUntil !== 1 ? 's' : ''} left`;
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(target);
    }
  };

  if (compact) {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        {/* Progress Circle/Icon */}
        <div className="flex-shrink-0">
          {isComplete ? (
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          ) : (
            <div className="relative w-8 h-8">
              {/* Background circle */}
              <svg className="w-8 h-8 transform -rotate-90">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-gray-200"
                />
                {/* Progress circle */}
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 14}`}
                  strokeDashoffset={`${2 * Math.PI * 14 * (1 - percentComplete / 100)}`}
                  className={cn(
                    'transition-all duration-500',
                    isComplete
                      ? 'text-green-600'
                      : isBehindSchedule
                      ? 'text-red-600'
                      : 'text-indigo-600'
                  )}
                  strokeLinecap="round"
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-gray-700">
                  {Math.round(percentComplete)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {completedSteps}/{totalSteps} steps
            </span>
            {isBehindSchedule && !isComplete && (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
          </div>
          {showTarget && targetCompletionDate && (
            <p
              className={cn(
                'text-xs',
                isBehindSchedule ? 'text-red-600 font-medium' : 'text-gray-600'
              )}
            >
              {formatTargetDate(targetCompletionDate)}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Full progress bar (default)
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            Onboarding Progress
          </span>
          {isComplete && <CheckCircle className="h-4 w-4 text-green-600" />}
          {isBehindSchedule && !isComplete && (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
        </div>
        <span className="text-sm font-bold text-gray-900">{percentComplete}%</span>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full bg-gradient-to-r transition-all duration-500',
              getProgressColor()
            )}
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">
          {completedSteps} of {totalSteps} steps completed
        </span>
        {showTarget && targetCompletionDate && (
          <span
            className={cn(
              'font-medium',
              isBehindSchedule ? 'text-red-600' : isNearComplete ? 'text-amber-600' : 'text-gray-600'
            )}
          >
            {formatTargetDate(targetCompletionDate)}
          </span>
        )}
      </div>

      {/* Status Message */}
      {isComplete ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm font-medium text-green-900">
            🎉 Onboarding complete! Ready to launch.
          </p>
        </div>
      ) : isBehindSchedule ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm font-medium text-red-900">
            ⚠️ Behind schedule. {requiredStepsRemaining} required step
            {requiredStepsRemaining !== 1 ? 's' : ''} remaining.
          </p>
        </div>
      ) : isNearComplete ? (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm font-medium text-amber-900">
            Almost there! {requiredStepsRemaining} required step
            {requiredStepsRemaining !== 1 ? 's' : ''} to go.
          </p>
        </div>
      ) : null}
    </div>
  );
}
