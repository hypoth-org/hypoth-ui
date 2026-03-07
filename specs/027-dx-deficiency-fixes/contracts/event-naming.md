# Contract: Event Naming Convention

## Rule

All React adapter event props MUST follow this mapping from WC CustomEvents:

```
WC:    ds:{kebab-case-action}    →  React: on{PascalCaseAction}
```

For native DOM events on WC wrappers, use standard React naming (onClick, onChange).

## Complete Event Map

| WC Event | React Prop | Used By | Notes |
|----------|-----------|---------|-------|
| `ds:press` | `onPress` | Button (headless) | Primary activation |
| `ds:change` | `onChange` | Checkbox, Switch, RadioGroup | Boolean/value change |
| `ds:change` | `onValueChange` | Accordion, Tabs, Input | Value change (disambiguated) |
| `ds:open-change` | `onOpenChange` | Dialog, Drawer, Select, Menu, DatePicker, Combobox, Collapsible | Open/close toggle |
| `ds:select` | `onSelect` | Menu | Item selection |
| `ds:complete` | `onComplete` | PinInput | Input completion |
| `ds:error` | `onError` | FileUpload | Validation error |
| `ds:files-add` | `onFilesAdd` | FileUpload | Files added |
| `ds:file-remove` | `onFileRemove` | FileUpload | File removed |
| `ds:files-change` | `onFilesChange` | FileUpload | Files list changed |
| `ds:input-change` | `onInputChange` | Combobox | Search query change |
| `ds:create-value` | `onCreateValue` | Combobox | New value created |
| `ds:range-change` | `onRangeChange` | Slider, DatePicker | Range value change |
| Native `click` | `onClick` | DsButton (WC wrapper) | Standard DOM event |
| Native `change` | `onChange` | Input (native) | Standard DOM event |
| Native `input` | `onValueChange` | Input (native) | Mapped for consistency |

## Rules for New Components

1. Custom events MUST use `ds:` prefix with kebab-case: `ds:value-change`
2. React props MUST use `on` + PascalCase: `onValueChange`
3. One WC event maps to exactly one React prop name
4. When a component has both `change` and value semantics, use `onChange` for boolean and `onValueChange` for arbitrary values
5. Native DOM events on WC wrappers keep standard React naming (`onClick`, `onChange`)
