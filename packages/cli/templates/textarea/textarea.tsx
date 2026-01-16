import type React from "react";
import {
  type TextareaHTMLAttributes,
  createElement,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  type ResponsiveProp,
  generateResponsiveDataAttr,
  isResponsiveObject,
  resolveResponsiveValue,
} from "../primitives/responsive.js";

export type TextareaSize = "sm" | "md" | "lg";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "onInput"> {
  /**
   * Textarea size - supports responsive object syntax
   * @example
   * ```tsx
   * // Single value
   * <Textarea size="md" />
   *
   * // Responsive
   * <Textarea size={{ base: "sm", md: "md", lg: "lg" }} />
   * ```
   */
  size?: ResponsiveProp<TextareaSize>;
  /** Error state */
  error?: boolean;
  /** Auto-resize to fit content */
  autoResize?: boolean;
  /** Change handler */
  onChange?: (value: string, event: Event) => void;
  /** Value change handler - fires on every keystroke */
  onValueChange?: (value: string, event: Event) => void;
}

/**
 * React wrapper for ds-textarea Web Component.
 * Multi-line text input with auto-resize support.
 */
export const Textarea = forwardRef<HTMLElement, TextareaProps>((props, forwardedRef) => {
  const {
    size = "md",
    name,
    value,
    placeholder,
    disabled = false,
    readOnly = false,
    required = false,
    error = false,
    autoResize = false,
    rows,
    minLength,
    maxLength,
    onChange,
    onValueChange,
    className,
    ...rest
  } = props;

  const internalRef = useRef<HTMLElement>(null);

  // Store handlers in refs for stable callback references
  const onChangeRef = useRef(onChange);
  const onValueChangeRef = useRef(onValueChange);
  onChangeRef.current = onChange;
  onValueChangeRef.current = onValueChange;

  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = internalRef.current;
    }
  }, [forwardedRef]);

  // Stable handlers that read from refs
  const handleInputEvent = useCallback((event: Event) => {
    const customEvent = event as CustomEvent<{ value: string }>;
    onValueChangeRef.current?.(customEvent.detail.value, event);
  }, []);

  const handleChangeEvent = useCallback((event: Event) => {
    const customEvent = event as CustomEvent<{ value: string }>;
    onChangeRef.current?.(customEvent.detail.value, event);
  }, []);

  // Handle events - no handler deps needed
  useEffect(() => {
    const element = internalRef.current;
    if (!element) return;

    element.addEventListener("input", handleInputEvent);
    element.addEventListener("change", handleChangeEvent);

    return () => {
      element.removeEventListener("input", handleInputEvent);
      element.removeEventListener("change", handleChangeEvent);
    };
  }, [handleInputEvent, handleChangeEvent]);

  // Resolve responsive size - use base value for the WC attribute
  const resolvedSize = resolveResponsiveValue(size, "md");
  const isResponsive = isResponsiveObject(size);
  const responsiveSizeAttr = isResponsive ? generateResponsiveDataAttr(size) : undefined;

  return createElement("ds-textarea", {
    ref: internalRef,
    size: resolvedSize,
    name,
    value,
    placeholder,
    disabled: disabled || undefined,
    readonly: readOnly || undefined,
    required: required || undefined,
    error: error || undefined,
    "auto-resize": autoResize || undefined,
    rows,
    minlength: minLength,
    maxlength: maxLength,
    class: className,
    // Add responsive data attribute for CSS targeting
    "data-size-responsive": responsiveSizeAttr,
    ...rest,
  });
});

Textarea.displayName = "Textarea";
