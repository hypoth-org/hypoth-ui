/**
 * Menu Separator component - visual separator between items.
 */

import { type HTMLAttributes, forwardRef } from "react";

export interface MenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Visual separator between menu items.
 *
 * @example
 * ```tsx
 * <Menu.Item value="edit">Edit</Menu.Item>
 * <Menu.Separator />
 * <Menu.Item value="delete">Delete</Menu.Item>
 * ```
 */
export const MenuSeparator = forwardRef<HTMLDivElement, MenuSeparatorProps>((props, ref) => {
  // biome-ignore lint/a11y/useFocusableInteractive: separator is decorative, not interactive
  return <div ref={ref} role="separator" aria-orientation="horizontal" {...props} />;
});

MenuSeparator.displayName = "Menu.Separator";
