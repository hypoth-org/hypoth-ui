import { DSElement } from "../../base/ds-element.js";

/**
 * Command palette separator component - visual divider between items/groups.
 *
 * @element ds-command-separator
 *
 * @example
 * ```html
 * <ds-command-list>
 *   <ds-command-item value="copy">Copy</ds-command-item>
 *   <ds-command-separator></ds-command-separator>
 *   <ds-command-item value="delete">Delete</ds-command-item>
 * </ds-command-list>
 * ```
 */
export class DsCommandSeparator extends DSElement {
  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "separator");
    this.setAttribute("aria-orientation", "horizontal");
  }
}
