/**
 * Email Notification Service
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.2: Messaging UI - Task C.2.11
 *
 * Sends email notifications for messaging events
 */

import { messagingService } from './messaging.service';

interface NotificationPreferences {
  emailEnabled: boolean;
  emailFrequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  muteUntil?: Date | null;
}

interface PendingNotification {
  userId: string;
  userType: 'vendor' | 'spa';
  conversationId: string;
  messageId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

/**
 * Email Notification Service
 *
 * Handles email notifications for messaging events based on user preferences:
 * - Immediate: Send email for each message
 * - Hourly: Batch messages and send hourly digest
 * - Daily: Send daily digest at 9 AM
 * - Weekly: Send weekly digest on Monday
 */
class EmailNotificationService {
  private pendingNotifications: Map<string, PendingNotification[]> = new Map();
  private hourlyInterval: NodeJS.Timeout | null = null;

  /**
   * Initialize email notification service
   */
  initialize(): void {
    console.log('[EmailNotificationService] Initializing...');

    // Listen for new messages
    messagingService.on('messageSent', ({ message, conversationId }) => {
      this.handleMessageSent(message, conversationId);
    });

    // Start hourly digest scheduler
    this.startHourlyDigestScheduler();

    console.log('[EmailNotificationService] Initialized');
  }

  /**
   * Handle new message event
   */
  private async handleMessageSent(message: any, conversationId: string): Promise<void> {
    console.log('[EmailNotificationService] New message:', message.id);

    // Don't send notifications for system messages
    if (message.isSystemMessage) {
      return;
    }

    // Determine recipient (opposite of sender)
    const recipientType = message.senderType === 'VENDOR' ? 'spa' : 'vendor';
    const recipientId = message.senderType === 'VENDOR' ? message.spaId : message.vendorId;

    // Get user notification preferences
    const preferences = await this.getUserPreferences(recipientId, recipientType);

    // Check if notifications are muted
    if (preferences.muteUntil && preferences.muteUntil > new Date()) {
      console.log('[EmailNotificationService] Notifications muted for user:', recipientId);
      return;
    }

    // Check if email notifications are enabled
    if (!preferences.emailEnabled) {
      console.log('[EmailNotificationService] Email notifications disabled for user:', recipientId);
      return;
    }

    // Handle based on frequency preference
    switch (preferences.emailFrequency) {
      case 'immediate':
        await this.sendImmediateEmail(recipientId, recipientType, message, conversationId);
        break;

      case 'hourly':
      case 'daily':
      case 'weekly':
        this.queueForDigest(recipientId, recipientType, message, conversationId);
        break;
    }
  }

  /**
   * Send immediate email notification
   */
  private async sendImmediateEmail(
    userId: string,
    userType: 'vendor' | 'spa',
    message: any,
    conversationId: string
  ): Promise<void> {
    console.log('[EmailNotificationService] Sending immediate email to:', userId);

    // Get user email
    const userEmail = await this.getUserEmail(userId, userType);
    if (!userEmail) {
      console.warn('[EmailNotificationService] No email found for user:', userId);
      return;
    }

    // Prepare email content
    const subject = `New message from ${message.senderName}`;
    const body = this.generateEmailTemplate({
      recipientName: await this.getUserName(userId, userType),
      senderName: message.senderName,
      messageContent: message.content,
      conversationUrl: this.getConversationUrl(conversationId, userType),
      isDigest: false,
    });

    // Send email (using Vendure email plugin)
    await this.sendEmail(userEmail, subject, body);
  }

  /**
   * Queue message for digest email
   */
  private queueForDigest(
    userId: string,
    userType: 'vendor' | 'spa',
    message: any,
    conversationId: string
  ): void {
    const key = `${userType}:${userId}`;

    if (!this.pendingNotifications.has(key)) {
      this.pendingNotifications.set(key, []);
    }

    this.pendingNotifications.get(key)!.push({
      userId,
      userType,
      conversationId,
      messageId: message.id,
      senderName: message.senderName,
      content: message.content,
      timestamp: new Date(message.createdAt),
    });

    console.log('[EmailNotificationService] Queued message for digest:', key);
  }

  /**
   * Start hourly digest scheduler
   */
  private startHourlyDigestScheduler(): void {
    // Run every hour
    this.hourlyInterval = setInterval(() => {
      this.sendHourlyDigests();
    }, 60 * 60 * 1000); // 1 hour

    console.log('[EmailNotificationService] Hourly digest scheduler started');
  }

  /**
   * Send hourly digests
   */
  private async sendHourlyDigests(): Promise<void> {
    console.log('[EmailNotificationService] Sending hourly digests...');

    for (const [key, notifications] of this.pendingNotifications.entries()) {
      if (notifications.length === 0) continue;

      const [userType, userId] = key.split(':') as ['vendor' | 'spa', string];

      // Get user preferences
      const preferences = await this.getUserPreferences(userId, userType);

      // Only send if user wants hourly digests
      if (preferences.emailFrequency !== 'hourly') continue;

      // Send digest
      await this.sendDigestEmail(userId, userType, notifications);

      // Clear pending notifications for this user
      this.pendingNotifications.delete(key);
    }
  }

