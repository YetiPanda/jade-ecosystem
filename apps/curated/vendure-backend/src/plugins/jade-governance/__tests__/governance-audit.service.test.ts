/**
 * Unit Tests: Governance Audit Service
 * Sprint G4.2: Audit Log System
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GovernanceAuditService } from '../services/governance-audit.service';
import {
  GovernanceAuditLog,
  GovernanceEventType,
  GovernanceEntityType,
  GovernanceAction,
  ActorType,
} from '../entities/governance-audit-log.entity';

describe('GovernanceAuditService', () => {
  let service: GovernanceAuditService;
  let repository: Repository<GovernanceAuditLog>;

  const mockRepository = {
    create: jest.fn((entity) => entity),
    save: jest.fn((entities) => Promise.resolve(entities)),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
      getCount: jest.fn().mockResolvedValue(0),
    })),
    query: jest.fn().mockResolvedValue([]),
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

    // Clear mocks
    jest.clearAllMocks();
  });

  afterEach(async () => {
    // Clear batch queue after each test
    await service.flushBatch();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logEvent', () => {
    it('should add event to batch queue', async () => {
      const input = {
        eventType: GovernanceEventType.SYSTEM_REGISTERED,
        entityType: GovernanceEntityType.AI_SYSTEM,
        entityId: 'test-system-id',
        action: GovernanceAction.CREATE,
      };

      await service.logEvent(input);

      // Batch queue should contain the event
      expect(service['batchQueue'].length).toBe(1);
      expect(service['batchQueue'][0]).toMatchObject(input);
    });

    it('should not flush immediately if batch size not reached', async () => {
      const saveSpy = jest.spyOn(repository, 'save');

      await service.logEvent({
        eventType: GovernanceEventType.SYSTEM_UPDATED,
        entityType: GovernanceEntityType.AI_SYSTEM,
        entityId: 'system-1',
        action: GovernanceAction.UPDATE,
      });

      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('should flush batch when size exceeds threshold (100 items)', async () => {
      const saveSpy = jest.spyOn(repository, 'save');

      // Fill batch queue to trigger flush
      for (let i = 0; i < 100; i++) {
        await service.logEvent({
          eventType: GovernanceEventType.SYSTEM_UPDATED,
          entityType: GovernanceEntityType.AI_SYSTEM,
          entityId: `system-${i}`,
          action: GovernanceAction.UPDATE,
        });
      }

      expect(saveSpy).toHaveBeenCalled();
      expect(service['batchQueue'].length).toBe(0);
    });
  });

  describe('logEventSync', () => {
    it('should save event immediately without batching', async () => {
      const saveSpy = jest.spyOn(repository, 'save');

      await service.logEventSync({
        eventType: GovernanceEventType.INCIDENT_CREATED,
        entityType: GovernanceEntityType.INCIDENT,
        entityId: 'incident-1',
        action: GovernanceAction.CREATE,
      });

      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(service['batchQueue'].length).toBe(0);
    });
  });

  describe('queryLogs', () => {
    it('should apply eventTypes filter', async () => {
      const qb = mockRepository.createQueryBuilder();

      await service.queryLogs({
        eventTypes: [GovernanceEventType.INCIDENT_CREATED],
      });

      expect(qb.where).toHaveBeenCalled();
    });

    it('should apply entityId filter', async () => {
      const qb = mockRepository.createQueryBuilder();

      await service.queryLogs({
        entityId: 'system-123',
      });

      expect(qb.andWhere).toHaveBeenCalled();
    });

    it('should apply actorId filter', async () => {
      const qb = mockRepository.createQueryBuilder();

      await service.queryLogs({
        actorId: 'user-456',
      });

      expect(qb.andWhere).toHaveBeenCalled();
    });

    it('should apply date range filter', async () => {
      const qb = mockRepository.createQueryBuilder();
      const startDate = new Date('2025-12-01');
      const endDate = new Date('2025-12-19');

      await service.queryLogs({
        startDate,
        endDate,
      });

      expect(qb.andWhere).toHaveBeenCalled();
    });

    it('should apply pagination', async () => {
      const qb = mockRepository.createQueryBuilder();

      await service.queryLogs({
        skip: 10,
        limit: 50,
      });

      expect(qb.skip).toHaveBeenCalledWith(10);
      expect(qb.take).toHaveBeenCalledWith(50);
    });

    it('should order by timestamp DESC', async () => {
      const qb = mockRepository.createQueryBuilder();

      await service.queryLogs({});

      expect(qb.orderBy).toHaveBeenCalledWith('log.timestamp', 'DESC');
    });
  });

  describe('flushBatch', () => {
    it('should save all events in batch queue', async () => {
      const saveSpy = jest.spyOn(repository, 'save');

      // Add events to queue
      await service.logEvent({
        eventType: GovernanceEventType.SYSTEM_REGISTERED,
        entityType: GovernanceEntityType.AI_SYSTEM,
        entityId: 'system-1',
        action: GovernanceAction.CREATE,
      });

      await service.logEvent({
        eventType: GovernanceEventType.SYSTEM_UPDATED,
        entityType: GovernanceEntityType.AI_SYSTEM,
        entityId: 'system-2',
        action: GovernanceAction.UPDATE,
      });

      // Flush manually
      await service.flushBatch();

      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ entityId: 'system-1' }),
        expect.objectContaining({ entityId: 'system-2' }),
      ]));
      expect(service['batchQueue'].length).toBe(0);
    });

    it('should handle empty batch queue gracefully', async () => {
      const saveSpy = jest.spyOn(repository, 'save');

      await service.flushBatch();

      expect(saveSpy).not.toHaveBeenCalled();
    });
  });

  describe('verifyLogIntegrity', () => {
    it('should detect gaps in sequence numbers', async () => {
      const mockLogs = [
        { sequenceNumber: 1 },
        { sequenceNumber: 2 },
        { sequenceNumber: 4 }, // Gap: missing 3
        { sequenceNumber: 5 },
      ];

      jest.spyOn(repository, 'query').mockResolvedValue(mockLogs);

      const result = await service.verifyLogIntegrity();

      expect(result.isValid).toBe(false);
      expect(result.gaps.length).toBeGreaterThan(0);
    });

    it('should return valid if no gaps', async () => {
      const mockLogs = [
        { sequenceNumber: 1 },
        { sequenceNumber: 2 },
        { sequenceNumber: 3 },
        { sequenceNumber: 4 },
      ];

      jest.spyOn(repository, 'query').mockResolvedValue(mockLogs);

      const result = await service.verifyLogIntegrity();

      expect(result.isValid).toBe(true);
      expect(result.gaps.length).toBe(0);
    });
  });

  describe('Batch Timer', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should flush batch after 5 seconds if size not reached', async () => {
      const saveSpy = jest.spyOn(repository, 'save');

      // Add one event (not enough to trigger size-based flush)
      await service.logEvent({
        eventType: GovernanceEventType.SYSTEM_REGISTERED,
        entityType: GovernanceEntityType.AI_SYSTEM,
        entityId: 'system-1',
        action: GovernanceAction.CREATE,
      });

      expect(saveSpy).not.toHaveBeenCalled();

      // Fast-forward 5 seconds
      jest.advanceTimersByTime(5000);

      // Wait for async flush
      await new Promise(resolve => setImmediate(resolve));

      expect(saveSpy).toHaveBeenCalled();
      expect(service['batchQueue'].length).toBe(0);
    });
  });
});
