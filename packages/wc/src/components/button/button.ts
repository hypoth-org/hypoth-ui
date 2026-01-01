import { html, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { LightElement } from "../../base/light-element.js";
import { define } from "../../registry/define.js";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

/**
 * A button component following WAI-ARIA button pattern.
 *
 * @element ds-button
 * @slot - Default slot for button content
 *
 * @csspart button - The button element
 *
 * @fires click - When the button is clicked
 */
export class DsButton extends LightElement {
  static override styles = [];

  /**
   * The button variant.
   */
  @property({ type: String, reflect: true })
  variant: ButtonVariant = "primary";

  /**
   * The button size.
   */
  @property({ type: String, reflect: true })
  size: ButtonSize = "md";

  /**
   * Whether the button is disabled.
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Whether the button is in a loading state.
   */
  @property({ type: Boolean, reflect: true })
  loading = false;

  /**
   * Button type attribute.
   */
  @property({ type: String })
  type: "button" | "submit" | "reset" = "button";

  private handleClick(event: MouseEvent): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Dispatch a custom click event
    this.dispatchEvent(
      new CustomEvent("click", {
        bubbles: true,
        composed: true,
        detail: { originalEvent: event },
      })
    );
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!this.disabled && !this.loading) {
        this.click();
      }
    }
  }

  override render(): TemplateResult {
    const classes = {
      "ds-button": true,
      [`ds-button--${this.variant}`]: true,
      [`ds-button--${this.size}`]: true,
      "ds-button--disabled": this.disabled,
      "ds-button--loading": this.loading,
    };

    return html`
      <button
        part="button"
        class=${classMap(classes)}
        type=${this.type}
        ?disabled=${this.disabled}
        aria-disabled=${this.disabled || this.loading}
        aria-busy=${this.loading}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        ${this.loading
          ? html`<span class="ds-button__spinner" aria-hidden="true"></span>`
          : null}
        <span class="ds-button__content">
          <slot></slot>
        </span>
      </button>
    `;
  }
}

// Register the component
define("ds-button", DsButton);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-button": DsButton;
  }
}
