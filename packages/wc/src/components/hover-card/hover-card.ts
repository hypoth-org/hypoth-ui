/**
 * HoverCard component - rich preview card that appears on hover.
 *
 * Opens on mouseenter/focus with configurable delay, stays open when
 * pointer moves to the card content.
 *
 * @element ds-hover-card
 *
 * @slot trigger - Element that triggers the hover card
 * @slot - Hover card content (ds-hover-card-content)
 *
 * @fires ds:open - Fired when hover card opens
 * @fires ds:close - Fired when hover card closes
 *
 * @example
 * ```html
 * <ds-hover-card>
 *   <a slot="trigger" href="/user/123">@johndoe</a>
 *   <ds-hover-card-content>
 *     <img src="avatar.jpg" alt="">
 *     <h3>John Doe</h3>
 *     <p>Software Engineer</p>
 *   </ds-hover-card-content>
 * </ds-hover-card>
 * ```
 */

import {
  type AnchorPosition,
  type DismissableLayer,
  type Placement,
  type Presence,
  createAnchorPosition,
  createDismissableLayer,
  createPresence,
  prefersReducedMotion,
} from "@ds/primitives-dom";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";

// Import child component to ensure it's registered
import type { DsHoverCardContent } from "./hover-card-content.js";
import "./hover-card-content.js";

export class DsHoverCard extends DSElement {
  /** Whether the hover card is open */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** Placement relative to trigger */
  @property({ type: String, reflect: true })
  placement: Placement = "bottom";

  /** Offset distance from trigger in pixels */
  @property({ type: Number })
  offset = 8;

  /** Whether to flip placement when near viewport edge */
  @property({ type: Boolean })
  flip = true;

  /** Delay in ms before showing on hover */
  @property({ type: Number, attribute: "open-delay" })
  openDelay = 700;

  /** Delay in ms before hiding after hover leaves */
  @property({ type: Number, attribute: "close-delay" })
  closeDelay = 300;

  /** Whether to animate open/close transitions */
  @property({ type: Boolean })
  animated = true;

  private anchorPosition: AnchorPosition | null = null;
  private dismissLayer: DismissableLayer | null = null;
  private presence: Presence | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private scrollHandler: (() => void) | null = null;
  private openTimer: ReturnType<typeof setTimeout> | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private isHoveringTrigger = false;
  private isHoveringContent = false;

