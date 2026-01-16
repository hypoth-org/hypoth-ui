/**
 * Combobox Input component - text input with autocomplete.
 */

import { type InputHTMLAttributes, forwardRef, useCallback, useRef } from "react";
import { useComboboxContext } from "./combobox-context.js";

export interface ComboboxInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  /** Render as child element (polymorphic) */
  asChild?: boolean;
}

/**
 * Text input for the combobox.
 *
 * @example
 * ```tsx
 * <Combobox.Input placeholder="Search..." />
 * ```
 */
export const ComboboxInput = forwardRef<HTMLInputElement, ComboboxInputProps>(
  ({ onKeyDown, onFocus, ...restProps }, ref) => {
    const {
      behavior,
      open,
      setOpen,
      inputValue,
      setInputValue,
      highlightedValue,
      setHighlightedValue,
    } = useComboboxContext("Combobox.Input");
    const internalRef = useRef<HTMLInputElement>(null);

    // Handle input change
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        behavior.setInputValue(value);
        setInputValue(value);

        // Auto-open on input
        if (value && !open) {
          behavior.open();
          setOpen(true);
        }
      },
      [behavior, open, setOpen, setInputValue]
    );

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!open) {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            behavior.open();
            setOpen(true);
          }
          onKeyDown?.(event);
          return;
        }

        switch (event.key) {
          case "Enter":
            event.preventDefault();
            if (highlightedValue) {
              behavior.select(highlightedValue);
            }
            break;
          case "Escape":
            event.preventDefault();
            behavior.close();
            setOpen(false);
            break;
          case "ArrowDown":
            event.preventDefault();
            behavior.highlightNext();
            setHighlightedValue(behavior.state.highlightedValue);
            break;
          case "ArrowUp":
            event.preventDefault();
            behavior.highlightPrev();
            setHighlightedValue(behavior.state.highlightedValue);
            break;
          case "Home":
            if (event.currentTarget.selectionStart === 0) {
              event.preventDefault();
              behavior.highlightFirst();
              setHighlightedValue(behavior.state.highlightedValue);
            }
            break;
          case "End":
            if (event.currentTarget.selectionEnd === event.currentTarget.value.length) {
              event.preventDefault();
              behavior.highlightLast();
              setHighlightedValue(behavior.state.highlightedValue);
            }
            break;
          case "Tab":
            behavior.close();
            setOpen(false);
            break;
        }

        onKeyDown?.(event);
      },
      [behavior, open, setOpen, highlightedValue, setHighlightedValue, onKeyDown]
    );

    // Handle focus
    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLInputElement>) => {
        onFocus?.(event);
      },
      [onFocus]
    );

    // Get input props from behavior
    const inputProps = behavior.getInputProps();

    // Merge refs
    const mergedRef = useCallback(
      (element: HTMLInputElement | null) => {
        (internalRef as React.MutableRefObject<HTMLInputElement | null>).current = element;
        if (typeof ref === "function") {
          ref(element);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = element;
        }
      },
      [ref]
    );

    return (
      <input
        ref={mergedRef}
        type="text"
        role={inputProps.role}
        aria-expanded={open}
        aria-haspopup={inputProps["aria-haspopup"]}
        aria-controls={inputProps["aria-controls"]}
        aria-activedescendant={
          open && highlightedValue ? `combobox-option-${highlightedValue}` : undefined
        }
        aria-autocomplete={inputProps["aria-autocomplete"]}
        aria-busy={inputProps["aria-busy"]}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        data-state={open ? "open" : "closed"}
        {...restProps}
      />
    );
  }
);

ComboboxInput.displayName = "Combobox.Input";
