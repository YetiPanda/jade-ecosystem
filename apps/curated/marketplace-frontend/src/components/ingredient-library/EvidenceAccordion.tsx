/**
 * EvidenceAccordion Component
 *
 * DermaLogica Intelligence MVP - Phase 5: Ingredient Library
 *
 * Displays expandable citation lists with study details:
 * - Study summaries with year, journal, and authors
 * - Expandable abstract sections
 * - DOI links to original papers
 * - Evidence quality indicators
 * - Grouping by study type
 */

import React, { useState } from 'react';

/**
 * Evidence Level enum
 */
export type EvidenceLevel =
  | 'ANECDOTAL'
  | 'OBSERVATIONAL'
  | 'IN_VITRO'
  | 'ANIMAL_STUDY'
  | 'SMALL_CLINICAL'
  | 'LARGE_CLINICAL'
  | 'GOLD_STANDARD';

/**
 * Study type categorization
 */
export type StudyType =
  | 'META_ANALYSIS'
  | 'SYSTEMATIC_REVIEW'
  | 'RANDOMIZED_CONTROLLED'
  | 'COHORT_STUDY'
  | 'CASE_CONTROL'
  | 'CROSS_SECTIONAL'
  | 'CASE_SERIES'
  | 'IN_VITRO'
  | 'ANIMAL';

/**
 * Individual study/citation reference
 */
export interface StudyReference {
  id: string;
  title: string;
  authors: string[];
  journal?: string;
  year: number;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  pmid?: string;
  abstract?: string;
  studyType?: StudyType;
  evidenceLevel?: EvidenceLevel;
  sampleSize?: number;
  duration?: string;
  keyFindings?: string[];
  methodology?: string;
  limitations?: string[];
}

export interface EvidenceAccordionProps {
  /** Array of study references */
  studies: StudyReference[];
  /** Title for the section */
  title?: string;
  /** Whether to group studies by type */
  groupByType?: boolean;
  /** Maximum number of studies to show initially */
  initialLimit?: number;
  /** Custom class name */
  className?: string;
}

/**
 * Study type metadata
 */
const STUDY_TYPE_INFO: Record<
  StudyType,
  { label: string; color: string; bgColor: string; level: number }
> = {
  META_ANALYSIS: {
    label: 'Meta-Analysis',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    level: 9,
  },
  SYSTEMATIC_REVIEW: {
    label: 'Systematic Review',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
    level: 8,
  },
  RANDOMIZED_CONTROLLED: {
    label: 'RCT',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    level: 7,
  },
  COHORT_STUDY: {
    label: 'Cohort Study',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    level: 6,
  },
  CASE_CONTROL: {
    label: 'Case-Control',
    color: 'text-teal-700',
    bgColor: 'bg-teal-100',
    level: 5,
  },
  CROSS_SECTIONAL: {
    label: 'Cross-Sectional',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-100',
    level: 4,
  },
  CASE_SERIES: {
    label: 'Case Series',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    level: 3,
  },
  IN_VITRO: {
    label: 'In Vitro',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    level: 2,
  },
  ANIMAL: {
    label: 'Animal Study',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    level: 1,
  },
};

/**
 * Evidence level metadata
 */
const EVIDENCE_LEVEL_INFO: Record<EvidenceLevel, { label: string; color: string }> = {
  ANECDOTAL: { label: 'Anecdotal', color: 'text-gray-500' },
  OBSERVATIONAL: { label: 'Observational', color: 'text-blue-500' },
  IN_VITRO: { label: 'In Vitro', color: 'text-cyan-500' },
  ANIMAL_STUDY: { label: 'Animal', color: 'text-teal-500' },
  SMALL_CLINICAL: { label: 'Small Clinical', color: 'text-green-500' },
  LARGE_CLINICAL: { label: 'Large Clinical', color: 'text-emerald-500' },
  GOLD_STANDARD: { label: 'Gold Standard', color: 'text-amber-500' },
};

