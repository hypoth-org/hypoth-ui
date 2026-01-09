# Quickstart: Design System Audit Remediation

**Feature Branch**: `021-ds-audit-remediation`
**Date**: 2026-01-09

This guide provides a quick overview of implementing the audit remediation tasks.

## Prerequisites

- Node.js 18+
- pnpm 8+
- Familiarity with Lit Web Components
- Understanding of ElementInternals API

## 1. Add Form Association to a Component

### Step 1: Add static property and internals

```typescript
// packages/wc/src/components/checkbox/checkbox.ts
import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';

export class DsCheckbox extends LitElement {
  // Enable form participation
  static formAssociated = true;

  // Store ElementInternals reference
  private internals: ElementInternals;

  @property({ type: String, reflect: true })
  name = '';

  @property({ type: String })
  value = 'on';

  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Boolean, reflect: true })
  required = false;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }
}
```

### Step 2: Update form value on state change

```typescript
override updated(changedProperties: Map<string, unknown>): void {
  super.updated(changedProperties);

  if (changedProperties.has('checked')) {
    // Submit value when checked, null when unchecked
    this.internals.setFormValue(this.checked ? this.value : null);
    this.updateValidity();
  }
}

private updateValidity(): void {
  if (this.required && !this.checked) {
    this.internals.setValidity(
      { valueMissing: true },
      'Please check this box',
      this
    );
  } else {
    this.internals.setValidity({});
  }
}
```

### Step 3: Implement form lifecycle callbacks

```typescript
formResetCallback(): void {
  this.checked = false;
  this.internals.setFormValue(null);
  this.internals.setValidity({});
}

formDisabledCallback(disabled: boolean): void {
  this.disabled = disabled;
}
```

### Step 4: Expose validation methods

```typescript
get validity(): ValidityState {
  return this.internals.validity;
}

get validationMessage(): string {
  return this.internals.validationMessage;
}

checkValidity(): boolean {
  return this.internals.checkValidity();
}

reportValidity(): boolean {
  return this.internals.reportValidity();
}
```

## 2. Migrate Component to Behavior Primitive

### Step 1: Import behavior primitive

```typescript
// packages/wc/src/components/dialog/dialog.ts
import { createDialogBehavior, type DialogBehavior } from '@ds/primitives-dom';
```

### Step 2: Replace manual setup with behavior

```typescript
export class DsDialog extends DSElement {
  private dialog: DialogBehavior | null = null;

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: Boolean, attribute: 'close-on-escape' })
  closeOnEscape = true;

  @property({ type: Boolean, attribute: 'close-on-backdrop' })
  closeOnBackdrop = true;

  override connectedCallback(): void {
    super.connectedCallback();

    this.dialog = createDialogBehavior({
      role: 'dialog',
      closeOnEscape: this.closeOnEscape,
      closeOnOutsideClick: this.closeOnBackdrop,
      onOpenChange: (open) => {
        this.open = open;
        emitEvent(this, open ? StandardEvents.OPEN : StandardEvents.CLOSE);
      },
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.dialog?.destroy();
    this.dialog = null;
  }
}
```

### Step 3: Delegate open/close to behavior

```typescript
public show(): void {
  this.dialog?.open();
}

public close(): void {
  this.dialog?.close();
}
```

### Step 4: Apply ARIA props from behavior

```typescript
override updated(changedProperties: Map<string, unknown>): void {
  if (changedProperties.has('open') && this.open && this.dialog) {
    const trigger = this.querySelector('[slot="trigger"]');
    const content = this.querySelector('ds-dialog-content');

    this.dialog.setTriggerElement(trigger as HTMLElement);
    this.dialog.setContentElement(content as HTMLElement);

    // Apply computed ARIA attributes
    if (content) {
      const props = this.dialog.getContentProps();
      content.setAttribute('role', props.role);
      content.setAttribute('aria-modal', String(props['aria-modal']));
      if (props['aria-labelledby']) {
        content.setAttribute('aria-labelledby', props['aria-labelledby']);
      }
    }
  }
}
```

### Step 5: Remove duplicated code

Delete these methods/properties that are now handled by the behavior:
- `setupFocusAndDismiss()`
- `handleDismiss()`
- `updateContentAccessibility()`
- `private focusTrap: FocusTrap`
- `private dismissLayer: DismissableLayer`

## 3. Add Tree-Shaking Support

