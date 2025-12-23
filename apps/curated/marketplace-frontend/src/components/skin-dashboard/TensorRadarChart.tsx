/**
 * TensorRadarChart Component
 *
 * DermaLogica Intelligence MVP - Phase 4: Skin Dashboard
 *
 * Visualizes the 17D skin tensor coordinates as a radar chart
 * Compares current state vs. ideal state
 */

import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from 'recharts';

/**
 * Tensor coordinate interface matching backend
 */
export interface SkinTensorCoordinates {
  hydrationLevel: number;
  oilProduction: number;
  barrierHealth: number;
  elasticity: number;
  pigmentation: number;
  cellTurnover: number;
  inflammationLevel: number;
  antioxidantCapacity: number;
  collagenDensity: number;
  microbiomeBalance: number;
  sensitivityIndex: number;
  poreSize: number;
  surfaceTexture: number;
  photoaging: number;
  pHBalance: number;
  circulation: number;
  environmentalProtection: number;
}

/**
 * Dimension metadata for display
 */
interface TensorDimensionMeta {
  key: keyof SkinTensorCoordinates;
  label: string;
  shortLabel: string;
  category: 'hydration' | 'aging' | 'clarity' | 'sensitivity' | 'protection';
}

/**
 * All 17 dimensions with display metadata
 */
const TENSOR_DIMENSIONS: TensorDimensionMeta[] = [
  { key: 'hydrationLevel', label: 'Hydration Level', shortLabel: 'Hydration', category: 'hydration' },
  { key: 'oilProduction', label: 'Oil Production', shortLabel: 'Oil', category: 'hydration' },
  { key: 'barrierHealth', label: 'Barrier Health', shortLabel: 'Barrier', category: 'hydration' },
  { key: 'elasticity', label: 'Elasticity', shortLabel: 'Elastic.', category: 'aging' },
  { key: 'pigmentation', label: 'Pigmentation', shortLabel: 'Pigment.', category: 'clarity' },
  { key: 'cellTurnover', label: 'Cell Turnover', shortLabel: 'Turnover', category: 'aging' },
  { key: 'inflammationLevel', label: 'Inflammation', shortLabel: 'Inflam.', category: 'sensitivity' },
  { key: 'antioxidantCapacity', label: 'Antioxidant', shortLabel: 'Antiox.', category: 'protection' },
  { key: 'collagenDensity', label: 'Collagen', shortLabel: 'Collagen', category: 'aging' },
  { key: 'microbiomeBalance', label: 'Microbiome', shortLabel: 'Microb.', category: 'protection' },
  { key: 'sensitivityIndex', label: 'Sensitivity', shortLabel: 'Sens.', category: 'sensitivity' },
  { key: 'poreSize', label: 'Pore Size', shortLabel: 'Pores', category: 'clarity' },
  { key: 'surfaceTexture', label: 'Texture', shortLabel: 'Texture', category: 'clarity' },
  { key: 'photoaging', label: 'Photoaging', shortLabel: 'Photo.', category: 'protection' },
  { key: 'pHBalance', label: 'pH Balance', shortLabel: 'pH', category: 'hydration' },
  { key: 'circulation', label: 'Circulation', shortLabel: 'Circ.', category: 'aging' },
  { key: 'environmentalProtection', label: 'Env. Protection', shortLabel: 'Env. Prot.', category: 'protection' },
];

/**
 * Category colors
 */
const CATEGORY_COLORS: Record<string, string> = {
  hydration: '#3B82F6',
  aging: '#8B5CF6',
  clarity: '#EC4899',
  sensitivity: '#F59E0B',
  protection: '#10B981',
};

export interface TensorRadarChartProps {
  /** Current tensor coordinates */
  currentTensor: SkinTensorCoordinates | null;
  /** Ideal tensor coordinates for comparison */
  idealTensor?: SkinTensorCoordinates | null;
  /** Chart height in pixels */
  height?: number;
  /** Whether to show the ideal comparison */
  showIdeal?: boolean;
  /** Whether to show category colors */
  showCategoryColors?: boolean;
  /** Whether to use short labels */
  useShortLabels?: boolean;
  /** Custom class name */
  className?: string;
  /** Callback when dimension is clicked */
  onDimensionClick?: (dimension: keyof SkinTensorCoordinates) => void;
}

/**
 * Custom tooltip for radar chart
 */
