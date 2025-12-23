/**
 * CompatibilityAnalyzer Component
 *
 * DermaLogica Intelligence MVP - Phase 3
 *
 * Analyzes ingredient compatibility:
 * - Pairwise interaction checking
 * - Synergy and conflict detection
 * - Overall compatibility score
 * - Warnings and recommendations
 */

import React, { useState, useCallback } from 'react';
import {
  Plus,
  X,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Shield,
  Info,
  Loader2,
  Search,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import {
  useCompatibilityAnalysis,
  useLazyIntelligenceSearch,
  AccessLevel,
  CompatibilityResult,
  SkincareAtom,
  getInteractionColor,
} from '../../hooks/useIntelligence';

// Interaction type labels
const INTERACTION_LABELS: Record<string, string> = {
  SYNERGY: 'Synergy',
  CONFLICT: 'Conflict',
  NEUTRAL: 'Neutral',
  CAUTION: 'Use with Caution',
  SEQUENCE_DEPENDENT: 'Order Matters',
  CONCENTRATION_DEPENDENT: 'Concentration Sensitive',
};

// Interaction type descriptions
const INTERACTION_DESCRIPTIONS: Record<string, string> = {
  SYNERGY: 'These ingredients work better together, enhancing each other\'s effects',
  CONFLICT: 'These ingredients should not be used together - may cause irritation or reduce efficacy',
  NEUTRAL: 'No significant interaction - safe to use together',
  CAUTION: 'Can be used together with care - watch for sensitivity',
  SEQUENCE_DEPENDENT: 'Order of application matters for best results',
  CONCENTRATION_DEPENDENT: 'Compatibility depends on concentration levels',
};

export interface CompatibilityAnalyzerProps {
  initialAtoms?: SkincareAtom[];
  accessLevel?: AccessLevel;
  onCompatibilityChange?: (result: CompatibilityResult | null) => void;
  className?: string;
}

/**
 * SelectedAtomChip - Display chip for selected atom
 */
const SelectedAtomChip: React.FC<{
  atom: SkincareAtom;
  onRemove: () => void;
}> = ({ atom, onRemove }) => (
  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg border">
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">{atom.title}</p>
      {atom.atomType && (
        <p className="text-xs text-gray-500 uppercase">{atom.atomType.replace('_', ' ')}</p>
      )}
    </div>
    <button
      onClick={onRemove}
      className="p-1 text-gray-400 hover:text-gray-600 rounded"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);

/**
 * CompatibilityScoreRing - Circular progress for compatibility score
 */
const CompatibilityScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444';

  return (
    <div className="relative w-28 h-28">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-500"
        />
      </svg>
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color }}>
          {score}%
        </span>
        <span className="text-xs text-gray-500">Compatible</span>
      </div>
    </div>
  );
};

/**
 * InteractionCard - Display individual interaction
 */
const InteractionCard: React.FC<{
  interaction: {
    atomIds: [string, string];
    interactionType: string;
    description?: string;
    recommendation?: string;
  };
  atoms: Map<string, SkincareAtom>;
}> = ({ interaction, atoms }) => {
  const atom1 = atoms.get(interaction.atomIds[0]);
  const atom2 = atoms.get(interaction.atomIds[1]);
  const colorClass = getInteractionColor(interaction.interactionType);
  const isPositive = interaction.interactionType === 'SYNERGY';
  const isNegative = interaction.interactionType === 'CONFLICT';

  return (
    <div className={`p-3 rounded-lg border ${
      isPositive ? 'bg-green-50 border-green-200' :
      isNegative ? 'bg-red-50 border-red-200' :
      'bg-gray-50 border-gray-200'
    }`}>
      {/* Atoms involved */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium truncate max-w-[120px]">
          {atom1?.title || 'Unknown'}
        </span>
        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="text-sm font-medium truncate max-w-[120px]">
          {atom2?.title || 'Unknown'}
        </span>
      </div>

      {/* Interaction badge */}
      <Badge className={`text-xs ${colorClass}`}>
        {isPositive && <Zap className="w-3 h-3 mr-1" />}
        {isNegative && <AlertTriangle className="w-3 h-3 mr-1" />}
        {INTERACTION_LABELS[interaction.interactionType] || interaction.interactionType}
      </Badge>

      {/* Description */}
      {interaction.description && (
        <p className="text-xs text-gray-600 mt-2">{interaction.description}</p>
      )}

      {/* Recommendation */}
      {interaction.recommendation && (
        <p className="text-xs text-blue-600 mt-1 italic">
          Tip: {interaction.recommendation}
        </p>
      )}
    </div>
  );
};

/**
 * AtomSearchDropdown - Search and select atoms
 */
const AtomSearchDropdown: React.FC<{
  onSelect: (atom: SkincareAtom) => void;
  excludeIds: string[];
}> = ({ onSelect, excludeIds }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { search, results, loading } = useLazyIntelligenceSearch();

  const handleSearch = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.length >= 2) {
      await search(searchQuery, { atomTypes: ['INGREDIENT'] }, 10);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [search]);

  const handleSelect = (atom: SkincareAtom) => {
    onSelect(atom);
    setQuery('');
    setIsOpen(false);
  };

  const filteredResults = results?.filter((r) => !excludeIds.includes(r.atom.id)) || [];

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search ingredients..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="pl-10"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && filteredResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredResults.map((result) => (
            <button
              key={result.atom.id}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
              onClick={() => handleSelect(result.atom)}
            >
              <div>
                <p className="text-sm font-medium">{result.atom.title}</p>
                {result.atom.inciName && (
                  <p className="text-xs text-gray-500">INCI: {result.atom.inciName}</p>
                )}
              </div>
              <Plus className="w-4 h-4 text-gray-400" />
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {isOpen && query.length >= 2 && !loading && filteredResults.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg p-4 text-center">
          <p className="text-sm text-gray-500">No ingredients found</p>
        </div>
      )}
    </div>
  );
};

