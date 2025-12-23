/**
 * CompatibilityAnalyzer Component
 *
 * DermaLogica Intelligence MVP - Phase 6: Compatibility Analyzer
 *
 * Main orchestrating component that integrates:
 * - Product selection with search
 * - Compatibility matrix visualization
 * - Synergy and conflict lists
 * - Sequencing timeline
 * - Interaction detail modal
 */

import React, { useState, useCallback, useMemo } from 'react';
import { ProductSelector, SelectableProduct } from './ProductSelector';
import { CompatibilityMatrix, Interaction, MatrixItem, InteractionType } from './CompatibilityMatrix';
import { SynergyCard, SynergyList, Synergy } from './SynergyCard';
import { ConflictWarning, ConflictList, Conflict } from './ConflictWarning';
import { InteractionDetailModal, InteractionDetail } from './InteractionDetailModal';
import { SequencingTimeline, SequenceStep, TimeOfDay, autoSortSteps } from './SequencingTimeline';

/**
 * Analysis result from the hook/API
 */
export interface CompatibilityAnalysisResult {
  overallScore: number;
  interactions: Interaction[];
  synergies: Synergy[];
  conflicts: Conflict[];
  recommendedSequence: {
    morning: SequenceStep[];
    evening: SequenceStep[];
  };
}

/**
 * View mode for the analyzer
 */
export type AnalyzerViewMode = 'matrix' | 'list' | 'timeline';

export interface CompatibilityAnalyzerProps {
  /** Function to search for products/ingredients */
  onSearch: (query: string) => Promise<SelectableProduct[]>;
  /** Function to analyze compatibility */
  onAnalyze: (products: SelectableProduct[]) => Promise<CompatibilityAnalysisResult>;
  /** Maximum products allowed */
  maxProducts?: number;
  /** Initial selected products */
  initialProducts?: SelectableProduct[];
  /** Callback when analysis completes */
  onAnalysisComplete?: (result: CompatibilityAnalysisResult) => void;
  /** Callback when product is selected for detail view */
  onProductDetail?: (productId: string) => void;
  /** Custom class name */
  className?: string;
}

/**
 * Loading state component
 */
function AnalyzingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-pulse" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
      </div>
      <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Analyzing Compatibility
      </h3>
      <p className="mt-2 text-gray-500 dark:text-gray-400 text-center max-w-sm">
        Checking ingredient interactions, synergies, and optimal sequencing...
      </p>
    </div>
  );
}

/**
 * Empty state when no products selected
 */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <svg
        className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Check Product Compatibility
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        Add products or ingredients above to analyze their interactions. We'll identify synergies,
        conflicts, and recommend the optimal application order.
      </p>
    </div>
  );
}

/**
 * View mode tabs
 */
