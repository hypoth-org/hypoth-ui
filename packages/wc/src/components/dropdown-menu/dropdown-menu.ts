/**
 * DropdownMenu component - action menu with items, separators, and submenus.
 *
 * Implements WAI-ARIA Menu Button pattern with full keyboard navigation.
 *
 * @element ds-dropdown-menu
 *
 * @slot trigger - Button that opens the menu
 * @slot - Menu content (ds-dropdown-menu-content)
 *
 * @fires ds:open - Fired when menu opens
 * @fires ds:close - Fired when menu closes
 * @fires ds:select - Fired when an item is selected
 *
 * @example
 * ```html
 * <ds-dropdown-menu>
 *   <button slot="trigger">Actions</button>
 *   <ds-dropdown-menu-content>
 *     <ds-dropdown-menu-label>Actions</ds-dropdown-menu-label>
 *     <ds-dropdown-menu-item value="edit">Edit</ds-dropdown-menu-item>
 *     <ds-dropdown-menu-item value="copy">Copy</ds-dropdown-menu-item>
 *     <ds-dropdown-menu-separator></ds-dropdown-menu-separator>
 *     <ds-dropdown-menu-item value="delete" variant="destructive">Delete</ds-dropdown-menu-item>
 *   </ds-dropdown-menu-content>
 * </ds-dropdown-menu>
 * ```
 */

import {
  type AnchorPosition,
  type DismissableLayer,
  type Placement,
  type Presence,
  type RovingFocus,
  type TypeAhead,
  createAnchorPosition,
  createDismissableLayer,
  createPresence,
  createRovingFocus,
  createTypeAhead,
  prefersReducedMotion,
} from "@ds/primitives-dom";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

// Import child components to ensure they're registered
import type { DsDropdownMenuContent } from "./dropdown-menu-content.js";
import "./dropdown-menu-content.js";
import "./dropdown-menu-item.js";
import "./dropdown-menu-separator.js";
import "./dropdown-menu-label.js";
import "./dropdown-menu-checkbox-item.js";
import "./dropdown-menu-radio-group.js";
import "./dropdown-menu-radio-item.js";

export class DsDropdownMenu extends DSElement {
  /** Whether the menu is open */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** Placement relative to trigger */
  @property({ type: String, reflect: true })
  placement: Placement = "bottom-start";

  /** Offset distance from trigger in pixels */
  @property({ type: Number })
  offset = 4;

  /** Whether to flip placement when near viewport edge */
  @property({ type: Boolean })
  flip = true;

  /** Whether to animate open/close transitions */
  @property({ type: Boolean })
  animated = true;

  /** Modal behavior - blocks interaction outside menu */
  @property({ type: Boolean })
  modal = true;

  private anchorPosition: AnchorPosition | null = null;
  private dismissLayer: DismissableLayer | null = null;
  private presence: Presence | null = null;
  private rovingFocus: RovingFocus | null = null;
  private typeAhead: TypeAhead | null = null;
  private triggerElement: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private scrollHandler: (() => void) | null = null;
  private focusFirstOnOpen: "first" | "last" | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    // Listen for trigger interactions
    this.addEventListener("click", this.handleTriggerClick);
    this.addEventListener("keydown", this.handleTriggerKeyDown);

    // Listen for item selection
    this.addEventListener("ds:select", this.handleItemSelect);

    // Setup after first render
    this.updateComplete.then(() => {
      this.setupTriggerAccessibility();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleTriggerClick);
    this.removeEventListener("keydown", this.handleTriggerKeyDown);
    this.removeEventListener("ds:select", this.handleItemSelect);
    this.cleanup();
  }

  /**
   * Opens the menu.
   */
  public show(): void {
    if (this.open) return;

    this.open = true;
    emitEvent(this, StandardEvents.OPEN);
  }

