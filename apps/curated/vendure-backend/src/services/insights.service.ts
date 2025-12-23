/**
 * Insights Service
 *
 * Generates AI-powered business insights including trend analysis,
 * anomaly detection, predictive insights, and actionable recommendations.
 */

import { AppDataSource } from '../config/database';
import { logger } from '../lib/logger';
import { BusinessMetrics, analyticsService } from './analytics.service';
import { v4 as uuidv4 } from 'uuid';

// =============================================================================
// INTERFACES
// =============================================================================

export interface InsightEngine {
  trendAnalysis: TrendInsight[];
  anomalyDetection: AnomalyInsight[];
  predictiveInsights: PredictiveInsight[];
  actionableRecommendations: ActionableRecommendation[];
  businessAlerts: BusinessAlert[];
  generatedAt: Date;
}

export interface TrendInsight {
  metric: string;
  trend: 'INCREASING' | 'DECREASING' | 'STABLE' | 'VOLATILE';
  changePercent: number;
  significance: 'HIGH' | 'MEDIUM' | 'LOW';
  timeframe: string;
  description: string;
  context: string;
}

export interface AnomalyInsight {
  metric: string;
  expectedValue: number;
  actualValue: number;
  deviation: number;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  timestamp: Date;
  possibleCauses: string[];
  recommendedActions: string[];
}

export interface PredictiveInsight {
  prediction: string;
  confidence: number;
  timeframe: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  factors: PredictionFactor[];
  recommendation: string;
}

export interface PredictionFactor {
  factor: string;
  weight: number;
}

export interface ActionableRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'GROWTH' | 'RETENTION' | 'OPTIMIZATION' | 'RISK_MITIGATION';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  estimatedImpact: string;
  implementationEffort: 'LOW' | 'MEDIUM' | 'HIGH';
  timeline: string;
  dependencies: string[];
  successMetrics: string[];
}

export interface BusinessAlert {
  id: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  category: 'FINANCIAL' | 'OPERATIONAL' | 'CUSTOMER' | 'PRODUCT' | 'TECHNICAL';
  timestamp: Date;
  affectedMetrics: string[];
  thresholdValue: number | null;
  currentValue: number | null;
  recommendedActions: string[];
  acknowledged: boolean;
  acknowledgedAt: Date | null;
  acknowledgedBy: string | null;
}

// Alert thresholds configuration
const ALERT_THRESHOLDS = {
  churnRate: { warning: 5, critical: 8 },
  conversionRate: { warning: 6, critical: 4 },
  growthRate: { warning: -5, critical: -10 },
  averageOrderValue: { warningDrop: -15, criticalDrop: -25 },
  aiAcceptanceRate: { warning: 0.25, critical: 0.15 },
};

// =============================================================================
// INSIGHTS SERVICE
// =============================================================================

export class InsightsService {
  /**
   * Generate comprehensive insights based on business metrics
   */
  async generateInsights(
    metrics?: BusinessMetrics,
    historicalData?: BusinessMetrics[]
  ): Promise<InsightEngine> {
    logger.info('Generating business insights');

    try {
      // Get current metrics if not provided
      if (!metrics) {
        metrics = await analyticsService.computeBusinessMetrics({ preset: '30d' });
      }

      const [
        trendAnalysis,
        anomalyDetection,
        predictiveInsights,
        actionableRecommendations,
        businessAlerts,
      ] = await Promise.all([
        this.analyzeTrends(metrics, historicalData),
        this.detectAnomalies(metrics, historicalData),
        this.generatePredictiveInsights(metrics),
        this.generateActionableRecommendations(metrics),
        this.generateBusinessAlerts(metrics),
      ]);

      return {
        trendAnalysis,
        anomalyDetection,
        predictiveInsights,
        actionableRecommendations,
        businessAlerts,
        generatedAt: new Date(),
      };
    } catch (error) {
      logger.error('Error generating insights', { error });
      throw error;
    }
  }

