/**
 * DropdownMenu compound component exports.
 *
 * DropdownMenu is used for action menus triggered by a button, with support
 * for items, separators, labels, checkbox items, and radio groups.
 *
 * @example
 * ```tsx
 * import { DropdownMenu } from "@ds/react";
 *
 * <DropdownMenu.Root>
 *   <DropdownMenu.Trigger>
 *     <button>Actions</button>
 *   </DropdownMenu.Trigger>
 *   <DropdownMenu.Content>
 *     <DropdownMenu.Label>Actions</DropdownMenu.Label>
 *     <DropdownMenu.Item value="edit">Edit</DropdownMenu.Item>
 *     <DropdownMenu.Separator />
 *     <DropdownMenu.Item value="delete" variant="destructive">Delete</DropdownMenu.Item>
 *   </DropdownMenu.Content>
 * </DropdownMenu.Root>
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

export type DropdownMenuPlacement =
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

export type DropdownMenuItemVariant = "default" | "destructive";

export interface DropdownMenuRootProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Placement relative to trigger */
  placement?: DropdownMenuPlacement;
  /** Offset distance from trigger in pixels */
  offset?: number;
  /** Whether to flip placement when near viewport edge */
  flip?: boolean;
  /** Whether to animate open/close transitions */
  animated?: boolean;
  /** Modal behavior - blocks interaction outside menu */
  modal?: boolean;
}

export interface DropdownMenuTriggerProps extends HTMLAttributes<HTMLElement> {
  /** Trigger content (typically a button) */
  children?: ReactNode;
}

export interface DropdownMenuContentProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
}

export interface DropdownMenuItemProps extends Omit<HTMLAttributes<HTMLElement>, "onSelect"> {
  /** Item content */
  children?: ReactNode;
  /** Value for selection events */
  value?: string;
  /** Visual variant */
  variant?: DropdownMenuItemVariant;
  /** Disabled state */
  disabled?: boolean;
  /** Called when item is selected */
  onSelect?: (value: string) => void;
}

export interface DropdownMenuSeparatorProps extends HTMLAttributes<HTMLElement> {}

export interface DropdownMenuLabelProps extends HTMLAttributes<HTMLElement> {
  /** Label content */
  children?: ReactNode;
}

export interface DropdownMenuCheckboxItemProps extends HTMLAttributes<HTMLElement> {
  /** Item content */
  children?: ReactNode;
  /** Whether the checkbox is checked */
  checked?: boolean;
  /** Called when checkbox state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
}

export interface DropdownMenuRadioGroupProps extends HTMLAttributes<HTMLElement> {
  /** Radio items */
  children?: ReactNode;
  /** Currently selected value */
  value?: string;
  /** Called when selection changes */
  onValueChange?: (value: string) => void;
}

export interface DropdownMenuRadioItemProps extends HTMLAttributes<HTMLElement> {
  /** Item content */
  children?: ReactNode;
  /** Value for this radio item */
  value: string;
  /** Disabled state */
  disabled?: boolean;
}

// ============================================================================
// Components
// ============================================================================

/**
 * DropdownMenu root component.
 */
const DropdownMenuRoot = forwardRef<HTMLElement, DropdownMenuRootProps>(function DropdownMenuRoot(
  {
    children,
    className,
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    placement = "bottom-start",
    offset = 4,
    flip = true,
    animated = true,
    modal = true,
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
    "ds-dropdown-menu",
    {
      ref: combinedRef,
      class: className,
      open: open || undefined,
      placement,
      offset,
      flip: flip || undefined,
      animated: animated || undefined,
      modal: modal || undefined,
      ...props,
    },
    children
  );
});
DropdownMenuRoot.displayName = "DropdownMenu.Root";

/**
 * DropdownMenu trigger component.
 */
const DropdownMenuTrigger = forwardRef<HTMLElement, DropdownMenuTriggerProps>(
  function DropdownMenuTrigger({ children, className, ...props }, ref) {
    return createElement("span", { ref, className, slot: "trigger", ...props }, children);
  }
);
DropdownMenuTrigger.displayName = "DropdownMenu.Trigger";

/**
 * DropdownMenu content component.
 */
