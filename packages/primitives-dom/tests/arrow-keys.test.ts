import { describe, expect, it, vi } from "vitest";
import { createArrowKeyHandler } from "../src/keyboard/arrow-keys";

describe("createArrowKeyHandler", () => {
  describe("horizontal orientation", () => {
    it("should call onNavigate with 'next' for ArrowRight", () => {
      const onNavigate = vi.fn();
      const handler = createArrowKeyHandler({
        orientation: "horizontal",
        onNavigate,
      });

      const event = new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
      });
      handler(event);

      expect(onNavigate).toHaveBeenCalledWith("next", event);
    });

    it("should call onNavigate with 'previous' for ArrowLeft", () => {
      const onNavigate = vi.fn();
      const handler = createArrowKeyHandler({
        orientation: "horizontal",
        onNavigate,
      });

      const event = new KeyboardEvent("keydown", {
        key: "ArrowLeft",
        bubbles: true,
      });
      handler(event);

      expect(onNavigate).toHaveBeenCalledWith("previous", event);
    });

    it("should not respond to ArrowUp/ArrowDown", () => {
      const onNavigate = vi.fn();
      const handler = createArrowKeyHandler({
        orientation: "horizontal",
        onNavigate,
      });

      handler(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
      handler(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

      expect(onNavigate).not.toHaveBeenCalled();
    });
  });

  describe("vertical orientation", () => {
    it("should call onNavigate with 'next' for ArrowDown", () => {
      const onNavigate = vi.fn();
      const handler = createArrowKeyHandler({
        orientation: "vertical",
        onNavigate,
      });

      const event = new KeyboardEvent("keydown", {
        key: "ArrowDown",
        bubbles: true,
      });
      handler(event);

      expect(onNavigate).toHaveBeenCalledWith("next", event);
    });

    it("should call onNavigate with 'previous' for ArrowUp", () => {
      const onNavigate = vi.fn();
      const handler = createArrowKeyHandler({
        orientation: "vertical",
        onNavigate,
      });

      const event = new KeyboardEvent("keydown", {
        key: "ArrowUp",
        bubbles: true,
      });
      handler(event);

      expect(onNavigate).toHaveBeenCalledWith("previous", event);
    });

    it("should not respond to ArrowLeft/ArrowRight", () => {
      const onNavigate = vi.fn();
      const handler = createArrowKeyHandler({
        orientation: "vertical",
        onNavigate,
      });

      handler(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
      handler(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));

      expect(onNavigate).not.toHaveBeenCalled();
    });
  });

  describe("both orientation", () => {
    it("should respond to all arrow keys", () => {
      const onNavigate = vi.fn();
      const handler = createArrowKeyHandler({
        orientation: "both",
        onNavigate,
      });

      handler(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
      handler(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
      handler(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
      handler(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));

      expect(onNavigate).toHaveBeenCalledTimes(4);
    });
  });

  describe("Home/End keys", () => {
    it("should call onNavigate with 'first' for Home", () => {
      const onNavigate = vi.fn();
      const handler = createArrowKeyHandler({
        orientation: "horizontal",
        onNavigate,
      });

      const event = new KeyboardEvent("keydown", {
        key: "Home",
        bubbles: true,
      });
      handler(event);

      expect(onNavigate).toHaveBeenCalledWith("first", event);
    });

    it("should call onNavigate with 'last' for End", () => {
      const onNavigate = vi.fn();
      const handler = createArrowKeyHandler({
        orientation: "horizontal",
        onNavigate,
      });

      const event = new KeyboardEvent("keydown", {
        key: "End",
        bubbles: true,
      });
      handler(event);

      expect(onNavigate).toHaveBeenCalledWith("last", event);
    });
  });

  describe("RTL support", () => {
    it("should swap ArrowRight/ArrowLeft in RTL mode", () => {
      const onNavigate = vi.fn();
      const handler = createArrowKeyHandler({
        orientation: "horizontal",
        rtl: true,
        onNavigate,
      });

      const rightEvent = new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
      });
      handler(rightEvent);

      const leftEvent = new KeyboardEvent("keydown", {
        key: "ArrowLeft",
        bubbles: true,
      });
      handler(leftEvent);

      expect(onNavigate).toHaveBeenNthCalledWith(1, "previous", rightEvent);
      expect(onNavigate).toHaveBeenNthCalledWith(2, "next", leftEvent);
    });

    it("should not affect vertical navigation in RTL", () => {
      const onNavigate = vi.fn();
      const handler = createArrowKeyHandler({
        orientation: "vertical",
        rtl: true,
        onNavigate,
      });

      const downEvent = new KeyboardEvent("keydown", {
        key: "ArrowDown",
        bubbles: true,
      });
      handler(downEvent);

      const upEvent = new KeyboardEvent("keydown", {
        key: "ArrowUp",
        bubbles: true,
      });
      handler(upEvent);

      expect(onNavigate).toHaveBeenNthCalledWith(1, "next", downEvent);
      expect(onNavigate).toHaveBeenNthCalledWith(2, "previous", upEvent);
    });

    it("should not affect Home/End in RTL", () => {
      const onNavigate = vi.fn();
      const handler = createArrowKeyHandler({
        orientation: "horizontal",
        rtl: true,
        onNavigate,
      });

      const homeEvent = new KeyboardEvent("keydown", {
        key: "Home",
        bubbles: true,
      });
      handler(homeEvent);

      const endEvent = new KeyboardEvent("keydown", {
        key: "End",
        bubbles: true,
      });
      handler(endEvent);

      expect(onNavigate).toHaveBeenNthCalledWith(1, "first", homeEvent);
      expect(onNavigate).toHaveBeenNthCalledWith(2, "last", endEvent);
    });
  });

  describe("event handling", () => {
    it("should prevent default for handled keys", () => {
      const onNavigate = vi.fn();
      const handler = createArrowKeyHandler({
        orientation: "horizontal",
        onNavigate,
      });

      const event = new KeyboardEvent("keydown", {
        key: "ArrowRight",
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(event, "preventDefault");

      handler(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it("should not prevent default for unhandled keys", () => {
      const onNavigate = vi.fn();
      const handler = createArrowKeyHandler({
        orientation: "horizontal",
        onNavigate,
      });

      const event = new KeyboardEvent("keydown", {
        key: "a",
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(event, "preventDefault");

      handler(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });
});
