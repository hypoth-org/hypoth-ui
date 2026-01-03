import { LitElement } from "lit";

/**
 * DSElement - Base class for design system Web Components.
 *
 * All design system components should extend this class to ensure
 * consistent Light DOM rendering behavior.
 *
 * Light DOM rendering enables:
 * - Direct CSS styling from @ds/css and consumer stylesheets
 * - Form integration (autocomplete, form association)
 * - Standard DOM API access (querySelector from any scope)
 * - Natural event bubbling without shadow boundary issues
 *
 * @example
 * ```typescript
 * import { html } from 'lit';
 * import { property } from 'lit/decorators.js';
 * import { DSElement } from '@ds/wc';
 *
 * export class DsCard extends DSElement {
 *   @property({ reflect: true })
 *   variant: 'default' | 'elevated' = 'default';
 *
 *   render() {
 *     return html`<div class="ds-card ds-card--${this.variant}">
 *       <slot></slot>
 *     </div>`;
 *   }
 * }
 * ```
 */
export class DSElement extends LitElement {
  /**
   * Override createRenderRoot to use Light DOM.
   * This renders content directly into the host element instead of Shadow DOM.
   *
   * @returns The host element itself for Light DOM rendering
   */
  protected override createRenderRoot(): HTMLElement {
    return this;
  }
}

// Re-export with legacy name for backwards compatibility
export { DSElement as LightElement };
