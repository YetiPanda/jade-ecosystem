/**
 * Messaging Resolvers
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.1: Messaging Backend - Tasks C.1.6, C.1.7
 *
 * GraphQL resolvers for conversations and messages
 */

import { messagingService } from '../../services/messaging.service';
import { ConversationStatus, ConversationContextType } from '../../entities/Conversation.entity';
import { SenderType } from '../../entities/Message.entity';

interface Context {
  user?: {
    id: string;
    role: string;
    vendorId?: string;
    spaId?: string;
  };
}

interface CreateConversationInput {
  vendorId: string;
  spaId: string;
  subject: string;
  contextType?: ConversationContextType;
  contextId?: string;
}

interface SendMessageInput {
  conversationId: string;
  content: string;
  attachments?: Array<{
    url: string;
    filename: string;
    fileType: string;
    fileSize: number;
  }>;
}

interface ConversationFilter {
  status?: ConversationStatus;
  contextType?: ConversationContextType;
  limit?: number;
  offset?: number;
}

interface MessageFilter {
  limit?: number;
  offset?: number;
  beforeTimestamp?: string;
}

/**
 * Get conversations for authenticated vendor
 * Task C.1.6
 */
export async function vendorConversations(
  _parent: any,
  args: { filter?: ConversationFilter },
  context: Context
) {
  console.log('[vendorConversations] Query called');

  // TODO: Re-enable authentication once auth is set up
  // if (!context.user) {
  //   throw new Error('Authentication required');
  // }

  const vendorId = context.user?.vendorId || context.user?.id || 'vendor-1';

  const conversations = await messagingService.getConversations({
    vendorId,
    status: args.filter?.status,
    contextType: args.filter?.contextType,
    limit: args.filter?.limit || 50,
    offset: args.filter?.offset || 0,
  });

  return conversations;
}

/**
 * Get a single conversation by ID
 */
export async function conversation(
  _parent: any,
  args: { id: string },
  context: Context
) {
  console.log('[conversation] Query called for ID:', args.id);

  const conversations = await messagingService.getConversations({
    limit: 1,
    offset: 0,
  });

  const conv = conversations.find((c) => c.id === args.id);

  if (!conv) {
    throw new Error(`Conversation ${args.id} not found`);
  }

  // Verify user has access to this conversation
  const userId = context.user?.id || 'vendor-1';
  if (conv.vendorId !== userId && conv.spaId !== userId) {
    throw new Error('You do not have access to this conversation');
  }

  return conv;
}

/**
 * Get messages for a conversation
 */
export async function conversationMessages(
  _parent: any,
  args: { conversationId: string; filter?: MessageFilter },
  context: Context
) {
  console.log('[conversationMessages] Query called for conversation:', args.conversationId);

  const messages = await messagingService.getMessages({
    conversationId: args.conversationId,
    limit: args.filter?.limit || 100,
    offset: args.filter?.offset || 0,
    beforeTimestamp: args.filter?.beforeTimestamp ? new Date(args.filter.beforeTimestamp) : undefined,
  });

  return messages;
}

/**
 * Get unread count for authenticated vendor
 */
export async function vendorUnreadCount(
  _parent: any,
  _args: any,
  context: Context
) {
  console.log('[vendorUnreadCount] Query called');

  const vendorId = context.user?.vendorId || context.user?.id || 'vendor-1';

  const count = await messagingService.getUnreadCount(SenderType.VENDOR, vendorId);

  return count;
}

/**
 * Create a new conversation
 */
export async function createConversation(
  _parent: any,
  args: { input: CreateConversationInput },
  context: Context
) {
  console.log('[createConversation] Mutation called');

  try {
    const conversation = await messagingService.createConversation(args.input);

    return {
      success: true,
      conversation,
      errors: [],
    };
  } catch (error: any) {
    console.error('[createConversation] Error:', error);
    return {
      success: false,
      conversation: null,
      errors: [
        {
          field: 'general',
          message: error.message,
          code: 'CREATION_FAILED',
        },
      ],
    };
  }
}

/**
 * Send a message in a conversation
 * Task C.1.7
 */
export async function sendMessage(
  _parent: any,
  args: { input: SendMessageInput },
  context: Context
) {
  console.log('[sendMessage] Mutation called');

  // TODO: Re-enable authentication once auth is set up
  // if (!context.user) {
  //   throw new Error('Authentication required');
  // }

  const userId = context.user?.id || 'vendor-1';
  const vendorId = context.user?.vendorId || context.user?.id || 'vendor-1';
  const userName = context.user?.['name'] || 'Vendor User';

  try {
    const message = await messagingService.sendMessage({
      conversationId: args.input.conversationId,
      senderType: SenderType.VENDOR,
      senderId: vendorId,
      senderName: userName,
      content: args.input.content,
      attachments: args.input.attachments || [],
    });

    return {
      success: true,
      message,
      errors: [],
    };
  } catch (error: any) {
    console.error('[sendMessage] Error:', error);
    return {
      success: false,
      message: null,
      errors: [
        {
          field: 'content',
          message: error.message,
          code: 'SEND_FAILED',
        },
      ],
    };
  }
}

/**
 * Mark messages as read
 */
export async function markConversationAsRead(
  _parent: any,
  args: { conversationId: string },
  context: Context
) {
  console.log('[markConversationAsRead] Mutation called');

  const vendorId = context.user?.vendorId || context.user?.id || 'vendor-1';

  await messagingService.markAsRead(args.conversationId, SenderType.VENDOR, vendorId);

  return true;
}

/**
 * Archive a conversation
 */
export async function archiveConversation(
  _parent: any,
  args: { conversationId: string },
  context: Context
) {
  console.log('[archiveConversation] Mutation called');

  await messagingService.archiveConversation(args.conversationId);

  return true;
}

/**
 * Flag a message for moderation
 */
export async function flagMessage(
  _parent: any,
  args: { messageId: string; reason: string },
  context: Context
) {
  console.log('[flagMessage] Mutation called');

  const userId = context.user?.id || 'system';

  await messagingService.flagMessage(args.messageId, args.reason, userId);

  return true;
}
