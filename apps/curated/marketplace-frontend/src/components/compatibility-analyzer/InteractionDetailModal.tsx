/**
 * InteractionDetailModal Component
 *
 * DermaLogica Intelligence MVP - Phase 6: Compatibility Analyzer
 *
 * Full interaction details in modal/drawer:
 * - Progressive disclosure (Glance/Scan/Study)
 * - Complete mechanism explanation
 * - Evidence citations
 * - Usage recommendations
 * - Link to product pages
 */

import React, { useState } from 'react';

/**
 * Disclosure level for progressive information reveal
 */
export type DisclosureLevel = 'glance' | 'scan' | 'study';

/**
 * Interaction type classification
 */
export type InteractionClassification =
  | 'synergy'
  | 'conflict'
  | 'neutral';

/**
 * Evidence citation
 */
export interface Citation {
  id: string;
  title: string;
  authors: string[];
  journal?: string;
  year: number;
  doi?: string;
  url?: string;
  keyFinding: string;
}

/**
 * Usage recommendation
 */
export interface UsageRecommendation {
  type: 'timing' | 'order' | 'frequency' | 'combination' | 'avoidance';
  instruction: string;
  importance: 'required' | 'recommended' | 'optional';
  reason?: string;
}

/**
 * Full interaction detail data
 */
export interface InteractionDetail {
  id: string;
  classification: InteractionClassification;

  // Items involved
  itemA: {
    id: string;
    name: string;
    type: 'product' | 'ingredient';
    imageUrl?: string;
    productUrl?: string;
  };
  itemB: {
    id: string;
    name: string;
    type: 'product' | 'ingredient';
    imageUrl?: string;
    productUrl?: string;
  };

  // Quick summary (Glance level)
  summary: string;
  score: number; // -1 to 1

  // Detailed explanation (Scan level)
  mechanism: string;
  effects: string[];

  // Deep dive (Study level)
  biologicalPathway?: string;
  chemicalInteraction?: string;
  citations: Citation[];

  // Recommendations
  recommendations: UsageRecommendation[];
  waitTime?: number; // minutes between application

  // Related data
  relatedInteractions?: {
    id: string;
    itemName: string;
    type: InteractionClassification;
    summary: string;
  }[];
}

export interface InteractionDetailModalProps {
  /** The interaction to display */
  interaction: InteractionDetail | null;
  /** Whether modal is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Callback when product link is clicked */
  onProductClick?: (productId: string) => void;
  /** Callback when related interaction is clicked */
  onRelatedClick?: (interactionId: string) => void;
  /** Initial disclosure level */
  initialLevel?: DisclosureLevel;
}

/**
 * Classification display info
 */
const CLASSIFICATION_INFO: Record<
  InteractionClassification,
  { label: string; color: string; bgColor: string; icon: React.ReactNode }
> = {
  synergy: {
    label: 'Synergy',
    color: 'text-emerald-700 dark:text-emerald-300',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  conflict: {
    label: 'Conflict',
    color: 'text-red-700 dark:text-red-300',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  neutral: {
    label: 'Neutral',
    color: 'text-gray-700 dark:text-gray-300',
    bgColor: 'bg-gray-100 dark:bg-gray-800',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
      </svg>
    ),
  },
};

/**
 * Recommendation type icons
 */
const RECOMMENDATION_ICONS: Record<UsageRecommendation['type'], React.ReactNode> = {
  timing: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  order: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
  frequency: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  combination: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
    </svg>
  ),
  avoidance: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  ),
};

/**
 * Score meter visualization
 */
