/**
 * NavigationMenu compound component exports.
 *
 * NavigationMenu provides mega-menu style navigation with smooth transitions.
 *
 * @example
 * ```tsx
 * import { NavigationMenu } from "@ds/react";
 *
 * <NavigationMenu.Root>
 *   <NavigationMenu.List>
 *     <NavigationMenu.Item value="products">
 *       <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
 *       <NavigationMenu.Content>
 *         <NavigationMenu.Link href="/products/a">Product A</NavigationMenu.Link>
 *       </NavigationMenu.Content>
 *     </NavigationMenu.Item>
 *   </NavigationMenu.List>
 *   <NavigationMenu.Viewport />
 * </NavigationMenu.Root>
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

export type NavigationMenuOrientation = "horizontal" | "vertical";

export interface NavigationMenuRootProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
  /** Controlled active value */
  value?: string;
  /** Default active value (uncontrolled) */
  defaultValue?: string;
  /** Called when active value changes */
  onValueChange?: (value: string) => void;
  /** Delay in ms before opening on hover */
  delayDuration?: number;
  /** Delay in ms before closing when pointer leaves */
  skipDelayDuration?: number;
  /** Orientation (horizontal or vertical) */
  orientation?: NavigationMenuOrientation;
}

export interface NavigationMenuListProps extends HTMLAttributes<HTMLElement> {
  /** List items */
  children?: ReactNode;
}

export interface NavigationMenuItemProps extends HTMLAttributes<HTMLElement> {
  /** Item content */
  children?: ReactNode;
  /** Unique value for this item */
  value: string;
}

export interface NavigationMenuTriggerProps extends HTMLAttributes<HTMLElement> {
  /** Trigger content */
  children?: ReactNode;
  /** Disabled state */
  disabled?: boolean;
}

export interface NavigationMenuContentProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
}

export interface NavigationMenuLinkProps extends HTMLAttributes<HTMLElement> {
  /** Link content */
  children?: ReactNode;
  /** URL to navigate to */
  href?: string;
  /** Whether this link is currently active */
  active?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Called when link is clicked */
  onNavigate?: (href: string) => void;
}

export interface NavigationMenuIndicatorProps extends HTMLAttributes<HTMLElement> {}

export interface NavigationMenuViewportProps extends HTMLAttributes<HTMLElement> {}

// ============================================================================
// Components
// ============================================================================

/**
 * NavigationMenu root component.
 */
const NavigationMenuRoot = forwardRef<HTMLElement, NavigationMenuRootProps>(
  function NavigationMenuRoot(
    {
      children,
      className,
      value: controlledValue,
      defaultValue = "",
      onValueChange,
      delayDuration = 200,
      skipDelayDuration = 300,
      orientation = "horizontal",
      ...props
    },
    ref
  ) {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;
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

    const handleValueChange = useCallback(
      (event: Event) => {
        const customEvent = event as CustomEvent<{ value: string }>;
        const newValue = customEvent.detail.value;

        if (!isControlled) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [isControlled, onValueChange]
    );

    // Attach event listeners
    useEffect(() => {
      const element = elementRef.current;
      if (!element) return;

      element.addEventListener("ds:value-change", handleValueChange);

      return () => {
        element.removeEventListener("ds:value-change", handleValueChange);
      };
    }, [handleValueChange]);

    return createElement(
      "ds-navigation-menu",
      {
        ref: combinedRef,
        class: className,
        value,
        "delay-duration": delayDuration,
        "skip-delay-duration": skipDelayDuration,
        orientation,
        ...props,
      },
      children
    );
  }
);
NavigationMenuRoot.displayName = "NavigationMenu.Root";

/**
 * NavigationMenu list component.
 */
const NavigationMenuList = forwardRef<HTMLElement, NavigationMenuListProps>(
  function NavigationMenuList({ children, className, ...props }, ref) {
    return createElement("ds-navigation-menu-list", { ref, class: className, ...props }, children);
  }
);
NavigationMenuList.displayName = "NavigationMenu.List";

/**
 * NavigationMenu item component.
 */
const NavigationMenuItem = forwardRef<HTMLElement, NavigationMenuItemProps>(
  function NavigationMenuItem({ children, className, value, ...props }, ref) {
    return createElement(
      "ds-navigation-menu-item",
      { ref, class: className, value, ...props },
      children
    );
  }
);
NavigationMenuItem.displayName = "NavigationMenu.Item";

/**
 * NavigationMenu trigger component.
 */
const NavigationMenuTrigger = forwardRef<HTMLElement, NavigationMenuTriggerProps>(
  function NavigationMenuTrigger({ children, className, disabled = false, ...props }, ref) {
    return createElement(
      "ds-navigation-menu-trigger",
      { ref, class: className, disabled: disabled || undefined, ...props },
      children
    );
  }
);
NavigationMenuTrigger.displayName = "NavigationMenu.Trigger";

/**
 * NavigationMenu content component.
 */
const NavigationMenuContent = forwardRef<HTMLElement, NavigationMenuContentProps>(
  function NavigationMenuContent({ children, className, ...props }, ref) {
    return createElement(
      "ds-navigation-menu-content",
      { ref, class: className, ...props },
      children
    );
  }
);
NavigationMenuContent.displayName = "NavigationMenu.Content";

/**
 * NavigationMenu link component.
 */
const NavigationMenuLink = forwardRef<HTMLElement, NavigationMenuLinkProps>(
  function NavigationMenuLink(
    { children, className, href, active = false, disabled = false, onNavigate, ...props },
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

    // Attach navigate handler
    useEffect(() => {
      const element = elementRef.current;
      if (!element || !onNavigate) return;

      const handleNavigate = (event: Event) => {
        event.preventDefault();
        const customEvent = event as CustomEvent<{ href: string }>;
        onNavigate(customEvent.detail.href);
      };
      element.addEventListener("ds:navigate", handleNavigate);

      return () => {
        element.removeEventListener("ds:navigate", handleNavigate);
      };
    }, [onNavigate]);

    return createElement(
      "ds-navigation-menu-link",
      {
        ref: combinedRef,
        class: className,
        href,
        active: active || undefined,
        disabled: disabled || undefined,
        ...props,
      },
      children
    );
  }
);
NavigationMenuLink.displayName = "NavigationMenu.Link";

/**
 * NavigationMenu indicator component.
 */
const NavigationMenuIndicator = forwardRef<HTMLElement, NavigationMenuIndicatorProps>(
  function NavigationMenuIndicator({ className, ...props }, ref) {
    return createElement("ds-navigation-menu-indicator", { ref, class: className, ...props });
  }
);
NavigationMenuIndicator.displayName = "NavigationMenu.Indicator";

/**
 * NavigationMenu viewport component.
 */
const NavigationMenuViewport = forwardRef<HTMLElement, NavigationMenuViewportProps>(
  function NavigationMenuViewport({ className, ...props }, ref) {
    return createElement("ds-navigation-menu-viewport", { ref, class: className, ...props });
  }
);
NavigationMenuViewport.displayName = "NavigationMenu.Viewport";

// ============================================================================
// Compound Component
// ============================================================================

export const NavigationMenu = {
  Root: NavigationMenuRoot,
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Trigger: NavigationMenuTrigger,
  Content: NavigationMenuContent,
  Link: NavigationMenuLink,
  Indicator: NavigationMenuIndicator,
  Viewport: NavigationMenuViewport,
};

// Also export individual components
export {
  NavigationMenuRoot,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
