/**
 * Combobox Content component - container for combobox options.
 */

import {
  type AnchorPosition,
  type DismissableLayer,
  type RovingFocus,
  createAnchorPosition,
  createDismissableLayer,
  createRovingFocus,
} from "@hypoth-ui/primitives-dom";
import {
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useComboboxContext } from "./combobox-context.js";

export interface ComboboxContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Content container */
  children?: ReactNode;
  /** Optional label for accessibility */
  "aria-label"?: string;
}

/**
 * Container for combobox options.
 * Handles positioning, dismiss behavior, and keyboard navigation.
 *
 * @example
 * ```tsx
 * <Combobox.Content>
 *   <Combobox.Option value="apple">Apple</Combobox.Option>
 *   <Combobox.Option value="banana">Banana</Combobox.Option>
 * </Combobox.Content>
 * ```
 */
export const ComboboxContent = forwardRef<HTMLDivElement, ComboboxContentProps>(
  ({ children, className, ...restProps }, ref) => {
    const { behavior, open, setOpen, loading } = useComboboxContext("Combobox.Content");
    const internalRef = useRef<HTMLDivElement>(null);

    // Behavior instances
    const anchorPositionRef = useRef<AnchorPosition | null>(null);
    const dismissLayerRef = useRef<DismissableLayer | null>(null);
    const rovingFocusRef = useRef<RovingFocus | null>(null);
    const inputRef = useRef<HTMLElement | null>(null);

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

      // Find input element (previous sibling or parent context)
      const input = content.previousElementSibling as HTMLElement;
      inputRef.current = input;

      // Setup anchor positioning
      if (input) {
        anchorPositionRef.current = createAnchorPosition({
          anchor: input,
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
        excludeElements: input ? [input] : [],
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

      // Cleanup
      return () => {
        anchorPositionRef.current?.destroy();
        anchorPositionRef.current = null;
        dismissLayerRef.current?.deactivate();
        dismissLayerRef.current = null;
        rovingFocusRef.current?.destroy();
        rovingFocusRef.current = null;
      };
    }, [open, setOpen]);

    // Don't render if not open
    if (!open) return null;

    const listboxProps = behavior.getListboxProps();

    return (
      <div
        ref={mergedRef}
        role={listboxProps.role}
        id={listboxProps.id}
        aria-multiselectable={listboxProps["aria-multiselectable"]}
        aria-busy={loading || undefined}
        className={className}
        data-state="open"
        {...restProps}
      >
        {children}
      </div>
    );
  }
);

ComboboxContent.displayName = "Combobox.Content";
