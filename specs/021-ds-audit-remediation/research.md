# Research: Design System Audit Remediation

**Feature Branch**: `021-ds-audit-remediation`
**Date**: 2026-01-09

## 1. ElementInternals Form Association

### Decision
Use native ElementInternals API with `static formAssociated = true` for all form controls (Checkbox, Switch, Radio, Select, Combobox). No polyfill needed.

### Rationale
- Modern browser support is sufficient (Chrome 77+, Firefox 93+, Safari 16.4+)
- ElementInternals provides native form participation without hidden input workarounds
- Integrates with constraint validation API for native browser validation UI
- Enables form lifecycle callbacks (formResetCallback, formDisabledCallback, formStateRestoreCallback)

### Implementation Pattern
```typescript
export class DsCheckbox extends DSElement {
  static formAssociated = true;

  private internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('checked')) {
      this.internals.setFormValue(this.checked ? this.value : null);
      this.updateValidity();
    }
  }

  private updateValidity(): void {
    if (this.required && !this.checked) {
      this.internals.setValidity({ valueMissing: true }, 'Required', this);
    } else {
      this.internals.setValidity({});
    }
  }

  formResetCallback(): void {
    this.checked = false;
    this.internals.setFormValue(null);
  }

  formDisabledCallback(disabled: boolean): void {
    this.disabled = disabled;
  }
}
```

### Alternatives Considered
1. **Hidden input approach**: Adds DOM overhead, doesn't integrate with constraint validation
2. **Polyfill (element-internals-polyfill)**: Adds ~3KB, not needed for modern browser targets
3. **Custom event-based form integration**: Non-standard, requires consumer-side handling

---

## 2. Behavior Primitive Migration

### Decision
Refactor WC overlay components (Dialog, AlertDialog, Sheet, Drawer, DropdownMenu, ContextMenu) to use existing behavior primitives from @ds/primitives-dom.

### Rationale
- Behavior primitives already exist and are tested (createDialogBehavior, createMenuBehavior)
- React components already use these primitives correctly
- Eliminates ~40-50% boilerplate per component
- Ensures accessibility parity between React and WC implementations
- Centralizes focus trap, dismissable layer, and ARIA management

### Current State Analysis
**Dialog (current)**: 350 lines
- Manually creates focusTrap and dismissLayer in setupFocusAndDismiss()
- Manually manages ARIA via updateContentAccessibility()
- Duplicates logic that exists in createDialogBehavior

**Menu (current)**: 450 lines
- Manually orchestrates 4 primitives (roving focus, type-ahead, anchor position, dismiss layer)
- Separate setup methods for each concern
- Duplicates logic that exists in createMenuBehavior

### Refactoring Pattern
```typescript
export class DsDialog extends DSElement {
  private dialog: DialogBehavior;

  override connectedCallback(): void {
    super.connectedCallback();
    this.dialog = createDialogBehavior({
      defaultOpen: false,
      role: this.dialogRole,
      closeOnEscape: this.closeOnEscape,
      closeOnOutsideClick: this.closeOnBackdrop,
      onOpenChange: (open) => {
        this.open = open;
        emitEvent(this, open ? StandardEvents.OPEN : StandardEvents.CLOSE);
      }
    });
  }

  public show(): void {
    this.dialog.open();
  }

  public close(): void {
    this.dialog.close();
  }

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has('open') && this.open) {
      this.dialog.setTriggerElement(this.querySelector('[slot="trigger"]'));
      this.dialog.setContentElement(this.querySelector('ds-dialog-content'));
      this.applyAriaProps();
    }
  }

  private applyAriaProps(): void {
    const content = this.querySelector('ds-dialog-content');
    const contentProps = this.dialog.getContentProps();
    Object.entries(contentProps).forEach(([key, value]) => {
      if (value !== undefined) content?.setAttribute(key, String(value));
    });
  }
}
```

### Components to Migrate
| Component | Behavior Primitive | Estimated Code Reduction |
|-----------|-------------------|-------------------------|
| DsDialog | createDialogBehavior | ~40% |
| DsAlertDialog | createDialogBehavior | ~50% |
| DsSheet | createDialogBehavior | ~40% |
| DsDrawer | createDialogBehavior | ~40% |
| DsDropdownMenu | createMenuBehavior | ~50% |
| DsContextMenu | createMenuBehavior | ~50% |

### Alternatives Considered
1. **Keep current implementation**: Maintains status quo, but duplicates logic and risks accessibility divergence
2. **Create WC-specific behavior utilities**: Adds maintenance burden, doesn't leverage existing primitives

---

## 3. Tabs Behavior Primitive

### Decision
Create new `createTabsBehavior` primitive in @ds/primitives-dom for centralized tabs keyboard navigation and ARIA management.

### Rationale
- Both React and WC Tabs implement similar keyboard navigation separately
- WAI-ARIA Tabs pattern has well-defined keyboard interactions
- Centralizing enables consistent behavior across platforms
- Follows established pattern of other behavior primitives

### API Design
```typescript
export interface TabsBehaviorOptions {
  defaultValue?: string;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
  loop?: boolean;
  onValueChange?: (value: string) => void;
}

export interface TabsBehavior {
  readonly state: TabsBehaviorState;
  selectTab(value: string): void;
  getTabListProps(): TabListProps;
  getTabProps(value: string): TabProps;
  getPanelProps(value: string): PanelProps;
  handleKeyDown(event: KeyboardEvent): void;
  destroy(): void;
}

export interface TabsBehaviorState {
  value: string | undefined;
  orientation: 'horizontal' | 'vertical';
  activationMode: 'automatic' | 'manual';
}
```

