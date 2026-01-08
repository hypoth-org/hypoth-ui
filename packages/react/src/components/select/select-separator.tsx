/**
 * Select Separator component - visual separator between groups.
 */

import { type HTMLAttributes, forwardRef } from "react";

export interface SelectSeparatorProps extends HTMLAttributes<HTMLHRElement> {}

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
export const SelectSeparator = forwardRef<HTMLHRElement, SelectSeparatorProps>(
  ({ className, ...restProps }, ref) => {
    return <hr ref={ref} className={className} {...restProps} />;
  }
);

SelectSeparator.displayName = "Select.Separator";
