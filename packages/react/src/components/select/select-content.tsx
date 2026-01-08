/**
 * Select Content component - container for select options.
 */

import {
  type AnchorPosition,
  type DismissableLayer,
  type RovingFocus,
  type TypeAhead,
  createAnchorPosition,
  createDismissableLayer,
  createRovingFocus,
  createTypeAhead,
} from "@ds/primitives-dom";
import {
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useSelectContext } from "./select-context.js";

export interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Content container */
  children?: ReactNode;
  /** Optional label for accessibility */
  "aria-label"?: string;
}

/**
 * Container for select options.
 * Handles positioning, dismiss behavior, and keyboard navigation.
 *
 * @example
 * ```tsx
 * <Select.Content>
 *   <Select.Option value="apple">Apple</Select.Option>
 *   <Select.Option value="banana">Banana</Select.Option>
 * </Select.Content>
 * ```
 */
export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  ({ children, className, onKeyDown, ...restProps }, ref) => {
    const { behavior, open, setOpen, highlightedValue, setHighlightedValue, value } =
      useSelectContext("Select.Content");
    const internalRef = useRef<HTMLDivElement>(null);

    // Behavior instances
    const anchorPositionRef = useRef<AnchorPosition | null>(null);
    const dismissLayerRef = useRef<DismissableLayer | null>(null);
    const rovingFocusRef = useRef<RovingFocus | null>(null);
    const typeAheadRef = useRef<TypeAhead | null>(null);
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

      // Find trigger element (previous sibling or parent context)
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

      // Setup roving focus
      rovingFocusRef.current = createRovingFocus({
        container: content,
        selector: '[role="option"]:not([aria-disabled="true"])',
        direction: "vertical",
        loop: true,
        skipDisabled: true,
      });

      // Setup type-ahead
      typeAheadRef.current = createTypeAhead({
        items: () =>
          Array.from(
            content.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])')
          ),
        getText: (item) => item.textContent?.trim() || "",
        onMatch: (item) => {
          const optionValue = item.getAttribute("data-value");
          if (optionValue) {
            behavior.highlight(optionValue);
            setHighlightedValue(optionValue);
            item.scrollIntoView({ block: "nearest" });
          }
        },
      });

      // Focus on current or first option
      requestAnimationFrame(() => {
        const options = content.querySelectorAll<HTMLElement>(
          '[role="option"]:not([aria-disabled="true"])'
        );
        if (options.length === 0) return;

        // Find current value or highlight first
        let initialIndex = 0;
        if (value) {
          const selectedIndex = Array.from(options).findIndex(
            (opt) => opt.getAttribute("data-value") === value
          );
          if (selectedIndex >= 0) {
            initialIndex = selectedIndex;
          }
        }

        const initialOption = options[initialIndex];
        if (initialOption) {
          const optionValue = initialOption.getAttribute("data-value");
          if (optionValue) {
            behavior.highlight(optionValue);
            setHighlightedValue(optionValue);
          }
          rovingFocusRef.current?.setFocusedIndex(initialIndex);
          initialOption.scrollIntoView({ block: "nearest" });
        }
      });

      // Cleanup
      return () => {
        anchorPositionRef.current?.destroy();
        anchorPositionRef.current = null;
        dismissLayerRef.current?.deactivate();
        dismissLayerRef.current = null;
        rovingFocusRef.current?.destroy();
        rovingFocusRef.current = null;
        typeAheadRef.current?.reset();
        typeAheadRef.current = null;
      };
    }, [open, behavior, setOpen, setHighlightedValue, value]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        // Let type-ahead handle character keys
        typeAheadRef.current?.handleKeyDown(event.nativeEvent);

        switch (event.key) {
          case "Enter":
          case " ":
            event.preventDefault();
            if (highlightedValue) {
              behavior.select(highlightedValue);
            }
            break;
          case "Escape":
            event.preventDefault();
            setOpen(false);
            triggerRef.current?.focus();
            break;
          case "ArrowDown":
            event.preventDefault();
            behavior.highlightNext();
            setHighlightedValue(behavior.state.highlightedValue);
            break;
          case "ArrowUp":
            event.preventDefault();
            behavior.highlightPrev();
            setHighlightedValue(behavior.state.highlightedValue);
            break;
          case "Home":
            event.preventDefault();
            behavior.highlightFirst();
            setHighlightedValue(behavior.state.highlightedValue);
            break;
          case "End":
            event.preventDefault();
            behavior.highlightLast();
            setHighlightedValue(behavior.state.highlightedValue);
            break;
          case "Tab":
            // Close on tab without preventing default
            setOpen(false);
            break;
        }

        onKeyDown?.(event);
      },
      [behavior, highlightedValue, setOpen, setHighlightedValue, onKeyDown]
    );

    // Don't render if not open
    if (!open) return null;

    const contentProps = behavior.getContentProps();

    return (
      <div
        ref={mergedRef}
        role={contentProps.role}
        id={contentProps.id}
        className={className}
        onKeyDown={handleKeyDown}
        data-state="open"
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

SelectContent.displayName = "Select.Content";
