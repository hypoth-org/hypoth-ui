"use client";

import { forwardRef, createElement, useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import "@ds/wc";

export type ListSelectionMode = "single" | "multiple" | "none";
export type ListOrientation = "vertical" | "horizontal";
export type ListSize = "default" | "compact" | "spacious";

export interface ListRootProps extends HTMLAttributes<HTMLElement> {
  /**
   * Selection mode.
   * @default "single"
   */
  selectionMode?: ListSelectionMode;

  /**
   * List orientation.
   * @default "vertical"
   */
  orientation?: ListOrientation;

  /**
   * Size variant.
   * @default "default"
   */
  size?: ListSize;

  /**
   * Show border around list.
   * @default false
   */
  bordered?: boolean;

  /**
   * Accessible label.
   * @default "List"
   */
  label?: string;

  /**
   * Callback when selection changes.
   */
  onSelectionChange?: (selectedItems: string[]) => void;

  /**
   * List content (ListItem elements).
   */
  children?: ReactNode;
}

/**
 * List root component for collection display.
 */
export const ListRoot = forwardRef<HTMLElement, ListRootProps>(function ListRoot(
  {
    selectionMode = "single",
    orientation = "vertical",
    size = "default",
    bordered = false,
    label = "List",
    onSelectionChange,
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

    const handleSelectionChange = (e: Event) => {
      const event = e as CustomEvent<{ selectedItems: string[] }>;
      onSelectionChange?.(event.detail.selectedItems);
    };

    element.addEventListener("ds:selection-change", handleSelectionChange);
    return () => element.removeEventListener("ds:selection-change", handleSelectionChange);
  }, [onSelectionChange]);

  return createElement(
    "ds-list",
    {
      ref: internalRef,
      "selection-mode": selectionMode,
      orientation,
      size,
      bordered: bordered || undefined,
      label,
      class: className,
      ...props,
    },
    children
  );
});
