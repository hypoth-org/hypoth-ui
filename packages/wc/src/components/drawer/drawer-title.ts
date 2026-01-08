/**
 * DrawerTitle component - title for the drawer.
 *
 * @element ds-drawer-title
 *
 * @slot - Title content
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsDrawerTitle extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();

    // Generate ID if not present (for aria-labelledby)
    if (!this.id) {
      this.id = `drawer-title-${crypto.randomUUID().slice(0, 8)}`;
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-drawer-title", DsDrawerTitle);

declare global {
  interface HTMLElementTagNameMap {
    "ds-drawer-title": DsDrawerTitle;
  }
}
