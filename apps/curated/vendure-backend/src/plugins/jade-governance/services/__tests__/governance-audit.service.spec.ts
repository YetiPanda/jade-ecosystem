/**
 * Governance Audit Service Tests
 *
 * Sprint G4.9: Comprehensive observability tests
 *
 * Tests audit logging, batch processing, querying, and state tracking
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GovernanceAuditService } from '../governance-audit.service';
import {
  GovernanceAuditLog,
  GovernanceEventType,
  GovernanceEntityType,
  GovernanceAction,
  ActorType,
  CreateAuditLogInput,
} from '../../entities/governance-audit-log.entity';

describe('GovernanceAuditService', () => {
  let service: GovernanceAuditService;
  let repository: Repository<GovernanceAuditLog>;

  // Mock repository
  const mockRepository = {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
    findOne: vi.fn(),
    createQueryBuilder: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GovernanceAuditService,
        {
          provide: getRepositoryToken(GovernanceAuditLog),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GovernanceAuditService>(GovernanceAuditService);
    repository = module.get<Repository<GovernanceAuditLog>>(
      getRepositoryToken(GovernanceAuditLog)
    );

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('logEvent (async batch)', () => {
    it('should add event to batch queue', async () => {
      const input: CreateAuditLogInput = {
        eventType: GovernanceEventType.SYSTEM_REGISTERED,
        entityType: GovernanceEntityType.AI_SYSTEM,
        entityId: 'system-123',
        action: GovernanceAction.CREATE,
        actorId: 'user-123',
        actorType: ActorType.HUMAN,
        metadata: { description: 'Test system registration' },
        after: { systemName: 'Test System' },
      };

      await service.logEvent(input);

      // Should not save immediately (batched)
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should flush batch when size reaches 100 events', async () => {
      mockRepository.create.mockImplementation((input) => input);
      mockRepository.save.mockResolvedValue([]);

      // Add 100 events to trigger flush
      const promises = [];
      for (let i = 0; i < 100; i++) {
        promises.push(
          service.logEvent({
            eventType: GovernanceEventType.SYSTEM_REGISTERED,
            entityType: GovernanceEntityType.AI_SYSTEM,
            entityId: `system-${i}`,
            action: GovernanceAction.CREATE,
            actorId: 'user-123',
            actorType: ActorType.HUMAN,
          })
        );
      }

      await Promise.all(promises);

      // Should have flushed batch
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            eventType: GovernanceEventType.SYSTEM_REGISTERED,
            entityType: GovernanceEntityType.AI_SYSTEM,
          }),
        ])
      );
    });

    it('should flush batch on 5 second interval', async () => {
      vi.useFakeTimers();

      mockRepository.create.mockImplementation((input) => input);
      mockRepository.save.mockResolvedValue([]);

      // Add event
      await service.logEvent({
        eventType: GovernanceEventType.SYSTEM_REGISTERED,
        entityType: GovernanceEntityType.AI_SYSTEM,
        entityId: 'system-123',
        action: GovernanceAction.CREATE,
        actorId: 'user-123',
        actorType: ActorType.HUMAN,
      });

      // Fast-forward 5 seconds
      vi.advanceTimersByTime(5000);

      // Should have flushed
      await Promise.resolve(); // Allow async operations to complete
      expect(mockRepository.save).toHaveBeenCalled();

      vi.useRealTimers();
    });
  });

  describe('logEventSync (immediate)', () => {
    it('should save event immediately', async () => {
      const input: CreateAuditLogInput = {
        eventType: GovernanceEventType.INCIDENT_CREATED,
        entityType: GovernanceEntityType.INCIDENT,
        entityId: 'incident-123',
        action: GovernanceAction.CREATE,
        actorId: 'user-123',
        actorType: ActorType.HUMAN,
        metadata: {
          description: 'Critical incident created',
          severity: 'critical',
        },
        after: { title: 'Test Incident' },
      };

      const mockAuditLog = { id: 'audit-123', ...input };
      mockRepository.create.mockReturnValue(mockAuditLog);
      mockRepository.save.mockResolvedValue(mockAuditLog);

      const result = await service.logEventSync(input);

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: GovernanceEventType.INCIDENT_CREATED,
          entityType: GovernanceEntityType.INCIDENT,
          actorType: ActorType.HUMAN,
        })
      );
      expect(mockRepository.save).toHaveBeenCalledWith(mockAuditLog);
      expect(result).toEqual(mockAuditLog);
    });

    it('should default actorType to SYSTEM if not provided', async () => {
      const input: CreateAuditLogInput = {
        eventType: GovernanceEventType.SYSTEM_UPDATED,
        entityType: GovernanceEntityType.AI_SYSTEM,
        entityId: 'system-123',
        action: GovernanceAction.UPDATE,
      };

      const mockAuditLog = { id: 'audit-123', ...input };
      mockRepository.create.mockReturnValue(mockAuditLog);
      mockRepository.save.mockResolvedValue(mockAuditLog);

      await service.logEventSync(input);

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          actorType: ActorType.SYSTEM,
        })
      );
    });
  });

  describe('queryLogs', () => {
    it('should query logs with eventType filter', async () => {
      const mockQueryBuilder = {
        andWhere: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.queryLogs({
        eventTypes: [GovernanceEventType.SYSTEM_REGISTERED],
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'log.eventType IN (:...eventTypes)',
        { eventTypes: [GovernanceEventType.SYSTEM_REGISTERED] }
      );
    });

    it('should query logs with date range', async () => {
      const mockQueryBuilder = {
        andWhere: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-12-31');

      await service.queryLogs({ startDate, endDate });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'log.timestamp >= :startDate',
        { startDate }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'log.timestamp <= :endDate',
        { endDate }
      );
    });

    it('should query logs with actor filter', async () => {
      const mockQueryBuilder = {
        andWhere: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.queryLogs({
        actorId: 'user-123',
        actorTypes: [ActorType.HUMAN],
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'log.actorId = :actorId',
        { actorId: 'user-123' }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'log.actorType IN (:...actorTypes)',
        { actorTypes: [ActorType.HUMAN] }
      );
    });

    it('should apply pagination', async () => {
      const mockQueryBuilder = {
        andWhere: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue([]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.queryLogs({ limit: 50, offset: 100 });

      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(50);
      expect(mockQueryBuilder.offset).toHaveBeenCalledWith(100);
    });
  });

  describe('getEntityAuditTrail', () => {
    it('should retrieve audit trail for specific entity', async () => {
      const mockLogs = [
        {
          id: 'log-1',
          eventType: GovernanceEventType.SYSTEM_REGISTERED,
          entityType: GovernanceEntityType.AI_SYSTEM,
          entityId: 'system-123',
          timestamp: new Date(),
        },
        {
          id: 'log-2',
          eventType: GovernanceEventType.SYSTEM_UPDATED,
          entityType: GovernanceEntityType.AI_SYSTEM,
          entityId: 'system-123',
          timestamp: new Date(),
        },
      ];

      const mockQueryBuilder = {
        andWhere: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue(mockLogs),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getEntityAuditTrail(
        GovernanceEntityType.AI_SYSTEM,
        'system-123'
      );

      expect(result).toEqual(mockLogs);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'log.entityType = :entityType',
        { entityType: GovernanceEntityType.AI_SYSTEM }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'log.entityId = :entityId',
        { entityId: 'system-123' }
      );
    });
  });

  describe('getEntityAuditSummary', () => {
    it('should generate summary with event counts', async () => {
      const mockLogs = [
        {
          eventType: GovernanceEventType.SYSTEM_REGISTERED,
          action: GovernanceAction.CREATE,
          actorId: 'user-1',
          timestamp: new Date('2025-01-01'),
        },
        {
          eventType: GovernanceEventType.SYSTEM_UPDATED,
          action: GovernanceAction.UPDATE,
          actorId: 'user-1',
          timestamp: new Date('2025-01-02'),
        },
        {
          eventType: GovernanceEventType.SYSTEM_UPDATED,
          action: GovernanceAction.UPDATE,
          actorId: 'user-2',
          timestamp: new Date('2025-01-03'),
        },
      ];

      mockRepository.find.mockResolvedValue(mockLogs);

      const summary = await service.getEntityAuditSummary(
        GovernanceEntityType.AI_SYSTEM,
        'system-123'
      );

      expect(summary.totalEvents).toBe(3);
      expect(summary.uniqueActors).toBe(2);
      expect(summary.eventsByType).toEqual({
        'system.registered': 1,
        'system.updated': 2,
      });
      expect(summary.eventsByAction).toEqual({
        CREATE: 1,
        UPDATE: 2,
      });
    });

    it('should return empty summary for entity with no logs', async () => {
      mockRepository.find.mockResolvedValue([]);

      const summary = await service.getEntityAuditSummary(
        GovernanceEntityType.AI_SYSTEM,
        'nonexistent'
      );

      expect(summary.totalEvents).toBe(0);
      expect(summary.uniqueActors).toBe(0);
      expect(summary.eventsByType).toEqual({});
      expect(summary.eventsByAction).toEqual({});
    });
  });

  describe('countEventsSince', () => {
    it('should count events of specific type since date', async () => {
      const mockLogs = [
        { eventType: GovernanceEventType.INCIDENT_CREATED },
        { eventType: GovernanceEventType.INCIDENT_CREATED },
        { eventType: GovernanceEventType.INCIDENT_CREATED },
      ];

      const mockQueryBuilder = {
        andWhere: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        offset: vi.fn().mockReturnThis(),
        getMany: vi.fn().mockResolvedValue(mockLogs),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const startDate = new Date('2025-01-01');
      const count = await service.countEventsSince(
        GovernanceEventType.INCIDENT_CREATED,
        startDate
      );

      expect(count).toBe(3);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'log.eventType IN (:...eventTypes)',
        { eventTypes: [GovernanceEventType.INCIDENT_CREATED] }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'log.timestamp >= :startDate',
        { startDate }
      );
    });
  });

  describe('verifyLogIntegrity', () => {
    it('should detect no gaps in sequence numbers', async () => {
      const mockLogs = [
        { sequenceNumber: 1 },
        { sequenceNumber: 2 },
        { sequenceNumber: 3 },
        { sequenceNumber: 4 },
      ];

      mockRepository.find.mockResolvedValue(mockLogs);

      const result = await service.verifyLogIntegrity();

      expect(result.isValid).toBe(true);
      expect(result.gaps).toEqual([]);
      expect(result.totalRecords).toBe(4);
    });

    it('should detect gaps in sequence numbers', async () => {
      const mockLogs = [
        { sequenceNumber: 1 },
        { sequenceNumber: 2 },
        { sequenceNumber: 5 }, // Gap: 3, 4 missing
        { sequenceNumber: 6 },
        { sequenceNumber: 10 }, // Gap: 7, 8, 9 missing
      ];

      mockRepository.find.mockResolvedValue(mockLogs);

      const result = await service.verifyLogIntegrity();

      expect(result.isValid).toBe(false);
      expect(result.gaps).toEqual([
        { from: 3, to: 4 },
        { from: 7, to: 9 },
      ]);
      expect(result.totalRecords).toBe(5);
    });

    it('should handle empty log table', async () => {
      mockRepository.find.mockResolvedValue([]);

      const result = await service.verifyLogIntegrity();

      expect(result.isValid).toBe(true);
      expect(result.gaps).toEqual([]);
      expect(result.totalRecords).toBe(0);
    });
  });

  describe('State tracking', () => {
    it('should capture before state in UPDATE operations', async () => {
      const beforeState = { systemName: 'Old Name', riskCategory: 'low' };
      const afterState = { systemName: 'New Name', riskCategory: 'high' };

      const input: CreateAuditLogInput = {
        eventType: GovernanceEventType.SYSTEM_UPDATED,
        entityType: GovernanceEntityType.AI_SYSTEM,
        entityId: 'system-123',
        action: GovernanceAction.UPDATE,
        actorId: 'user-123',
        actorType: ActorType.HUMAN,
        before: beforeState,
        after: afterState,
      };

      const mockAuditLog = { id: 'audit-123', ...input };
      mockRepository.create.mockReturnValue(mockAuditLog);
      mockRepository.save.mockResolvedValue(mockAuditLog);

      const result = await service.logEventSync(input);

      expect(result.before).toEqual(beforeState);
      expect(result.after).toEqual(afterState);
    });

    it('should capture only after state in CREATE operations', async () => {
      const afterState = { systemName: 'New System', riskCategory: 'medium' };

      const input: CreateAuditLogInput = {
        eventType: GovernanceEventType.SYSTEM_REGISTERED,
        entityType: GovernanceEntityType.AI_SYSTEM,
        entityId: 'system-123',
        action: GovernanceAction.CREATE,
        actorId: 'user-123',
        actorType: ActorType.HUMAN,
        after: afterState,
      };

      const mockAuditLog = { id: 'audit-123', ...input };
      mockRepository.create.mockReturnValue(mockAuditLog);
      mockRepository.save.mockResolvedValue(mockAuditLog);

      const result = await service.logEventSync(input);

      expect(result.before).toBeUndefined();
      expect(result.after).toEqual(afterState);
    });
  });
});
