/**
 * Menu behavior primitive.
 * Provides state management, ARIA computation, roving focus, type-ahead, and keyboard handling for menus.
 */

import { createDismissableLayer, type DismissableLayer, type DismissReason } from "../layer/dismissable-layer.js";
import { createRovingFocus, type RovingFocus } from "../keyboard/roving-focus.js";
import { createTypeAhead, type TypeAhead } from "../keyboard/type-ahead.js";
import { createAnchorPosition, type AnchorPosition, type Placement } from "../positioning/anchor-position.js";

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

  // Internal state
  let state: MenuBehaviorState = {
    open: defaultOpen,
    activeIndex: -1,
  };

  let context: MenuBehaviorContext = {
    triggerId,
    contentId,
    triggerElement: null,
    items: [],
  };

  // Utilities
  let dismissLayer: DismissableLayer | null = null;
  let rovingFocus: RovingFocus | null = null;
  let typeAhead: TypeAhead | null = null;
  let anchorPosition: AnchorPosition | null = null;

  function setOpen(open: boolean, _focusFirst?: "first" | "last"): void {
    if (state.open === open) return;

    state = { ...state, open, activeIndex: open ? 0 : -1 };
    onOpenChange?.(open);

    if (!open) {
      // Cleanup utilities
      dismissLayer?.deactivate();
      rovingFocus?.destroy();
      typeAhead?.reset();
      anchorPosition?.destroy();
      dismissLayer = null;
      rovingFocus = null;
      typeAhead = null;
      anchorPosition = null;
    }
  }

  function send(event: MenuEvent): void {
    switch (event.type) {
      case "OPEN":
        setOpen(true, event.focusFirst);
        break;
      case "CLOSE":
        setOpen(false);
        break;
      case "SELECT":
        onSelect?.(event.value);
        setOpen(false);
        break;
      case "DISMISS":
        setOpen(false);
        break;
      case "FOCUS_ITEM":
        state = { ...state, activeIndex: event.index };
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
    if (state.open) {
      close();
    } else {
      open();
    }
  }

  function getTriggerProps(): MenuTriggerProps {
    return {
      id: triggerId,
      "aria-haspopup": "menu",
      "aria-expanded": state.open ? "true" : "false",
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
    const isHighlighted = state.activeIndex === index;

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
        // Return focus to trigger
        context.triggerElement?.focus();
        break;
      case "Tab":
        // Close menu on Tab
        event.preventDefault();
        close();
        context.triggerElement?.focus();
        break;
      case "Enter":
      case " ": {
        event.preventDefault();
        const activeItem = context.items[state.activeIndex];
        if (activeItem && !activeItem.getAttribute("aria-disabled")) {
          const value = activeItem.getAttribute("data-value") ?? "";
          send({ type: "SELECT", value });
          context.triggerElement?.focus();
        }
        break;
      }
      default:
        // Let roving focus and type-ahead handle arrow keys and character input
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
  }

  function setContentElement(element: HTMLElement | null): void {
    // Cleanup existing utilities
    dismissLayer?.deactivate();
    rovingFocus?.destroy();
    typeAhead?.reset();
    anchorPosition?.destroy();
    dismissLayer = null;
    rovingFocus = null;
    typeAhead = null;
    anchorPosition = null;

    if (element && state.open) {
      // Create and activate dismissable layer
      dismissLayer = createDismissableLayer({
        container: element,
        excludeElements: context.triggerElement ? [context.triggerElement] : [],
        closeOnEscape: true,
        closeOnOutsideClick: true,
        onDismiss: (reason) => {
          send({ type: "DISMISS", reason });
          context.triggerElement?.focus();
        },
      });
      dismissLayer.activate();

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
          state = { ...state, activeIndex: index };
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
    dismissLayer?.deactivate();
    rovingFocus?.destroy();
    typeAhead?.reset();
    anchorPosition?.destroy();
    dismissLayer = null;
    rovingFocus = null;
    typeAhead = null;
    anchorPosition = null;
  }

  return {
    get state() {
      return state;
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
