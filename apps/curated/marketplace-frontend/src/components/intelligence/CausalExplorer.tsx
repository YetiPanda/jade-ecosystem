/**
 * CausalExplorer Component
 *
 * DermaLogica Intelligence MVP - Phase 3
 *
 * Visualizes causal chains between skincare atoms:
 * - Upstream (prerequisites) - what must happen first
 * - Downstream (consequences) - what happens as a result
 * - Interactive navigation through the knowledge graph
 */

import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ArrowLeft,
  Expand,
  Info,
  AlertTriangle,
  CheckCircle,
  Circle,
  Loader2,
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
  useCausalChain,
  CausalDirection,
  AccessLevel,
  CausalChainNode,
  SkincareAtom,
  getThresholdLabel,
  getEvidenceLevelLabel,
} from '../../hooks/useIntelligence';

// Relationship type labels
const RELATIONSHIP_LABELS: Record<string, string> = {
  ENABLES: 'Enables',
  INHIBITS: 'Inhibits',
  PREREQUISITE_OF: 'Required Before',
  CONSEQUENCE_OF: 'Results From',
  FORMULATED_WITH: 'Formulated With',
  SYNERGIZES_WITH: 'Synergizes With',
  CONFLICTS_WITH: 'Conflicts With',
  REPLACES: 'Replaces',
  ACQUIRES: 'Acquires',
  COMPETES_WITH: 'Competes With',
  OWNED_BY: 'Owned By',
  REGULATES: 'Regulates',
  RESTRICTS: 'Restricts',
  APPROVES: 'Approves',
  INFLUENCES: 'Influences',
  DISRUPTS: 'Disrupts',
};

// Relationship colors
const RELATIONSHIP_COLORS: Record<string, string> = {
  ENABLES: 'bg-green-100 text-green-800',
  INHIBITS: 'bg-red-100 text-red-800',
  PREREQUISITE_OF: 'bg-blue-100 text-blue-800',
  CONSEQUENCE_OF: 'bg-purple-100 text-purple-800',
  SYNERGIZES_WITH: 'bg-emerald-100 text-emerald-800',
  CONFLICTS_WITH: 'bg-orange-100 text-orange-800',
  REPLACES: 'bg-yellow-100 text-yellow-800',
  FORMULATED_WITH: 'bg-cyan-100 text-cyan-800',
  default: 'bg-gray-100 text-gray-800',
};

// Knowledge threshold colors
const THRESHOLD_COLORS: Record<string, string> = {
  T1: 'bg-gray-100 text-gray-700 border-gray-300',
  T2: 'bg-blue-50 text-blue-700 border-blue-300',
  T3: 'bg-indigo-50 text-indigo-700 border-indigo-300',
  T4: 'bg-purple-50 text-purple-700 border-purple-300',
  T5: 'bg-violet-50 text-violet-700 border-violet-300',
  T6: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-300',
  T7: 'bg-pink-50 text-pink-700 border-pink-300',
  T8: 'bg-rose-50 text-rose-700 border-rose-300',
};

export interface CausalExplorerProps {
  atomId: string;
  atomTitle?: string;
  initialDirection?: CausalDirection;
  maxDepth?: number;
  accessLevel?: AccessLevel;
  onAtomSelect?: (atomId: string) => void;
  className?: string;
}

/**
 * CausalNodeCard - Displays a single node in the causal chain
 */
