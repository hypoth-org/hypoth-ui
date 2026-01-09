/**
 * Menu behavior primitive.
 * Provides state management, ARIA computation, roving focus, type-ahead, and keyboard handling for menus.
 *
 * Uses createOverlayBehavior internally for open/close state and dismissal handling.
 */

import { type RovingFocus, createRovingFocus } from "../keyboard/roving-focus.js";
import { type TypeAhead, createTypeAhead } from "../keyboard/type-ahead.js";
import type { DismissReason } from "../layer/dismissable-layer.js";
import {
  type OverlayBehavior,
  createOverlayBehavior,
} from "../overlay/create-overlay-behavior.js";
import {
  type AnchorPosition,
  type Placement,
  createAnchorPosition,
} from "../positioning/anchor-position.js";

// =============================================================================
// Types
// =============================================================================

export interface MenuBehaviorOptions {
  /** Initial open state */
  defaultOpen?: boolean;
  /** Placement relative to trigger */
  placement?: Placement;
  /** Offset from trigger in pixels */
  offset?: number;
  /** Whether to flip placement on viewport edge */
  flip?: boolean;
  /** Whether to loop navigation at ends */
  loop?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Callback when item is selected */
  onSelect?: (value: string) => void;
  /** Custom ID generator */
  generateId?: () => string;
}

export interface MenuBehaviorState {
  open: boolean;
  activeIndex: number;
}

export interface MenuBehaviorContext {
  triggerId: string;
  contentId: string;
  triggerElement: HTMLElement | null;
  items: HTMLElement[];
}

export type MenuEvent =
  | { type: "OPEN"; focusFirst?: "first" | "last" }
  | { type: "CLOSE" }
  | { type: "SELECT"; value: string }
  | { type: "DISMISS"; reason: DismissReason }
  | { type: "FOCUS_ITEM"; index: number };

export interface MenuTriggerProps {
  id: string;
  "aria-haspopup": "menu";
  "aria-expanded": "true" | "false";
  "aria-controls": string;
}

export interface MenuContentProps {
  id: string;
  role: "menu";
  "aria-labelledby": string;
  "aria-orientation": "vertical";
  tabIndex: -1;
}

export interface MenuItemProps {
  role: "menuitem";
  tabIndex: number;
  "aria-disabled": "true" | undefined;
  "data-highlighted": "" | undefined;
}

export interface MenuBehavior {
  /** Current state */
  readonly state: MenuBehaviorState;
  /** Internal context */
  readonly context: MenuBehaviorContext;
  /** Send event to state machine */
  send(event: MenuEvent): void;
  /** Open menu */
  open(focusFirst?: "first" | "last"): void;
  /** Close menu */
  close(): void;
  /** Toggle menu */
  toggle(): void;
  /** Get props for trigger element */
  getTriggerProps(): MenuTriggerProps;
  /** Get props for content element */
  getContentProps(): MenuContentProps;
  /** Get props for item element */
  getItemProps(index: number, options?: { disabled?: boolean }): MenuItemProps;
  /** Handle trigger keyboard events */
  handleTriggerKeyDown(event: KeyboardEvent): void;
  /** Handle content keyboard events */
  handleContentKeyDown(event: KeyboardEvent): void;
  /** Handle item click */
  handleItemClick(index: number, value: string): void;
  /** Handle item pointer enter (hover) */
  handleItemPointerEnter(index: number): void;
  /** Set trigger element reference */
  setTriggerElement(element: HTMLElement | null): void;
  /** Set content element and activate positioning/focus */
  setContentElement(element: HTMLElement | null): void;
  /** Register menu item */
  registerItem(element: HTMLElement): void;
  /** Unregister menu item */
  unregisterItem(element: HTMLElement): void;
  /** Focus specific item by index */
  focusItem(index: number): void;
  /** Cleanup resources */
  destroy(): void;
}

// =============================================================================
// Implementation
// =============================================================================

