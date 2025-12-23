import { useState, useRef } from 'react';
import {
  validateFiles,
  isImageFile,
  getFileIcon,
  truncateFileName,
  createImagePreview,
  MAX_FILES_PER_MESSAGE,
} from '../utils/fileUpload';
import { formatFileSize } from '../types/messages';
import './FileUploadButton.css';

export interface FileWithPreview {
  file: File;
  preview?: string;
}

export interface FileUploadButtonProps {
  selectedFiles: FileWithPreview[];
  onFilesSelected: (files: FileWithPreview[]) => void;
  disabled?: boolean;
}

export function FileUploadButton({ selectedFiles, onFilesSelected, disabled }: FileUploadButtonProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const validation = validateFiles([...selectedFiles.map((f) => f.file), ...files]);

    if (validation.errors.length > 0) {
      setErrors(validation.errors.map((err) => `${err.file.name}: ${err.error}`));
      return;
    }

    // Create previews for image files
    const filesWithPreviews: FileWithPreview[] = await Promise.all(
      validation.valid.slice(selectedFiles.length).map(async (file) => {
        if (isImageFile(file)) {
          try {
            const preview = await createImagePreview(file);
            return { file, preview };
          } catch {
            return { file };
          }
        }
        return { file };
      })
    );

    onFilesSelected([...selectedFiles, ...filesWithPreviews]);
    setErrors([]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    onFilesSelected(newFiles);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const canAddMore = selectedFiles.length < MAX_FILES_PER_MESSAGE;

  return (
    <div className="file-upload-container">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled || !canAddMore}
      />

      <button
        type="button"
        className="file-upload-btn"
        onClick={handleClick}
        disabled={disabled || !canAddMore}
        title={canAddMore ? 'Attach files' : `Maximum ${MAX_FILES_PER_MESSAGE} files allowed`}
      >
        📎 {selectedFiles.length > 0 ? `${selectedFiles.length} file(s)` : 'Attach'}
      </button>

      {errors.length > 0 && (
        <div className="file-upload-errors">
          {errors.map((error, i) => (
            <div key={i} className="file-upload-error">
              ⚠️ {error}
            </div>
          ))}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="file-previews">
          {selectedFiles.map((fileWithPreview, index) => (
            <FilePreview
              key={index}
              fileWithPreview={fileWithPreview}
              onRemove={() => handleRemoveFile(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FilePreviewProps {
  fileWithPreview: FileWithPreview;
  onRemove: () => void;
}

function FilePreview({ fileWithPreview, onRemove }: FilePreviewProps) {
  const { file, preview } = fileWithPreview;
  const isImage = isImageFile(file);

  return (
    <div className="file-preview">
      <button type="button" className="file-preview-remove" onClick={onRemove} title="Remove file">
        ✕
      </button>

      {isImage && preview ? (
        <div className="file-preview-image">
          <img src={preview} alt={file.name} />
        </div>
      ) : (
        <div className="file-preview-icon">{getFileIcon(file.type)}</div>
      )}

      <div className="file-preview-info">
        <div className="file-preview-name" title={file.name}>
          {truncateFileName(file.name, 25)}
        </div>
        <div className="file-preview-size">{formatFileSize(file.size)}</div>
      </div>
    </div>
  );
}
