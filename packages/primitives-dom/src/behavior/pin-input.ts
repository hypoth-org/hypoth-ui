/**
 * PIN Input behavior primitive.
 * Manages PIN/OTP input focus auto-advance, paste handling, backspace navigation, and ARIA state.
 */

// =============================================================================
// Types
// =============================================================================

export interface PinInputBehaviorOptions {
  /** Number of digits */
  length?: number;
  /** Initial value */
  defaultValue?: string;
  /** Called on value change */
  onValueChange?: (value: string) => void;
  /** Called when all digits entered */
  onComplete?: (value: string) => void;
  /** Allow alphanumeric characters */
  alphanumeric?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom ID generator */
  generateId?: () => string;
}

export interface PinInputBehaviorState {
  value: string;
  length: number;
  focusedIndex: number | null;
  complete: boolean;
  alphanumeric: boolean;
  disabled: boolean;
}

export interface PinInputContainerProps {
  role: "group";
  "aria-label": string;
}

export interface PinInputFieldProps {
  type: "text";
  inputMode: "numeric" | "text";
  maxLength: 1;
  autoComplete: "one-time-code";
  "aria-label": string;
  tabIndex: number;
}

export interface PinInputBehavior {
  /** Current state */
  readonly state: PinInputBehaviorState;
  /** Container ID */
  readonly containerId: string;

  /** Handle character input at index */
  input(index: number, char: string): void;

  /** Handle backspace at index */
  backspace(index: number): void;

  /** Handle paste */
  paste(value: string): void;

  /** Focus specific index */
  focus(index: number): void;

  /** Move focus left */
  focusPrev(): void;

  /** Move focus right */
  focusNext(): void;

  /** Clear all */
  clear(): void;

  /** Get value at index */
  getValueAt(index: number): string;

  /** Set value programmatically */
  setValue(value: string): void;

  /** Get ARIA props for container */
  getContainerProps(): PinInputContainerProps;

  /** Get ARIA props for individual input */
  getInputProps(index: number): PinInputFieldProps;

  /** Cleanup */
  destroy(): void;
}

// =============================================================================
// Implementation
// =============================================================================

let idCounter = 0;

function defaultGenerateId(): string {
  return `pin-input-${++idCounter}`;
}

/**
 * Creates a PIN input behavior primitive.
 *
 * @example
 * ```ts
 * const pin = createPinInputBehavior({
 *   length: 6,
 *   onComplete: (value) => verifyOTP(value),
 *   onValueChange: (value) => console.log('Current:', value),
 * });
 *
 * // Handle input events
 * pin.input(0, '1'); // Enters '1' at first position, auto-advances
 * pin.backspace(3); // Deletes at position 3, moves focus back
 * pin.paste('123456'); // Fills all positions from paste
 * ```
 */
