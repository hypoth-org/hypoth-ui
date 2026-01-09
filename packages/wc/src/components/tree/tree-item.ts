import { type TemplateResult, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";
import type { DsTree } from "./tree.js";
import { calculateTreeItemPosition } from "./tree-utils.js";

// Chevron icon
const chevronIcon = html`
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
    <path d="M9 18l6-6-6-6" />
  </svg>
`;

/**
 * Tree item component for hierarchical nodes.
 *
 * @element ds-tree-item
 *
 * @slot - Item content (label)
 * @slot icon - Optional leading icon
 * @slot children - Nested TreeItem elements
 *
 * @fires ds-expand - When expand state changes
 * @fires ds-select - When item is selected
 * @fires ds-activate - When item is activated (Enter/double-click)
 */
export class DsTreeItem extends DSElement {
  static override styles = [];

  /**
   * Unique item ID.
   */
  @property({ type: String, attribute: "item-id" })
  itemId = "";

  /**
   * Whether item is expanded.
   */
  @property({ type: Boolean, reflect: true })
  expanded = false;

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
   * Whether this item is loading (e.g., fetching children).
   * Can be set directly or inherited from tree's loadingNodes.
   */
  @property({ type: Boolean, reflect: true })
  loading = false;

  @state()
  private hasChildren = false;

  @state()
  private _level = 1;

  @state()
  private _setSize = 1;

  @state()
  private _posInSet = 1;

  private get treeRoot(): DsTree | null {
    return this.closest("ds-tree") as DsTree | null;
  }

  /**
   * Returns true if this item is loading (either directly or via tree's loadingNodes).
   */
  private get isLoading(): boolean {
    if (this.loading) return true;
    const tree = this.treeRoot;
    if (tree && this.itemId) {
      return tree.isNodeLoading(this.itemId);
    }
    return false;
  }

  /**
   * Returns true if the tree root is in a loading state.
   */
  private get isTreeLoading(): boolean {
    return this.treeRoot?.loading ?? false;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.updateHasChildren();
    // Calculate position after DOM is ready
    requestAnimationFrame(() => {
      this.updateAriaPosition();
    });
  }

  /**
   * Update ARIA position attributes for APG compliance.
   * Provides screen readers with context like "Item 3 of 5, level 2".
   */
  private updateAriaPosition(): void {
    const position = calculateTreeItemPosition(this as unknown as HTMLElement);
    this._level = position.level;
    this._setSize = position.setSize;
    this._posInSet = position.posInSet;
  }

  private updateHasChildren(): void {
    const childrenSlot = this.querySelector("[slot=children]");
    this.hasChildren = childrenSlot !== null && childrenSlot.querySelector("ds-tree-item") !== null;
  }

  private handleExpandClick(event: Event): void {
    event.stopPropagation();
    if (this.disabled || this.isTreeLoading || this.isLoading || !this.hasChildren) return;

    this.expanded = !this.expanded;
    emitEvent(this, "expand", {
      detail: {
        itemId: this.itemId,
        expanded: this.expanded,
      },
    });
  }

  private handleContentClick(): void {
    if (this.disabled || this.isTreeLoading) return;

    const tree = this.treeRoot;
    if (tree) {
      tree.handleItemSelect(this.itemId);
      this.selected = tree.isItemSelected(this.itemId);
    }

    emitEvent(this, "select", {
      detail: {
        itemId: this.itemId,
        selected: this.selected,
      },
    });
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (this.disabled || this.isTreeLoading) return;

    switch (event.key) {
      case "ArrowRight":
        if (this.hasChildren && !this.expanded) {
          event.preventDefault();
          this.expanded = true;
          emitEvent(this, "expand", {
            detail: {
              itemId: this.itemId,
              expanded: true,
            },
          });
        }
        break;

      case "ArrowLeft":
        if (this.hasChildren && this.expanded) {
          event.preventDefault();
          this.expanded = false;
          emitEvent(this, "expand", {
            detail: {
              itemId: this.itemId,
              expanded: false,
            },
          });
        }
        break;

      case "Enter":
        event.preventDefault();
        emitEvent(this, "activate", { detail: { itemId: this.itemId } });
        break;

      case " ":
        event.preventDefault();
        this.handleContentClick();
        break;
    }
  }

  override render(): TemplateResult {
    const classes = {
      "ds-tree-item": true,
    };

    // Check for children via slot
    this.updateHasChildren();

    const itemLoading = this.isLoading;

    return html`
      <li
        class=${classMap(classes)}
        role="treeitem"
        aria-expanded=${this.hasChildren ? (this.expanded ? "true" : "false") : nothing}
        aria-selected=${this.selected ? "true" : "false"}
        aria-busy=${itemLoading ? "true" : nothing}
        aria-level=${this._level}
        aria-setsize=${this._setSize}
        aria-posinset=${this._posInSet}
        ?data-expanded=${this.expanded}
        ?data-selected=${this.selected}
        ?data-disabled=${this.disabled}
        ?data-loading=${itemLoading}
      >
        <div
          class="ds-tree-item__content"
          tabindex=${this.disabled ? -1 : 0}
          @click=${this.handleContentClick}
          @keydown=${this.handleKeyDown}
        >
          ${
            this.hasChildren
              ? html`
                <button
                  type="button"
                  class="ds-tree-item__expand"
                  aria-label=${this.expanded ? "Collapse" : "Expand"}
                  tabindex="-1"
                  @click=${this.handleExpandClick}
                >
                  ${chevronIcon}
                </button>
              `
              : html`<span class="ds-tree-item__spacer"></span>`
          }
          <slot name="icon"></slot>
          <span class="ds-tree-item__label">
            <slot></slot>
          </span>
        </div>
        ${
          this.hasChildren
            ? html`
              <ul
                class="ds-tree-item__children ds-tree"
                role="group"
                ?hidden=${!this.expanded}
              >
                <slot name="children" @slotchange=${this.updateHasChildren}></slot>
              </ul>
            `
            : nothing
        }
      </li>
    `;
  }
}

// Register the component
define("ds-tree-item", DsTreeItem);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-tree-item": DsTreeItem;
  }
}
