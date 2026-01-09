/**
 * Component wrapper abstraction for cross-framework testing.
 */

/**
 * Component wrapper interface for framework-agnostic testing.
 */
export interface ComponentWrapper {
  /** The root element of the component */
  element: Element;

  /** Query for a single element within the component */
  query(selector: string): Element | null;

  /** Query for all elements matching selector */
  queryAll(selector: string): Element[];

  /** Get an attribute value from the root element */
  getAttribute(name: string): string | null;

  /** Check if root element has an attribute */
  hasAttribute(name: string): boolean;

  /** Get text content of the component */
  getText(): string;

  /** Focus the component */
  focus(): void;

  /** Click the component */
  click(): void;

  /** Wait for the component to update */
  waitForUpdate(): Promise<void>;

  /** Cleanup the component */
  destroy(): void;
}

/**
 * Creates a wrapper for a Web Component element.
 */
export function wrapElement(element: Element): ComponentWrapper {
  return {
    element,

    query(selector: string): Element | null {
      return element.querySelector(selector);
    },

    queryAll(selector: string): Element[] {
      return Array.from(element.querySelectorAll(selector));
    },

    getAttribute(name: string): string | null {
      return element.getAttribute(name);
    },

    hasAttribute(name: string): boolean {
      return element.hasAttribute(name);
    },

    getText(): string {
      return (element as HTMLElement).textContent?.trim() ?? "";
    },

    focus(): void {
      (element as HTMLElement).focus();
    },

    click(): void {
      (element as HTMLElement).click();
    },

    async waitForUpdate(): Promise<void> {
      // Wait for Lit updateComplete if available
      if ("updateComplete" in element) {
        await (element as { updateComplete: Promise<unknown> }).updateComplete;
      }
      // Additional frame for DOM updates
      await new Promise((resolve) => requestAnimationFrame(resolve));
    },

    destroy(): void {
      element.remove();
    },
  };
}

/**
 * Creates a Web Component in a test container and returns a wrapper.
 */
export async function createComponent<T extends Element>(
  tagName: string,
  attributes?: Record<string, string>,
  innerHTML?: string
): Promise<ComponentWrapper & { component: T }> {
  // Create container if it doesn't exist
  let container = document.getElementById("test-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "test-container";
    document.body.appendChild(container);
  }

  // Create the element
  const element = document.createElement(tagName) as unknown as T;

  // Set attributes
  if (attributes) {
    for (const [name, value] of Object.entries(attributes)) {
      element.setAttribute(name, value);
    }
  }

  // Set innerHTML
  if (innerHTML) {
    element.innerHTML = innerHTML;
  }

  // Append to container
  container.appendChild(element);

  // Wait for component to be ready
  await customElements.whenDefined(tagName);

  // Wait for initial render
  if ("updateComplete" in element) {
    await (element as { updateComplete: Promise<unknown> }).updateComplete;
  }

  const wrapper = wrapElement(element);

  return {
    ...wrapper,
    component: element,
  };
}

/**
 * Cleans up all test components.
 */
export function cleanupComponents(): void {
  const container = document.getElementById("test-container");
  if (container) {
    container.innerHTML = "";
  }
}

/**
 * Renders HTML content and returns the first child element wrapped.
 */
export async function renderHTML(html: string): Promise<ComponentWrapper> {
  let container = document.getElementById("test-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "test-container";
    document.body.appendChild(container);
  }

  container.innerHTML = html;

  const element = container.firstElementChild;
  if (!element) {
    throw new Error("No element rendered from HTML");
  }

  // Wait for any custom elements to be defined
  const customElements = container.querySelectorAll(":not(:defined)");
  await Promise.all(
    Array.from(customElements).map((el) =>
      window.customElements.whenDefined(el.tagName.toLowerCase())
    )
  );

  // Wait for updates
  await new Promise((resolve) => requestAnimationFrame(resolve));

  return wrapElement(element);
}
