/**
 * FileUpload compound component for file selection and uploads.
 *
 * @example
 * ```tsx
 * // Basic file upload
 * <FileUpload.Root accept="image/*" maxSize={5242880} onFilesChange={(files) => console.log(files)}>
 *   <FileUpload.Input />
 *   <FileUpload.Dropzone className="dropzone">
 *     <p>Drop files here or click to upload</p>
 *   </FileUpload.Dropzone>
 *   {files.map(file => (
 *     <FileUpload.Item key={file.id} file={file} />
 *   ))}
 * </FileUpload.Root>
 *
 * // Multiple files with custom styling
 * <FileUpload.Root multiple maxFiles={5}>
 *   <FileUpload.Input />
 *   <FileUpload.Dropzone>
 *     <UploadIcon />
 *     <p>Drag and drop files here</p>
 *   </FileUpload.Dropzone>
 * </FileUpload.Root>
 * ```
 */

export { FileUploadRoot, type FileUploadRootProps } from "./file-upload-root.js";
export { FileUploadDropzone, type FileUploadDropzoneProps } from "./file-upload-dropzone.js";
export { FileUploadInput, type FileUploadInputProps } from "./file-upload-input.js";
export { FileUploadItem, type FileUploadItemProps, formatBytes } from "./file-upload-item.js";
export {
  useFileUploadContext,
  type FileUploadContextValue,
} from "./file-upload-context.js";

// Re-export types from primitives
export type { FileInfo, FileUploadError } from "@ds/primitives-dom";

export const FileUpload = {
  Root: FileUploadRoot,
  Dropzone: FileUploadDropzone,
  Input: FileUploadInput,
  Item: FileUploadItem,
} as const;

import { FileUploadDropzone } from "./file-upload-dropzone.js";
import { FileUploadInput } from "./file-upload-input.js";
import { FileUploadItem } from "./file-upload-item.js";
import { FileUploadRoot } from "./file-upload-root.js";
