/**
 * @ds/primitives-dom API Contract
 *
 * This file defines the complete public API for the primitives-dom package.
 * All exports from @ds/primitives-dom must conform to these type definitions.
 *
 * @version 0.2.0
 * @feature 005-behavior-utilities
 */

// =============================================================================
// SHARED TYPES
// =============================================================================

/**
 * Navigation orientation for keyboard handlers.
 */
export type Direction = "horizontal" | "vertical" | "both";

/**
 * Logical navigation direction (locale-aware).
 */
export type LogicalDirection = "next" | "previous" | "first" | "last";

// =============================================================================
// FOCUS TRAP
// =============================================================================

export interface FocusTrapOptions {
  container: HTMLElement;
  initialFocus?: HTMLElement | null;
  returnFocus?: boolean | HTMLElement;
  fallbackFocus?: HTMLElement;
}

export interface FocusTrap {
  activate: () => void;
  deactivate: () => void;
}

export function createFocusTrap(options: FocusTrapOptions): FocusTrap;

// =============================================================================
// ROVING FOCUS
// =============================================================================

export interface RovingFocusOptions {
  container: HTMLElement;
  selector: string;
  direction?: Direction;
  loop?: boolean;
  skipDisabled?: boolean;
  onFocus?: (element: HTMLElement, index: number) => void;
}

export interface RovingFocus {
  setFocusedIndex: (index: number) => void;
  getFocusedIndex: () => number;
  destroy: () => void;
}

export function createRovingFocus(options: RovingFocusOptions): RovingFocus;

// =============================================================================
// DISMISSABLE LAYER
// =============================================================================

export type DismissReason = "escape" | "outside-click";

export interface DismissableLayerOptions {
  container: HTMLElement;
  excludeElements?: HTMLElement[];
  onDismiss: (reason: DismissReason) => void;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
}

export interface DismissableLayer {
  activate: () => void;
  deactivate: () => void;
}

export function createDismissableLayer(options: DismissableLayerOptions): DismissableLayer;

// =============================================================================
// KEYBOARD ACTIVATION
// =============================================================================

export interface ActivationOptions {
  onActivate: (event: KeyboardEvent) => void;
  keys?: ("Enter" | "Space")[];
  preventDefault?: boolean | "Space";
}

export function createActivationHandler(options: ActivationOptions): (event: KeyboardEvent) => void;

// =============================================================================
// ARROW KEY NAVIGATION
// =============================================================================

export interface ArrowKeyOptions {
  orientation: Direction;
  rtl?: boolean;
  onNavigate: (direction: LogicalDirection, event: KeyboardEvent) => void;
}

export function createArrowKeyHandler(options: ArrowKeyOptions): (event: KeyboardEvent) => void;

// =============================================================================
// TYPE-AHEAD SEARCH
// =============================================================================

export interface TypeAheadOptions {
  items: () => HTMLElement[];
  getText: (item: HTMLElement) => string;
  onMatch: (item: HTMLElement, index: number) => void;
  timeout?: number;
}

export interface TypeAhead {
  handleKeyDown: (event: KeyboardEvent) => void;
  reset: () => void;
}

export function createTypeAhead(options: TypeAheadOptions): TypeAhead;

// =============================================================================
// LIVE REGION (Existing)
// =============================================================================

export type LivePoliteness = "polite" | "assertive" | "off";

export interface LiveRegionOptions {
  politeness?: LivePoliteness;
  atomic?: boolean;
  relevant?: "additions" | "removals" | "text" | "all";
}

export function announce(message: string, options?: LiveRegionOptions): void;
export function clearAnnouncements(): void;

// =============================================================================
// CONSTANTS
// =============================================================================

export const FOCUSABLE_SELECTOR: string;
export const DEFAULT_TYPEAHEAD_TIMEOUT: number;
