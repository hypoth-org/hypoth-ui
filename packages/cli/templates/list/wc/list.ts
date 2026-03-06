import { type TemplateResult, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export type ListSelectionMode = "single" | "multiple" | "none";
export type ListOrientation = "vertical" | "horizontal";
export type ListSize = "default" | "compact" | "spacious";

/**
 * List root component for collection display.
 *
 * @element ds-list
 *
 * @slot - ListItem elements
 *
 * @fires ds-selection-change - When selection changes
 *
 * @cssprop --ds-list-gap - Gap between items
 */
export class DsList extends DSElement {
  static override styles = [];

  /**
   * Selection mode.
   */
  @property({ type: String, attribute: "selection-mode", reflect: true })
  selectionMode: ListSelectionMode = "single";

  /**
   * List orientation.
   */
  @property({ type: String, reflect: true })
  orientation: ListOrientation = "vertical";

  /**
   * Size variant.
   */
  @property({ type: String, reflect: true })
  size: ListSize = "default";

  /**
   * Show border around list.
   */
  @property({ type: Boolean, reflect: true })
  bordered = false;

  /**
   * Accessible label.
   */
  @property({ type: String })
  label = "List";

  @state()
  private selectedItems: Set<string> = new Set();

  handleItemSelect(itemId: string): void {
    if (this.selectionMode === "none") return;

    if (this.selectionMode === "single") {
      this.selectedItems.clear();
      this.selectedItems.add(itemId);
    } else {
      if (this.selectedItems.has(itemId)) {
        this.selectedItems.delete(itemId);
      } else {
        this.selectedItems.add(itemId);
      }
    }

    emitEvent(this, "selection-change", {
      detail: { selectedItems: Array.from(this.selectedItems) },
    });

    this.requestUpdate();
  }

  isItemSelected(itemId: string): boolean {
    return this.selectedItems.has(itemId);
  }

  override render(): TemplateResult {
    const classes = {
      "ds-list": true,
    };

    return html`
      <ul
        class=${classMap(classes)}
        role="listbox"
        aria-label=${this.label}
        aria-multiselectable=${this.selectionMode === "multiple" ? "true" : nothing}
        aria-orientation=${this.orientation}
        data-size=${this.size !== "default" ? this.size : nothing}
        data-orientation=${this.orientation !== "vertical" ? this.orientation : nothing}
        ?data-bordered=${this.bordered}
      >
        <slot></slot>
      </ul>
    `;
  }
}

// Register the component
define("ds-list", DsList);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-list": DsList;
  }
}
