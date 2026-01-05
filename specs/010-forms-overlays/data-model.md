# Data Model: Forms and Overlays Components

**Feature**: 010-forms-overlays
**Date**: 2026-01-04

## Overview

This feature consists of stateless UI components. There is no persistent data model. This document defines the **component state models** that describe the internal state each component manages.

## Component State Models

### Field Pattern Components

#### DsField

```typescript
interface FieldState {
  /** Generated unique ID for ARIA association */
  fieldId: string;
  /** Whether an error is present (derived from DsFieldError child) */
  hasError: boolean;
  /** Whether a description is present (derived from DsFieldDescription child) */
  hasDescription: boolean;
  /** Whether the field is required (propagated to form control) */
  required: boolean;
}
```

**State Transitions**:
- `fieldId`: Generated once on `connectedCallback`, never changes
- `hasError`: Updates when `<ds-field-error>` child is added/removed
- `hasDescription`: Updates when `<ds-field-description>` child is added/removed
- `required`: Set via attribute, propagated to child form control

#### DsLabel, DsFieldDescription, DsFieldError

```typescript
interface LabelState {
  /** ID derived from parent Field */
  id: string;
}
```

No complex state. These are presentational components with IDs for ARIA association.

---

### Form Control Components

#### DsInput (enhanced)

```typescript
interface InputState {
  /** Current input value */
  value: string;
  /** Input type (text, email, password, etc.) */
  type: InputType;
  /** Whether input is disabled */
  disabled: boolean;
  /** Whether input is read-only */
  readonly: boolean;
  /** Whether input has validation error (from parent Field) */
  error: boolean;
  /** ARIA attributes composed from parent Field */
  ariaLabelledby: string | null;
  ariaDescribedby: string | null;
}

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
```

#### DsTextarea

```typescript
interface TextareaState {
  /** Current textarea value */
  value: string;
  /** Number of visible rows */
  rows: number;
  /** Whether auto-resize is enabled */
  autoResize: boolean;
  /** Calculated height from auto-resize (in pixels) */
  computedHeight: number | null;
  /** Whether textarea is disabled */
  disabled: boolean;
  /** Whether textarea has validation error */
  error: boolean;
  /** Resize behavior */
  resize: 'none' | 'vertical' | 'horizontal' | 'both';
}
```

**State Transitions**:
- `computedHeight`: Recalculated on every input when `autoResize` is true

#### DsCheckbox

```typescript
interface CheckboxState {
  /** Whether checkbox is checked */
  checked: boolean;
  /** Whether checkbox is in indeterminate (mixed) state */
  indeterminate: boolean;
  /** Whether checkbox is disabled */
  disabled: boolean;
}
```

**State Transitions**:
- On click/Space: `checked` toggles (if not disabled)
- `indeterminate` is set programmatically, cleared on user interaction

#### DsRadioGroup

```typescript
interface RadioGroupState {
  /** Currently selected value */
  value: string | null;
  /** Orientation for keyboard navigation */
  orientation: 'horizontal' | 'vertical';
  /** Whether the group is disabled */
  disabled: boolean;
  /** Index of currently focused radio (for roving tabindex) */
  focusedIndex: number;
}
```

#### DsRadio

```typescript
interface RadioState {
  /** Radio value */
  value: string;
  /** Whether this radio is selected (derived from group) */
  checked: boolean;
  /** Whether this radio is disabled */
  disabled: boolean;
  /** Tabindex for roving focus (-1 or 0) */
  tabIndex: number;
}
```

**State Transitions**:
- `checked`: Set to true when selected via arrow keys or click
- `tabIndex`: 0 if selected or first in group, -1 otherwise

#### DsSwitch

```typescript
interface SwitchState {
  /** Whether switch is on */
  checked: boolean;
  /** Whether switch is disabled */
  disabled: boolean;
}
```

---

### Overlay Components

#### DsDialog

```typescript
interface DialogState {
  /** Whether dialog is open */
  open: boolean;
  /** Dialog variant */
  role: 'dialog' | 'alertdialog';
  /** Reference to trigger element for focus return */
  triggerElement: HTMLElement | null;
  /** Focus trap instance */
  focusTrap: FocusTrap | null;
  /** Dismissable layer instance */
  dismissLayer: DismissableLayer | null;
}
```

