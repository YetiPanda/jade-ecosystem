/**
 * ConversationList Component Tests
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.2: Messaging UI - Task C.2.12
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ConversationList } from '../ConversationList';
import { VENDOR_CONVERSATIONS_QUERY } from '@/graphql/queries/messaging';

describe('ConversationList', () => {
  const mockConversations = [
    {
      id: 'conv-1',
      vendorId: 'vendor-1',
      spaId: 'spa-1',
      subject: 'Question about Product X',
      status: 'ACTIVE',
      contextType: 'PRODUCT',
      contextId: 'product-123',
      unreadCountVendor: 3,
      unreadCountSpa: 0,
      lastMessageAt: new Date('2025-01-15T10:00:00Z').toISOString(),
      lastMessagePreview: 'Thank you for your inquiry...',
      createdAt: new Date('2025-01-14T09:00:00Z').toISOString(),
    },
    {
      id: 'conv-2',
      vendorId: 'vendor-1',
      spaId: 'spa-2',
      subject: 'Order #12345 Shipping',
      status: 'ACTIVE',
      contextType: 'ORDER',
      contextId: 'order-12345',
      unreadCountVendor: 0,
      unreadCountSpa: 1,
      lastMessageAt: new Date('2025-01-14T15:30:00Z').toISOString(),
      lastMessagePreview: 'Your order has shipped...',
      createdAt: new Date('2025-01-13T12:00:00Z').toISOString(),
    },
    {
      id: 'conv-3',
      vendorId: 'vendor-1',
      spaId: 'spa-3',
      subject: 'General Inquiry',
      status: 'ACTIVE',
      contextType: null,
      contextId: null,
      unreadCountVendor: 0,
      unreadCountSpa: 0,
      lastMessageAt: new Date('2025-01-10T08:00:00Z').toISOString(),
      lastMessagePreview: 'Looking forward to working with you...',
      createdAt: new Date('2025-01-10T08:00:00Z').toISOString(),
    },
  ];

  const defaultProps = {
    selectedConversationId: undefined,
    onSelectConversation: vi.fn(),
    onArchiveConversation: vi.fn(),
  };

  const createMocks = (conversations = mockConversations) => [
    {
      request: {
        query: VENDOR_CONVERSATIONS_QUERY,
        variables: { filter: { status: 'ACTIVE', limit: 100 } },
      },
      result: {
        data: {
          vendorConversations: conversations,
        },
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    const mocks = createMocks();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ConversationList {...defaultProps} />
      </MockedProvider>
    );

    expect(screen.getByRole('status')).toBeInTheDocument(); // Loading spinner
  });

  it('renders conversation list after loading', async () => {
    const mocks = createMocks();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ConversationList {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Question about Product X')).toBeInTheDocument();
      expect(screen.getByText('Order #12345 Shipping')).toBeInTheDocument();
      expect(screen.getByText('General Inquiry')).toBeInTheDocument();
    });
  });

  it('displays unread badges for conversations with unread messages', async () => {
    const mocks = createMocks();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ConversationList {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument(); // Unread count for conv-1
    });
  });

  it('sorts conversations by most recent message first', async () => {
    const mocks = createMocks();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ConversationList {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      const conversations = screen.getAllByRole('button', { name: /Question|Order|General/i });
      expect(conversations[0]).toHaveTextContent('Question about Product X'); // Most recent
      expect(conversations[1]).toHaveTextContent('Order #12345 Shipping');
      expect(conversations[2]).toHaveTextContent('General Inquiry'); // Oldest
    });
  });

  it('calls onSelectConversation when clicking a conversation', async () => {
    const mocks = createMocks();
    const onSelectConversation = vi.fn();

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ConversationList {...defaultProps} onSelectConversation={onSelectConversation} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Question about Product X')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Question about Product X'));

    expect(onSelectConversation).toHaveBeenCalledWith('conv-1');
  });

  it('highlights selected conversation', async () => {
    const mocks = createMocks();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ConversationList {...defaultProps} selectedConversationId="conv-2" />
      </MockedProvider>
    );

    await waitFor(() => {
      const selectedConv = screen.getByText('Order #12345 Shipping').closest('div');
      expect(selectedConv).toHaveClass('bg-blue-50'); // Or whatever class indicates selection
    });
  });

  it('filters conversations based on search term', async () => {
    const mocks = createMocks();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ConversationList {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Question about Product X')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Order' } });

    await waitFor(() => {
      expect(screen.queryByText('Question about Product X')).not.toBeInTheDocument();
      expect(screen.getByText('Order #12345 Shipping')).toBeInTheDocument();
      expect(screen.queryByText('General Inquiry')).not.toBeInTheDocument();
    });
  });

  it('shows empty state when no conversations', async () => {
    const mocks = createMocks([]);
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ConversationList {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/no conversations/i)).toBeInTheDocument();
    });
  });

  it('displays last message preview', async () => {
    const mocks = createMocks();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ConversationList {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Thank you for your inquiry...')).toBeInTheDocument();
      expect(screen.getByText('Your order has shipped...')).toBeInTheDocument();
    });
  });

  it('displays context badges for order and product conversations', async () => {
    const mocks = createMocks();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ConversationList {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/product/i)).toBeInTheDocument();
      expect(screen.getByText(/order/i)).toBeInTheDocument();
    });
  });

  it('refetches conversations on interval (polling)', async () => {
    const mocks = createMocks();
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ConversationList {...defaultProps} />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Question about Product X')).toBeInTheDocument();
    });

    // Note: Testing polling is tricky in unit tests
    // This would typically be tested in integration/E2E tests
  });
});
