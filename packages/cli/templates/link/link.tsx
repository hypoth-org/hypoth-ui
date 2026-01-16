import type { AnchorHTMLAttributes, ReactNode } from "react";
import { createElement, forwardRef, useCallback, useEffect, useRef } from "react";
import { Slot } from "../primitives/slot.js";
import type { DsNavigateEventDetail, NavigateEventHandler } from "../types/events.js";
import type { AsChildProps } from "../types/polymorphic.js";
import { mergeClassNames } from "../utils/merge-props.js";

export type LinkVariant = "default" | "muted" | "underline";

export interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
    AsChildProps {
  /** Target URL */
  href: string;
  /** Whether the link opens in a new tab */
  external?: boolean;
  /** Visual variant */
  variant?: LinkVariant;
  /** Handler for ds:navigate event. Can prevent default navigation. */
  onNavigate?: NavigateEventHandler;
  /** Link content */
  children?: ReactNode;
}

/**
 * React wrapper for ds-link Web Component.
 * Provides type-safe props and onNavigate event handler.
 * Supports asChild for Next.js Link integration.
 */
export const Link = forwardRef<HTMLElement, LinkProps>((props, forwardedRef) => {
  const {
    href,
    external = false,
    variant = "default",
    onNavigate,
    asChild = false,
    children,
    className,
    ...rest
  } = props;

  const internalRef = useRef<HTMLElement>(null);

  // Store handler in ref for stable callback reference
  const onNavigateRef = useRef(onNavigate);
  onNavigateRef.current = onNavigate;

  // Merge refs
  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = internalRef.current;
    }
  }, [forwardedRef]);

  // Stable handler that reads from ref
  const handleNavigate = useCallback((event: Event) => {
    onNavigateRef.current?.(event as CustomEvent<DsNavigateEventDetail>);
  }, []);

  // Attach ds:navigate event listener - no handler deps needed
  useEffect(() => {
    const element = internalRef.current;
    if (!element) return;

    element.addEventListener("ds:navigate", handleNavigate);
    return () => element.removeEventListener("ds:navigate", handleNavigate);
  }, [handleNavigate]);

  // asChild mode: render child with link styling classes
  if (asChild) {
    const linkClasses = mergeClassNames(
      "ds-link",
      `ds-link--${variant}`,
      external && "ds-link--external",
      className
    );

    return createElement(
      Slot,
      {
        ref: internalRef,
        className: linkClasses,
        ...rest,
      },
      children
    );
  }

  // Default mode: render ds-link Web Component
  return createElement(
    "ds-link",
    {
      ref: internalRef,
      href,
      external: external || undefined,
      variant,
      class: className,
      ...rest,
    },
    children
  );
});

Link.displayName = "Link";

// Re-export event types for convenience
export type { DsNavigateEventDetail, NavigateEventHandler };
