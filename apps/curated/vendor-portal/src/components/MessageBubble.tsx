import { Message, formatMessageDate, formatFileSize } from '../types/messages';
import { isImageFile, getFileIcon } from '../utils/fileUpload';
import './MessageBubble.css';

export interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  return (
    <div className={`message-bubble-container ${isOwnMessage ? 'own' : 'other'}`}>
      <div className="message-bubble">
        <div className="message-header">
          <span className="message-sender">{message.senderName}</span>
          <span className="message-time">{formatMessageDate(message.createdAt)}</span>
        </div>

        <div className="message-content">
          {message.content}
        </div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="message-attachments">
            {message.attachments.map((attachment) => {
              const isImage = isImageFile({ fileType: attachment.fileType });

              return (
                <div key={attachment.id} className="message-attachment-item">
                  {isImage ? (
                    <a
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="attachment-image-preview"
                    >
                      <img src={attachment.fileUrl} alt={attachment.fileName} />
                    </a>
                  ) : (
                    <a
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="attachment-file"
                    >
                      <span className="attachment-icon">{getFileIcon(attachment.fileType)}</span>
                      <div className="attachment-info">
                        <span className="attachment-name">{attachment.fileName}</span>
                        <span className="attachment-size">{formatFileSize(attachment.fileSize)}</span>
                      </div>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="message-status">
          {isOwnMessage && (
            <>
              {message.status === 'read' && message.readAt && (
                <span className="status-read">Read {formatMessageDate(message.readAt)}</span>
              )}
              {message.status === 'delivered' && (
                <span className="status-delivered">Delivered</span>
              )}
              {message.status === 'sent' && (
                <span className="status-sent">Sent</span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
