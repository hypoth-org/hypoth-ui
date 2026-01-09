/**
 * Select Root component - provides context to all Select compound components.
 */

import { type Placement, createSelectBehavior } from "@ds/primitives-dom";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { useStableId } from "../../hooks/use-stable-id.js";
import { SelectProvider } from "./select-context.js";

export interface SelectRootProps {
  /** Select content */
  children?: ReactNode;
  /** Custom ID for the select (SSR-safe auto-generated if not provided) */
  id?: string;
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Controlled value */
  value?: string | null;
  /** Default value (uncontrolled) */
  defaultValue?: string | null;
  /** Called when value changes */
  onValueChange?: (value: string | null) => void;
  /** Placement relative to trigger */
  placement?: Placement;
  /** Offset from trigger in pixels */
  offset?: number;
  /** Whether to flip placement on viewport edge */
  flip?: boolean;
  /** Whether select is disabled */
  disabled?: boolean;
  /** Whether select is read-only */
  readOnly?: boolean;
  /** Enable typeahead search */
  searchable?: boolean;
  /** Allow clearing the selection */
  clearable?: boolean;
  /** Whether the select is in a loading state (e.g., fetching options) */
  loading?: boolean;
  /** Text to display/announce during loading */
  loadingText?: string;
}

/**
 * Root component for Select compound pattern.
 * Provides context to Trigger, Content, and Option.
 *
 * @example
 * ```tsx
 * <Select.Root onValueChange={(value) => console.log(value)}>
 *   <Select.Trigger>Select a fruit</Select.Trigger>
 *   <Select.Content>
 *     <Select.Option value="apple">Apple</Select.Option>
 *     <Select.Option value="banana">Banana</Select.Option>
 *   </Select.Content>
 * </Select.Root>
 * ```
 */
export function SelectRoot({
  children,
  id,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  value: controlledValue,
  defaultValue = null,
  onValueChange,
  placement: _placement = "bottom-start",
  offset: _offset = 4,
  flip: _flip = true,
  disabled = false,
  readOnly = false,
  searchable = true,
  clearable = false,
  loading = false,
  loadingText = "Loading...",
}: SelectRootProps) {
  // Generate SSR-safe stable ID using React 18's useId under the hood
  const stableId = useStableId({ id, prefix: "select" });

  // Support both controlled and uncontrolled modes for open
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpenControlled = controlledOpen !== undefined;
  const open = isOpenControlled ? controlledOpen : internalOpen;

  // Support both controlled and uncontrolled modes for value
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue);
  const isValueControlled = controlledValue !== undefined;
  const value = isValueControlled ? controlledValue : internalValue;

  // Highlighted value for keyboard navigation
  const [highlightedValue, setHighlightedValue] = useState<string | null>(value);

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
    (nextValue: string | null) => {
      if (!isValueControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isValueControlled, onValueChange]
  );

  // Create behavior instance - intentionally created once with initial values
  // biome-ignore lint/correctness/useExhaustiveDependencies: behavior is created once, state synced via callbacks
  const behavior = useMemo(
    () =>
      createSelectBehavior({
        defaultValue: value,
        disabled,
        readOnly,
        searchable,
        clearable,
        onValueChange: (v) => setValue(v),
        onOpenChange: (o) => setOpen(o),
        // Use SSR-safe stable ID generator
        generateId: () => stableId,
      }),
    [stableId]
  );

  const contextValue = useMemo(
    () => ({
      behavior,
      open,
      setOpen,
      value,
      setValue,
      highlightedValue,
      setHighlightedValue,
      loading,
      loadingText,
    }),
    [behavior, open, setOpen, value, setValue, highlightedValue, loading, loadingText]
  );

  return <SelectProvider value={contextValue}>{children}</SelectProvider>;
}

SelectRoot.displayName = "Select.Root";
