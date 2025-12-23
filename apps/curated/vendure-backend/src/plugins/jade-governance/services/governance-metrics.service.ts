/**
 * Governance Metrics Collection Service
 *
 * Sprint G4.4: Real-time metrics and KPIs for governance dashboards
 *
 * Collects, aggregates, and serves governance metrics for:
 * - Executive dashboards
 * - Compliance monitoring
 * - Incident tracking
 * - Performance analytics
 * - SKA agentic metrics (future integration)
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AISystemRegistry } from '../entities/ai-system-registry.entity';
import { AIIncident } from '../entities/ai-incident.entity';
import { AIComplianceState } from '../entities/ai-compliance-state.entity';
import { HumanOversightAction } from '../entities/human-oversight-action.entity';
import {
  RiskCategory,
  IncidentSeverity,
  IncidentStep,
  OversightActionType,
  OversightLevel,
  ComplianceStatus,
} from '../types/governance.enums';

/**
 * Overall governance metrics snapshot
 */
export interface GovernanceMetricsSnapshot {
  // System Metrics
  systemsTotal: number;
  systemsActive: number;
  systemsByRiskCategory: Record<RiskCategory, number>;
  systemsByOversightLevel: Record<OversightLevel, number>;

  // Incident Metrics
  incidentsTotal: number;
  incidentsOpen: number;
  incidentsClosed: number;
  incidentsBySeverity: Record<IncidentSeverity, number>;
  incidentsByStep: Record<IncidentStep, number>;
  averageResolutionTimeHours: number;

  // Compliance Metrics
  averageCompliancePercentage: number;
  systemsFullyCompliant: number;
  systemsPartiallyCompliant: number;
  systemsNonCompliant: number;
  totalRequirementsAssessed: number;

  // Oversight Metrics
  oversightActionsTotal: number;
  oversightActionsByType: Record<OversightActionType, number>;
  overrideRate: number;
  interventionRate: number;

  // Timestamp
  capturedAt: Date;
}

/**
 * Time-series data point for trend analysis
 */
export interface MetricDataPoint {
  timestamp: Date;
  value: number;
  label?: string;
}

/**
 * Trend data for charts
 */
export interface MetricTrend {
  metric: string;
  dataPoints: MetricDataPoint[];
  trend: 'increasing' | 'decreasing' | 'stable';
  changePercentage: number;
}

/**
 * Executive summary for high-level dashboard
 */
export interface ExecutiveSummary {
  systemsAtRisk: number;
  criticalIncidentsOpen: number;
  complianceScore: number;
  oversightInterventions24h: number;
  topRisks: Array<{
    systemId: string;
    systemName: string;
    riskCategory: RiskCategory;
    compliancePercentage: number;
    openIncidents: number;
  }>;
}

/**
 * Performance metrics for system health
 */
export interface PerformanceMetrics {
  // Query performance
  averageQueryTime: number;
  slowQueryCount: number;

  // Workflow performance
  averageIncidentDetectionLag: number;
  averageComplianceAssessmentTime: number;

  // System health
  uptimePercentage: number;
  errorRate: number;
}

/**
 * Placeholder for SKA Agentic Metrics
 * Will be populated when SKA integration is complete
 */
export interface SKAAgenticMetrics {
  // Asset value tracking
  appreciatingAssetCount: number;
  depreciatingAssetCount: number;
  networkEffectStrength: number;

  // Reasoning mode distribution
  symbolicQueryCount: number;
  neuralQueryCount: number;
  hybridQueryCount: number;

  // Data entropy
  entropyLevel: number;

  // Agent readiness
  queriesPerSecondCapacity: number;
  multiHopMaxDepth: number;

  // Placeholder flag
  isEnabled: boolean;
}

/**
 * Governance Metrics Service
 *
 * Provides real-time and historical metrics for governance monitoring
 */
@Injectable()
export class GovernanceMetricsService {
  // Cache configuration
  private readonly CACHE_TTL_SECONDS = 60; // 1 minute cache
  private metricsCache: GovernanceMetricsSnapshot | null = null;
  private cacheTimestamp: Date | null = null;

