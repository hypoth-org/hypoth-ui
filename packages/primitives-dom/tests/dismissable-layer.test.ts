import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDismissableLayer } from "../src/layer/dismissable-layer";

describe("createDismissableLayer", () => {
  let container: HTMLDivElement;
  let onDismiss: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    container = document.createElement("div");
    container.setAttribute("data-testid", "layer");
    document.body.appendChild(container);
    onDismiss = vi.fn();
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should create a dismissable layer with activate and deactivate methods", () => {
    const layer = createDismissableLayer({
      container,
      onDismiss,
    });

    expect(typeof layer.activate).toBe("function");
    expect(typeof layer.deactivate).toBe("function");
  });

  describe("Escape key dismissal", () => {
    it("should call onDismiss with 'escape' when Escape is pressed", () => {
      const layer = createDismissableLayer({
        container,
        onDismiss,
      });

      layer.activate();

      const event = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
      });
      document.dispatchEvent(event);

      expect(onDismiss).toHaveBeenCalledWith("escape");

      layer.deactivate();
    });

    it("should not call onDismiss when closeOnEscape is false", () => {
      const layer = createDismissableLayer({
        container,
        onDismiss,
        closeOnEscape: false,
      });

      layer.activate();

      const event = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
      });
      document.dispatchEvent(event);

      expect(onDismiss).not.toHaveBeenCalled();

      layer.deactivate();
    });

    it("should not call onDismiss when layer is not active", () => {
      const _layer = createDismissableLayer({
        container,
        onDismiss,
      });

      // Don't activate - layer is intentionally unused

      const event = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
      });
      document.dispatchEvent(event);

      expect(onDismiss).not.toHaveBeenCalled();
    });
  });

  describe("outside click dismissal", () => {
    it("should call onDismiss with 'outside-click' when clicking outside", () => {
      const layer = createDismissableLayer({
        container,
        onDismiss,
      });

      layer.activate();

      const event = new MouseEvent("pointerdown", {
        bubbles: true,
      });
      document.body.dispatchEvent(event);

      expect(onDismiss).toHaveBeenCalledWith("outside-click");

      layer.deactivate();
    });

    it("should not call onDismiss when clicking inside container", () => {
      const layer = createDismissableLayer({
        container,
        onDismiss,
      });

      layer.activate();

      const event = new MouseEvent("pointerdown", {
        bubbles: true,
      });
      container.dispatchEvent(event);

      expect(onDismiss).not.toHaveBeenCalled();

      layer.deactivate();
    });

    it("should not call onDismiss when closeOnOutsideClick is false", () => {
      const layer = createDismissableLayer({
        container,
        onDismiss,
        closeOnOutsideClick: false,
      });

      layer.activate();

      const event = new MouseEvent("pointerdown", {
        bubbles: true,
      });
      document.body.dispatchEvent(event);

      expect(onDismiss).not.toHaveBeenCalled();

      layer.deactivate();
    });
  });

  describe("excludeElements", () => {
    it("should not dismiss when clicking on excluded element", () => {
      const trigger = document.createElement("button");
      document.body.appendChild(trigger);

      const layer = createDismissableLayer({
        container,
        onDismiss,
        excludeElements: [trigger],
      });

      layer.activate();

      const event = new MouseEvent("pointerdown", {
        bubbles: true,
      });
      trigger.dispatchEvent(event);

      expect(onDismiss).not.toHaveBeenCalled();

      layer.deactivate();
      document.body.removeChild(trigger);
    });

    it("should not dismiss when clicking on child of excluded element", () => {
      const trigger = document.createElement("button");
      const icon = document.createElement("span");
      trigger.appendChild(icon);
      document.body.appendChild(trigger);

      const layer = createDismissableLayer({
        container,
        onDismiss,
        excludeElements: [trigger],
      });

      layer.activate();

      const event = new MouseEvent("pointerdown", {
        bubbles: true,
      });
      icon.dispatchEvent(event);

      expect(onDismiss).not.toHaveBeenCalled();

      layer.deactivate();
      document.body.removeChild(trigger);
    });
  });

  describe("layer stacking (LIFO)", () => {
    it("should only dismiss the topmost layer on Escape", () => {
      const onDismiss1 = vi.fn();
      const onDismiss2 = vi.fn();

      const container1 = document.createElement("div");
      const container2 = document.createElement("div");
      document.body.appendChild(container1);
      document.body.appendChild(container2);

      const layer1 = createDismissableLayer({
        container: container1,
        onDismiss: onDismiss1,
      });

      const layer2 = createDismissableLayer({
        container: container2,
        onDismiss: onDismiss2,
      });

      layer1.activate();
      layer2.activate();

      const event = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
      });
      document.dispatchEvent(event);

      // Only layer2 (topmost) should be dismissed
      expect(onDismiss2).toHaveBeenCalledWith("escape");
      expect(onDismiss1).not.toHaveBeenCalled();

      layer1.deactivate();
      layer2.deactivate();
      document.body.removeChild(container1);
      document.body.removeChild(container2);
    });

    it("should dismiss second layer after first is removed", () => {
      const onDismiss1 = vi.fn();
      const onDismiss2 = vi.fn();

      const container1 = document.createElement("div");
      const container2 = document.createElement("div");
      document.body.appendChild(container1);
      document.body.appendChild(container2);

      const layer1 = createDismissableLayer({
        container: container1,
        onDismiss: onDismiss1,
      });

      const layer2 = createDismissableLayer({
        container: container2,
        onDismiss: onDismiss2,
      });

      layer1.activate();
      layer2.activate();

      // Dismiss layer2
      layer2.deactivate();

      const event = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
      });
      document.dispatchEvent(event);

      // Now layer1 should be dismissed
      expect(onDismiss1).toHaveBeenCalledWith("escape");

      layer1.deactivate();
      document.body.removeChild(container1);
      document.body.removeChild(container2);
    });

    it("should only dismiss topmost layer on outside click", () => {
      const onDismiss1 = vi.fn();
      const onDismiss2 = vi.fn();

      const container1 = document.createElement("div");
      const container2 = document.createElement("div");
      document.body.appendChild(container1);
      document.body.appendChild(container2);

      const layer1 = createDismissableLayer({
        container: container1,
        onDismiss: onDismiss1,
      });

      const layer2 = createDismissableLayer({
        container: container2,
        onDismiss: onDismiss2,
      });

      layer1.activate();
      layer2.activate();

      const event = new MouseEvent("pointerdown", {
        bubbles: true,
      });
      document.body.dispatchEvent(event);

      // Only layer2 (topmost) should be dismissed
      expect(onDismiss2).toHaveBeenCalledWith("outside-click");
      expect(onDismiss1).not.toHaveBeenCalled();

      layer1.deactivate();
      layer2.deactivate();
      document.body.removeChild(container1);
      document.body.removeChild(container2);
    });
  });

  describe("cleanup", () => {
    it("should remove event listeners on deactivate", () => {
      const layer = createDismissableLayer({
        container,
        onDismiss,
      });

      layer.activate();
      layer.deactivate();

      const event = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
      });
      document.dispatchEvent(event);

      expect(onDismiss).not.toHaveBeenCalled();
    });

    it("should not call onDismiss multiple times for same event", () => {
      const layer = createDismissableLayer({
        container,
        onDismiss,
      });

      layer.activate();

      const event = new KeyboardEvent("keydown", {
        key: "Escape",
        bubbles: true,
      });
      document.dispatchEvent(event);
      document.dispatchEvent(event);

      // First event dismisses, second should not trigger (already deactivated)
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });
});
