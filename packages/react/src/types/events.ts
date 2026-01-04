/**
 * Event type definitions for React wrapper components.
 * These types match the custom events emitted by Web Components.
 */

/**
 * Event detail for ds:navigate custom event from ds-link.
 */
export interface DsNavigateEventDetail {
  /** The target URL */
  href: string;
  /** Whether the link opens in a new tab */
  external: boolean;
  /** The original DOM event that triggered navigation */
  originalEvent: MouseEvent | KeyboardEvent;
}

/**
 * Event detail for input value changes.
 */
export interface DsInputEventDetail {
  value: string;
}

/**
 * Typed event handler for ds:navigate.
 */
export type NavigateEventHandler = (
  event: CustomEvent<DsNavigateEventDetail>
) => void;

/**
 * Typed event handler for input events.
 */
export type InputValueHandler = (
  value: string,
  event: CustomEvent<DsInputEventDetail>
) => void;
