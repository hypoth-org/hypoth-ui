/**
 * Grid Web Component
 *
 * 2D grid layout with responsive columns.
 *
 * @element ds-grid
 * @slot - Default slot for grid items
 */

import { type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import type { SpacingToken } from "../../types/layout-tokens.js";
import { SPACING_TOKENS } from "../../types/layout-tokens.js";
import {
  generateResponsiveClasses,
  getBaseValue,
  isResponsiveValue,
} from "../../utils/responsive.js";
import { validateResponsiveToken, validateToken } from "../../utils/token-validator.js";

const COLUMN_VALUES = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "auto-fit",
  "auto-fill",
] as const;

export class DsGrid extends DSElement {
  static override styles = [];

  /**
   * Number of columns. Supports responsive syntax: "base:1 md:2 lg:3"
   */
  @property({ type: String, reflect: true })
  columns = "1";

  /**
   * Gap between grid items. Supports responsive syntax: "base:sm lg:lg"
   */
  @property({ type: String, reflect: true })
  gap = "md";

  /**
   * Row gap override.
   */
  @property({ type: String, reflect: true, attribute: "row-gap" })
  rowGap?: SpacingToken;

  /**
   * Column gap override.
   */
  @property({ type: String, reflect: true, attribute: "column-gap" })
  columnGap?: SpacingToken;

  override connectedCallback(): void {
    super.connectedCallback();
    this.validateProps();
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);
    if (
      changedProperties.has("columns") ||
      changedProperties.has("gap") ||
      changedProperties.has("rowGap") ||
      changedProperties.has("columnGap")
    ) {
      this.validateProps();
    }
  }

  private validateProps(): void {
    validateResponsiveToken(this.columns, COLUMN_VALUES, "columns", "ds-grid");
    validateResponsiveToken(this.gap, SPACING_TOKENS, "gap", "ds-grid");
    if (this.rowGap) {
      validateToken(this.rowGap, SPACING_TOKENS, "row-gap", "ds-grid");
    }
    if (this.columnGap) {
      validateToken(this.columnGap, SPACING_TOKENS, "column-gap", "ds-grid");
    }
  }

  override render(): TemplateResult {
    // Get base values for data attributes
    const baseColumns = isResponsiveValue(this.columns) ? getBaseValue(this.columns) : this.columns;

    const baseGap = isResponsiveValue(this.gap)
      ? getBaseValue<SpacingToken>(this.gap)
      : (this.gap as SpacingToken);

    // Generate responsive classes
    const columnsClasses = isResponsiveValue(this.columns)
      ? generateResponsiveClasses("grid", "cols", this.columns)
      : [];

    const gapClasses = isResponsiveValue(this.gap)
      ? generateResponsiveClasses("grid", "gap", this.gap)
      : [];

    const classes = {
      "ds-grid": true,
      ...Object.fromEntries(columnsClasses.map((c) => [c, true])),
      ...Object.fromEntries(gapClasses.map((c) => [c, true])),
    };

    return html`
      <div
        class=${classMap(classes)}
        data-columns=${baseColumns}
        data-gap=${baseGap}
        data-row-gap=${this.rowGap || ""}
        data-column-gap=${this.columnGap || ""}
        data-layout="grid"
      >
        <slot></slot>
      </div>
    `;
  }
}

// Register the component
define("ds-grid", DsGrid);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-grid": DsGrid;
  }
}
