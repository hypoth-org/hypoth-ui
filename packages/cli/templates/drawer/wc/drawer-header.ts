/**
 * DrawerHeader component - header section for drawer.
 *
 * @element ds-drawer-header
 *
 * @slot - Header content (title and description)
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsDrawerHeader extends DSElement {
  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-drawer-header", DsDrawerHeader);

declare global {
  interface HTMLElementTagNameMap {
    "ds-drawer-header": DsDrawerHeader;
  }
}
