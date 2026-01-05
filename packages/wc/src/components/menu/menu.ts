import {
  type AnchorPosition,
  type DismissableLayer,
  type Placement,
  type RovingFocus,
  type TypeAhead,
  createAnchorPosition,
  createDismissableLayer,
  createRovingFocus,
  createTypeAhead,
} from "@ds/primitives-dom";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

// Import child components to ensure they're registered
import "./menu-content.js";
import "./menu-item.js";

/**
 * Menu component with roving focus and type-ahead.
 *
 * Implements WAI-ARIA Menu Button pattern with:
 * - Arrow key navigation between items
 * - Type-ahead search to jump to items
 * - Enter/Space/Click to select items
 * - Escape to close
 *
 * @element ds-menu
 *
 * @slot trigger - Button that opens the menu
 * @slot - Menu content (ds-menu-content with ds-menu-item children)
 *
 * @fires ds:open - Fired when menu opens
 * @fires ds:close - Fired when menu closes
 * @fires ds:select - Fired when a menu item is selected (bubbles from ds-menu-item)
 *
 * @example
 * ```html
 * <ds-menu>
 *   <button slot="trigger">Actions</button>
 *   <ds-menu-content>
 *     <ds-menu-item value="edit">Edit</ds-menu-item>
 *     <ds-menu-item value="delete">Delete</ds-menu-item>
 *   </ds-menu-content>
 * </ds-menu>
 * ```
 */
export class DsMenu extends DSElement {
  /** Whether the menu is open */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** Placement relative to trigger */
  @property({ type: String, reflect: true })
  placement: Placement = "bottom-start";

  /** Offset distance from trigger in pixels */
  @property({ type: Number })
  offset = 8;

  /** Whether to flip placement when near viewport edge */
  @property({ type: Boolean })
  flip = true;

  private anchorPosition: AnchorPosition | null = null;
  private dismissLayer: DismissableLayer | null = null;
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

    // Listen for item selection (bubbled from ds-menu-item)
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

    this.cleanup();
    this.open = false;
    emitEvent(this, StandardEvents.CLOSE);

    // Return focus to trigger
    this.triggerElement?.focus();
  }

  /**
   * Toggles the menu open/closed state.
   */
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

  private handleItemSelect = (_event: Event): void => {
    // Item was selected, close the menu
    // Don't stop propagation - let the event bubble to consumers
    this.close();
  };

  private handleDismiss = (): void => {
    this.close();
  };

  private setupTriggerAccessibility(): void {
    const trigger = this.querySelector('[slot="trigger"]');
    const content = this.querySelector("ds-menu-content");

    if (trigger && content) {
      // Store reference
      this.triggerElement = trigger as HTMLElement;

      // Set ARIA attributes on trigger
      trigger.setAttribute("aria-haspopup", "menu");
      trigger.setAttribute("aria-expanded", String(this.open));
      trigger.setAttribute("aria-controls", content.id);
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
    const content = this.querySelector("ds-menu-content") as HTMLElement | null;

    if (!trigger || !content) return;

    // Setup anchor positioning
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

    // Setup resize observer for repositioning
    this.resizeObserver = new ResizeObserver(() => {
      this.anchorPosition?.update();
    });
    this.resizeObserver.observe(trigger);
    this.resizeObserver.observe(content);

    // Setup scroll handler for repositioning
    this.scrollHandler = () => {
      this.anchorPosition?.update();
    };
    window.addEventListener("scroll", this.scrollHandler, { passive: true });
    window.addEventListener("resize", this.scrollHandler, { passive: true });
  }

  private setupDismissLayer(): void {
    const content = this.querySelector("ds-menu-content") as HTMLElement | null;
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
    const content = this.querySelector("ds-menu-content") as HTMLElement | null;

    if (!content) return;

    this.rovingFocus = createRovingFocus({
      container: content,
      selector: "ds-menu-item:not([disabled])",
      direction: "vertical",
      loop: true,
      skipDisabled: true,
    });
  }

  private setupTypeAhead(): void {
    const content = this.querySelector("ds-menu-content") as HTMLElement | null;

    if (!content) return;

    this.typeAhead = createTypeAhead({
      items: () =>
        Array.from(content.querySelectorAll<HTMLElement>("ds-menu-item:not([disabled])")),
      getText: (item) => item.textContent?.trim() || "",
      onMatch: (_item, index) => {
        this.rovingFocus?.setFocusedIndex(index);
      },
    });

    // Wire type-ahead to keydown events
    content.addEventListener("keydown", this.handleTypeAheadKeyDown);
  }

  private handleTypeAheadKeyDown = (event: KeyboardEvent): void => {
    this.typeAhead?.handleKeyDown(event);
  };

  private focusInitialItem(): void {
    const content = this.querySelector("ds-menu-content");
    if (!content) return;

    const items = content.querySelectorAll<HTMLElement>("ds-menu-item:not([disabled])");
    if (items.length === 0) return;

    if (this.focusFirstOnOpen === "last") {
      // Focus last item (ArrowUp on trigger)
      const lastIndex = items.length - 1;
      this.rovingFocus?.setFocusedIndex(lastIndex);
    } else {
      // Focus first item (default)
      this.rovingFocus?.setFocusedIndex(0);
    }

    this.focusFirstOnOpen = null;
  }

  private cleanup(): void {
    const content = this.querySelector("ds-menu-content") as HTMLElement | null;

    // Cleanup type-ahead listener
    if (content) {
      content.removeEventListener("keydown", this.handleTypeAheadKeyDown);
    }

    // Cleanup anchor positioning
    this.anchorPosition?.destroy();
    this.anchorPosition = null;

    // Cleanup dismiss layer
    this.dismissLayer?.deactivate();
    this.dismissLayer = null;

    // Cleanup roving focus
    this.rovingFocus?.destroy();
    this.rovingFocus = null;

    // Cleanup type-ahead
    this.typeAhead?.reset();
    this.typeAhead = null;

    // Cleanup resize observer
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    // Cleanup scroll handler
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

      const content = this.querySelector("ds-menu-content");

      if (this.open) {
        // Show content
        content?.removeAttribute("hidden");

        // Wait for DOM update
        await this.updateComplete;

        // Setup all behaviors
        this.setupPositioning();
        this.setupDismissLayer();
        this.setupRovingFocus();
        this.setupTypeAhead();

        // Focus initial item
        this.focusInitialItem();
      } else {
        // Hide content
        content?.setAttribute("hidden", "");
      }
    }

    // Update positioning if placement or offset changes while open
    if (this.open && (changedProperties.has("placement") || changedProperties.has("offset"))) {
      this.cleanup();
      this.setupPositioning();
      this.setupDismissLayer();
      this.setupRovingFocus();
      this.setupTypeAhead();
    }
  }

  override render() {
    return html`
      <slot name="trigger"></slot>
      <slot></slot>
    `;
  }
}

define("ds-menu", DsMenu);

declare global {
  interface HTMLElementTagNameMap {
    "ds-menu": DsMenu;
  }
}
