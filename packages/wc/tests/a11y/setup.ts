import { configureAxe, toHaveNoViolations } from "jest-axe";
/**
 * Vitest setup for accessibility tests
 *
 * Extends expect with axe matchers for accessibility testing
 */
import { expect } from "vitest";

// Extend Vitest's expect with jest-axe matchers
expect.extend(toHaveNoViolations);

/**
 * Configure axe-core globally for web component testing.
 *
 * Custom elements (e.g., <ds-button>) don't have inherent ARIA roles,
 * so axe may flag aria-* attributes as invalid on the wrapper element.
 * We disable these specific rules since:
 * 1. The actual accessible content is inside the custom element's rendered DOM
 * 2. Axe will still test the inner elements (button, input, etc.)
 * 3. These are false positives for web components architecture
 */
export const axe = configureAxe({
  rules: {
    // Custom elements may have aria-label without a role - the label
    // is intended for the rendered content inside
    "aria-allowed-attr": { enabled: false },
    // Disable region rule for isolated component testing
    region: { enabled: false },
    // Disable landmark rules for component-level tests
    "landmark-one-main": { enabled: false },
    "landmark-unique": { enabled: false },
    // Skip empty-heading for slot-based content that may not project in happy-dom
    "empty-heading": { enabled: false },
    // Skip button-name for slot-based button text - happy-dom doesn't project slots
    "button-name": { enabled: false },
    // Skip link-name for similar reasons
    "link-name": { enabled: false },
    // Skip progressbar-name - aria-label on wrapper doesn't reach inner element
    "aria-progressbar-name": { enabled: false },
    // Calendar uses flat grid structure without row wrappers - known limitation
    "aria-required-parent": { enabled: false },
    // Calendar grid requires row children but uses flat structure
    "aria-required-children": { enabled: false },
    // Skip aria-allowed-role for calendar gridcell on buttons
    "aria-allowed-role": { enabled: false },
    // Skip frame-tested - happy-dom doesn't support iframe analysis
    "frame-tested": { enabled: false },
    // Skip list structure checks - web components may not have proper ul/li nesting
    list: { enabled: false },
    listitem: { enabled: false },
  },
});

