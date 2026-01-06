/**
 * Button behavior primitive.
 * Provides state management, ARIA computation, and keyboard handling for buttons.
 */

// =============================================================================
// Types
// =============================================================================

export interface ButtonBehaviorOptions {
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether button is in loading state */
  loading?: boolean;
  /** Button type */
  type?: "button" | "submit" | "reset";
  /** Callback when button is activated (click or Enter/Space) */
  onActivate?: () => void;
}

export interface ButtonBehaviorState {
  disabled: boolean;
  loading: boolean;
  type: "button" | "submit" | "reset";
}

export interface ButtonAriaProps {
  "aria-disabled": "true" | undefined;
  "aria-busy": "true" | undefined;
  type: "button" | "submit" | "reset";
  tabIndex: number;
}

export interface ButtonBehavior {
  /** Current state */
  readonly state: ButtonBehaviorState;
  /** Update state */
  setState(partial: Partial<ButtonBehaviorState>): void;
  /** Get ARIA and type props for button element */
  getButtonProps(): ButtonAriaProps;
  /** Handle keyboard events - call this from onKeyDown */
  handleKeyDown(event: KeyboardEvent): void;
  /** Handle click events - call this from onClick */
  handleClick(event: MouseEvent | Event): void;
}

// =============================================================================
// Implementation
// =============================================================================

/**
 * Creates a button behavior primitive.
 *
 * @example
 * ```ts
 * const button = createButtonBehavior({
 *   disabled: false,
 *   loading: false,
 *   onActivate: () => console.log("clicked")
 * });
 *
 * // Apply to element
 * const props = button.getButtonProps();
 * element.setAttribute("aria-disabled", props["aria-disabled"] ?? "");
 * element.setAttribute("aria-busy", props["aria-busy"] ?? "");
 *
 * // Handle events
 * element.addEventListener("keydown", button.handleKeyDown);
 * element.addEventListener("click", button.handleClick);
 * ```
 */
export function createButtonBehavior(options: ButtonBehaviorOptions = {}): ButtonBehavior {
  const { disabled = false, loading = false, type = "button", onActivate } = options;

  // Internal state
  let state: ButtonBehaviorState = {
    disabled,
    loading,
    type,
  };

  function setState(partial: Partial<ButtonBehaviorState>): void {
    state = { ...state, ...partial };
  }

  function getButtonProps(): ButtonAriaProps {
    const isDisabled = state.disabled || state.loading;
    return {
      "aria-disabled": isDisabled ? "true" : undefined,
      "aria-busy": state.loading ? "true" : undefined,
      type: state.type,
      tabIndex: isDisabled ? -1 : 0,
    };
  }

  function handleKeyDown(event: KeyboardEvent): void {
    // Only handle Enter and Space on buttons
    if (event.key !== "Enter" && event.key !== " ") return;

    // Don't activate if disabled or loading
    if (state.disabled || state.loading) {
      event.preventDefault();
      return;
    }

    // For Space, prevent page scroll
    if (event.key === " ") {
      event.preventDefault();
    }

    // Activate on Enter (immediate) or Space (on keyup in real browsers)
    // For simplicity, we activate on keydown for both
    if (event.key === "Enter") {
      onActivate?.();
    }
  }

  function handleClick(event: MouseEvent | Event): void {
    // Don't activate if disabled or loading
    if (state.disabled || state.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onActivate?.();
  }

  return {
    get state() {
      return state;
    },
    setState,
    getButtonProps,
    handleKeyDown,
    handleClick,
  };
}
