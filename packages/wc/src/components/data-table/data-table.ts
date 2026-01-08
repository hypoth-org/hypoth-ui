import { type TemplateResult, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import { emitEvent } from "../../events/emit.js";

export type DataTableSortDirection = "asc" | "desc" | "none";

export interface DataTableColumn {
  id: string;
  header: string;
  accessor?: string;
  sortable?: boolean;
  resizable?: boolean;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  align?: "left" | "center" | "right";
}

export interface DataTableSort {
  column: string;
  direction: DataTableSortDirection;
}

export interface DataTablePagination {
  page: number;
  pageSize: number;
  total: number;
}

// Navigation icons
const chevronIcon = html`
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M15 18l-6-6 6-6" />
  </svg>
`;

/**
 * DataTable component for large dataset display with virtualization,
 * filtering, pagination, and column features.
 *
 * @element ds-data-table
 *
 * @slot - Table content (use Table sub-components)
 *
 * @fires ds-sort - When sort changes
 * @fires ds-page-change - When page changes
 * @fires ds-page-size-change - When page size changes
 * @fires ds-selection-change - When row selection changes
 *
 * @cssprop --ds-data-table-border - Border style
 */
export class DsDataTable extends DSElement {
  static override styles = [];

  /**
   * Enable virtualization for large datasets.
   */
  @property({ type: Boolean, reflect: true })
  virtualized = false;

  /**
   * Row height for virtualization (in pixels).
   */
  @property({ type: Number, attribute: "row-height" })
  rowHeight = 48;

  /**
   * Number of overscan rows for virtualization.
   */
  @property({ type: Number })
  overscan = 5;

  /**
   * Total number of rows (for server-side pagination).
   */
  @property({ type: Number, attribute: "total-rows" })
  totalRows = 0;

  /**
   * Current page (1-indexed).
   */
  @property({ type: Number })
  page = 1;

  /**
   * Page size.
   */
  @property({ type: Number, attribute: "page-size" })
  pageSize = 10;

  /**
   * Available page sizes.
   */
  @property({ type: String, attribute: "page-sizes" })
  pageSizes = "10,25,50,100";

  /**
   * Enable row selection.
   */
  @property({ type: Boolean, reflect: true })
  selectable = false;

  /**
   * Selection mode.
   */
  @property({ type: String, attribute: "selection-mode" })
  selectionMode: "single" | "multiple" = "multiple";

  /**
   * Show loading state.
   */
  @property({ type: Boolean, reflect: true })
  loading = false;

  /**
   * Sort column ID.
   */
  @property({ type: String, attribute: "sort-column" })
  sortColumn = "";

  /**
   * Sort direction.
   */
  @property({ type: String, attribute: "sort-direction" })
  sortDirection: DataTableSortDirection = "none";

  /**
   * Filter/search query.
   */
  @property({ type: String })
  filter = "";

  /**
   * Empty state message.
   */
  @property({ type: String, attribute: "empty-message" })
  emptyMessage = "No data available";

  @state()
  private selectedRows: Set<string> = new Set();

  private get pageSizeOptions(): number[] {
    return this.pageSizes.split(",").map((s) => Number(s.trim()));
  }

  private get totalPages(): number {
    return Math.ceil(this.totalRows / this.pageSize);
  }

  private get startRow(): number {
    return (this.page - 1) * this.pageSize + 1;
  }

  private get endRow(): number {
    return Math.min(this.page * this.pageSize, this.totalRows);
  }

  handleSort(column: string): void {
    let newDirection: DataTableSortDirection = "asc";

    if (this.sortColumn === column) {
      if (this.sortDirection === "asc") {
        newDirection = "desc";
      } else if (this.sortDirection === "desc") {
        newDirection = "none";
      }
    }

    this.sortColumn = newDirection === "none" ? "" : column;
    this.sortDirection = newDirection;

    emitEvent(this, "sort", {
      detail: {
        column: this.sortColumn,
        direction: this.sortDirection,
      },
    });
  }

  handlePageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages) return;

    this.page = newPage;
    emitEvent(this, "page-change", { detail: { page: newPage } });
  }

  handlePageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newSize = Number(select.value);
    this.pageSize = newSize;
    this.page = 1; // Reset to first page
    emitEvent(this, "page-size-change", { detail: { pageSize: newSize } });
  }

  toggleRowSelection(rowId: string): void {
    if (!this.selectable) return;

    if (this.selectionMode === "single") {
      this.selectedRows.clear();
      this.selectedRows.add(rowId);
    } else {
      if (this.selectedRows.has(rowId)) {
        this.selectedRows.delete(rowId);
      } else {
        this.selectedRows.add(rowId);
      }
    }

    emitEvent(this, "selection-change", {
      detail: { selectedRows: Array.from(this.selectedRows) },
    });
    this.requestUpdate();
  }

  clearSelection(): void {
    this.selectedRows.clear();
    emitEvent(this, "selection-change", { detail: { selectedRows: [] } });
    this.requestUpdate();
  }

  isRowSelected(rowId: string): boolean {
    return this.selectedRows.has(rowId);
  }

  private renderPagination(): TemplateResult {
    const pages: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, this.page - Math.floor(maxButtons / 2));
    const end = Math.min(this.totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return html`
      <div class="ds-data-table__pagination">
        <button
          type="button"
          class="ds-data-table__page-button"
          ?disabled=${this.page === 1}
          @click=${() => this.handlePageChange(this.page - 1)}
          aria-label="Previous page"
        >
          ${chevronIcon}
        </button>

        ${pages.map(
          (p) => html`
            <button
              type="button"
              class="ds-data-table__page-button"
              ?data-active=${p === this.page}
              @click=${() => this.handlePageChange(p)}
              aria-label="Page ${p}"
              aria-current=${p === this.page ? "page" : nothing}
            >
              ${p}
            </button>
          `
        )}

        <button
          type="button"
          class="ds-data-table__page-button"
          ?disabled=${this.page === this.totalPages}
          @click=${() => this.handlePageChange(this.page + 1)}
          aria-label="Next page"
          style="transform: rotate(180deg)"
        >
          ${chevronIcon}
        </button>
      </div>
    `;
  }

  override render(): TemplateResult {
    const classes = {
      "ds-data-table": true,
    };

    return html`
      <div
        class=${classMap(classes)}
        role="region"
        aria-label="Data table"
        ?data-loading=${this.loading}
      >
        ${this.selectedRows.size > 0
          ? html`
              <div class="ds-data-table__selection-info">
                <span class="ds-data-table__selection-count">
                  ${this.selectedRows.size} selected
                </span>
                <button
                  type="button"
                  class="ds-data-table__clear-selection"
                  @click=${this.clearSelection}
                >
                  Clear
                </button>
              </div>
            `
          : nothing}

        <div
          class=${this.virtualized
            ? "ds-data-table__virtualized"
            : "ds-data-table__container"}
        >
          <slot></slot>

          ${this.loading
            ? html`
                <div class="ds-data-table__loading">
                  <ds-spinner size="lg"></ds-spinner>
                </div>
              `
            : nothing}
        </div>

        ${this.totalRows > 0
          ? html`
              <div class="ds-data-table__footer">
                <div class="ds-data-table__info">
                  Showing ${this.startRow}-${this.endRow} of ${this.totalRows}
                </div>

                <div class="ds-data-table__per-page">
                  <span>Rows per page:</span>
                  <select @change=${this.handlePageSizeChange}>
                    ${this.pageSizeOptions.map(
                      (size) => html`
                        <option value=${size} ?selected=${size === this.pageSize}>
                          ${size}
                        </option>
                      `
                    )}
                  </select>
                </div>

                ${this.renderPagination()}
              </div>
            `
          : nothing}
      </div>
    `;
  }
}

// Register the component
define("ds-data-table", DsDataTable);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-data-table": DsDataTable;
  }
}
