import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createFocusTrap } from "../src/focus/focus-trap";

describe("createFocusTrap", () => {
  let container: HTMLDivElement;
  let button1: HTMLButtonElement;
  let button2: HTMLButtonElement;
  let input: HTMLInputElement;

  beforeEach(() => {
    container = document.createElement("div");
    button1 = document.createElement("button");
    button1.textContent = "Button 1";
    button2 = document.createElement("button");
    button2.textContent = "Button 2";
    input = document.createElement("input");
    input.type = "text";

    container.appendChild(button1);
    container.appendChild(input);
    container.appendChild(button2);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should create a focus trap with activate and deactivate methods", () => {
    const trap = createFocusTrap({ container });

    expect(typeof trap.activate).toBe("function");
    expect(typeof trap.deactivate).toBe("function");
  });

  it("should focus first focusable element on activate", () => {
    const trap = createFocusTrap({ container });

    trap.activate();

    expect(document.activeElement).toBe(button1);

    trap.deactivate();
  });

  it("should focus initial element if provided", () => {
    const trap = createFocusTrap({
      container,
      initialFocus: input,
    });

    trap.activate();

    expect(document.activeElement).toBe(input);

    trap.deactivate();
  });

  it("should trap focus within container on Tab", () => {
    const trap = createFocusTrap({ container });
    trap.activate();

    // Focus last element
    button2.focus();
    expect(document.activeElement).toBe(button2);

    // Tab should wrap to first element
    const tabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
    });
    document.dispatchEvent(tabEvent);

    // Focus should wrap to first element
    expect(document.activeElement).toBe(button1);

    trap.deactivate();
  });

  it("should trap focus within container on Shift+Tab", () => {
    const trap = createFocusTrap({ container });
    trap.activate();

    // Focus first element
    button1.focus();
    expect(document.activeElement).toBe(button1);

    // Shift+Tab should wrap to last element
    const shiftTabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
    });
    document.dispatchEvent(shiftTabEvent);

    expect(document.activeElement).toBe(button2);

    trap.deactivate();
  });

  it("should return focus to previous element on deactivate", () => {
    const outsideButton = document.createElement("button");
    document.body.appendChild(outsideButton);
    outsideButton.focus();

    const trap = createFocusTrap({ container, returnFocus: true });
    trap.activate();

    expect(document.activeElement).toBe(button1);

    trap.deactivate();

    expect(document.activeElement).toBe(outsideButton);

    document.body.removeChild(outsideButton);
  });

  it("should not return focus if returnFocus is false", () => {
    const outsideButton = document.createElement("button");
    document.body.appendChild(outsideButton);
    outsideButton.focus();

    const trap = createFocusTrap({ container, returnFocus: false });
    trap.activate();
    trap.deactivate();

    expect(document.activeElement).not.toBe(outsideButton);

    document.body.removeChild(outsideButton);
  });

  it("should skip disabled elements", () => {
    button1.disabled = true;

    const trap = createFocusTrap({ container });
    trap.activate();

    // Should focus first non-disabled element
    expect(document.activeElement).toBe(input);

    trap.deactivate();
    button1.disabled = false;
  });
});
