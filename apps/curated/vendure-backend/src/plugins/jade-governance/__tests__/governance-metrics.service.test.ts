/**
 * Unit Tests: Governance Metrics Service
 * Sprint G4.4: Metrics Collection and Caching
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GovernanceMetricsService } from '../services/governance-metrics.service';
import { AISystemRegistry } from '../entities/ai-system-registry.entity';
import { AIIncident } from '../entities/ai-incident.entity';
import { AIComplianceState } from '../entities/ai-compliance-state.entity';
import { HumanOversightAction } from '../entities/human-oversight-action.entity';
import {
  RiskCategory,
  OversightLevel,
  IncidentSeverity,
  IncidentStep,
  ComplianceStatus,
  OversightActionType,
} from '../types/governance.enums';

describe('GovernanceMetricsService', () => {
  let service: GovernanceMetricsService;

  const mockSystemRepository = {
    find: jest.fn(() => Promise.resolve([
      {
        id: 'system-1',
        riskCategory: RiskCategory.HIGH,
        humanOversightLevel: OversightLevel.IN_THE_LOOP,
        isActive: true,
        complianceStates: [
          { complianceStatus: ComplianceStatus.COMPLIANT },
          { complianceStatus: ComplianceStatus.COMPLIANT },
        ],
        incidents: [
          { resolvedAt: null, severity: IncidentSeverity.CRITICAL },
        ],
      },
      {
        id: 'system-2',
        riskCategory: RiskCategory.LIMITED,
        humanOversightLevel: OversightLevel.ON_THE_LOOP,
        isActive: true,
        complianceStates: [
          { complianceStatus: ComplianceStatus.COMPLIANT },
          { complianceStatus: ComplianceStatus.PARTIALLY_COMPLIANT },
        ],
        incidents: [],
      },
    ])),
    count: jest.fn(() => Promise.resolve(2)),
  };

  const mockIncidentRepository = {
    find: jest.fn(() => Promise.resolve([
      {
        id: 'incident-1',
        severity: IncidentSeverity.CRITICAL,
        currentStep: IncidentStep.ASSESS,
        resolvedAt: null,
        detectedAt: new Date('2025-12-18'),
      },
      {
        id: 'incident-2',
        severity: IncidentSeverity.MARGINAL,
        currentStep: IncidentStep.VERIFY,
        resolvedAt: new Date('2025-12-19'),
        detectedAt: new Date('2025-12-18'),
      },
    ])),
  };

  const mockComplianceRepository = {
    find: jest.fn(() => Promise.resolve([
      { complianceStatus: ComplianceStatus.COMPLIANT },
      { complianceStatus: ComplianceStatus.COMPLIANT },
      { complianceStatus: ComplianceStatus.PARTIALLY_COMPLIANT },
    ])),
  };

  const mockOversightRepository = {
    find: jest.fn(() => Promise.resolve([
      { actionType: OversightActionType.OVERRIDE },
      { actionType: OversightActionType.INTERVENTION },
      { actionType: OversightActionType.APPROVAL },
    ])),
    count: jest.fn(() => Promise.resolve(0)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GovernanceMetricsService,
        { provide: getRepositoryToken(AISystemRegistry), useValue: mockSystemRepository },
        { provide: getRepositoryToken(AIIncident), useValue: mockIncidentRepository },
        { provide: getRepositoryToken(AIComplianceState), useValue: mockComplianceRepository },
        { provide: getRepositoryToken(HumanOversightAction), useValue: mockOversightRepository },
      ],
    }).compile();

    service = module.get<GovernanceMetricsService>(GovernanceMetricsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMetricsSnapshot', () => {
    it('should return comprehensive metrics snapshot', async () => {
      const snapshot = await service.getMetricsSnapshot();

      expect(snapshot).toHaveProperty('systemsTotal');
      expect(snapshot).toHaveProperty('systemsActive');
      expect(snapshot).toHaveProperty('systemsByRiskCategory');
      expect(snapshot).toHaveProperty('systemsByOversightLevel');
      expect(snapshot).toHaveProperty('incidentsTotal');
      expect(snapshot).toHaveProperty('incidentsOpen');
      expect(snapshot).toHaveProperty('incidentsClosed');
      expect(snapshot).toHaveProperty('incidentsBySeverity');
      expect(snapshot).toHaveProperty('incidentsByStep');
      expect(snapshot).toHaveProperty('averageResolutionTimeHours');
      expect(snapshot).toHaveProperty('averageCompliancePercentage');
      expect(snapshot).toHaveProperty('systemsFullyCompliant');
      expect(snapshot).toHaveProperty('oversightActionsTotal');
      expect(snapshot).toHaveProperty('overrideRate');
      expect(snapshot).toHaveProperty('capturedAt');
    });

    it('should count systems correctly', async () => {
      const snapshot = await service.getMetricsSnapshot();

      expect(snapshot.systemsTotal).toBe(2);
      expect(snapshot.systemsActive).toBe(2);
    });

    it('should categorize systems by risk', async () => {
      const snapshot = await service.getMetricsSnapshot();

      expect(snapshot.systemsByRiskCategory).toHaveProperty(RiskCategory.HIGH);
      expect(snapshot.systemsByRiskCategory).toHaveProperty(RiskCategory.LIMITED);
      expect(snapshot.systemsByRiskCategory[RiskCategory.HIGH]).toBe(1);
      expect(snapshot.systemsByRiskCategory[RiskCategory.LIMITED]).toBe(1);
    });

    it('should categorize systems by oversight level', async () => {
      const snapshot = await service.getMetricsSnapshot();

      expect(snapshot.systemsByOversightLevel).toHaveProperty(OversightLevel.IN_THE_LOOP);
      expect(snapshot.systemsByOversightLevel).toHaveProperty(OversightLevel.ON_THE_LOOP);
    });

    it('should count incidents correctly', async () => {
      const snapshot = await service.getMetricsSnapshot();

      expect(snapshot.incidentsTotal).toBe(2);
      expect(snapshot.incidentsOpen).toBe(1);
      expect(snapshot.incidentsClosed).toBe(1);
    });

    it('should calculate average resolution time', async () => {
      const snapshot = await service.getMetricsSnapshot();

      expect(snapshot.averageResolutionTimeHours).toBeGreaterThan(0);
      expect(typeof snapshot.averageResolutionTimeHours).toBe('number');
    });

    it('should calculate compliance metrics', async () => {
      const snapshot = await service.getMetricsSnapshot();

      expect(snapshot.averageCompliancePercentage).toBeGreaterThan(0);
      expect(snapshot.averageCompliancePercentage).toBeLessThanOrEqual(100);
    });

    it('should calculate oversight metrics', async () => {
      const snapshot = await service.getMetricsSnapshot();

      expect(snapshot.oversightActionsTotal).toBe(3);
      expect(snapshot.overrideRate).toBeGreaterThanOrEqual(0);
      expect(snapshot.overrideRate).toBeLessThanOrEqual(1);
    });

    it('should have timestamp', async () => {
      const snapshot = await service.getMetricsSnapshot();

      expect(snapshot.capturedAt).toBeInstanceOf(Date);
    });
  });

  describe('Metrics Caching', () => {
    beforeEach(() => {
      // Clear cache before caching tests
      service['metricsCache'] = null;
      service['cacheTimestamp'] = null;
    });

    it('should cache metrics for TTL period (1 minute)', async () => {
      const snapshot1 = await service.getMetricsSnapshot();
      const snapshot2 = await service.getMetricsSnapshot();

      // Should return same cached instance
      expect(snapshot1.capturedAt).toEqual(snapshot2.capturedAt);
      expect(mockSystemRepository.find).toHaveBeenCalledTimes(1);
    });

    it('should force refresh when requested', async () => {
      await service.getMetricsSnapshot();
      await service.getMetricsSnapshot(true); // force refresh

      expect(mockSystemRepository.find).toHaveBeenCalledTimes(2);
    });

    it('should invalidate cache after TTL', async () => {
      jest.useFakeTimers();

      await service.getMetricsSnapshot();

      // Advance time past TTL (60 seconds)
      jest.advanceTimersByTime(61000);

      await service.getMetricsSnapshot();

      expect(mockSystemRepository.find).toHaveBeenCalledTimes(2);

      jest.useRealTimers();
    });
  });

  describe('getExecutiveSummary', () => {
    it('should return executive summary', async () => {
      const summary = await service.getExecutiveSummary();

      expect(summary).toHaveProperty('systemsAtRisk');
      expect(summary).toHaveProperty('criticalIncidentsOpen');
      expect(summary).toHaveProperty('complianceScore');
      expect(summary).toHaveProperty('oversightInterventions24h');
      expect(summary).toHaveProperty('topRisks');
    });

    it('should identify systems at risk', async () => {
      const summary = await service.getExecutiveSummary();

      expect(typeof summary.systemsAtRisk).toBe('number');
      expect(summary.systemsAtRisk).toBeGreaterThanOrEqual(0);
    });

    it('should count critical incidents', async () => {
      const summary = await service.getExecutiveSummary();

      expect(typeof summary.criticalIncidentsOpen).toBe('number');
    });

    it('should calculate overall compliance score', async () => {
      const summary = await service.getExecutiveSummary();

      expect(summary.complianceScore).toBeGreaterThanOrEqual(0);
      expect(summary.complianceScore).toBeLessThanOrEqual(100);
    });

    it('should return top 5 risks', async () => {
      const summary = await service.getExecutiveSummary();

      expect(Array.isArray(summary.topRisks)).toBe(true);
      expect(summary.topRisks.length).toBeLessThanOrEqual(5);
    });

    it('should sort top risks by risk category and compliance', async () => {
      const summary = await service.getExecutiveSummary();

      if (summary.topRisks.length > 1) {
        const first = summary.topRisks[0];
        const second = summary.topRisks[1];

        // First should have higher risk or lower compliance
        expect(
          first.riskCategory === RiskCategory.UNACCEPTABLE ||
          first.riskCategory === RiskCategory.HIGH ||
          first.compliancePercentage <= second.compliancePercentage
        ).toBe(true);
      }
    });
  });

  describe('getMetricTrend', () => {
    it('should return metric trend with data points', async () => {
      const startDate = new Date('2025-12-01');
      const endDate = new Date('2025-12-05');

      const trend = await service.getMetricTrend('systemsTotal', startDate, endDate, 24);

      expect(trend).toHaveProperty('metric');
      expect(trend).toHaveProperty('dataPoints');
      expect(trend).toHaveProperty('trend');
      expect(trend).toHaveProperty('changePercentage');
      expect(trend.metric).toBe('systemsTotal');
      expect(Array.isArray(trend.dataPoints)).toBe(true);
    });

    it('should calculate trend direction', async () => {
      const startDate = new Date('2025-12-01');
      const endDate = new Date('2025-12-05');

      const trend = await service.getMetricTrend('incidentsOpen', startDate, endDate);

      expect(['increasing', 'decreasing', 'stable']).toContain(trend.trend);
    });

    it('should calculate percentage change', async () => {
      const startDate = new Date('2025-12-01');
      const endDate = new Date('2025-12-05');

      const trend = await service.getMetricTrend('averageCompliancePercentage', startDate, endDate);

      expect(typeof trend.changePercentage).toBe('number');
    });
  });

  describe('getSKAAgenticMetrics', () => {
    it('should return SKA metrics placeholder', async () => {
      const skaMetrics = await service.getSKAAgenticMetrics();

      expect(skaMetrics).toHaveProperty('appreciatingAssetCount');
      expect(skaMetrics).toHaveProperty('depreciatingAssetCount');
      expect(skaMetrics).toHaveProperty('networkEffectStrength');
      expect(skaMetrics).toHaveProperty('symbolicQueryCount');
      expect(skaMetrics).toHaveProperty('neuralQueryCount');
      expect(skaMetrics).toHaveProperty('hybridQueryCount');
      expect(skaMetrics).toHaveProperty('entropyLevel');
      expect(skaMetrics).toHaveProperty('queriesPerSecondCapacity');
      expect(skaMetrics).toHaveProperty('multiHopMaxDepth');
      expect(skaMetrics).toHaveProperty('isEnabled');
    });

    it('should have isEnabled set to false (until SKA integration)', async () => {
      const skaMetrics = await service.getSKAAgenticMetrics();

      expect(skaMetrics.isEnabled).toBe(false);
    });

    it('should return zeros for all metrics (placeholder)', async () => {
      const skaMetrics = await service.getSKAAgenticMetrics();

      expect(skaMetrics.appreciatingAssetCount).toBe(0);
      expect(skaMetrics.depreciatingAssetCount).toBe(0);
      expect(skaMetrics.networkEffectStrength).toBe(0);
      expect(skaMetrics.symbolicQueryCount).toBe(0);
      expect(skaMetrics.neuralQueryCount).toBe(0);
      expect(skaMetrics.hybridQueryCount).toBe(0);
      expect(skaMetrics.entropyLevel).toBe(0);
      expect(skaMetrics.queriesPerSecondCapacity).toBe(0);
      expect(skaMetrics.multiHopMaxDepth).toBe(0);
    });
  });

  describe('getPerformanceMetrics', () => {
    it('should return performance metrics placeholder', async () => {
      const perfMetrics = await service.getPerformanceMetrics();

      expect(perfMetrics).toHaveProperty('averageQueryTime');
      expect(perfMetrics).toHaveProperty('slowQueryCount');
      expect(perfMetrics).toHaveProperty('averageIncidentDetectionLag');
      expect(perfMetrics).toHaveProperty('averageComplianceAssessmentTime');
      expect(perfMetrics).toHaveProperty('uptimePercentage');
      expect(perfMetrics).toHaveProperty('errorRate');
    });

    it('should show 100% uptime (placeholder)', async () => {
      const perfMetrics = await service.getPerformanceMetrics();

      expect(perfMetrics.uptimePercentage).toBe(100);
      expect(perfMetrics.errorRate).toBe(0);
    });
  });
});
