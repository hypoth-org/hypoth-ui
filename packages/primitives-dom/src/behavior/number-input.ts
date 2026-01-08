/**
 * NumberInput behavior primitive.
 * Manages numeric input with increment/decrement, range constraints, and formatting.
 */

// =============================================================================
// Types
// =============================================================================

export interface NumberInputBehaviorOptions {
  /** Initial value */
  defaultValue?: number;
  /** Called on value change */
  onValueChange?: (value: number) => void;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Large step (Shift+Arrow, Page keys) */
  largeStep?: number;
  /** Decimal precision */
  precision?: number;
  /** Allow empty input (null value) */
  allowEmpty?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Locale for number formatting */
  locale?: string;
  /** Format pattern (e.g., "currency", "percent") */
  format?: "decimal" | "currency" | "percent";
  /** Currency code for currency format */
  currency?: string;
}

export interface NumberInputBehaviorState {
  value: number | null;
  min: number | null;
  max: number | null;
  step: number;
  precision: number;
  inputValue: string;
  isValid: boolean;
  disabled: boolean;
}

export interface NumberInputProps {
  type: "text";
  inputMode: "decimal" | "numeric";
  role: "spinbutton";
  "aria-valuemin"?: number;
  "aria-valuemax"?: number;
  "aria-valuenow"?: number;
  "aria-disabled"?: boolean;
  "aria-invalid"?: boolean;
}

export interface NumberInputBehavior {
  /** Current state */
  readonly state: NumberInputBehaviorState;

  /** Increment value by step */
  increment(large?: boolean): void;

  /** Decrement value by step */
  decrement(large?: boolean): void;

  /** Set value directly */
  setValue(value: number | null): void;

  /** Set value from string input */
  setFromString(input: string): void;

  /** Commit pending input (on blur) */
  commit(): void;

  /** Format value for display */
  format(value: number | null): string;

  /** Parse string to number */
  parse(input: string): number | null;

  /** Clamp value to constraints */
  clamp(value: number): number;

  /** Get input props */
  getInputProps(): NumberInputProps;

  /** Handle input change */
  handleInput(input: string): void;

  /** Handle keyboard events */
  handleKeyDown(event: KeyboardEvent): boolean;

  /** Cleanup */
  destroy(): void;
}

// =============================================================================
// Implementation
// =============================================================================

/**
 * Creates a number input behavior primitive.
 *
 * @example
 * ```ts
 * const numberInput = createNumberInputBehavior({
 *   min: 0,
 *   max: 100,
 *   step: 1,
 *   precision: 0,
 *   onValueChange: (value) => console.log('Value:', value),
 * });
 *
 * // With currency formatting
 * const priceInput = createNumberInputBehavior({
 *   format: 'currency',
 *   currency: 'USD',
 *   min: 0,
 *   precision: 2,
 * });
 * ```
 */
