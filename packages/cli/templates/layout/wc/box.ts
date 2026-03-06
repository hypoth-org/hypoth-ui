/**
 * Box Web Component
 *
 * Token-only styling escape hatch for padding, background, and radius.
 *
 * @element ds-box
 * @slot - Default slot for children
 */

import { type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import type { RadiusToken, SpacingToken, SurfaceToken } from "../../types/layout-tokens.js";
import { RADIUS_TOKENS, SPACING_TOKENS, SURFACE_TOKENS } from "../../types/layout-tokens.js";
import { validateToken } from "../../utils/token-validator.js";

export class DsBox extends DSElement {
  static override styles = [];

  /**
   * Padding (all sides).
   */
  @property({ type: String, reflect: true })
  p?: SpacingToken;

  /**
   * Horizontal padding.
   */
  @property({ type: String, reflect: true })
  px?: SpacingToken;

  /**
   * Vertical padding.
   */
  @property({ type: String, reflect: true })
  py?: SpacingToken;

  /**
   * Background color token.
   */
  @property({ type: String, reflect: true })
  bg?: SurfaceToken;

  /**
   * Border radius token.
   */
  @property({ type: String, reflect: true })
  radius?: RadiusToken;

  override connectedCallback(): void {
    super.connectedCallback();
    this.validateProps();
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);
    if (
      changedProperties.has("p") ||
      changedProperties.has("px") ||
      changedProperties.has("py") ||
      changedProperties.has("bg") ||
      changedProperties.has("radius")
    ) {
      this.validateProps();
    }
  }

  private validateProps(): void {
    if (this.p) {
      validateToken(this.p, SPACING_TOKENS, "p", "ds-box");
    }
    if (this.px) {
      validateToken(this.px, SPACING_TOKENS, "px", "ds-box");
    }
    if (this.py) {
      validateToken(this.py, SPACING_TOKENS, "py", "ds-box");
    }
    if (this.bg) {
      validateToken(this.bg, SURFACE_TOKENS, "bg", "ds-box");
    }
    if (this.radius) {
      validateToken(this.radius, RADIUS_TOKENS, "radius", "ds-box");
    }
  }

  override render(): TemplateResult {
    const classes = {
      "ds-box": true,
    };

    return html`
      <div
        class=${classMap(classes)}
        data-p=${this.p || ""}
        data-px=${this.px || ""}
        data-py=${this.py || ""}
        data-bg=${this.bg || ""}
        data-radius=${this.radius || ""}
        data-layout="box"
      >
        <slot></slot>
      </div>
    `;
  }
}

// Register the component
define("ds-box", DsBox);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-box": DsBox;
  }
}
