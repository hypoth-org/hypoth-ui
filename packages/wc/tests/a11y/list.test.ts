import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/list/list.js";

expect.extend(toHaveNoViolations);

describe("List Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic list", () => {
    it("should have no accessibility violations", async () => {
      render(
        html`
          <ds-list>
            <ds-list-item>First item</ds-list-item>
            <ds-list-item>Second item</ds-list-item>
            <ds-list-item>Third item</ds-list-item>
          </ds-list>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("list with labels", () => {
    it("should have no violations with aria-label", async () => {
      render(
        html`
          <ds-list aria-label="Shopping list">
            <ds-list-item>Apples</ds-list-item>
            <ds-list-item>Bananas</ds-list-item>
            <ds-list-item>Oranges</ds-list-item>
          </ds-list>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("selectable list", () => {
    it("should have no violations with selectable items", async () => {
      render(
        html`
          <ds-list role="listbox" aria-label="Select an option">
            <ds-list-item role="option" aria-selected="false">Option 1</ds-list-item>
            <ds-list-item role="option" aria-selected="true">Option 2</ds-list-item>
            <ds-list-item role="option" aria-selected="false">Option 3</ds-list-item>
          </ds-list>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with multi-select", async () => {
      render(
        html`
          <ds-list role="listbox" aria-label="Select options" aria-multiselectable="true">
            <ds-list-item role="option" aria-selected="true">Option 1</ds-list-item>
            <ds-list-item role="option" aria-selected="true">Option 2</ds-list-item>
            <ds-list-item role="option" aria-selected="false">Option 3</ds-list-item>
          </ds-list>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("list with icons", () => {
    it("should have no violations with decorative icons", async () => {
      render(
        html`
          <ds-list>
            <ds-list-item>
              <span aria-hidden="true">✓</span>
              Completed task
            </ds-list-item>
            <ds-list-item>
              <span aria-hidden="true">⏳</span>
              Pending task
            </ds-list-item>
          </ds-list>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("list with interactive items", () => {
    it("should have no violations with clickable items", async () => {
      render(
        html`
          <ds-list>
            <ds-list-item tabindex="0" role="button">Click me</ds-list-item>
            <ds-list-item tabindex="0" role="button">Click me too</ds-list-item>
          </ds-list>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("list with links", () => {
    it("should have no violations with link items", async () => {
      render(
        html`
          <ds-list>
            <ds-list-item>
              <a href="/page1">Page 1</a>
            </ds-list-item>
            <ds-list-item>
              <a href="/page2">Page 2</a>
            </ds-list-item>
          </ds-list>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("list with disabled items", () => {
    it("should have no violations with disabled items", async () => {
      render(
        html`
          <ds-list role="listbox" aria-label="Options">
            <ds-list-item role="option">Active option</ds-list-item>
            <ds-list-item role="option" aria-disabled="true">Disabled option</ds-list-item>
          </ds-list>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("nested list", () => {
    it("should have no violations with nested structure", async () => {
      render(
        html`
          <ds-list aria-label="Navigation">
            <ds-list-item>
              Parent 1
              <ds-list>
                <ds-list-item>Child 1.1</ds-list-item>
                <ds-list-item>Child 1.2</ds-list-item>
              </ds-list>
            </ds-list-item>
            <ds-list-item>Parent 2</ds-list-item>
          </ds-list>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
