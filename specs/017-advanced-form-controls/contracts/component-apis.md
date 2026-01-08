# Component API Contracts: Advanced Form Controls

**Feature**: 017-advanced-form-controls
**Date**: 2026-01-06

This document defines the public API contracts for all 8 advanced form control components, covering both Web Components and React adapters.

---

## 1. Select

### Web Component: `<ds-select>`

#### Attributes/Properties

| Attribute | Property | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `value` | `value` | `string \| null` | `null` | Selected value |
| `placeholder` | `placeholder` | `string` | `"Select..."` | Placeholder text |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `readOnly` | `boolean` | `false` | Read-only state |
| `required` | `required` | `boolean` | `false` | Required for form validation |
| `searchable` | `searchable` | `boolean` | `false` | Enable typeahead search |
| `clearable` | `clearable` | `boolean` | `false` | Show clear button |
| `name` | `name` | `string` | `undefined` | Form field name |
| `open` | `open` | `boolean` | `false` | Popover open state |

#### Events

| Event | Detail Type | Description |
|-------|-------------|-------------|
| `ds:change` | `{ value: string \| null }` | Fired when selection changes |
| `ds:open` | `{}` | Fired when popover opens |
| `ds:close` | `{}` | Fired when popover closes |
| `ds:search` | `{ query: string }` | Fired when search input changes |

#### Slots

| Slot | Description |
|------|-------------|
| (default) | `<ds-select-option>` elements |
| `trigger` | Custom trigger element |

#### CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--ds-select-min-width` | `180px` | Minimum width |
| `--ds-select-max-height` | `300px` | Maximum dropdown height |

---

### Web Component: `<ds-select-option>`

#### Attributes/Properties

| Attribute | Property | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `value` | `value` | `string` | (required) | Option value |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `selected` | `selected` | `boolean` | `false` | Selected state (read-only) |

#### Slots

| Slot | Description |
|------|-------------|
| (default) | Option label content |
| `icon` | Optional leading icon |

---

### Web Component: `<ds-select-group>`

#### Attributes/Properties

| Attribute | Property | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `label` | `label` | `string` | (required) | Group label |

#### Slots

| Slot | Description |
|------|-------------|
| (default) | `<ds-select-option>` elements |

---

### React: `<Select>`

```tsx
interface SelectProps<T = string> {
  value?: T | null;
  defaultValue?: T | null;
  onValueChange?: (value: T | null) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  name?: string;
  children: React.ReactNode;
}

// Compound components
Select.Trigger: React.FC<{ children: React.ReactNode }>
Select.Content: React.FC<{ children: React.ReactNode }>
Select.Option: React.FC<{ value: string; disabled?: boolean; children: React.ReactNode }>
Select.Group: React.FC<{ label: string; children: React.ReactNode }>
```

---

## 2. Combobox

### Web Component: `<ds-combobox>`

#### Attributes/Properties

| Attribute | Property | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `value` | `value` | `string \| string[]` | `null` | Selected value(s) |
| `placeholder` | `placeholder` | `string` | `"Search..."` | Input placeholder |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `multiple` | `multiple` | `boolean` | `false` | Multi-select mode |
| `creatable` | `creatable` | `boolean` | `false` | Allow creating new values |
| `loading` | `loading` | `boolean` | `false` | Loading state (read-only) |
| `debounce` | `debounce` | `number` | `300` | Debounce delay (ms) |
| `name` | `name` | `string` | `undefined` | Form field name |

#### Properties (JS only)

| Property | Type | Description |
|----------|------|-------------|
| `loadItems` | `(query: string) => Promise<Option[]>` | Async item loader |
| `items` | `Option[]` | Static items list |

#### Events

| Event | Detail Type | Description |
|-------|-------------|-------------|
| `ds:change` | `{ value: string \| string[] }` | Fired on selection change |
| `ds:input` | `{ query: string }` | Fired on input change |
| `ds:create` | `{ value: string }` | Fired when new value created |
| `ds:load-start` | `{}` | Fired when async load starts |
| `ds:load-end` | `{ items: Option[] }` | Fired when async load completes |
| `ds:load-error` | `{ error: Error }` | Fired on async load error |

---

### React: `<Combobox>`

