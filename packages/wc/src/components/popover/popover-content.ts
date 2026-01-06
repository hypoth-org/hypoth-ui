import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export type PopoverContentState = "open" | "closed";

/**
 * Popover content container.
 *
 * @element ds-popover-content
 *
 * @slot - Content to display in the popover
 *
 * @attr {string} data-state - Animation state ("open" or "closed")
 *
 * @example
 * ```html
 * <ds-popover>
 *   <button slot="trigger">Open</button>
 *   <ds-popover-content>
 *     <p>Popover content here</p>
 *     <button>Action</button>
 *   </ds-popover-content>
 * </ds-popover>
 * ```
 */
export class DsPopoverContent extends DSElement {
  /** Unique ID for ARIA association */
  @property({ type: String, reflect: true })
  override id = "";

  /** Animation state (open or closed) - set by parent ds-popover */
  @property({ type: String, reflect: true, attribute: "data-state" })
  dataState: PopoverContentState = "closed";

  override connectedCallback(): void {
    super.connectedCallback();

    // Generate ID if not set
    if (!this.id) {
      this.id = `popover-content-${crypto.randomUUID().slice(0, 8)}`;
    }

    // Hidden by default (parent popover controls visibility)
    this.setAttribute("hidden", "");
  }

  override render() {
    // Note: No role attribute by default since popover is non-modal
    // Developers can add aria-label or role="dialog" if needed
    return html`
      <div class="ds-popover-content" part="container">
        <slot></slot>
      </div>
    `;
  }
}

define("ds-popover-content", DsPopoverContent);

declare global {
  interface HTMLElementTagNameMap {
    "ds-popover-content": DsPopoverContent;
  }
}
