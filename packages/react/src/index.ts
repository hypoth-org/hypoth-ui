/**
 * Main entry point for @hypoth-ui/react package.
 *
 * This module exports types and server-safe utilities only.
 * For runtime components, use the `/client` entry point:
 * @example
 * ```tsx
 * import type { ButtonProps, InputProps } from "@hypoth-ui/react";
 * import { DsButton, Input } from "@hypoth-ui/react/client";
 * ```
 */

// Component types (server-safe, no runtime code)
export type { ButtonProps } from "./components/button/index.js";
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
export type { PortalProps } from "./primitives/portal.js";
export type { FocusScopeProps, FocusScopeRef } from "./primitives/focus-scope.js";
export type { ClientOnlyProps } from "./primitives/client-only.js";

// Utility types
export type { WrapperConfig } from "./utils/create-component.js";

// Error boundary types and component
export type {
  ErrorBoundaryProps,
  ErrorBoundaryState,
  WithErrorBoundaryOptions,
} from "./utils/error-boundary.js";
export {
  ErrorBoundary,
  withErrorBoundary,
  DSErrorFallback,
} from "./utils/error-boundary.js";

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

// Loading state types (server-safe, no runtime code)
export type {
  LoadingProps,
  TableLoadingProps,
  TreeLoadingProps,
  LoadingState,
  OnLoadingChange,
} from "./types/loading.js";

// Pure utility functions (server-safe, no hooks/DOM)
export {
  composeEventHandlers,
  mergeClassNames,
  mergeStyles,
  mergeProps,
} from "./utils/merge-props.js";

// Server-safe theme utilities (no "use client" in source — designed for SSR/layout.tsx)
export {
  getThemeScriptContent,
  getThemeScriptTag,
  getThemeScriptProps,
  parseThemeCookie,
  getSystemColorMode,
  syncThemeStorage,
  DEFAULT_STORAGE_KEYS,
  DEFAULT_THEME,
  THEME_ATTRIBUTES,
} from "./theme/index.js";
export type {
  ColorMode,
  Density,
  ResolvedColorMode,
  ThemeConfig,
  ThemeContextValue,
  DensityContextValue,
  ThemeProviderProps,
  DensityProviderProps,
  ThemeScriptOptions,
  ThemeScriptProps,
  StorageKeys,
} from "./theme/index.js";

// Additional type exports for components with inline types in index.ts
export type {
  CardRootProps,
  CardHeaderProps,
  CardContentProps,
  CardFooterProps,
} from "./components/card/index.js";

export type { SeparatorProps, SeparatorOrientation } from "./components/separator/index.js";

export type { AspectRatioProps } from "./components/aspect-ratio/index.js";

export type {
  CollapsibleRootProps,
  CollapsibleTriggerProps,
  CollapsibleContentProps,
} from "./components/collapsible/index.js";

export type {
  TabsRootProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  TabsOrientation,
  TabsActivationMode,
} from "./components/tabs/index.js";

export type {
  AccordionRootProps,
  AccordionItemProps,
  AccordionTriggerProps,
  AccordionContentProps,
  AccordionType,
  AccordionOrientation,
} from "./components/accordion/index.js";

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

export type {
  ContextMenuRootProps,
  ContextMenuTriggerProps,
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuSeparatorProps,
  ContextMenuLabelProps,
  ContextMenuItemVariant,
} from "./components/context-menu/index.js";

export type {
  HoverCardRootProps,
  HoverCardTriggerProps,
  HoverCardContentProps,
  HoverCardPlacement,
} from "./components/hover-card/index.js";

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

export type {
  ScrollAreaRootProps,
  ScrollAreaViewportProps,
  ScrollAreaScrollbarProps,
  ScrollAreaThumbProps,
  ScrollAreaType,
} from "./components/scroll-area/index.js";

export type {
  BreadcrumbRootProps,
  BreadcrumbListProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbPageProps,
  BreadcrumbSeparatorProps,
} from "./components/breadcrumb/index.js";

export type {
  PaginationRootProps,
  PaginationContentProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationPreviousProps,
  PaginationNextProps,
  PaginationEllipsisProps,
} from "./components/pagination/index.js";

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

export type { AlertProps, AlertVariant } from "./components/alert/index.js";

export type {
  ToastProviderProps,
  ToastVariant,
  ToastPosition,
  ToastState,
  ToastAction,
  ToastData,
  ToastOptions,
  UseToastReturn,
} from "./components/toast/index.js";

export type { ProgressProps, ProgressVariant, ProgressSize } from "./components/progress/index.js";

export type {
  AvatarProps,
  AvatarSize,
  AvatarShape,
  AvatarStatus,
  AvatarGroupProps,
} from "./components/avatar/index.js";

export type {
  TableRootProps,
  TableSize,
  TableHeaderProps,
  TableBodyProps,
  TableRowProps,
  TableHeadProps,
  TableAlign,
  SortDirection,
  TableCellProps,
} from "./components/table/index.js";

export type {
  SkeletonProps,
  SkeletonVariant,
  SkeletonSize,
  SkeletonWidth,
  SkeletonAnimation,
} from "./components/skeleton/index.js";

export type {
  BadgeProps,
  BadgeVariant,
  BadgeSize,
  BadgePosition,
} from "./components/badge/index.js";

export type { TagProps, TagVariant, TagSize } from "./components/tag/index.js";

export type {
  TreeRootProps,
  TreeSelectionMode,
  TreeSize,
  TreeItemProps,
} from "./components/tree/index.js";

export type {
  ListRootProps,
  ListSelectionMode,
  ListOrientation,
  ListSize,
  ListItemProps,
} from "./components/list/index.js";

export type { CalendarProps, CalendarSize } from "./components/calendar/index.js";

export type {
  DataTableProps,
  DataTableColumn,
  DataTableSort,
  DataTablePagination,
  DataTableSortDirection,
} from "./components/data-table/index.js";

// Hook types
export type {
  UseStableIdOptions,
  UseStableIdsOptions,
  StableIds,
} from "./hooks/index.js";

// Additional types that were previously co-exported with runtime components

export type {
  FlowProps,
  ContainerProps,
  GridProps,
  BoxProps as LayoutBoxProps,
  PageProps,
  SectionProps,
  AppShellProps,
  HeaderProps as LayoutHeaderProps,
  FooterProps as LayoutFooterProps,
  MainProps,
  SidebarProps,
  SpacerProps,
  CenterProps,
  SplitProps,
  WrapProps,
  StackProps,
  InlineProps,
} from "./components/layout/index.js";

export type {
  EmptyStateProps,
  EmptyStateIconProps,
  EmptyStateTitleProps,
  EmptyStateDescriptionProps,
  EmptyStateActionProps,
} from "./components/empty-state/index.js";
