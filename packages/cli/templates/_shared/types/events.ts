/**
 * Event type definitions for React wrapper components.
 * These types match the custom events emitted by Web Components.
 */

export interface DsNavigateEventDetail {
  /** The target URL */
  href: string;
  /** Whether the link opens in a new tab */
  external: boolean;
  /** The original DOM event that triggered navigation */
  originalEvent: MouseEvent | KeyboardEvent;
}

export interface DsInputEventDetail {
  value: string;
}

export type NavigateEventHandler = (event: CustomEvent<DsNavigateEventDetail>) => void;

export type InputValueHandler = (value: string, event: CustomEvent<DsInputEventDetail>) => void;
