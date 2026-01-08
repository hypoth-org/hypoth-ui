/**
 * Card Header component - header section for ds-card.
 *
 * @element ds-card-header
 *
 * @slot - Default slot for header content (typically title and description)
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsCardHeader extends DSElement {
  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-card-header", DsCardHeader);

declare global {
  interface HTMLElementTagNameMap {
    "ds-card-header": DsCardHeader;
  }
}
