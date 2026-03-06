/**
 * ScrollAreaScrollbar component - scrollbar track.
 *
 * @element ds-scroll-area-scrollbar
 *
 * @slot - Scrollbar thumb
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsScrollAreaScrollbar extends DSElement {
  /** Scrollbar orientation */
  @property({ type: String, reflect: true })
  orientation: "vertical" | "horizontal" = "vertical";

  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private isHovered = false;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute("role", "scrollbar");
    this.setAttribute("aria-orientation", this.orientation);

    // Handle track click
    this.addEventListener("mousedown", this.handleTrackClick);
    this.addEventListener("mouseenter", this.handleMouseEnter);
    this.addEventListener("mouseleave", this.handleMouseLeave);

    // Listen for viewport scroll
    const scrollArea = this.closest("ds-scroll-area");
    const viewport = scrollArea?.querySelector("ds-scroll-area-viewport");
    if (viewport) {
      viewport.addEventListener("scroll", this.handleViewportScroll);
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("mousedown", this.handleTrackClick);
    this.removeEventListener("mouseenter", this.handleMouseEnter);
    this.removeEventListener("mouseleave", this.handleMouseLeave);

    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }

    const scrollArea = this.closest("ds-scroll-area");
    const viewport = scrollArea?.querySelector("ds-scroll-area-viewport");
    if (viewport) {
      viewport.removeEventListener("scroll", this.handleViewportScroll);
    }
  }

  private handleTrackClick = (event: MouseEvent): void => {
    // Ignore if clicking on thumb
    const thumb = event.target as HTMLElement;
    if (thumb.tagName === "DS-SCROLL-AREA-THUMB") return;

    const scrollArea = this.closest("ds-scroll-area");
    const viewport = scrollArea?.querySelector("ds-scroll-area-viewport");
    if (!viewport) return;

    const rect = this.getBoundingClientRect();

    if (this.orientation === "vertical") {
      const clickRatio = (event.clientY - rect.top) / rect.height;
      const scrollHeight = viewport.scrollHeight - viewport.clientHeight;
      viewport.scrollTo({
        top: clickRatio * scrollHeight,
        behavior: "smooth",
      });
    } else {
      const clickRatio = (event.clientX - rect.left) / rect.width;
      const scrollWidth = viewport.scrollWidth - viewport.clientWidth;
      viewport.scrollTo({
        left: clickRatio * scrollWidth,
        behavior: "smooth",
      });
    }
  };

  private handleViewportScroll = (): void => {
    // Show scrollbar
    this.setAttribute("data-state", "visible");

    // Schedule hide (for hover type)
    this.scheduleHide();
  };

  private handleMouseEnter = (): void => {
    this.isHovered = true;
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  };

  private handleMouseLeave = (): void => {
    this.isHovered = false;
    this.scheduleHide();
  };

  private scheduleHide(): void {
    const scrollArea = this.closest("ds-scroll-area");
    const type = scrollArea?.getAttribute("type") || "hover";

    if (type !== "hover") return;

    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }

    const delay = Number(scrollArea?.getAttribute("scroll-hide-delay")) || 600;

    this.hideTimer = setTimeout(() => {
      if (!this.isHovered) {
        this.setAttribute("data-state", "hidden");
      }
    }, delay);
  }

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("orientation")) {
      this.setAttribute("aria-orientation", this.orientation);
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-scroll-area-scrollbar", DsScrollAreaScrollbar);

declare global {
  interface HTMLElementTagNameMap {
    "ds-scroll-area-scrollbar": DsScrollAreaScrollbar;
  }
}
