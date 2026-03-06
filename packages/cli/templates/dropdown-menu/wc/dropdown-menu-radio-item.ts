/**
 * DropdownMenuRadioItem component - radio button menu item.
 *
 * @element ds-dropdown-menu-radio-item
 *
 * @slot - Item content
 *
 * @fires ds:radio-select - Fired when item is selected (internal)
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export class DsDropdownMenuRadioItem extends DSElement {
  /** Value for selection */
  @property()
  value = "";

  /** Whether the radio is selected */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /** Disabled state */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute("role", "menuitemradio");
    this.setAttribute("tabindex", "-1");
    this.updateAriaChecked();

    this.addEventListener("click", this.handleSelect);
    this.addEventListener("keydown", this.handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleSelect);
    this.removeEventListener("keydown", this.handleKeyDown);
  }

  private handleSelect = (): void => {
    if (this.disabled || this.checked) return;

    // Emit internal event for radio group to handle
    emitEvent(this, "ds:radio-select", {
      detail: { value: this.value },
      bubbles: true,
    });

    // Also emit ds:select for menu to close
    emitEvent(this, "ds:select", {
      detail: { value: this.value },
      bubbles: true,
    });
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleSelect();
    }
  };

  private updateAriaChecked(): void {
    this.setAttribute("aria-checked", String(this.checked));
  }

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("disabled")) {
      this.setAttribute("aria-disabled", String(this.disabled));
    }
    if (changedProperties.has("checked")) {
      this.updateAriaChecked();
    }
  }

  override render() {
    return html`
      <span class="ds-dropdown-menu-radio-item__indicator" aria-hidden="true">
        ${this.checked ? "●" : "○"}
      </span>
      <slot></slot>
    `;
  }
}

define("ds-dropdown-menu-radio-item", DsDropdownMenuRadioItem);

declare global {
  interface HTMLElementTagNameMap {
    "ds-dropdown-menu-radio-item": DsDropdownMenuRadioItem;
  }
}
