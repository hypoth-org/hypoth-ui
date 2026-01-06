import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement, createRef, forwardRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Slot } from "../../src/primitives/slot.js";

afterEach(() => {
  cleanup();
});

describe("Slot", () => {
  describe("single child validation", () => {
    it("throws error when no children", () => {
      expect(() => {
        render(createElement(Slot));
      }).toThrow("Slot expects a single React element child");
    });

    it("throws error for text-only children", () => {
      expect(() => {
        render(createElement(Slot, null, "Just text"));
      }).toThrow("Slot expects a single React element child");
    });

    it("throws error for multiple children", () => {
      expect(() => {
        render(
          createElement(
            Slot,
            null,
            createElement("span", null, "A"),
            createElement("span", null, "B")
          )
        );
      }).toThrow("received multiple children");
    });

    it("renders single valid element child", () => {
      const { container } = render(
        createElement(Slot, null, createElement("button", { type: "button" }, "Click me"))
      );
      const button = container.querySelector("button");
      expect(button).not.toBeNull();
      expect(button?.textContent).toBe("Click me");
    });
  });

  describe("props merging", () => {
    it("concatenates classNames", () => {
      const { container } = render(
        createElement(
          Slot,
          { className: "slot-class" },
          createElement("div", { className: "child-class" }, "Content")
        )
      );
      const element = container.querySelector("div");
      expect(element?.className).toBe("slot-class child-class");
    });

    it("merges styles with child taking precedence", () => {
      const { container } = render(
        createElement(
          Slot,
          { style: { color: "red", fontSize: 16 } },
          createElement("div", { style: { color: "blue" } }, "Content")
        )
      );
      const element = container.querySelector("div");
      expect(element?.style.color).toBe("blue");
      expect(element?.style.fontSize).toBe("16px");
    });

    it("child props override slot props", () => {
      const { container } = render(
        createElement(
          Slot,
          { "data-x": "slot" },
          createElement("div", { "data-x": "child" }, "Content")
        )
      );
      const element = container.querySelector("div");
      expect(element?.getAttribute("data-x")).toBe("child");
    });

    it("preserves slot props not in child", () => {
      const { container } = render(
        createElement(Slot, { "data-slot": "true" }, createElement("div", null, "Content"))
      );
      const element = container.querySelector("div");
      expect(element?.getAttribute("data-slot")).toBe("true");
    });
  });

  describe("event handler composition", () => {
    it("calls both handlers with child first", async () => {
      const calls: string[] = [];
      const slotHandler = () => calls.push("slot");
      const childHandler = () => calls.push("child");

      const { container } = render(
        createElement(
          Slot,
          { onClick: slotHandler },
          createElement("button", { type: "button", onClick: childHandler }, "Click")
        )
      );

      const button = container.querySelector("button");
      if (button) {
        await userEvent.click(button);
      }
      expect(calls).toEqual(["child", "slot"]);
    });

    it("skips slot handler if child calls preventDefault", async () => {
      const calls: string[] = [];
      const slotHandler = () => calls.push("slot");
      const childHandler = (e: MouseEvent) => {
        e.preventDefault();
        calls.push("child");
      };

      const { container } = render(
        createElement(
          Slot,
          { onClick: slotHandler },
          createElement("button", { type: "button", onClick: childHandler }, "Click")
        )
      );

      const button = container.querySelector("button");
      if (button) {
        await userEvent.click(button);
      }
      expect(calls).toEqual(["child"]);
    });
  });

  describe("ref forwarding", () => {
    it("forwards ref to child element", () => {
      const ref = createRef<HTMLButtonElement>();

      render(createElement(Slot, { ref }, createElement("button", { type: "button" }, "Click")));

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.tagName).toBe("BUTTON");
    });

    it("merges slot ref and child ref", () => {
      const slotRef = createRef<HTMLButtonElement>();
      const childRef = createRef<HTMLButtonElement>();

      render(
        createElement(
          Slot,
          { ref: slotRef },
          createElement("button", { type: "button", ref: childRef }, "Click")
        )
      );

      expect(slotRef.current).toBe(childRef.current);
      expect(slotRef.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("handles callback refs", () => {
      let slotElement: HTMLButtonElement | null = null;
      let childElement: HTMLButtonElement | null = null;

      const slotRefCallback = (el: HTMLElement | null) => {
        slotElement = el as HTMLButtonElement;
      };
      const childRefCallback = (el: HTMLButtonElement | null) => {
        childElement = el;
      };

      render(
        createElement(
          Slot,
          { ref: slotRefCallback },
          createElement("button", { type: "button", ref: childRefCallback }, "Click")
        )
      );

      expect(slotElement).toBe(childElement);
      expect(slotElement).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe("non-forwardRef component warnings", () => {
    it("warns when custom component doesn't forward ref", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      // Component that doesn't forward ref
      function NonForwardingButton({ children }: { children: React.ReactNode }) {
        return createElement("button", { type: "button" }, children);
      }

      render(createElement(Slot, null, createElement(NonForwardingButton, null, "Click")));

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('The child component "NonForwardingButton" doesn\'t forward refs')
      );

      warnSpy.mockRestore();
    });

    it("does not warn when forwardRef component properly forwards ref", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      // Component that properly forwards ref
      const ForwardingButton = forwardRef<HTMLButtonElement, { children: React.ReactNode }>(
        ({ children }, ref) => createElement("button", { type: "button", ref }, children)
      );

      render(createElement(Slot, null, createElement(ForwardingButton, null, "Click")));

      expect(warnSpy).not.toHaveBeenCalled();

      warnSpy.mockRestore();
    });

    it("does not warn for intrinsic elements", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      render(createElement(Slot, null, createElement("button", { type: "button" }, "Click")));

      expect(warnSpy).not.toHaveBeenCalled();

      warnSpy.mockRestore();
    });
  });
});
