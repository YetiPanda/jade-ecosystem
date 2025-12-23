/**
 * Governance Audit Service
 *
 * Sprint G4.2: Audit logging and trail management
 *
 * Provides centralized audit logging for all governance operations.
 * Supports querying, filtering, and analysis of audit trails.
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import {
  GovernanceAuditLog,
  GovernanceEventType,
  GovernanceEventCategory,
  GovernanceEntityType,
  GovernanceAction,
  ActorType,
  CreateAuditLogInput,
  getEventCategory,
} from '../entities/governance-audit-log.entity';

/**
 * Filters for querying audit logs
 */
export interface AuditLogFilters {
  eventTypes?: GovernanceEventType[];
  eventCategories?: GovernanceEventCategory[];
  entityType?: GovernanceEntityType;
  entityId?: string;
  actorId?: string;
  actorTypes?: ActorType[];
  actions?: GovernanceAction[];
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

/**
 * Audit trail summary for entity
 */
export interface AuditTrailSummary {
  entityType: GovernanceEntityType;
  entityId: string;
  totalEvents: number;
  firstEvent: Date;
  lastEvent: Date;
  uniqueActors: number;
  eventsByType: Record<string, number>;
  eventsByAction: Record<string, number>;
}

/**
 * Activity timeline entry
 */
export interface ActivityTimelineEntry {
  timestamp: Date;
  eventType: GovernanceEventType;
  action: GovernanceAction;
  actorId?: string;
  actorType: ActorType;
  description: string;
  metadata?: Record<string, any>;
}

/**
 * Governance Audit Service
 *
 * Thread-safe service for creating and querying audit logs
 */
@Injectable()
export class GovernanceAuditService {
  // Batch configuration
  private readonly BATCH_SIZE = 100;
  private readonly BATCH_INTERVAL_MS = 5000; // 5 seconds

  // In-memory batch queue
  private batchQueue: CreateAuditLogInput[] = [];
  private batchTimer: NodeJS.Timeout | null = null;

  constructor(
    @InjectRepository(GovernanceAuditLog)
    private auditLogRepository: Repository<GovernanceAuditLog>
  ) {
    // Start batch processor
    this.startBatchProcessor();
  }

  /**
   * Log a governance event
   * Adds to batch queue for async processing
   */
  async logEvent(input: CreateAuditLogInput): Promise<void> {
    // Add to batch queue
    this.batchQueue.push(input);

    // Flush if batch is full
    if (this.batchQueue.length >= this.BATCH_SIZE) {
      await this.flushBatch();
    }
  }

  /**
   * Log a governance event synchronously
   * Use for critical events that must be logged immediately
   */
  async logEventSync(input: CreateAuditLogInput): Promise<GovernanceAuditLog> {
    const auditLog = this.auditLogRepository.create({
      ...input,
      eventCategory: getEventCategory(input.eventType),
      actorType: input.actorType || ActorType.SYSTEM,
    });

    return this.auditLogRepository.save(auditLog);
  }

