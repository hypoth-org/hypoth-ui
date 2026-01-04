import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export type TextareaSize = "sm" | "md" | "lg";

/**
 * A textarea component with optional auto-resize.
 *
 * @element ds-textarea
 * @fires input - Fired when the textarea value changes
 * @fires ds:change - Fired when the textarea value is committed
 *
 * @example
 * ```html
 * <ds-field>
 *   <ds-label>Description</ds-label>
 *   <ds-textarea placeholder="Enter description..."></ds-textarea>
 * </ds-field>
 * ```
 */
export class DsTextarea extends DSElement {
  /** Textarea size */
  @property({ type: String, reflect: true })
  size: TextareaSize = "md";

  /** Textarea name */
  @property({ type: String, reflect: true })
  name = "";

  /** Textarea value */
  @property({ type: String })
  value = "";

  /** Placeholder text */
  @property({ type: String })
  placeholder = "";

  /** Disabled state */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Read-only state */
  @property({ type: Boolean, reflect: true })
  readonly = false;

  /** Required state */
  @property({ type: Boolean, reflect: true })
  required = false;

  /** Error state */
  @property({ type: Boolean, reflect: true })
  error = false;

  /** Minimum length */
  @property({ type: Number })
  minlength?: number;

  /** Maximum length */
  @property({ type: Number })
  maxlength?: number;

  /** Number of visible text rows */
  @property({ type: Number })
  rows = 3;

  /** Minimum number of rows (for auto-resize) */
  @property({ type: Number })
  minRows = 3;

  /** Maximum number of rows (for auto-resize) */
  @property({ type: Number })
  maxRows?: number;

  /** Enable auto-resize behavior */
  @property({ type: Boolean })
  autoResize = true;

  /** ARIA labelledby - ID of element that labels this textarea */
  @state()
  private ariaLabelledBy?: string;

  /** ARIA describedby - IDs of elements that describe this textarea */
  @state()
  private ariaDescribedBy?: string;

  private attributeObserver: MutationObserver | null = null;
  private nativeTextarea: HTMLTextAreaElement | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    // Observe ARIA attribute changes on the host element
    this.attributeObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "attributes") {
          this.syncAriaAttributes();
        }
      }
    });

    this.attributeObserver.observe(this, {
      attributes: true,
      attributeFilter: ["aria-labelledby", "aria-describedby", "aria-invalid", "aria-required", "aria-disabled"],
    });

    // Initial sync
    this.syncAriaAttributes();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.attributeObserver?.disconnect();
    this.attributeObserver = null;
  }

  /**
   * Syncs ARIA attributes from the host element to internal state.
   * The render method will apply these to the native textarea.
   */
  private syncAriaAttributes(): void {
    this.ariaLabelledBy = this.getAttribute("aria-labelledby") ?? undefined;
    this.ariaDescribedBy = this.getAttribute("aria-describedby") ?? undefined;

    // Sync error state from aria-invalid
    const ariaInvalid = this.getAttribute("aria-invalid");
    if (ariaInvalid === "true") {
      this.error = true;
    } else if (ariaInvalid === "false") {
      this.error = false;
    }

    // Sync required state from aria-required
    const ariaRequired = this.getAttribute("aria-required");
    if (ariaRequired === "true") {
      this.required = true;
    }

    // Sync disabled state from aria-disabled
    const ariaDisabled = this.getAttribute("aria-disabled");
    if (ariaDisabled === "true") {
      this.disabled = true;
    }
  }

  private handleInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.value = textarea.value;

    // Auto-resize if enabled
    if (this.autoResize) {
      this.adjustHeight(textarea);
    }

    // Also emit native input event for compatibility
    this.dispatchEvent(
      new CustomEvent("input", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleChange(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.value = textarea.value;
    // Emit ds:change event using standard convention
    emitEvent(this, StandardEvents.CHANGE, {
      detail: { value: this.value },
    });
  }

  /**
   * Adjusts the textarea height based on content.
   */
  private adjustHeight(textarea: HTMLTextAreaElement): void {
    // Reset height to calculate scrollHeight
    textarea.style.height = "auto";

    // Calculate line height from computed styles
    const computedStyle = getComputedStyle(textarea);
    const lineHeight = parseFloat(computedStyle.lineHeight) || 20;
    const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
    const borderTop = parseFloat(computedStyle.borderTopWidth) || 0;
    const borderBottom = parseFloat(computedStyle.borderBottomWidth) || 0;

    // Calculate min and max heights based on rows
    const minHeight = this.minRows * lineHeight + paddingTop + paddingBottom + borderTop + borderBottom;
    const maxHeight = this.maxRows
      ? this.maxRows * lineHeight + paddingTop + paddingBottom + borderTop + borderBottom
      : Number.POSITIVE_INFINITY;

    // Set height within bounds
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${newHeight}px`;

    // Enable scrolling if maxRows is set and content exceeds it
    textarea.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    // Get reference to native textarea
    if (!this.nativeTextarea) {
      this.nativeTextarea = this.querySelector("textarea");
    }

    // Adjust height when value changes and auto-resize is enabled
    if (changedProperties.has("value") && this.autoResize && this.nativeTextarea) {
      this.adjustHeight(this.nativeTextarea);
    }
  }

  /**
   * Returns the effective number of rows.
   */
  private getEffectiveRows(): number {
    return Math.max(this.rows, this.minRows);
  }

  override render() {
    return html`
      <div class="ds-textarea" part="container" data-size=${this.size}>
        <textarea
          part="textarea"
          class="ds-textarea__field"
          name=${this.name}
          .value=${this.value}
          placeholder=${this.placeholder}
          .rows=${this.getEffectiveRows()}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          ?required=${this.required}
          aria-invalid=${this.error ? "true" : "false"}
          aria-labelledby=${ifDefined(this.ariaLabelledBy)}
          aria-describedby=${ifDefined(this.ariaDescribedBy)}
          aria-required=${this.required ? "true" : "false"}
          minlength=${ifDefined(this.minlength)}
          maxlength=${ifDefined(this.maxlength)}
          @input=${this.handleInput}
          @change=${this.handleChange}
        ></textarea>
      </div>
    `;
  }
}

define("ds-textarea", DsTextarea);

declare global {
  interface HTMLElementTagNameMap {
    "ds-textarea": DsTextarea;
  }
}
