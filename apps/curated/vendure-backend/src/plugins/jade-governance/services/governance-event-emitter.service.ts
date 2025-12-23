/**
 * Governance Event Emitter Service
 *
 * Sprint G4.3: Event-driven architecture for governance observability
 *
 * Provides a centralized event emitter that:
 * - Emits governance events throughout the system
 * - Automatically creates audit logs
 * - Triggers alert rule evaluation
 * - Enables event-driven integrations
 */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GovernanceAuditService } from './governance-audit.service';
import {
  GovernanceEventType,
  GovernanceEntityType,
  GovernanceAction,
  ActorType,
  CreateAuditLogInput,
} from '../entities/governance-audit-log.entity';

/**
 * Event payload for governance events
 */
export interface GovernanceEventPayload {
  entityType: GovernanceEntityType;
  entityId: string;
  action: GovernanceAction;
  actorId?: string;
  actorType?: ActorType;
  before?: Record<string, any>;
  after?: Record<string, any>;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  requestId?: string;
}

/**
 * Event handler function signature
 */
export type GovernanceEventHandler = (payload: GovernanceEventPayload) => Promise<void> | void;

/**
 * Governance Event Emitter Service
 *
 * Central event bus for all governance operations
 */
@Injectable()
export class GovernanceEventEmitterService implements OnModuleInit {
  // Event listeners registry
  private readonly eventHandlers = new Map<GovernanceEventType, Set<GovernanceEventHandler>>();

  constructor(
    private eventEmitter: EventEmitter2,
    private auditService: GovernanceAuditService
  ) {}

  /**
   * Initialize event listeners
   */
  async onModuleInit(): Promise<void> {
    // Register default audit log handler for all events
    this.registerGlobalAuditHandler();
  }

  /**
   * Emit a governance event
   * Automatically creates audit log and triggers handlers
   */
  async emit(
    eventType: GovernanceEventType,
    payload: GovernanceEventPayload
  ): Promise<void> {
    // Create audit log entry (async, non-blocking)
    const auditInput: CreateAuditLogInput = {
      eventType,
      ...payload,
    };

    // Log asynchronously (batched)
    await this.auditService.logEvent(auditInput);

    // Emit event to EventEmitter2 for other handlers
    this.eventEmitter.emit(eventType, payload);

    // Call registered handlers
    const handlers = this.eventHandlers.get(eventType) || new Set();
    for (const handler of handlers) {
      try {
        await handler(payload);
      } catch (error) {
        console.error(`Error in event handler for ${eventType}:`, error);
      }
    }
  }

  /**
   * Emit a critical event that must be logged synchronously
   * Use sparingly for high-priority events
   */
  async emitCritical(
    eventType: GovernanceEventType,
    payload: GovernanceEventPayload
  ): Promise<void> {
    // Create audit log synchronously
    const auditInput: CreateAuditLogInput = {
      eventType,
      ...payload,
    };

    await this.auditService.logEventSync(auditInput);

    // Emit event
    this.eventEmitter.emit(eventType, payload);

    // Call registered handlers
    const handlers = this.eventHandlers.get(eventType) || new Set();
    for (const handler of handlers) {
      try {
        await handler(payload);
      } catch (error) {
        console.error(`Error in critical event handler for ${eventType}:`, error);
      }
    }
  }

