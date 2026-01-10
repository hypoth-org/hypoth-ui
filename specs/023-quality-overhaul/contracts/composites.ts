/**
 * TypeScript contracts for composite primitives.
 *
 * These interfaces define the API for new composite primitives
 * to be implemented in @ds/primitives-dom/src/composites/
 */

import type { DismissReason } from "../layer/dismissable-layer.js";
import type { Placement } from "../positioning/anchor-position.js";
import type { AnimationState } from "../animation/types.js";

// =============================================================================
// Modal Overlay Composite
// =============================================================================

export interface ModalOverlayOptions {
  /** Initial open state */
  defaultOpen?: boolean;
  /** Whether Escape key closes the modal */
  closeOnEscape?: boolean;
  /** Whether clicking backdrop closes the modal */
  closeOnBackdrop?: boolean;
  /** Whether to return focus to trigger on close */
  returnFocusOnClose?: boolean;
  /** Enable enter/exit animations */
  animated?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Callback when dismissed (escape or backdrop) */
  onDismiss?: (reason: DismissReason) => void;
  /** Callback when exit animation completes (for unmounting) */
  onExitComplete?: () => void;
}

export interface ModalOverlayState {
  /** Whether the modal is open */
  open: boolean;
  /** Current animation state */
  animationState: AnimationState;
}

export interface ModalOverlay {
  /** Current state */
  readonly state: ModalOverlayState;
  /** Open the modal */
  open(): void;
  /** Close the modal (triggers exit animation if animated) */
  close(): void;
  /** Toggle open state */
  toggle(): void;
  /** Check if currently open */
  isOpen(): boolean;
  /** Set the trigger element (for focus return) */
  setTriggerElement(element: HTMLElement | null): void;
  /** Set the content element (activates focus trap) */
  setContentElement(element: HTMLElement | null): void;
  /** Clean up resources */
  destroy(): void;
}

/**
 * Creates a modal overlay composite.
 *
 * Bundles:
 * - Focus trap (always modal)
 * - Dismissable layer (Escape, backdrop click)
 * - Presence animation (enter/exit)
 * - Focus return
 *
 * @example
 * ```ts
 * const modal = createModalOverlay({
 *   onOpenChange: (open) => setOpen(open),
 *   onExitComplete: () => unmountContent()
 * });
 *
 * modal.setTriggerElement(triggerButton);
 * modal.setContentElement(dialogContent);
 * modal.open();
 * ```
 */
export function createModalOverlay(options?: ModalOverlayOptions): ModalOverlay;

// =============================================================================
// Popover Overlay Composite
// =============================================================================

export interface PopoverOverlayOptions {
  /** The anchor/trigger element (required) */
  trigger: HTMLElement;
  /** Initial open state */
  defaultOpen?: boolean;
  /** Preferred placement relative to trigger */
  placement?: Placement;
  /** Offset from trigger in pixels */
  offset?: number;
  /** Whether to flip when near viewport edge */
  flip?: boolean;
  /** Whether Escape key closes the popover */
  closeOnEscape?: boolean;
  /** Whether clicking outside closes the popover */
  closeOnOutsideClick?: boolean;
  /** Enable enter/exit animations */
  animated?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Callback when position changes (after flip) */
  onPositionChange?: (placement: Placement) => void;
  /** Callback when exit animation completes */
  onExitComplete?: () => void;
}

export interface PopoverOverlayState {
  /** Whether the popover is open */
  open: boolean;
  /** Final computed placement after flip logic */
  placement: Placement;
  /** Current animation state */
  animationState: AnimationState;
}

export interface PopoverOverlay {
  /** Current state */
  readonly state: PopoverOverlayState;
  /** Open the popover */
  open(): void;
  /** Close the popover */
  close(): void;
  /** Toggle open state */
  toggle(): void;
  /** Check if currently open */
  isOpen(): boolean;
  /** Set the content element (starts positioning) */
  setContentElement(element: HTMLElement | null): void;
  /** Force position recalculation */
  updatePosition(): void;
  /** Clean up resources */
  destroy(): void;
}

/**
 * Creates a popover overlay composite.
 *
 * Bundles:
 * - Anchor positioning (with auto-flip)
 * - Dismissable layer (Escape, outside click)
 * - Presence animation (enter/exit)
 * - Auto-update on scroll/resize
 *
 * @example
 * ```ts
 * const popover = createPopoverOverlay({
 *   trigger: buttonElement,
 *   placement: 'bottom-start',
 *   offset: 8,
 *   onOpenChange: (open) => setOpen(open)
 * });
 *
 * popover.setContentElement(popoverContent);
 * popover.open();
 * ```
 */
export function createPopoverOverlay(options: PopoverOverlayOptions): PopoverOverlay;

// =============================================================================
// Selectable List Composite
// =============================================================================

export type SelectionMode = "single" | "multiple";
export type ListOrientation = "horizontal" | "vertical";

