/**
 * ContextMenuSeparator component - visual divider between menu items.
 *
 * @element ds-context-menu-separator
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsContextMenuSeparator extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "separator");
  }

  override render() {
    return html``;
  }
}

define("ds-context-menu-separator", DsContextMenuSeparator);

declare global {
  interface HTMLElementTagNameMap {
    "ds-context-menu-separator": DsContextMenuSeparator;
  }
}
