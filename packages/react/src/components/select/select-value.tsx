/**
 * Select Value component - displays the selected value.
 */

import { type HTMLAttributes, type ReactNode, forwardRef } from "react";
import { useSelectContext } from "./select-context.js";

export interface SelectValueProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Placeholder text when no value is selected */
  placeholder?: string;
  /** Custom render function for the value */
  children?: ReactNode | ((value: string | null) => ReactNode);
}

/**
 * Displays the currently selected value.
 * Used inside Select.Trigger.
 *
 * @example
 * ```tsx
 * <Select.Trigger>
 *   <Select.Value placeholder="Select a fruit" />
 * </Select.Trigger>
 * ```
 */
export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ placeholder, children, className, ...restProps }, ref) => {
    const { value } = useSelectContext("Select.Value");

    let displayContent: ReactNode;

    if (typeof children === "function") {
      displayContent = children(value);
    } else if (children) {
      displayContent = value ? children : placeholder;
    } else {
      displayContent = value || placeholder;
    }

    return (
      <span ref={ref} className={className} data-placeholder={!value || undefined} {...restProps}>
        {displayContent}
      </span>
    );
  }
);

SelectValue.displayName = "Select.Value";
