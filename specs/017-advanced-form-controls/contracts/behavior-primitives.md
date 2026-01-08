# Behavior Primitive Contracts

**Feature**: 017-advanced-form-controls
**Date**: 2026-01-06
**Package**: `@ds/primitives-dom`

This document defines the TypeScript contracts for new behavior primitives to be added to `@ds/primitives-dom`.

---

## 1. createSelectBehavior

Manages select open/close, value selection, and typeahead filtering.

```typescript
interface SelectBehaviorOptions<T = string> {
  /** Initial selected value */
  defaultValue?: T | null;
  /** Called when value changes */
  onValueChange?: (value: T | null) => void;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Whether the select is read-only */
  readOnly?: boolean;
  /** Enable typeahead search */
  searchable?: boolean;
  /** Show clear button */
  clearable?: boolean;
  /** Virtualization threshold (default: 100) */
  virtualizationThreshold?: number;
}

interface SelectBehaviorState<T = string> {
  open: boolean;
  value: T | null;
  highlightedValue: T | null;
  searchQuery: string;
  virtualized: boolean;
}

interface SelectBehavior<T = string> {
  /** Current state */
  readonly state: SelectBehaviorState<T>;

  /** Open the dropdown */
  open(): void;

  /** Close the dropdown */
  close(): void;

  /** Toggle the dropdown */
  toggle(): void;

  /** Select a value */
  select(value: T): void;

  /** Clear the selection */
  clear(): void;

  /** Highlight an option (keyboard navigation) */
  highlight(value: T): void;

  /** Update search query */
  search(query: string): void;

  /** Move highlight to next option */
  highlightNext(): void;

  /** Move highlight to previous option */
  highlightPrev(): void;

  /** Move highlight to first option */
  highlightFirst(): void;

  /** Move highlight to last option */
  highlightLast(): void;

  /** Get ARIA props for trigger */
  getTriggerProps(): SelectTriggerProps;

  /** Get ARIA props for content/listbox */
  getContentProps(): SelectContentProps;

  /** Get ARIA props for an option */
  getOptionProps(value: T, label: string): SelectOptionProps;

  /** Cleanup */
  destroy(): void;
}

interface SelectTriggerProps {
  role: 'combobox';
  'aria-expanded': boolean;
  'aria-haspopup': 'listbox';
  'aria-controls': string;
  'aria-activedescendant': string | undefined;
  tabIndex: number;
}

interface SelectContentProps {
  role: 'listbox';
  id: string;
  'aria-label'?: string;
}

interface SelectOptionProps {
  role: 'option';
  id: string;
  'aria-selected': boolean;
  'aria-disabled'?: boolean;
}

declare function createSelectBehavior<T = string>(
  options?: SelectBehaviorOptions<T>
): SelectBehavior<T>;
```

---

## 2. createComboboxBehavior

Manages combobox input, async loading, and multi-select tags.

