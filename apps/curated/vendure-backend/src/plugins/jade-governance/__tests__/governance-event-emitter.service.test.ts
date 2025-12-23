/**
 * Unit Tests: Governance Event Emitter Service
 * Sprint G4.3: Event-Driven Architecture
 */

import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GovernanceEventEmitterService } from '../services/governance-event-emitter.service';
import { GovernanceAuditService } from '../services/governance-audit.service';
import {
  GovernanceEventType,
  GovernanceEntityType,
  GovernanceAction,
  ActorType,
} from '../entities/governance-audit-log.entity';

describe('GovernanceEventEmitterService', () => {
  let service: GovernanceEventEmitterService;
  let auditService: GovernanceAuditService;
  let eventEmitter: EventEmitter2;

  const mockAuditService = {
    logEvent: jest.fn().mockResolvedValue(undefined),
    logEventSync: jest.fn().mockResolvedValue(undefined),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GovernanceEventEmitterService,
        { provide: GovernanceAuditService, useValue: mockAuditService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<GovernanceEventEmitterService>(GovernanceEventEmitterService);
    auditService = module.get<GovernanceAuditService>(GovernanceAuditService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('emit', () => {
    it('should create audit log entry', async () => {
      await service.emit(GovernanceEventType.SYSTEM_REGISTERED, {
        entityType: GovernanceEntityType.AI_SYSTEM,
        entityId: 'test-system',
        action: GovernanceAction.CREATE,
      });

      expect(auditService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: GovernanceEventType.SYSTEM_REGISTERED,
          entityType: GovernanceEntityType.AI_SYSTEM,
          entityId: 'test-system',
        })
      );
    });

    it('should emit to EventEmitter2', async () => {
      const payload = {
        entityType: GovernanceEntityType.AI_SYSTEM,
        entityId: 'test-system',
        action: GovernanceAction.CREATE,
      };

      await service.emit(GovernanceEventType.SYSTEM_REGISTERED, payload);

      expect(eventEmitter.emit).toHaveBeenCalledWith(
        GovernanceEventType.SYSTEM_REGISTERED,
        payload
      );
    });

    it('should call registered event handlers', async () => {
      const handler = jest.fn();
      service.on(GovernanceEventType.INCIDENT_CREATED, handler);

      const payload = {
        entityType: GovernanceEntityType.INCIDENT,
        entityId: 'incident-1',
        action: GovernanceAction.CREATE,
      };

      await service.emit(GovernanceEventType.INCIDENT_CREATED, payload);

      expect(handler).toHaveBeenCalledWith(payload);
    });

    it('should handle errors in event handlers gracefully', async () => {
      const errorHandler = jest.fn().mockRejectedValue(new Error('Handler error'));
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      service.on(GovernanceEventType.SYSTEM_UPDATED, errorHandler);

      await service.emit(GovernanceEventType.SYSTEM_UPDATED, {
        entityType: GovernanceEntityType.AI_SYSTEM,
        entityId: 'system-1',
        action: GovernanceAction.UPDATE,
      });

      expect(errorHandler).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error in event handler'),
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('emitCritical', () => {
    it('should use synchronous audit logging', async () => {
      await service.emitCritical(GovernanceEventType.OVERSIGHT_OVERRIDE_PERFORMED, {
        entityType: GovernanceEntityType.OVERSIGHT_ACTION,
        entityId: 'override-1',
        action: GovernanceAction.OVERRIDE,
      });

      expect(auditService.logEventSync).toHaveBeenCalled();
      expect(auditService.logEvent).not.toHaveBeenCalled();
    });

    it('should still emit to EventEmitter2', async () => {
      const payload = {
        entityType: GovernanceEntityType.INCIDENT,
        entityId: 'critical-incident',
        action: GovernanceAction.CREATE,
      };

      await service.emitCritical(GovernanceEventType.INCIDENT_CREATED, payload);

      expect(eventEmitter.emit).toHaveBeenCalledWith(
        GovernanceEventType.INCIDENT_CREATED,
        payload
      );
    });
  });

  describe('Event Handler Registration', () => {
    it('should register event handler with on()', () => {
      const handler = jest.fn();

      service.on(GovernanceEventType.SYSTEM_REGISTERED, handler);

      expect(service['eventHandlers'].get(GovernanceEventType.SYSTEM_REGISTERED)?.has(handler)).toBe(true);
    });

    it('should remove event handler with off()', () => {
      const handler = jest.fn();

      service.on(GovernanceEventType.SYSTEM_REGISTERED, handler);
      service.off(GovernanceEventType.SYSTEM_REGISTERED, handler);

      expect(service['eventHandlers'].get(GovernanceEventType.SYSTEM_REGISTERED)?.has(handler)).toBe(false);
    });

    it('should call one-time handler only once', async () => {
      const handler = jest.fn();

      service.once(GovernanceEventType.COMPLIANCE_ASSESSED, handler);

      // Emit twice
      await service.emit(GovernanceEventType.COMPLIANCE_ASSESSED, {
        entityType: GovernanceEntityType.COMPLIANCE_STATE,
        entityId: 'compliance-1',
        action: GovernanceAction.ASSESS,
      });

      await service.emit(GovernanceEventType.COMPLIANCE_ASSESSED, {
        entityType: GovernanceEntityType.COMPLIANCE_STATE,
        entityId: 'compliance-2',
        action: GovernanceAction.ASSESS,
      });

      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Convenience Methods', () => {
    it('should emit system registered event', async () => {
      await service.emitSystemRegistered('system-123', {
        systemName: 'Test Recommender',
        riskCategory: 'HIGH',
      });

      expect(auditService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: GovernanceEventType.SYSTEM_REGISTERED,
          entityId: 'system-123',
          action: GovernanceAction.CREATE,
        })
      );
    });

    it('should emit system updated event with before/after', async () => {
      const before = { riskCategory: 'LIMITED' };
      const after = { riskCategory: 'HIGH' };

      await service.emitSystemUpdated('system-123', before, after);

      expect(auditService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: GovernanceEventType.SYSTEM_UPDATED,
          before,
          after,
        })
      );
    });

    it('should emit compliance assessed event', async () => {
      await service.emitComplianceAssessed('system-123', 'ISO_42001_6.1.1', 'COMPLIANT');

      expect(auditService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: GovernanceEventType.COMPLIANCE_ASSESSED,
          entityId: 'system-123:ISO_42001_6.1.1',
          metadata: expect.objectContaining({
            complianceStatus: 'COMPLIANT',
          }),
        })
      );
    });

    it('should emit incident created as critical event', async () => {
      await service.emitIncidentCreated('incident-456', {
        severity: 'CRITICAL',
        affectedSystemId: 'system-123',
      });

      expect(auditService.logEventSync).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: GovernanceEventType.INCIDENT_CREATED,
          entityId: 'incident-456',
        })
      );
    });

    it('should emit incident workflow advanced', async () => {
      await service.emitIncidentWorkflowAdvanced('incident-456', 'DETECT', 'ASSESS');

      expect(auditService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: GovernanceEventType.INCIDENT_WORKFLOW_ADVANCED,
          before: { currentStep: 'DETECT' },
          after: { currentStep: 'ASSESS' },
        })
      );
    });

    it('should emit incident resolved', async () => {
      await service.emitIncidentResolved('incident-456', {
        resolvedAt: new Date(),
        lessonsLearned: 'Test lessons',
      });

      expect(auditService.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: GovernanceEventType.INCIDENT_RESOLVED,
        })
      );
    });

    it('should emit oversight action as critical', async () => {
      await service.emitOversightActionRecorded('action-789', {
        actionType: 'INTERVENTION',
        systemId: 'system-123',
      }, 'user-456');

      expect(auditService.logEventSync).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: GovernanceEventType.OVERSIGHT_ACTION_RECORDED,
          actorId: 'user-456',
          actorType: ActorType.HUMAN,
        })
      );
    });

    it('should emit oversight override as critical', async () => {
      const originalOutput = { recommendation: 'A' };
      const modifiedOutput = { recommendation: 'B' };

      await service.emitOversightOverride(
        'override-1',
        'system-123',
        originalOutput,
        modifiedOutput,
        'user-456',
        'Safety concern'
      );

      expect(auditService.logEventSync).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: GovernanceEventType.OVERSIGHT_OVERRIDE_PERFORMED,
          before: { output: originalOutput },
          after: { output: modifiedOutput },
          metadata: expect.objectContaining({
            justification: 'Safety concern',
          }),
        })
      );
    });

    it('should emit alert as critical', async () => {
      await service.emitAlert(
        GovernanceEventType.ALERT_COMPLIANCE_DEGRADED,
        'system-123',
        'HIGH',
        'Compliance dropped below 80%'
      );

      expect(auditService.logEventSync).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: GovernanceEventType.ALERT_COMPLIANCE_DEGRADED,
          metadata: expect.objectContaining({
            severity: 'HIGH',
            message: 'Compliance dropped below 80%',
          }),
        })
      );
    });
  });
});
