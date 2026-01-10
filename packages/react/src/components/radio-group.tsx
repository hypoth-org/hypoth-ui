import type React from "react";
import {
  type HTMLAttributes,
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";

export type RadioOrientation = "horizontal" | "vertical";

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** Group name */
  name?: string;
  /** Selected value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Whether disabled */
  disabled?: boolean;
  /** Whether required */
  required?: boolean;
  /** Layout orientation */
  orientation?: RadioOrientation;
  /** Change handler */
  onChange?: (value: string, event: Event) => void;
  /** Radio options */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-radio-group Web Component.
 * Radio group with roving focus.
 */
export const RadioGroup = forwardRef<HTMLElement, RadioGroupProps>((props, forwardedRef) => {
  const {
    name,
    value,
    defaultValue,
    disabled = false,
    required = false,
    orientation = "vertical",
    onChange,
    children,
    className,
    ...rest
  } = props;

  const internalRef = useRef<HTMLElement>(null);

  // Store handler in ref for stable callback reference
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = internalRef.current;
    }
  }, [forwardedRef]);

  // Stable handler that reads from ref
  const handleChange = useCallback((event: Event) => {
    const customEvent = event as CustomEvent<{ value: string }>;
    onChangeRef.current?.(customEvent.detail.value, event);
  }, []);

  // Handle change events - no handler deps needed
  useEffect(() => {
    const element = internalRef.current;
    if (!element) return;

    element.addEventListener("ds:change", handleChange);
    return () => element.removeEventListener("ds:change", handleChange);
  }, [handleChange]);

  return createElement(
    "ds-radio-group",
    {
      ref: internalRef,
      name,
      value,
      "default-value": defaultValue,
      disabled: disabled || undefined,
      required: required || undefined,
      orientation,
      class: className,
      ...rest,
    },
    children
  );
});

RadioGroup.displayName = "RadioGroup";
