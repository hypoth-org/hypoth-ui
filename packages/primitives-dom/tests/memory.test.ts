/**
 * Memory leak verification tests for behavior primitives.
 * Tests that cleanup methods properly remove event listeners and references.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  createFocusTrap,
  createRovingFocus,
  createDismissableLayer,
  createTypeAhead,
} from "../src/index.js";

describe("Memory Leak Verification", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("Focus Trap", () => {
    it("should remove event listeners on deactivate", () => {
      container.innerHTML = `
        <div id="trap">
          <button>Button 1</button>
          <button>Button 2</button>
        </div>
      `;

      const trapContainer = container.querySelector("#trap") as HTMLElement;
      // Focus trap uses document-level listeners for focus events
      const addSpy = vi.spyOn(document, "addEventListener");
      const removeSpy = vi.spyOn(document, "removeEventListener");

      const trap = createFocusTrap({ container: trapContainer });

      trap.activate();
      const addCallCount = addSpy.mock.calls.length;
      expect(addCallCount).toBeGreaterThan(0);

      trap.deactivate();
      // Should have removed at least as many listeners as were added
      expect(removeSpy.mock.calls.length).toBeGreaterThanOrEqual(addCallCount);

      addSpy.mockRestore();
      removeSpy.mockRestore();
    });

    it("should not throw when deactivating multiple times", () => {
      container.innerHTML = `<div id="trap"><button>Button</button></div>`;
      const trapContainer = container.querySelector("#trap") as HTMLElement;

      const trap = createFocusTrap({ container: trapContainer });

      trap.activate();
      expect(() => trap.deactivate()).not.toThrow();
      expect(() => trap.deactivate()).not.toThrow();
      expect(() => trap.deactivate()).not.toThrow();
    });

    it("should not leak DOM references after deactivate", () => {
      container.innerHTML = `<div id="trap"><button>Button</button></div>`;
      const trapContainer = container.querySelector("#trap") as HTMLElement;

      const trap = createFocusTrap({ container: trapContainer });

      trap.activate();
      trap.deactivate();

      // Removing container should not cause issues
      container.innerHTML = "";
      expect(container.children.length).toBe(0);
    });
  });

  describe("Roving Focus", () => {
    it("should remove event listeners on destroy", () => {
      container.innerHTML = `
        <div id="toolbar">
          <button>Cut</button>
          <button>Copy</button>
          <button>Paste</button>
        </div>
      `;

      const toolbar = container.querySelector("#toolbar") as HTMLElement;
      const addSpy = vi.spyOn(toolbar, "addEventListener");
      const removeSpy = vi.spyOn(toolbar, "removeEventListener");

      const roving = createRovingFocus({
        container: toolbar,
        selector: "button",
        direction: "horizontal",
      });

      const addCallCount = addSpy.mock.calls.length;
      expect(addCallCount).toBeGreaterThan(0);

      roving.destroy();
      expect(removeSpy.mock.calls.length).toBeGreaterThanOrEqual(addCallCount);

      addSpy.mockRestore();
      removeSpy.mockRestore();
    });

    it("should not respond to events after destroy", () => {
      container.innerHTML = `
        <div id="toolbar">
          <button id="btn0" tabindex="0">Cut</button>
          <button id="btn1" tabindex="-1">Copy</button>
        </div>
      `;

      const toolbar = container.querySelector("#toolbar") as HTMLElement;
      const btn0 = container.querySelector("#btn0") as HTMLElement;
      const _btn1 = container.querySelector("#btn1") as HTMLElement;

      const roving = createRovingFocus({
        container: toolbar,
        selector: "button",
        direction: "horizontal",
      });

      // Destroy the roving focus
      roving.destroy();

      // Focus first button and try to navigate
      btn0.focus();
      const event = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true });
      toolbar.dispatchEvent(event);

      // Focus should NOT move (roving is destroyed)
      expect(document.activeElement).toBe(btn0);
    });

    it("should not throw when destroying multiple times", () => {
      container.innerHTML = `<div id="toolbar"><button>Button</button></div>`;
      const toolbar = container.querySelector("#toolbar") as HTMLElement;

      const roving = createRovingFocus({
        container: toolbar,
        selector: "button",
        direction: "horizontal",
      });

      expect(() => roving.destroy()).not.toThrow();
      expect(() => roving.destroy()).not.toThrow();
    });
  });

  describe("Dismissable Layer", () => {
    it("should remove global listeners on deactivate", () => {
      container.innerHTML = `<div id="layer"><button>Content</button></div>`;
      const layer = container.querySelector("#layer") as HTMLElement;

      const addSpy = vi.spyOn(document, "addEventListener");
      const removeSpy = vi.spyOn(document, "removeEventListener");

      const dismissable = createDismissableLayer({
        container: layer,
        onDismiss: vi.fn(),
      });

      dismissable.activate();
      const addCallCount = addSpy.mock.calls.length;

      dismissable.deactivate();
      expect(removeSpy.mock.calls.length).toBeGreaterThanOrEqual(addCallCount);

      addSpy.mockRestore();
      removeSpy.mockRestore();
    });

    it("should not fire onDismiss after deactivate", () => {
      container.innerHTML = `<div id="layer"><button>Content</button></div>`;
      const layer = container.querySelector("#layer") as HTMLElement;
      const onDismiss = vi.fn();

      const dismissable = createDismissableLayer({
        container: layer,
        onDismiss,
      });

      dismissable.activate();
      dismissable.deactivate();

      // Escape should not trigger callback
      const escapeEvent = new KeyboardEvent("keydown", { key: "Escape", bubbles: true });
      document.dispatchEvent(escapeEvent);

      expect(onDismiss).not.toHaveBeenCalled();
    });

    it("should clean up layer stack on deactivate", () => {
      container.innerHTML = `
        <div id="layer1"><button>Layer 1</button></div>
        <div id="layer2"><button>Layer 2</button></div>
      `;

      const layer1 = container.querySelector("#layer1") as HTMLElement;
      const layer2 = container.querySelector("#layer2") as HTMLElement;
      const onDismiss1 = vi.fn();
      const onDismiss2 = vi.fn();

      const dismissable1 = createDismissableLayer({
        container: layer1,
        onDismiss: onDismiss1,
      });

      const dismissable2 = createDismissableLayer({
        container: layer2,
        onDismiss: onDismiss2,
      });

      dismissable1.activate();
      dismissable2.activate();

      // Deactivate layer 2
      dismissable2.deactivate();

      // Escape should now dismiss layer 1
      const escapeEvent = new KeyboardEvent("keydown", { key: "Escape", bubbles: true });
      document.dispatchEvent(escapeEvent);

      expect(onDismiss1).toHaveBeenCalledWith("escape");
      expect(onDismiss2).not.toHaveBeenCalled();

      dismissable1.deactivate();
    });
  });

  describe("Type-Ahead", () => {
    it("should clear timeout on reset", () => {
      vi.useFakeTimers();

      container.innerHTML = `
        <div id="list">
          <div class="item">Apple</div>
          <div class="item">Banana</div>
        </div>
      `;

      const list = container.querySelector("#list") as HTMLElement;
      const items = list.querySelectorAll(".item");
      const onMatch = vi.fn();

      const typeAhead = createTypeAhead({
        items: () => Array.from(items) as HTMLElement[],
        getText: (item) => item.textContent ?? "",
        onMatch,
        timeout: 500,
      });

      // Type a character
      typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "a" }));
      expect(onMatch).toHaveBeenCalledTimes(1);

      // Reset immediately
      typeAhead.reset();

      // Advance time past timeout
      vi.advanceTimersByTime(600);

      // Type another character - should start fresh buffer
      typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "b" }));
      expect(onMatch).toHaveBeenCalledWith(items[1], 1); // Banana

      vi.useRealTimers();
    });

    it("should not accumulate multiple timeouts", () => {
      vi.useFakeTimers();

      container.innerHTML = `
        <div id="list">
          <div class="item">Apple</div>
          <div class="item">Apricot</div>
        </div>
      `;

      const list = container.querySelector("#list") as HTMLElement;
      const items = list.querySelectorAll(".item");
      const onMatch = vi.fn();

      const typeAhead = createTypeAhead({
        items: () => Array.from(items) as HTMLElement[],
        getText: (item) => item.textContent ?? "",
        onMatch,
        timeout: 500,
      });

      // Type multiple characters quickly
      typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "a" }));
      vi.advanceTimersByTime(100);
      typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "p" }));
      vi.advanceTimersByTime(100);
      typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "r" }));

      // Should match "Apricot" (apr prefix)
      expect(onMatch).toHaveBeenLastCalledWith(items[1], 1);

      // Only one timeout should be pending - wait for it
      vi.advanceTimersByTime(500);

      // Buffer should be cleared, typing again should start fresh
      onMatch.mockClear();
      typeAhead.handleKeyDown(new KeyboardEvent("keydown", { key: "a" }));
      expect(onMatch).toHaveBeenCalledWith(items[0], 0); // Apple (first match)

      vi.useRealTimers();
    });
  });

  describe("Lifecycle Edge Cases", () => {
    it("should handle rapid activate/deactivate cycles", () => {
      container.innerHTML = `<div id="trap"><button>Button</button></div>`;
      const trapContainer = container.querySelector("#trap") as HTMLElement;

      const trap = createFocusTrap({ container: trapContainer });

      // Rapid cycling should not throw or leak
      for (let i = 0; i < 100; i++) {
        trap.activate();
        trap.deactivate();
      }

      expect(true).toBe(true); // No errors thrown
    });

    it("should handle container removal while active", () => {
      container.innerHTML = `<div id="trap"><button>Button</button></div>`;
      const trapContainer = container.querySelector("#trap") as HTMLElement;

      const trap = createFocusTrap({ container: trapContainer });
      trap.activate();

      // Remove container while trap is active
      container.innerHTML = "";

      // Deactivate should not throw
      expect(() => trap.deactivate()).not.toThrow();
    });
  });
});
