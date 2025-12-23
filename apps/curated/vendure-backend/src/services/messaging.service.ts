/**
 * Messaging Service
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.1: Messaging Backend - Task C.1.4
 *
 * Handles conversation and message operations
 */

import { EventEmitter } from 'events';
import { AppDataSource } from '../config/database';
import { Conversation, ConversationStatus, ConversationContextType } from '../entities/Conversation.entity';
import { Message, SenderType, ContentType, ModerationStatus } from '../entities/Message.entity';

export interface CreateConversationInput {
  vendorId: string;
  spaId: string;
  subject: string;
  contextType?: ConversationContextType;
  contextId?: string;
}

export interface SendMessageInput {
  conversationId: string;
  senderType: SenderType;
  senderId: string;
  senderName: string;
  content: string;
  attachments?: Array<{
    url: string;
    filename: string;
    fileType: string;
    fileSize: number;
  }>;
  isSystemMessage?: boolean;
}

export interface GetConversationsFilter {
  vendorId?: string;
  spaId?: string;
  status?: ConversationStatus;
  contextType?: ConversationContextType;
  limit?: number;
  offset?: number;
}

export interface GetMessagesFilter {
  conversationId: string;
  limit?: number;
  offset?: number;
  beforeTimestamp?: Date;
}

/**
 * MessagingService
 *
 * Provides CRUD operations for conversations and messages,
 * with real-time event emission for WebSocket integration
 */
