/**
 * Card Content component - main content section for ds-card.
 *
 * @element ds-card-content
 *
 * @slot - Default slot for main card content
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsCardContent extends DSElement {
  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-card-content", DsCardContent);

declare global {
  interface HTMLElementTagNameMap {
    "ds-card-content": DsCardContent;
  }
}
