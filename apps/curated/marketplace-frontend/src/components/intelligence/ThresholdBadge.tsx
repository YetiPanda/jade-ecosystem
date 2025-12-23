/**
 * ThresholdBadge Component
 * Displays Knowledge Threshold (T1-T8) classification with color coding
 *
 * Used to indicate the knowledge complexity and access level for skincare content
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

/**
 * Knowledge Threshold levels (T1-T8)
 */
export type KnowledgeThreshold =
  | 'T1_SKIN_BIOLOGY'
  | 'T2_INGREDIENT_SCIENCE'
  | 'T3_PRODUCT_FORMULATION'
  | 'T4_TREATMENT_PROTOCOLS'
  | 'T5_CONTRAINDICATIONS'
  | 'T6_PROFESSIONAL_TECHNIQUES'
  | 'T7_REGULATORY_COMPLIANCE'
  | 'T8_SYSTEMIC_PATTERNS';

/**
 * Metadata for each threshold level
 */
const THRESHOLD_CONFIG: Record<
  KnowledgeThreshold,
  {
    level: number;
    label: string;
    fullLabel: string;
    description: string;
    color: string;
    bgColor: string;
    borderColor: string;
    accessLevel: 'public' | 'registered' | 'professional' | 'expert';
  }
> = {
  T1_SKIN_BIOLOGY: {
    level: 1,
    label: 'T1',
    fullLabel: 'Skin Biology',
    description: 'Fundamental skin science concepts',
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    borderColor: 'border-blue-300 dark:border-blue-700',
    accessLevel: 'public',
  },
  T2_INGREDIENT_SCIENCE: {
    level: 2,
    label: 'T2',
    fullLabel: 'Ingredient Science',
    description: 'How ingredients work',
    color: 'text-emerald-700 dark:text-emerald-300',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    borderColor: 'border-emerald-300 dark:border-emerald-700',
    accessLevel: 'public',
  },
  T3_PRODUCT_FORMULATION: {
    level: 3,
    label: 'T3',
    fullLabel: 'Product Formulation',
    description: 'Formulation principles',
    color: 'text-violet-700 dark:text-violet-300',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
    borderColor: 'border-violet-300 dark:border-violet-700',
    accessLevel: 'public',
  },
  T4_TREATMENT_PROTOCOLS: {
    level: 4,
    label: 'T4',
    fullLabel: 'Treatment Protocols',
    description: 'Application methods',
    color: 'text-amber-700 dark:text-amber-300',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    borderColor: 'border-amber-300 dark:border-amber-700',
    accessLevel: 'registered',
  },
  T5_CONTRAINDICATIONS: {
    level: 5,
    label: 'T5',
    fullLabel: 'Contraindications',
    description: 'Safety considerations',
    color: 'text-red-700 dark:text-red-300',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    borderColor: 'border-red-300 dark:border-red-700',
    accessLevel: 'registered',
  },
  T6_PROFESSIONAL_TECHNIQUES: {
    level: 6,
    label: 'T6',
    fullLabel: 'Professional Techniques',
    description: 'Advanced procedures',
    color: 'text-indigo-700 dark:text-indigo-300',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    borderColor: 'border-indigo-300 dark:border-indigo-700',
    accessLevel: 'professional',
  },
  T7_REGULATORY_COMPLIANCE: {
    level: 7,
    label: 'T7',
    fullLabel: 'Regulatory Compliance',
    description: 'Legal requirements',
    color: 'text-slate-700 dark:text-slate-300',
    bgColor: 'bg-slate-100 dark:bg-slate-900/30',
    borderColor: 'border-slate-400 dark:border-slate-600',
    accessLevel: 'professional',
  },
  T8_SYSTEMIC_PATTERNS: {
    level: 8,
    label: 'T8',
    fullLabel: 'Systemic Patterns',
    description: 'Holistic understanding',
    color: 'text-teal-700 dark:text-teal-300',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
    borderColor: 'border-teal-300 dark:border-teal-700',
    accessLevel: 'expert',
  },
};

const thresholdBadgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 transition-colors',
  {
    variants: {
      size: {
        sm: 'px-1.5 py-0.5 text-[10px]',
        default: 'px-2 py-0.5 text-xs',
        lg: 'px-2.5 py-1 text-sm',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface ThresholdBadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'>,
    VariantProps<typeof thresholdBadgeVariants> {
  threshold: KnowledgeThreshold;
  showLabel?: boolean;
  showTooltip?: boolean;
}

export function ThresholdBadge({
  threshold,
  showLabel = false,
  showTooltip = true,
  size,
  className,
  ...props
}: ThresholdBadgeProps) {
  const config = THRESHOLD_CONFIG[threshold];

  const badge = (
    <span
      data-slot="threshold-badge"
      className={cn(
        thresholdBadgeVariants({ size }),
        config.bgColor,
        config.borderColor,
        config.color,
        className
      )}
      {...props}
    >
      {config.label}
      {showLabel && <span className="ml-1">{config.fullLabel}</span>}
    </span>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-semibold">{config.fullLabel}</p>
            <p className="text-muted-foreground">{config.description}</p>
            <p className="text-xs mt-1 capitalize text-muted-foreground">
              Access: {config.accessLevel}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Get threshold configuration
 */
export function getThresholdConfig(threshold: KnowledgeThreshold) {
  return THRESHOLD_CONFIG[threshold];
}

/**
 * Compare thresholds (returns -1, 0, 1)
 */
export function compareThresholds(
  a: KnowledgeThreshold,
  b: KnowledgeThreshold
): number {
  return THRESHOLD_CONFIG[a].level - THRESHOLD_CONFIG[b].level;
}

export { THRESHOLD_CONFIG };
