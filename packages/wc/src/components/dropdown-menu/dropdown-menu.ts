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
  type MenuBehavior,
  type Placement,
  type Presence,
  createMenuBehavior,
  createPresence,
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

  private menuBehavior: MenuBehavior | null = null;
  private presence: Presence | null = null;
  private focusFirstOnOpen: "first" | "last" | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    // Listen for trigger interactions
    this.addEventListener("click", this.handleTriggerClick);
    this.addEventListener("keydown", this.handleTriggerKeyDown);

    // Listen for item selection
    this.addEventListener("ds:select", this.handleItemSelect);

    // Initialize menu behavior
    this.initMenuBehavior();

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
   * Initializes the menu behavior primitive.
   */
  private initMenuBehavior(): void {
    this.menuBehavior = createMenuBehavior({
      defaultOpen: this.open,
      placement: this.placement,
      offset: this.offset,
      flip: this.flip,
      loop: true,
      onOpenChange: (open) => {
        // Sync state when behavior changes (e.g., from escape or outside click)
        if (!open && this.open) {
          this.handleBehaviorClose();
        }
      },
      onSelect: (value) => {
        emitEvent(this, StandardEvents.SELECT, { detail: { value } });
      },
    });

    // Set trigger element if one exists
    const trigger = this.querySelector('[slot="trigger"]') as HTMLElement | null;
    if (trigger) {
      this.menuBehavior.setTriggerElement(trigger);
    }
  }

  /**
   * Handles close triggered by the behavior (escape/outside click).
   */
  private handleBehaviorClose(): void {
    const content = this.querySelector("ds-dropdown-menu-content") as DsDropdownMenuContent | null;

    if (this.animated && content && !prefersReducedMotion()) {
      this.presence = createPresence({
        onExitComplete: () => {
          this.completeClose();
        },
      });
      this.presence.hide(content);
    } else {
      this.open = false;
      emitEvent(this, StandardEvents.CLOSE);
    }
  }

  /**
   * Opens the menu.
   */
  public show(): void {
    if (this.open) return;

    this.open = true;
    this.menuBehavior?.open(this.focusFirstOnOpen ?? "first");
    emitEvent(this, StandardEvents.OPEN);
  }

  /**
   * Closes the menu.
   */
  public close(): void {
    if (!this.open) return;

    const content = this.querySelector("ds-dropdown-menu-content") as DsDropdownMenuContent | null;

    // Close the behavior
    this.menuBehavior?.close();

    if (this.animated && content && !prefersReducedMotion()) {
      this.presence = createPresence({
        onExitComplete: () => {
          this.completeClose();
        },
      });
      this.presence.hide(content);
    } else {
      this.open = false;
      emitEvent(this, StandardEvents.CLOSE);
    }
  }

  private completeClose(): void {
    this.presence?.destroy();
    this.presence = null;
    this.open = false;
    emitEvent(this, StandardEvents.CLOSE);
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
      this.menuBehavior?.setTriggerElement(trigger as HTMLElement);
      this.focusFirstOnOpen = "first";
      this.toggle();
    }
  };

  private handleTriggerKeyDown = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement;
    const trigger = target.closest('[slot="trigger"]');

    if (!trigger || !this.contains(trigger)) return;

    this.menuBehavior?.setTriggerElement(trigger as HTMLElement);

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

  private setupTriggerAccessibility(): void {
    const trigger = this.querySelector('[slot="trigger"]');
    const content = this.querySelector("ds-dropdown-menu-content");

    if (trigger && content && this.menuBehavior) {
      this.menuBehavior.setTriggerElement(trigger as HTMLElement);

      // Apply trigger props from behavior
      const triggerProps = this.menuBehavior.getTriggerProps();
      trigger.setAttribute("aria-haspopup", triggerProps["aria-haspopup"]);
      trigger.setAttribute("aria-expanded", triggerProps["aria-expanded"]);
      trigger.setAttribute("aria-controls", triggerProps["aria-controls"]);
    }
  }

  private updateTriggerAria(): void {
    const trigger = this.querySelector('[slot="trigger"]');
    if (trigger && this.menuBehavior) {
      const triggerProps = this.menuBehavior.getTriggerProps();
      trigger.setAttribute("aria-expanded", triggerProps["aria-expanded"]);
    }
  }

  private registerMenuItems(): void {
    const content = this.querySelector("ds-dropdown-menu-content");
    if (!content || !this.menuBehavior) return;

    const items = content.querySelectorAll<HTMLElement>(
      "ds-dropdown-menu-item:not([disabled]), ds-dropdown-menu-checkbox-item:not([disabled]), ds-dropdown-menu-radio-item:not([disabled])"
    );

    items.forEach((item) => {
      this.menuBehavior?.registerItem(item);
    });
  }

  private cleanup(): void {
    this.menuBehavior?.destroy();
    this.menuBehavior = null;
    this.presence?.destroy();
    this.presence = null;
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

        // Register menu items with behavior
        this.registerMenuItems();

        // Set content element (activates positioning, dismiss layer, roving focus, type-ahead)
        this.menuBehavior?.setContentElement(content);
      } else {
        content?.setAttribute("hidden", "");

        // Clear content element
        this.menuBehavior?.setContentElement(null);
      }
    }

    // Re-create behavior if placement/offset/flip change
    if (
      changedProperties.has("placement") ||
      changedProperties.has("offset") ||
      changedProperties.has("flip")
    ) {
      const wasOpen = this.menuBehavior?.state.open;
      this.menuBehavior?.destroy();
      this.initMenuBehavior();
      if (wasOpen) {
        this.menuBehavior?.open();
        const content = this.querySelector("ds-dropdown-menu-content") as HTMLElement | null;
        this.registerMenuItems();
        this.menuBehavior?.setContentElement(content);
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
