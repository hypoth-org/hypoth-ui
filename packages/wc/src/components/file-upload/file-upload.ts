/**
 * FileUpload component for file selection with drag-and-drop support.
 *
 * @element ds-file-upload
 * @fires ds:change - Fired when files change with { files }
 * @fires ds:error - Fired on validation error
 *
 * @slot - Custom dropzone content
 * @slot file-list - Custom file list rendering
 *
 * @example
 * ```html
 * <!-- Basic file upload -->
 * <ds-file-upload accept="image/*" max-size="5242880"></ds-file-upload>
 *
 * <!-- Multiple files -->
 * <ds-file-upload multiple max-files="5"></ds-file-upload>
 *
 * <!-- Custom content -->
 * <ds-file-upload>
 *   <span slot="dropzone">Drop your files here</span>
 * </ds-file-upload>
 * ```
 */

import {
  type FileInfo,
  type FileUploadBehavior,
  createFileUploadBehavior,
  formatBytes,
} from "@ds/primitives-dom";
import { html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export class DsFileUpload extends DSElement {
  /** Accepted file types (MIME types or extensions) */
  @property({ type: String, reflect: true })
  accept = "";

  /** Maximum number of files */
  @property({ type: Number, reflect: true, attribute: "max-files" })
  maxFiles = Number.POSITIVE_INFINITY;

  /** Maximum file size in bytes */
  @property({ type: Number, reflect: true, attribute: "max-size" })
  maxSize: number | undefined = undefined;

  /** Minimum file size in bytes */
  @property({ type: Number, reflect: true, attribute: "min-size" })
  minSize: number | undefined = undefined;

  /** Allow multiple files */
  @property({ type: Boolean, reflect: true })
  multiple = false;

  /** Disabled state */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Show file list */
  @property({ type: Boolean, attribute: "show-file-list" })
  showFileList = true;

  /** Show remove buttons in file list */
  @property({ type: Boolean, attribute: "show-remove" })
  showRemove = true;

  /** ARIA label */
  @property({ type: String, attribute: "aria-label" })
  override ariaLabel: string | null = null;

  @state()
  private behavior: FileUploadBehavior | null = null;

  @state()
  private files: FileInfo[] = [];

  @state()
  private isDragging = false;

  @state()
  private announcement = "";

  private inputRef: HTMLInputElement | null = null;
  private announcementTimeout: number | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.initBehavior();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.behavior?.destroy();
    this.behavior = null;
    if (this.announcementTimeout) {
      clearTimeout(this.announcementTimeout);
    }
  }

  private announce(message: string): void {
    // Clear previous announcement timeout
    if (this.announcementTimeout) {
      clearTimeout(this.announcementTimeout);
    }

    // Set the announcement
    this.announcement = message;

    // Clear the announcement after a delay to allow repeat announcements
    this.announcementTimeout = window.setTimeout(() => {
      this.announcement = "";
    }, 1000);
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (
      changedProperties.has("accept") ||
      changedProperties.has("maxFiles") ||
      changedProperties.has("maxSize") ||
      changedProperties.has("minSize") ||
      changedProperties.has("multiple") ||
      changedProperties.has("disabled")
    ) {
      this.initBehavior();
    }
  }

  private initBehavior(): void {
    // Preserve existing files
    const existingFiles = this.files;
    this.behavior?.destroy();

    this.behavior = createFileUploadBehavior({
      accept: this.accept,
      maxFiles: this.maxFiles,
      maxSize: this.maxSize,
      minSize: this.minSize,
      multiple: this.multiple,
      disabled: this.disabled,
      onFilesChange: (files) => {
        const previousCount = this.files.length;
        const newCount = files.length;
        this.files = files;

        // Announce file changes for screen readers
        if (newCount > previousCount) {
          const added = newCount - previousCount;
          const lastFile = files[files.length - 1];
          this.announce(
            added === 1 && lastFile ? `${lastFile.name} added` : `${added} files added`
          );
        }

        emitEvent(this, StandardEvents.CHANGE, { detail: { files } });
      },
      onError: (error) => {
        emitEvent(this, "ds:error", { detail: error });
      },
    });

    // Restore files if re-initializing
    if (existingFiles.length > 0) {
      // Files are managed by behavior, need to re-add them
    }
  }

  /** Public method to get current files */
  getFiles(): FileInfo[] {
    return this.files;
  }

  /** Public method to clear all files */
  clearFiles(): void {
    this.behavior?.clearFiles();
  }

  /** Public method to remove a file */
  removeFile(id: string): void {
    this.behavior?.removeFile(id);
  }

  private handleClick(): void {
    if (this.disabled) return;
    this.inputRef?.click();
  }

  private handleInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.behavior?.addFiles(input.files);
      // Reset input so the same file can be selected again
      input.value = "";
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (this.behavior?.handleKeyDown(event)) {
      this.inputRef?.click();
    }
  }

  private handleDragEnter(event: DragEvent): void {
    this.behavior?.handleDragEnter(event);
    this.isDragging = this.behavior?.state.isDragging ?? false;
  }

  private handleDragLeave(event: DragEvent): void {
    this.behavior?.handleDragLeave(event);
    this.isDragging = this.behavior?.state.isDragging ?? false;
  }

  private handleDragOver(event: DragEvent): void {
    this.behavior?.handleDragOver(event);
  }

  private handleDrop(event: DragEvent): void {
    this.behavior?.handleDrop(event);
    this.isDragging = false;
  }

  private handleRemoveFile(id: string): void {
    const file = this.files.find((f) => f.id === id);
    if (file) {
      this.announce(`${file.name} removed`);
    }
    this.behavior?.removeFile(id);
  }

  private renderFileItem(file: FileInfo) {
    return html`
      <div
        class="ds-file-upload__file"
        data-status=${file.status}
      >
        ${
          file.preview
            ? html`<img
              class="ds-file-upload__preview"
              src=${file.preview}
              alt=${file.name}
            />`
            : html`<span class="ds-file-upload__file-icon" aria-hidden="true">📄</span>`
        }

        <div class="ds-file-upload__file-info">
          <span class="ds-file-upload__file-name">${file.name}</span>
          <span class="ds-file-upload__file-size">${formatBytes(file.size)}</span>
          ${
            file.status === "error"
              ? html`<span class="ds-file-upload__file-error">${file.error}</span>`
              : nothing
          }
          ${
            file.status === "uploading"
              ? html`<progress
                class="ds-file-upload__progress"
                value=${file.progress}
                max="100"
              ></progress>`
              : nothing
          }
        </div>

        ${
          this.showRemove && !this.disabled
            ? html`
              <button
                type="button"
                class="ds-file-upload__remove"
                aria-label="Remove ${file.name}"
                @click=${() => this.handleRemoveFile(file.id)}
              >
                ×
              </button>
            `
            : nothing
        }
      </div>
    `;
  }

  override render() {
    if (!this.behavior) return nothing;

    const dropzoneProps = this.behavior.getDropzoneProps();
    const inputProps = this.behavior.getInputProps();

    return html`
      <div class="ds-file-upload" data-disabled=${this.disabled || nothing}>
        <div
          class="ds-file-upload__dropzone"
          role=${dropzoneProps.role}
          tabindex=${dropzoneProps.tabIndex}
          aria-label=${this.ariaLabel || dropzoneProps["aria-label"]}
          aria-disabled=${dropzoneProps["aria-disabled"] ?? nothing}
          data-dragging=${this.isDragging || nothing}
          @click=${this.handleClick}
          @keydown=${this.handleKeyDown}
          @dragenter=${this.handleDragEnter}
          @dragleave=${this.handleDragLeave}
          @dragover=${this.handleDragOver}
          @drop=${this.handleDrop}
        >
          <slot>
            <span class="ds-file-upload__icon" aria-hidden="true">📁</span>
            <span class="ds-file-upload__text">
              ${
                this.isDragging
                  ? "Drop files here"
                  : this.multiple
                    ? "Drop files here or click to upload"
                    : "Drop file here or click to upload"
              }
            </span>
            ${
              this.accept
                ? html`<span class="ds-file-upload__hint">Accepted: ${this.accept}</span>`
                : nothing
            }
            ${
              this.maxSize
                ? html`<span class="ds-file-upload__hint">Max size: ${formatBytes(this.maxSize)}</span>`
                : nothing
            }
          </slot>

          <input
            class="ds-file-upload__input"
            type=${inputProps.type}
            accept=${inputProps.accept ?? nothing}
            ?multiple=${inputProps.multiple}
            ?disabled=${inputProps.disabled}
            aria-hidden=${inputProps["aria-hidden"]}
            tabindex=${inputProps.tabIndex}
            @change=${this.handleInputChange}
            .ref=${(el: HTMLInputElement | null) => {
              this.inputRef = el;
            }}
          />
        </div>

        ${
          this.showFileList && this.files.length > 0
            ? html`
              <div class="ds-file-upload__list" role="list" aria-label="Selected files">
                <slot name="file-list">
                  ${this.files.map((file) => this.renderFileItem(file))}
                </slot>
              </div>
            `
            : nothing
        }

        <!-- ARIA live region for announcements -->
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          class="ds-file-upload__announcer"
        >
          ${this.announcement}
        </div>
      </div>
    `;
  }
}

define("ds-file-upload", DsFileUpload);

declare global {
  interface HTMLElementTagNameMap {
    "ds-file-upload": DsFileUpload;
  }
}