  constructor(
    @InjectRepository(AISystemRegistry)
    private systemRepository: Repository<AISystemRegistry>,

    @InjectRepository(AIIncident)
    private incidentRepository: Repository<AIIncident>,

    @InjectRepository(AIComplianceState)
    private complianceRepository: Repository<AIComplianceState>,

    @InjectRepository(HumanOversightAction)
    private oversightRepository: Repository<HumanOversightAction>
  ) {}

  /**
   * Get current governance metrics snapshot
   * Uses caching to avoid expensive queries on every request
   */
  async getMetricsSnapshot(forceRefresh = false): Promise<GovernanceMetricsSnapshot> {
    // Check cache
    if (!forceRefresh && this.isCacheValid()) {
      return this.metricsCache!;
    }

    // Collect all metrics in parallel
    const [
      systemMetrics,
      incidentMetrics,
      complianceMetrics,
      oversightMetrics,
    ] = await Promise.all([
      this.collectSystemMetrics(),
      this.collectIncidentMetrics(),
      this.collectComplianceMetrics(),
      this.collectOversightMetrics(),
    ]);

    // Combine into snapshot
    const snapshot: GovernanceMetricsSnapshot = {
      ...systemMetrics,
      ...incidentMetrics,
      ...complianceMetrics,
      ...oversightMetrics,
      capturedAt: new Date(),
    };

    // Update cache
    this.metricsCache = snapshot;
    this.cacheTimestamp = new Date();

    return snapshot;
  }

  /**
   * Get executive summary for high-level dashboard
   */
  async getExecutiveSummary(): Promise<ExecutiveSummary> {
    const [systems, incidents] = await Promise.all([
      this.systemRepository.find({ relations: ['incidents', 'complianceStates'] }),
      this.incidentRepository.find({
        where: { resolvedAt: null, severity: IncidentSeverity.CRITICAL },
      }),
    ]);

    // Calculate systems at risk (high/unacceptable + non-compliant)
    const systemsAtRisk = systems.filter(s =>
      (s.riskCategory === RiskCategory.HIGH || s.riskCategory === RiskCategory.UNACCEPTABLE) &&
      this.calculateSystemCompliance(s) < 80
    ).length;

    // Get oversight interventions in last 24h
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentOversight = await this.oversightRepository.count({
      where: {
        createdAt: Between(yesterday, new Date()),
        actionType: OversightActionType.INTERVENTION,
      },
    });

    // Get top risks
    const systemsWithRisk = systems
      .map(system => ({
        systemId: system.id,
        systemName: system.systemName,
        riskCategory: system.riskCategory,
        compliancePercentage: this.calculateSystemCompliance(system),
        openIncidents: system.incidents?.filter(i => !i.resolvedAt).length || 0,
      }))
      .sort((a, b) => {
        // Sort by risk category (higher first) then compliance (lower first)
        const riskOrder = { UNACCEPTABLE: 4, HIGH: 3, LIMITED: 2, MINIMAL: 1 };
        if (riskOrder[a.riskCategory] !== riskOrder[b.riskCategory]) {
          return riskOrder[b.riskCategory] - riskOrder[a.riskCategory];
        }
        return a.compliancePercentage - b.compliancePercentage;
      })
      .slice(0, 5);

    // Calculate overall compliance score
    const avgCompliance = systems.reduce((sum, s) =>
      sum + this.calculateSystemCompliance(s), 0) / systems.length || 0;

    return {
      systemsAtRisk,
      criticalIncidentsOpen: incidents.length,
      complianceScore: Math.round(avgCompliance),
      oversightInterventions24h: recentOversight,
      topRisks: systemsWithRisk,
    };
  }

  /**
   * Get metric trend over time
   */
  async getMetricTrend(
    metric: string,
    startDate: Date,
    endDate: Date,
    intervalHours = 24
  ): Promise<MetricTrend> {
    // Generate time buckets
    const buckets: Date[] = [];
    let current = new Date(startDate);
    while (current <= endDate) {
      buckets.push(new Date(current));
      current = new Date(current.getTime() + intervalHours * 60 * 60 * 1000);
    }

    // Collect data points
    const dataPoints: MetricDataPoint[] = [];

    for (const bucket of buckets) {
      const value = await this.getMetricValueAtTime(metric, bucket);
      dataPoints.push({
        timestamp: bucket,
        value,
      });
    }

    // Calculate trend
    const trend = this.calculateTrend(dataPoints);
    const changePercentage = this.calculateChangePercentage(dataPoints);

    return {
      metric,
      dataPoints,
      trend,
      changePercentage,
    };
  }

