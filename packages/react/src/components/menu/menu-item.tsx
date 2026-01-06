/**
 * Menu Item component - a selectable item in the menu.
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useMenuContext } from "./menu-context.js";

export interface MenuItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Item content */
  children?: ReactNode;
  /** Value passed to onSelect */
  value?: string;
  /** Whether item is disabled */
  disabled?: boolean;
}

/**
 * A selectable item in the menu.
 *
 * @example
 * ```tsx
 * <Menu.Item value="edit">Edit</Menu.Item>
 * <Menu.Item value="delete" disabled>Delete</Menu.Item>
 * ```
 */
export const MenuItem = forwardRef<HTMLDivElement, MenuItemProps>(
  ({ children, value = "", disabled = false, onClick, onPointerEnter, ...restProps }, ref) => {
    const { behavior } = useMenuContext("Menu.Item");
    const internalRef = useRef<HTMLDivElement>(null);
    const indexRef = useRef<number>(-1);

    // Register item with behavior
    useEffect(() => {
      const element = internalRef.current;
      if (element) {
        behavior.registerItem(element);
        // Get index after registration
        indexRef.current = behavior.context.items.indexOf(element);
        return () => {
          behavior.unregisterItem(element);
        };
      }
    }, [behavior]);

    // Handle click
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (!disabled) {
          behavior.handleItemClick(indexRef.current, value);
        }
        onClick?.(event);
      },
      [behavior, disabled, value, onClick]
    );

    // Handle pointer enter (hover)
    const handlePointerEnter = useCallback(
      (event: React.PointerEvent<HTMLDivElement>) => {
        if (!disabled) {
          behavior.handleItemPointerEnter(indexRef.current);
        }
        onPointerEnter?.(event);
      },
      [behavior, disabled, onPointerEnter]
    );

    // Get item props from behavior (need index)
    const itemProps = behavior.getItemProps(indexRef.current, { disabled });

    // Merge refs
    const mergedRef = useCallback(
      (element: HTMLDivElement | null) => {
        (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = element;
        if (typeof ref === "function") {
          ref(element);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
        }
      },
      [ref]
    );

    return (
      <div
        ref={mergedRef}
        role={itemProps.role}
        tabIndex={itemProps.tabIndex}
        aria-disabled={itemProps["aria-disabled"]}
        data-highlighted={itemProps["data-highlighted"]}
        data-value={value}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

MenuItem.displayName = "Menu.Item";
