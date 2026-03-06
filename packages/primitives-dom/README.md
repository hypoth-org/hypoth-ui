# @hypoth-ui/primitives-dom

![Alpha](https://img.shields.io/badge/status-alpha-orange)

Low-level DOM behavior primitives for the hypoth-ui design system. Provides framework-agnostic utilities for focus management, keyboard navigation, and ARIA patterns used by higher-level components.

## Installation

```bash
npm install @hypoth-ui/primitives-dom
```

## Usage

```typescript
import {
  createFocusTrap,
  createRovingFocus,
  createTypeAhead,
  createDismissableLayer,
} from '@hypoth-ui/primitives-dom';

// Trap focus within a dialog
const trap = createFocusTrap(dialogElement);
trap.activate();

// Enable arrow-key navigation within a list
const roving = createRovingFocus(listElement, {
  orientation: 'vertical',
});

// Add type-ahead search to a listbox
const typeAhead = createTypeAhead(listboxElement, {
  onMatch: (item) => item.focus(),
});

// Dismiss on outside click or Escape
const layer = createDismissableLayer(popoverElement, {
  onDismiss: () => closePopover(),
});
```

## Documentation

See the [main README](../../README.md) for full documentation and architecture overview.

## License

MIT
