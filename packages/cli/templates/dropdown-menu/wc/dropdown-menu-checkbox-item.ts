/**
 * DropdownMenuCheckboxItem component - toggleable checkbox menu item.
 *
 * @element ds-dropdown-menu-checkbox-item
 *
 * @slot - Item content
 *
 * @fires ds:select - Fired when item is toggled
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export class DsDropdownMenuCheckboxItem extends DSElement {
  /** Whether the checkbox is checked */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /** Disabled state */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute("role", "menuitemcheckbox");
    this.setAttribute("tabindex", "-1");
    this.updateAriaChecked();

    this.addEventListener("click", this.handleToggle);
    this.addEventListener("keydown", this.handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleToggle);
    this.removeEventListener("keydown", this.handleKeyDown);
  }

  private handleToggle = (): void => {
    if (this.disabled) return;

    this.checked = !this.checked;
    this.updateAriaChecked();

    emitEvent(this, "ds:select", {
      detail: { checked: this.checked },
      bubbles: true,
    });
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleToggle();
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
      <span class="ds-dropdown-menu-checkbox-item__indicator" aria-hidden="true">
        ${this.checked ? "✓" : ""}
      </span>
      <slot></slot>
    `;
  }
}

define("ds-dropdown-menu-checkbox-item", DsDropdownMenuCheckboxItem);

declare global {
  interface HTMLElementTagNameMap {
    "ds-dropdown-menu-checkbox-item": DsDropdownMenuCheckboxItem;
  }
}
