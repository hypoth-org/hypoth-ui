import { type TemplateResult, html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

/**
 * Table body component (tbody).
 *
 * @element ds-table-body
 *
 * @slot - TableRow elements for body
 */
export class DsTableBody extends DSElement {
  static override styles = [];

  override render(): TemplateResult {
    return html`
      <tbody class="ds-table__body" role="rowgroup">
        <slot></slot>
      </tbody>
    `;
  }
}

// Register the component
define("ds-table-body", DsTableBody);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-table-body": DsTableBody;
  }
}