```typescript
interface ComboboxBehaviorOptions<T = string, Multi extends boolean = false> {
  /** Initial value(s) */
  defaultValue?: Multi extends true ? T[] : T | null;
  /** Called when value changes */
  onValueChange?: (value: Multi extends true ? T[] : T | null) => void;
  /** Called when input changes */
  onInputChange?: (query: string) => void;
  /** Multi-select mode */
  multiple?: Multi;
  /** Allow creating new values */
  creatable?: boolean;
  /** Called when new value is created */
  onCreateValue?: (value: string) => void;
  /** Async item loader */
  loadItems?: (query: string) => Promise<Option<T>[]>;
  /** Static items */
  items?: Option<T>[];
  /** Debounce delay for async (ms) */
  debounce?: number;
  /** Virtualization threshold */
  virtualizationThreshold?: number;
  /** Disabled state */
  disabled?: boolean;
}

interface ComboboxBehaviorState<T = string, Multi extends boolean = false> {
  open: boolean;
  value: Multi extends true ? T[] : T | null;
  inputValue: string;
  highlightedValue: T | null;
  options: Option<T>[];
  filteredOptions: Option<T>[];
  loading: boolean;
  error: Error | null;
  virtualized: boolean;
}

interface ComboboxBehavior<T = string, Multi extends boolean = false> {
  /** Current state */
  readonly state: ComboboxBehaviorState<T, Multi>;

  /** Open the dropdown */
  open(): void;

  /** Close the dropdown */
  close(): void;

  /** Update input value */
  setInputValue(value: string): void;

  /** Select a value */
  select(value: T): void;

  /** Remove a value (multi-select) */
  remove(value: T): void;

  /** Clear all selections */
  clear(): void;

  /** Create new value (creatable mode) */
  create(value: string): void;

  /** Highlight navigation */
  highlightNext(): void;
  highlightPrev(): void;
  highlightFirst(): void;
  highlightLast(): void;

  /** Remove last tag via backspace */
  removeLastTag(): void;

  /** Get ARIA props for input */
  getInputProps(): ComboboxInputProps;

  /** Get ARIA props for listbox */
  getListboxProps(): ComboboxListboxProps;

  /** Get ARIA props for option */
  getOptionProps(value: T, label: string): ComboboxOptionProps;

  /** Get props for tag (multi-select) */
  getTagProps(value: T): ComboboxTagProps;

  /** Cleanup */
  destroy(): void;
}

interface ComboboxInputProps {
  role: 'combobox';
  'aria-expanded': boolean;
  'aria-haspopup': 'listbox';
  'aria-controls': string;
  'aria-activedescendant': string | undefined;
  'aria-autocomplete': 'list';
  'aria-busy'?: boolean;
}

interface ComboboxListboxProps {
  role: 'listbox';
  id: string;
  'aria-multiselectable'?: boolean;
  'aria-busy'?: boolean;
}

interface ComboboxOptionProps {
  role: 'option';
  id: string;
  'aria-selected': boolean;
  'aria-disabled'?: boolean;
}

interface ComboboxTagProps {
  role: 'listitem';
  'aria-label': string;
}

declare function createComboboxBehavior<T = string, Multi extends boolean = false>(
  options?: ComboboxBehaviorOptions<T, Multi>
): ComboboxBehavior<T, Multi>;
```

---

## 3. createSliderBehavior

Manages slider thumb dragging, keyboard control, and range constraints.

```typescript
interface SliderBehaviorOptions {
  /** Initial value (single mode) */
  defaultValue?: number;
  /** Initial range (range mode) */
  defaultRange?: { min: number; max: number };
  /** Called on value change */
  onValueChange?: (value: number) => void;
  /** Called on range change */
  onRangeChange?: (range: { min: number; max: number }) => void;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Large step (Page Up/Down) */
  largeStep?: number;
  /** Range mode (two thumbs) */
  range?: boolean;
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Disabled state */
  disabled?: boolean;
}

interface SliderBehaviorState {
  value: number;
  rangeValue: { min: number; max: number };
  min: number;
  max: number;
  step: number;
  draggingThumb: 'min' | 'max' | 'single' | null;
  focusedThumb: 'min' | 'max' | 'single' | null;
  range: boolean;
  orientation: 'horizontal' | 'vertical';
  disabled: boolean;
}

interface SliderBehavior {
  /** Current state */
  readonly state: SliderBehaviorState;

  /** Start drag on thumb */
  startDrag(thumb: 'min' | 'max' | 'single', event: PointerEvent): void;

  /** Update during drag */
  drag(event: PointerEvent): void;

  /** End drag */
  endDrag(): void;

  /** Increment value by step */
  increment(thumb: 'min' | 'max' | 'single', large?: boolean): void;

  /** Decrement value by step */
  decrement(thumb: 'min' | 'max' | 'single', large?: boolean): void;

  /** Set to minimum */
  setToMin(thumb: 'min' | 'max' | 'single'): void;

  /** Set to maximum */
  setToMax(thumb: 'min' | 'max' | 'single'): void;

  /** Set focus on thumb */
  focus(thumb: 'min' | 'max' | 'single'): void;

  /** Clear focus */
  blur(): void;

  /** Get ARIA props for thumb */
  getThumbProps(thumb: 'min' | 'max' | 'single'): SliderThumbProps;

  /** Get ARIA props for track */
  getTrackProps(): SliderTrackProps;

  /** Convert value to percentage (0-100) */
  valueToPercent(value: number): number;

  /** Convert percentage to value */
  percentToValue(percent: number): number;

  /** Cleanup */
  destroy(): void;
}

interface SliderThumbProps {
  role: 'slider';
  tabIndex: number;
  'aria-valuemin': number;
  'aria-valuemax': number;
  'aria-valuenow': number;
  'aria-valuetext'?: string;
  'aria-orientation': 'horizontal' | 'vertical';
  'aria-disabled'?: boolean;
  'aria-controls'?: string; // Other thumb ID (range mode)
}

interface SliderTrackProps {
  role: 'none';
}

declare function createSliderBehavior(
  options?: SliderBehaviorOptions
): SliderBehavior;
```

