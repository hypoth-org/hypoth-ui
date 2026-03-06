/**
 * Combobox Root component - provides context to all Combobox compound components.
 */

import { type Option, type Placement, createComboboxBehavior } from "@hypoth-ui/primitives-dom";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { ComboboxProvider } from "./combobox-context.js";

export interface ComboboxRootProps<Multi extends boolean = false> {
  /** Combobox content */
  children?: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Controlled value (single-select) */
  value?: Multi extends true ? string[] : string | null;
  /** Default value (uncontrolled) */
  defaultValue?: Multi extends true ? string[] : string | null;
  /** Called when value changes */
  onValueChange?: (value: Multi extends true ? string[] : string | null) => void;
  /** Called when input value changes */
  onInputChange?: (query: string) => void;
  /** Enable multi-select mode */
  multiple?: Multi;
  /** Allow creating new values */
  creatable?: boolean;
  /** Called when new value is created */
  onCreateValue?: (value: string) => void;
  /** Async item loader */
  loadItems?: (query: string) => Promise<Option<string>[]>;
  /** Static items */
  items?: Option<string>[];
  /** Debounce delay for async (ms) */
  debounce?: number;
  /** Virtualization threshold */
  virtualizationThreshold?: number;
  /** Placement relative to input */
  placement?: Placement;
  /** Offset from input in pixels */
  offset?: number;
  /** Whether to flip placement on viewport edge */
  flip?: boolean;
  /** Whether combobox is disabled */
  disabled?: boolean;
}

/**
 * Root component for Combobox compound pattern.
 * Provides context to Input, Content, Option, and Tag.
 *
 * @example
 * ```tsx
 * <Combobox.Root onValueChange={(value) => console.log(value)}>
 *   <Combobox.Input placeholder="Search..." />
 *   <Combobox.Content>
 *     <Combobox.Option value="apple">Apple</Combobox.Option>
 *     <Combobox.Option value="banana">Banana</Combobox.Option>
 *   </Combobox.Content>
 * </Combobox.Root>
 * ```
 */
export function ComboboxRoot<Multi extends boolean = false>({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  value: controlledValue,
  defaultValue,
  onValueChange,
  onInputChange,
  multiple = false as Multi,
  creatable = false,
  onCreateValue,
  loadItems,
  items: staticItems = [],
  debounce = 300,
  virtualizationThreshold = 100,
  placement: _placement = "bottom-start",
  offset: _offset = 4,
  flip: _flip = true,
  disabled = false,
}: ComboboxRootProps<Multi>) {
  // Compute default based on multiple mode
  const computedDefaultValue = useMemo(() => {
    if (defaultValue !== undefined) return defaultValue;
    return (multiple ? [] : null) as Multi extends true ? string[] : string | null;
  }, [defaultValue, multiple]);

  // Support both controlled and uncontrolled modes for open
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpenControlled = controlledOpen !== undefined;
  const open = isOpenControlled ? controlledOpen : internalOpen;

  // Support both controlled and uncontrolled modes for value
  const [internalValue, setInternalValue] =
    useState<Multi extends true ? string[] : string | null>(computedDefaultValue);
  const isValueControlled = controlledValue !== undefined;
  const value = isValueControlled ? controlledValue : internalValue;

  // Input value
  const [inputValue, setInputValueState] = useState("");

  // Highlighted value for keyboard navigation
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null);

  // Filtered options
  const [filteredOptions, setFilteredOptions] = useState<Option<string>[]>(staticItems);

  // Loading state
  const [loading, _setLoading] = useState(false);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isOpenControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isOpenControlled, onOpenChange]
  );

  const setValue = useCallback(
    (nextValue: Multi extends true ? string[] : string | null) => {
      if (!isValueControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isValueControlled, onValueChange]
  );

  const setInputValue = useCallback(
    (nextValue: string) => {
      setInputValueState(nextValue);
      onInputChange?.(nextValue);
    },
    [onInputChange]
  );

  // Create behavior instance
  // biome-ignore lint/correctness/useExhaustiveDependencies: behavior is created once
  const behavior = useMemo(
    () =>
      createComboboxBehavior<string, Multi>({
        defaultValue: value as Multi extends true ? string[] : string | null,
        multiple,
        creatable,
        onCreateValue,
        loadItems,
        items: staticItems,
        debounce,
        virtualizationThreshold,
        disabled,
        onValueChange: (v) => setValue(v as Multi extends true ? string[] : string | null),
        onInputChange: (query) => {
          setInputValue(query);
          // Filter static items if no async loader
          if (!loadItems) {
            const lowerQuery = query.toLowerCase();
            const filtered = staticItems.filter((item) =>
              item.label.toLowerCase().includes(lowerQuery)
            );
            setFilteredOptions(filtered);
          }
        },
      }),
    []
  );

  const contextValue = useMemo(
    () => ({
      behavior: behavior as unknown as typeof behavior,
      open,
      setOpen,
      value,
      setValue,
      inputValue,
      setInputValue,
      highlightedValue,
      setHighlightedValue,
      multiple,
      filteredOptions,
      loading,
    }),
    [
      behavior,
      open,
      setOpen,
      value,
      setValue,
      inputValue,
      setInputValue,
      highlightedValue,
      filteredOptions,
      loading,
      multiple,
    ]
  );

  // biome-ignore lint/suspicious/noExplicitAny: Generic context type requires cast for conditional Multi type
  return <ComboboxProvider value={contextValue as any}>{children}</ComboboxProvider>;
}

ComboboxRoot.displayName = "Combobox.Root";
