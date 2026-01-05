"use client";

/**
 * Client-side entry point for React components.
 *
 * This module exports interactive components that require client-side JavaScript.
 * Use this entry point in Next.js App Router client components.
 *
 * @example
 * ```tsx
 * "use client";
 * import { Button, Input, Link } from "@ds/react/client";
 * ```
 *
 * For type-only imports in server components, use the main entry point:
 * @example
 * ```tsx
 * import type { ButtonProps, InputProps } from "@ds/react";
 * ```
 */

// Components (all are client-only due to event handlers and refs)
export {
  Button,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from "./components/button.js";
export { Input, type InputProps, type InputType, type InputSize } from "./components/input.js";
export { Link, type LinkProps, type LinkVariant } from "./components/link.js";
export { Icon, type IconProps, type IconName, type IconSize } from "./components/icon.js";
export { Spinner, type SpinnerProps, type SpinnerSize } from "./components/spinner.js";
export { VisuallyHidden, type VisuallyHiddenProps } from "./components/visually-hidden.js";
export {
  Text,
  type TextProps,
  type TextSize,
  type TextWeight,
  type TextVariant,
} from "./components/text.js";

// Primitives
export { Box, type BoxProps } from "./primitives/box.js";
export { Slot, type SlotProps } from "./primitives/slot.js";

// Utilities
export { createEventHandler, attachEventListeners } from "./utils/events.js";
export { createComponent, type WrapperConfig } from "./utils/create-component.js";
export {
  composeEventHandlers,
  mergeClassNames,
  mergeStyles,
  mergeProps,
} from "./utils/merge-props.js";