```tsx
interface ComboboxProps<T = string, Multi extends boolean = false> {
  value?: Multi extends true ? T[] : T | null;
  defaultValue?: Multi extends true ? T[] : T | null;
  onValueChange?: (value: Multi extends true ? T[] : T | null) => void;
  onInputChange?: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
  multiple?: Multi;
  creatable?: boolean;
  onCreateOption?: (value: string) => void;
  loadItems?: (query: string) => Promise<Option<T>[]>;
  items?: Option<T>[];
  debounce?: number;
  name?: string;
  children?: React.ReactNode;
}

// Compound components
Combobox.Input: React.FC<{ placeholder?: string }>
Combobox.Content: React.FC<{ children: React.ReactNode }>
Combobox.Option: React.FC<{ value: string; disabled?: boolean; children: React.ReactNode }>
Combobox.Empty: React.FC<{ children: React.ReactNode }>
Combobox.Loading: React.FC<{ children: React.ReactNode }>
Combobox.Tag: React.FC<{ value: string; onRemove: () => void; children: React.ReactNode }>
```

---

## 3. DatePicker

### Web Component: `<ds-date-picker>`

#### Attributes/Properties

| Attribute | Property | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `value` | `value` | `string \| null` | `null` | ISO date string |
| `start-date` | `startDate` | `string \| null` | `null` | Range start (ISO) |
| `end-date` | `endDate` | `string \| null` | `null` | Range end (ISO) |
| `mode` | `mode` | `'single' \| 'range'` | `'single'` | Selection mode |
| `min` | `min` | `string` | `undefined` | Min date (ISO) |
| `max` | `max` | `string` | `undefined` | Max date (ISO) |
| `locale` | `locale` | `string` | `'en-US'` | Locale for formatting |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `placeholder` | `placeholder` | `string` | `"Select date"` | Input placeholder |
| `name` | `name` | `string` | `undefined` | Form field name |

#### Events

| Event | Detail Type | Description |
|-------|-------------|-------------|
| `ds:change` | `{ value: string } \| { start: string, end: string }` | Date selection change |
| `ds:open` | `{}` | Calendar opened |
| `ds:close` | `{}` | Calendar closed |

---

### React: `<DatePicker>`

```tsx
interface DatePickerProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  // Range mode
  startDate?: Date | null;
  endDate?: Date | null;
  onRangeChange?: (range: { start: Date | null; end: Date | null }) => void;
  mode?: 'single' | 'range';
  min?: Date;
  max?: Date;
  locale?: string;
  disabled?: boolean;
  placeholder?: string;
  name?: string;
}

// Compound components
DatePicker.Trigger: React.FC<{ children: React.ReactNode }>
DatePicker.Calendar: React.FC<{ children?: React.ReactNode }>
```

---

## 4. Slider

### Web Component: `<ds-slider>`

#### Attributes/Properties

| Attribute | Property | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `value` | `value` | `number` | `0` | Current value (single mode) |
| `min-value` | `minValue` | `number` | `0` | Range min value |
| `max-value` | `maxValue` | `number` | `100` | Range max value |
| `min` | `min` | `number` | `0` | Minimum allowed |
| `max` | `max` | `number` | `100` | Maximum allowed |
| `step` | `step` | `number` | `1` | Step increment |
| `range` | `range` | `boolean` | `false` | Range mode (two thumbs) |
| `orientation` | `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Orientation |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `show-ticks` | `showTicks` | `boolean` | `false` | Show tick marks |
| `show-tooltip` | `showTooltip` | `boolean` | `false` | Show value tooltip |
| `name` | `name` | `string` | `undefined` | Form field name |

#### Events

| Event | Detail Type | Description |
|-------|-------------|-------------|
| `ds:change` | `{ value: number } \| { min: number, max: number }` | Value change |
| `ds:input` | `{ value: number } \| { min: number, max: number }` | Live value during drag |

---

### React: `<Slider>`

```tsx
interface SliderProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  // Range mode
  minValue?: number;
  maxValue?: number;
  onRangeChange?: (range: { min: number; max: number }) => void;
  min?: number;
  max?: number;
  step?: number;
  range?: boolean;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  showTicks?: boolean;
  showTooltip?: boolean;
  name?: string;
}
```

---

## 5. NumberInput

### Web Component: `<ds-number-input>`

#### Attributes/Properties

| Attribute | Property | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `value` | `value` | `number \| null` | `null` | Current value |
| `min` | `min` | `number` | `-Infinity` | Minimum allowed |
| `max` | `max` | `number` | `Infinity` | Maximum allowed |
| `step` | `step` | `number` | `1` | Step increment |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `readonly` | `readOnly` | `boolean` | `false` | Read-only state |
| `prefix` | `prefix` | `string` | `undefined` | Visual prefix (e.g., "$") |
| `suffix` | `suffix` | `string` | `undefined` | Visual suffix (e.g., "kg") |
| `name` | `name` | `string` | `undefined` | Form field name |

#### Events

| Event | Detail Type | Description |
|-------|-------------|-------------|
| `ds:change` | `{ value: number \| null }` | Value change |

---

### React: `<NumberInput>`

```tsx
interface NumberInputProps {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  readOnly?: boolean;
  prefix?: string;
  suffix?: string;
  name?: string;
}
```

---

## 6. FileUpload

### Web Component: `<ds-file-upload>`

#### Attributes/Properties

| Attribute | Property | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `accept` | `accept` | `string` | `undefined` | Accepted file types |
| `multiple` | `multiple` | `boolean` | `false` | Allow multiple files |
| `max-size` | `maxSize` | `number` | `Infinity` | Max file size (bytes) |
| `max-files` | `maxFiles` | `number` | `Infinity` | Max file count |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `name` | `name` | `string` | `undefined` | Form field name |

#### Properties (JS only)

| Property | Type | Description |
|----------|------|-------------|
| `files` | `UploadFile[]` | Current file list (read-only) |
| `onUpload` | `(file: File) => Promise<void>` | Upload handler |

#### Events

| Event | Detail Type | Description |
|-------|-------------|-------------|
| `ds:select` | `{ files: File[] }` | Files selected |
| `ds:remove` | `{ file: UploadFile }` | File removed |
| `ds:reject` | `{ file: File, reason: string }` | File rejected |

#### Slots

| Slot | Description |
|------|-------------|
| (default) | Drop zone content |
| `file-item` | Custom file item template |

---

### React: `<FileUpload>`

```tsx
interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  onFilesChange?: (files: UploadFile[]) => void;
  onUpload?: (file: File) => Promise<void>;
  name?: string;
  children?: React.ReactNode;
}

