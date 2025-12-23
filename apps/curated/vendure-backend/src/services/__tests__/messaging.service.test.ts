/**
 * Messaging Service Tests
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.1: Messaging Backend - Task C.1.12
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { messagingService } from '../messaging.service';
import { AppDataSource } from '../../config/database';
import { ConversationStatus, ConversationContextType } from '../../entities/Conversation.entity';
import { SenderType } from '../../entities/Message.entity';

// Mock database
vi.mock('../../config/database', () => ({
  AppDataSource: {
    query: vi.fn(),
  },
}));

describe('MessagingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createConversation', () => {
    it('should create a new conversation', async () => {
      const mockConversation = {
        id: 'conv-123',
        vendor_id: 'vendor-1',
        spa_id: 'spa-1',
        subject: 'Question about Product X',
        context_type: null,
        context_id: null,
        status: ConversationStatus.ACTIVE,
        created_at: new Date(),
      };

      (AppDataSource.query as any)
        .mockResolvedValueOnce([]) // Check existing - none found
        .mockResolvedValueOnce([mockConversation]); // Create new

      const result = await messagingService.createConversation({
        vendorId: 'vendor-1',
        spaId: 'spa-1',
        subject: 'Question about Product X',
      });

      expect(result).toBeDefined();
      expect(result.id).toBe('conv-123');
      expect(AppDataSource.query).toHaveBeenCalledTimes(2);
    });

    it('should return existing conversation if already exists', async () => {
      const existingConversation = {
        id: 'conv-existing',
        vendor_id: 'vendor-1',
        spa_id: 'spa-1',
        subject: 'Existing conversation',
      };

      (AppDataSource.query as any).mockResolvedValueOnce([existingConversation]); // Found existing

      const result = await messagingService.createConversation({
        vendorId: 'vendor-1',
        spaId: 'spa-1',
        subject: 'New subject',
        contextType: ConversationContextType.ORDER,
        contextId: 'order-123',
      });

      expect(result.id).toBe('conv-existing');
      expect(AppDataSource.query).toHaveBeenCalledTimes(1); // Only check, no create
    });

    it('should create conversation with order context', async () => {
      const mockConversation = {
        id: 'conv-order',
        vendor_id: 'vendor-1',
        spa_id: 'spa-1',
        subject: 'Question about Order #123',
        context_type: ConversationContextType.ORDER,
        context_id: 'order-123',
      };

      (AppDataSource.query as any)
        .mockResolvedValueOnce([]) // Check existing
        .mockResolvedValueOnce([mockConversation]); // Create

      const result = await messagingService.createConversation({
        vendorId: 'vendor-1',
        spaId: 'spa-1',
        subject: 'Question about Order #123',
        contextType: ConversationContextType.ORDER,
        contextId: 'order-123',
      });

      expect(result.contextType).toBe(ConversationContextType.ORDER);
      expect(result.contextId).toBe('order-123');
    });

    it('should emit conversationCreated event', async () => {
      const mockConversation = {
        id: 'conv-new',
        vendor_id: 'vendor-1',
        spa_id: 'spa-1',
        subject: 'Test',
      };

      (AppDataSource.query as any)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([mockConversation]);

      const eventSpy = vi.fn();
      messagingService.on('conversationCreated', eventSpy);

      await messagingService.createConversation({
        vendorId: 'vendor-1',
        spaId: 'spa-1',
        subject: 'Test',
      });

      expect(eventSpy).toHaveBeenCalledWith(mockConversation);
    });
  });

  describe('sendMessage', () => {
    it('should send a message successfully', async () => {
      const mockMessage = {
        id: 'msg-123',
        conversation_id: 'conv-1',
        sender_type: SenderType.VENDOR,
        sender_id: 'vendor-1',
        sender_name: 'Vendor User',
        content: 'Hello, I have a question',
        created_at: new Date(),
      };

      (AppDataSource.query as any)
        .mockResolvedValueOnce([{ id: 'conv-1' }]) // Verify conversation exists
        .mockResolvedValueOnce([mockMessage]); // Insert message

      const result = await messagingService.sendMessage({
        conversationId: 'conv-1',
        senderType: SenderType.VENDOR,
        senderId: 'vendor-1',
        senderName: 'Vendor User',
        content: 'Hello, I have a question',
      });

      expect(result).toBeDefined();
      expect(result.id).toBe('msg-123');
      expect(result.content).toBe('Hello, I have a question');
    });

    it('should throw error if conversation not found', async () => {
      (AppDataSource.query as any).mockResolvedValueOnce([]); // Conversation not found

      await expect(
        messagingService.sendMessage({
          conversationId: 'conv-invalid',
          senderType: SenderType.VENDOR,
          senderId: 'vendor-1',
          senderName: 'Vendor User',
          content: 'Test',
        })
      ).rejects.toThrow('Conversation conv-invalid not found');
    });

    it('should send message with attachments', async () => {
      const attachments = [
        {
          url: 'https://s3.aws.com/file1.pdf',
          filename: 'invoice.pdf',
          fileType: 'application/pdf',
          fileSize: 12345,
        },
      ];

      const mockMessage = {
        id: 'msg-with-attachment',
        conversation_id: 'conv-1',
        attachments: JSON.stringify(attachments),
      };

      (AppDataSource.query as any)
        .mockResolvedValueOnce([{ id: 'conv-1' }])
        .mockResolvedValueOnce([mockMessage]);

      const result = await messagingService.sendMessage({
        conversationId: 'conv-1',
        senderType: SenderType.VENDOR,
        senderId: 'vendor-1',
        senderName: 'Vendor User',
        content: 'Please see attached invoice',
        attachments,
      });

      expect(result.id).toBe('msg-with-attachment');
    });

    it('should emit messageSent event', async () => {
      const mockMessage = {
        id: 'msg-event',
        conversation_id: 'conv-1',
        content: 'Test message',
      };

      (AppDataSource.query as any)
        .mockResolvedValueOnce([{ id: 'conv-1' }])
        .mockResolvedValueOnce([mockMessage]);

      const eventSpy = vi.fn();
      messagingService.on('messageSent', eventSpy);

      await messagingService.sendMessage({
        conversationId: 'conv-1',
        senderType: SenderType.VENDOR,
        senderId: 'vendor-1',
        senderName: 'Vendor User',
        content: 'Test message',
      });

      expect(eventSpy).toHaveBeenCalledWith({
        message: mockMessage,
        conversationId: 'conv-1',
      });
    });
  });

  describe('getConversations', () => {
    it('should get conversations for a vendor', async () => {
      const mockConversations = [
        { id: 'conv-1', vendor_id: 'vendor-1', spa_id: 'spa-1', subject: 'Conv 1' },
        { id: 'conv-2', vendor_id: 'vendor-1', spa_id: 'spa-2', subject: 'Conv 2' },
      ];

      (AppDataSource.query as any).mockResolvedValueOnce(mockConversations);

      const result = await messagingService.getConversations({
        vendorId: 'vendor-1',
        limit: 50,
        offset: 0,
      });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('conv-1');
    });

    it('should filter by status', async () => {
      const mockConversations = [
        { id: 'conv-active', status: ConversationStatus.ACTIVE },
      ];

      (AppDataSource.query as any).mockResolvedValueOnce(mockConversations);

      const result = await messagingService.getConversations({
        vendorId: 'vendor-1',
        status: ConversationStatus.ACTIVE,
      });

      expect(result).toHaveLength(1);
      expect(result[0].status).toBe(ConversationStatus.ACTIVE);
    });

    it('should filter by context type', async () => {
      const mockConversations = [
        { id: 'conv-order', context_type: ConversationContextType.ORDER },
      ];

      (AppDataSource.query as any).mockResolvedValueOnce(mockConversations);

      const result = await messagingService.getConversations({
        vendorId: 'vendor-1',
        contextType: ConversationContextType.ORDER,
      });

      expect(result).toHaveLength(1);
      expect(result[0].context_type).toBe(ConversationContextType.ORDER);
    });

    it('should handle pagination', async () => {
      const mockConversations = [
        { id: 'conv-21' },
        { id: 'conv-22' },
        { id: 'conv-23' },
      ];

      (AppDataSource.query as any).mockResolvedValueOnce(mockConversations);

      const result = await messagingService.getConversations({
        vendorId: 'vendor-1',
        limit: 20,
        offset: 20,
      });

      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT $2 OFFSET $3'),
        expect.arrayContaining(['vendor-1', 20, 20])
      );
    });
  });

  describe('getMessages', () => {
    it('should get messages for a conversation', async () => {
      const mockMessages = [
        { id: 'msg-1', content: 'First message', created_at: new Date('2025-01-01') },
        { id: 'msg-2', content: 'Second message', created_at: new Date('2025-01-02') },
      ];

      (AppDataSource.query as any).mockResolvedValueOnce(mockMessages);

      const result = await messagingService.getMessages({
        conversationId: 'conv-1',
      });

      expect(result).toHaveLength(2);
      // Should be reversed to chronological order (oldest first)
      expect(result[0].id).toBe('msg-2'); // Reversed from DESC query
    });

    it('should handle pagination', async () => {
      const mockMessages = [{ id: 'msg-101' }];

      (AppDataSource.query as any).mockResolvedValueOnce(mockMessages);

      await messagingService.getMessages({
        conversationId: 'conv-1',
        limit: 50,
        offset: 100,
      });

      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT $2 OFFSET $3'),
        expect.arrayContaining(['conv-1', 50, 100])
      );
    });

    it('should filter by beforeTimestamp', async () => {
      const beforeDate = new Date('2025-01-10');
      const mockMessages = [{ id: 'msg-old' }];

      (AppDataSource.query as any).mockResolvedValueOnce(mockMessages);

      await messagingService.getMessages({
        conversationId: 'conv-1',
        beforeTimestamp: beforeDate,
      });

      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('AND created_at < $2'),
        expect.arrayContaining(['conv-1', beforeDate])
      );
    });
  });

  describe('markAsRead', () => {
    it('should mark messages as read', async () => {
      const mockUnreadMessages = [{ id: 'msg-1' }, { id: 'msg-2' }];

      (AppDataSource.query as any)
        .mockResolvedValueOnce(mockUnreadMessages) // Get unread messages
        .mockResolvedValueOnce([]) // Insert read status for msg-1
        .mockResolvedValueOnce([]) // Insert read status for msg-2
        .mockResolvedValueOnce([]); // Update conversation unread count

      await messagingService.markAsRead('conv-1', SenderType.VENDOR, 'vendor-1');

      expect(AppDataSource.query).toHaveBeenCalledTimes(4);
    });

    it('should reset unread count for vendor', async () => {
      const mockUnreadMessages = [{ id: 'msg-1' }];

      (AppDataSource.query as any)
        .mockResolvedValueOnce(mockUnreadMessages)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      await messagingService.markAsRead('conv-1', SenderType.VENDOR, 'vendor-1');

      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE jade.conversation'),
        ['conv-1']
      );
    });

    it('should do nothing if no unread messages', async () => {
      (AppDataSource.query as any).mockResolvedValueOnce([]); // No unread messages

      await messagingService.markAsRead('conv-1', SenderType.VENDOR, 'vendor-1');

      expect(AppDataSource.query).toHaveBeenCalledTimes(1); // Only the check query
    });
  });

  describe('getUnreadCount', () => {
    it('should get unread count for vendor', async () => {
      (AppDataSource.query as any).mockResolvedValueOnce([{ total: '5' }]);

      const count = await messagingService.getUnreadCount(SenderType.VENDOR, 'vendor-1');

      expect(count).toBe(5);
    });

    it('should return 0 if no unread messages', async () => {
      (AppDataSource.query as any).mockResolvedValueOnce([{ total: null }]);

      const count = await messagingService.getUnreadCount(SenderType.VENDOR, 'vendor-1');

      expect(count).toBe(0);
    });
  });

  describe('archiveConversation', () => {
    it('should archive a conversation', async () => {
      (AppDataSource.query as any).mockResolvedValueOnce([]);

      await messagingService.archiveConversation('conv-1');

      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE jade.conversation'),
        [ConversationStatus.ARCHIVED, 'conv-1']
      );
    });
  });

  describe('flagMessage', () => {
    it('should flag a message for moderation', async () => {
      (AppDataSource.query as any).mockResolvedValueOnce([]);

      const eventSpy = vi.fn();
      messagingService.on('messageFlagged', eventSpy);

      await messagingService.flagMessage('msg-1', 'Spam content', 'admin-1');

      expect(AppDataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE jade.message'),
        expect.arrayContaining(['Spam content'])
      );

      expect(eventSpy).toHaveBeenCalledWith({
        messageId: 'msg-1',
        reason: 'Spam content',
        flaggedBy: 'admin-1',
      });
    });
  });
});
