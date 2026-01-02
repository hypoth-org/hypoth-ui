import { describe, expect, it, vi } from "vitest";
import { createActivationHandler } from "../src/keyboard/activation";

describe("createActivationHandler", () => {
  it("should call onActivate when Enter is pressed", () => {
    const onActivate = vi.fn();
    const handler = createActivationHandler({ onActivate });

    const event = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
    });
    handler(event);

    expect(onActivate).toHaveBeenCalledWith(event);
  });

  it("should call onActivate when Space is pressed", () => {
    const onActivate = vi.fn();
    const handler = createActivationHandler({ onActivate });

    const event = new KeyboardEvent("keydown", {
      key: " ",
      bubbles: true,
    });
    handler(event);

    expect(onActivate).toHaveBeenCalledWith(event);
  });

  it("should not call onActivate for other keys", () => {
    const onActivate = vi.fn();
    const handler = createActivationHandler({ onActivate });

    const event = new KeyboardEvent("keydown", {
      key: "a",
      bubbles: true,
    });
    handler(event);

    expect(onActivate).not.toHaveBeenCalled();
  });

  it("should only activate on specified keys", () => {
    const onActivate = vi.fn();
    const handler = createActivationHandler({
      onActivate,
      keys: ["Enter"],
    });

    const enterEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
    });
    handler(enterEvent);

    const spaceEvent = new KeyboardEvent("keydown", {
      key: " ",
      bubbles: true,
    });
    handler(spaceEvent);

    expect(onActivate).toHaveBeenCalledTimes(1);
    expect(onActivate).toHaveBeenCalledWith(enterEvent);
  });

  it("should prevent default for Space by default", () => {
    const onActivate = vi.fn();
    const handler = createActivationHandler({ onActivate });

    const spaceEvent = new KeyboardEvent("keydown", {
      key: " ",
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(spaceEvent, "preventDefault");

    handler(spaceEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("should not prevent default for Enter by default", () => {
    const onActivate = vi.fn();
    const handler = createActivationHandler({ onActivate });

    const enterEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(enterEvent, "preventDefault");

    handler(enterEvent);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it("should prevent default for all keys when preventDefault is true", () => {
    const onActivate = vi.fn();
    const handler = createActivationHandler({
      onActivate,
      preventDefault: true,
    });

    const enterEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(enterEvent, "preventDefault");

    handler(enterEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it("should not prevent default when preventDefault is false", () => {
    const onActivate = vi.fn();
    const handler = createActivationHandler({
      onActivate,
      preventDefault: false,
    });

    const spaceEvent = new KeyboardEvent("keydown", {
      key: " ",
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(spaceEvent, "preventDefault");

    handler(spaceEvent);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });
});
