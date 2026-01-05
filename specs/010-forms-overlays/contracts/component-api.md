# Component API Contracts: Forms and Overlays

**Feature**: 010-forms-overlays
**Date**: 2026-01-04

## Field Pattern Components

### ds-field

Container component that associates form controls with labels, descriptions, and error messages.

#### Attributes

| Attribute  | Type      | Default | Description                                     |
|------------|-----------|---------|------------------------------------------------|
| `required` | `boolean` | `false` | Marks field as required; propagates to control |

#### Slots

| Slot      | Description                                      |
|-----------|--------------------------------------------------|
| (default) | Form control and associated label/description    |

#### Events

None.

#### CSS Custom Properties

| Property                    | Description                    |
|-----------------------------|--------------------------------|
| `--ds-field-gap`           | Gap between field children     |
| `--ds-field-error-color`   | Error text color               |

---

### ds-label

Label component for form fields.

#### Attributes

| Attribute | Type     | Default | Description              |
|-----------|----------|---------|--------------------------|
| `for`     | `string` | —       | ID of associated control |

#### Slots

| Slot      | Description  |
|-----------|--------------|
| (default) | Label text   |

---

### ds-field-description

Help text component for form fields.

#### Attributes

None.

#### Slots

| Slot      | Description      |
|-----------|------------------|
| (default) | Description text |

---

### ds-field-error

Error message component for form fields.

#### Attributes

None.

#### Slots

| Slot      | Description       |
|-----------|-------------------|
| (default) | Error message text|

---

## Form Control Components

### ds-input (enhanced)

Text input field component. Existing component enhanced for Field pattern integration.

#### Attributes

| Attribute          | Type                                                    | Default  | Description                         |
|--------------------|---------------------------------------------------------|----------|-------------------------------------|
| `type`             | `'text'│'email'│'password'│'number'│'tel'│'url'│'search'` | `'text'` | Input type                          |
| `size`             | `'sm'│'md'│'lg'`                                        | `'md'`   | Input size variant                  |
| `name`             | `string`                                                | `''`     | Form field name                     |
| `value`            | `string`                                                | `''`     | Current value                       |
| `placeholder`      | `string`                                                | `''`     | Placeholder text                    |
| `disabled`         | `boolean`                                               | `false`  | Disabled state                      |
| `readonly`         | `boolean`                                               | `false`  | Read-only state                     |
| `required`         | `boolean`                                               | `false`  | Required validation                 |
| `error`            | `boolean`                                               | `false`  | Error state styling                 |
| `minlength`        | `number`                                                | —        | Minimum character length            |
| `maxlength`        | `number`                                                | —        | Maximum character length            |
| `pattern`          | `string`                                                | —        | Validation regex pattern            |
| `aria-labelledby`  | `string`                                                | —        | ID(s) of labelling elements         |
| `aria-describedby` | `string`                                                | —        | ID(s) of describing elements        |

#### Events

| Event        | Detail                  | Description                     |
|--------------|-------------------------|---------------------------------|
| `input`      | `{ value: string }`     | Fired on every input change     |
| `ds:change`  | `{ value: string }`     | Fired when value is committed   |

---

### ds-textarea

Multi-line text input with optional auto-resize.

#### Attributes

| Attribute          | Type                                          | Default      | Description                    |
|--------------------|-----------------------------------------------|--------------|--------------------------------|
| `name`             | `string`                                      | `''`         | Form field name                |
| `value`            | `string`                                      | `''`         | Current value                  |
| `placeholder`      | `string`                                      | `''`         | Placeholder text               |
| `rows`             | `number`                                      | `3`          | Visible rows                   |
| `auto-resize`      | `boolean`                                     | `false`      | Enable auto-resize             |
| `min-rows`         | `number`                                      | `2`          | Minimum rows (auto-resize)     |
| `max-rows`         | `number`                                      | `10`         | Maximum rows (auto-resize)     |
| `resize`           | `'none'│'vertical'│'horizontal'│'both'`       | `'vertical'` | CSS resize behavior            |
| `disabled`         | `boolean`                                     | `false`      | Disabled state                 |
| `readonly`         | `boolean`                                     | `false`      | Read-only state                |
| `required`         | `boolean`                                     | `false`      | Required validation            |
| `error`            | `boolean`                                     | `false`      | Error state styling            |
| `maxlength`        | `number`                                      | —            | Maximum character length       |
| `aria-labelledby`  | `string`                                      | —            | ID(s) of labelling elements    |
| `aria-describedby` | `string`                                      | —            | ID(s) of describing elements   |

