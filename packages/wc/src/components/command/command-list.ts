import { DSElement } from "../../base/ds-element.js";
import { createRovingFocus } from "@ds/primitives-dom";

/**
 * Command palette list component - contains command items with keyboard navigation.
 *
 * @element ds-command-list
 * @slot - Command items and groups
 *
 * @example
 * ```html
 * <ds-command-list>
 *   <ds-command-item value="copy">Copy</ds-command-item>
 *   <ds-command-item value="paste">Paste</ds-command-item>
 * </ds-command-list>
 * ```
 */
export class DsCommandList extends DSElement {
  private _rovingFocus: ReturnType<typeof createRovingFocus> | null = null;
  private _observer: MutationObserver | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "listbox");
    this.tabIndex = -1;

    this._setupRovingFocus();
    this._setupMutationObserver();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._rovingFocus?.destroy();
    this._observer?.disconnect();
  }

  private _setupMutationObserver(): void {
    this._observer = new MutationObserver(() => {
      // Re-setup roving focus when items change
      this._rovingFocus?.destroy();
      this._setupRovingFocus();
    });

    this._observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-filtered", "disabled"],
    });
  }

  private _setupRovingFocus(): void {
    const items = this._getVisibleItems();

    if (items.length === 0) return;

    this._rovingFocus = createRovingFocus({
      container: this,
      selector: "ds-command-item:not([data-filtered]):not([disabled])",
      direction: "vertical",
      loop: true,
      onFocus: (item: HTMLElement) => {
        // Update active state for styling
        this._getVisibleItems().forEach((i) => i.removeAttribute("data-active"));
        item.setAttribute("data-active", "true");
      },
    });
  }

  private _getVisibleItems(): HTMLElement[] {
    return Array.from(
      this.querySelectorAll(
        "ds-command-item:not([data-filtered]):not([disabled])"
      )
    ) as HTMLElement[];
  }

  /**
   * Focus the first visible item.
   */
  focus(): void {
    const items = this._getVisibleItems();
    if (items.length > 0) {
      const firstItem = items[0];
      if (firstItem) {
        firstItem.focus();
        firstItem.setAttribute("data-active", "true");
      }
    }
  }

  /**
   * Focus the last visible item.
   */
  focusLast(): void {
    const items = this._getVisibleItems();
    if (items.length > 0) {
      const lastItem = items[items.length - 1];
      if (lastItem) {
        lastItem.focus();
        lastItem.setAttribute("data-active", "true");
      }
    }
  }
}
