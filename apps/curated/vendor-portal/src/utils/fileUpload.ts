/**
 * File Upload Utilities
 *
 * Validation, size formatting, and type detection for message attachments
 */

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES_PER_MESSAGE = 5;

export const ALLOWED_FILE_TYPES = {
  // Images
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'image/webp': ['.webp'],

  // Documents
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'text/plain': ['.txt'],
  'text/csv': ['.csv'],

  // Archives
  'application/zip': ['.zip'],
  'application/x-rar-compressed': ['.rar'],
};

export const IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

export interface FileValidationError {
  file: File;
  error: string;
}

export interface FileValidationResult {
  valid: File[];
  errors: FileValidationError[];
}

/**
 * Validate files for attachment upload
 */
export function validateFiles(files: File[]): FileValidationResult {
  const valid: File[] = [];
  const errors: FileValidationError[] = [];

  // Check total count
  if (files.length > MAX_FILES_PER_MESSAGE) {
    return {
      valid: [],
      errors: [
        {
          file: files[0],
          error: `Maximum ${MAX_FILES_PER_MESSAGE} files allowed per message`,
        },
      ],
    };
  }

  for (const file of files) {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push({
        file,
        error: `File size exceeds 10MB limit`,
      });
      continue;
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES[file.type as keyof typeof ALLOWED_FILE_TYPES]) {
      errors.push({
        file,
        error: `File type not supported: ${file.type || 'unknown'}`,
      });
      continue;
    }

    valid.push(file);
  }

  return { valid, errors };
}

/**
 * Check if file is an image
 */
export function isImageFile(file: File | { fileType: string }): boolean {
  const type = 'type' in file ? file.type : file.fileType;
  return IMAGE_TYPES.has(type);
}

/**
 * Get file extension from filename
 */
export function getFileExtension(fileName: string): string {
  const parts = fileName.split('.');
  return parts.length > 1 ? `.${parts[parts.length - 1]}` : '';
}

/**
 * Get icon for file type
 */
export function getFileIcon(fileType: string): string {
  if (IMAGE_TYPES.has(fileType)) {
    return '🖼️';
  }

  if (fileType === 'application/pdf') {
    return '📄';
  }

  if (
    fileType === 'application/msword' ||
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return '📝';
  }

  if (
    fileType === 'application/vnd.ms-excel' ||
    fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    fileType === 'text/csv'
  ) {
    return '📊';
  }

  if (fileType === 'application/zip' || fileType === 'application/x-rar-compressed') {
    return '📦';
  }

  if (fileType === 'text/plain') {
    return '📃';
  }

  return '📎';
}

/**
 * Create preview URL for image files
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Truncate filename to max length
 */
export function truncateFileName(fileName: string, maxLength: number = 30): string {
  if (fileName.length <= maxLength) {
    return fileName;
  }

  const extension = getFileExtension(fileName);
  const nameWithoutExt = fileName.substring(0, fileName.length - extension.length);
  const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 3);

  return `${truncatedName}...${extension}`;
}
