import { type TemplateResult, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import { getIconSvg, hasIcon } from "./icon-adapter.js";

export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Size mappings in pixels for SVG generation
 */
const SIZE_MAP: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

/**
 * An accessible icon component with Lucide integration.
 *
 * @element ds-icon
 *
 * @example
 * ```html
 * <!-- Decorative icon (hidden from screen readers) -->
 * <ds-icon name="search"></ds-icon>
 *
 * <!-- Meaningful icon (announced to screen readers) -->
 * <ds-icon name="alert-triangle" label="Warning"></ds-icon>
 * ```
 */
export class DsIcon extends DSElement {
  static override styles = [];

  /**
   * The icon name from Lucide library (kebab-case).
   * e.g., "search", "arrow-right", "external-link"
   */
  @property({ type: String, reflect: true })
  name = "";

  /**
   * The icon size.
   */
  @property({ type: String, reflect: true })
  size: IconSize = "md";

  /**
   * Accessible label for meaningful icons.
   * When provided, the icon is announced to screen readers.
   * When omitted, the icon is decorative and hidden from screen readers.
   */
  @property({ type: String })
  label = "";

  /**
   * Custom color for the icon.
   * Accepts any valid CSS color value.
   * Default is currentColor (inherits from text color).
   */
  @property({ type: String })
  color = "";

  /**
   * Cached SVG element
   */
  @state()
  private _svgElement: SVGSVGElement | null = null;

  /**
   * Track if icon is valid
   */
  @state()
  private _isValidIcon = true;

  override willUpdate(changedProperties: Map<string, unknown>): void {
    if (changedProperties.has("name") || changedProperties.has("size")) {
      this.updateSvg();
    }
  }

  private updateSvg(): void {
    if (!this.name) {
      this._svgElement = null;
      this._isValidIcon = false;
      return;
    }

    if (!hasIcon(this.name)) {
      this._svgElement = null;
      this._isValidIcon = false;
      return;
    }

    this._svgElement = getIconSvg(this.name, {
      size: SIZE_MAP[this.size],
    });
    this._isValidIcon = this._svgElement !== null;
  }

  override render(): TemplateResult {
    const isDecorative = !this.label;

    const classes = {
      "ds-icon": true,
      [`ds-icon--${this.size}`]: true,
      "ds-icon--fallback": !this._isValidIcon,
    };

    const style = this.color ? `color: ${this.color}` : "";

    // Render fallback if icon not found
    if (!this._isValidIcon) {
      return html`
        <span
          class=${classMap(classes)}
          style=${style || nothing}
          aria-hidden="true"
        ></span>
      `;
    }

    // Decorative icon (no label)
    if (isDecorative) {
      return html`
        <span
          class=${classMap(classes)}
          style=${style || nothing}
          aria-hidden="true"
        >
          ${this._svgElement}
        </span>
      `;
    }

    // Meaningful icon (with label)
    return html`
      <span
        class=${classMap(classes)}
        style=${style || nothing}
        role="img"
        aria-label=${this.label}
      >
        ${this._svgElement}
      </span>
    `;
  }
}

// Register the component
define("ds-icon", DsIcon);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-icon": DsIcon;
  }
}
