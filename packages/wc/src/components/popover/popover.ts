import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { StandardEvents, emitEvent } from "../../events/emit.js";
import { define } from "../../registry/define.js";
import {
  createAnchorPosition,
  createDismissableLayer,
  type AnchorPosition,
  type DismissableLayer,
  type Placement,
} from "@ds/primitives-dom";

// Import child component to ensure it's registered
import "./popover-content.js";

/**
 * Non-modal popover component with anchor positioning.
 *
 * Unlike Dialog, Popover does not trap focus and allows Tab to exit.
 * Positioned relative to its trigger using anchor positioning.
 *
 * @element ds-popover
 *
 * @slot trigger - Button or element that opens the popover
 * @slot - Popover content (ds-popover-content)
 *
 * @fires ds:open - Fired when popover opens
 * @fires ds:close - Fired when popover closes
 *
 * @example
 * ```html
 * <ds-popover>
 *   <button slot="trigger">Open Menu</button>
 *   <ds-popover-content>
 *     <button>Option 1</button>
 *     <button>Option 2</button>
 *   </ds-popover-content>
 * </ds-popover>
 * ```
 */
export class DsPopover extends DSElement {
  /** Whether the popover is open */
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

  /** Whether Escape key closes the popover */
  @property({
    attribute: "close-on-escape",
    converter: {
      fromAttribute: (value: string | null) => value !== "false",
      toAttribute: (value: boolean) => (value ? "" : "false"),
    },
  })
  closeOnEscape = true;

  /** Whether clicking outside closes the popover */
  @property({
    attribute: "close-on-outside-click",
    converter: {
      fromAttribute: (value: string | null) => value !== "false",
      toAttribute: (value: boolean) => (value ? "" : "false"),
    },
  })
  closeOnOutsideClick = true;

  private anchorPosition: AnchorPosition | null = null;
  private dismissLayer: DismissableLayer | null = null;
  private triggerElement: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private scrollHandler: (() => void) | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    // Listen for trigger clicks
    this.addEventListener("click", this.handleTriggerClick);

    // Setup after first render
    this.updateComplete.then(() => {
      this.setupTriggerAccessibility();
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.handleTriggerClick);
    this.cleanup();
  }

  /**
   * Opens the popover.
   */
  public show(): void {
    if (this.open) return;

    this.open = true;
    emitEvent(this, StandardEvents.OPEN);
  }

  /**
   * Closes the popover.
   */
  public close(): void {
    if (!this.open) return;

    this.cleanup();
    this.open = false;
    emitEvent(this, StandardEvents.CLOSE);

    // Return focus to trigger
    this.triggerElement?.focus();
  }

  /**
   * Toggles the popover open/closed state.
   */
  public toggle(): void {
    if (this.open) {
      this.close();
    } else {
      this.show();
    }
  }

  private handleTriggerClick = (event: Event): void => {
    const target = event.target as HTMLElement;
    const trigger = target.closest('[slot="trigger"]');

    if (trigger && this.contains(trigger)) {
      event.preventDefault();
      this.triggerElement = trigger as HTMLElement;
      this.toggle();
    }
  };

  private handleDismiss = (reason: "escape" | "outside-click"): void => {
    if (reason === "escape" && this.closeOnEscape) {
      this.close();
    } else if (reason === "outside-click" && this.closeOnOutsideClick) {
      this.close();
    }
  };

  private setupTriggerAccessibility(): void {
    const trigger = this.querySelector('[slot="trigger"]');
    const content = this.querySelector("ds-popover-content");

    if (trigger && content) {
      // Store reference
      this.triggerElement = trigger as HTMLElement;

      // Set ARIA attributes on trigger
      trigger.setAttribute("aria-haspopup", "true");
      trigger.setAttribute("aria-expanded", String(this.open));
      trigger.setAttribute("aria-controls", content.id);
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
    const content = this.querySelector("ds-popover-content") as HTMLElement | null;

    if (!trigger || !content) return;

    // Setup anchor positioning
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

    // Setup resize observer for repositioning
    this.resizeObserver = new ResizeObserver(() => {
      this.anchorPosition?.update();
    });
    this.resizeObserver.observe(trigger);
    this.resizeObserver.observe(content);

    // Setup scroll handler for repositioning
    this.scrollHandler = () => {
      this.anchorPosition?.update();
    };
    window.addEventListener("scroll", this.scrollHandler, { passive: true });
    window.addEventListener("resize", this.scrollHandler, { passive: true });
  }

  private setupDismissLayer(): void {
    const content = this.querySelector("ds-popover-content") as HTMLElement | null;
    const trigger = this.querySelector('[slot="trigger"]') as HTMLElement | null;

    if (!content) return;

    this.dismissLayer = createDismissableLayer({
      container: content,
      excludeElements: trigger ? [trigger] : [],
      onDismiss: this.handleDismiss,
      closeOnEscape: this.closeOnEscape,
      closeOnOutsideClick: this.closeOnOutsideClick,
    });
    this.dismissLayer.activate();
  }

  private cleanup(): void {
    // Cleanup anchor positioning
    this.anchorPosition?.destroy();
    this.anchorPosition = null;

    // Cleanup dismiss layer
    this.dismissLayer?.deactivate();
    this.dismissLayer = null;

    // Cleanup resize observer
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;

    // Cleanup scroll handler
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

      const content = this.querySelector("ds-popover-content");

      if (this.open) {
        // Show content
        content?.removeAttribute("hidden");

        // Wait for DOM update
        await this.updateComplete;

        // Setup positioning and dismiss
        this.setupPositioning();
        this.setupDismissLayer();
      } else {
        // Hide content
        content?.setAttribute("hidden", "");
      }
    }

    // Update positioning if placement or offset changes while open
    if (this.open && (changedProperties.has("placement") || changedProperties.has("offset"))) {
      this.cleanup();
      this.setupPositioning();
      this.setupDismissLayer();
    }
  }

  override render() {
    return html`
      <slot name="trigger"></slot>
      <slot></slot>
    `;
  }
}

define("ds-popover", DsPopover);

declare global {
  interface HTMLElementTagNameMap {
    "ds-popover": DsPopover;
  }
}
