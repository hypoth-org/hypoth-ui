/**
 * Select Label component - label for option groups.
 */

import { type HTMLAttributes, type ReactNode, forwardRef } from "react";

export interface SelectLabelProps extends HTMLAttributes<HTMLDivElement> {
  /** Label content */
  children?: ReactNode;
}

/**
 * Label for grouping options.
 *
 * @example
 * ```tsx
 * <Select.Content>
 *   <Select.Label>Fruits</Select.Label>
 *   <Select.Option value="apple">Apple</Select.Option>
 *   <Select.Option value="banana">Banana</Select.Option>
 * </Select.Content>
 * ```
 */
export const SelectLabel = forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ children, className, ...restProps }, ref) => {
    return (
      <div ref={ref} role="presentation" aria-hidden="true" className={className} {...restProps}>
        {children}
      </div>
    );
  }
);

SelectLabel.displayName = "Select.Label";
