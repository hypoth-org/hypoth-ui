/**
 * Test fixture: Button that passes accessibility checks
 *
 * This button is properly accessible for testing that CI
 * correctly passes when no violations are present.
 */
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("test-valid-button")
export class TestValidButton extends LitElement {
  @property({ type: String })
  label = "Click me";

  @property({ type: Boolean })
  disabled = false;

  // Using Light DOM to match project conventions
  protected override createRenderRoot() {
    return this;
  }

  protected override render() {
    // Accessible: Button with visible text label
    return html`
      <button
        type="button"
        ?disabled=${this.disabled}
        aria-disabled=${this.disabled ? "true" : "false"}
      >
        ${this.label}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "test-valid-button": TestValidButton;
  }
}
