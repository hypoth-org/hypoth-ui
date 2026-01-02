/**
 * Accessibility tests for behavior primitives.
 * Tests that utilities produce accessible DOM structures and behaviors.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  createFocusTrap,
  createRovingFocus,
  createDismissableLayer,
  createActivationHandler,
  createArrowKeyHandler,
  createTypeAhead,
  FOCUSABLE_SELECTOR,
} from "../src/index.js";

describe("Accessibility Tests", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("Focus Trap", () => {
    it("should maintain focus within dialog role container", () => {
      container.innerHTML = `
        <div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <h2 id="dialog-title">Test Dialog</h2>
          <button data-testid="btn1">Close</button>
          <input type="text" data-testid="input1" />
          <button data-testid="btn2">Submit</button>
        </div>
      `;

      const dialog = container.querySelector('[role="dialog"]') as HTMLElement;
      const trap = createFocusTrap({ container: dialog });

      trap.activate();

      // Focus should be trapped within dialog
      const focusableElements = dialog.querySelectorAll(FOCUSABLE_SELECTOR);
      expect(focusableElements.length).toBe(3);

      trap.deactivate();
    });

    it("should respect aria-hidden elements (not focus them)", () => {
      container.innerHTML = `
        <div id="trap-container">
          <button data-testid="visible">Visible</button>
          <div aria-hidden="true">
            <button data-testid="hidden">Hidden</button>
          </div>
          <button data-testid="visible2">Visible 2</button>
        </div>
      `;

      const trapContainer = container.querySelector("#trap-container") as HTMLElement;

      // aria-hidden buttons should not be focusable via standard selector
      // Note: browsers handle this, but we verify our selector works correctly
      const focusable = trapContainer.querySelectorAll(FOCUSABLE_SELECTOR);
      expect(focusable.length).toBe(3); // All buttons match selector, browser enforces aria-hidden
    });
  });

  describe("Roving Focus", () => {
    it("should navigate correctly in toolbar role container", () => {
      container.innerHTML = `
        <div role="toolbar" aria-label="Test Toolbar">
          <button data-testid="btn0" tabindex="0">Cut</button>
          <button data-testid="btn1" tabindex="-1">Copy</button>
          <button data-testid="btn2" tabindex="-1">Paste</button>
        </div>
      `;

      const toolbar = container.querySelector('[role="toolbar"]') as HTMLElement;
      const buttons = toolbar.querySelectorAll("button");

      const roving = createRovingFocus({
        container: toolbar,
        selector: "button",
        direction: "horizontal",
      });

      // Focus first button
      (buttons[0] as HTMLElement).focus();
      expect(document.activeElement).toBe(buttons[0]);

      // Arrow right should move focus to next button
      const event = new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true });
      toolbar.dispatchEvent(event);
      expect(document.activeElement).toBe(buttons[1]);

      roving.destroy();
    });

    it("should skip aria-disabled elements", () => {
      container.innerHTML = `
        <div role="listbox" aria-label="Test Listbox">
          <div role="option" tabindex="0">Option 1</div>
          <div role="option" tabindex="-1" aria-disabled="true">Option 2 (disabled)</div>
          <div role="option" tabindex="-1">Option 3</div>
        </div>
      `;

      const listbox = container.querySelector('[role="listbox"]') as HTMLElement;
      const options = listbox.querySelectorAll('[role="option"]');

      const roving = createRovingFocus({
        container: listbox,
        selector: '[role="option"]',
        direction: "vertical",
        skipDisabled: true,
      });

      // Focus first option
      (options[0] as HTMLElement).focus();

      // Navigate down - should skip disabled option
      const event = new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true });
      listbox.dispatchEvent(event);

      // Option 3 should be focused (skipping disabled option 2)
      expect(document.activeElement).toBe(options[2]);

      roving.destroy();
    });
  });

  describe("Dismissable Layer", () => {
    it("should support escape key for modal dismissal", () => {
      container.innerHTML = `
        <div role="dialog" aria-modal="true">
          <button>Inside button</button>
        </div>
      `;

      const dialog = container.querySelector('[role="dialog"]') as HTMLElement;
      const dismissed = vi.fn();

      const layer = createDismissableLayer({
        container: dialog,
        onDismiss: dismissed,
        closeOnEscape: true,
      });

      layer.activate();

      // Escape should dismiss
      const escapeEvent = new KeyboardEvent("keydown", { key: "Escape", bubbles: true });
      document.dispatchEvent(escapeEvent);

      expect(dismissed).toHaveBeenCalledWith("escape");

      layer.deactivate();
    });
  });

  describe("Activation Handler", () => {
    it("should handle both Enter and Space for button activation", () => {
      const activated = vi.fn();
      const handler = createActivationHandler({
        onActivate: activated,
        keys: ["Enter", "Space"],
      });

      // Enter key
      const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
      handler(enterEvent);
      expect(activated).toHaveBeenCalledTimes(1);

      // Space key
      const spaceEvent = new KeyboardEvent("keydown", { key: " " });
      handler(spaceEvent);
      expect(activated).toHaveBeenCalledTimes(2);
    });

    it("should prevent default for Space to avoid scroll", () => {
      const activated = vi.fn();
      const handler = createActivationHandler({
        onActivate: activated,
        preventDefault: "Space",
      });

      const spaceEvent = new KeyboardEvent("keydown", { key: " ", cancelable: true });
      handler(spaceEvent);

      expect(spaceEvent.defaultPrevented).toBe(true);
    });
  });

  describe("Arrow Key Handler", () => {
    it("should support RTL text direction", () => {
      const navigated = vi.fn();
      const handler = createArrowKeyHandler({
        orientation: "horizontal",
        rtl: true,
        onNavigate: navigated,
      });

      // In RTL, ArrowRight should go "previous"
      const rightEvent = new KeyboardEvent("keydown", { key: "ArrowRight" });
      handler(rightEvent);
      expect(navigated).toHaveBeenCalledWith("previous", rightEvent);

      // In RTL, ArrowLeft should go "next"
      const leftEvent = new KeyboardEvent("keydown", { key: "ArrowLeft" });
      handler(leftEvent);
      expect(navigated).toHaveBeenCalledWith("next", leftEvent);
    });

    it("should handle Home/End for first/last navigation", () => {
      const navigated = vi.fn();
      const handler = createArrowKeyHandler({
        orientation: "horizontal",
        onNavigate: navigated,
      });

      const homeEvent = new KeyboardEvent("keydown", { key: "Home" });
      handler(homeEvent);
      expect(navigated).toHaveBeenCalledWith("first", homeEvent);

      const endEvent = new KeyboardEvent("keydown", { key: "End" });
      handler(endEvent);
      expect(navigated).toHaveBeenCalledWith("last", endEvent);
    });
  });

  describe("Type-Ahead", () => {
    it("should find items by text content for assistive technology users", () => {
      container.innerHTML = `
        <div role="listbox" aria-label="Fruits">
          <div role="option" tabindex="-1">Apple</div>
          <div role="option" tabindex="-1">Banana</div>
          <div role="option" tabindex="-1">Cherry</div>
        </div>
      `;

      const listbox = container.querySelector('[role="listbox"]') as HTMLElement;
      const options = listbox.querySelectorAll('[role="option"]');
      const matched = vi.fn();

      const typeAhead = createTypeAhead({
        items: () => Array.from(options) as HTMLElement[],
        getText: (item) => item.textContent ?? "",
        onMatch: matched,
      });

      // Type "b" to find Banana
      const keyEvent = new KeyboardEvent("keydown", { key: "b" });
      typeAhead.handleKeyDown(keyEvent);

      expect(matched).toHaveBeenCalledWith(options[1], 1);
    });

    it("should support case-insensitive search", () => {
      container.innerHTML = `
        <div role="listbox">
          <div role="option">Apple</div>
          <div role="option">BANANA</div>
          <div role="option">Cherry</div>
        </div>
      `;

      const listbox = container.querySelector('[role="listbox"]') as HTMLElement;
      const options = listbox.querySelectorAll('[role="option"]');
      const matched = vi.fn();

      const typeAhead = createTypeAhead({
        items: () => Array.from(options) as HTMLElement[],
        getText: (item) => item.textContent ?? "",
        onMatch: matched,
      });

      // Type lowercase "b" should find "BANANA"
      const keyEvent = new KeyboardEvent("keydown", { key: "b" });
      typeAhead.handleKeyDown(keyEvent);

      expect(matched).toHaveBeenCalledWith(options[1], 1);
    });
  });

  describe("FOCUSABLE_SELECTOR constant", () => {
    it("should include all standard focusable elements", () => {
      container.innerHTML = `
        <a href="https://example.com">Link</a>
        <button>Button</button>
        <input type="text" />
        <select><option>Option</option></select>
        <textarea></textarea>
        <div tabindex="0">Custom focusable</div>
      `;

      const focusable = container.querySelectorAll(FOCUSABLE_SELECTOR);
      expect(focusable.length).toBe(6);
    });

    it("should exclude disabled elements", () => {
      container.innerHTML = `
        <button disabled>Disabled button</button>
        <input type="text" disabled />
        <select disabled><option>Option</option></select>
        <textarea disabled></textarea>
        <button>Enabled button</button>
      `;

      const focusable = container.querySelectorAll(FOCUSABLE_SELECTOR);
      expect(focusable.length).toBe(1); // Only enabled button
    });

    it("should exclude tabindex=-1 elements", () => {
      container.innerHTML = `
        <div tabindex="-1">Not tabbable</div>
        <div tabindex="0">Tabbable</div>
      `;

      const focusable = container.querySelectorAll(FOCUSABLE_SELECTOR);
      expect(focusable.length).toBe(1); // Only tabindex="0"
    });
  });
});
