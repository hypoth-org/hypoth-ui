/**
 * Arrow key navigation handler with RTL support.
 * Maps physical arrow keys to logical navigation directions.
 */

import { type Direction, type LogicalDirection } from "../types.js";

/**
 * Options for creating an arrow key handler.
 */
export interface ArrowKeyOptions {
  /**
   * Navigation orientation.
   * - "horizontal": Left/Right only
   * - "vertical": Up/Down only
   * - "both": All arrows
   */
  orientation: Direction;

  /**
   * Whether layout is right-to-left.
   * Swaps Left/Right to Previous/Next mapping.
   * @default false
   */
  rtl?: boolean;

  /**
   * Callback invoked when navigation key is pressed.
   */
  onNavigate: (direction: LogicalDirection, event: KeyboardEvent) => void;
}

/**
 * Creates an arrow key handler for keyboard navigation.
 */
export function createArrowKeyHandler(
  options: ArrowKeyOptions
): (event: KeyboardEvent) => void {
  const { orientation, rtl = false, onNavigate } = options;

  return function handleKeyDown(event: KeyboardEvent): void {
    let direction: LogicalDirection | null = null;

    switch (event.key) {
      case "ArrowRight":
        if (orientation === "horizontal" || orientation === "both") {
          direction = rtl ? "previous" : "next";
        }
        break;

      case "ArrowLeft":
        if (orientation === "horizontal" || orientation === "both") {
          direction = rtl ? "next" : "previous";
        }
        break;

      case "ArrowDown":
        if (orientation === "vertical" || orientation === "both") {
          direction = "next";
        }
        break;

      case "ArrowUp":
        if (orientation === "vertical" || orientation === "both") {
          direction = "previous";
        }
        break;

      case "Home":
        direction = "first";
        break;

      case "End":
        direction = "last";
        break;
    }

    if (direction) {
      event.preventDefault();
      onNavigate(direction, event);
    }
  };
}
