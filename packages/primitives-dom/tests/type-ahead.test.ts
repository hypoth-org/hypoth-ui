import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createTypeAhead } from "../src/keyboard/type-ahead";

describe("createTypeAhead", () => {
  let items: HTMLElement[];
  let onMatch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();

    items = [];
    const names = ["Apple", "Banana", "Blueberry", "Cherry", "Date"];
    for (const name of names) {
      const item = document.createElement("div");
      item.textContent = name;
      items.push(item);
    }

    onMatch = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should create type-ahead with handleKeyDown and reset methods", () => {
    const typeAhead = createTypeAhead({
      items: () => items,
      getText: (item) => item.textContent ?? "",
      onMatch,
    });

    expect(typeof typeAhead.handleKeyDown).toBe("function");
    expect(typeof typeAhead.reset).toBe("function");
  });

  it("should match single character", () => {
    const typeAhead = createTypeAhead({
      items: () => items,
      getText: (item) => item.textContent ?? "",
      onMatch,
    });

    const event = new KeyboardEvent("keydown", {
      key: "c",
      bubbles: true,
    });
    typeAhead.handleKeyDown(event);

    // Should match "Cherry" (index 3)
    expect(onMatch).toHaveBeenCalledWith(items[3], 3);
  });

  it("should accumulate characters for multiple matches", () => {
    const typeAhead = createTypeAhead({
      items: () => items,
      getText: (item) => item.textContent ?? "",
      onMatch,
    });

    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "b" }));
    // Should match "Banana" (index 1)
    expect(onMatch).toHaveBeenCalledWith(items[1], 1);

    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "l" }));
    // Should match "Blueberry" (index 2) with "bl"
    expect(onMatch).toHaveBeenCalledWith(items[2], 2);
  });

  it("should clear buffer after timeout", () => {
    const typeAhead = createTypeAhead({
      items: () => items,
      getText: (item) => item.textContent ?? "",
      onMatch,
      timeout: 500,
    });

    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "b" }));
    expect(onMatch).toHaveBeenCalledWith(items[1], 1);

    // Advance time past timeout
    vi.advanceTimersByTime(600);

    // Type "a" after timeout - should search for "a" not "ba"
    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "a" }));
    expect(onMatch).toHaveBeenCalledWith(items[0], 0); // Apple
  });

  it("should reset buffer on manual reset", () => {
    const typeAhead = createTypeAhead({
      items: () => items,
      getText: (item) => item.textContent ?? "",
      onMatch,
    });

    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "b" }));
    typeAhead.reset();

    // Type "a" after reset - should search for "a" not "ba"
    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "a" }));
    expect(onMatch).toHaveBeenLastCalledWith(items[0], 0); // Apple
  });

  it("should not match when no items start with buffer", () => {
    const typeAhead = createTypeAhead({
      items: () => items,
      getText: (item) => item.textContent ?? "",
      onMatch,
    });

    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "x" }));

    expect(onMatch).not.toHaveBeenCalled();
  });

  it("should be case-insensitive", () => {
    const typeAhead = createTypeAhead({
      items: () => items,
      getText: (item) => item.textContent ?? "",
      onMatch,
    });

    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "A" }));

    expect(onMatch).toHaveBeenCalledWith(items[0], 0); // Apple
  });

  it("should ignore modifier keys", () => {
    const typeAhead = createTypeAhead({
      items: () => items,
      getText: (item) => item.textContent ?? "",
      onMatch,
    });

    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "a", ctrlKey: true }));
    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "a", metaKey: true }));
    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "a", altKey: true }));

    expect(onMatch).not.toHaveBeenCalled();
  });

  it("should ignore non-printable keys", () => {
    const typeAhead = createTypeAhead({
      items: () => items,
      getText: (item) => item.textContent ?? "",
      onMatch,
    });

    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "Enter" }));
    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "Escape" }));
    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "Tab" }));
    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "ArrowDown" }));

    expect(onMatch).not.toHaveBeenCalled();
  });

  it("should use default timeout of 500ms", () => {
    const typeAhead = createTypeAhead({
      items: () => items,
      getText: (item) => item.textContent ?? "",
      onMatch,
    });

    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "b" }));

    // Advance time less than default timeout
    vi.advanceTimersByTime(400);

    // Should still accumulate
    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "l" }));
    expect(onMatch).toHaveBeenLastCalledWith(items[2], 2); // Blueberry

    // Advance time past timeout
    vi.advanceTimersByTime(600);

    // Should start fresh
    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "c" }));
    expect(onMatch).toHaveBeenLastCalledWith(items[3], 3); // Cherry
  });

  it("should support dynamic items", () => {
    let currentItems = items.slice(0, 2); // Just Apple and Banana

    const typeAhead = createTypeAhead({
      items: () => currentItems,
      getText: (item) => item.textContent ?? "",
      onMatch,
    });

    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "c" }));
    // Cherry not in current items
    expect(onMatch).not.toHaveBeenCalled();

    // Update items
    currentItems = items;

    typeAhead.reset();
    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "c" }));
    expect(onMatch).toHaveBeenCalledWith(items[3], 3); // Cherry
  });

  it("should handle empty items array", () => {
    const typeAhead = createTypeAhead({
      items: () => [],
      getText: (item) => item.textContent ?? "",
      onMatch,
    });

    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "a" }));

    expect(onMatch).not.toHaveBeenCalled();
  });

  it("should handle items with empty text", () => {
    const emptyItem = document.createElement("div");
    emptyItem.textContent = "";
    const testItems = [emptyItem, ...items];

    const typeAhead = createTypeAhead({
      items: () => testItems,
      getText: (item) => item.textContent ?? "",
      onMatch,
    });

    typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "a" }));

    // Should skip empty item and match Apple
    expect(onMatch).toHaveBeenCalledWith(items[0], 1);
  });
});
