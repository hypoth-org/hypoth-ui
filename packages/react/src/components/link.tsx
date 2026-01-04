import type { AnchorHTMLAttributes, ReactNode } from "react";
import { createElement, forwardRef, useEffect, useRef } from "react";
import type {
  DsNavigateEventDetail,
  NavigateEventHandler,
} from "../types/events.js";
import type { AsChildProps } from "../types/polymorphic.js";
import { Slot } from "../primitives/slot.js";
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

  // Merge refs
  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current =
        internalRef.current;
    }
  }, [forwardedRef]);

  // Attach ds:navigate event listener
  useEffect(() => {
    const element = internalRef.current;
    if (!element || !onNavigate) return;

    const handler = (event: Event) => {
      onNavigate(event as CustomEvent<DsNavigateEventDetail>);
    };

    element.addEventListener("ds:navigate", handler);
    return () => element.removeEventListener("ds:navigate", handler);
  }, [onNavigate]);

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
