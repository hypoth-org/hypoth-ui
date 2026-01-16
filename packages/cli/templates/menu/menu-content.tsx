/**
 * Menu Content component - the menu panel with items.
 */

import {
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { useMenuContext } from "./menu-context.js";

export interface MenuContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Menu content */
  children?: ReactNode;
  /** Container element for portal (defaults to document.body) */
  container?: HTMLElement | null;
  /** Force mount even when closed (for animations) */
  forceMount?: boolean;
}

/**
 * Menu content panel with roving focus and type-ahead.
 * Renders in a portal by default.
 *
 * @example
 * ```tsx
 * <Menu.Content>
 *   <Menu.Item value="edit">Edit</Menu.Item>
 *   <Menu.Item value="delete">Delete</Menu.Item>
 * </Menu.Content>
 * ```
 */
export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(
  ({ children, container, forceMount = false, onKeyDown, ...restProps }, ref) => {
    const { behavior, open } = useMenuContext("Menu.Content");
    const internalRef = useRef<HTMLDivElement>(null);

    // Register content element with behavior
    useEffect(() => {
      if (open) {
        const element = internalRef.current;
        behavior.setContentElement(element);
        return () => {
          behavior.setContentElement(null);
        };
      }
    }, [behavior, open]);

    // Handle keyboard events
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        behavior.handleContentKeyDown(event.nativeEvent);
        onKeyDown?.(event);
      },
      [behavior, onKeyDown]
    );

    // Get content props from behavior
    const contentProps = behavior.getContentProps();

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

    // Don't render if closed and not force mounted
    if (!open && !forceMount) {
      return null;
    }

    const content = (
      <div
        ref={mergedRef}
        id={contentProps.id}
        role={contentProps.role}
        aria-labelledby={contentProps["aria-labelledby"]}
        aria-orientation={contentProps["aria-orientation"]}
        tabIndex={contentProps.tabIndex}
        data-state={open ? "open" : "closed"}
        onKeyDown={handleKeyDown}
        {...restProps}
      >
        {children}
      </div>
    );

    // Render in portal
    const portalContainer = container ?? (typeof document !== "undefined" ? document.body : null);
    if (portalContainer) {
      return createPortal(content, portalContainer);
    }

    return content;
  }
);

MenuContent.displayName = "Menu.Content";
