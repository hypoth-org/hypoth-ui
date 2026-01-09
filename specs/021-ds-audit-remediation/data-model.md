# Data Model: Design System Audit Remediation

**Feature Branch**: `021-ds-audit-remediation`
**Date**: 2026-01-09

This feature primarily involves refactoring existing components rather than introducing new data structures. The key "entities" are the interfaces and types used by behavior primitives and form-associated elements.

## 1. Form Association Entities

### ElementInternals Integration

```typescript
/**
 * Base mixin/interface for form-associated custom elements.
 * Provides standard form participation via ElementInternals.
 */
interface FormAssociatedElement {
  // Static declaration required by browser
  static formAssociated: true;

  // Standard form attributes
  name: string;
  value: string;
  disabled: boolean;
  required: boolean;

  // Validation state
  readonly validity: ValidityState;
  readonly validationMessage: string;
  readonly willValidate: boolean;

  // Public methods
  checkValidity(): boolean;
  reportValidity(): boolean;
  setCustomValidity(message: string): void;
}

/**
 * Internal state for form-associated components.
 */
interface FormInternalsState {
  internals: ElementInternals;
  defaultValue: string | null;
  customValidation: boolean;
}
```

### Form Lifecycle Callbacks

```typescript
/**
 * Lifecycle callbacks invoked by the browser for form-associated elements.
 */
interface FormLifecycleCallbacks {
  formAssociatedCallback(form: HTMLFormElement | null): void;
  formDisabledCallback(disabled: boolean): void;
  formResetCallback(): void;
  formStateRestoreCallback(
    state: string | File | FormData,
    mode: 'restore' | 'autocomplete'
  ): void;
}
```

### Validation State

```typescript
/**
 * Custom validation flags (subset of ValidityState).
 */
interface ValidationFlags {
  valueMissing?: boolean;    // required && empty
  typeMismatch?: boolean;    // type validation failed
  patternMismatch?: boolean; // pattern attribute doesn't match
  tooLong?: boolean;         // exceeds maxlength
  tooShort?: boolean;        // less than minlength
  rangeOverflow?: boolean;   // exceeds max
  rangeUnderflow?: boolean;  // less than min
  stepMismatch?: boolean;    // doesn't match step value
  customError?: boolean;     // setValidity() called with error
}
```

## 2. Tabs Behavior Primitive

### Options Interface

```typescript
/**
 * Configuration options for createTabsBehavior.
 */
export interface TabsBehaviorOptions {
  /** Initial selected tab value */
  defaultValue?: string;

  /** Keyboard navigation direction */
  orientation?: 'horizontal' | 'vertical';

  /** Selection behavior on focus */
  activationMode?: 'automatic' | 'manual';

  /** Whether arrow keys loop at boundaries */
  loop?: boolean;

  /** Callback when selected tab changes */
  onValueChange?: (value: string) => void;

  /** Custom ID generator */
  generateId?: () => string;
}
```

### State Interface

```typescript
/**
 * Read-only state exposed by TabsBehavior.
 */
export interface TabsBehaviorState {
  /** Currently selected tab value */
  value: string | undefined;

  /** Current orientation */
  orientation: 'horizontal' | 'vertical';

  /** Current activation mode */
  activationMode: 'automatic' | 'manual';

  /** Registered tab values */
  tabs: string[];

  /** Currently focused tab (may differ from selected in manual mode) */
  focusedTab: string | undefined;
}
```

### Props Interfaces

```typescript
/**
 * ARIA props for tablist container.
 */
export interface TabListProps {
  role: 'tablist';
  'aria-orientation': 'horizontal' | 'vertical';
}

/**
 * ARIA props for individual tab trigger.
 */
export interface TabProps {
  id: string;
  role: 'tab';
  tabIndex: number; // 0 for selected, -1 for others
  'aria-selected': 'true' | 'false';
  'aria-controls': string; // ID of associated panel
}

/**
 * ARIA props for tab panel.
 */
export interface PanelProps {
  id: string;
  role: 'tabpanel';
  tabIndex: number;
  'aria-labelledby': string; // ID of associated tab
  hidden: boolean;
}
```

### Behavior Interface

```typescript
/**
 * Public API returned by createTabsBehavior.
 */
export interface TabsBehavior {
  /** Read-only state */
  readonly state: TabsBehaviorState;

  /** Select a tab by value */
  selectTab(value: string): void;

  /** Focus a tab without selecting (for manual mode) */
  focusTab(value: string): void;

  /** Register a tab value */
  registerTab(value: string): void;

  /** Unregister a tab value */
  unregisterTab(value: string): void;

  /** Get ARIA props for tablist */
  getTabListProps(): TabListProps;

  /** Get ARIA props for specific tab */
  getTabProps(value: string): TabProps;

  /** Get ARIA props for specific panel */
  getPanelProps(value: string): PanelProps;

  /** Handle keyboard events on tablist */
  handleKeyDown(event: KeyboardEvent): void;

  /** Cleanup resources */
  destroy(): void;
}
```

## 3. Package Export Structure

### Subpath Export Categories

```typescript
/**
 * Component categories for subpath exports.
 */
type ComponentCategory =
  | 'form-controls'   // button, input, checkbox, radio, switch, etc.
  | 'overlays'        // dialog, sheet, drawer, popover, tooltip, menu
  | 'data-display'    // table, avatar, badge, tag, progress, skeleton
  | 'navigation'      // breadcrumb, pagination, stepper, scroll-area
  | 'layout';         // flow, container, grid, box, page, section

/**
 * Package exports field structure.
 */
interface PackageExports {
  '.': ExportConditions;
  './button': ExportConditions;
  './input': ExportConditions;
  './form-controls': ExportConditions;
  './overlays': ExportConditions;
  './data-display': ExportConditions;
  './navigation': ExportConditions;
  './layout': ExportConditions;
  './base': ExportConditions;
  './registry': ExportConditions;
}

interface ExportConditions {
  types: string;  // Path to .d.ts
  import: string; // Path to .js (ESM)
}
```

