import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

/**
 * Individual radio button within a group.
 *
 * @element ds-radio
 *
 * @slot - Radio label
 *
 * @example
 * ```html
 * <ds-radio-group name="size">
 *   <ds-radio value="sm">Small</ds-radio>
 *   <ds-radio value="md">Medium</ds-radio>
 *   <ds-radio value="lg">Large</ds-radio>
 * </ds-radio-group>
 * ```
 */
export class DsRadio extends DSElement {
  /** Radio value */
  @property({ type: String, reflect: true })
  value = "";

  /** Selected state (managed by group) */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /** Disabled state */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Label text captured from slot */
  @state()
  private labelText = "";

  /** Unique ID for label association */
  @state()
  private labelId = "";

  /** Whether this radio is focusable (managed by group) */
  @state()
  private _tabIndexValue: number | undefined = undefined;

  get tabIndexValue(): number {
    return this._tabIndexValue ?? -1;
  }

  override connectedCallback(): void {
    // Capture label text before Lit renders
    this.labelText = this.textContent?.trim() ?? "";
    // Generate unique ID for label
    this.labelId = `radio-label-${crypto.randomUUID().slice(0, 8)}`;
    super.connectedCallback();
  }

  /**
   * Sets the checked state (called by RadioGroup).
   */
  setChecked(checked: boolean): void {
    this.checked = checked;
  }

  /**
   * Sets the tabindex (called by RadioGroup for roving focus).
   */
  setTabIndex(index: number): void {
    this._tabIndexValue = index;
    this.requestUpdate();
  }

  /**
   * Focus the control element.
   */
  focusControl(): void {
    const control = this.querySelector("[role='radio']") as HTMLElement | null;
    control?.focus();
  }

  private handleClick = (event: Event): void => {
    if (this.disabled) return;
    event.preventDefault();

    // Dispatch custom event for parent to handle
    this.dispatchEvent(
      new CustomEvent("ds:radio-select", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    // Space key selects the radio
    if (event.key === " " && !this.disabled) {
      event.preventDefault();
      this.dispatchEvent(
        new CustomEvent("ds:radio-select", {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        })
      );
    }
  };

  override render() {
    return html`
      <div
        class="ds-radio"
        part="container"
        @click=${this.handleClick}
      >
        <div
          role="radio"
          part="control"
          class="ds-radio__control"
          .tabIndex=${this.tabIndexValue}
          aria-checked=${this.checked ? "true" : "false"}
          aria-disabled=${this.disabled ? "true" : "false"}
          aria-labelledby=${this.labelId}
          @keydown=${this.handleKeyDown}
        >
          <span class="ds-radio__indicator" part="indicator">
            ${this.checked ? html`<span class="ds-radio__dot"></span>` : null}
          </span>
        </div>
        <span id=${this.labelId} class="ds-radio__label" part="label">
          ${this.labelText}
        </span>
      </div>
    `;
  }
}

define("ds-radio", DsRadio);

declare global {
  interface HTMLElementTagNameMap {
    "ds-radio": DsRadio;
  }
}
