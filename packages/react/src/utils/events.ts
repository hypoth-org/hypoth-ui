import type { SyntheticEvent } from "react";

/**
 * Event normalization utilities for Web Component → React interop.
 * Handles event bubbling and synthetic event creation.
 */

/**
 * Creates a wrapped event handler that normalizes Web Component custom events
 * to work with React's event system.
 */
export function createEventHandler<T extends SyntheticEvent>(
  handler: ((event: T) => void) | undefined
): ((event: Event) => void) | undefined {
  if (!handler) return undefined;

  return (event: Event) => {
    // Create a synthetic-like event object
    const syntheticEvent = {
      ...event,
      nativeEvent: event,
      currentTarget: event.currentTarget,
      target: event.target,
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      defaultPrevented: event.defaultPrevented,
      eventPhase: event.eventPhase,
      isTrusted: event.isTrusted,
      preventDefault: () => event.preventDefault(),
      stopPropagation: () => event.stopPropagation(),
      persist: () => {},
      isDefaultPrevented: () => event.defaultPrevented,
      isPropagationStopped: () => false,
      type: event.type,
      timeStamp: event.timeStamp,
    } as unknown as T;

    handler(syntheticEvent);
  };
}

/**
 * Attaches event listeners to a Web Component element.
 * Returns a cleanup function.
 */
export function attachEventListeners(
  element: Element,
  events: Record<string, ((event: Event) => void) | undefined>
): () => void {
  const cleanup: (() => void)[] = [];

  for (const [eventName, handler] of Object.entries(events)) {
    if (handler) {
      element.addEventListener(eventName, handler);
      cleanup.push(() => element.removeEventListener(eventName, handler));
    }
  }

  return () => {
    for (const fn of cleanup) {
      fn();
    }
  };
}
