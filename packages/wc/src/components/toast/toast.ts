import { type TemplateResult, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";
import type { ToastState, ToastVariant } from "./toast-controller.js";

/**
 * SVG icons for different toast variants
 */
const VARIANT_ICONS: Record<ToastVariant, TemplateResult> = {
  info: html`<svg class="ds-toast__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
  </svg>`,
  success: html`<svg class="ds-toast__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
  </svg>`,
  warning: html`<svg class="ds-toast__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
  </svg>`,
  error: html`<svg class="ds-toast__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
  </svg>`,
};

const CLOSE_ICON = html`<svg class="ds-toast__close-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
</svg>`;

/**
 * Individual toast notification element.
 *
 * @element ds-toast
 * @slot action - Action button slot
 *
 * @fires ds:dismiss - Fired when toast is dismissed
 * @fires ds:pause - Fired when mouse enters (for pause)
 * @fires ds:resume - Fired when mouse leaves (for resume)
 */
export class DsToast extends DSElement {
  static override styles = [];

  /**
   * Unique toast ID
   */
  @property({ type: String, reflect: true })
  toastId = "";

  /**
   * Toast title
   */
  @property({ type: String })
  toastTitle = "";

  /**
   * Toast description
   */
  @property({ type: String })
  description = "";

  /**
   * Visual variant
   */
  @property({ type: String, reflect: true })
  variant: ToastVariant = "info";

  /**
   * Current state
   */
  @property({ type: String, reflect: true })
  toastState: ToastState = "entering";

  /**
   * Duration for progress bar (0 = no progress)
   */
  @property({ type: Number })
  duration = 5000;

  /**
   * Hide the icon
   */
  @property({ type: Boolean, attribute: "hide-icon" })
  hideIcon = false;

  @state()
  private isPaused = false;

  private handleDismiss(): void {
    emitEvent(this, "dismiss", { detail: { id: this.toastId } });
  }

  private handleMouseEnter(): void {
    this.isPaused = true;
    emitEvent(this, "pause", { detail: { id: this.toastId } });
  }

  private handleMouseLeave(): void {
    this.isPaused = false;
    emitEvent(this, "resume", { detail: { id: this.toastId } });
  }

  override render(): TemplateResult {
    const classes = {
      "ds-toast": true,
    };

    return html`
      <div
        class=${classMap(classes)}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-variant=${this.variant}
        data-state=${this.toastState}
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
      >
        ${!this.hideIcon ? VARIANT_ICONS[this.variant] : nothing}

        <div class="ds-toast__content">
          <p class="ds-toast__title">${this.toastTitle}</p>
          ${this.description
            ? html`<p class="ds-toast__description">${this.description}</p>`
            : nothing}
          <slot name="action" class="ds-toast__action"></slot>
        </div>

        <button
          class="ds-toast__close"
          type="button"
          aria-label="Dismiss notification"
          @click=${this.handleDismiss}
        >
          ${CLOSE_ICON}
        </button>

        ${this.duration > 0
          ? html`
              <div class="ds-toast__progress">
                <div
                  class="ds-toast__progress-bar"
                  style="animation: ds-toast-progress ${this.duration}ms linear forwards; animation-play-state: ${this.isPaused ? "paused" : "running"}"
                ></div>
              </div>
            `
          : nothing}
      </div>
    `;
  }
}

// Register the component
define("ds-toast", DsToast);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-toast": DsToast;
  }
}
