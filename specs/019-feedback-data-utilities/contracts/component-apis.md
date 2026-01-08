# Component API Contracts

**Feature**: 019-feedback-data-utilities
**Date**: 2026-01-08

This document defines the public API for each component, including props, events, slots, and CSS custom properties.

---

## 1. Alert

### Web Component: `<ds-alert>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Visual variant |
| `title` | `string` | - | Alert title |
| `closable` | `boolean` | `false` | Show close button |
| `icon` | `string` | auto | Override default icon |

| Slot | Description |
|------|-------------|
| (default) | Alert description content |
| `icon` | Custom icon content |
| `action` | Action button slot |

| Event | Detail | Description |
|-------|--------|-------------|
| `ds:close` | `{}` | Fired when close button clicked |

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--ds-alert-bg` | token-based | Background color |
| `--ds-alert-border` | token-based | Border color |
| `--ds-alert-icon` | token-based | Icon color |

### React: `<Alert>`

```tsx
interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  closable?: boolean;
  icon?: ReactNode;
  action?: ReactNode;
  onClose?: () => void;
  children?: ReactNode;
}
```

---

## 2. Toast System

### Web Component: `<ds-toast-provider>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `position` | `'top-left' \| 'top-center' \| 'top-right' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right'` | `'top-right'` | Toast position |
| `max` | `number` | `5` | Max simultaneous toasts |
| `duration` | `number` | `5000` | Default duration (ms) |

### Web Component: `<ds-toast>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Visual variant |
| `title` | `string` | - | Toast title |
| `description` | `string` | - | Toast description |

| Slot | Description |
|------|-------------|
| `action` | Action button slot |

| Event | Detail | Description |
|-------|--------|-------------|
| `ds:dismiss` | `{ id: string }` | Fired when toast dismissed |

### Imperative API (WC)

```typescript
// Global function
declare function dsToast(options: {
  title: string;
  description?: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  action?: { label: string; onClick: () => void };
}): string; // returns toast ID

// Controller class
class ToastController {
  show(options: ToastOptions): string;
  dismiss(id: string): void;
  dismissAll(): void;
}
```

### React: `<Toast.Provider>` + `useToast()`

```tsx
interface ToastProviderProps {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  max?: number;
  duration?: number;
  children: ReactNode;
}

interface UseToastReturn {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}
```

---

## 3. Progress

### Web Component: `<ds-progress>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `number` | - | Current value (omit for indeterminate) |
| `max` | `number` | `100` | Maximum value |
| `variant` | `'linear' \| 'circular'` | `'linear'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |
| `label` | `string` | - | Accessible label |

| CSS Custom Property | Default | Description |
|---------------------|---------|-------------|
| `--ds-progress-track` | token-based | Track background |
| `--ds-progress-fill` | token-based | Fill/indicator color |
| `--ds-progress-size` | `4px` | Track thickness |

### React: `<Progress>`

```tsx
interface ProgressProps {
  value?: number;
  max?: number;
  variant?: 'linear' | 'circular';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}
```

---

## 4. Badge

### Web Component: `<ds-badge>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `count` | `number` | - | Count to display |
| `max` | `number` | `99` | Max before showing "+" |
| `dot` | `boolean` | `false` | Show as dot only |
| `variant` | `'info' \| 'success' \| 'warning' \| 'error' \| 'neutral'` | `'neutral'` | Color variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant |

| Slot | Description |
|------|-------------|
| (default) | Element to badge (icon, avatar, etc.) |

### React: `<Badge>`

```tsx
interface BadgeProps {
  count?: number;
  max?: number;
  dot?: boolean;
  variant?: 'info' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}
```

---

## 5. Avatar

### Web Component: `<ds-avatar>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `src` | `string` | - | Image source URL |
| `alt` | `string` | required | Alt text |
| `name` | `string` | - | Name for initials fallback |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size variant |
| `status` | `'online' \| 'offline' \| 'away' \| 'busy'` | - | Status indicator |

