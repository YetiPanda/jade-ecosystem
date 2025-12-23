/**
 * Step Completion Form Component
 * Feature 011: Vendor Portal MVP
 * Sprint E.1: Application & Onboarding (Task E.1.9)
 *
 * Form for marking onboarding steps as in-progress, completed, or skipped.
 * Displayed when vendor clicks on a pending/in-progress step.
 */

import { useState } from 'react';
import { X, CheckCircle, Clock, SkipForward } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { OnboardingStep, OnboardingStepStatus } from './OnboardingChecklist';

interface StepCompletionFormProps {
  step: OnboardingStep;
  onComplete: (stepId: string, data?: Record<string, any>) => void;
  onSetInProgress: (stepId: string) => void;
  onSkip?: (stepId: string) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function StepCompletionForm({
  step,
  onComplete,
  onSetInProgress,
  onSkip,
  onCancel,
  isSubmitting = false,
}: StepCompletionFormProps) {
  const [notes, setNotes] = useState('');
  const [actionType, setActionType] = useState<'complete' | 'in_progress' | 'skip' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!actionType) return;

    switch (actionType) {
      case 'complete':
        onComplete(step.id, notes ? { notes } : undefined);
        break;
      case 'in_progress':
        onSetInProgress(step.id);
        break;
      case 'skip':
        if (onSkip) {
          onSkip(step.id);
        }
        break;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{step.name}</h2>
            {step.description && (
              <p className="text-sm text-gray-600">{step.description}</p>
            )}
          </div>
          <button
            onClick={onCancel}
            className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Current Status</p>
            <p className="text-sm text-gray-600">
              {step.status === OnboardingStepStatus.PENDING && 'Not started'}
              {step.status === OnboardingStepStatus.IN_PROGRESS && 'In progress'}
              {step.status === OnboardingStepStatus.COMPLETED && 'Completed'}
              {step.status === OnboardingStepStatus.SKIPPED && 'Skipped'}
            </p>
          </div>

          {/* Action Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What would you like to do?
            </label>

            {/* Mark as In Progress */}
            {step.status !== OnboardingStepStatus.IN_PROGRESS && (
              <button
                type="button"
                onClick={() => setActionType('in_progress')}
                className={cn(
                  'w-full flex items-start gap-4 p-4 rounded-lg border-2 transition-all',
                  actionType === 'in_progress'
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-200 bg-white hover:border-amber-300'
                )}
              >
                <Clock className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900">Mark as In Progress</p>
                  <p className="text-sm text-gray-600 mt-1">
                    I'm working on this step but haven't completed it yet.
                  </p>
                </div>
              </button>
            )}

            {/* Mark as Complete */}
            <button
              type="button"
              onClick={() => setActionType('complete')}
              className={cn(
                'w-full flex items-start gap-4 p-4 rounded-lg border-2 transition-all',
                actionType === 'complete'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-green-300'
              )}
            >
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-left flex-1">
                <p className="font-semibold text-gray-900">Mark as Complete</p>
                <p className="text-sm text-gray-600 mt-1">
                  I've finished this step and it's ready for review.
                </p>
              </div>
            </button>

            {/* Skip Step (Optional Only) */}
            {!step.required && onSkip && (
              <button
                type="button"
                onClick={() => setActionType('skip')}
                className={cn(
                  'w-full flex items-start gap-4 p-4 rounded-lg border-2 transition-all',
                  actionType === 'skip'
                    ? 'border-gray-500 bg-gray-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                )}
              >
                <SkipForward className="h-6 w-6 text-gray-600 flex-shrink-0 mt-0.5" />
                <div className="text-left flex-1">
                  <p className="font-semibold text-gray-900">Skip This Step</p>
                  <p className="text-sm text-gray-600 mt-1">
                    This is optional and I don't want to complete it right now.
                  </p>
                </div>
              </button>
            )}
          </div>

          {/* Notes (Optional) */}
          {(actionType === 'complete' || actionType === 'in_progress') && (
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Add any notes about this step..."
              />
              <p className="text-xs text-gray-500 mt-1">
                These notes are for your reference and won't be shared with Jade.
              </p>
            </div>
          )}

          {/* Help Article */}
          {step.helpArticleUrl && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900 mb-2">
                <strong>Need help with this step?</strong>
              </p>
              <a
                href={step.helpArticleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:text-indigo-700 underline"
              >
                Read our step-by-step guide →
              </a>
            </div>
          )}

          {/* Warning for Required Steps */}
          {step.required && actionType === 'skip' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-900">
                <strong>Note:</strong> This is a required step. You cannot launch your storefront until it's completed.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!actionType || isSubmitting}
              className={cn(
                'px-6 py-2 rounded-lg font-semibold transition-all',
                actionType === 'complete'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : actionType === 'in_progress'
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : actionType === 'skip'
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed',
                isSubmitting && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isSubmitting ? (
                'Updating...'
              ) : actionType === 'complete' ? (
                'Mark Complete'
              ) : actionType === 'in_progress' ? (
                'Mark In Progress'
              ) : actionType === 'skip' ? (
                'Skip Step'
              ) : (
                'Select an action above'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
