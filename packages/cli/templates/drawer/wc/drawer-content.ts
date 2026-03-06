/**
 * DrawerContent component - container for drawer content with swipe support.
 *
 * @element ds-drawer-content
 *
 * @slot - Drawer content (header, body, footer)
 *
 * @fires ds:drawer-close - Fired when swipe gesture dismisses drawer
 */

import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";
import type { DrawerSide } from "./drawer.js";

export class DsDrawerContent extends DSElement {
  /** Side of the screen the drawer appears from (set by parent) */
  @property({ reflect: true })
  side: DrawerSide = "bottom";

  /** Data state for animations */
  @property({ attribute: "data-state", reflect: true })
  dataState: "open" | "closed" = "closed";

  /** Whether swipe-to-dismiss is enabled (set by parent) */
  @property({ type: Boolean, attribute: "swipe-dismiss" })
  swipeDismiss = true;

  /** Current swipe offset during drag */
  @state()
  private swipeOffset = 0;

  /** Whether currently dragging */
  @state()
  private isDragging = false;

  private startY = 0;
  private startX = 0;

  override connectedCallback(): void {
    super.connectedCallback();

    // Add touch event listeners for swipe-to-dismiss
    this.addEventListener("touchstart", this.handleTouchStart, { passive: true });
    this.addEventListener("touchmove", this.handleTouchMove, { passive: false });
    this.addEventListener("touchend", this.handleTouchEnd, { passive: true });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("touchstart", this.handleTouchStart);
    this.removeEventListener("touchmove", this.handleTouchMove);
    this.removeEventListener("touchend", this.handleTouchEnd);
  }

  private handleTouchStart = (event: TouchEvent): void => {
    if (!this.swipeDismiss) return;

    const touch = event.touches[0];
    if (!touch) return;

    this.startY = touch.clientY;
    this.startX = touch.clientX;
    this.isDragging = true;
  };

  private handleTouchMove = (event: TouchEvent): void => {
    if (!this.swipeDismiss || !this.isDragging) return;

    const touch = event.touches[0];
    if (!touch) return;

    const deltaY = touch.clientY - this.startY;
    const deltaX = touch.clientX - this.startX;

    // Calculate offset based on side
    let offset = 0;
    switch (this.side) {
      case "bottom":
        offset = Math.max(0, deltaY);
        break;
      case "top":
        offset = Math.max(0, -deltaY);
        break;
      case "left":
        offset = Math.max(0, -deltaX);
        break;
      case "right":
        offset = Math.max(0, deltaX);
        break;
    }

    if (offset > 0) {
      event.preventDefault();
      this.swipeOffset = offset;
      this.updateSwipeTransform();
    }
  };

  private handleTouchEnd = (): void => {
    if (!this.swipeDismiss || !this.isDragging) return;

    this.isDragging = false;

    // If swiped more than 100px or 30% of content height, close
    const threshold = Math.min(100, this.offsetHeight * 0.3);

    if (this.swipeOffset > threshold) {
      emitEvent(this, "ds:drawer-close", { bubbles: true });
    } else {
      // Reset position
      this.swipeOffset = 0;
      this.style.transform = "";
    }
  };

  private updateSwipeTransform(): void {
    switch (this.side) {
      case "bottom":
        this.style.transform = `translateY(${this.swipeOffset}px)`;
        break;
      case "top":
        this.style.transform = `translateY(-${this.swipeOffset}px)`;
        break;
      case "left":
        this.style.transform = `translateX(-${this.swipeOffset}px)`;
        break;
      case "right":
        this.style.transform = `translateX(${this.swipeOffset}px)`;
        break;
    }
  }

  override render() {
    return html`
      <div class="ds-drawer__handle"></div>
      <slot></slot>
    `;
  }
}

define("ds-drawer-content", DsDrawerContent);

declare global {
  interface HTMLElementTagNameMap {
    "ds-drawer-content": DsDrawerContent;
  }
}
