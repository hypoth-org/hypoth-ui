"use client";

/**
 * FocusScope React Component
 *
 * Manages focus within a container with optional trapping, auto-focus,
 * and focus restoration. Essential for accessible modal dialogs and overlays.
 */

import { type FocusScopeOptions, createFocusScope } from "@ds/primitives-dom";
import {
  type ReactNode,
  type RefObject,
  createElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export interface FocusScopeProps {
  /** Content to wrap with focus management */
  children: ReactNode;
  /** Whether to trap focus within the scope */
  trap?: boolean;
  /** Whether to restore focus to the previously focused element on unmount */
  restoreFocus?: boolean;
  /** Whether to auto-focus the first focusable element on mount */
  autoFocus?: boolean;
  /** Ref to element to focus on mount (overrides autoFocus behavior) */
  initialFocus?: RefObject<HTMLElement>;
  /** Ref to element to restore focus to on unmount */
  returnFocus?: RefObject<HTMLElement>;
  /** Callback when focus leaves the scope (only when trap is false) */
  onFocusOutside?: (event: FocusEvent) => void;
  /** Whether the focus scope is active */
  active?: boolean;
  /** Additional class name for the wrapper */
  className?: string;
  /** Render as a different element */
  as?: keyof JSX.IntrinsicElements;
}

export interface FocusScopeRef {
  /** Focus the first focusable element */
  focusFirst: () => void;
  /** Focus the last focusable element */
  focusLast: () => void;
  /** Get all focusable elements */
  getFocusableElements: () => HTMLElement[];
}

/**
 * FocusScope component for managing focus within a container.
 *
 * @example
 * ```tsx
 * // Basic modal usage
 * <FocusScope trap restoreFocus autoFocus>
 *   <div role="dialog" aria-modal="true">
 *     <input placeholder="First input" />
 *     <button>Close</button>
 *   </div>
 * </FocusScope>
 *
 * // With initial focus
 * const submitRef = useRef<HTMLButtonElement>(null);
 *
 * <FocusScope trap restoreFocus initialFocus={submitRef}>
 *   <input />
 *   <button ref={submitRef}>Submit</button>
 * </FocusScope>
 *
 * // Controlled activation
 * <FocusScope trap active={isOpen}>
 *   {children}
 * </FocusScope>
 * ```
 */
export const FocusScope = forwardRef<FocusScopeRef, FocusScopeProps>(
  (
    {
      children,
      trap = true,
      restoreFocus = true,
      autoFocus = true,
      initialFocus,
      returnFocus,
      onFocusOutside,
      active = true,
      className,
      as: Component = "div",
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scopeRef = useRef<ReturnType<typeof createFocusScope> | null>(null);

    // Expose imperative methods
    useImperativeHandle(ref, () => ({
      focusFirst: () => scopeRef.current?.focusFirst(),
      focusLast: () => scopeRef.current?.focusLast(),
      getFocusableElements: () => scopeRef.current?.getFocusableElements() ?? [],
    }));

    // Create and manage the focus scope
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const options: FocusScopeOptions = {
        trap,
        restoreFocus,
        autoFocus,
        initialFocus: initialFocus?.current ?? null,
        returnFocus: returnFocus?.current ?? null,
        onFocusOutside,
      };

      scopeRef.current = createFocusScope(container, options);

      if (active) {
        scopeRef.current.activate();
      }

      return () => {
        scopeRef.current?.deactivate();
        scopeRef.current = null;
      };
    }, [trap, restoreFocus, autoFocus, initialFocus, returnFocus, onFocusOutside, active]);

    // Handle active prop changes
    useEffect(() => {
      if (!scopeRef.current) return;

      if (active) {
        scopeRef.current.activate();
      } else {
        scopeRef.current.deactivate();
      }
    }, [active]);

    return createElement(Component, { ref: containerRef, className }, children);
  }
);

FocusScope.displayName = "FocusScope";
