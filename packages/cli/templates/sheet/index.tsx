/**
 * Sheet compound component exports.
 *
 * Sheet is a slide-in overlay panel from screen edges.
 *
 * @example
 * ```tsx
 * import { Sheet } from "@ds/react";
 *
 * <Sheet.Root>
 *   <Sheet.Trigger>
 *     <button>Open Settings</button>
 *   </Sheet.Trigger>
 *   <Sheet.Content side="right">
 *     <Sheet.Header>
 *       <Sheet.Title>Settings</Sheet.Title>
 *       <Sheet.Description>Adjust your preferences</Sheet.Description>
 *     </Sheet.Header>
 *     <div>Settings content...</div>
 *     <Sheet.Footer>
 *       <Sheet.Close>
 *         <button>Close</button>
 *       </Sheet.Close>
 *     </Sheet.Footer>
 *   </Sheet.Content>
 * </Sheet.Root>
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

export type SheetSide = "top" | "right" | "bottom" | "left";
export type SheetContentSize = "sm" | "md" | "lg" | "xl" | "full";

export interface SheetRootProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether Escape key closes the sheet */
  closeOnEscape?: boolean;
  /** Whether clicking the overlay closes the sheet */
  closeOnOverlay?: boolean;
  /** Whether to animate open/close transitions */
  animated?: boolean;
}

export interface SheetTriggerProps extends HTMLAttributes<HTMLElement> {
  /** Trigger content (typically a button) */
  children?: ReactNode;
}

export interface SheetContentProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
  /** Side of the screen the sheet appears from */
  side?: SheetSide;
  /** Size of the content */
  size?: SheetContentSize;
}

export interface SheetOverlayProps extends HTMLAttributes<HTMLElement> {}

export interface SheetHeaderProps extends HTMLAttributes<HTMLElement> {
  /** Header content */
  children?: ReactNode;
}

export interface SheetFooterProps extends HTMLAttributes<HTMLElement> {
  /** Footer content */
  children?: ReactNode;
}

export interface SheetTitleProps extends HTMLAttributes<HTMLElement> {
  /** Title content */
  children?: ReactNode;
}

export interface SheetDescriptionProps extends HTMLAttributes<HTMLElement> {
  /** Description content */
  children?: ReactNode;
}

export interface SheetCloseProps extends HTMLAttributes<HTMLElement> {
  /** Close button content */
  children?: ReactNode;
}

// ============================================================================
// Components
// ============================================================================

/**
 * Sheet root component.
 */
const SheetRoot = forwardRef<HTMLElement, SheetRootProps>(function SheetRoot(
  {
    children,
    className,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    closeOnEscape = true,
    closeOnOverlay = true,
    animated = true,
    ...props
  },
  ref
) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const elementRef = useRef<HTMLElement>(null);

  // Combine refs
  const combinedRef = (node: HTMLElement | null) => {
    (elementRef as React.MutableRefObject<HTMLElement | null>).current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  const handleOpenChange = useCallback(
    (event: Event) => {
      const customEvent = event as CustomEvent;
      const isOpen = customEvent.type === "ds:open";

      if (!isControlled) {
        setInternalOpen(isOpen);
      }
      onOpenChange?.(isOpen);
    },
    [isControlled, onOpenChange]
  );

  // Attach event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener("ds:open", handleOpenChange);
    element.addEventListener("ds:close", handleOpenChange);

    return () => {
      element.removeEventListener("ds:open", handleOpenChange);
      element.removeEventListener("ds:close", handleOpenChange);
    };
  }, [handleOpenChange]);

  return createElement(
    "ds-sheet",
    {
      ref: combinedRef,
      class: className,
      open: open || undefined,
      "close-on-escape": closeOnEscape,
      "close-on-overlay": closeOnOverlay,
      animated: animated || undefined,
      ...props,
    },
    children
  );
});
SheetRoot.displayName = "Sheet.Root";

/**
 * Sheet trigger component.
 */
const SheetTrigger = forwardRef<HTMLElement, SheetTriggerProps>(function SheetTrigger(
  { children, className, ...props },
  ref
) {
  return createElement("div", { ref, className, slot: "trigger", ...props }, children);
});
SheetTrigger.displayName = "Sheet.Trigger";

/**
 * Sheet content component.
 */
const SheetContent = forwardRef<HTMLElement, SheetContentProps>(function SheetContent(
  { children, className, side = "right", size = "md", ...props },
  ref
) {
  return createElement(
    "ds-sheet-content",
    { ref, class: className, side, size, ...props },
    children
  );
});
SheetContent.displayName = "Sheet.Content";

/**
 * Sheet header component.
 */
const SheetHeader = forwardRef<HTMLElement, SheetHeaderProps>(function SheetHeader(
  { children, className, ...props },
  ref
) {
  return createElement("ds-sheet-header", { ref, class: className, ...props }, children);
});
SheetHeader.displayName = "Sheet.Header";

/**
 * Sheet footer component.
 */
const SheetFooter = forwardRef<HTMLElement, SheetFooterProps>(function SheetFooter(
  { children, className, ...props },
  ref
) {
  return createElement("ds-sheet-footer", { ref, class: className, ...props }, children);
});
SheetFooter.displayName = "Sheet.Footer";

/**
 * Sheet title component.
 */
const SheetTitle = forwardRef<HTMLElement, SheetTitleProps>(function SheetTitle(
  { children, className, ...props },
  ref
) {
  return createElement("ds-sheet-title", { ref, class: className, ...props }, children);
});
SheetTitle.displayName = "Sheet.Title";

/**
 * Sheet description component.
 */
const SheetDescription = forwardRef<HTMLElement, SheetDescriptionProps>(function SheetDescription(
  { children, className, ...props },
  ref
) {
  return createElement("ds-sheet-description", { ref, class: className, ...props }, children);
});
SheetDescription.displayName = "Sheet.Description";

/**
 * Sheet close component.
 */
const SheetClose = forwardRef<HTMLElement, SheetCloseProps>(function SheetClose(
  { children, className, ...props },
  ref
) {
  return createElement("ds-sheet-close", { ref, class: className, ...props }, children);
});
SheetClose.displayName = "Sheet.Close";

// ============================================================================
// Compound Component
// ============================================================================

export const Sheet = {
  Root: SheetRoot,
  Trigger: SheetTrigger,
  Content: SheetContent,
  Header: SheetHeader,
  Footer: SheetFooter,
  Title: SheetTitle,
  Description: SheetDescription,
  Close: SheetClose,
};

// Also export individual components
export {
  SheetRoot,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
};
