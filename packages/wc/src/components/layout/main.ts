/**
 * Main Web Component
 *
 * Main content region for skip-link targeting.
 *
 * @element ds-main
 * @slot - Default slot for main content
 */

import { type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsMain extends DSElement {
  static override styles = [];

  /**
   * Element ID for skip-link targeting.
   */
  @property({ type: String, reflect: true })
  override id = "main-content";

  override render(): TemplateResult {
    const classes = {
      "ds-main": true,
    };

    return html`
      <main class=${classMap(classes)} id=${this.id} tabindex="-1" data-layout="main">
        <slot></slot>
      </main>
    `;
  }
}

// Register the component
define("ds-main", DsMain);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-main": DsMain;
  }
}
