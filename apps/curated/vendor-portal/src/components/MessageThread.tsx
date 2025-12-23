import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_THREAD_MESSAGES,
  SEND_MESSAGE,
  MARK_MESSAGES_READ,
  UPDATE_THREAD_STATUS,
} from '../graphql/messages.queries';
import {
  MessageThreadWithMessages,
  MessageThreadStatus,
  getThreadStatusColor,
} from '../types/messages';
import { MessageBubble } from './MessageBubble';
import './MessageThread.css';

export interface MessageThreadProps {
  threadId: string;
  onClose: () => void;
  onUpdate?: () => void;
}

export function MessageThread({ threadId, onClose, onUpdate }: MessageThreadProps) {
  const [messageContent, setMessageContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data, loading, error, refetch } = useQuery(GET_THREAD_MESSAGES, {
    variables: { threadId },
    fetchPolicy: 'network-only',
  });

  const [sendMessage, { loading: sending }] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      setMessageContent('');
      refetch();
      onUpdate?.();
    },
  });

  const [markRead] = useMutation(MARK_MESSAGES_READ);
  const [updateStatus] = useMutation(UPDATE_THREAD_STATUS, {
    onCompleted: () => {
      refetch();
      onUpdate?.();
    },
  });

  const thread: MessageThreadWithMessages | null = data?.messageThread || null;

  // Scroll to bottom when messages load or new message sent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages]);

  // Mark messages as read when thread opens
  useEffect(() => {
    if (thread && thread.unreadCount > 0) {
      const unreadMessageIds = thread.messages
        .filter((msg) => msg.senderType === 'spa' && msg.status !== 'read')
        .map((msg) => msg.id);

      if (unreadMessageIds.length > 0) {
        markRead({
          variables: {
            input: {
              threadId,
              messageIds: unreadMessageIds,
            },
          },
        });
      }
    }
  }, [thread, threadId, markRead]);

  const handleSend = async () => {
    if (!messageContent.trim() || sending) return;

    await sendMessage({
      variables: {
        input: {
          threadId,
          content: messageContent.trim(),
        },
      },
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleStatusChange = (newStatus: MessageThreadStatus) => {
    updateStatus({
      variables: {
        input: {
          threadId,
          status: newStatus,
        },
      },
    });
  };

  return (
    <div className="message-thread-container">
      <div className="message-thread-header">
        <div className="thread-header-info">
          <h2 className="thread-subject">{thread?.subject || 'Loading...'}</h2>
          {thread && (
            <div className="thread-meta">
              <span className="thread-spa">{thread.spaName}</span>
              {thread.orderNumber && (
                <span className="thread-order">Order #{thread.orderNumber}</span>
              )}
              <span
                className="thread-status-badge"
                style={{
                  backgroundColor: `${getThreadStatusColor(thread.status)}20`,
                  borderColor: getThreadStatusColor(thread.status),
                  color: getThreadStatusColor(thread.status),
                }}
              >
                {thread.status}
              </span>
            </div>
          )}
        </div>
        <div className="thread-header-actions">
          {thread && thread.status === MessageThreadStatus.ACTIVE && (
            <>
              <button
                className="thread-action-btn"
                onClick={() => handleStatusChange(MessageThreadStatus.RESOLVED)}
                title="Mark as Resolved"
              >
                ✓ Resolve
              </button>
              <button
                className="thread-action-btn"
                onClick={() => handleStatusChange(MessageThreadStatus.ARCHIVED)}
                title="Archive Thread"
              >
                📦 Archive
              </button>
            </>
          )}
          {thread && thread.status === MessageThreadStatus.RESOLVED && (
            <button
              className="thread-action-btn"
              onClick={() => handleStatusChange(MessageThreadStatus.ACTIVE)}
              title="Reopen Thread"
            >
              ↺ Reopen
            </button>
          )}
          {thread && thread.status === MessageThreadStatus.ARCHIVED && (
            <button
              className="thread-action-btn"
              onClick={() => handleStatusChange(MessageThreadStatus.ACTIVE)}
              title="Unarchive Thread"
            >
              📤 Unarchive
            </button>
          )}
          <button className="thread-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      <div className="message-thread-content">
        {loading && <div className="thread-loading">Loading messages...</div>}

        {error && (
          <div className="thread-error">
            Failed to load messages: {error.message}
          </div>
        )}

        {thread && thread.messages.length > 0 && (
          <div className="messages-list">
            {thread.messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={message.senderType === 'vendor'}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

        {thread && thread.messages.length === 0 && (
          <div className="messages-empty">
            <p>No messages yet. Start the conversation!</p>
          </div>
        )}
      </div>

      {thread && thread.status !== MessageThreadStatus.ARCHIVED && (
        <div className="message-composer">
          <textarea
            className="composer-textarea"
            placeholder="Type your message... (Shift+Enter for new line, Enter to send)"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            rows={3}
          />
          <div className="composer-actions">
            <div className="composer-info">
              {messageContent.length > 0 && (
                <span className="char-count">{messageContent.length} characters</span>
              )}
            </div>
            <button
              className="composer-send-btn"
              onClick={handleSend}
              disabled={!messageContent.trim() || sending}
            >
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>
      )}

      {thread && thread.status === MessageThreadStatus.ARCHIVED && (
        <div className="thread-archived-notice">
          <p>This thread is archived. Unarchive it to send new messages.</p>
        </div>
      )}
    </div>
  );
}
