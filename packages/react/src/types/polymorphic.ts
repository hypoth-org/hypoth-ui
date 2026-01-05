/**
 * Polymorphic type utilities for asChild pattern.
 */

/**
 * Spacing values supported by Box component.
 * Maps to design system spacing tokens.
 */
export type SpacingValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;

/**
 * Display values for Box component.
 */
export type DisplayValue =
  | "block"
  | "inline"
  | "inline-block"
  | "flex"
  | "inline-flex"
  | "grid"
  | "inline-grid"
  | "none";

/**
 * Flex direction values.
 */
export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";

/**
 * Alignment values for flex/grid.
 */
export type AlignValue = "start" | "end" | "center" | "stretch" | "baseline";

/**
 * Justify values for flex/grid.
 */
export type JustifyValue = "start" | "end" | "center" | "between" | "around" | "evenly";

/**
 * Base props for components supporting asChild pattern.
 */
export interface AsChildProps {
  /**
   * When true, the component renders its child element with merged props
   * instead of its default element.
   */
  asChild?: boolean;
}
