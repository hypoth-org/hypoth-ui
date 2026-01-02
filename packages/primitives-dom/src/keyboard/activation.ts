/**
 * Keyboard activation handler for interactive elements.
 * Handles Enter and Space key activation.
 */

/**
 * Options for creating an activation handler.
 */
export interface ActivationOptions {
  /**
   * Callback invoked when activation key is pressed.
   */
  onActivate: (event: KeyboardEvent) => void;

  /**
   * Which keys trigger activation.
   * @default ["Enter", "Space"]
   */
  keys?: ("Enter" | "Space")[];

  /**
   * Whether to prevent default behavior.
   * - `true`: Always prevent default
   * - `false`: Never prevent default
   * - `"Space"`: Only prevent default for Space (recommended)
   * @default "Space"
   */
  preventDefault?: boolean | "Space";
}

/**
 * Creates an activation handler for keyboard events.
 */
export function createActivationHandler(
  options: ActivationOptions
): (event: KeyboardEvent) => void {
  const {
    onActivate,
    keys = ["Enter", "Space"],
    preventDefault = "Space",
  } = options;

  return function handleKeyDown(event: KeyboardEvent): void {
    // Map Space key to " " for comparison
    const key = event.key === " " ? "Space" : event.key;

    if (!keys.includes(key as "Enter" | "Space")) {
      return;
    }

    // Handle preventDefault
    if (preventDefault === true) {
      event.preventDefault();
    } else if (preventDefault === "Space" && key === "Space") {
      event.preventDefault();
    }

    onActivate(event);
  };
}