  /**
   * Get active business alerts
   */
  async getBusinessAlerts(
    severity?: string,
    category?: string,
    acknowledged?: boolean,
    limit: number = 50
  ): Promise<BusinessAlert[]> {
    try {
      let query = `
        SELECT
          id,
          title,
          description,
          severity,
          category,
          timestamp,
          affected_metrics as "affectedMetrics",
          threshold_value as "thresholdValue",
          current_value as "currentValue",
          recommended_actions as "recommendedActions",
          acknowledged,
          acknowledged_at as "acknowledgedAt",
          acknowledged_by as "acknowledgedBy"
        FROM jade.business_alert
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramIndex = 1;

      if (severity) {
        query += ` AND severity = $${paramIndex}`;
        params.push(severity);
        paramIndex++;
      }

      if (category) {
        query += ` AND category = $${paramIndex}`;
        params.push(category);
        paramIndex++;
      }

      if (acknowledged !== undefined) {
        query += ` AND acknowledged = $${paramIndex}`;
        params.push(acknowledged);
        paramIndex++;
      }

      query += ` ORDER BY timestamp DESC LIMIT $${paramIndex}`;
      params.push(limit);

      const result = await AppDataSource.query(query, params);
      return result.map((row: any) => ({
        ...row,
        timestamp: new Date(row.timestamp),
        acknowledgedAt: row.acknowledgedAt ? new Date(row.acknowledgedAt) : null,
        affectedMetrics: row.affectedMetrics || [],
        recommendedActions: row.recommendedActions || [],
      }));
    } catch (error) {
      logger.warn('Error fetching business alerts, generating fresh', { error });
      // Generate fresh alerts from current metrics
      const metrics = await analyticsService.computeBusinessMetrics({ preset: '30d' });
      return this.generateBusinessAlerts(metrics);
    }
  }

  /**
   * Get a single alert by ID
   */
  async getAlertById(id: string): Promise<BusinessAlert | null> {
    try {
      const result = await AppDataSource.query(
        `SELECT
          id, title, description, severity, category, timestamp,
          affected_metrics as "affectedMetrics",
          threshold_value as "thresholdValue",
          current_value as "currentValue",
          recommended_actions as "recommendedActions",
          acknowledged, acknowledged_at as "acknowledgedAt", acknowledged_by as "acknowledgedBy"
        FROM jade.business_alert WHERE id = $1`,
        [id]
      );

      if (!result[0]) return null;

      return {
        ...result[0],
        timestamp: new Date(result[0].timestamp),
        acknowledgedAt: result[0].acknowledgedAt ? new Date(result[0].acknowledgedAt) : null,
      };
    } catch (error) {
      logger.error('Error fetching alert', { error, id });
      return null;
    }
  }

  /**
   * Acknowledge an alert
   */
  async acknowledgeAlert(alertId: string, userId: string, note?: string): Promise<BusinessAlert | null> {
    try {
      const result = await AppDataSource.query(
        `UPDATE jade.business_alert
         SET acknowledged = true, acknowledged_at = NOW(), acknowledged_by = $2
         WHERE id = $1
         RETURNING *`,
        [alertId, userId]
      );

      if (!result[0]) return null;

      logger.info('Alert acknowledged', { alertId, userId });
      return this.getAlertById(alertId);
    } catch (error) {
      logger.error('Error acknowledging alert', { error, alertId });
      throw error;
    }
  }

  // ==========================================================================
  // TREND ANALYSIS
  // ==========================================================================

  private async analyzeTrends(
    metrics: BusinessMetrics,
    historicalData?: BusinessMetrics[]
  ): Promise<TrendInsight[]> {
    const trends: TrendInsight[] = [];

    // Revenue growth trend
    if (metrics.financial.growthRate !== 0) {
      const isPositive = metrics.financial.growthRate > 0;
      trends.push({
        metric: 'Revenue Growth',
        trend: metrics.financial.growthRate > 5 ? 'INCREASING' :
               metrics.financial.growthRate < -5 ? 'DECREASING' : 'STABLE',
        changePercent: metrics.financial.growthRate,
        significance: Math.abs(metrics.financial.growthRate) > 15 ? 'HIGH' :
                     Math.abs(metrics.financial.growthRate) > 5 ? 'MEDIUM' : 'LOW',
        timeframe: 'month-over-month',
        description: `Revenue is ${isPositive ? 'growing' : 'declining'} at ${Math.abs(metrics.financial.growthRate).toFixed(1)}% month-over-month`,
        context: isPositive
          ? 'Strong growth indicates successful customer acquisition and retention strategies'
          : 'Revenue decline requires immediate attention to marketing and retention efforts',
      });
    }

    // Customer acquisition trend
    if (metrics.customers.newAcquisitions > 0) {
      const acquisitionRate = (metrics.customers.newAcquisitions / metrics.customers.totalActive) * 100;
      trends.push({
        metric: 'Customer Acquisition',
        trend: acquisitionRate > 10 ? 'INCREASING' : acquisitionRate > 5 ? 'STABLE' : 'DECREASING',
        changePercent: acquisitionRate,
        significance: acquisitionRate > 15 ? 'HIGH' : acquisitionRate > 8 ? 'MEDIUM' : 'LOW',
        timeframe: 'monthly',
        description: `Acquired ${metrics.customers.newAcquisitions} new customers (${acquisitionRate.toFixed(1)}% of base)`,
        context: 'Consistent customer acquisition is essential for sustainable growth',
      });
    }

    // Churn rate trend
    if (metrics.financial.churnRate > 0) {
      const isHigh = metrics.financial.churnRate > 5;
      trends.push({
        metric: 'Churn Rate',
        trend: isHigh ? 'INCREASING' : 'STABLE',
        changePercent: metrics.financial.churnRate,
        significance: metrics.financial.churnRate > 8 ? 'HIGH' :
                     metrics.financial.churnRate > 5 ? 'MEDIUM' : 'LOW',
        timeframe: 'monthly',
        description: `Churn rate is at ${metrics.financial.churnRate.toFixed(1)}%`,
        context: isHigh
          ? 'Elevated churn rate requires immediate attention to retention strategies'
          : 'Churn rate is within healthy parameters',
      });
    }

    // AI recommendation acceptance trend
    if (metrics.ai.recommendationPerformance.acceptanceRate > 0) {
      const rate = metrics.ai.recommendationPerformance.acceptanceRate * 100;
      trends.push({
        metric: 'AI Recommendation Acceptance',
        trend: rate > 35 ? 'INCREASING' : rate > 25 ? 'STABLE' : 'DECREASING',
        changePercent: rate,
        significance: rate > 40 ? 'HIGH' : rate > 30 ? 'MEDIUM' : 'LOW',
        timeframe: 'weekly',
        description: `AI recommendations accepted at ${rate.toFixed(1)}% rate`,
        context: rate > 30
          ? 'High acceptance rate indicates effective personalization algorithms'
          : 'Consider refining recommendation algorithms for better relevance',
      });
    }

    // Conversion rate trend
    if (metrics.financial.conversionRate > 0) {
      trends.push({
        metric: 'Conversion Rate',
        trend: metrics.financial.conversionRate > 10 ? 'INCREASING' :
               metrics.financial.conversionRate > 6 ? 'STABLE' : 'DECREASING',
        changePercent: metrics.financial.conversionRate,
        significance: metrics.financial.conversionRate > 12 ? 'HIGH' :
                     metrics.financial.conversionRate > 8 ? 'MEDIUM' : 'LOW',
        timeframe: 'monthly',
        description: `Site conversion rate is ${metrics.financial.conversionRate.toFixed(1)}%`,
        context: metrics.financial.conversionRate > 8
          ? 'Conversion rate is above industry average'
          : 'There is opportunity to improve conversion through UX optimization',
      });
    }

    return trends;
  }

  // ==========================================================================
  // ANOMALY DETECTION
  // ==========================================================================

  private async detectAnomalies(
    metrics: BusinessMetrics,
    historicalData?: BusinessMetrics[]
  ): Promise<AnomalyInsight[]> {
    const anomalies: AnomalyInsight[] = [];

    // Average order value anomaly
    const expectedAOV = 75; // Historical baseline
    const aovDeviation = ((metrics.financial.averageOrderValue - expectedAOV) / expectedAOV) * 100;

    if (Math.abs(aovDeviation) > 15) {
      anomalies.push({
        metric: 'Average Order Value',
        expectedValue: expectedAOV,
        actualValue: metrics.financial.averageOrderValue,
        deviation: aovDeviation,
        severity: Math.abs(aovDeviation) > 25 ? 'CRITICAL' : 'WARNING',
        timestamp: new Date(),
        possibleCauses: [
          'Product mix changes',
          'Promotional campaigns affecting pricing',
          'Customer segment shifts',
          'Seasonal factors',
        ],
        recommendedActions: [
          'Analyze recent product performance',
          'Review promotional strategies',
          'Examine customer segmentation changes',
          'Consider upselling opportunities',
        ],
      });
    }

    // Conversion rate anomaly
    const expectedConversion = 8; // Industry baseline
    const conversionDeviation = ((metrics.financial.conversionRate - expectedConversion) / expectedConversion) * 100;

    if (Math.abs(conversionDeviation) > 20) {
      anomalies.push({
        metric: 'Conversion Rate',
        expectedValue: expectedConversion,
        actualValue: metrics.financial.conversionRate,
        deviation: conversionDeviation,
        severity: metrics.financial.conversionRate < expectedConversion * 0.7 ? 'CRITICAL' : 'WARNING',
        timestamp: new Date(),
        possibleCauses: [
          'Website performance issues',
          'Checkout process friction',
          'Product availability problems',
          'Marketing campaign effectiveness',
        ],
        recommendedActions: [
          'Audit website performance and user experience',
          'Optimize checkout flow',
          'Review inventory management',
          'Analyze traffic sources and quality',
        ],
      });
    }

    // Churn rate anomaly
    if (metrics.financial.churnRate > ALERT_THRESHOLDS.churnRate.warning) {
      anomalies.push({
        metric: 'Churn Rate',
        expectedValue: 4,
        actualValue: metrics.financial.churnRate,
        deviation: ((metrics.financial.churnRate - 4) / 4) * 100,
        severity: metrics.financial.churnRate > ALERT_THRESHOLDS.churnRate.critical ? 'CRITICAL' : 'WARNING',
        timestamp: new Date(),
        possibleCauses: [
          'Customer satisfaction decline',
          'Competitive pressure',
          'Product quality issues',
          'Support response times',
        ],
        recommendedActions: [
          'Survey churned customers',
          'Implement retention campaigns',
          'Review product quality feedback',
          'Analyze competitor offerings',
        ],
      });
    }

    return anomalies;
  }

  // ==========================================================================
  // PREDICTIVE INSIGHTS
  // ==========================================================================

  private async generatePredictiveInsights(metrics: BusinessMetrics): Promise<PredictiveInsight[]> {
    const predictions: PredictiveInsight[] = [];

    // Churn prediction
    if (metrics.financial.churnRate > 3) {
      const projectedChurn = metrics.financial.churnRate * 1.2;
      predictions.push({
        prediction: `Churn rate may increase to ${projectedChurn.toFixed(1)}% next month without intervention`,
        confidence: 0.78,
        timeframe: '30 days',
        impact: 'HIGH',
        factors: [
          { factor: 'Current churn trend', weight: 0.4 },
          { factor: 'Customer satisfaction scores', weight: 0.3 },
          { factor: 'Support ticket volume', weight: 0.2 },
          { factor: 'Product usage patterns', weight: 0.1 },
        ],
        recommendation: 'Implement proactive retention campaigns for at-risk customers',
      });
    }

    // Revenue prediction
    const revenueGrowth = metrics.financial.growthRate > 0 ? metrics.financial.growthRate : 5;
    const projectedRevenue = metrics.financial.totalRevenue * (1 + revenueGrowth / 100);
    predictions.push({
      prediction: `Monthly revenue expected to reach $${projectedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })} next month`,
      confidence: 0.82,
      timeframe: '30 days',
      impact: 'MEDIUM',
      factors: [
        { factor: 'Historical growth pattern', weight: 0.35 },
        { factor: 'Customer acquisition rate', weight: 0.25 },
        { factor: 'Average order value trends', weight: 0.25 },
        { factor: 'Seasonal factors', weight: 0.15 },
      ],
      recommendation: 'Maintain current growth strategies while optimizing conversion funnel',
    });

    // Customer LTV prediction
    predictions.push({
      prediction: 'Customer lifetime value projected to increase by 8-12% over next quarter',
      confidence: 0.71,
      timeframe: '90 days',
      impact: 'MEDIUM',
      factors: [
        { factor: 'Retention rate improvements', weight: 0.4 },
        { factor: 'Cross-sell success rate', weight: 0.3 },
        { factor: 'Average order value growth', weight: 0.2 },
        { factor: 'Customer satisfaction trends', weight: 0.1 },
      ],
      recommendation: 'Focus on personalized product recommendations and customer education',
    });

    // AI effectiveness prediction
    if (metrics.ai.recommendationPerformance.acceptanceRate < 0.35) {
      predictions.push({
        prediction: 'AI recommendation effectiveness can improve by 15-20% with model refinement',
        confidence: 0.75,
        timeframe: '60 days',
        impact: 'MEDIUM',
        factors: [
          { factor: 'Current model accuracy', weight: 0.35 },
          { factor: 'Training data quality', weight: 0.30 },
          { factor: 'Feature engineering opportunity', weight: 0.25 },
          { factor: 'User feedback integration', weight: 0.10 },
        ],
        recommendation: 'Implement A/B testing for model variants and collect more user feedback',
      });
    }

    return predictions;
  }

  // ==========================================================================
  // ACTIONABLE RECOMMENDATIONS
  // ==========================================================================

  private async generateActionableRecommendations(
    metrics: BusinessMetrics
  ): Promise<ActionableRecommendation[]> {
    const recommendations: ActionableRecommendation[] = [];

    // Churn reduction recommendation
    if (metrics.financial.churnRate > 5) {
      recommendations.push({
        id: uuidv4(),
        title: 'Implement AI-Powered Churn Prevention Program',
        description: 'Deploy machine learning models to identify at-risk customers and trigger personalized retention campaigns',
        category: 'RETENTION',
        priority: 'HIGH',
        estimatedImpact: '15-25% reduction in churn rate, $50K-80K monthly revenue protection',
        implementationEffort: 'MEDIUM',
        timeline: '6-8 weeks',
        dependencies: [
          'Customer behavior data integration',
          'Email marketing automation setup',
          'Customer success team training',
        ],
        successMetrics: [
          'Churn rate reduction',
          'Customer satisfaction scores',
          'Retention campaign open rates',
          'Customer lifetime value improvement',
        ],
      });
    }

    // Conversion optimization recommendation
    if (metrics.financial.conversionRate < 10) {
      recommendations.push({
        id: uuidv4(),
        title: 'Optimize Conversion Funnel with Skincare Personalization',
        description: 'Implement AI-driven product matching and skin analysis to improve conversion rates',
        category: 'OPTIMIZATION',
        priority: 'HIGH',
        estimatedImpact: '20-35% increase in conversion rate, $30K-50K monthly revenue increase',
        implementationEffort: 'HIGH',
        timeline: '8-12 weeks',
        dependencies: [
          'Skin analysis API integration',
          'Product recommendation engine',
          'A/B testing framework',
          'User interface redesign',
        ],
        successMetrics: [
          'Conversion rate improvement',
          'Cart abandonment reduction',
          'Average session duration increase',
          'Customer acquisition cost reduction',
        ],
      });
    }

    // Cross-sell opportunity
    if (metrics.financial.averageOrderValue < 100) {
      recommendations.push({
        id: uuidv4(),
        title: 'Enhance Cross-Sell Strategy with Routine Optimization',
        description: 'Use AI to recommend complementary products based on skin analysis and routine gaps',
        category: 'GROWTH',
        priority: 'MEDIUM',
        estimatedImpact: '15-20% increase in average order value, $25K-35K monthly revenue increase',
        implementationEffort: 'MEDIUM',
        timeline: '4-6 weeks',
        dependencies: [
          'Product compatibility matrix',
          'Routine analysis algorithms',
          'Cross-sell UI components',
          'Inventory management integration',
        ],
        successMetrics: [
          'Average order value increase',
          'Items per order improvement',
          'Cross-sell conversion rate',
          'Customer satisfaction with recommendations',
        ],
      });
    }

    // AI model improvement
    if (metrics.ai.recommendationPerformance.acceptanceRate < 0.4) {
      recommendations.push({
        id: uuidv4(),
        title: 'Enhance AI Recommendation Engine Accuracy',
        description: 'Improve machine learning models with additional training data and feature engineering',
        category: 'OPTIMIZATION',
        priority: 'MEDIUM',
        estimatedImpact: '10-15% improvement in recommendation acceptance, higher customer satisfaction',
        implementationEffort: 'MEDIUM',
        timeline: '6-8 weeks',
        dependencies: [
          'Additional training data collection',
          'Feature engineering framework',
          'Model retraining pipeline',
          'A/B testing for model validation',
        ],
        successMetrics: [
          'Recommendation acceptance rate',
          'Customer feedback scores',
          'Prediction accuracy metrics',
          'Business metric improvements',
        ],
      });
    }

    // Community engagement recommendation
    recommendations.push({
      id: uuidv4(),
      title: 'Leverage Sanctuary Community for Customer Insights',
      description: 'Use community engagement data to improve product recommendations and identify trending concerns',
      category: 'GROWTH',
      priority: 'LOW',
      estimatedImpact: 'Improved product-market fit, enhanced customer loyalty, valuable user-generated content',
      implementationEffort: 'LOW',
      timeline: '2-4 weeks',
      dependencies: [
        'Sanctuary community data integration',
        'Sentiment analysis implementation',
        'Trending topics dashboard',
      ],
      successMetrics: [
        'Community engagement rate',
        'User-generated content volume',
        'Customer insight actionability',
        'Product development velocity',
      ],
    });

    return recommendations;
  }

  // ==========================================================================
  // BUSINESS ALERTS
  // ==========================================================================

  private async generateBusinessAlerts(metrics: BusinessMetrics): Promise<BusinessAlert[]> {
    const alerts: BusinessAlert[] = [];

    // High churn rate alert
    if (metrics.financial.churnRate > ALERT_THRESHOLDS.churnRate.warning) {
      const severity = metrics.financial.churnRate > ALERT_THRESHOLDS.churnRate.critical ? 'CRITICAL' : 'WARNING';
      alerts.push({
        id: uuidv4(),
        title: severity === 'CRITICAL' ? 'Critical: High Customer Churn Rate' : 'Warning: Elevated Churn Rate',
        description: `Churn rate has reached ${metrics.financial.churnRate.toFixed(1)}%, ${severity === 'CRITICAL' ? 'significantly ' : ''}above the ${ALERT_THRESHOLDS.churnRate.warning}% target`,
        severity,
        category: 'CUSTOMER',
        timestamp: new Date(),
        affectedMetrics: ['Customer Retention', 'Revenue Growth', 'Customer Lifetime Value'],
        thresholdValue: ALERT_THRESHOLDS.churnRate.warning,
        currentValue: metrics.financial.churnRate,
        recommendedActions: [
          'Activate emergency retention campaigns',
          'Analyze recent customer feedback',
          'Review product quality issues',
          'Implement immediate customer outreach',
        ],
        acknowledged: false,
        acknowledgedAt: null,
        acknowledgedBy: null,
      });
    }

    // Low conversion rate alert
    if (metrics.financial.conversionRate < ALERT_THRESHOLDS.conversionRate.warning) {
      const severity = metrics.financial.conversionRate < ALERT_THRESHOLDS.conversionRate.critical ? 'CRITICAL' : 'WARNING';
      alerts.push({
        id: uuidv4(),
        title: 'Conversion Rate Below Target',
        description: `Conversion rate has dropped to ${metrics.financial.conversionRate.toFixed(1)}%, below the 8% target`,
        severity,
        category: 'OPERATIONAL',
        timestamp: new Date(),
        affectedMetrics: ['Revenue Growth', 'Customer Acquisition', 'Marketing ROI'],
        thresholdValue: ALERT_THRESHOLDS.conversionRate.warning,
        currentValue: metrics.financial.conversionRate,
        recommendedActions: [
          'Audit website performance',
          'Review checkout process',
          'Analyze traffic quality',
          'Optimize product pages',
        ],
        acknowledged: false,
        acknowledgedAt: null,
        acknowledgedBy: null,
      });
    }

    // Revenue decline alert
    if (metrics.financial.growthRate < ALERT_THRESHOLDS.growthRate.warning) {
      const severity = metrics.financial.growthRate < ALERT_THRESHOLDS.growthRate.critical ? 'CRITICAL' : 'WARNING';
      alerts.push({
        id: uuidv4(),
        title: 'Revenue Decline Detected',
        description: `Revenue has declined by ${Math.abs(metrics.financial.growthRate).toFixed(1)}% compared to previous period`,
        severity,
        category: 'FINANCIAL',
        timestamp: new Date(),
        affectedMetrics: ['Total Revenue', 'Growth Rate', 'Business Health'],
        thresholdValue: ALERT_THRESHOLDS.growthRate.warning,
        currentValue: metrics.financial.growthRate,
        recommendedActions: [
          'Analyze revenue drivers',
          'Review marketing effectiveness',
          'Examine customer behavior changes',
          'Assess competitive landscape',
        ],
        acknowledged: false,
        acknowledgedAt: null,
        acknowledgedBy: null,
      });
    }

    // AI performance alert
    if (metrics.ai.recommendationPerformance.acceptanceRate < ALERT_THRESHOLDS.aiAcceptanceRate.warning) {
      const severity = metrics.ai.recommendationPerformance.acceptanceRate < ALERT_THRESHOLDS.aiAcceptanceRate.critical ? 'CRITICAL' : 'WARNING';
      alerts.push({
        id: uuidv4(),
        title: 'AI Recommendation Performance Below Target',
        description: `AI recommendation acceptance rate is ${(metrics.ai.recommendationPerformance.acceptanceRate * 100).toFixed(1)}%, below the 30% target`,
        severity,
        category: 'TECHNICAL',
        timestamp: new Date(),
        affectedMetrics: ['Customer Experience', 'Personalization Effectiveness', 'AI ROI'],
        thresholdValue: ALERT_THRESHOLDS.aiAcceptanceRate.warning * 100,
        currentValue: metrics.ai.recommendationPerformance.acceptanceRate * 100,
        recommendedActions: [
          'Review recommendation algorithms',
          'Analyze user feedback data',
          'Retrain machine learning models',
          'Improve product data quality',
        ],
        acknowledged: false,
        acknowledgedAt: null,
        acknowledgedBy: null,
      });
    }

    // Persist alerts to database
    await this.persistAlerts(alerts);

    return alerts;
  }

  /**
   * Persist alerts to database
   */
  private async persistAlerts(alerts: BusinessAlert[]): Promise<void> {
    if (alerts.length === 0) return;

    try {
      for (const alert of alerts) {
        // Check if similar alert exists (not acknowledged, same category)
        const existing = await AppDataSource.query(
          `SELECT id FROM jade.business_alert
           WHERE category = $1 AND acknowledged = false
           AND timestamp > NOW() - INTERVAL '24 hours'
           LIMIT 1`,
          [alert.category]
        );

        if (existing.length === 0) {
          await AppDataSource.query(
            `INSERT INTO jade.business_alert
             (id, title, description, severity, category, timestamp, affected_metrics,
              threshold_value, current_value, recommended_actions, acknowledged)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [
              alert.id,
              alert.title,
              alert.description,
              alert.severity,
              alert.category,
              alert.timestamp,
              JSON.stringify(alert.affectedMetrics),
              alert.thresholdValue,
              alert.currentValue,
              JSON.stringify(alert.recommendedActions),
              alert.acknowledged,
            ]
          );
        }
      }
    } catch (error) {
      logger.warn('Error persisting alerts (table may not exist)', { error });
    }
  }
}

// Export singleton instance
export const insightsService = new InsightsService();
