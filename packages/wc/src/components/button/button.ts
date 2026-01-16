import { type ButtonBehavior, createButtonBehavior } from "@ds/primitives-dom";
import { type TemplateResult, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";
import { validateProp } from "../../utils/dev-warnings.js";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

const VALID_VARIANTS: readonly ButtonVariant[] = ["primary", "secondary", "ghost", "destructive"];
const VALID_SIZES: readonly ButtonSize[] = ["sm", "md", "lg"];

/**
 * A button component following WAI-ARIA button pattern.
 *
 * @element ds-button
 * @slot - Default slot for button content
 *
 * @csspart button - The button element
 *
 * @fires ds:press - When the button is activated (click, Enter, Space)
 */
export class DsButton extends DSElement {
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

  /** Button behavior instance */
  private behavior!: ButtonBehavior;

  override connectedCallback(): void {
    super.connectedCallback();
    // Create behavior with current property values
    this.behavior = createButtonBehavior({
      disabled: this.disabled,
      loading: this.loading,
      type: this.type,
    });

    // Dev warnings: Validate variant and size
    validateProp("ds-button", "variant", this.variant, VALID_VARIANTS);
    validateProp("ds-button", "size", this.size, VALID_SIZES);
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);
    // Sync behavior state with component properties
    if (
      changedProperties.has("disabled") ||
      changedProperties.has("loading") ||
      changedProperties.has("type")
    ) {
      this.behavior.setState({
        disabled: this.disabled,
        loading: this.loading,
        type: this.type,
      });
    }
  }

  private handleClick(event: MouseEvent): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Dispatch ds:press event per standard event naming convention
    emitEvent(this, StandardEvents.PRESS, {
      detail: {
        originalEvent: event,
        target: this,
        isKeyboard: false,
      },
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    // For WC compatibility, handle both Enter and Space on keydown
    // The behavior only handles Enter on keydown (Space is typically keyup)
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!this.disabled && !this.loading) {
        // Dispatch ds:press event with keyboard flag
        // Note: We do NOT call this.click() to avoid double event emission
        emitEvent(this, StandardEvents.PRESS, {
          detail: {
            originalEvent: event,
            target: this,
            isKeyboard: true,
          },
        });
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

    // Compute ARIA props based on current component state
    const isDisabled = this.disabled || this.loading;

    return html`
      <button
        part="button"
        class=${classMap(classes)}
        type=${this.type}
        ?disabled=${this.disabled}
        aria-disabled=${isDisabled ? "true" : nothing}
        aria-busy=${this.loading ? "true" : nothing}
        tabindex=${isDisabled ? -1 : 0}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        ${this.loading ? html`<span class="ds-button__spinner" aria-hidden="true"></span>` : null}
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
