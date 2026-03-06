/**
 * Separator component - visual divider between content sections.
 *
 * @element ds-separator
 *
 * @example
 * ```html
 * <ds-separator></ds-separator>
 * <ds-separator orientation="vertical"></ds-separator>
 * <ds-separator decorative></ds-separator>
 * ```
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export type SeparatorOrientation = "horizontal" | "vertical";

export class DsSeparator extends DSElement {
  /** Visual orientation of the separator */
  @property({ reflect: true })
  orientation: SeparatorOrientation = "horizontal";

  /** Whether the separator is purely decorative (no semantic meaning) */
  @property({ type: Boolean, reflect: true })
  decorative = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.updateAccessibility();
  }

  override updated(): void {
    this.updateAccessibility();
  }

  private updateAccessibility(): void {
    if (this.decorative) {
      this.setAttribute("role", "none");
      this.removeAttribute("aria-orientation");
    } else {
      this.setAttribute("role", "separator");
      this.setAttribute("aria-orientation", this.orientation);
    }
  }

  override render() {
    return html``;
  }
}

define("ds-separator", DsSeparator);

declare global {
  interface HTMLElementTagNameMap {
    "ds-separator": DsSeparator;
  }
}