  /**
   * Query audit logs with filters
   */
  async queryLogs(filters: AuditLogFilters): Promise<GovernanceAuditLog[]> {
    const queryBuilder = this.auditLogRepository.createQueryBuilder('log');

    // Apply filters
    if (filters.eventTypes && filters.eventTypes.length > 0) {
      queryBuilder.andWhere('log.eventType IN (:...eventTypes)', {
        eventTypes: filters.eventTypes,
      });
    }

    if (filters.eventCategories && filters.eventCategories.length > 0) {
      queryBuilder.andWhere('log.eventCategory IN (:...eventCategories)', {
        eventCategories: filters.eventCategories,
      });
    }

    if (filters.entityType) {
      queryBuilder.andWhere('log.entityType = :entityType', {
        entityType: filters.entityType,
      });
    }

    if (filters.entityId) {
      queryBuilder.andWhere('log.entityId = :entityId', {
        entityId: filters.entityId,
      });
    }

    if (filters.actorId) {
      queryBuilder.andWhere('log.actorId = :actorId', {
        actorId: filters.actorId,
      });
    }

    if (filters.actorTypes && filters.actorTypes.length > 0) {
      queryBuilder.andWhere('log.actorType IN (:...actorTypes)', {
        actorTypes: filters.actorTypes,
      });
    }

    if (filters.actions && filters.actions.length > 0) {
      queryBuilder.andWhere('log.action IN (:...actions)', {
        actions: filters.actions,
      });
    }

    if (filters.startDate) {
      queryBuilder.andWhere('log.timestamp >= :startDate', {
        startDate: filters.startDate,
      });
    }

    if (filters.endDate) {
      queryBuilder.andWhere('log.timestamp <= :endDate', {
        endDate: filters.endDate,
      });
    }

    // Order by timestamp descending (newest first)
    queryBuilder.orderBy('log.timestamp', 'DESC');

    // Apply pagination
    if (filters.limit) {
      queryBuilder.limit(filters.limit);
    }

    if (filters.offset) {
      queryBuilder.offset(filters.offset);
    }

    return queryBuilder.getMany();
  }

  /**
   * Get audit trail for a specific entity
   */
  async getEntityAuditTrail(
    entityType: GovernanceEntityType,
    entityId: string,
    limit = 100
  ): Promise<GovernanceAuditLog[]> {
    return this.queryLogs({
      entityType,
      entityId,
      limit,
    });
  }

  /**
   * Get audit trail summary for an entity
   */
  async getEntityAuditSummary(
    entityType: GovernanceEntityType,
    entityId: string
  ): Promise<AuditTrailSummary> {
    const logs = await this.auditLogRepository.find({
      where: { entityType, entityId },
      order: { timestamp: 'ASC' },
    });

    if (logs.length === 0) {
      return {
        entityType,
        entityId,
        totalEvents: 0,
        firstEvent: new Date(),
        lastEvent: new Date(),
        uniqueActors: 0,
        eventsByType: {},
        eventsByAction: {},
      };
    }

    // Count events by type
    const eventsByType: Record<string, number> = {};
    const eventsByAction: Record<string, number> = {};
    const uniqueActors = new Set<string>();

    logs.forEach(log => {
      eventsByType[log.eventType] = (eventsByType[log.eventType] || 0) + 1;
      eventsByAction[log.action] = (eventsByAction[log.action] || 0) + 1;
      if (log.actorId) {
        uniqueActors.add(log.actorId);
      }
    });

    return {
      entityType,
      entityId,
      totalEvents: logs.length,
      firstEvent: logs[0].timestamp,
      lastEvent: logs[logs.length - 1].timestamp,
      uniqueActors: uniqueActors.size,
      eventsByType,
      eventsByAction,
    };
  }

  /**
   * Get activity timeline for an actor (user)
   */
  async getActorActivity(
    actorId: string,
    limit = 50
  ): Promise<ActivityTimelineEntry[]> {
    const logs = await this.queryLogs({
      actorId,
      limit,
    });

    return logs.map(log => ({
      timestamp: log.timestamp,
      eventType: log.eventType,
      action: log.action,
      actorId: log.actorId,
      actorType: log.actorType,
      description: this.formatEventDescription(log),
      metadata: log.metadata,
    }));
  }

  /**
   * Get recent audit events
   */
  async getRecentEvents(
    limit = 100,
    categories?: GovernanceEventCategory[]
  ): Promise<GovernanceAuditLog[]> {
    return this.queryLogs({
      eventCategories: categories,
      limit,
    });
  }

  /**
   * Count events by type within a time range
   */
  async countEventsByType(
    startDate: Date,
    endDate: Date
  ): Promise<Record<string, number>> {
    const logs = await this.queryLogs({
      startDate,
      endDate,
    });

    const counts: Record<string, number> = {};
    logs.forEach(log => {
      counts[log.eventType] = (counts[log.eventType] || 0) + 1;
    });

    return counts;
  }