export interface SelectableListOptions<T = unknown> {
  /** Items in the list */
  items: T[];
  /** Get unique ID from item */
  getItemId: (item: T) => string;
  /** Get searchable text from item (for type-ahead) */
  getItemText?: (item: T) => string;
  /** Selection mode */
  mode?: SelectionMode;
  /** Initially selected item IDs */
  defaultSelected?: string[];
  /** Controlled selected item IDs */
  selected?: string[];
  /** Wrap navigation at boundaries */
  wrap?: boolean;
  /** Arrow key orientation */
  orientation?: ListOrientation;
  /** Enable type-ahead search */
  typeAhead?: boolean;
  /** Type-ahead debounce in ms */
  typeAheadDebounce?: number;
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Callback when focus changes */
  onFocusChange?: (focusedId: string | null) => void;
}

export interface SelectableListState {
  /** Currently focused item ID */
  focusedId: string | null;
  /** Set of selected item IDs */
  selectedIds: Set<string>;
}

export interface SelectableList<T = unknown> {
  /** Current state */
  readonly state: SelectableListState;
  /** Focus a specific item by ID */
  focusItem(id: string): void;
  /** Focus next item */
  focusNext(): void;
  /** Focus previous item */
  focusPrevious(): void;
  /** Focus first item */
  focusFirst(): void;
  /** Focus last item */
  focusLast(): void;
  /** Select an item (behavior depends on mode) */
  select(id: string, event?: MouseEvent | KeyboardEvent): void;
  /** Deselect an item (multiple mode only) */
  deselect(id: string): void;
  /** Toggle item selection */
  toggleSelection(id: string): void;
  /** Select all items (multiple mode only) */
  selectAll(): void;
  /** Clear all selections */
  clearSelection(): void;
  /** Check if item is selected */
  isSelected(id: string): boolean;
  /** Check if item is focused */
  isFocused(id: string): boolean;
  /** Get all selected item IDs */
  getSelectedIds(): string[];
  /** Handle keyboard event (arrow keys, type-ahead, Enter/Space) */
  handleKeyDown(event: KeyboardEvent): void;
  /** Get props for list container */
  getListProps(): {
    role: "listbox";
    "aria-multiselectable"?: "true";
    tabIndex: 0;
    onKeyDown: (event: KeyboardEvent) => void;
  };
  /** Get props for list item */
  getItemProps(id: string): {
    id: string;
    role: "option";
    "aria-selected": "true" | "false";
    tabIndex: -1 | 0;
  };
  /** Clean up resources */
  destroy(): void;
}

/**
 * Creates a selectable list composite.
 *
 * Bundles:
 * - Roving focus (arrow key navigation)
 * - Type-ahead search
 * - Selection state management (single/multiple)
 * - Range selection (Shift+click in multiple mode)
 *
 * @example
 * ```ts
 * const list = createSelectableList({
 *   items: ['apple', 'banana', 'cherry'],
 *   getItemId: (item) => item,
 *   mode: 'single',
 *   onSelectionChange: (ids) => console.log('Selected:', ids)
 * });
 *
 * // Render with props
 * <ul {...list.getListProps()}>
 *   {items.map(item => (
 *     <li
 *       key={item}
 *       {...list.getItemProps(item)}
 *       onClick={() => list.select(item)}
 *     >
 *       {item}
 *     </li>
 *   ))}
 * </ul>
 * ```
 */
export function createSelectableList<T>(
  options: SelectableListOptions<T>
): SelectableList<T>;

// =============================================================================
// ARIA Utilities
// =============================================================================

/**
 * Generate a unique ARIA ID with optional prefix.
 *
 * @param prefix - ID prefix (default: 'aria')
 * @returns Unique ID string (e.g., 'dialog-title-1')
 *
 * @example
 * ```ts
 * const titleId = generateAriaId('dialog-title'); // 'dialog-title-1'
 * const descId = generateAriaId('dialog-desc');   // 'dialog-desc-2'
 * ```
 */
export function generateAriaId(prefix?: string): string;

/**
 * Connect an element to one or more describers via aria-describedby.
 *
 * @param element - The element to describe
 * @param describers - Elements that describe the element
 * @returns Cleanup function to remove the connection
 *
 * @example
 * ```ts
 * const cleanup = connectAriaDescribedBy(input, [helpText, errorMessage]);
 * // Later...
 * cleanup();
 * ```
 */
export function connectAriaDescribedBy(
  element: HTMLElement,
  describers: HTMLElement[]
): () => void;

/**
 * Announce a message to screen readers via live region.
 *
 * @param message - Message to announce
 * @param priority - 'polite' (default) or 'assertive'
 *
 * @example
 * ```ts
 * announceToScreenReader('Form submitted successfully');
 * announceToScreenReader('Error: Invalid email', 'assertive');
 * ```
 */
export function announceToScreenReader(
  message: string,
  priority?: "polite" | "assertive"
): void;