  /**
   * Send digest email
   */
  private async sendDigestEmail(
    userId: string,
    userType: 'vendor' | 'spa',
    notifications: PendingNotification[]
  ): Promise<void> {
    console.log('[EmailNotificationService] Sending digest to:', userId, `(${notifications.length} messages)`);

    const userEmail = await this.getUserEmail(userId, userType);
    if (!userEmail) return;

    const subject = `You have ${notifications.length} new message${notifications.length > 1 ? 's' : ''}`;
    const body = this.generateDigestTemplate({
      recipientName: await this.getUserName(userId, userType),
      notifications,
      userType,
    });

    await this.sendEmail(userEmail, subject, body);
  }

  /**
   * Generate single message email template
   */
  private generateEmailTemplate(data: {
    recipientName: string;
    senderName: string;
    messageContent: string;
    conversationUrl: string;
    isDigest: boolean;
  }): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .message { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #4F46E5; }
          .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>JADE Marketplace</h1>
          </div>

          <div class="content">
            <p>Hi ${data.recipientName},</p>
            <p>You have a new message from <strong>${data.senderName}</strong>:</p>

            <div class="message">
              ${data.messageContent}
            </div>

            <a href="${data.conversationUrl}" class="button">View Conversation</a>
          </div>

          <div class="footer">
            <p>This is an automated notification from JADE Marketplace.</p>
            <p>To manage your notification preferences, visit your account settings.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate digest email template
   */
  private generateDigestTemplate(data: {
    recipientName: string;
    notifications: PendingNotification[];
    userType: 'vendor' | 'spa';
  }): string {
    const messagesList = data.notifications
      .map((n) => `
        <div class="message">
          <strong>${n.senderName}</strong> - ${n.timestamp.toLocaleString()}
          <p>${n.content.substring(0, 100)}${n.content.length > 100 ? '...' : ''}</p>
          <a href="${this.getConversationUrl(n.conversationId, data.userType)}">View Conversation</a>
        </div>
      `)
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; margin: 20px 0; }
          .message { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #4F46E5; }
          .button { display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; }
          .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>JADE Marketplace</h1>
            <p>Message Digest</p>
          </div>

          <div class="content">
            <p>Hi ${data.recipientName},</p>
            <p>You have <strong>${data.notifications.length} new message${data.notifications.length > 1 ? 's' : ''}</strong>:</p>

            ${messagesList}
          </div>

          <div class="footer">
            <p>This is an automated digest from JADE Marketplace.</p>
            <p>To manage your notification preferences, visit your account settings.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Get user notification preferences
   * TODO: Load from database (vendor_notification_preferences table)
   */
  private async getUserPreferences(
    userId: string,
    userType: 'vendor' | 'spa'
  ): Promise<NotificationPreferences> {
    // For now, return default preferences
    // In production, load from database
    return {
      emailEnabled: true,
      emailFrequency: 'immediate',
      muteUntil: null,
    };
  }

  /**
   * Get user email address
   * TODO: Load from database
   */
  private async getUserEmail(userId: string, userType: 'vendor' | 'spa'): Promise<string | null> {
    // TODO: Query from vendor/spa table
    return `${userType}-${userId}@example.com`;
  }

  /**
   * Get user name
   * TODO: Load from database
   */
  private async getUserName(userId: string, userType: 'vendor' | 'spa'): Promise<string> {
    // TODO: Query from vendor/spa table
    return `${userType.charAt(0).toUpperCase() + userType.slice(1)} User`;
  }

  /**
   * Get conversation URL
   */
  private getConversationUrl(conversationId: string, userType: 'vendor' | 'spa'): string {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:4004';
    return `${baseUrl}/app/${userType}/messages?conversation=${conversationId}`;
  }

  /**
   * Send email using Vendure email plugin
   * TODO: Integrate with @vendure/email-plugin
   */
  private async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log('[EmailNotificationService] Sending email:');
    console.log('  To:', to);
    console.log('  Subject:', subject);
    // console.log('  Body:', body); // Uncomment for debugging

    // TODO: Use Vendure email plugin
    // Example:
    // await this.emailPlugin.send({
    //   to,
    //   subject,
    //   body,
    //   templateName: 'messaging-notification',
    // });

    console.log('[EmailNotificationService] Email sent (stubbed)');
  }

  /**
   * Shutdown service
   */
  shutdown(): void {
    console.log('[EmailNotificationService] Shutting down...');

    if (this.hourlyInterval) {
      clearInterval(this.hourlyInterval);
      this.hourlyInterval = null;
    }

    this.pendingNotifications.clear();
  }
}

// Export singleton instance
export const emailNotificationService = new EmailNotificationService();
