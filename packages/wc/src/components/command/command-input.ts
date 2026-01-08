import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";

/**
 * Command palette input component - search input for filtering commands.
 *
 * @element ds-command-input
 *
 * @fires ds:command-input - When the input value changes (bubbles to ds-command)
 *
 * @example
 * ```html
 * <ds-command-input placeholder="Type a command or search..."></ds-command-input>
 * ```
 */
export class DsCommandInput extends DSElement {
  /**
   * Current input value.
   */
  @property({ type: String })
  value = "";

  /**
   * Placeholder text.
   */
  @property({ type: String })
  placeholder = "Type a command or search...";

  /**
   * Whether the input is disabled.
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  private _input: HTMLInputElement | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this._createInput();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._input) {
      this._input.removeEventListener("input", this._handleInput);
      this._input.removeEventListener("keydown", this._handleKeyDown);
    }
  }

  private _createInput(): void {
    // Check if input already exists (slotted)
    let input = this.querySelector("input");

    if (!input) {
      input = document.createElement("input");
      input.type = "text";
      input.className = "ds-command-input__field";
      this.appendChild(input);
    }

    this._input = input;
    this._input.placeholder = this.placeholder;
    this._input.disabled = this.disabled;
    this._input.value = this.value;
    this._input.setAttribute("role", "combobox");
    this._input.setAttribute("aria-expanded", "true");
    this._input.setAttribute("aria-controls", "");
    this._input.setAttribute("aria-autocomplete", "list");
    this._input.setAttribute("autocomplete", "off");
    this._input.setAttribute("autocorrect", "off");
    this._input.setAttribute("spellcheck", "false");

    this._input.addEventListener("input", this._handleInput);
    this._input.addEventListener("keydown", this._handleKeyDown);
  }

  private _handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.value = target.value;

    emitEvent(this, "command-input", {
      detail: { value: this.value },
    });
  };

  private _handleKeyDown = (event: KeyboardEvent): void => {
    const command = this.closest("ds-command");
    const list = command?.querySelector("ds-command-list") as HTMLElement | null;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        list?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        if (list && "focusLast" in list && typeof (list as unknown as { focusLast: () => void }).focusLast === "function") {
          (list as unknown as { focusLast: () => void }).focusLast();
        }
        break;
      case "Enter": {
        event.preventDefault();
        const activeItem = command?.querySelector(
          "ds-command-item[data-active]"
        ) as HTMLElement | null;
        if (activeItem) {
          activeItem.click();
        }
        break;
      }
      case "Escape":
        event.preventDefault();
        emitEvent(this, "command-escape", { detail: {} });
        break;
    }
  };

  /**
   * Focus the input.
   */
  focus(): void {
    this._input?.focus();
  }

  /**
   * Blur the input.
   */
  blur(): void {
    this._input?.blur();
  }
}
