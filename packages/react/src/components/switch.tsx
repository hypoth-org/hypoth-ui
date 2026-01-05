import type React from "react";
import { type HTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";

export interface SwitchProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  /** Switch name */
  name?: string;
  /** Whether checked/on */
  checked?: boolean;
  /** Default checked state (uncontrolled) */
  defaultChecked?: boolean;
  /** Whether disabled */
  disabled?: boolean;
  /** Whether required */
  required?: boolean;
  /** Change handler */
  onChange?: (checked: boolean, event: Event) => void;
  /** Switch label content */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-switch Web Component.
 * Toggle switch with role="switch".
 */
export const Switch = forwardRef<HTMLElement, SwitchProps>((props, forwardedRef) => {
  const {
    name,
    checked,
    defaultChecked,
    disabled = false,
    required = false,
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
    "ds-switch",
    {
      ref: internalRef,
      name,
      checked: checked || undefined,
      "default-checked": defaultChecked || undefined,
      disabled: disabled || undefined,
      required: required || undefined,
      class: className,
      ...rest,
    },
    children
  );
});

Switch.displayName = "Switch";
