/**
 * FileUpload behavior primitive.
 * Manages file selection, validation, drag-and-drop, and upload state.
 */

// =============================================================================
// Types
// =============================================================================

export interface FileInfo {
  /** Original File object */
  file: File;
  /** Unique ID for tracking */
  id: string;
  /** File name */
  name: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  type: string;
  /** Upload progress (0-100) */
  progress: number;
  /** Upload status */
  status: "pending" | "uploading" | "success" | "error";
  /** Error message if status is error */
  error?: string;
  /** Preview URL (for images) */
  preview?: string;
}

export interface FileUploadBehaviorOptions {
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
  /** Allow drag and drop */
  dragDrop?: boolean;
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
  /** Custom ID generator */
  generateId?: () => string;
}

export interface FileUploadError {
  type: "too-many-files" | "file-too-large" | "file-too-small" | "invalid-type";
  message: string;
  file?: File;
}

export interface FileUploadBehaviorState {
  files: FileInfo[];
  isDragging: boolean;
  disabled: boolean;
  multiple: boolean;
  accept: string;
  maxFiles: number;
  maxSize: number | null;
  minSize: number | null;
}

export interface FileUploadDropzoneProps {
  role: "button";
  tabIndex: number;
  "aria-disabled"?: boolean;
  "aria-label": string;
}

export interface FileUploadInputProps {
  type: "file";
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  "aria-hidden": boolean;
  tabIndex: -1;
}

export interface FileUploadBehavior {
  /** Current state */
  readonly state: FileUploadBehaviorState;

  /** Add files from input or drop */
  addFiles(files: FileList | File[]): void;

  /** Remove a file by ID */
  removeFile(id: string): void;

  /** Clear all files */
  clearFiles(): void;

  /** Update file progress */
  updateProgress(id: string, progress: number): void;

  /** Update file status */
  updateStatus(id: string, status: FileInfo["status"], error?: string): void;

  /** Handle drag enter */
  handleDragEnter(event: DragEvent): void;

  /** Handle drag leave */
  handleDragLeave(event: DragEvent): void;

  /** Handle drag over */
  handleDragOver(event: DragEvent): void;

  /** Handle drop */
  handleDrop(event: DragEvent): void;

  /** Handle keyboard activation */
  handleKeyDown(event: KeyboardEvent): boolean;

  /** Validate a file */
  validateFile(file: File): FileUploadError | null;

  /** Get dropzone props */
  getDropzoneProps(): FileUploadDropzoneProps;

  /** Get hidden input props */
  getInputProps(): FileUploadInputProps;

  /** Cleanup */
  destroy(): void;
}

// =============================================================================
// Implementation
// =============================================================================

let idCounter = 0;

function defaultGenerateId(): string {
  return `file-${++idCounter}-${Date.now()}`;
}

/**
 * Format bytes to human readable string.
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Check if a file type matches an accept pattern.
 */
function matchesAccept(file: File, accept: string): boolean {
  if (!accept) return true;

  const patterns = accept.split(",").map((p) => p.trim().toLowerCase());

  return patterns.some((pattern) => {
    // Handle extension patterns like ".jpg"
    if (pattern.startsWith(".")) {
      return file.name.toLowerCase().endsWith(pattern);
    }

    // Handle MIME type patterns like "image/*" or "image/jpeg"
    const [type, subtype] = pattern.split("/");
    const [fileType] = file.type.toLowerCase().split("/");

    if (subtype === "*") {
      return type === fileType;
    }

    return pattern === file.type.toLowerCase();
  });
}

/**
 * Creates a file upload behavior primitive.
 *
 * @example
 * ```ts
 * const uploader = createFileUploadBehavior({
 *   accept: 'image/*,.pdf',
 *   maxFiles: 5,
 *   maxSize: 10 * 1024 * 1024, // 10MB
 *   onFilesChange: (files) => console.log('Files:', files),
 * });
 * ```
 */
