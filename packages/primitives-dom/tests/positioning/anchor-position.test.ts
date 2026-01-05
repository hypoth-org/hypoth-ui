import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createAnchorPosition,
  type Placement,
} from "../../src/positioning/anchor-position.js";

describe("createAnchorPosition", () => {
  let anchor: HTMLElement;
  let floating: HTMLElement;

  beforeEach(() => {
    // Create test elements
    anchor = document.createElement("button");
    anchor.style.position = "absolute";
    anchor.style.left = "100px";
    anchor.style.top = "100px";
    anchor.style.width = "100px";
    anchor.style.height = "40px";
    document.body.appendChild(anchor);

    floating = document.createElement("div");
    floating.style.width = "200px";
    floating.style.height = "150px";
    document.body.appendChild(floating);

    // Override getBoundingClientRect directly on instances
    anchor.getBoundingClientRect = () => ({
      top: 100,
      left: 100,
      bottom: 140,
      right: 200,
      width: 100,
      height: 40,
      x: 100,
      y: 100,
      toJSON: () => ({}),
    });

    floating.getBoundingClientRect = () => ({
      top: 0,
      left: 0,
      bottom: 150,
      right: 200,
      width: 200,
      height: 150,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    // Mock window dimensions
    Object.defineProperty(window, "innerWidth", { value: 1024, writable: true });
    Object.defineProperty(window, "innerHeight", { value: 768, writable: true });

    // Mock CSS.supports to return false (test JS fallback)
    // Store original for cleanup
    (globalThis as Record<string, unknown>).__originalCSSSupports = CSS.supports.bind(CSS);

    // Override using Object.defineProperty to ensure it works
    Object.defineProperty(CSS, "supports", {
      value: () => false,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    anchor.remove();
    floating.remove();
    vi.restoreAllMocks();
    // Restore CSS.supports
    const original = (globalThis as Record<string, unknown>).__originalCSSSupports as typeof CSS.supports;
    if (original) {
      Object.defineProperty(CSS, "supports", {
        value: original,
        writable: true,
        configurable: true,
      });
    }
  });

  it("should create an anchor position instance", () => {
    const position = createAnchorPosition({ anchor, floating });
    expect(position).toBeDefined();
    expect(typeof position.update).toBe("function");
    expect(typeof position.destroy).toBe("function");
    position.destroy();
  });

  it("should position floating element below anchor by default", () => {
    const onPositionChange = vi.fn();
    const position = createAnchorPosition({
      anchor,
      floating,
      placement: "bottom",
      offset: 8,
      onPositionChange,
    });

    expect(floating.style.position).toBe("fixed");
    // Callback should be called with correct placement
    expect(onPositionChange).toHaveBeenCalled();
    const result = onPositionChange.mock.calls[0][0];
    expect(result.placement).toBe("bottom");
    expect(typeof result.x).toBe("number");
    expect(typeof result.y).toBe("number");
    position.destroy();
  });

  it("should position floating element above anchor when placement is top", () => {
    const onPositionChange = vi.fn();
    const position = createAnchorPosition({
      anchor,
      floating,
      placement: "top",
      offset: 8,
      onPositionChange,
    });

    expect(onPositionChange).toHaveBeenCalled();
    const result = onPositionChange.mock.calls[0][0];
    expect(result.placement).toBe("top");
    expect(typeof result.x).toBe("number");
    expect(typeof result.y).toBe("number");
    position.destroy();
  });

  it("should handle start alignment", () => {
    const onPositionChange = vi.fn();
    const position = createAnchorPosition({
      anchor,
      floating,
      placement: "bottom-start",
      offset: 8,
      onPositionChange,
    });

    expect(onPositionChange).toHaveBeenCalled();
    const result = onPositionChange.mock.calls[0][0];
    expect(result.placement).toBe("bottom-start");
    position.destroy();
  });

  it("should handle end alignment", () => {
    const onPositionChange = vi.fn();
    const position = createAnchorPosition({
      anchor,
      floating,
      placement: "bottom-end",
      offset: 8,
      onPositionChange,
    });

    expect(onPositionChange).toHaveBeenCalled();
    const result = onPositionChange.mock.calls[0][0];
    expect(result.placement).toBe("bottom-end");
    position.destroy();
  });

  it("should handle flip option", () => {
    const onPositionChange = vi.fn();
    const position = createAnchorPosition({
      anchor,
      floating,
      placement: "bottom",
      offset: 8,
      flip: true,
      onPositionChange,
    });

    // With CSS anchor positioning, flip is handled by the browser
    // Just verify the API works
    expect(onPositionChange).toHaveBeenCalled();
    const result = onPositionChange.mock.calls[0][0];
    expect(typeof result.placement).toBe("string");
    position.destroy();
  });

  it("should respect flip disabled option", () => {
    const onPositionChange = vi.fn();
    const position = createAnchorPosition({
      anchor,
      floating,
      placement: "bottom",
      offset: 8,
      flip: false,
      onPositionChange,
    });

    // Should keep bottom placement
    expect(onPositionChange).toHaveBeenCalled();
    const result = onPositionChange.mock.calls[0][0];
    expect(result.placement).toBe("bottom");
    position.destroy();
  });

  it("should update position when update() is called", () => {
    const onPositionChange = vi.fn();
    const position = createAnchorPosition({
      anchor,
      floating,
      placement: "bottom",
      onPositionChange,
    });

    // Clear initial call
    onPositionChange.mockClear();

    const result = position.update();

    expect(onPositionChange).toHaveBeenCalledTimes(1);
    expect(typeof result.x).toBe("number");
    expect(typeof result.y).toBe("number");
    expect(result.placement).toBe("bottom");
    position.destroy();
  });

  it("should clean up styles on destroy", () => {
    const position = createAnchorPosition({ anchor, floating });

    // Verify styles are applied
    expect(floating.style.position).toBe("fixed");

    position.destroy();

    // Verify styles are removed
    expect(floating.style.position).toBe("");
    expect(floating.style.left).toBe("");
    expect(floating.style.top).toBe("");
  });

  it("should handle left placement", () => {
    const onPositionChange = vi.fn();
    const position = createAnchorPosition({
      anchor,
      floating,
      placement: "left",
      offset: 8,
      onPositionChange,
    });

    expect(onPositionChange).toHaveBeenCalled();
    const result = onPositionChange.mock.calls[0][0];
    expect(result.placement).toBe("left");
    expect(typeof result.x).toBe("number");
    expect(typeof result.y).toBe("number");
    position.destroy();
  });

  it("should handle right placement", () => {
    const onPositionChange = vi.fn();
    const position = createAnchorPosition({
      anchor,
      floating,
      placement: "right",
      offset: 8,
      onPositionChange,
    });

    expect(onPositionChange).toHaveBeenCalled();
    const result = onPositionChange.mock.calls[0][0];
    expect(result.placement).toBe("right");
    expect(typeof result.x).toBe("number");
    expect(typeof result.y).toBe("number");
    position.destroy();
  });

  it("should apply fixed positioning", () => {
    const position = createAnchorPosition({
      anchor,
      floating,
      placement: "bottom",
      offset: 8,
    });

    expect(floating.style.position).toBe("fixed");
    position.destroy();
  });

  describe("placement variations", () => {
    const placements: Placement[] = [
      "top",
      "top-start",
      "top-end",
      "bottom",
      "bottom-start",
      "bottom-end",
      "left",
      "left-start",
      "left-end",
      "right",
      "right-start",
      "right-end",
    ];

    placements.forEach((placement) => {
      it(`should handle ${placement} placement`, () => {
        const position = createAnchorPosition({
          anchor,
          floating,
          placement,
          offset: 8,
        });

        expect(floating.style.position).toBe("fixed");
        position.destroy();
      });
    });
  });
});
