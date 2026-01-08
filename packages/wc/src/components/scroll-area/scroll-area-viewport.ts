/**
 * ScrollAreaViewport component - scrollable content container.
 *
 * @element ds-scroll-area-viewport
 *
 * @slot - Scrollable content
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export class DsScrollAreaViewport extends DSElement {
  private resizeObserver: ResizeObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("tabindex", "0");

    this.addEventListener("scroll", this.handleScroll);

    // Observe for overflow changes
    this.resizeObserver = new ResizeObserver(() => {
      this.updateOverflowState();
    });
    this.resizeObserver.observe(this);

    this.updateComplete.then(() => {
      this.updateOverflowState();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("scroll", this.handleScroll);
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  private handleScroll = (): void => {
    this.updateScrollbarPositions();

    emitEvent(this, "ds:scroll", {
      detail: {
        scrollTop: this.scrollTop,
        scrollLeft: this.scrollLeft,
        scrollHeight: this.scrollHeight,
        scrollWidth: this.scrollWidth,
      },
      bubbles: true,
    });
  };

  private updateOverflowState(): void {
    const hasVerticalOverflow = this.scrollHeight > this.clientHeight;
    const hasHorizontalOverflow = this.scrollWidth > this.clientWidth;

    this.toggleAttribute("data-overflow-y", hasVerticalOverflow);
    this.toggleAttribute("data-overflow-x", hasHorizontalOverflow);

    // Update scrollbar visibility
    const scrollArea = this.closest("ds-scroll-area");
    if (scrollArea) {
      scrollArea.toggleAttribute("data-overflow-y", hasVerticalOverflow);
      scrollArea.toggleAttribute("data-overflow-x", hasHorizontalOverflow);
    }

    this.updateScrollbarPositions();
  }

  private updateScrollbarPositions(): void {
    const scrollArea = this.closest("ds-scroll-area");
    if (!scrollArea) return;

    const scrollbars = scrollArea.querySelectorAll("ds-scroll-area-scrollbar");

    for (const scrollbar of scrollbars) {
      const orientation = scrollbar.getAttribute("orientation") || "vertical";
      const thumb = scrollbar.querySelector("ds-scroll-area-thumb");

      if (!thumb) continue;

      if (orientation === "vertical") {
        const scrollRatio = this.scrollTop / (this.scrollHeight - this.clientHeight);
        const thumbHeight = (this.clientHeight / this.scrollHeight) * 100;
        const thumbTop = scrollRatio * (100 - thumbHeight);

        (thumb as HTMLElement).style.height = `${Math.max(10, thumbHeight)}%`;
        (thumb as HTMLElement).style.top = `${thumbTop}%`;
      } else {
        const scrollRatio = this.scrollLeft / (this.scrollWidth - this.clientWidth);
        const thumbWidth = (this.clientWidth / this.scrollWidth) * 100;
        const thumbLeft = scrollRatio * (100 - thumbWidth);

        (thumb as HTMLElement).style.width = `${Math.max(10, thumbWidth)}%`;
        (thumb as HTMLElement).style.left = `${thumbLeft}%`;
      }
    }
  }

  /**
   * Scrolls to a specific position.
   */
  public scrollToPosition(options: ScrollToOptions): void {
    this.scrollTo(options);
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-scroll-area-viewport", DsScrollAreaViewport);

declare global {
  interface HTMLElementTagNameMap {
    "ds-scroll-area-viewport": DsScrollAreaViewport;
  }
}
