/**
 * EvidencePanel Component
 *
 * DermaLogica Intelligence MVP - Phase 3
 *
 * Displays scientific evidence for skincare claims:
 * - Evidence levels (Anecdotal to Gold Standard)
 * - Claim types and descriptions
 * - Study details and sources
 * - Evidence strength visualization
 */

import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FlaskConical,
  BookOpen,
  Award,
  Loader2,
  Filter,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/Button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import {
  ClaimEvidence,
  EvidenceLevel,
  getEvidenceLevelLabel,
  getEvidenceLevelColor,
} from '../../hooks/useIntelligence';

// Evidence level icons
const EVIDENCE_ICONS: Record<EvidenceLevel, React.ReactNode> = {
  ANECDOTAL: <Users className="w-4 h-4" />,
  OBSERVATIONAL: <BookOpen className="w-4 h-4" />,
  IN_VITRO: <FlaskConical className="w-4 h-4" />,
  CLINICAL_PILOT: <FileText className="w-4 h-4" />,
  CLINICAL_PUBLISHED: <CheckCircle className="w-4 h-4" />,
  META_ANALYSIS: <Shield className="w-4 h-4" />,
  GOLD_STANDARD: <Award className="w-4 h-4" />,
};

// Evidence level descriptions
const EVIDENCE_DESCRIPTIONS: Record<EvidenceLevel, string> = {
  ANECDOTAL: 'User reports and testimonials, not scientifically validated',
  OBSERVATIONAL: 'Correlational studies without controlled experiments',
  IN_VITRO: 'Laboratory cell culture studies, may not reflect real-world results',
  CLINICAL_PILOT: 'Small-scale human trials, preliminary results',
  CLINICAL_PUBLISHED: 'Peer-reviewed human clinical trials',
  META_ANALYSIS: 'Statistical analysis of multiple studies',
  GOLD_STANDARD: 'Randomized, double-blind, placebo-controlled trials',
};

// Claim type labels
const CLAIM_TYPE_LABELS: Record<string, string> = {
  MOISTURIZING: 'Moisturizing',
  ANTI_AGING: 'Anti-Aging',
  BRIGHTENING: 'Brightening',
  ANTI_ACNE: 'Anti-Acne',
  SOOTHING: 'Soothing',
  EXFOLIATING: 'Exfoliating',
  SUN_PROTECTION: 'Sun Protection',
  COLLAGEN_BOOSTING: 'Collagen Boosting',
  PORE_MINIMIZING: 'Pore Minimizing',
  FIRMING: 'Firming',
  HYDRATING: 'Hydrating',
  ANTIOXIDANT: 'Antioxidant',
};

// Claim type colors
const CLAIM_TYPE_COLORS: Record<string, string> = {
  MOISTURIZING: 'bg-blue-100 text-blue-800',
  ANTI_AGING: 'bg-purple-100 text-purple-800',
  BRIGHTENING: 'bg-yellow-100 text-yellow-800',
  ANTI_ACNE: 'bg-green-100 text-green-800',
  SOOTHING: 'bg-teal-100 text-teal-800',
  EXFOLIATING: 'bg-orange-100 text-orange-800',
  SUN_PROTECTION: 'bg-amber-100 text-amber-800',
  COLLAGEN_BOOSTING: 'bg-pink-100 text-pink-800',
  PORE_MINIMIZING: 'bg-indigo-100 text-indigo-800',
  FIRMING: 'bg-rose-100 text-rose-800',
  HYDRATING: 'bg-cyan-100 text-cyan-800',
  ANTIOXIDANT: 'bg-emerald-100 text-emerald-800',
  default: 'bg-gray-100 text-gray-800',
};

// Evidence level order for sorting
const EVIDENCE_ORDER: Record<EvidenceLevel, number> = {
  GOLD_STANDARD: 7,
  META_ANALYSIS: 6,
  CLINICAL_PUBLISHED: 5,
  CLINICAL_PILOT: 4,
  IN_VITRO: 3,
  OBSERVATIONAL: 2,
  ANECDOTAL: 1,
};

export interface EvidencePanelProps {
  evidence: ClaimEvidence[];
  atomTitle?: string;
  loading?: boolean;
  showFilters?: boolean;
  onAddEvidence?: () => void;
  className?: string;
}

