/**
 * Event Utilities API Contract
 * Standardized event emission for design system components
 *
 * @package @ds/wc
 * @path packages/wc/src/events/emit.ts
 */

/**
 * Options for emitting events
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
 * Emit a design system custom event
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
export declare function emitEvent<T = unknown>(
  element: HTMLElement,
  name: string,
  options?: EmitEventOptions<T>
): CustomEvent<T>;

/**
 * Standard event names used across the design system
 *
 * Components SHOULD use these standard names when applicable.
 */
export declare const StandardEvents: {
  /** Value changed (inputs, selects) */
  readonly CHANGE: "change";
  /** Item selected (lists, menus) */
  readonly SELECT: "select";
  /** Component opened (dialogs, dropdowns) */
  readonly OPEN: "open";
  /** Component closed (dialogs, dropdowns) */
  readonly CLOSE: "close";
  /** Before close - cancelable (dialogs) */
  readonly BEFORE_CLOSE: "before-close";
  /** Component dismissed (toasts, alerts) */
  readonly DISMISS: "dismiss";
  /** Focus moved within component */
  readonly FOCUS_CHANGE: "focus-change";
};
