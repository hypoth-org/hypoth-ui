/**
 * DatePicker Content component - container for the calendar.
 */

import {
  type AnchorPosition,
  type DismissableLayer,
  createAnchorPosition,
  createDismissableLayer,
} from "@ds/primitives-dom";
import {
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useDatePickerContext } from "./date-picker-context.js";

export interface DatePickerContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Content */
  children?: ReactNode;
}

/**
 * Container for the date picker calendar.
 * Handles positioning and dismiss behavior.
 *
 * @example
 * ```tsx
 * <DatePicker.Content>
 *   <DatePicker.Calendar />
 * </DatePicker.Content>
 * ```
 */
export const DatePickerContent = forwardRef<HTMLDivElement, DatePickerContentProps>(
  ({ children, className, ...restProps }, ref) => {
    const { open, setOpen } = useDatePickerContext("DatePicker.Content");
    const internalRef = useRef<HTMLDivElement>(null);

    // Behavior instances
    const anchorPositionRef = useRef<AnchorPosition | null>(null);
    const dismissLayerRef = useRef<DismissableLayer | null>(null);
    const triggerRef = useRef<HTMLElement | null>(null);

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

    // Setup and cleanup behaviors when open changes
    useEffect(() => {
      const content = internalRef.current;
      if (!content || !open) return;

      // Find trigger element
      const trigger = content.previousElementSibling as HTMLElement;
      triggerRef.current = trigger;

      // Setup anchor positioning
      if (trigger) {
        anchorPositionRef.current = createAnchorPosition({
          anchor: trigger,
          floating: content,
          placement: "bottom-start",
          offset: 4,
          flip: true,
          onPositionChange: (pos) => {
            content.setAttribute("data-placement", pos.placement);
          },
        });
      }

      // Setup dismiss layer
      dismissLayerRef.current = createDismissableLayer({
        container: content,
        excludeElements: trigger ? [trigger] : [],
        onDismiss: () => setOpen(false),
        closeOnEscape: true,
        closeOnOutsideClick: true,
      });
      dismissLayerRef.current.activate();

      // Cleanup
      return () => {
        anchorPositionRef.current?.destroy();
        anchorPositionRef.current = null;
        dismissLayerRef.current?.deactivate();
        dismissLayerRef.current = null;
      };
    }, [open, setOpen]);

    // Don't render if not open
    if (!open) return null;

    return (
      <div
        ref={mergedRef}
        role="dialog"
        aria-modal="true"
        aria-label="Choose date"
        className={className}
        data-state="open"
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

DatePickerContent.displayName = "DatePicker.Content";
