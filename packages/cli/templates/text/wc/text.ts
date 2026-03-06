import type { TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { html as staticHtml, unsafeStatic } from "lit/static-html.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export type TextSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type TextWeight = "normal" | "medium" | "semibold" | "bold";
export type TextVariant = "default" | "muted" | "success" | "warning" | "error";
export type TextAs = "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const VALID_AS_VALUES = new Set<string>(["span", "p", "h1", "h2", "h3", "h4", "h5", "h6"]);

/**
 * A typography component for consistent text styling.
 *
 * @element ds-text
 * @slot - Default slot for text content
 */
export class DsText extends DSElement {
  static override styles = [];

  /**
   * The text size.
   */
  @property({ type: String, reflect: true })
  size: TextSize = "md";

  /**
   * The font weight.
   */
  @property({ type: String, reflect: true })
  weight: TextWeight = "normal";

  /**
   * The color variant.
   */
  @property({ type: String, reflect: true })
  variant: TextVariant = "default";

  /**
   * The semantic element to render as.
   * Supports: span, p, h1-h6
   */
  @property({ type: String, reflect: true })
  as: TextAs = "span";

  /**
   * Whether to truncate text with ellipsis.
   */
  @property({ type: Boolean, reflect: true })
  truncate = false;

  private getValidAs(): TextAs {
    if (VALID_AS_VALUES.has(this.as)) {
      return this.as;
    }

    console.warn(
      `[ds-text] Invalid "as" value "${this.as}". Expected one of: ${Array.from(VALID_AS_VALUES).join(", ")}. Falling back to "span".`
    );
    return "span";
  }

  override render(): TemplateResult {
    const validAs = this.getValidAs();
    const tag = unsafeStatic(validAs);

    const classes = {
      "ds-text": true,
      [`ds-text--${this.size}`]: true,
      [`ds-text--${this.weight}`]: true,
      [`ds-text--${this.variant}`]: true,
      "ds-text--truncate": this.truncate,
    };

    return staticHtml`
      <${tag} class=${classMap(classes)}>
        <slot></slot>
      </${tag}>
    `;
  }
}

// Register the component
define("ds-text", DsText);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-text": DsText;
  }
}
