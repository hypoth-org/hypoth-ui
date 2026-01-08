import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";

/**
 * Command palette item component - selectable command/option.
 *
 * @element ds-command-item
 * @slot - Item content
 *
 * @fires ds:command-select - When the item is selected (bubbles to ds-command)
 *
 * @example
 * ```html
 * <ds-command-item value="copy" keywords="duplicate clone">
 *   <ds-icon name="copy"></ds-icon>
 *   Copy
 * </ds-command-item>
 * ```
 */
export class DsCommandItem extends DSElement {
  /**
   * Value to emit when selected.
   */
  @property({ type: String })
  value = "";

  /**
   * Additional keywords for fuzzy search (space-separated).
   */
  @property({ type: String })
  keywords = "";

  /**
   * Whether the item is disabled.
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "option");
    this.tabIndex = -1;

    if (this.disabled) {
      this.setAttribute("aria-disabled", "true");
    }

    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", this._handleKeyDown);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", this._handleKeyDown);
  }

  private _handleClick = (): void => {
    if (this.disabled) return;
    this._select();
  };

  private _handleKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this._select();
    }
  };

  private _select(): void {
    emitEvent(this, "command-select", {
      detail: { value: this.value || this.textContent?.trim() || "" },
    });
  }
}
