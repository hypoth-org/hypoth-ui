/**
 * Combobox behavior primitive.
 * Manages combobox input, async loading, multi-select tags, and ARIA state.
 */

// =============================================================================
// Types
// =============================================================================

export interface Option<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface ComboboxBehaviorOptions<T = string, Multi extends boolean = false> {
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
  /** Custom ID generator */
  generateId?: () => string;
}

export interface ComboboxBehaviorState<T = string, Multi extends boolean = false> {
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

export interface ComboboxInputProps {
  role: "combobox";
  "aria-expanded": boolean;
  "aria-haspopup": "listbox";
  "aria-controls": string;
  "aria-activedescendant": string | undefined;
  "aria-autocomplete": "list";
  "aria-busy"?: boolean;
}

export interface ComboboxListboxProps {
  role: "listbox";
  id: string;
  "aria-multiselectable"?: boolean;
  "aria-busy"?: boolean;
}

export interface ComboboxOptionProps {
  role: "option";
  id: string;
  "aria-selected": boolean;
  "aria-disabled"?: boolean;
}

export interface ComboboxTagProps {
  role: "listitem";
  "aria-label": string;
}

export interface ComboboxBehavior<T = string, Multi extends boolean = false> {
  /** Current state */
  readonly state: ComboboxBehaviorState<T, Multi>;
  /** Input ID */
  readonly inputId: string;
  /** Listbox ID */
  readonly listboxId: string;

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
  getTagProps(value: T, label: string): ComboboxTagProps;

