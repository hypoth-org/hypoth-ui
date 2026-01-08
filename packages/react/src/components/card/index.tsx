/**
 * Card compound component exports.
 *
 * @example
 * ```tsx
 * import { Card } from "@ds/react";
 *
 * <Card.Root>
 *   <Card.Header>
 *     <h3>Card Title</h3>
 *   </Card.Header>
 *   <Card.Content>
 *     <p>Card content goes here.</p>
 *   </Card.Content>
 *   <Card.Footer>
 *     <Button>Action</Button>
 *   </Card.Footer>
 * </Card.Root>
 * ```
 */

import { type HTMLAttributes, type ReactNode, createElement, forwardRef } from "react";

// ============================================================================
// Types
// ============================================================================

export interface CardRootProps extends HTMLAttributes<HTMLElement> {
  /** Card content */
  children?: ReactNode;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLElement> {
  /** Header content */
  children?: ReactNode;
}

export interface CardContentProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLElement> {
  /** Footer content */
  children?: ReactNode;
}

// ============================================================================
// Components
// ============================================================================

/**
 * Card root component - container for grouping related content.
 */
const CardRoot = forwardRef<HTMLElement, CardRootProps>(function CardRoot(
  { children, className, ...props },
  ref
) {
  return createElement("ds-card", { ref, class: className, ...props }, children);
});
CardRoot.displayName = "Card.Root";

/**
 * Card header component - header section for Card.
 */
const CardHeader = forwardRef<HTMLElement, CardHeaderProps>(function CardHeader(
  { children, className, ...props },
  ref
) {
  return createElement("ds-card-header", { ref, class: className, ...props }, children);
});
CardHeader.displayName = "Card.Header";

/**
 * Card content component - main content section for Card.
 */
const CardContent = forwardRef<HTMLElement, CardContentProps>(function CardContent(
  { children, className, ...props },
  ref
) {
  return createElement("ds-card-content", { ref, class: className, ...props }, children);
});
CardContent.displayName = "Card.Content";

/**
 * Card footer component - footer section for Card.
 */
const CardFooter = forwardRef<HTMLElement, CardFooterProps>(function CardFooter(
  { children, className, ...props },
  ref
) {
  return createElement("ds-card-footer", { ref, class: className, ...props }, children);
});
CardFooter.displayName = "Card.Footer";

// ============================================================================
// Compound Component
// ============================================================================

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter,
};

// Also export individual components
export { CardRoot, CardHeader, CardContent, CardFooter };
