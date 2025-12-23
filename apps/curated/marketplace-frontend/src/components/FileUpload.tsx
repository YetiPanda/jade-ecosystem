/**
 * File Upload Component
 * Week 8: Practitioner Verification System
 *
 * Features:
 * - Drag and drop file upload
 * - File preview with thumbnails
 * - Multiple file support
 * - File type validation
 * - File size validation
 * - Remove uploaded files
 */

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { X, Upload, FileText, Image as ImageIcon, Check } from 'lucide-react';
import { cn } from '../lib/utils';

export interface UploadedFile {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  documentType: string;
}

interface FileUploadProps {
  /** Accepted file types (e.g., 'image/*,.pdf') */
  accept?: string;

  /** Maximum file size in bytes */
  maxSize?: number;

  /** Maximum number of files */
  maxFiles?: number;

  /** Currently uploaded files */
  files: UploadedFile[];

  /** Callback when files are uploaded */
  onUpload: (files: File[]) => Promise<void>;

  /** Callback when a file is removed */
  onRemove: (fileId: string) => void;

  /** Upload label */
  label?: string;

  /** Help text */
  helpText?: string;

  /** Required field */
  required?: boolean;

  /** Loading state */
  loading?: boolean;
}

export function FileUpload({
  accept = 'image/*,.pdf',
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  files = [],
  onUpload,
  onRemove,
  label = 'Upload Files',
  helpText,
  required = false,
  loading = false,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError('');

      // Check for rejected files
      if (rejectedFiles.length > 0) {
        const reasons = rejectedFiles.map((r) => r.errors[0]?.message).join(', ');
        setError(reasons);
        return;
      }

      // Check max files
      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      try {
        setUploading(true);
        await onUpload(acceptedFiles);
      } catch (err: any) {
        setError(err.message || 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [files.length, maxFiles, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.split(',').reduce((acc, type) => {
      acc[type.trim()] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    disabled: loading || uploading,
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return ImageIcon;
    }
    return FileText;
  };

  return (
    <div className="space-y-4">
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {files.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {files.length} / {maxFiles} files
            </span>
          )}
        </div>
      )}

      {/* Help Text */}
      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}

      {/* Drop Zone */}
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
          isDragActive && 'border-primary bg-primary/5',
          !isDragActive && 'border-gray-300 hover:border-primary/50',
          (loading || uploading) && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm font-medium mb-1">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Accepts: {accept} • Max size: {formatFileSize(maxSize)}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Uploading State */}
      {uploading && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-600">Uploading files...</p>
        </div>
      )}

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => {
            const FileIcon = getFileIcon(file.mimeType);
            const isImage = file.mimeType.startsWith('image/');

            return (
              <Card key={file.id} className="p-3">
                <div className="flex items-center space-x-3">
                  {/* Thumbnail or Icon */}
                  <div className="flex-shrink-0">
                    {isImage ? (
                      <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden">
                        <img
                          src={file.url}
                          alt={file.filename}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                        <FileIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>

                  {/* Success Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(file.id)}
                      disabled={loading}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
