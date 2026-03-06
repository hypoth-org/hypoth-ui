/**
 * Header Web Component
 *
 * Landmark header with sticky and safe-area support.
 *
 * @element ds-header
 * @slot - Default slot for header content
 */

import { type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsHeader extends DSElement {
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
      "ds-header": true,
    };

    return html`
      <header
        class=${classMap(classes)}
        ?data-sticky=${this.sticky}
        ?data-safe-area=${this.safeArea}
        data-layout="header"
      >
        <slot></slot>
      </header>
    `;
  }
}

// Register the component
define("ds-header", DsHeader);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-header": DsHeader;
  }
}
