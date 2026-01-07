/**
 * Select compound component exports.
 *
 * @example
 * ```tsx
 * import { Select } from "@ds/react";
 *
 * <Select.Root onValueChange={(value) => console.log(value)}>
 *   <Select.Trigger>
 *     <Select.Value placeholder="Select a fruit" />
 *   </Select.Trigger>
 *   <Select.Content>
 *     <Select.Label>Fruits</Select.Label>
 *     <Select.Option value="apple">Apple</Select.Option>
 *     <Select.Option value="banana">Banana</Select.Option>
 *     <Select.Separator />
 *     <Select.Option value="cherry">Cherry</Select.Option>
 *   </Select.Content>
 * </Select.Root>
 * ```
 */

import { SelectContent, type SelectContentProps } from "./select-content.js";
import { SelectGroup, type SelectGroupProps } from "./select-group.js";
import { SelectLabel, type SelectLabelProps } from "./select-label.js";
import { SelectOption, type SelectOptionProps } from "./select-option.js";
import { SelectRoot, type SelectRootProps } from "./select-root.js";
import { SelectSeparator, type SelectSeparatorProps } from "./select-separator.js";
import { SelectTrigger, type SelectTriggerProps } from "./select-trigger.js";
import { SelectValue, type SelectValueProps } from "./select-value.js";

// Compound component
export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Content: SelectContent,
  Group: SelectGroup,
  Option: SelectOption,
  Separator: SelectSeparator,
  Label: SelectLabel,
};

// Type exports
export type {
  SelectContentProps,
  SelectGroupProps,
  SelectLabelProps,
  SelectOptionProps,
  SelectRootProps,
  SelectSeparatorProps,
  SelectTriggerProps,
  SelectValueProps,
};

// Re-export Placement from primitives-dom
export type { Placement } from "@ds/primitives-dom";
