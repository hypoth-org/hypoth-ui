/**
 * Form-Associated Custom Element Contract
 *
 * This file defines the interface contract for form-associated WC components.
 * Components implementing this contract participate in native HTML form submission.
 */

// =============================================================================
// BASE INTERFACE
// =============================================================================

/**
 * Interface for form-associated custom elements.
 * All form controls (Checkbox, Switch, Radio, Select, Combobox) must implement this.
 */
export interface FormAssociatedElement {
  // ---------------------------------------------------------------------------
  // Static Property (required by browser)
  // ---------------------------------------------------------------------------

  /**
   * Must be declared as a static class property.
   * Signals to the browser that this element participates in forms.
   *
   * @example
   * ```typescript
   * class DsCheckbox extends LitElement {
   *   static formAssociated = true;
   * }
   * ```
   */
  // static formAssociated: true;

  // ---------------------------------------------------------------------------
  // Standard Form Attributes
  // ---------------------------------------------------------------------------

  /**
   * Form control name, used as the key in FormData.
   */
  name: string;

  /**
   * Current value of the control.
   * For checkboxes: the value submitted when checked (default: "on")
   * For radios: the value of the selected option
   * For selects: the value of the selected option(s)
   */
  value: string;

  /**
   * Whether the control is disabled.
   * Disabled controls are not submitted with the form.
   */
  disabled: boolean;

  /**
   * Whether the control is required.
   * Required controls must have a value for the form to be valid.
   */
  required: boolean;

  // ---------------------------------------------------------------------------
  // Validation Properties (read-only)
  // ---------------------------------------------------------------------------

  /**
   * Current validity state of the control.
   * Reflects the result of constraint validation.
   */
  readonly validity: ValidityState;

  /**
   * Localized message describing the validation error.
   * Empty string if valid.
   */
  readonly validationMessage: string;

  /**
   * Whether the control will be validated when the form is submitted.
   * False if disabled or readonly.
   */
  readonly willValidate: boolean;

  // ---------------------------------------------------------------------------
  // Public Methods
  // ---------------------------------------------------------------------------

  /**
   * Check if the control satisfies its constraints.
   * Does not show any UI feedback.
   *
   * @returns true if valid, false if invalid
   */
  checkValidity(): boolean;

  /**
   * Check validity and show browser validation UI if invalid.
   * Shows native browser tooltip/popup for invalid state.
   *
   * @returns true if valid, false if invalid
   */
  reportValidity(): boolean;

  /**
   * Set a custom validation message.
   * Empty string clears custom validity.
   *
   * @param message - Custom error message or empty string
   */
  setCustomValidity(message: string): void;
}

// =============================================================================
// FORM LIFECYCLE CALLBACKS
// =============================================================================

/**
 * Lifecycle callbacks invoked by the browser for form-associated elements.
 * These are optional but recommended for proper form integration.
 */
export interface FormLifecycleCallbacks {
  /**
   * Called when the element is associated with or disassociated from a form.
   *
   * Use cases:
   * - Perform form-specific initialization
   * - Clean up when removed from form
   *
   * @param form - The form element, or null if disassociated
   */
  formAssociatedCallback?(form: HTMLFormElement | null): void;

  /**
   * Called when the element or an ancestor fieldset becomes disabled/enabled.
   *
   * Use cases:
   * - Update visual state
   * - Disable/enable interactive features
   *
   * @param disabled - Whether the element should be disabled
   */
  formDisabledCallback?(disabled: boolean): void;

  /**
   * Called when the form is reset.
   *
   * Use cases:
   * - Restore to initial/default value
   * - Clear validation state
   * - Reset internal state
   */
  formResetCallback?(): void;

  /**
   * Called during form state restoration (navigation, autofill).
   *
   * Use cases:
   * - Restore value from browser navigation (back/forward)
   * - Handle browser autofill
   *
   * @param state - Previously saved state (from setFormValue second parameter)
   * @param mode - 'restore' for navigation, 'autocomplete' for autofill
   */
  formStateRestoreCallback?(
    state: string | File | FormData,
    mode: "restore" | "autocomplete"
  ): void;
}

// =============================================================================
// VALIDATION FLAGS
// =============================================================================

/**
 * Custom validation flags for setValidity().
 * Use these to indicate specific validation failures.
 */
export interface ValidationFlags {
  /** Element is required but has no value */
  valueMissing?: boolean;

  /** Value doesn't match the expected type (e.g., email format) */
  typeMismatch?: boolean;

  /** Value doesn't match the pattern attribute */
  patternMismatch?: boolean;

  /** Value exceeds maxlength */
  tooLong?: boolean;

  /** Value is shorter than minlength */
  tooShort?: boolean;

  /** Value exceeds max (for number/date inputs) */
  rangeOverflow?: boolean;

  /** Value is less than min (for number/date inputs) */
  rangeUnderflow?: boolean;

  /** Value doesn't match step (for number inputs) */
  stepMismatch?: boolean;

  /** Custom validation failed (via setCustomValidity) */
  customError?: boolean;

  /** Value doesn't match any option (for select-like elements) */
  badInput?: boolean;
}

