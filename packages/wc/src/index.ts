// Base class
export { DSElement, LightElement } from "./base/ds-element.js";

// Event utilities
export { emitEvent, StandardEvents } from "./events/emit.js";
export type { EmitEventOptions, StandardEventName } from "./events/emit.js";

// Registry utilities
export { define, isDefined, whenDefined } from "./registry/define.js";
export {
  getRegisteredTags,
  getComponentClass,
  getComponentClassSync,
  registerComponent,
  hasComponent,
  loadAllComponents,
} from "./registry/registry.js";
export type {
  CustomElementConstructor,
  ComponentRegistryType,
  ComponentTag,
} from "./registry/registry.js";

// Components
export { DsButton } from "./components/button/button.js";
export type { ButtonVariant, ButtonSize } from "./components/button/button.js";
export { DsInput } from "./components/input/input.js";
export type { InputType, InputSize } from "./components/input/input.js";
export { DsLink } from "./components/link/link.js";
export type { LinkVariant, DsNavigateEventDetail } from "./components/link/link.js";
export { DsText } from "./components/text/text.js";
export type { TextSize, TextWeight, TextVariant, TextAs } from "./components/text/text.js";
export { DsIcon } from "./components/icon/icon.js";
export type { IconSize } from "./components/icon/icon.js";
export { DsSpinner } from "./components/spinner/spinner.js";
export type { SpinnerSize } from "./components/spinner/spinner.js";
export { DsVisuallyHidden } from "./components/visually-hidden/visually-hidden.js";