**State Transitions**:
- On open: `open` → true, activate focus trap and dismiss layer
- On close (Escape/backdrop): `open` → false, deactivate traps, return focus

#### DsPopover

```typescript
interface PopoverState {
  /** Whether popover is open */
  open: boolean;
  /** Placement relative to trigger */
  placement: Placement;
  /** Calculated position after flip logic */
  computedPosition: { x: number; y: number } | null;
  /** Reference to trigger element */
  triggerElement: HTMLElement | null;
  /** Dismissable layer instance */
  dismissLayer: DismissableLayer | null;
}

type Placement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';
```

#### DsTooltip

```typescript
interface TooltipState {
  /** Whether tooltip is visible */
  visible: boolean;
  /** Placement relative to trigger */
  placement: Placement;
  /** Show delay timer ID */
  showTimer: number | null;
  /** Hide delay timer ID */
  hideTimer: number | null;
  /** Reference to trigger element */
  triggerElement: HTMLElement | null;
}
```

**State Transitions**:
- On mouseenter/focus: Start show timer (400ms)
- On mouseleave/blur: Start hide timer (100ms)
- On Escape: Immediately hide, clear timers

#### DsMenu

```typescript
interface MenuState {
  /** Whether menu is open */
  open: boolean;
  /** Index of currently focused item (roving focus) */
  focusedIndex: number;
  /** Reference to trigger element */
  triggerElement: HTMLElement | null;
  /** Roving focus instance */
  rovingFocus: RovingFocus | null;
  /** Dismissable layer instance */
  dismissLayer: DismissableLayer | null;
  /** Type-ahead buffer */
  typeAheadBuffer: string;
}
```

#### DsMenuItem

```typescript
interface MenuItemState {
  /** Whether item is disabled */
  disabled: boolean;
  /** Tabindex for roving focus (-1 or 0) */
  tabIndex: number;
}
```

---

## Entity Relationships

```text
┌─────────────────────────────────────────────────────────────┐
│                      Form Pattern                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐    contains    ┌──────────┐                   │
│  │ DsField │───────────────▶│ DsLabel  │                   │
│  └────┬────┘                └──────────┘                   │
│       │                                                     │
│       │ contains            ┌───────────────────┐          │
│       ├────────────────────▶│ DsFieldDescription│          │
│       │                     └───────────────────┘          │
│       │                                                     │
│       │ contains            ┌──────────────┐               │
│       ├────────────────────▶│ DsFieldError │               │
│       │                     └──────────────┘               │
│       │                                                     │
│       │ contains            ┌────────────────────┐         │
│       └────────────────────▶│ Form Control       │         │
│                             │ (Input/Textarea/   │         │
│                             │  Checkbox/Radio/   │         │
│                             │  Switch)           │         │
│                             └────────────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Radio Group Pattern                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐   contains (1..n)   ┌─────────┐          │
│  │ DsRadioGroup │────────────────────▶│ DsRadio │          │
│  └──────────────┘                     └─────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Overlay Patterns                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Dialog:                                                    │
│  ┌──────────┐  triggers  ┌───────────────┐                 │
│  │ DsTrigger│───────────▶│ DsDialogContent│                │
│  └──────────┘            │ (focus trapped)│                │
│                          └───────────────┘                 │
│                                                             │
│  Popover/Tooltip/Menu:                                     │
│  ┌──────────┐  triggers  ┌─────────────────┐               │
│  │ DsTrigger│───────────▶│ Content         │               │
│  └──────────┘            │ (positioned,    │               │
│                          │  dismissable)   │               │
│                          └─────────────────┘               │
│                                                             │
│  Menu hierarchy:                                            │
│  ┌────────┐  contains (1..n)  ┌────────────┐               │
│  │ DsMenu │──────────────────▶│ DsMenuItem │               │
│  └────────┘                   └────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Validation Rules

### Field Pattern
- `DsField` MUST contain exactly one form control
- `DsLabel` SHOULD be first child of `DsField`
- `DsFieldError` SHOULD only be present when there is an error

### Radio Group
- `DsRadioGroup` MUST contain at least 2 `DsRadio` children
- Each `DsRadio` MUST have a unique `value` within its group
- Only one `DsRadio` can be `checked` at a time

### Overlays
- Overlay trigger and content MUST be associated (parent-child or ID reference)
- Only one overlay of a given type should be open at a time (per layer stack)
- Nested overlays MUST participate in layer stack for correct Escape handling
