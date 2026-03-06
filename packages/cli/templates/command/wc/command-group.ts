import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";

/**
 * Command palette group component - groups related command items with a heading.
 *
 * @element ds-command-group
 * @slot - Command items
 *
 * @example
 * ```html
 * <ds-command-group heading="Actions">
 *   <ds-command-item value="copy">Copy</ds-command-item>
 *   <ds-command-item value="paste">Paste</ds-command-item>
 * </ds-command-group>
 * ```
 */
export class DsCommandGroup extends DSElement {
  /**
   * Heading text for the group.
   */
  @property({ type: String })
  heading = "";

  private _headingEl: HTMLDivElement | null = null;

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute("role", "group");

    if (this.heading) {
      this._createHeading();
    }
  }

  updated(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("heading")) {
      if (this.heading) {
        this._createHeading();
      } else if (this._headingEl) {
        this._headingEl.remove();
        this._headingEl = null;
        this.removeAttribute("aria-labelledby");
      }
    }
  }

  private _createHeading(): void {
    if (!this._headingEl) {
      this._headingEl = document.createElement("div");
      this._headingEl.className = "ds-command-group__heading";
      this._headingEl.id = `ds-command-group-${Math.random().toString(36).slice(2, 9)}`;
      this._headingEl.setAttribute("aria-hidden", "true");
      this.prepend(this._headingEl);
      this.setAttribute("aria-labelledby", this._headingEl.id);
    }

    this._headingEl.textContent = this.heading;
  }
}
