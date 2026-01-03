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
 */
export const StandardEvents = {
  /** Value changed (inputs, selects) */
  CHANGE: "change",
  /** Item selected (lists, menus) */
  SELECT: "select",
  /** Component opened (dialogs, dropdowns) */
  OPEN: "open",
  /** Component closed (dialogs, dropdowns) */
  CLOSE: "close",
  /** Before close - cancelable (dialogs) */
  BEFORE_CLOSE: "before-close",
  /** Component dismissed (toasts, alerts) */
  DISMISS: "dismiss",
  /** Focus moved within component */
  FOCUS_CHANGE: "focus-change",
  /** Click event (buttons) */
  CLICK: "click",
} as const;

export type StandardEventName = (typeof StandardEvents)[keyof typeof StandardEvents];
