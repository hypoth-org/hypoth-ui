/**
 * Primitive components barrel file.
 * Import from '@ds/wc/primitives' for tree-shaking.
 */

// Button component
export { DsButton } from "./components/button/button.js";
export type { ButtonVariant, ButtonSize } from "./components/button/button.js";

// Link component
export { DsLink } from "./components/link/link.js";
export type { LinkVariant, DsNavigateEventDetail } from "./components/link/link.js";

// Text component
export { DsText } from "./components/text/text.js";
export type { TextSize, TextWeight, TextVariant, TextAs } from "./components/text/text.js";

// Icon component
export { DsIcon } from "./components/icon/icon.js";
export type { IconSize } from "./components/icon/icon.js";

// VisuallyHidden component
export { DsVisuallyHidden } from "./components/visually-hidden/visually-hidden.js";
