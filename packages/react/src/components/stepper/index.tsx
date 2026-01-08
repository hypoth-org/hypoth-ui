/**
 * Stepper compound component exports.
 *
 * @example
 * ```tsx
 * import { Stepper } from "@ds/react";
 *
 * <Stepper.Root value={2} onStepChange={(step) => console.log(step)}>
 *   <Stepper.Item step={1} completed>
 *     <Stepper.Trigger>
 *       <Stepper.Indicator>1</Stepper.Indicator>
 *       <Stepper.Title>Account</Stepper.Title>
 *     </Stepper.Trigger>
 *   </Stepper.Item>
 *   <Stepper.Separator />
 *   <Stepper.Item step={2}>
 *     <Stepper.Trigger>
 *       <Stepper.Indicator>2</Stepper.Indicator>
 *       <Stepper.Title>Profile</Stepper.Title>
 *     </Stepper.Trigger>
 *   </Stepper.Item>
 * </Stepper.Root>
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

export type StepperOrientation = "horizontal" | "vertical";

export interface StepperRootProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  value?: number;
  defaultValue?: number;
  onStepChange?: (step: number) => void;
  orientation?: StepperOrientation;
  linear?: boolean;
}

export interface StepperItemProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  step: number;
  completed?: boolean;
  disabled?: boolean;
}

export interface StepperTriggerProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface StepperIndicatorProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface StepperTitleProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface StepperDescriptionProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

export interface StepperSeparatorProps extends HTMLAttributes<HTMLElement> {}

export interface StepperContentProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

// ============================================================================
// Components
// ============================================================================

const StepperRoot = forwardRef<HTMLElement, StepperRootProps>(function StepperRoot(
  {
    children,
    className,
    value: controlledValue,
    defaultValue = 1,
    onStepChange,
    orientation = "horizontal",
    linear = false,
    ...props
  },
  ref
) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const elementRef = useRef<HTMLElement>(null);

  const combinedRef = (node: HTMLElement | null) => {
    (elementRef as React.MutableRefObject<HTMLElement | null>).current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = node;
  };

  const handleStepChange = useCallback(
    (event: Event) => {
      const e = event as CustomEvent<{ step: number }>;
      if (!isControlled) setInternalValue(e.detail.step);
      onStepChange?.(e.detail.step);
    },
    [isControlled, onStepChange]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    element.addEventListener("ds:step-change", handleStepChange);
    return () => element.removeEventListener("ds:step-change", handleStepChange);
  }, [handleStepChange]);

  return createElement(
    "ds-stepper",
    {
      ref: combinedRef,
      class: className,
      value,
      orientation,
      linear: linear || undefined,
      ...props,
    },
    children
  );
});
StepperRoot.displayName = "Stepper.Root";

const StepperItem = forwardRef<HTMLElement, StepperItemProps>(function StepperItem(
  { children, className, step, completed, disabled, ...props },
  ref
) {
  return createElement(
    "ds-stepper-item",
    {
      ref,
      class: className,
      step,
      completed: completed || undefined,
      disabled: disabled || undefined,
      ...props,
    },
    children
  );
});
StepperItem.displayName = "Stepper.Item";

const StepperTrigger = forwardRef<HTMLElement, StepperTriggerProps>(function StepperTrigger(
  { children, className, ...props },
  ref
) {
  return createElement("ds-stepper-trigger", { ref, class: className, ...props }, children);
});
StepperTrigger.displayName = "Stepper.Trigger";

const StepperIndicator = forwardRef<HTMLElement, StepperIndicatorProps>(function StepperIndicator(
  { children, className, ...props },
  ref
) {
  return createElement("ds-stepper-indicator", { ref, class: className, ...props }, children);
});
StepperIndicator.displayName = "Stepper.Indicator";

const StepperTitle = forwardRef<HTMLElement, StepperTitleProps>(function StepperTitle(
  { children, className, ...props },
  ref
) {
  return createElement("ds-stepper-title", { ref, class: className, ...props }, children);
});
StepperTitle.displayName = "Stepper.Title";

const StepperDescription = forwardRef<HTMLElement, StepperDescriptionProps>(
  function StepperDescription({ children, className, ...props }, ref) {
    return createElement("ds-stepper-description", { ref, class: className, ...props }, children);
  }
);
StepperDescription.displayName = "Stepper.Description";

const StepperSeparator = forwardRef<HTMLElement, StepperSeparatorProps>(function StepperSeparator(
  { className, ...props },
  ref
) {
  return createElement("ds-stepper-separator", { ref, class: className, ...props });
});
StepperSeparator.displayName = "Stepper.Separator";

const StepperContent = forwardRef<HTMLElement, StepperContentProps>(function StepperContent(
  { children, className, ...props },
  ref
) {
  return createElement("ds-stepper-content", { ref, class: className, ...props }, children);
});
StepperContent.displayName = "Stepper.Content";

// ============================================================================
// Compound Component
// ============================================================================

export const Stepper = {
  Root: StepperRoot,
  Item: StepperItem,
  Trigger: StepperTrigger,
  Indicator: StepperIndicator,
  Title: StepperTitle,
  Description: StepperDescription,
  Separator: StepperSeparator,
  Content: StepperContent,
};

export {
  StepperRoot,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperDescription,
  StepperSeparator,
  StepperContent,
};
