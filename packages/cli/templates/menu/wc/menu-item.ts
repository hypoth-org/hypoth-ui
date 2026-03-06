import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

/**
 * Menu item with role="menuitem".
 *
 * @element ds-menu-item
 *
 * @slot - Item content (text, icon, etc.)
 *
 * @fires ds:select - Fired when item is selected via click, Enter, or Space
 *
 * @example
 * ```html
 * <ds-menu-item value="edit">Edit</ds-menu-item>
 * <ds-menu-item value="delete" disabled>Delete</ds-menu-item>
 * ```
 */
export class DsMenuItem extends DSElement {
  /** Whether the item is disabled */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /** Value associated with this item (used in ds:select event) */
  @property({ type: String })
  value = "";

  override connectedCallback(): void {
    super.connectedCallback();

    // Set ARIA role
    this.setAttribute("role", "menuitem");

    // Set tabIndex for roving focus (will be managed by parent)
    this.tabIndex = -1;

    // Update aria-disabled
    this.updateAriaDisabled();

    // Listen for activation
    this.addEventListener("click", this.handleClick);
    this.addEventListener("keydown", this.handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleClick);
    this.removeEventListener("keydown", this.handleKeyDown);
  }

  private updateAriaDisabled(): void {
    if (this.disabled) {
      this.setAttribute("aria-disabled", "true");
    } else {
      this.removeAttribute("aria-disabled");
    }
  }

  private handleClick = (): void => {
    this.select();
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.select();
    }
  };

  /**
   * Triggers selection of this item.
   * Emits ds:select event and notifies parent menu to close.
   */
  public select(): void {
    if (this.disabled) return;

    // Get value from attribute or text content
    const value = this.value || this.textContent?.trim() || "";

    emitEvent(this, "select", { detail: { value } });
  }

  override updated(changedProperties: Map<string, unknown>): void {
    super.updated(changedProperties);

    if (changedProperties.has("disabled")) {
      this.updateAriaDisabled();
    }
  }

  override render() {
    return html`
      <div class="ds-menu-item" part="container">
        <slot></slot>
      </div>
    `;
  }
}

define("ds-menu-item", DsMenuItem);

declare global {
  interface HTMLElementTagNameMap {
    "ds-menu-item": DsMenuItem;
  }
}
