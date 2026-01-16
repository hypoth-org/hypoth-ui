/**
 * NumberInput Increment button component.
 */

import { type ButtonHTMLAttributes, type MouseEvent, forwardRef, useCallback } from "react";
import { useNumberInputContext } from "./number-input-context.js";

export interface NumberInputIncrementProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

/**
 * Button to increment the number input value.
 *
 * @example
 * ```tsx
 * <NumberInput.Increment className="increment-btn">+</NumberInput.Increment>
 * ```
 */
export const NumberInputIncrement = forwardRef<HTMLButtonElement, NumberInputIncrementProps>(
  ({ className, onClick, children, disabled: disabledProp, ...restProps }, ref) => {
    const { behavior, value, max, disabled, setInputValue } =
      useNumberInputContext("NumberInput.Increment");

    const isAtMax = max !== undefined && value !== null && value >= max;
    const isDisabled = disabled || disabledProp || isAtMax;

    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        if (isDisabled) return;
        behavior.increment();
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
        aria-label="Increment"
        disabled={isDisabled}
        className={className}
        onClick={handleClick}
        {...restProps}
      >
        {children ?? "+"}
      </button>
    );
  }
);

NumberInputIncrement.displayName = "NumberInput.Increment";
