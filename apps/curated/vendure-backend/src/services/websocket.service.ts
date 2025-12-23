/**
 * WebSocket Service
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.1: Messaging Backend - Tasks C.1.8, C.1.9
 *
 * Handles WebSocket connections for real-time messaging
 */

import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { messagingService } from './messaging.service';

interface WebSocketClient {
  ws: WebSocket;
  userId: string;
  userType: 'vendor' | 'spa' | 'admin';
  subscriptions: Set<string>; // Set of conversation IDs
}

/**
 * WebSocketService
 *
 * Manages WebSocket connections and pushes real-time updates
 */
class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, WebSocketClient> = new Map();

  /**
   * Initialize WebSocket server
   * Task C.1.8
   */
  initialize(server: Server): void {
    console.log('[WebSocketService] Initializing WebSocket server...');

    this.wss = new WebSocketServer({
      server,
      path: '/graphql-ws',
    });

    this.wss.on('connection', (ws: WebSocket, req: any) => {
      console.log('[WebSocketService] New WebSocket connection');

      // Extract user info from URL params or headers
      // In production, this should use JWT token validation
      const url = new URL(req.url || '', `http://${req.headers.host}`);
      const userId = url.searchParams.get('userId') || 'anonymous';
      const userType = (url.searchParams.get('userType') as 'vendor' | 'spa' | 'admin') || 'vendor';

      const clientId = `${userType}-${userId}-${Date.now()}`;

      const client: WebSocketClient = {
        ws,
        userId,
        userType,
        subscriptions: new Set(),
      };

      this.clients.set(clientId, client);

      console.log(`[WebSocketService] Client connected: ${clientId}`);

      // Handle incoming messages (subscription commands)
      ws.on('message', (data: string) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleClientMessage(clientId, message);
        } catch (error) {
          console.error('[WebSocketService] Error parsing message:', error);
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        console.log(`[WebSocketService] Client disconnected: ${clientId}`);
        this.clients.delete(clientId);
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error(`[WebSocketService] WebSocket error for ${clientId}:`, error);
      });

      // Send welcome message
      this.sendToClient(clientId, {
        type: 'connection_ack',
        payload: { clientId, userId, userType },
      });
    });

    // Listen to messaging service events for real-time push (Task C.1.9)
    this.setupMessageListeners();

    console.log('[WebSocketService] WebSocket server initialized on /graphql-ws');
  }

  /**
   * Set up listeners for messaging service events
   * Task C.1.9
   */
  private setupMessageListeners(): void {
    // Listen for new messages
    messagingService.on('messageSent', ({ message, conversationId }) => {
      console.log(`[WebSocketService] Broadcasting message to conversation: ${conversationId}`);
      this.broadcastToConversation(conversationId, {
        type: 'message_received',
        payload: { message, conversationId },
      });
    });

    // Listen for new conversations
    messagingService.on('conversationCreated', (conversation) => {
      console.log(`[WebSocketService] Broadcasting new conversation: ${conversation.id}`);

      // Notify both vendor and spa
      this.broadcastToUser(conversation.vendorId, 'vendor', {
        type: 'conversation_updated',
        payload: { conversation },
      });

      this.broadcastToUser(conversation.spaId, 'spa', {
        type: 'conversation_updated',
        payload: { conversation },
      });
    });

    // Listen for flagged messages
    messagingService.on('messageFlagged', ({ messageId, reason, flaggedBy }) => {
      console.log(`[WebSocketService] Message flagged: ${messageId}`);
      // Notify admins
      this.broadcastToUserType('admin', {
        type: 'message_flagged',
        payload: { messageId, reason, flaggedBy },
      });
    });
  }

  /**
   * Handle client messages (subscription commands)
   */
  private handleClientMessage(clientId: string, message: any): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    const { type, payload } = message;

    switch (type) {
      case 'subscribe':
        // Subscribe to a conversation
        if (payload.conversationId) {
          client.subscriptions.add(payload.conversationId);
          console.log(`[WebSocketService] Client ${clientId} subscribed to ${payload.conversationId}`);
        }
        break;

      case 'unsubscribe':
        // Unsubscribe from a conversation
        if (payload.conversationId) {
          client.subscriptions.delete(payload.conversationId);
          console.log(`[WebSocketService] Client ${clientId} unsubscribed from ${payload.conversationId}`);
        }
        break;

      case 'ping':
        // Respond to ping
        this.sendToClient(clientId, { type: 'pong' });
        break;

      default:
        console.warn(`[WebSocketService] Unknown message type: ${type}`);
    }
  }

  /**
   * Send message to a specific client
   */
  private sendToClient(clientId: string, message: any): void {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  /**
   * Broadcast message to all clients subscribed to a conversation
   */
  private broadcastToConversation(conversationId: string, message: any): void {
    let sentCount = 0;

    this.clients.forEach((client, clientId) => {
      if (client.subscriptions.has(conversationId) && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
        sentCount++;
      }
    });

    console.log(`[WebSocketService] Broadcast to ${sentCount} clients in conversation ${conversationId}`);
  }

  /**
   * Broadcast message to all connections for a specific user
   */
  private broadcastToUser(userId: string, userType: 'vendor' | 'spa' | 'admin', message: any): void {
    let sentCount = 0;

    this.clients.forEach((client, clientId) => {
      if (client.userId === userId && client.userType === userType && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
        sentCount++;
      }
    });

    console.log(`[WebSocketService] Broadcast to ${sentCount} clients for user ${userType}:${userId}`);
  }

  /**
   * Broadcast message to all users of a specific type
   */
  private broadcastToUserType(userType: 'vendor' | 'spa' | 'admin', message: any): void {
    let sentCount = 0;

    this.clients.forEach((client, clientId) => {
      if (client.userType === userType && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
        sentCount++;
      }
    });

    console.log(`[WebSocketService] Broadcast to ${sentCount} ${userType} clients`);
  }

  /**
   * Get connection stats
   */
  getStats(): { totalClients: number; byUserType: Record<string, number> } {
    const stats = {
      totalClients: this.clients.size,
      byUserType: { vendor: 0, spa: 0, admin: 0 },
    };

    this.clients.forEach((client) => {
      stats.byUserType[client.userType]++;
    });

    return stats;
  }

  /**
   * Shutdown WebSocket server
   */
  shutdown(): void {
    console.log('[WebSocketService] Shutting down WebSocket server...');

    this.clients.forEach((client, clientId) => {
      client.ws.close(1000, 'Server shutting down');
    });

    this.clients.clear();

    if (this.wss) {
      this.wss.close();
      this.wss = null;
    }

    console.log('[WebSocketService] WebSocket server shut down');
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();
