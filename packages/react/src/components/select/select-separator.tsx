/**
 * Select Separator component - visual separator between groups.
 */

import { type HTMLAttributes, forwardRef } from "react";

export interface SelectSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Visual separator for grouping options.
 *
 * @example
 * ```tsx
 * <Select.Content>
 *   <Select.Option value="apple">Apple</Select.Option>
 *   <Select.Separator />
 *   <Select.Option value="banana">Banana</Select.Option>
 * </Select.Content>
 * ```
 */
export const SelectSeparator = forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...restProps }, ref) => {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        className={className}
        {...restProps}
      />
    );
  }
);

SelectSeparator.displayName = "Select.Separator";
