/**
 * Layout Token Types
 *
 * Shared TypeScript types for layout primitive components.
 * These types constrain props to valid design token values.
 */

/**
 * Spacing tokens for gap, padding, and margin props.
 */
export type SpacingToken = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

/**
 * Breakpoint tokens for responsive values.
 */
export type BreakpointToken = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

/**
 * Container size tokens for max-width constraints.
 */
export type ContainerSizeToken = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

/**
 * Surface tokens for background colors.
 */
export type SurfaceToken = "background" | "surface" | "surface-raised" | "surface-sunken" | "muted";

/**
 * Radius tokens for border-radius.
 */
export type RadiusToken = "none" | "sm" | "md" | "lg" | "xl" | "full";

/**
 * Flex direction values.
 */
export type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";

/**
 * Flex alignment values (cross-axis).
 */
export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";

/**
 * Flex justify values (main-axis).
 */
export type FlexJustify = "start" | "center" | "end" | "between" | "around" | "evenly";

/**
 * Flex wrap values.
 */
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";

/**
 * Grid column values.
 */
export type GridColumns =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | "auto-fit"
  | "auto-fill";

/**
 * Split layout ratio values.
 */
export type SplitRatio = "equal" | "1:2" | "2:1" | "1:3" | "3:1";

/**
 * Spacer axis values.
 */
export type SpacerAxis = "horizontal" | "vertical";

/**
 * Valid token sets for validation.
 */
export const SPACING_TOKENS: readonly SpacingToken[] = [
  "none",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
] as const;

export const BREAKPOINT_TOKENS: readonly BreakpointToken[] = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
] as const;

export const CONTAINER_SIZE_TOKENS: readonly ContainerSizeToken[] = [
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "full",
] as const;

export const SURFACE_TOKENS: readonly SurfaceToken[] = [
  "background",
  "surface",
  "surface-raised",
  "surface-sunken",
  "muted",
] as const;

export const RADIUS_TOKENS: readonly RadiusToken[] = [
  "none",
  "sm",
  "md",
  "lg",
  "xl",
  "full",
] as const;

export const FLEX_DIRECTION_VALUES: readonly FlexDirection[] = [
  "row",
  "column",
  "row-reverse",
  "column-reverse",
] as const;

export const FLEX_ALIGN_VALUES: readonly FlexAlign[] = [
  "start",
  "center",
  "end",
  "stretch",
  "baseline",
] as const;

export const FLEX_JUSTIFY_VALUES: readonly FlexJustify[] = [
  "start",
  "center",
  "end",
  "between",
  "around",
  "evenly",
] as const;
