/**
 * DropdownMenuLabel component - non-interactive label for menu sections.
 *
 * @element ds-dropdown-menu-label
 *
 * @slot - Label content
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsDropdownMenuLabel extends DSElement {
  override connectedCallback(): void {
    super.connectedCallback();
    // Labels are not focusable
    this.setAttribute("aria-hidden", "true");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-dropdown-menu-label", DsDropdownMenuLabel);

declare global {
  interface HTMLElementTagNameMap {
    "ds-dropdown-menu-label": DsDropdownMenuLabel;
  }
}
