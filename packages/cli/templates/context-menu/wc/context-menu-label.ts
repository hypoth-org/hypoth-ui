/**
 * ContextMenuLabel component - non-interactive label for menu sections.
 *
 * @element ds-context-menu-label
 *
 * @slot - Label content
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsContextMenuLabel extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("aria-hidden", "true");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-context-menu-label", DsContextMenuLabel);

declare global {
  interface HTMLElementTagNameMap {
    "ds-context-menu-label": DsContextMenuLabel;
  }
}
