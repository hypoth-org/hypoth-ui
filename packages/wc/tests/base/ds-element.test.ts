import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { html } from "lit";
import { DSElement, LightElement } from "../../src/base/ds-element.js";

// Test component that extends DSElement
class TestElement extends DSElement {
  render() {
    return html`<div class="test-content">Test Content</div>`;
  }
}

// Register test element if not already defined
if (!customElements.get("test-ds-element")) {
  customElements.define("test-ds-element", TestElement);
}

describe("DSElement", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it("should render in Light DOM (no shadow root)", async () => {
    const element = document.createElement("test-ds-element") as TestElement;
    container.appendChild(element);

    // Wait for Lit to render
    await element.updateComplete;

    // Light DOM means shadowRoot should be null
    expect(element.shadowRoot).toBeNull();
  });

  it("should render content directly in the host element", async () => {
    const element = document.createElement("test-ds-element") as TestElement;
    container.appendChild(element);

    await element.updateComplete;

    // Content should be in the element itself, not in shadow root
    const content = element.querySelector(".test-content");
    expect(content).not.toBeNull();
    expect(content?.textContent).toBe("Test Content");
  });

  it("should be queryable from parent with standard DOM APIs", async () => {
    const element = document.createElement("test-ds-element") as TestElement;
    container.appendChild(element);

    await element.updateComplete;

    // Query from parent should work (Light DOM benefit)
    const content = container.querySelector(".test-content");
    expect(content).not.toBeNull();
  });

  it("should inherit from LitElement", () => {
    expect(DSElement.prototype).toBeInstanceOf(Object);
    expect(new TestElement()).toBeInstanceOf(DSElement);
  });

  it("should export LightElement as alias for backwards compatibility", () => {
    expect(LightElement).toBe(DSElement);
  });

  it("createRenderRoot should return the element itself", () => {
    const element = new TestElement();
    // Access protected method via type assertion
    const renderRoot = (element as unknown as { createRenderRoot: () => HTMLElement }).createRenderRoot();
    expect(renderRoot).toBe(element);
  });
});