  /**
   * Count specific event type since a start date
   * Used by alert evaluation service
   */
  async countEventsSince(
    eventType: string,
    startDate: Date
  ): Promise<number> {
    const logs = await this.queryLogs({
      eventTypes: [eventType as GovernanceEventType],
      startDate,
    });

    return logs.length;
  }

  /**
   * Count events by actor within a time range
   */
  async countEventsByActor(
    startDate: Date,
    endDate: Date
  ): Promise<Record<string, number>> {
    const logs = await this.queryLogs({
      startDate,
      endDate,
    });

    const counts: Record<string, number> = {};
    logs.forEach(log => {
      if (log.actorId) {
        counts[log.actorId] = (counts[log.actorId] || 0) + 1;
      }
    });

    return counts;
  }

  /**
   * Verify audit log integrity
   * Checks for gaps in sequence numbers
   */
  async verifyLogIntegrity(): Promise<{
    isValid: boolean;
    gaps: Array<{ from: number; to: number }>;
    totalRecords: number;
  }> {
    const logs = await this.auditLogRepository.find({
      order: { sequenceNumber: 'ASC' },
      select: ['sequenceNumber'],
    });

    if (logs.length === 0) {
      return { isValid: true, gaps: [], totalRecords: 0 };
    }

    const gaps: Array<{ from: number; to: number }> = [];
    for (let i = 1; i < logs.length; i++) {
      const expectedSeq = logs[i - 1].sequenceNumber + 1;
      const actualSeq = logs[i].sequenceNumber;

      if (actualSeq !== expectedSeq) {
        gaps.push({
          from: expectedSeq,
          to: actualSeq - 1,
        });
      }
    }

    return {
      isValid: gaps.length === 0,
      gaps,
      totalRecords: logs.length,
    };
  }

  /**
   * Private: Start batch processor
   */
  private startBatchProcessor(): void {
    this.batchTimer = setInterval(async () => {
      if (this.batchQueue.length > 0) {
        await this.flushBatch();
      }
    }, this.BATCH_INTERVAL_MS);
  }

  /**
   * Private: Flush batch queue to database
   */
  private async flushBatch(): Promise<void> {
    if (this.batchQueue.length === 0) return;

    // Take current batch
    const batch = [...this.batchQueue];
    this.batchQueue = [];

    try {
      // Create entities
      const auditLogs = batch.map(input =>
        this.auditLogRepository.create({
          ...input,
          eventCategory: getEventCategory(input.eventType),
          actorType: input.actorType || ActorType.SYSTEM,
        })
      );

      // Batch insert
      await this.auditLogRepository.save(auditLogs);
    } catch (error) {
      console.error('Failed to flush audit log batch:', error);
      // Re-queue failed items
      this.batchQueue.push(...batch);
    }
  }

  /**
   * Private: Format event description for timeline
   */
  private formatEventDescription(log: GovernanceAuditLog): string {
    const { eventType, action, entityType } = log;

    const descriptions: Record<string, string> = {
      [GovernanceEventType.SYSTEM_REGISTERED]: `Registered new ${entityType}`,
      [GovernanceEventType.SYSTEM_UPDATED]: `Updated ${entityType}`,
      [GovernanceEventType.INCIDENT_CREATED]: `Created new incident`,
      [GovernanceEventType.INCIDENT_RESOLVED]: `Resolved incident`,
      [GovernanceEventType.COMPLIANCE_ASSESSED]: `Performed compliance assessment`,
      [GovernanceEventType.OVERSIGHT_OVERRIDE_PERFORMED]: `Performed AI override`,
      // Add more as needed
    };

    return descriptions[eventType] || `${action} ${entityType}`;
  }

  /**
   * Cleanup method for graceful shutdown
   */
  async onModuleDestroy(): Promise<void> {
    // Clear timer
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }

    // Flush remaining batch
    await this.flushBatch();
  }
}
