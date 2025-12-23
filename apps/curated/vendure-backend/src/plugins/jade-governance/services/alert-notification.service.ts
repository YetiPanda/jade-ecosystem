/**
 * Alert Notification Service
 *
 * Sprint G4.6: Alerting Rules Engine
 *
 * Handles sending alert notifications through multiple channels:
 * - Email
 * - Slack
 * - Webhook
 * - In-app notifications
 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GovernanceAlert } from '../entities/governance-alert.entity';
import { AlertRule, NotificationChannel } from '../entities/alert-rule.entity';

/**
 * Notification delivery result
 */
export interface NotificationResult {
  channel: NotificationChannel;
  success: boolean;
  error?: string;
  messageId?: string;
}

/**
 * Notification payload for webhooks
 */
export interface WebhookPayload {
  alertId: string;
  ruleId: string;
  ruleName: string;
  severity: string;
  title: string;
  message: string;
  triggerValue: any;
  triggeredAt: string;
  metadata?: Record<string, any>;
}

/**
 * Service for sending alert notifications
 */
@Injectable()
export class AlertNotificationService {
  constructor(
    @InjectRepository(GovernanceAlert)
    private readonly alertRepository: Repository<GovernanceAlert>
  ) {}

  /**
   * Send notifications for a triggered alert
   *
   * @param alert - Alert to send notifications for
   * @returns Array of notification results
   */
  async sendNotifications(alert: GovernanceAlert): Promise<NotificationResult[]> {
    const rule = alert.rule;
    const channels = rule.notificationChannels || [];

    const results: NotificationResult[] = [];

    for (const channel of channels) {
      try {
        let result: NotificationResult;

        switch (channel) {
          case NotificationChannel.EMAIL:
            result = await this.sendEmailNotification(alert, rule);
            break;

          case NotificationChannel.SLACK:
            result = await this.sendSlackNotification(alert, rule);
            break;

          case NotificationChannel.WEBHOOK:
            result = await this.sendWebhookNotification(alert, rule);
            break;

          case NotificationChannel.IN_APP:
            result = await this.sendInAppNotification(alert, rule);
            break;

          default:
            result = {
              channel,
              success: false,
              error: `Unknown notification channel: ${channel}`,
            };
        }

        results.push(result);
      } catch (error) {
        results.push({
          channel,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Update alert with notification results
    await this.updateAlertNotifications(alert, results);

    return results;
  }

  /**
   * Send email notification
   *
   * @param alert - Alert to send
   * @param rule - Alert rule
   * @returns Notification result
   */
  private async sendEmailNotification(
    alert: GovernanceAlert,
    rule: AlertRule
  ): Promise<NotificationResult> {
    // TODO: Integrate with Vendure Email Plugin or external email service
    // For now, log to console

    const recipients = this.getEmailRecipients(rule);
    const subject = `[${alert.severity.toUpperCase()}] ${alert.title}`;
    const body = this.formatEmailBody(alert, rule);

    console.log('📧 EMAIL NOTIFICATION');
    console.log('To:', recipients.join(', '));
    console.log('Subject:', subject);
    console.log('Body:', body);
    console.log('---');

    // Simulate successful send
    return {
      channel: NotificationChannel.EMAIL,
      success: true,
      messageId: `email-${Date.now()}`,
    };
  }

  /**
   * Send Slack notification
   *
   * @param alert - Alert to send
   * @param rule - Alert rule
   * @returns Notification result
   */
  private async sendSlackNotification(
    alert: GovernanceAlert,
    rule: AlertRule
  ): Promise<NotificationResult> {
    // TODO: Integrate with Slack API
    // For now, log to console

    const slackMessage = this.formatSlackMessage(alert, rule);

    console.log('💬 SLACK NOTIFICATION');
    console.log(JSON.stringify(slackMessage, null, 2));
    console.log('---');

    // Simulate successful send
    return {
      channel: NotificationChannel.SLACK,
      success: true,
      messageId: `slack-${Date.now()}`,
    };
  }

  /**
   * Send webhook notification
   *
   * @param alert - Alert to send
   * @param rule - Alert rule
   * @returns Notification result
   */
  private async sendWebhookNotification(
    alert: GovernanceAlert,
    rule: AlertRule
  ): Promise<NotificationResult> {
    // TODO: Make HTTP POST request to webhook URL
    // For now, log to console

    const webhookUrl = this.getWebhookUrl(rule);
    const payload = this.formatWebhookPayload(alert, rule);

    console.log('🔔 WEBHOOK NOTIFICATION');
    console.log('URL:', webhookUrl);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('---');

    // Simulate successful send
    return {
      channel: NotificationChannel.WEBHOOK,
      success: true,
      messageId: `webhook-${Date.now()}`,
    };
  }

  /**
   * Send in-app notification
   *
   * @param alert - Alert to send
   * @param rule - Alert rule
   * @returns Notification result
   */
  private async sendInAppNotification(
    alert: GovernanceAlert,
    rule: AlertRule
  ): Promise<NotificationResult> {
    // TODO: Create in-app notification record
    // This would be stored in a notifications table and shown in UI
    // For now, log to console

    console.log('🔔 IN-APP NOTIFICATION');
    console.log('Alert ID:', alert.id);
    console.log('Title:', alert.title);
    console.log('Message:', alert.message);
    console.log('Severity:', alert.severity);
    console.log('---');

    // Simulate successful creation
    return {
      channel: NotificationChannel.IN_APP,
      success: true,
      messageId: `in-app-${Date.now()}`,
    };
  }

  /**
   * Get email recipients for a rule
   * TODO: Read from rule metadata or user preferences
   */
  private getEmailRecipients(rule: AlertRule): string[] {
    // Default recipients - should be configurable
    return ['governance-team@jade.ai'];
  }

  /**
   * Format email body
   */
  private formatEmailBody(alert: GovernanceAlert, rule: AlertRule): string {
    return `
Alert: ${alert.title}
Severity: ${alert.severity.toUpperCase()}
Triggered: ${alert.triggeredAt.toISOString()}

Message:
${alert.message}

Trigger Value:
${JSON.stringify(alert.triggerValue, null, 2)}

Rule Details:
- Name: ${rule.name}
- Type: ${rule.ruleType}
- Condition: ${JSON.stringify(rule.condition, null, 2)}

Alert ID: ${alert.id}
Rule ID: ${rule.id}

---
This is an automated message from JADE Governance System.
    `.trim();
  }

  /**
   * Format Slack message using Block Kit
   */
  private formatSlackMessage(alert: GovernanceAlert, rule: AlertRule): any {
    const severityEmoji = {
      info: 'ℹ️',
      warning: '⚠️',
      critical: '🚨',
    }[alert.severity] || '🔔';

    return {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${severityEmoji} ${alert.title}`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Severity:*\n${alert.severity.toUpperCase()}`,
            },
            {
              type: 'mrkdwn',
              text: `*Triggered:*\n${alert.triggeredAt.toISOString()}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Message:*\n${alert.message}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Trigger Value:*\n\`\`\`${JSON.stringify(alert.triggerValue, null, 2)}\`\`\``,
          },
        },
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: `Rule: ${rule.name} | Alert ID: ${alert.id}`,
            },
          ],
        },
      ],
    };
  }

  /**
   * Format webhook payload
   */
  private formatWebhookPayload(
    alert: GovernanceAlert,
    rule: AlertRule
  ): WebhookPayload {
    return {
      alertId: alert.id,
      ruleId: rule.id,
      ruleName: rule.name,
      severity: alert.severity,
      title: alert.title,
      message: alert.message,
      triggerValue: alert.triggerValue,
      triggeredAt: alert.triggeredAt.toISOString(),
      metadata: alert.metadata,
    };
  }

  /**
   * Get webhook URL for a rule
   * TODO: Read from rule metadata or configuration
   */
  private getWebhookUrl(rule: AlertRule): string {
    // Should be stored in rule metadata
    return 'https://hooks.example.com/governance-alerts';
  }

  /**
   * Update alert with notification delivery results
   */
  private async updateAlertNotifications(
    alert: GovernanceAlert,
    results: NotificationResult[]
  ): Promise<void> {
    const notificationsSent = results
      .filter(r => r.success)
      .map(r => `${r.channel}:${r.messageId}`);

    alert.notificationsSent = notificationsSent;
    await this.alertRepository.save(alert);
  }

  /**
   * Test notification channel
   * Useful for validating configuration
   */
  async testChannel(
    channel: NotificationChannel,
    testMessage: string
  ): Promise<NotificationResult> {
    const testAlert = {
      id: 'test-alert',
      title: 'Test Alert',
      message: testMessage,
      severity: 'info',
      triggeredAt: new Date(),
      triggerValue: { test: true },
      metadata: {},
      status: 'active',
      rule: {} as any,
      ruleId: 'test-rule',
      updatedAt: new Date(),
    } as GovernanceAlert;

    const testRule = {
      id: 'test-rule',
      name: 'Test Rule',
      ruleType: 'metric_threshold',
      severity: 'info',
      condition: { test: true } as any,
      isActive: true,
      cooldownMinutes: 60,
      triggerCount: 0,
      notificationChannels: [channel],
      alerts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as AlertRule;

    switch (channel) {
      case NotificationChannel.EMAIL:
        return this.sendEmailNotification(testAlert, testRule);
      case NotificationChannel.SLACK:
        return this.sendSlackNotification(testAlert, testRule);
      case NotificationChannel.WEBHOOK:
        return this.sendWebhookNotification(testAlert, testRule);
      case NotificationChannel.IN_APP:
        return this.sendInAppNotification(testAlert, testRule);
      default:
        return {
          channel,
          success: false,
          error: `Unknown channel: ${channel}`,
        };
    }
  }
}