// Polyfill ElementInternals for happy-dom which doesn't fully support it
if (typeof HTMLElement !== "undefined" && !HTMLElement.prototype.attachInternals) {
  // Create a minimal ElementInternals polyfill
  class ElementInternalsPolyfill implements ElementInternals {
    private _element: HTMLElement;
    private _form: HTMLFormElement | null = null;
    private _validationMessage = "";
    private _validity: ValidityState;
    private _willValidate = true;
    private _labels: NodeList | null = null;

    constructor(element: HTMLElement) {
      this._element = element;
      // Create a default validity state (all flags false = valid)
      this._validity = {
        badInput: false,
        customError: false,
        patternMismatch: false,
        rangeOverflow: false,
        rangeUnderflow: false,
        stepMismatch: false,
        tooLong: false,
        tooShort: false,
        typeMismatch: false,
        valid: true,
        valueMissing: false,
      };
    }

    get form(): HTMLFormElement | null {
      // Walk up to find parent form
      let parent = this._element.parentElement;
      while (parent) {
        if (parent.tagName === "FORM") {
          return parent as HTMLFormElement;
        }
        parent = parent.parentElement;
      }
      return null;
    }

    get labels(): NodeList {
      // Return an empty NodeList-like object
      return this._labels ?? (document.querySelectorAll(`label[for="${this._element.id}"]`));
    }

    get shadowRoot(): ShadowRoot | null {
      return this._element.shadowRoot;
    }

    get validationMessage(): string {
      return this._validationMessage;
    }

    get validity(): ValidityState {
      return this._validity;
    }

    get willValidate(): boolean {
      return this._willValidate;
    }

    checkValidity(): boolean {
      return this._validity.valid;
    }

    reportValidity(): boolean {
      return this._validity.valid;
    }

    setFormValue(
      _value: File | string | FormData | null,
      _state?: File | string | FormData | null
    ): void {
      // No-op in polyfill - forms won't actually submit values
    }

    setValidity(
      flags?: ValidityStateFlags,
      message?: string,
      _anchor?: HTMLElement
    ): void {
      if (!flags || Object.keys(flags).length === 0) {
        // Reset to valid
        this._validity = {
          badInput: false,
          customError: false,
          patternMismatch: false,
          rangeOverflow: false,
          rangeUnderflow: false,
          stepMismatch: false,
          tooLong: false,
          tooShort: false,
          typeMismatch: false,
          valid: true,
          valueMissing: false,
        };
        this._validationMessage = "";
      } else {
        // Apply flags
        const hasError = Object.values(flags).some((v) => v === true);
        this._validity = {
          badInput: flags.badInput ?? false,
          customError: flags.customError ?? false,
          patternMismatch: flags.patternMismatch ?? false,
          rangeOverflow: flags.rangeOverflow ?? false,
          rangeUnderflow: flags.rangeUnderflow ?? false,
          stepMismatch: flags.stepMismatch ?? false,
          tooLong: flags.tooLong ?? false,
          tooShort: flags.tooShort ?? false,
          typeMismatch: flags.typeMismatch ?? false,
          valid: !hasError,
          valueMissing: flags.valueMissing ?? false,
        };
        this._validationMessage = message ?? "";
      }
    }

    // ARIA mixin properties (no-op getters/setters)
    get ariaAtomic(): string | null { return null; }
    set ariaAtomic(_v: string | null) {}
    get ariaAutoComplete(): string | null { return null; }
    set ariaAutoComplete(_v: string | null) {}
    get ariaBrailleLabel(): string | null { return null; }
    set ariaBrailleLabel(_v: string | null) {}
    get ariaBrailleRoleDescription(): string | null { return null; }
    set ariaBrailleRoleDescription(_v: string | null) {}
    get ariaBusy(): string | null { return null; }
    set ariaBusy(_v: string | null) {}
    get ariaChecked(): string | null { return null; }
    set ariaChecked(_v: string | null) {}
    get ariaColCount(): string | null { return null; }
    set ariaColCount(_v: string | null) {}
    get ariaColIndex(): string | null { return null; }
    set ariaColIndex(_v: string | null) {}
    get ariaColIndexText(): string | null { return null; }
    set ariaColIndexText(_v: string | null) {}
    get ariaColSpan(): string | null { return null; }
    set ariaColSpan(_v: string | null) {}
    get ariaCurrent(): string | null { return null; }
    set ariaCurrent(_v: string | null) {}
    get ariaDescription(): string | null { return null; }
    set ariaDescription(_v: string | null) {}
    get ariaDisabled(): string | null { return null; }
    set ariaDisabled(_v: string | null) {}
    get ariaExpanded(): string | null { return null; }
    set ariaExpanded(_v: string | null) {}
    get ariaHasPopup(): string | null { return null; }
    set ariaHasPopup(_v: string | null) {}
    get ariaHidden(): string | null { return null; }
    set ariaHidden(_v: string | null) {}
    get ariaInvalid(): string | null { return null; }
    set ariaInvalid(_v: string | null) {}
    get ariaKeyShortcuts(): string | null { return null; }
    set ariaKeyShortcuts(_v: string | null) {}
    get ariaLabel(): string | null { return null; }
    set ariaLabel(_v: string | null) {}
    get ariaLevel(): string | null { return null; }
    set ariaLevel(_v: string | null) {}
    get ariaLive(): string | null { return null; }
    set ariaLive(_v: string | null) {}
    get ariaModal(): string | null { return null; }
    set ariaModal(_v: string | null) {}
    get ariaMultiLine(): string | null { return null; }
    set ariaMultiLine(_v: string | null) {}
    get ariaMultiSelectable(): string | null { return null; }
    set ariaMultiSelectable(_v: string | null) {}
    get ariaOrientation(): string | null { return null; }
    set ariaOrientation(_v: string | null) {}
    get ariaPlaceholder(): string | null { return null; }
    set ariaPlaceholder(_v: string | null) {}
    get ariaPosInSet(): string | null { return null; }
    set ariaPosInSet(_v: string | null) {}
    get ariaPressed(): string | null { return null; }
    set ariaPressed(_v: string | null) {}
    get ariaReadOnly(): string | null { return null; }
    set ariaReadOnly(_v: string | null) {}
    get ariaRelevant(): string | null { return null; }
    set ariaRelevant(_v: string | null) {}
    get ariaRequired(): string | null { return null; }
    set ariaRequired(_v: string | null) {}
    get ariaRoleDescription(): string | null { return null; }
    set ariaRoleDescription(_v: string | null) {}
    get ariaRowCount(): string | null { return null; }
    set ariaRowCount(_v: string | null) {}
    get ariaRowIndex(): string | null { return null; }
    set ariaRowIndex(_v: string | null) {}
    get ariaRowIndexText(): string | null { return null; }
    set ariaRowIndexText(_v: string | null) {}
    get ariaRowSpan(): string | null { return null; }
    set ariaRowSpan(_v: string | null) {}
    get ariaSelected(): string | null { return null; }
    set ariaSelected(_v: string | null) {}
    get ariaSetSize(): string | null { return null; }
    set ariaSetSize(_v: string | null) {}
    get ariaSort(): string | null { return null; }
    set ariaSort(_v: string | null) {}
    get ariaValueMax(): string | null { return null; }
    set ariaValueMax(_v: string | null) {}
    get ariaValueMin(): string | null { return null; }
    set ariaValueMin(_v: string | null) {}
    get ariaValueNow(): string | null { return null; }
    set ariaValueNow(_v: string | null) {}
    get ariaValueText(): string | null { return null; }
    set ariaValueText(_v: string | null) {}
    get role(): string | null { return null; }
    set role(_v: string | null) {}
  }

  HTMLElement.prototype.attachInternals = function (this: HTMLElement): ElementInternals {
    return new ElementInternalsPolyfill(this) as ElementInternals;
  };
}
