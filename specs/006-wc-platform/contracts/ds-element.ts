/**
 * DSElement API Contract
 * Base class for all design system Web Components
 *
 * @package @ds/wc
 * @path packages/wc/src/base/ds-element.ts
 */

// biome-ignore lint/correctness/noUnusedImports: Used in extends clause below
import type { LitElement } from "lit";

/**
 * DSElement - Light DOM base class for Web Components
 *
 * All design system components MUST extend this class.
 * Components render into the Light DOM, enabling:
 * - Direct CSS styling from @ds/css and consumer stylesheets
 * - Form integration (autocomplete, form association)
 * - Standard DOM API access (querySelector from any scope)
 */
export declare class DSElement extends LitElement {
  /**
   * Override createRenderRoot to use Light DOM.
   * Components render directly into the host element.
   *
   * @returns The host element itself (this)
   */
  protected createRenderRoot(): HTMLElement;
}

/**
 * Usage Example:
 *
 * ```typescript
 * import { html } from 'lit';
 * import { property } from 'lit/decorators.js';
 * import { DSElement } from '@ds/wc';
 *
 * export class DsButton extends DSElement {
 *   @property({ reflect: true })
 *   variant: 'primary' | 'secondary' = 'primary';
 *
 *   render() {
 *     return html`<button class="ds-button ds-button--${this.variant}">
 *       <slot></slot>
 *     </button>`;
 *   }
 * }
 * ```
 */