/**
 * CompatibilityAnalyzer - Main component
 */
export const CompatibilityAnalyzer: React.FC<CompatibilityAnalyzerProps> = ({
  initialAtoms = [],
  accessLevel = 'PROFESSIONAL',
  onCompatibilityChange,
  className = '',
}) => {
  const [selectedAtoms, setSelectedAtoms] = useState<SkincareAtom[]>(initialAtoms);
  const atomIds = selectedAtoms.map((a) => a.id);

  const { data, loading, error } = useCompatibilityAnalysis(
    atomIds,
    accessLevel
  );

  // Create atom lookup map
  const atomMap = new Map(selectedAtoms.map((a) => [a.id, a]));

  // Handle atom selection
  const handleAddAtom = useCallback((atom: SkincareAtom) => {
    setSelectedAtoms((prev) => {
      if (prev.find((a) => a.id === atom.id)) return prev;
      return [...prev, atom];
    });
  }, []);

  // Handle atom removal
  const handleRemoveAtom = useCallback((atomId: string) => {
    setSelectedAtoms((prev) => prev.filter((a) => a.id !== atomId));
  }, []);

  // Clear all
  const handleClearAll = useCallback(() => {
    setSelectedAtoms([]);
  }, []);

  // Notify parent of compatibility changes
  React.useEffect(() => {
    onCompatibilityChange?.(data);
  }, [data, onCompatibilityChange]);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-lg">Compatibility Analyzer</CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Check if skincare ingredients can be safely combined.
                  Add 2+ ingredients to analyze their compatibility.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search input */}
        <AtomSearchDropdown
          onSelect={handleAddAtom}
          excludeIds={atomIds}
        />

        {/* Selected atoms */}
        {selectedAtoms.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">
                Selected Ingredients ({selectedAtoms.length})
              </h4>
              {selectedAtoms.length > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClearAll}>
                  Clear All
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedAtoms.map((atom) => (
                <SelectedAtomChip
                  key={atom.id}
                  atom={atom}
                  onRemove={() => handleRemoveAtom(atom.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Minimum ingredients message */}
        {selectedAtoms.length < 2 && (
          <div className="text-center py-8 text-gray-500">
            <Shield className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Add at least 2 ingredients to check compatibility</p>
          </div>
        )}

        {/* Loading state */}
        {loading && selectedAtoms.length >= 2 && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Analyzing compatibility...</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span className="text-sm">Failed to analyze compatibility</span>
          </div>
        )}

        {/* Results */}
        {!loading && !error && data && selectedAtoms.length >= 2 && (
          <div className="space-y-4 pt-4 border-t">
            {/* Overall score */}
            <div className="flex items-center gap-6">
              <CompatibilityScoreRing score={data.overallScore} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {data.compatible ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-medium text-green-700">Compatible</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span className="font-medium text-red-700">Not Recommended</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {data.compatible
                    ? 'These ingredients can be used together safely.'
                    : 'Some ingredients may have negative interactions.'}
                </p>
              </div>
            </div>

            {/* Synergies */}
            {data.synergies && data.synergies.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-500" />
                  Synergies ({data.synergies.length})
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {data.synergies.map((synergy, idx) => (
                    <InteractionCard
                      key={idx}
                      interaction={synergy}
                      atoms={atomMap}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Conflicts */}
            {data.conflicts && data.conflicts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Conflicts ({data.conflicts.length})
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {data.conflicts.map((conflict, idx) => (
                    <InteractionCard
                      key={idx}
                      interaction={conflict}
                      atoms={atomMap}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {data.warnings && data.warnings.length > 0 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Warnings
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {data.warnings.map((warning, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5">•</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {data.recommendations && data.recommendations.length > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Recommendations
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  {data.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* No interactions found */}
            {(!data.synergies || data.synergies.length === 0) &&
             (!data.conflicts || data.conflicts.length === 0) && (
              <div className="text-center py-4 text-gray-500">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p className="text-sm">No significant interactions detected</p>
                <p className="text-xs text-gray-400 mt-1">
                  These ingredients should be safe to use together.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Interaction type legend */}
        {selectedAtoms.length >= 2 && !loading && (
          <div className="pt-4 border-t">
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
              Interaction Types
            </h4>
            <div className="flex flex-wrap gap-2">
              {['SYNERGY', 'CONFLICT', 'CAUTION', 'NEUTRAL'].map((type) => (
                <TooltipProvider key={type}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge className={`text-xs ${getInteractionColor(type)}`}>
                        {INTERACTION_LABELS[type]}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{INTERACTION_DESCRIPTIONS[type]}</p>
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

export default CompatibilityAnalyzer;
