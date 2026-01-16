import type { ReactNode } from "react";
import { createElement, forwardRef } from "react";
import { Slot } from "../primitives/slot.js";
import type { AsChildProps } from "../types/polymorphic.js";
import { mergeClassNames } from "../utils/merge-props.js";

export type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type TextWeight = "normal" | "medium" | "semibold" | "bold";
export type TextVariant = "default" | "muted" | "success" | "warning" | "error";

export interface TextProps extends AsChildProps {
  /** Text size */
  size?: TextSize;
  /** Font weight */
  weight?: TextWeight;
  /** Color variant */
  variant?: TextVariant;
  /** Truncate text with ellipsis */
  truncate?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Text content */
  children?: ReactNode;
}

/**
 * Maps text props to CSS utility classes.
 */
function buildTextClasses(props: TextProps): string[] {
  const classes: string[] = [];

  // Size
  if (props.size) {
    classes.push(`ds-text-${props.size}`);
  }

  // Weight
  if (props.weight) {
    classes.push(`ds-font-${props.weight}`);
  }

  // Variant (color)
  if (props.variant && props.variant !== "default") {
    classes.push(`ds-text-${props.variant}`);
  }

  // Truncate
  if (props.truncate) {
    classes.push("ds-truncate");
  }

  return classes;
}

/**
 * Text is a typography primitive that applies consistent text styling.
 * Supports asChild for semantic HTML elements (h1-h6, p, etc.).
 *
 * @example
 * ```tsx
 * <Text size="lg" weight="bold">Large bold text</Text>
 *
 * <Text size="2xl" weight="bold" asChild>
 *   <h1>Page Title</h1>
 * </Text>
 *
 * <Text variant="muted" asChild>
 *   <p>Muted paragraph text</p>
 * </Text>
 * ```
 */
export const Text = forwardRef<HTMLElement, TextProps>((props, ref) => {
  const {
    asChild = false,
    size = "md",
    weight = "normal",
    variant = "default",
    truncate = false,
    className,
    children,
    ...rest
  } = props;

  const textClasses = buildTextClasses({ size, weight, variant, truncate });
  const allClasses = mergeClassNames(...textClasses, className);

  const Component = asChild ? Slot : "span";

  return createElement(
    Component,
    {
      ref,
      className: allClasses || undefined,
      ...rest,
    },
    children
  );
});

Text.displayName = "Text";
