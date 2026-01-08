import { type TemplateResult, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export type TreeSelectionMode = "single" | "multiple" | "none";
export type TreeSize = "default" | "compact";

/**
 * Tree root component for hierarchical data display.
 *
 * @element ds-tree
 *
 * @slot - TreeItem elements
 *
 * @fires ds-selection-change - When selection changes
 *
 * @cssprop --ds-tree-indent - Indentation for nested items
 */
export class DsTree extends DSElement {
  static override styles = [];

  /**
   * Selection mode.
   */
  @property({ type: String, attribute: "selection-mode", reflect: true })
  selectionMode: TreeSelectionMode = "single";

  /**
   * Size variant.
   */
  @property({ type: String, reflect: true })
  size: TreeSize = "default";

  /**
   * Show connecting lines.
   */
  @property({ type: Boolean, reflect: true })
  lines = false;

  /**
   * Accessible label.
   */
  @property({ type: String })
  label = "Tree";

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
      "ds-tree": true,
    };

    return html`
      <ul
        class=${classMap(classes)}
        role="tree"
        aria-label=${this.label}
        aria-multiselectable=${this.selectionMode === "multiple" ? "true" : nothing}
        data-size=${this.size !== "default" ? this.size : nothing}
        ?data-lines=${this.lines}
      >
        <slot></slot>
      </ul>
    `;
  }
}

// Register the component
define("ds-tree", DsTree);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-tree": DsTree;
  }
}
