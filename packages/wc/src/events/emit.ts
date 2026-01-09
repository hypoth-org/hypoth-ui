/**
 * Event emission utilities for design system components.
 *
 * All custom events use the `ds:` prefix to avoid collision with native DOM events.
 */

/**
 * Options for emitting custom events
 */
export interface EmitEventOptions<T = unknown> {
  /** Event payload data */
  detail?: T;
  /** Whether event bubbles up the DOM tree (default: true) */
  bubbles?: boolean;
  /** Whether event crosses shadow DOM boundaries (default: true) */
  composed?: boolean;
  /** Whether event can be cancelled (default: false) */
  cancelable?: boolean;
}

/**
 * Emit a design system custom event with the `ds:` prefix.
 *
 * Events are automatically prefixed with `ds:` namespace.
 * Default behavior: bubbles and composed are true.
 *
 * @param element - The element dispatching the event
 * @param name - Event name (without ds: prefix)
 * @param options - Event options including detail payload
 * @returns The dispatched CustomEvent
 *
 * @example
 * ```typescript
 * // Emit ds:change event
 * emitEvent(this, 'change', { detail: { value: newValue } });
 *
 * // Emit ds:dismiss with reason
 * emitEvent(this, 'dismiss', { detail: { reason: 'escape' } });
 *
 * // Emit cancelable event
 * const event = emitEvent(this, 'before-close', { cancelable: true });
 * if (event.defaultPrevented) {
 *   // Consumer called event.preventDefault()
 *   return;
 * }
 * ```
 */
export function emitEvent<T = unknown>(
  element: HTMLElement,
  name: string,
  options: EmitEventOptions<T> = {}
): CustomEvent<T> {
  const { detail, bubbles = true, composed = true, cancelable = false } = options;

  const event = new CustomEvent<T>(`ds:${name}`, {
    detail: detail as T,
    bubbles,
    composed,
    cancelable,
  });

  element.dispatchEvent(event);
  return event;
}

/**
 * Standard event names used across the design system.
 *
 * Components SHOULD use these standard names when applicable
 * for consistency across the component library.
 *
 * Naming conventions (per event-names.ts):
 * - React props use camelCase callbacks (e.g., onPress, onValueChange)
 * - Web Components use ds: prefixed custom events (e.g., ds:press, ds:change)
 */
export const StandardEvents = {
  /** User activation (click, Enter, Space) - buttons, links, menu items */
  PRESS: "press",
  /** Value changed (inputs, selects) */
  CHANGE: "change",
  /** Item selected (lists, menus) */
  SELECT: "select",
  /** Open state changed (dialogs, dropdowns, menus) - detail: { open, reason } */
  OPEN_CHANGE: "open-change",
  /** Component dismissed (toasts, alerts) */
  DISMISS: "dismiss",
  /** Focus moved within component */
  FOCUS_CHANGE: "focus-change",
  /** Expanded state changed (trees, accordions, collapsibles) */
  EXPANDED_CHANGE: "expanded-change",
  /** Checked state changed (checkboxes, switches, radio groups) */
  CHECKED_CHANGE: "checked-change",
  /** Sort state changed (tables) */
  SORT_CHANGE: "sort-change",
  /** Index changed (pagination, tabs, steppers, carousels) */
  INDEX_CHANGE: "index-change",
  /** Search query changed */
  SEARCH: "search",
  /** Hover state changed */
  HOVER_CHANGE: "hover-change",
  /** Items reordered (drag-and-drop) */
  REORDER: "reorder",
  /** Content copied to clipboard */
  COPY: "copy",
  /** Element resized */
  RESIZE: "resize",
  /** @deprecated Use OPEN_CHANGE instead */
  OPEN: "open",
  /** @deprecated Use OPEN_CHANGE instead */
  CLOSE: "close",
  /** @deprecated Use OPEN_CHANGE with cancelable: true instead */
  BEFORE_CLOSE: "before-close",
  /** @deprecated Use PRESS instead */
  CLICK: "click",
  /** Navigate event (links) */
  NAVIGATE: "navigate",
} as const;

export type StandardEventName = (typeof StandardEvents)[keyof typeof StandardEvents];
