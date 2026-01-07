/**
 * FileUpload context for compound component pattern.
 */

import type { FileInfo, FileUploadBehavior } from "@ds/primitives-dom";
import { createCompoundContext } from "../../utils/create-context.js";

export interface FileUploadContextValue {
  /** FileUpload behavior instance */
  behavior: FileUploadBehavior;
  /** Current files */
  files: FileInfo[];
  /** Is dragging over dropzone */
  isDragging: boolean;
  /** Set dragging state */
  setIsDragging: (dragging: boolean) => void;
  /** Input ref for triggering file dialog */
  inputRef: React.RefObject<HTMLInputElement>;
  /** Open file dialog */
  openFileDialog: () => void;
  /** Disabled state */
  disabled: boolean;
}

export const [FileUploadProvider, useFileUploadContext] =
  createCompoundContext<FileUploadContextValue>("FileUpload");
