/**
 * SequencingTimeline Component
 *
 * DermaLogica Intelligence MVP - Phase 6: Compatibility Analyzer
 *
 * Displays optimal application order:
 * - Drag-drop reordering capability
 * - Time gaps between steps
 * - AM/PM routine separation
 * - Warnings for order conflicts
 * - Total routine duration
 */

import React, { useState, useCallback } from 'react';

/**
 * Time of day classification
 */
export type TimeOfDay = 'morning' | 'evening' | 'both';

/**
 * Product step in the sequence
 */
export interface SequenceStep {
  id: string;
  productId: string;
  productName: string;
  brand?: string;
  imageUrl?: string;
  category: string;
  waitTimeAfter?: number; // minutes to wait after this step
  timeOfDay: TimeOfDay;
  notes?: string;
  order: number;
  isOptional?: boolean;
  conflicts?: {
    withStepId: string;
    reason: string;
    resolution?: string;
  }[];
}

/**
 * Routine type
 */
export interface Routine {
  id: string;
  name: string;
  timeOfDay: TimeOfDay;
  steps: SequenceStep[];
  totalDuration?: number; // total minutes including wait times
}

export interface SequencingTimelineProps {
  /** Morning routine steps */
  morningSteps: SequenceStep[];
  /** Evening routine steps */
  eveningSteps: SequenceStep[];
  /** Callback when step order changes */
  onReorder?: (steps: SequenceStep[], timeOfDay: TimeOfDay) => void;
  /** Callback when step is clicked */
  onStepClick?: (step: SequenceStep) => void;
  /** Callback when step is removed */
  onStepRemove?: (stepId: string) => void;
  /** Whether to allow editing */
  editable?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Time of day badge colors
 */
const TIME_COLORS: Record<TimeOfDay, { bg: string; text: string; icon: React.ReactNode }> = {
  morning: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-700 dark:text-amber-300',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  evening: {
    bg: 'bg-indigo-100 dark:bg-indigo-900/30',
    text: 'text-indigo-700 dark:text-indigo-300',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    ),
  },
  both: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-300',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
};

/**
 * Category order for sorting (skincare routine order)
 */
const CATEGORY_ORDER: Record<string, number> = {
  'cleanser': 1,
  'toner': 2,
  'essence': 3,
  'serum': 4,
  'treatment': 5,
  'eye-cream': 6,
  'moisturizer': 7,
  'sunscreen': 8,
  'mask': 9,
  'spot-treatment': 10,
};

/**
 * Format duration in a readable way
 */
