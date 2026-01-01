import { LitElement } from "lit";

/**
 * Base class for Light DOM Web Components.
 * Renders directly into the host element (no Shadow DOM).
 */
export class LightElement extends LitElement {
  /**
   * Override createRenderRoot to use Light DOM.
   * This allows styles from @ds/css to apply directly.
   */
  protected override createRenderRoot(): HTMLElement {
    return this;
  }
}
