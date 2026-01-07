/**
 * PinInput compound component for PIN/OTP entry.
 *
 * @example
 * ```tsx
 * // Basic 6-digit PIN
 * <PinInput.Root length={6} onComplete={(value) => verifyOTP(value)}>
 *   {Array.from({ length: 6 }, (_, i) => (
 *     <PinInput.Field key={i} index={i} />
 *   ))}
 * </PinInput.Root>
 *
 * // With custom styling
 * <PinInput.Root length={4} mask>
 *   <div className="pin-container">
 *     <PinInput.Field index={0} className="pin-field" />
 *     <PinInput.Field index={1} className="pin-field" />
 *     <span className="separator">-</span>
 *     <PinInput.Field index={2} className="pin-field" />
 *     <PinInput.Field index={3} className="pin-field" />
 *   </div>
 * </PinInput.Root>
 * ```
 */

export { PinInputRoot, type PinInputRootProps } from "./pin-input-root.js";
export { PinInputField, type PinInputFieldProps } from "./pin-input-field.js";
export {
  usePinInputContext,
  type PinInputContextValue,
} from "./pin-input-context.js";

export const PinInput = {
  Root: PinInputRoot,
  Field: PinInputField,
} as const;

import { PinInputField } from "./pin-input-field.js";
import { PinInputRoot } from "./pin-input-root.js";
