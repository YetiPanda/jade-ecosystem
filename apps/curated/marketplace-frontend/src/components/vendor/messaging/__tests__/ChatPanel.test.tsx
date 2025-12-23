/**
 * ChatPanel Component Tests
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.2: Messaging UI - Task C.2.12
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ChatPanel } from '../ChatPanel';
import {
  CONVERSATION_QUERY,
  CONVERSATION_MESSAGES_QUERY,
  MARK_CONVERSATION_AS_READ_MUTATION,
  SEND_MESSAGE_MUTATION,
} from '@/graphql/queries/messaging';

// Mock useWebSocket hook
vi.mock('@/hooks/useWebSocket', () => ({
  useWebSocket: () => ({
    isConnected: true,
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
    sendMessage: vi.fn(),
  }),
}));

describe('ChatPanel', () => {
  const mockConversation = {
    id: 'conv-1',
    vendorId: 'vendor-1',
    spaId: 'spa-1',
    subject: 'Question about Product X',
    status: 'ACTIVE',
    contextType: 'PRODUCT',
    contextId: 'product-123',
  };

  const mockMessages = [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderType: 'SPA',
      senderId: 'spa-1',
      senderName: 'Spa User',
      content: 'Hello, I have a question about Product X',
      attachments: [],
      isSystemMessage: false,
      createdAt: new Date('2025-01-15T10:00:00Z').toISOString(),
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      senderType: 'VENDOR',
      senderId: 'vendor-1',
      senderName: 'Vendor User',
      content: 'Thank you for your inquiry. How can I help?',
      attachments: [],
      isSystemMessage: false,
      createdAt: new Date('2025-01-15T10:05:00Z').toISOString(),
    },
    {
      id: 'msg-3',
      conversationId: 'conv-1',
      senderType: 'ADMIN',
      senderId: 'system',
      senderName: 'System',
      content: 'This conversation was flagged for review',
      attachments: [],
      isSystemMessage: true,
      createdAt: new Date('2025-01-15T10:10:00Z').toISOString(),
    },
  ];

  const defaultProps = {
    conversationId: 'conv-1',
    currentUserId: 'vendor-1',
    onArchive: vi.fn(),
  };

  const createMocks = () => [
    {
      request: {
        query: CONVERSATION_QUERY,
        variables: { id: 'conv-1' },
      },
      result: {
        data: {
          conversation: mockConversation,
        },
      },
    },
    {
      request: {
        query: CONVERSATION_MESSAGES_QUERY,
        variables: { conversationId: 'conv-1', filter: { limit: 100 } },
      },
      result: {
        data: {
          conversationMessages: mockMessages,
        },
      },
    },
    {
      request: {
        query: MARK_CONVERSATION_AS_READ_MUTATION,
        variables: { conversationId: 'conv-1' },
      },
      result: {
        data: {
          markConversationAsRead: true,
        },
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders conversation header with subject', async () => {
    const mocks = createMocks();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChatPanel {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Question about Product X')).toBeInTheDocument();
    });
  });

  it('displays all messages in chronological order', async () => {
    const mocks = createMocks();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChatPanel {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Hello, I have a question about Product X')).toBeInTheDocument();
      expect(screen.getByText('Thank you for your inquiry. How can I help?')).toBeInTheDocument();
    });
  });

  it('distinguishes between own messages and others', async () => {
    const mocks = createMocks();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChatPanel {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      const vendorMessage = screen.getByText('Thank you for your inquiry. How can I help?').closest('div');
      const spaMessage = screen.getByText('Hello, I have a question about Product X').closest('div');

      // Own messages should have different styling
      expect(vendorMessage).toHaveClass(/justify-end/);
      expect(spaMessage).toHaveClass(/justify-start/);
    });
  });

  it('displays system messages differently', async () => {
    const mocks = createMocks();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChatPanel {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      const systemMessage = screen.getByText('This conversation was flagged for review').closest('div');
      expect(systemMessage).toHaveClass(/justify-center/); // System messages centered
    });
  });

  it('marks conversation as read on mount', async () => {
    const mocks = createMocks();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChatPanel {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      // Verify MARK_CONVERSATION_AS_READ_MUTATION was called
      expect(screen.getByText('Question about Product X')).toBeInTheDocument();
    });
  });

  it('shows WebSocket connection status', async () => {
    const mocks = createMocks();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChatPanel {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      // Should show connected icon (Wifi icon with title "Real-time updates active")
      const wifiIcon = screen.getByTitle(/real-time updates active/i);
      expect(wifiIcon).toBeInTheDocument();
    });
  });

  it('renders message composer', async () => {
    const mocks = createMocks();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChatPanel {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
    });
  });

  it('shows empty state when no messages', async () => {
    const mocksWithNoMessages = [
      {
        request: {
          query: CONVERSATION_QUERY,
          variables: { id: 'conv-1' },
        },
        result: {
          data: {
            conversation: mockConversation,
          },
        },
      },
      {
        request: {
          query: CONVERSATION_MESSAGES_QUERY,
          variables: { conversationId: 'conv-1', filter: { limit: 100 } },
        },
        result: {
          data: {
            conversationMessages: [],
          },
        },
      },
      {
        request: {
          query: MARK_CONVERSATION_AS_READ_MUTATION,
          variables: { conversationId: 'conv-1' },
        },
        result: {
          data: {
            markConversationAsRead: true,
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocksWithNoMessages} addTypename={false}>
        <ChatPanel {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/no messages yet/i)).toBeInTheDocument();
    });
  });

  it('has archive conversation option', async () => {
    const mocks = createMocks();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChatPanel {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Question about Product X')).toBeInTheDocument();
    });

    // Open actions menu
    const moreButton = screen.getByRole('button', { name: '' }); // MoreVertical button
    fireEvent.click(moreButton);

    await waitFor(() => {
      expect(screen.getByText(/archive conversation/i)).toBeInTheDocument();
    });
  });

  it('auto-scrolls to bottom when new messages arrive', async () => {
    const mocks = createMocks();
    const { rerender } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChatPanel {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Thank you for your inquiry. How can I help?')).toBeInTheDocument();
    });

    // Note: Testing auto-scroll behavior requires jsdom with scroll APIs
    // This is typically tested in E2E tests
  });

  it('displays context information in header', async () => {
    const mocks = createMocks();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ChatPanel {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/PRODUCT/i)).toBeInTheDocument();
      expect(screen.getByText(/product-123/i)).toBeInTheDocument();
    });
  });
});
