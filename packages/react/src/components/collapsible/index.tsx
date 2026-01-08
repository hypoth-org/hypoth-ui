/**
 * Collapsible compound component exports.
 *
 * @example
 * ```tsx
 * import { Collapsible } from "@ds/react";
 *
 * <Collapsible.Root>
 *   <Collapsible.Trigger>Toggle</Collapsible.Trigger>
 *   <Collapsible.Content>
 *     <p>Collapsible content here.</p>
 *   </Collapsible.Content>
 * </Collapsible.Root>
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

export interface CollapsibleRootProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Disable the collapsible */
  disabled?: boolean;
}

export interface CollapsibleTriggerProps extends HTMLAttributes<HTMLElement> {
  /** Trigger content */
  children?: ReactNode;
}

export interface CollapsibleContentProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
  /** Keep mounted when collapsed */
  forceMount?: boolean;
}

// ============================================================================
// Components
// ============================================================================

/**
 * Collapsible root component.
 */
const CollapsibleRoot = forwardRef<HTMLElement, CollapsibleRootProps>(function CollapsibleRoot(
  {
    children,
    className,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    disabled = false,
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
    "ds-collapsible",
    {
      ref: combinedRef,
      class: className,
      open: open || undefined,
      disabled: disabled || undefined,
      ...props,
    },
    children
  );
});
CollapsibleRoot.displayName = "Collapsible.Root";

/**
 * Collapsible trigger component.
 */
const CollapsibleTrigger = forwardRef<HTMLElement, CollapsibleTriggerProps>(
  function CollapsibleTrigger({ children, className, ...props }, ref) {
    return createElement(
      "ds-collapsible-trigger",
      { ref, class: className, ...props },
      children
    );
  }
);
CollapsibleTrigger.displayName = "Collapsible.Trigger";

/**
 * Collapsible content component.
 */
const CollapsibleContent = forwardRef<HTMLElement, CollapsibleContentProps>(
  function CollapsibleContent({ children, className, forceMount = false, ...props }, ref) {
    return createElement(
      "ds-collapsible-content",
      {
        ref,
        class: className,
        "force-mount": forceMount || undefined,
        ...props,
      },
      children
    );
  }
);
CollapsibleContent.displayName = "Collapsible.Content";

// ============================================================================
// Compound Component
// ============================================================================

export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Content: CollapsibleContent,
};

// Also export individual components
export { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent };
