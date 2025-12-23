import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_MESSAGE_THREADS } from '../graphql/messages.queries';
import { MessagesList } from '../components/MessagesList';
import { MessageThread } from '../components/MessageThread';
import {
  ThreadFilters,
  ThreadsQueryResult,
  MessageThread as MessageThreadType,
  MessageThreadStatus,
} from '../types/messages';
import './Page.css';
import './MessagesPage.css';

const PAGE_SIZE = 50;

export function MessagesPage() {
  const [filters, setFilters] = useState<ThreadFilters>({ status: [MessageThreadStatus.ACTIVE] });
  const [selectedThread, setSelectedThread] = useState<MessageThreadType | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { data, loading, error, refetch } = useQuery<{ vendorMessageThreads: ThreadsQueryResult }>(
    GET_MESSAGE_THREADS,
    {
      variables: {
        input: {
          filters,
          limit: PAGE_SIZE,
          offset: 0,
          sortBy: 'lastMessageAt',
          sortOrder: 'desc',
        },
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
      pollInterval: 30000, // Poll every 30 seconds for new messages
    }
  );

  const result = data?.vendorMessageThreads;
  const threads = result?.threads || [];
  const totalCount = result?.totalCount || 0;
  const unreadCount = result?.unreadCount || 0;

  const handleThreadSelect = (thread: MessageThreadType) => {
    setSelectedThread(thread);
  };

  const handleCloseThread = () => {
    setSelectedThread(null);
  };

  const handleThreadUpdate = () => {
    refetch();
  };

  const handleStatusFilter = (status: MessageThreadStatus) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status];

    setFilters({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined,
    });
  };

  const handleUnreadFilter = () => {
    setFilters({
      ...filters,
      hasUnread: !filters.hasUnread,
    });
  };

  const handleClearFilters = () => {
    setFilters({ status: [MessageThreadStatus.ACTIVE] });
  };

  const hasActiveFilters =
    (filters.status && filters.status.length !== 1) ||
    filters.hasUnread ||
    filters.searchQuery ||
    filters.spaId ||
    filters.orderId;

  return (
    <div className="page messages-page">
      <div className="page-header">
        <div>
          <h1>Messages</h1>
          <p>Direct communication with spa customers</p>
        </div>
        {totalCount > 0 && (
          <div className="messages-stats">
            <div className="stat-item">
              <div className="stat-label">Total Threads</div>
              <div className="stat-value">{totalCount}</div>
            </div>
            {unreadCount > 0 && (
              <div className="stat-item">
                <div className="stat-label">Unread</div>
                <div className="stat-value unread">{unreadCount}</div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="messages-container">
        {/* Sidebar */}
        <div className="messages-sidebar">
          <div className="sidebar-header">
            <h3>Conversations</h3>
            <button
              className="filters-toggle-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              🔍 {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>

          {showFilters && (
            <div className="sidebar-filters">
              <div className="filter-section">
                <h4>Status</h4>
                <div className="filter-buttons">
                  {Object.values(MessageThreadStatus).map((status) => (
                    <button
                      key={status}
                      className={`filter-btn ${
                        filters.status?.includes(status) ? 'active' : ''
                      }`}
                      onClick={() => handleStatusFilter(status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <button
                  className={`filter-btn ${filters.hasUnread ? 'active' : ''}`}
                  onClick={handleUnreadFilter}
                >
                  💬 Unread Only
                </button>
              </div>

              {hasActiveFilters && (
                <button className="filter-clear-btn" onClick={handleClearFilters}>
                  ✕ Clear Filters
                </button>
              )}
            </div>
          )}

          {error && (
            <div className="sidebar-error">
              <p>Failed to load messages</p>
              <p>{error.message}</p>
            </div>
          )}

          <div className="sidebar-content">
            <MessagesList
              threads={threads}
              selectedThreadId={selectedThread?.id}
              onSelectThread={handleThreadSelect}
              loading={loading}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="messages-main">
          {selectedThread ? (
            <MessageThread
              threadId={selectedThread.id}
              onClose={handleCloseThread}
              onUpdate={handleThreadUpdate}
            />
          ) : (
            <div className="messages-empty-state">
              <div className="empty-state-icon">💬</div>
              <h3>No Thread Selected</h3>
              <p>Select a conversation from the sidebar to view messages</p>
            </div>
          )}
        </div>
      </div>

      {/* Sprint Completion Info - Only show when no thread selected */}
      {!selectedThread && !loading && threads.length > 0 && (
        <div className="info-box" style={{ marginTop: '2rem' }}>
          <h3>✅ Sprint C.1 Complete - Messaging System</h3>
          <p>
            Full messaging system is now operational. Communicate directly with spa customers,
            manage conversations, and track message status.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <strong>Total Threads:</strong> {totalCount}
            <br />
            <strong>Unread Messages:</strong> {unreadCount}
            <br />
            <strong>Features:</strong> Real-time updates, status tracking, filters, auto-scroll
          </div>
          <p className="info-note">
            <strong>Next Sprint (C.2):</strong> Message Attachments & Advanced Features -
            File uploads, image previews, message search, export conversations.
          </p>
        </div>
      )}
    </div>
  );
}
