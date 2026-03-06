import { type TemplateResult, html } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export type SpinnerSize = "sm" | "md" | "lg";

/**
 * A loading spinner component with accessibility support.
 *
 * Automatically respects prefers-reduced-motion by replacing
 * rotation with an opacity pulse animation.
 *
 * @element ds-spinner
 *
 * @example
 * ```html
 * <ds-spinner label="Loading content"></ds-spinner>
 * ```
 *
 * @example
 * ```html
 * <!-- In a loading region -->
 * <div aria-busy="true">
 *   <ds-spinner label="Fetching data"></ds-spinner>
 * </div>
 * ```
 */
export class DsSpinner extends DSElement {
  static override styles = [];

  /**
   * The spinner size.
   */
  @property({ type: String, reflect: true })
  size: SpinnerSize = "md";

  /**
   * Accessible label for the spinner.
   * Announced by screen readers to indicate loading state.
   */
  @property({ type: String })
  label = "Loading";

  override render(): TemplateResult {
    const classes = {
      "ds-spinner": true,
      [`ds-spinner--${this.size}`]: true,
    };

    return html`
      <span
        class=${classMap(classes)}
        role="status"
        aria-label=${this.label}
      ></span>
    `;
  }
}

// Register the component
define("ds-spinner", DsSpinner);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-spinner": DsSpinner;
  }
}