  /**
   * Register an event handler
   */
  on(eventType: GovernanceEventType, handler: GovernanceEventHandler): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }

    this.eventHandlers.get(eventType)!.add(handler);
  }

  /**
   * Remove an event handler
   */
  off(eventType: GovernanceEventType, handler: GovernanceEventHandler): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  /**
   * Register a one-time event handler
   */
  once(eventType: GovernanceEventType, handler: GovernanceEventHandler): void {
    const wrappedHandler = async (payload: GovernanceEventPayload) => {
      await handler(payload);
      this.off(eventType, wrappedHandler);
    };

    this.on(eventType, wrappedHandler);
  }

  // =========================================================================
  // Convenience methods for common events
  // =========================================================================

  /**
   * Emit system registered event
   */
  async emitSystemRegistered(
    systemId: string,
    systemData: Record<string, any>,
    actorId?: string
  ): Promise<void> {
    await this.emit(GovernanceEventType.SYSTEM_REGISTERED, {
      entityType: GovernanceEntityType.AI_SYSTEM,
      entityId: systemId,
      action: GovernanceAction.CREATE,
      actorId,
      actorType: actorId ? ActorType.HUMAN : ActorType.SYSTEM,
      after: systemData,
      metadata: {
        riskCategory: systemData.riskCategory,
        systemType: systemData.systemType,
      },
    });
  }

  /**
   * Emit system updated event
   */
  async emitSystemUpdated(
    systemId: string,
    before: Record<string, any>,
    after: Record<string, any>,
    actorId?: string
  ): Promise<void> {
    await this.emit(GovernanceEventType.SYSTEM_UPDATED, {
      entityType: GovernanceEntityType.AI_SYSTEM,
      entityId: systemId,
      action: GovernanceAction.UPDATE,
      actorId,
      actorType: actorId ? ActorType.HUMAN : ActorType.SYSTEM,
      before,
      after,
      metadata: this.calculateChanges(before, after),
    });
  }

  /**
   * Emit compliance assessed event
   */
  async emitComplianceAssessed(
    systemId: string,
    requirementClause: string,
    status: string,
    actorId?: string
  ): Promise<void> {
    await this.emit(GovernanceEventType.COMPLIANCE_ASSESSED, {
      entityType: GovernanceEntityType.COMPLIANCE_STATE,
      entityId: `${systemId}:${requirementClause}`,
      action: GovernanceAction.ASSESS,
      actorId,
      actorType: actorId ? ActorType.HUMAN : ActorType.AUTOMATED,
      metadata: {
        systemId,
        requirementClause,
        complianceStatus: status,
      },
    });
  }

  /**
   * Emit incident created event (critical)
   */
  async emitIncidentCreated(
    incidentId: string,
    incidentData: Record<string, any>,
    actorId?: string
  ): Promise<void> {
    await this.emitCritical(GovernanceEventType.INCIDENT_CREATED, {
      entityType: GovernanceEntityType.INCIDENT,
      entityId: incidentId,
      action: GovernanceAction.CREATE,
      actorId,
      actorType: actorId ? ActorType.HUMAN : ActorType.SYSTEM,
      after: incidentData,
      metadata: {
        severity: incidentData.severity,
        affectedSystemId: incidentData.affectedSystemId,
      },
    });
  }

  /**
   * Emit incident workflow advanced event
   */
  async emitIncidentWorkflowAdvanced(
    incidentId: string,
    fromStep: string,
    toStep: string,
    actorId?: string
  ): Promise<void> {
    await this.emit(GovernanceEventType.INCIDENT_WORKFLOW_ADVANCED, {
      entityType: GovernanceEntityType.INCIDENT,
      entityId: incidentId,
      action: GovernanceAction.ADVANCE,
      actorId,
      actorType: actorId ? ActorType.HUMAN : ActorType.SYSTEM,
      before: { currentStep: fromStep },
      after: { currentStep: toStep },
      metadata: {
        fromStep,
        toStep,
      },
    });
  }

  /**
   * Emit incident resolved event
   */
  async emitIncidentResolved(
    incidentId: string,
    resolutionData: Record<string, any>,
    actorId?: string
  ): Promise<void> {
    await this.emit(GovernanceEventType.INCIDENT_RESOLVED, {
      entityType: GovernanceEntityType.INCIDENT,
      entityId: incidentId,
      action: GovernanceAction.RESOLVE,
      actorId,
      actorType: actorId ? ActorType.HUMAN : ActorType.SYSTEM,
      after: resolutionData,
      metadata: {
        resolvedAt: resolutionData.resolvedAt,
        lessonsLearned: resolutionData.lessonsLearned,
      },
    });
  }

  /**
   * Emit oversight action recorded event
   */
  async emitOversightActionRecorded(
    actionId: string,
    actionData: Record<string, any>,
    actorId: string
  ): Promise<void> {
    await this.emitCritical(GovernanceEventType.OVERSIGHT_ACTION_RECORDED, {
      entityType: GovernanceEntityType.OVERSIGHT_ACTION,
      entityId: actionId,
      action: GovernanceAction.CREATE,
      actorId,
      actorType: ActorType.HUMAN,
      after: actionData,
      metadata: {
        actionType: actionData.actionType,
        systemId: actionData.systemId,
        justification: actionData.justification,
      },
    });
  }

  /**
   * Emit oversight override event (critical)
   */
  async emitOversightOverride(
    actionId: string,
    systemId: string,
    originalOutput: Record<string, any>,
    modifiedOutput: Record<string, any>,
    actorId: string,
    justification: string
  ): Promise<void> {
    await this.emitCritical(GovernanceEventType.OVERSIGHT_OVERRIDE_PERFORMED, {
      entityType: GovernanceEntityType.OVERSIGHT_ACTION,
      entityId: actionId,
      action: GovernanceAction.OVERRIDE,
      actorId,
      actorType: ActorType.HUMAN,
      before: { output: originalOutput },
      after: { output: modifiedOutput },
      metadata: {
        systemId,
        justification,
        overrideType: 'output',
      },
    });
  }

  /**
   * Emit alert event (critical)
   */
  async emitAlert(
    alertType: GovernanceEventType,
    entityId: string,
    severity: string,
    message: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.emitCritical(alertType, {
      entityType: GovernanceEntityType.ALERT_RULE,
      entityId,
      action: GovernanceAction.ALERT,
      actorType: ActorType.AUTOMATED,
      metadata: {
        severity,
        message,
        ...metadata,
      },
    });
  }

  // =========================================================================
  // Private helper methods
  // =========================================================================

  /**
   * Register global audit handler
   * This ensures all events are audited by default
   */
  private registerGlobalAuditHandler(): void {
    // Already handled in emit() method by calling auditService.logEvent()
    // This method can be extended to add additional global handlers
  }

  /**
   * Calculate changes between before and after states
   */
  private calculateChanges(
    before: Record<string, any>,
    after: Record<string, any>
  ): Record<string, any> {
    const changes: Record<string, any> = {};

    // Find changed fields
    for (const key in after) {
      if (before[key] !== after[key]) {
        changes[key] = {
          from: before[key],
          to: after[key],
        };
      }
    }

    return { changes };
  }
}
