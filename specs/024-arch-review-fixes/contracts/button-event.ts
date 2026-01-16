/**
 * Button Event Contract
 *
 * Defines the ds:press event interface for button components.
 * This contract ensures consistent event handling across WC and React.
 */

/**
 * Event detail for ds:press events emitted by button components.
 */
export interface PressEventDetail {
  /**
   * Original DOM event that triggered the press.
   * MouseEvent for click activation, KeyboardEvent for Enter/Space.
   */
  originalEvent: MouseEvent | KeyboardEvent;

  /**
   * Reference to the button element that emitted the event.
   */
  target: HTMLElement;

  /**
   * Whether the activation was via keyboard (Enter or Space key).
   * - true: User pressed Enter or Space while button was focused
   * - false: User clicked with mouse or other pointing device
   *
   * Useful for analytics, focus management, or differentiated behavior.
   */
  isKeyboard: boolean;
}

/**
 * ds:press custom event type.
 */
export type PressEvent = CustomEvent<PressEventDetail>;

/**
 * Contract: Button MUST emit exactly one ds:press event per activation.
 *
 * Activation methods:
 * 1. Mouse click on button
 * 2. Enter key while button is focused
 * 3. Space key while button is focused
 *
 * Each activation method MUST result in exactly ONE ds:press event.
 * The event MUST include isKeyboard to distinguish activation method.
 */
export const BUTTON_EVENT_CONTRACT = {
  eventName: "ds:press",
  emitCount: "exactly-one-per-activation",
  detail: {
    originalEvent: "required",
    target: "required",
    isKeyboard: "required",
  },
} as const;