class MessagingService extends EventEmitter {
  /**
   * Create a new conversation
   */
  async createConversation(input: CreateConversationInput): Promise<Conversation> {
    console.log('[MessagingService] Creating conversation:', input);

    const { vendorId, spaId, subject, contextType, contextId } = input;

    // Check if conversation already exists for this vendor-spa-context
    const existing = await AppDataSource.query(
      `
      SELECT * FROM jade.conversation
      WHERE vendor_id = $1
        AND spa_id = $2
        AND ($3::VARCHAR IS NULL OR context_type = $3)
        AND ($4::VARCHAR IS NULL OR context_id = $4)
      LIMIT 1
      `,
      [vendorId, spaId, contextType || null, contextId || null]
    );

    if (existing[0]) {
      console.log('[MessagingService] Conversation already exists:', existing[0].id);
      return existing[0] as Conversation;
    }

    // Create new conversation
    const result = await AppDataSource.query(
      `
      INSERT INTO jade.conversation (
        vendor_id, spa_id, subject, context_type, context_id, status
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [vendorId, spaId, subject, contextType || null, contextId || null, ConversationStatus.ACTIVE]
    );

    const conversation = result[0] as Conversation;

    // Emit event for real-time updates
    this.emit('conversationCreated', conversation);

    console.log('[MessagingService] Conversation created:', conversation.id);
    return conversation;
  }

  /**
   * Send a message in a conversation
   */
  async sendMessage(input: SendMessageInput): Promise<Message> {
    console.log('[MessagingService] Sending message:', {
      conversationId: input.conversationId,
      senderType: input.senderType,
    });

    const {
      conversationId,
      senderType,
      senderId,
      senderName,
      content,
      attachments = [],
      isSystemMessage = false,
    } = input;

    // Verify conversation exists
    const conversation = await AppDataSource.query(
      `SELECT id FROM jade.conversation WHERE id = $1`,
      [conversationId]
    );

    if (!conversation[0]) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    // Insert message
    const result = await AppDataSource.query(
      `
      INSERT INTO jade.message (
        conversation_id, sender_type, sender_id, sender_name,
        content, content_type, attachments, is_system_message, moderation_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
      `,
      [
        conversationId,
        senderType,
        senderId,
        senderName,
        content,
        ContentType.TEXT,
        JSON.stringify(attachments),
        isSystemMessage,
        ModerationStatus.APPROVED,
      ]
    );

    const message = result[0] as Message;

    // Emit event for real-time push (Task C.1.9)
    this.emit('messageSent', { message, conversationId });

    console.log('[MessagingService] Message sent:', message.id);
    return message;
  }

  /**
   * Get conversations for a vendor or spa
   */
  async getConversations(filter: GetConversationsFilter): Promise<Conversation[]> {
    const { vendorId, spaId, status, contextType, limit = 50, offset = 0 } = filter;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (vendorId) {
      conditions.push(`vendor_id = $${paramIndex}`);
      params.push(vendorId);
      paramIndex++;
    }

    if (spaId) {
      conditions.push(`spa_id = $${paramIndex}`);
      params.push(spaId);
      paramIndex++;
    }

    if (status) {
      conditions.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    if (contextType) {
      conditions.push(`context_type = $${paramIndex}`);
      params.push(contextType);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const conversations = await AppDataSource.query(
      `
      SELECT * FROM jade.conversation
      ${whereClause}
      ORDER BY last_message_at DESC NULLS LAST, created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `,
      [...params, limit, offset]
    );

    return conversations as Conversation[];
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(filter: GetMessagesFilter): Promise<Message[]> {
    const { conversationId, limit = 100, offset = 0, beforeTimestamp } = filter;

    const params: any[] = [conversationId];
    let paramIndex = 2;

    let timestampCondition = '';
    if (beforeTimestamp) {
      timestampCondition = `AND created_at < $${paramIndex}`;
      params.push(beforeTimestamp);
      paramIndex++;
    }

    const messages = await AppDataSource.query(
      `
      SELECT * FROM jade.message
      WHERE conversation_id = $1
      ${timestampCondition}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `,
      [...params, limit, offset]
    );

    // Return in chronological order (oldest first)
    return messages.reverse() as Message[];
  }

  /**
   * Mark messages as read (Task C.1.10)
   */
  async markAsRead(conversationId: string, readerType: SenderType, readerId: string): Promise<void> {
    console.log('[MessagingService] Marking messages as read:', {
      conversationId,
      readerType,
      readerId,
    });

    // Get all unread messages for this conversation from the OTHER party
    const messages = await AppDataSource.query(
      `
      SELECT m.id FROM jade.message m
      LEFT JOIN jade.message_read_status mrs ON m.id = mrs.message_id
        AND mrs.reader_type = $2
        AND mrs.reader_id = $3
      WHERE m.conversation_id = $1
        AND m.sender_type != $2
        AND (mrs.is_read IS NULL OR mrs.is_read = FALSE)
      `,
      [conversationId, readerType, readerId]
    );

    if (messages.length === 0) {
      console.log('[MessagingService] No unread messages to mark');
      return;
    }

    // Mark all as read
    for (const msg of messages) {
      await AppDataSource.query(
        `
        INSERT INTO jade.message_read_status (message_id, conversation_id, reader_type, reader_id, is_read, read_at)
        VALUES ($1, $2, $3, $4, TRUE, NOW())
        ON CONFLICT (message_id, reader_type, reader_id)
        DO UPDATE SET is_read = TRUE, read_at = NOW()
        `,
        [msg.id, conversationId, readerType, readerId]
      );
    }

    // Reset unread count for this participant
    const countColumn = readerType === SenderType.VENDOR ? 'unread_count_vendor' : 'unread_count_spa';
    await AppDataSource.query(
      `
      UPDATE jade.conversation
      SET ${countColumn} = 0
      WHERE id = $1
      `,
      [conversationId]
    );

    console.log('[MessagingService] Marked ${messages.length} messages as read');
  }

  /**
   * Get unread count for a vendor or spa (Task C.1.10)
   */
  async getUnreadCount(participantType: SenderType, participantId: string): Promise<number> {
    const countColumn =
      participantType === SenderType.VENDOR ? 'unread_count_vendor' : 'unread_count_spa';

    const result = await AppDataSource.query(
      `
      SELECT SUM(${countColumn}) as total
      FROM jade.conversation
      WHERE ${participantType === SenderType.VENDOR ? 'vendor_id' : 'spa_id'} = $1
        AND status = $2
      `,
      [participantId, ConversationStatus.ACTIVE]
    );

    return parseInt(result[0]?.total || '0', 10);
  }

  /**
   * Archive a conversation
   */
  async archiveConversation(conversationId: string): Promise<void> {
    await AppDataSource.query(
      `
      UPDATE jade.conversation
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      `,
      [ConversationStatus.ARCHIVED, conversationId]
    );

    console.log('[MessagingService] Conversation archived:', conversationId);
  }

  /**
   * Flag a message for moderation
   */
  async flagMessage(messageId: string, reason: string, flaggedBy: string): Promise<void> {
    await AppDataSource.query(
      `
      UPDATE jade.message
      SET is_flagged = TRUE,
          flagged_reason = $1,
          moderation_status = $2,
          updated_at = NOW()
      WHERE id = $3
      `,
      [reason, ModerationStatus.PENDING, messageId]
    );

    // Emit event for admin notification
    this.emit('messageFlagged', { messageId, reason, flaggedBy });

    console.log('[MessagingService] Message flagged for moderation:', messageId);
  }
}

// Export singleton instance
export const messagingService = new MessagingService();
