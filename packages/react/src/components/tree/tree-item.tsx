"use client";

import { forwardRef, createElement, useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import "@ds/wc";

export interface TreeItemProps extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  /**
   * Unique item ID.
   */
  itemId?: string;

  /**
   * Whether item is expanded.
   * @default false
   */
  expanded?: boolean;

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
   * Callback when expand state changes.
   */
  onExpand?: (itemId: string, expanded: boolean) => void;

  /**
   * Callback when item is selected.
   */
  onItemSelect?: (itemId: string, selected: boolean) => void;

  /**
   * Callback when item is activated (Enter/double-click).
   */
  onActivate?: (itemId: string) => void;

  /**
   * Item label content.
   */
  children?: ReactNode;
}

/**
 * Tree item component for hierarchical nodes.
 */
export const TreeItem = forwardRef<HTMLElement, TreeItemProps>(function TreeItem(
  {
    itemId,
    expanded = false,
    selected = false,
    disabled = false,
    onExpand,
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

    const handleExpand = (e: Event) => {
      const event = e as CustomEvent<{ itemId: string; expanded: boolean }>;
      onExpand?.(event.detail.itemId, event.detail.expanded);
    };

    const handleSelect = (e: Event) => {
      const event = e as CustomEvent<{ itemId: string; selected: boolean }>;
      onItemSelect?.(event.detail.itemId, event.detail.selected);
    };

    const handleActivate = (e: Event) => {
      const event = e as CustomEvent<{ itemId: string }>;
      onActivate?.(event.detail.itemId);
    };

    element.addEventListener("ds:expand", handleExpand);
    element.addEventListener("ds:select", handleSelect);
    element.addEventListener("ds:activate", handleActivate);

    return () => {
      element.removeEventListener("ds:expand", handleExpand);
      element.removeEventListener("ds:select", handleSelect);
      element.removeEventListener("ds:activate", handleActivate);
    };
  }, [onExpand, onItemSelect, onActivate]);

  return createElement(
    "ds-tree-item",
    {
      ref: internalRef,
      "item-id": itemId,
      expanded: expanded || undefined,
      selected: selected || undefined,
      disabled: disabled || undefined,
      class: className,
      ...props,
    },
    children
  );
});
