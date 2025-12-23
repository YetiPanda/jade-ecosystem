import {
  MessageThread,
  formatMessageDate,
  truncateMessage,
  getThreadStatusColor,
} from '../types/messages';
import './MessagesList.css';

export interface MessagesListProps {
  threads: MessageThread[];
  selectedThreadId?: string;
  onSelectThread: (thread: MessageThread) => void;
  loading?: boolean;
}

export function MessagesList({
  threads,
  selectedThreadId,
  onSelectThread,
  loading,
}: MessagesListProps) {
  if (loading) {
    return <MessagesListSkeleton />;
  }

  if (threads.length === 0) {
    return (
      <div className="messages-list-empty">
        <div className="empty-icon">💬</div>
        <h3>No Messages</h3>
        <p>No message threads found.</p>
      </div>
    );
  }

  return (
    <div className="messages-list">
      {threads.map((thread) => (
        <div
          key={thread.id}
          className={`thread-item ${selectedThreadId === thread.id ? 'selected' : ''} ${
            thread.unreadCount > 0 ? 'unread' : ''
          }`}
          onClick={() => onSelectThread(thread)}
        >
          <div className="thread-item-header">
            <div className="thread-item-title">
              <h4 className="thread-item-subject">{thread.subject}</h4>
              {thread.unreadCount > 0 && (
                <span className="unread-badge">{thread.unreadCount}</span>
              )}
            </div>
            <span className="thread-item-time">{formatMessageDate(thread.lastMessageAt)}</span>
          </div>

          <div className="thread-item-meta">
            <span className="thread-item-spa">{thread.spaName}</span>
            <span
              className="thread-item-status"
              style={{
                color: getThreadStatusColor(thread.status),
              }}
            >
              {thread.status}
            </span>
          </div>

          {thread.lastMessage && (
            <div className="thread-item-preview">
              <span className="preview-sender">
                {thread.lastMessage.senderType === 'vendor' ? 'You:' : `${thread.lastMessage.senderName}:`}
              </span>
              <span className="preview-content">
                {truncateMessage(thread.lastMessage.content, 60)}
              </span>
            </div>
          )}

          {thread.orderNumber && (
            <div className="thread-item-order">Order #{thread.orderNumber}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function MessagesListSkeleton() {
  return (
    <div className="messages-list">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="thread-item skeleton-thread">
          <div className="thread-item-header">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-time" />
          </div>
          <div className="skeleton skeleton-text" />
          <div className="skeleton skeleton-preview" />
        </div>
      ))}
    </div>
  );
}
