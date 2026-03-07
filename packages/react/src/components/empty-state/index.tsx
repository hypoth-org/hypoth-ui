"use client";

import { type HTMLAttributes, type ReactNode, createElement, forwardRef } from "react";

// ============================================================================
// Types
// ============================================================================

export interface EmptyStateProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface EmptyStateIconProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface EmptyStateTitleProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface EmptyStateDescriptionProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface EmptyStateActionProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

// ============================================================================
// Components
// ============================================================================

/**
 * EmptyState root — centered container for empty state messaging.
 * Renders as `<section role="status">` for live region semantics.
 */
const EmptyStateRoot = forwardRef<HTMLElement, EmptyStateProps>(function EmptyStateRoot(
  { children, className, ...props },
  ref
) {
  return createElement(
    "section",
    { ref, role: "status", className: className ? `ds-empty-state ${className}` : "ds-empty-state", ...props },
    children
  );
});
EmptyStateRoot.displayName = "EmptyState";

/**
 * EmptyState icon — decorative icon container, hidden from assistive technology.
 */
const EmptyStateIcon = forwardRef<HTMLDivElement, EmptyStateIconProps>(function EmptyStateIcon(
  { children, className, ...props },
  ref
) {
  return createElement(
    "div",
    { ref, "aria-hidden": "true", className: className ? `ds-empty-state-icon ${className}` : "ds-empty-state-icon", ...props },
    children
  );
});
EmptyStateIcon.displayName = "EmptyState.Icon";

/**
 * EmptyState title — heading text for the empty state.
 */
const EmptyStateTitle = forwardRef<HTMLHeadingElement, EmptyStateTitleProps>(function EmptyStateTitle(
  { children, className, ...props },
  ref
) {
  return createElement(
    "h3",
    { ref, className: className ? `ds-empty-state-title ${className}` : "ds-empty-state-title", ...props },
    children
  );
});
EmptyStateTitle.displayName = "EmptyState.Title";

/**
 * EmptyState description — body text with muted color.
 */
const EmptyStateDescription = forwardRef<HTMLParagraphElement, EmptyStateDescriptionProps>(
  function EmptyStateDescription({ children, className, ...props }, ref) {
    return createElement(
      "p",
      { ref, className: className ? `ds-empty-state-description ${className}` : "ds-empty-state-description", ...props },
      children
    );
  }
);
EmptyStateDescription.displayName = "EmptyState.Description";

/**
 * EmptyState action — container for CTA buttons or links.
 */
const EmptyStateAction = forwardRef<HTMLDivElement, EmptyStateActionProps>(function EmptyStateAction(
  { children, className, ...props },
  ref
) {
  return createElement(
    "div",
    { ref, className: className ? `ds-empty-state-action ${className}` : "ds-empty-state-action", ...props },
    children
  );
});
EmptyStateAction.displayName = "EmptyState.Action";

// ============================================================================
// Compound Component
// ============================================================================

export const EmptyState = Object.assign(EmptyStateRoot, {
  Icon: EmptyStateIcon,
  Title: EmptyStateTitle,
  Description: EmptyStateDescription,
  Action: EmptyStateAction,
});

export { EmptyStateRoot, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription, EmptyStateAction };
