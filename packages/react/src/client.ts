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
export { Portal, type PortalProps } from "./primitives/portal.js";
export { FocusScope, type FocusScopeProps, type FocusScopeRef } from "./primitives/focus-scope.js";
export { ClientOnly, type ClientOnlyProps, useIsClient } from "./primitives/client-only.js";

// Alert component
export { Alert, type AlertProps, type AlertVariant } from "./components/alert/index.js";

// Toast compound component
export { Toast, useToast } from "./components/toast/index.js";

// Progress component
export { Progress, type ProgressProps, type ProgressVariant, type ProgressSize } from "./components/progress/index.js";

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

// Utilities
export { createEventHandler, attachEventListeners } from "./utils/events.js";
export { createComponent, type WrapperConfig } from "./utils/create-component.js";
export {
  composeEventHandlers,
  mergeClassNames,
  mergeStyles,
  mergeProps,
} from "./utils/merge-props.js";
