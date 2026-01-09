/**
 * Select Root component - provides context to all Select compound components.
 */

import { createSelectBehavior } from "@hypoth-ui/primitives-dom";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import { useStableId } from "@/lib/hooks/use-stable-id";
import { SelectProvider } from "./select-context";

export interface SelectRootProps {
  /** Select content */
  children?: ReactNode;
  /** Custom ID for the select (SSR-safe auto-generated if not provided) */
  id?: string;
  /** Name for form submission */
  name?: string;
  /** Controlled value */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Called when value changes */
  onValueChange?: (value: string) => void;
  /** Whether select is disabled */
  disabled?: boolean;
  /** Whether select is required */
  required?: boolean;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * Root component for Select compound pattern.
 * Provides context to Trigger, Content, Option, Group, and Label.
 *
 * @example
 * ```tsx
 * <Select.Root onValueChange={(v) => console.log(v)}>
 *   <Select.Trigger>
 *     <Select.Value placeholder="Select an option" />
 *   </Select.Trigger>
 *   <Select.Content>
 *     <Select.Option value="1">Option 1</Select.Option>
 *     <Select.Option value="2">Option 2</Select.Option>
 *   </Select.Content>
 * </Select.Root>
 * ```
 */
export function SelectRoot({
  children,
  id,
  name,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  disabled = false,
  required = false,
  placeholder,
}: SelectRootProps) {
  // Generate SSR-safe stable ID
  const stableId = useStableId({ id, prefix: "select" });

  // Support both controlled and uncontrolled modes
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const setValue = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange]
  );

  // Create behavior instance
  // biome-ignore lint/correctness/useExhaustiveDependencies: behavior is created once
  const behavior = useMemo(
    () =>
      createSelectBehavior({
        defaultValue: value,
        disabled,
        onValueChange: setValue,
        onOpenChange: setOpen,
        generateId: () => stableId,
      }),
    [stableId]
  );

  const contextValue = useMemo(
    () => ({
      behavior,
      value,
      setValue,
      open,
      setOpen,
      disabled,
      required,
      name,
      placeholder,
    }),
    [behavior, value, setValue, open, disabled, required, name, placeholder]
  );

  return <SelectProvider value={contextValue}>{children}</SelectProvider>;
}

SelectRoot.displayName = "Select.Root";