function ViewModeTabs({
  mode,
  onChange,
  hasConflicts,
  hasSynergies,
}: {
  mode: AnalyzerViewMode;
  onChange: (mode: AnalyzerViewMode) => void;
  hasConflicts: boolean;
  hasSynergies: boolean;
}) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <button
        onClick={() => onChange('matrix')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
          ${mode === 'matrix'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}
        `}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Matrix
      </button>
      <button
        onClick={() => onChange('list')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
          ${mode === 'list'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}
        `}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        Details
        {(hasConflicts || hasSynergies) && (
          <span className="ml-1 flex items-center gap-1">
            {hasSynergies && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
            {hasConflicts && (
              <span className="w-2 h-2 rounded-full bg-red-500" />
            )}
          </span>
        )}
      </button>
      <button
        onClick={() => onChange('timeline')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
          ${mode === 'timeline'
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}
        `}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Timeline
      </button>
    </div>
  );
}

/**
 * CompatibilityAnalyzer - Main component
 */
export function CompatibilityAnalyzer({
  onSearch,
  onAnalyze,
  maxProducts = 8,
  initialProducts = [],
  onAnalysisComplete,
  onProductDetail,
  className = '',
}: CompatibilityAnalyzerProps) {
  // State
  const [selectedProducts, setSelectedProducts] = useState<SelectableProduct[]>(initialProducts);
  const [analysisResult, setAnalysisResult] = useState<CompatibilityAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewMode, setViewMode] = useState<AnalyzerViewMode>('matrix');
  const [selectedInteraction, setSelectedInteraction] = useState<InteractionDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [morningSteps, setMorningSteps] = useState<SequenceStep[]>([]);
  const [eveningSteps, setEveningSteps] = useState<SequenceStep[]>([]);

  // Convert selected products to matrix items
  const matrixItems: MatrixItem[] = useMemo(() => {
    return selectedProducts.map((p) => ({
      id: p.id,
      name: p.name,
      shortName: p.name.length > 15 ? p.name.substring(0, 12) + '...' : p.name,
      type: p.type,
    }));
  }, [selectedProducts]);

  // Handle product selection change
  const handleProductsChange = useCallback(async (products: SelectableProduct[]) => {
    setSelectedProducts(products);

    // Auto-analyze when we have 2+ products
    if (products.length >= 2) {
      setIsAnalyzing(true);
      try {
        const result = await onAnalyze(products);
        setAnalysisResult(result);
        setMorningSteps(result.recommendedSequence.morning);
        setEveningSteps(result.recommendedSequence.evening);
        onAnalysisComplete?.(result);
      } catch (error) {
        console.error('Analysis failed:', error);
        setAnalysisResult(null);
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      setAnalysisResult(null);
      setMorningSteps([]);
      setEveningSteps([]);
    }
  }, [onAnalyze, onAnalysisComplete]);

  // Handle matrix cell click
  const handleCellClick = useCallback((itemA: MatrixItem, itemB: MatrixItem, interaction: Interaction | null) => {
    if (!interaction) return;

    // Create detailed interaction for modal
    const detail: InteractionDetail = {
      id: `${itemA.id}-${itemB.id}`,
      classification: interaction.type.includes('SYNERGY') ? 'synergy' :
                      interaction.type.includes('CONFLICT') ? 'conflict' : 'neutral',
      itemA: {
        id: itemA.id,
        name: itemA.name,
        type: itemA.type,
      },
      itemB: {
        id: itemB.id,
        name: itemB.name,
        type: itemB.type,
      },
      summary: interaction.summary,
      score: interaction.score,
      mechanism: interaction.mechanism || 'Mechanism details not available',
      effects: [],
      citations: [],
      recommendations: interaction.recommendation
        ? [{
            type: 'combination',
            instruction: interaction.recommendation,
            importance: 'recommended',
          }]
        : [],
      waitTime: interaction.waitTime,
    };

    setSelectedInteraction(detail);
    setIsModalOpen(true);
  }, []);

  // Handle synergy click
  const handleSynergyClick = useCallback((synergy: Synergy) => {
    const detail: InteractionDetail = {
      id: synergy.id,
      classification: 'synergy',
      itemA: {
        id: synergy.itemAId,
        name: synergy.itemAName,
        type: 'product',
      },
      itemB: {
        id: synergy.itemBId,
        name: synergy.itemBName,
        type: 'product',
      },
      summary: synergy.mechanism,
      score: synergy.strength === 'strong' ? 0.9 : synergy.strength === 'moderate' ? 0.6 : 0.3,
      mechanism: synergy.mechanism,
      effects: synergy.benefits,
      citations: synergy.evidence ? [{
        id: '1',
        title: 'Supporting Research',
        authors: ['Various'],
        year: 2023,
        keyFinding: `Based on ${synergy.evidence.studyCount} studies with ${synergy.evidence.level} evidence level`,
      }] : [],
      recommendations: synergy.usage ? [{
        type: 'combination',
        instruction: synergy.usage,
        importance: 'recommended',
      }] : [],
    };

    setSelectedInteraction(detail);
    setIsModalOpen(true);
  }, []);

  // Handle conflict click
  const handleConflictClick = useCallback((conflict: Conflict) => {
    const detail: InteractionDetail = {
      id: conflict.id,
      classification: 'conflict',
      itemA: {
        id: conflict.itemAId,
        name: conflict.itemAName,
        type: 'product',
      },
      itemB: {
        id: conflict.itemBId,
        name: conflict.itemBName,
        type: 'product',
      },
      summary: conflict.mechanism,
      score: conflict.severity === 'severe' ? -0.9 : conflict.severity === 'moderate' ? -0.5 : -0.2,
      mechanism: conflict.mechanism,
      effects: conflict.risks,
      citations: conflict.evidence ? [{
        id: '1',
        title: 'Research Basis',
        authors: ['Various'],
        year: 2023,
        keyFinding: `Based on ${conflict.evidence.studyCount} studies with ${conflict.evidence.level} evidence level`,
      }] : [],
      recommendations: conflict.mitigation.map((m) => ({
        type: m.type as any,
        instruction: m.instruction,
        importance: m.effectiveness === 'full' ? 'required' as const : 'recommended' as const,
      })),
      waitTime: conflict.waitTimeRecommended,
    };

    setSelectedInteraction(detail);
    setIsModalOpen(true);
  }, []);

  // Handle timeline reorder
  const handleTimelineReorder = useCallback((steps: SequenceStep[], timeOfDay: TimeOfDay) => {
    if (timeOfDay === 'morning') {
      setMorningSteps(steps);
    } else {
      setEveningSteps(steps);
    }
  }, []);

  // Handle step removal
  const handleStepRemove = useCallback((stepId: string) => {
    setMorningSteps((prev) => prev.filter((s) => s.id !== stepId));
    setEveningSteps((prev) => prev.filter((s) => s.id !== stepId));
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Product selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <ProductSelector
          selected={selectedProducts}
          onChange={handleProductsChange}
          onSearch={onSearch}
          maxProducts={maxProducts}
          label="Select Products to Analyze"
          helpText="Add products or ingredients to check their compatibility"
          placeholder="Search products or ingredients..."
        />
      </div>

      {/* Analysis content */}
      {selectedProducts.length < 2 && !isAnalyzing && (
        <EmptyState />
      )}

      {isAnalyzing && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <AnalyzingState />
        </div>
      )}

      {analysisResult && !isAnalyzing && (
        <>
          {/* View mode tabs */}
          <div className="flex items-center justify-between">
            <ViewModeTabs
              mode={viewMode}
              onChange={setViewMode}
              hasConflicts={analysisResult.conflicts.length > 0}
              hasSynergies={analysisResult.synergies.length > 0}
            />

            {/* Quick stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {analysisResult.synergies.length} Synergies
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {analysisResult.conflicts.length} Conflicts
                </span>
              </div>
            </div>
          </div>

          {/* Matrix view */}
          {viewMode === 'matrix' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <CompatibilityMatrix
                items={matrixItems}
                interactions={analysisResult.interactions}
                overallScore={analysisResult.overallScore}
                onCellClick={handleCellClick}
              />
            </div>
          )}

          {/* List view */}
          {viewMode === 'list' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Synergies */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  Synergies ({analysisResult.synergies.length})
                </h3>
                {analysisResult.synergies.length > 0 ? (
                  <SynergyList
                    synergies={analysisResult.synergies}
                    onSynergyClick={handleSynergyClick}
                    compact
                  />
                ) : (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                    No synergies detected between selected products
                  </div>
                )}
              </div>

              {/* Conflicts */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  Conflicts ({analysisResult.conflicts.length})
                </h3>
                {analysisResult.conflicts.length > 0 ? (
                  <ConflictList
                    conflicts={analysisResult.conflicts}
                    onConflictClick={handleConflictClick}
                    compact
                  />
                ) : (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                    <svg className="w-12 h-12 mx-auto mb-3 text-emerald-300 dark:text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    No conflicts detected - safe to use together!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timeline view */}
          {viewMode === 'timeline' && (
            <SequencingTimeline
              morningSteps={morningSteps}
              eveningSteps={eveningSteps}
              onReorder={handleTimelineReorder}
              onStepClick={(step) => onProductDetail?.(step.productId)}
              onStepRemove={handleStepRemove}
              editable
            />
          )}
        </>
      )}

      {/* Interaction detail modal */}
      <InteractionDetailModal
        interaction={selectedInteraction}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductClick={onProductDetail}
      />
    </div>
  );
}

export default CompatibilityAnalyzer;
