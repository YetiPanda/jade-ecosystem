/**
 * WebSocket Hook
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.2: Messaging UI - Task C.2.8
 *
 * Custom hook for WebSocket connection to real-time messaging
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  payload?: any;
}

interface UseWebSocketOptions {
  userId: string;
  userType: 'vendor' | 'spa' | 'admin';
  onMessageReceived?: (data: any) => void;
  onConversationUpdated?: (data: any) => void;
  onMessageFlagged?: (data: any) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
}

interface WebSocketHookReturn {
  isConnected: boolean;
  subscribe: (conversationId: string) => void;
  unsubscribe: (conversationId: string) => void;
  sendMessage: (message: WebSocketMessage) => void;
}

/**
 * Hook for WebSocket connection to messaging system
 * Task C.2.8
 *
 * @example
 * const { isConnected, subscribe, unsubscribe } = useWebSocket({
 *   userId: 'vendor-1',
 *   userType: 'vendor',
 *   onMessageReceived: (data) => {
 *     console.log('New message:', data.message);
 *     refetchMessages();
 *   },
 * });
 *
 * useEffect(() => {
 *   if (conversationId) {
 *     subscribe(conversationId);
 *     return () => unsubscribe(conversationId);
 *   }
 * }, [conversationId]);
 */
export function useWebSocket(options: UseWebSocketOptions): WebSocketHookReturn {
  const {
    userId,
    userType,
    onMessageReceived,
    onConversationUpdated,
    onMessageFlagged,
    autoReconnect = true,
    reconnectInterval = 5000,
  } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const subscribedConversationsRef = useRef<Set<string>>(new Set());

  /**
   * Connect to WebSocket server
   */
  const connect = useCallback(() => {
    // Determine WebSocket URL based on environment
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = import.meta.env.VITE_GRAPHQL_ENDPOINT?.replace(/^https?:\/\//, '').replace(/\/graphql$/, '') ||
                 window.location.host;
    const wsUrl = `${protocol}//${host}/graphql-ws?userId=${userId}&userType=${userType}`;

    console.log('[useWebSocket] Connecting to:', wsUrl);

    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('[useWebSocket] Connected');
        setIsConnected(true);

        // Resubscribe to conversations after reconnect
        subscribedConversationsRef.current.forEach((conversationId) => {
          ws.send(JSON.stringify({
            type: 'subscribe',
            payload: { conversationId },
          }));
        });
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('[useWebSocket] Message received:', message.type);

          switch (message.type) {
            case 'connection_ack':
              console.log('[useWebSocket] Connection acknowledged:', message.payload);
              break;

            case 'message_received':
              if (onMessageReceived) {
                onMessageReceived(message.payload);
              }
              break;

            case 'conversation_updated':
              if (onConversationUpdated) {
                onConversationUpdated(message.payload);
              }
              break;

            case 'message_flagged':
              if (onMessageFlagged) {
                onMessageFlagged(message.payload);
              }
              break;

            case 'pong':
              // Response to ping
              break;

            default:
              console.warn('[useWebSocket] Unknown message type:', message.type);
          }
        } catch (error) {
          console.error('[useWebSocket] Error parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('[useWebSocket] Error:', error);
      };

      ws.onclose = () => {
        console.log('[useWebSocket] Disconnected');
        setIsConnected(false);
        wsRef.current = null;

        // Auto-reconnect if enabled
        if (autoReconnect) {
          console.log(`[useWebSocket] Reconnecting in ${reconnectInterval}ms...`);
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('[useWebSocket] Connection error:', error);
      setIsConnected(false);
    }
  }, [userId, userType, autoReconnect, reconnectInterval, onMessageReceived, onConversationUpdated, onMessageFlagged]);

  /**
   * Subscribe to a conversation
   */
  const subscribe = useCallback((conversationId: string) => {
    console.log('[useWebSocket] Subscribing to:', conversationId);
    subscribedConversationsRef.current.add(conversationId);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'subscribe',
        payload: { conversationId },
      }));
    }
  }, []);

  /**
   * Unsubscribe from a conversation
   */
  const unsubscribe = useCallback((conversationId: string) => {
    console.log('[useWebSocket] Unsubscribing from:', conversationId);
    subscribedConversationsRef.current.delete(conversationId);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'unsubscribe',
        payload: { conversationId },
      }));
    }
  }, []);

  /**
   * Send a custom message to the WebSocket server
   */
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('[useWebSocket] Cannot send message - WebSocket not connected');
    }
  }, []);

  /**
   * Connect on mount, disconnect on unmount
   */
  useEffect(() => {
    connect();

    // Send ping every 30 seconds to keep connection alive
    const pingInterval = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);

    return () => {
      console.log('[useWebSocket] Cleaning up...');

      // Clear reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      // Clear ping interval
      clearInterval(pingInterval);

      // Close WebSocket
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      setIsConnected(false);
    };
  }, [connect]);

  return {
    isConnected,
    subscribe,
    unsubscribe,
    sendMessage,
  };
}