| Slot | Description |
|------|-------------|
| `fallback` | Custom fallback content |

### Web Component: `<ds-avatar-group>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `max` | `number` | - | Max avatars before overflow |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size for all avatars |

| Slot | Description |
|------|-------------|
| (default) | Avatar elements |

### React: `<Avatar>`, `<AvatarGroup>`

```tsx
interface AvatarProps {
  src?: string;
  alt: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  fallback?: ReactNode;
}

interface AvatarGroupProps {
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
}
```

---

## 6. Table

### Web Component: `<ds-table>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `selectable` | `boolean` | `false` | Enable row selection |
| `sortable` | `boolean` | `false` | Enable column sorting |

| Event | Detail | Description |
|-------|--------|-------------|
| `ds:sort` | `{ columnId: string, direction: 'asc' \| 'desc' }` | Sort changed |
| `ds:selection-change` | `{ selectedIds: string[] }` | Selection changed |

### Sub-components

- `<ds-table-header>` - Table header section
- `<ds-table-body>` - Table body section
- `<ds-table-row>` - Table row (`data-row-id` for selection)
- `<ds-table-head>` - Header cell (`sortable`, `align`)
- `<ds-table-cell>` - Data cell (`align`)

### React: Compound Pattern

```tsx
interface TableRootProps {
  columns: ColumnDef<TData>[];
  data: TData[];
  selectable?: boolean;
  onSort?: (sort: SortState) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  getRowId?: (row: TData) => string;
  emptyState?: ReactNode;
  children?: ReactNode;
}

// Exports: Table.Root, Table.Header, Table.Body, Table.Row, Table.Head, Table.Cell
```

---

## 7. DataTable

### Web Component: `<ds-data-table>`

Extends `<ds-table>` with:

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | `number` | `0` | Current page (0-indexed) |
| `page-size` | `number` | `10` | Rows per page |
| `total` | `number` | - | Total row count |
| `filter` | `string` | `''` | Filter query |
| `virtualize` | `boolean` | `true` | Enable virtualization |

| Event | Detail | Description |
|-------|--------|-------------|
| `ds:page-change` | `{ page: number }` | Page changed |
| `ds:filter-change` | `{ filter: string }` | Filter changed |

### React: `<DataTable>`

```tsx
interface DataTableProps<TData> extends TableRootProps<TData> {
  page?: number;
  pageSize?: number;
  total?: number;
  filter?: string;
  virtualize?: boolean;
  onPageChange?: (page: number) => void;
  onFilterChange?: (filter: string) => void;
}
```

---

## 8. Skeleton

### Web Component: `<ds-skeleton>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | `'text' \| 'circular' \| 'rectangular'` | `'text'` | Shape variant |
| `width` | `string` | `'100%'` | Width |
| `height` | `string` | auto | Height |
| `lines` | `number` | `1` | Text lines (for variant="text") |
| `animation` | `boolean` | `true` | Enable shimmer animation |

### React: `<Skeleton>`

```tsx
interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: number | string;
  height?: number | string;
  lines?: number;
  animation?: boolean;
}
```

---

## 9. Tag

### Web Component: `<ds-tag>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `variant` | `'solid' \| 'subtle' \| 'outline'` | `'subtle'` | Visual variant |
| `color-scheme` | `'default' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | Color scheme |
| `removable` | `boolean` | `false` | Show remove button |
| `disabled` | `boolean` | `false` | Disabled state |

| Slot | Description |
|------|-------------|
| (default) | Tag label |
| `icon` | Leading icon |

| Event | Detail | Description |
|-------|--------|-------------|
| `ds:remove` | `{}` | Remove button clicked |

### React: `<Tag>`

```tsx
interface TagProps {
  variant?: 'solid' | 'subtle' | 'outline';
  colorScheme?: 'default' | 'info' | 'success' | 'warning' | 'error';
  removable?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  onRemove?: () => void;
  children: ReactNode;
}
```

---

## 10. List

### Web Component: `<ds-list>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `selection-mode` | `'none' \| 'single' \| 'multiple'` | `'none'` | Selection mode |

