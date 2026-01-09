/**
 * Native React Button component using createButtonBehavior.
 * Provides accessible button with loading and disabled states.
 */

import { type ButtonBehaviorOptions, createButtonBehavior } from "@hypoth-ui/primitives-dom";
import {
  type ButtonHTMLAttributes,
  type ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { Slot } from "@/lib/primitives/slot";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "disabled"> {
  /** Button content */
  children?: ReactNode;
  /** Button type */
  type?: "button" | "submit" | "reset";
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether button is in loading state */
  loading?: boolean;
  /** Render as child element (polymorphic) */
  asChild?: boolean;
  /** Called when button is activated */
  onPress?: () => void;
}

/**
 * Accessible button component with loading and disabled states.
 *
 * @example
 * ```tsx
 * <Button onPress={() => console.log("clicked")}>Click me</Button>
 *
 * <Button loading>Saving...</Button>
 *
 * <Button asChild>
 *   <a href="/link">Link styled as button</a>
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      type = "button",
      disabled = false,
      loading = false,
      asChild = false,
      onPress,
      onClick,
      onKeyDown,
      ...restProps
    },
    ref
  ) => {
    // Create behavior instance - intentionally created once with initial values
    // biome-ignore lint/correctness/useExhaustiveDependencies: behavior is created once, updates handled via setState
    const behavior = useMemo(() => {
      const options: ButtonBehaviorOptions = {
        disabled,
        loading,
        type,
        onActivate: onPress,
      };
      return createButtonBehavior(options);
    }, []);

    // Update behavior state when props change
    useEffect(() => {
      behavior.setState({ disabled, loading, type });
    }, [behavior, disabled, loading, type]);

    // Get button props from behavior
    const buttonProps = behavior.getButtonProps();

    // Handle keyboard events
    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        behavior.handleKeyDown(event.nativeEvent);
        onKeyDown?.(event);
      },
      [behavior, onKeyDown]
    );

    // Handle click events
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        behavior.handleClick(event.nativeEvent);
        onClick?.(event);
      },
      [behavior, onClick]
    );

    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref}
        type={asChild ? undefined : buttonProps.type}
        aria-disabled={buttonProps["aria-disabled"]}
        aria-busy={buttonProps["aria-busy"]}
        tabIndex={buttonProps.tabIndex}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...restProps}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = "Button";
