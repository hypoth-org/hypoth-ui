/**
 * DropdownMenuRadioGroup component - container for radio items.
 *
 * @element ds-dropdown-menu-radio-group
 *
 * @slot - Radio items
 *
 * @fires ds:change - Fired when selection changes
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export class DsDropdownMenuRadioGroup extends DSElement {
  /** Currently selected value */
  @property()
  value = "";

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute("role", "group");

    // Listen for radio item selections
    this.addEventListener("ds:radio-select", this.handleRadioSelect as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("ds:radio-select", this.handleRadioSelect as EventListener);
  }

  private handleRadioSelect = (event: CustomEvent<{ value: string }>): void => {
    event.stopPropagation();

    const newValue = event.detail.value;
    if (newValue !== this.value) {
      this.value = newValue;
      this.updateRadioItems();

      emitEvent(this, "ds:change", {
        detail: { value: this.value },
        bubbles: true,
      });
    }
  };

  private updateRadioItems(): void {
    const items = this.querySelectorAll("ds-dropdown-menu-radio-item");
    for (const item of items) {
      const itemValue = item.getAttribute("value");
      if (itemValue === this.value) {
        item.setAttribute("checked", "");
      } else {
        item.removeAttribute("checked");
      }
    }
  }

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("value")) {
      this.updateRadioItems();
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-dropdown-menu-radio-group", DsDropdownMenuRadioGroup);

declare global {
  interface HTMLElementTagNameMap {
    "ds-dropdown-menu-radio-group": DsDropdownMenuRadioGroup;
  }
}
