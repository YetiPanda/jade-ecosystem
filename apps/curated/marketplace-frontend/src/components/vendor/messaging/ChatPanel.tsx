/**
 * Chat Panel Component
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.2: Messaging UI - Tasks C.2.3, C.2.5
 *
 * Main chat interface with messages and composer
 */

import React, { useEffect, useRef, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Loader2, MoreVertical, Archive, Flag, Wifi, WifiOff } from 'lucide-react';

import { Button } from '@jade/ui/components';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { MessageBubble } from './MessageBubble';
import { MessageComposer } from './MessageComposer';
import { useWebSocket } from '@/hooks/useWebSocket';
import {
  CONVERSATION_QUERY,
  CONVERSATION_MESSAGES_QUERY,
  MARK_CONVERSATION_AS_READ_MUTATION,
  ARCHIVE_CONVERSATION_MUTATION,
  FLAG_MESSAGE_MUTATION,
} from '@/graphql/queries/messaging';

interface Message {
  id: string;
  senderType: 'VENDOR' | 'SPA' | 'ADMIN';
  senderId: string;
  senderName: string;
  content: string;
  attachments?: any[];
  isSystemMessage?: boolean;
  isEdited?: boolean;
  isFlagged?: boolean;
  createdAt: string;
}

interface Conversation {
  id: string;
  vendorId: string;
  spaId: string;
  subject: string;
  status: string;
  contextType?: string;
  contextId?: string;
}

interface ChatPanelProps {
  conversationId: string;
  currentUserId: string;
  onArchive?: () => void;
}

/**
 * ChatPanel
 *
 * Full chat interface with:
 * - Message list with auto-scroll (Task C.2.5)
 * - Message composer
 * - Conversation header with actions
 * - Auto-mark as read
 */
export function ChatPanel({ conversationId, currentUserId, onArchive }: ChatPanelProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Fetch conversation details
  const { data: conversationData } = useQuery(CONVERSATION_QUERY, {
    variables: { id: conversationId },
  });

  // Fetch messages (no polling - using WebSocket for real-time updates)
  const {
    data: messagesData,
    loading: messagesLoading,
    refetch: refetchMessages,
  } = useQuery(CONVERSATION_MESSAGES_QUERY, {
    variables: {
      conversationId,
      filter: { limit: 100 },
    },
  });

  // WebSocket for real-time message updates (Task C.2.8)
  const { isConnected, subscribe, unsubscribe } = useWebSocket({
    userId: currentUserId,
    userType: 'vendor',
    onMessageReceived: (data) => {
      console.log('[ChatPanel] New message received via WebSocket:', data);
      if (data.conversationId === conversationId) {
        refetchMessages();
      }
    },
    onConversationUpdated: (data) => {
      console.log('[ChatPanel] Conversation updated via WebSocket:', data);
      // Refetch conversation details if needed
    },
  });

  // Subscribe to conversation when it changes
  useEffect(() => {
    if (conversationId && isConnected) {
      subscribe(conversationId);
      return () => unsubscribe(conversationId);
    }
  }, [conversationId, isConnected, subscribe, unsubscribe]);

  // Mark as read mutation
  const [markAsRead] = useMutation(MARK_CONVERSATION_AS_READ_MUTATION);

  // Archive conversation mutation
  const [archiveConversation] = useMutation(ARCHIVE_CONVERSATION_MUTATION, {
    onCompleted: () => {
      onArchive?.();
    },
  });

  // Flag message mutation
  const [flagMessage] = useMutation(FLAG_MESSAGE_MUTATION);

  const conversation: Conversation | undefined = conversationData?.conversation;
  const messages: Message[] = messagesData?.conversationMessages || [];

  // Auto-scroll to bottom when new messages arrive (Task C.2.5)
  useEffect(() => {
    if (shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, shouldAutoScroll]);

  // Mark conversation as read when opened
  useEffect(() => {
    if (conversationId) {
      markAsRead({
        variables: { conversationId },
      });
    }
  }, [conversationId, markAsRead]);

  // Handle scroll to detect if user is at bottom
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setShouldAutoScroll(isAtBottom);
  };

  const handleMessageSent = () => {
    refetchMessages();
    setShouldAutoScroll(true);
  };

  const handleArchive = () => {
    archiveConversation({
      variables: { conversationId },
    });
  };

  const handleFlagMessage = (messageId: string) => {
    const reason = prompt('Please provide a reason for flagging this message:');
    if (reason) {
      flagMessage({
        variables: { messageId, reason },
      });
    }
  };

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">{conversation.subject}</h2>
            {/* WebSocket Connection Status */}
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-600" title="Real-time updates active" />
            ) : (
              <WifiOff className="h-4 w-4 text-gray-400" title="Reconnecting..." />
            )}
          </div>
          {conversation.contextType && (
            <p className="text-xs text-muted-foreground">
              {conversation.contextType}
              {conversation.contextId && ` - ${conversation.contextId}`}
            </p>
          )}
        </div>

        {/* Actions Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleArchive}>
              <Archive className="h-4 w-4 mr-2" />
              Archive Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages Area */}
      <ScrollArea
        className="flex-1 p-4"
        onScroll={handleScroll}
        ref={scrollAreaRef}
      >
        {messagesLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <p className="text-sm text-muted-foreground">
                No messages yet. Start the conversation!
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isOwnMessage =
                message.senderType === 'VENDOR' && message.senderId === currentUserId;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwnMessage={isOwnMessage}
                  onFlagMessage={handleFlagMessage}
                />
              );
            })}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </>
        )}
      </ScrollArea>

      {/* Message Composer */}
      <MessageComposer
        conversationId={conversationId}
        onMessageSent={handleMessageSent}
      />

      {/* Scroll to bottom button (when not auto-scrolling) */}
      {!shouldAutoScroll && (
        <div className="absolute bottom-24 right-8">
          <Button
            size="sm"
            className="rounded-full shadow-lg"
            onClick={() => {
              messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
              setShouldAutoScroll(true);
            }}
          >
            Scroll to bottom
          </Button>
        </div>
      )}
    </div>
  );
}
