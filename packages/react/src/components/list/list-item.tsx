"use client";

import {
  type HTMLAttributes,
  type ReactNode,
  createElement,
  forwardRef,
  useEffect,
  useRef,
} from "react";
import "@ds/wc";

export interface ListItemProps extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  /**
   * Unique item ID.
   */
  itemId?: string;

  /**
   * Whether item is selected.
   * @default false
   */
  selected?: boolean;

  /**
   * Whether item is disabled.
   * @default false
   */
  disabled?: boolean;

  /**
   * Value for identification.
   */
  value?: string;

  /**
   * Callback when item is selected.
   */
  onItemSelect?: (itemId: string, value: string, selected: boolean) => void;

  /**
   * Callback when item is activated (Enter/double-click).
   */
  onActivate?: (itemId: string, value: string) => void;

  /**
   * Item content.
   */
  children?: ReactNode;
}

/**
 * List item component for collection items.
 */
export const ListItem = forwardRef<HTMLElement, ListItemProps>(function ListItem(
  {
    itemId,
    selected = false,
    disabled = false,
    value,
    onItemSelect,
    onActivate,
    children,
    className,
    ...props
  },
  forwardedRef
) {
  const internalRef = useRef<HTMLElement>(null);

  // Sync forwarded ref
  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = internalRef.current;
    }
  }, [forwardedRef]);

  // Set up event listeners
  useEffect(() => {
    const element = internalRef.current;
    if (!element) return;

    const handleSelect = (e: Event) => {
      const event = e as CustomEvent<{ itemId: string; value: string; selected: boolean }>;
      onItemSelect?.(event.detail.itemId, event.detail.value, event.detail.selected);
    };

    const handleActivate = (e: Event) => {
      const event = e as CustomEvent<{ itemId: string; value: string }>;
      onActivate?.(event.detail.itemId, event.detail.value);
    };

    element.addEventListener("ds:select", handleSelect);
    element.addEventListener("ds:activate", handleActivate);

    return () => {
      element.removeEventListener("ds:select", handleSelect);
      element.removeEventListener("ds:activate", handleActivate);
    };
  }, [onItemSelect, onActivate]);

  return createElement(
    "ds-list-item",
    {
      ref: internalRef,
      "item-id": itemId,
      selected: selected || undefined,
      disabled: disabled || undefined,
      value,
      class: className,
      ...props,
    },
    children
  );
});
