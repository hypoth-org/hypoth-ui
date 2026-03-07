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
 * import { DsButton, Input, Link } from "@hypoth-ui/react/client";
 * ```
 *
 * For type-only imports in server components, use the main entry point:
 * @example
 * ```tsx
 * import type { ButtonProps, InputProps } from "@hypoth-ui/react";
 * ```
 */

// Components (all are client-only due to event handlers and refs)
export {
  DsButton,
  type DsButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from "./components/ds-button.js";
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
export { Portal, type PortalProps } from "./primitives/portal.js";
export { FocusScope, type FocusScopeProps, type FocusScopeRef } from "./primitives/focus-scope.js";
export { ClientOnly, type ClientOnlyProps, useIsClient } from "./primitives/client-only.js";

// Alert component
export { Alert, type AlertProps, type AlertVariant } from "./components/alert/index.js";

// Toast compound component
export { Toast, useToast } from "./components/toast/index.js";

// Progress component
export {
  Progress,
  type ProgressProps,
  type ProgressVariant,
  type ProgressSize,
} from "./components/progress/index.js";

// Avatar compound component
export { Avatar, AvatarGroup } from "./components/avatar/index.js";
export type {
  AvatarProps,
  AvatarSize,
  AvatarShape,
  AvatarStatus,
  AvatarGroupProps,
} from "./components/avatar/index.js";

// Table compound component
export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "./components/table/index.js";
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

// Skeleton component
export { Skeleton } from "./components/skeleton/index.js";
export type {
  SkeletonProps,
  SkeletonVariant,
  SkeletonSize,
  SkeletonWidth,
  SkeletonAnimation,
} from "./components/skeleton/index.js";

// Badge component
export { Badge } from "./components/badge/index.js";
export type {
  BadgeProps,
  BadgeVariant,
  BadgeSize,
  BadgePosition,
} from "./components/badge/index.js";

// Tag component
export { Tag } from "./components/tag/index.js";
export type { TagProps, TagVariant, TagSize } from "./components/tag/index.js";

// Tree compound component
export { Tree, TreeItem } from "./components/tree/index.js";
export type {
  TreeRootProps,
  TreeSelectionMode,
  TreeSize,
  TreeItemProps,
} from "./components/tree/index.js";

// List compound component
export { List, ListItem } from "./components/list/index.js";
export type {
  ListRootProps,
  ListSelectionMode,
  ListOrientation,
  ListSize,
  ListItemProps,
} from "./components/list/index.js";

// Calendar component
export { Calendar } from "./components/calendar/index.js";
export type { CalendarProps, CalendarSize } from "./components/calendar/index.js";

// DataTable component
export { DataTable } from "./components/data-table/index.js";
export type {
  DataTableProps,
  DataTableColumn,
  DataTableSort,
  DataTablePagination,
  DataTableSortDirection,
} from "./components/data-table/index.js";

export type {
  ToastProviderProps,
  ToastVariant,
  ToastPosition,
  ToastOptions,
  UseToastReturn,
} from "./components/toast/index.js";

// Field components
export { Field, type FieldProps } from "./components/field/field.js";
export { Label, type LabelProps } from "./components/field/label.js";
export { FieldDescription, type FieldDescriptionProps } from "./components/field/field-description.js";
export { FieldError, type FieldErrorProps } from "./components/field/field-error.js";

// Form controls
export { Textarea, type TextareaProps, type TextareaSize } from "./components/textarea.js";
export { Checkbox, type CheckboxProps } from "./components/checkbox.js";
export { RadioGroup, type RadioGroupProps, type RadioOrientation } from "./components/radio-group.js";
export { Radio, type RadioProps } from "./components/radio.js";
export { Switch, type SwitchProps } from "./components/switch.js";

// Dialog compound component
export { Dialog } from "./components/dialog/index.js";

// Overlay components
export { Popover, type PopoverProps, type Placement } from "./components/popover.js";
export { PopoverContent, type PopoverContentProps } from "./components/popover-content.js";
export { Tooltip, type TooltipProps } from "./components/tooltip.js";
export { TooltipContent, type TooltipContentProps } from "./components/tooltip-content.js";

// AlertDialog compound component
export { AlertDialog } from "./components/alert-dialog/index.js";

// Sheet compound component
export { Sheet } from "./components/sheet/index.js";

// Drawer compound component
export { Drawer } from "./components/drawer/index.js";

// Menu compound component
export { Menu } from "./components/menu/index.js";

// Select compound component
export { Select } from "./components/select/index.js";

// Combobox compound component
export { Combobox } from "./components/combobox/index.js";

// DropdownMenu compound component
export { DropdownMenu } from "./components/dropdown-menu/index.js";

// ContextMenu compound component
export { ContextMenu } from "./components/context-menu/index.js";

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

// Separator component
export { Separator } from "./components/separator/index.js";

// AspectRatio component
export { AspectRatio } from "./components/aspect-ratio/index.js";

// Collapsible compound component
export { Collapsible } from "./components/collapsible/index.js";

// Tabs compound component
export { Tabs } from "./components/tabs/index.js";

// Accordion compound component
export { Accordion } from "./components/accordion/index.js";

// HoverCard compound component
export { HoverCard } from "./components/hover-card/index.js";

// NavigationMenu compound component
export { NavigationMenu } from "./components/navigation-menu/index.js";

// ScrollArea compound component
export { ScrollArea } from "./components/scroll-area/index.js";

// Breadcrumb compound component
export { Breadcrumb } from "./components/breadcrumb/index.js";

// Pagination compound component
export { Pagination } from "./components/pagination/index.js";

// Stepper compound component
export { Stepper } from "./components/stepper/index.js";

// Command compound component
export { Command } from "./components/command/index.js";

// Layout primitives
export {
  Flow,
  Container,
  Grid,
  Box as LayoutBox,
  Page,
  Section,
  AppShell,
  Spacer,
  Center,
  Split,
  Wrap,
  Stack,
  Inline,
} from "./components/layout/index.js";

// Theme system (client-only: providers and hooks)
export {
  ThemeProvider,
  DensityProvider,
  useTheme,
  useThemeState,
  useColorMode,
  useDensity,
  useDensityContext,
} from "./theme/index.js";

// EmptyState compound component
export {
  EmptyState,
  EmptyStateRoot,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateAction,
} from "./components/empty-state/index.js";

// Presence primitive
export { Presence } from "./primitives/Presence.js";
export { usePresence } from "./primitives/use-presence.js";

// SSR-safe ID generation hooks
export {
  useStableId,
  useStableIds,
  useScopedIdGenerator,
  useConditionalId,
} from "./hooks/index.js";

// Error boundary
export {
  ErrorBoundary,
  withErrorBoundary,
  DSErrorFallback,
} from "./utils/error-boundary.js";

// Utilities
export { createEventHandler, attachEventListeners } from "./utils/events.js";
export { createComponent, type WrapperConfig } from "./utils/create-component.js";
export {
  composeEventHandlers,
  mergeClassNames,
  mergeStyles,
  mergeProps,
} from "./utils/merge-props.js";