const CausalNodeCard: React.FC<{
  node: CausalChainNode;
  direction: CausalDirection;
  onNavigate?: (atomId: string) => void;
}> = ({ node, direction, onNavigate }) => {
  const { atom, relationship, depth } = node;
  const relColor = RELATIONSHIP_COLORS[relationship.relationshipType] || RELATIONSHIP_COLORS.default;
  const thresholdColor = atom.knowledgeThreshold
    ? THRESHOLD_COLORS[atom.knowledgeThreshold] || THRESHOLD_COLORS.T1
    : THRESHOLD_COLORS.T1;

  return (
    <div
      className={`
        relative border rounded-lg p-4 bg-white shadow-sm
        transition-all duration-200 hover:shadow-md
        ${depth === 1 ? 'ml-0' : depth === 2 ? 'ml-4' : 'ml-8'}
      `}
    >
      {/* Depth indicator line */}
      {depth > 1 && (
        <div
          className="absolute left-0 top-1/2 -translate-x-4 w-4 h-px bg-gray-300"
        />
      )}

      {/* Relationship badge */}
      <div className="flex items-center gap-2 mb-2">
        {direction === 'upstream' ? (
          <ArrowLeft className="w-4 h-4 text-gray-400" />
        ) : (
          <ArrowRight className="w-4 h-4 text-gray-400" />
        )}
        <Badge className={`text-xs ${relColor}`}>
          {RELATIONSHIP_LABELS[relationship.relationshipType] || relationship.relationshipType}
        </Badge>
        {relationship.strength && (
          <span className="text-xs text-gray-500">
            {Math.round(relationship.strength * 100)}% strength
          </span>
        )}
      </div>

      {/* Atom info */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">
            {atom.title}
          </h4>
          {atom.atomType && (
            <span className="text-xs text-gray-500 uppercase">
              {atom.atomType.replace('_', ' ')}
            </span>
          )}
          {atom.glanceText && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {atom.glanceText}
            </p>
          )}
        </div>

        {/* Knowledge threshold badge */}
        {atom.knowledgeThreshold && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge className={`text-xs border ${thresholdColor}`}>
                  {atom.knowledgeThreshold}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getThresholdLabel(atom.knowledgeThreshold)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Evidence description */}
      {relationship.evidenceDescription && (
        <p className="text-xs text-gray-500 mt-2 italic">
          "{relationship.evidenceDescription}"
        </p>
      )}

      {/* Navigate button */}
      {onNavigate && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full text-xs"
          onClick={() => onNavigate(atom.id)}
        >
          Explore {atom.title}
          <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      )}
    </div>
  );
};

/**
 * CausalChainList - Displays list of causal chain nodes
 */
