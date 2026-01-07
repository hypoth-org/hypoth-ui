/**
 * Behavior Primitives Contracts
 *
 * These interfaces define the API for behavior primitives in @ds/primitives-dom.
 * Both React and Web Component implementations consume these primitives.
 */

// =============================================================================
// Common Types
// =============================================================================

export type Placement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

export type IdGenerator = () => string;

// =============================================================================
// Button Behavior
// =============================================================================

export interface ButtonBehaviorOptions {
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether button is in loading state */
  loading?: boolean;
  /** Button type */
  type?: "button" | "submit" | "reset";
}

export interface ButtonBehaviorState {
  disabled: boolean;
  loading: boolean;
  type: "button" | "submit" | "reset";
}

export interface ButtonAriaProps {
  "aria-disabled": boolean;
  "aria-busy": boolean;
  type: "button" | "submit" | "reset";
}

export interface ButtonBehavior {
  /** Current state */
  readonly state: ButtonBehaviorState;
  /** Update state */
  setState(partial: Partial<ButtonBehaviorState>): void;
  /** Get ARIA props for button element */
  getButtonProps(): ButtonAriaProps;
  /** Handle keyboard events */
  handleKeyDown(event: KeyboardEvent): void;
}

export type CreateButtonBehavior = (options?: ButtonBehaviorOptions) => ButtonBehavior;

// =============================================================================
// Dialog Behavior
// =============================================================================

export type DialogRole = "dialog" | "alertdialog";

export interface DialogBehaviorOptions {
  /** Initial open state */
  defaultOpen?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Dialog role */
  role?: DialogRole;
  /** Whether Escape closes dialog */
  closeOnEscape?: boolean;
  /** Whether clicking outside closes dialog */
  closeOnOutsideClick?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Callback before close (can prevent) */
  onBeforeClose?: () => boolean;
  /** Custom ID generator */
  generateId?: IdGenerator;
}

export interface DialogBehaviorState {
  open: boolean;
  role: DialogRole;
}

export interface DialogBehaviorContext {
  triggerId: string;
  contentId: string;
  titleId: string;
  descriptionId: string | null;
  triggerElement: HTMLElement | null;
}

export type DialogEvent =
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "DISMISS"; reason: "escape" | "outside-click" };

export interface DialogTriggerProps {
  id: string;
  "aria-haspopup": "dialog";
  "aria-expanded": boolean;
  "aria-controls": string;
  onClick: () => void;
}

export interface DialogContentProps {
  id: string;
  role: DialogRole;
  "aria-modal": "true";
  "aria-labelledby": string;
  "aria-describedby"?: string;
  tabIndex: -1;
}

export interface DialogTitleProps {
  id: string;
}

export interface DialogDescriptionProps {
  id: string;
}

export interface DialogBehavior {
  /** Current state */
  readonly state: DialogBehaviorState;
  /** Internal context (IDs, refs) */
  readonly context: DialogBehaviorContext;
  /** Send event to state machine */
  send(event: DialogEvent): void;
  /** Open dialog */
  open(): void;
  /** Close dialog */
  close(): void;
  /** Get props for trigger element */
  getTriggerProps(): DialogTriggerProps;
  /** Get props for content element */
  getContentProps(): DialogContentProps;
  /** Get props for title element */
  getTitleProps(): DialogTitleProps;
  /** Get props for description element */
  getDescriptionProps(): DialogDescriptionProps;
  /** Set trigger element reference */
  setTriggerElement(element: HTMLElement | null): void;
  /** Set description ID (when description is present) */
  setDescriptionId(id: string | null): void;
  /** Cleanup resources */
  destroy(): void;
}

export type CreateDialogBehavior = (options?: DialogBehaviorOptions) => DialogBehavior;

// =============================================================================
// Menu Behavior
// =============================================================================

export interface MenuBehaviorOptions {
  /** Initial open state */
  defaultOpen?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Placement relative to trigger */
  placement?: Placement;
  /** Offset from trigger */
  offset?: number;
  /** Flip placement on viewport edge */
  flip?: boolean;
  /** Loop navigation at ends */
  loop?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Callback when item is selected */
  onSelect?: (value: string) => void;
  /** Custom ID generator */
  generateId?: IdGenerator;
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
  | { type: "DISMISS" }
  | { type: "FOCUS_ITEM"; index: number };

export interface MenuTriggerProps {
  id: string;
  "aria-haspopup": "menu";
  "aria-expanded": boolean;
  "aria-controls": string;
  onClick: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
}

export interface MenuContentProps {
  id: string;
  role: "menu";
  "aria-labelledby": string;
  "aria-orientation": "vertical";
  tabIndex: -1;
  onKeyDown: (event: KeyboardEvent) => void;
}

export interface MenuItemProps {
  role: "menuitem";
  tabIndex: number;
  "aria-disabled"?: "true";
  onClick: () => void;
  onKeyDown: (event: KeyboardEvent) => void;
  onPointerEnter: () => void;
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
  getItemProps(index: number, options?: { value?: string; disabled?: boolean }): MenuItemProps;
  /** Set trigger element reference */
  setTriggerElement(element: HTMLElement | null): void;
  /** Register menu item */
  registerItem(element: HTMLElement): void;
  /** Unregister menu item */
  unregisterItem(element: HTMLElement): void;
  /** Focus specific item by index */
  focusItem(index: number): void;
  /** Cleanup resources */
  destroy(): void;
}

export type CreateMenuBehavior = (options?: MenuBehaviorOptions) => MenuBehavior;

// =============================================================================
// Export Map
// =============================================================================

/**
 * Expected exports from @ds/primitives-dom after implementation:
 *
 * // Existing exports
 * export { createFocusTrap, type FocusTrap, type FocusTrapOptions } from './focus/focus-trap';
 * export { createDismissableLayer, type DismissableLayer } from './layer/dismissable-layer';
 * export { createRovingFocus, type RovingFocus } from './keyboard/roving-focus';
 * export { createTypeAhead, type TypeAhead } from './keyboard/type-ahead';
 *
 * // New behavior exports
 * export { createButtonBehavior, type ButtonBehavior } from './behavior/button';
 * export { createDialogBehavior, type DialogBehavior } from './behavior/dialog';
 * export { createMenuBehavior, type MenuBehavior } from './behavior/menu';
 */
