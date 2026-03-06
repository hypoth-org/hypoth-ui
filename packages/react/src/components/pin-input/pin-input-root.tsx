/**
 * PinInput Root component - provides context to all PinInput compound components.
 */

import { createPinInputBehavior } from "@hypoth-ui/primitives-dom";
import { type ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { PinInputProvider } from "./pin-input-context.js";

export interface PinInputRootProps {
  /** PinInput content */
  children?: ReactNode;
  /** Number of input fields */
  length?: number;
  /** Controlled value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Called when value changes */
  onValueChange?: (value: string) => void;
  /** Called when all digits entered */
  onComplete?: (value: string) => void;
  /** Allow alphanumeric characters */
  alphanumeric?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Mask input (like password) */
  mask?: boolean;
}

/**
 * Root component for PinInput compound pattern.
 * Provides context to Field components.
 *
 * @example
 * ```tsx
 * <PinInput.Root length={6} onComplete={(value) => verifyOTP(value)}>
 *   <PinInput.Field index={0} />
 *   <PinInput.Field index={1} />
 *   <PinInput.Field index={2} />
 *   <PinInput.Field index={3} />
 *   <PinInput.Field index={4} />
 *   <PinInput.Field index={5} />
 * </PinInput.Root>
 * ```
 */
export function PinInputRoot({
  children,
  length = 6,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  onComplete,
  alphanumeric = false,
  disabled = false,
  mask = false,
}: PinInputRootProps) {
  // Support controlled and uncontrolled modes
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setValue = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange]
  );

  // Create behavior instance
  // biome-ignore lint/correctness/useExhaustiveDependencies: behavior is created once
  const behavior = useMemo(
    () =>
      createPinInputBehavior({
        length,
        defaultValue: value,
        alphanumeric,
        disabled,
        onValueChange: setValue,
        onComplete,
      }),
    []
  );

  const registerInput = useCallback((index: number, ref: HTMLInputElement | null) => {
    inputRefs.current[index] = ref;
  }, []);

  const focusInput = useCallback((index: number) => {
    const input = inputRefs.current[index];
    if (input) {
      input.focus();
      input.select();
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      behavior,
      value,
      length,
      focusedIndex,
      setFocusedIndex,
      registerInput,
      focusInput,
      disabled,
      mask,
    }),
    [behavior, value, length, focusedIndex, registerInput, focusInput, disabled, mask]
  );

  return <PinInputProvider value={contextValue}>{children}</PinInputProvider>;
}

PinInputRoot.displayName = "PinInput.Root";
