/**
 * Accordion compound component exports.
 *
 * @example
 * ```tsx
 * import { Accordion } from "@ds/react";
 *
 * // Single expand mode
 * <Accordion.Root type="single" defaultValue="item-1" collapsible>
 *   <Accordion.Item value="item-1">
 *     <Accordion.Trigger>Section 1</Accordion.Trigger>
 *     <Accordion.Content>Content 1</Accordion.Content>
 *   </Accordion.Item>
 *   <Accordion.Item value="item-2">
 *     <Accordion.Trigger>Section 2</Accordion.Trigger>
 *     <Accordion.Content>Content 2</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion.Root>
 *
 * // Multiple expand mode
 * <Accordion.Root type="multiple" defaultValue={["item-1", "item-2"]}>
 *   ...
 * </Accordion.Root>
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

export type AccordionType = "single" | "multiple";
export type AccordionOrientation = "horizontal" | "vertical";

interface AccordionSingleProps {
  type: "single";
  /** Controlled value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Called when value changes */
  onValueChange?: (value: string) => void;
  /** Allow collapsing all items */
  collapsible?: boolean;
}

interface AccordionMultipleProps {
  type: "multiple";
  /** Controlled value */
  value?: string[];
  /** Default value (uncontrolled) */
  defaultValue?: string[];
  /** Called when value changes */
  onValueChange?: (value: string[]) => void;
}

type AccordionRootBaseProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  orientation?: AccordionOrientation;
};

export type AccordionRootProps = AccordionRootBaseProps &
  (AccordionSingleProps | AccordionMultipleProps);

export interface AccordionItemProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  /** Unique value identifying this item */
  value: string;
  /** Disable this item */
  disabled?: boolean;
}

export interface AccordionTriggerProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface AccordionContentProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  /** Keep mounted when collapsed */
  forceMount?: boolean;
}

// ============================================================================
// Components
// ============================================================================

/**
 * Accordion root component.
 */
const AccordionRoot = forwardRef<HTMLElement, AccordionRootProps>(function AccordionRoot(
  props,
  ref
) {
  const {
    children,
    className,
    type = "single",
    orientation = "vertical",
  } = props;

  // Handle single vs multiple mode
  const isSingle = type === "single";
  const singleProps = props as AccordionSingleProps;
  const multipleProps = props as AccordionMultipleProps;

  // State management
  const [internalValue, setInternalValue] = useState<string | string[]>(() => {
    if (isSingle) {
      return singleProps.defaultValue ?? "";
    }
    return multipleProps.defaultValue ?? [];
  });

  const isControlled = isSingle
    ? singleProps.value !== undefined
    : multipleProps.value !== undefined;

  const value = isControlled
    ? (isSingle ? singleProps.value : multipleProps.value)
    : internalValue;

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

      if (isSingle) {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        (singleProps.onValueChange as ((v: string) => void) | undefined)?.(newValue);
      } else {
        // Parse JSON array
        let parsedValue: string[] = [];
        try {
          parsedValue = JSON.parse(newValue);
        } catch {
          parsedValue = newValue ? [newValue] : [];
        }

        if (!isControlled) {
          setInternalValue(parsedValue);
        }
        (multipleProps.onValueChange as ((v: string[]) => void) | undefined)?.(parsedValue);
      }
    },
    [isSingle, isControlled, singleProps.onValueChange, multipleProps.onValueChange]
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

  // Convert value to string for WC
  const valueString = isSingle
    ? (value as string)
    : JSON.stringify(value);

  // Extract collapsible from single props
  const collapsible = isSingle ? singleProps.collapsible : undefined;

  return createElement(
    "ds-accordion",
    {
      ref: combinedRef,
      class: className,
      type,
      value: isControlled ? valueString : undefined,
      "default-value": !isControlled ? valueString : undefined,
      collapsible: isSingle && collapsible ? true : undefined,
      orientation,
    },
    children
  );
});
AccordionRoot.displayName = "Accordion.Root";

/**
 * Accordion item component.
 */
const AccordionItem = forwardRef<HTMLElement, AccordionItemProps>(function AccordionItem(
  { children, className, value, disabled = false, ...props },
  ref
) {
  return createElement(
    "ds-accordion-item",
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
AccordionItem.displayName = "Accordion.Item";

/**
 * Accordion trigger component.
 */
const AccordionTrigger = forwardRef<HTMLElement, AccordionTriggerProps>(
  function AccordionTrigger({ children, className, ...props }, ref) {
    return createElement(
      "ds-accordion-trigger",
      { ref, class: className, ...props },
      children
    );
  }
);
AccordionTrigger.displayName = "Accordion.Trigger";

/**
 * Accordion content component.
 */
const AccordionContent = forwardRef<HTMLElement, AccordionContentProps>(
  function AccordionContent({ children, className, forceMount = false, ...props }, ref) {
    return createElement(
      "ds-accordion-content",
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
AccordionContent.displayName = "Accordion.Content";

// ============================================================================
// Compound Component
// ============================================================================

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
};

// Also export individual components
export { AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent };
