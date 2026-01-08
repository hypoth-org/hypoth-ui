import { type TemplateResult, html } from "lit";
import { property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import {
  ToastController,
  type ToastData,
  type ToastPosition,
  setGlobalToastController,
} from "./toast-controller.js";
import "./toast.js";

/**
 * Toast provider component that manages toast queue and rendering.
 *
 * @element ds-toast-provider
 * @slot - Default slot for app content
 *
 * @example
 * ```html
 * <ds-toast-provider position="top-right" max="5">
 *   <!-- Your app content -->
 * </ds-toast-provider>
 *
 * <script>
 *   dsToast({ title: "Hello!", variant: "success" });
 * </script>
 * ```
 */
export class DsToastProvider extends DSElement {
  static override styles = [];

  /**
   * Toast position
   */
  @property({ type: String, reflect: true })
  position: ToastPosition = "top-right";

  /**
   * Maximum simultaneous toasts
   */
  @property({ type: Number })
  max = 5;

  /**
   * Default duration in ms
   */
  @property({ type: Number })
  duration = 5000;

  @state()
  private toasts: ToastData[] = [];

  private controller!: ToastController;

  override connectedCallback(): void {
    super.connectedCallback();

    this.controller = new ToastController({
      maxToasts: this.max,
      defaultDuration: this.duration,
      position: this.position,
      onUpdate: (toasts) => {
        this.toasts = toasts;
      },
    });

    // Set as global controller
    setGlobalToastController(this.controller);
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has("max") || changedProperties.has("duration") || changedProperties.has("position")) {
      this.controller.setOptions({
        maxToasts: this.max,
        defaultDuration: this.duration,
        position: this.position,
      });
    }
  }

  private handleDismiss(event: CustomEvent<{ id: string }>): void {
    this.controller.dismiss(event.detail.id);
  }

  private handlePause(event: CustomEvent<{ id: string }>): void {
    this.controller.pause(event.detail.id);
  }

  private handleResume(event: CustomEvent<{ id: string }>): void {
    this.controller.resume(event.detail.id);
  }

  private handleActionClick(toast: ToastData): void {
    toast.action?.onClick();
    this.controller.dismiss(toast.id);
  }

  override render(): TemplateResult {
    return html`
      <slot></slot>

      <div
        class="ds-toast-viewport"
        data-position=${this.position}
        role="region"
        aria-label="Notifications"
        aria-live="polite"
      >
        ${repeat(
          this.toasts,
          (toast) => toast.id,
          (toast) => html`
            <ds-toast
              .toastId=${toast.id}
              .toastTitle=${toast.title}
              .description=${toast.description ?? ""}
              .variant=${toast.variant ?? "info"}
              .toastState=${toast.state}
              .duration=${toast.duration ?? 0}
              @ds:dismiss=${this.handleDismiss}
              @ds:pause=${this.handlePause}
              @ds:resume=${this.handleResume}
            >
              ${toast.action
                ? html`
                    <button
                      slot="action"
                      class="ds-button ds-button--sm ds-button--ghost"
                      @click=${() => this.handleActionClick(toast)}
                    >
                      ${toast.action.label}
                    </button>
                  `
                : null}
            </ds-toast>
          `
        )}
      </div>
    `;
  }
}

// Register the component
define("ds-toast-provider", DsToastProvider);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-toast-provider": DsToastProvider;
  }
}
