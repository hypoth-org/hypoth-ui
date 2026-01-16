/**
 * NumberInput Decrement button component.
 */

import { type ButtonHTMLAttributes, type MouseEvent, forwardRef, useCallback } from "react";
import { useNumberInputContext } from "./number-input-context.js";

export interface NumberInputDecrementProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Button to decrement the number input value.
 *
 * @example
 * ```tsx
 * <NumberInput.Decrement className="decrement-btn">-</NumberInput.Decrement>
 * ```
 */
export const NumberInputDecrement = forwardRef<HTMLButtonElement, NumberInputDecrementProps>(
  ({ className, onClick, children, disabled: disabledProp, ...restProps }, ref) => {
    const { behavior, value, min, disabled, setInputValue } =
      useNumberInputContext("NumberInput.Decrement");

    const isAtMin = min !== undefined && value !== null && value <= min;
    const isDisabled = disabled || disabledProp || isAtMin;

    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) return;
        behavior.decrement();
        setInputValue(behavior.state.inputValue);
        onClick?.(event);
      },
      [behavior, isDisabled, setInputValue, onClick]
    );

    return (
      <button
        ref={ref}
        type="button"
        tabIndex={-1}
        aria-label="Decrement"
        disabled={isDisabled}
        className={className}
        onClick={handleClick}
        {...restProps}
      >
        {children ?? "−"}
      </button>
    );
  }
);

NumberInputDecrement.displayName = "NumberInput.Decrement";
