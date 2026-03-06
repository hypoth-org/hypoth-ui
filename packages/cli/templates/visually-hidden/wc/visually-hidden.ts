import { type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

/**
 * A utility component that hides content visually while keeping it accessible to screen readers.
 *
 * Use this component to provide additional context for assistive technology users
 * that would be redundant or unnecessary for sighted users.
 *
 * @element ds-visually-hidden
 * @slot - Content to be hidden visually but announced by screen readers
 *
 * @example
 * ```html
 * <button>
 *   <ds-icon name="trash" aria-hidden="true"></ds-icon>
 *   <ds-visually-hidden>Delete item</ds-visually-hidden>
 * </button>
 * ```
 *
 * @example
 * ```html
 * <!-- Skip link that becomes visible on focus -->
 * <ds-visually-hidden focusable>
 *   <a href="#main-content">Skip to main content</a>
 * </ds-visually-hidden>
 * ```
 */
export class DsVisuallyHidden extends DSElement {
  static override styles = [];

  /**
   * When true, the content becomes visible when it or its children receive focus.
   * Useful for skip links and other focus-triggered content.
   */
  @property({ type: Boolean, reflect: true })
  focusable = false;

  override render(): TemplateResult {
    const classes = {
      "ds-visually-hidden": true,
      "ds-visually-hidden--focusable": this.focusable,
    };

    return html`
      <span class=${classMap(classes)}>
        <slot></slot>
      </span>
    `;
  }
}

// Register the component
define("ds-visually-hidden", DsVisuallyHidden);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-visually-hidden": DsVisuallyHidden;
  }
}
