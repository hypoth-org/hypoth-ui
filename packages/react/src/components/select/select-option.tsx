/**
 * Select Option component - individual option in the select.
 */

import { type HTMLAttributes, type ReactNode, forwardRef, useCallback } from "react";
import { useSelectContext } from "./select-context.js";

export interface SelectOptionProps extends Omit<HTMLAttributes<HTMLDivElement>, "value"> {
  /** Option value */
  value: string;
  /** Display label (uses children if not specified) */
  label?: string;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Option content */
  children?: ReactNode;
}

/**
 * Individual option in the select.
 *
 * @example
 * ```tsx
 * <Select.Option value="apple">Apple</Select.Option>
 * <Select.Option value="banana" disabled>Banana</Select.Option>
 * ```
 */
export const SelectOption = forwardRef<HTMLDivElement, SelectOptionProps>(
  (
    {
      value: optionValue,
      label,
      disabled = false,
      children,
      className,
      onClick,
      onMouseEnter,
      ...restProps
    },
    ref
  ) => {
    const { behavior, value, highlightedValue, setHighlightedValue, setOpen } =
      useSelectContext("Select.Option");

    const isSelected = value === optionValue;
    const isHighlighted = highlightedValue === optionValue;

    // Handle click to select
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        behavior.select(optionValue);
        setOpen(false);
        onClick?.(event);
      },
      [behavior, optionValue, disabled, setOpen, onClick]
    );

    // Handle mouse enter to highlight
    const handleMouseEnter = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        behavior.highlight(optionValue);
        setHighlightedValue(optionValue);
        onMouseEnter?.(event);
      },
      [behavior, optionValue, disabled, setHighlightedValue, onMouseEnter]
    );

    const optionProps = behavior.getOptionProps(
      optionValue,
      label || String(children) || optionValue
    );

    return (
      <div
        ref={ref}
        role={optionProps.role}
        id={optionProps.id}
        aria-selected={isSelected}
        aria-disabled={disabled || undefined}
        data-value={optionValue}
        data-selected={isSelected || undefined}
        data-highlighted={isHighlighted || undefined}
        data-disabled={disabled || undefined}
        className={className}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

SelectOption.displayName = "Select.Option";
