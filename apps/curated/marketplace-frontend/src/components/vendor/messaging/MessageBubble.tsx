/**
 * Message Bubble Component
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.2: Messaging UI - Task C.2.4
 *
 * Displays individual message with sender styling
 */

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { File, Download, Flag } from 'lucide-react';
import { Button } from '@jade/ui/components';
import { Badge } from '@jade/ui/components';

interface MessageAttachment {
  url: string;
  filename: string;
  fileType: string;
  fileSize: number;
}

interface Message {
  id: string;
  senderType: 'VENDOR' | 'SPA' | 'ADMIN';
  senderName: string;
  content: string;
  attachments?: MessageAttachment[];
  isSystemMessage?: boolean;
  isEdited?: boolean;
  isFlagged?: boolean;
  createdAt: string;
}

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onFlagMessage?: (messageId: string) => void;
}

/**
 * MessageBubble
 *
 * Displays a single message with:
 * - Different styling for own vs other messages
 * - Attachment previews
 * - System message styling
 * - Flag option
 */
export function MessageBubble({ message, isOwnMessage, onFlagMessage }: MessageBubbleProps) {
  const {
    id,
    senderName,
    content,
    attachments = [],
    isSystemMessage,
    isEdited,
    isFlagged,
    createdAt,
  } = message;

  // System message (e.g., "Order #123 was created")
  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-gray-100 rounded-full px-4 py-2 text-xs text-muted-foreground">
          {content}
        </div>
      </div>
    );
  }

  // Regular message
  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 group`}
    >
      <div
        className={`max-w-[70%] ${
          isOwnMessage ? 'order-2' : 'order-1'
        }`}
      >
        {/* Sender Name */}
        {!isOwnMessage && (
          <div className="text-xs text-muted-foreground mb-1 px-3">
            {senderName}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwnMessage
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-200 text-gray-900 rounded-bl-none'
          }`}
        >
          {/* Content */}
          <p className="text-sm whitespace-pre-wrap break-words">{content}</p>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded ${
                    isOwnMessage ? 'bg-blue-700' : 'bg-gray-300'
                  }`}
                >
                  <File className="h-4 w-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {attachment.filename}
                    </p>
                    <p className="text-xs opacity-75">
                      {formatFileSize(attachment.fileSize)}
                    </p>
                  </div>
                  <a
                    href={attachment.url}
                    download={attachment.filename}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-6 w-6 p-0 ${
                        isOwnMessage ? 'hover:bg-blue-800' : 'hover:bg-gray-400'
                      }`}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Metadata Row */}
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xs ${
                isOwnMessage ? 'text-blue-100' : 'text-gray-600'
              }`}
            >
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </span>

            {isEdited && (
              <span
                className={`text-xs italic ${
                  isOwnMessage ? 'text-blue-100' : 'text-gray-600'
                }`}
              >
                (edited)
              </span>
            )}

            {isFlagged && (
              <Badge variant="destructive" className="text-xs h-4 px-1">
                Flagged
              </Badge>
            )}
          </div>
        </div>

        {/* Flag Button (hover only, for other's messages) */}
        {!isOwnMessage && onFlagMessage && !isFlagged && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 px-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-muted-foreground hover:text-red-600"
              onClick={() => onFlagMessage(id)}
            >
              <Flag className="h-3 w-3 mr-1" />
              Flag
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Format file size in human-readable format
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
