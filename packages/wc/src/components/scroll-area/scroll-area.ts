/**
 * ScrollArea component - custom scrollbar container.
 *
 * Provides styled scrollbars with consistent appearance across browsers.
 *
 * @element ds-scroll-area
 *
 * @slot - Scrollable content
 *
 * @example
 * ```html
 * <ds-scroll-area style="height: 200px">
 *   <ds-scroll-area-viewport>
 *     <!-- Long content here -->
 *   </ds-scroll-area-viewport>
 *   <ds-scroll-area-scrollbar orientation="vertical">
 *     <ds-scroll-area-thumb></ds-scroll-area-thumb>
 *   </ds-scroll-area-scrollbar>
 * </ds-scroll-area>
 * ```
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

// Import child components
import "./scroll-area-viewport.js";
import "./scroll-area-scrollbar.js";
import "./scroll-area-thumb.js";

export type ScrollAreaType = "auto" | "always" | "scroll" | "hover";

export class DsScrollArea extends DSElement {
  /** When scrollbars are visible */
  @property({ type: String, reflect: true })
  type: ScrollAreaType = "hover";

  /** Scroll hide delay in ms (for hover type) */
  @property({ type: Number, attribute: "scroll-hide-delay" })
  scrollHideDelay = 600;

  /** Orientation for which to show scrollbar */
  @property({ type: String, reflect: true })
  orientation: "vertical" | "horizontal" | "both" = "vertical";

  override connectedCallback(): void {
    super.connectedCallback();
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-scroll-area", DsScrollArea);

declare global {
  interface HTMLElementTagNameMap {
    "ds-scroll-area": DsScrollArea;
  }
}
