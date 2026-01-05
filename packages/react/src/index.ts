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

// Field component types
export type { FieldProps } from "./components/field/field.js";
export type { LabelProps } from "./components/field/label.js";
export type { FieldDescriptionProps } from "./components/field/field-description.js";
export type { FieldErrorProps } from "./components/field/field-error.js";

// Dialog component types
export type { DialogProps, DialogRole } from "./components/dialog/dialog.js";
export type { DialogContentProps, DialogContentSize } from "./components/dialog/dialog-content.js";
export type { DialogTitleProps } from "./components/dialog/dialog-title.js";
export type { DialogDescriptionProps } from "./components/dialog/dialog-description.js";

// Form control types
export type { TextareaProps, TextareaSize } from "./components/textarea.js";
export type { CheckboxProps } from "./components/checkbox.js";
export type { RadioGroupProps, RadioOrientation } from "./components/radio-group.js";
export type { RadioProps } from "./components/radio.js";
export type { SwitchProps } from "./components/switch.js";

// Overlay component types
export type { PopoverProps, Placement } from "./components/popover.js";
export type { PopoverContentProps } from "./components/popover-content.js";
export type { TooltipProps } from "./components/tooltip.js";
export type { TooltipContentProps } from "./components/tooltip-content.js";
export type { MenuProps } from "./components/menu.js";
export type { MenuContentProps } from "./components/menu-content.js";
export type { MenuItemProps } from "./components/menu-item.js";

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

// Field components
export { Field } from "./components/field/field.js";
export { Label } from "./components/field/label.js";
export { FieldDescription } from "./components/field/field-description.js";
export { FieldError } from "./components/field/field-error.js";

// Dialog components
export { Dialog } from "./components/dialog/dialog.js";
export { DialogContent } from "./components/dialog/dialog-content.js";
export { DialogTitle } from "./components/dialog/dialog-title.js";
export { DialogDescription } from "./components/dialog/dialog-description.js";

// Form controls
export { Textarea } from "./components/textarea.js";
export { Checkbox } from "./components/checkbox.js";
export { RadioGroup } from "./components/radio-group.js";
export { Radio } from "./components/radio.js";
export { Switch } from "./components/switch.js";

// Overlay components
export { Popover } from "./components/popover.js";
export { PopoverContent } from "./components/popover-content.js";
export { Tooltip } from "./components/tooltip.js";
export { TooltipContent } from "./components/tooltip-content.js";
export { Menu } from "./components/menu.js";
export { MenuContent } from "./components/menu-content.js";
export { MenuItem } from "./components/menu-item.js";

// Utilities
export { createEventHandler, attachEventListeners } from "./utils/events.js";
export { createComponent } from "./utils/create-component.js";
export {
  composeEventHandlers,
  mergeClassNames,
  mergeStyles,
  mergeProps,
} from "./utils/merge-props.js";
