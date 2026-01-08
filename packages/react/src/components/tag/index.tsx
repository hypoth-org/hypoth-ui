"use client";

import { forwardRef, createElement, useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import "@ds/wc";

export type TagVariant =
  | "neutral"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";
export type TagSize = "sm" | "md" | "lg";

export interface TagProps extends HTMLAttributes<HTMLElement> {
  /**
   * Color variant.
   * @default "neutral"
   */
  variant?: TagVariant;

  /**
   * Size variant.
   * @default "md"
   */
  size?: TagSize;

  /**
   * Use solid (filled) style instead of subtle.
   * @default false
   */
  solid?: boolean;

  /**
   * Show remove button.
   * @default false
   */
  removable?: boolean;

  /**
   * Make tag clickable/interactive.
   * @default false
   */
  clickable?: boolean;

  /**
   * Disable the tag.
   * @default false
   */
  disabled?: boolean;

  /**
   * Value for identification in events.
   */
  value?: string;

  /**
   * Callback when remove button is clicked.
   */
  onRemove?: (value: string) => void;

  /**
   * Tag content.
   */
  children?: ReactNode;
}

/**
 * Tag component for categorization with optional remove action.
 *
 * @example
 * ```tsx
 * // Basic tag
 * <Tag variant="primary">React</Tag>
 *
 * // Removable tag
 * <Tag removable onRemove={(value) => console.log('Removed:', value)} value="react">
 *   React
 * </Tag>
 *
 * // Clickable tag
 * <Tag clickable onClick={() => console.log('Clicked')}>
 *   Click me
 * </Tag>
 * ```
 */
export const Tag = forwardRef<HTMLElement, TagProps>(function Tag(
  {
    variant = "neutral",
    size = "md",
    solid = false,
    removable = false,
    clickable = false,
    disabled = false,
    value,
    onRemove,
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

    const handleRemove = (e: Event) => {
      const event = e as CustomEvent<{ value: string }>;
      onRemove?.(event.detail.value);
    };

    element.addEventListener("ds:remove", handleRemove);
    return () => element.removeEventListener("ds:remove", handleRemove);
  }, [onRemove]);

  return createElement(
    "ds-tag",
    {
      ref: internalRef,
      variant,
      size,
      solid: solid || undefined,
      removable: removable || undefined,
      clickable: clickable || undefined,
      disabled: disabled || undefined,
      value,
      class: className,
      ...props,
    },
    children
  );
});

// TypeScript declaration for JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ds-tag": TagProps & {
        ref?: React.Ref<HTMLElement>;
        "onDs-remove"?: (event: CustomEvent) => void;
        "onDs-click"?: (event: CustomEvent) => void;
      };
    }
  }
}
