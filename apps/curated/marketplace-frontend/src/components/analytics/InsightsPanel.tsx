/**
 * InsightsPanel Component
 *
 * Displays AI-generated business insights: trends, anomalies, predictions, recommendations
 */

import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Lightbulb,
  Target,
  Clock,
  ChevronRight,
  Sparkles,
  BarChart2,
  Zap,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface TrendInsight {
  metric: string;
  trend: 'INCREASING' | 'DECREASING' | 'STABLE' | 'VOLATILE';
  changePercent: number;
  significance: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

interface AnomalyInsight {
  metric: string;
  expectedValue: number;
  actualValue: number;
  deviation: number;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  description: string;
}

interface PredictiveInsight {
  prediction: string;
  confidence: number;
  timeframe: string;
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  recommendation: string;
}

interface ActionableRecommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedImpact: string;
  actionItems: string[];
}

interface InsightsData {
  trendAnalysis: TrendInsight[];
  anomalyDetection: AnomalyInsight[];
  predictiveInsights: PredictiveInsight[];
  actionableRecommendations: ActionableRecommendation[];
}

interface InsightsPanelProps {
  data?: InsightsData;
  loading?: boolean;
  compact?: boolean;
}

const TrendIcon = ({ trend }: { trend: TrendInsight['trend'] }) => {
  switch (trend) {
    case 'INCREASING':
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'DECREASING':
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    case 'VOLATILE':
      return <BarChart2 className="h-4 w-4 text-amber-600" />;
    default:
      return <Minus className="h-4 w-4 text-gray-500" />;
  }
};

const SignificanceBadge = ({ level }: { level: TrendInsight['significance'] }) => (
  <span
    className={cn(
      'text-xs px-2 py-0.5 rounded-full',
      level === 'HIGH' && 'bg-red-100 text-red-700',
      level === 'MEDIUM' && 'bg-amber-100 text-amber-700',
      level === 'LOW' && 'bg-gray-100 text-gray-700'
    )}
  >
    {level}
  </span>
);

const PriorityBadge = ({ priority }: { priority: ActionableRecommendation['priority'] }) => (
  <span
    className={cn(
      'text-xs font-medium px-2 py-1 rounded',
      priority === 'HIGH' && 'bg-red-100 text-red-700',
      priority === 'MEDIUM' && 'bg-amber-100 text-amber-700',
      priority === 'LOW' && 'bg-green-100 text-green-700'
    )}
  >
    {priority} Priority
  </span>
);

export function InsightsPanel({ data, loading, compact = false }: InsightsPanelProps) {
  if (loading) {
    return <InsightsPanelSkeleton />;
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          <Sparkles className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          No insights available yet
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return <CompactInsightsPanel data={data} />;
  }

  return (
    <div className="space-y-6">
      {/* Trend Analysis */}
      {data.trendAnalysis && data.trendAnalysis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Trend Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.trendAnalysis.map((trend, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <TrendIcon trend={trend.trend} />
                    <div>
                      <p className="font-medium text-gray-900">{trend.metric}</p>
                      <p className="text-sm text-gray-600 mt-1">{trend.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'text-lg font-semibold',
                        trend.changePercent > 0 ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {trend.changePercent > 0 ? '+' : ''}
                      {trend.changePercent.toFixed(1)}%
                    </span>
                    <SignificanceBadge level={trend.significance} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Anomaly Detection */}
      {data.anomalyDetection && data.anomalyDetection.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Anomaly Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.anomalyDetection.map((anomaly, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-4 rounded-lg border-l-4',
                    anomaly.severity === 'CRITICAL' && 'bg-red-50 border-red-500',
                    anomaly.severity === 'WARNING' && 'bg-amber-50 border-amber-500',
                    anomaly.severity === 'INFO' && 'bg-blue-50 border-blue-500'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{anomaly.metric}</p>
                      <p className="text-sm text-gray-600 mt-1">{anomaly.description}</p>
                    </div>
                    <span
                      className={cn(
                        'text-xs font-medium px-2 py-1 rounded',
                        anomaly.severity === 'CRITICAL' && 'bg-red-200 text-red-800',
                        anomaly.severity === 'WARNING' && 'bg-amber-200 text-amber-800',
                        anomaly.severity === 'INFO' && 'bg-blue-200 text-blue-800'
                      )}
                    >
                      {anomaly.severity}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-gray-500">Expected:</span>{' '}
                      <span className="font-medium">{anomaly.expectedValue.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Actual:</span>{' '}
                      <span className="font-medium">{anomaly.actualValue.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Deviation:</span>{' '}
                      <span className="font-medium text-red-600">
                        {anomaly.deviation > 0 ? '+' : ''}
                        {anomaly.deviation.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Predictive Insights */}
      {data.predictiveInsights && data.predictiveInsights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Predictive Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.predictiveInsights.map((insight, index) => (
                <div
                  key={index}
                  className={cn(
                    'p-4 rounded-lg border',
                    insight.impact === 'POSITIVE' && 'bg-green-50 border-green-200',
                    insight.impact === 'NEGATIVE' && 'bg-red-50 border-red-200',
                    insight.impact === 'NEUTRAL' && 'bg-gray-50 border-gray-200'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <Target
                      className={cn(
                        'h-5 w-5',
                        insight.impact === 'POSITIVE' && 'text-green-600',
                        insight.impact === 'NEGATIVE' && 'text-red-600',
                        insight.impact === 'NEUTRAL' && 'text-gray-600'
                      )}
                    />
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{insight.timeframe}</span>
                    </div>
                  </div>
                  <p className="font-medium text-gray-900">{insight.prediction}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${insight.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{insight.confidence}% confidence</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-3 pt-3 border-t">
                    <Lightbulb className="h-3 w-3 inline mr-1" />
                    {insight.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actionable Recommendations */}
      {data.actionableRecommendations && data.actionableRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Actionable Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.actionableRecommendations.map((rec) => (
                <div key={rec.id} className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{rec.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{rec.category}</p>
                    </div>
                    <PriorityBadge priority={rec.priority} />
                  </div>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-gray-500">Expected Impact:</span>
                    <span className="text-xs font-medium text-green-700">{rec.estimatedImpact}</span>
                  </div>
                  {rec.actionItems && rec.actionItems.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-amber-200">
                      <p className="text-xs font-medium text-gray-700 mb-2">Action Items:</p>
                      <ul className="space-y-1">
                        {rec.actionItems.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                            <ChevronRight className="h-3 w-3 mt-0.5 text-amber-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CompactInsightsPanel({ data }: { data: InsightsData }) {
  const topTrends = data.trendAnalysis?.slice(0, 3) || [];
  const topRecommendations = data.actionableRecommendations?.filter((r) => r.priority === 'HIGH').slice(0, 2) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Key Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topTrends.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Trends
            </p>
            <div className="space-y-2">
              {topTrends.map((trend, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <TrendIcon trend={trend.trend} />
                    <span className="text-sm">{trend.metric}</span>
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      trend.changePercent > 0 ? 'text-green-600' : 'text-red-600'
                    )}
                  >
                    {trend.changePercent > 0 ? '+' : ''}
                    {trend.changePercent.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {topRecommendations.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Top Recommendations
            </p>
            <div className="space-y-2">
              {topRecommendations.map((rec) => (
                <div key={rec.id} className="p-2 bg-amber-50 rounded border border-amber-200">
                  <div className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{rec.title}</p>
                      <p className="text-xs text-gray-600">{rec.estimatedImpact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InsightsPanelSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InsightsPanel;
