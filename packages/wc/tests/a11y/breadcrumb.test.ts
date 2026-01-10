import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/breadcrumb/breadcrumb.js";

expect.extend(toHaveNoViolations);

describe("Breadcrumb Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic breadcrumb", () => {
    it("should have no accessibility violations", async () => {
      render(
        html`
          <ds-breadcrumb>
            <ds-breadcrumb-list>
              <ds-breadcrumb-item>
                <ds-breadcrumb-link href="/">Home</ds-breadcrumb-link>
              </ds-breadcrumb-item>
              <ds-breadcrumb-separator>/</ds-breadcrumb-separator>
              <ds-breadcrumb-item>
                <ds-breadcrumb-link href="/products">Products</ds-breadcrumb-link>
              </ds-breadcrumb-item>
              <ds-breadcrumb-separator>/</ds-breadcrumb-separator>
              <ds-breadcrumb-item>
                <ds-breadcrumb-page>Current Page</ds-breadcrumb-page>
              </ds-breadcrumb-item>
            </ds-breadcrumb-list>
          </ds-breadcrumb>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("breadcrumb with aria-current", () => {
    it("should have no violations with aria-current on current page", async () => {
      render(
        html`
          <ds-breadcrumb>
            <ds-breadcrumb-list>
              <ds-breadcrumb-item>
                <ds-breadcrumb-link href="/">Home</ds-breadcrumb-link>
              </ds-breadcrumb-item>
              <ds-breadcrumb-separator>/</ds-breadcrumb-separator>
              <ds-breadcrumb-item>
                <ds-breadcrumb-page aria-current="page">Current Page</ds-breadcrumb-page>
              </ds-breadcrumb-item>
            </ds-breadcrumb-list>
          </ds-breadcrumb>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("breadcrumb ARIA attributes", () => {
    it("should have navigation landmark", async () => {
      render(
        html`
          <ds-breadcrumb aria-label="Breadcrumb">
            <ds-breadcrumb-list>
              <ds-breadcrumb-item>
                <ds-breadcrumb-link href="/">Home</ds-breadcrumb-link>
              </ds-breadcrumb-item>
            </ds-breadcrumb-list>
          </ds-breadcrumb>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const nav = container.querySelector("nav, [role='navigation']");
      expect(nav).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have proper list structure", async () => {
      render(
        html`
          <ds-breadcrumb>
            <ds-breadcrumb-list>
              <ds-breadcrumb-item>
                <ds-breadcrumb-link href="/">Home</ds-breadcrumb-link>
              </ds-breadcrumb-item>
              <ds-breadcrumb-separator>/</ds-breadcrumb-separator>
              <ds-breadcrumb-item>
                <ds-breadcrumb-page>Current</ds-breadcrumb-page>
              </ds-breadcrumb-item>
            </ds-breadcrumb-list>
          </ds-breadcrumb>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const list = container.querySelector("ol, [role='list']");
      expect(list).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("breadcrumb with custom separator", () => {
    it("should have no violations with icon separator", async () => {
      render(
        html`
          <ds-breadcrumb>
            <ds-breadcrumb-list>
              <ds-breadcrumb-item>
                <ds-breadcrumb-link href="/">Home</ds-breadcrumb-link>
              </ds-breadcrumb-item>
              <ds-breadcrumb-separator aria-hidden="true">›</ds-breadcrumb-separator>
              <ds-breadcrumb-item>
                <ds-breadcrumb-page>Current</ds-breadcrumb-page>
              </ds-breadcrumb-item>
            </ds-breadcrumb-list>
          </ds-breadcrumb>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("collapsed breadcrumb", () => {
    it("should have no violations with ellipsis for collapsed items", async () => {
      render(
        html`
          <ds-breadcrumb>
            <ds-breadcrumb-list>
              <ds-breadcrumb-item>
                <ds-breadcrumb-link href="/">Home</ds-breadcrumb-link>
              </ds-breadcrumb-item>
              <ds-breadcrumb-separator>/</ds-breadcrumb-separator>
              <ds-breadcrumb-item>
                <ds-breadcrumb-ellipsis aria-label="More pages"></ds-breadcrumb-ellipsis>
              </ds-breadcrumb-item>
              <ds-breadcrumb-separator>/</ds-breadcrumb-separator>
              <ds-breadcrumb-item>
                <ds-breadcrumb-page>Current</ds-breadcrumb-page>
              </ds-breadcrumb-item>
            </ds-breadcrumb-list>
          </ds-breadcrumb>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
