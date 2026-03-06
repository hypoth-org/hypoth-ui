/**
 * Card Footer component - footer section for ds-card.
 *
 * @element ds-card-footer
 *
 * @slot - Default slot for footer content (typically actions)
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsCardFooter extends DSElement {
  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-card-footer", DsCardFooter);

declare global {
  interface HTMLElementTagNameMap {
    "ds-card-footer": DsCardFooter;
  }
}
