/**
 * NumberInput Field component - the input element.
 */

import {
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  forwardRef,
  useCallback,
} from "react";
import { useNumberInputContext } from "./number-input-context.js";

export interface NumberInputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {}

/**
 * The input field for the number input.
 *
 * @example
 * ```tsx
 * <NumberInput.Input className="number-input" />
 * ```
 */
export const NumberInputField = forwardRef<HTMLInputElement, NumberInputFieldProps>(
  ({ className, onBlur, onFocus, onKeyDown, ...restProps }, ref) => {
    const { behavior, disabled, inputValue, setInputValue, setIsFocused } =
      useNumberInputContext("NumberInput.Input");

    const inputProps = behavior.getInputProps();

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setInputValue(newValue);
        behavior.handleInput(newValue);
      },
      [behavior, setInputValue]
    );

    const handleBlur = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        behavior.commit();
        setInputValue(behavior.state.inputValue);
        onBlur?.(event);
      },
      [behavior, setInputValue, setIsFocused, onBlur]
    );

    const handleFocus = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(event);
      },
      [setIsFocused, onFocus]
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        behavior.handleKeyDown(event.nativeEvent);
        setInputValue(behavior.state.inputValue);
        onKeyDown?.(event);
      },
      [behavior, setInputValue, onKeyDown]
    );

    return (
      <input
        ref={ref}
        type={inputProps.type}
        inputMode={inputProps.inputMode}
        role={inputProps.role}
        value={inputValue}
        disabled={disabled}
        aria-valuemin={inputProps["aria-valuemin"]}
        aria-valuemax={inputProps["aria-valuemax"]}
        aria-valuenow={inputProps["aria-valuenow"]}
        aria-disabled={inputProps["aria-disabled"]}
        aria-invalid={inputProps["aria-invalid"]}
        className={className}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        {...restProps}
      />
    );
  }
);

NumberInputField.displayName = "NumberInput.Input";
