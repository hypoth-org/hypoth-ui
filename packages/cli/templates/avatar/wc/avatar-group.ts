import { type TemplateResult, html, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";
import type { AvatarSize } from "./avatar.js";

/**
 * Avatar group component for displaying multiple avatars with overflow.
 *
 * @element ds-avatar-group
 *
 * @slot - Avatar elements to display
 *
 * @csspart overflow - The overflow indicator element
 *
 * @cssprop --ds-avatar-size - Avatar dimensions (inherited by children)
 */
export class DsAvatarGroup extends DSElement {
  static override styles = [];

  /**
   * Maximum number of avatars to display before showing overflow.
   */
  @property({ type: Number })
  max = 5;

  /**
   * Size variant (inherited by child avatars).
   */
  @property({ type: String, reflect: true })
  size: AvatarSize = "md";

  @state()
  private overflowCount = 0;

  @state()
  private visibleAvatars: Element[] = [];

  override connectedCallback(): void {
    super.connectedCallback();
    this.updateAvatarVisibility();

    // Use MutationObserver to track slot changes
    const observer = new MutationObserver(() => this.updateAvatarVisibility());
    observer.observe(this, { childList: true });
  }

  private updateAvatarVisibility(): void {
    const avatars = Array.from(this.querySelectorAll("ds-avatar"));
    const total = avatars.length;

    if (total <= this.max) {
      this.visibleAvatars = avatars;
      this.overflowCount = 0;
    } else {
      this.visibleAvatars = avatars.slice(0, this.max);
      this.overflowCount = total - this.max;
    }

    // Hide overflow avatars
    avatars.forEach((avatar, index) => {
      if (index >= this.max) {
        (avatar as HTMLElement).style.display = "none";
      } else {
        (avatar as HTMLElement).style.display = "";
      }
    });

    this.requestUpdate();
  }

  override render(): TemplateResult {
    const classes = {
      "ds-avatar-group": true,
    };

    return html`
      <div
        class=${classMap(classes)}
        role="group"
        aria-label="Avatar group"
        data-size=${this.size}
      >
        ${
          this.overflowCount > 0
            ? html`
              <span
                part="overflow"
                class="ds-avatar-group__overflow"
                aria-label="${this.overflowCount} more users"
              >
                +${this.overflowCount}
              </span>
            `
            : nothing
        }
        <slot @slotchange=${this.updateAvatarVisibility}></slot>
      </div>
    `;
  }
}

// Register the component
define("ds-avatar-group", DsAvatarGroup);

// TypeScript declaration for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-avatar-group": DsAvatarGroup;
  }
}
