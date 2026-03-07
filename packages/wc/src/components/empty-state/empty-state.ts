import { type TemplateResult, html } from "lit";
import { DSElement } from "../../base/ds-element.js";
import { define } from "../../registry/define.js";

/**
 * Empty state container component.
 *
 * @element ds-empty-state
 */
export class DsEmptyState extends DSElement {
  static override styles = [];

  override render(): TemplateResult {
    return html`
      <section class="ds-empty-state" role="status">
        <slot></slot>
      </section>
    `;
  }
}

define("ds-empty-state", DsEmptyState);

/**
 * Empty state icon sub-component (decorative).
 *
 * @element ds-empty-state-icon
 */
export class DsEmptyStateIcon extends DSElement {
  static override styles = [];

  override render(): TemplateResult {
    return html`
      <div class="ds-empty-state-icon" aria-hidden="true">
        <slot></slot>
      </div>
    `;
  }
}

define("ds-empty-state-icon", DsEmptyStateIcon);

/**
 * Empty state title sub-component.
 *
 * @element ds-empty-state-title
 */
export class DsEmptyStateTitle extends DSElement {
  static override styles = [];

  override render(): TemplateResult {
    return html`
      <h3 class="ds-empty-state-title">
        <slot></slot>
      </h3>
    `;
  }
}

define("ds-empty-state-title", DsEmptyStateTitle);

/**
 * Empty state description sub-component.
 *
 * @element ds-empty-state-description
 */
export class DsEmptyStateDescription extends DSElement {
  static override styles = [];

  override render(): TemplateResult {
    return html`
      <p class="ds-empty-state-description">
        <slot></slot>
      </p>
    `;
  }
}

define("ds-empty-state-description", DsEmptyStateDescription);

/**
 * Empty state action sub-component.
 *
 * @element ds-empty-state-action
 */
export class DsEmptyStateAction extends DSElement {
  static override styles = [];

  override render(): TemplateResult {
    return html`
      <div class="ds-empty-state-action">
        <slot></slot>
      </div>
    `;
  }
}

define("ds-empty-state-action", DsEmptyStateAction);

// TypeScript declarations for HTML
declare global {
  interface HTMLElementTagNameMap {
    "ds-empty-state": DsEmptyState;
    "ds-empty-state-icon": DsEmptyStateIcon;
    "ds-empty-state-title": DsEmptyStateTitle;
    "ds-empty-state-description": DsEmptyStateDescription;
    "ds-empty-state-action": DsEmptyStateAction;
  }
}