const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  const dimension = TENSOR_DIMENSIONS.find((d) => d.shortLabel === data.dimension || d.label === data.dimension);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
      <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">
        {dimension?.label || data.dimension}
      </p>
      <div className="space-y-1 text-sm">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600 dark:text-gray-400">{entry.name}:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {Math.round(entry.value * 100)}%
            </span>
          </div>
        ))}
      </div>
      {dimension && (
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <span
            className="inline-block px-2 py-0.5 rounded text-xs font-medium"
            style={{ backgroundColor: `${CATEGORY_COLORS[dimension.category]}20`, color: CATEGORY_COLORS[dimension.category] }}
          >
            {dimension.category.charAt(0).toUpperCase() + dimension.category.slice(1)}
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * TensorRadarChart - Visualizes 17D skin tensor coordinates
 */
export function TensorRadarChart({
  currentTensor,
  idealTensor,
  height = 400,
  showIdeal = true,
  showCategoryColors = false,
  useShortLabels = true,
  className = '',
  onDimensionClick,
}: TensorRadarChartProps) {
  /**
   * Transform tensor data for recharts
   */
  const chartData = useMemo(() => {
    if (!currentTensor) {
      return TENSOR_DIMENSIONS.map((dim) => ({
        dimension: useShortLabels ? dim.shortLabel : dim.label,
        current: 0,
        ideal: idealTensor?.[dim.key] ?? 0,
        category: dim.category,
        key: dim.key,
      }));
    }

    return TENSOR_DIMENSIONS.map((dim) => ({
      dimension: useShortLabels ? dim.shortLabel : dim.label,
      current: currentTensor[dim.key] ?? 0,
      ideal: idealTensor?.[dim.key] ?? 0,
      category: dim.category,
      key: dim.key,
    }));
  }, [currentTensor, idealTensor, useShortLabels]);

  /**
   * Calculate overall health score
   */
  const overallScore = useMemo(() => {
    if (!currentTensor || !idealTensor) return null;

    let totalDeviation = 0;
    let count = 0;

    for (const dim of TENSOR_DIMENSIONS) {
      const current = currentTensor[dim.key] ?? 0;
      const ideal = idealTensor[dim.key] ?? 0;
      totalDeviation += Math.abs(current - ideal);
      count++;
    }

    return Math.round((1 - totalDeviation / count) * 100);
  }, [currentTensor, idealTensor]);

  /**
   * Handle click on dimension
   */
  const handleClick = (data: any) => {
    if (onDimensionClick && data?.activePayload?.[0]?.payload?.key) {
      onDimensionClick(data.activePayload[0].payload.key);
    }
  };

  if (!currentTensor) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <p className="text-lg font-medium">No Skin Data</p>
          <p className="text-sm mt-1">Complete a skin assessment to see your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Overall Score Badge */}
      {overallScore !== null && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md px-4 py-2 border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Skin Health
            </div>
            <div className={`text-2xl font-bold ${
              overallScore >= 80 ? 'text-green-500' :
              overallScore >= 60 ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              {overallScore}%
            </div>
          </div>
        </div>
      )}

      {/* Radar Chart */}
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={chartData} onClick={handleClick}>
          <PolarGrid
            stroke="#E5E7EB"
            strokeDasharray="3 3"
          />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{
              fill: '#6B7280',
              fontSize: 11,
            }}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 1]}
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
            tickFormatter={(value) => `${Math.round(value * 100)}%`}
          />

          {/* Ideal Radar (background) */}
          {showIdeal && idealTensor && (
            <Radar
              name="Ideal"
              dataKey="ideal"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.1}
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          )}

          {/* Current Radar (foreground) */}
          <Radar
            name="Current"
            dataKey="current"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.3}
            strokeWidth={2}
          />

          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Category Legend */}
      {showCategoryColors && (
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
            <div key={category} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                {category}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Compact version of the radar chart
 */
export function TensorRadarChartCompact({
  currentTensor,
  idealTensor,
  className = '',
}: Pick<TensorRadarChartProps, 'currentTensor' | 'idealTensor' | 'className'>) {
  return (
    <TensorRadarChart
      currentTensor={currentTensor}
      idealTensor={idealTensor}
      height={250}
      showIdeal={true}
      showCategoryColors={false}
      useShortLabels={true}
      className={className}
    />
  );
}

export default TensorRadarChart;
