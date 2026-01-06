/**
 * Menu Root component - provides context to all Menu compound components.
 */

import { createMenuBehavior, type Placement } from "@ds/primitives-dom";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { MenuProvider } from "./menu-context.js";

export interface MenuRootProps {
  /** Menu content */
  children?: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Called when an item is selected */
  onSelect?: (value: string) => void;
  /** Placement relative to trigger */
  placement?: Placement;
  /** Offset from trigger in pixels */
  offset?: number;
  /** Whether to flip placement on viewport edge */
  flip?: boolean;
  /** Whether to loop navigation at ends */
  loop?: boolean;
}

/**
 * Root component for Menu compound pattern.
 * Provides context to Trigger, Content, and Item.
 *
 * @example
 * ```tsx
 * <Menu.Root onSelect={(value) => console.log(value)}>
 *   <Menu.Trigger>Open Menu</Menu.Trigger>
 *   <Menu.Content>
 *     <Menu.Item value="edit">Edit</Menu.Item>
 *     <Menu.Item value="delete">Delete</Menu.Item>
 *   </Menu.Content>
 * </Menu.Root>
 * ```
 */
export function MenuRoot({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onSelect,
  placement = "bottom-start",
  offset = 4,
  flip = true,
  loop = true,
}: MenuRootProps) {
  // Support both controlled and uncontrolled modes
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange]
  );

  // Create behavior instance - intentionally created once with initial values
  // biome-ignore lint/correctness/useExhaustiveDependencies: behavior is created once, open state synced via setOpen callback
  const behavior = useMemo(
    () =>
      createMenuBehavior({
        defaultOpen: open,
        placement,
        offset,
        flip,
        loop,
        onOpenChange: setOpen,
        onSelect,
      }),
    []
  );

  const contextValue = useMemo(
    () => ({
      behavior,
      open,
      setOpen,
    }),
    [behavior, open, setOpen]
  );

  return <MenuProvider value={contextValue}>{children}</MenuProvider>;
}

MenuRoot.displayName = "Menu.Root";
