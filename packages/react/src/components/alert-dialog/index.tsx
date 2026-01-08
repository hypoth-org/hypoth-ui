/**
 * AlertDialog compound component exports.
 *
 * AlertDialog is used for important confirmations that require explicit user action.
 * Unlike Dialog, it cannot be dismissed by clicking outside or pressing Escape.
 *
 * @example
 * ```tsx
 * import { AlertDialog } from "@ds/react";
 *
 * <AlertDialog.Root>
 *   <AlertDialog.Trigger>
 *     <button>Delete Account</button>
 *   </AlertDialog.Trigger>
 *   <AlertDialog.Content>
 *     <AlertDialog.Header>
 *       <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
 *       <AlertDialog.Description>
 *         This action cannot be undone.
 *       </AlertDialog.Description>
 *     </AlertDialog.Header>
 *     <AlertDialog.Footer>
 *       <AlertDialog.Cancel>
 *         <button>Cancel</button>
 *       </AlertDialog.Cancel>
 *       <AlertDialog.Action>
 *         <button>Delete</button>
 *       </AlertDialog.Action>
 *     </AlertDialog.Footer>
 *   </AlertDialog.Content>
 * </AlertDialog.Root>
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

export type AlertDialogContentSize = "sm" | "md" | "lg" | "xl" | "full";

export interface AlertDialogRootProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether to animate open/close transitions */
  animated?: boolean;
}

export interface AlertDialogTriggerProps extends HTMLAttributes<HTMLElement> {
  /** Trigger content (typically a button) */
  children?: ReactNode;
}

export interface AlertDialogContentProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
  /** Size of the content */
  size?: AlertDialogContentSize;
}

export interface AlertDialogHeaderProps extends HTMLAttributes<HTMLElement> {
  /** Header content */
  children?: ReactNode;
}

export interface AlertDialogFooterProps extends HTMLAttributes<HTMLElement> {
  /** Footer content */
  children?: ReactNode;
}

export interface AlertDialogTitleProps extends HTMLAttributes<HTMLElement> {
  /** Title content */
  children?: ReactNode;
}

export interface AlertDialogDescriptionProps extends HTMLAttributes<HTMLElement> {
  /** Description content */
  children?: ReactNode;
}

export interface AlertDialogActionProps extends HTMLAttributes<HTMLElement> {
  /** Action button content */
  children?: ReactNode;
  /** Called when action is clicked */
  onClick?: () => void;
}

export interface AlertDialogCancelProps extends HTMLAttributes<HTMLElement> {
  /** Cancel button content */
  children?: ReactNode;
  /** Called when cancel is clicked */
  onClick?: () => void;
}

// ============================================================================
// Components
// ============================================================================

/**
 * AlertDialog root component.
 */
const AlertDialogRoot = forwardRef<HTMLElement, AlertDialogRootProps>(function AlertDialogRoot(
  {
    children,
    className,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
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
    "ds-alert-dialog",
    {
      ref: combinedRef,
      class: className,
      open: open || undefined,
      animated: animated || undefined,
      ...props,
    },
    children
  );
});
AlertDialogRoot.displayName = "AlertDialog.Root";

/**
 * AlertDialog trigger component.
 */
const AlertDialogTrigger = forwardRef<HTMLElement, AlertDialogTriggerProps>(
  function AlertDialogTrigger({ children, className, ...props }, ref) {
    return createElement("ds-alert-dialog-trigger", { ref, class: className, ...props }, children);
  }
);
AlertDialogTrigger.displayName = "AlertDialog.Trigger";

/**
 * AlertDialog content component.
 */
const AlertDialogContent = forwardRef<HTMLElement, AlertDialogContentProps>(
  function AlertDialogContent({ children, className, size = "md", ...props }, ref) {
    return createElement(
      "ds-alert-dialog-content",
      { ref, class: className, size, ...props },
      children
    );
  }
);
AlertDialogContent.displayName = "AlertDialog.Content";

/**
 * AlertDialog header component.
 */
const AlertDialogHeader = forwardRef<HTMLElement, AlertDialogHeaderProps>(
  function AlertDialogHeader({ children, className, ...props }, ref) {
    return createElement("ds-alert-dialog-header", { ref, class: className, ...props }, children);
  }
);
AlertDialogHeader.displayName = "AlertDialog.Header";

/**
 * AlertDialog footer component.
 */
const AlertDialogFooter = forwardRef<HTMLElement, AlertDialogFooterProps>(
  function AlertDialogFooter({ children, className, ...props }, ref) {
    return createElement("ds-alert-dialog-footer", { ref, class: className, ...props }, children);
  }
);
AlertDialogFooter.displayName = "AlertDialog.Footer";

/**
 * AlertDialog title component.
 */
const AlertDialogTitle = forwardRef<HTMLElement, AlertDialogTitleProps>(function AlertDialogTitle(
  { children, className, ...props },
  ref
) {
  return createElement("ds-alert-dialog-title", { ref, class: className, ...props }, children);
});
AlertDialogTitle.displayName = "AlertDialog.Title";

/**
 * AlertDialog description component.
 */
const AlertDialogDescription = forwardRef<HTMLElement, AlertDialogDescriptionProps>(
  function AlertDialogDescription({ children, className, ...props }, ref) {
    return createElement(
      "ds-alert-dialog-description",
      { ref, class: className, ...props },
      children
    );
  }
);
AlertDialogDescription.displayName = "AlertDialog.Description";

/**
 * AlertDialog action component.
 */
const AlertDialogAction = forwardRef<HTMLElement, AlertDialogActionProps>(
  function AlertDialogAction({ children, className, onClick, ...props }, ref) {
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

    // Attach click handler
    useEffect(() => {
      const element = elementRef.current;
      if (!element || !onClick) return;

      const handleClick = () => onClick();
      element.addEventListener("click", handleClick);

      return () => {
        element.removeEventListener("click", handleClick);
      };
    }, [onClick]);

    return createElement(
      "ds-alert-dialog-action",
      { ref: combinedRef, class: className, ...props },
      children
    );
  }
);
AlertDialogAction.displayName = "AlertDialog.Action";

/**
 * AlertDialog cancel component.
 */
const AlertDialogCancel = forwardRef<HTMLElement, AlertDialogCancelProps>(
  function AlertDialogCancel({ children, className, onClick, ...props }, ref) {
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

    // Attach click handler
    useEffect(() => {
      const element = elementRef.current;
      if (!element || !onClick) return;

      const handleClick = () => onClick();
      element.addEventListener("click", handleClick);

      return () => {
        element.removeEventListener("click", handleClick);
      };
    }, [onClick]);

    return createElement(
      "ds-alert-dialog-cancel",
      { ref: combinedRef, class: className, ...props },
      children
    );
  }
);
AlertDialogCancel.displayName = "AlertDialog.Cancel";

// ============================================================================
// Compound Component
// ============================================================================

export const AlertDialog = {
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
  Content: AlertDialogContent,
  Header: AlertDialogHeader,
  Footer: AlertDialogFooter,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Action: AlertDialogAction,
  Cancel: AlertDialogCancel,
};

// Also export individual components
export {
  AlertDialogRoot,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
