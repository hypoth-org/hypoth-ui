/**
 * AspectRatio component - maintains consistent width-to-height ratio.
 *
 * @element ds-aspect-ratio
 *
 * @slot - Default slot for content to maintain aspect ratio
 *
 * @example
 * ```html
 * <ds-aspect-ratio ratio="16/9">
 *   <img src="image.jpg" alt="..." />
 * </ds-aspect-ratio>
 * <ds-aspect-ratio ratio="4/3">
 *   <video src="video.mp4"></video>
 * </ds-aspect-ratio>
 * ```
 */

import { html } from "lit";
import { property } from "lit/decorators.js";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

export class DsAspectRatio extends DSElement {
  /**
   * Aspect ratio as width/height (e.g., "16/9", "4/3", "1/1").
   * Can also be a number (e.g., 1.777 for 16:9).
   */
  @property({ reflect: true })
  ratio: string = "1/1";

  override updated(): void {
    this.updateCssVariable();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.updateCssVariable();
  }

  private updateCssVariable(): void {
    const ratioValue = this.parseRatio(this.ratio);
    this.style.setProperty("--ds-aspect-ratio", String(ratioValue));
  }

  private parseRatio(ratio: string): number {
    // Handle fraction format like "16/9"
    if (ratio.includes("/")) {
      const parts = ratio.split("/").map(Number);
      const width = parts[0];
      const height = parts[1];
      if (
        width !== undefined &&
        height !== undefined &&
        !Number.isNaN(width) &&
        !Number.isNaN(height) &&
        height !== 0
      ) {
        return width / height;
      }
    }
    // Handle decimal format
    const parsed = Number.parseFloat(ratio);
    return Number.isNaN(parsed) ? 1 : parsed;
  }

  override render() {
    return html`<slot></slot>`;
  }
}

define("ds-aspect-ratio", DsAspectRatio);

declare global {
  interface HTMLElementTagNameMap {
    "ds-aspect-ratio": DsAspectRatio;
  }
}
