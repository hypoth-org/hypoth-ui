/**
 * Non-compliant component - uses auto-define pattern.
 * This file SHOULD trigger violations.
 */

import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";

export class NonCompliantButton extends LitElement {
  @property({ type: String })
  variant: "primary" | "secondary" = "primary";

  render() {
    return html`<button class="non-compliant-button">${this.variant}</button>`;
  }
}

// BAD: Top-level customElements.define() - this is a side effect!
// This runs immediately when the module is imported, causing:
// - Double registration errors if imported multiple times
// - Prevents tree-shaking
// - Components registered even if not used
customElements.define("non-compliant-button", NonCompliantButton);

// BAD: Also a side effect, just with window prefix
export class AnotherNonCompliantElement extends LitElement {
  render() {
    return html`<div>Another element</div>`;
  }
}

window.customElements.define("another-non-compliant", AnotherNonCompliantElement);

// BAD: Even with a guard, top-level calls are still side effects
export class GuardedButStillBad extends LitElement {
  render() {
    return html`<span>Guarded</span>`;
  }
}

if (!customElements.get("guarded-element")) {
  customElements.define("guarded-element", GuardedButStillBad);
}
