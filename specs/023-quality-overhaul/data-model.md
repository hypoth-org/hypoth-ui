# Data Model: Design System Quality Overhaul

**Date**: 2026-01-09
**Branch**: `023-quality-overhaul`

## Overview

This feature primarily adds testing infrastructure and refactors existing code. It introduces minimal new data structures, focused on composite primitive configuration and state.

## New Entities

### 1. ModalOverlay (Composite)

A higher-level primitive combining overlay behavior with presence animation.

**State**:
| Field | Type | Description |
|-------|------|-------------|
| `open` | boolean | Whether the overlay is currently open |
| `animating` | boolean | Whether enter/exit animation is in progress |

**Configuration**:
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `modal` | boolean | `true` | Always true for modal overlays |
| `closeOnEscape` | boolean | `true` | Close when Escape key is pressed |
| `closeOnBackdrop` | boolean | `true` | Close when clicking outside content |
| `returnFocusOnClose` | boolean | `true` | Return focus to trigger element |
| `animated` | boolean | `true` | Enable enter/exit animations |

**Lifecycle**:
```
[closed] --open()--> [animating-in] --animationend--> [open]
[open] --close()--> [animating-out] --onExitComplete--> [closed]
```

---

### 2. PopoverOverlay (Composite)

Combines overlay behavior with anchor positioning.

**State**:
| Field | Type | Description |
|-------|------|-------------|
| `open` | boolean | Whether the popover is visible |
| `placement` | Placement | Final computed placement after flip logic |

**Configuration**:
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `trigger` | HTMLElement | required | The anchor element |
| `placement` | Placement | `'bottom'` | Preferred placement |
| `offset` | number | `8` | Gap between anchor and popover (px) |
| `flip` | boolean | `true` | Flip when near viewport edge |
| `closeOnEscape` | boolean | `true` | Close on Escape key |
| `closeOnOutsideClick` | boolean | `true` | Close on outside click |

**Auto-update triggers**:
- Window scroll (capture)
- Window resize
- Anchor element resize

---

### 3. SelectableList (Composite)

Bundles keyboard navigation with selection state management.

**State**:
| Field | Type | Description |
|-------|------|-------------|
| `focusedIndex` | number | Currently focused item index |
| `selectedIds` | Set\<string\> | Selected item IDs |
| `lastSelectedId` | string \| null | For range selection anchor |

**Configuration**:
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `mode` | `'single' \| 'multiple'` | `'single'` | Selection mode |
| `defaultSelected` | string[] | `[]` | Initially selected IDs |
| `wrap` | boolean | `true` | Wrap at list boundaries |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` | Arrow key behavior |
| `typeAhead` | boolean | `true` | Enable character search |
| `typeAheadDebounce` | number | `300` | Debounce time (ms) |

**Selection behaviors by mode**:

| Action | Single Mode | Multiple Mode |
|--------|-------------|---------------|
| Click | Select item (deselect others) | Toggle item selection |
| Shift+Click | Same as click | Range select from anchor |
| Ctrl/Cmd+Click | Same as click | Toggle item selection |
| Enter/Space | Select focused | Toggle focused selection |

---

### 4. ARIA ID Generator State

Simple counter for generating unique IDs.

**State**:
| Field | Type | Description |
|-------|------|-------------|
| `counter` | number | Auto-incrementing ID counter |

**Behavior**:
- Counter increments on each `generateAriaId()` call
- IDs are globally unique within page lifecycle
- Format: `{prefix}-{counter}` (e.g., `dialog-title-1`)

---

## Existing Entities (Referenced)

### OverlayBehavior (Existing)

Located in `packages/primitives-dom/src/overlay/create-overlay-behavior.ts`.

The composites wrap this existing behavior:

| Field | Type | Description |
|-------|------|-------------|
| `state.open` | boolean | Open/closed state |
| `state.modal` | boolean | Whether modal (focus trap) |
| `context.overlayId` | string | Generated unique ID |
| `context.triggerElement` | HTMLElement \| null | Trigger element ref |
| `context.contentElement` | HTMLElement \| null | Content element ref |

### Presence (Existing)

Located in `packages/primitives-dom/src/animation/presence.ts`.

| Field | Type | Description |
|-------|------|-------------|
| `state` | AnimationState | `'idle' \| 'animating-in' \| 'animating-out' \| 'exited'` |

### AnchorPosition (Existing)

Located in `packages/primitives-dom/src/positioning/anchor-position.ts`.

| Field | Type | Description |
|-------|------|-------------|
| `x` | number | Computed X position |
| `y` | number | Computed Y position |
| `placement` | Placement | Final placement after flip |

---

## Relationships

```
┌─────────────────────┐
│   ModalOverlay      │
│   (composite)       │
├─────────────────────┤
│ Uses:               │
│ - OverlayBehavior   │──────► createOverlayBehavior()
│ - Presence          │──────► createPresence()
└─────────────────────┘

┌─────────────────────┐
│   PopoverOverlay    │
│   (composite)       │
├─────────────────────┤
│ Uses:               │
│ - OverlayBehavior   │──────► createOverlayBehavior()
│ - AnchorPosition    │──────► createAnchorPosition()
│ - Presence          │──────► createPresence() (optional)
└─────────────────────┘

┌─────────────────────┐
│   SelectableList    │
│   (composite)       │
├─────────────────────┤
│ Uses:               │
│ - RovingFocus       │──────► createRovingFocus()
│ - TypeAhead         │──────► createTypeAhead()
│ - Selection state   │──────► (internal)
└─────────────────────┘
```

---

## Validation Rules

### ModalOverlay
- `closeOnEscape` and `closeOnBackdrop` can be independently configured
- When `animated: false`, state transitions skip animation states

### PopoverOverlay
- `trigger` is required (throws if not provided)
- `placement` must be valid Placement type
- `offset` must be non-negative number

### SelectableList
- In `single` mode, at most one item selected at a time
- In `multiple` mode, range selection requires `lastSelectedId` anchor
- `defaultSelected` IDs that don't exist in items are ignored

---

## State Persistence

None. All entities are:
- In-memory only
- Created per component instance
- Destroyed on component disconnect
- No localStorage/sessionStorage
- No server persistence
