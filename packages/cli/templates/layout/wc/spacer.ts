/**
 * Spacer Web Component
 *
 * Explicit space element for fine-grained spacing control.
 *
 * @element ds-spacer
 */

import { type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import type { SpacerAxis, SpacingToken } from "../../types/layout-tokens.js";
import { SPACING_TOKENS } from "../../types/layout-tokens.js";
import { validateToken } from "../../utils/token-validator.js";

const AXIS_VALUES: readonly SpacerAxis[] = ["horizontal", "vertical"] as const;

export class DsSpacer extends DSElement {
  static override styles = [];

  /**
   * Size of the space.
   */
  @property({ type: String, reflect: true })
  size: SpacingToken = "md";

  /**
   * Axis direction.
   */
  @property({ type: String, reflect: true })
  axis: SpacerAxis = "vertical";

  override connectedCallback(): void {
    super.connectedCallback();
    this.validateProps();
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has("size") || changedProperties.has("axis")) {
      this.validateProps();
    }
  }

  private validateProps(): void {
    validateToken(this.size, SPACING_TOKENS, "size", "ds-spacer");
    validateToken(this.axis, AXIS_VALUES, "axis", "ds-spacer");
  }

  override render(): TemplateResult {
    const classes = {
      "ds-spacer": true,
    };

    return html`
      <div
        class=${classMap(classes)}
        data-size=${this.size}
        data-axis=${this.axis}
        aria-hidden="true"
        data-layout="spacer"
      ></div>
    `;
  }
}

// Register the component
define("ds-spacer", DsSpacer);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-spacer": DsSpacer;
  }
}
