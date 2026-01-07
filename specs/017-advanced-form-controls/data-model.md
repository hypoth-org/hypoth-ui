# Data Model: Advanced Form Controls

**Feature**: 017-advanced-form-controls
**Date**: 2026-01-06

## Overview

This document defines the TypeScript interfaces, state models, and entity relationships for all 8 advanced form control components.

---

## Shared Types

### Option (Select/Combobox)

```typescript
/**
 * A selectable option in Select or Combobox.
 */
interface Option<T = string> {
  /** Unique identifier for the option */
  value: T;
  /** Display text shown to user */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Optional grouping key for visual separation */
  group?: string;
  /** Optional description text */
  description?: string;
  /** Optional icon identifier */
  icon?: string;
}

/**
 * A group of related options with a label.
 */
interface OptionGroup<T = string> {
  /** Group label shown above options */
  label: string;
  /** Options within this group */
  options: Option<T>[];
}
```

### Value Types

```typescript
/**
 * Single or multiple selection value.
 */
type SelectValue<T = string> = T | null;
type ComboboxValue<T = string, Multi extends boolean = false> =
  Multi extends true ? T[] : T | null;

/**
 * Date selection value types.
 */
type DateValue = Date | null;
interface DateRange {
  start: Date | null;
  end: Date | null;
}

/**
 * Slider value types.
 */
type SliderValue = number;
interface SliderRange {
  min: number;
  max: number;
}

/**
 * Time value in 24-hour format.
 */
interface TimeValue {
  hours: number;   // 0-23
  minutes: number; // 0-59
}

/**
 * PIN input value.
 */
type PinValue = string; // e.g., "123456"
```

---

## Component State Models

### Select State

```typescript
interface SelectState<T = string> {
  /** Whether the dropdown is open */
  open: boolean;
  /** Currently selected value */
  value: SelectValue<T>;
  /** Currently highlighted option (via keyboard) */
  highlightedValue: T | null;
  /** Search/filter query (if searchable) */
  searchQuery: string;
  /** Filtered options based on search */
  filteredOptions: Option<T>[];
  /** Whether virtualization is active (>100 options) */
  virtualized: boolean;
  /** Disabled state */
  disabled: boolean;
  /** Read-only state */
  readOnly: boolean;
  /** Error state */
  invalid: boolean;
}

type SelectEvent<T = string> =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SELECT'; value: T }
  | { type: 'CLEAR' }
  | { type: 'HIGHLIGHT'; value: T }
  | { type: 'SEARCH'; query: string }
  | { type: 'ARROW_DOWN' }
  | { type: 'ARROW_UP' }
  | { type: 'HOME' }
  | { type: 'END' };
```

### Combobox State

```typescript
interface ComboboxState<T = string, Multi extends boolean = false> {
  /** Whether the dropdown is open */
  open: boolean;
  /** Selected value(s) */
  value: ComboboxValue<T, Multi>;
  /** Currently highlighted option */
  highlightedValue: T | null;
  /** Input text */
  inputValue: string;
  /** Available options (static or from async) */
  options: Option<T>[];
  /** Filtered options based on input */
  filteredOptions: Option<T>[];
  /** Loading state (async mode) */
  loading: boolean;
  /** Error state (async mode) */
  error: Error | null;
  /** Whether virtualization is active */
  virtualized: boolean;
  /** Multi-select mode */
  multiple: Multi;
  /** Creatable mode - allow new values */
  creatable: boolean;
  /** Disabled state */
  disabled: boolean;
}

type ComboboxEvent<T = string> =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'INPUT_CHANGE'; value: string }
  | { type: 'SELECT'; value: T }
  | { type: 'REMOVE'; value: T }
  | { type: 'CREATE'; value: string }
  | { type: 'CLEAR' }
  | { type: 'HIGHLIGHT'; value: T }
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; options: Option<T>[] }
  | { type: 'LOAD_ERROR'; error: Error };
```

### DatePicker State

