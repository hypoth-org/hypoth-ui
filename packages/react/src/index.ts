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
export type { ButtonProps } from "./components/button/index.js";
export type {
  ButtonProps as LegacyButtonProps,
  ButtonVariant,
  ButtonSize,
} from "./components/button.js";
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
export type {
  DialogRole,
  DialogRootProps,
  DialogTriggerProps,
  DialogContentProps,
  DialogContentSize,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogCloseProps,
} from "./components/dialog/index.js";

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

// Menu compound component types
export type {
  MenuRootProps,
  MenuTriggerProps,
  MenuContentProps,
  MenuItemProps,
  MenuSeparatorProps,
  MenuLabelProps,
} from "./components/menu/index.js";

// Select compound component types
export type {
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectContentProps,
  SelectOptionProps,
  SelectSeparatorProps,
  SelectLabelProps,
} from "./components/select/index.js";

// Combobox compound component types
export type {
  ComboboxRootProps,
  ComboboxInputProps,
  ComboboxContentProps,
  ComboboxOptionProps,
  ComboboxTagProps,
  ComboboxEmptyProps,
  ComboboxLoadingProps,
} from "./components/combobox/index.js";

// DatePicker compound component types
export type {
  DatePickerRootProps,
  DatePickerTriggerProps,
  DatePickerContentProps,
  DatePickerCalendarProps,
  DatePickerMode,
} from "./components/date-picker/index.js";

// Slider compound component types
export type {
  SliderRootProps,
  SliderTrackProps,
  SliderRangeProps,
  SliderThumbProps,
} from "./components/slider/index.js";

// NumberInput compound component types
export type {
  NumberInputRootProps,
  NumberInputFieldProps,
  NumberInputIncrementProps,
  NumberInputDecrementProps,
  NumberInputFormat,
} from "./components/number-input/index.js";

// FileUpload compound component types
export type {
  FileUploadRootProps,
  FileUploadDropzoneProps,
  FileUploadInputProps,
  FileUploadItemProps,
  FileInfo,
  FileUploadError,
} from "./components/file-upload/index.js";

// TimePicker compound component types
export type {
  TimePickerRootProps,
  TimePickerSegmentProps,
  TimeValue,
  TimeSegment,
} from "./components/time-picker/index.js";

// PinInput compound component types
export type {
  PinInputRootProps,
  PinInputFieldProps,
} from "./components/pin-input/index.js";

// Primitive types (server-safe, no runtime code)
export type { BoxProps } from "./primitives/box.js";
export type { SlotProps } from "./primitives/slot.js";
export type { PresenceProps } from "./primitives/Presence.js";
export type { UsePresenceOptions, UsePresenceReturn } from "./primitives/use-presence.js";

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
export { Button } from "./components/button/index.js";
export { Button as LegacyButton } from "./components/button.js";
export { Input } from "./components/input.js";
export { Link } from "./components/link.js";
export { Icon } from "./components/icon.js";
export { Spinner } from "./components/spinner.js";
export { VisuallyHidden } from "./components/visually-hidden.js";
export { Text } from "./components/text.js";
export { Box } from "./primitives/box.js";
export { Slot } from "./primitives/slot.js";
export { Presence } from "./primitives/Presence.js";
export { usePresence } from "./primitives/use-presence.js";

// Field components
export { Field } from "./components/field/field.js";
export { Label } from "./components/field/label.js";
export { FieldDescription } from "./components/field/field-description.js";
export { FieldError } from "./components/field/field-error.js";

// Dialog compound component
export { Dialog } from "./components/dialog/index.js";

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

// Menu compound component
export { Menu } from "./components/menu/index.js";

// Select compound component
export { Select } from "./components/select/index.js";

// Combobox compound component
export { Combobox } from "./components/combobox/index.js";

// DatePicker compound component
export { DatePicker } from "./components/date-picker/index.js";

// Slider compound component
export { Slider } from "./components/slider/index.js";

// NumberInput compound component
export { NumberInput } from "./components/number-input/index.js";

// FileUpload compound component
export { FileUpload, formatBytes } from "./components/file-upload/index.js";

// TimePicker compound component
export { TimePicker } from "./components/time-picker/index.js";

// PinInput compound component
export { PinInput } from "./components/pin-input/index.js";

// Card compound component
export { Card } from "./components/card/index.js";
export type {
  CardRootProps,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
} from "./components/card/index.js";

// Separator component
export { Separator } from "./components/separator/index.js";
export type { SeparatorProps, SeparatorOrientation } from "./components/separator/index.js";

// AspectRatio component
export { AspectRatio } from "./components/aspect-ratio/index.js";
export type { AspectRatioProps } from "./components/aspect-ratio/index.js";

// Collapsible compound component
export { Collapsible } from "./components/collapsible/index.js";
export type {
  CollapsibleRootProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
} from "./components/collapsible/index.js";