function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${mins} min`;
}

/**
 * Calculate total routine duration
 */
function calculateTotalDuration(steps: SequenceStep[]): number {
  return steps.reduce((total, step) => total + (step.waitTimeAfter || 0), 0);
}

/**
 * Wait time indicator between steps
 */
function WaitTimeIndicator({ minutes }: { minutes: number }) {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
        <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Wait {minutes} {minutes === 1 ? 'minute' : 'minutes'}
        </span>
      </div>
    </div>
  );
}

/**
 * Single step card in the timeline
 */
interface StepCardProps {
  step: SequenceStep;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  editable: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onClick?: () => void;
  onRemove?: () => void;
  isDragging?: boolean;
  isDragOver?: boolean;
}

function StepCard({
  step,
  index,
  isFirst,
  isLast,
  editable,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onClick,
  onRemove,
  isDragging,
  isDragOver,
}: StepCardProps) {
  const hasConflicts = step.conflicts && step.conflicts.length > 0;

  return (
    <div
      className={`
        relative flex items-stretch gap-4
        ${isDragging ? 'opacity-50' : ''}
        ${isDragOver ? 'border-t-2 border-blue-500' : ''}
      `}
      draggable={editable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      {/* Timeline line */}
      <div className="flex flex-col items-center w-8">
        {!isFirst && <div className="w-0.5 h-4 bg-gray-300 dark:bg-gray-600" />}
        <div
          className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
            ${hasConflicts
              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-2 border-red-300 dark:border-red-700'
              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-700'}
          `}
        >
          {index + 1}
        </div>
        {!isLast && <div className="w-0.5 flex-1 min-h-[16px] bg-gray-300 dark:bg-gray-600" />}
      </div>

      {/* Step content */}
      <div
        className={`
          flex-1 pb-4 min-w-0
          ${onClick ? 'cursor-pointer' : ''}
        `}
        onClick={onClick}
      >
        <div
          className={`
            p-4 bg-white dark:bg-gray-800 rounded-xl border transition-all
            ${hasConflicts
              ? 'border-red-200 dark:border-red-800'
              : 'border-gray-200 dark:border-gray-700'}
            ${onClick ? 'hover:shadow-md' : ''}
          `}
        >
          <div className="flex items-start gap-3">
            {/* Product image */}
            {step.imageUrl ? (
              <img
                src={step.imageUrl}
                alt=""
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            )}

            {/* Product info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {step.productName}
                  </h4>
                  {step.brand && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {step.brand}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Category tag */}
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full capitalize">
                    {step.category}
                  </span>

                  {/* Optional badge */}
                  {step.isOptional && (
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                      Optional
                    </span>
                  )}

                  {/* Drag handle */}
                  {editable && (
                    <button className="p-1 text-gray-400 hover:text-gray-600 cursor-grab">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                      </svg>
                    </button>
                  )}

                  {/* Remove button */}
                  {editable && onRemove && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove from routine"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Notes */}
              {step.notes && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {step.notes}
                </p>
              )}

              {/* Conflicts */}
              {hasConflicts && step.conflicts && (
                <div className="mt-2 space-y-1">
                  {step.conflicts.map((conflict, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400"
                    >
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>{conflict.reason}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Routine section (AM or PM)
 */
interface RoutineSectionProps {
  title: string;
  timeOfDay: TimeOfDay;
  steps: SequenceStep[];
  editable: boolean;
  onReorder?: (steps: SequenceStep[]) => void;
  onStepClick?: (step: SequenceStep) => void;
  onStepRemove?: (stepId: string) => void;
}

function RoutineSection({
  title,
  timeOfDay,
  steps,
  editable,
  onReorder,
  onStepClick,
  onStepRemove,
}: RoutineSectionProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const timeColors = TIME_COLORS[timeOfDay];
  const totalDuration = calculateTotalDuration(steps);

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);

    if (dragIndex !== dropIndex && onReorder) {
      const newSteps = [...steps];
      const [removed] = newSteps.splice(dragIndex, 1);
      newSteps.splice(dropIndex, 0, removed);

      // Update order values
      const reorderedSteps = newSteps.map((step, i) => ({
        ...step,
        order: i + 1,
      }));

      onReorder(reorderedSteps);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [steps, onReorder]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, []);

  if (steps.length === 0) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-center">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${timeColors.bg} ${timeColors.text} mb-3`}>
          {timeColors.icon}
          <span className="font-medium">{title}</span>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          No products in this routine
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${timeColors.bg} ${timeColors.text}`}>
          {timeColors.icon}
          <span className="font-medium">{title}</span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {steps.length} {steps.length === 1 ? 'step' : 'steps'}
          {totalDuration > 0 && ` • ${formatDuration(totalDuration)} total`}
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-0">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <StepCard
              step={step}
              index={index}
              isFirst={index === 0}
              isLast={index === steps.length - 1}
              editable={editable}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              onClick={onStepClick ? () => onStepClick(step) : undefined}
              onRemove={onStepRemove ? () => onStepRemove(step.id) : undefined}
              isDragging={draggedIndex === index}
              isDragOver={dragOverIndex === index}
            />
            {step.waitTimeAfter && step.waitTimeAfter > 0 && index < steps.length - 1 && (
              <WaitTimeIndicator minutes={step.waitTimeAfter} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/**
 * SequencingTimeline - Main component
 */
export function SequencingTimeline({
  morningSteps,
  eveningSteps,
  onReorder,
  onStepClick,
  onStepRemove,
  editable = true,
  className = '',
}: SequencingTimelineProps) {
  // Sort steps by order
  const sortedMorningSteps = [...morningSteps].sort((a, b) => a.order - b.order);
  const sortedEveningSteps = [...eveningSteps].sort((a, b) => a.order - b.order);

  const totalSteps = morningSteps.length + eveningSteps.length;
  const totalMorningDuration = calculateTotalDuration(sortedMorningSteps);
  const totalEveningDuration = calculateTotalDuration(sortedEveningSteps);

  // Count conflicts
  const morningConflicts = sortedMorningSteps.filter(s => s.conflicts && s.conflicts.length > 0).length;
  const eveningConflicts = sortedEveningSteps.filter(s => s.conflicts && s.conflicts.length > 0).length;
  const totalConflicts = morningConflicts + eveningConflicts;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Your Skincare Routine
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {totalSteps} {totalSteps === 1 ? 'product' : 'products'} across AM & PM routines
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Duration summary */}
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total wait time</div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {formatDuration(totalMorningDuration + totalEveningDuration)}
            </div>
          </div>

          {/* Conflict indicator */}
          {totalConflicts > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-medium text-red-700 dark:text-red-300">
                {totalConflicts} {totalConflicts === 1 ? 'conflict' : 'conflicts'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Morning routine */}
      <RoutineSection
        title="Morning Routine"
        timeOfDay="morning"
        steps={sortedMorningSteps}
        editable={editable}
        onReorder={onReorder ? (steps) => onReorder(steps, 'morning') : undefined}
        onStepClick={onStepClick}
        onStepRemove={onStepRemove}
      />

      {/* Evening routine */}
      <RoutineSection
        title="Evening Routine"
        timeOfDay="evening"
        steps={sortedEveningSteps}
        editable={editable}
        onReorder={onReorder ? (steps) => onReorder(steps, 'evening') : undefined}
        onStepClick={onStepClick}
        onStepRemove={onStepRemove}
      />

      {/* Tip */}
      {editable && totalSteps > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
                Pro Tip
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Apply products from thinnest to thickest consistency. Drag and drop to reorder steps.
                Wait times help active ingredients absorb properly before applying the next layer.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Helper function to auto-sort steps by category order
 */
export function autoSortSteps(steps: SequenceStep[]): SequenceStep[] {
  return [...steps]
    .sort((a, b) => {
      const orderA = CATEGORY_ORDER[a.category.toLowerCase()] || 99;
      const orderB = CATEGORY_ORDER[b.category.toLowerCase()] || 99;
      return orderA - orderB;
    })
    .map((step, index) => ({
      ...step,
      order: index + 1,
    }));
}

export default SequencingTimeline;
