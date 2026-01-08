import { type TemplateResult, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export type BadgeVariant =
  | "neutral"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";
export type BadgeSize = "sm" | "md" | "lg";
export type BadgePosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

/**
 * Badge component for counts, notifications, and status indicators.
 *
 * @element ds-badge
 *
 * @cssprop --ds-badge-bg - Background color
 * @cssprop --ds-badge-color - Text color
 */
export class DsBadge extends DSElement {
  static override styles = [];

  /**
   * Badge content/count.
   */
  @property({ type: String })
  content = "";

  /**
   * Maximum count to show. Displays "{max}+" if exceeded.
   */
  @property({ type: Number })
  max?: number;

  /**
   * Color variant.
   */
  @property({ type: String, reflect: true })
  variant: BadgeVariant = "primary";

  /**
   * Size variant.
   */
  @property({ type: String, reflect: true })
  size: BadgeSize = "md";

  /**
   * Use outline style.
   */
  @property({ type: Boolean, reflect: true })
  outline = false;

  /**
   * Show as dot (no content).
   */
  @property({ type: Boolean, reflect: true })
  dot = false;

  /**
   * Position when used in wrapper.
   */
  @property({ type: String, reflect: true })
  position: BadgePosition = "top-right";

  /**
   * Show pulse animation.
   */
  @property({ type: Boolean, reflect: true })
  pulse = false;

  private get displayContent(): string {
    if (this.dot) return "";
    if (this.max !== undefined && !Number.isNaN(Number(this.content))) {
      const count = Number(this.content);
      if (count > this.max) {
        return `${this.max}+`;
      }
    }
    return this.content;
  }

  override render(): TemplateResult {
    const classes = {
      "ds-badge": true,
    };

    return html`
      <span
        class=${classMap(classes)}
        role="status"
        data-variant=${this.variant}
        data-size=${this.size !== "md" ? this.size : nothing}
        ?data-outline=${this.outline}
        ?data-dot=${this.dot}
        data-position=${this.position}
        ?data-pulse=${this.pulse}
        aria-label=${this.dot
          ? "Notification indicator"
          : `${this.displayContent} notifications`}
      >
        ${this.dot ? nothing : this.displayContent}
      </span>
    `;
  }
}

// Register the component
define("ds-badge", DsBadge);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-badge": DsBadge;
  }
}
