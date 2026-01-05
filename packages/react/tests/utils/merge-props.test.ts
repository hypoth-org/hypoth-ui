import { describe, expect, it, vi } from "vitest";
import {
  composeEventHandlers,
  mergeClassNames,
  mergeProps,
  mergeStyles,
} from "../../src/utils/merge-props.js";

describe("mergeClassNames", () => {
  it("merges two class names", () => {
    expect(mergeClassNames("foo", "bar")).toBe("foo bar");
  });

  it("filters out falsy values", () => {
    expect(mergeClassNames("foo", undefined, null, false, "bar")).toBe("foo bar");
  });

  it("returns empty string for no valid classes", () => {
    expect(mergeClassNames(undefined, null, false)).toBe("");
  });

  it("handles single class", () => {
    expect(mergeClassNames("foo")).toBe("foo");
  });
});

describe("mergeStyles", () => {
  it("returns undefined when both undefined", () => {
    expect(mergeStyles(undefined, undefined)).toBeUndefined();
  });

  it("returns parent style when child undefined", () => {
    const parent = { color: "red" };
    expect(mergeStyles(parent, undefined)).toEqual(parent);
  });

  it("returns child style when parent undefined", () => {
    const child = { color: "blue" };
    expect(mergeStyles(undefined, child)).toEqual(child);
  });

  it("merges styles with child taking precedence", () => {
    const parent = { color: "red", fontSize: 16 };
    const child = { color: "blue" };
    expect(mergeStyles(parent, child)).toEqual({ color: "blue", fontSize: 16 });
  });
});

describe("composeEventHandlers", () => {
  it("calls both handlers in order (child first)", () => {
    const calls: string[] = [];
    const parent = () => calls.push("parent");
    const child = () => calls.push("child");

    const composed = composeEventHandlers(parent, child);
    composed({ defaultPrevented: false } as Event);

    expect(calls).toEqual(["child", "parent"]);
  });

  it("skips parent when child calls preventDefault", () => {
    const calls: string[] = [];
    const parent = () => calls.push("parent");
    const child = () => calls.push("child");

    const composed = composeEventHandlers(parent, child);
    composed({ defaultPrevented: true } as Event);

    expect(calls).toEqual(["child"]);
  });

  it("handles undefined child handler", () => {
    const parent = vi.fn();
    const composed = composeEventHandlers(parent, undefined);
    composed({ defaultPrevented: false } as Event);

    expect(parent).toHaveBeenCalled();
  });

  it("handles undefined parent handler", () => {
    const child = vi.fn();
    const composed = composeEventHandlers(undefined, child);
    composed({ defaultPrevented: false } as Event);

    expect(child).toHaveBeenCalled();
  });
});

describe("mergeProps", () => {
  it("merges className by concatenation", () => {
    const result = mergeProps({ className: "slot-class" }, { className: "child-class" });
    expect(result.className).toBe("slot-class child-class");
  });

  it("merges style with child taking precedence", () => {
    const result = mergeProps(
      { style: { color: "red", fontSize: 16 } },
      { style: { color: "blue" } }
    );
    expect(result.style).toEqual({ color: "blue", fontSize: 16 });
  });

  it("composes event handlers", () => {
    const calls: string[] = [];
    const slotHandler = () => calls.push("slot");
    const childHandler = () => calls.push("child");

    const result = mergeProps({ onClick: slotHandler }, { onClick: childHandler });

    (result.onClick as (e: Event) => void)({ defaultPrevented: false } as Event);
    expect(calls).toEqual(["child", "slot"]);
  });

  it("child props override slot props for non-special keys", () => {
    const result = mergeProps({ "data-x": "slot" }, { "data-x": "child" });
    expect(result["data-x"]).toBe("child");
  });

  it("keeps slot props when child prop is undefined", () => {
    const result = mergeProps({ "data-x": "slot" }, {});
    expect(result["data-x"]).toBe("slot");
  });

  it("handles empty objects", () => {
    const result = mergeProps({}, {});
    expect(result).toEqual({});
  });
});
