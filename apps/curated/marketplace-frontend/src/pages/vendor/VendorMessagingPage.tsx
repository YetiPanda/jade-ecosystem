/**
 * Vendor Messaging Page
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.2: Messaging UI
 *
 * Main messaging interface with conversation list and chat panel
 */

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { MessageSquare, Settings } from 'lucide-react';

import { Button } from '@jade/ui/components';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ConversationList } from '@/components/vendor/messaging/ConversationList';
import { ChatPanel } from '@/components/vendor/messaging/ChatPanel';
import { NotificationSettings } from '@/components/vendor/messaging/NotificationSettings';
import { ARCHIVE_CONVERSATION_MUTATION } from '@/graphql/queries/messaging';

/**
 * VendorMessagingPage
 *
 * Two-column layout:
 * - Left: Conversation list with search
 * - Right: Chat panel with selected conversation
 */
export function VendorMessagingPage() {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // TODO: Get current user ID from auth context
  const currentUserId = 'vendor-1';

  const [archiveConversation] = useMutation(ARCHIVE_CONVERSATION_MUTATION, {
    onCompleted: () => {
      // Clear selection if archived conversation was selected
      if (selectedConversationId) {
        setSelectedConversationId(null);
      }
    },
    refetchQueries: ['VendorConversations'],
  });

  const handleArchiveConversation = (conversationId: string) => {
    if (confirm('Are you sure you want to archive this conversation?')) {
      archiveConversation({
        variables: { conversationId },
      });
    }
  };

  const handleConversationArchived = () => {
    setSelectedConversationId(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header with Settings */}
      <div className="border-b p-4 flex items-center justify-between bg-white">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-sm text-muted-foreground">
            Communicate with spa partners
          </p>
        </div>

        {/* Notification Settings Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Notification Settings</DialogTitle>
              <DialogDescription>
                Configure how you want to be notified about new messages
              </DialogDescription>
            </DialogHeader>
            <NotificationSettings
              onSave={(preferences) => {
                console.log('[VendorMessagingPage] Saving preferences:', preferences);
                // TODO: Save to backend
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-1">
        {/* Left Sidebar - Conversation List */}
        <div className="w-80 flex-shrink-0">
          <ConversationList
            selectedConversationId={selectedConversationId || undefined}
            onSelectConversation={setSelectedConversationId}
            onArchiveConversation={handleArchiveConversation}
          />
        </div>

        {/* Right Panel - Chat */}
        <div className="flex-1">
          {selectedConversationId ? (
            <ChatPanel
              conversationId={selectedConversationId}
              currentUserId={currentUserId}
              onArchive={handleConversationArchived}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  No conversation selected
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
