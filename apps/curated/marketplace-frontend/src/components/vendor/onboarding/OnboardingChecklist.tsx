/**
 * Onboarding Checklist Component
 * Feature 011: Vendor Portal MVP
 * Sprint E.1: Application & Onboarding (Task E.1.8)
 *
 * Displays 8-step onboarding checklist for approved vendors.
 * Shows progress, step statuses, and completion actions.
 * Supports 6 required steps and 2 optional steps.
 */

import { Check, Clock, Circle, ExternalLink } from 'lucide-react';
import { cn } from '../../../lib/utils';

export enum OnboardingStepStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
}

export interface OnboardingStep {
  id: string;
  name: string;
  description: string | null;
  order: number;
  status: OnboardingStepStatus;
  required: boolean;
  helpArticleUrl: string | null;
  completedAt: Date | null;
}

export interface OnboardingData {
  id: string;
  steps: OnboardingStep[];
  completedSteps: number;
  totalSteps: number;
  requiredStepsRemaining: number;
  percentComplete: number;
  successManagerName: string | null;
  successManagerEmail: string | null;
  targetCompletionDate: Date | null;
  brandName: string;
}

interface OnboardingChecklistProps {
  onboarding: OnboardingData;
  onStepClick?: (step: OnboardingStep) => void;
  onGoLive?: () => void;
}

export function OnboardingChecklist({
  onboarding,
  onStepClick,
  onGoLive,
}: OnboardingChecklistProps) {
  const sortedSteps = [...onboarding.steps].sort((a, b) => a.order - b.order);
  const canGoLive = onboarding.requiredStepsRemaining === 0;

  const getStepIcon = (step: OnboardingStep) => {
    switch (step.status) {
      case OnboardingStepStatus.COMPLETED:
        return <Check className="h-5 w-5 text-green-600" />;
      case OnboardingStepStatus.IN_PROGRESS:
        return <Clock className="h-5 w-5 text-amber-600" />;
      case OnboardingStepStatus.SKIPPED:
        return <Circle className="h-5 w-5 text-gray-400" />;
      case OnboardingStepStatus.PENDING:
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  const getStepStatusText = (step: OnboardingStep) => {
    switch (step.status) {
      case OnboardingStepStatus.COMPLETED:
        return 'Done';
      case OnboardingStepStatus.IN_PROGRESS:
        return 'In Progress';
      case OnboardingStepStatus.SKIPPED:
        return 'Skipped';
      case OnboardingStepStatus.PENDING:
      default:
        return step.required ? 'Required' : 'Optional';
    }
  };

  const getStepStatusColor = (step: OnboardingStep) => {
    switch (step.status) {
      case OnboardingStepStatus.COMPLETED:
        return 'text-green-600';
      case OnboardingStepStatus.IN_PROGRESS:
        return 'text-amber-600';
      case OnboardingStepStatus.SKIPPED:
        return 'text-gray-500';
      case OnboardingStepStatus.PENDING:
      default:
        return 'text-gray-500';
    }
  };

  const formatTargetDate = (date: Date | null) => {
    if (!date) return 'TBD';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🎉 Welcome to Jade, {onboarding.brandName}!
        </h1>
        <p className="text-gray-700">
          Complete these steps to launch your storefront. Most vendors complete onboarding within 2 weeks.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">
            {onboarding.completedSteps}/{onboarding.totalSteps} steps
          </span>
          <span className="text-sm font-medium text-gray-700">
            {onboarding.percentComplete}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
            style={{ width: `${onboarding.percentComplete}%` }}
          />
        </div>
        {onboarding.targetCompletionDate && (
          <p className="text-xs text-gray-600 mt-2">
            Target completion: {formatTargetDate(onboarding.targetCompletionDate)}
          </p>
        )}
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {sortedSteps.map((step) => (
          <div
            key={step.id}
            className={cn(
              'bg-white rounded-lg border transition-all',
              step.status === OnboardingStepStatus.COMPLETED
                ? 'border-green-200 bg-green-50/30'
                : step.status === OnboardingStepStatus.IN_PROGRESS
                ? 'border-amber-200 bg-amber-50/30'
                : 'border-gray-200',
              onStepClick && step.status !== OnboardingStepStatus.COMPLETED
                ? 'cursor-pointer hover:shadow-md hover:border-indigo-300'
                : ''
            )}
            onClick={() => {
              if (onStepClick && step.status !== OnboardingStepStatus.COMPLETED) {
                onStepClick(step);
              }
            }}
          >
            <div className="p-5">
              {/* Step Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3 flex-1">
                  {getStepIcon(step)}
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900">
                      {step.name}
                      {!step.required && (
                        <span className="ml-2 text-xs font-normal text-gray-500">(Optional)</span>
                      )}
                    </h3>
                  </div>
                </div>
                <span className={cn('text-sm font-medium', getStepStatusColor(step))}>
                  {getStepStatusText(step)}
                </span>
              </div>

              {/* Step Description */}
              {step.description && (
                <p className="text-sm text-gray-600 ml-8 mb-3">{step.description}</p>
              )}

              {/* Step Details */}
              {step.status === OnboardingStepStatus.COMPLETED && step.completedAt && (
                <p className="text-xs text-gray-500 ml-8">
                  Completed on {formatTargetDate(step.completedAt)}
                </p>
              )}

              {/* Help Article Link */}
              {step.helpArticleUrl && step.status !== OnboardingStepStatus.COMPLETED && (
                <a
                  href={step.helpArticleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 ml-8 mt-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  Need help? Read guide
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>

            {/* In-Progress Indicator */}
            {step.status === OnboardingStepStatus.IN_PROGRESS && (
              <div className="border-t border-amber-200 bg-amber-50 px-5 py-3">
                <p className="text-sm text-amber-900">
                  You're working on this step. Click to continue or mark as complete.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Go Live Button */}
      {canGoLive && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            🚀 Ready to Launch!
          </h3>
          <p className="text-green-800 mb-4">
            You've completed all required steps. Your storefront is ready to go live on Jade Marketplace!
          </p>
          <button
            onClick={onGoLive}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
          >
            Launch My Storefront
          </button>
        </div>
      )}

      {/* Support Contact */}
      {onboarding.successManagerName && onboarding.successManagerEmail && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Need help?</strong> Contact your success manager:{' '}
            <a
              href={`mailto:${onboarding.successManagerEmail}`}
              className="font-medium underline hover:text-blue-700"
            >
              {onboarding.successManagerName} ({onboarding.successManagerEmail})
            </a>
          </p>
        </div>
      )}

      {/* Required Steps Remaining */}
      {!canGoLive && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>{onboarding.requiredStepsRemaining}</strong> required step
            {onboarding.requiredStepsRemaining !== 1 ? 's' : ''} remaining before you can launch.
          </p>
        </div>
      )}
    </div>
  );
}
