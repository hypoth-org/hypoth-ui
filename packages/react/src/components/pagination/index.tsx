/**
 * Pagination compound component exports.
 *
 * @example
 * ```tsx
 * import { Pagination } from "@ds/react";
 *
 * <Pagination.Root page={1} totalPages={10} onPageChange={(page) => console.log(page)}>
 *   <Pagination.Content>
 *     <Pagination.Previous />
 *     <Pagination.Item><Pagination.Link page={1}>1</Pagination.Link></Pagination.Item>
 *     <Pagination.Ellipsis />
 *     <Pagination.Next />
 *   </Pagination.Content>
 * </Pagination.Root>
 * ```
 */

import {
  type HTMLAttributes,
  type ReactNode,
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

// ============================================================================
// Types
// ============================================================================

export interface PaginationRootProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  page?: number;
  defaultPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export interface PaginationContentProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface PaginationItemProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface PaginationLinkProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  page: number;
  active?: boolean;
}

export interface PaginationPreviousProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  disabled?: boolean;
}

export interface PaginationNextProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  disabled?: boolean;
}

export interface PaginationEllipsisProps extends HTMLAttributes<HTMLElement> {}

// ============================================================================
// Components
// ============================================================================

const PaginationRoot = forwardRef<HTMLElement, PaginationRootProps>(function PaginationRoot(
  {
    children,
    className,
    page: controlledPage,
    defaultPage = 1,
    totalPages = 1,
    onPageChange,
    ...props
  },
  ref
) {
  const [internalPage, setInternalPage] = useState(defaultPage);
  const isControlled = controlledPage !== undefined;
  const page = isControlled ? controlledPage : internalPage;
  const elementRef = useRef<HTMLElement>(null);

  const combinedRef = (node: HTMLElement | null) => {
    (elementRef as React.MutableRefObject<HTMLElement | null>).current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
  };

  const handlePageChange = useCallback(
    (event: Event) => {
      const e = event as CustomEvent<{ page: number }>;
      if (!isControlled) setInternalPage(e.detail.page);
      onPageChange?.(e.detail.page);
    },
    [isControlled, onPageChange]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    element.addEventListener("ds:page-change", handlePageChange);
    return () => element.removeEventListener("ds:page-change", handlePageChange);
  }, [handlePageChange]);

  return createElement(
    "ds-pagination",
    { ref: combinedRef, class: className, page, "total-pages": totalPages, ...props },
    children
  );
});
PaginationRoot.displayName = "Pagination.Root";

const PaginationContent = forwardRef<HTMLElement, PaginationContentProps>(
  function PaginationContent({ children, className, ...props }, ref) {
    return createElement("ds-pagination-content", { ref, class: className, ...props }, children);
  }
);
PaginationContent.displayName = "Pagination.Content";

const PaginationItem = forwardRef<HTMLElement, PaginationItemProps>(function PaginationItem(
  { children, className, ...props },
  ref
) {
  return createElement("ds-pagination-item", { ref, class: className, ...props }, children);
});
PaginationItem.displayName = "Pagination.Item";

const PaginationLink = forwardRef<HTMLElement, PaginationLinkProps>(function PaginationLink(
  { children, className, page, active, ...props },
  ref
) {
  return createElement(
    "ds-pagination-link",
    { ref, class: className, page, active: active || undefined, ...props },
    children
  );
});
PaginationLink.displayName = "Pagination.Link";

const PaginationPrevious = forwardRef<HTMLElement, PaginationPreviousProps>(
  function PaginationPrevious({ children, className, disabled, ...props }, ref) {
    return createElement(
      "ds-pagination-previous",
      { ref, class: className, disabled: disabled || undefined, ...props },
      children
    );
  }
);
PaginationPrevious.displayName = "Pagination.Previous";

const PaginationNext = forwardRef<HTMLElement, PaginationNextProps>(function PaginationNext(
  { children, className, disabled, ...props },
  ref
) {
  return createElement(
    "ds-pagination-next",
    { ref, class: className, disabled: disabled || undefined, ...props },
    children
  );
});
PaginationNext.displayName = "Pagination.Next";

const PaginationEllipsis = forwardRef<HTMLElement, PaginationEllipsisProps>(
  function PaginationEllipsis({ className, ...props }, ref) {
    return createElement("ds-pagination-ellipsis", { ref, class: className, ...props });
  }
);
PaginationEllipsis.displayName = "Pagination.Ellipsis";

// ============================================================================
// Compound Component
// ============================================================================

export const Pagination = {
  Root: PaginationRoot,
  Content: PaginationContent,
  Item: PaginationItem,
  Link: PaginationLink,
  Previous: PaginationPrevious,
  Next: PaginationNext,
  Ellipsis: PaginationEllipsis,
};

export {
  PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