export function createNumberInputBehavior(
  options: NumberInputBehaviorOptions = {}
): NumberInputBehavior {
  const {
    defaultValue,
    onValueChange,
    min = null,
    max = null,
    step = 1,
    largeStep = step * 10,
    precision = 0,
    allowEmpty = false,
    disabled = false,
    locale = "en-US",
    format = "decimal",
    currency = "USD",
  } = options;

  // Internal state
  let state: NumberInputBehaviorState = {
    value: defaultValue ?? (allowEmpty ? null : 0),
    min: min !== undefined ? min : null,
    max: max !== undefined ? max : null,
    step,
    precision,
    inputValue: "",
    isValid: true,
    disabled,
  };

  // Number formatter
  const getFormatter = (): Intl.NumberFormat => {
    const opts: Intl.NumberFormatOptions = {
      minimumFractionDigits: precision,
      maximumFractionDigits: precision,
    };

    if (format === "currency") {
      opts.style = "currency";
      opts.currency = currency;
    } else if (format === "percent") {
      opts.style = "percent";
    }

    return new Intl.NumberFormat(locale, opts);
  };

  // Initialize input value
  state.inputValue = formatValue(state.value);

  // Helpers
  function clampValue(value: number): number {
    let result = value;
    if (state.min !== null && result < state.min) result = state.min;
    if (state.max !== null && result > state.max) result = state.max;
    return result;
  }

  function roundToPrecision(value: number): number {
    const multiplier = 10 ** precision;
    return Math.round(value * multiplier) / multiplier;
  }

  function formatValue(value: number | null): string {
    if (value === null) return "";
    try {
      return getFormatter().format(value);
    } catch {
      return String(value);
    }
  }

  function parseValue(input: string): number | null {
    if (!input.trim()) {
      return allowEmpty ? null : 0;
    }

    // Remove currency symbols, percent signs, and group separators
    let cleaned = input.replace(/[^\d.,\-+eE]/g, "").replace(/,/g, ".");

    // Handle multiple decimal points - keep only the first
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      cleaned = `${parts[0]}.${parts.slice(1).join("")}`;
    }

    const parsed = Number.parseFloat(cleaned);

    if (Number.isNaN(parsed)) {
      return null;
    }

    // Handle percent format (divide by 100)
    if (format === "percent" && !input.includes("%")) {
      return roundToPrecision(parsed / 100);
    }

    return roundToPrecision(parsed);
  }

  function updateValue(newValue: number | null, notify = true): void {
    const clampedValue = newValue !== null ? clampValue(roundToPrecision(newValue)) : null;

    if (state.value === clampedValue) return;

    state = {
      ...state,
      value: clampedValue,
      inputValue: formatValue(clampedValue),
      isValid: true,
    };

    if (notify && clampedValue !== null) {
      onValueChange?.(clampedValue);
    }
  }

  // Public API
  function increment(large = false): void {
    if (state.disabled) return;
    const currentValue = state.value ?? 0;
    const stepSize = large ? largeStep : step;
    updateValue(currentValue + stepSize);
  }

  function decrement(large = false): void {
    if (state.disabled) return;
    const currentValue = state.value ?? 0;
    const stepSize = large ? largeStep : step;
    updateValue(currentValue - stepSize);
  }

  function setValue(value: number | null): void {
    if (state.disabled) return;
    updateValue(value);
  }

  function setFromString(input: string): void {
    if (state.disabled) return;
    const parsed = parseValue(input);
    if (parsed !== null || allowEmpty) {
      updateValue(parsed);
    }
  }

  function handleInput(input: string): void {
    if (state.disabled) return;

    // Update input value without committing
    state = {
      ...state,
      inputValue: input,
      isValid: parseValue(input) !== null || (allowEmpty && !input.trim()),
    };
  }

  function commit(): void {
    // Parse and commit the current input value
    const parsed = parseValue(state.inputValue);

    if (parsed !== null) {
      updateValue(parsed);
    } else if (allowEmpty && !state.inputValue.trim()) {
      updateValue(null);
    } else {
      // Invalid input - revert to last valid value
      state = {
        ...state,
        inputValue: formatValue(state.value),
        isValid: true,
      };
    }
  }

  function getInputProps(): NumberInputProps {
    const props: NumberInputProps = {
      type: "text",
      inputMode: precision > 0 ? "decimal" : "numeric",
      role: "spinbutton",
    };

    if (state.min !== null) {
      props["aria-valuemin"] = state.min;
    }
    if (state.max !== null) {
      props["aria-valuemax"] = state.max;
    }
    if (state.value !== null) {
      props["aria-valuenow"] = state.value;
    }
    if (state.disabled) {
      props["aria-disabled"] = true;
    }
    if (!state.isValid) {
      props["aria-invalid"] = true;
    }

    return props;
  }

  function handleKeyDown(event: KeyboardEvent): boolean {
    if (state.disabled) return false;

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        increment(event.shiftKey);
        return true;
      case "ArrowDown":
        event.preventDefault();
        decrement(event.shiftKey);
        return true;
      case "PageUp":
        event.preventDefault();
        increment(true);
        return true;
      case "PageDown":
        event.preventDefault();
        decrement(true);
        return true;
      case "Home":
        event.preventDefault();
        if (state.min !== null) {
          updateValue(state.min);
        }
        return true;
      case "End":
        event.preventDefault();
        if (state.max !== null) {
          updateValue(state.max);
        }
        return true;
      case "Enter":
        commit();
        return true;
    }

    return false;
  }

  function destroy(): void {
    // No cleanup needed
  }

  return {
    get state() {
      return state;
    },
    increment,
    decrement,
    setValue,
    setFromString,
    commit,
    format: formatValue,
    parse: parseValue,
    clamp: clampValue,
    getInputProps,
    handleInput,
    handleKeyDown,
    destroy,
  };
}
