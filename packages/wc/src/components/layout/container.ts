/**
 * Container Web Component
 *
 * Constrains content width with responsive max-widths and padding.
 *
 * @element ds-container
 * @slot - Default slot for children
 */

import { type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import type { ContainerSizeToken, SpacingToken } from "../../types/layout-tokens.js";
import { CONTAINER_SIZE_TOKENS, SPACING_TOKENS } from "../../types/layout-tokens.js";
import { validateToken } from "../../utils/token-validator.js";

export class DsContainer extends DSElement {
  static override styles = [];

  /**
   * Maximum width constraint.
   */
  @property({ type: String, reflect: true })
  size: ContainerSizeToken = "lg";

  /**
   * Horizontal padding.
   */
  @property({ type: String, reflect: true })
  padding: SpacingToken = "md";

  override connectedCallback(): void {
    super.connectedCallback();
    this.validateProps();
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has("size") || changedProperties.has("padding")) {
      this.validateProps();
    }
  }

  private validateProps(): void {
    validateToken(this.size, CONTAINER_SIZE_TOKENS, "size", "ds-container");
    validateToken(this.padding, SPACING_TOKENS, "padding", "ds-container");
  }

  override render(): TemplateResult {
    const classes = {
      "ds-container": true,
    };

    return html`
      <div
        class=${classMap(classes)}
        data-size=${this.size}
        data-padding=${this.padding}
        data-layout="container"
      >
        <slot></slot>
      </div>
    `;
  }
}

// Register the component
define("ds-container", DsContainer);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-container": DsContainer;
  }
}