  /** Cleanup */
  destroy(): void;
}

// =============================================================================
// Implementation
// =============================================================================

let idCounter = 0;

function defaultGenerateId(): string {
  return `combobox-${++idCounter}`;
}

/**
 * Creates a combobox behavior primitive.
 *
 * @example
 * ```ts
 * // Single select
 * const combobox = createComboboxBehavior({
 *   items: [{ value: '1', label: 'Option 1' }],
 *   onValueChange: (value) => console.log('Selected:', value),
 * });
 *
 * // Multi-select with async
 * const multiCombobox = createComboboxBehavior({
 *   multiple: true,
 *   loadItems: async (query) => fetchUsers(query),
 *   debounce: 300,
 * });
 * ```
 */
export function createComboboxBehavior<T = string, Multi extends boolean = false>(
  options: ComboboxBehaviorOptions<T, Multi> = {}
): ComboboxBehavior<T, Multi> {
  const {
    defaultValue = (options.multiple ? [] : null) as Multi extends true ? T[] : T | null,
    onValueChange,
    onInputChange,
    multiple = false as Multi,
    creatable = false,
    onCreateValue,
    loadItems,
    items: staticItems = [],
    debounce = 300,
    virtualizationThreshold = 100,
    disabled = false,
    generateId = defaultGenerateId,
  } = options;

  // Generate stable IDs
  const baseId = generateId();
  const inputId = `${baseId}-input`;
  const listboxId = `${baseId}-listbox`;

  // Internal state
  let state: ComboboxBehaviorState<T, Multi> = {
    open: false,
    value: defaultValue,
    inputValue: "",
    highlightedValue: null,
    options: staticItems,
    filteredOptions: staticItems,
    loading: false,
    error: null,
    virtualized: staticItems.length > virtualizationThreshold,
  };

  // Debounce timer
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  // Abort controller for async requests
  let abortController: AbortController | null = null;

  // Helpers
  function getEnabledOptions(): Option<T>[] {
    return state.filteredOptions.filter((opt) => !opt.disabled);
  }

  function getHighlightedIndex(): number {
    if (state.highlightedValue === null) return -1;
    return getEnabledOptions().findIndex((opt) => opt.value === state.highlightedValue);
  }

  function filterOptions(query: string): Option<T>[] {
    if (!query) return state.options;
    const lowerQuery = query.toLowerCase();
    return state.options.filter((opt) => opt.label.toLowerCase().includes(lowerQuery));
  }

  function isSelected(value: T): boolean {
    if (multiple) {
      return (state.value as T[]).includes(value);
    }
    return state.value === value;
  }

  async function loadAsync(query: string): Promise<void> {
    if (!loadItems) return;

    // Cancel previous request
    abortController?.abort();
    abortController = new AbortController();

    state = { ...state, loading: true, error: null };

    try {
      const results = await loadItems(query);
      // Check if this request was aborted
      if (abortController?.signal.aborted) return;

      state = {
        ...state,
        options: results,
        filteredOptions: results,
        loading: false,
        virtualized: results.length > virtualizationThreshold,
      };

      // Highlight first option if none highlighted
      if (state.highlightedValue === null && results.length > 0) {
        const firstEnabled = results.find((opt) => !opt.disabled);
        if (firstEnabled) {
          state = { ...state, highlightedValue: firstEnabled.value };
        }
      }
    } catch (err) {
      if (abortController?.signal.aborted) return;
      state = {
        ...state,
        loading: false,
        error: err instanceof Error ? err : new Error(String(err)),
      };
    }
  }

  function handleInputChange(query: string): void {
    state = { ...state, inputValue: query };
    onInputChange?.(query);

    // Clear debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }

    if (loadItems) {
      // Async loading with debounce
      debounceTimer = setTimeout(() => {
        loadAsync(query);
      }, debounce);
    } else {
      // Static filtering
      const filtered = filterOptions(query);
      state = {
        ...state,
        filteredOptions: filtered,
        virtualized: filtered.length > virtualizationThreshold,
      };

      // Highlight first option
      const firstEnabled = filtered.find((opt) => !opt.disabled);
      if (firstEnabled) {
        state = { ...state, highlightedValue: firstEnabled.value };
      }
    }
  }

  // Public API
  function open(): void {
    if (disabled) return;
    state = { ...state, open: true };

    // Load initial options if async
    if (loadItems && state.options.length === 0) {
      loadAsync("");
    }
  }

  function close(): void {
    state = { ...state, open: false, highlightedValue: null };
  }

  function setInputValue(value: string): void {
    if (disabled) return;
    handleInputChange(value);

    // Auto-open on input
    if (value && !state.open) {
      state = { ...state, open: true };
    }
  }

  function select(value: T): void {
    if (disabled) return;

    if (multiple) {
      const currentValues = state.value as T[];
      if (currentValues.includes(value)) {
        // Already selected, do nothing (use remove to unselect)
        return;
      }
      const newValues = [...currentValues, value] as Multi extends true ? T[] : T | null;
      state = { ...state, value: newValues, inputValue: "" };
      onValueChange?.(newValues);
    } else {
      const option = state.options.find((opt) => opt.value === value);
      state = {
        ...state,
        value: value as Multi extends true ? T[] : T | null,
        inputValue: option?.label ?? "",
      };
      onValueChange?.(value as Multi extends true ? T[] : T | null);
      close();
    }
  }

  function remove(value: T): void {
    if (disabled || !multiple) return;

    const currentValues = state.value as T[];
    const newValues = currentValues.filter((v) => v !== value) as Multi extends true
      ? T[]
      : T | null;
    state = { ...state, value: newValues };
    onValueChange?.(newValues);
  }

  function clear(): void {
    if (disabled) return;

    const newValue = (multiple ? [] : null) as Multi extends true ? T[] : T | null;
    state = { ...state, value: newValue, inputValue: "" };
    onValueChange?.(newValue);
  }

  function create(value: string): void {
    if (!creatable || disabled || !value.trim()) return;
    onCreateValue?.(value.trim());
    state = { ...state, inputValue: "" };
  }

  function highlightNext(): void {
    const enabledOptions = getEnabledOptions();
    if (enabledOptions.length === 0) return;

    const currentIndex = getHighlightedIndex();
    const nextIndex = currentIndex < enabledOptions.length - 1 ? currentIndex + 1 : 0;
    const nextOption = enabledOptions[nextIndex];
    if (nextOption) {
      state = { ...state, highlightedValue: nextOption.value };
    }
  }

  function highlightPrev(): void {
    const enabledOptions = getEnabledOptions();
    if (enabledOptions.length === 0) return;

    const currentIndex = getHighlightedIndex();
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : enabledOptions.length - 1;
    const prevOption = enabledOptions[prevIndex];
    if (prevOption) {
      state = { ...state, highlightedValue: prevOption.value };
    }
  }

  function highlightFirst(): void {
    const enabledOptions = getEnabledOptions();
    const firstOption = enabledOptions[0];
    if (firstOption) {
      state = { ...state, highlightedValue: firstOption.value };
    }
  }

  function highlightLast(): void {
    const enabledOptions = getEnabledOptions();
    const lastOption = enabledOptions[enabledOptions.length - 1];
    if (lastOption) {
      state = { ...state, highlightedValue: lastOption.value };
    }
  }

  function removeLastTag(): void {
    if (!multiple || disabled) return;

    const currentValues = state.value as T[];
    if (currentValues.length === 0) return;

    const newValues = currentValues.slice(0, -1) as Multi extends true ? T[] : T | null;
    state = { ...state, value: newValues };
    onValueChange?.(newValues);
  }

  function getInputProps(): ComboboxInputProps {
    const highlightedId =
      state.highlightedValue !== null ? `${baseId}-option-${state.highlightedValue}` : undefined;

    return {
      role: "combobox",
      "aria-expanded": state.open,
      "aria-haspopup": "listbox",
      "aria-controls": listboxId,
      "aria-activedescendant": state.open ? highlightedId : undefined,
      "aria-autocomplete": "list",
      "aria-busy": state.loading ? true : undefined,
    };
  }

  function getListboxProps(): ComboboxListboxProps {
    return {
      role: "listbox",
      id: listboxId,
      "aria-multiselectable": multiple ? true : undefined,
      "aria-busy": state.loading ? true : undefined,
    };
  }

  function getOptionProps(value: T, _label: string): ComboboxOptionProps {
    const option = state.options.find((opt) => opt.value === value);
    const isDisabled = option?.disabled ?? false;

    return {
      role: "option",
      id: `${baseId}-option-${value}`,
      "aria-selected": isSelected(value),
      "aria-disabled": isDisabled ? true : undefined,
    };
  }

  function getTagProps(_value: T, label: string): ComboboxTagProps {
    return {
      role: "listitem",
      "aria-label": `${label}, press Delete to remove`,
    };
  }

  function destroy(): void {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    abortController?.abort();
    abortController = null;
  }

  return {
    get state() {
      return state;
    },
    get inputId() {
      return inputId;
    },
    get listboxId() {
      return listboxId;
    },
    open,
    close,
    setInputValue,
    select,
    remove,
    clear,
    create,
    highlightNext,
    highlightPrev,
    highlightFirst,
    highlightLast,
    removeLastTag,
    getInputProps,
    getListboxProps,
    getOptionProps,
    getTagProps,
    destroy,
  };
}
