# Quickstart: Forms and Overlays Components

**Feature**: 010-forms-overlays
**Date**: 2026-01-04

## Prerequisites

- Node.js 20+
- pnpm 10+
- Repository cloned and dependencies installed

```bash
pnpm install
```

## Development Workflow

### 1. Build Dependencies

```bash
# Build tokens and CSS first (required by components)
pnpm build:tokens
pnpm build:css

# Build primitives-dom (behavior utilities)
pnpm --filter @ds/primitives-dom build
```

### 2. Run Component Development

```bash
# Start component development with hot reload
pnpm --filter @ds/wc dev

# Or run tests in watch mode
pnpm --filter @ds/wc test -- --watch
```

### 3. Run Accessibility Tests

```bash
# Run a11y automation tests
pnpm --filter @ds/wc test:a11y
```

## Component Usage Examples

### Field Pattern with Input

```html
<ds-field required>
  <ds-label>Email address</ds-label>
  <ds-field-description>
    We'll never share your email with anyone.
  </ds-field-description>
  <ds-input type="email" placeholder="you@example.com"></ds-input>
  <ds-field-error>Please enter a valid email address.</ds-field-error>
</ds-field>
```

### Checkbox

```html
<ds-checkbox name="terms" required>
  I agree to the terms and conditions
</ds-checkbox>
```

### Radio Group

```html
<ds-radio-group name="plan" value="pro" orientation="vertical">
  <ds-radio value="free">Free Plan</ds-radio>
  <ds-radio value="pro">Pro Plan</ds-radio>
  <ds-radio value="enterprise">Enterprise Plan</ds-radio>
</ds-radio-group>
```

### Switch

```html
<ds-switch name="notifications" checked>
  Enable email notifications
</ds-switch>
```

### Dialog

```html
<ds-dialog>
  <button slot="trigger">Open Settings</button>
  <ds-dialog-content>
    <ds-dialog-title>Settings</ds-dialog-title>
    <ds-dialog-description>
      Configure your preferences below.
    </ds-dialog-description>
    <!-- Dialog content here -->
    <button>Save Changes</button>
    <button>Cancel</button>
  </ds-dialog-content>
</ds-dialog>
```

### Popover

```html
<ds-popover placement="bottom-start">
  <button slot="trigger">Options</button>
  <ds-popover-content>
    Popover content with actions
  </ds-popover-content>
</ds-popover>
```

### Tooltip

```html
<ds-tooltip placement="top">
  <button slot="trigger" aria-label="Help">?</button>
  <ds-tooltip-content>Click here to learn more about this feature.</ds-tooltip-content>
</ds-tooltip>
```

### Menu

```html
<ds-menu placement="bottom-start">
  <button slot="trigger">Actions</button>
  <ds-menu-content>
    <ds-menu-item value="edit">Edit</ds-menu-item>
    <ds-menu-item value="duplicate">Duplicate</ds-menu-item>
    <ds-menu-item value="delete" disabled>Delete</ds-menu-item>
  </ds-menu-content>
</ds-menu>
```

## Event Handling

```javascript
// Form controls
document.querySelector('ds-input').addEventListener('ds:change', (e) => {
  console.log('Value:', e.detail.value);
});

// Checkbox/Switch
document.querySelector('ds-checkbox').addEventListener('ds:change', (e) => {
  console.log('Checked:', e.detail.checked);
});

// Radio group
document.querySelector('ds-radio-group').addEventListener('ds:change', (e) => {
  console.log('Selected:', e.detail.value);
});

// Dialog
document.querySelector('ds-dialog').addEventListener('ds:close', () => {
  console.log('Dialog closed');
});

// Menu selection
document.querySelector('ds-menu').addEventListener('ds:select', (e) => {
  console.log('Selected:', e.detail.value);
});
```

## React Usage

```tsx
import { Field, Label, Input, Dialog, DialogContent, DialogTitle, Menu, MenuContent, MenuItem } from '@ds/react';
import { useState } from 'react';

function ContactForm() {
  const [email, setEmail] = useState('');

  return (
    <Field required>
      <Label>Email</Label>
      <Input
        type="email"
        value={email}
        onInput={(value) => setEmail(value)}
      />
    </Field>
  );
}

function SettingsDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button slot="trigger">Settings</button>
      <DialogContent>
        <DialogTitle>Settings</DialogTitle>
        {/* Content */}
      </DialogContent>
    </Dialog>
  );
}
```

## Validation and Testing

### Run Manifest Validation

```bash
pnpm validate:manifests
```

### Run Type Checking

```bash
pnpm typecheck
```

### Run Full Test Suite

```bash
pnpm test
```

## Implementation Order

Follow the phased approach from the spec:

1. **Phase 1**: Field pattern + Dialog
   - `ds-field`, `ds-label`, `ds-field-description`, `ds-field-error`
   - Enhance `ds-input` for Field integration
   - `ds-dialog` with focus trap and dismiss layer

2. **Phase 2**: Additional form controls
   - `ds-textarea` with auto-resize
   - `ds-checkbox` with tri-state
   - `ds-radio-group` and `ds-radio`
   - `ds-switch`

3. **Phase 3**: Overlay components
   - `ds-popover` with positioning
   - `ds-tooltip` with delays
   - `ds-menu` with roving focus and type-ahead

Each component must have:
- [x] Component implementation
- [x] manifest.json
- [x] Unit tests
- [x] A11y tests
- [x] MDX documentation

## Troubleshooting

### Components not rendering

Ensure custom elements are registered:

```javascript
import '@ds/wc';
// or
import { defineAll } from '@ds/wc';
defineAll();
```

### Focus trap not working

Verify the dialog content has focusable elements. If empty, add `tabindex="-1"` to the dialog container.

### Positioning issues

Check that no ancestor has `overflow: hidden` clipping the popover/tooltip. The positioning utility will attempt to flip placement but cannot escape clip containers.
