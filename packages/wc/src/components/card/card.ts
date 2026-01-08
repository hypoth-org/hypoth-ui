/**
 * Card component - container for grouping related content.
 *
 * A structural component that provides visual grouping with consistent
 * styling for headers, content areas, and footers.
 *
 * @element ds-card
 *
 * @slot - Default slot for card content (ds-card-header, ds-card-content, ds-card-footer)
 *
 * @example
 * ```html
 * <ds-card>
 *   <ds-card-header>
 *     <h3>Card Title</h3>
 *   </ds-card-header>
 *   <ds-card-content>
 *     <p>Card content goes here.</p>
 *   </ds-card-content>
 *   <ds-card-footer>
 *     <button>Action</button>
 *   </ds-card-footer>
 * </ds-card>
 * ```
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsCard extends DSElement {
  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-card", DsCard);

declare global {
  interface HTMLElementTagNameMap {
    "ds-card": DsCard;
  }
}
