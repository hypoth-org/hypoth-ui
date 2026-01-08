/**
 * NumberInput compound component for numeric value input.
 *
 * @example
 * ```tsx
 * // Basic number input with buttons
 * <NumberInput.Root min={0} max={100} onValueChange={(v) => console.log(v)}>
 *   <NumberInput.Decrement>-</NumberInput.Decrement>
 *   <NumberInput.Input />
 *   <NumberInput.Increment>+</NumberInput.Increment>
 * </NumberInput.Root>
 *
 * // Currency input
 * <NumberInput.Root format="currency" currency="USD" precision={2}>
 *   <NumberInput.Input />
 * </NumberInput.Root>
 * ```
 */

export { NumberInputRoot, type NumberInputRootProps } from "./number-input-root.js";
export { NumberInputField, type NumberInputFieldProps } from "./number-input-field.js";
export {
  NumberInputIncrement,
  type NumberInputIncrementProps,
} from "./number-input-increment.js";
export {
  NumberInputDecrement,
  type NumberInputDecrementProps,
} from "./number-input-decrement.js";
export {
  useNumberInputContext,
  type NumberInputContextValue,
  type NumberInputFormat,
} from "./number-input-context.js";

export const NumberInput = {
  Root: NumberInputRoot,
  Input: NumberInputField,
  Increment: NumberInputIncrement,
  Decrement: NumberInputDecrement,
} as const;

import { NumberInputDecrement } from "./number-input-decrement.js";
import { NumberInputField } from "./number-input-field.js";
import { NumberInputIncrement } from "./number-input-increment.js";
import { NumberInputRoot } from "./number-input-root.js";
