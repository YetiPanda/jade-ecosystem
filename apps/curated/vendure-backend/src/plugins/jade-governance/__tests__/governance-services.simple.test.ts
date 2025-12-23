/**
 * Simple Unit Tests: Governance Services (without NestJS testing module)
 * Sprint G4: Observability Infrastructure Validation
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { GovernanceAuditService } from '../services/governance-audit.service';
import {  GovernanceEventEmitterService } from '../services/governance-event-emitter.service';
import { GovernanceMetricsService } from '../services/governance-metrics.service';
import {
  GovernanceEventType,
  GovernanceEntityType,
  GovernanceAction,
} from '../entities/governance-audit-log.entity';

describe('Governance Services - Simple Tests', () => {
  describe('GovernanceAuditService - Batch Queue', () => {
    let service: GovernanceAuditService;
    let mockRepository: any;

    beforeEach(() => {
      mockRepository = {
        create: vi.fn((entity) => entity),
        save: vi.fn((entities) => Promise.resolve(entities)),
        createQueryBuilder: vi.fn(() => ({
          where: vi.fn().mockReturnThis(),
          andWhere: vi.fn().mockReturnThis(),
          orderBy: vi.fn().mockReturnThis(),
          skip: vi.fn().mockReturnThis(),
          take: vi.fn().mockReturnThis(),
          getMany: vi.fn().mockResolvedValue([]),
          getCount: vi.fn().mockResolvedValue(0),
        })),
        query: vi.fn().mockResolvedValue([]),
      };

      service = new GovernanceAuditService(mockRepository);
    });

    afterEach(async () => {
      await service.flushBatch();
    });

    it('should be instantiable', () => {
      expect(service).toBeDefined();
    });

    it('should add events to batch queue', async () => {
      await service.logEvent({
        eventType: GovernanceEventType.SYSTEM_REGISTERED,
        entityType: GovernanceEntityType.AI_SYSTEM,
        entityId: 'test-id',
        action: GovernanceAction.CREATE,
      });

      expect(service['batchQueue'].length).toBe(1);
    });

    it('should flush batch manually', async () => {
      await service.logEvent({
        eventType: GovernanceEventType.SYSTEM_UPDATED,
        entityType: GovernanceEntityType.AI_SYSTEM,
        entityId: 'system-1',
        action: GovernanceAction.UPDATE,
      });

      await service.flushBatch();

      expect(mockRepository.save).toHaveBeenCalled();
      expect(service['batchQueue'].length).toBe(0);
    });

    it('should support synchronous logging', async () => {
      await service.logEventSync({
        eventType: GovernanceEventType.INCIDENT_CREATED,
        entityType: GovernanceEntityType.INCIDENT,
        entityId: 'incident-1',
        action: GovernanceAction.CREATE,
      });

      expect(mockRepository.save).toHaveBeenCalled();
      expect(service['batchQueue'].length).toBe(0);
    });
  });

  describe('GovernanceEventEmitterService - Event Handling', () => {
    let service: GovernanceEventEmitterService;
    let mockAuditService: any;
    let mockEventEmitter: any;

    beforeEach(() => {
      mockAuditService = {
        logEvent: vi.fn().mockResolvedValue(undefined),
        logEventSync: vi.fn().mockResolvedValue(undefined),
      };

      mockEventEmitter = {
        emit: vi.fn(),
      };

      service = new GovernanceEventEmitterService(
        mockEventEmitter,
        mockAuditService
      );
    });

    it('should be instantiable', () => {
      expect(service).toBeDefined();
    });

    it('should emit events and create audit logs', async () => {
      await service.emit(GovernanceEventType.SYSTEM_REGISTERED, {
        entityType: GovernanceEntityType.AI_SYSTEM,
        entityId: 'test-system',
        action: GovernanceAction.CREATE,
      });

      expect(mockAuditService.logEvent).toHaveBeenCalled();
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        GovernanceEventType.SYSTEM_REGISTERED,
        expect.any(Object)
      );
    });

    it('should support critical events with sync logging', async () => {
      await service.emitCritical(GovernanceEventType.INCIDENT_CREATED, {
        entityType: GovernanceEntityType.INCIDENT,
        entityId: 'critical-incident',
        action: GovernanceAction.CREATE,
      });

      expect(mockAuditService.logEventSync).toHaveBeenCalled();
      expect(mockAuditService.logEvent).not.toHaveBeenCalled();
    });

    it('should register and call event handlers', async () => {
      const handler = vi.fn();
      service.on(GovernanceEventType.COMPLIANCE_ASSESSED, handler);

      await service.emit(GovernanceEventType.COMPLIANCE_ASSESSED, {
        entityType: GovernanceEntityType.COMPLIANCE_STATE,
        entityId: 'compliance-1',
        action: GovernanceAction.ASSESS,
      });

      expect(handler).toHaveBeenCalled();
    });

    it('should support one-time handlers', async () => {
      const handler = vi.fn();
      service.once(GovernanceEventType.SYSTEM_UPDATED, handler);

      // Emit twice
      await service.emit(GovernanceEventType.SYSTEM_UPDATED, {
        entityType: GovernanceEntityType.AI_SYSTEM,
        entityId: 'system-1',
        action: GovernanceAction.UPDATE,
      });

      await service.emit(GovernanceEventType.SYSTEM_UPDATED, {
        entityType: GovernanceEntityType.AI_SYSTEM,
        entityId: 'system-2',
        action: GovernanceAction.UPDATE,
      });

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('GovernanceMetricsService - Snapshot and Caching', () => {
    let service: GovernanceMetricsService;
    let mockRepositories: any;

    beforeEach(() => {
      mockRepositories = {
        system: {
          find: vi.fn(() => Promise.resolve([
            {
              id: 'system-1',
              riskCategory: 'HIGH',
              humanOversightLevel: 'IN_THE_LOOP',
              isActive: true,
              complianceStates: [
                { complianceStatus: 'COMPLIANT' },
              ],
              incidents: [],
            },
          ])),
        },
        incident: {
          find: vi.fn(() => Promise.resolve([
            {
              id: 'incident-1',
              severity: 'CRITICAL',
              currentStep: 'ASSESS',
              resolvedAt: null,
              detectedAt: new Date(),
            },
          ])),
        },
        compliance: {
          find: vi.fn(() => Promise.resolve([
            { complianceStatus: 'COMPLIANT' },
          ])),
        },
        oversight: {
          find: vi.fn(() => Promise.resolve([
            { actionType: 'OVERRIDE' },
          ])),
          count: vi.fn(() => Promise.resolve(0)),
        },
      };

      service = new GovernanceMetricsService(
        mockRepositories.system,
        mockRepositories.incident,
        mockRepositories.compliance,
        mockRepositories.oversight
      );
    });

    it('should be instantiable', () => {
      expect(service).toBeDefined();
    });

    it('should return comprehensive metrics snapshot', async () => {
      const snapshot = await service.getMetricsSnapshot();

      expect(snapshot).toHaveProperty('systemsTotal');
      expect(snapshot).toHaveProperty('incidentsOpen');
      expect(snapshot).toHaveProperty('averageCompliancePercentage');
      expect(snapshot).toHaveProperty('oversightActionsTotal');
      expect(snapshot).toHaveProperty('capturedAt');
      expect(snapshot.capturedAt).toBeInstanceOf(Date);
    });

    it('should cache metrics for 1 minute', async () => {
      const snapshot1 = await service.getMetricsSnapshot();
      const callCount1 = mockRepositories.system.find.mock.calls.length;

      const snapshot2 = await service.getMetricsSnapshot();
      const callCount2 = mockRepositories.system.find.mock.calls.length;

      // Should return same cached snapshot without additional DB calls
      expect(snapshot1.capturedAt).toEqual(snapshot2.capturedAt);
      expect(callCount1).toEqual(callCount2);
    });

    it('should force refresh when requested', async () => {
      await service.getMetricsSnapshot();
      const callCountAfterFirst = mockRepositories.system.find.mock.calls.length;

      await service.getMetricsSnapshot(true);
      const callCountAfterRefresh = mockRepositories.system.find.mock.calls.length;

      // Force refresh should make additional DB calls
      expect(callCountAfterRefresh).toBeGreaterThan(callCountAfterFirst);
    });

    it('should return executive summary', async () => {
      const summary = await service.getExecutiveSummary();

      expect(summary).toHaveProperty('systemsAtRisk');
      expect(summary).toHaveProperty('criticalIncidentsOpen');
      expect(summary).toHaveProperty('complianceScore');
      expect(summary).toHaveProperty('topRisks');
      expect(Array.isArray(summary.topRisks)).toBe(true);
    });

    it('should return SKA metrics placeholder', async () => {
      const skaMetrics = await service.getSKAAgenticMetrics();

      expect(skaMetrics.isEnabled).toBe(false);
      expect(skaMetrics.appreciatingAssetCount).toBe(0);
      expect(skaMetrics).toHaveProperty('networkEffectStrength');
      expect(skaMetrics).toHaveProperty('entropyLevel');
    });

    it('should return performance metrics placeholder', async () => {
      const perfMetrics = await service.getPerformanceMetrics();

      expect(perfMetrics.uptimePercentage).toBe(100);
      expect(perfMetrics.errorRate).toBe(0);
    });
  });

  describe('Integration - Event Flow', () => {
    it('should demonstrate complete event flow', async () => {
      const mockAuditRepo = {
        create: vi.fn((e) => e),
        save: vi.fn((e) => Promise.resolve(e)),
        createQueryBuilder: vi.fn(() => ({
          where: vi.fn().mockReturnThis(),
          andWhere: vi.fn().mockReturnThis(),
          orderBy: vi.fn().mockReturnThis(),
          getMany: vi.fn().mockResolvedValue([]),
        })),
      };

      const mockEventEmitter = {
        emit: vi.fn(),
      };

      const auditService = new GovernanceAuditService(mockAuditRepo);
      const eventEmitter = new GovernanceEventEmitterService(
        mockEventEmitter,
        auditService
      );

      // Register custom handler
      const customHandler = vi.fn();
      eventEmitter.on(GovernanceEventType.SYSTEM_REGISTERED, customHandler);

      // Emit event
      await eventEmitter.emitSystemRegistered('system-123', {
        systemName: 'Test System',
        riskCategory: 'HIGH',
      });

      // Verify flow
      expect(customHandler).toHaveBeenCalled();
      expect(mockEventEmitter.emit).toHaveBeenCalled();
      expect(auditService['batchQueue'].length).toBeGreaterThan(0);

      // Cleanup
      await auditService.flushBatch();
    });
  });
});
