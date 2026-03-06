/**
 * HoverCardContent component - container for hover card content.
 *
 * @element ds-hover-card-content
 *
 * @slot - Content to display in the hover card
 *
 * @attr {string} data-state - Animation state ("open" or "closed")
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export type HoverCardContentState = "open" | "closed";

export class DsHoverCardContent extends DSElement {
  /** Unique ID for ARIA association */
  @property({ type: String, reflect: true })
  override id = "";

  /** Animation state (open or closed) - set by parent */
  @property({ type: String, reflect: true, attribute: "data-state" })
  dataState: HoverCardContentState = "closed";

  override connectedCallback(): void {
    super.connectedCallback();

    // Generate ID if not set
    if (!this.id) {
      this.id = `hover-card-content-${crypto.randomUUID().slice(0, 8)}`;
    }

    // Hidden by default (parent controls visibility)
    this.setAttribute("hidden", "");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-hover-card-content", DsHoverCardContent);

declare global {
  interface HTMLElementTagNameMap {
    "ds-hover-card-content": DsHoverCardContent;
  }
}
