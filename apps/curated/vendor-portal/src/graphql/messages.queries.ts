import { gql } from '@apollo/client';

/**
 * GraphQL queries and mutations for vendor messaging
 */

export const GET_MESSAGE_THREADS = gql`
  query GetMessageThreads($input: ThreadsQueryInput!) {
    vendorMessageThreads(input: $input) {
      threads {
        id
        subject
        status
        spaId
        spaName
        orderId
        orderNumber
        messageCount
        unreadCount
        lastMessageAt
        createdAt
        updatedAt
        archivedAt
        resolvedAt
        lastMessage {
          id
          content
          senderType
          senderName
          createdAt
        }
      }
      totalCount
      unreadCount
      hasMore
    }
  }
`;

export const GET_THREAD_MESSAGES = gql`
  query GetThreadMessages($threadId: ID!) {
    messageThread(threadId: $threadId) {
      id
      subject
      status
      spaId
      spaName
      orderId
      orderNumber
      messageCount
      unreadCount
      createdAt
      updatedAt

      messages {
        id
        threadId
        senderId
        senderName
        senderType
        content
        status
        createdAt
        readAt
        attachments {
          id
          fileName
          fileUrl
          fileType
          fileSize
        }
      }
    }
  }
`;

export const CREATE_MESSAGE_THREAD = gql`
  mutation CreateMessageThread($input: CreateThreadInput!) {
    createMessageThread(input: $input) {
      id
      subject
      status
      spaId
      spaName
      orderId
      orderNumber
      createdAt
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      id
      threadId
      content
      senderId
      senderName
      senderType
      status
      createdAt
      readAt
      attachments {
        id
        fileName
        fileUrl
        fileType
        fileSize
      }
    }
  }
`;

export const MARK_MESSAGES_READ = gql`
  mutation MarkMessagesRead($input: MarkMessagesReadInput!) {
    markMessagesRead(input: $input) {
      success
      updatedCount
    }
  }
`;

export const UPDATE_THREAD_STATUS = gql`
  mutation UpdateThreadStatus($input: UpdateThreadStatusInput!) {
    updateThreadStatus(input: $input) {
      id
      status
      archivedAt
      resolvedAt
      updatedAt
    }
  }
`;

export const GET_UNREAD_MESSAGE_COUNT = gql`
  query GetUnreadMessageCount {
    vendorUnreadMessageCount {
      totalUnread
      unreadByThread {
        threadId
        count
      }
    }
  }
`;

export const SEARCH_MESSAGES = gql`
  query SearchMessages($threadId: ID!, $searchQuery: String!) {
    searchMessages(threadId: $threadId, searchQuery: $searchQuery) {
      messages {
        id
        threadId
        senderId
        senderName
        senderType
        content
        status
        createdAt
        readAt
        attachments {
          id
          fileName
          fileUrl
          fileType
          fileSize
        }
      }
      totalCount
    }
  }
`;
