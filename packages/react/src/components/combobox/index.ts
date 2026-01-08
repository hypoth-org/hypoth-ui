/**
 * Combobox compound component exports.
 *
 * @example
 * ```tsx
 * import { Combobox } from "@ds/react";
 *
 * <Combobox.Root onValueChange={(value) => console.log(value)}>
 *   <Combobox.Input placeholder="Search fruits..." />
 *   <Combobox.Content>
 *     <Combobox.Option value="apple">Apple</Combobox.Option>
 *     <Combobox.Option value="banana">Banana</Combobox.Option>
 *     <Combobox.Empty>No results found</Combobox.Empty>
 *   </Combobox.Content>
 * </Combobox.Root>
 *
 * // Multi-select with tags
 * <Combobox.Root multiple onValueChange={(values) => console.log(values)}>
 *   {values.map(v => (
 *     <Combobox.Tag key={v} value={v}>{v}</Combobox.Tag>
 *   ))}
 *   <Combobox.Input placeholder="Add tags..." />
 *   <Combobox.Content>
 *     <Combobox.Option value="react">React</Combobox.Option>
 *     <Combobox.Option value="vue">Vue</Combobox.Option>
 *   </Combobox.Content>
 * </Combobox.Root>
 * ```
 */

import { ComboboxContent, type ComboboxContentProps } from "./combobox-content.js";
import { ComboboxEmpty, type ComboboxEmptyProps } from "./combobox-empty.js";
import { ComboboxInput, type ComboboxInputProps } from "./combobox-input.js";
import { ComboboxLoading, type ComboboxLoadingProps } from "./combobox-loading.js";
import { ComboboxOption, type ComboboxOptionProps } from "./combobox-option.js";
import { ComboboxRoot, type ComboboxRootProps } from "./combobox-root.js";
import { ComboboxTag, type ComboboxTagProps } from "./combobox-tag.js";

// Compound component
export const Combobox = {
  Root: ComboboxRoot,
  Input: ComboboxInput,
  Content: ComboboxContent,
  Option: ComboboxOption,
  Tag: ComboboxTag,
  Empty: ComboboxEmpty,
  Loading: ComboboxLoading,
};

// Type exports
export type {
  ComboboxContentProps,
  ComboboxEmptyProps,
  ComboboxInputProps,
  ComboboxLoadingProps,
  ComboboxOptionProps,
  ComboboxRootProps,
  ComboboxTagProps,
};

// Re-export Placement and Option from primitives-dom
export type { Placement, Option } from "@ds/primitives-dom";