const DropdownMenuContent = forwardRef<HTMLElement, DropdownMenuContentProps>(
  function DropdownMenuContent({ children, className, ...props }, ref) {
    return createElement("ds-dropdown-menu-content", { ref, class: className, ...props }, children);
  }
);
DropdownMenuContent.displayName = "DropdownMenu.Content";

/**
 * DropdownMenu item component.
 */
const DropdownMenuItem = forwardRef<HTMLElement, DropdownMenuItemProps>(function DropdownMenuItem(
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
    "ds-dropdown-menu-item",
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
});
DropdownMenuItem.displayName = "DropdownMenu.Item";

/**
 * DropdownMenu separator component.
 */
const DropdownMenuSeparator = forwardRef<HTMLElement, DropdownMenuSeparatorProps>(
  function DropdownMenuSeparator({ className, ...props }, ref) {
    return createElement("ds-dropdown-menu-separator", { ref, class: className, ...props });
  }
);
DropdownMenuSeparator.displayName = "DropdownMenu.Separator";

/**
 * DropdownMenu label component.
 */
const DropdownMenuLabel = forwardRef<HTMLElement, DropdownMenuLabelProps>(
  function DropdownMenuLabel({ children, className, ...props }, ref) {
    return createElement("ds-dropdown-menu-label", { ref, class: className, ...props }, children);
  }
);
DropdownMenuLabel.displayName = "DropdownMenu.Label";

/**
 * DropdownMenu checkbox item component.
 */
const DropdownMenuCheckboxItem = forwardRef<HTMLElement, DropdownMenuCheckboxItemProps>(
  function DropdownMenuCheckboxItem(
    { children, className, checked = false, onCheckedChange, disabled = false, ...props },
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

    // Attach change handler
    useEffect(() => {
      const element = elementRef.current;
      if (!element || !onCheckedChange) return;

      const handleSelect = (event: Event) => {
        const customEvent = event as CustomEvent<{ checked: boolean }>;
        onCheckedChange(customEvent.detail.checked);
      };
      element.addEventListener("ds:select", handleSelect);

      return () => {
        element.removeEventListener("ds:select", handleSelect);
      };
    }, [onCheckedChange]);

    return createElement(
      "ds-dropdown-menu-checkbox-item",
      {
        ref: combinedRef,
        class: className,
        checked: checked || undefined,
        disabled: disabled || undefined,
        ...props,
      },
      children
    );
  }
);
DropdownMenuCheckboxItem.displayName = "DropdownMenu.CheckboxItem";

/**
 * DropdownMenu radio group component.
 */
const DropdownMenuRadioGroup = forwardRef<HTMLElement, DropdownMenuRadioGroupProps>(
  function DropdownMenuRadioGroup({ children, className, value, onValueChange, ...props }, ref) {
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

    // Attach change handler
    useEffect(() => {
      const element = elementRef.current;
      if (!element || !onValueChange) return;

      const handleChange = (event: Event) => {
        const customEvent = event as CustomEvent<{ value: string }>;
        onValueChange(customEvent.detail.value);
      };
      element.addEventListener("ds:change", handleChange);

      return () => {
        element.removeEventListener("ds:change", handleChange);
      };
    }, [onValueChange]);

    return createElement(
      "ds-dropdown-menu-radio-group",
      {
        ref: combinedRef,
        class: className,
        value,
        ...props,
      },
      children
    );
  }
);
DropdownMenuRadioGroup.displayName = "DropdownMenu.RadioGroup";

/**
 * DropdownMenu radio item component.
 */
const DropdownMenuRadioItem = forwardRef<HTMLElement, DropdownMenuRadioItemProps>(
  function DropdownMenuRadioItem({ children, className, value, disabled = false, ...props }, ref) {
    return createElement(
      "ds-dropdown-menu-radio-item",
      {
        ref,
        class: className,
        value,
        disabled: disabled || undefined,
        ...props,
      },
      children
    );
  }
);
DropdownMenuRadioItem.displayName = "DropdownMenu.RadioItem";

// ============================================================================
// Compound Component
// ============================================================================

export const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Separator: DropdownMenuSeparator,
  Label: DropdownMenuLabel,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioGroup: DropdownMenuRadioGroup,
  RadioItem: DropdownMenuRadioItem,
};

// Also export individual components
export {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
};
