/**
 * Messaging Subscription Resolvers
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.1: Messaging Backend - Task C.1.9
 *
 * GraphQL subscription resolvers for real-time messaging
 */

import { messagingService } from '../../services/messaging.service';

/**
 * Subscribe to new messages in a conversation
 * Task C.1.9
 *
 * @example
 * subscription {
 *   messageReceived(conversationId: "conv-123") {
 *     id
 *     content
 *     senderName
 *     createdAt
 *   }
 * }
 */
export const messageReceived = {
  subscribe: (_parent: any, args: { conversationId: string }, context: any) => {
    console.log('[messageReceived] Subscription created for conversation:', args.conversationId);

    // Create async iterator from messaging service events
    return {
      [Symbol.asyncIterator]() {
        const eventQueue: any[] = [];
        let resolveNext: ((value: IteratorResult<any>) => void) | null = null;

        const handler = (data: { message: any; conversationId: string }) => {
          if (data.conversationId === args.conversationId) {
            const message = data.message;

            if (resolveNext) {
              resolveNext({ value: { messageReceived: message }, done: false });
              resolveNext = null;
            } else {
              eventQueue.push(message);
            }
          }
        };

        messagingService.on('messageSent', handler);

        return {
          async next() {
            if (eventQueue.length > 0) {
              const message = eventQueue.shift();
              return { value: { messageReceived: message }, done: false };
            }

            return new Promise<IteratorResult<any>>((resolve) => {
              resolveNext = resolve;
            });
          },

          async return() {
            messagingService.off('messageSent', handler);
            return { value: undefined, done: true };
          },

          async throw(error: any) {
            messagingService.off('messageSent', handler);
            return { value: undefined, done: true };
          },
        };
      },
    };
  },
};

/**
 * Subscribe to conversation updates
 *
 * @example
 * subscription {
 *   conversationUpdated(vendorId: "vendor-123") {
 *     id
 *     subject
 *     unreadCountVendor
 *     lastMessageAt
 *   }
 * }
 */
export const conversationUpdated = {
  subscribe: (_parent: any, args: { vendorId: string }, context: any) => {
    console.log('[conversationUpdated] Subscription created for vendor:', args.vendorId);

    return {
      [Symbol.asyncIterator]() {
        const eventQueue: any[] = [];
        let resolveNext: ((value: IteratorResult<any>) => void) | null = null;

        const handler = (conversation: any) => {
          if (conversation.vendorId === args.vendorId || conversation.spaId === args.vendorId) {
            if (resolveNext) {
              resolveNext({ value: { conversationUpdated: conversation }, done: false });
              resolveNext = null;
            } else {
              eventQueue.push(conversation);
            }
          }
        };

        messagingService.on('conversationCreated', handler);

        return {
          async next() {
            if (eventQueue.length > 0) {
              const conversation = eventQueue.shift();
              return { value: { conversationUpdated: conversation }, done: false };
            }

            return new Promise<IteratorResult<any>>((resolve) => {
              resolveNext = resolve;
            });
          },

          async return() {
            messagingService.off('conversationCreated', handler);
            return { value: undefined, done: true };
          },

          async throw(error: any) {
            messagingService.off('conversationCreated', handler);
            return { value: undefined, done: true };
          },
        };
      },
    };
  },
};

// Export subscription resolvers
export const messagingSubscriptionResolvers = {
  messageReceived,
  conversationUpdated,
};
