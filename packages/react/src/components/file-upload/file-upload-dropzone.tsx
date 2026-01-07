/**
 * FileUpload Dropzone component - the drop target area.
 */

import {
  type DragEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  forwardRef,
  useCallback,
} from "react";
import { useFileUploadContext } from "./file-upload-context.js";

export interface FileUploadDropzoneProps extends HTMLAttributes<HTMLDivElement> {
  /** Dropzone content */
  children?: ReactNode;
}

/**
 * The dropzone area for drag-and-drop file uploads.
 * Also handles click-to-upload functionality.
 *
 * @example
 * ```tsx
 * <FileUpload.Dropzone className="dropzone">
 *   <p>Drop files here or click to upload</p>
 * </FileUpload.Dropzone>
 * ```
 */
export const FileUploadDropzone = forwardRef<HTMLDivElement, FileUploadDropzoneProps>(
  ({ children, className, onClick, onKeyDown, ...restProps }, ref) => {
    const { behavior, isDragging, setIsDragging, openFileDialog, disabled } =
      useFileUploadContext("FileUpload.Dropzone");

    const dropzoneProps = behavior.getDropzoneProps();

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        openFileDialog();
        onClick?.(event);
      },
      [openFileDialog, onClick]
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        if (behavior.handleKeyDown(event.nativeEvent)) {
          openFileDialog();
        }
        onKeyDown?.(event);
      },
      [behavior, openFileDialog, onKeyDown]
    );

    const handleDragEnter = useCallback(
      (event: DragEvent<HTMLDivElement>) => {
        behavior.handleDragEnter(event.nativeEvent);
        setIsDragging(behavior.state.isDragging);
      },
      [behavior, setIsDragging]
    );

    const handleDragLeave = useCallback(
      (event: DragEvent<HTMLDivElement>) => {
        behavior.handleDragLeave(event.nativeEvent);
        setIsDragging(behavior.state.isDragging);
      },
      [behavior, setIsDragging]
    );

    const handleDragOver = useCallback(
      (event: DragEvent<HTMLDivElement>) => {
        behavior.handleDragOver(event.nativeEvent);
      },
      [behavior]
    );

    const handleDrop = useCallback(
      (event: DragEvent<HTMLDivElement>) => {
        behavior.handleDrop(event.nativeEvent);
        setIsDragging(false);
      },
      [behavior, setIsDragging]
    );

    return (
      <div
        ref={ref}
        role={dropzoneProps.role}
        tabIndex={dropzoneProps.tabIndex}
        aria-label={dropzoneProps["aria-label"]}
        aria-disabled={dropzoneProps["aria-disabled"]}
        className={className}
        data-dragging={isDragging || undefined}
        data-disabled={disabled || undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

FileUploadDropzone.displayName = "FileUpload.Dropzone";
