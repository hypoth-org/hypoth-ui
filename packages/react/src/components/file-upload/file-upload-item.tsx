/**
 * FileUpload Item component - individual file display.
 */

import { type FileInfo, formatBytes } from "@ds/primitives-dom";
import { type HTMLAttributes, type ReactNode, forwardRef, useCallback } from "react";
import { useFileUploadContext } from "./file-upload-context.js";

export interface FileUploadItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** The file info to display */
  file: FileInfo;
  /** Custom render function for file content */
  children?: ReactNode | ((file: FileInfo) => ReactNode);
}

/**
 * Individual file item display with progress and remove functionality.
 *
 * @example
 * ```tsx
 * {files.map(file => (
 *   <FileUpload.Item key={file.id} file={file} />
 * ))}
 *
 * // With custom content
 * <FileUpload.Item file={file}>
 *   {(f) => <span>{f.name} - {formatBytes(f.size)}</span>}
 * </FileUpload.Item>
 * ```
 */
export const FileUploadItem = forwardRef<HTMLDivElement, FileUploadItemProps>(
  ({ file, children, className, ...restProps }, ref) => {
    const { behavior, disabled } = useFileUploadContext("FileUpload.Item");

    const handleRemove = useCallback(() => {
      behavior.removeFile(file.id);
    }, [behavior, file.id]);

    const renderContent = () => {
      if (typeof children === "function") {
        return children(file);
      }

      if (children) {
        return children;
      }

      // Default rendering
      return (
        <>
          {file.preview && (
            <img
              src={file.preview}
              alt={file.name}
              style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
            />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {file.name}
            </div>
            <div style={{ fontSize: "0.875em", opacity: 0.7 }}>
              {formatBytes(file.size)}
              {file.status === "error" && file.error && (
                <span style={{ color: "var(--ds-color-error, red)", marginLeft: 8 }}>
                  {file.error}
                </span>
              )}
            </div>
            {file.status === "uploading" && (
              <progress value={file.progress} max={100} style={{ width: "100%" }} />
            )}
          </div>
          {!disabled && (
            <button
              type="button"
              aria-label={`Remove ${file.name}`}
              onClick={handleRemove}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                opacity: 0.7,
              }}
            >
              ×
            </button>
          )}
        </>
      );
    };

    return (
      <div ref={ref} className={className} data-status={file.status} role="listitem" {...restProps}>
        {renderContent()}
      </div>
    );
  }
);

FileUploadItem.displayName = "FileUpload.Item";

// Re-export formatBytes for convenience
export { formatBytes };
