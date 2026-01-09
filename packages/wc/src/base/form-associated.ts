import type { LitElement } from "lit";
import type { PropertyValues } from "lit";
import { property } from "lit/decorators.js";

/**
 * Validation flags for ElementInternals.setValidity().
 */
export interface ValidationFlags {
  /** Element is required but has no value */
  valueMissing?: boolean;
  /** Value doesn't match the expected type */
  typeMismatch?: boolean;
  /** Value doesn't match the pattern attribute */
  patternMismatch?: boolean;
  /** Value exceeds maxlength */
  tooLong?: boolean;
  /** Value is shorter than minlength */
  tooShort?: boolean;
  /** Value exceeds max */
  rangeOverflow?: boolean;
  /** Value is less than min */
  rangeUnderflow?: boolean;
  /** Value doesn't match step */
  stepMismatch?: boolean;
  /** Custom validation failed */
  customError?: boolean;
  /** Value doesn't match any option */
  badInput?: boolean;
}

/**
 * Type for mixin constructor with any args.
 */
// biome-ignore lint/suspicious/noExplicitAny: Mixin pattern requires any[] for constructor args
type Constructor<T = object> = new (...args: any[]) => T;

/**
 * Interface for form-associated element properties and methods.
 */
export interface FormAssociatedInterface {
  name: string;
  value: string;
  disabled: boolean;
  required: boolean;
  customValidation: boolean;
  readonly validity: ValidityState;
  readonly validationMessage: string;
  readonly willValidate: boolean;
  readonly form: HTMLFormElement | null;
  checkValidity(): boolean;
  reportValidity(): boolean;
  setCustomValidity(message: string): void;
}

/**
 * Type for form lifecycle callbacks.
 */
export interface FormLifecycleCallbacks {
  formAssociatedCallback?(form: HTMLFormElement | null): void;
  formDisabledCallback?(disabled: boolean): void;
  formResetCallback?(): void;
  formStateRestoreCallback?(
    state: string | File | FormData | null,
    mode: "restore" | "autocomplete"
  ): void;
}

/**
 * Combined interface for form-associated elements.
 */
export type FormAssociatedElement = FormAssociatedInterface & FormLifecycleCallbacks;

/**
 * Form-associated mixin for Lit elements.
 *
 * Adds ElementInternals-based form participation to any Lit component.
 * Components using this mixin participate in native HTML form submission,
 * validation, and lifecycle callbacks.
 *
 * @example
 * ```typescript
 * import { FormAssociatedMixin } from '../base/form-associated.js';
 * import { DSElement } from '../base/ds-element.js';
 *
 * class DsCheckbox extends FormAssociatedMixin(DSElement) {
 *   @property({ type: Boolean }) checked = false;
 *
 *   protected getFormValue(): FormData | string | null {
 *     return this.checked ? this.value : null;
 *   }
 *
 *   protected getValidationAnchor(): HTMLElement | undefined {
 *     return this.renderRoot.querySelector('.ds-checkbox__control') ?? undefined;
 *   }
 * }
 * ```
 */
