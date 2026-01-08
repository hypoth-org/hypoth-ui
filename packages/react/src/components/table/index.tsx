"use client";

/**
 * Table compound component exports
 */

import { TableRoot } from "./root.js";
import { TableHeader } from "./header.js";
import { TableBody } from "./body.js";
import { TableRow } from "./row.js";
import { TableHead } from "./head.js";
import { TableCell } from "./cell.js";

export type { TableRootProps, TableSize } from "./root.js";
export type { TableHeaderProps } from "./header.js";
export type { TableBodyProps } from "./body.js";
export type { TableRowProps } from "./row.js";
export type { TableHeadProps, TableAlign, SortDirection } from "./head.js";
export type { TableCellProps } from "./cell.js";

/**
 * Table compound component for structured data display.
 *
 * @example
 * ```tsx
 * <Table striped>
 *   <Table.Header>
 *     <Table.Row>
 *       <Table.Head sortable column="name" onSort={handleSort}>Name</Table.Head>
 *       <Table.Head>Email</Table.Head>
 *     </Table.Row>
 *   </Table.Header>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>John Doe</Table.Cell>
 *       <Table.Cell>john@example.com</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table>
 * ```
 */
export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
});

export { TableHeader, TableBody, TableRow, TableHead, TableCell };

// TypeScript declarations for JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ds-table": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<HTMLElement>;
        size?: string;
        striped?: boolean;
        borderless?: boolean;
        fixed?: boolean;
        "sticky-header"?: boolean;
        caption?: string;
      };
      "ds-table-header": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<HTMLElement>;
      };
      "ds-table-body": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<HTMLElement>;
      };
      "ds-table-row": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<HTMLElement>;
        "row-id"?: string;
        selected?: boolean;
      };
      "ds-table-head": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<HTMLElement>;
        column?: string;
        align?: string;
        sortable?: boolean;
        "sort-direction"?: string;
        width?: string;
        "onDs-sort"?: (event: CustomEvent) => void;
      };
      "ds-table-cell": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<HTMLElement>;
        align?: string;
        colspan?: number;
        rowspan?: number;
      };
    }
  }
}
