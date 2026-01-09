/**
 * Form control components barrel file.
 * Import from '@ds/wc/form-controls' for tree-shaking.
 */

// Basic form controls
export { DsInput } from "./components/input/input.js";
export type { InputType, InputSize } from "./components/input/input.js";
export { DsTextarea } from "./components/textarea/textarea.js";
export type { TextareaSize } from "./components/textarea/textarea.js";
export { DsCheckbox } from "./components/checkbox/checkbox.js";
export { DsSwitch } from "./components/switch/switch.js";

// Radio components
export { DsRadioGroup } from "./components/radio/radio-group.js";
export type { RadioOrientation } from "./components/radio/radio-group.js";
export { DsRadio } from "./components/radio/radio.js";

// Select components
export { DsSelect } from "./components/select/select.js";
export { DsSelectTrigger } from "./components/select/select-trigger.js";
export { DsSelectContent } from "./components/select/select-content.js";
export type { SelectContentState } from "./components/select/select-content.js";
export { DsSelectOption } from "./components/select/select-option.js";

// Combobox components
export { DsCombobox } from "./components/combobox/combobox.js";
export { DsComboboxInput } from "./components/combobox/combobox-input.js";
export { DsComboboxContent } from "./components/combobox/combobox-content.js";
export type { ComboboxContentState } from "./components/combobox/combobox-content.js";
export { DsComboboxOption } from "./components/combobox/combobox-option.js";
export { DsComboboxTag } from "./components/combobox/combobox-tag.js";

// Advanced form controls
export { DsSlider } from "./components/slider/slider.js";
export { DsNumberInput } from "./components/number-input/number-input.js";
export type { NumberInputFormat } from "./components/number-input/number-input.js";
export { DsFileUpload } from "./components/file-upload/file-upload.js";
export { DsTimePicker } from "./components/time-picker/time-picker.js";
export { DsPinInput } from "./components/pin-input/pin-input.js";

// DatePicker components
export { DsDatePicker } from "./components/date-picker/date-picker.js";
export type { DatePickerMode } from "./components/date-picker/date-picker.js";
export { DsDatePickerCalendar } from "./components/date-picker/date-picker-calendar.js";
export type { CalendarState } from "./components/date-picker/date-picker-calendar.js";

// Field pattern components
export { DsField } from "./components/field/field.js";
export { DsLabel } from "./components/field/label.js";
export { DsFieldDescription } from "./components/field/field-description.js";
export { DsFieldError } from "./components/field/field-error.js";
