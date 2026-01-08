/**
 * ContextMenu compound component exports.
 *
 * ContextMenu is used for right-click context menus with keyboard navigation.
 * Opens at pointer position on right-click or long-press on touch devices.
 *
 * @example
 * ```tsx
 * import { ContextMenu } from "@ds/react";
 *
 * <ContextMenu.Root>
 *   <ContextMenu.Trigger>
 *     <div>Right-click me</div>
 *   </ContextMenu.Trigger>
 *   <ContextMenu.Content>
 *     <ContextMenu.Item value="copy">Copy</ContextMenu.Item>
 *     <ContextMenu.Item value="paste">Paste</ContextMenu.Item>
 *     <ContextMenu.Separator />
 *     <ContextMenu.Item value="delete" variant="destructive">Delete</ContextMenu.Item>
 *   </ContextMenu.Content>
 * </ContextMenu.Root>
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

export type ContextMenuItemVariant = "default" | "destructive";

export interface ContextMenuRootProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether to animate open/close transitions */
  animated?: boolean;
}

export interface ContextMenuTriggerProps extends HTMLAttributes<HTMLElement> {
  /** Trigger content (the area that responds to right-click) */
  children?: ReactNode;
}

export interface ContextMenuContentProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
}

export interface ContextMenuItemProps extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  /** Item content */
  children?: ReactNode;
  /** Value for selection events */
  value?: string;
  /** Visual variant */
  variant?: ContextMenuItemVariant;
  /** Disabled state */
  disabled?: boolean;
  /** Called when item is selected */
  onSelect?: (value: string) => void;
}

export interface ContextMenuSeparatorProps extends HTMLAttributes<HTMLElement> {}

export interface ContextMenuLabelProps extends HTMLAttributes<HTMLElement> {
  /** Label content */
  children?: ReactNode;
}

// ============================================================================
// Components
// ============================================================================

/**
 * ContextMenu root component.
 */
const ContextMenuRoot = forwardRef<HTMLElement, ContextMenuRootProps>(function ContextMenuRoot(
  {
    children,
    className,
    open: controlledOpen,
    onOpenChange,
    animated = true,
    ...props
  },
  ref
) {
  const [internalOpen, setInternalOpen] = useState(false);
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
    "ds-context-menu",
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
ContextMenuRoot.displayName = "ContextMenu.Root";

/**
 * ContextMenu trigger component.
 */
const ContextMenuTrigger = forwardRef<HTMLElement, ContextMenuTriggerProps>(
  function ContextMenuTrigger({ children, className, ...props }, ref) {
    return createElement(
      "span",
      { ref, className, slot: "trigger", ...props },
      children
    );
  }
);
ContextMenuTrigger.displayName = "ContextMenu.Trigger";

/**
 * ContextMenu content component.
 */
const ContextMenuContent = forwardRef<HTMLElement, ContextMenuContentProps>(
  function ContextMenuContent({ children, className, ...props }, ref) {
    return createElement(
      "ds-context-menu-content",
      { ref, class: className, ...props },
      children
    );
  }
);
ContextMenuContent.displayName = "ContextMenu.Content";

/**
 * ContextMenu item component.
 */
const ContextMenuItem = forwardRef<HTMLElement, ContextMenuItemProps>(
  function ContextMenuItem(
    { children, className, value, variant = "default", disabled = false, onSelect, ...props },
    ref
  ) {
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

    // Attach select handler
    useEffect(() => {
      const element = elementRef.current;
      if (!element || !onSelect) return;

      const handleSelect = (event: Event) => {
        const customEvent = event as CustomEvent<{ value: string }>;
        onSelect(customEvent.detail.value);
      };
      element.addEventListener("ds:select", handleSelect);

      return () => {
        element.removeEventListener("ds:select", handleSelect);
      };
    }, [onSelect]);

    return createElement(
      "ds-context-menu-item",
      {
        ref: combinedRef,
        class: className,
        value,
        variant,
        disabled: disabled || undefined,
        ...props,
      },
      children
    );
  }
);
ContextMenuItem.displayName = "ContextMenu.Item";

/**
 * ContextMenu separator component.
 */
const ContextMenuSeparator = forwardRef<HTMLElement, ContextMenuSeparatorProps>(
  function ContextMenuSeparator({ className, ...props }, ref) {
    return createElement(
      "ds-context-menu-separator",
      { ref, class: className, ...props }
    );
  }
);
ContextMenuSeparator.displayName = "ContextMenu.Separator";

/**
 * ContextMenu label component.
 */
const ContextMenuLabel = forwardRef<HTMLElement, ContextMenuLabelProps>(
  function ContextMenuLabel({ children, className, ...props }, ref) {
    return createElement(
      "ds-context-menu-label",
      { ref, class: className, ...props },
      children
    );
  }
);
ContextMenuLabel.displayName = "ContextMenu.Label";

// ============================================================================
// Compound Component
// ============================================================================

export const ContextMenu = {
  Root: ContextMenuRoot,
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  Separator: ContextMenuSeparator,
  Label: ContextMenuLabel,
};

// Also export individual components
export {
  ContextMenuRoot,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
};
