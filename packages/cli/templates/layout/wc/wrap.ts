/**
 * Wrap Web Component
 *
 * Wrapping row layout for tags/chips.
 *
 * @element ds-wrap
 * @slot - Default slot for wrapped items
 */

import { type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import type { FlexAlign, SpacingToken } from "../../types/layout-tokens.js";
import { SPACING_TOKENS } from "../../types/layout-tokens.js";
import { validateToken } from "../../utils/token-validator.js";

export class DsWrap extends DSElement {
  static override styles = [];

  /**
   * Gap between items.
   */
  @property({ type: String, reflect: true })
  gap: SpacingToken = "sm";

  /**
   * Row gap override.
   */
  @property({ type: String, reflect: true, attribute: "row-gap" })
  rowGap?: SpacingToken;

  /**
   * Cross-axis alignment.
   */
  @property({ type: String, reflect: true })
  align: FlexAlign = "start";

  override connectedCallback(): void {
    super.connectedCallback();
    this.validateProps();
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);
    if (
      changedProperties.has("gap") ||
      changedProperties.has("rowGap") ||
      changedProperties.has("align")
    ) {
      this.validateProps();
    }
  }

  private validateProps(): void {
    validateToken(this.gap, SPACING_TOKENS, "gap", "ds-wrap");
    if (this.rowGap) {
      validateToken(this.rowGap, SPACING_TOKENS, "row-gap", "ds-wrap");
    }
    // Only validate start, center, end for Wrap align
    const wrapAlignValues: readonly FlexAlign[] = ["start", "center", "end"];
    validateToken(this.align, wrapAlignValues, "align", "ds-wrap");
  }

  override render(): TemplateResult {
    const classes = {
      "ds-wrap": true,
    };

    return html`
      <div
        class=${classMap(classes)}
        data-gap=${this.gap}
        data-row-gap=${this.rowGap || ""}
        data-align=${this.align}
        data-layout="wrap"
      >
        <slot></slot>
      </div>
    `;
  }
}

// Register the component
define("ds-wrap", DsWrap);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-wrap": DsWrap;
  }
}
