/**
 * Menu Trigger component - opens the menu when activated.
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { Slot } from "../../primitives/slot.js";
import { useMenuContext } from "./menu-context.js";

export interface MenuTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Trigger content */
  children?: ReactNode;
  /** Render as child element (polymorphic) */
  asChild?: boolean;
}

/**
 * Trigger button that opens the menu.
 * Supports asChild for custom trigger elements.
 *
 * @example
 * ```tsx
 * <Menu.Trigger>Open Menu</Menu.Trigger>
 *
 * <Menu.Trigger asChild>
 *   <button className="custom-button">Custom Trigger</button>
 * </Menu.Trigger>
 * ```
 */
export const MenuTrigger = forwardRef<HTMLButtonElement, MenuTriggerProps>(
  ({ children, asChild = false, onClick, onKeyDown, ...restProps }, ref) => {
    const { behavior } = useMenuContext("Menu.Trigger");
    const internalRef = useRef<HTMLButtonElement>(null);

    // Register trigger element with behavior
    useEffect(() => {
      const element = internalRef.current;
      behavior.setTriggerElement(element);
      return () => {
        behavior.setTriggerElement(null);
      };
    }, [behavior]);

    // Handle click to toggle menu
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        behavior.toggle();
        onClick?.(event);
      },
      [behavior, onClick]
    );

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        behavior.handleTriggerKeyDown(event.nativeEvent);
        onKeyDown?.(event);
      },
      [behavior, onKeyDown]
    );

    // Get trigger props from behavior
    const triggerProps = behavior.getTriggerProps();

    const Component = asChild ? Slot : "button";

    // Merge refs
    const mergedRef = useCallback(
      (element: HTMLButtonElement | null) => {
        (internalRef as React.MutableRefObject<HTMLButtonElement | null>).current = element;
        if (typeof ref === "function") {
          ref(element);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current = element;
        }
      },
      [ref]
    );

    return (
      <Component
        ref={mergedRef}
        type={asChild ? undefined : "button"}
        id={triggerProps.id}
        aria-haspopup={triggerProps["aria-haspopup"]}
        aria-expanded={triggerProps["aria-expanded"]}
        aria-controls={triggerProps["aria-controls"]}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...restProps}
      >
        {children}
      </Component>
    );
  }
);

MenuTrigger.displayName = "Menu.Trigger";
