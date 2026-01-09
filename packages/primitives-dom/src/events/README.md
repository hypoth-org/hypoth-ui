# Event Naming Conventions

This document describes the standardized event naming conventions used across the Hypoth UI Design System.

## Overview

The design system uses a dual event model:
- **Web Components** emit custom events with the `ds:` prefix
- **React components** accept callback props with the `on` prefix

## Event Name Mappings

| Event Type | React Callback | WC Event | Description |
|------------|----------------|----------|-------------|
| Press | `onPress` | `ds:press` | User activation (click, Enter, Space) |
| Value Change | `onValueChange` | `ds:change` | Value changed by user interaction |
| Open Change | `onOpenChange` | `ds:open-change` | Open state changed |
| Select | `onSelect` | `ds:select` | Item selected |
| Focus Change | `onFocusChange` | `ds:focus-change` | Focus changed within component |
| Sort Change | `onSortChange` | `ds:sort-change` | Sort state changed |
| Expanded Change | `onExpandedChange` | `ds:expanded-change` | Expanded state changed |
| Checked Change | `onCheckedChange` | `ds:checked-change` | Checked state changed |
| Dismiss | `onDismiss` | `ds:dismiss` | Component dismissed |
| Reorder | `onReorder` | `ds:reorder` | Items reordered via drag-and-drop |
| Index Change | `onIndexChange` | `ds:index-change` | Current page/tab/step index changed |
| Search | `onSearch` | `ds:search` | Search query changed |
| Hover Change | `onHoverChange` | `ds:hover-change` | Hover state changed |
| Copy | `onCopy` | `ds:copy` | Content copied to clipboard |
| Resize | `onResize` | `ds:resize` | Element resized |

## Event Categories

### Activation Events (`ds:press`)

Used for buttons, links, menu items, and other clickable elements.

```tsx
// React
<Button onPress={(e) => console.log('Pressed!', e.isKeyboard)} />

// Web Component
button.addEventListener('ds:press', (e) => {
  console.log('Pressed!', e.detail.isKeyboard);
});
```

**Event Detail:**
```ts
interface PressEventDetail {
  originalEvent: MouseEvent | KeyboardEvent;
  target: HTMLElement;
  isKeyboard: boolean;
}
```

### Value Change Events (`ds:change`)

Used for inputs, selects, checkboxes, sliders, and other form controls.

```tsx
// React
<Select onValueChange={(value) => setSelected(value)} />

// Web Component
select.addEventListener('ds:change', (e) => {
  console.log('New value:', e.detail.value);
});
```

**Event Detail:**
```ts
interface ValueChangeEventDetail<T = unknown> {
  value: T;
  previousValue?: T;
}
```

### Open/Close Events (`ds:open-change`)

Used for dialogs, menus, popovers, dropdowns, and other overlay components.

```tsx
// React
<Dialog onOpenChange={(open, { reason }) => {
  if (reason === 'escape') analytics.track('dialog_escaped');
}} />

// Web Component
dialog.addEventListener('ds:open-change', (e) => {
  console.log('Open:', e.detail.open, 'Reason:', e.detail.reason);
});
```

**Event Detail:**
```ts
interface OpenChangeEventDetail {
  open: boolean;
  reason?: 'escape' | 'outside-click' | 'trigger' | 'programmatic' | 'blur';
}
```

**Cancellation:** The `ds:open-change` event is cancelable when closing. Call `event.preventDefault()` to prevent the close:

```ts
dialog.addEventListener('ds:open-change', (e) => {
  if (!e.detail.open && hasUnsavedChanges) {
    e.preventDefault(); // Prevent closing
    showConfirmDialog();
  }
});
```

### Selection Events (`ds:select`)

Used for lists, trees, tables, command palettes, and other selectable components.

```tsx
// React
<CommandPalette onSelect={({ value }) => executeCommand(value)} />

// Web Component
list.addEventListener('ds:select', (e) => {
  console.log('Selected:', e.detail.value);
});
```

**Event Detail:**
```ts
interface SelectEventDetail<T = unknown> {
  value: T;
  selected: boolean;
  element?: HTMLElement;
}
```

## Component Usage Guide

### Buttons and Links
- Use `onPress` / `ds:press` for activation
- Do NOT use `onClick` - the press event handles both mouse and keyboard

### Form Controls (Input, Select, Checkbox, etc.)
- Use `onValueChange` / `ds:change` for value changes
- React adapters may also accept `onChange` for compatibility

### Dialogs, Menus, Popovers
- Use `onOpenChange` / `ds:open-change` for open state
- The event includes a `reason` for programmatic handling

### Trees, Accordions
- Use `onExpandedChange` / `ds:expanded-change` for expand/collapse

### Checkboxes, Switches, Radio Groups
- Use `onCheckedChange` / `ds:checked-change` for checked state

### Tables with Sorting
- Use `onSortChange` / `ds:sort-change` for sort state

### Pagination, Tabs, Steppers
- Use `onIndexChange` / `ds:index-change` for index/page changes

## Implementation Notes

### Web Components

All events:
- Use the `ds:` prefix to avoid collision with native DOM events
- Bubble by default (`bubbles: true`)
- Cross shadow DOM boundaries (`composed: true`)
- Are NOT cancelable by default (except `ds:open-change` when closing)

Use the `emitEvent` helper:

```ts
import { emitEvent, StandardEvents } from '../events/emit.js';

// Emit a press event
emitEvent(this, StandardEvents.PRESS, {
  detail: { originalEvent: event, target: this, isKeyboard: false }
});

// Emit an open-change event (cancelable when closing)
const evt = emitEvent(this, StandardEvents.OPEN_CHANGE, {
  detail: { open: false, reason: 'escape' },
  cancelable: true
});

if (evt.defaultPrevented) {
  // Consumer prevented close
  return;
}
```

### React Adapters

React adapters should:
1. Listen for the WC event
2. Extract the event detail
3. Call the appropriate callback prop

```tsx
// In adapter
useEffect(() => {
  const handlePress = (e: CustomEvent<PressEventDetail>) => {
    onPress?.(e.detail);
  };

  wcRef.current?.addEventListener('ds:press', handlePress);
  return () => wcRef.current?.removeEventListener('ds:press', handlePress);
}, [onPress]);
```

## Migration from Legacy Events

| Old Event | New Event | Notes |
|-----------|-----------|-------|
| `ds:click` | `ds:press` | Includes keyboard activation |
| `ds:open` + `ds:close` | `ds:open-change` | Single event with `open` detail |
| `ds:before-close` | `ds:open-change` | Use cancelable option |

## See Also

- [event-names.ts](./event-names.ts) - Type definitions and helpers
- [@ds/wc/src/events/emit.ts](../../wc/src/events/emit.ts) - WC event emission utilities