export function createFileUploadBehavior(
  options: FileUploadBehaviorOptions = {}
): FileUploadBehavior {
  const {
    accept = "",
    maxFiles = Number.POSITIVE_INFINITY,
    maxSize = null,
    minSize = null,
    multiple = false,
    dragDrop = true,
    disabled = false,
    onFilesAdd,
    onFileRemove,
    onFilesChange,
    onError,
    generateId = defaultGenerateId,
  } = options;

  // Internal state
  let state: FileUploadBehaviorState = {
    files: [],
    isDragging: false,
    disabled,
    multiple,
    accept,
    maxFiles,
    maxSize,
    minSize,
  };

  // Track drag counter for nested elements
  let dragCounter = 0;

  // Helpers
  function validateFile(file: File): FileUploadError | null {
    // Check file type
    if (accept && !matchesAccept(file, accept)) {
      return {
        type: "invalid-type",
        message: `File type "${file.type || "unknown"}" is not accepted`,
        file,
      };
    }

    // Check max size
    if (maxSize !== null && file.size > maxSize) {
      return {
        type: "file-too-large",
        message: `File size (${formatBytes(file.size)}) exceeds maximum (${formatBytes(maxSize)})`,
        file,
      };
    }

    // Check min size
    if (minSize !== null && file.size < minSize) {
      return {
        type: "file-too-small",
        message: `File size (${formatBytes(file.size)}) is below minimum (${formatBytes(minSize)})`,
        file,
      };
    }

    return null;
  }

  function createFileInfo(file: File): FileInfo {
    const info: FileInfo = {
      file,
      id: generateId(),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: "pending",
    };

    // Create preview for images
    if (file.type.startsWith("image/")) {
      info.preview = URL.createObjectURL(file);
    }

    return info;
  }

  function addFiles(files: FileList | File[]): void {
    if (state.disabled) return;

    const fileArray = Array.from(files);
    const validFiles: FileInfo[] = [];

    // Check max files constraint
    const availableSlots = maxFiles - state.files.length;
    if (availableSlots <= 0) {
      onError?.({
        type: "too-many-files",
        message: `Maximum of ${maxFiles} files allowed`,
      });
      return;
    }

    const filesToProcess = multiple ? fileArray.slice(0, availableSlots) : [fileArray[0]];

    for (const file of filesToProcess) {
      if (!file) continue;

      const error = validateFile(file);
      if (error) {
        onError?.(error);
        continue;
      }

      validFiles.push(createFileInfo(file));
    }

    if (validFiles.length === 0) return;

    // In single mode, replace existing file
    if (!multiple) {
      // Revoke old preview URLs
      for (const f of state.files) {
        if (f.preview) URL.revokeObjectURL(f.preview);
      }
      state = { ...state, files: validFiles };
    } else {
      state = { ...state, files: [...state.files, ...validFiles] };
    }

    onFilesAdd?.(validFiles);
    onFilesChange?.(state.files);
  }

  function removeFile(id: string): void {
    const file = state.files.find((f) => f.id === id);
    if (!file) return;

    // Revoke preview URL
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }

    state = {
      ...state,
      files: state.files.filter((f) => f.id !== id),
    };

    onFileRemove?.(file);
    onFilesChange?.(state.files);
  }

  function clearFiles(): void {
    // Revoke all preview URLs
    for (const file of state.files) {
      if (file.preview) URL.revokeObjectURL(file.preview);
    }

    state = { ...state, files: [] };
    onFilesChange?.(state.files);
  }

  function updateProgress(id: string, progress: number): void {
    const fileIndex = state.files.findIndex((f) => f.id === id);
    if (fileIndex === -1) return;

    const existingFile = state.files[fileIndex];
    const updatedFiles = [...state.files];
    updatedFiles[fileIndex] = {
      ...existingFile,
      progress: Math.min(100, Math.max(0, progress)),
    } as FileInfo;

    state = { ...state, files: updatedFiles };
  }

  function updateStatus(id: string, status: FileInfo["status"], error?: string): void {
    const fileIndex = state.files.findIndex((f) => f.id === id);
    if (fileIndex === -1) return;

    const existingFile = state.files[fileIndex];
    if (!existingFile) return;

    const updatedFiles = [...state.files];
    updatedFiles[fileIndex] = {
      ...existingFile,
      status,
      error,
      progress: status === "success" ? 100 : existingFile.progress,
    } as FileInfo;

    state = { ...state, files: updatedFiles };
  }

  function handleDragEnter(event: DragEvent): void {
    if (state.disabled || !dragDrop) return;
    event.preventDefault();
    event.stopPropagation();

    dragCounter++;
    if (dragCounter === 1) {
      state = { ...state, isDragging: true };
    }
  }

  function handleDragLeave(event: DragEvent): void {
    if (state.disabled || !dragDrop) return;
    event.preventDefault();
    event.stopPropagation();

    dragCounter--;
    if (dragCounter === 0) {
      state = { ...state, isDragging: false };
    }
  }

  function handleDragOver(event: DragEvent): void {
    if (state.disabled || !dragDrop) return;
    event.preventDefault();
    event.stopPropagation();

    // Set dropEffect
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "copy";
    }
  }

  function handleDrop(event: DragEvent): void {
    if (state.disabled || !dragDrop) return;
    event.preventDefault();
    event.stopPropagation();

    dragCounter = 0;
    state = { ...state, isDragging: false };

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      addFiles(files);
    }
  }

  function handleKeyDown(event: KeyboardEvent): boolean {
    if (state.disabled) return false;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      return true; // Signal to trigger file input
    }

    return false;
  }

  function getDropzoneProps(): FileUploadDropzoneProps {
    const props: FileUploadDropzoneProps = {
      role: "button",
      tabIndex: state.disabled ? -1 : 0,
      "aria-label": multiple
        ? "Drop files here or click to upload"
        : "Drop file here or click to upload",
    };

    if (state.disabled) {
      props["aria-disabled"] = true;
    }

    return props;
  }

  function getInputProps(): FileUploadInputProps {
    const props: FileUploadInputProps = {
      type: "file",
      "aria-hidden": true,
      tabIndex: -1,
    };

    if (accept) props.accept = accept;
    if (multiple) props.multiple = true;
    if (state.disabled) props.disabled = true;

    return props;
  }

  function destroy(): void {
    // Revoke all preview URLs
    for (const file of state.files) {
      if (file.preview) URL.revokeObjectURL(file.preview);
    }
  }

  return {
    get state() {
      return state;
    },
    addFiles,
    removeFile,
    clearFiles,
    updateProgress,
    updateStatus,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleKeyDown,
    validateFile,
    getDropzoneProps,
    getInputProps,
    destroy,
  };
}
