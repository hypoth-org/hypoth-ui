import { type TemplateResult, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
export type AvatarShape = "circle" | "square";
export type AvatarStatus = "online" | "offline" | "away" | "busy";

// Default user icon SVG
const defaultUserIcon = html`
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
`;

/**
 * Avatar component for user representation.
 *
 * @element ds-avatar
 *
 * @csspart image - The avatar image element
 * @csspart initials - The initials fallback element
 * @csspart icon - The icon fallback element
 * @csspart status - The status indicator element
 *
 * @cssprop --ds-avatar-size - Avatar dimensions
 * @cssprop --ds-avatar-radius - Border radius
 * @cssprop --ds-avatar-bg - Background color for fallback
 * @cssprop --ds-avatar-color - Text color for initials/icon
 */
export class DsAvatar extends DSElement {
  static override styles = [];

  /**
   * Image source URL.
   */
  @property({ type: String })
  src = "";

  /**
   * Alt text for image.
   */
  @property({ type: String })
  alt = "";

  /**
   * User's name (used for initials fallback).
   */
  @property({ type: String })
  name = "";

  /**
   * Size variant.
   */
  @property({ type: String, reflect: true })
  size: AvatarSize = "md";

  /**
   * Shape variant.
   */
  @property({ type: String, reflect: true })
  shape: AvatarShape = "circle";

  /**
   * Status indicator.
   */
  @property({ type: String })
  status?: AvatarStatus;

  /**
   * Whether to show status indicator.
   */
  @property({ type: Boolean, attribute: "show-status" })
  showStatus = false;

  @state()
  private imageError = false;

  private get initials(): string {
    if (!this.name) return "";

    const names = this.name.trim().split(/\s+/);
    if (names.length === 0) return "";
    if (names.length === 1) {
      return (names[0] ?? "").charAt(0).toUpperCase();
    }
    const first = names[0] ?? "";
    const last = names[names.length - 1] ?? "";
    return (first.charAt(0) + last.charAt(0)).toUpperCase();
  }

  private get showImage(): boolean {
    return Boolean(this.src && !this.imageError);
  }

  private get showInitials(): boolean {
    return !this.showImage && Boolean(this.initials);
  }

  private get showIcon(): boolean {
    return !this.showImage && !this.showInitials;
  }

  private handleImageError(): void {
    this.imageError = true;
  }

  private handleImageLoad(): void {
    this.imageError = false;
  }

  override render(): TemplateResult {
    const classes = {
      "ds-avatar": true,
    };

    return html`
      <span
        class=${classMap(classes)}
        role="img"
        aria-label=${this.alt || this.name || "Avatar"}
        data-size=${this.size}
        data-shape=${this.shape !== "circle" ? this.shape : nothing}
      >
        ${this.showImage
          ? html`
              <img
                part="image"
                class="ds-avatar__image"
                src=${this.src}
                alt=""
                @error=${this.handleImageError}
                @load=${this.handleImageLoad}
              />
            `
          : nothing}
        ${this.showInitials
          ? html`
              <span part="initials" class="ds-avatar__initials">
                ${this.initials}
              </span>
            `
          : nothing}
        ${this.showIcon
          ? html`
              <span part="icon" class="ds-avatar__icon">
                ${defaultUserIcon}
              </span>
            `
          : nothing}
        ${this.showStatus && this.status
          ? html`
              <span
                part="status"
                class="ds-avatar__status"
                data-status=${this.status}
                aria-label=${`Status: ${this.status}`}
              ></span>
            `
          : nothing}
      </span>
    `;
  }
}

// Register the component
define("ds-avatar", DsAvatar);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-avatar": DsAvatar;
  }
}
