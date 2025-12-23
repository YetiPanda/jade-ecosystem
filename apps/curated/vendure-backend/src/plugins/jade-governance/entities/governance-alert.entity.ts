/**
 * Governance Alert Entity
 *
 * Sprint G4.6: Alerting Rules Engine
 *
 * Stores triggered alerts from alert rules, including acknowledgement
 * and resolution tracking.
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@vendure/core';
import { AlertRule, AlertSeverity } from './alert-rule.entity';

/**
 * Alert Status
 */
export enum AlertStatus {
  /** Alert is active and unacknowledged */
  ACTIVE = 'active',

  /** Alert has been acknowledged but not resolved */
  ACKNOWLEDGED = 'acknowledged',

  /** Alert has been resolved */
  RESOLVED = 'resolved',

  /** Alert was a false positive */
  FALSE_POSITIVE = 'false_positive',
}

/**
 * Governance Alert Entity
 *
 * Represents a triggered alert from an alert rule
 */
@Entity({ schema: 'jade', name: 'governance_alerts' })
export class GovernanceAlert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Alert rule that triggered this alert
   */
  @ManyToOne(() => AlertRule, (rule) => rule.alerts, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'rule_id' })
  rule: AlertRule;

  @Column({ type: 'uuid', nullable: false })
  ruleId: string;

  /**
   * Alert severity (copied from rule at trigger time)
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    enum: AlertSeverity,
  })
  severity: AlertSeverity;

  /**
   * Alert status
   */
  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    enum: AlertStatus,
    default: AlertStatus.ACTIVE,
  })
  status: AlertStatus;

  /**
   * Alert title
   */
  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  /**
   * Alert message/description
   */
  @Column({ type: 'text', nullable: false })
  message: string;

  /**
   * Metric value that triggered the alert
   */
  @Column({ type: 'jsonb', nullable: true })
  triggerValue?: any;

  /**
   * Metadata about the alert context
   */
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  /**
   * When the alert was triggered
   */
  @CreateDateColumn({ type: 'timestamptz' })
  triggeredAt: Date;

  /**
   * User who acknowledged the alert
   */
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'acknowledged_by' })
  acknowledgedBy?: User;

  @Column({ type: 'uuid', nullable: true })
  acknowledgedById?: string;

  /**
   * When the alert was acknowledged
   */
  @Column({ type: 'timestamptz', nullable: true })
  acknowledgedAt?: Date;

  /**
   * Acknowledgement notes
   */
  @Column({ type: 'text', nullable: true })
  acknowledgementNotes?: string;

  /**
   * User who resolved the alert
   */
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'resolved_by' })
  resolvedBy?: User;

  @Column({ type: 'uuid', nullable: true })
  resolvedById?: string;

  /**
   * When the alert was resolved
   */
  @Column({ type: 'timestamptz', nullable: true })
  resolvedAt?: Date;

  /**
   * Resolution notes
   */
  @Column({ type: 'text', nullable: true })
  resolutionNotes?: string;

  /**
   * Notifications sent for this alert
   */
  @Column({ type: 'varchar', array: true, nullable: true })
  notificationsSent?: string[];

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
