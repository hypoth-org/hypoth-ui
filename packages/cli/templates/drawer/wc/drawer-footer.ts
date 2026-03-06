/**
 * DrawerFooter component - footer section for drawer actions.
 *
 * @element ds-drawer-footer
 *
 * @slot - Footer content (action buttons)
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsDrawerFooter extends DSElement {
  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-drawer-footer", DsDrawerFooter);

declare global {
  interface HTMLElementTagNameMap {
    "ds-drawer-footer": DsDrawerFooter;
  }
}