/**
 * Format author list for display
 */
function formatAuthors(authors: string[], maxDisplay: number = 3): string {
  if (authors.length === 0) return 'Unknown authors';
  if (authors.length <= maxDisplay) return authors.join(', ');
  return `${authors.slice(0, maxDisplay).join(', ')} et al.`;
}

/**
 * Format citation string
 */
function formatCitation(study: StudyReference): string {
  const parts: string[] = [];

  if (study.journal) parts.push(study.journal);
  if (study.year) parts.push(study.year.toString());
  if (study.volume) {
    let vol = study.volume;
    if (study.issue) vol += `(${study.issue})`;
    if (study.pages) vol += `:${study.pages}`;
    parts.push(vol);
  }

  return parts.join('. ');
}

/**
 * Individual study item component
 */
interface StudyItemProps {
  study: StudyReference;
  defaultExpanded?: boolean;
}

function StudyItem({ study, defaultExpanded = false }: StudyItemProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const typeInfo = study.studyType ? STUDY_TYPE_INFO[study.studyType] : null;
  const evidenceInfo = study.evidenceLevel ? EVIDENCE_LEVEL_INFO[study.evidenceLevel] : null;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        {/* Expand indicator */}
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5 transition-transform ${
            expanded ? 'transform rotate-90' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2">
            {study.title}
          </h4>

          {/* Authors & Citation */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatAuthors(study.authors)}
            {study.journal && ` • ${formatCitation(study)}`}
          </p>

          {/* Badges */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {typeInfo && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeInfo.bgColor} ${typeInfo.color} dark:bg-opacity-20`}
              >
                {typeInfo.label}
              </span>
            )}
            {study.sampleSize && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                n={study.sampleSize.toLocaleString()}
              </span>
            )}
            {evidenceInfo && (
              <span className={`text-xs ${evidenceInfo.color}`}>{evidenceInfo.label}</span>
            )}
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700/50 space-y-4">
          {/* Abstract */}
          {study.abstract && (
            <div>
              <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Abstract
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {study.abstract}
              </p>
            </div>
          )}

          {/* Key Findings */}
          {study.keyFindings && study.keyFindings.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Key Findings
              </h5>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {study.keyFindings.map((finding, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Methodology */}
          {study.methodology && (
            <div>
              <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Methodology
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300">{study.methodology}</p>
            </div>
          )}

          {/* Limitations */}
          {study.limitations && study.limitations.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Limitations
              </h5>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                {study.limitations.map((limitation, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    {limitation}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links */}
          <div className="flex items-center gap-3 pt-2">
            {study.doi && (
              <a
                href={`https://doi.org/${study.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                DOI: {study.doi}
              </a>
            )}
            {study.pmid && (
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/${study.pmid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                PubMed: {study.pmid}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Study group component for grouping by type
 */
interface StudyGroupProps {
  type: StudyType;
  studies: StudyReference[];
  defaultExpanded?: boolean;
}

function StudyGroup({ type, studies, defaultExpanded = false }: StudyGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const typeInfo = STUDY_TYPE_INFO[type];

  return (
    <div className="space-y-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
      >
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeInfo.bgColor} ${typeInfo.color} dark:bg-opacity-20`}
          >
            {typeInfo.label}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {studies.length} {studies.length === 1 ? 'study' : 'studies'}
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'transform rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="space-y-2 pl-2">
          {studies.map((study) => (
            <StudyItem key={study.id} study={study} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * EvidenceAccordion - Main component for displaying study citations
 */
export function EvidenceAccordion({
  studies,
  title = 'Scientific Evidence',
  groupByType = false,
  initialLimit = 5,
  className = '',
}: EvidenceAccordionProps) {
  const [showAll, setShowAll] = useState(false);

  if (studies.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <svg
          className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-sm text-gray-500 dark:text-gray-400">No studies available</p>
      </div>
    );
  }

  // Group studies by type if requested
  const groupedStudies = groupByType
    ? studies.reduce(
        (acc, study) => {
          const type = study.studyType || 'CASE_SERIES';
          if (!acc[type]) acc[type] = [];
          acc[type].push(study);
          return acc;
        },
        {} as Record<StudyType, StudyReference[]>
      )
    : null;

  // Sort groups by study type level
  const sortedTypes = groupedStudies
    ? (Object.keys(groupedStudies) as StudyType[]).sort(
        (a, b) => STUDY_TYPE_INFO[b].level - STUDY_TYPE_INFO[a].level
      )
    : null;

  const displayStudies = showAll ? studies : studies.slice(0, initialLimit);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {studies.length} {studies.length === 1 ? 'study' : 'studies'}
        </span>
      </div>

      {/* Evidence Summary Bar */}
      <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        {sortedTypes &&
          sortedTypes.map((type) => {
            const count = groupedStudies![type].length;
            const percentage = (count / studies.length) * 100;
            const typeInfo = STUDY_TYPE_INFO[type];
            return (
              <div
                key={type}
                className={`${typeInfo.bgColor} dark:opacity-80`}
                style={{ width: `${percentage}%` }}
                title={`${typeInfo.label}: ${count} studies`}
              />
            );
          })}
      </div>

      {/* Studies List */}
      {groupByType && sortedTypes ? (
        <div className="space-y-4">
          {sortedTypes.map((type, index) => (
            <StudyGroup
              key={type}
              type={type}
              studies={groupedStudies![type]}
              defaultExpanded={index === 0}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {displayStudies.map((study) => (
            <StudyItem key={study.id} study={study} />
          ))}
        </div>
      )}

      {/* Show More/Less */}
      {!groupByType && studies.length > initialLimit && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center gap-1"
        >
          {showAll ? (
            <>
              Show less
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              Show {studies.length - initialLimit} more
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      )}
    </div>
  );
}

/**
 * EvidenceSummaryCard - Compact summary of evidence for an ingredient
 */
export interface EvidenceSummaryCardProps {
  /** Total number of studies */
  totalStudies: number;
  /** Breakdown by study type */
  studyTypeCounts?: Partial<Record<StudyType, number>>;
  /** Overall evidence level */
  evidenceLevel: EvidenceLevel;
  /** Callback when clicked */
  onClick?: () => void;
  /** Custom class name */
  className?: string;
}

export function EvidenceSummaryCard({
  totalStudies,
  studyTypeCounts,
  evidenceLevel,
  onClick,
  className = '',
}: EvidenceSummaryCardProps) {
  const evidenceInfo = EVIDENCE_LEVEL_INFO[evidenceLevel];

  return (
    <div
      className={`
        p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
        ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Evidence Summary</h4>
        <span className={`text-sm font-medium ${evidenceInfo.color}`}>{evidenceInfo.label}</span>
      </div>

      <div className="flex items-end gap-4">
        <div>
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalStudies}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {totalStudies === 1 ? 'study' : 'studies'}
          </div>
        </div>

        {studyTypeCounts && Object.keys(studyTypeCounts).length > 0 && (
          <div className="flex-1 flex flex-wrap gap-1">
            {(Object.entries(studyTypeCounts) as [StudyType, number][])
              .sort(([a], [b]) => STUDY_TYPE_INFO[b].level - STUDY_TYPE_INFO[a].level)
              .slice(0, 3)
              .map(([type, count]) => {
                const typeInfo = STUDY_TYPE_INFO[type];
                return (
                  <span
                    key={type}
                    className={`px-2 py-0.5 rounded-full text-xs ${typeInfo.bgColor} ${typeInfo.color} dark:bg-opacity-20`}
                  >
                    {count} {typeInfo.label}
                  </span>
                );
              })}
          </div>
        )}
      </div>

      {onClick && (
        <button className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1">
          View all studies
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default EvidenceAccordion;
