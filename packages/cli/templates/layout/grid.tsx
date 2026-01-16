/**
 * Grid React Component
 *
 * 2D grid layout with responsive columns.
 */

import type React from "react";
import { createElement, forwardRef, useMemo } from "react";
import { type ResponsiveValue, parseResponsiveValue } from "../../hooks/use-responsive-classes.js";

type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | "auto-fit" | "auto-fill";
type SpacingToken = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

export interface GridProps {
  /** Number of columns. Supports responsive object syntax. */
  columns?: ResponsiveValue<GridColumns>;
  /** Gap between grid items. Supports responsive object syntax. */
  gap?: ResponsiveValue<SpacingToken>;
  /** Row gap override. */
  rowGap?: SpacingToken;
  /** Column gap override. */
  columnGap?: SpacingToken;
  /** Additional CSS class names. */
  className?: string;
  /** Children elements. */
  children?: React.ReactNode;
}

/**
 * React wrapper for ds-grid Web Component.
 */
export const Grid = forwardRef<HTMLElement, GridProps>((props, ref) => {
  const { columns = 1, gap = "md", rowGap, columnGap, className, children, ...rest } = props;

  // Parse responsive values - convert numbers to strings
  const columnsValue = useMemo(() => {
    if (typeof columns === "number") {
      return String(columns);
    }
    if (typeof columns === "object") {
      const converted: Record<string, string> = {};
      for (const [key, val] of Object.entries(columns)) {
        converted[key] = String(val);
      }
      return converted;
    }
    return columns;
  }, [columns]);

  const columnsResult = useMemo(
    () => parseResponsiveValue("grid", "cols", columnsValue as ResponsiveValue<string>),
    [columnsValue]
  );

  const gapResult = useMemo(() => parseResponsiveValue("grid", "gap", gap), [gap]);

  // Combine all classes
  const allClasses = useMemo(() => {
    const classes = [...columnsResult.classes, ...gapResult.classes];
    if (className) classes.push(className);
    return classes.join(" ") || undefined;
  }, [columnsResult.classes, gapResult.classes, className]);

  return createElement(
    "ds-grid",
    {
      ref,
      columns: columnsResult.baseValue,
      gap: gapResult.baseValue,
      "row-gap": rowGap,
      "column-gap": columnGap,
      class: allClasses,
      ...rest,
    },
    children
  );
});

Grid.displayName = "Grid";