// =============================================================================
// IMPLEMENTATION PATTERN
// =============================================================================

/**
 * Example implementation pattern for a form-associated checkbox.
 *
 * ```typescript
 * import { LitElement, html } from 'lit';
 * import { property } from 'lit/decorators.js';
 *
 * export class DsCheckbox extends LitElement {
 *   // Required: Declare form association
 *   static formAssociated = true;
 *
 *   // Internal ElementInternals reference
 *   private internals: ElementInternals;
 *
 *   // Form attributes
 *   @property({ type: String, reflect: true })
 *   name = '';
 *
 *   @property({ type: String })
 *   value = 'on';
 *
 *   @property({ type: Boolean, reflect: true })
 *   checked = false;
 *
 *   @property({ type: Boolean, reflect: true })
 *   disabled = false;
 *
 *   @property({ type: Boolean, reflect: true })
 *   required = false;
 *
 *   // Opt-in custom validation UI
 *   @property({ type: Boolean, attribute: 'custom-validation' })
 *   customValidation = false;
 *
 *   constructor() {
 *     super();
 *     // Attach internals in constructor
 *     this.internals = this.attachInternals();
 *   }
 *
 *   // Expose validation properties
 *   get validity(): ValidityState {
 *     return this.internals.validity;
 *   }
 *
 *   get validationMessage(): string {
 *     return this.internals.validationMessage;
 *   }
 *
 *   get willValidate(): boolean {
 *     return this.internals.willValidate;
 *   }
 *
 *   // Update form value when checked state changes
 *   updated(changedProperties: Map<string, unknown>): void {
 *     if (changedProperties.has('checked')) {
 *       this.internals.setFormValue(this.checked ? this.value : null);
 *       this.updateValidity();
 *     }
 *   }
 *
 *   // Validate against constraints
 *   private updateValidity(): void {
 *     if (this.required && !this.checked) {
 *       this.internals.setValidity(
 *         { valueMissing: true },
 *         'Please check this box to proceed',
 *         this.renderRoot.querySelector('input') || undefined
 *       );
 *     } else {
 *       this.internals.setValidity({});
 *     }
 *   }
 *
 *   // Public validation methods
 *   checkValidity(): boolean {
 *     return this.internals.checkValidity();
 *   }
 *
 *   reportValidity(): boolean {
 *     if (this.customValidation) {
 *       // Emit event for ds-field-error to handle
 *       if (!this.checkValidity()) {
 *         this.dispatchEvent(new CustomEvent('ds:invalid', {
 *           detail: { message: this.validationMessage },
 *           bubbles: true,
 *         }));
 *       }
 *       return this.checkValidity();
 *     }
 *     return this.internals.reportValidity();
 *   }
 *
 *   setCustomValidity(message: string): void {
 *     if (message) {
 *       this.internals.setValidity({ customError: true }, message);
 *     } else {
 *       this.updateValidity();
 *     }
 *   }
 *
 *   // Form lifecycle callbacks
 *   formResetCallback(): void {
 *     this.checked = false;
 *     this.internals.setFormValue(null);
 *     this.internals.setValidity({});
 *   }
 *
 *   formDisabledCallback(disabled: boolean): void {
 *     this.disabled = disabled;
 *   }
 *
 *   formStateRestoreCallback(state: string, mode: string): void {
 *     if (typeof state === 'string') {
 *       this.checked = state === this.value;
 *     }
 *   }
 * }
 * ```
 */
export type FormAssociatedImplementation = "See code comment above";

// =============================================================================
// COMPONENT-SPECIFIC CONTRACTS
// =============================================================================

/**
 * Checkbox-specific form behavior.
 */
export interface CheckboxFormContract extends FormAssociatedElement {
  /** Whether the checkbox is checked */
  checked: boolean;

  /** Value submitted when checked (default: "on") */
  value: string;

  /** Indeterminate state (visual only, doesn't affect form value) */
  indeterminate?: boolean;
}

/**
 * Switch-specific form behavior (same as checkbox).
 */
export interface SwitchFormContract extends FormAssociatedElement {
  /** Whether the switch is on */
  checked: boolean;

  /** Value submitted when on (default: "true") */
  value: string;
}

/**
 * Radio group form behavior.
 * Note: The radio GROUP is form-associated, not individual radios.
 */
export interface RadioGroupFormContract extends FormAssociatedElement {
  /** Currently selected radio value */
  value: string;

  /** Orientation for keyboard navigation */
  orientation?: "horizontal" | "vertical";
}

/**
 * Select form behavior.
 */
export interface SelectFormContract extends FormAssociatedElement {
  /** Currently selected option value */
  value: string;

  /** For multi-select, all selected values */
  selectedValues?: string[];

  /** Whether multiple selection is allowed */
  multiple?: boolean;
}

/**
 * Combobox form behavior.
 */
export interface ComboboxFormContract extends FormAssociatedElement {
  /** Currently selected option value(s) */
  value: string;

  /** For multi-select combobox */
  selectedValues?: string[];

  /** Whether multiple selection is allowed */
  multiple?: boolean;

  /** Current input text (may differ from selected value) */
  inputValue?: string;
}