## 4. Existing Behavior Primitives (Reference)

### DialogBehavior (existing, to be used by WC)

```typescript
// From @ds/primitives-dom/src/behavior/dialog.ts
export interface DialogBehaviorOptions {
  defaultOpen?: boolean;
  role?: 'dialog' | 'alertdialog';
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  onOpenChange?: (open: boolean) => void;
  generateId?: () => string;
}

export interface DialogBehavior {
  readonly state: DialogBehaviorState;
  open(): void;
  close(): void;
  toggle(): void;
  setTriggerElement(element: HTMLElement | null): void;
  setContentElement(element: HTMLElement | null): void;
  getTriggerProps(): DialogTriggerProps;
  getContentProps(): DialogContentProps;
  getTitleProps(): DialogTitleProps;
  getDescriptionProps(): DialogDescriptionProps;
  destroy(): void;
}
```

### MenuBehavior (existing, to be used by WC)

```typescript
// From @ds/primitives-dom/src/behavior/menu.ts
export interface MenuBehaviorOptions {
  placement?: Placement;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (value: string) => void;
}

export interface MenuBehavior {
  readonly state: MenuBehaviorState;
  open(): void;
  close(): void;
  toggle(): void;
  registerItem(element: HTMLElement, value?: string): void;
  unregisterItem(element: HTMLElement): void;
  getTriggerProps(): MenuTriggerProps;
  getContentProps(): MenuContentProps;
  getItemProps(element: HTMLElement): MenuItemProps;
  handleTriggerKeyDown(event: KeyboardEvent): void;
  destroy(): void;
}
```

## 5. State Transitions

### Form Control Validation State

```
┌─────────────────────────────────────────────────────────────┐
│                    FORM CONTROL STATES                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────┐      value change      ┌─────────────┐         │
│  │ INITIAL │ ────────────────────▶ │  DIRTY      │         │
│  │ (valid) │                        │  (pending)  │         │
│  └─────────┘                        └──────┬──────┘         │
│       │                                    │                │
│       │ form.reportValidity()              │ validate()     │
│       ▼                                    ▼                │
│  ┌─────────┐                        ┌─────────────┐         │
│  │ VALID   │◀───────────────────── │  VALIDATED  │         │
│  │         │    constraints pass    │             │         │
│  └─────────┘                        └──────┬──────┘         │
│                                            │                │
│                                            │ constraints    │
│                                            │ fail           │
│                                            ▼                │
│                                     ┌─────────────┐         │
│                                     │  INVALID    │         │
│                                     │  (error)    │         │
│                                     └─────────────┘         │
│                                                              │
│  formResetCallback() resets to INITIAL                      │
└─────────────────────────────────────────────────────────────┘
```

### Tabs Selection State (Manual Mode)

```
┌─────────────────────────────────────────────────────────────┐
│                    TABS STATE (MANUAL MODE)                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐   Arrow keys   ┌──────────────┐           │
│  │ FOCUSED      │◀─────────────▶│ FOCUSED      │           │
│  │ Tab A        │                │ Tab B        │           │
│  │ (selected)   │                │ (not sel.)   │           │
│  └──────────────┘                └──────┬───────┘           │
│                                         │                   │
│                                         │ Enter/Space       │
│                                         ▼                   │
│                                  ┌──────────────┐           │
│                                  │ FOCUSED      │           │
│                                  │ Tab B        │           │
│                                  │ (selected)   │           │
│                                  └──────────────┘           │
│                                                              │
│  In automatic mode: focus = selection (no Enter needed)     │
└─────────────────────────────────────────────────────────────┘
```

## 6. Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPONENT RELATIONSHIPS                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  @ds/primitives-dom                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ createDialogBehavior ─┬─▶ createFocusTrap           │   │
│  │                       └─▶ createDismissableLayer    │   │
│  │                                                      │   │
│  │ createMenuBehavior ───┬─▶ createRovingFocus         │   │
│  │                       ├─▶ createTypeAhead           │   │
│  │                       ├─▶ createAnchorPosition      │   │
│  │                       └─▶ createDismissableLayer    │   │
│  │                                                      │   │
│  │ createTabsBehavior ───┬─▶ createRovingFocus (NEW)   │   │
│  │                       └─▶ createActivationHandler   │   │
│  └─────────────────────────────────────────────────────┘   │
│                            │                                │
│                            │ imports                        │
│                            ▼                                │
│  @ds/wc                                                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ DsDialog ────────────▶ createDialogBehavior         │   │
│  │ DsAlertDialog ────────▶ createDialogBehavior        │   │
│  │ DsSheet ─────────────▶ createDialogBehavior         │   │
│  │ DsDrawer ────────────▶ createDialogBehavior         │   │
│  │ DsDropdownMenu ──────▶ createMenuBehavior           │   │
│  │ DsContextMenu ───────▶ createMenuBehavior           │   │
│  │ DsTabs ──────────────▶ createTabsBehavior           │   │
│  │                                                      │   │
│  │ DsCheckbox ──────────▶ ElementInternals             │   │
│  │ DsSwitch ────────────▶ ElementInternals             │   │
│  │ DsRadio ─────────────▶ ElementInternals             │   │
│  │ DsSelect ────────────▶ ElementInternals             │   │
│  │ DsCombobox ──────────▶ ElementInternals             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```
