/**
 * Layout Components Index
 *
 * Exports all layout primitive Web Components.
 */

// Core Layout
export { DsFlow } from "./flow.js";
export { DsContainer } from "./container.js";
export { DsGrid } from "./grid.js";
export { DsBox } from "./box.js";

// Page Composition
export { DsPage } from "./page.js";
export { DsSection } from "./section.js";
export { DsAppShell } from "./app-shell.js";
export { DsHeader } from "./header.js";
export { DsFooter } from "./footer.js";
export { DsMain } from "./main.js";

// Helpers
export { DsSpacer } from "./spacer.js";
export { DsCenter } from "./center.js";
export { DsSplit } from "./split.js";
export { DsWrap } from "./wrap.js";

// Re-export types
export type {
  SpacingToken,
  BreakpointToken,
  ContainerSizeToken,
  SurfaceToken,
  RadiusToken,
  FlexDirection,
  FlexAlign,
  FlexJustify,
  FlexWrap,
  GridColumns,
  SplitRatio,
  SpacerAxis,
} from "../../types/layout-tokens.js";