function ScoreMeter({ score }: { score: number }) {
  // Convert -1 to 1 score to percentage (0 = conflict, 50 = neutral, 100 = synergy)
  const percentage = ((score + 1) / 2) * 100;

  const getColor = () => {
    if (score >= 0.5) return 'bg-emerald-500';
    if (score >= 0.2) return 'bg-emerald-400';
    if (score >= -0.2) return 'bg-gray-400';
    if (score >= -0.5) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full flex">
          <div
            className={`h-full ${getColor()} transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12 text-right">
        {score > 0 ? '+' : ''}{(score * 100).toFixed(0)}%
      </span>
    </div>
  );
}

/**
 * Disclosure level tabs
 */
function DisclosureTabs({
  level,
  onChange,
}: {
  level: DisclosureLevel;
  onChange: (level: DisclosureLevel) => void;
}) {
  const levels: { key: DisclosureLevel; label: string; description: string }[] = [
    { key: 'glance', label: 'Glance', description: 'Quick summary' },
    { key: 'scan', label: 'Scan', description: 'Key details' },
    { key: 'study', label: 'Study', description: 'Full research' },
  ];

  return (
    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {levels.map((l) => (
        <button
          key={l.key}
          onClick={() => onChange(l.key)}
          className={`
            flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all
            ${level === l.key
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}
          `}
          title={l.description}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Citation card
 */
function CitationCard({ citation }: { citation: Citation }) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <h5 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">
        {citation.title}
      </h5>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        {citation.authors.slice(0, 3).join(', ')}
        {citation.authors.length > 3 && ' et al.'}
        {citation.journal && ` • ${citation.journal}`}
        {citation.year && ` (${citation.year})`}
      </p>
      <p className="text-sm text-gray-700 dark:text-gray-300 italic">
        "{citation.keyFinding}"
      </p>
      {citation.doi && (
        <a
          href={`https://doi.org/${citation.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          DOI: {citation.doi}
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  );
}

/**
 * InteractionDetailModal - Full interaction details modal
 */
export function InteractionDetailModal({
  interaction,
  isOpen,
  onClose,
  onProductClick,
  onRelatedClick,
  initialLevel = 'scan',
}: InteractionDetailModalProps) {
  const [disclosureLevel, setDisclosureLevel] = useState<DisclosureLevel>(initialLevel);

  if (!isOpen || !interaction) return null;

  const classInfo = CLASSIFICATION_INFO[interaction.classification];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-y-0 right-0 w-full max-w-2xl flex">
        <div className="w-full bg-white dark:bg-gray-900 shadow-xl overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className={`p-2 rounded-lg ${classInfo.bgColor} ${classInfo.color}`}>
                  {classInfo.icon}
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Interaction Details
                  </h2>
                  <span className={`text-sm font-medium ${classInfo.color}`}>
                    {classInfo.label}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items involved */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={() => onProductClick?.(interaction.itemA.id)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {interaction.itemA.imageUrl && (
                  <img
                    src={interaction.itemA.imageUrl}
                    alt=""
                    className="w-8 h-8 rounded object-cover"
                  />
                )}
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {interaction.itemA.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {interaction.itemA.type === 'product' ? 'Product' : 'Ingredient'}
                  </div>
                </div>
              </button>

              <div className={`p-1 rounded-full ${classInfo.bgColor}`}>
                {interaction.classification === 'synergy' ? (
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                ) : interaction.classification === 'conflict' ? (
                  <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                )}
              </div>

              <button
                onClick={() => onProductClick?.(interaction.itemB.id)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {interaction.itemB.imageUrl && (
                  <img
                    src={interaction.itemB.imageUrl}
                    alt=""
                    className="w-8 h-8 rounded object-cover"
                  />
                )}
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {interaction.itemB.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {interaction.itemB.type === 'product' ? 'Product' : 'Ingredient'}
                  </div>
                </div>
              </button>
            </div>

            {/* Disclosure level tabs */}
            <div className="mt-4">
              <DisclosureTabs level={disclosureLevel} onChange={setDisclosureLevel} />
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-6">
            {/* Score meter */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Compatibility Score
              </h3>
              <ScoreMeter score={interaction.score} />
            </div>

            {/* Summary - Always shown */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Summary
              </h3>
              <p className="text-gray-900 dark:text-gray-100">
                {interaction.summary}
              </p>
            </div>

            {/* Wait time - if applicable */}
            {interaction.waitTime && interaction.waitTime > 0 && (
              <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="font-medium text-amber-800 dark:text-amber-200">
                    Wait {interaction.waitTime} minutes between application
                  </div>
                  <div className="text-sm text-amber-600 dark:text-amber-400">
                    Apply in the recommended order for best results
                  </div>
                </div>
              </div>
            )}

            {/* Scan level content */}
            {(disclosureLevel === 'scan' || disclosureLevel === 'study') && (
              <>
                {/* Mechanism */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    How It Works
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {interaction.mechanism}
                  </p>
                </div>

                {/* Effects */}
                {interaction.effects.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      {interaction.classification === 'synergy' ? 'Benefits' :
                       interaction.classification === 'conflict' ? 'Risks' : 'Effects'}
                    </h3>
                    <ul className="space-y-2">
                      {interaction.effects.map((effect, i) => (
                        <li key={i} className="flex items-start gap-2">
                          {interaction.classification === 'synergy' ? (
                            <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : interaction.classification === 'conflict' ? (
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          <span className="text-gray-700 dark:text-gray-300">{effect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {interaction.recommendations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      Recommendations
                    </h3>
                    <div className="space-y-2">
                      {interaction.recommendations.map((rec, i) => (
                        <div
                          key={i}
                          className={`
                            flex items-start gap-3 p-3 rounded-lg
                            ${rec.importance === 'required'
                              ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                              : rec.importance === 'recommended'
                              ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                              : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}
                          `}
                        >
                          <div className={`
                            p-1.5 rounded-lg
                            ${rec.importance === 'required'
                              ? 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300'
                              : rec.importance === 'recommended'
                              ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}
                          `}>
                            {RECOMMENDATION_ICONS[rec.type]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {rec.instruction}
                              </span>
                              {rec.importance === 'required' && (
                                <span className="px-1.5 py-0.5 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 text-xs font-medium rounded">
                                  Required
                                </span>
                              )}
                            </div>
                            {rec.reason && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {rec.reason}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Study level content */}
            {disclosureLevel === 'study' && (
              <>
                {/* Biological pathway */}
                {interaction.biologicalPathway && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      Biological Pathway
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {interaction.biologicalPathway}
                    </p>
                  </div>
                )}

                {/* Chemical interaction */}
                {interaction.chemicalInteraction && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                      Chemical Interaction
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {interaction.chemicalInteraction}
                    </p>
                  </div>
                )}

                {/* Citations */}
                {interaction.citations.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                      Research Citations ({interaction.citations.length})
                    </h3>
                    <div className="space-y-3">
                      {interaction.citations.map((citation) => (
                        <CitationCard key={citation.id} citation={citation} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Related interactions */}
            {interaction.relatedInteractions && interaction.relatedInteractions.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                  Related Interactions
                </h3>
                <div className="space-y-2">
                  {interaction.relatedInteractions.map((related) => (
                    <button
                      key={related.id}
                      onClick={() => onRelatedClick?.(related.id)}
                      className="w-full flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <div className={`
                        w-2 h-2 rounded-full
                        ${related.type === 'synergy' ? 'bg-emerald-500' :
                          related.type === 'conflict' ? 'bg-red-500' : 'bg-gray-400'}
                      `} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {related.itemName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {related.summary}
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
              {(interaction.itemA.productUrl || interaction.itemB.productUrl) && (
                <button
                  onClick={() => {
                    if (interaction.itemA.productUrl) {
                      window.open(interaction.itemA.productUrl, '_blank');
                    } else if (interaction.itemB.productUrl) {
                      window.open(interaction.itemB.productUrl, '_blank');
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  View Products
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InteractionDetailModal;