```typescript
interface DatePickerState {
  /** Whether the calendar is open */
  open: boolean;
  /** Selected date or range */
  value: DateValue | DateRange;
  /** Currently focused date in calendar */
  focusedDate: Date;
  /** Currently displayed month */
  viewMonth: Date;
  /** Selection mode */
  mode: 'single' | 'range';
  /** Minimum selectable date */
  min: Date | null;
  /** Maximum selectable date */
  max: Date | null;
  /** Locale for formatting */
  locale: string;
  /** Disabled state */
  disabled: boolean;
  /** Range selection in progress (start selected, awaiting end) */
  rangeSelecting: boolean;
}

type DatePickerEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SELECT_DATE'; date: Date }
  | { type: 'FOCUS_DATE'; date: Date }
  | { type: 'PREV_MONTH' }
  | { type: 'NEXT_MONTH' }
  | { type: 'PREV_YEAR' }
  | { type: 'NEXT_YEAR' }
  | { type: 'GO_TO_TODAY' }
  | { type: 'CLEAR' };
```

### Slider State

```typescript
interface SliderState {
  /** Current value (single) or range */
  value: SliderValue | SliderRange;
  /** Minimum allowed value */
  min: number;
  /** Maximum allowed value */
  max: number;
  /** Step increment */
  step: number;
  /** Which thumb is currently dragging */
  draggingThumb: 'min' | 'max' | null;
  /** Which thumb has keyboard focus */
  focusedThumb: 'min' | 'max' | null;
  /** Orientation */
  orientation: 'horizontal' | 'vertical';
  /** Disabled state */
  disabled: boolean;
  /** Whether range mode is active */
  range: boolean;
}

type SliderEvent =
  | { type: 'DRAG_START'; thumb: 'min' | 'max' }
  | { type: 'DRAG'; position: number }
  | { type: 'DRAG_END' }
  | { type: 'INCREMENT'; thumb: 'min' | 'max'; large?: boolean }
  | { type: 'DECREMENT'; thumb: 'min' | 'max'; large?: boolean }
  | { type: 'SET_MIN' }
  | { type: 'SET_MAX' }
  | { type: 'FOCUS'; thumb: 'min' | 'max' }
  | { type: 'BLUR' };
```

### NumberInput State

```typescript
interface NumberInputState {
  /** Current numeric value */
  value: number | null;
  /** Display text (may include formatting) */
  displayValue: string;
  /** Minimum allowed value */
  min: number;
  /** Maximum allowed value */
  max: number;
  /** Step increment */
  step: number;
  /** Whether increment is disabled (at max) */
  incrementDisabled: boolean;
  /** Whether decrement is disabled (at min) */
  decrementDisabled: boolean;
  /** Disabled state */
  disabled: boolean;
  /** Read-only state */
  readOnly: boolean;
}

type NumberInputEvent =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_VALUE'; value: number }
  | { type: 'INPUT_CHANGE'; text: string }
  | { type: 'BLUR' };
```

### FileUpload State

```typescript
interface UploadFile {
  /** Unique identifier */
  id: string;
  /** Original file reference */
  file: File;
  /** File name */
  name: string;
  /** File size in bytes */
  size: number;
  /** MIME type */
  type: string;
  /** Upload status */
  status: 'pending' | 'uploading' | 'success' | 'error';
  /** Upload progress (0-100) */
  progress: number;
  /** Error message if status is 'error' */
  error?: string;
  /** Preview URL (for images) */
  previewUrl?: string;
}

interface FileUploadState {
  /** List of files */
  files: UploadFile[];
  /** Whether drag is active over drop zone */
  dragging: boolean;
  /** Accepted file types */
  accept: string[];
  /** Maximum file size in bytes */
  maxSize: number;
  /** Whether multiple files allowed */
  multiple: boolean;
  /** Maximum number of files */
  maxFiles: number;
  /** Disabled state */
  disabled: boolean;
}

type FileUploadEvent =
  | { type: 'DRAG_ENTER' }
  | { type: 'DRAG_LEAVE' }
  | { type: 'DROP'; files: File[] }
  | { type: 'SELECT'; files: File[] }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPLOAD_START'; id: string }
  | { type: 'UPLOAD_PROGRESS'; id: string; progress: number }
  | { type: 'UPLOAD_SUCCESS'; id: string }
  | { type: 'UPLOAD_ERROR'; id: string; error: string }
  | { type: 'CLEAR' };
```

### TimePicker State

