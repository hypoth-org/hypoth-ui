import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { announce, clearAnnouncements } from "../src/aria/live-region";

describe("announce", () => {
  beforeEach(() => {
    // Clean up any live regions before each test
    document.querySelectorAll("[aria-live]").forEach((el) => el.remove());
  });

  afterEach(() => {
    // Clean up any live regions after each test
    document.querySelectorAll("[aria-live]").forEach((el) => el.remove());
  });

  it("should create a live region and append to body", async () => {
    announce("Test message");

    // Wait for requestAnimationFrame
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const regions = document.querySelectorAll("[aria-live]");
    expect(regions.length).toBeGreaterThan(0);
  });

  it("should use polite politeness by default", async () => {
    announce("Polite message");

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const region = document.querySelector("[aria-live='polite']");
    expect(region).not.toBeNull();
  });

  it("should use assertive politeness when specified", async () => {
    announce("Urgent message", { politeness: "assertive" });

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const region = document.querySelector("[aria-live='assertive']");
    expect(region).not.toBeNull();
  });

  it("should set message content", async () => {
    announce("Hello world");

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const region = document.querySelector("[aria-live='polite']");
    expect(region?.textContent).toBe("Hello world");
  });

  it("should be visually hidden", async () => {
    announce("Hidden message");

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const region = document.querySelector("[aria-live]") as HTMLElement;
    expect(region).not.toBeNull();
    expect(region.style.position).toBe("absolute");
    expect(region.style.width).toBe("1px");
    expect(region.style.height).toBe("1px");
  });

  it("should have role=status attribute", async () => {
    announce("Status message");

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const region = document.querySelector("[aria-live]");
    expect(region?.getAttribute("role")).toBe("status");
  });

  it("should have aria-atomic=true attribute", async () => {
    announce("Atomic message");

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const region = document.querySelector("[aria-live]");
    expect(region?.getAttribute("aria-atomic")).toBe("true");
  });

  it("should not announce when politeness is off", async () => {
    announce("Silent message", { politeness: "off" });

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const regions = document.querySelectorAll("[aria-live]");
    expect(regions.length).toBe(0);
  });

  it("should reuse existing region for same politeness", async () => {
    announce("First message");
    announce("Second message");

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const regions = document.querySelectorAll("[aria-live='polite']");
    expect(regions.length).toBe(1);
  });

  it("should update message in existing region", async () => {
    announce("First message");
    await new Promise((resolve) => requestAnimationFrame(resolve));

    announce("Second message");
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const region = document.querySelector("[aria-live='polite']");
    expect(region?.textContent).toBe("Second message");
  });
});

describe("clearAnnouncements", () => {
  beforeEach(() => {
    document.querySelectorAll("[aria-live]").forEach((el) => el.remove());
  });

  afterEach(() => {
    document.querySelectorAll("[aria-live]").forEach((el) => el.remove());
  });

  it("should clear polite region content", async () => {
    announce("Polite message");
    await new Promise((resolve) => requestAnimationFrame(resolve));

    clearAnnouncements();

    const region = document.querySelector("[aria-live='polite']");
    expect(region?.textContent).toBe("");
  });

  it("should clear assertive region content", async () => {
    announce("Urgent message", { politeness: "assertive" });
    await new Promise((resolve) => requestAnimationFrame(resolve));

    clearAnnouncements();

    const region = document.querySelector("[aria-live='assertive']");
    expect(region?.textContent).toBe("");
  });

  it("should clear both regions", async () => {
    announce("Polite message");
    announce("Assertive message", { politeness: "assertive" });
    await new Promise((resolve) => requestAnimationFrame(resolve));

    clearAnnouncements();

    const polite = document.querySelector("[aria-live='polite']");
    const assertive = document.querySelector("[aria-live='assertive']");
    expect(polite?.textContent).toBe("");
    expect(assertive?.textContent).toBe("");
  });
});
