import { DSElement } from "../../base/ds-element.js";

/**
 * Command palette loading state component - shown when loading async results.
 *
 * @element ds-command-loading
 * @slot - Loading state content (e.g., spinner)
 *
 * @example
 * ```html
 * <ds-command-loading>
 *   <ds-spinner size="sm"></ds-spinner>
 *   Loading...
 * </ds-command-loading>
 * ```
 */
export class DsCommandLoading extends DSElement {
  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "status");
    this.setAttribute("aria-live", "polite");
    this.setAttribute("aria-label", "Loading");
  }
}
