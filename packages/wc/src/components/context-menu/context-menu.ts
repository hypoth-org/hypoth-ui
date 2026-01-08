/**
 * ContextMenu component - right-click context menu.
 *
 * Opens at pointer position on right-click or long-press.
 *
 * @element ds-context-menu
 *
 * @slot trigger - Area that triggers the context menu
 * @slot - Menu content (ds-context-menu-content)
 *
 * @fires ds:open - Fired when menu opens
 * @fires ds:close - Fired when menu closes
 * @fires ds:select - Fired when an item is selected
 *
 * @example
 * ```html
 * <ds-context-menu>
 *   <div slot="trigger">Right-click me</div>
 *   <ds-context-menu-content>
 *     <ds-context-menu-item value="copy">Copy</ds-context-menu-item>
 *     <ds-context-menu-item value="paste">Paste</ds-context-menu-item>
 *   </ds-context-menu-content>
 * </ds-context-menu>
 * ```
 */

import {
  type DismissableLayer,
  type Presence,
  type RovingFocus,
  type TypeAhead,
  createDismissableLayer,
  createPresence,
  createRovingFocus,
  createTypeAhead,
  prefersReducedMotion,
} from "@ds/primitives-dom";
import { html } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

// Import child components to ensure they're registered
import type { DsContextMenuContent } from "./context-menu-content.js";
import "./context-menu-content.js";
import "./context-menu-item.js";
import "./context-menu-separator.js";
import "./context-menu-label.js";

export class DsContextMenu extends DSElement {
  /** Whether the menu is open */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** Whether to animate open/close transitions */
  @property({ type: Boolean })
  animated = true;

  /** Position X for menu */
  @state()
  private pointerX = 0;

  /** Position Y for menu */
  @state()
  private pointerY = 0;

  private dismissLayer: DismissableLayer | null = null;
  private presence: Presence | null = null;
  private rovingFocus: RovingFocus | null = null;
  private typeAhead: TypeAhead | null = null;
  private longPressTimer: ReturnType<typeof setTimeout> | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    // Listen for context menu triggers
    this.addEventListener("contextmenu", this.handleContextMenu);

    // Listen for long-press on touch devices
    this.addEventListener("touchstart", this.handleTouchStart, { passive: true });
    this.addEventListener("touchend", this.handleTouchEnd, { passive: true });
    this.addEventListener("touchmove", this.handleTouchMove, { passive: true });

