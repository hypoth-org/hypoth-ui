import { type TemplateResult, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export type AlertVariant = "info" | "success" | "warning" | "error";

/**
 * SVG icons for different alert variants
 */
const VARIANT_ICONS: Record<AlertVariant, TemplateResult> = {
  info: html`<svg class="ds-alert__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
  </svg>`,
  success: html`<svg class="ds-alert__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
  </svg>`,
  warning: html`<svg class="ds-alert__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
  </svg>`,
  error: html`<svg class="ds-alert__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
  </svg>`,
};

const CLOSE_ICON = html`<svg class="ds-alert__close-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
</svg>`;

/**
 * Alert component for contextual feedback messages.
 *
 * @element ds-alert
 * @slot - Default slot for alert description/content
 * @slot icon - Custom icon content
 * @slot action - Action button slot
 *
 * @fires ds:close - Fired when close button is clicked
 *
 * @csspart alert - The alert container
 * @csspart icon - The icon container
 * @csspart content - The content container
 * @csspart title - The title element
 * @csspart description - The description slot container
 * @csspart close - The close button
 *
 * @cssprop --ds-alert-bg - Background color
 * @cssprop --ds-alert-fg - Text color
 * @cssprop --ds-alert-border - Border color
 * @cssprop --ds-alert-icon - Icon color
 */
export class DsAlert extends DSElement {
  static override styles = [];

  /**
   * The visual variant of the alert.
   */
  @property({ type: String, reflect: true })
  variant: AlertVariant = "info";

  /**
   * The alert title.
   */
  @property({ type: String })
  alertTitle = "";

  /**
   * Whether the alert can be closed.
   */
  @property({ type: Boolean, reflect: true })
  closable = false;

  /**
   * Hide the default icon.
   */
  @property({ type: Boolean, attribute: "hide-icon" })
  hideIcon = false;

  private handleClose(): void {
    emitEvent(this, "ds:close", {});
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "Escape" && this.closable) {
      this.handleClose();
    }
  }

  /**
   * Get the ARIA role based on variant.
   * Error and warning use 'alert' for immediate announcement.
   * Info and success use 'status' for polite announcement.
   */
  private getRole(): "alert" | "status" {
    return this.variant === "error" || this.variant === "warning"
      ? "alert"
      : "status";
  }

  override render(): TemplateResult {
    const classes = {
      "ds-alert": true,
    };

    return html`
      <div
        part="alert"
        class=${classMap(classes)}
        role=${this.getRole()}
        aria-live=${this.getRole() === "alert" ? "assertive" : "polite"}
        data-variant=${this.variant}
        ?data-closable=${this.closable}
        @keydown=${this.handleKeyDown}
      >
        ${!this.hideIcon
          ? html`
              <slot name="icon">
                ${VARIANT_ICONS[this.variant]}
              </slot>
            `
          : nothing}

        <div part="content" class="ds-alert__content">
          ${this.alertTitle
            ? html`<p part="title" class="ds-alert__title">${this.alertTitle}</p>`
            : nothing}

          <div part="description" class="ds-alert__description">
            <slot></slot>
          </div>

          <slot name="action" class="ds-alert__action"></slot>
        </div>

        ${this.closable
          ? html`
              <button
                part="close"
                class="ds-alert__close"
                type="button"
                aria-label="Dismiss alert"
                @click=${this.handleClose}
              >
                ${CLOSE_ICON}
              </button>
            `
          : nothing}
      </div>
    `;
  }
}

// Register the component
define("ds-alert", DsAlert);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-alert": DsAlert;
  }
}
