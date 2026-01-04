/**
 * Main entry point for @ds/react package.
 *
 * This module provides server-safe exports that can be imported in Next.js
 * App Router server components. Types have no runtime cost.
 *
 * For interactive components, import from the client entry point:
 * @example
 * ```tsx
 * "use client";
 * import { Button, Input } from "@ds/react/client";
 * ```
 *
 * For type-only imports in server components:
 * @example
 * ```tsx
 * import type { ButtonProps, InputProps } from "@ds/react";
 * ```
 */

// Component types (server-safe, no runtime code)
export type { ButtonProps, ButtonVariant, ButtonSize } from "./components/button.js";
export type { InputProps, InputType, InputSize } from "./components/input.js";
export type { LinkProps, LinkVariant } from "./components/link.js";
export type { IconProps, IconName, IconSize } from "./components/icon.js";
export type { SpinnerProps, SpinnerSize } from "./components/spinner.js";
export type { VisuallyHiddenProps } from "./components/visually-hidden.js";
export type { TextProps, TextSize, TextWeight, TextVariant } from "./components/text.js";

// Primitive types (server-safe, no runtime code)
export type { BoxProps } from "./primitives/box.js";
export type { SlotProps } from "./primitives/slot.js";

// Utility types
export type { WrapperConfig } from "./utils/create-component.js";

// Event types (server-safe, no runtime code)
export type {
  DsNavigateEventDetail,
  DsInputEventDetail,
  NavigateEventHandler,
  InputValueHandler,
} from "./types/events.js";

// Polymorphic types (server-safe, no runtime code)
export type {
  SpacingValue,
  DisplayValue,
  FlexDirection,
  AlignValue,
  JustifyValue,
  AsChildProps,
} from "./types/polymorphic.js";

// Re-export components from client entry for backwards compatibility
// These will include the 'use client' directive when bundled
export { Button } from "./components/button.js";
export { Input } from "./components/input.js";
export { Link } from "./components/link.js";
export { Icon } from "./components/icon.js";
export { Spinner } from "./components/spinner.js";
export { VisuallyHidden } from "./components/visually-hidden.js";
export { Text } from "./components/text.js";
export { Box } from "./primitives/box.js";
export { Slot } from "./primitives/slot.js";

// Utilities
export { createEventHandler, attachEventListeners } from "./utils/events.js";
export { createComponent } from "./utils/create-component.js";
export { composeEventHandlers, mergeClassNames, mergeStyles, mergeProps } from "./utils/merge-props.js";
