/**
 * PinInput Field component - individual digit input field.
 */

import {
  type ClipboardEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { usePinInputContext } from "./pin-input-context.js";

export interface PinInputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> {
  /** Field index (0-based) */
  index: number;
}

/**
 * Individual input field for a single PIN digit.
 *
 * @example
 * ```tsx
 * <PinInput.Field index={0} />
 * <PinInput.Field index={1} />
 * <PinInput.Field index={2} />
 * ```
 */
export const PinInputField = forwardRef<HTMLInputElement, PinInputFieldProps>(
  ({ index, className, onFocus, onBlur, onKeyDown, onPaste, ...restProps }, ref) => {
    const { behavior, focusedIndex, setFocusedIndex, registerInput, focusInput, disabled, mask } =
      usePinInputContext("PinInput.Field");

    const internalRef = useRef<HTMLInputElement>(null);
    const inputProps = behavior.getInputProps(index);
    const value = behavior.getValueAt(index);
    const isFocused = focusedIndex === index;

    // Register ref with context
    useEffect(() => {
      const element = internalRef.current;
      registerInput(index, element);

      return () => {
        registerInput(index, null);
      };
    }, [index, registerInput]);

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

    const handleInput = useCallback(
      (event: React.FormEvent<HTMLInputElement>) => {
        const input = event.currentTarget;
        const char = input.value.slice(-1);

        if (char) {
          behavior.input(index, char);

          // Auto-advance to next input
          const nextIndex = behavior.state.focusedIndex;
          if (nextIndex !== null && nextIndex !== index) {
            focusInput(nextIndex);
          }
        }

        // Reset input value to single character
        input.value = behavior.getValueAt(index);
      },
      [behavior, index, focusInput]
    );

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLInputElement>) => {
        switch (event.key) {
          case "Backspace": {
            event.preventDefault();
            behavior.backspace(index);
            const prevIndex = behavior.state.focusedIndex;
            if (prevIndex !== null && prevIndex !== index) {
              focusInput(prevIndex);
            }
            break;
          }
          case "ArrowLeft":
            event.preventDefault();
            behavior.focusPrev();
            if (behavior.state.focusedIndex !== null) {
              focusInput(behavior.state.focusedIndex);
            }
            break;
          case "ArrowRight":
            event.preventDefault();
            behavior.focusNext();
            if (behavior.state.focusedIndex !== null) {
              focusInput(behavior.state.focusedIndex);
            }
            break;
          case "Delete": {
            event.preventDefault();
            const chars = behavior.state.value.split("");
            chars[index] = " ";
            behavior.setValue(chars.join(""));
            break;
          }
        }

        onKeyDown?.(event);
      },
      [behavior, index, focusInput, onKeyDown]
    );

    const handlePaste = useCallback(
      (event: ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pastedText = event.clipboardData.getData("text");
        if (pastedText) {
          behavior.paste(pastedText);
          if (behavior.state.focusedIndex !== null) {
            focusInput(behavior.state.focusedIndex);
          }
        }
        onPaste?.(event);
      },
      [behavior, focusInput, onPaste]
    );

    const handleFocus = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        setFocusedIndex(index);
        behavior.focus(index);
        event.currentTarget.select();
        onFocus?.(event);
      },
      [behavior, index, setFocusedIndex, onFocus]
    );

    const handleBlur = useCallback(
      (event: FocusEvent<HTMLInputElement>) => {
        setFocusedIndex(null);
        onBlur?.(event);
      },
      [setFocusedIndex, onBlur]
    );

    return (
      <input
        ref={mergedRef}
        type={mask ? "password" : inputProps.type}
        inputMode={inputProps.inputMode}
        maxLength={inputProps.maxLength}
        autoComplete={inputProps.autoComplete}
        aria-label={inputProps["aria-label"]}
        tabIndex={inputProps.tabIndex}
        value={value}
        disabled={disabled}
        className={className}
        data-index={index}
        data-focused={isFocused || undefined}
        data-filled={value ? true : undefined}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...restProps}
      />
    );
  }
);

PinInputField.displayName = "PinInput.Field";
