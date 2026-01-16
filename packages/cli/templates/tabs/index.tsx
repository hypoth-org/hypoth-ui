/**
 * Tabs compound component exports.
 *
 * @example
 * ```tsx
 * import { Tabs } from "@ds/react";
 *
 * <Tabs.Root defaultValue="tab1">
 *   <Tabs.List>
 *     <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
 *     <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content value="tab1">Content 1</Tabs.Content>
 *   <Tabs.Content value="tab2">Content 2</Tabs.Content>
 * </Tabs.Root>
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

export type TabsOrientation = "horizontal" | "vertical";
export type TabsActivationMode = "automatic" | "manual";

export interface TabsRootProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
  /** Controlled value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Called when value changes */
  onValueChange?: (value: string) => void;
  /** Keyboard navigation orientation */
  orientation?: TabsOrientation;
  /** Activation mode */
  activationMode?: TabsActivationMode;
}

export interface TabsListProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
  /** Loop focus at ends */
  loop?: boolean;
}

export interface TabsTriggerProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
  /** Unique value identifying this tab */
  value: string;
  /** Disable this tab */
  disabled?: boolean;
}

export interface TabsContentProps extends HTMLAttributes<HTMLElement> {
  /** Content */
  children?: ReactNode;
  /** Value of associated tab */
  value: string;
  /** Keep mounted when inactive */
  forceMount?: boolean;
}

// ============================================================================
// Components
// ============================================================================

/**
 * Tabs root component.
 */
const TabsRoot = forwardRef<HTMLElement, TabsRootProps>(function TabsRoot(
  {
    children,
    className,
    value: controlledValue,
    defaultValue,
    onValueChange,
    orientation = "horizontal",
    activationMode = "automatic",
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

  const handleChange = useCallback(
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

    element.addEventListener("ds:change", handleChange);

    return () => {
      element.removeEventListener("ds:change", handleChange);
    };
  }, [handleChange]);

  return createElement(
    "ds-tabs",
    {
      ref: combinedRef,
      class: className,
      value: isControlled ? value : undefined,
      "default-value": !isControlled ? defaultValue : undefined,
      orientation,
      "activation-mode": activationMode,
      ...props,
    },
    children
  );
});
TabsRoot.displayName = "Tabs.Root";

/**
 * Tabs list component.
 */
const TabsList = forwardRef<HTMLElement, TabsListProps>(function TabsList(
  { children, className, loop = true, ...props },
  ref
) {
  return createElement(
    "ds-tabs-list",
    { ref, class: className, loop: loop || undefined, ...props },
    children
  );
});
TabsList.displayName = "Tabs.List";

/**
 * Tabs trigger component.
 */
const TabsTrigger = forwardRef<HTMLElement, TabsTriggerProps>(function TabsTrigger(
  { children, className, value, disabled = false, ...props },
  ref
) {
  return createElement(
    "ds-tabs-trigger",
    {
      ref,
      class: className,
      value,
      disabled: disabled || undefined,
      ...props,
    },
    children
  );
});
TabsTrigger.displayName = "Tabs.Trigger";

/**
 * Tabs content component.
 */
const TabsContent = forwardRef<HTMLElement, TabsContentProps>(function TabsContent(
  { children, className, value, forceMount = false, ...props },
  ref
) {
  return createElement(
    "ds-tabs-content",
    {
      ref,
      class: className,
      value,
      "force-mount": forceMount || undefined,
      ...props,
    },
    children
  );
});
TabsContent.displayName = "Tabs.Content";

// ============================================================================
// Compound Component
// ============================================================================

export const Tabs = {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
};

// Also export individual components
export { TabsRoot, TabsList, TabsTrigger, TabsContent };