  /**
   * Get SKA agentic metrics
   * Returns placeholder data until SKA integration is complete
   */
  async getSKAAgenticMetrics(): Promise<SKAAgenticMetrics> {
    // TODO: Implement after SKA integration
    return {
      appreciatingAssetCount: 0,
      depreciatingAssetCount: 0,
      networkEffectStrength: 0,
      symbolicQueryCount: 0,
      neuralQueryCount: 0,
      hybridQueryCount: 0,
      entropyLevel: 0,
      queriesPerSecondCapacity: 0,
      multiHopMaxDepth: 0,
      isEnabled: false, // Will be true after SKA integration
    };
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    // TODO: Implement query performance tracking
    return {
      averageQueryTime: 0,
      slowQueryCount: 0,
      averageIncidentDetectionLag: 0,
      averageComplianceAssessmentTime: 0,
      uptimePercentage: 100,
      errorRate: 0,
    };
  }

  // =========================================================================
  // Private helper methods
  // =========================================================================

  /**
   * Collect system metrics
   */
  private async collectSystemMetrics() {
    const systems = await this.systemRepository.find();

    const byRiskCategory: Record<RiskCategory, number> = {
      [RiskCategory.MINIMAL]: 0,
      [RiskCategory.LIMITED]: 0,
      [RiskCategory.HIGH]: 0,
      [RiskCategory.UNACCEPTABLE]: 0,
    };

    const byOversightLevel: Record<OversightLevel, number> = {
      [OversightLevel.IN_THE_LOOP]: 0,
      [OversightLevel.ON_THE_LOOP]: 0,
      [OversightLevel.IN_COMMAND]: 0,
    };

    systems.forEach(system => {
      byRiskCategory[system.riskCategory]++;
      byOversightLevel[system.humanOversightLevel]++;
    });

    return {
      systemsTotal: systems.length,
      systemsActive: systems.filter(s => s.isActive).length,
      systemsByRiskCategory: byRiskCategory,
      systemsByOversightLevel: byOversightLevel,
    };
  }

  /**
   * Collect incident metrics
   */
  private async collectIncidentMetrics() {
    const incidents = await this.incidentRepository.find();

    const bySeverity: Record<IncidentSeverity, number> = {
      [IncidentSeverity.NEGLIGIBLE]: 0,
      [IncidentSeverity.MARGINAL]: 0,
      [IncidentSeverity.CRITICAL]: 0,
      [IncidentSeverity.CATASTROPHIC]: 0,
    };

    const byStep: Record<IncidentStep, number> = {
      [IncidentStep.DETECT]: 0,
      [IncidentStep.ASSESS]: 0,
      [IncidentStep.STABILIZE]: 0,
      [IncidentStep.REPORT]: 0,
      [IncidentStep.INVESTIGATE]: 0,
      [IncidentStep.CORRECT]: 0,
      [IncidentStep.VERIFY]: 0,
    };

    let totalResolutionTime = 0;
    let resolvedCount = 0;

    incidents.forEach(incident => {
      bySeverity[incident.severity]++;
      byStep[incident.currentStep]++;

      if (incident.resolvedAt) {
        resolvedCount++;
        const resolutionTime = incident.resolvedAt.getTime() - incident.detectedAt.getTime();
        totalResolutionTime += resolutionTime;
      }
    });

    const averageResolutionTimeHours = resolvedCount > 0
      ? totalResolutionTime / resolvedCount / (1000 * 60 * 60)
      : 0;

    return {
      incidentsTotal: incidents.length,
      incidentsOpen: incidents.filter(i => !i.resolvedAt).length,
      incidentsClosed: resolvedCount,
      incidentsBySeverity: bySeverity,
      incidentsByStep: byStep,
      averageResolutionTimeHours,
    };
  }