    // Listen for item selection
    this.addEventListener("ds:select", this.handleItemSelect);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("contextmenu", this.handleContextMenu);
    this.removeEventListener("touchstart", this.handleTouchStart);
    this.removeEventListener("touchend", this.handleTouchEnd);
    this.removeEventListener("touchmove", this.handleTouchMove);
    this.removeEventListener("ds:select", this.handleItemSelect);
    this.cleanup();
  }

  /**
   * Opens the menu at the specified position.
   */
  public show(x: number, y: number): void {
    if (this.open) {
      this.close();
    }

    this.pointerX = x;
    this.pointerY = y;
    this.open = true;
    emitEvent(this, StandardEvents.OPEN);
  }

  /**
   * Closes the menu.
   */
  public close(): void {
    if (!this.open) return;

    const content = this.querySelector("ds-context-menu-content") as DsContextMenuContent | null;

    if (this.animated && content && !prefersReducedMotion()) {
      this.dismissLayer?.deactivate();
      this.dismissLayer = null;

      this.presence = createPresence({
        onExitComplete: () => {
          this.completeClose();
        },
      });
      this.presence.hide(content);
    } else {
      this.cleanup();
      this.open = false;
      emitEvent(this, StandardEvents.CLOSE);
    }
  }

  private completeClose(): void {
    this.cleanup();
    this.open = false;
    emitEvent(this, StandardEvents.CLOSE);
  }

  private handleContextMenu = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    const trigger = target.closest('[slot="trigger"]');

    if (trigger && this.contains(trigger)) {
      event.preventDefault();
      this.show(event.clientX, event.clientY);
    }
  };

  private handleTouchStart = (event: TouchEvent): void => {
    const target = event.target as HTMLElement;
    const trigger = target.closest('[slot="trigger"]');

    if (trigger && this.contains(trigger)) {
      const touch = event.touches[0];
      if (touch) {
        // Start long-press timer (500ms)
        this.longPressTimer = setTimeout(() => {
          this.show(touch.clientX, touch.clientY);
        }, 500);
      }
    }
  };

  private handleTouchEnd = (): void => {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  };

  private handleTouchMove = (): void => {
    // Cancel long-press if finger moves
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  };

  private handleItemSelect = (): void => {
    this.close();
  };

  private handleDismiss = (): void => {
    this.close();
  };

  private positionContent(): void {
    const content = this.querySelector("ds-context-menu-content") as HTMLElement | null;
    if (!content) return;

    // Position at pointer with viewport boundary checking
    let x = this.pointerX;
    let y = this.pointerY;

    const rect = content.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust if would overflow right
    if (x + rect.width > viewportWidth) {
      x = viewportWidth - rect.width - 8;
    }

    // Adjust if would overflow bottom
    if (y + rect.height > viewportHeight) {
      y = viewportHeight - rect.height - 8;
    }

    // Ensure not negative
    x = Math.max(8, x);
    y = Math.max(8, y);

    content.style.left = `${x}px`;
    content.style.top = `${y}px`;
  }

  private setupDismissLayer(): void {
    const content = this.querySelector("ds-context-menu-content") as HTMLElement | null;
    const trigger = this.querySelector('[slot="trigger"]') as HTMLElement | null;

    if (!content) return;

    this.dismissLayer = createDismissableLayer({
      container: content,
      excludeElements: trigger ? [trigger] : [],
      onDismiss: this.handleDismiss,
      closeOnEscape: true,
      closeOnOutsideClick: true,
    });
    this.dismissLayer.activate();
  }

  private setupRovingFocus(): void {
    const content = this.querySelector("ds-context-menu-content") as HTMLElement | null;

    if (!content) return;

    this.rovingFocus = createRovingFocus({
      container: content,
      selector: "ds-context-menu-item:not([disabled])",
      direction: "vertical",
      loop: true,
      skipDisabled: true,
    });
  }

  private setupTypeAhead(): void {
    const content = this.querySelector("ds-context-menu-content") as HTMLElement | null;

    if (!content) return;

    this.typeAhead = createTypeAhead({
      items: () =>
        Array.from(content.querySelectorAll<HTMLElement>("ds-context-menu-item:not([disabled])")),
      getText: (item) => item.textContent?.trim() || "",
      onMatch: (_item, index) => {
        this.rovingFocus?.setFocusedIndex(index);
      },
    });

    content.addEventListener("keydown", this.handleTypeAheadKeyDown);
  }

  private handleTypeAheadKeyDown = (event: KeyboardEvent): void => {
    this.typeAhead?.handleKeyDown(event);
  };

  private focusFirstItem(): void {
    const content = this.querySelector("ds-context-menu-content");
    if (!content) return;

    const items = content.querySelectorAll<HTMLElement>("ds-context-menu-item:not([disabled])");
    if (items.length === 0) return;

    this.rovingFocus?.setFocusedIndex(0);
  }

  private cleanup(): void {
    const content = this.querySelector("ds-context-menu-content") as HTMLElement | null;

    if (content) {
      content.removeEventListener("keydown", this.handleTypeAheadKeyDown);
    }

    this.dismissLayer?.deactivate();
    this.dismissLayer = null;
    this.presence?.destroy();
    this.presence = null;
    this.rovingFocus?.destroy();
    this.rovingFocus = null;
    this.typeAhead?.reset();
    this.typeAhead = null;

    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  override async updated(changedProperties: Map<string, unknown>): Promise<void> {
    super.updated(changedProperties);

    if (changedProperties.has("open")) {
      const content = this.querySelector("ds-context-menu-content") as DsContextMenuContent | null;

      if (this.open) {
        content?.removeAttribute("hidden");

        if (content) {
          content.dataState = "open";
        }

        await this.updateComplete;

        this.positionContent();
        this.setupDismissLayer();
        this.setupRovingFocus();
        this.setupTypeAhead();
        this.focusFirstItem();
      } else {
        content?.setAttribute("hidden", "");
      }
    }
  }

  override render() {
    return html`
      <slot name="trigger"></slot>
      <slot></slot>
    `;
  }
}

define("ds-context-menu", DsContextMenu);

declare global {
  interface HTMLElementTagNameMap {
    "ds-context-menu": DsContextMenu;
  }
}
