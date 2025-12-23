/**
 * SynergyCard Component
 *
 * DermaLogica Intelligence MVP - Phase 6: Compatibility Analyzer
 *
 * Displays positive ingredient/product interactions:
 * - Synergy type badge (enhancing, complementary, stabilizing)
 * - Mechanism explanation
 * - Benefit multiplier visualization
 * - Evidence level indicator
 */

import React from 'react';

/**
 * Synergy type classification
 */
export type SynergyType =
  | 'ENHANCING' // One boosts the other
  | 'COMPLEMENTARY' // Work on different pathways
  | 'STABILIZING' // One preserves/stabilizes the other
  | 'PROTECTIVE' // One protects against irritation from other
  | 'PENETRATION' // One improves absorption of other
  | 'FORMULATION'; // Chemical compatibility for mixing

/**
 * Synergy strength level
 */
export type SynergyStrength = 'mild' | 'moderate' | 'strong';

/**
 * Synergy data structure
 */
export interface Synergy {
  id: string;
  itemAId: string;
  itemAName: string;
  itemBId: string;
  itemBName: string;
  type: SynergyType;
  strength: SynergyStrength;
  benefitMultiplier?: number; // e.g., 1.5 = 50% more effective
  mechanism: string;
  benefits: string[];
  usage?: string;
  evidence?: {
    level: string;
    studyCount: number;
  };
}

export interface SynergyCardProps {
  /** The synergy to display */
  synergy: Synergy;
  /** Callback when card is clicked */
  onClick?: () => void;
  /** Callback when "Learn More" is clicked */
  onLearnMore?: () => void;
  /** Whether to show compact view */
  compact?: boolean;
  /** Custom class name */
  className?: string;
}

/**
 * Synergy type metadata
 */
const SYNERGY_TYPE_INFO: Record<
  SynergyType,
  { label: string; icon: React.ReactNode; color: string; bgColor: string; description: string }
> = {
  ENHANCING: {
    label: 'Enhancing',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    description: 'Boosts effectiveness',
  },
  COMPLEMENTARY: {
    label: 'Complementary',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
    color: 'text-blue-700',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    description: 'Different pathways',
  },
  STABILIZING: {
    label: 'Stabilizing',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'text-purple-700',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    description: 'Improves stability',
  },
  PROTECTIVE: {
    label: 'Protective',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'text-teal-700',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
    description: 'Reduces irritation',
  },
  PENETRATION: {
    label: 'Penetration',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    description: 'Improves absorption',
  },
  FORMULATION: {
    label: 'Formulation',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    description: 'Mixes well together',
  },
};

/**
 * Strength indicator
 */
const STRENGTH_INFO: Record<SynergyStrength, { label: string; dots: number; color: string }> = {
  mild: { label: 'Mild', dots: 1, color: 'bg-green-400' },
  moderate: { label: 'Moderate', dots: 2, color: 'bg-green-500' },
  strong: { label: 'Strong', dots: 3, color: 'bg-green-600' },
};

/**
 * Benefit multiplier visualization
 */
function BenefitMultiplier({ multiplier }: { multiplier: number }) {
  const percentage = Math.round((multiplier - 1) * 100);
  const isPositive = percentage > 0;

  return (
    <div className="flex items-center gap-2">
      <div className="text-xs text-gray-500 dark:text-gray-400">Benefit</div>
      <div
        className={`
          px-2 py-0.5 rounded-full text-sm font-bold
          ${isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-600'}
        `}
      >
        {isPositive ? '+' : ''}
        {percentage}%
      </div>
    </div>
  );
}

/**
 * SynergyCard - Displays positive interaction between items
 */
export function SynergyCard({
  synergy,
  onClick,
  onLearnMore,
  compact = false,
  className = '',
}: SynergyCardProps) {
  const typeInfo = SYNERGY_TYPE_INFO[synergy.type];
  const strengthInfo = STRENGTH_INFO[synergy.strength];

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-xl border-2 border-emerald-200 dark:border-emerald-800
        shadow-sm hover:shadow-md transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Header */}
      <div className="p-4 border-b border-emerald-100 dark:border-emerald-800/50">
        <div className="flex items-start justify-between gap-3">
          {/* Item names */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {synergy.itemAName}
            </span>
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {synergy.itemBName}
            </span>
          </div>

          {/* Strength indicator */}
          <div className="flex items-center gap-1" title={`${strengthInfo.label} synergy`}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < strengthInfo.dots ? strengthInfo.color : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Type badge */}
        <div className="flex items-center gap-3 mt-2">
          <span
            className={`
              inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
              ${typeInfo.bgColor} ${typeInfo.color} dark:text-opacity-90
            `}
          >
            {typeInfo.icon}
            {typeInfo.label}
          </span>
          {synergy.benefitMultiplier && synergy.benefitMultiplier > 1 && (
            <BenefitMultiplier multiplier={synergy.benefitMultiplier} />
          )}
        </div>
      </div>

      {/* Body */}
      <div className={`p-4 ${compact ? 'space-y-2' : 'space-y-3'}`}>
        {/* Mechanism */}
        <div>
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            How it works
          </h4>
          <p className={`text-sm text-gray-700 dark:text-gray-300 ${compact ? 'line-clamp-2' : ''}`}>
            {synergy.mechanism}
          </p>
        </div>

        {/* Benefits */}
        {!compact && synergy.benefits.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Combined benefits
            </h4>
            <ul className="space-y-1">
              {synergy.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Usage tip */}
        {!compact && synergy.usage && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">{synergy.usage}</p>
            </div>
          </div>
        )}

        {/* Evidence */}
        {synergy.evidence && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>
              {synergy.evidence.level} • {synergy.evidence.studyCount}{' '}
              {synergy.evidence.studyCount === 1 ? 'study' : 'studies'}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      {onLearnMore && (
        <div className="px-4 py-3 border-t border-emerald-100 dark:border-emerald-800/50">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLearnMore();
            }}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1"
          >
            Learn more
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
 * SynergyList - Display multiple synergies
 */
export interface SynergyListProps {
  synergies: Synergy[];
  onSynergyClick?: (synergy: Synergy) => void;
  compact?: boolean;
  limit?: number;
  className?: string;
}

export function SynergyList({
  synergies,
  onSynergyClick,
  compact = false,
  limit,
  className = '',
}: SynergyListProps) {
  const displayedSynergies = limit ? synergies.slice(0, limit) : synergies;

  if (synergies.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 dark:text-gray-400 ${className}`}>
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <p>No synergies found</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {displayedSynergies.map((synergy) => (
        <SynergyCard
          key={synergy.id}
          synergy={synergy}
          onClick={onSynergyClick ? () => onSynergyClick(synergy) : undefined}
          compact={compact}
        />
      ))}
      {limit && synergies.length > limit && (
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 pt-2">
          +{synergies.length - limit} more synergies
        </p>
      )}
    </div>
  );
}

export default SynergyCard;
