/**
 * ScrollAreaThumb component - draggable scrollbar thumb.
 *
 * @element ds-scroll-area-thumb
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

/**
 * Cached dimensions for scrollbar track to avoid layout thrashing.
 * Updated via ResizeObserver instead of per-frame getBoundingClientRect calls.
 */
interface CachedDimensions {
  width: number;
  height: number;
}

export class DsScrollAreaThumb extends DSElement {
  private isDragging = false;
  private startY = 0;
  private startX = 0;
  private startScrollTop = 0;
  private startScrollLeft = 0;

  /** Cached scrollbar dimensions to avoid layout thrashing during drag */
  private cachedDimensions: CachedDimensions = { width: 0, height: 0 };

  /** ResizeObserver for tracking scrollbar size changes */
  private resizeObserver: ResizeObserver | null = null;

  /** Scrollbar element reference for ResizeObserver */
  private scrollbarElement: HTMLElement | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener("mousedown", this.handleMouseDown);
    this.addEventListener("touchstart", this.handleTouchStart, { passive: false });

    // Set up ResizeObserver for dimension caching
    this.setupResizeObserver();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("mousedown", this.handleMouseDown);
    this.removeEventListener("touchstart", this.handleTouchStart);
    this.cleanupDrag();
    this.cleanupResizeObserver();
  }

  /**
   * Set up ResizeObserver to cache scrollbar dimensions.
   * This avoids calling getBoundingClientRect on every drag event.
   */
  private setupResizeObserver(): void {
    // Clean up any existing observer
    this.cleanupResizeObserver();

    const scrollbar = this.closest("ds-scroll-area-scrollbar") as HTMLElement | null;
    if (!scrollbar) return;

    this.scrollbarElement = scrollbar;

    // Create ResizeObserver to update cached dimensions on resize
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this.scrollbarElement) {
          // Use contentRect for dimensions (avoids additional layout)
          this.cachedDimensions = {
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          };
        }
      }
    });

    this.resizeObserver.observe(scrollbar);

    // Initialize cached dimensions
    const rect = scrollbar.getBoundingClientRect();
    this.cachedDimensions = {
      width: rect.width,
      height: rect.height,
    };
  }

  /**
   * Clean up ResizeObserver on disconnect.
   */
  private cleanupResizeObserver(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.scrollbarElement = null;
  }

  private getViewport(): HTMLElement | null {
    const scrollArea = this.closest("ds-scroll-area");
    return scrollArea?.querySelector("ds-scroll-area-viewport") || null;
  }

  private getOrientation(): "vertical" | "horizontal" {
    const scrollbar = this.closest("ds-scroll-area-scrollbar");
    return (scrollbar?.getAttribute("orientation") as "vertical" | "horizontal") || "vertical";
  }

  private handleMouseDown = (event: MouseEvent): void => {
    event.preventDefault();
    this.startDrag(event.clientX, event.clientY);

    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
  };

  private handleMouseMove = (event: MouseEvent): void => {
    if (!this.isDragging) return;
    this.drag(event.clientX, event.clientY);
  };

  private handleMouseUp = (): void => {
    this.cleanupDrag();
  };

  private handleTouchStart = (event: TouchEvent): void => {
    const touch = event.touches[0];
    if (!touch) return;

    event.preventDefault();
    this.startDrag(touch.clientX, touch.clientY);

    document.addEventListener("touchmove", this.handleTouchMove, { passive: false });
    document.addEventListener("touchend", this.handleTouchEnd);
  };

  private handleTouchMove = (event: TouchEvent): void => {
    if (!this.isDragging) return;

    const touch = event.touches[0];
    if (!touch) return;

    event.preventDefault();
    this.drag(touch.clientX, touch.clientY);
  };

  private handleTouchEnd = (): void => {
    this.cleanupDrag();
  };

  private startDrag(clientX: number, clientY: number): void {
    const viewport = this.getViewport();
    if (!viewport) return;

    this.isDragging = true;
    this.startX = clientX;
    this.startY = clientY;
    this.startScrollTop = viewport.scrollTop;
    this.startScrollLeft = viewport.scrollLeft;

    this.setAttribute("data-dragging", "");
    document.body.style.userSelect = "none";
  }

  /**
   * Handle drag movement using cached dimensions.
   * Uses ResizeObserver-cached values instead of getBoundingClientRect
   * to avoid layout thrashing during drag operations.
   */
  private drag(clientX: number, clientY: number): void {
    const viewport = this.getViewport();
    if (!viewport) return;

    const orientation = this.getOrientation();

    // Use cached dimensions instead of calling getBoundingClientRect
    // This prevents layout thrashing during high-frequency drag events
    const { width: trackWidth, height: trackHeight } = this.cachedDimensions;

    if (orientation === "vertical") {
      const deltaY = clientY - this.startY;
      const scrollableHeight = viewport.scrollHeight - viewport.clientHeight;

      // Guard against division by zero
      if (trackHeight > 0 && scrollableHeight > 0) {
        const scrollDelta = (deltaY / trackHeight) * scrollableHeight;
        viewport.scrollTop = this.startScrollTop + scrollDelta;
      }
    } else {
      const deltaX = clientX - this.startX;
      const scrollableWidth = viewport.scrollWidth - viewport.clientWidth;

      // Guard against division by zero
      if (trackWidth > 0 && scrollableWidth > 0) {
        const scrollDelta = (deltaX / trackWidth) * scrollableWidth;
        viewport.scrollLeft = this.startScrollLeft + scrollDelta;
      }
    }
  }

  private cleanupDrag(): void {
    this.isDragging = false;
    this.removeAttribute("data-dragging");
    document.body.style.userSelect = "";

    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
    document.removeEventListener("touchmove", this.handleTouchMove);
    document.removeEventListener("touchend", this.handleTouchEnd);
  }

  override render() {
    return html``;
  }
}

define("ds-scroll-area-thumb", DsScrollAreaThumb);

declare global {
  interface HTMLElementTagNameMap {
    "ds-scroll-area-thumb": DsScrollAreaThumb;
  }
}
