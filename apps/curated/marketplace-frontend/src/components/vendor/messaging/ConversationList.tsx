/**
 * Conversation List Component
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.2: Messaging UI - Task C.2.1
 *
 * Displays list of conversation threads in sidebar
 */

import React from 'react';
import { useQuery } from '@apollo/client';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Search, Archive, Loader2 } from 'lucide-react';

import { Input } from '@jade/ui/components';
import { Button } from '@jade/ui/components';
import { Badge } from '@jade/ui/components';
import { ScrollArea } from '@jade/ui/components';
import { UnreadBadge } from './UnreadBadge';
import { VENDOR_CONVERSATIONS_QUERY } from '@/graphql/queries/messaging';

interface Conversation {
  id: string;
  vendorId: string;
  spaId: string;
  subject: string;
  status: string;
  lastMessageAt?: string;
  lastMessagePreview?: string;
  unreadCountVendor: number;
  contextType?: string;
  createdAt: string;
}

interface ConversationListProps {
  selectedConversationId?: string;
  onSelectConversation: (conversationId: string) => void;
  onArchiveConversation?: (conversationId: string) => void;
}

/**
 * ConversationList
 *
 * Sidebar component showing all vendor conversations with:
 * - Unread badges
 * - Last message preview
 * - Search functionality
 * - Archive option
 */
export function ConversationList({
  selectedConversationId,
  onSelectConversation,
  onArchiveConversation,
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  // Fetch conversations
  const { data, loading, error } = useQuery(VENDOR_CONVERSATIONS_QUERY, {
    variables: {
      filter: {
        status: 'ACTIVE',
        limit: 100,
        offset: 0,
      },
    },
    pollInterval: 30000, // Poll every 30 seconds for updates
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-red-600">
        Failed to load conversations
      </div>
    );
  }

  const conversations: Conversation[] = data?.vendorConversations || [];

  // Filter conversations by search term
  const filteredConversations = conversations.filter((conv) =>
    conv.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort by last message time (most recent first)
  const sortedConversations = [...filteredConversations].sort((a, b) => {
    const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : new Date(a.createdAt).getTime();
    const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : new Date(b.createdAt).getTime();
    return timeB - timeA;
  });

  return (
    <div className="flex flex-col h-full border-r bg-gray-50">
      {/* Search Header */}
      <div className="p-4 border-b bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        {sortedConversations.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-muted-foreground">
              {searchTerm ? 'No conversations found' : 'No conversations yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {sortedConversations.map((conversation) => {
              const isSelected = conversation.id === selectedConversationId;
              const hasUnread = conversation.unreadCountVendor > 0;

              return (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-gray-100 ${
                    isSelected ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    {/* Subject */}
                    <h3
                      className={`text-sm font-medium truncate flex-1 ${
                        hasUnread ? 'font-bold' : ''
                      }`}
                    >
                      {conversation.subject}
                    </h3>

                    {/* Unread Badge */}
                    {hasUnread && (
                      <UnreadBadge count={conversation.unreadCountVendor} className="ml-2" />
                    )}
                  </div>

                  {/* Context Badge */}
                  {conversation.contextType && (
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs">
                        {conversation.contextType}
                      </Badge>
                    </div>
                  )}

                  {/* Last Message Preview */}
                  {conversation.lastMessagePreview && (
                    <p className="text-xs text-muted-foreground truncate mb-1">
                      {conversation.lastMessagePreview}
                    </p>
                  )}

                  {/* Timestamp */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {conversation.lastMessageAt
                        ? formatDistanceToNow(new Date(conversation.lastMessageAt), {
                            addSuffix: true,
                          })
                        : formatDistanceToNow(new Date(conversation.createdAt), {
                            addSuffix: true,
                          })}
                    </span>

                    {/* Archive Button */}
                    {onArchiveConversation && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onArchiveConversation(conversation.id);
                        }}
                      >
                        <Archive className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