/**
 * EvidenceStrengthBar - Visual representation of evidence strength
 */
const EvidenceStrengthBar: React.FC<{ level: EvidenceLevel }> = ({ level }) => {
  const strength = EVIDENCE_ORDER[level] || 1;
  const maxStrength = 7;
  const percentage = (strength / maxStrength) * 100;

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className={`h-full transition-all duration-300 ${
          strength >= 6
            ? 'bg-green-500'
            : strength >= 4
            ? 'bg-yellow-500'
            : 'bg-orange-500'
        }`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

/**
 * EvidenceCard - Single evidence item display
 */
const EvidenceCard: React.FC<{
  evidence: ClaimEvidence;
  expanded?: boolean;
  onToggle?: () => void;
}> = ({ evidence, expanded = false, onToggle }) => {
  const levelColor = getEvidenceLevelColor(evidence.evidenceLevel);
  const claimColor = CLAIM_TYPE_COLORS[evidence.claimType] || CLAIM_TYPE_COLORS.default;
  const icon = EVIDENCE_ICONS[evidence.evidenceLevel];

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <button
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {/* Evidence level icon */}
          <div className={`p-2 rounded-full ${levelColor}`}>
            {icon}
          </div>

          {/* Claim info */}
          <div className="text-left">
            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${claimColor}`}>
                {CLAIM_TYPE_LABELS[evidence.claimType] || evidence.claimType}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {getEvidenceLevelLabel(evidence.evidenceLevel)}
              </Badge>
            </div>
            <p className="text-sm text-gray-700 mt-1 line-clamp-1">
              {evidence.claim}
            </p>
          </div>
        </div>

        {/* Expand/collapse */}
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 py-3 border-t bg-gray-50 space-y-3">
          {/* Full claim */}
          <div>
            <h5 className="text-xs font-medium text-gray-500 uppercase mb-1">
              Claim
            </h5>
            <p className="text-sm text-gray-700">{evidence.claim}</p>
          </div>

          {/* Evidence strength */}
          <div>
            <h5 className="text-xs font-medium text-gray-500 uppercase mb-1">
              Evidence Strength
            </h5>
            <EvidenceStrengthBar level={evidence.evidenceLevel} />
            <p className="text-xs text-gray-500 mt-1">
              {EVIDENCE_DESCRIPTIONS[evidence.evidenceLevel]}
            </p>
          </div>

          {/* Study details */}
          {evidence.studyDetails && (
            <div>
              <h5 className="text-xs font-medium text-gray-500 uppercase mb-1">
                Study Details
              </h5>
              <p className="text-sm text-gray-700">{evidence.studyDetails}</p>
            </div>
          )}

          {/* Source URL */}
          {evidence.sourceUrl && (
            <div>
              <h5 className="text-xs font-medium text-gray-500 uppercase mb-1">
                Source
              </h5>
              <a
                href={evidence.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                View Source <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Sample size */}
          {evidence.sampleSize && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <Users className="w-4 h-4" />
                <span>Sample: {evidence.sampleSize}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * EvidencePanel - Main component for displaying evidence
 */
export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  evidence,
  atomTitle,
  loading = false,
  showFilters = true,
  onAddEvidence,
  className = '',
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [filterLevel, setFilterLevel] = useState<EvidenceLevel | 'ALL'>('ALL');
  const [filterClaimType, setFilterClaimType] = useState<string | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'strength' | 'recent'>('strength');

  // Toggle expansion
  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Expand all / collapse all
  const expandAll = () => {
    setExpandedIds(new Set(evidence.map((e) => e.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  // Filter and sort evidence
  const filteredEvidence = evidence
    .filter((e) => filterLevel === 'ALL' || e.evidenceLevel === filterLevel)
    .filter((e) => filterClaimType === 'ALL' || e.claimType === filterClaimType)
    .sort((a, b) => {
      if (sortBy === 'strength') {
        return EVIDENCE_ORDER[b.evidenceLevel] - EVIDENCE_ORDER[a.evidenceLevel];
      }
      // Sort by recent (createdAt)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Get unique claim types for filter
  const uniqueClaimTypes = [...new Set(evidence.map((e) => e.claimType))];

  // Calculate evidence summary
  const evidenceSummary = {
    total: evidence.length,
    highQuality: evidence.filter(
      (e) => EVIDENCE_ORDER[e.evidenceLevel] >= 5
    ).length,
    avgStrength:
      evidence.length > 0
        ? evidence.reduce((sum, e) => sum + EVIDENCE_ORDER[e.evidenceLevel], 0) /
          evidence.length
        : 0,
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              Evidence Panel
            </CardTitle>
            {atomTitle && (
              <p className="text-sm text-gray-500 mt-1">
                Scientific evidence for: <span className="font-medium">{atomTitle}</span>
              </p>
            )}
          </div>

          {onAddEvidence && (
            <Button variant="outline" size="sm" onClick={onAddEvidence}>
              + Add Evidence
            </Button>
          )}
        </div>

        {/* Evidence summary */}
        {evidence.length > 0 && (
          <div className="flex items-center gap-4 mt-3 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <FileText className="w-4 h-4" />
              <span>{evidenceSummary.total} sources</span>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>{evidenceSummary.highQuality} high-quality</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Avg: {(evidenceSummary.avgStrength / 7 * 100).toFixed(0)}%</span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {/* Filters */}
        {showFilters && evidence.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b">
            {/* Evidence level filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                className="text-sm border rounded-md px-2 py-1 bg-white"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value as EvidenceLevel | 'ALL')}
              >
                <option value="ALL">All Levels</option>
                <option value="GOLD_STANDARD">Gold Standard</option>
                <option value="META_ANALYSIS">Meta Analysis</option>
                <option value="CLINICAL_PUBLISHED">Clinical Published</option>
                <option value="CLINICAL_PILOT">Clinical Pilot</option>
                <option value="IN_VITRO">In Vitro</option>
                <option value="OBSERVATIONAL">Observational</option>
                <option value="ANECDOTAL">Anecdotal</option>
              </select>
            </div>

            {/* Claim type filter */}
            <select
              className="text-sm border rounded-md px-2 py-1 bg-white"
              value={filterClaimType}
              onChange={(e) => setFilterClaimType(e.target.value)}
            >
              <option value="ALL">All Claims</option>
              {uniqueClaimTypes.map((type) => (
                <option key={type} value={type}>
                  {CLAIM_TYPE_LABELS[type] || type}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              className="text-sm border rounded-md px-2 py-1 bg-white"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'strength' | 'recent')}
            >
              <option value="strength">Sort by Strength</option>
              <option value="recent">Sort by Recent</option>
            </select>

            {/* Expand/Collapse all */}
            <div className="flex-1" />
            <Button variant="ghost" size="sm" onClick={expandAll}>
              Expand All
            </Button>
            <Button variant="ghost" size="sm" onClick={collapseAll}>
              Collapse All
            </Button>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Loading evidence...</span>
          </div>
        )}

        {/* Evidence list */}
        {!loading && filteredEvidence.length > 0 && (
          <div className="space-y-3">
            {filteredEvidence.map((item) => (
              <EvidenceCard
                key={item.id}
                evidence={item}
                expanded={expandedIds.has(item.id)}
                onToggle={() => toggleExpanded(item.id)}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && evidence.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No evidence sources found</p>
            <p className="text-xs text-gray-400 mt-1">
              Add scientific evidence to support claims about this ingredient.
            </p>
            {onAddEvidence && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={onAddEvidence}
              >
                Add First Evidence
              </Button>
            )}
          </div>
        )}

        {/* Filtered empty state */}
        {!loading && evidence.length > 0 && filteredEvidence.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <p className="text-sm">No evidence matches current filters</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => {
                setFilterLevel('ALL');
                setFilterClaimType('ALL');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Evidence level legend */}
        {evidence.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-3">
              Evidence Level Guide
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {Object.entries(EVIDENCE_ORDER)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 4)
                .map(([level]) => (
                  <TooltipProvider key={level}>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1 text-gray-600">
                        {EVIDENCE_ICONS[level as EvidenceLevel]}
                        <span>{getEvidenceLevelLabel(level as EvidenceLevel)}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          {EVIDENCE_DESCRIPTIONS[level as EvidenceLevel]}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EvidencePanel;
