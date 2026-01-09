/**
 * Core utilities barrel file.
 * Import from '@ds/wc/core' for tree-shaking.
 */

// Base class and mixins
export { DSElement, LightElement } from "./base/ds-element.js";
export { FormAssociatedMixin } from "./base/form-associated.js";
export type {
  FormAssociatedElement,
  FormAssociatedInterface,
  FormLifecycleCallbacks,
  ValidationFlags,
} from "./base/form-associated.js";

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
