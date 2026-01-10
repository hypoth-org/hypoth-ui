import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/tabs/tabs.js";

expect.extend(toHaveNoViolations);

describe("Tabs Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic tabs", () => {
    it("should have no accessibility violations", async () => {
      render(
        html`
          <ds-tabs>
            <ds-tabs-list>
              <ds-tabs-trigger value="tab1">Tab 1</ds-tabs-trigger>
              <ds-tabs-trigger value="tab2">Tab 2</ds-tabs-trigger>
              <ds-tabs-trigger value="tab3">Tab 3</ds-tabs-trigger>
            </ds-tabs-list>
            <ds-tabs-content value="tab1">Content for Tab 1</ds-tabs-content>
            <ds-tabs-content value="tab2">Content for Tab 2</ds-tabs-content>
            <ds-tabs-content value="tab3">Content for Tab 3</ds-tabs-content>
          </ds-tabs>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with default value", async () => {
      render(
        html`
          <ds-tabs default-value="tab2">
            <ds-tabs-list>
              <ds-tabs-trigger value="tab1">Tab 1</ds-tabs-trigger>
              <ds-tabs-trigger value="tab2">Tab 2</ds-tabs-trigger>
            </ds-tabs-list>
            <ds-tabs-content value="tab1">Content 1</ds-tabs-content>
            <ds-tabs-content value="tab2">Content 2</ds-tabs-content>
          </ds-tabs>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("tabs with disabled tab", () => {
    it("should have no violations with disabled tab", async () => {
      render(
        html`
          <ds-tabs>
            <ds-tabs-list>
              <ds-tabs-trigger value="tab1">Tab 1</ds-tabs-trigger>
              <ds-tabs-trigger value="tab2" disabled>Tab 2 (Disabled)</ds-tabs-trigger>
              <ds-tabs-trigger value="tab3">Tab 3</ds-tabs-trigger>
            </ds-tabs-list>
            <ds-tabs-content value="tab1">Content 1</ds-tabs-content>
            <ds-tabs-content value="tab2">Content 2</ds-tabs-content>
            <ds-tabs-content value="tab3">Content 3</ds-tabs-content>
          </ds-tabs>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("tabs ARIA attributes", () => {
    it("should have role='tablist' on list", async () => {
      render(
        html`
          <ds-tabs>
            <ds-tabs-list>
              <ds-tabs-trigger value="tab1">Tab 1</ds-tabs-trigger>
            </ds-tabs-list>
            <ds-tabs-content value="tab1">Content</ds-tabs-content>
          </ds-tabs>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const tablist = container.querySelector("[role='tablist']");
      expect(tablist).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have role='tab' on triggers", async () => {
      render(
        html`
          <ds-tabs>
            <ds-tabs-list>
              <ds-tabs-trigger value="tab1">Tab 1</ds-tabs-trigger>
            </ds-tabs-list>
            <ds-tabs-content value="tab1">Content</ds-tabs-content>
          </ds-tabs>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const tabs = container.querySelectorAll("[role='tab']");
      expect(tabs.length).toBeGreaterThan(0);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have role='tabpanel' on content", async () => {
      render(
        html`
          <ds-tabs>
            <ds-tabs-list>
              <ds-tabs-trigger value="tab1">Tab 1</ds-tabs-trigger>
            </ds-tabs-list>
            <ds-tabs-content value="tab1">Content</ds-tabs-content>
          </ds-tabs>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const tabpanel = container.querySelector("[role='tabpanel']");
      expect(tabpanel).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have aria-selected on active tab", async () => {
      render(
        html`
          <ds-tabs default-value="tab1">
            <ds-tabs-list>
              <ds-tabs-trigger value="tab1">Tab 1</ds-tabs-trigger>
              <ds-tabs-trigger value="tab2">Tab 2</ds-tabs-trigger>
            </ds-tabs-list>
            <ds-tabs-content value="tab1">Content 1</ds-tabs-content>
            <ds-tabs-content value="tab2">Content 2</ds-tabs-content>
          </ds-tabs>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const selectedTab = container.querySelector("[aria-selected='true']");
      expect(selectedTab).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("vertical tabs", () => {
    it("should have no violations with vertical orientation", async () => {
      render(
        html`
          <ds-tabs orientation="vertical">
            <ds-tabs-list aria-orientation="vertical">
              <ds-tabs-trigger value="tab1">Tab 1</ds-tabs-trigger>
              <ds-tabs-trigger value="tab2">Tab 2</ds-tabs-trigger>
            </ds-tabs-list>
            <ds-tabs-content value="tab1">Content 1</ds-tabs-content>
            <ds-tabs-content value="tab2">Content 2</ds-tabs-content>
          </ds-tabs>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("keyboard accessibility", () => {
    it("should have focusable tabs", async () => {
      render(
        html`
          <ds-tabs>
            <ds-tabs-list>
              <ds-tabs-trigger value="tab1">Tab 1</ds-tabs-trigger>
              <ds-tabs-trigger value="tab2">Tab 2</ds-tabs-trigger>
            </ds-tabs-list>
            <ds-tabs-content value="tab1">Content 1</ds-tabs-content>
            <ds-tabs-content value="tab2">Content 2</ds-tabs-content>
          </ds-tabs>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const tabs = container.querySelectorAll("[role='tab']");
      const focusableTabs = Array.from(tabs).filter(
        (tab) => (tab as HTMLElement).tabIndex >= 0
      );
      expect(focusableTabs.length).toBeGreaterThan(0);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
