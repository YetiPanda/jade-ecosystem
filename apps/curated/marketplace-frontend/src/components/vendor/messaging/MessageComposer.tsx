/**
 * Message Composer Component
 * Feature 011: Vendor Portal MVP
 * Phase C: Communication
 * Sprint C.2: Messaging UI - Task C.2.6
 *
 * Text input and send button for composing messages
 */

import React, { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { Send, Paperclip, X, Loader2 } from 'lucide-react';

import { Button } from '@jade/ui/components';
import { Textarea } from '@jade/ui/components';
import { Alert, AlertDescription } from '@jade/ui/components';
import { SEND_MESSAGE_MUTATION } from '@/graphql/queries/messaging';

interface MessageAttachment {
  url: string;
  filename: string;
  fileType: string;
  fileSize: number;
}

interface MessageComposerProps {
  conversationId: string;
  onMessageSent?: () => void;
}

/**
 * MessageComposer
 *
 * Text input with:
 * - Auto-resize textarea
 * - Attachment support
 * - Send on Ctrl+Enter
 * - Loading state
 */
export function MessageComposer({ conversationId, onMessageSent }: MessageComposerProps) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [sendMessage, { loading, error }] = useMutation(SEND_MESSAGE_MUTATION, {
    onCompleted: (data) => {
      if (data.sendMessage.success) {
        setContent('');
        setAttachments([]);
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
        onMessageSent?.();
      }
    },
  });

  const handleSend = async () => {
    if (!content.trim() && attachments.length === 0) {
      return;
    }

    await sendMessage({
      variables: {
        input: {
          conversationId,
          content: content.trim(),
          attachments: attachments.length > 0 ? attachments : undefined,
        },
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // TODO: Implement actual file upload to S3/storage
    // For now, just create placeholder attachments
    const newAttachments: MessageAttachment[] = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file), // Temporary URL for preview
      filename: file.name,
      fileType: file.type,
      fileSize: file.size,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);

    // Reset input
    e.target.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const canSend = (content.trim().length > 0 || attachments.length > 0) && !loading;

  return (
    <div className="border-t bg-white p-4">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-3">
          <AlertDescription>Failed to send message. Please try again.</AlertDescription>
        </Alert>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="mb-3 space-y-2">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 bg-gray-100 rounded"
            >
              <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{attachment.filename}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(attachment.fileSize)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-end gap-2">
        {/* Attachment Button */}
        <div className="relative">
          <input
            type="file"
            id="attachment-upload"
            className="hidden"
            multiple
            onChange={handleAttachmentUpload}
            disabled={loading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => document.getElementById('attachment-upload')?.click()}
            disabled={loading}
            title="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
        </div>

        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Ctrl+Enter to send)"
          className="flex-1 min-h-[44px] max-h-[150px] resize-none"
          disabled={loading}
          rows={1}
        />

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!canSend}
          className="flex-shrink-0"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-2">
        Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Ctrl+Enter</kbd> to send
      </p>
    </div>
  );
}

/**
 * Format file size
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
