/**
 * Messaging System Types
 *
 * Types for vendor-spa communication including message threads,
 * messages, notifications, and status tracking.
 */

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}

export const MESSAGE_STATUS_LABELS: Record<MessageStatus, string> = {
  [MessageStatus.SENT]: 'Sent',
  [MessageStatus.DELIVERED]: 'Delivered',
  [MessageStatus.READ]: 'Read',
};

export enum MessageThreadStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  RESOLVED = 'resolved',
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderType: 'vendor' | 'spa';
  content: string;
  status: MessageStatus;
  createdAt: string; // ISO 8601
  readAt?: string; // ISO 8601
  attachments?: MessageAttachment[];
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number; // in bytes
}

export interface MessageThread {
  id: string;
  subject: string;
  status: MessageThreadStatus;

  // Spa information
  spaId: string;
  spaName: string;

  // Related order (optional)
  orderId?: string;
  orderNumber?: string;

  // Message counts
  messageCount: number;
  unreadCount: number;

  // Latest message
  lastMessage?: Message;
  lastMessageAt: string; // ISO 8601

  // Timestamps
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  archivedAt?: string; // ISO 8601
  resolvedAt?: string; // ISO 8601

  // Participants
  vendorId: string;
}

export interface MessageThreadWithMessages extends MessageThread {
  messages: Message[];
}

export interface CreateThreadInput {
  spaId: string;
  subject: string;
  initialMessage: string;
  orderId?: string;
}

export interface SendMessageInput {
  threadId: string;
  content: string;
  attachments?: File[];
}

export interface UpdateThreadStatusInput {
  threadId: string;
  status: MessageThreadStatus;
}

export interface MarkMessagesReadInput {
  threadId: string;
  messageIds: string[];
}

export interface ThreadFilters {
  status?: MessageThreadStatus[];
  spaId?: string;
  orderId?: string;
  hasUnread?: boolean;
  searchQuery?: string;
}

export interface ThreadsQueryInput {
  filters?: ThreadFilters;
  limit?: number;
  offset?: number;
  sortBy?: 'lastMessageAt' | 'createdAt' | 'subject';
  sortOrder?: 'asc' | 'desc';
}

export interface ThreadsQueryResult {
  threads: MessageThread[];
  totalCount: number;
  unreadCount: number;
  hasMore: boolean;
}

/**
 * Helper to format message date
 */
export function formatMessageDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
}

/**
 * Helper to format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

/**
 * Helper to get thread status color
 */
export function getThreadStatusColor(status: MessageThreadStatus): string {
  switch (status) {
    case MessageThreadStatus.ACTIVE:
      return '#3b82f6'; // blue
    case MessageThreadStatus.ARCHIVED:
      return '#6b7280'; // gray
    case MessageThreadStatus.RESOLVED:
      return '#22c55e'; // green
  }
}

/**
 * Helper to truncate message preview
 */
export function truncateMessage(content: string, maxLength: number = 100): string {
  if (content.length <= maxLength) {
    return content;
  }
  return content.substring(0, maxLength) + '...';
}
