import type React from "react";
import {
  type HTMLAttributes,
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";

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
    const customEvent = event as CustomEvent<{ checked: boolean }>;
    onChangeRef.current?.(customEvent.detail.checked, event);
  }, []);

  // Handle change events - no handler deps needed
  useEffect(() => {
    const element = internalRef.current;
    if (!element) return;

    element.addEventListener("ds:change", handleChange);
    return () => element.removeEventListener("ds:change", handleChange);
  }, [handleChange]);

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
