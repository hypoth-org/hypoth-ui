# Quickstart: Shared Accessible Component API

**Feature**: 014-shared-a11y-api
**Date**: 2026-01-05

## Overview

This feature introduces a shared behavior layer in `@ds/primitives-dom` that powers both React and Web Component implementations. After implementation:

- **React developers**: Use native React components with compound patterns (`Dialog.Root`, `Dialog.Trigger`, etc.)
- **Web Component users**: Continue using `<ds-dialog>`, `<ds-menu>` with unchanged API
- **Both**: Get identical accessibility (ARIA, keyboard) from the shared behavior primitives

---

## Quick Verification Commands

### Build & Test

```bash
# Build all packages
pnpm build

# Run tests (includes a11y tests)
pnpm test

# Type check
pnpm typecheck

# Run only a11y tests
pnpm test:a11y
```

### Verify React Components

```bash
# Start docs app to test React components
pnpm --filter @ds/docs-app dev

# Run React component tests
pnpm --filter @ds/react test
```

### Verify Web Components

```bash
# Run WC tests (ensure existing tests still pass)
pnpm --filter @ds/wc test

# Run WC a11y tests
pnpm --filter @ds/wc test:a11y
```

---

## Usage Examples

### React: Dialog with Compound Components

```tsx
import { Dialog } from '@ds/react';

function MyDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button>Open Dialog</button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Confirm Action</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to proceed?
        </Dialog.Description>
        <button onClick={() => setOpen(false)}>Cancel</button>
        <button onClick={() => { /* action */ setOpen(false); }}>
          Confirm
        </button>
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

### React: Menu with asChild

```tsx
import { Menu } from '@ds/react';

function MyMenu() {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <MyCustomButton>Actions</MyCustomButton>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item onSelect={() => console.log('edit')}>Edit</Menu.Item>
        <Menu.Item onSelect={() => console.log('delete')}>Delete</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  );
}
```

### Web Component: Dialog (unchanged API)

```html
<ds-dialog>
  <button slot="trigger">Open Dialog</button>
  <ds-dialog-content>
    <ds-dialog-title>Confirm Action</ds-dialog-title>
    <ds-dialog-description>Are you sure?</ds-dialog-description>
    <button>Cancel</button>
    <button>Confirm</button>
  </ds-dialog-content>
</ds-dialog>
```

### Web Component: Menu (unchanged API)

```html
<ds-menu>
  <button slot="trigger">Actions</button>
  <ds-menu-content>
    <ds-menu-item value="edit">Edit</ds-menu-item>
    <ds-menu-item value="delete">Delete</ds-menu-item>
  </ds-menu-content>
</ds-menu>
```

---

## Verification Checklist

### Behavior Primitives (`@ds/primitives-dom`)

- [ ] `createDialogBehavior` exported from package
- [ ] `createMenuBehavior` exported from package
- [ ] Each primitive is ≤3KB gzipped
- [ ] Zero runtime dependencies (check `package.json`)
- [ ] Unit tests pass: `pnpm --filter @ds/primitives-dom test`

### React Components (`@ds/react`)

- [ ] `Dialog` compound components work (`Dialog.Root`, `.Trigger`, `.Content`, `.Title`, `.Description`)
- [ ] `Menu` compound components work (`Menu.Root`, `.Trigger`, `.Content`, `.Item`)
- [ ] `asChild` prop works on triggers
- [ ] No `ds-*` custom elements in rendered output
- [ ] React DevTools shows React components (not WC wrappers)
- [ ] Refs work correctly on all parts
- [ ] Unit tests pass: `pnpm --filter @ds/react test`
- [ ] A11y tests pass: `pnpm --filter @ds/react test:a11y`

### Web Components (`@ds/wc`)

- [ ] `<ds-dialog>` works with same API as before
- [ ] `<ds-menu>` works with same API as before
- [ ] All existing tests pass: `pnpm --filter @ds/wc test`
- [ ] A11y tests pass: `pnpm --filter @ds/wc test:a11y`
- [ ] No regressions in keyboard navigation
- [ ] No regressions in screen reader announcements

### Accessibility Parity

- [ ] Both Dialog implementations pass axe-core
- [ ] Both Menu implementations pass axe-core
- [ ] Escape key closes both Dialog implementations
- [ ] Tab traps work identically in both Dialog implementations
- [ ] Arrow keys navigate both Menu implementations
- [ ] Type-ahead works in both Menu implementations

### Bundle Size

- [ ] No bundle size increase for WC-only consumers
- [ ] Behavior primitives tree-shake when unused
- [ ] Each primitive module ≤3KB gzipped

---

## Troubleshooting

### "Component must be used within Root"

React compound components require proper nesting:

```tsx
// ❌ Wrong - Trigger outside Root
<Dialog.Trigger>Open</Dialog.Trigger>

// ✅ Correct
<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
</Dialog.Root>
```

### asChild not working

Ensure child component forwards refs:

```tsx
// ❌ Won't work - no ref forwarding
const MyButton = (props) => <button {...props} />;

// ✅ Works - forwards ref
const MyButton = forwardRef((props, ref) => <button ref={ref} {...props} />);

<Dialog.Trigger asChild>
  <MyButton>Open</MyButton>
</Dialog.Trigger>
```

### Focus not returning to trigger

Ensure trigger element is focusable and not removed from DOM:

```tsx
// ❌ Trigger removed on close
{!open && <Dialog.Trigger>Open</Dialog.Trigger>}

// ✅ Trigger always in DOM
<Dialog.Trigger>Open</Dialog.Trigger>
```

---

## Related Documentation

- [spec.md](./spec.md) - Feature specification
- [plan.md](./plan.md) - Implementation plan
- [research.md](./research.md) - Research findings
- [data-model.md](./data-model.md) - Data model definitions
- [contracts/](./contracts/) - TypeScript interfaces
