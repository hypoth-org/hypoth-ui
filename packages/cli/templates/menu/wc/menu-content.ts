import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export type MenuContentState = "open" | "closed";

/**
 * Menu content container with role="menu".
 *
 * @element ds-menu-content
 *
 * @slot - Menu items (ds-menu-item elements)
 *
 * @attr {string} data-state - Animation state ("open" or "closed")
 *
 * @example
 * ```html
 * <ds-menu>
 *   <button slot="trigger">Actions</button>
 *   <ds-menu-content>
 *     <ds-menu-item>Edit</ds-menu-item>
 *     <ds-menu-item>Delete</ds-menu-item>
 *   </ds-menu-content>
 * </ds-menu>
 * ```
 */
export class DsMenuContent extends DSElement {
  /** Unique ID for ARIA association */
  @property({ type: String, reflect: true })
  override id = "";

  /** Animation state (open or closed) - set by parent ds-menu */
  @property({ type: String, reflect: true, attribute: "data-state" })
  dataState: MenuContentState = "closed";

  override connectedCallback(): void {
    super.connectedCallback();

    // Generate ID if not set
    if (!this.id) {
      this.id = `menu-content-${crypto.randomUUID().slice(0, 8)}`;
    }

    // Set ARIA role for menu
    this.setAttribute("role", "menu");

    // Hidden by default (parent menu controls visibility)
    this.setAttribute("hidden", "");
  }

  override render() {
    return html`
      <div class="ds-menu-content" part="container">
        <slot></slot>
      </div>
    `;
  }
}

define("ds-menu-content", DsMenuContent);

declare global {
  interface HTMLElementTagNameMap {
    "ds-menu-content": DsMenuContent;
  }
}