### Keyboard Navigation (per WAI-ARIA)
- **Horizontal**: Left/Right arrows navigate tabs
- **Vertical**: Up/Down arrows navigate tabs
- **Home**: Move to first tab
- **End**: Move to last tab
- **automatic mode**: Selection follows focus
- **manual mode**: Enter/Space required to select

### Alternatives Considered
1. **Keep tabs logic in components**: Continues code duplication
2. **Use existing roving focus only**: Misses activation mode and panel coordination

---

## 4. Tree-Shaking Optimization

### Decision
Add `sideEffects: false` to @ds/wc package.json and implement subpath exports for component categories.

### Rationale
- @ds/react already has `sideEffects: false` (good pattern)
- Current barrel file (400+ lines) forces bundlers to include all components
- Subpath exports enable precise imports like `@ds/wc/button`
- No code changes needed for sideEffects flag

### Package.json Changes
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
    },
    "./form-controls": {
      "types": "./dist/form-controls.d.ts",
      "import": "./dist/form-controls.js"
    },
    "./overlays": {
      "types": "./dist/overlays.d.ts",
      "import": "./dist/overlays.js"
    },
    "./data-display": {
      "types": "./dist/data-display.d.ts",
      "import": "./dist/data-display.js"
    },
    "./navigation": {
      "types": "./dist/navigation.d.ts",
      "import": "./dist/navigation.js"
    },
    "./layout": {
      "types": "./dist/layout.d.ts",
      "import": "./dist/layout.js"
    },
    "./base": {
      "types": "./dist/base/ds-element.d.ts",
      "import": "./dist/base/ds-element.js"
    },
    "./registry": {
      "types": "./dist/registry/index.d.ts",
      "import": "./dist/registry/index.js"
    }
  }
}
```

### Component Categories for Subpath Exports
1. **form-controls**: button, input, checkbox, radio, switch, textarea, slider, number-input, pin-input, file-upload, combobox, select, date-picker, time-picker
2. **overlays**: dialog, alert-dialog, popover, tooltip, menu, dropdown-menu, context-menu, hover-card, sheet, drawer
3. **data-display**: table, avatar, badge, tag, progress, skeleton, calendar, data-table
4. **navigation**: breadcrumb, pagination, stepper, navigation-menu, scroll-area
5. **layout**: flow, container, grid, box, page, section, app-shell, header, footer, main, spacer, center, split, wrap

### Build Configuration Changes
Update tsup.config.ts to support multiple entry points:
```typescript
export default defineConfig({
  entry: {
    index: "src/index.ts",
    "form-controls": "src/form-controls.ts",
    "overlays": "src/overlays.ts",
    "data-display": "src/data-display.ts",
    "navigation": "src/navigation.ts",
    "layout": "src/layout.ts",
    "base": "src/base/index.ts",
    "registry": "src/registry/index.ts",
  },
  format: ["esm"],
  dts: true,
  external: ["lit"],
});
```

### Alternatives Considered
1. **Keep single barrel export**: No tree-shaking benefit
2. **Individual component exports only**: Too granular, complicates imports
3. **Per-component package splitting**: Over-engineering for current needs

---

## 5. Form Validation Display

### Decision
Support both native browser validation UI (default) and custom ds-field-error integration (opt-in via attribute).

### Rationale
- Native browser UI works out of the box, familiar to users
- Custom styling needed for design system consistency in some cases
- Opt-in pattern avoids breaking changes

### Implementation Pattern
```typescript
export class DsInput extends DSElement {
  static formAssociated = true;

  @property({ type: Boolean, attribute: 'custom-validation' })
  customValidation = false;

  public reportValidity(): boolean {
    if (this.customValidation) {
      // Dispatch event for ds-field-error to handle
      const valid = this.internals.checkValidity();
      if (!valid) {
        emitEvent(this, 'ds:invalid', {
          detail: { message: this.internals.validationMessage }
        });
      }
      return valid;
    }
    // Use native browser UI
    return this.internals.reportValidity();
  }
}
```

### Integration with ds-field-error
```html
<!-- Native validation (default) -->
<ds-field>
  <ds-label>Email</ds-label>
  <ds-input type="email" required></ds-input>
</ds-field>

<!-- Custom validation UI -->
<ds-field>
  <ds-label>Email</ds-label>
  <ds-input type="email" required custom-validation></ds-input>
  <ds-field-error></ds-field-error>
</ds-field>
```

---

## 6. Browser Support

### Decision
Target modern browsers only: Chrome 77+, Firefox 93+, Safari 16.4+. No polyfills.

### Rationale
- ElementInternals has native support in all modern browsers
- Safari 16.4 released March 2023, providing ~3 years of adoption
- No existing consumers means no legacy support requirements
- Avoiding polyfills reduces complexity and bundle size

### Browser Feature Support
| Feature | Chrome | Firefox | Safari |
|---------|--------|---------|--------|
| ElementInternals | 77+ | 93+ | 16.4+ |
| Custom States (:state()) | 90+ | 122+ | 17.4+ |
| setFormValue() | 77+ | 93+ | 16.4+ |
| Constraint Validation | 77+ | 93+ | 16.4+ |

### Alternatives Considered
1. **Polyfill (element-internals-polyfill)**: Adds ~3KB, increases complexity
2. **Feature detection with fallback**: Adds code paths, testing burden
