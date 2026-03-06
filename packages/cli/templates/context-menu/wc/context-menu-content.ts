/**
 * ContextMenuContent component - container for context menu items.
 *
 * @element ds-context-menu-content
 *
 * @slot - Menu items
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsContextMenuContent extends DSElement {
  /** Data state for animations */
  @property({ attribute: "data-state", reflect: true })
  dataState: "open" | "closed" = "closed";

  override connectedCallback(): void {
    super.connectedCallback();

    if (!this.id) {
      this.id = `context-menu-content-${crypto.randomUUID().slice(0, 8)}`;
    }

    this.setAttribute("role", "menu");
    this.setAttribute("hidden", "");
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-context-menu-content", DsContextMenuContent);

declare global {
  interface HTMLElementTagNameMap {
    "ds-context-menu-content": DsContextMenuContent;
  }
}
