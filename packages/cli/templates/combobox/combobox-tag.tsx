/**
 * Combobox Tag component - selected value tag for multi-select.
 */

import { type HTMLAttributes, type ReactNode, forwardRef, useCallback } from "react";
import { useComboboxContext } from "./combobox-context.js";

export interface ComboboxTagProps extends Omit<HTMLAttributes<HTMLDivElement>, "value"> {
  /** Tag value */
  value: string;
  /** Display label */
  label?: string;
  /** Tag content */
  children?: ReactNode;
}

/**
 * Tag for displaying selected value in multi-select mode.
 *
 * @example
 * ```tsx
 * <Combobox.Tag value="apple">
 *   Apple
 *   <button onClick={() => remove("apple")}>×</button>
 * </Combobox.Tag>
 * ```
 */
export const ComboboxTag = forwardRef<HTMLDivElement, ComboboxTagProps>(
  ({ value: tagValue, label, children, className, onKeyDown, ...restProps }, ref) => {
    const { behavior } = useComboboxContext("Combobox.Tag");

    // Handle keyboard to remove
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Delete" || event.key === "Backspace") {
          event.preventDefault();
          behavior.remove(tagValue);
        }
        onKeyDown?.(event);
      },
      [behavior, tagValue, onKeyDown]
    );

    const tagProps = behavior.getTagProps(tagValue, label || String(children) || tagValue);

    return (
      <div
        ref={ref}
        role={tagProps.role}
        aria-label={tagProps["aria-label"]}
        data-value={tagValue}
        className={className}
        onKeyDown={handleKeyDown}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

ComboboxTag.displayName = "Combobox.Tag";
