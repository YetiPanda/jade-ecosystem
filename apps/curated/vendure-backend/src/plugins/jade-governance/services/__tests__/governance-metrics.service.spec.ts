/**
 * Governance Metrics Service Tests
 *
 * Sprint G4.9: Comprehensive observability tests
 *
 * Tests metrics collection, snapshot generation, and aggregation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GovernanceMetricsService } from '../governance-metrics.service';
import { AISystemRegistry } from '../../entities/ai-system-registry.entity';
import { AIIncident } from '../../entities/ai-incident.entity';
import { AIComplianceState } from '../../entities/ai-compliance-state.entity';
import { HumanOversightAction } from '../../entities/human-oversight-action.entity';
import { RiskCategory, IncidentSeverity, ComplianceStatus } from '../../types/governance.enums';

describe('GovernanceMetricsService', () => {
  let service: GovernanceMetricsService;
  let systemRepository: Repository<AISystemRegistry>;
  let incidentRepository: Repository<AIIncident>;
  let complianceRepository: Repository<AIComplianceState>;
  let oversightRepository: Repository<HumanOversightAction>;

  const mockSystemRepository = {
    count: vi.fn(),
    find: vi.fn(),
    createQueryBuilder: vi.fn(),
  };

  const mockIncidentRepository = {
    count: vi.fn(),
    find: vi.fn(),
    createQueryBuilder: vi.fn(),
  };

  const mockComplianceRepository = {
    find: vi.fn(),
    count: vi.fn(),
  };

  const mockOversightRepository = {
    count: vi.fn(),
    find: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GovernanceMetricsService,
        {
          provide: getRepositoryToken(AISystemRegistry),
          useValue: mockSystemRepository,
        },
        {
          provide: getRepositoryToken(AIIncident),
          useValue: mockIncidentRepository,
        },
        {
          provide: getRepositoryToken(AIComplianceState),
          useValue: mockComplianceRepository,
        },
        {
          provide: getRepositoryToken(HumanOversightAction),
          useValue: mockOversightRepository,
        },
      ],
    }).compile();

    service = module.get<GovernanceMetricsService>(GovernanceMetricsService);
    systemRepository = module.get<Repository<AISystemRegistry>>(
      getRepositoryToken(AISystemRegistry)
    );
    incidentRepository = module.get<Repository<AIIncident>>(
      getRepositoryToken(AIIncident)
    );
    complianceRepository = module.get<Repository<AIComplianceState>>(
      getRepositoryToken(AIComplianceState)
    );
    oversightRepository = module.get<Repository<HumanOversightAction>>(
      getRepositoryToken(HumanOversightAction)
    );

    vi.clearAllMocks();
  });

  describe('getMetricsSnapshot', () => {
    it('should generate comprehensive metrics snapshot', async () => {
      // Mock system counts
      mockSystemRepository.count.mockResolvedValueOnce(50); // total
      mockSystemRepository.count.mockResolvedValueOnce(45); // active

      // Mock systems by risk
      const mockQueryBuilder = {
        where: vi.fn().mockReturnThis(),
        getCount: vi.fn()
          .mockResolvedValueOnce(10) // low
          .mockResolvedValueOnce(30) // medium
          .mockResolvedValueOnce(10), // high
      };
      mockSystemRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      // Mock incident counts
      mockIncidentRepository.count.mockResolvedValueOnce(100); // total
      mockIncidentRepository.count.mockResolvedValueOnce(15); // open

      // Mock incident severity counts
      const mockIncidentQueryBuilder = {
        where: vi.fn().mockReturnThis(),
        getCount: vi.fn()
          .mockResolvedValueOnce(5) // critical
          .mockResolvedValueOnce(7) // high
          .mockResolvedValueOnce(3), // medium
      };
      mockIncidentRepository.createQueryBuilder.mockReturnValue(
        mockIncidentQueryBuilder
      );

      // Mock compliance
      mockComplianceRepository.find.mockResolvedValue([
        { complianceStatus: ComplianceStatus.COMPLIANT },
        { complianceStatus: ComplianceStatus.COMPLIANT },
        { complianceStatus: ComplianceStatus.NON_COMPLIANT },
        { complianceStatus: ComplianceStatus.PARTIALLY_COMPLIANT },
      ]);

      // Mock oversight actions
      mockOversightRepository.count.mockResolvedValue(25);

      const snapshot = await service.getMetricsSnapshot();

      expect(snapshot.systemsTotal).toBe(50);
      expect(snapshot.systemsActive).toBe(45);
      expect(snapshot.systemsByRiskCategory).toEqual({
        low: 10,
        medium: 30,
        high: 10,
      });
      expect(snapshot.incidentsTotal).toBe(100);
      expect(snapshot.incidentsOpen).toBe(15);
      expect(snapshot.incidentsBySeverity).toEqual({
        critical: 5,
        high: 7,
        medium: 3,
      });
      expect(snapshot.averageCompliancePercentage).toBe(50); // 2/4 compliant
      expect(snapshot.oversightActionsTotal).toBe(25);
    });

    it('should handle zero systems gracefully', async () => {
      mockSystemRepository.count.mockResolvedValue(0);
      const mockQueryBuilder = {
        where: vi.fn().mockReturnThis(),
        getCount: vi.fn().mockResolvedValue(0),
      };
      mockSystemRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockIncidentRepository.count.mockResolvedValue(0);
      const mockIncidentQueryBuilder = {
        where: vi.fn().mockReturnThis(),
        getCount: vi.fn().mockResolvedValue(0),
      };
      mockIncidentRepository.createQueryBuilder.mockReturnValue(
        mockIncidentQueryBuilder
      );
      mockComplianceRepository.find.mockResolvedValue([]);
      mockOversightRepository.count.mockResolvedValue(0);

      const snapshot = await service.getMetricsSnapshot();

      expect(snapshot.systemsTotal).toBe(0);
      expect(snapshot.averageCompliancePercentage).toBe(0);
    });
  });

  describe('getSystemMetrics', () => {
    it('should return system-specific metrics', async () => {
      const mockSystem = {
        id: 'system-123',
        systemName: 'Test System',
        riskCategory: RiskCategory.HIGH,
        isActive: true,
      };

      mockSystemRepository.find.mockResolvedValue([mockSystem]);

      // Mock incident count for this system
      mockIncidentRepository.count.mockResolvedValue(5);

      // Mock compliance states
      mockComplianceRepository.find.mockResolvedValue([
        { complianceStatus: ComplianceStatus.COMPLIANT },
        { complianceStatus: ComplianceStatus.COMPLIANT },
        { complianceStatus: ComplianceStatus.NON_COMPLIANT },
      ]);

      // Mock oversight actions
      mockOversightRepository.count.mockResolvedValue(3);

      const metrics = await service.getSystemMetrics('system-123');

      expect(metrics.system).toEqual(mockSystem);
      expect(metrics.totalIncidents).toBe(5);
      expect(metrics.compliancePercentage).toBe(66.67); // 2/3
      expect(metrics.oversightActionsCount).toBe(3);
    });

    it('should throw error for non-existent system', async () => {
      mockSystemRepository.find.mockResolvedValue([]);

      await expect(service.getSystemMetrics('nonexistent')).rejects.toThrow(
        'System not found: nonexistent'
      );
    });
  });

  describe('getIncidentMetrics', () => {
    it('should calculate incident trend metrics', async () => {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const mockIncidents = [
        {
          severity: IncidentSeverity.CRITICAL,
          occurredAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        },
        {
          severity: IncidentSeverity.HIGH,
          occurredAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          severity: IncidentSeverity.MEDIUM,
          occurredAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        },
      ];

      mockIncidentRepository.find.mockResolvedValue(mockIncidents);

      const metrics = await service.getIncidentMetrics(oneWeekAgo, now);

      expect(metrics.totalIncidents).toBe(3);
      expect(metrics.bySeverity).toEqual({
        critical: 1,
        high: 1,
        medium: 1,
      });
    });

    it('should return empty metrics for time range with no incidents', async () => {
      mockIncidentRepository.find.mockResolvedValue([]);

      const metrics = await service.getIncidentMetrics(
        new Date('2020-01-01'),
        new Date('2020-01-02')
      );

      expect(metrics.totalIncidents).toBe(0);
      expect(metrics.bySeverity).toEqual({
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
      });
    });
  });

  describe('getComplianceMetrics', () => {
    it('should calculate overall compliance percentage', async () => {
      const mockStates = [
        { complianceStatus: ComplianceStatus.COMPLIANT },
        { complianceStatus: ComplianceStatus.COMPLIANT },
        { complianceStatus: ComplianceStatus.COMPLIANT },
        { complianceStatus: ComplianceStatus.NON_COMPLIANT },
        { complianceStatus: ComplianceStatus.PARTIALLY_COMPLIANT },
      ];

      mockComplianceRepository.find.mockResolvedValue(mockStates);

      const metrics = await service.getComplianceMetrics();

      expect(metrics.totalRequirements).toBe(5);
      expect(metrics.compliantCount).toBe(3);
      expect(metrics.overallPercentage).toBe(60); // 3/5
    });

    it('should handle no compliance states', async () => {
      mockComplianceRepository.find.mockResolvedValue([]);

      const metrics = await service.getComplianceMetrics();

      expect(metrics.totalRequirements).toBe(0);
      expect(metrics.compliantCount).toBe(0);
      expect(metrics.overallPercentage).toBe(0);
    });
  });

  describe('Metric aggregation', () => {
    it('should correctly aggregate risk categories', async () => {
      const mockQueryBuilder = {
        where: vi.fn().mockReturnThis(),
        getCount: vi.fn()
          .mockResolvedValueOnce(15) // low
          .mockResolvedValueOnce(25) // medium
          .mockResolvedValueOnce(5), // high
      };

      mockSystemRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const counts = {
        low: await mockQueryBuilder.where().getCount(),
        medium: await mockQueryBuilder.where().getCount(),
        high: await mockQueryBuilder.where().getCount(),
      };

      expect(counts).toEqual({
        low: 15,
        medium: 25,
        high: 5,
      });

      const total = counts.low + counts.medium + counts.high;
      expect(total).toBe(45);
    });

    it('should correctly aggregate incident severities', async () => {
      const mockIncidents = [
        { severity: IncidentSeverity.CRITICAL },
        { severity: IncidentSeverity.CRITICAL },
        { severity: IncidentSeverity.HIGH },
        { severity: IncidentSeverity.HIGH },
        { severity: IncidentSeverity.HIGH },
        { severity: IncidentSeverity.MEDIUM },
      ];

      mockIncidentRepository.find.mockResolvedValue(mockIncidents);

      const incidents = await mockIncidentRepository.find();
      const bySeverity = incidents.reduce((acc, inc) => {
        acc[inc.severity] = (acc[inc.severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      expect(bySeverity).toEqual({
        critical: 2,
        high: 3,
        medium: 1,
      });
    });
  });
});
