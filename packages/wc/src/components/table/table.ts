import { type TemplateResult, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export type TableSize = "compact" | "default" | "spacious";

/**
 * Table root component.
 *
 * @element ds-table
 *
 * @slot - Table content (thead, tbody, tfoot)
 *
 * @cssprop --ds-table-border - Border style
 * @cssprop --ds-table-radius - Border radius
 * @cssprop --ds-table-bg - Background color
 */
export class DsTable extends DSElement {
  static override styles = [];

  /**
   * Size variant.
   */
  @property({ type: String, reflect: true })
  size: TableSize = "default";

  /**
   * Whether to show striped rows.
   */
  @property({ type: Boolean, reflect: true })
  striped = false;

  /**
   * Whether to remove borders.
   */
  @property({ type: Boolean, reflect: true })
  borderless = false;

  /**
   * Whether to use fixed layout.
   */
  @property({ type: Boolean, reflect: true })
  fixed = false;

  /**
   * Whether header is sticky.
   */
  @property({ type: Boolean, attribute: "sticky-header", reflect: true })
  stickyHeader = false;

  /**
   * Accessible caption for screen readers.
   */
  @property({ type: String })
  caption = "";

  override render(): TemplateResult {
    const classes = {
      "ds-table": true,
    };

    return html`
      <table
        class=${classMap(classes)}
        role="grid"
        data-size=${this.size !== "default" ? this.size : nothing}
        ?data-striped=${this.striped}
        ?data-borderless=${this.borderless}
        ?data-fixed=${this.fixed}
        ?data-sticky-header=${this.stickyHeader}
      >
        ${this.caption
          ? html`<caption class="ds-table__caption">${this.caption}</caption>`
          : nothing}
        <slot></slot>
      </table>
    `;
  }
}

// Register the component
define("ds-table", DsTable);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-table": DsTable;
  }
}
