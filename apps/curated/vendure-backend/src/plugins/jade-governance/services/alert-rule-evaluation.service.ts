/**
 * Alert Rule Evaluation Service
 *
 * Sprint G4.6: Alerting Rules Engine
 *
 * Evaluates alert rules against current metrics and events.
 * Handles cooldown periods to prevent alert spam.
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { AlertRule, AlertRuleType, ComparisonOperator } from '../entities/alert-rule.entity';
import { GovernanceAlert, AlertStatus } from '../entities/governance-alert.entity';
import { GovernanceMetricsService } from './governance-metrics.service';
import { GovernanceAuditService } from './governance-audit.service';
import { ActorType } from '../entities/governance-audit-log.entity';

/**
 * Result of alert rule evaluation
 */
export interface AlertEvaluationResult {
  rule: AlertRule;
  triggered: boolean;
  triggerValue?: any;
  message?: string;
}

/**
 * Service for evaluating alert rules
 */
@Injectable()
export class AlertRuleEvaluationService {
  constructor(
    @InjectRepository(AlertRule)
    private readonly alertRuleRepository: Repository<AlertRule>,
    @InjectRepository(GovernanceAlert)
    private readonly alertRepository: Repository<GovernanceAlert>,
    private readonly metricsService: GovernanceMetricsService,
    private readonly auditService: GovernanceAuditService
  ) {}

  /**
   * Evaluate all active alert rules
   *
   * @returns Array of triggered alerts ready for notification
   */
  async evaluateAllRules(): Promise<GovernanceAlert[]> {
    // Get all active rules
    const activeRules = await this.alertRuleRepository.find({
      where: { isActive: true },
    });

    const triggeredAlerts: GovernanceAlert[] = [];

    for (const rule of activeRules) {
      // Check if rule is in cooldown period
      if (await this.isInCooldown(rule)) {
        continue;
      }

      // Evaluate rule based on type
      const result = await this.evaluateRule(rule);

      if (result.triggered) {
        // Create alert
        const alert = await this.createAlert(rule, result);
        triggeredAlerts.push(alert);
      }
    }

    return triggeredAlerts;
  }

  /**
   * Evaluate a specific alert rule
   *
   * @param rule - Alert rule to evaluate
   * @returns Evaluation result
   */
  async evaluateRule(rule: AlertRule): Promise<AlertEvaluationResult> {
    switch (rule.ruleType) {
      case AlertRuleType.METRIC_THRESHOLD:
        return this.evaluateMetricThreshold(rule);

      case AlertRuleType.EVENT_PATTERN:
        return this.evaluateEventPattern(rule);

      case AlertRuleType.COMPOSITE:
        return this.evaluateComposite(rule);

      default:
        throw new Error(`Unknown rule type: ${rule.ruleType}`);
    }
  }

  /**
   * Evaluate a metric threshold rule
   *
   * Example condition:
   * {
   *   metric: "systems_at_risk",
   *   operator: "GT",
   *   threshold: 5,
   *   timeWindowHours: 1
   * }
   */
  private async evaluateMetricThreshold(
    rule: AlertRule
  ): Promise<AlertEvaluationResult> {
    const condition = rule.condition;
    const metric = condition.metric;
    const operator = condition.operator;
    const threshold = condition.threshold;

    // Get current metric value
    const metricValue = await this.getMetricValue(metric);

    // Compare against threshold
    const triggered = this.compareValues(metricValue, operator, threshold);

    return {
      rule,
      triggered,
      triggerValue: metricValue,
      message: triggered
        ? `Metric "${metric}" is ${metricValue} (threshold: ${operator} ${threshold})`
        : undefined,
    };
  }

  /**
   * Evaluate an event pattern rule
   *
   * Example condition:
   * {
   *   eventType: "INCIDENT_DETECTED",
   *   operator: "GT",
   *   threshold: 10,
   *   timeWindowHours: 24
   * }
   */
  private async evaluateEventPattern(
    rule: AlertRule
  ): Promise<AlertEvaluationResult> {
    const condition = rule.condition;
    const eventType = condition.metric; // Using 'metric' field for event type
    const operator = condition.operator;
    const threshold = condition.threshold;
    const timeWindowHours = condition.timeWindowHours || 24;

    // Calculate time window
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - timeWindowHours);

    // Count events in time window
    const eventCount = await this.auditService.countEventsSince(
      eventType,
      startTime
    );

    // Compare against threshold
    const triggered = this.compareValues(eventCount, operator, threshold);

