import { type TemplateResult, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export type TagVariant =
  | "neutral"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";
export type TagSize = "sm" | "md" | "lg";

// Close icon SVG
const closeIcon = html`
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
`;

/**
 * Tag component for categorization with optional remove action.
 *
 * @element ds-tag
 *
 * @slot - Tag content
 * @slot icon - Optional leading icon
 *
 * @fires ds-remove - When the remove button is clicked
 * @fires ds-click - When the tag is clicked (if clickable)
 *
 * @cssprop --ds-tag-bg - Background color
 * @cssprop --ds-tag-color - Text color
 */
export class DsTag extends DSElement {
  static override styles = [];

  /**
   * Color variant.
   */
  @property({ type: String, reflect: true })
  variant: TagVariant = "neutral";

  /**
   * Size variant.
   */
  @property({ type: String, reflect: true })
  size: TagSize = "md";

  /**
   * Use solid (filled) style instead of subtle.
   */
  @property({ type: Boolean, reflect: true })
  solid = false;

  /**
   * Show remove button.
   */
  @property({ type: Boolean, reflect: true })
  removable = false;

  /**
   * Make tag clickable/interactive.
   */
  @property({ type: Boolean, reflect: true })
  clickable = false;

  /**
   * Disable the tag.
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Value for identification in events.
   */
  @property({ type: String })
  value = "";

  private handleRemove(event: Event): void {
    event.stopPropagation();
    if (this.disabled) return;

    emitEvent(this, "remove", {
      detail: { value: this.value },
    });
  }

  private handleClick(): void {
    if (!this.clickable || this.disabled) return;

    emitEvent(this, "click", {
      detail: { value: this.value },
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      if (this.clickable) {
        event.preventDefault();
        this.handleClick();
      }
    } else if (event.key === "Backspace" || event.key === "Delete") {
      if (this.removable) {
        event.preventDefault();
        emitEvent(this, "remove", { detail: { value: this.value } });
      }
    }
  }

  override render(): TemplateResult {
    const classes = {
      "ds-tag": true,
    };

    return html`
      <span
        class=${classMap(classes)}
        role=${this.clickable ? "button" : "status"}
        tabindex=${this.clickable && !this.disabled ? 0 : nothing}
        data-variant=${this.variant}
        data-size=${this.size !== "md" ? this.size : nothing}
        ?data-solid=${this.solid}
        ?data-clickable=${this.clickable}
        ?data-disabled=${this.disabled}
        aria-disabled=${this.disabled ? "true" : nothing}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <slot name="icon"></slot>
        <slot></slot>
        ${
          this.removable
            ? html`
              <button
                type="button"
                class="ds-tag__remove"
                aria-label="Remove"
                ?disabled=${this.disabled}
                @click=${this.handleRemove}
              >
                ${closeIcon}
              </button>
            `
            : nothing
        }
      </span>
    `;
  }
}

// Register the component
define("ds-tag", DsTag);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-tag": DsTag;
  }
}
