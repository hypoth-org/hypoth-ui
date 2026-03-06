/**
 * DropdownMenuSeparator component - visual divider between menu items.
 *
 * @element ds-dropdown-menu-separator
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsDropdownMenuSeparator extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "separator");
  }

  override render() {
    return html``;
  }
}

define("ds-dropdown-menu-separator", DsDropdownMenuSeparator);

declare global {
  interface HTMLElementTagNameMap {
    "ds-dropdown-menu-separator": DsDropdownMenuSeparator;
  }
}
