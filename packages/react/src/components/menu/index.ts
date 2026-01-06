/**
 * Menu compound component exports.
 *
 * @example
 * ```tsx
 * import { Menu } from "@ds/react";
 *
 * <Menu.Root onSelect={(value) => console.log(value)}>
 *   <Menu.Trigger>Actions</Menu.Trigger>
 *   <Menu.Content>
 *     <Menu.Label>Options</Menu.Label>
 *     <Menu.Item value="edit">Edit</Menu.Item>
 *     <Menu.Item value="duplicate">Duplicate</Menu.Item>
 *     <Menu.Separator />
 *     <Menu.Item value="delete">Delete</Menu.Item>
 *   </Menu.Content>
 * </Menu.Root>
 * ```
 */

import { MenuContent, type MenuContentProps } from "./menu-content.js";
import { MenuItem, type MenuItemProps } from "./menu-item.js";
import { MenuLabel, type MenuLabelProps } from "./menu-label.js";
import { MenuRoot, type MenuRootProps } from "./menu-root.js";
import { MenuSeparator, type MenuSeparatorProps } from "./menu-separator.js";
import { MenuTrigger, type MenuTriggerProps } from "./menu-trigger.js";

// Compound component
export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
  Separator: MenuSeparator,
  Label: MenuLabel,
};

// Type exports
export type {
  MenuContentProps,
  MenuItemProps,
  MenuLabelProps,
  MenuRootProps,
  MenuSeparatorProps,
  MenuTriggerProps,
};

// Re-export Placement from primitives-dom
export type { Placement } from "@ds/primitives-dom";
