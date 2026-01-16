/**
 * Drawer compound component exports.
 *
 * Drawer is a mobile-optimized slide-in panel with swipe gesture support.
 *
 * @example
 * ```tsx
 * import { Drawer } from "@ds/react";
 *
 * <Drawer.Root>
 *   <Drawer.Trigger>
 *     <button>Open Menu</button>
 *   </Drawer.Trigger>
 *   <Drawer.Content>
 *     <Drawer.Header>
 *       <Drawer.Title>Navigation</Drawer.Title>
 *     </Drawer.Header>
 *     <nav>Menu items...</nav>
 *   </Drawer.Content>
 * </Drawer.Root>
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

export type DrawerSide = "top" | "right" | "bottom" | "left";

export interface DrawerRootProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Side of the screen the drawer appears from */
  side?: DrawerSide;
  /** Whether swipe-to-dismiss is enabled */
  swipeDismiss?: boolean;
  /** Whether Escape key closes the drawer */
  closeOnEscape?: boolean;
  /** Whether clicking the overlay closes the drawer */
  closeOnOverlay?: boolean;
  /** Whether to animate open/close transitions */
  animated?: boolean;
}

export interface DrawerTriggerProps extends HTMLAttributes<HTMLElement> {
  /** Trigger content (typically a button) */
  children?: ReactNode;
}

export interface DrawerContentProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
}

export interface DrawerHeaderProps extends HTMLAttributes<HTMLElement> {
  /** Header content */
  children?: ReactNode;
}

export interface DrawerFooterProps extends HTMLAttributes<HTMLElement> {
  /** Footer content */
  children?: ReactNode;
}

export interface DrawerTitleProps extends HTMLAttributes<HTMLElement> {
  /** Title content */
  children?: ReactNode;
}

export interface DrawerDescriptionProps extends HTMLAttributes<HTMLElement> {
  /** Description content */
  children?: ReactNode;
}

// ============================================================================
// Components
// ============================================================================

/**
 * Drawer root component.
 */
const DrawerRoot = forwardRef<HTMLElement, DrawerRootProps>(function DrawerRoot(
  {
    children,
    className,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    side = "bottom",
    swipeDismiss = true,
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
    "ds-drawer",
    {
      ref: combinedRef,
      class: className,
      open: open || undefined,
      side,
      "swipe-dismiss": swipeDismiss,
      "close-on-escape": closeOnEscape,
      "close-on-overlay": closeOnOverlay,
      animated: animated || undefined,
      ...props,
    },
    children
  );
});
DrawerRoot.displayName = "Drawer.Root";

/**
 * Drawer trigger component.
 */
const DrawerTrigger = forwardRef<HTMLElement, DrawerTriggerProps>(function DrawerTrigger(
  { children, className, ...props },
  ref
) {
  return createElement("div", { ref, className, slot: "trigger", ...props }, children);
});
DrawerTrigger.displayName = "Drawer.Trigger";

/**
 * Drawer content component.
 */
const DrawerContent = forwardRef<HTMLElement, DrawerContentProps>(function DrawerContent(
  { children, className, ...props },
  ref
) {
  return createElement("ds-drawer-content", { ref, class: className, ...props }, children);
});
DrawerContent.displayName = "Drawer.Content";

/**
 * Drawer header component.
 */
const DrawerHeader = forwardRef<HTMLElement, DrawerHeaderProps>(function DrawerHeader(
  { children, className, ...props },
  ref
) {
  return createElement("ds-drawer-header", { ref, class: className, ...props }, children);
});
DrawerHeader.displayName = "Drawer.Header";

/**
 * Drawer footer component.
 */
const DrawerFooter = forwardRef<HTMLElement, DrawerFooterProps>(function DrawerFooter(
  { children, className, ...props },
  ref
) {
  return createElement("ds-drawer-footer", { ref, class: className, ...props }, children);
});
DrawerFooter.displayName = "Drawer.Footer";

/**
 * Drawer title component.
 */
const DrawerTitle = forwardRef<HTMLElement, DrawerTitleProps>(function DrawerTitle(
  { children, className, ...props },
  ref
) {
  return createElement("ds-drawer-title", { ref, class: className, ...props }, children);
});
DrawerTitle.displayName = "Drawer.Title";

/**
 * Drawer description component.
 */
const DrawerDescription = forwardRef<HTMLElement, DrawerDescriptionProps>(
  function DrawerDescription({ children, className, ...props }, ref) {
    return createElement("ds-drawer-description", { ref, class: className, ...props }, children);
  }
);
DrawerDescription.displayName = "Drawer.Description";

// ============================================================================
// Compound Component
// ============================================================================

export const Drawer = {
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Header: DrawerHeader,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
};

// Also export individual components
export {
  DrawerRoot,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