#### Events

| Event       | Detail              | Description                     |
|-------------|---------------------|---------------------------------|
| `input`     | `{ value: string }` | Fired on every input change     |
| `ds:change` | `{ value: string }` | Fired when value is committed   |

---

### ds-checkbox

Checkbox input with tri-state support.

#### Attributes

| Attribute       | Type      | Default | Description                          |
|-----------------|-----------|---------|--------------------------------------|
| `name`          | `string`  | `''`    | Form field name                      |
| `value`         | `string`  | `'on'`  | Value when checked                   |
| `checked`       | `boolean` | `false` | Checked state                        |
| `indeterminate` | `boolean` | `false` | Indeterminate (mixed) state          |
| `disabled`      | `boolean` | `false` | Disabled state                       |
| `required`      | `boolean` | `false` | Required validation                  |

#### Slots

| Slot      | Description   |
|-----------|---------------|
| (default) | Checkbox label|

#### Events

| Event       | Detail                                        | Description                |
|-------------|-----------------------------------------------|----------------------------|
| `ds:change` | `{ checked: boolean, indeterminate: boolean }` | Fired on state change      |

#### ARIA

- `role="checkbox"`
- `aria-checked="true│false│mixed"`

---

### ds-radio-group

Container for radio button group with roving tabindex.

#### Attributes

| Attribute     | Type                         | Default      | Description                   |
|---------------|------------------------------|--------------|-------------------------------|
| `name`        | `string`                     | `''`         | Form field name               |
| `value`       | `string`                     | —            | Currently selected value      |
| `orientation` | `'horizontal'│'vertical'`    | `'vertical'` | Layout and navigation axis    |
| `disabled`    | `boolean`                    | `false`      | Disabled state for all radios |

#### Slots

| Slot      | Description        |
|-----------|--------------------|
| (default) | ds-radio children  |

#### Events

| Event       | Detail              | Description              |
|-------------|---------------------|--------------------------|
| `ds:change` | `{ value: string }` | Fired when selection changes |

#### ARIA

- `role="radiogroup"`

---

### ds-radio

Individual radio button within a group.

#### Attributes

| Attribute  | Type      | Default | Description                      |
|------------|-----------|---------|----------------------------------|
| `value`    | `string`  | `''`    | Radio value                      |
| `checked`  | `boolean` | `false` | Selected state (managed by group)|
| `disabled` | `boolean` | `false` | Disabled state                   |

#### Slots

| Slot      | Description |
|-----------|-------------|
| (default) | Radio label |

#### ARIA

- `role="radio"`
- `aria-checked="true│false"`

---

### ds-switch

Toggle switch for boolean settings.

#### Attributes

| Attribute  | Type      | Default | Description      |
|------------|-----------|---------|------------------|
| `name`     | `string`  | `''`    | Form field name  |
| `checked`  | `boolean` | `false` | On/off state     |
| `disabled` | `boolean` | `false` | Disabled state   |

#### Slots

| Slot      | Description  |
|-----------|--------------|
| (default) | Switch label |

#### Events

| Event       | Detail                | Description           |
|-------------|-----------------------|-----------------------|
| `ds:change` | `{ checked: boolean }` | Fired on state change |

#### ARIA

- `role="switch"`
- `aria-checked="true│false"`

---

## Overlay Components

### ds-dialog

Modal dialog with focus trapping.

#### Attributes

| Attribute            | Type                       | Default    | Description                        |
|----------------------|----------------------------|------------|------------------------------------|
| `open`               | `boolean`                  | `false`    | Open state                         |
| `role`               | `'dialog'│'alertdialog'`   | `'dialog'` | ARIA role                          |
| `close-on-backdrop`  | `boolean`                  | `true`     | Close on backdrop click            |
| `close-on-escape`    | `boolean`                  | `true`     | Close on Escape key                |