let idCounter = 0;

function defaultGenerateId(): string {
  return `menu-${++idCounter}`;
}

/**
 * Creates a menu behavior primitive.
 *
 * @example
 * ```ts
 * const menu = createMenuBehavior({
 *   onOpenChange: (open) => console.log("open:", open),
 *   onSelect: (value) => console.log("selected:", value),
 * });
 *
 * // Set trigger element
 * menu.setTriggerElement(triggerButton);
 *
 * // Handle trigger events
 * triggerButton.addEventListener("click", () => menu.toggle());
 * triggerButton.addEventListener("keydown", menu.handleTriggerKeyDown);
 *
 * // When open, set content element
 * menu.setContentElement(menuContent);
 *
 * // Register items
 * menuItems.forEach((item) => menu.registerItem(item));
 * ```
 */
export function createMenuBehavior(options: MenuBehaviorOptions = {}): MenuBehavior {
  const {
    defaultOpen = false,
    placement = "bottom-start",
    offset = 4,
    flip = true,
    loop = true,
    onOpenChange,
    onSelect,
    generateId = defaultGenerateId,
  } = options;

  // Generate stable IDs
  const baseId = generateId();
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;

  // Create overlay behavior for open/close state and dismissal
  const overlay: OverlayBehavior = createOverlayBehavior({
    defaultOpen,
    modal: false, // Menus are not modal
    closeOnEscape: true,
    closeOnOutsideClick: true,
    returnFocusOnClose: true,
    onOpenChange: (open) => {
      // Sync active index
      activeIndex = open ? 0 : -1;
      onOpenChange?.(open);

      if (!open) {
        // Cleanup menu-specific utilities
        cleanupMenuUtilities();
      }
    },
    generateId: () => baseId,
  });

  // Menu-specific state
  let activeIndex = -1;

  let context: MenuBehaviorContext = {
    triggerId,
    contentId,
    triggerElement: null,
    items: [],
  };

  // Menu-specific utilities (not handled by overlay)
  let rovingFocus: RovingFocus | null = null;
  let typeAhead: TypeAhead | null = null;
  let anchorPosition: AnchorPosition | null = null;

  function cleanupMenuUtilities(): void {
    rovingFocus?.destroy();
    typeAhead?.reset();
    anchorPosition?.destroy();
    rovingFocus = null;
    typeAhead = null;
    anchorPosition = null;
  }

  function send(event: MenuEvent): void {
    switch (event.type) {
      case "OPEN":
        overlay.open();
        break;
      case "CLOSE":
        overlay.close();
        break;
      case "SELECT":
        onSelect?.(event.value);
        overlay.close();
        break;
      case "DISMISS":
        overlay.close();
        break;
      case "FOCUS_ITEM":
        activeIndex = event.index;
        break;
    }
  }

  function open(focusFirst: "first" | "last" = "first"): void {
    send({ type: "OPEN", focusFirst });
  }

  function close(): void {
    send({ type: "CLOSE" });
  }

  function toggle(): void {
    overlay.toggle();
  }

  function getTriggerProps(): MenuTriggerProps {
    return {
      id: triggerId,
      "aria-haspopup": "menu",
      "aria-expanded": overlay.isOpen() ? "true" : "false",
      "aria-controls": contentId,
    };
  }

  function getContentProps(): MenuContentProps {
    return {
      id: contentId,
      role: "menu",
      "aria-labelledby": triggerId,
      "aria-orientation": "vertical",
      tabIndex: -1,
    };
  }

  function getItemProps(index: number, opts: { disabled?: boolean } = {}): MenuItemProps {
    const { disabled = false } = opts;
    const isHighlighted = activeIndex === index;

    return {
      role: "menuitem",
      tabIndex: isHighlighted ? 0 : -1,
      "aria-disabled": disabled ? "true" : undefined,
      "data-highlighted": isHighlighted ? "" : undefined,
    };
  }

  function handleTriggerKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case "Enter":
      case " ":
      case "ArrowDown":
        event.preventDefault();
        open("first");
        break;
      case "ArrowUp":
        event.preventDefault();
        open("last");
        break;
    }
  }

  function handleContentKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        close();
        context.triggerElement?.focus();
        break;
      case "Tab":
        event.preventDefault();
        close();
        context.triggerElement?.focus();
        break;
      case "Enter":
      case " ": {
        event.preventDefault();
        const activeItem = context.items[activeIndex];
        if (activeItem && !activeItem.getAttribute("aria-disabled")) {
          const value = activeItem.getAttribute("data-value") ?? "";
          send({ type: "SELECT", value });
          context.triggerElement?.focus();
        }
        break;
      }
      default:
        break;
    }
  }

  function handleItemClick(index: number, value: string): void {
    const item = context.items[index];
    if (item?.getAttribute("aria-disabled") === "true") return;

    send({ type: "SELECT", value });
    context.triggerElement?.focus();
  }

  function handleItemPointerEnter(index: number): void {
    send({ type: "FOCUS_ITEM", index });
    context.items[index]?.focus();
  }

  function setTriggerElement(element: HTMLElement | null): void {
    context = { ...context, triggerElement: element };
    overlay.setTriggerElement(element);
  }

  function setContentElement(element: HTMLElement | null): void {
    // Cleanup existing menu utilities
    cleanupMenuUtilities();

    // Let overlay handle dismiss layer
    overlay.setContentElement(element);

    if (element && overlay.isOpen()) {
      // Create roving focus
      rovingFocus = createRovingFocus({
        container: element,
        selector: '[role="menuitem"]:not([aria-disabled="true"])',
        direction: "vertical",
        loop,
        onFocus: (_element: HTMLElement, index: number) => {
          send({ type: "FOCUS_ITEM", index });
        },
      });

      // Create type-ahead
      typeAhead = createTypeAhead({
        items: () => context.items,
        getText: (item: HTMLElement) => item.textContent ?? "",
        onMatch: (item: HTMLElement, index: number) => {
          send({ type: "FOCUS_ITEM", index });
          item.focus();
        },
      });

      // Create anchor positioning if trigger element exists
      if (context.triggerElement) {
        anchorPosition = createAnchorPosition({
          anchor: context.triggerElement,
          floating: element,
          placement,
          offset,
          flip,
        });
        anchorPosition.update();
      }

      // Focus first item
      const firstFocusable = context.items.find(
        (item) => item.getAttribute("aria-disabled") !== "true"
      );
      if (firstFocusable) {
        firstFocusable.focus();
        const index = context.items.indexOf(firstFocusable);
        if (index !== -1) {
          activeIndex = index;
        }
      }
    }
  }

  function registerItem(element: HTMLElement): void {
    if (!context.items.includes(element)) {
      context = { ...context, items: [...context.items, element] };
    }
  }

  function unregisterItem(element: HTMLElement): void {
    const index = context.items.indexOf(element);
    if (index !== -1) {
      const newItems = [...context.items];
      newItems.splice(index, 1);
      context = { ...context, items: newItems };
    }
  }

  function focusItem(index: number): void {
    const item = context.items[index];
    if (item) {
      send({ type: "FOCUS_ITEM", index });
      item.focus();
    }
  }

  function destroy(): void {
    cleanupMenuUtilities();
    overlay.destroy();
  }

  return {
    get state(): MenuBehaviorState {
      return {
        open: overlay.isOpen(),
        activeIndex,
      };
    },
    get context() {
      return context;
    },
    send,
    open,
    close,
    toggle,
    getTriggerProps,
    getContentProps,
    getItemProps,
    handleTriggerKeyDown,
    handleContentKeyDown,
    handleItemClick,
    handleItemPointerEnter,
    setTriggerElement,
    setContentElement,
    registerItem,
    unregisterItem,
    focusItem,
    destroy,
  };
}
