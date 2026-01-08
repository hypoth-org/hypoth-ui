/**
 * Portal Primitive
 *
 * Renders content outside the normal DOM hierarchy,
 * typically to document.body for overlays, modals, and toasts.
 */

export interface PortalOptions {
  /** Container element to render into (defaults to document.body) */
  container?: Element | null;
  /** Custom container selector (alternative to container element) */
  containerSelector?: string;
}

export interface Portal {
  /** The container element where content is rendered */
  readonly container: Element;
  /** Append an element to the portal container */
  mount(element: Element): void;
  /** Remove an element from the portal container */
  unmount(element: Element): void;
  /** Clean up and remove all portal content */
  destroy(): void;
}

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return typeof document !== "undefined" && typeof window !== "undefined";
}

/**
 * Get or create a default portal container
 */
function getDefaultContainer(): Element {
  if (!isBrowser()) {
    throw new Error("Portal requires a browser environment");
  }
  return document.body;
}

/**
 * Create a portal for rendering content outside the normal DOM hierarchy.
 *
 * @example
 * ```typescript
 * // Basic usage
 * const portal = createPortal();
 * const overlay = document.createElement('div');
 * portal.mount(overlay);
 *
 * // Custom container
 * const portal = createPortal({ container: document.getElementById('portal-root') });
 *
 * // Cleanup
 * portal.unmount(overlay);
 * portal.destroy();
 * ```
 */
export function createPortal(options: PortalOptions = {}): Portal {
  const { container: providedContainer, containerSelector } = options;

  // Resolve container
  let container: Element;
  if (providedContainer) {
    container = providedContainer;
  } else if (containerSelector && isBrowser()) {
    const found = document.querySelector(containerSelector);
    container = found ?? getDefaultContainer();
  } else {
    container = getDefaultContainer();
  }

  // Track mounted elements for cleanup
  const mountedElements = new Set<Element>();

  return {
    get container() {
      return container;
    },

    mount(element: Element) {
      if (!mountedElements.has(element)) {
        container.appendChild(element);
        mountedElements.add(element);
      }
    },

    unmount(element: Element) {
      if (mountedElements.has(element) && element.parentNode === container) {
        container.removeChild(element);
        mountedElements.delete(element);
      }
    },

    destroy() {
      for (const element of mountedElements) {
        if (element.parentNode === container) {
          container.removeChild(element);
        }
      }
      mountedElements.clear();
    },
  };
}

/**
 * Utility function to render content to a portal.
 * Returns a cleanup function.
 *
 * @example
 * ```typescript
 * const cleanup = renderToPortal(myElement);
 * // Later...
 * cleanup();
 * ```
 */
export function renderToPortal(
  element: Element,
  container: Element = getDefaultContainer()
): () => void {
  container.appendChild(element);
  return () => {
    if (element.parentNode === container) {
      container.removeChild(element);
    }
  };
}
