import { property, state } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { emitEvent } from "../../events/emit.js";

/**
 * Command palette root component - provides search-based command/option selection.
 *
 * @element ds-command
 * @slot - Command children (input, list, etc.)
 *
 * @fires ds:value-change - When the input value changes
 * @fires ds:select - When an item is selected
 *
 * @example
 * ```html
 * <ds-command>
 *   <ds-command-input placeholder="Search commands..."></ds-command-input>
 *   <ds-command-list>
 *     <ds-command-group heading="Actions">
 *       <ds-command-item value="copy">Copy</ds-command-item>
 *       <ds-command-item value="paste">Paste</ds-command-item>
 *     </ds-command-group>
 *   </ds-command-list>
 * </ds-command>
 * ```
 */
export class DsCommand extends DSElement {
  /**
   * Current search/filter value.
   */
  @property({ type: String })
  value = "";

  /**
   * Whether the command palette is in a loading state.
   */
  @property({ type: Boolean, reflect: true })
  loading = false;

  /**
   * Whether to use built-in fuzzy filtering.
   * When false, filtering must be handled externally.
   */
  @property({ type: Boolean, attribute: "filter" })
  filter = true;

  /**
   * Label for accessibility.
   */
  @property({ type: String })
  label = "Command palette";

  /**
   * Tracks visible item count after filtering.
   */
  @state()
  private _visibleCount = 0;

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "search");
    this.setAttribute("aria-label", this.label);

    this.addEventListener("ds:command-input", this._handleInputChange);
    this.addEventListener("ds:command-select", this._handleSelect);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("ds:command-input", this._handleInputChange);
    this.removeEventListener("ds:command-select", this._handleSelect);
  }

  private _handleInputChange = (event: Event): void => {
    const e = event as CustomEvent<{ value: string }>;
    this.value = e.detail.value;

    if (this.filter) {
      this._filterItems(this.value);
    }

    emitEvent(this, "value-change", { detail: { value: this.value } });
  };

  private _handleSelect = (event: Event): void => {
    const e = event as CustomEvent<{ value: string }>;
    emitEvent(this, "select", { detail: { value: e.detail.value } });
  };

  private _filterItems(query: string): void {
    const normalizedQuery = query.toLowerCase().trim();
    const items = this.querySelectorAll("ds-command-item");
    let visibleCount = 0;

    items.forEach((item) => {
      const text = item.textContent?.toLowerCase() || "";
      const value = item.getAttribute("value")?.toLowerCase() || "";
      const keywords = item.getAttribute("keywords")?.toLowerCase() || "";

      const matches =
        normalizedQuery === "" ||
        this._fuzzyMatch(normalizedQuery, text) ||
        this._fuzzyMatch(normalizedQuery, value) ||
        this._fuzzyMatch(normalizedQuery, keywords);

      if (matches) {
        item.removeAttribute("data-filtered");
        visibleCount++;
      } else {
        item.setAttribute("data-filtered", "true");
      }
    });

    this._visibleCount = visibleCount;
    this._updateGroupVisibility();
    this._updateEmptyState();
  }

  private _fuzzyMatch(query: string, text: string): boolean {
    if (!query) return true;
    if (!text) return false;

    // Simple fuzzy matching - characters must appear in order
    let queryIndex = 0;
    for (let i = 0; i < text.length && queryIndex < query.length; i++) {
      if (text[i] === query[queryIndex]) {
        queryIndex++;
      }
    }
    return queryIndex === query.length;
  }

  private _updateGroupVisibility(): void {
    const groups = this.querySelectorAll("ds-command-group");
    groups.forEach((group) => {
      const visibleItems = group.querySelectorAll(
        "ds-command-item:not([data-filtered])"
      );
      if (visibleItems.length === 0) {
        group.setAttribute("data-empty", "true");
      } else {
        group.removeAttribute("data-empty");
      }
    });
  }

  private _updateEmptyState(): void {
    const emptyEl = this.querySelector("ds-command-empty");
    if (emptyEl) {
      if (this._visibleCount === 0 && this.value) {
        emptyEl.removeAttribute("hidden");
      } else {
        emptyEl.setAttribute("hidden", "");
      }
    }
  }

  /**
   * Programmatically set the search value.
   */
  setValue(value: string): void {
    this.value = value;
    const input = this.querySelector("ds-command-input");
    if (input) {
      (input as HTMLElement & { value: string }).value = value;
    }
    if (this.filter) {
      this._filterItems(value);
    }
  }

  /**
   * Clear the search value.
   */
  clear(): void {
    this.setValue("");
  }
}