export function createPinInputBehavior(options: PinInputBehaviorOptions = {}): PinInputBehavior {
  const {
    length = 6,
    defaultValue = "",
    onValueChange,
    onComplete,
    alphanumeric = false,
    disabled = false,
    generateId = defaultGenerateId,
  } = options;

  // Generate stable IDs
  const baseId = generateId();
  const containerId = `${baseId}-container`;

  // Internal state
  let state: PinInputBehaviorState = {
    value: defaultValue.slice(0, length).padEnd(length, ""),
    length,
    focusedIndex: null,
    complete: defaultValue.length >= length,
    alphanumeric,
    disabled,
  };

  // Character validation
  function isValidChar(char: string): boolean {
    if (char.length !== 1) return false;
    if (alphanumeric) {
      return /^[a-zA-Z0-9]$/.test(char);
    }
    return /^[0-9]$/.test(char);
  }

  // Internal helpers
  function updateValue(newValue: string): void {
    const paddedValue = newValue.slice(0, length);
    const trimmedValue = paddedValue.replace(/\s+$/g, "").replace(/ /g, "");

    // Normalize: replace empty positions with spaces for internal tracking
    let normalized = "";
    for (let i = 0; i < length; i++) {
      normalized += paddedValue[i] || " ";
    }

    const wasComplete = state.complete;
    const isNowComplete = trimmedValue.length === length;

    state = {
      ...state,
      value: normalized,
      complete: isNowComplete,
    };

    // Emit value without padding
    onValueChange?.(trimmedValue);

    // Emit complete only on transition
    if (isNowComplete && !wasComplete) {
      onComplete?.(trimmedValue);
    }
  }

  // Public API
  function input(index: number, char: string): void {
    if (state.disabled) return;
    if (index < 0 || index >= length) return;
    if (!isValidChar(char)) return;

    // Replace character at index
    const chars = state.value.split("");
    chars[index] = char;
    updateValue(chars.join(""));

    // Auto-advance focus
    if (index < length - 1) {
      state = { ...state, focusedIndex: index + 1 };
    }
  }

  function backspace(index: number): void {
    if (state.disabled) return;
    if (index < 0 || index >= length) return;

    const chars = state.value.split("");

    // If current position is empty, clear previous and move focus back
    if (chars[index] === " " && index > 0) {
      chars[index - 1] = " ";
      updateValue(chars.join(""));
      state = { ...state, focusedIndex: index - 1 };
    } else {
      // Clear current position
      chars[index] = " ";
      updateValue(chars.join(""));
      // Move focus back
      if (index > 0) {
        state = { ...state, focusedIndex: index - 1 };
      }
    }
  }

  function paste(value: string): void {
    if (state.disabled) return;

    // Filter to valid characters only
    const filtered = value
      .split("")
      .filter((char) => isValidChar(char))
      .slice(0, length)
      .join("");

    if (filtered.length === 0) return;

    // Fill from current focus position or start
    const startIndex = state.focusedIndex ?? 0;
    const chars = state.value.split("");

    for (let i = 0; i < filtered.length && startIndex + i < length; i++) {
      const char = filtered[i];
      if (char !== undefined) {
        chars[startIndex + i] = char;
      }
    }

    updateValue(chars.join(""));

    // Focus last filled position or end
    const lastFilledIndex = Math.min(startIndex + filtered.length, length) - 1;
    state = { ...state, focusedIndex: lastFilledIndex };
  }

  function focus(index: number): void {
    if (index < 0 || index >= length) return;
    state = { ...state, focusedIndex: index };
  }

  function focusPrev(): void {
    const currentIndex = state.focusedIndex ?? 0;
    if (currentIndex > 0) {
      state = { ...state, focusedIndex: currentIndex - 1 };
    }
  }

  function focusNext(): void {
    const currentIndex = state.focusedIndex ?? -1;
    if (currentIndex < length - 1) {
      state = { ...state, focusedIndex: currentIndex + 1 };
    }
  }

  function clear(): void {
    if (state.disabled) return;
    updateValue(" ".repeat(length));
    state = { ...state, focusedIndex: 0 };
  }

  function getValueAt(index: number): string {
    if (index < 0 || index >= length) return "";
    const char = state.value[index] ?? "";
    return char === " " ? "" : char;
  }

  function setValue(value: string): void {
    if (state.disabled) return;
    updateValue(value.padEnd(length, " "));
  }

  function getContainerProps(): PinInputContainerProps {
    return {
      role: "group",
      "aria-label": `PIN input with ${length} digits`,
    };
  }

  function getInputProps(index: number): PinInputFieldProps {
    return {
      type: "text",
      inputMode: alphanumeric ? "text" : "numeric",
      maxLength: 1,
      autoComplete: "one-time-code",
      "aria-label": `Digit ${index + 1} of ${length}`,
      tabIndex: state.disabled ? -1 : 0,
    };
  }

  function destroy(): void {
    // Cleanup if needed
  }

  return {
    get state() {
      return state;
    },
    get containerId() {
      return containerId;
    },
    input,
    backspace,
    paste,
    focus,
    focusPrev,
    focusNext,
    clear,
    getValueAt,
    setValue,
    getContainerProps,
    getInputProps,
    destroy,
  };
}
