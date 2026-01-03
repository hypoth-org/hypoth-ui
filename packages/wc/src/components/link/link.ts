import { type TemplateResult, html, nothing } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

export type LinkVariant = "default" | "muted" | "underline";

export interface DsNavigateEventDetail {
  href: string;
  external: boolean;
  originalEvent: MouseEvent | KeyboardEvent;
}

/**
 * A link component following WAI-ARIA link pattern.
 *
 * @element ds-link
 * @slot - Default slot for link content
 *
 * @fires ds:navigate - When the link is activated (cancelable)
 */
export class DsLink extends DSElement {
  static override styles = [];

  /**
   * The URL to navigate to.
   * Required for proper link functionality.
   */
  @property({ type: String, reflect: true })
  href = "";

  /**
   * Whether this link opens in a new tab.
   * When true, adds target="_blank" and rel="noopener noreferrer".
   */
  @property({ type: Boolean, reflect: true })
  external = false;

  /**
   * The link visual variant.
   */
  @property({ type: String, reflect: true })
  variant: LinkVariant = "default";

  private handleClick(event: MouseEvent): void {
    // Emit cancelable ds:navigate event
    const navigateEvent = emitEvent<DsNavigateEventDetail>(this, StandardEvents.NAVIGATE, {
      detail: {
        href: this.href,
        external: this.external,
        originalEvent: event,
      },
      cancelable: true,
    });

    // If consumer prevented the event, prevent navigation
    if (navigateEvent.defaultPrevented) {
      event.preventDefault();
    }
  }

  override render(): TemplateResult {
    const classes = {
      "ds-link": true,
      [`ds-link--${this.variant}`]: true,
      "ds-link--external": this.external,
    };

    // If href is empty, render as span (not a real link)
    if (!this.href) {
      return html`
        <span class=${classMap(classes)}>
          <span class="ds-link__content"><slot></slot></span>
        </span>
      `;
    }

    return html`
      <a
        class=${classMap(classes)}
        href=${this.href}
        target=${this.external ? "_blank" : nothing}
        rel=${this.external ? "noopener noreferrer" : nothing}
        @click=${this.handleClick}
      >
        <span class="ds-link__content"><slot></slot></span>
        ${this.external ? this.renderExternalIndicator() : nothing}
      </a>
    `;
  }

  private renderExternalIndicator(): TemplateResult {
    return html`
      <span class="ds-link__external-icon" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </span>
      <span class="ds-visually-hidden">(opens in new tab)</span>
    `;
  }
}

// Register the component
define("ds-link", DsLink);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-link": DsLink;
  }
}
