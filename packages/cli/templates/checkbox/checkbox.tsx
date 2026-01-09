import type React from "react";
import { type HTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";

export interface CheckboxProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** Checkbox name */
  name?: string;
  /** Checkbox value */
  value?: string;
  /** Whether checked */
  checked?: boolean;
  /** Default checked state (uncontrolled) */
  defaultChecked?: boolean;
  /** Whether disabled */
  disabled?: boolean;
  /** Whether required */
  required?: boolean;
  /** Indeterminate state */
  indeterminate?: boolean;
  /** Change handler */
  onChange?: (checked: boolean, event: Event) => void;
  /** Checkbox label content */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-checkbox Web Component.
 * Checkbox input with tri-state support.
 */
export const Checkbox = forwardRef<HTMLElement, CheckboxProps>((props, forwardedRef) => {
  const {
    name,
    value,
    checked,
    defaultChecked,
    disabled = false,
    required = false,
    indeterminate = false,
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
      const customEvent = event as CustomEvent<{ checked: boolean }>;
      onChange(customEvent.detail.checked, event);
    };

    element.addEventListener("ds:change", handleChange);
    return () => element.removeEventListener("ds:change", handleChange);
  }, [onChange]);

  return createElement(
    "ds-checkbox",
    {
      ref: internalRef,
      name,
      value,
      checked: checked || undefined,
      "default-checked": defaultChecked || undefined,
      disabled: disabled || undefined,
      required: required || undefined,
      indeterminate: indeterminate || undefined,
      class: className,
      ...rest,
    },
    children
  );
});

Checkbox.displayName = "Checkbox";
