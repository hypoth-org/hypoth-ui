/**
 * NumberInput Root component - provides context to all NumberInput compound components.
 */

import { createNumberInputBehavior } from "@hypoth-ui/primitives-dom";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { type NumberInputFormat, NumberInputProvider } from "./number-input-context.js";

export interface NumberInputRootProps {
  /** NumberInput content */
  children?: ReactNode;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Decimal precision */
  precision?: number;
  /** Controlled value */
  value?: number | null;
  /** Default value (uncontrolled) */
  defaultValue?: number;
  /** Called when value changes */
  onValueChange?: (value: number) => void;
  /** Format type */
  format?: NumberInputFormat;
  /** Currency code (for currency format) */
  currency?: string;
  /** Locale for formatting */
  locale?: string;
  /** Allow empty input */
  allowEmpty?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Root component for NumberInput compound pattern.
 * Provides context to Input, Increment, and Decrement components.
 *
 * @example
 * ```tsx
 * <NumberInput.Root min={0} max={100} onValueChange={(v) => console.log(v)}>
 *   <NumberInput.Decrement>-</NumberInput.Decrement>
 *   <NumberInput.Input />
 *   <NumberInput.Increment>+</NumberInput.Increment>
 * </NumberInput.Root>
 * ```
 */
export function NumberInputRoot({
  children,
  min,
  max,
  step = 1,
  precision = 0,
  value: controlledValue,
  defaultValue = 0,
  onValueChange,
  format = "decimal",
  currency = "USD",
  locale = "en-US",
  allowEmpty = false,
  disabled = false,
}: NumberInputRootProps) {
  // Support controlled and uncontrolled modes
  const [internalValue, setInternalValue] = useState<number | null>(
    defaultValue ?? (allowEmpty ? null : 0)
  );
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  // Input state
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const setValue = useCallback(
    (nextValue: number | null) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      if (nextValue !== null) {
        onValueChange?.(nextValue);
      }
    },
    [isControlled, onValueChange]
  );

  // Create behavior instance
  // biome-ignore lint/correctness/useExhaustiveDependencies: behavior is created once
  const behavior = useMemo(
    () =>
      createNumberInputBehavior({
        min,
        max,
        step,
        precision,
        defaultValue: value ?? undefined,
        format,
        currency,
        locale,
        allowEmpty,
        disabled,
        onValueChange: setValue,
      }),
    []
  );

  // Initialize input value - sync from behavior on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional one-time init
  useMemo(() => {
    setInputValue(behavior.state.inputValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = useMemo(
    () => ({
      behavior,
      value,
      setValue,
      min,
      max,
      step,
      precision,
      disabled,
      inputValue,
      setInputValue,
      isFocused,
      setIsFocused,
    }),
    [behavior, value, setValue, min, max, step, precision, disabled, inputValue, isFocused]
  );

  return <NumberInputProvider value={contextValue}>{children}</NumberInputProvider>;
}

NumberInputRoot.displayName = "NumberInput.Root";
