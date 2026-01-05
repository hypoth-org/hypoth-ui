import type React from "react";
import { type HTMLAttributes, createElement, forwardRef, useEffect, useRef } from "react";

export interface RadioProps extends HTMLAttributes<HTMLElement> {
  /** Radio value */
  value: string;
  /** Whether disabled */
  disabled?: boolean;
  /** Radio label content */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-radio Web Component.
 * Individual radio option within a RadioGroup.
 */
export const Radio = forwardRef<HTMLElement, RadioProps>((props, forwardedRef) => {
  const { value, disabled = false, children, className, ...rest } = props;

  const internalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = internalRef.current;
    }
  }, [forwardedRef]);

  return createElement(
    "ds-radio",
    {
      ref: internalRef,
      value,
      disabled: disabled || undefined,
      class: className,
      ...rest,
    },
    children
  );
});

Radio.displayName = "Radio";