  override connectedCallback(): void {
    super.connectedCallback();

    // Listen for hover/focus on trigger
    this.addEventListener("mouseenter", this.handleTriggerMouseEnter, true);
    this.addEventListener("mouseleave", this.handleTriggerMouseLeave, true);
    this.addEventListener("focusin", this.handleFocusIn);
    this.addEventListener("focusout", this.handleFocusOut);

    // Setup after first render
    this.updateComplete.then(() => {
      this.setupTriggerAccessibility();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("mouseenter", this.handleTriggerMouseEnter, true);
    this.removeEventListener("mouseleave", this.handleTriggerMouseLeave, true);
    this.removeEventListener("focusin", this.handleFocusIn);
    this.removeEventListener("focusout", this.handleFocusOut);
    this.clearTimers();
    this.cleanup();
  }

  /**
   * Opens the hover card.
   */
  public show(): void {
    if (this.open) return;

    this.clearTimers();
    this.open = true;
    emitEvent(this, StandardEvents.OPEN);
  }

  /**
   * Closes the hover card.
   */
  public close(): void {
    if (!this.open) return;

    this.clearTimers();

    const content = this.querySelector("ds-hover-card-content") as DsHoverCardContent | null;

    if (this.animated && content && !prefersReducedMotion()) {
      this.dismissLayer?.deactivate();
      this.dismissLayer = null;

      this.presence = createPresence({
        onExitComplete: () => {
          this.completeClose();
        },
      });
      this.presence.hide(content);
    } else {
      this.cleanup();
      this.open = false;
      emitEvent(this, StandardEvents.CLOSE);
    }
  }

  private completeClose(): void {
    this.cleanup();
    this.open = false;
    emitEvent(this, StandardEvents.CLOSE);
  }

  private clearTimers(): void {
    if (this.openTimer) {
      clearTimeout(this.openTimer);
      this.openTimer = null;
    }
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  private handleTriggerMouseEnter = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    const trigger = target.closest('[slot="trigger"]');
    const content = target.closest("ds-hover-card-content");

    if (trigger && this.contains(trigger)) {
      this.isHoveringTrigger = true;
      this.scheduleOpen();
    } else if (content && this.contains(content)) {
      this.isHoveringContent = true;
      this.cancelClose();
    }
  };

  private handleTriggerMouseLeave = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    const trigger = target.closest('[slot="trigger"]');
    const content = target.closest("ds-hover-card-content");

    if (trigger && this.contains(trigger)) {
      this.isHoveringTrigger = false;
      this.scheduleClose();
    } else if (content && this.contains(content)) {
      this.isHoveringContent = false;
      this.scheduleClose();
    }
  };

  private handleFocusIn = (event: FocusEvent): void => {
    const target = event.target as HTMLElement;
    const trigger = target.closest('[slot="trigger"]');

    if (trigger && this.contains(trigger)) {
      this.clearTimers();
      this.show();
    }
  };

  private handleFocusOut = (event: FocusEvent): void => {
    const relatedTarget = event.relatedTarget as HTMLElement | null;

    // Check if focus is moving within the hover card
    if (relatedTarget && this.contains(relatedTarget)) {
      return;
    }

    // Focus left the hover card entirely
    this.scheduleClose();
  };

  private scheduleOpen(): void {
    this.cancelClose();

    if (this.open) return;

    this.openTimer = setTimeout(() => {
      this.show();
    }, this.openDelay);
  }

  private scheduleClose(): void {
    this.cancelOpen();

    // Don't close if still hovering trigger or content
    if (this.isHoveringTrigger || this.isHoveringContent) {
      return;
    }

    if (!this.open) return;

    this.closeTimer = setTimeout(() => {
      this.close();
    }, this.closeDelay);
  }

  private cancelOpen(): void {
    if (this.openTimer) {
      clearTimeout(this.openTimer);
      this.openTimer = null;
    }
  }

  private cancelClose(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  private handleDismiss = (): void => {
    this.close();
  };

  private setupTriggerAccessibility(): void {
    const trigger = this.querySelector('[slot="trigger"]');
    const content = this.querySelector("ds-hover-card-content");

    if (trigger && content) {
      trigger.setAttribute("aria-haspopup", "true");
      trigger.setAttribute("aria-expanded", String(this.open));
      if (content.id) {
        trigger.setAttribute("aria-controls", content.id);
      }
    }
  }

  private updateTriggerAria(): void {
    const trigger = this.querySelector('[slot="trigger"]');
    if (trigger) {
      trigger.setAttribute("aria-expanded", String(this.open));
    }
  }

  private setupPositioning(): void {
    const trigger = this.querySelector('[slot="trigger"]') as HTMLElement | null;
    const content = this.querySelector("ds-hover-card-content") as HTMLElement | null;

    if (!trigger || !content) return;

    this.anchorPosition = createAnchorPosition({
      anchor: trigger,
      floating: content,
      placement: this.placement,
      offset: this.offset,
      flip: this.flip,
      onPositionChange: (pos) => {
        content.setAttribute("data-placement", pos.placement);
      },
    });

    this.resizeObserver = new ResizeObserver(() => {
      this.anchorPosition?.update();
    });
    this.resizeObserver.observe(trigger);
    this.resizeObserver.observe(content);

    this.scrollHandler = () => {
      this.anchorPosition?.update();
    };
    window.addEventListener("scroll", this.scrollHandler, { passive: true });
    window.addEventListener("resize", this.scrollHandler, { passive: true });
  }

  private setupDismissLayer(): void {
    const content = this.querySelector("ds-hover-card-content") as HTMLElement | null;
    const trigger = this.querySelector('[slot="trigger"]') as HTMLElement | null;

    if (!content) return;

    this.dismissLayer = createDismissableLayer({
      container: content,
      excludeElements: trigger ? [trigger] : [],
      onDismiss: this.handleDismiss,
      closeOnEscape: true,
      closeOnOutsideClick: false, // Non-modal, only close on escape
    });
    this.dismissLayer.activate();
  }

  private cleanup(): void {
    this.anchorPosition?.destroy();
    this.anchorPosition = null;
    this.dismissLayer?.deactivate();
    this.dismissLayer = null;
    this.presence?.destroy();
    this.presence = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    if (this.scrollHandler) {
      window.removeEventListener("scroll", this.scrollHandler);
      window.removeEventListener("resize", this.scrollHandler);
      this.scrollHandler = null;
    }
  }

  override async updated(changedProperties: Map<string, unknown>): Promise<void> {
    super.updated(changedProperties);

    if (changedProperties.has("open")) {
      this.updateTriggerAria();

      const content = this.querySelector("ds-hover-card-content") as DsHoverCardContent | null;

      if (this.open) {
        content?.removeAttribute("hidden");

        if (content) {
          content.dataState = "open";
        }

        await this.updateComplete;

        this.setupPositioning();
        this.setupDismissLayer();
      } else {
        content?.setAttribute("hidden", "");
      }
    }
  }

  override render() {
    return html`
      <slot name="trigger"></slot>
      <slot></slot>
    `;
  }
}

define("ds-hover-card", DsHoverCard);

declare global {
  interface HTMLElementTagNameMap {
    "ds-hover-card": DsHoverCard;
  }
}
