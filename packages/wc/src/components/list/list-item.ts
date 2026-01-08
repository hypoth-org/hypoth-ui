import { type TemplateResult, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import { emitEvent } from "../../events/emit.js";
import type { DsList } from "./list.js";

/**
 * List item component for collection items.
 *
 * @element ds-list-item
 *
 * @slot - Item content
 * @slot leading - Optional leading element (icon, avatar)
 * @slot secondary - Optional secondary text
 * @slot trailing - Optional trailing element (action, badge)
 *
 * @fires ds-select - When item is selected
 * @fires ds-activate - When item is activated (Enter/double-click)
 */
export class DsListItem extends DSElement {
  static override styles = [];

  /**
   * Unique item ID.
   */
  @property({ type: String, attribute: "item-id" })
  itemId = "";

  /**
   * Whether item is selected.
   */
  @property({ type: Boolean, reflect: true })
  selected = false;

  /**
   * Whether item is disabled.
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Value for identification.
   */
  @property({ type: String })
  value = "";

  private get listRoot(): DsList | null {
    return this.closest("ds-list") as DsList | null;
  }

  private handleClick(): void {
    if (this.disabled) return;

    const list = this.listRoot;
    if (list) {
      list.handleItemSelect(this.itemId || this.value);
      this.selected = list.isItemSelected(this.itemId || this.value);
    }

    emitEvent(this, "select", {
      detail: {
        itemId: this.itemId,
        value: this.value,
        selected: this.selected,
      },
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleClick();

      if (event.key === "Enter") {
        emitEvent(this, "activate", {
          detail: {
            itemId: this.itemId,
            value: this.value,
          },
        });
      }
    }
  }

  override render(): TemplateResult {
    const classes = {
      "ds-list-item": true,
    };

    return html`
      <li
        class=${classMap(classes)}
        role="option"
        tabindex=${this.disabled ? -1 : 0}
        aria-selected=${this.selected ? "true" : "false"}
        ?data-selected=${this.selected}
        ?data-disabled=${this.disabled}
        aria-disabled=${this.disabled ? "true" : nothing}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
      >
        <slot name="leading"></slot>
        <div class="ds-list-item__content">
          <span class="ds-list-item__primary">
            <slot></slot>
          </span>
          <slot name="secondary"></slot>
        </div>
        <slot name="trailing"></slot>
      </li>
    `;
  }
}

// Register the component
define("ds-list-item", DsListItem);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-list-item": DsListItem;
  }
}
