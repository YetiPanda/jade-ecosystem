import { useState } from 'react';
import { MessageThreadWithMessages } from '../types/messages';
import './ConversationExport.css';

export interface ConversationExportProps {
  thread: MessageThreadWithMessages;
  onClose: () => void;
}

type ExportFormat = 'csv' | 'json' | 'text';

export function ConversationExport({ thread, onClose }: ConversationExportProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('text');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);

    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      switch (selectedFormat) {
        case 'csv':
          content = generateCSV();
          filename = `conversation-${thread.id}.csv`;
          mimeType = 'text/csv';
          break;

        case 'json':
          content = generateJSON();
          filename = `conversation-${thread.id}.json`;
          mimeType = 'application/json';
          break;

        case 'text':
        default:
          content = generateText();
          filename = `conversation-${thread.id}.txt`;
          mimeType = 'text/plain';
          break;
      }

      // Create download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Close modal after short delay
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const generateCSV = (): string => {
    const headers = ['Date', 'Time', 'Sender', 'Sender Type', 'Message', 'Attachments', 'Status'];
    const rows = thread.messages.map((msg) => {
      const date = new Date(msg.createdAt);
      const attachments = msg.attachments?.map((a) => a.fileName).join('; ') || '';
      return [
        date.toLocaleDateString(),
        date.toLocaleTimeString(),
        msg.senderName,
        msg.senderType,
        `"${msg.content.replace(/"/g, '""')}"`, // Escape quotes
        `"${attachments}"`,
        msg.status,
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  };

  const generateJSON = (): string => {
    const exportData = {
      thread: {
        id: thread.id,
        subject: thread.subject,
        status: thread.status,
        spaName: thread.spaName,
        orderNumber: thread.orderNumber,
        createdAt: thread.createdAt,
        exportedAt: new Date().toISOString(),
      },
      messages: thread.messages.map((msg) => ({
        id: msg.id,
        senderId: msg.senderId,
        senderName: msg.senderName,
        senderType: msg.senderType,
        content: msg.content,
        status: msg.status,
        createdAt: msg.createdAt,
        readAt: msg.readAt,
        attachments: msg.attachments?.map((a) => ({
          fileName: a.fileName,
          fileUrl: a.fileUrl,
          fileType: a.fileType,
          fileSize: a.fileSize,
        })),
      })),
    };

    return JSON.stringify(exportData, null, 2);
  };

  const generateText = (): string => {
    const lines: string[] = [];

    // Header
    lines.push('='.repeat(80));
    lines.push(`Conversation: ${thread.subject}`);
    lines.push(`With: ${thread.spaName}`);
    if (thread.orderNumber) {
      lines.push(`Order: #${thread.orderNumber}`);
    }
    lines.push(`Status: ${thread.status}`);
    lines.push(`Started: ${new Date(thread.createdAt).toLocaleString()}`);
    lines.push(`Exported: ${new Date().toLocaleString()}`);
    lines.push('='.repeat(80));
    lines.push('');

    // Messages
    thread.messages.forEach((msg, index) => {
      if (index > 0) {
        lines.push('');
        lines.push('-'.repeat(80));
        lines.push('');
      }

      lines.push(`From: ${msg.senderName} (${msg.senderType})`);
      lines.push(`Date: ${new Date(msg.createdAt).toLocaleString()}`);
      lines.push(`Status: ${msg.status}`);
      if (msg.readAt) {
        lines.push(`Read: ${new Date(msg.readAt).toLocaleString()}`);
      }
      lines.push('');
      lines.push(msg.content);

      if (msg.attachments && msg.attachments.length > 0) {
        lines.push('');
        lines.push('Attachments:');
        msg.attachments.forEach((att) => {
          lines.push(`  - ${att.fileName} (${att.fileType}, ${(att.fileSize / 1024).toFixed(1)} KB)`);
          lines.push(`    URL: ${att.fileUrl}`);
        });
      }
    });

    lines.push('');
    lines.push('='.repeat(80));
    lines.push(`Total Messages: ${thread.messages.length}`);
    lines.push('='.repeat(80));

    return lines.join('\n');
  };

  const formatOptions: Array<{ value: ExportFormat; label: string; description: string }> = [
    {
      value: 'text',
      label: 'Plain Text (.txt)',
      description: 'Human-readable text format, best for reading and printing',
    },
    {
      value: 'csv',
      label: 'CSV Spreadsheet (.csv)',
      description: 'Import into Excel or Google Sheets for analysis',
    },
    {
      value: 'json',
      label: 'JSON Data (.json)',
      description: 'Structured data format for technical use or archival',
    },
  ];

  return (
    <div className="export-overlay">
      <div className="export-modal">
        <div className="export-modal-header">
          <h3>Export Conversation</h3>
          <button className="export-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="export-modal-body">
          <div className="export-conversation-info">
            <h4>{thread.subject}</h4>
            <p>
              {thread.spaName} • {thread.messages.length} message{thread.messages.length !== 1 ? 's' : ''}
            </p>
            {thread.orderNumber && <p className="export-order-num">Order #{thread.orderNumber}</p>}
          </div>

          <div className="export-format-selection">
            <h4>Select Format</h4>
            <div className="export-format-options">
              {formatOptions.map((option) => (
                <label key={option.value} className="export-format-option">
                  <input
                    type="radio"
                    name="exportFormat"
                    value={option.value}
                    checked={selectedFormat === option.value}
                    onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
                  />
                  <div className="format-option-content">
                    <div className="format-option-label">{option.label}</div>
                    <div className="format-option-description">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="export-modal-footer">
          <button className="export-cancel-btn" onClick={onClose} disabled={exporting}>
            Cancel
          </button>
          <button className="export-download-btn" onClick={handleExport} disabled={exporting}>
            {exporting ? '⏳ Exporting...' : '⬇️ Download'}
          </button>
        </div>
      </div>
    </div>
  );
}