// Tabs compound component
export { Tabs } from "./components/tabs/index.js";
export type {
  TabsRootProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TabsOrientation,
  TabsActivationMode,
} from "./components/tabs/index.js";

// Accordion compound component
export { Accordion } from "./components/accordion/index.js";
export type {
  AccordionRootProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
  AccordionType,
  AccordionOrientation,
} from "./components/accordion/index.js";

// AlertDialog compound component
export { AlertDialog } from "./components/alert-dialog/index.js";
export type {
  AlertDialogRootProps,
  AlertDialogTriggerProps,
  AlertDialogContentProps,
  AlertDialogContentSize,
  AlertDialogHeaderProps,
  AlertDialogFooterProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
  AlertDialogActionProps,
  AlertDialogCancelProps,
} from "./components/alert-dialog/index.js";

// Sheet compound component
export { Sheet } from "./components/sheet/index.js";
export type {
  SheetRootProps,
  SheetTriggerProps,
  SheetContentProps,
  SheetSide,
  SheetContentSize,
  SheetHeaderProps,
  SheetFooterProps,
  SheetTitleProps,
  SheetDescriptionProps,
  SheetCloseProps,
} from "./components/sheet/index.js";

// Drawer compound component
export { Drawer } from "./components/drawer/index.js";
export type {
  DrawerRootProps,
  DrawerTriggerProps,
  DrawerContentProps,
  DrawerSide,
  DrawerHeaderProps,
  DrawerFooterProps,
  DrawerTitleProps,
  DrawerDescriptionProps,
} from "./components/drawer/index.js";

// DropdownMenu compound component
export { DropdownMenu } from "./components/dropdown-menu/index.js";
export type {
  DropdownMenuRootProps,
  DropdownMenuTriggerProps,
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuSeparatorProps,
  DropdownMenuLabelProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioGroupProps,
  DropdownMenuRadioItemProps,
  DropdownMenuPlacement,
  DropdownMenuItemVariant,
} from "./components/dropdown-menu/index.js";

// ContextMenu compound component
export { ContextMenu } from "./components/context-menu/index.js";
export type {
  ContextMenuRootProps,
  ContextMenuTriggerProps,
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuSeparatorProps,
  ContextMenuLabelProps,
  ContextMenuItemVariant,
} from "./components/context-menu/index.js";

// HoverCard compound component
export { HoverCard } from "./components/hover-card/index.js";
export type {
  HoverCardRootProps,
  HoverCardTriggerProps,
  HoverCardContentProps,
  HoverCardPlacement,
} from "./components/hover-card/index.js";

// NavigationMenu compound component
export { NavigationMenu } from "./components/navigation-menu/index.js";
export type {
  NavigationMenuRootProps,
  NavigationMenuListProps,
  NavigationMenuItemProps,
  NavigationMenuTriggerProps,
  NavigationMenuContentProps,
  NavigationMenuLinkProps,
  NavigationMenuIndicatorProps,
  NavigationMenuViewportProps,
  NavigationMenuOrientation,
} from "./components/navigation-menu/index.js";

// ScrollArea compound component
export { ScrollArea } from "./components/scroll-area/index.js";
export type {
  ScrollAreaRootProps,
  ScrollAreaViewportProps,
  ScrollAreaScrollbarProps,
  ScrollAreaThumbProps,
  ScrollAreaType,
} from "./components/scroll-area/index.js";

// Breadcrumb compound component
export { Breadcrumb } from "./components/breadcrumb/index.js";
export type {
  BreadcrumbRootProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
} from "./components/breadcrumb/index.js";

// Pagination compound component
export { Pagination } from "./components/pagination/index.js";
export type {
  PaginationRootProps,
  PaginationContentProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationPreviousProps,
  PaginationNextProps,
  PaginationEllipsisProps,
} from "./components/pagination/index.js";

// Stepper compound component
export { Stepper } from "./components/stepper/index.js";
export type {
  StepperRootProps,
  StepperItemProps,
  StepperTriggerProps,
  StepperIndicatorProps,
  StepperTitleProps,
  StepperDescriptionProps,
  StepperSeparatorProps,
  StepperContentProps,
  StepperOrientation,
} from "./components/stepper/index.js";

// Command compound component
export { Command } from "./components/command/index.js";
export type {
  CommandRootProps,
  CommandInputProps,
  CommandListProps,
  CommandItemProps,
  CommandGroupProps,
  CommandSeparatorProps,
  CommandEmptyProps,
  CommandLoadingProps,
} from "./components/command/index.js";

// Utilities
export { createEventHandler, attachEventListeners } from "./utils/events.js";
export { createComponent } from "./utils/create-component.js";
export {
  composeEventHandlers,
  mergeClassNames,
  mergeStyles,
  mergeProps,
} from "./utils/merge-props.js";
