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
