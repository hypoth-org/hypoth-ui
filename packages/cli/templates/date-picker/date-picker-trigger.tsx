/**
 * DatePicker Trigger component - opens the calendar when activated.
 */

import { type ButtonHTMLAttributes, type ReactNode, forwardRef, useCallback, useRef } from "react";
import { Slot } from "@/lib/primitives/slot.js";
import { useDatePickerContext } from "./date-picker-context.js";

export interface DatePickerTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Trigger content */
  children?: ReactNode;
  /** Render as child element (polymorphic) */
  asChild?: boolean;
}

/**
 * Trigger button that opens the date picker calendar.
 *
 * @example
 * ```tsx
 * <DatePicker.Trigger>Select date</DatePicker.Trigger>
 *
 * <DatePicker.Trigger asChild>
 *   <button className="custom-button">Pick a date</button>
 * </DatePicker.Trigger>
 * ```
 */
export const DatePickerTrigger = forwardRef<HTMLButtonElement, DatePickerTriggerProps>(
  ({ children, asChild = false, onClick, onKeyDown, ...restProps }, ref) => {
    const { behavior, open, setOpen: _setOpen } = useDatePickerContext("DatePicker.Trigger");
    const internalRef = useRef<HTMLButtonElement>(null);

    // Handle click to toggle
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        behavior.toggle();
        onClick?.(event);
      },
      [behavior, onClick]
    );

    // Handle keyboard
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
            }
            break;
        }
        onKeyDown?.(event);
      },
      [behavior, open, onKeyDown]
    );

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
        aria-haspopup="dialog"
        aria-expanded={open}
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

DatePickerTrigger.displayName = "DatePicker.Trigger";
