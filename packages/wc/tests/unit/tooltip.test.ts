import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { html, render } from "lit";
import "../../src/components/tooltip/tooltip.js";

describe("DsTooltip", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    vi.useFakeTimers();
  });

  afterEach(() => {
    container.remove();
    vi.useRealTimers();
  });

  describe("rendering", () => {
    it("should render trigger slot", async () => {
      render(
        html`
          <ds-tooltip>
            <button slot="trigger">Hover me</button>
            <ds-tooltip-content>Tooltip text</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await vi.runAllTimersAsync();

      const trigger = container.querySelector('[slot="trigger"]');
      expect(trigger).toBeTruthy();
      expect(trigger?.textContent).toBe("Hover me");
    });

    it("should hide content by default", async () => {
      render(
        html`
          <ds-tooltip>
            <button slot="trigger">Hover me</button>
            <ds-tooltip-content>Tooltip text</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await vi.runAllTimersAsync();

      const content = container.querySelector("ds-tooltip-content");
      expect(content?.hasAttribute("hidden")).toBe(true);
    });
  });

  describe("hover trigger", () => {
    it("should show after hover with delay", async () => {
      render(
        html`
          <ds-tooltip>
            <button slot="trigger">Hover me</button>
            <ds-tooltip-content>Tooltip text</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await vi.runAllTimersAsync();

      const trigger = container.querySelector('[slot="trigger"]') as HTMLElement;
      trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));

      // Before delay expires, should still be hidden
      await vi.advanceTimersByTimeAsync(200);
      let content = container.querySelector("ds-tooltip-content");
      expect(content?.hasAttribute("hidden")).toBe(true);

      // After delay expires, should be visible
      await vi.advanceTimersByTimeAsync(300); // Total 500ms > 400ms default
      content = container.querySelector("ds-tooltip-content");
      expect(content?.hasAttribute("hidden")).toBe(false);
    });

    it("should hide after mouse leave with delay", async () => {
      render(
        html`
          <ds-tooltip open>
            <button slot="trigger">Hover me</button>
            <ds-tooltip-content>Tooltip text</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await vi.runAllTimersAsync();

      const trigger = container.querySelector('[slot="trigger"]') as HTMLElement;
      trigger.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));

      // Before delay expires, should still be visible
      await vi.advanceTimersByTimeAsync(50);
      let tooltip = container.querySelector("ds-tooltip") as HTMLElement & { open: boolean };
      expect(tooltip.open).toBe(true);

      // After delay expires, should be hidden
      await vi.advanceTimersByTimeAsync(100); // Total 150ms > 100ms default
      tooltip = container.querySelector("ds-tooltip") as HTMLElement & { open: boolean };
      expect(tooltip.open).toBe(false);
    });

    it("should cancel hide when re-entering trigger", async () => {
      render(
        html`
          <ds-tooltip open>
            <button slot="trigger">Hover me</button>
            <ds-tooltip-content>Tooltip text</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await vi.runAllTimersAsync();

      const trigger = container.querySelector('[slot="trigger"]') as HTMLElement;

      // Leave trigger
      trigger.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
      await vi.advanceTimersByTimeAsync(50);

      // Re-enter trigger before hide delay completes
      trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
      await vi.advanceTimersByTimeAsync(100);

      // Should still be open
      const tooltip = container.querySelector("ds-tooltip") as HTMLElement & { open: boolean };
      expect(tooltip.open).toBe(true);
    });
  });

  describe("focus trigger", () => {
    it("should show on focus", async () => {
      render(
        html`
          <ds-tooltip>
            <button slot="trigger">Focus me</button>
            <ds-tooltip-content>Tooltip text</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await vi.runAllTimersAsync();

      const trigger = container.querySelector('[slot="trigger"]') as HTMLElement;
      trigger.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

      await vi.advanceTimersByTimeAsync(500);

      const tooltip = container.querySelector("ds-tooltip") as HTMLElement & { open: boolean };
      expect(tooltip.open).toBe(true);
    });

    it("should hide on blur", async () => {
      render(
        html`
          <ds-tooltip open>
            <button slot="trigger">Focus me</button>
            <ds-tooltip-content>Tooltip text</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await vi.runAllTimersAsync();

      const trigger = container.querySelector('[slot="trigger"]') as HTMLElement;
      trigger.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));

      await vi.advanceTimersByTimeAsync(150);

      const tooltip = container.querySelector("ds-tooltip") as HTMLElement & { open: boolean };
      expect(tooltip.open).toBe(false);
    });
  });

  describe("escape key", () => {
    it("should close on Escape key", async () => {
      render(
        html`
          <ds-tooltip open>
            <button slot="trigger">Hover me</button>
            <ds-tooltip-content>Tooltip text</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await vi.runAllTimersAsync();

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

      await vi.runAllTimersAsync();

      const tooltip = container.querySelector("ds-tooltip") as HTMLElement & { open: boolean };
      expect(tooltip.open).toBe(false);
    });
  });

  describe("hover persistence", () => {
    it("should stay open when moving to tooltip content", async () => {
      render(
        html`
          <ds-tooltip open>
            <button slot="trigger">Hover me</button>
            <ds-tooltip-content>Tooltip text</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await vi.runAllTimersAsync();

      const trigger = container.querySelector('[slot="trigger"]') as HTMLElement;
      const content = container.querySelector("ds-tooltip-content") as HTMLElement;

      // Leave trigger
      trigger.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
      await vi.advanceTimersByTimeAsync(50);

      // Enter content before hide delay completes
      content.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
      await vi.advanceTimersByTimeAsync(100);

      // Should still be open
      const tooltip = container.querySelector("ds-tooltip") as HTMLElement & { open: boolean };
      expect(tooltip.open).toBe(true);
    });

    it("should hide when leaving tooltip content", async () => {
      render(
        html`
          <ds-tooltip open>
            <button slot="trigger">Hover me</button>
            <ds-tooltip-content>Tooltip text</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await vi.runAllTimersAsync();

      const content = container.querySelector("ds-tooltip-content") as HTMLElement;

      // Leave content
      content.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
      await vi.advanceTimersByTimeAsync(150);

      const tooltip = container.querySelector("ds-tooltip") as HTMLElement & { open: boolean };
      expect(tooltip.open).toBe(false);
    });
  });

  describe("custom delays", () => {
    it("should support custom show delay", async () => {
      render(
        html`
          <ds-tooltip show-delay="100">
            <button slot="trigger">Hover me</button>
            <ds-tooltip-content>Tooltip text</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await vi.runAllTimersAsync();

      const trigger = container.querySelector('[slot="trigger"]') as HTMLElement;
      trigger.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));

      // After 100ms custom delay
      await vi.advanceTimersByTimeAsync(150);

      const tooltip = container.querySelector("ds-tooltip") as HTMLElement & { open: boolean };
      expect(tooltip.open).toBe(true);
    });

    it("should support custom hide delay", async () => {
      render(
        html`
          <ds-tooltip open hide-delay="200">
            <button slot="trigger">Hover me</button>
            <ds-tooltip-content>Tooltip text</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await vi.runAllTimersAsync();

      const trigger = container.querySelector('[slot="trigger"]') as HTMLElement;
      trigger.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));

      // After default 100ms, should still be open
      await vi.advanceTimersByTimeAsync(150);
      let tooltip = container.querySelector("ds-tooltip") as HTMLElement & { open: boolean };
      expect(tooltip.open).toBe(true);

      // After custom 200ms delay
      await vi.advanceTimersByTimeAsync(100);
      tooltip = container.querySelector("ds-tooltip") as HTMLElement & { open: boolean };
      expect(tooltip.open).toBe(false);
    });
  });

  describe("placement", () => {
    it("should default to top placement", async () => {
      render(
        html`
          <ds-tooltip>
            <button slot="trigger">Hover me</button>
            <ds-tooltip-content>Tooltip text</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await vi.runAllTimersAsync();

      const tooltip = container.querySelector("ds-tooltip") as HTMLElement & { placement: string };
      expect(tooltip.placement).toBe("top");
    });

    it("should support custom placement", async () => {
      render(
        html`
          <ds-tooltip placement="bottom">
            <button slot="trigger">Hover me</button>
            <ds-tooltip-content>Tooltip text</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await vi.runAllTimersAsync();

      const tooltip = container.querySelector("ds-tooltip") as HTMLElement & { placement: string };
      expect(tooltip.placement).toBe("bottom");
    });
  });

  describe("programmatic API", () => {
    it("should expose show() method", async () => {
      render(
        html`
          <ds-tooltip>
            <button slot="trigger">Hover me</button>
            <ds-tooltip-content>Tooltip text</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await vi.runAllTimersAsync();

      const tooltip = container.querySelector("ds-tooltip") as HTMLElement & { show: () => void; open: boolean };
      tooltip.show();

      await vi.runAllTimersAsync();

      expect(tooltip.open).toBe(true);
    });

    it("should expose hide() method", async () => {
      render(
        html`
          <ds-tooltip open>
            <button slot="trigger">Hover me</button>
            <ds-tooltip-content>Tooltip text</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await vi.runAllTimersAsync();

      const tooltip = container.querySelector("ds-tooltip") as HTMLElement & { hide: () => void; open: boolean };
      tooltip.hide();

      await vi.runAllTimersAsync();

      expect(tooltip.open).toBe(false);
    });
  });

  describe("aria-describedby", () => {
    it("should set aria-describedby on trigger pointing to content", async () => {
      render(
        html`
          <ds-tooltip>
            <button slot="trigger">Hover me</button>
            <ds-tooltip-content>Tooltip text</ds-tooltip-content>
          </ds-tooltip>
        `,
        container
      );

      await vi.runAllTimersAsync();

      const trigger = container.querySelector('[slot="trigger"]');
      const content = container.querySelector("ds-tooltip-content");

      expect(trigger?.getAttribute("aria-describedby")).toBe(content?.id);
    });
  });
});

describe("DsTooltipContent", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    vi.useFakeTimers();
  });

  afterEach(() => {
    container.remove();
    vi.useRealTimers();
  });

  it("should render content slot", async () => {
    render(
      html`
        <ds-tooltip open>
          <button slot="trigger">Hover me</button>
          <ds-tooltip-content>This is tooltip content</ds-tooltip-content>
        </ds-tooltip>
      `,
      container
    );

    await vi.runAllTimersAsync();

    const content = container.querySelector("ds-tooltip-content");
    expect(content?.textContent).toContain("This is tooltip content");
  });

  it("should have role=tooltip", async () => {
    render(
      html`
        <ds-tooltip open>
          <button slot="trigger">Hover me</button>
          <ds-tooltip-content>Tooltip</ds-tooltip-content>
        </ds-tooltip>
      `,
      container
    );

    await vi.runAllTimersAsync();

    const content = container.querySelector("ds-tooltip-content");
    expect(content?.getAttribute("role")).toBe("tooltip");
  });
});
