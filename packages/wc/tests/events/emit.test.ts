import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { emitEvent, StandardEvents } from "../../src/events/emit.js";

describe("emitEvent", () => {
  let element: HTMLDivElement;

  beforeEach(() => {
    element = document.createElement("div");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("should dispatch event with ds: prefix", () => {
    const handler = vi.fn();
    element.addEventListener("ds:test", handler);

    emitEvent(element, "test");

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should include detail in event", () => {
    const handler = vi.fn();
    element.addEventListener("ds:change", handler);

    const detail = { value: "test-value" };
    emitEvent(element, "change", { detail });

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0][0] as CustomEvent;
    expect(event.detail).toEqual(detail);
  });

  it("should bubble by default", () => {
    const parent = document.createElement("div");
    parent.appendChild(element);
    document.body.appendChild(parent);

    const handler = vi.fn();
    parent.addEventListener("ds:test", handler);

    emitEvent(element, "test");

    expect(handler).toHaveBeenCalledTimes(1);

    parent.remove();
  });

  it("should be composed by default", () => {
    const handler = vi.fn();
    element.addEventListener("ds:test", handler);

    emitEvent(element, "test");

    const event = handler.mock.calls[0][0] as CustomEvent;
    expect(event.composed).toBe(true);
  });

  it("should not be cancelable by default", () => {
    const handler = vi.fn();
    element.addEventListener("ds:test", handler);

    emitEvent(element, "test");

    const event = handler.mock.calls[0][0] as CustomEvent;
    expect(event.cancelable).toBe(false);
  });

  it("should support cancelable option", () => {
    const handler = vi.fn((e: Event) => e.preventDefault());
    element.addEventListener("ds:test", handler);

    const event = emitEvent(element, "test", { cancelable: true });

    expect(event.defaultPrevented).toBe(true);
  });

  it("should support bubbles: false option", () => {
    const parent = document.createElement("div");
    parent.appendChild(element);
    document.body.appendChild(parent);

    const handler = vi.fn();
    parent.addEventListener("ds:test", handler);

    emitEvent(element, "test", { bubbles: false });

    expect(handler).not.toHaveBeenCalled();

    parent.remove();
  });

  it("should support composed: false option", () => {
    const handler = vi.fn();
    element.addEventListener("ds:test", handler);

    emitEvent(element, "test", { composed: false });

    const event = handler.mock.calls[0][0] as CustomEvent;
    expect(event.composed).toBe(false);
  });

  it("should return the dispatched event", () => {
    const result = emitEvent(element, "test", { detail: { foo: "bar" } });

    expect(result).toBeInstanceOf(CustomEvent);
    expect(result.type).toBe("ds:test");
    expect(result.detail).toEqual({ foo: "bar" });
  });
});

describe("StandardEvents", () => {
  it("should define standard event names", () => {
    expect(StandardEvents.CHANGE).toBe("change");
    expect(StandardEvents.SELECT).toBe("select");
    expect(StandardEvents.OPEN).toBe("open");
    expect(StandardEvents.CLOSE).toBe("close");
    expect(StandardEvents.BEFORE_CLOSE).toBe("before-close");
    expect(StandardEvents.DISMISS).toBe("dismiss");
    expect(StandardEvents.FOCUS_CHANGE).toBe("focus-change");
    expect(StandardEvents.CLICK).toBe("click");
  });

  it("should be usable with emitEvent", () => {
    const testElement = document.createElement("div");
    document.body.appendChild(testElement);

    const handler = vi.fn();
    testElement.addEventListener(`ds:${StandardEvents.CHANGE}`, handler);

    emitEvent(testElement, StandardEvents.CHANGE, { detail: { value: "new" } });

    expect(handler).toHaveBeenCalledTimes(1);

    testElement.remove();
  });
});