#### Slots

| Slot        | Description              |
|-------------|--------------------------|
| `trigger`   | Dialog trigger button    |
| (default)   | Dialog content           |
| `title`     | Dialog title (labelledby)|
| `description` | Dialog description     |

#### Events

| Event         | Detail | Description           |
|---------------|--------|-----------------------|
| `ds:open`     | `{}`   | Fired when opened     |
| `ds:close`    | `{}`   | Fired when closed     |

#### ARIA

- `role="dialog│alertdialog"`
- `aria-modal="true"`
- `aria-labelledby` → title slot
- `aria-describedby` → description slot

---

### ds-popover

Non-modal positioned overlay.

#### Attributes

| Attribute   | Type                                                         | Default    | Description             |
|-------------|--------------------------------------------------------------|------------|-------------------------|
| `open`      | `boolean`                                                    | `false`    | Open state              |
| `placement` | `'top'│'top-start'│'top-end'│'bottom'│'bottom-start'│...`   | `'bottom'` | Preferred placement     |
| `offset`    | `number`                                                     | `8`        | Distance from trigger   |

#### Slots

| Slot      | Description          |
|-----------|----------------------|
| `trigger` | Popover trigger      |
| (default) | Popover content      |

#### Events

| Event      | Detail | Description         |
|------------|--------|---------------------|
| `ds:open`  | `{}`   | Fired when opened   |
| `ds:close` | `{}`   | Fired when closed   |

---

### ds-tooltip

Informational overlay on hover/focus.

#### Attributes

| Attribute    | Type                                                        | Default    | Description           |
|--------------|-------------------------------------------------------------|------------|-----------------------|
| `placement`  | `'top'│'top-start'│'top-end'│'bottom'│'bottom-start'│...`  | `'top'`    | Preferred placement   |
| `show-delay` | `number`                                                    | `400`      | Show delay (ms)       |
| `hide-delay` | `number`                                                    | `100`      | Hide delay (ms)       |

#### Slots

| Slot      | Description           |
|-----------|-----------------------|
| `trigger` | Tooltip trigger       |
| (default) | Tooltip content       |

#### ARIA

- Content: `role="tooltip"`
- Trigger: `aria-describedby` → tooltip content ID

---

### ds-menu

Dropdown menu with keyboard navigation.

#### Attributes

| Attribute   | Type                                                        | Default    | Description           |
|-------------|-------------------------------------------------------------|------------|-----------------------|
| `open`      | `boolean`                                                   | `false`    | Open state            |
| `placement` | `'top'│'top-start'│'top-end'│'bottom'│'bottom-start'│...`  | `'bottom-start'` | Preferred placement |

#### Slots

| Slot      | Description          |
|-----------|----------------------|
| `trigger` | Menu trigger button  |
| (default) | Menu items           |

#### Events

| Event      | Detail | Description         |
|------------|--------|---------------------|
| `ds:open`  | `{}`   | Fired when opened   |
| `ds:close` | `{}`   | Fired when closed   |

#### ARIA

- `role="menu"`

---

### ds-menu-item

Individual menu item.

#### Attributes

| Attribute  | Type      | Default | Description              |
|------------|-----------|---------|--------------------------|
| `disabled` | `boolean` | `false` | Disabled state           |
| `value`    | `string`  | —       | Optional value for events|

#### Slots

| Slot      | Description |
|-----------|-------------|
| (default) | Item content|

#### Events

| Event       | Detail              | Description          |
|-------------|---------------------|----------------------|
| `ds:select` | `{ value: string }` | Fired on selection   |

#### ARIA

- `role="menuitem"`

---

## Event Naming Convention

All custom events use the `ds:` namespace prefix:
- `ds:change` - Value/state change (form controls)
- `ds:open` - Overlay opened
- `ds:close` - Overlay closed
- `ds:select` - Item selected (menu)

Events are dispatched with `bubbles: true` and `composed: true` for cross-boundary propagation.
