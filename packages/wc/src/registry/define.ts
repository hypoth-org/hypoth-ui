/**
 * Safe custom element registration utility.
 * Prevents duplicate registration errors.
 */

type CustomElementConstructor = new (...args: unknown[]) => HTMLElement;

/**
 * Register a custom element if not already defined.
 * @param tagName - The custom element tag name (e.g., 'ds-button')
 * @param elementClass - The custom element class
 */
export function define(tagName: string, elementClass: CustomElementConstructor): void {
  if (typeof customElements === "undefined") return;

  if (!customElements.get(tagName)) {
    customElements.define(tagName, elementClass);
  }
}

/**
 * Check if a custom element is already registered.
 */
export function isDefined(tagName: string): boolean {
  if (typeof customElements === "undefined") return false;
  return customElements.get(tagName) !== undefined;
}

/**
 * Wait for a custom element to be defined.
 */
export function whenDefined(tagName: string): Promise<CustomElementConstructor> {
  if (typeof customElements === "undefined") {
    return Promise.reject(new Error("customElements is not available"));
  }
  return customElements.whenDefined(tagName);
}
