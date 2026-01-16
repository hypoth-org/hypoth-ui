/**
 * Breadcrumb compound component exports.
 *
 * @example
 * ```tsx
 * import { Breadcrumb } from "@ds/react";
 *
 * <Breadcrumb.Root>
 *   <Breadcrumb.List>
 *     <Breadcrumb.Item>
 *       <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
 *     </Breadcrumb.Item>
 *     <Breadcrumb.Separator />
 *     <Breadcrumb.Item>
 *       <Breadcrumb.Page>Current</Breadcrumb.Page>
 *     </Breadcrumb.Item>
 *   </Breadcrumb.List>
 * </Breadcrumb.Root>
 * ```
 */

import {
  type HTMLAttributes,
  type ReactNode,
  createElement,
  forwardRef,
  useEffect,
  useRef,
} from "react";

// ============================================================================
// Types
// ============================================================================

export interface BreadcrumbRootProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface BreadcrumbListProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface BreadcrumbItemProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface BreadcrumbLinkProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  href?: string;
  onNavigate?: (href: string) => void;
}

export interface BreadcrumbPageProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface BreadcrumbSeparatorProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

// ============================================================================
// Components
// ============================================================================

const BreadcrumbRoot = forwardRef<HTMLElement, BreadcrumbRootProps>(function BreadcrumbRoot(
  { children, className, ...props },
  ref
) {
  return createElement("ds-breadcrumb", { ref, class: className, ...props }, children);
});
BreadcrumbRoot.displayName = "Breadcrumb.Root";

const BreadcrumbList = forwardRef<HTMLElement, BreadcrumbListProps>(function BreadcrumbList(
  { children, className, ...props },
  ref
) {
  return createElement("ds-breadcrumb-list", { ref, class: className, ...props }, children);
});
BreadcrumbList.displayName = "Breadcrumb.List";

const BreadcrumbItem = forwardRef<HTMLElement, BreadcrumbItemProps>(function BreadcrumbItem(
  { children, className, ...props },
  ref
) {
  return createElement("ds-breadcrumb-item", { ref, class: className, ...props }, children);
});
BreadcrumbItem.displayName = "Breadcrumb.Item";

const BreadcrumbLink = forwardRef<HTMLElement, BreadcrumbLinkProps>(function BreadcrumbLink(
  { children, className, href, onNavigate, ...props },
  ref
) {
  const elementRef = useRef<HTMLElement>(null);

  const combinedRef = (node: HTMLElement | null) => {
    (elementRef as React.MutableRefObject<HTMLElement | null>).current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !onNavigate) return;

    const handleNavigate = (event: Event) => {
      event.preventDefault();
      const e = event as CustomEvent<{ href: string }>;
      onNavigate(e.detail.href);
    };
    element.addEventListener("ds:navigate", handleNavigate);
    return () => element.removeEventListener("ds:navigate", handleNavigate);
  }, [onNavigate]);

  return createElement(
    "ds-breadcrumb-link",
    { ref: combinedRef, class: className, href, ...props },
    children
  );
});
BreadcrumbLink.displayName = "Breadcrumb.Link";

const BreadcrumbPage = forwardRef<HTMLElement, BreadcrumbPageProps>(function BreadcrumbPage(
  { children, className, ...props },
  ref
) {
  return createElement("ds-breadcrumb-page", { ref, class: className, ...props }, children);
});
BreadcrumbPage.displayName = "Breadcrumb.Page";

const BreadcrumbSeparator = forwardRef<HTMLElement, BreadcrumbSeparatorProps>(
  function BreadcrumbSeparator({ children, className, ...props }, ref) {
    return createElement("ds-breadcrumb-separator", { ref, class: className, ...props }, children);
  }
);
BreadcrumbSeparator.displayName = "Breadcrumb.Separator";

// ============================================================================
// Compound Component
// ============================================================================

export const Breadcrumb = {
  Root: BreadcrumbRoot,
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Page: BreadcrumbPage,
  Separator: BreadcrumbSeparator,
};

export {
  BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
