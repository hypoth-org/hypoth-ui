/**
 * ScrollAreaThumb component - draggable scrollbar thumb.
 *
 * @element ds-scroll-area-thumb
 */

import { html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsScrollAreaThumb extends DSElement {
  private isDragging = false;
  private startY = 0;
  private startX = 0;
  private startScrollTop = 0;
  private startScrollLeft = 0;

  override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener("mousedown", this.handleMouseDown);
    this.addEventListener("touchstart", this.handleTouchStart, { passive: false });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("mousedown", this.handleMouseDown);
    this.removeEventListener("touchstart", this.handleTouchStart);
    this.cleanupDrag();
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

  private drag(clientX: number, clientY: number): void {
    const viewport = this.getViewport();
    const scrollbar = this.closest("ds-scroll-area-scrollbar");
    if (!viewport || !scrollbar) return;

    const orientation = this.getOrientation();
    const scrollbarRect = scrollbar.getBoundingClientRect();

    if (orientation === "vertical") {
      const deltaY = clientY - this.startY;
      const scrollableHeight = viewport.scrollHeight - viewport.clientHeight;
      const trackHeight = scrollbarRect.height;
      const scrollDelta = (deltaY / trackHeight) * scrollableHeight;

      viewport.scrollTop = this.startScrollTop + scrollDelta;
    } else {
      const deltaX = clientX - this.startX;
      const scrollableWidth = viewport.scrollWidth - viewport.clientWidth;
      const trackWidth = scrollbarRect.width;
      const scrollDelta = (deltaX / trackWidth) * scrollableWidth;

      viewport.scrollLeft = this.startScrollLeft + scrollDelta;
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
