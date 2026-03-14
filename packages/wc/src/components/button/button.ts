import { type ButtonBehavior, createButtonBehavior } from "@hypoth-ui/primitives-dom";
import { LitElement, type TemplateResult, css, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { emitEvent, StandardEvents } from "../../events/emit.js";
import { define } from "../../registry/define.js";
import { validateProp } from "../../utils/dev-warnings.js";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

const VALID_VARIANTS: readonly ButtonVariant[] = ["primary", "secondary", "ghost", "destructive"];
const VALID_SIZES: readonly ButtonSize[] = ["sm", "md", "lg"];

/**
 * A button component following WAI-ARIA button pattern.
 *
 * Uses Shadow DOM so <slot> properly projects children.
 * CSS custom properties (--ds-button-*) inherit through the shadow boundary.
 *
 * @element ds-button
 * @slot - Default slot for button content
 *
 * @csspart button - The button element
 *
 * @fires ds:press - When the button is activated (click, Enter, Space)
 */
export class DsButton extends LitElement {
  // Shadow DOM styles — CSS custom properties inherit through the shadow boundary
  static override styles = css`
    :host {
      display: inline-block;
    }

    :host([hidden]) {
      display: none;
    }

    .ds-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--ds-button-gap);
      border: 1px solid transparent;
      border-radius: var(--ds-button-border-radius);
      font-family: inherit;
      font-weight: var(--ds-button-font-weight);
      line-height: 1;
      cursor: pointer;
      transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
      text-decoration: none;
      white-space: nowrap;
      box-sizing: border-box;

      /* Default size (md) */
      height: var(--ds-button-height);
      padding: var(--ds-button-padding-y) var(--ds-button-padding-x);
      font-size: var(--ds-button-font-size);
    }

    /* Size variants */
    .ds-button--sm {
      height: var(--ds-button-height-sm);
      padding: var(--ds-button-padding-y-sm) var(--ds-button-padding-x-sm);
      font-size: var(--ds-button-font-size-sm);
    }

    .ds-button--md {
      height: var(--ds-button-height);
      padding: var(--ds-button-padding-y) var(--ds-button-padding-x);
      font-size: var(--ds-button-font-size);
    }

    .ds-button--lg {
      height: var(--ds-button-height-lg);
      padding: var(--ds-button-padding-y-lg) var(--ds-button-padding-x-lg);
      font-size: var(--ds-button-font-size-lg);
    }

    /* Primary variant */
    .ds-button--primary {
      background-color: var(--ds-button-primary-bg);
      color: var(--ds-button-primary-color);
      border-color: var(--ds-button-primary-border-color);
    }

    .ds-button--primary:hover:not(:disabled) {
      background-color: var(--ds-button-primary-bg-hover);
      border-color: var(--ds-button-primary-bg-hover);
    }

    .ds-button--primary:active:not(:disabled) {
      background-color: var(--ds-button-primary-bg-active);
      border-color: var(--ds-button-primary-bg-active);
    }

    /* Secondary variant */
    .ds-button--secondary {
      background-color: var(--ds-button-secondary-bg);
      color: var(--ds-button-secondary-color);
      border-color: var(--ds-button-secondary-border-color);
    }

    .ds-button--secondary:hover:not(:disabled) {
      background-color: var(--ds-button-secondary-bg-hover);
      border-color: var(--ds-button-secondary-border-color-hover);
    }

    .ds-button--secondary:active:not(:disabled) {
      background-color: var(--ds-button-secondary-bg-active);
    }

    /* Ghost variant */
    .ds-button--ghost {
      background-color: var(--ds-button-ghost-bg);
      color: var(--ds-button-ghost-color);
      border-color: var(--ds-button-ghost-border-color);
    }

    .ds-button--ghost:hover:not(:disabled) {
      background-color: var(--ds-button-ghost-bg-hover);
    }

    .ds-button--ghost:active:not(:disabled) {
      background-color: var(--ds-button-ghost-bg-active);
    }

    /* Destructive variant */
    .ds-button--destructive {
      background-color: var(--ds-button-destructive-bg);
      color: var(--ds-button-destructive-color);
      border-color: var(--ds-button-destructive-border-color);
    }

    .ds-button--destructive:hover:not(:disabled) {
      background-color: var(--ds-button-destructive-bg-hover);
      border-color: var(--ds-button-destructive-bg-hover);
    }

    .ds-button--destructive:active:not(:disabled) {
      background-color: var(--ds-button-destructive-bg-active);
      border-color: var(--ds-button-destructive-bg-active);
    }

    /* Disabled state */
    .ds-button:disabled,
    .ds-button--disabled {
      background-color: var(--ds-button-disabled-bg);
      color: var(--ds-button-disabled-color);
      cursor: not-allowed;
      pointer-events: none;
    }

    /* Focus state */
    .ds-button:focus-visible {
      outline: 2px solid var(--ds-button-focus-ring);
      outline-offset: 2px;
    }

    /* Loading state */
    .ds-button--loading {
      position: relative;
      cursor: wait;
    }

    .ds-button--loading .ds-button__content {
      visibility: hidden;
    }

    .ds-button__spinner {
      position: absolute;
      width: var(--ds-button-spinner-size);
      height: var(--ds-button-spinner-size);
      border: 2px solid var(--ds-button-spinner-color);
      border-right-color: transparent;
      border-radius: 50%;
      animation: ds-button-spin 0.6s linear infinite;
    }

    @keyframes ds-button-spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* Button content wrapper */
    .ds-button__content {
      display: inline-flex;
      align-items: center;
      gap: var(--ds-button-icon-gap);
    }
  `;

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
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!this.disabled && !this.loading) {
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