    return {
      rule,
      triggered,
      triggerValue: eventCount,
      message: triggered
        ? `Event "${eventType}" occurred ${eventCount} times in ${timeWindowHours}h (threshold: ${operator} ${threshold})`
        : undefined,
    };
  }

  /**
   * Evaluate a composite rule (combines multiple conditions)
   *
   * Example condition:
   * {
   *   rules: [
   *     { metric: "systems_at_risk", operator: "GT", threshold: 5 },
   *     { metric: "critical_incidents_open", operator: "GT", threshold: 2 }
   *   ],
   *   aggregation: "AND" // or "OR"
   * }
   */
  private async evaluateComposite(
    rule: AlertRule
  ): Promise<AlertEvaluationResult> {
    const condition = rule.condition as any;
    const subConditions = condition.rules || [];
    const aggregation = condition.aggregation || 'AND';

    const results: boolean[] = [];
    const triggerValues: any[] = [];

    for (const subCondition of subConditions) {
      // Create temporary rule for sub-condition
      const tempRule: AlertRule = {
        ...rule,
        ruleType: AlertRuleType.METRIC_THRESHOLD,
        condition: subCondition,
      };

      const result = await this.evaluateMetricThreshold(tempRule);
      results.push(result.triggered);
      triggerValues.push({
        metric: subCondition.metric,
        value: result.triggerValue,
      });
    }

    // Aggregate results
    const triggered =
      aggregation === 'AND'
        ? results.every((r) => r === true)
        : results.some((r) => r === true);

    return {
      rule,
      triggered,
      triggerValue: triggerValues,
      message: triggered
        ? `Composite rule triggered (${aggregation}): ${triggerValues.map((tv) => `${tv.metric}=${tv.value}`).join(', ')}`
        : undefined,
    };
  }

  /**
   * Get current value for a metric
   *
   * @param metric - Metric name
   * @returns Current metric value
   */
  private async getMetricValue(metric: string): Promise<number> {
    const snapshot = await this.metricsService.getMetricsSnapshot();

    // Map metric names to snapshot properties
    switch (metric) {
      case 'systems_total':
        return snapshot.systemsTotal;
      case 'systems_active':
        return snapshot.systemsActive;
      case 'systems_at_risk':
        return snapshot.systemsByRiskCategory.high;
      case 'incidents_total':
        return snapshot.incidentsTotal;
      case 'incidents_open':
        return snapshot.incidentsOpen;
      case 'critical_incidents_open':
        return snapshot.incidentsOpen; // Would need to filter by severity
      case 'compliance_percentage':
        return snapshot.averageCompliancePercentage;
      case 'oversight_actions_total':
        return snapshot.oversightActionsTotal;
      default:
        throw new Error(`Unknown metric: ${metric}`);
    }
  }

  /**
   * Compare two values using an operator
   *
   * @param value - Actual value
   * @param operator - Comparison operator
   * @param threshold - Threshold value
   * @returns True if comparison passes
   */
  private compareValues(
    value: number | string,
    operator: ComparisonOperator,
    threshold: number | string
  ): boolean {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    const numThreshold =
      typeof threshold === 'string' ? parseFloat(threshold) : threshold;

    switch (operator) {
      case ComparisonOperator.GT:
        return numValue > numThreshold;
      case ComparisonOperator.GTE:
        return numValue >= numThreshold;
      case ComparisonOperator.LT:
        return numValue < numThreshold;
      case ComparisonOperator.LTE:
        return numValue <= numThreshold;
      case ComparisonOperator.EQ:
        return numValue === numThreshold;
      case ComparisonOperator.NE:
        return numValue !== numThreshold;
      default:
        throw new Error(`Unknown operator: ${operator}`);
    }
  }

  /**
   * Check if rule is in cooldown period
   *
   * @param rule - Alert rule to check
   * @returns True if in cooldown
   */
  private async isInCooldown(rule: AlertRule): Promise<boolean> {
    const cooldownMinutes = rule.cooldownMinutes || 60;
    const cooldownStart = new Date();
    cooldownStart.setMinutes(cooldownStart.getMinutes() - cooldownMinutes);

    // Find most recent alert for this rule
    const recentAlert = await this.alertRepository.findOne({
      where: {
        ruleId: rule.id,
        triggeredAt: LessThan(cooldownStart) as any,
      },
      order: { triggeredAt: 'DESC' },
    });

    // If no recent alert, not in cooldown
    if (!recentAlert) {
      return false;
    }

    // Check if most recent alert was triggered within cooldown period
    const minutesSinceLastAlert =
      (new Date().getTime() - recentAlert.triggeredAt.getTime()) / 1000 / 60;

    return minutesSinceLastAlert < cooldownMinutes;
  }

  /**
   * Create a governance alert from evaluation result
   *
   * @param rule - Alert rule that triggered
   * @param result - Evaluation result
   * @returns Created alert
   */
  private async createAlert(
    rule: AlertRule,
    result: AlertEvaluationResult
  ): Promise<GovernanceAlert> {
    const alert = this.alertRepository.create({
      rule,
      ruleId: rule.id,
      severity: rule.severity,
      status: AlertStatus.ACTIVE,
      title: rule.name,
      message: result.message || 'Alert triggered',
      triggerValue: result.triggerValue,
      metadata: {
        ruleType: rule.ruleType,
        condition: rule.condition,
      },
    });

    return this.alertRepository.save(alert);
  }

  /**
   * Acknowledge an alert
   *
   * @param alertId - Alert ID
   * @param userId - User acknowledging the alert
   * @param notes - Acknowledgement notes
   */
  async acknowledgeAlert(
    alertId: string,
    userId: string,
    notes?: string
  ): Promise<GovernanceAlert> {
    const alert = await this.alertRepository.findOne({
      where: { id: alertId },
      relations: ['rule'],
    });

    if (!alert) {
      throw new Error(`Alert not found: ${alertId}`);
    }

    const previousState = { ...alert };

    alert.status = AlertStatus.ACKNOWLEDGED;
    alert.acknowledgedById = userId;
    alert.acknowledgedAt = new Date();
    alert.acknowledgementNotes = notes;

    const acknowledgedAlert = await this.alertRepository.save(alert);

    // G4.8: Log alert acknowledgement
    await this.auditService.logEvent({
      eventType: 'ALERT_ACKNOWLEDGED' as any,
      entityType: 'ALERT' as any,
      entityId: acknowledgedAlert.id,
      action: 'UPDATE' as any,
      actorId: userId,
      actorType: ActorType.HUMAN,
      metadata: {
        description: `Acknowledged alert: ${acknowledgedAlert.title}`,
        severity: acknowledgedAlert.severity,
        ruleId: acknowledgedAlert.ruleId,
        notes,
      },
      before: previousState,
      after: acknowledgedAlert,
    });

    return acknowledgedAlert;
  }

  /**
   * Resolve an alert
   *
   * @param alertId - Alert ID
   * @param userId - User resolving the alert
   * @param notes - Resolution notes
   */
  async resolveAlert(
    alertId: string,
    userId: string,
    notes?: string
  ): Promise<GovernanceAlert> {
    const alert = await this.alertRepository.findOne({
      where: { id: alertId },
      relations: ['rule'],
    });

    if (!alert) {
      throw new Error(`Alert not found: ${alertId}`);
    }

    const previousState = { ...alert };

    alert.status = AlertStatus.RESOLVED;
    alert.resolvedById = userId;
    alert.resolvedAt = new Date();
    alert.resolutionNotes = notes;

    const resolvedAlert = await this.alertRepository.save(alert);

    // G4.8: Log alert resolution
    await this.auditService.logEvent({
      eventType: 'ALERT_RESOLVED' as any,
      entityType: 'ALERT' as any,
      entityId: resolvedAlert.id,
      action: 'UPDATE' as any,
      actorId: userId,
      actorType: ActorType.HUMAN,
      metadata: {
        description: `Resolved alert: ${resolvedAlert.title}`,
        severity: resolvedAlert.severity,
        ruleId: resolvedAlert.ruleId,
        notes,
      },
      before: previousState,
      after: resolvedAlert,
    });

    return resolvedAlert;
  }

  /**
   * Mark an alert as false positive
   *
   * @param alertId - Alert ID
   * @param userId - User marking as false positive
   * @param notes - Explanation
   */
  async markFalsePositive(
    alertId: string,
    userId: string,
    notes?: string
  ): Promise<GovernanceAlert> {
    const alert = await this.alertRepository.findOne({
      where: { id: alertId },
      relations: ['rule'],
    });

    if (!alert) {
      throw new Error(`Alert not found: ${alertId}`);
    }

    const previousState = { ...alert };

    alert.status = AlertStatus.FALSE_POSITIVE;
    alert.resolvedById = userId;
    alert.resolvedAt = new Date();
    alert.resolutionNotes = notes;

    const updatedAlert = await this.alertRepository.save(alert);

    // G4.8: Log false positive marking
    await this.auditService.logEvent({
      eventType: 'ALERT_FALSE_POSITIVE' as any,
      entityType: 'ALERT' as any,
      entityId: updatedAlert.id,
      action: 'UPDATE' as any,
      actorId: userId,
      actorType: ActorType.HUMAN,
      metadata: {
        description: `Marked alert as false positive: ${updatedAlert.title}`,
        severity: updatedAlert.severity,
        ruleId: updatedAlert.ruleId,
        notes,
      },
      before: previousState,
      after: updatedAlert,
    });

    return updatedAlert;
  }

  /**
   * Get active alerts
   *
   * @param severity - Optional severity filter
   * @returns Array of active alerts
   */
  async getActiveAlerts(severity?: string): Promise<GovernanceAlert[]> {
    const where: any = {
      status: AlertStatus.ACTIVE,
    };

    if (severity) {
      where.severity = severity;
    }

    return this.alertRepository.find({
      where,
      relations: ['rule'],
      order: { triggeredAt: 'DESC' },
    });
  }

  /**
   * Get alert history
   *
   * @param limit - Maximum number of alerts to return
   * @returns Array of alerts
   */
  async getAlertHistory(limit: number = 100): Promise<GovernanceAlert[]> {
    return this.alertRepository.find({
      relations: ['rule', 'acknowledgedBy', 'resolvedBy'],
      order: { triggeredAt: 'DESC' },
      take: limit,
    });
  }
}