// Compound components
FileUpload.DropZone: React.FC<{ children: React.ReactNode }>
FileUpload.FileList: React.FC<{ children?: React.ReactNode }>
FileUpload.FileItem: React.FC<{ file: UploadFile; onRemove: () => void }>
```

---

## 7. TimePicker

### Web Component: `<ds-time-picker>`

#### Attributes/Properties

| Attribute | Property | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `value` | `value` | `string \| null` | `null` | Time string (HH:mm) |
| `format` | `format` | `'12h' \| '24h'` | `'12h'` | Display format |
| `minute-step` | `minuteStep` | `1 \| 5 \| 10 \| 15 \| 30` | `1` | Minute interval |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `placeholder` | `placeholder` | `string` | `"Select time"` | Input placeholder |
| `name` | `name` | `string` | `undefined` | Form field name |

#### Events

| Event | Detail Type | Description |
|-------|-------------|-------------|
| `ds:change` | `{ value: string }` | Time change (HH:mm format) |

---

### React: `<TimePicker>`

```tsx
interface TimePickerProps {
  value?: { hours: number; minutes: number } | null;
  defaultValue?: { hours: number; minutes: number } | null;
  onValueChange?: (value: { hours: number; minutes: number } | null) => void;
  format?: '12h' | '24h';
  minuteStep?: 1 | 5 | 10 | 15 | 30;
  disabled?: boolean;
  placeholder?: string;
  name?: string;
}
```

---

## 8. PinInput

### Web Component: `<ds-pin-input>`

#### Attributes/Properties

| Attribute | Property | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `value` | `value` | `string` | `""` | Current PIN value |
| `length` | `length` | `number` | `6` | Number of digits |
| `mask` | `mask` | `boolean` | `false` | Show dots instead of chars |
| `alphanumeric` | `alphanumeric` | `boolean` | `false` | Allow letters |
| `disabled` | `disabled` | `boolean` | `false` | Disabled state |
| `name` | `name` | `string` | `undefined` | Form field name |

#### Events

| Event | Detail Type | Description |
|-------|-------------|-------------|
| `ds:change` | `{ value: string }` | Value change |
| `ds:complete` | `{ value: string }` | All digits entered |

---

### React: `<PinInput>`

```tsx
interface PinInputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  mask?: boolean;
  alphanumeric?: boolean;
  disabled?: boolean;
  name?: string;
}

// Compound components
PinInput.Field: React.FC<{ index: number }>
```

---

## Event Naming Convention

All Web Component events follow the `ds:` prefix convention:
- `ds:change` - Value changed (final)
- `ds:input` - Value changing (during interaction)
- `ds:open` / `ds:close` - Overlay state
- `ds:select` / `ds:remove` - Item operations

React props follow standard React conventions:
- `onValueChange` - Value callback
- `onInputChange` - Input callback
- `onOpenChange` - Open state callback
