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

// Field pattern components
export { DsField } from "./components/field/field.js";
export { DsLabel } from "./components/field/label.js";
export { DsFieldDescription } from "./components/field/field-description.js";
export { DsFieldError } from "./components/field/field-error.js";

// Dialog components
export { DsDialog } from "./components/dialog/dialog.js";
export type { DialogRole } from "./components/dialog/dialog.js";
export { DsDialogContent } from "./components/dialog/dialog-content.js";
export type { DialogContentSize } from "./components/dialog/dialog-content.js";
export { DsDialogTitle } from "./components/dialog/dialog-title.js";
export { DsDialogDescription } from "./components/dialog/dialog-description.js";

// Textarea component
export { DsTextarea } from "./components/textarea/textarea.js";
export type { TextareaSize } from "./components/textarea/textarea.js";

// Checkbox component
export { DsCheckbox } from "./components/checkbox/checkbox.js";

// Radio components
export { DsRadioGroup } from "./components/radio/radio-group.js";
export type { RadioOrientation } from "./components/radio/radio-group.js";
export { DsRadio } from "./components/radio/radio.js";

// Switch component
export { DsSwitch } from "./components/switch/switch.js";

// Popover components
export { DsPopover } from "./components/popover/popover.js";
export { DsPopoverContent } from "./components/popover/popover-content.js";

// Tooltip components
export { DsTooltip } from "./components/tooltip/tooltip.js";
export { DsTooltipContent } from "./components/tooltip/tooltip-content.js";

// Menu components
export { DsMenu } from "./components/menu/menu.js";
export { DsMenuContent } from "./components/menu/menu-content.js";
export { DsMenuItem } from "./components/menu/menu-item.js";
