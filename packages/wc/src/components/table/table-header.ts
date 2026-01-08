import { type TemplateResult, html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

/**
 * Table header component (thead).
 *
 * @element ds-table-header
 *
 * @slot - TableRow elements for header
 */
export class DsTableHeader extends DSElement {
  static override styles = [];

  override render(): TemplateResult {
    return html`
      <thead class="ds-table__header" role="rowgroup">
        <slot></slot>
      </thead>
    `;
  }
}

// Register the component
define("ds-table-header", DsTableHeader);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-table-header": DsTableHeader;
  }
}
