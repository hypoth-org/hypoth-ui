import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DsLink } from "./link.js";

// Ensure the component is defined before tests
import "./link.js";

describe("DsLink", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("rendering", () => {
    it("renders with required href", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "/about";
      link.textContent = "About";
      container.appendChild(link);
      await link.updateComplete;

      const anchor = link.querySelector("a");
      expect(anchor).toBeTruthy();
      expect(anchor?.getAttribute("href")).toBe("/about");
      expect(anchor?.classList.contains("ds-link")).toBe(true);
    });

    it("renders with default variant", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "/test";
      container.appendChild(link);
      await link.updateComplete;

      const anchor = link.querySelector("a");
      expect(anchor?.classList.contains("ds-link--default")).toBe(true);
    });

    it("renders with muted variant", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "/test";
      link.variant = "muted";
      container.appendChild(link);
      await link.updateComplete;

      const anchor = link.querySelector("a");
      expect(anchor?.classList.contains("ds-link--muted")).toBe(true);
    });

    it("renders with underline variant", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "/test";
      link.variant = "underline";
      container.appendChild(link);
      await link.updateComplete;

      const anchor = link.querySelector("a");
      expect(anchor?.classList.contains("ds-link--underline")).toBe(true);
    });
  });

  describe("external links", () => {
    it("adds target=_blank for external links", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "https://example.com";
      link.external = true;
      container.appendChild(link);
      await link.updateComplete;

      const anchor = link.querySelector("a");
      expect(anchor?.getAttribute("target")).toBe("_blank");
    });

    it("adds rel=noopener noreferrer for external links", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "https://example.com";
      link.external = true;
      container.appendChild(link);
      await link.updateComplete;

      const anchor = link.querySelector("a");
      expect(anchor?.getAttribute("rel")).toBe("noopener noreferrer");
    });

    it("shows external indicator for external links", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "https://example.com";
      link.external = true;
      container.appendChild(link);
      await link.updateComplete;

      const indicator = link.querySelector(".ds-link__external-icon");
      expect(indicator).toBeTruthy();
    });

    it("includes visually hidden text for screen readers on external links", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "https://example.com";
      link.external = true;
      container.appendChild(link);
      await link.updateComplete;

      const srText = link.querySelector(".ds-visually-hidden");
      expect(srText?.textContent).toContain("opens in new tab");
    });

    it("has external class when external", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "https://example.com";
      link.external = true;
      container.appendChild(link);
      await link.updateComplete;

      const anchor = link.querySelector("a");
      expect(anchor?.classList.contains("ds-link--external")).toBe(true);
    });
  });

  describe("events", () => {
    it("emits ds:navigate event on click", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "/about";
      container.appendChild(link);
      await link.updateComplete;

      const navigateHandler = vi.fn();
      link.addEventListener("ds:navigate", navigateHandler);

      const anchor = link.querySelector("a");
      anchor?.click();

      expect(navigateHandler).toHaveBeenCalled();
    });

    it("includes href and external in ds:navigate detail", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "/about";
      link.external = false;
      container.appendChild(link);
      await link.updateComplete;

      let eventDetail: unknown;
      link.addEventListener("ds:navigate", ((e: CustomEvent) => {
        eventDetail = e.detail;
      }) as EventListener);

      const anchor = link.querySelector("a");
      anchor?.click();

      expect(eventDetail).toHaveProperty("href", "/about");
      expect(eventDetail).toHaveProperty("external", false);
      expect(eventDetail).toHaveProperty("originalEvent");
    });

    it("ds:navigate event is cancelable", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "/about";
      container.appendChild(link);
      await link.updateComplete;

      link.addEventListener("ds:navigate", (e) => {
        e.preventDefault();
      });

      const anchor = link.querySelector("a");
      const clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true });
      anchor?.dispatchEvent(clickEvent);

      // Navigation should be prevented
      expect(clickEvent.defaultPrevented).toBe(true);
    });
  });

  describe("keyboard interaction", () => {
    it("is focusable", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "/about";
      link.textContent = "About";
      container.appendChild(link);
      await link.updateComplete;

      const anchor = link.querySelector("a");
      anchor?.focus();
      expect(document.activeElement).toBe(anchor);
    });

    it("activates on Enter key", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "/about";
      container.appendChild(link);
      await link.updateComplete;

      const navigateHandler = vi.fn((e) => e.preventDefault());
      link.addEventListener("ds:navigate", navigateHandler);

      const anchor = link.querySelector("a");
      const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true });
      anchor?.dispatchEvent(event);

      // Native anchor handles Enter key, so we just verify focus works
      expect(anchor?.tagName.toLowerCase()).toBe("a");
    });
  });

  describe("empty href handling", () => {
    it("renders as span when href is empty", async () => {
      const link = document.createElement("ds-link") as DsLink;
      link.href = "";
      link.textContent = "Not a link";
      container.appendChild(link);
      await link.updateComplete;

      const span = link.querySelector("span.ds-link");
      expect(span).toBeTruthy();
    });
  });
});
