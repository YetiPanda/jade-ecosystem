/**
 * AIPerformance Panel
 *
 * Displays AI recommendation, prediction, and analysis metrics
 */

import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { MetricCard } from './MetricCard';
import { Brain, Target, Zap, Clock, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { cn } from '../../lib/utils';

interface AIData {
  recommendationPerformance: {
    acceptanceRate: number;
    clickThroughRate: number;
    conversionRate: number;
    revenueImpact: number;
  };
  analysisMetrics: {
    totalAnalyses: number;
    averageProcessingTime: number;
    accuracyScore: number;
    userSatisfaction: number;
  };
  predictionAccuracy: {
    overall: number;
    byCategory: Array<{
      category: string;
      accuracy: number;
      sampleSize: number;
    }>;
  };
  modelPerformance: Array<{
    period: string;
    accuracy: number;
    latency: number;
    throughput: number;
  }>;
  recentRecommendations: Array<{
    id: string;
    type: string;
    accepted: boolean;
    timestamp: string;
    impact: number;
  }>;
}

interface AIPerformanceProps {
  data?: AIData;
  loading?: boolean;
}

export function AIPerformance({ data, loading }: AIPerformanceProps) {
  if (loading) {
    return <AIPerformanceSkeleton />;
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No AI performance data available
        </CardContent>
      </Card>
    );
  }

  // Prepare gauge data for radial charts (with fallback to 0 for undefined values)
  const recommendationGaugeData = [
    {
      name: 'Acceptance Rate',
      value: data.recommendationPerformance?.acceptanceRate ?? 0,
      fill: '#2E8B57',
    },
  ];

  const accuracyGaugeData = [
    {
      name: 'Prediction Accuracy',
      value: data.predictionAccuracy?.overall ?? 0,
      fill: '#3CB371',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Recommendation Acceptance"
          value={data.recommendationPerformance.acceptanceRate}
          icon={Target}
          formatType="percent"
          className={data.recommendationPerformance.acceptanceRate >= 70 ? 'border-green-200 bg-green-50' : ''}
        />
        <MetricCard
          title="Prediction Accuracy"
          value={data.predictionAccuracy.overall}
          icon={Brain}
          formatType="percent"
        />
        <MetricCard
          title="Revenue Impact"
          value={data.recommendationPerformance.revenueImpact}
          icon={TrendingUp}
          formatType="currency"
          subtitle="from AI recommendations"
        />
        <MetricCard
          title="Avg Processing Time"
          value={data.analysisMetrics.averageProcessingTime}
          icon={Clock}
          subtitle="milliseconds"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Acceptance Rate Gauge */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Acceptance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="90%"
                  data={recommendationGaugeData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    background={{ fill: '#e5e7eb' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">
                  {(data.recommendationPerformance?.acceptanceRate ?? 0).toFixed(0)}%
                </span>
                <span className="text-sm text-gray-500">of recommendations</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {(data.recommendationPerformance?.clickThroughRate ?? 0).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">Click-through</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {(data.recommendationPerformance?.conversionRate ?? 0).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500">Conversion</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prediction Accuracy Gauge */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Prediction Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="90%"
                  data={accuracyGaugeData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={10}
                    background={{ fill: '#e5e7eb' }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">
                  {(data.predictionAccuracy?.overall ?? 0).toFixed(0)}%
                </span>
                <span className="text-sm text-gray-500">overall accuracy</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {data.predictionAccuracy?.byCategory?.slice(0, 3).map((cat) => (
                <div key={cat.category} className="flex items-center justify-between">
                  <span className="text-sm">{cat.category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${cat.accuracy ?? 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{(cat.accuracy ?? 0).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Analysis Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-gray-900">
                  {(data.analysisMetrics?.totalAnalyses ?? 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Total Analyses</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-xl font-semibold text-blue-700">
                    {data.analysisMetrics?.averageProcessingTime ?? 0}ms
                  </p>
                  <p className="text-xs text-blue-600">Avg Latency</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-xl font-semibold text-green-700">
                    {(data.analysisMetrics?.accuracyScore ?? 0).toFixed(0)}%
                  </p>
                  <p className="text-xs text-green-600">Accuracy</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">User Satisfaction</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={cn(
                        'text-lg',
                        star <= Math.round(data.analysisMetrics?.userSatisfaction ?? 0)
                          ? 'text-amber-400'
                          : 'text-gray-300'
                      )}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {(data.analysisMetrics?.userSatisfaction ?? 0).toFixed(1)}/5
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Performance Over Time */}
      {data.modelPerformance && data.modelPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Model Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data.modelPerformance}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number, name: string) => [
                      name === 'latency' ? `${value}ms` : `${value}%`,
                      name.charAt(0).toUpperCase() + name.slice(1),
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#2E8B57"
                    strokeWidth={2}
                    dot={{ fill: '#2E8B57', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Recommendations */}
      {data.recentRecommendations && data.recentRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentRecommendations.slice(0, 5).map((rec) => (
                <div
                  key={rec.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border',
                    rec.accepted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {rec.accepted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {rec.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(rec.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      'text-sm font-medium',
                      (rec.impact ?? 0) > 0 ? 'text-green-600' : 'text-gray-600'
                    )}>
                      {(rec.impact ?? 0) > 0 ? '+' : ''}${(rec.impact ?? 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {rec.accepted ? 'Accepted' : 'Declined'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AIPerformanceSkeleton() {
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-48 bg-gray-100 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AIPerformance;
