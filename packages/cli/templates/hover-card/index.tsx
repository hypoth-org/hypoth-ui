/**
 * HoverCard compound component exports.
 *
 * HoverCard displays rich preview content on hover with configurable delays.
 *
 * @example
 * ```tsx
 * import { HoverCard } from "@ds/react";
 *
 * <HoverCard.Root>
 *   <HoverCard.Trigger>
 *     <a href="/user/123">@johndoe</a>
 *   </HoverCard.Trigger>
 *   <HoverCard.Content>
 *     <img src="avatar.jpg" alt="" />
 *     <h3>John Doe</h3>
 *     <p>Software Engineer</p>
 *   </HoverCard.Content>
 * </HoverCard.Root>
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

export type HoverCardPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

export interface HoverCardRootProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Placement relative to trigger */
  placement?: HoverCardPlacement;
  /** Offset distance from trigger in pixels */
  offset?: number;
  /** Whether to flip placement when near viewport edge */
  flip?: boolean;
  /** Delay in ms before showing on hover */
  openDelay?: number;
  /** Delay in ms before hiding after hover leaves */
  closeDelay?: number;
  /** Whether to animate open/close transitions */
  animated?: boolean;
}

export interface HoverCardTriggerProps extends HTMLAttributes<HTMLElement> {
  /** Trigger content */
  children?: ReactNode;
}

export interface HoverCardContentProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
}

// ============================================================================
// Components
// ============================================================================

/**
 * HoverCard root component.
 */
const HoverCardRoot = forwardRef<HTMLElement, HoverCardRootProps>(function HoverCardRoot(
  {
    children,
    className,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    placement = "bottom",
    offset = 8,
    flip = true,
    openDelay = 700,
    closeDelay = 300,
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
    "ds-hover-card",
    {
      ref: combinedRef,
      class: className,
      open: open || undefined,
      placement,
      offset,
      flip: flip || undefined,
      "open-delay": openDelay,
      "close-delay": closeDelay,
      animated: animated || undefined,
      ...props,
    },
    children
  );
});
HoverCardRoot.displayName = "HoverCard.Root";

/**
 * HoverCard trigger component.
 */
const HoverCardTrigger = forwardRef<HTMLElement, HoverCardTriggerProps>(function HoverCardTrigger(
  { children, className, ...props },
  ref
) {
  return createElement("span", { ref, className, slot: "trigger", ...props }, children);
});
HoverCardTrigger.displayName = "HoverCard.Trigger";

/**
 * HoverCard content component.
 */
const HoverCardContent = forwardRef<HTMLElement, HoverCardContentProps>(function HoverCardContent(
  { children, className, ...props },
  ref
) {
  return createElement("ds-hover-card-content", { ref, class: className, ...props }, children);
});
HoverCardContent.displayName = "HoverCard.Content";

// ============================================================================
// Compound Component
// ============================================================================

export const HoverCard = {
  Root: HoverCardRoot,
  Trigger: HoverCardTrigger,
  Content: HoverCardContent,
};

// Also export individual components
export { HoverCardRoot, HoverCardTrigger, HoverCardContent };
