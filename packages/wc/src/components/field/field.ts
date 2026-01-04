import { html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

// Import child components to ensure they're registered
import "./label.js";
import "./field-description.js";
import "./field-error.js";

/**
 * Field container component for form controls.
 *
 * Provides consistent layout and automatic ARIA attribute composition
 * for form fields. Associates labels, descriptions, and error messages
 * with the form control for accessibility.
 *
 * @element ds-field
 *
 * @slot - Field contents (label, form control, description, error)
 *
 * @csspart container - The field container element
 *
 * @cssprop --ds-field-gap - Gap between field children (default: 0.5rem)
 * @cssprop --ds-field-error-color - Error message color
 *
 * @example
 * ```html
 * <ds-field required>
 *   <ds-label>Email address</ds-label>
 *   <ds-field-description>We'll never share your email</ds-field-description>
 *   <ds-input type="email" name="email"></ds-input>
 *   <ds-field-error>Please enter a valid email</ds-field-error>
 * </ds-field>
 * ```
 */
export class DsField extends DSElement {
  /** Marks the field as required */
  @property({ type: Boolean, reflect: true })
  required = false;

  /** Whether the field is disabled */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Generated unique ID for ARIA associations */
  @state()
  private fieldId = "";

  /** Whether an error child is present */
  @state()
  private hasError = false;

  /** Whether a description child is present */
  @state()
  private hasDescription = false;

  private observer: MutationObserver | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    // Generate unique ID for this field instance
    this.fieldId = `field-${crypto.randomUUID().slice(0, 8)}`;

    // Set up mutation observer to track child changes
    this.observer = new MutationObserver(() => this.updateChildComponents());
    this.observer.observe(this, { childList: true, subtree: true });

    // Initial setup after first render
    this.updateComplete.then(() => {
      this.updateChildComponents();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.observer?.disconnect();
    this.observer = null;
  }

  /**
   * Updates ARIA attributes on child components based on field structure.
   */
  private updateChildComponents(): void {
    // Find child components
    const label = this.querySelector("ds-label");
    const description = this.querySelector("ds-field-description");
    const error = this.querySelector("ds-field-error");
    const formControl = this.querySelector(
      "ds-input, ds-textarea, ds-checkbox, ds-radio-group, ds-switch, input, textarea, select"
    );

    // Track which components are present
    this.hasError = !!error && error.textContent?.trim() !== "";
    this.hasDescription = !!description && description.textContent?.trim() !== "";

    // Assign IDs to components
    if (label) {
      const labelId = `${this.fieldId}-label`;
      label.id = labelId;

      // Set data-required on label for styling
      if (this.required) {
        label.setAttribute("data-required", "");
      } else {
        label.removeAttribute("data-required");
      }
    }

    if (description) {
      description.id = `${this.fieldId}-desc`;
    }

    if (error) {
      error.id = `${this.fieldId}-error`;
    }

    // Compose ARIA attributes for form control
    if (formControl) {
      // Build aria-labelledby
      if (label) {
        formControl.setAttribute("aria-labelledby", label.id);
      }

      // Build aria-describedby (error first, then description)
      const describedByIds: string[] = [];
      if (this.hasError && error) {
        describedByIds.push(error.id);
      }
      if (this.hasDescription && description) {
        describedByIds.push(description.id);
      }

      if (describedByIds.length > 0) {
        formControl.setAttribute("aria-describedby", describedByIds.join(" "));
      } else {
        formControl.removeAttribute("aria-describedby");
      }

      // Set aria-invalid if error is present
      if (this.hasError) {
        formControl.setAttribute("aria-invalid", "true");
        // Also set error property if it's a design system component
        if ("error" in formControl) {
          (formControl as { error: boolean }).error = true;
        }
      } else {
        formControl.setAttribute("aria-invalid", "false");
        if ("error" in formControl) {
          (formControl as { error: boolean }).error = false;
        }
      }

      // Set aria-required if field is required
      if (this.required) {
        formControl.setAttribute("aria-required", "true");
        if ("required" in formControl) {
          (formControl as { required: boolean }).required = true;
        }
      }

      // Set disabled state
      if (this.disabled) {
        formControl.setAttribute("aria-disabled", "true");
        if ("disabled" in formControl) {
          (formControl as { disabled: boolean }).disabled = true;
        }
      }
    }

    // Update data attributes on self for CSS styling
    if (this.hasError) {
      this.setAttribute("data-error", "");
    } else {
      this.removeAttribute("data-error");
    }

    if (this.disabled) {
      this.setAttribute("data-disabled", "");
    } else {
      this.removeAttribute("data-disabled");
    }
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    // Re-apply ARIA attributes when required or disabled changes
    if (changedProperties.has("required") || changedProperties.has("disabled")) {
      this.updateChildComponents();
    }
  }

  override render() {
    return html`
      <div class="ds-field" part="container">
        <slot @slotchange=${this.updateChildComponents}></slot>
      </div>
    `;
  }
}

define("ds-field", DsField);

declare global {
  interface HTMLElementTagNameMap {
    "ds-field": DsField;
  }
}