| Event | Detail | Description |
|-------|--------|-------------|
| `ds:selection-change` | `{ selectedIds: string[] }` | Selection changed |

### Web Component: `<ds-list-item>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string` | required | Item identifier |
| `disabled` | `boolean` | `false` | Disabled state |
| `selected` | `boolean` | `false` | Selected state |

| Slot | Description |
|------|-------------|
| (default) | Item label |
| `leading` | Leading content |
| `trailing` | Trailing content |

### React: `<List>`, `<ListItem>`

```tsx
interface ListProps {
  selectionMode?: 'none' | 'single' | 'multiple';
  onSelectionChange?: (selectedIds: string[]) => void;
  children: ReactNode;
}

interface ListItemProps {
  value: string;
  disabled?: boolean;
  selected?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
}
```

---

## 11. Tree

### Web Component: `<ds-tree>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `selection-mode` | `'none' \| 'single' \| 'multiple'` | `'none'` | Selection mode |

| Event | Detail | Description |
|-------|--------|-------------|
| `ds:selection-change` | `{ selectedIds: string[] }` | Selection changed |
| `ds:expand` | `{ id: string, expanded: boolean }` | Node expanded/collapsed |

### Web Component: `<ds-tree-item>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string` | required | Node identifier |
| `expanded` | `boolean` | `false` | Expanded state |
| `disabled` | `boolean` | `false` | Disabled state |
| `selected` | `boolean` | `false` | Selected state |

| Slot | Description |
|------|-------------|
| (default) | Item label |
| `icon` | Leading icon |
| `children` | Nested tree items |

### React: `<Tree>`, `<TreeItem>`

```tsx
interface TreeProps {
  selectionMode?: 'none' | 'single' | 'multiple';
  onSelectionChange?: (selectedIds: string[]) => void;
  onExpandChange?: (id: string, expanded: boolean) => void;
  children: ReactNode;
}

interface TreeItemProps {
  value: string;
  expanded?: boolean;
  disabled?: boolean;
  selected?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}
```

---

## 12. Calendar

### Web Component: `<ds-calendar>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string` | - | Selected date (ISO format) |
| `min` | `string` | - | Minimum date |
| `max` | `string` | - | Maximum date |
| `locale` | `string` | `'en-US'` | Locale for formatting |
| `week-start` | `number` | `0` | Week start day (0=Sun, 1=Mon) |

| Slot | Description |
|------|-------------|
| `event` | Custom event rendering |

| Event | Detail | Description |
|-------|--------|-------------|
| `ds:change` | `{ value: string }` | Date selected |
| `ds:view-change` | `{ year: number, month: number }` | View month changed |

### React: `<Calendar>`

```tsx
interface CalendarProps {
  value?: Date;
  defaultValue?: Date;
  min?: Date;
  max?: Date;
  locale?: string;
  weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  events?: CalendarEvent[];
  onChange?: (date: Date) => void;
  onViewChange?: (year: number, month: number) => void;
  renderEvent?: (event: CalendarEvent) => ReactNode;
}
```

---

## 13. Utility Primitives

### Portal

**Web Component**: `<ds-portal>`

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `container` | `string` | - | CSS selector for container |

**React**: `<Portal>`

```tsx
interface PortalProps {
  container?: Element | null;
  children: ReactNode;
}
```

### FocusScope

**React**: `<FocusScope>`

```tsx
interface FocusScopeProps {
  trap?: boolean;
  restoreFocus?: boolean;
  autoFocus?: boolean;
  children: ReactNode;
}
```

### ClientOnly

**Web Component**: `<ds-client-only>`

**React**: `<ClientOnly>`

```tsx
interface ClientOnlyProps {
  fallback?: ReactNode;
  children: ReactNode;
}
```

### Slot (React only, extends existing)

```tsx
interface SlotProps {
  children: ReactNode;
}

// Existing Slot already implements asChild pattern
```
