"use client";

/**
 * Portal React Component
 *
 * Renders children into a DOM node outside the parent component hierarchy.
 * Useful for modals, tooltips, dropdowns, and other overlay patterns.
 */

import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  /** Content to render in the portal */
  children: ReactNode;
  /** Container element to render into (defaults to document.body) */
  container?: Element | null;
  /** CSS selector for container element (alternative to container prop) */
  containerSelector?: string;
  /** Whether the portal is disabled (renders children in place) */
  disabled?: boolean;
}

/**
 * Get the portal container element
 */
function getContainer(
  container?: Element | null,
  containerSelector?: string
): Element | null {
  if (typeof document === "undefined") return null;

  if (container) return container;

  if (containerSelector) {
    return document.querySelector(containerSelector);
  }

  return document.body;
}

/**
 * Portal component for rendering content outside the normal React tree.
 *
 * @example
 * ```tsx
 * // Basic usage - renders to document.body
 * <Portal>
 *   <div className="modal">Modal content</div>
 * </Portal>
 *
 * // Custom container
 * <Portal container={document.getElementById('portal-root')}>
 *   <div className="dropdown">Dropdown content</div>
 * </Portal>
 *
 * // Using selector
 * <Portal containerSelector="#portal-root">
 *   <div>Content</div>
 * </Portal>
 *
 * // Disabled portal (renders in place)
 * <Portal disabled>
 *   <div>Renders here instead</div>
 * </Portal>
 * ```
 */
export function Portal({
  children,
  container,
  containerSelector,
  disabled = false,
}: PortalProps): ReactNode {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // If disabled or not mounted (SSR), render children in place
  if (disabled || !mounted) {
    return <>{children}</>;
  }

  const portalContainer = getContainer(container, containerSelector);

  // If no container found, render in place
  if (!portalContainer) {
    return <>{children}</>;
  }

  return createPortal(children, portalContainer);
}

Portal.displayName = "Portal";
