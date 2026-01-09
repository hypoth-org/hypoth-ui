/**
 * Data display components barrel file.
 * Import from '@ds/wc/data-display' for tree-shaking.
 */

// Table components
export {
  DsTable,
  DsTableHeader,
  DsTableBody,
  DsTableRow,
  DsTableHead,
  DsTableCell,
  type TableSize,
  type TableAlign,
  type SortDirection,
} from "./components/table/index.js";

// DataTable component
export {
  DsDataTable,
  type DataTableColumn,
  type DataTableSort,
  type DataTablePagination,
  type DataTableSortDirection,
} from "./components/data-table/index.js";

// Avatar components
export {
  DsAvatar,
  DsAvatarGroup,
  type AvatarSize,
  type AvatarShape,
  type AvatarStatus,
} from "./components/avatar/index.js";

// Badge component
export {
  DsBadge,
  type BadgeVariant,
  type BadgeSize,
  type BadgePosition,
} from "./components/badge/index.js";

// Tag component
export { DsTag, type TagVariant, type TagSize } from "./components/tag/index.js";

// Progress component
export {
  DsProgress,
  type ProgressVariant,
  type ProgressSize,
} from "./components/progress/index.js";

// Skeleton component
export {
  DsSkeleton,
  type SkeletonVariant,
  type SkeletonSize,
  type SkeletonWidth,
  type SkeletonAnimation,
} from "./components/skeleton/index.js";

// Calendar component
export { DsCalendar, type CalendarSize } from "./components/calendar/index.js";

// Tree components
export {
  DsTree,
  DsTreeItem,
  type TreeSelectionMode,
  type TreeSize,
} from "./components/tree/index.js";

// List components
export {
  DsList,
  DsListItem,
  type ListSelectionMode,
  type ListOrientation,
  type ListSize,
} from "./components/list/index.js";

// Card components
export { DsCard } from "./components/card/card.js";
export { DsCardHeader } from "./components/card/card-header.js";
export { DsCardContent } from "./components/card/card-content.js";
export { DsCardFooter } from "./components/card/card-footer.js";

// Separator component
export { DsSeparator } from "./components/separator/separator.js";
export type { SeparatorOrientation } from "./components/separator/separator.js";

// AspectRatio component
export { DsAspectRatio } from "./components/aspect-ratio/aspect-ratio.js";
