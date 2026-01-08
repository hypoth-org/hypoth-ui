/**
 * Pagination component - page navigation.
 *
 * @element ds-pagination
 *
 * @slot - Pagination content
 *
 * @fires ds:page-change - Fired when page changes
 *
 * @example
 * ```html
 * <ds-pagination page="1" total-pages="10">
 *   <ds-pagination-content>
 *     <ds-pagination-previous></ds-pagination-previous>
 *     <ds-pagination-item>
 *       <ds-pagination-link page="1">1</ds-pagination-link>
 *     </ds-pagination-item>
 *     <ds-pagination-ellipsis></ds-pagination-ellipsis>
 *     <ds-pagination-next></ds-pagination-next>
 *   </ds-pagination-content>
 * </ds-pagination>
 * ```
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

// Import child components
import "./pagination-content.js";
import "./pagination-item.js";
import "./pagination-link.js";
import "./pagination-previous.js";
import "./pagination-next.js";
import "./pagination-ellipsis.js";

export class DsPagination extends DSElement {
  /** Current page (1-indexed) */
  @property({ type: Number, reflect: true })
  page = 1;

  /** Total number of pages */
  @property({ type: Number, attribute: "total-pages" })
  totalPages = 1;

  /** Number of sibling pages to show */
  @property({ type: Number, attribute: "sibling-count" })
  siblingCount = 1;

  /** Number of boundary pages to show */
  @property({ type: Number, attribute: "boundary-count" })
  boundaryCount = 1;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "navigation");
    this.setAttribute("aria-label", "Pagination");

    this.addEventListener("ds:page-select", this.handlePageSelect as EventListener);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("ds:page-select", this.handlePageSelect as EventListener);
  }

  /**
   * Navigate to a specific page.
   */
  public goToPage(newPage: number): void {
    const clampedPage = Math.max(1, Math.min(newPage, this.totalPages));

    if (clampedPage !== this.page) {
      this.page = clampedPage;
      this.updateActiveState();

      emitEvent(this, "ds:page-change", {
        detail: { page: this.page },
        bubbles: true,
      });
    }
  }

  /**
   * Go to previous page.
   */
  public previousPage(): void {
    this.goToPage(this.page - 1);
  }

  /**
   * Go to next page.
   */
  public nextPage(): void {
    this.goToPage(this.page + 1);
  }

  private handlePageSelect = (event: CustomEvent<{ page: number }>): void => {
    event.stopPropagation();
    this.goToPage(event.detail.page);
  };

  private updateActiveState(): void {
    const links = this.querySelectorAll("ds-pagination-link");
    for (const link of links) {
      const linkPage = Number(link.getAttribute("page"));
      if (linkPage === this.page) {
        link.setAttribute("aria-current", "page");
        link.setAttribute("active", "");
      } else {
        link.removeAttribute("aria-current");
        link.removeAttribute("active");
      }
    }

    // Update prev/next disabled state
    const prevButton = this.querySelector("ds-pagination-previous");
    const nextButton = this.querySelector("ds-pagination-next");

    if (prevButton) {
      if (this.page <= 1) {
        prevButton.setAttribute("disabled", "");
      } else {
        prevButton.removeAttribute("disabled");
      }
    }

    if (nextButton) {
      if (this.page >= this.totalPages) {
        nextButton.setAttribute("disabled", "");
      } else {
        nextButton.removeAttribute("disabled");
      }
    }
  }

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("page") || changedProperties.has("totalPages")) {
      this.updateActiveState();
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-pagination", DsPagination);

declare global {
  interface HTMLElementTagNameMap {
    "ds-pagination": DsPagination;
  }
}
