/**
 * Flow Web Component
 *
 * Primary 1D layout primitive with responsive direction switching.
 * Replaces separate Stack/Inline components with unified API.
 *
 * @element ds-flow
 * @slot - Default slot for children
 */

import { type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import type {
  FlexAlign,
  FlexDirection,
  FlexJustify,
  FlexWrap,
  SpacingToken,
} from "../../types/layout-tokens.js";
import {
  FLEX_ALIGN_VALUES,
  FLEX_DIRECTION_VALUES,
  FLEX_JUSTIFY_VALUES,
  SPACING_TOKENS,
} from "../../types/layout-tokens.js";
import {
  generateResponsiveClasses,
  getBaseValue,
  isResponsiveValue,
} from "../../utils/responsive.js";
import { validateResponsiveToken, validateToken } from "../../utils/token-validator.js";

export class DsFlow extends DSElement {
  static override styles = [];

  /**
   * Flex direction. Supports responsive syntax: "base:column md:row"
   */
  @property({ type: String, reflect: true })
  direction = "row";

  /**
   * Gap between children. Supports responsive syntax: "base:sm md:lg"
   */
  @property({ type: String, reflect: true })
  gap = "none";

  /**
   * Cross-axis alignment.
   */
  @property({ type: String, reflect: true })
  align: FlexAlign = "stretch";

  /**
   * Main-axis alignment.
   */
  @property({ type: String, reflect: true })
  justify: FlexJustify = "start";

  /**
   * Flex wrap behavior.
   */
  @property({ type: String, reflect: true })
  wrap: FlexWrap = "nowrap";

  /**
   * Use inline-flex instead of flex.
   */
  @property({ type: Boolean, reflect: true })
  inline = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.validateProps();
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);
    if (
      changedProperties.has("direction") ||
      changedProperties.has("gap") ||
      changedProperties.has("align") ||
      changedProperties.has("justify")
    ) {
      this.validateProps();
    }
  }

  private validateProps(): void {
    validateResponsiveToken(this.direction, FLEX_DIRECTION_VALUES, "direction", "ds-flow");
    validateResponsiveToken(this.gap, SPACING_TOKENS, "gap", "ds-flow");
    validateToken(this.align, FLEX_ALIGN_VALUES, "align", "ds-flow");
    validateToken(this.justify, FLEX_JUSTIFY_VALUES, "justify", "ds-flow");
  }

  override render(): TemplateResult {
    // Get base values for data attributes
    const baseDirection = isResponsiveValue(this.direction)
      ? getBaseValue<FlexDirection>(this.direction)
      : (this.direction as FlexDirection);

    const baseGap = isResponsiveValue(this.gap)
      ? getBaseValue<SpacingToken>(this.gap)
      : (this.gap as SpacingToken);

    // Generate responsive classes
    const directionClasses = isResponsiveValue(this.direction)
      ? generateResponsiveClasses("flow", "dir", this.direction)
      : [];

    const gapClasses = isResponsiveValue(this.gap)
      ? generateResponsiveClasses("flow", "gap", this.gap)
      : [];

    const classes = {
      "ds-flow": true,
      "ds-flow--inline": this.inline,
      ...Object.fromEntries(directionClasses.map((c) => [c, true])),
      ...Object.fromEntries(gapClasses.map((c) => [c, true])),
    };

    return html`
      <div
        class=${classMap(classes)}
        data-direction=${baseDirection}
        data-gap=${baseGap}
        data-align=${this.align}
        data-justify=${this.justify}
        data-wrap=${this.wrap}
        data-layout="flow"
      >
        <slot></slot>
      </div>
    `;
  }
}

// Register the component
define("ds-flow", DsFlow);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-flow": DsFlow;
  }
}