```typescript
interface TimePickerState {
  /** Current time value */
  value: TimeValue | null;
  /** Whether picker is open */
  open: boolean;
  /** Display format */
  format: '12h' | '24h';
  /** Minute step interval */
  minuteStep: 1 | 5 | 10 | 15 | 30;
  /** Currently focused segment */
  focusedSegment: 'hours' | 'minutes' | 'period' | null;
  /** Highlighted hour in picker */
  highlightedHour: number | null;
  /** Highlighted minute in picker */
  highlightedMinute: number | null;
  /** AM/PM for 12-hour format */
  period: 'AM' | 'PM';
  /** Disabled state */
  disabled: boolean;
}

type TimePickerEvent =
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'SELECT_HOUR'; hour: number }
  | { type: 'SELECT_MINUTE'; minute: number }
  | { type: 'TOGGLE_PERIOD' }
  | { type: 'FOCUS_SEGMENT'; segment: 'hours' | 'minutes' | 'period' }
  | { type: 'INCREMENT_HOUR' }
  | { type: 'DECREMENT_HOUR' }
  | { type: 'INCREMENT_MINUTE' }
  | { type: 'DECREMENT_MINUTE' }
  | { type: 'CLEAR' };
```

### PinInput State

```typescript
interface PinInputState {
  /** Current PIN value (partial or complete) */
  value: string;
  /** Number of digits/characters */
  length: number;
  /** Currently focused digit index (0-based) */
  focusedIndex: number | null;
  /** Whether input is masked (dots instead of characters) */
  masked: boolean;
  /** Whether alphanumeric characters are allowed */
  alphanumeric: boolean;
  /** Whether PIN is complete */
  complete: boolean;
  /** Disabled state */
  disabled: boolean;
  /** Error state */
  invalid: boolean;
}

type PinInputEvent =
  | { type: 'INPUT'; index: number; char: string }
  | { type: 'BACKSPACE'; index: number }
  | { type: 'PASTE'; value: string }
  | { type: 'FOCUS'; index: number }
  | { type: 'BLUR' }
  | { type: 'ARROW_LEFT' }
  | { type: 'ARROW_RIGHT' }
  | { type: 'CLEAR' };
```

---

## Validation Rules

### Option Validation
- `value` must be unique within a Select/Combobox
- `label` must be non-empty string
- `group` must match a defined `OptionGroup.label` if used

### Date Validation
- `min` must be before `max` if both specified
- Selected date must be within [min, max] range
- Range `start` must be before or equal to `end`

### Slider Validation
- `min` must be less than `max`
- `step` must be positive
- `value` must be within [min, max]
- In range mode, `min` value must not exceed `max` value

### File Validation
- File type must match `accept` pattern
- File size must not exceed `maxSize`
- File count must not exceed `maxFiles`

### PIN Validation
- Each character must be digit (or alphanumeric if enabled)
- Length must match configured `length`

---

## Entity Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                        Field Component                          │
│  (provides label, description, error context)                   │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ integrates with
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Form Control Components                       │
├────────────┬────────────┬────────────┬────────────┬─────────────┤
│   Select   │  Combobox  │ DatePicker │   Slider   │ NumberInput │
├────────────┼────────────┼────────────┼────────────┼─────────────┤
│ FileUpload │ TimePicker │  PinInput  │            │             │
└────────────┴────────────┴────────────┴────────────┴─────────────┘
       │              │              │
       │              │              │
       ▼              ▼              ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Shared Primitives                            │
├──────────────────┬─────────────────┬─────────────────────────────┤
│ createDismissable│ createRovingFocs│ createTypeAhead             │
│ Layer            │                 │                              │
├──────────────────┼─────────────────┼─────────────────────────────┤
│ createPresence   │ announce()      │ createVirtualizedList       │
└──────────────────┴─────────────────┴─────────────────────────────┘
```

---

## State Transitions

### Select Open/Close Cycle
```
CLOSED → (click/Enter/Space) → OPEN
OPEN → (Escape/select/outside click) → CLOSED
```

### Combobox Async Loading
```
IDLE → (input change) → DEBOUNCING → (debounce complete) → LOADING
LOADING → (success) → IDLE with options
LOADING → (error) → ERROR
```

### DatePicker Range Selection
```
IDLE → (select start) → SELECTING_RANGE → (select end) → IDLE with range
SELECTING_RANGE → (Escape) → IDLE (cancelled)
```

### Slider Drag
```
IDLE → (mousedown on thumb) → DRAGGING
DRAGGING → (mousemove) → DRAGGING (value updates)
DRAGGING → (mouseup) → IDLE
```

### PinInput Completion
```
EMPTY → (input) → PARTIAL → (all digits) → COMPLETE
COMPLETE → (backspace) → PARTIAL
```
