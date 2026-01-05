/**
 * Test fixture: Button with known accessibility violation
 *
 * This button intentionally has an accessibility violation for testing
 * that CI correctly fails when violations are detected.
 *
 * Violation: Button without accessible name (WCAG 4.1.2)
 */
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("test-violation-button")
export class TestViolationButton extends LitElement {
  // Using Light DOM to match project conventions
  protected override createRenderRoot() {
    return this;
  }

  protected override render() {
    // Violation: Empty button with no text content, aria-label, or aria-labelledby
    // This should fail axe-core's "button-name" rule
    return html`<button></button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "test-violation-button": TestViolationButton;
  }
}
