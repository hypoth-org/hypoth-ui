/**
 * Menu Label component - non-interactive label for a group of items.
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface MenuLabelProps extends HTMLAttributes<HTMLDivElement> {
  /** Label content */
  children?: ReactNode;
}

/**
 * Non-interactive label for a group of menu items.
 *
 * @example
 * ```tsx
 * <Menu.Label>Actions</Menu.Label>
 * <Menu.Item value="edit">Edit</Menu.Item>
 * <Menu.Item value="delete">Delete</Menu.Item>
 * ```
 */
export const MenuLabel = forwardRef<HTMLDivElement, MenuLabelProps>(
  ({ children, ...restProps }, ref) => {
    return (
      <div ref={ref} role="presentation" {...restProps}>
        {children}
      </div>
    );
  }
);

MenuLabel.displayName = "Menu.Label";
