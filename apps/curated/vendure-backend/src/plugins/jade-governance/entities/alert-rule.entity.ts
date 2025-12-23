/**
 * Alert Rule Entity
 *
 * Sprint G4.6: Alerting Rules Engine
 *
 * Defines automated alert rules that monitor governance metrics and events
 * to trigger notifications when thresholds are breached or patterns detected.
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '@vendure/core';
import { GovernanceAlert } from './governance-alert.entity';

/**
 * Alert Rule Type
 */
export enum AlertRuleType {
  /** Metric threshold rule (e.g., compliance < 80%) */
  METRIC_THRESHOLD = 'metric_threshold',

  /** Event pattern rule (e.g., 3 critical incidents in 24h) */
  EVENT_PATTERN = 'event_pattern',

  /** Composite rule (combines multiple conditions) */
  COMPOSITE = 'composite',
}

/**
 * Alert Severity Level
 */
export enum AlertSeverity {
  /** Informational - FYI only */
  INFO = 'info',

  /** Warning - needs attention */
  WARNING = 'warning',

  /** Critical - urgent action required */
  CRITICAL = 'critical',
}

/**
 * Comparison Operator
 */
export enum ComparisonOperator {
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  EQ = 'eq',
  NE = 'ne',
}

/**
 * Notification Channel
 */
export enum NotificationChannel {
  EMAIL = 'email',
  SLACK = 'slack',
  WEBHOOK = 'webhook',
  IN_APP = 'in_app',
}

/**
 * Alert Rule Condition
 */
export interface AlertRuleCondition {
  /** Metric name or event type to monitor */
  metric: string;

  /** Comparison operator */
  operator: ComparisonOperator;

  /** Threshold value */
  threshold: number | string;

  /** Time window in hours (for event patterns) */
  timeWindowHours?: number;
}

/**
 * Alert Rule Entity
 *
 * Defines automated monitoring rules for governance metrics and events
 */
@Entity({ schema: 'jade', name: 'alert_rules' })
export class AlertRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Rule name
   */
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  /**
   * Rule description
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Rule type
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    enum: AlertRuleType,
  })
  ruleType: AlertRuleType;

  /**
   * Alert severity
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    enum: AlertSeverity,
  })
  severity: AlertSeverity;

  /**
   * Rule condition (JSON)
   */
  @Column({ type: 'jsonb', nullable: false })
  condition: AlertRuleCondition;

  /**
   * Additional conditions for composite rules (JSON array)
   */
  @Column({ type: 'jsonb', nullable: true })
  additionalConditions?: AlertRuleCondition[];

  /**
   * Whether the rule is active
   */
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  /**
   * Notification channels (array)
   */
  @Column({ type: 'varchar', array: true, nullable: false })
  notificationChannels: NotificationChannel[];

  /**
   * Recipients (email addresses or user IDs)
   */
  @Column({ type: 'varchar', array: true, nullable: true })
  recipients?: string[];

  /**
   * Cooldown period in minutes (to prevent alert spam)
   */
  @Column({ type: 'int', default: 60 })
  cooldownMinutes: number;

  /**
   * Number of times this rule has triggered
   */
  @Column({ type: 'int', default: 0 })
  triggerCount: number;

  /**
   * Last time this rule triggered an alert
   */
  @Column({ type: 'timestamptz', nullable: true })
  lastTriggeredAt?: Date;

  /**
   * User who created this rule
   */
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy?: User;

  @Column({ type: 'uuid', nullable: true })
  createdById?: string;

  /**
   * Alerts triggered by this rule
   */
  @OneToMany(() => GovernanceAlert, (alert) => alert.rule)
  alerts: GovernanceAlert[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
