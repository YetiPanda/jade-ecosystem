/**
 * EvidenceMeter Component
 * Visualizes scientific evidence strength for skincare claims
 *
 * Displays a segmented meter showing evidence level from Anecdotal to Gold Standard
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
 * Evidence Level types
 */
export type EvidenceLevel =
  | 'ANECDOTAL'
  | 'IN_VITRO'
  | 'ANIMAL'
  | 'HUMAN_PILOT'
  | 'HUMAN_CONTROLLED'
  | 'META_ANALYSIS'
  | 'GOLD_STANDARD';

/**
 * Evidence level configuration
 */
const EVIDENCE_CONFIG: Record<
  EvidenceLevel,
  {
    level: number;
    label: string;
    description: string;
    color: string;
    bgColor: string;
    strength: number; // 0-1
  }
> = {
  ANECDOTAL: {
    level: 1,
    label: 'Anecdotal',
    description: 'Personal reports, no controlled study',
    color: 'text-slate-500',
    bgColor: 'bg-slate-400',
    strength: 0.14,
  },
  IN_VITRO: {
    level: 2,
    label: 'In Vitro',
    description: 'Laboratory studies only',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-400',
    strength: 0.28,
  },
  ANIMAL: {
    level: 3,
    label: 'Animal',
    description: 'Animal model studies',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400',
    strength: 0.42,
  },
  HUMAN_PILOT: {
    level: 4,
    label: 'Human Pilot',
    description: 'Small human trials (<30 participants)',
    color: 'text-green-400',
    bgColor: 'bg-green-400',
    strength: 0.57,
  },
  HUMAN_CONTROLLED: {
    level: 5,
    label: 'Human Controlled',
    description: 'Controlled trials (30+ participants)',
    color: 'text-green-500',
    bgColor: 'bg-green-500',
    strength: 0.71,
  },
  META_ANALYSIS: {
    level: 6,
    label: 'Meta-Analysis',
    description: 'Systematic reviews of multiple studies',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500',
    strength: 0.85,
  },
  GOLD_STANDARD: {
    level: 7,
    label: 'Gold Standard',
    description: 'Multiple RCTs with consistent results',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500',
    strength: 1.0,
  },
};

const evidenceMeterVariants = cva('flex items-center gap-1', {
  variants: {
    size: {
      sm: 'gap-0.5',
      default: 'gap-1',
      lg: 'gap-1.5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const segmentVariants = cva('rounded-sm transition-colors', {
  variants: {
    size: {
      sm: 'w-2 h-3',
      default: 'w-3 h-4',
      lg: 'w-4 h-5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface EvidenceMeterProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof evidenceMeterVariants> {
  level: EvidenceLevel;
  showLabel?: boolean;
  showTooltip?: boolean;
  showAllSegments?: boolean;
}

export function EvidenceMeter({
  level,
  showLabel = false,
  showTooltip = true,
  showAllSegments = true,
  size,
  className,
  ...props
}: EvidenceMeterProps) {
  const config = EVIDENCE_CONFIG[level];
  const levels = Object.keys(EVIDENCE_CONFIG) as EvidenceLevel[];
  const currentIndex = levels.indexOf(level);

  const meter = (
    <div
      data-slot="evidence-meter"
      className={cn(evidenceMeterVariants({ size }), className)}
      {...props}
    >
      {showAllSegments ? (
        // Show all 7 segments
        levels.map((evidenceLevel, index) => {
          const segmentConfig = EVIDENCE_CONFIG[evidenceLevel];
          const isActive = index <= currentIndex;
          return (
            <div
              key={evidenceLevel}
              className={cn(
                segmentVariants({ size }),
                isActive
                  ? segmentConfig.bgColor
                  : 'bg-muted dark:bg-muted/50'
              )}
              title={segmentConfig.label}
            />
          );
        })
      ) : (
        // Show filled bar based on strength
        <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full transition-all rounded-full', config.bgColor)}
            style={{ width: `${config.strength * 100}%` }}
          />
        </div>
      )}
      {showLabel && (
        <span className={cn('text-xs font-medium ml-1', config.color)}>
          {config.label}
        </span>
      )}
    </div>
  );

  if (!showTooltip) {
    return meter;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{meter}</TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-semibold">{config.label}</p>
            <p className="text-muted-foreground">{config.description}</p>
            <p className="text-xs mt-1 text-muted-foreground">
              Strength: {Math.round(config.strength * 100)}%
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Compact evidence indicator (just colored dot with label)
 */
export interface EvidenceIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  level: EvidenceLevel;
  showLabel?: boolean;
}

export function EvidenceIndicator({
  level,
  showLabel = true,
  className,
  ...props
}: EvidenceIndicatorProps) {
  const config = EVIDENCE_CONFIG[level];

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 text-xs', className)}
      {...props}
    >
      <span
        className={cn('w-2 h-2 rounded-full', config.bgColor)}
        aria-hidden="true"
      />
      {showLabel && (
        <span className={cn('font-medium', config.color)}>{config.label}</span>
      )}
    </span>
  );
}

/**
 * Evidence badge showing just the label with colored background
 */
export interface EvidenceBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  level: EvidenceLevel;
}

export function EvidenceBadge({
  level,
  className,
  ...props
}: EvidenceBadgeProps) {
  const config = EVIDENCE_CONFIG[level];

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-md',
        config.bgColor,
        'text-white',
        className
      )}
      {...props}
    >
      {config.label}
    </span>
  );
}

/**
 * Get evidence configuration
 */
export function getEvidenceConfig(level: EvidenceLevel) {
  return EVIDENCE_CONFIG[level];
}

/**
 * Compare evidence levels (returns -1, 0, 1)
 */
export function compareEvidenceLevels(
  a: EvidenceLevel,
  b: EvidenceLevel
): number {
  return EVIDENCE_CONFIG[a].level - EVIDENCE_CONFIG[b].level;
}

/**
 * Check if evidence meets minimum level
 */
export function meetsMinimumEvidence(
  current: EvidenceLevel,
  minimum: EvidenceLevel
): boolean {
  return EVIDENCE_CONFIG[current].level >= EVIDENCE_CONFIG[minimum].level;
}

/**
 * Check if evidence is considered high quality
 */
export function isHighQualityEvidence(level: EvidenceLevel): boolean {
  const highQualityLevels: EvidenceLevel[] = [
    'HUMAN_CONTROLLED',
    'META_ANALYSIS',
    'GOLD_STANDARD',
  ];
  return highQualityLevels.includes(level);
}

export { EVIDENCE_CONFIG };
