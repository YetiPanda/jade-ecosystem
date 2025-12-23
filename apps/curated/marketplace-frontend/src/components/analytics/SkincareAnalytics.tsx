/**
 * SkincareAnalytics Panel
 *
 * Displays skincare-specific metrics: concerns, ingredients, routines, consultations
 */

import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { MetricCard } from './MetricCard';
import { Sparkles, Droplet, ListChecks, MessageSquare, Heart } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';
import { cn } from '../../lib/utils';

interface SkincareData {
  topConcerns: Array<{
    concern: string;
    frequency: number;
    trendDirection: 'INCREASING' | 'DECREASING' | 'STABLE';
  }>;
  popularIngredients: Array<{
    ingredient: string;
    searchCount: number;
    productCount: number;
  }>;
  routineComplexity: {
    simple: number; // 1-3 steps
    moderate: number; // 4-6 steps
    complex: number; // 7+ steps
    averageSteps: number;
  };
  consultationMetrics: {
    totalConsultations: number;
    completionRate: number;
    averageDuration: number;
    satisfactionScore: number;
  };
  skinTypeDistribution: Array<{
    skinType: string;
    percentage: number;
    count: number;
  }>;
}

interface SkincareAnalyticsProps {
  data?: SkincareData;
  loading?: boolean;
}

const CONCERN_COLORS = [
  '#2E8B57', // Jade
  '#3CB371',
  '#66BB6A',
  '#81C784',
  '#A5D6A7',
  '#C8E6C9',
  '#E8F5E9',
];

const ROUTINE_COLORS = {
  simple: '#81C784',
  moderate: '#66BB6A',
  complex: '#2E8B57',
};

const SKIN_TYPE_COLORS = [
  '#E8F5E9',
  '#A5D6A7',
  '#66BB6A',
  '#2E8B57',
  '#1B5E20',
];

export function SkincareAnalytics({ data, loading }: SkincareAnalyticsProps) {
  if (loading) {
    return <SkincareAnalyticsSkeleton />;
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No skincare data available
        </CardContent>
      </Card>
    );
  }

  // Prepare routine complexity data for pie chart (with fallback to 0 for undefined values)
  const routineData = [
    { name: 'Simple (1-3)', value: data.routineComplexity?.simple ?? 0, color: ROUTINE_COLORS.simple },
    { name: 'Moderate (4-6)', value: data.routineComplexity?.moderate ?? 0, color: ROUTINE_COLORS.moderate },
    { name: 'Complex (7+)', value: data.routineComplexity?.complex ?? 0, color: ROUTINE_COLORS.complex },
  ];

  return (
    <div className="space-y-6">
      {/* Consultation KPI Cards */}
      {data.consultationMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Consultations"
            value={data.consultationMetrics.totalConsultations}
            icon={MessageSquare}
            formatType="compact"
          />
          <MetricCard
            title="Completion Rate"
            value={data.consultationMetrics.completionRate}
            icon={ListChecks}
            formatType="percent"
          />
          <MetricCard
            title="Avg Duration"
            value={data.consultationMetrics.averageDuration}
            icon={Sparkles}
            subtitle="minutes"
          />
          <MetricCard
            title="Satisfaction Score"
            value={data.consultationMetrics.satisfactionScore}
            icon={Heart}
            subtitle="out of 5.0"
            className={data.consultationMetrics.satisfactionScore >= 4.5 ? 'border-green-200 bg-green-50' : ''}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Skin Concerns */}
        {data.topConcerns && data.topConcerns.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Top Skin Concerns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.topConcerns.slice(0, 7)}
                    layout="vertical"
                    margin={{ left: 80 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="concern"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      width={75}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        `${(value ?? 0).toLocaleString()} mentions`,
                        'Frequency',
                      ]}
                    />
                    <Bar dataKey="frequency" radius={[0, 4, 4, 0]}>
                      {data.topConcerns.slice(0, 7).map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CONCERN_COLORS[index % CONCERN_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {data.topConcerns.slice(0, 5).map((concern) => (
                  <div key={concern.concern} className="flex items-center justify-between">
                    <span className="text-sm">{concern.concern}</span>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      concern.trendDirection === 'INCREASING' && 'bg-green-100 text-green-700',
                      concern.trendDirection === 'DECREASING' && 'bg-red-100 text-red-700',
                      concern.trendDirection === 'STABLE' && 'bg-gray-100 text-gray-700'
                    )}>
                      {concern.trendDirection === 'INCREASING' && '↑ Trending'}
                      {concern.trendDirection === 'DECREASING' && '↓ Declining'}
                      {concern.trendDirection === 'STABLE' && '→ Stable'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Popular Ingredients */}
        {data.popularIngredients && data.popularIngredients.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-blue-500" />
                Popular Ingredients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.popularIngredients.slice(0, 8).map((ingredient, index) => {
                  const maxCount = Math.max(...data.popularIngredients.map((i) => i.searchCount));
                  const widthPercent = (ingredient.searchCount / maxCount) * 100;

                  return (
                    <div key={ingredient.ingredient}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{ingredient.ingredient}</span>
                        <span className="text-xs text-gray-500">
                          {(ingredient.searchCount ?? 0).toLocaleString()} searches
                        </span>
                      </div>
                      <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full transition-all"
                          style={{
                            width: `${widthPercent}%`,
                            backgroundColor: CONCERN_COLORS[index % CONCERN_COLORS.length],
                          }}
                        />
                        <span className="absolute inset-0 flex items-center justify-end pr-2 text-xs text-gray-600">
                          {ingredient.productCount} products
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Routine Complexity Distribution */}
        {data.routineComplexity && (
          <Card>
            <CardHeader>
              <CardTitle>Routine Complexity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="h-48 w-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={routineData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {routineData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${(value ?? 0).toLocaleString()} users`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-4">
                  {routineData.map((routine) => (
                    <div key={routine.name} className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: routine.color }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{routine.name}</p>
                        <p className="text-xs text-gray-500">
                          {(routine.value ?? 0).toLocaleString()} routines
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-600">
                      Average: <span className="font-semibold">{(data.routineComplexity?.averageSteps ?? 0).toFixed(1)}</span> steps
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skin Type Distribution */}
        {data.skinTypeDistribution && data.skinTypeDistribution.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Skin Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={data.skinTypeDistribution}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                      dataKey="skinType"
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                    />
                    <Radar
                      name="Users"
                      dataKey="percentage"
                      stroke="#2E8B57"
                      fill="#2E8B57"
                      fillOpacity={0.3}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${(value ?? 0).toFixed(1)}%`, 'Percentage']}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {data.skinTypeDistribution.map((type, index) => (
                  <div
                    key={type.skinType}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: SKIN_TYPE_COLORS[index % SKIN_TYPE_COLORS.length] }}
                    />
                    <span>{type.skinType}</span>
                    <span className="text-gray-500 ml-auto">{(type.percentage ?? 0).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function SkincareAnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="h-64 bg-gray-100 rounded" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="h-64 bg-gray-100 rounded" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SkincareAnalytics;