export function FormAssociatedMixin<T extends Constructor<LitElement>>(Base: T) {
  abstract class FormAssociatedClass extends Base implements FormAssociatedInterface {
    /**
     * Required static property for form association.
     * Signals to the browser that this element participates in forms.
     */
    static formAssociated = true;

    /**
     * ElementInternals reference for form participation.
     */
    private _internals!: ElementInternals;

    /**
     * Default value for form reset.
     */
    private _defaultValue: string | null = null;

    /**
     * Form field name, used as the key in FormData.
     */
    @property({ type: String, reflect: true })
    name = "";

    /**
     * Current value of the control.
     */
    @property({ type: String })
    value = "";

    /**
     * Whether the control is disabled.
     */
    @property({ type: Boolean, reflect: true })
    disabled = false;

    /**
     * Whether the control is required.
     */
    @property({ type: Boolean, reflect: true })
    required = false;

    /**
     * Opt-in for custom validation UI (ds-field-error) instead of native browser UI.
     */
    @property({ type: Boolean, attribute: "custom-validation" })
    customValidation = false;

    /**
     * Custom error message set via setCustomValidity().
     */
    private _customValidityMessage = "";

    // biome-ignore lint/suspicious/noExplicitAny: Mixin pattern requires any[] for constructor args
    constructor(...args: any[]) {
      super(...args);
      this._internals = this.attachInternals();
    }

    override connectedCallback(): void {
      super.connectedCallback();
      // Store default value for form reset
      this._defaultValue = this.value;
    }

    /**
     * Current validity state of the control.
     */
    get validity(): ValidityState {
      return this._internals.validity;
    }

    /**
     * Localized message describing the validation error.
     */
    get validationMessage(): string {
      return this._internals.validationMessage;
    }

    /**
     * Whether the control will be validated when the form is submitted.
     */
    get willValidate(): boolean {
      return this._internals.willValidate;
    }

    /**
     * The form element that this control is associated with.
     */
    get form(): HTMLFormElement | null {
      return this._internals.form;
    }

    /**
     * Check if the control satisfies its constraints.
     * Does not show any UI feedback.
     */
    checkValidity(): boolean {
      return this._internals.checkValidity();
    }

    /**
     * Check validity and show validation UI if invalid.
     * When customValidation is true, emits ds:invalid event instead of native UI.
     */
    reportValidity(): boolean {
      if (this.customValidation) {
        const valid = this._internals.checkValidity();
        if (!valid) {
          this.dispatchEvent(
            new CustomEvent("ds:invalid", {
              detail: { message: this._internals.validationMessage },
              bubbles: true,
              composed: true,
            })
          );
        }
        return valid;
      }
      return this._internals.reportValidity();
    }

    /**
     * Set a custom validation message.
     * Empty string clears custom validity.
     */
    setCustomValidity(message: string): void {
      this._customValidityMessage = message;
      if (message) {
        this._internals.setValidity({ customError: true }, message, this.getValidationAnchor());
      } else {
        this.updateValidity();
      }
    }

    /**
     * Called when the element is associated with a form.
     */
    formAssociatedCallback(form: HTMLFormElement | null): void {
      // Can be overridden by subclasses
      void form;
    }

    /**
     * Called when the element or ancestor fieldset is disabled/enabled.
     */
    formDisabledCallback(disabled: boolean): void {
      this.disabled = disabled;
    }

    /**
     * Called when the form is reset.
     * Subclasses should override to restore their specific default state.
     */
    formResetCallback(): void {
      this.value = this._defaultValue ?? "";
      this._customValidityMessage = "";
      this._internals.setFormValue(null);
      this._internals.setValidity({});
      this.onFormReset();
    }

    /**
     * Called during form state restoration (navigation, autofill).
     */
    formStateRestoreCallback(
      state: string | File | FormData | null,
      mode: "restore" | "autocomplete"
    ): void {
      if (typeof state === "string") {
        this.value = state;
      }
      this.onFormStateRestore(state, mode);
    }

    /**
     * Override in subclass to return the form value.
     * Return null to indicate no value (won't be submitted).
     */
    protected abstract getFormValue(): FormData | string | null;

    /**
     * Override in subclass to return the anchor element for validation messages.
     * This is typically the interactive element within the component.
     */
    protected getValidationAnchor(): HTMLElement | undefined {
      return undefined;
    }

    /**
     * Override in subclass to return validation flags.
     * Called by updateValidity() to determine validity state.
     */
    protected getValidationFlags(): ValidationFlags {
      return {};
    }

    /**
     * Override in subclass to return validation message for current flags.
     */
    protected getValidationMessage(_flags: ValidationFlags): string {
      return "";
    }

    /**
     * Hook for subclasses to handle form reset.
     */
    protected onFormReset(): void {
      // Override in subclass
    }

    /**
     * Hook for subclasses to handle form state restore.
     */
    protected onFormStateRestore(
      _state: string | File | FormData | null,
      _mode: "restore" | "autocomplete"
    ): void {
      // Override in subclass
    }

    /**
     * Updates the form value. Call this when the component's value changes.
     */
    protected updateFormValue(): void {
      const value = this.getFormValue();
      this._internals.setFormValue(value);
    }

    /**
     * Updates the validity state. Call this when validation-relevant state changes.
     */
    protected updateValidity(): void {
      // Check for custom validity first
      if (this._customValidityMessage) {
        this._internals.setValidity(
          { customError: true },
          this._customValidityMessage,
          this.getValidationAnchor()
        );
        return;
      }

      // Get validation flags from subclass
      const flags = this.getValidationFlags();
      const hasError = Object.values(flags).some(Boolean);

      if (hasError) {
        const message = this.getValidationMessage(flags);
        this._internals.setValidity(flags, message, this.getValidationAnchor());
      } else {
        this._internals.setValidity({});
      }
    }

    /**
     * Lifecycle hook to sync form value and validity on property changes.
     */
    protected override updated(changedProperties: PropertyValues): void {
      super.updated(changedProperties);

      // Update form value when value or relevant state changes
      if (changedProperties.has("value") || this.shouldUpdateFormValue(changedProperties)) {
        this.updateFormValue();
      }

      // Update validity when validation-relevant properties change
      if (
        changedProperties.has("required") ||
        changedProperties.has("disabled") ||
        this.shouldUpdateValidity(changedProperties)
      ) {
        this.updateValidity();
      }
    }

    /**
     * Override to specify additional properties that should trigger form value update.
     */
    protected shouldUpdateFormValue(_changedProperties: PropertyValues): boolean {
      return false;
    }

    /**
     * Override to specify additional properties that should trigger validity update.
     */
    protected shouldUpdateValidity(_changedProperties: PropertyValues): boolean {
      return false;
    }
  }

  return FormAssociatedClass as unknown as Constructor<FormAssociatedInterface & LitElement> & T & { formAssociated: true };
}
