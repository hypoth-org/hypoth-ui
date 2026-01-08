import { type TemplateResult, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import type { TableAlign } from "./table-head.js";

/**
 * Table cell component (td).
 *
 * @element ds-table-cell
 *
 * @slot - Cell content
 */
export class DsTableCell extends DSElement {
  static override styles = [];

  /**
   * Text alignment.
   */
  @property({ type: String, reflect: true })
  align: TableAlign = "left";

  /**
   * Column span.
   */
  @property({ type: Number })
  colspan = 1;

  /**
   * Row span.
   */
  @property({ type: Number })
  rowspan = 1;

  override render(): TemplateResult {
    return html`
      <td
        class="ds-table__cell"
        role="gridcell"
        data-align=${this.align !== "left" ? this.align : nothing}
        colspan=${this.colspan > 1 ? this.colspan : nothing}
        rowspan=${this.rowspan > 1 ? this.rowspan : nothing}
      >
        <slot></slot>
      </td>
    `;
  }
}

// Register the component
define("ds-table-cell", DsTableCell);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-table-cell": DsTableCell;
  }
}
