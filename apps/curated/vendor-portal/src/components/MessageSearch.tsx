import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_MESSAGES } from '../graphql/messages.queries';
import { Message, formatMessageDate, truncateMessage } from '../types/messages';
import './MessageSearch.css';

export interface MessageSearchProps {
  threadId: string;
  onMessageSelect?: (messageId: string) => void;
  onClose: () => void;
}

interface SearchResult {
  messages: Message[];
  totalCount: number;
}

export function MessageSearch({ threadId, onMessageSelect, onClose }: MessageSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Message[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [searchMessages, { loading }] = useLazyQuery<{ searchMessages: SearchResult }>(
    SEARCH_MESSAGES,
    {
      onCompleted: (data) => {
        setResults(data.searchMessages.messages);
        setTotalCount(data.searchMessages.totalCount);
      },
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length < 2) return;

    searchMessages({
      variables: {
        threadId,
        searchQuery: searchQuery.trim(),
      },
    });
  };

  const handleClear = () => {
    setSearchQuery('');
    setResults([]);
    setTotalCount(0);
  };

  const handleMessageClick = (messageId: string) => {
    onMessageSelect?.(messageId);
    onClose();
  };

  return (
    <div className="message-search-overlay">
      <div className="message-search-modal">
        <div className="search-modal-header">
          <h3>Search Messages</h3>
          <button className="search-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="Search by content, sender name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <div className="search-form-actions">
            <button type="submit" className="search-btn" disabled={searchQuery.trim().length < 2 || loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
            {searchQuery && (
              <button type="button" className="search-clear-btn" onClick={handleClear}>
                Clear
              </button>
            )}
          </div>
        </form>

        <div className="search-results">
          {totalCount > 0 && (
            <div className="search-results-header">
              <span className="results-count">
                {totalCount} result{totalCount !== 1 ? 's' : ''} found
              </span>
            </div>
          )}

          {results.length > 0 && (
            <div className="search-results-list">
              {results.map((message) => (
                <div
                  key={message.id}
                  className="search-result-item"
                  onClick={() => handleMessageClick(message.id)}
                >
                  <div className="result-header">
                    <span className="result-sender">{message.senderName}</span>
                    <span className="result-time">{formatMessageDate(message.createdAt)}</span>
                  </div>
                  <div className="result-content">{truncateMessage(message.content, 150)}</div>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="result-attachments">
                      📎 {message.attachments.length} attachment{message.attachments.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {searchQuery && !loading && results.length === 0 && totalCount === 0 && (
            <div className="search-no-results">
              <div className="no-results-icon">🔍</div>
              <p>No messages found for "{searchQuery}"</p>
            </div>
          )}

          {!searchQuery && !loading && results.length === 0 && (
            <div className="search-empty-state">
              <div className="empty-state-icon">💬</div>
              <p>Enter a search query to find messages</p>
              <p className="search-hint">
                Search by message content, sender name, or other keywords
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
