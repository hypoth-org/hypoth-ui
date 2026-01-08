/**
 * Split Web Component
 *
 * Two-region layout with collapse breakpoint.
 *
 * @element ds-split
 * @slot - Default slot for the two regions
 */

import { type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import type { BreakpointToken, SpacingToken, SplitRatio } from "../../types/layout-tokens.js";
import { BREAKPOINT_TOKENS, SPACING_TOKENS } from "../../types/layout-tokens.js";
import { validateToken } from "../../utils/token-validator.js";

const RATIO_VALUES: readonly SplitRatio[] = ["equal", "1:2", "2:1", "1:3", "3:1"] as const;

export class DsSplit extends DSElement {
  static override styles = [];

  /**
   * Breakpoint at which to collapse to single column.
   */
  @property({ type: String, reflect: true, attribute: "collapse-at" })
  collapseAt: BreakpointToken = "md";

  /**
   * Gap between regions.
   */
  @property({ type: String, reflect: true })
  gap: SpacingToken = "md";

  /**
   * Width ratio between regions.
   */
  @property({ type: String, reflect: true })
  ratio: SplitRatio = "equal";

  override connectedCallback(): void {
    super.connectedCallback();
    this.validateProps();
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);
    if (
      changedProperties.has("collapseAt") ||
      changedProperties.has("gap") ||
      changedProperties.has("ratio")
    ) {
      this.validateProps();
    }
  }

  private validateProps(): void {
    validateToken(this.collapseAt, BREAKPOINT_TOKENS, "collapse-at", "ds-split");
    validateToken(this.gap, SPACING_TOKENS, "gap", "ds-split");
    validateToken(this.ratio, RATIO_VALUES, "ratio", "ds-split");
  }

  override render(): TemplateResult {
    // Convert ratio format for data attribute (1:2 -> 1-2)
    const ratioData = this.ratio.replace(":", "-");

    const classes = {
      "ds-split": true,
    };

    return html`
      <div
        class=${classMap(classes)}
        data-collapse-at=${this.collapseAt}
        data-gap=${this.gap}
        data-ratio=${ratioData}
        data-layout="split"
      >
        <slot></slot>
      </div>
    `;
  }
}

// Register the component
define("ds-split", DsSplit);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-split": DsSplit;
  }
}
