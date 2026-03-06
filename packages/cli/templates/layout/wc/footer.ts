/**
 * Footer Web Component
 *
 * Landmark footer with sticky and safe-area support.
 *
 * @element ds-footer
 * @slot - Default slot for footer content
 */

import { type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsFooter extends DSElement {
  static override styles = [];

  /**
   * Enable sticky positioning.
   */
  @property({ type: Boolean, reflect: true })
  sticky = false;

  /**
   * Enable safe area insets.
   */
  @property({ type: Boolean, reflect: true, attribute: "safe-area" })
  safeArea = false;

  override render(): TemplateResult {
    const classes = {
      "ds-footer": true,
    };

    return html`
      <footer
        class=${classMap(classes)}
        ?data-sticky=${this.sticky}
        ?data-safe-area=${this.safeArea}
        data-layout="footer"
      >
        <slot></slot>
      </footer>
    `;
  }
}

// Register the component
define("ds-footer", DsFooter);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-footer": DsFooter;
  }
}
