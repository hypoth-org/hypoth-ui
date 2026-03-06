/**
 * Page Web Component
 *
 * Page wrapper with min-height and background.
 *
 * @element ds-page
 * @slot - Default slot for page content
 */

import { type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import type { SurfaceToken } from "../../types/layout-tokens.js";
import { SURFACE_TOKENS } from "../../types/layout-tokens.js";
import { validateToken } from "../../utils/token-validator.js";

type MinHeightValue = "viewport" | "full";

const MIN_HEIGHT_VALUES: readonly MinHeightValue[] = ["viewport", "full"] as const;

export class DsPage extends DSElement {
  static override styles = [];

  /**
   * Background color token.
   */
  @property({ type: String, reflect: true })
  bg: SurfaceToken = "background";

  /**
   * Minimum height.
   */
  @property({ type: String, reflect: true, attribute: "min-height" })
  minHeight: MinHeightValue = "viewport";

  override connectedCallback(): void {
    super.connectedCallback();
    this.validateProps();
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has("bg") || changedProperties.has("minHeight")) {
      this.validateProps();
    }
  }

  private validateProps(): void {
    validateToken(this.bg, SURFACE_TOKENS, "bg", "ds-page");
    validateToken(this.minHeight, MIN_HEIGHT_VALUES, "min-height", "ds-page");
  }

  override render(): TemplateResult {
    const classes = {
      "ds-page": true,
    };

    return html`
      <div
        class=${classMap(classes)}
        data-bg=${this.bg}
        data-min-height=${this.minHeight}
        data-layout="page"
      >
        <slot></slot>
      </div>
    `;
  }
}

// Register the component
define("ds-page", DsPage);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-page": DsPage;
  }
}