const CausalChainList: React.FC<{
  nodes: CausalChainNode[];
  direction: CausalDirection;
  onNavigate?: (atomId: string) => void;
}> = ({ nodes, direction, onNavigate }) => {
  if (nodes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Circle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p className="text-sm">
          No {direction === 'upstream' ? 'prerequisites' : 'consequences'} found
        </p>
      </div>
    );
  }

  // Group nodes by depth
  const nodesByDepth = nodes.reduce((acc, node) => {
    const depth = node.depth;
    if (!acc[depth]) acc[depth] = [];
    acc[depth].push(node);
    return acc;
  }, {} as Record<number, CausalChainNode[]>);

  return (
    <div className="space-y-3">
      {Object.entries(nodesByDepth).map(([depth, depthNodes]) => (
        <div key={depth} className="space-y-2">
          <div className="text-xs text-gray-400 uppercase tracking-wider">
            {direction === 'upstream' ? 'Level' : 'Step'} {depth}
          </div>
          {depthNodes.map((node, idx) => (
            <CausalNodeCard
              key={`${node.atom.id}-${idx}`}
              node={node}
              direction={direction}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * CausalExplorer - Main component for exploring causal relationships
 */
export const CausalExplorer: React.FC<CausalExplorerProps> = ({
  atomId,
  atomTitle,
  initialDirection = 'both',
  maxDepth = 3,
  accessLevel = 'PROFESSIONAL',
  onAtomSelect,
  className = '',
}) => {
  const [direction, setDirection] = useState<CausalDirection>(initialDirection);
  const [depth, setDepth] = useState(maxDepth);
  const [currentAtomId, setCurrentAtomId] = useState(atomId);
  const [navigationStack, setNavigationStack] = useState<string[]>([atomId]);

  const { data, loading, error, refetch } = useCausalChain(
    currentAtomId,
    direction,
    depth,
    accessLevel
  );

  // Handle navigation to a new atom
  const handleNavigate = useCallback((newAtomId: string) => {
    setNavigationStack((prev) => [...prev, newAtomId]);
    setCurrentAtomId(newAtomId);
    onAtomSelect?.(newAtomId);
  }, [onAtomSelect]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (navigationStack.length > 1) {
      const newStack = [...navigationStack];
      newStack.pop();
      const previousAtomId = newStack[newStack.length - 1];
      setNavigationStack(newStack);
      setCurrentAtomId(previousAtomId);
      onAtomSelect?.(previousAtomId);
    }
  }, [navigationStack, onAtomSelect]);

  // Handle direction change
  const handleDirectionChange = (newDirection: CausalDirection) => {
    setDirection(newDirection);
  };

  // Handle depth change
  const handleDepthChange = (newDepth: number) => {
    setDepth(Math.max(1, Math.min(5, newDepth)));
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {navigationStack.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="p-1"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            <CardTitle className="text-lg">
              Causal Explorer
            </CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Explore cause-and-effect relationships in skincare science.
                  Prerequisites show what must happen first; consequences show
                  what results from this knowledge.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Current atom title */}
        {(atomTitle || data?.atom?.title) && (
          <p className="text-sm text-gray-600 mt-1">
            Exploring: <span className="font-medium">{atomTitle || data?.atom?.title}</span>
          </p>
        )}

        {/* Navigation breadcrumb */}
        {navigationStack.length > 1 && (
          <div className="flex items-center gap-1 text-xs text-gray-400 mt-2 overflow-x-auto">
            {navigationStack.map((id, idx) => (
              <React.Fragment key={id}>
                {idx > 0 && <ChevronRight className="w-3 h-3 flex-shrink-0" />}
                <span
                  className={`truncate max-w-[100px] ${
                    idx === navigationStack.length - 1 ? 'text-gray-700 font-medium' : ''
                  }`}
                >
                  {idx === 0 ? 'Start' : `Step ${idx}`}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {/* Controls */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b">
          {/* Direction toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Direction:</span>
            <div className="flex border rounded-md overflow-hidden">
              <button
                className={`px-3 py-1 text-xs transition-colors ${
                  direction === 'upstream'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => handleDirectionChange('upstream')}
              >
                Prerequisites
              </button>
              <button
                className={`px-3 py-1 text-xs transition-colors border-l border-r ${
                  direction === 'both'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => handleDirectionChange('both')}
              >
                Both
              </button>
              <button
                className={`px-3 py-1 text-xs transition-colors ${
                  direction === 'downstream'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => handleDirectionChange('downstream')}
              >
                Consequences
              </button>
            </div>
          </div>

          {/* Depth control */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Depth:</span>
            <div className="flex items-center gap-1">
              <button
                className="w-6 h-6 flex items-center justify-center border rounded text-sm hover:bg-gray-50"
                onClick={() => handleDepthChange(depth - 1)}
                disabled={depth <= 1}
              >
                -
              </button>
              <span className="w-6 text-center text-sm">{depth}</span>
              <button
                className="w-6 h-6 flex items-center justify-center border rounded text-sm hover:bg-gray-50"
                onClick={() => handleDepthChange(depth + 1)}
                disabled={depth >= 5}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Loading causal chain...</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span className="text-sm">Failed to load causal chain</span>
          </div>
        )}

        {/* Results */}
        {!loading && !error && data && (
          <div className="space-y-6">
            {/* Upstream (Prerequisites) */}
            {(direction === 'upstream' || direction === 'both') && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4 text-blue-500" />
                  Prerequisites
                  <span className="text-xs text-gray-400">
                    ({data.upstream?.length || 0})
                  </span>
                </h3>
                <CausalChainList
                  nodes={data.upstream || []}
                  direction="upstream"
                  onNavigate={handleNavigate}
                />
              </div>
            )}

            {/* Current atom divider */}
            {direction === 'both' && (
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-gray-200" />
                <div className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 font-medium">
                  {data.atom?.title || 'Current Topic'}
                </div>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            )}

            {/* Downstream (Consequences) */}
            {(direction === 'downstream' || direction === 'both') && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-green-500" />
                  Consequences
                  <span className="text-xs text-gray-400">
                    ({data.downstream?.length || 0})
                  </span>
                </h3>
                <CausalChainList
                  nodes={data.downstream || []}
                  direction="downstream"
                  onNavigate={handleNavigate}
                />
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && data &&
          (data.upstream?.length || 0) === 0 &&
          (data.downstream?.length || 0) === 0 && (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
            <p className="text-sm">No causal relationships found for this atom.</p>
            <p className="text-xs text-gray-400 mt-1">
              This may be a foundational concept with no prerequisites.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CausalExplorer;