  /**
   * Collect compliance metrics
   */
  private async collectComplianceMetrics() {
    const states = await this.complianceRepository.find();
    const systems = await this.systemRepository.find({ relations: ['complianceStates'] });

    const byStatus = {
      compliant: states.filter(s => s.complianceStatus === ComplianceStatus.COMPLIANT).length,
      partial: states.filter(s => s.complianceStatus === ComplianceStatus.PARTIALLY_COMPLIANT).length,
      nonCompliant: states.filter(s => s.complianceStatus === ComplianceStatus.NON_COMPLIANT).length,
    };

    const systemsFullyCompliant = systems.filter(s =>
      this.calculateSystemCompliance(s) === 100
    ).length;

    const systemsPartiallyCompliant = systems.filter(s => {
      const compliance = this.calculateSystemCompliance(s);
      return compliance > 0 && compliance < 100;
    }).length;

    const systemsNonCompliant = systems.filter(s =>
      this.calculateSystemCompliance(s) === 0
    ).length;

    const avgCompliance = systems.reduce((sum, s) =>
      sum + this.calculateSystemCompliance(s), 0) / systems.length || 0;

    return {
      averageCompliancePercentage: avgCompliance,
      systemsFullyCompliant,
      systemsPartiallyCompliant,
      systemsNonCompliant,
      totalRequirementsAssessed: states.length,
    };
  }

  /**
   * Collect oversight metrics
   */
  private async collectOversightMetrics() {
    const actions = await this.oversightRepository.find();

    const byType: Record<OversightActionType, number> = {
      [OversightActionType.OVERRIDE]: 0,
      [OversightActionType.INTERVENTION]: 0,
      [OversightActionType.SHUTDOWN]: 0,
      [OversightActionType.APPROVAL]: 0,
    };

    actions.forEach(action => {
      byType[action.actionType]++;
    });

    const overrideRate = actions.length > 0
      ? byType[OversightActionType.OVERRIDE] / actions.length
      : 0;

    const interventionRate = actions.length > 0
      ? byType[OversightActionType.INTERVENTION] / actions.length
      : 0;

    return {
      oversightActionsTotal: actions.length,
      oversightActionsByType: byType,
      overrideRate,
      interventionRate,
    };
  }

  /**
   * Calculate compliance percentage for a system
   */
  private calculateSystemCompliance(system: AISystemRegistry): number {
    if (!system.complianceStates || system.complianceStates.length === 0) {
      return 0;
    }

    const compliant = system.complianceStates.filter(
      s => s.complianceStatus === ComplianceStatus.COMPLIANT
    ).length;

    return (compliant / system.complianceStates.length) * 100;
  }

  /**
   * Get metric value at a specific time
   */
  private async getMetricValueAtTime(metric: string, timestamp: Date): Promise<number> {
    // TODO: Implement time-travel queries for historical metrics
    // For now, return current value
    const snapshot = await this.getMetricsSnapshot();

    switch (metric) {
      case 'systemsTotal':
        return snapshot.systemsTotal;
      case 'incidentsOpen':
        return snapshot.incidentsOpen;
      case 'averageCompliancePercentage':
        return snapshot.averageCompliancePercentage;
      default:
        return 0;
    }
  }

  /**
   * Calculate trend from data points
   */
  private calculateTrend(dataPoints: MetricDataPoint[]): 'increasing' | 'decreasing' | 'stable' {
    if (dataPoints.length < 2) return 'stable';

    const first = dataPoints[0].value;
    const last = dataPoints[dataPoints.length - 1].value;
    const change = last - first;
    const percentChange = Math.abs(change / first) * 100;

    if (percentChange < 5) return 'stable';
    return change > 0 ? 'increasing' : 'decreasing';
  }

  /**
   * Calculate percentage change
   */
  private calculateChangePercentage(dataPoints: MetricDataPoint[]): number {
    if (dataPoints.length < 2) return 0;

    const first = dataPoints[0].value;
    const last = dataPoints[dataPoints.length - 1].value;

    if (first === 0) return 0;
    return ((last - first) / first) * 100;
  }

  /**
   * Check if cache is valid
   */
  private isCacheValid(): boolean {
    if (!this.metricsCache || !this.cacheTimestamp) return false;

    const age = Date.now() - this.cacheTimestamp.getTime();
    return age < this.CACHE_TTL_SECONDS * 1000;
  }
}
