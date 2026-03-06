import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

/**
 * Combobox tag for multi-select mode.
 *
 * @element ds-combobox-tag
 *
 * @slot - Tag content
 *
 * @fires ds:remove - Fired when tag remove button is clicked
 *
 * @example
 * ```html
 * <ds-combobox-tag value="apple">
 *   Apple
 *   <button slot="remove" aria-label="Remove Apple">×</button>
 * </ds-combobox-tag>
 * ```
 */
export class DsComboboxTag extends DSElement {
  /** Value associated with this tag */
  @property({ type: String, reflect: true })
  value = "";

  /** Display label */
  @property({ type: String })
  label = "";

  /** Whether the tag is disabled (can't be removed) */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  override connectedCallback(): void {
    super.connectedCallback();

    // Set ARIA role
    this.setAttribute("role", "listitem");

    // Setup remove button listener
    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleClick);
    this.removeEventListener("keydown", this.handleKeyDown);
  }

  private handleClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    const removeButton = target.closest('[slot="remove"]');
    if (removeButton && !this.disabled) {
      event.stopPropagation();
      this.remove_();
    }
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled) return;

    if (event.key === "Delete" || event.key === "Backspace") {
      event.preventDefault();
      this.remove_();
    }
  };

  /**
   * Triggers removal of this tag.
   */
  public remove_(): void {
    if (this.disabled) return;
    emitEvent(this, "remove", { detail: { value: this.value } });
  }

  /**
   * Gets the display label for this tag.
   */
  public getLabel(): string {
    return this.label || this.textContent?.trim() || this.value;
  }

  override render() {
    return html`
      <div class="ds-combobox-tag" part="container" aria-label="${this.getLabel()}, press Delete to remove">
        <slot></slot>
        <slot name="remove"></slot>
      </div>
    `;
  }
}

define("ds-combobox-tag", DsComboboxTag);

declare global {
  interface HTMLElementTagNameMap {
    "ds-combobox-tag": DsComboboxTag;
  }
}
