/**
 * Section Web Component
 *
 * Semantic section wrapper with consistent vertical spacing.
 *
 * @element ds-section
 * @slot - Default slot for section content
 */

import { type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import type { SpacingToken } from "../../types/layout-tokens.js";
import { SPACING_TOKENS } from "../../types/layout-tokens.js";
import { validateToken } from "../../utils/token-validator.js";

export class DsSection extends DSElement {
  static override styles = [];

  /**
   * Vertical padding.
   */
  @property({ type: String, reflect: true })
  spacing: SpacingToken = "lg";

  override connectedCallback(): void {
    super.connectedCallback();
    this.validateProps();
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has("spacing")) {
      this.validateProps();
    }
  }

  private validateProps(): void {
    validateToken(this.spacing, SPACING_TOKENS, "spacing", "ds-section");
  }

  override render(): TemplateResult {
    const classes = {
      "ds-section": true,
    };

    return html`
      <section class=${classMap(classes)} data-spacing=${this.spacing} data-layout="section">
        <slot></slot>
      </section>
    `;
  }
}

// Register the component
define("ds-section", DsSection);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-section": DsSection;
  }
}
