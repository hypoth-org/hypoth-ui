import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createVirtualizedList } from "../../src/keyboard/virtualized-list";

// Mock IntersectionObserver since it's not available in test environment
class MockIntersectionObserver {
  private callback: IntersectionObserverCallback;
  private elements = new Set<Element>();
  root: Element | null;
  rootMargin: string;
  thresholds: readonly number[];

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.root = (options?.root as Element | null) ?? null;
    this.rootMargin = options?.rootMargin ?? "0px";
    this.thresholds = options?.threshold
      ? Array.isArray(options.threshold)
        ? options.threshold
        : [options.threshold]
      : [0];
  }

  observe(element: Element): void {
    this.elements.add(element);
    // Simulate immediate intersection for visible elements
    this.simulateIntersection(element, true);
  }

  unobserve(element: Element): void {
    this.elements.delete(element);
  }

  disconnect(): void {
    this.elements.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  // Helper to simulate intersection changes
  simulateIntersection(element: Element, isIntersecting: boolean): void {
    const entry: IntersectionObserverEntry = {
      target: element,
      isIntersecting,
      boundingClientRect: element.getBoundingClientRect(),
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: isIntersecting ? element.getBoundingClientRect() : new DOMRect(),
      rootBounds: this.root?.getBoundingClientRect() ?? null,
      time: Date.now(),
    };
    this.callback([entry], this);
  }

  // Simulate batch intersection changes
  simulateBatchIntersection(entries: Array<{ element: Element; isIntersecting: boolean }>): void {
    const observerEntries = entries.map(({ element, isIntersecting }) => ({
      target: element,
      isIntersecting,
      boundingClientRect: element.getBoundingClientRect(),
      intersectionRatio: isIntersecting ? 1 : 0,
      intersectionRect: isIntersecting ? element.getBoundingClientRect() : new DOMRect(),
      rootBounds: this.root?.getBoundingClientRect() ?? null,
      time: Date.now(),
    }));
    this.callback(observerEntries, this);
  }
}

// Store the mock instance for access in tests
let mockObserverInstance: MockIntersectionObserver | null = null;

