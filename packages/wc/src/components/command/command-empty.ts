import { DSElement } from "../../base/ds-element.js";

/**
 * Command palette empty state component - shown when no results match the search.
 *
 * @element ds-command-empty
 * @slot - Empty state content
 *
 * @example
 * ```html
 * <ds-command-empty>
 *   No results found.
 * </ds-command-empty>
 * ```
 */
export class DsCommandEmpty extends DSElement {
  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "status");
    this.setAttribute("aria-live", "polite");
    // Start hidden - ds-command will show when needed
    this.setAttribute("hidden", "");
  }
}
