/**
 * Baseline Web Components - Type Contracts
 * Feature: 007-baseline-components
 *
 * These types define the public API contract for all baseline components.
 * Implementation must conform to these interfaces.
 */

// =============================================================================
// Common Types
// =============================================================================

export type Size = "sm" | "md" | "lg";
export type ExtendedSize = "xs" | "sm" | "md" | "lg" | "xl";
export type TypographySize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

// =============================================================================
// Button Component
// =============================================================================

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonType = "button" | "submit" | "reset";

export interface DsButtonAttributes {
  /** Visual style variant. Default: 'primary' */
  variant?: ButtonVariant;
  /** Button size. Default: 'md' */
  size?: Size;
  /** Prevents interaction. Default: false */
  disabled?: boolean;
  /** Shows loading spinner, prevents interaction. Default: false */
  loading?: boolean;
  /** HTML button type. Default: 'button' */
  type?: ButtonType;
}

export interface DsClickEventDetail {
  /** The original DOM event that triggered the click */
  originalEvent: MouseEvent | KeyboardEvent;
}

// =============================================================================
// Link Component
// =============================================================================

export type LinkVariant = "default" | "muted" | "underline";

export interface DsLinkAttributes {
  /** Navigation destination URL. Required. */
  href: string;
  /** Opens in new tab with external indicator. Default: false */
  external?: boolean;
  /** Visual style variant. Default: 'default' */
  variant?: LinkVariant;
}

export interface DsNavigateEventDetail {
  /** The href being navigated to */
  href: string;
  /** Whether this is an external link */
  external: boolean;
  /** The original DOM event */
  originalEvent: MouseEvent | KeyboardEvent;
}

// =============================================================================
// Text Component
// =============================================================================

export type TextWeight = "normal" | "medium" | "semibold" | "bold";
export type TextVariant = "default" | "muted" | "success" | "warning" | "error";
export type TextAs = "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export interface DsTextAttributes {
  /** Typography size scale. Default: 'md' */
  size?: TypographySize;
  /** Font weight. Default: 'normal' */
  weight?: TextWeight;
  /** Color variant. Default: 'default' */
  variant?: TextVariant;
  /** Semantic HTML element. Default: 'span' */
  as?: TextAs;
  /** Truncate with ellipsis. Default: false */
  truncate?: boolean;
}

// =============================================================================
// Icon Component
// =============================================================================

export interface DsIconAttributes {
  /** Icon identifier from Lucide library. Required. */
  name: string;
  /** Icon size. Default: 'md' */
  size?: ExtendedSize;
  /** Accessible name. Omit for decorative icons. */
  label?: string;
  /** Icon color. Default: 'currentColor' */
  color?: string;
}

// =============================================================================
// Spinner Component
// =============================================================================

export interface DsSpinnerAttributes {
  /** Spinner size. Default: 'md' */
  size?: Size;
  /** Accessible loading announcement. Default: 'Loading' */
  label?: string;
}

// =============================================================================
// VisuallyHidden Component
// =============================================================================

export interface DsVisuallyHiddenAttributes {
  /** Become visible when content receives focus. Default: false */
  focusable?: boolean;
}

// =============================================================================
// HTMLElementTagNameMap Extension
// =============================================================================

declare global {
  interface HTMLElementTagNameMap {
    "ds-button": HTMLElement & DsButtonAttributes;
    "ds-link": HTMLElement & DsLinkAttributes;
    "ds-text": HTMLElement & DsTextAttributes;
    "ds-icon": HTMLElement & DsIconAttributes;
    "ds-spinner": HTMLElement & DsSpinnerAttributes;
    "ds-visually-hidden": HTMLElement & DsVisuallyHiddenAttributes;
  }

  interface HTMLElementEventMap {
    "ds:click": CustomEvent<DsClickEventDetail>;
    "ds:navigate": CustomEvent<DsNavigateEventDetail>;
  }
}