---

## 4. createPinInputBehavior

Manages PIN input focus auto-advance, paste handling, and backspace navigation.

```typescript
interface PinInputBehaviorOptions {
  /** Number of digits */
  length?: number;
  /** Initial value */
  defaultValue?: string;
  /** Called on value change */
  onValueChange?: (value: string) => void;
  /** Called when all digits entered */
  onComplete?: (value: string) => void;
  /** Allow alphanumeric characters */
  alphanumeric?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

interface PinInputBehaviorState {
  value: string;
  length: number;
  focusedIndex: number | null;
  complete: boolean;
  alphanumeric: boolean;
  disabled: boolean;
}

interface PinInputBehavior {
  /** Current state */
  readonly state: PinInputBehaviorState;

  /** Handle character input at index */
  input(index: number, char: string): void;

  /** Handle backspace at index */
  backspace(index: number): void;

  /** Handle paste */
  paste(value: string): void;

  /** Focus specific index */
  focus(index: number): void;

  /** Move focus left */
  focusPrev(): void;

  /** Move focus right */
  focusNext(): void;

  /** Clear all */
  clear(): void;

  /** Get value at index */
  getValueAt(index: number): string;

  /** Get ARIA props for container */
  getContainerProps(): PinInputContainerProps;

  /** Get ARIA props for individual input */
  getInputProps(index: number): PinInputFieldProps;

  /** Cleanup */
  destroy(): void;
}

interface PinInputContainerProps {
  role: 'group';
  'aria-label': string;
}

interface PinInputFieldProps {
  type: 'text';
  inputMode: 'numeric' | 'text';
  maxLength: 1;
  autoComplete: 'one-time-code';
  'aria-label': string;
  tabIndex: number;
}

declare function createPinInputBehavior(
  options?: PinInputBehaviorOptions
): PinInputBehavior;
```

---

## 5. createVirtualizedList

Intersection Observer-based virtualization for long lists.

```typescript
interface VirtualizedListOptions {
  /** Scroll container element */
  container: HTMLElement;
  /** Buffer zone in pixels (default: 300) */
  bufferPx?: number;
  /** Placeholder height estimate */
  estimatedItemHeight?: number;
  /** Called when item should render */
  onRender?: (id: string, element: HTMLElement) => void;
  /** Called when item should unrender */
  onUnrender?: (id: string, element: HTMLElement) => void;
}

interface VirtualizedList {
  /** Register an item placeholder */
  observe(element: HTMLElement, id: string): void;

  /** Unregister an item */
  unobserve(element: HTMLElement): void;

  /** Force re-check all items */
  refresh(): void;

  /** Get currently visible item IDs */
  getVisibleIds(): string[];

  /** Scroll to item by ID */
  scrollToId(id: string, behavior?: ScrollBehavior): void;

  /** Cleanup */
  destroy(): void;
}

declare function createVirtualizedList(
  options: VirtualizedListOptions
): VirtualizedList;
```

---

## Usage Pattern

```typescript
import {
  createSelectBehavior,
  createComboboxBehavior,
  createSliderBehavior,
  createPinInputBehavior,
  createVirtualizedList,
} from '@ds/primitives-dom';

// Select with virtualization
const select = createSelectBehavior({
  onValueChange: (value) => console.log('Selected:', value),
  virtualizationThreshold: 100,
});

// Multi-select combobox with async
const combobox = createComboboxBehavior({
  multiple: true,
  loadItems: async (query) => {
    const res = await fetch(`/api/users?q=${query}`);
    return res.json();
  },
  debounce: 300,
});

// Range slider
const slider = createSliderBehavior({
  range: true,
  min: 0,
  max: 1000,
  step: 10,
  onRangeChange: ({ min, max }) => console.log(`${min} - ${max}`),
});

// PIN input
const pin = createPinInputBehavior({
  length: 6,
  onComplete: (value) => submitOTP(value),
});
```
