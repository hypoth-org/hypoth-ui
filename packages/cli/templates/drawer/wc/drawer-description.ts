/**
 * DrawerDescription component - description for the drawer.
 *
 * @element ds-drawer-description
 *
 * @slot - Description content
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsDrawerDescription extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();

    // Generate ID if not present (for aria-describedby)
    if (!this.id) {
      this.id = `drawer-desc-${crypto.randomUUID().slice(0, 8)}`;
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-drawer-description", DsDrawerDescription);

declare global {
  interface HTMLElementTagNameMap {
    "ds-drawer-description": DsDrawerDescription;
  }
}
