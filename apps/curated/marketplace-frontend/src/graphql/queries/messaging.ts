/**
 * Messaging GraphQL Queries
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.2: Messaging UI
 */

import { gql } from '@apollo/client';

// ──────────────────────────────────────────────────────────────
// FRAGMENTS
// ──────────────────────────────────────────────────────────────

export const MESSAGE_FRAGMENT = gql`
  fragment MessageFields on Message {
    id
    conversationId
    senderType
    senderId
    senderName
    content
    contentType
    attachments {
      url
      filename
      fileType
      fileSize
    }
    isSystemMessage
    isEdited
    editedAt
    isFlagged
    moderationStatus
    createdAt
    updatedAt
  }
`;

export const CONVERSATION_FRAGMENT = gql`
  fragment ConversationFields on Conversation {
    id
    vendorId
    spaId
    contextType
    contextId
    subject
    status
    lastMessageAt
    lastMessagePreview
    unreadCountVendor
    unreadCountSpa
    isFlagged
    createdAt
    updatedAt
  }
`;

// ──────────────────────────────────────────────────────────────
// QUERIES
// ──────────────────────────────────────────────────────────────

export const VENDOR_CONVERSATIONS_QUERY = gql`
  ${CONVERSATION_FRAGMENT}
  query VendorConversations($filter: ConversationFilter) {
    vendorConversations(filter: $filter) {
      ...ConversationFields
    }
  }
`;

export const CONVERSATION_QUERY = gql`
  ${CONVERSATION_FRAGMENT}
  query Conversation($id: ID!) {
    conversation(id: $id) {
      ...ConversationFields
    }
  }
`;

export const CONVERSATION_MESSAGES_QUERY = gql`
  ${MESSAGE_FRAGMENT}
  query ConversationMessages($conversationId: ID!, $filter: MessageFilter) {
    conversationMessages(conversationId: $conversationId, filter: $filter) {
      ...MessageFields
    }
  }
`;

export const VENDOR_UNREAD_COUNT_QUERY = gql`
  query VendorUnreadCount {
    vendorUnreadCount
  }
`;

// ──────────────────────────────────────────────────────────────
// MUTATIONS
// ──────────────────────────────────────────────────────────────

export const CREATE_CONVERSATION_MUTATION = gql`
  ${CONVERSATION_FRAGMENT}
  mutation CreateConversation($input: CreateConversationInput!) {
    createConversation(input: $input) {
      success
      conversation {
        ...ConversationFields
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const SEND_MESSAGE_MUTATION = gql`
  ${MESSAGE_FRAGMENT}
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      success
      message {
        ...MessageFields
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export const MARK_CONVERSATION_AS_READ_MUTATION = gql`
  mutation MarkConversationAsRead($conversationId: ID!) {
    markConversationAsRead(conversationId: $conversationId)
  }
`;

export const ARCHIVE_CONVERSATION_MUTATION = gql`
  mutation ArchiveConversation($conversationId: ID!) {
    archiveConversation(conversationId: $conversationId)
  }
`;

export const FLAG_MESSAGE_MUTATION = gql`
  mutation FlagMessage($messageId: ID!, $reason: String!) {
    flagMessage(messageId: $messageId, reason: $reason)
  }
`;

// ──────────────────────────────────────────────────────────────
// SUBSCRIPTIONS
// ──────────────────────────────────────────────────────────────

export const MESSAGE_RECEIVED_SUBSCRIPTION = gql`
  ${MESSAGE_FRAGMENT}
  subscription MessageReceived($conversationId: ID!) {
    messageReceived(conversationId: $conversationId) {
      ...MessageFields
    }
  }
`;

export const CONVERSATION_UPDATED_SUBSCRIPTION = gql`
  ${CONVERSATION_FRAGMENT}
  subscription ConversationUpdated($vendorId: String!) {
    conversationUpdated(vendorId: $vendorId) {
      ...ConversationFields
    }
  }
`;