### Step 1: Update package.json

```json
{
  "sideEffects": false,
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./button": {
      "types": "./dist/components/button/button.d.ts",
      "import": "./dist/components/button/button.js"
    }
  }
}
```

### Step 2: Create category barrel files

```typescript
// packages/wc/src/form-controls.ts
export { DsButton } from './components/button/button.js';
export { DsInput } from './components/input/input.js';
export { DsCheckbox } from './components/checkbox/checkbox.js';
// ... etc
```

### Step 3: Update tsup config

```typescript
// packages/wc/tsup.config.ts
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'form-controls': 'src/form-controls.ts',
    overlays: 'src/overlays.ts',
  },
  format: ['esm'],
  dts: true,
  external: ['lit'],
});
```

## 4. Create Tabs Behavior Primitive

### Step 1: Create the behavior file

```typescript
// packages/primitives-dom/src/behavior/tabs.ts
import { createRovingFocus } from '../keyboard/roving-focus.js';
import { createActivationHandler } from '../keyboard/activation.js';

export interface TabsBehaviorOptions {
  defaultValue?: string;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
  loop?: boolean;
  onValueChange?: (value: string) => void;
}

export function createTabsBehavior(options: TabsBehaviorOptions = {}) {
  const {
    defaultValue,
    orientation = 'horizontal',
    activationMode = 'automatic',
    loop = true,
    onValueChange,
  } = options;

  let value = defaultValue;
  let focusedValue = defaultValue;
  const tabs = new Set<string>();

  // ... implementation
}
```

### Step 2: Export from index

```typescript
// packages/primitives-dom/src/index.ts
export {
  createTabsBehavior,
  type TabsBehavior,
  type TabsBehaviorOptions,
} from './behavior/tabs.js';
```

## 5. Verification Commands

```bash
# Build all packages
pnpm build

# Run type checking
pnpm typecheck

# Run tests
pnpm test

# Test form association
pnpm --filter @ds/wc test -- --grep "form"

# Verify bundle size
pnpm --filter @ds/wc build && ls -la packages/wc/dist/

# Test tree-shaking (manual)
# Create test file importing single component, build with Vite, check bundle
```

## Component Migration Checklist

For each form control:
- [ ] Add `static formAssociated = true`
- [ ] Add `private internals: ElementInternals`
- [ ] Call `this.attachInternals()` in constructor
- [ ] Implement `setFormValue()` on value change
- [ ] Implement `setValidity()` for validation
- [ ] Add `formResetCallback()`
- [ ] Add `formDisabledCallback()`
- [ ] Expose `validity`, `validationMessage`, `checkValidity()`, `reportValidity()`
- [ ] Add tests for form submission

For each overlay component:
- [ ] Import behavior primitive from @ds/primitives-dom
- [ ] Create behavior in `connectedCallback()`
- [ ] Delegate open/close to behavior
- [ ] Apply ARIA props from behavior getters
- [ ] Remove duplicated focus trap/dismiss layer code
- [ ] Destroy behavior in `disconnectedCallback()`
- [ ] Verify keyboard navigation works identically to React

## Files to Modify

### Form Association (5 components)
- `packages/wc/src/components/checkbox/checkbox.ts`
- `packages/wc/src/components/switch/switch.ts`
- `packages/wc/src/components/radio/radio-group.ts`
- `packages/wc/src/components/select/select.ts`
- `packages/wc/src/components/combobox/combobox.ts`

### Behavior Migration (6 components)
- `packages/wc/src/components/dialog/dialog.ts`
- `packages/wc/src/components/alert-dialog/alert-dialog.ts`
- `packages/wc/src/components/sheet/sheet.ts`
- `packages/wc/src/components/drawer/drawer.ts`
- `packages/wc/src/components/dropdown-menu/dropdown-menu.ts`
- `packages/wc/src/components/context-menu/context-menu.ts`

### Tree-Shaking
- `packages/wc/package.json`
- `packages/wc/tsup.config.ts`
- Create: `packages/wc/src/form-controls.ts`
- Create: `packages/wc/src/overlays.ts`
- Create: `packages/wc/src/data-display.ts`
- Create: `packages/wc/src/navigation.ts`

### New Primitive
- Create: `packages/primitives-dom/src/behavior/tabs.ts`
- Update: `packages/primitives-dom/src/index.ts`
