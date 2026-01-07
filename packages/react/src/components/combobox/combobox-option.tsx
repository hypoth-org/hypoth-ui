/**
 * Combobox Option component - individual option in the combobox.
 */

import { type HTMLAttributes, type ReactNode, forwardRef, useCallback } from "react";
import { useComboboxContext } from "./combobox-context.js";

export interface ComboboxOptionProps extends Omit<HTMLAttributes<HTMLDivElement>, "value"> {
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
 * Individual option in the combobox.
 *
 * @example
 * ```tsx
 * <Combobox.Option value="apple">Apple</Combobox.Option>
 * <Combobox.Option value="banana" disabled>Banana</Combobox.Option>
 * ```
 */
export const ComboboxOption = forwardRef<HTMLDivElement, ComboboxOptionProps>(
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
    const { behavior, value, highlightedValue, setHighlightedValue, setOpen, multiple } =
      useComboboxContext("Combobox.Option");

    const isSelected = multiple ? (value as string[]).includes(optionValue) : value === optionValue;
    const isHighlighted = highlightedValue === optionValue;

    // Handle click to select
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        behavior.select(optionValue);
        if (!multiple) {
          behavior.close();
          setOpen(false);
        }
        onClick?.(event);
      },
      [behavior, optionValue, disabled, multiple, setOpen, onClick]
    );

    // Handle mouse enter to highlight
    const handleMouseEnter = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        setHighlightedValue(optionValue);
        onMouseEnter?.(event);
      },
      [optionValue, disabled, setHighlightedValue, onMouseEnter]
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

ComboboxOption.displayName = "Combobox.Option";
