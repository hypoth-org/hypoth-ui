import { type AnchorPosition, type Placement, createAnchorPosition } from "@ds/primitives-dom";
import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

// Import child component to ensure it's registered
import "./tooltip-content.js";

/**
 * Tooltip component with hover/focus trigger and configurable delays.
 *
 * Shows informational content on hover or focus with positioning
 * relative to the trigger element.
 *
 * @element ds-tooltip
 *
 * @slot trigger - Element that triggers the tooltip
 * @slot - Tooltip content (ds-tooltip-content)
 *
 * @example
 * ```html
 * <ds-tooltip>
 *   <button slot="trigger">Hover for info</button>
 *   <ds-tooltip-content>Additional information here</ds-tooltip-content>
 * </ds-tooltip>
 * ```
 */
export class DsTooltip extends DSElement {
  /** Whether the tooltip is open */
  @property({ type: Boolean, reflect: true })
  open = false;

  /** Placement relative to trigger */
  @property({ type: String, reflect: true })
  placement: Placement = "top";

  /** Offset distance from trigger in pixels */
  @property({ type: Number })
  offset = 8;

  /** Delay before showing tooltip (ms) */
  @property({ type: Number, attribute: "show-delay" })
  showDelay = 400;

  /** Delay before hiding tooltip (ms) */
  @property({ type: Number, attribute: "hide-delay" })
  hideDelay = 100;

  private anchorPosition: AnchorPosition | null = null;
  private showTimeout: ReturnType<typeof setTimeout> | null = null;
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;
  private escapeHandler: ((event: KeyboardEvent) => void) | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    // Setup after first render
    this.updateComplete.then(() => {
      this.setupTriggerListeners();
      this.setupContentListeners();
      this.setupTriggerAccessibility();
      this.setupEscapeHandler();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.cleanup();
    this.removeEscapeHandler();
  }

  /**
   * Shows the tooltip immediately.
   */
  public show(): void {
    this.clearTimeouts();
    if (this.open) return;

    this.open = true;
  }

  /**
   * Hides the tooltip immediately.
   */
  public hide(): void {
    this.clearTimeouts();
    if (!this.open) return;

    this.cleanup();
    this.open = false;
  }

  private clearTimeouts(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  private scheduleShow(): void {
    this.clearTimeouts();
    if (this.open) return;

    this.showTimeout = setTimeout(() => {
      this.open = true;
      this.showTimeout = null;
    }, this.showDelay);
  }

  private scheduleHide(): void {
    this.clearTimeouts();
    if (!this.open) return;

    this.hideTimeout = setTimeout(() => {
      this.cleanup();
      this.open = false;
      this.hideTimeout = null;
    }, this.hideDelay);
  }

  private handleTriggerMouseEnter = (): void => {
    this.scheduleShow();
  };

  private handleTriggerMouseLeave = (): void => {
    this.scheduleHide();
  };

  private handleTriggerFocusIn = (): void => {
    this.scheduleShow();
  };

  private handleTriggerFocusOut = (): void => {
    this.scheduleHide();
  };

  private handleContentMouseEnter = (): void => {
    // Cancel hide when mouse enters tooltip content (hover persistence)
    this.clearTimeouts();
  };

  private handleContentMouseLeave = (): void => {
    this.scheduleHide();
  };

  private setupTriggerListeners(): void {
    const trigger = this.querySelector('[slot="trigger"]');
    if (!trigger) return;

    trigger.addEventListener("mouseenter", this.handleTriggerMouseEnter);
    trigger.addEventListener("mouseleave", this.handleTriggerMouseLeave);
    trigger.addEventListener("focusin", this.handleTriggerFocusIn);
    trigger.addEventListener("focusout", this.handleTriggerFocusOut);
  }

  private setupContentListeners(): void {
    const content = this.querySelector("ds-tooltip-content");
    if (!content) return;

    content.addEventListener("mouseenter", this.handleContentMouseEnter);
    content.addEventListener("mouseleave", this.handleContentMouseLeave);
  }

  private setupTriggerAccessibility(): void {
    const trigger = this.querySelector('[slot="trigger"]');
    const content = this.querySelector("ds-tooltip-content");

    if (trigger && content) {
      // Set aria-describedby on trigger pointing to tooltip content
      trigger.setAttribute("aria-describedby", content.id);
    }
  }

  private setupEscapeHandler(): void {
    this.escapeHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape" && this.open) {
        event.preventDefault();
        this.hide();
      }
    };
    document.addEventListener("keydown", this.escapeHandler);
  }

  private removeEscapeHandler(): void {
    if (this.escapeHandler) {
      document.removeEventListener("keydown", this.escapeHandler);
      this.escapeHandler = null;
    }
  }

  private setupPositioning(): void {
    const trigger = this.querySelector('[slot="trigger"]') as HTMLElement | null;
    const content = this.querySelector("ds-tooltip-content") as HTMLElement | null;

    if (!trigger || !content) return;

    this.anchorPosition = createAnchorPosition({
      anchor: trigger,
      floating: content,
      placement: this.placement,
      offset: this.offset,
      flip: true,
      onPositionChange: (pos) => {
        content.setAttribute("data-placement", pos.placement);
      },
    });
  }

  private cleanup(): void {
    this.clearTimeouts();
    this.anchorPosition?.destroy();
    this.anchorPosition = null;
  }

  override async updated(changedProperties: Map<string, unknown>): Promise<void> {
    super.updated(changedProperties);

    if (changedProperties.has("open")) {
      const content = this.querySelector("ds-tooltip-content");

      if (this.open) {
        // Show content
        content?.removeAttribute("hidden");

        // Wait for DOM update
        await this.updateComplete;

        // Setup positioning
        this.setupPositioning();
      } else {
        // Hide content
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

define("ds-tooltip", DsTooltip);

declare global {
  interface HTMLElementTagNameMap {
    "ds-tooltip": DsTooltip;
  }
}
