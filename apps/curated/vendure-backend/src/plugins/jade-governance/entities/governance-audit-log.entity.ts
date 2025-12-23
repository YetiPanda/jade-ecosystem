/**
 * Governance Audit Log Entity
 *
 * Sprint G4.2: Comprehensive audit trail for all governance operations
 *
 * Tracks every action performed in the governance system for:
 * - ISO 42001 compliance (audit requirements)
 * - Forensic analysis
 * - Compliance reporting
 * - Pattern detection
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * Event categories for high-level classification
 */
export enum GovernanceEventCategory {
  SYSTEM = 'SYSTEM',           // AI system lifecycle events
  INCIDENT = 'INCIDENT',       // Incident management events
  COMPLIANCE = 'COMPLIANCE',   // Compliance assessment events
  OVERSIGHT = 'OVERSIGHT',     // Human oversight events
  ALERT = 'ALERT',             // Alert and notification events
}

/**
 * Entity types being audited
 */
export enum GovernanceEntityType {
  AI_SYSTEM = 'AISystem',
  INCIDENT = 'Incident',
  COMPLIANCE_STATE = 'ComplianceState',
  OVERSIGHT_ACTION = 'OversightAction',
  ALERT_RULE = 'AlertRule',
}

/**
 * Action types performed on entities
 */
export enum GovernanceAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ASSESS = 'ASSESS',
  RESOLVE = 'RESOLVE',
  ADVANCE = 'ADVANCE',
  OVERRIDE = 'OVERRIDE',
  ALERT = 'ALERT',
  NOTIFY = 'NOTIFY',
}

/**
 * Actor types - who/what performed the action
 */
export enum ActorType {
  HUMAN = 'HUMAN',           // Human user
  SYSTEM = 'SYSTEM',         // Automated system action
  AUTOMATED = 'AUTOMATED',   // Scheduled/automated task
  API = 'API',               // External API call
}

/**
 * Governance Event Types
 * Detailed classification of specific events
 */
export enum GovernanceEventType {
  // System Events
  SYSTEM_REGISTERED = 'system.registered',
  SYSTEM_UPDATED = 'system.updated',
  SYSTEM_DEACTIVATED = 'system.deactivated',
  SYSTEM_RISK_CHANGED = 'system.risk_changed',

  // Compliance Events
  COMPLIANCE_ASSESSED = 'compliance.assessed',
  COMPLIANCE_STATUS_CHANGED = 'compliance.status_changed',
  COMPLIANCE_GAP_IDENTIFIED = 'compliance.gap_identified',
  COMPLIANCE_BASELINE_CREATED = 'compliance.baseline_created',

  // Incident Events
  INCIDENT_CREATED = 'incident.created',
  INCIDENT_SEVERITY_CHANGED = 'incident.severity_changed',
  INCIDENT_WORKFLOW_ADVANCED = 'incident.workflow_advanced',
  INCIDENT_RESOLVED = 'incident.resolved',
  INCIDENT_SIMILAR_FOUND = 'incident.similar_found',
  INCIDENT_NOTIFICATION_SENT = 'incident.notification_sent',

  // Oversight Events
  OVERSIGHT_ACTION_RECORDED = 'oversight.action_recorded',
  OVERSIGHT_OVERRIDE_PERFORMED = 'oversight.override',
  OVERSIGHT_INTERVENTION_TRIGGERED = 'oversight.intervention',
  OVERSIGHT_SHUTDOWN_EXECUTED = 'oversight.shutdown',

  // Alert Events
  ALERT_CRITICAL_INCIDENT = 'alert.critical_incident',
  ALERT_COMPLIANCE_GAP = 'alert.compliance_gap',
  ALERT_HIGH_RISK_SYSTEM = 'alert.high_risk_system',
  ALERT_OVERSIGHT_PATTERN = 'alert.oversight_pattern',
}

/**
 * Governance Audit Log
 *
 * Immutable log of all governance operations
 */
@Entity({ schema: 'jade', name: 'governance_audit_log' })
@Index(['eventType', 'timestamp'])
@Index(['entityId', 'timestamp'])
@Index(['actorId', 'timestamp'])
@Index(['eventCategory', 'timestamp'])
@Index(['timestamp']) // For time-range queries
export class GovernanceAuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Detailed event type
   */
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    enum: GovernanceEventType,
  })
  eventType: GovernanceEventType;

  /**
   * High-level event category
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    enum: GovernanceEventCategory,
  })
  eventCategory: GovernanceEventCategory;

  /**
   * Type of entity being acted upon
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    enum: GovernanceEntityType,
  })
  entityType: GovernanceEntityType;

  /**
   * ID of the entity being acted upon
   */
  @Column({ type: 'uuid', nullable: false })
  entityId: string;

  /**
   * Action performed
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    enum: GovernanceAction,
  })
  action: GovernanceAction;

  /**
   * Who/what performed the action
   */
  @Column({ type: 'uuid', nullable: true })
  actorId?: string;

  /**
   * Type of actor
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    default: ActorType.SYSTEM,
    enum: ActorType,
  })
  actorType: ActorType;

  /**
   * State before the action (for UPDATE actions)
   * Stores the previous state of the entity
   */
  @Column({ type: 'jsonb', nullable: true })
  before?: Record<string, any>;

  /**
   * State after the action
   * Stores the new state of the entity
   */
  @Column({ type: 'jsonb', nullable: true })
  after?: Record<string, any>;

  /**
   * Additional context and metadata
   * Can include:
   * - Reason for action
   * - Related entities
   * - System context
   * - Custom fields
   */
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  /**
   * IP address of the request (for human actions)
   */
  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress?: string;

  /**
   * User agent string (for human actions)
   */
  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  /**
   * Session ID (for tracking user sessions)
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  sessionId?: string;

  /**
   * Request ID for correlation with application logs
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  requestId?: string;

  /**
   * Timestamp of the event
   * Automatically set on creation, immutable
   */
  @CreateDateColumn({ type: 'timestamptz' })
  timestamp: Date;

  /**
   * Sequence number for maintaining event order
   * Auto-incrementing within the table
   */
  @Column({ type: 'bigint', nullable: false, generated: 'increment' })
  sequenceNumber: number;
}

/**
 * Helper function to determine event category from event type
 */
export function getEventCategory(eventType: GovernanceEventType): GovernanceEventCategory {
  if (eventType.startsWith('system.')) return GovernanceEventCategory.SYSTEM;
  if (eventType.startsWith('compliance.')) return GovernanceEventCategory.COMPLIANCE;
  if (eventType.startsWith('incident.')) return GovernanceEventCategory.INCIDENT;
  if (eventType.startsWith('oversight.')) return GovernanceEventCategory.OVERSIGHT;
  if (eventType.startsWith('alert.')) return GovernanceEventCategory.ALERT;

  return GovernanceEventCategory.SYSTEM; // Default
}

/**
 * Helper to create audit log entry
 */
export interface CreateAuditLogInput {
  eventType: GovernanceEventType;
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
