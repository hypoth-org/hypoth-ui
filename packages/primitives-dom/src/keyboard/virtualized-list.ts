/**
 * Virtualized List primitive.
 * Uses Intersection Observer for efficient rendering of long lists.
 */

// =============================================================================
// Types
// =============================================================================

export interface VirtualizedListOptions {
  /** Scroll container element */
  container: HTMLElement;
  /** Buffer zone in pixels (default: 300) */
  bufferPx?: number;
  /** Placeholder height estimate */
  estimatedItemHeight?: number;
  /** Called when item should render */
  onRender?: (id: string, element: HTMLElement) => void;
  /** Called when item should unrender */
  onUnrender?: (id: string, element: HTMLElement) => void;
}

export interface VirtualizedList {
  /** Register an item placeholder */
  observe(element: HTMLElement, id: string): void;

  /** Unregister an item */
  unobserve(element: HTMLElement): void;

  /** Force re-check all items */
  refresh(): void;

  /** Get currently visible item IDs */
  getVisibleIds(): string[];

  /** Scroll to item by ID */
  scrollToId(id: string, behavior?: ScrollBehavior): void;

  /** Cleanup */
  destroy(): void;
}

// =============================================================================
// Implementation
// =============================================================================

/**
 * Creates a virtualized list using Intersection Observer.
 *
 * @example
 * ```ts
 * const virtualizer = createVirtualizedList({
 *   container: scrollContainer,
 *   bufferPx: 300,
 *   onRender: (id, element) => {
 *     // Render actual content into element
 *     element.innerHTML = `<div>Item ${id}</div>`;
 *   },
 *   onUnrender: (id, element) => {
 *     // Clear content from element
 *     element.innerHTML = '';
 *   },
 * });
 *
 * // Register items
 * items.forEach((item, index) => {
 *   const placeholder = document.createElement('div');
 *   placeholder.style.height = '50px'; // estimated height
 *   virtualizer.observe(placeholder, `item-${index}`);
 *   container.appendChild(placeholder);
 * });
 *
 * // Cleanup
 * virtualizer.destroy();
 * ```
 */
export function createVirtualizedList(options: VirtualizedListOptions): VirtualizedList {
  const { container, bufferPx = 300, estimatedItemHeight = 40, onRender, onUnrender } = options;

  // Track registered elements and their IDs
  const elementToId = new Map<HTMLElement, string>();
  const idToElement = new Map<string, HTMLElement>();

  // Track visible items
  const visibleIds = new Set<string>();

  // Create Intersection Observer with buffer zone
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        const id = elementToId.get(element);

        if (!id) continue;

        if (entry.isIntersecting) {
          // Item is entering viewport (with buffer)
          if (!visibleIds.has(id)) {
            visibleIds.add(id);
            onRender?.(id, element);
          }
        } else {
          // Item is leaving viewport (with buffer)
          if (visibleIds.has(id)) {
            visibleIds.delete(id);
            onUnrender?.(id, element);
          }
        }
      }
    },
    {
      root: container,
      // Buffer zone: items start rendering before they're visible
      rootMargin: `${bufferPx}px 0px ${bufferPx}px 0px`,
      threshold: 0,
    }
  );

  function observe(element: HTMLElement, id: string): void {
    // Unregister if already registered with different ID
    const existingId = elementToId.get(element);
    if (existingId && existingId !== id) {
      unobserve(element);
    }

    // Register
    elementToId.set(element, id);
    idToElement.set(id, element);

    // Set minimum height for placeholder
    if (!element.style.minHeight) {
      element.style.minHeight = `${estimatedItemHeight}px`;
    }

    // Start observing
    observer.observe(element);
  }

  function unobserve(element: HTMLElement): void {
    const id = elementToId.get(element);

    if (id) {
      // Cleanup
      visibleIds.delete(id);
      elementToId.delete(element);
      idToElement.delete(id);
      onUnrender?.(id, element);
    }

    observer.unobserve(element);
  }

  function refresh(): void {
    // Disconnect and reconnect all observed elements
    observer.disconnect();

    for (const [element, id] of elementToId.entries()) {
      // Reset visibility state
      visibleIds.delete(id);
      onUnrender?.(id, element);

      // Re-observe
      observer.observe(element);
    }
  }

  function getVisibleIds(): string[] {
    return Array.from(visibleIds);
  }

  function scrollToId(id: string, behavior: ScrollBehavior = "auto"): void {
    const element = idToElement.get(id);
    if (!element) return;

    element.scrollIntoView({
      behavior,
      block: "nearest",
      inline: "nearest",
    });
  }

  function destroy(): void {
    // Disconnect observer
    observer.disconnect();

    // Clear all state
    for (const [id, element] of idToElement.entries()) {
      onUnrender?.(id, element);
    }

    elementToId.clear();
    idToElement.clear();
    visibleIds.clear();
  }

  return {
    observe,
    unobserve,
    refresh,
    getVisibleIds,
    scrollToId,
    destroy,
  };
}
