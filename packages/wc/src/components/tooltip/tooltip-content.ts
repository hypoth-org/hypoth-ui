import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

/**
 * Tooltip content container.
 *
 * @element ds-tooltip-content
 *
 * @slot - Content to display in the tooltip
 *
 * @example
 * ```html
 * <ds-tooltip>
 *   <button slot="trigger">Hover me</button>
 *   <ds-tooltip-content>Helpful information</ds-tooltip-content>
 * </ds-tooltip>
 * ```
 */
export class DsTooltipContent extends DSElement {
  /** Unique ID for ARIA association */
  @property({ type: String, reflect: true })
  override id = "";

  override connectedCallback(): void {
    super.connectedCallback();

    // Generate ID if not set
    if (!this.id) {
      this.id = `tooltip-content-${crypto.randomUUID().slice(0, 8)}`;
    }

    // Set role for accessibility
    this.setAttribute("role", "tooltip");

    // Hidden by default (parent tooltip controls visibility)
    this.setAttribute("hidden", "");
  }

  override render() {
    return html`
      <div class="ds-tooltip-content" part="container">
        <slot></slot>
      </div>
    `;
  }
}

define("ds-tooltip-content", DsTooltipContent);

declare global {
  interface HTMLElementTagNameMap {
    "ds-tooltip-content": DsTooltipContent;
  }
}
