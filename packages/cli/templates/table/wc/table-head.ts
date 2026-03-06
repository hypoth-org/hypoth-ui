import { type TemplateResult, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export type TableAlign = "left" | "center" | "right";
export type SortDirection = "asc" | "desc" | "none";

// Sort icon SVG
const sortIcon = html`
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M12 5v14M5 12l7-7 7 7" />
  </svg>
`;

/**
 * Table header cell component (th).
 *
 * @element ds-table-head
 *
 * @slot - Header content
 *
 * @fires ds-sort - When sortable header is clicked
 */
export class DsTableHead extends DSElement {
  static override styles = [];

  /**
   * Column key for sorting.
   */
  @property({ type: String })
  column = "";

  /**
   * Text alignment.
   */
  @property({ type: String, reflect: true })
  align: TableAlign = "left";

  /**
   * Whether this column is sortable.
   */
  @property({ type: Boolean, reflect: true })
  sortable = false;

  /**
   * Current sort direction.
   */
  @property({ type: String, attribute: "sort-direction", reflect: true })
  sortDirection: SortDirection = "none";

  /**
   * Column width (CSS value).
   */
  @property({ type: String })
  width = "";

  private handleClick(): void {
    if (!this.sortable) return;

    emitEvent(this, "sort", {
      detail: {
        column: this.column,
        direction: this.getNextDirection(),
      },
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.sortable) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleClick();
    }
  }

  private getNextDirection(): SortDirection {
    if (this.sortDirection === "none") return "asc";
    if (this.sortDirection === "asc") return "desc";
    return "none";
  }

  /**
   * Get the aria-sort attribute value.
   * Per APG, sortable columns should always have aria-sort:
   * - "ascending" for A-Z or low-high sort
   * - "descending" for Z-A or high-low sort
   * - "none" when sortable but not currently sorted
   */
  private getAriaSort(): "ascending" | "descending" | "none" {
    if (this.sortDirection === "asc") return "ascending";
    if (this.sortDirection === "desc") return "descending";
    return "none";
  }

  override render(): TemplateResult {
    const style = this.width ? `width: ${this.width}` : "";

    return html`
      <th
        class="ds-table__head"
        role="columnheader"
        scope="col"
        data-align=${this.align !== "left" ? this.align : nothing}
        ?data-sortable=${this.sortable}
        data-sort-direction=${this.sortable ? this.sortDirection : nothing}
        aria-sort=${this.sortable ? this.getAriaSort() : nothing}
        tabindex=${this.sortable ? 0 : nothing}
        style=${style || nothing}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <slot></slot>
        ${this.sortable ? html`<span class="ds-table__sort-icon">${sortIcon}</span>` : nothing}
      </th>
    `;
  }
}

// Register the component
define("ds-table-head", DsTableHead);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-table-head": DsTableHead;
  }
}
