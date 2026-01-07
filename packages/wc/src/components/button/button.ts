import { type ButtonBehavior, createButtonBehavior } from "@ds/primitives-dom";
import { type TemplateResult, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
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
      onActivate: () => this.handleActivate(),
    });
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

  private handleActivate(): void {
    // Trigger native click for keyboard activation
    this.click();
  }

  private handleClick(event: MouseEvent): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Dispatch ds:click event using standard convention
    emitEvent(this, StandardEvents.CLICK, {
      detail: { originalEvent: event },
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    // For WC compatibility, handle both Enter and Space on keydown
    // The behavior only handles Enter on keydown (Space is typically keyup)
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
