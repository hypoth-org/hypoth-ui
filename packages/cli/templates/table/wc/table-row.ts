import { type TemplateResult, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

/**
 * Table row component (tr).
 *
 * @element ds-table-row
 *
 * @slot - TableHead or TableCell elements
 */
export class DsTableRow extends DSElement {
  static override styles = [];

  /**
   * Row ID for selection tracking.
   */
  @property({ type: String, attribute: "row-id" })
  rowId = "";

  /**
   * Whether this row is selected.
   */
  @property({ type: Boolean, reflect: true })
  selected = false;

  override render(): TemplateResult {
    return html`
      <tr
        class="ds-table__row"
        role="row"
        ?data-selected=${this.selected}
        aria-selected=${this.selected ? "true" : nothing}
      >
        <slot></slot>
      </tr>
    `;
  }
}

// Register the component
define("ds-table-row", DsTableRow);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-table-row": DsTableRow;
  }
}
