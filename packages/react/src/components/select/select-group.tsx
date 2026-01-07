/**
 * Select Group component - groups options with an optional label.
 */

import { type HTMLAttributes, type ReactNode, forwardRef, useId } from "react";

export interface SelectGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Group content (Label and Options) */
  children?: ReactNode;
  /** Optional label text (alternative to using Select.Label as child) */
  label?: string;
}

/**
 * Group for organizing select options.
 *
 * @example
 * ```tsx
 * <Select.Content>
 *   <Select.Group>
 *     <Select.Label>Fruits</Select.Label>
 *     <Select.Option value="apple">Apple</Select.Option>
 *     <Select.Option value="banana">Banana</Select.Option>
 *   </Select.Group>
 *   <Select.Group label="Vegetables">
 *     <Select.Option value="carrot">Carrot</Select.Option>
 *     <Select.Option value="potato">Potato</Select.Option>
 *   </Select.Group>
 * </Select.Content>
 * ```
 */
export const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ children, className, label, ...restProps }, ref) => {
    const groupId = useId();
    const labelId = `${groupId}-label`;

    return (
      <div
        ref={ref}
        role="group"
        aria-label={label}
        aria-labelledby={!label ? labelId : undefined}
        className={className}
        data-group-label-id={labelId}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

SelectGroup.displayName = "Select.Group";
