/**
 * Alert Rule Evaluation Service Tests
 *
 * Sprint G4.9: Comprehensive observability tests
 *
 * Tests alert rule evaluation, cooldown logic, and alert lifecycle
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertRuleEvaluationService } from '../alert-rule-evaluation.service';
import {
  AlertRule,
  AlertRuleType,
  ComparisonOperator,
} from '../../entities/alert-rule.entity';
import { GovernanceAlert, AlertStatus } from '../../entities/governance-alert.entity';
import { GovernanceMetricsService } from '../governance-metrics.service';
import { GovernanceAuditService } from '../governance-audit.service';

describe('AlertRuleEvaluationService', () => {
  let service: AlertRuleEvaluationService;
  let alertRuleRepository: Repository<AlertRule>;
  let alertRepository: Repository<GovernanceAlert>;
  let metricsService: GovernanceMetricsService;
  let auditService: GovernanceAuditService;

  const mockAlertRuleRepository = {
    find: vi.fn(),
    findOne: vi.fn(),
    save: vi.fn(),
  };

  const mockAlertRepository = {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
    find: vi.fn(),
  };

  const mockMetricsService = {
    getMetricsSnapshot: vi.fn(),
  };

  const mockAuditService = {
    countEventsSince: vi.fn(),
    logEvent: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertRuleEvaluationService,
        {
          provide: getRepositoryToken(AlertRule),
          useValue: mockAlertRuleRepository,
        },
        {
          provide: getRepositoryToken(GovernanceAlert),
          useValue: mockAlertRepository,
        },
        {
          provide: GovernanceMetricsService,
          useValue: mockMetricsService,
        },
        {
          provide: GovernanceAuditService,
          useValue: mockAuditService,
        },
      ],
    }).compile();

    service = module.get<AlertRuleEvaluationService>(AlertRuleEvaluationService);
    alertRuleRepository = module.get<Repository<AlertRule>>(
      getRepositoryToken(AlertRule)
    );
    alertRepository = module.get<Repository<GovernanceAlert>>(
      getRepositoryToken(GovernanceAlert)
    );
    metricsService = module.get<GovernanceMetricsService>(GovernanceMetricsService);
    auditService = module.get<GovernanceAuditService>(GovernanceAuditService);

    vi.clearAllMocks();
  });

  describe('evaluateMetricThreshold', () => {
    it('should trigger alert when metric exceeds threshold (GT)', async () => {
      const rule: AlertRule = {
        id: 'rule-1',
        name: 'High Risk Systems Alert',
        ruleType: AlertRuleType.METRIC_THRESHOLD,
        severity: 'warning',
        condition: {
          metric: 'systems_at_risk',
          operator: ComparisonOperator.GT,
          threshold: 5,
        },
        isActive: true,
        cooldownMinutes: 60,
        triggerCount: 0,
        alerts: [],
        notificationChannels: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMetricsService.getMetricsSnapshot.mockResolvedValue({
        systemsByRiskCategory: { high: 10 }, // 10 > 5
      });

      const result = await service.evaluateRule(rule);

      expect(result.triggered).toBe(true);
      expect(result.triggerValue).toBe(10);
      expect(result.message).toContain('systems_at_risk');
    });

    it('should not trigger alert when metric below threshold', async () => {
      const rule: AlertRule = {
        id: 'rule-1',
        name: 'High Risk Systems Alert',
        ruleType: AlertRuleType.METRIC_THRESHOLD,
        severity: 'warning',
        condition: {
          metric: 'systems_at_risk',
          operator: ComparisonOperator.GT,
          threshold: 20,
        },
        isActive: true,
        cooldownMinutes: 60,
        triggerCount: 0,
        alerts: [],
        notificationChannels: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMetricsService.getMetricsSnapshot.mockResolvedValue({
        systemsByRiskCategory: { high: 10 }, // 10 !> 20
      });

      const result = await service.evaluateRule(rule);

      expect(result.triggered).toBe(false);
    });

    it('should handle LT (less than) operator', async () => {
      const rule: AlertRule = {
        id: 'rule-1',
        name: 'Low Compliance Alert',
        ruleType: AlertRuleType.METRIC_THRESHOLD,
        severity: 'critical',
        condition: {
          metric: 'compliance_percentage',
          operator: ComparisonOperator.LT,
          threshold: 80,
        },
        isActive: true,
        cooldownMinutes: 60,
        triggerCount: 0,
        alerts: [],
        notificationChannels: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMetricsService.getMetricsSnapshot.mockResolvedValue({
        averageCompliancePercentage: 65, // 65 < 80
      });

      const result = await service.evaluateRule(rule);

      expect(result.triggered).toBe(true);
      expect(result.triggerValue).toBe(65);
    });
  });

  describe('evaluateEventPattern', () => {
    it('should trigger alert when event count exceeds threshold', async () => {
      const rule: AlertRule = {
        id: 'rule-1',
        name: 'Incident Spike Alert',
        ruleType: AlertRuleType.EVENT_PATTERN,
        severity: 'critical',
        condition: {
          metric: 'INCIDENT_CREATED',
          operator: ComparisonOperator.GT,
          threshold: 5,
          timeWindowHours: 24,
        },
        isActive: true,
        cooldownMinutes: 60,
        triggerCount: 0,
        alerts: [],
        notificationChannels: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuditService.countEventsSince.mockResolvedValue(8); // 8 > 5

      const result = await service.evaluateRule(rule);

      expect(result.triggered).toBe(true);
      expect(result.triggerValue).toBe(8);
      expect(result.message).toContain('INCIDENT_CREATED');
      expect(result.message).toContain('24h');
    });

    it('should not trigger when event count below threshold', async () => {
      const rule: AlertRule = {
        id: 'rule-1',
        name: 'Incident Spike Alert',
        ruleType: AlertRuleType.EVENT_PATTERN,
        severity: 'critical',
        condition: {
          metric: 'INCIDENT_CREATED',
          operator: ComparisonOperator.GT,
          threshold: 10,
          timeWindowHours: 24,
        },
        isActive: true,
        cooldownMinutes: 60,
        triggerCount: 0,
        alerts: [],
        notificationChannels: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuditService.countEventsSince.mockResolvedValue(8); // 8 !> 10

      const result = await service.evaluateRule(rule);

      expect(result.triggered).toBe(false);
    });
  });

  describe('evaluateComposite', () => {
    it('should trigger when all sub-conditions pass (AND logic)', async () => {
      const rule: AlertRule = {
        id: 'rule-1',
        name: 'Critical System State',
        ruleType: AlertRuleType.COMPOSITE,
        severity: 'critical',
        condition: {
          rules: [
            { metric: 'systems_at_risk', operator: ComparisonOperator.GT, threshold: 5 },
            { metric: 'critical_incidents_open', operator: ComparisonOperator.GT, threshold: 2 },
          ],
          aggregation: 'AND',
        },
        isActive: true,
        cooldownMinutes: 60,
        triggerCount: 0,
        alerts: [],
        notificationChannels: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMetricsService.getMetricsSnapshot.mockResolvedValue({
        systemsByRiskCategory: { high: 10 }, // 10 > 5 ✓
        incidentsOpen: 5, // 5 > 2 ✓
      });

      const result = await service.evaluateRule(rule);

      expect(result.triggered).toBe(true);
    });

    it('should not trigger when any sub-condition fails (AND logic)', async () => {
      const rule: AlertRule = {
        id: 'rule-1',
        name: 'Critical System State',
        ruleType: AlertRuleType.COMPOSITE,
        severity: 'critical',
        condition: {
          rules: [
            { metric: 'systems_at_risk', operator: ComparisonOperator.GT, threshold: 5 },
            { metric: 'critical_incidents_open', operator: ComparisonOperator.GT, threshold: 2 },
          ],
          aggregation: 'AND',
        },
        isActive: true,
        cooldownMinutes: 60,
        triggerCount: 0,
        alerts: [],
        notificationChannels: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMetricsService.getMetricsSnapshot.mockResolvedValue({
        systemsByRiskCategory: { high: 10 }, // 10 > 5 ✓
        incidentsOpen: 1, // 1 !> 2 ✗
      });

      const result = await service.evaluateRule(rule);

      expect(result.triggered).toBe(false);
    });

    it('should trigger when any sub-condition passes (OR logic)', async () => {
      const rule: AlertRule = {
        id: 'rule-1',
        name: 'Warning Condition',
        ruleType: AlertRuleType.COMPOSITE,
        severity: 'warning',
        condition: {
          rules: [
            { metric: 'systems_at_risk', operator: ComparisonOperator.GT, threshold: 5 },
            { metric: 'incidents_open', operator: ComparisonOperator.GT, threshold: 10 },
          ],
          aggregation: 'OR',
        },
        isActive: true,
        cooldownMinutes: 60,
        triggerCount: 0,
        alerts: [],
        notificationChannels: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockMetricsService.getMetricsSnapshot.mockResolvedValue({
        systemsByRiskCategory: { high: 2 }, // 2 !> 5 ✗
        incidentsOpen: 15, // 15 > 10 ✓
      });

      const result = await service.evaluateRule(rule);

      expect(result.triggered).toBe(true);
    });
  });

  describe('Cooldown period', () => {
    it('should skip rule evaluation during cooldown', async () => {
      const rule: AlertRule = {
        id: 'rule-1',
        name: 'Test Rule',
        ruleType: AlertRuleType.METRIC_THRESHOLD,
        severity: 'warning',
        condition: { metric: 'systems_at_risk', operator: ComparisonOperator.GT, threshold: 5 },
        isActive: true,
        cooldownMinutes: 60,
        triggerCount: 0,
        alerts: [],
        notificationChannels: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Recent alert within cooldown period (30 minutes ago)
      const recentAlert = {
        id: 'alert-1',
        ruleId: 'rule-1',
        triggeredAt: new Date(Date.now() - 30 * 60 * 1000),
      };

      mockAlertRuleRepository.find.mockResolvedValue([rule]);
      mockAlertRepository.findOne.mockResolvedValue(recentAlert);

      const alerts = await service.evaluateAllRules();

      // Should skip evaluation and return no alerts
      expect(alerts).toEqual([]);
    });

    it('should evaluate rule after cooldown period expires', async () => {
      const rule: AlertRule = {
        id: 'rule-1',
        name: 'Test Rule',
        ruleType: AlertRuleType.METRIC_THRESHOLD,
        severity: 'warning',
        condition: { metric: 'systems_at_risk', operator: ComparisonOperator.GT, threshold: 5 },
        isActive: true,
        cooldownMinutes: 60,
        triggerCount: 0,
        alerts: [],
        notificationChannels: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Old alert outside cooldown period (90 minutes ago)
      const oldAlert = {
        id: 'alert-1',
        ruleId: 'rule-1',
        triggeredAt: new Date(Date.now() - 90 * 60 * 1000),
      };

      mockAlertRuleRepository.find.mockResolvedValue([rule]);
      mockAlertRepository.findOne.mockResolvedValue(oldAlert);
      mockMetricsService.getMetricsSnapshot.mockResolvedValue({
        systemsByRiskCategory: { high: 10 }, // Triggers rule
      });
      mockAlertRepository.create.mockImplementation((data) => data);
      mockAlertRepository.save.mockImplementation((data) => ({ id: 'new-alert', ...data }));

      const alerts = await service.evaluateAllRules();

      // Should evaluate and create new alert
      expect(alerts.length).toBe(1);
    });
  });

  describe('Alert lifecycle', () => {
    it('should acknowledge alert and log event', async () => {
      const alert: GovernanceAlert = {
        id: 'alert-1',
        ruleId: 'rule-1',
        title: 'Test Alert',
        message: 'Test message',
        severity: 'warning',
        status: AlertStatus.ACTIVE,
        triggerValue: 10,
        triggeredAt: new Date(),
        notificationsSent: [],
        metadata: {},
        rule: {} as any,
        updatedAt: new Date(),
      };

      mockAlertRepository.findOne.mockResolvedValue(alert);
      mockAlertRepository.save.mockImplementation((data) => data);

      const result = await service.acknowledgeAlert('alert-1', 'user-123', 'Investigating');

      expect(result.status).toBe(AlertStatus.ACKNOWLEDGED);
      expect(result.acknowledgedById).toBe('user-123');
      expect(result.acknowledgementNotes).toBe('Investigating');
      expect(mockAuditService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: 'ALERT_ACKNOWLEDGED',
          actorId: 'user-123',
        })
      );
    });

    it('should resolve alert and log event', async () => {
      const alert: GovernanceAlert = {
        id: 'alert-1',
        ruleId: 'rule-1',
        title: 'Test Alert',
        message: 'Test message',
        severity: 'warning',
        status: AlertStatus.ACKNOWLEDGED,
        triggerValue: 10,
        triggeredAt: new Date(),
        notificationsSent: [],
        metadata: {},
        rule: {} as any,
        updatedAt: new Date(),
      };

      mockAlertRepository.findOne.mockResolvedValue(alert);
      mockAlertRepository.save.mockImplementation((data) => data);

      const result = await service.resolveAlert('alert-1', 'user-123', 'Fixed the issue');

      expect(result.status).toBe(AlertStatus.RESOLVED);
      expect(result.resolvedById).toBe('user-123');
      expect(result.resolutionNotes).toBe('Fixed the issue');
      expect(mockAuditService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: 'ALERT_RESOLVED',
          actorId: 'user-123',
        })
      );
    });

    it('should mark alert as false positive and log event', async () => {
      const alert: GovernanceAlert = {
        id: 'alert-1',
        ruleId: 'rule-1',
        title: 'Test Alert',
        message: 'Test message',
        severity: 'warning',
        status: AlertStatus.ACTIVE,
        triggerValue: 10,
        triggeredAt: new Date(),
        notificationsSent: [],
        metadata: {},
        rule: {} as any,
        updatedAt: new Date(),
      };

      mockAlertRepository.findOne.mockResolvedValue(alert);
      mockAlertRepository.save.mockImplementation((data) => data);

      const result = await service.markFalsePositive('alert-1', 'user-123', 'Not a real issue');

      expect(result.status).toBe(AlertStatus.FALSE_POSITIVE);
      expect(result.resolvedById).toBe('user-123');
      expect(result.resolutionNotes).toBe('Not a real issue');
      expect(mockAuditService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: 'ALERT_FALSE_POSITIVE',
          actorId: 'user-123',
        })
      );
    });

    it('should throw error for non-existent alert', async () => {
      mockAlertRepository.findOne.mockResolvedValue(null);

      await expect(service.acknowledgeAlert('nonexistent', 'user-123')).rejects.toThrow(
        'Alert not found: nonexistent'
      );
    });
  });

  describe('getActiveAlerts', () => {
    it('should retrieve all active alerts', async () => {
      const mockAlerts = [
        { id: 'alert-1', status: AlertStatus.ACTIVE, severity: 'warning' },
        { id: 'alert-2', status: AlertStatus.ACTIVE, severity: 'critical' },
      ];

      mockAlertRepository.find.mockResolvedValue(mockAlerts);

      const alerts = await service.getActiveAlerts();

      expect(alerts).toHaveLength(2);
      expect(mockAlertRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: AlertStatus.ACTIVE },
        })
      );
    });

    it('should filter active alerts by severity', async () => {
      const mockAlerts = [
        { id: 'alert-1', status: AlertStatus.ACTIVE, severity: 'critical' },
      ];

      mockAlertRepository.find.mockResolvedValue(mockAlerts);

      const alerts = await service.getActiveAlerts('critical');

      expect(alerts).toHaveLength(1);
      expect(mockAlertRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: AlertStatus.ACTIVE, severity: 'critical' },
        })
      );
    });
  });
});
