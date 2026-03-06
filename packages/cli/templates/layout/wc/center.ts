/**
 * Center Web Component
 *
 * Centers content horizontally/vertically with optional max-width.
 *
 * @element ds-center
 * @slot - Default slot for centered content
 */

import { type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import type { ContainerSizeToken } from "../../types/layout-tokens.js";
import { CONTAINER_SIZE_TOKENS } from "../../types/layout-tokens.js";
import { validateToken } from "../../utils/token-validator.js";

export class DsCenter extends DSElement {
  static override styles = [];

  /**
   * Maximum width constraint.
   */
  @property({ type: String, reflect: true, attribute: "max-width" })
  maxWidth?: ContainerSizeToken;

  /**
   * Enable vertical centering.
   */
  @property({ type: Boolean, reflect: true })
  vertical = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.validateProps();
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has("maxWidth")) {
      this.validateProps();
    }
  }

  private validateProps(): void {
    if (this.maxWidth) {
      validateToken(this.maxWidth, CONTAINER_SIZE_TOKENS, "max-width", "ds-center");
    }
  }

  override render(): TemplateResult {
    const classes = {
      "ds-center": true,
    };

    return html`
      <div
        class=${classMap(classes)}
        data-max-width=${this.maxWidth || ""}
        ?data-vertical=${this.vertical}
        data-layout="center"
      >
        <slot></slot>
      </div>
    `;
  }
}

// Register the component
define("ds-center", DsCenter);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-center": DsCenter;
  }
}
