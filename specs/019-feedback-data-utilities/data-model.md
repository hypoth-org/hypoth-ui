# Data Model: Feedback, Data Display & Utilities

**Feature**: 019-feedback-data-utilities
**Date**: 2026-01-08

## Overview

This document defines the data structures, types, and state models for components in this feature. UI components are stateless by design, but they manage internal state and accept external data through well-defined interfaces.

---

## 1. Toast System

### ToastData

Represents a single toast notification.

```typescript
interface ToastData {
  /** Unique identifier for the toast */
  id: string;
  /** Toast title (required) */
  title: string;
  /** Optional description */
  description?: string;
  /** Visual variant */
  variant: 'info' | 'success' | 'warning' | 'error';
  /** Auto-dismiss duration in milliseconds (default: 5000, 0 = no auto-dismiss) */
  duration?: number;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** Timestamp when toast was created */
  createdAt: number;
}
```

### ToastState

Managed by ToastProvider.

```typescript
interface ToastState {
  /** Queue of active toasts */
  toasts: ToastData[];
  /** Maximum simultaneous toasts (default: 5) */
  maxToasts: number;
  /** Toast position */
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}
```

### ToastLifecycle

```typescript
type ToastLifecycle = 'entering' | 'visible' | 'exiting' | 'dismissed';
```

---

## 2. Table / DataTable

### ColumnDef<TData>

Column definition for Table and DataTable.

```typescript
interface ColumnDef<TData> {
  /** Unique column identifier */
  id: string;
  /** Column header content */
  header: string | (() => ReactNode);
  /** Key to access data from row object */
  accessorKey?: keyof TData;
  /** Function to derive cell value from row */
  accessorFn?: (row: TData) => unknown;
  /** Custom cell renderer */
  cell?: (info: CellContext<TData>) => ReactNode;
  /** Enable sorting for this column */
  sortable?: boolean;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Column width (number = px, string = CSS value) */
  width?: number | string;
  /** Minimum width for resizable columns */
  minWidth?: number;
  /** Maximum width for resizable columns */
  maxWidth?: number;
}

interface CellContext<TData> {
  row: TData;
  rowIndex: number;
  column: ColumnDef<TData>;
  value: unknown;
}
```

### SortState

```typescript
interface SortState {
  /** Column ID being sorted */
  columnId: string;
  /** Sort direction */
  direction: 'asc' | 'desc';
}
```

### SelectionState

```typescript
interface SelectionState {
  /** Set of selected row IDs */
  selectedIds: Set<string>;
  /** Whether all rows are selected */
  allSelected: boolean;
  /** Whether selection is indeterminate (some selected) */
  indeterminate: boolean;
}
```

### DataTableState (extends Table)

```typescript
interface DataTableState<TData> {
  /** Current sort configuration */
  sort?: SortState;
  /** Selected row IDs */
  selection: SelectionState;
  /** Current filter value */
  filter: string;
  /** Current page (0-indexed) */
  page: number;
  /** Rows per page */
  pageSize: number;
  /** Total row count (before pagination) */
  totalRows: number;
  /** Virtualization scroll position */
  scrollTop: number;
}
```

---

## 3. Tree

### TreeNode<TData>

```typescript
interface TreeNode<TData = unknown> {
  /** Unique node identifier */
  id: string;
  /** Node label */
  label: string;
  /** Custom data payload */
  data?: TData;
  /** Child nodes */
  children?: TreeNode<TData>[];
  /** Whether node is expanded */
  expanded?: boolean;
  /** Whether node is selected */
  selected?: boolean;
  /** Whether node is disabled */
  disabled?: boolean;
  /** Optional icon */
  icon?: string;
}
```

### TreeState

```typescript
interface TreeState {
  /** Set of expanded node IDs */
  expandedIds: Set<string>;
  /** Set of selected node IDs */
  selectedIds: Set<string>;
  /** Currently focused node ID */
  focusedId: string | null;
  /** Selection mode */
  selectionMode: 'single' | 'multiple' | 'none';
}
```

---

## 4. List

### ListItem<TData>

```typescript
interface ListItem<TData = unknown> {
  /** Unique item identifier */
  id: string;
  /** Item label */
  label: string;
  /** Custom data payload */
  data?: TData;
  /** Whether item is selected */
  selected?: boolean;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Leading content (icon, avatar, etc.) */
  leading?: ReactNode;
  /** Trailing content (badge, action, etc.) */
  trailing?: ReactNode;
}
```

### ListState

