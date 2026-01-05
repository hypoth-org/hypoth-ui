import type React from "react";
import { type HTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";

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

  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = internalRef.current;
    }
  }, [forwardedRef]);

  useEffect(() => {
    const element = internalRef.current;
    if (!element || !onChange) return;

    const handleChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ value: string }>;
      onChange(customEvent.detail.value, event);
    };

    element.addEventListener("ds:change", handleChange);
    return () => element.removeEventListener("ds:change", handleChange);
  }, [onChange]);

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
