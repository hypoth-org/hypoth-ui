/**
 * Layout Components Index
 *
 * Exports all layout primitive React components.
 */

// Core Layout
export { Flow, type FlowProps } from "./flow.js";
export { Container, type ContainerProps } from "./container.js";
export { Grid, type GridProps } from "./grid.js";
export { Box, type BoxProps } from "./box.js";

// Page Composition
export { Page, type PageProps } from "./page.js";
export { Section, type SectionProps } from "./section.js";
export {
  AppShell,
  type AppShellProps,
  type HeaderProps,
  type FooterProps,
  type MainProps,
  type SidebarProps,
} from "./app-shell.js";

// Helpers
export { Spacer, type SpacerProps } from "./spacer.js";
export { Center, type CenterProps } from "./center.js";
export { Split, type SplitProps } from "./split.js";
export { Wrap, type WrapProps } from "./wrap.js";

// Aliases
export { Stack, type StackProps } from "./stack.js";
export { Inline, type InlineProps } from "./inline.js";
