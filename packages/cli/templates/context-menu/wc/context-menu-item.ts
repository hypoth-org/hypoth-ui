/**
 * ContextMenuItem component - selectable context menu item.
 *
 * @element ds-context-menu-item
 *
 * @slot - Item content
 *
 * @fires ds:select - Fired when item is selected
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export type ContextMenuItemVariant = "default" | "destructive";

export class DsContextMenuItem extends DSElement {
  /** Value for selection events */
  @property()
  value = "";

  /** Visual variant */
  @property({ reflect: true })
  variant: ContextMenuItemVariant = "default";

  /** Disabled state */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute("role", "menuitem");
    this.setAttribute("tabindex", "-1");

    this.addEventListener("click", this.handleSelect);
    this.addEventListener("keydown", this.handleKeyDown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleSelect);
    this.removeEventListener("keydown", this.handleKeyDown);
  }

  private handleSelect = (): void => {
    if (this.disabled) return;

    emitEvent(this, "ds:select", {
      detail: { value: this.value },
      bubbles: true,
    });
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (this.disabled) return;

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleSelect();
    }
  };

  override updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("disabled")) {
      this.setAttribute("aria-disabled", String(this.disabled));
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-context-menu-item", DsContextMenuItem);

declare global {
  interface HTMLElementTagNameMap {
    "ds-context-menu-item": DsContextMenuItem;
  }
}
