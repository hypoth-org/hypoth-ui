# Data Model: Shared Accessible Component API

**Feature**: 014-shared-a11y-api
**Date**: 2026-01-05

## Overview

This feature introduces behavior primitives - framework-agnostic state machines that compute component state, ARIA attributes, and keyboard handlers. These primitives are data structures, not persistent entities.

---

## Behavior Primitive Entities

### ButtonBehavior

Simplest behavior - manages loading/disabled state and ARIA computation.

| Field | Type | Description |
|-------|------|-------------|
| `disabled` | `boolean` | Whether button is disabled |
| `loading` | `boolean` | Whether button is in loading state |
| `type` | `'button' \| 'submit' \| 'reset'` | Button type |

**Computed ARIA**:
- `aria-disabled`: `disabled || loading`
- `aria-busy`: `loading`

**Keyboard handlers**:
- Enter/Space: Trigger click if not disabled/loading

---

### DialogBehavior

Modal dialog with focus management and dismissal.

| Field | Type | Description |
|-------|------|-------------|
| `open` | `boolean` | Whether dialog is open |
| `role` | `'dialog' \| 'alertdialog'` | Dialog semantic role |
| `closeOnEscape` | `boolean` | Whether Escape closes dialog |
| `closeOnOutsideClick` | `boolean` | Whether backdrop click closes |

**Context** (internal state):
| Field | Type | Description |
|-------|------|-------------|
| `triggerId` | `string` | Generated ID for trigger |
| `contentId` | `string` | Generated ID for content |
| `titleId` | `string` | Generated ID for title |
| `descriptionId` | `string \| null` | Generated ID for description |
| `triggerElement` | `HTMLElement \| null` | Reference for focus return |

**State transitions**:
```
closed --[OPEN]--> open
open --[CLOSE]--> closed
open --[DISMISS (escape/outside)]--> closed
```

**Computed ARIA (Trigger)**:
- `aria-haspopup`: `'dialog'`
- `aria-expanded`: `open`
- `aria-controls`: `contentId`

**Computed ARIA (Content)**:
- `role`: `role`
- `aria-modal`: `'true'`
- `aria-labelledby`: `titleId`
- `aria-describedby`: `descriptionId` (if set)
- `tabIndex`: `-1`

**Focus management**:
- On open: Activate focus trap, focus first focusable or content
- On close: Return focus to trigger element

---

### MenuBehavior

Dropdown menu with roving focus and type-ahead.

| Field | Type | Description |
|-------|------|-------------|
| `open` | `boolean` | Whether menu is open |
| `placement` | `Placement` | Position relative to trigger |
| `offset` | `number` | Gap between trigger and content |
| `flip` | `boolean` | Whether to flip on viewport edge |
| `loop` | `boolean` | Whether to loop navigation |

**Context** (internal state):
| Field | Type | Description |
|-------|------|-------------|
| `triggerId` | `string` | Generated ID for trigger |
| `contentId` | `string` | Generated ID for content |
| `activeIndex` | `number` | Currently focused item index |
| `triggerElement` | `HTMLElement \| null` | Reference for focus return |
| `items` | `HTMLElement[]` | Menu item elements |

**State transitions**:
```
closed --[OPEN]--> open
open --[CLOSE]--> closed
open --[SELECT (item)]--> closed
open --[DISMISS (escape/outside)]--> closed
```

**Computed ARIA (Trigger)**:
- `aria-haspopup`: `'menu'`
- `aria-expanded`: `open`
- `aria-controls`: `contentId`

**Computed ARIA (Content)**:
- `role`: `'menu'`
- `aria-labelledby`: `triggerId`
- `aria-orientation`: `'vertical'`

**Computed ARIA (Item)**:
- `role`: `'menuitem'`
- `tabIndex`: `index === activeIndex ? 0 : -1`
- `aria-disabled`: `item.disabled ? 'true' : undefined`

**Keyboard handlers**:
- Arrow Up/Down: Navigate items (via roving focus)
- Enter/Space: Select current item
- Escape: Close menu
- Character keys: Type-ahead search
- Home/End: First/last item

---

## React Component Context Models

### DialogContext

Shared via React Context between compound components.

| Field | Type | Description |
|-------|------|-------------|
| `open` | `boolean` | Current open state |
| `setOpen` | `(open: boolean) => void` | State setter |
| `contentId` | `string` | ID for aria-controls |
| `titleId` | `string` | ID for aria-labelledby |
| `descriptionId` | `string` | ID for aria-describedby |
| `triggerRef` | `RefObject<HTMLElement>` | Trigger element ref |
| `contentRef` | `RefObject<HTMLElement>` | Content element ref |

### MenuContext

| Field | Type | Description |
|-------|------|-------------|
| `open` | `boolean` | Current open state |
| `setOpen` | `(open: boolean) => void` | State setter |
| `contentId` | `string` | ID for aria-controls |
| `triggerId` | `string` | ID for aria-labelledby |
| `activeIndex` | `number` | Currently focused item |
| `setActiveIndex` | `(index: number) => void` | Focus setter |
| `registerItem` | `(element: HTMLElement) => void` | Item registration |
| `unregisterItem` | `(element: HTMLElement) => void` | Item cleanup |

---

## Type Definitions

### Placement (existing in primitives-dom)

```typescript
type Placement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end';
```

### Event Types

```typescript
// Behavior events
type DialogEvent = { type: 'OPEN' } | { type: 'CLOSE' } | { type: 'DISMISS'; reason: 'escape' | 'outside-click' };
type MenuEvent = { type: 'OPEN' } | { type: 'CLOSE' } | { type: 'SELECT'; value: string } | { type: 'DISMISS' };

// React callbacks
interface DialogCallbacks {
  onOpenChange?: (open: boolean) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onOutsideClick?: (event: MouseEvent) => void;
}

interface MenuCallbacks {
  onOpenChange?: (open: boolean) => void;
  onSelect?: (value: string) => void;
}
```

---

## Validation Rules

### DialogBehavior
- `role` must be `'dialog'` or `'alertdialog'`
- If `role` is `'alertdialog'`, `closeOnEscape` should typically be `false`
- Content must have a title (titleId required)

### MenuBehavior
- Items must have unique values for selection
- At least one non-disabled item required when open
- `activeIndex` must be valid index or -1

---

## State Transitions Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      DIALOG STATE MACHINE                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌────────┐         OPEN          ┌────────┐               │
│   │ CLOSED │ ──────────────────▶   │  OPEN  │               │
│   └────────┘                       └────────┘               │
│        ▲                                │                   │
│        │         CLOSE/DISMISS          │                   │
│        └────────────────────────────────┘                   │
│                                                             │
│   Side Effects:                                             │
│   - OPEN: activate focus trap, store trigger, focus content │
│   - CLOSE: deactivate focus trap, return focus to trigger   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       MENU STATE MACHINE                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌────────┐         OPEN          ┌────────┐               │
│   │ CLOSED │ ──────────────────▶   │  OPEN  │               │
│   └────────┘                       └────────┘               │
│        ▲                                │                   │
│        │     CLOSE/DISMISS/SELECT       │                   │
│        └────────────────────────────────┘                   │
│                                                             │
│   Side Effects:                                             │
│   - OPEN: position content, setup dismiss layer,            │
│           setup roving focus, setup type-ahead,             │
│           focus first item                                  │
│   - CLOSE: cleanup all utilities, return focus to trigger   │
│   - SELECT: emit value, then close                          │
└─────────────────────────────────────────────────────────────┘
```