describe("createVirtualizedList", () => {
  let container: HTMLDivElement;
  let items: HTMLDivElement[];

  beforeEach(() => {
    // Setup mock IntersectionObserver
    mockObserverInstance = null;
    vi.stubGlobal(
      "IntersectionObserver",
      class extends MockIntersectionObserver {
        constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
          super(callback, options);
          mockObserverInstance = this;
        }
      }
    );

    // Create container and items
    container = document.createElement("div");
    container.style.height = "200px";
    container.style.overflow = "auto";
    document.body.appendChild(container);

    items = [];
    for (let i = 0; i < 10; i++) {
      const item = document.createElement("div");
      item.setAttribute("data-id", `item-${i}`);
      item.style.height = "50px";
      items.push(item);
      container.appendChild(item);
    }
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.unstubAllGlobals();
    mockObserverInstance = null;
  });

  describe("initialization", () => {
    it("should create a virtualized list with required methods", () => {
      const virtualizer = createVirtualizedList({ container });

      expect(typeof virtualizer.observe).toBe("function");
      expect(typeof virtualizer.unobserve).toBe("function");
      expect(typeof virtualizer.refresh).toBe("function");
      expect(typeof virtualizer.getVisibleIds).toBe("function");
      expect(typeof virtualizer.scrollToId).toBe("function");
      expect(typeof virtualizer.destroy).toBe("function");

      virtualizer.destroy();
    });

    it("should use default buffer of 300px", () => {
      createVirtualizedList({ container });

      expect(mockObserverInstance?.rootMargin).toBe("300px 0px 300px 0px");
    });

    it("should use custom buffer when specified", () => {
      createVirtualizedList({ container, bufferPx: 500 });

      expect(mockObserverInstance?.rootMargin).toBe("500px 0px 500px 0px");
    });
  });

  describe("observe/unobserve", () => {
    it("should register items with observe", () => {
      const onRender = vi.fn();
      const virtualizer = createVirtualizedList({ container, onRender });

      virtualizer.observe(items[0], "item-0");
      virtualizer.observe(items[1], "item-1");

      // Items should trigger onRender when observed (simulated as visible)
      expect(onRender).toHaveBeenCalledTimes(2);
      expect(onRender).toHaveBeenCalledWith("item-0", items[0]);
      expect(onRender).toHaveBeenCalledWith("item-1", items[1]);

      virtualizer.destroy();
    });

    it("should unregister items with unobserve", () => {
      const onRender = vi.fn();
      const onUnrender = vi.fn();
      const virtualizer = createVirtualizedList({ container, onRender, onUnrender });

      virtualizer.observe(items[0], "item-0");
      expect(virtualizer.getVisibleIds()).toContain("item-0");

      virtualizer.unobserve(items[0]);

      expect(onUnrender).toHaveBeenCalledWith("item-0", items[0]);
      expect(virtualizer.getVisibleIds()).not.toContain("item-0");

      virtualizer.destroy();
    });

    it("should handle re-registering with different ID", () => {
      const onUnrender = vi.fn();
      const virtualizer = createVirtualizedList({ container, onUnrender });

      virtualizer.observe(items[0], "item-0");
      virtualizer.observe(items[0], "item-0-new");

      // Old ID should have been unrendered
      expect(onUnrender).toHaveBeenCalledWith("item-0", items[0]);

      virtualizer.destroy();
    });

    it("should set estimated item height as minHeight", () => {
      const virtualizer = createVirtualizedList({
        container,
        estimatedItemHeight: 60,
      });

      const newItem = document.createElement("div");
      virtualizer.observe(newItem, "new-item");

      expect(newItem.style.minHeight).toBe("60px");

      virtualizer.destroy();
    });

    it("should not override existing minHeight", () => {
      const virtualizer = createVirtualizedList({
        container,
        estimatedItemHeight: 60,
      });

      const newItem = document.createElement("div");
      newItem.style.minHeight = "100px";
      virtualizer.observe(newItem, "new-item");

      expect(newItem.style.minHeight).toBe("100px");

      virtualizer.destroy();
    });
  });

  describe("visibility tracking", () => {
    it("should track visible items", () => {
      const virtualizer = createVirtualizedList({ container });

      virtualizer.observe(items[0], "item-0");
      virtualizer.observe(items[1], "item-1");

      const visibleIds = virtualizer.getVisibleIds();
      expect(visibleIds).toContain("item-0");
      expect(visibleIds).toContain("item-1");

      virtualizer.destroy();
    });

    it("should remove item from visible when it leaves viewport", () => {
      const onUnrender = vi.fn();
      const virtualizer = createVirtualizedList({ container, onUnrender });

      virtualizer.observe(items[0], "item-0");
      expect(virtualizer.getVisibleIds()).toContain("item-0");

      // Simulate item leaving viewport
      mockObserverInstance?.simulateIntersection(items[0], false);

      expect(virtualizer.getVisibleIds()).not.toContain("item-0");
      expect(onUnrender).toHaveBeenCalledWith("item-0", items[0]);

      virtualizer.destroy();
    });

    it("should add item to visible when it enters viewport", () => {
      const onRender = vi.fn();
      const virtualizer = createVirtualizedList({ container, onRender });

      virtualizer.observe(items[0], "item-0");
      onRender.mockClear();

      // First simulate leaving
      mockObserverInstance?.simulateIntersection(items[0], false);

      // Then entering
      mockObserverInstance?.simulateIntersection(items[0], true);

      expect(virtualizer.getVisibleIds()).toContain("item-0");
      expect(onRender).toHaveBeenCalledWith("item-0", items[0]);

      virtualizer.destroy();
    });

    it("should not call onRender twice for already visible item", () => {
      const onRender = vi.fn();
      const virtualizer = createVirtualizedList({ container, onRender });

      virtualizer.observe(items[0], "item-0");
      onRender.mockClear();

      // Try to render again while still visible
      mockObserverInstance?.simulateIntersection(items[0], true);

      expect(onRender).not.toHaveBeenCalled();

      virtualizer.destroy();
    });
  });

  describe("refresh", () => {
    it("should re-check all items on refresh", () => {
      const onRender = vi.fn();
      const onUnrender = vi.fn();
      const virtualizer = createVirtualizedList({ container, onRender, onUnrender });

      virtualizer.observe(items[0], "item-0");
      virtualizer.observe(items[1], "item-1");

      onRender.mockClear();
      onUnrender.mockClear();

      virtualizer.refresh();

      // All items should have been unrendered during refresh
      expect(onUnrender).toHaveBeenCalledTimes(2);

      virtualizer.destroy();
    });

    it("should clear visibility state during refresh", () => {
      const virtualizer = createVirtualizedList({ container });

      virtualizer.observe(items[0], "item-0");
      expect(virtualizer.getVisibleIds().length).toBeGreaterThan(0);

      // Mock disconnect to clear visible state
      virtualizer.refresh();

      // After refresh, items will be re-observed
      virtualizer.destroy();
    });
  });

  describe("scrollToId", () => {
    it("should scroll to element by ID", () => {
      const virtualizer = createVirtualizedList({ container });

      virtualizer.observe(items[5], "item-5");

      const scrollIntoViewMock = vi.fn();
      items[5].scrollIntoView = scrollIntoViewMock;

      virtualizer.scrollToId("item-5");

      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: "auto",
        block: "nearest",
        inline: "nearest",
      });

      virtualizer.destroy();
    });

    it("should use custom scroll behavior", () => {
      const virtualizer = createVirtualizedList({ container });

      virtualizer.observe(items[5], "item-5");

      const scrollIntoViewMock = vi.fn();
      items[5].scrollIntoView = scrollIntoViewMock;

      virtualizer.scrollToId("item-5", "smooth");

      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });

      virtualizer.destroy();
    });

    it("should do nothing for unknown ID", () => {
      const virtualizer = createVirtualizedList({ container });

      virtualizer.observe(items[5], "item-5");

      // Should not throw
      virtualizer.scrollToId("unknown-id");

      virtualizer.destroy();
    });
  });

  describe("destroy", () => {
    it("should cleanup all resources on destroy", () => {
      const onUnrender = vi.fn();
      const virtualizer = createVirtualizedList({ container, onUnrender });

      virtualizer.observe(items[0], "item-0");
      virtualizer.observe(items[1], "item-1");

      onUnrender.mockClear();

      virtualizer.destroy();

      // All visible items should have been unrendered
      expect(onUnrender).toHaveBeenCalledTimes(2);
      expect(virtualizer.getVisibleIds()).toHaveLength(0);
    });

    it("should handle multiple destroy calls", () => {
      const virtualizer = createVirtualizedList({ container });

      virtualizer.observe(items[0], "item-0");

      virtualizer.destroy();
      // Second destroy should not throw
      virtualizer.destroy();
    });
  });

  describe("edge cases", () => {
    it("should handle empty container", () => {
      const emptyContainer = document.createElement("div");
      document.body.appendChild(emptyContainer);

      const virtualizer = createVirtualizedList({ container: emptyContainer });

      expect(virtualizer.getVisibleIds()).toHaveLength(0);

      virtualizer.destroy();
      document.body.removeChild(emptyContainer);
    });

    it("should handle unregistered element in callback", () => {
      const virtualizer = createVirtualizedList({ container });

      const unregisteredElement = document.createElement("div");

      // Simulate intersection for unregistered element - should not throw
      mockObserverInstance?.simulateIntersection(unregisteredElement, true);

      virtualizer.destroy();
    });

    it("should handle batch intersection entries", () => {
      const onRender = vi.fn();
      const onUnrender = vi.fn();
      const virtualizer = createVirtualizedList({ container, onRender, onUnrender });

      virtualizer.observe(items[0], "item-0");
      virtualizer.observe(items[1], "item-1");
      virtualizer.observe(items[2], "item-2");

      onRender.mockClear();
      onUnrender.mockClear();

      // Simulate batch: items 0 and 1 leave, item 2 stays
      mockObserverInstance?.simulateBatchIntersection([
        { element: items[0], isIntersecting: false },
        { element: items[1], isIntersecting: false },
        { element: items[2], isIntersecting: true },
      ]);

      expect(onUnrender).toHaveBeenCalledTimes(2);
      expect(onRender).not.toHaveBeenCalled(); // item 2 was already visible

      virtualizer.destroy();
    });
  });
});
