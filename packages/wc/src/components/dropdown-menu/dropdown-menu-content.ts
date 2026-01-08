/**
 * DropdownMenuContent component - container for menu items.
 *
 * @element ds-dropdown-menu-content
 *
 * @slot - Menu items
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsDropdownMenuContent extends DSElement {
  /** Data state for animations */
  @property({ attribute: "data-state", reflect: true })
  dataState: "open" | "closed" = "closed";

  override connectedCallback(): void {
    super.connectedCallback();

    // Generate ID for ARIA
    if (!this.id) {
      this.id = `dropdown-menu-content-${crypto.randomUUID().slice(0, 8)}`;
    }

    // Set ARIA role
    this.setAttribute("role", "menu");
    this.setAttribute("hidden", "");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-dropdown-menu-content", DsDropdownMenuContent);

declare global {
  interface HTMLElementTagNameMap {
    "ds-dropdown-menu-content": DsDropdownMenuContent;
  }
}
