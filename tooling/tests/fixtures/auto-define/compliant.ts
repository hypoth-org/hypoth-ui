/**
 * Compliant component - uses registry pattern instead of auto-define.
 * This file should NOT trigger any violations.
 */

import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";

export class CompliantButton extends LitElement {
  @property({ type: String })
  variant: "primary" | "secondary" = "primary";

  render() {
    return html`<button class="compliant-button">${this.variant}</button>`;
  }
}

// Good: Registration happens via the registry, not here
// The registry calls customElements.define() inside a function, not at module load
export function registerCompliantButton() {
  if (!customElements.get("compliant-button")) {
    customElements.define("compliant-button", CompliantButton);
  }
}

// Good: define() inside a function is not a side effect
export function defineIfNeeded(tagName: string, ctor: CustomElementConstructor) {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, ctor);
  }
}

// Good: Using a class method
export class ComponentRegistry {
  register(tagName: string, ctor: CustomElementConstructor) {
    customElements.define(tagName, ctor);
  }
}

// Good: Arrow function wrapping
export const lazyDefine = () => customElements.define("lazy-element", CompliantButton);

// Good: IIFE is intentionally side-effect-ish but wrapped
// This is technically a side effect, but wrapped functions are okay
// because they can be tree-shaken or conditionally executed
