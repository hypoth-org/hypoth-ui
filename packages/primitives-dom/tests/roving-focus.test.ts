import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRovingFocus } from "../src/keyboard/roving-focus";

describe("createRovingFocus", () => {
  let container: HTMLDivElement;
  let buttons: HTMLButtonElement[];

  beforeEach(() => {
    container = document.createElement("div");
    buttons = [];

    for (let i = 0; i < 4; i++) {
      const button = document.createElement("button");
      button.textContent = `Item ${i + 1}`;
      button.setAttribute("data-item", String(i));
      buttons.push(button);
      container.appendChild(button);
    }

    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should create roving focus with required methods", () => {
    const roving = createRovingFocus({
      container,
      selector: "button",
    });

    expect(typeof roving.setFocusedIndex).toBe("function");
    expect(typeof roving.getFocusedIndex).toBe("function");
    expect(typeof roving.destroy).toBe("function");

    roving.destroy();
  });

  it("should set initial tabindex values", () => {
    const roving = createRovingFocus({
      container,
      selector: "button",
    });

    expect(buttons[0].tabIndex).toBe(0);
    expect(buttons[1].tabIndex).toBe(-1);
    expect(buttons[2].tabIndex).toBe(-1);
    expect(buttons[3].tabIndex).toBe(-1);

    roving.destroy();
  });

  it("should move focus with ArrowRight in horizontal mode", () => {
    const roving = createRovingFocus({
      container,
      selector: "button",
      direction: "horizontal",
    });

    buttons[0].focus();

    const event = new KeyboardEvent("keydown", {
      key: "ArrowRight",
      bubbles: true,
    });
    container.dispatchEvent(event);

    expect(document.activeElement).toBe(buttons[1]);
    expect(roving.getFocusedIndex()).toBe(1);

    roving.destroy();
  });

  it("should move focus with ArrowLeft in horizontal mode", () => {
    const roving = createRovingFocus({
      container,
      selector: "button",
      direction: "horizontal",
    });

    buttons[1].focus();
    roving.setFocusedIndex(1);

    const event = new KeyboardEvent("keydown", {
      key: "ArrowLeft",
      bubbles: true,
    });
    container.dispatchEvent(event);

    expect(document.activeElement).toBe(buttons[0]);

    roving.destroy();
  });

  it("should move focus with ArrowDown in vertical mode", () => {
    const roving = createRovingFocus({
      container,
      selector: "button",
      direction: "vertical",
    });

    buttons[0].focus();

    const event = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
    });
    container.dispatchEvent(event);

    expect(document.activeElement).toBe(buttons[1]);

    roving.destroy();
  });

  it("should move focus with ArrowUp in vertical mode", () => {
    const roving = createRovingFocus({
      container,
      selector: "button",
      direction: "vertical",
    });

    roving.setFocusedIndex(2);

    const event = new KeyboardEvent("keydown", {
      key: "ArrowUp",
      bubbles: true,
    });
    container.dispatchEvent(event);

    expect(document.activeElement).toBe(buttons[1]);

    roving.destroy();
  });

  it("should loop focus when reaching the end", () => {
    const roving = createRovingFocus({
      container,
      selector: "button",
      direction: "horizontal",
      loop: true,
    });

    roving.setFocusedIndex(3);

    const event = new KeyboardEvent("keydown", {
      key: "ArrowRight",
      bubbles: true,
    });
    container.dispatchEvent(event);

    expect(document.activeElement).toBe(buttons[0]);

    roving.destroy();
  });

  it("should loop focus when reaching the beginning", () => {
    const roving = createRovingFocus({
      container,
      selector: "button",
      direction: "horizontal",
      loop: true,
    });

    buttons[0].focus();

    const event = new KeyboardEvent("keydown", {
      key: "ArrowLeft",
      bubbles: true,
    });
    container.dispatchEvent(event);

    expect(document.activeElement).toBe(buttons[3]);

    roving.destroy();
  });

  it("should not loop focus when loop is false", () => {
    const roving = createRovingFocus({
      container,
      selector: "button",
      direction: "horizontal",
      loop: false,
    });

    roving.setFocusedIndex(3);

    const event = new KeyboardEvent("keydown", {
      key: "ArrowRight",
      bubbles: true,
    });
    container.dispatchEvent(event);

    expect(document.activeElement).toBe(buttons[3]);

    roving.destroy();
  });

  it("should focus first element on Home key", () => {
    const roving = createRovingFocus({
      container,
      selector: "button",
    });

    roving.setFocusedIndex(2);

    const event = new KeyboardEvent("keydown", {
      key: "Home",
      bubbles: true,
    });
    container.dispatchEvent(event);

    expect(document.activeElement).toBe(buttons[0]);

    roving.destroy();
  });

  it("should focus last element on End key", () => {
    const roving = createRovingFocus({
      container,
      selector: "button",
    });

    buttons[0].focus();

    const event = new KeyboardEvent("keydown", {
      key: "End",
      bubbles: true,
    });
    container.dispatchEvent(event);

    expect(document.activeElement).toBe(buttons[3]);

    roving.destroy();
  });

  it("should call onFocus callback", () => {
    const onFocus = vi.fn();
    const roving = createRovingFocus({
      container,
      selector: "button",
      onFocus,
    });

    roving.setFocusedIndex(2);

    expect(onFocus).toHaveBeenCalledWith(buttons[2], 2);

    roving.destroy();
  });

  it("should update tabindex on direct focus", () => {
    const roving = createRovingFocus({
      container,
      selector: "button",
    });

    buttons[2].focus();
    const event = new FocusEvent("focusin", { bubbles: true });
    container.dispatchEvent(event);

    expect(buttons[0].tabIndex).toBe(-1);
    expect(buttons[2].tabIndex).toBe(0);

    roving.destroy();
  });

  it("should cleanup event listeners on destroy", () => {
    const roving = createRovingFocus({
      container,
      selector: "button",
    });

    roving.destroy();

    buttons[0].focus();
    const event = new KeyboardEvent("keydown", {
      key: "ArrowRight",
      bubbles: true,
    });
    container.dispatchEvent(event);

    // Should not move focus after destroy
    expect(document.activeElement).toBe(buttons[0]);
  });

  describe("skipDisabled", () => {
    it("should skip disabled elements when skipDisabled is true", () => {
      buttons[1].disabled = true;

      const roving = createRovingFocus({
        container,
        selector: "button",
        direction: "horizontal",
        skipDisabled: true,
      });

      buttons[0].focus();

      const event = new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
      });
      container.dispatchEvent(event);

      // Should skip buttons[1] (disabled) and go to buttons[2]
      expect(document.activeElement).toBe(buttons[2]);

      roving.destroy();
      buttons[1].disabled = false;
    });

    it('should skip aria-disabled="true" elements when skipDisabled is true', () => {
      buttons[1].setAttribute("aria-disabled", "true");

      const roving = createRovingFocus({
        container,
        selector: "button",
        direction: "horizontal",
        skipDisabled: true,
      });

      buttons[0].focus();

      const event = new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
      });
      container.dispatchEvent(event);

      // Should skip buttons[1] (aria-disabled) and go to buttons[2]
      expect(document.activeElement).toBe(buttons[2]);

      roving.destroy();
      buttons[1].removeAttribute("aria-disabled");
    });

    it("should not skip disabled elements when skipDisabled is false", () => {
      buttons[1].disabled = true;

      const roving = createRovingFocus({
        container,
        selector: "button",
        direction: "horizontal",
        skipDisabled: false,
      });

      buttons[0].focus();

      const event = new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
      });
      container.dispatchEvent(event);

      // Should focus disabled element
      expect(document.activeElement).toBe(buttons[1]);

      roving.destroy();
      buttons[1].disabled = false;
    });

    it("should skip multiple consecutive disabled elements", () => {
      buttons[1].disabled = true;
      buttons[2].disabled = true;

      const roving = createRovingFocus({
        container,
        selector: "button",
        direction: "horizontal",
        skipDisabled: true,
      });

      buttons[0].focus();

      const event = new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
      });
      container.dispatchEvent(event);

      // Should skip buttons[1] and buttons[2] (disabled) and go to buttons[3]
      expect(document.activeElement).toBe(buttons[3]);

      roving.destroy();
      buttons[1].disabled = false;
      buttons[2].disabled = false;
    });

    it("should wrap around disabled elements when looping", () => {
      buttons[0].disabled = true;

      const roving = createRovingFocus({
        container,
        selector: "button",
        direction: "horizontal",
        skipDisabled: true,
        loop: true,
      });

      roving.setFocusedIndex(3);

      const event = new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
      });
      container.dispatchEvent(event);

      // Should wrap around and skip disabled buttons[0], landing on buttons[1]
      expect(document.activeElement).toBe(buttons[1]);

      roving.destroy();
      buttons[0].disabled = false;
    });
  });
});
