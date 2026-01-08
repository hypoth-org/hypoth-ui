/**
 * PinInput component for PIN/OTP entry with auto-advance.
 *
 * @element ds-pin-input
 * @fires ds:change - Fired on value change with { value }
 * @fires ds:complete - Fired when all digits entered
 *
 * @example
 * ```html
 * <!-- 6-digit PIN -->
 * <ds-pin-input length="6"></ds-pin-input>
 *
 * <!-- 4-digit with initial value -->
 * <ds-pin-input length="4" value="1234"></ds-pin-input>
 *
 * <!-- Alphanumeric code -->
 * <ds-pin-input length="6" alphanumeric></ds-pin-input>
 * ```
 */

import { type PinInputBehavior, createPinInputBehavior } from "@ds/primitives-dom";
import { html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export class DsPinInput extends DSElement {
  /** Number of input fields */
  @property({ type: Number, reflect: true })
  length = 6;

  /** Current value */
  @property({ type: String, reflect: true })
  value = "";

  /** Allow alphanumeric characters */
  @property({ type: Boolean, reflect: true })
  alphanumeric = false;

  /** Disabled state */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Mask input (like password) */
  @property({ type: Boolean, reflect: true })
  mask = false;

  /** ARIA label */
  @property({ type: String, attribute: "aria-label" })
  override ariaLabel: string | null = null;

  @state()
  private behavior: PinInputBehavior | null = null;

  @state()
  private focusedIndex: number | null = null;

  private inputRefs: (HTMLInputElement | null)[] = [];

  override connectedCallback(): void {
    super.connectedCallback();
    this.initBehavior();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.behavior?.destroy();
    this.behavior = null;
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (
      changedProperties.has("length") ||
      changedProperties.has("alphanumeric") ||
      changedProperties.has("disabled")
    ) {
      this.initBehavior();
    }
  }

  private initBehavior(): void {
    this.behavior?.destroy();

    this.behavior = createPinInputBehavior({
      length: this.length,
      defaultValue: this.value,
      alphanumeric: this.alphanumeric,
      disabled: this.disabled,
      onValueChange: (value) => {
        this.value = value;
        emitEvent(this, StandardEvents.CHANGE, { detail: { value } });
      },
      onComplete: (value) => {
        emitEvent(this, "ds:complete", { detail: { value } });
      },
    });

    this.inputRefs = new Array(this.length).fill(null);
  }

  /** Public method to clear the input */
  clear(): void {
    this.behavior?.clear();
    this.focusInput(0);
  }

  /** Public method to set value programmatically */
  setValue(value: string): void {
    this.behavior?.setValue(value);
  }

  private focusInput(index: number): void {
    const input = this.inputRefs[index];
    if (input) {
      input.focus();
      input.select();
    }
  }

  private handleInput(index: number, event: InputEvent): void {
    if (!this.behavior) return;

    const input = event.target as HTMLInputElement;
    const char = input.value.slice(-1); // Get last character

    if (char) {
      this.behavior.input(index, char);

      // Auto-advance to next input
      const nextIndex = this.behavior.state.focusedIndex;
      if (nextIndex !== null && nextIndex !== index) {
        this.focusInput(nextIndex);
      }
    }

    // Clear input to prevent accumulation
    input.value = this.behavior.getValueAt(index);
  }

  private handleKeyDown(index: number, event: KeyboardEvent): void {
    if (!this.behavior) return;

    switch (event.key) {
      case "Backspace": {
        event.preventDefault();
        this.behavior.backspace(index);
        const prevIndex = this.behavior.state.focusedIndex;
        if (prevIndex !== null && prevIndex !== index) {
          this.focusInput(prevIndex);
        }
        break;
      }
      case "ArrowLeft":
        event.preventDefault();
        this.behavior.focusPrev();
        if (this.behavior.state.focusedIndex !== null) {
          this.focusInput(this.behavior.state.focusedIndex);
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        this.behavior.focusNext();
        if (this.behavior.state.focusedIndex !== null) {
          this.focusInput(this.behavior.state.focusedIndex);
        }
        break;
      case "Delete": {
        event.preventDefault();
        // Clear current position without moving
        const chars = this.behavior.state.value.split("");
        chars[index] = " ";
        this.behavior.setValue(chars.join(""));
        break;
      }
    }
  }

  private handlePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData("text") ?? "";
    if (pastedText && this.behavior) {
      this.behavior.paste(pastedText);
      // Focus last filled position
      const focusedIdx = this.behavior.state.focusedIndex;
      if (focusedIdx !== null) {
        this.focusInput(focusedIdx);
      }
    }
  }

  private handleFocus(index: number): void {
    this.focusedIndex = index;
    this.behavior?.focus(index);
  }

  private handleBlur(): void {
    this.focusedIndex = null;
  }

  override render() {
    if (!this.behavior) return nothing;

    const containerProps = this.behavior.getContainerProps();
    const inputs = [];

    for (let i = 0; i < this.length; i++) {
      const inputProps = this.behavior.getInputProps(i);
      const value = this.behavior.getValueAt(i);
      const isFocused = this.focusedIndex === i;

      inputs.push(html`
        <input
          class="ds-pin-input__field"
          type=${this.mask ? "password" : inputProps.type}
          inputmode=${inputProps.inputMode}
          maxlength=${inputProps.maxLength}
          autocomplete=${inputProps.autoComplete}
          aria-label=${inputProps["aria-label"]}
          tabindex=${inputProps.tabIndex}
          .value=${value}
          ?disabled=${this.disabled}
          data-index=${i}
          data-focused=${isFocused || nothing}
          data-filled=${value ? true : nothing}
          @input=${(e: InputEvent) => this.handleInput(i, e)}
          @keydown=${(e: KeyboardEvent) => this.handleKeyDown(i, e)}
          @paste=${this.handlePaste}
          @focus=${() => this.handleFocus(i)}
          @blur=${this.handleBlur}
          .ref=${(el: HTMLInputElement | null) => {
            this.inputRefs[i] = el;
          }}
        />
      `);
    }

    return html`
      <div
        class="ds-pin-input"
        role=${containerProps.role}
        aria-label=${this.ariaLabel || containerProps["aria-label"]}
        data-disabled=${this.disabled || nothing}
      >
        ${inputs}
      </div>
    `;
  }
}

define("ds-pin-input", DsPinInput);

declare global {
  interface HTMLElementTagNameMap {
    "ds-pin-input": DsPinInput;
  }
}
