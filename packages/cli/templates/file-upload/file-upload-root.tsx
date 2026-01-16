/**
 * FileUpload Root component - provides context to all FileUpload compound components.
 */

import { type FileInfo, type FileUploadError, createFileUploadBehavior } from "@hypoth-ui/primitives-dom";
import { type ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { FileUploadProvider } from "./file-upload-context.js";

export interface FileUploadRootProps {
  /** FileUpload content */
  children?: ReactNode;
  /** Accepted file types (MIME types or extensions) */
  accept?: string;
  /** Maximum number of files */
  maxFiles?: number;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Minimum file size in bytes */
  minSize?: number;
  /** Allow multiple files */
  multiple?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Called when files are added */
  onFilesAdd?: (files: FileInfo[]) => void;
  /** Called when a file is removed */
  onFileRemove?: (file: FileInfo) => void;
  /** Called when files change */
  onFilesChange?: (files: FileInfo[]) => void;
  /** Called on validation error */
  onError?: (error: FileUploadError) => void;
}

/**
 * Root component for FileUpload compound pattern.
 * Provides context to Dropzone, Input, FileList, and Item components.
 *
 * @example
 * ```tsx
 * <FileUpload.Root accept="image/*" maxSize={5242880} onFilesChange={(files) => console.log(files)}>
 *   <FileUpload.Dropzone>
 *     <p>Drop files here or click to upload</p>
 *   </FileUpload.Dropzone>
 *   <FileUpload.FileList />
 * </FileUpload.Root>
 * ```
 */
export function FileUploadRoot({
  children,
  accept = "",
  maxFiles = Number.POSITIVE_INFINITY,
  maxSize,
  minSize,
  multiple = false,
  disabled = false,
  onFilesAdd,
  onFileRemove,
  onFilesChange,
  onError,
}: FileUploadRootProps) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Create behavior instance
  // biome-ignore lint/correctness/useExhaustiveDependencies: behavior is created once
  const behavior = useMemo(
    () =>
      createFileUploadBehavior({
        accept,
        maxFiles,
        maxSize,
        minSize,
        multiple,
        disabled,
        onFilesAdd: (files) => {
          onFilesAdd?.(files);
        },
        onFileRemove: (file) => {
          onFileRemove?.(file);
        },
        onFilesChange: (files) => {
          setFiles(files);
          onFilesChange?.(files);
        },
        onError: (error) => {
          onError?.(error);
        },
      }),
    []
  );

  const openFileDialog = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const contextValue = useMemo(
    () => ({
      behavior,
      files,
      isDragging,
      setIsDragging,
      inputRef,
      openFileDialog,
      disabled,
    }),
    [behavior, files, isDragging, openFileDialog, disabled]
  );

  return <FileUploadProvider value={contextValue}>{children}</FileUploadProvider>;
}

FileUploadRoot.displayName = "FileUpload.Root";
