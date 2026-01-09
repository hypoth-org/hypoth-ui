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

export type TreeSelectionMode = "single" | "multiple" | "none";
export type TreeSize = "default" | "compact";

export interface TreeRootProps extends HTMLAttributes<HTMLElement> {
  /**
   * Selection mode.
   * @default "single"
   */
  selectionMode?: TreeSelectionMode;

  /**
   * Size variant.
   * @default "default"
   */
  size?: TreeSize;

  /**
   * Show connecting lines.
   * @default false
   */
  lines?: boolean;

  /**
   * Accessible label.
   * @default "Tree"
   */
  label?: string;

  /**
   * Whether the tree is in a loading state.
   * When true, sets aria-busy and disables keyboard navigation.
   * @default false
   */
  loading?: boolean;

  /**
   * Text to display/announce during loading.
   * @default "Loading..."
   */
  loadingText?: string;

  /**
   * Node IDs that are currently loading children.
   * Allows for node-level loading indicators.
   */
  loadingNodes?: string[];

  /**
   * Callback when selection changes.
   */
  onSelectionChange?: (selectedItems: string[]) => void;

  /**
   * Tree content (TreeItem elements).
   */
  children?: ReactNode;
}

/**
 * Tree root component for hierarchical data display.
 */
export const TreeRoot = forwardRef<HTMLElement, TreeRootProps>(function TreeRoot(
  {
    selectionMode = "single",
    size = "default",
    lines = false,
    label = "Tree",
    loading = false,
    loadingText = "Loading...",
    loadingNodes,
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

  // Sync loadingNodes as a property (cannot be set via attribute)
  useEffect(() => {
    const element = internalRef.current as HTMLElement & { loadingNodes?: Set<string> | string[] } | null;
    if (element && loadingNodes !== undefined) {
      element.loadingNodes = loadingNodes;
    }
  }, [loadingNodes]);

  return createElement(
    "ds-tree",
    {
      ref: internalRef,
      "selection-mode": selectionMode,
      size,
      lines: lines || undefined,
      label,
      loading: loading || undefined,
      "loading-text": loadingText,
      class: className,
      ...props,
    },
    children
  );
});