```typescript
interface ListState {
  /** Set of selected item IDs */
  selectedIds: Set<string>;
  /** Currently focused item ID */
  focusedId: string | null;
  /** Selection mode */
  selectionMode: 'single' | 'multiple' | 'none';
}
```

---

## 5. Calendar

### CalendarDate

```typescript
interface CalendarDate {
  year: number;
  month: number; // 0-11
  day: number;   // 1-31
}
```

### CalendarEvent

```typescript
interface CalendarEvent {
  /** Unique event identifier */
  id: string;
  /** Event title */
  title: string;
  /** Event date */
  date: CalendarDate;
  /** Optional color/variant */
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
  /** Custom data payload */
  data?: unknown;
}
```

### CalendarState

```typescript
interface CalendarState {
  /** Currently displayed month/year */
  viewDate: { year: number; month: number };
  /** Selected date(s) */
  selectedDate?: CalendarDate;
  /** Focused date for keyboard navigation */
  focusedDate: CalendarDate;
  /** View mode */
  view: 'month' | 'year' | 'decade';
}
```

---

## 6. Avatar

### AvatarData

```typescript
interface AvatarData {
  /** Image source URL */
  src?: string;
  /** Alt text for image */
  alt: string;
  /** Name for initials fallback */
  name?: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Status indicator */
  status?: 'online' | 'offline' | 'away' | 'busy';
}
```

### AvatarState

```typescript
type AvatarLoadState = 'loading' | 'loaded' | 'error';
```

---

## 7. Progress

### ProgressData

```typescript
interface ProgressData {
  /** Current value (0-100 for determinate) */
  value?: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Visual variant */
  variant?: 'linear' | 'circular';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label */
  label?: string;
}
```

### ProgressState

```typescript
interface ProgressState {
  /** Whether progress is determinate (has value) or indeterminate (loading) */
  mode: 'determinate' | 'indeterminate';
  /** Calculated percentage (0-100) */
  percentage: number;
}
```

---

## 8. Alert

### AlertData

```typescript
interface AlertData {
  /** Alert variant */
  variant: 'info' | 'success' | 'warning' | 'error';
  /** Alert title */
  title?: string;
  /** Alert description */
  description?: string;
  /** Custom icon (default based on variant) */
  icon?: string;
  /** Whether alert is closable */
  closable?: boolean;
  /** Optional action */
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

---

## 9. Badge

### BadgeData

```typescript
interface BadgeData {
  /** Count to display */
  count?: number;
  /** Maximum count before showing "+" (default: 99) */
  max?: number;
  /** Show as dot (no count) */
  dot?: boolean;
  /** Status variant */
  variant?: 'info' | 'success' | 'warning' | 'error' | 'neutral';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
}
```

---

## 10. Tag

### TagData

```typescript
interface TagData {
  /** Tag label */
  label: string;
  /** Visual variant */
  variant?: 'solid' | 'subtle' | 'outline';
  /** Color scheme */
  colorScheme?: 'default' | 'info' | 'success' | 'warning' | 'error';
  /** Whether tag is removable */
  removable?: boolean;
  /** Whether tag is disabled */
  disabled?: boolean;
  /** Leading icon */
  icon?: string;
}
```

---

## 11. Skeleton

### SkeletonData

```typescript
interface SkeletonData {
  /** Skeleton variant */
  variant?: 'text' | 'circular' | 'rectangular';
  /** Width (number = px, string = CSS value) */
  width?: number | string;
  /** Height (number = px, string = CSS value) */
  height?: number | string;
  /** Border radius */
  borderRadius?: number | string;
  /** Number of text lines (for variant="text") */
  lines?: number;
  /** Disable animation */
  animation?: boolean;
}
```

---

## Entity Relationships

```
ToastProvider (1) ─── manages ───> (N) Toast

Table (1) ─── has ───> (N) ColumnDef
Table (1) ─── displays ───> (N) Row<TData>
DataTable extends Table with virtualization

Tree (1) ─── contains ───> (N) TreeNode
TreeNode (1) ─── has ───> (N) TreeNode (children)

List (1) ─── contains ───> (N) ListItem

Calendar (1) ─── displays ───> (N) CalendarEvent

AvatarGroup (1) ─── contains ───> (N) Avatar
```

---

## State Transitions

### Toast Lifecycle

```
[created] → entering → visible → exiting → dismissed
                ↑                    │
                └── (on hover pause)─┘
```

### Avatar Load State

```
[initial] → loading → loaded
               │
               └─────→ error
```

### Tree Node Expansion

```
collapsed ←→ expanded
    │           │
    └─── (keyboard/click) ───┘
```