  /**
   * Closes the menu.
   */
  public close(): void {
    if (!this.open) return;

    const content = this.querySelector("ds-dropdown-menu-content") as DsDropdownMenuContent | null;

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
      this.triggerElement?.focus();
    }
  }

  private completeClose(): void {
    this.cleanup();
    this.open = false;
    emitEvent(this, StandardEvents.CLOSE);
    this.triggerElement?.focus();
  }

  public toggle(): void {
    if (this.open) {
      this.close();
    } else {
      this.show();
    }
  }

  private handleTriggerClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    const trigger = target.closest('[slot="trigger"]');

    if (trigger && this.contains(trigger)) {
      event.preventDefault();
      this.triggerElement = trigger as HTMLElement;
      this.focusFirstOnOpen = "first";
      this.toggle();
    }
  };

  private handleTriggerKeyDown = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement;
    const trigger = target.closest('[slot="trigger"]');

    if (!trigger || !this.contains(trigger)) return;

    this.triggerElement = trigger as HTMLElement;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        this.focusFirstOnOpen = "first";
        this.toggle();
        break;
      case "ArrowDown":
        event.preventDefault();
        this.focusFirstOnOpen = "first";
        if (!this.open) this.show();
        break;
      case "ArrowUp":
        event.preventDefault();
        this.focusFirstOnOpen = "last";
        if (!this.open) this.show();
        break;
    }
  };

  private handleItemSelect = (): void => {
    this.close();
  };

  private handleDismiss = (): void => {
    this.close();
  };

  private setupTriggerAccessibility(): void {
    const trigger = this.querySelector('[slot="trigger"]');
    const content = this.querySelector("ds-dropdown-menu-content");

    if (trigger && content) {
      this.triggerElement = trigger as HTMLElement;
      trigger.setAttribute("aria-haspopup", "menu");
      trigger.setAttribute("aria-expanded", String(this.open));
      if (content.id) {
        trigger.setAttribute("aria-controls", content.id);
      }
    }
  }

  private updateTriggerAria(): void {
    const trigger = this.querySelector('[slot="trigger"]');
    if (trigger) {
      trigger.setAttribute("aria-expanded", String(this.open));
    }
  }

  private setupPositioning(): void {
    const trigger = this.querySelector('[slot="trigger"]') as HTMLElement | null;
    const content = this.querySelector("ds-dropdown-menu-content") as HTMLElement | null;

    if (!trigger || !content) return;

    this.anchorPosition = createAnchorPosition({
      anchor: trigger,
      floating: content,
      placement: this.placement,
      offset: this.offset,
      flip: this.flip,
      onPositionChange: (pos) => {
        content.setAttribute("data-placement", pos.placement);
      },
    });

    this.resizeObserver = new ResizeObserver(() => {
      this.anchorPosition?.update();
    });
    this.resizeObserver.observe(trigger);
    this.resizeObserver.observe(content);

    this.scrollHandler = () => {
      this.anchorPosition?.update();
    };
    window.addEventListener("scroll", this.scrollHandler, { passive: true });
    window.addEventListener("resize", this.scrollHandler, { passive: true });
  }

  private setupDismissLayer(): void {
    const content = this.querySelector("ds-dropdown-menu-content") as HTMLElement | null;
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
    const content = this.querySelector("ds-dropdown-menu-content") as HTMLElement | null;

    if (!content) return;

    this.rovingFocus = createRovingFocus({
      container: content,
      selector:
        "ds-dropdown-menu-item:not([disabled]), ds-dropdown-menu-checkbox-item:not([disabled]), ds-dropdown-menu-radio-item:not([disabled])",
      direction: "vertical",
      loop: true,
      skipDisabled: true,
    });
  }

  private setupTypeAhead(): void {
    const content = this.querySelector("ds-dropdown-menu-content") as HTMLElement | null;

    if (!content) return;

    this.typeAhead = createTypeAhead({
      items: () =>
        Array.from(
          content.querySelectorAll<HTMLElement>(
            "ds-dropdown-menu-item:not([disabled]), ds-dropdown-menu-checkbox-item:not([disabled]), ds-dropdown-menu-radio-item:not([disabled])"
          )
        ),
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

  private focusInitialItem(): void {
    const content = this.querySelector("ds-dropdown-menu-content");
    if (!content) return;

    const items = content.querySelectorAll<HTMLElement>(
      "ds-dropdown-menu-item:not([disabled]), ds-dropdown-menu-checkbox-item:not([disabled]), ds-dropdown-menu-radio-item:not([disabled])"
    );
    if (items.length === 0) return;

    if (this.focusFirstOnOpen === "last") {
      const lastIndex = items.length - 1;
      this.rovingFocus?.setFocusedIndex(lastIndex);
    } else {
      this.rovingFocus?.setFocusedIndex(0);
    }

    this.focusFirstOnOpen = null;
  }

  private cleanup(): void {
    const content = this.querySelector("ds-dropdown-menu-content") as HTMLElement | null;

    if (content) {
      content.removeEventListener("keydown", this.handleTypeAheadKeyDown);
    }

    this.anchorPosition?.destroy();
    this.anchorPosition = null;
    this.dismissLayer?.deactivate();
    this.dismissLayer = null;
    this.presence?.destroy();
    this.presence = null;
    this.rovingFocus?.destroy();
    this.rovingFocus = null;
    this.typeAhead?.reset();
    this.typeAhead = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    if (this.scrollHandler) {
      window.removeEventListener("scroll", this.scrollHandler);
      window.removeEventListener("resize", this.scrollHandler);
      this.scrollHandler = null;
    }
  }

  override async updated(changedProperties: Map<string, unknown>): Promise<void> {
    super.updated(changedProperties);

    if (changedProperties.has("open")) {
      this.updateTriggerAria();

      const content = this.querySelector(
        "ds-dropdown-menu-content"
      ) as DsDropdownMenuContent | null;

      if (this.open) {
        content?.removeAttribute("hidden");

        if (content) {
          content.dataState = "open";
        }

        await this.updateComplete;

        this.setupPositioning();
        this.setupDismissLayer();
        this.setupRovingFocus();
        this.setupTypeAhead();
        this.focusInitialItem();
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

define("ds-dropdown-menu", DsDropdownMenu);

declare global {
  interface HTMLElementTagNameMap {
    "ds-dropdown-menu": DsDropdownMenu;
  }
}
