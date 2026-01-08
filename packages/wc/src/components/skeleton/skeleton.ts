import { type TemplateResult, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export type SkeletonVariant = "text" | "circular" | "rectangular" | "rounded";
export type SkeletonSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SkeletonWidth = "full" | "3/4" | "1/2" | "1/4";
export type SkeletonAnimation = "wave" | "pulse" | "none";

/**
 * Skeleton loading placeholder component.
 *
 * @element ds-skeleton
 *
 * @cssprop --ds-skeleton-bg - Background color
 * @cssprop --ds-skeleton-highlight - Shimmer highlight color
 * @cssprop --ds-skeleton-radius - Border radius
 */
export class DsSkeleton extends DSElement {
  static override styles = [];

  /**
   * Shape variant.
   */
  @property({ type: String, reflect: true })
  variant: SkeletonVariant = "text";

  /**
   * Size preset for height.
   */
  @property({ type: String, reflect: true })
  size?: SkeletonSize;

  /**
   * Width preset.
   */
  @property({ type: String, reflect: true })
  width?: SkeletonWidth;

  /**
   * Custom width (CSS value).
   */
  @property({ type: String, attribute: "custom-width" })
  customWidth = "";

  /**
   * Custom height (CSS value).
   */
  @property({ type: String, attribute: "custom-height" })
  customHeight = "";

  /**
   * Animation type.
   */
  @property({ type: String, reflect: true })
  animation: SkeletonAnimation = "wave";

  /**
   * Accessible label for screen readers.
   */
  @property({ type: String })
  label = "Loading...";

  override render(): TemplateResult {
    const classes = {
      "ds-skeleton": true,
    };

    const styles: Record<string, string> = {};
    if (this.customWidth) {
      styles.width = this.customWidth;
    }
    if (this.customHeight) {
      styles.height = this.customHeight;
    }

    return html`
      <div
        class=${classMap(classes)}
        role="status"
        aria-busy="true"
        aria-label=${this.label}
        data-variant=${this.variant}
        data-size=${this.size || nothing}
        data-width=${!this.customWidth && this.width ? this.width : nothing}
        data-animation=${this.animation}
        ?data-no-animation=${this.animation === "none"}
        style=${Object.keys(styles).length > 0 ? styleMap(styles) : nothing}
      >
        <span class="ds-visually-hidden">${this.label}</span>
      </div>
    `;
  }
}

// Register the component
define("ds-skeleton", DsSkeleton);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-skeleton": DsSkeleton;
  }
}
