/**
 * Select Trigger component - opens the select when activated.
 */

import { type ButtonHTMLAttributes, type ReactNode, forwardRef, useCallback, useRef } from "react";
import { Slot } from "../../primitives/slot.js";
import { useSelectContext } from "./select-context.js";

export interface SelectTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Trigger content */
  children?: ReactNode;
  /** Render as child element (polymorphic) */
  asChild?: boolean;
}

/**
 * Trigger button that opens the select.
 * Supports asChild for custom trigger elements.
 *
 * @example
 * ```tsx
 * <Select.Trigger>Select a fruit</Select.Trigger>
 *
 * <Select.Trigger asChild>
 *   <button className="custom-button">Custom Trigger</button>
 * </Select.Trigger>
 * ```
 */
export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ children, asChild = false, onClick, onKeyDown, ...restProps }, ref) => {
    const { behavior, open, setOpen, value, highlightedValue } = useSelectContext("Select.Trigger");
    const internalRef = useRef<HTMLButtonElement>(null);

    // Handle click to toggle select
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
        switch (event.key) {
          case "Enter":
          case " ":
            event.preventDefault();
            behavior.toggle();
            break;
          case "ArrowDown":
            event.preventDefault();
            if (!open) {
              behavior.open();
              behavior.highlightFirst();
            }
            break;
          case "ArrowUp":
            event.preventDefault();
            if (!open) {
              behavior.open();
              behavior.highlightLast();
            }
            break;
        }
        onKeyDown?.(event);
      },
      [behavior, open, onKeyDown]
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
        role={triggerProps.role}
        aria-haspopup={triggerProps["aria-haspopup"]}
        aria-expanded={open}
        aria-controls={behavior.contentId}
        aria-activedescendant={
          open && highlightedValue ? `select-option-${highlightedValue}` : undefined
        }
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        data-state={open ? "open" : "closed"}
        {...restProps}
      >
        {children}
      </Component>
    );
  }
);

SelectTrigger.displayName = "Select.Trigger";
