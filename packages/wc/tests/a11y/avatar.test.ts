import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/avatar/avatar.js";

expect.extend(toHaveNoViolations);

describe("Avatar Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic avatar", () => {
    it("should have no accessibility violations with image", async () => {
      render(
        html`
          <ds-avatar>
            <ds-avatar-image src="https://example.com/avatar.jpg" alt="John Doe"></ds-avatar-image>
            <ds-avatar-fallback>JD</ds-avatar-fallback>
          </ds-avatar>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with fallback only", async () => {
      render(
        html`
          <ds-avatar>
            <ds-avatar-fallback aria-label="John Doe">JD</ds-avatar-fallback>
          </ds-avatar>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("avatar sizes", () => {
    it("should have no violations for small size", async () => {
      render(
        html`
          <ds-avatar size="sm">
            <ds-avatar-fallback aria-label="Jane Smith">JS</ds-avatar-fallback>
          </ds-avatar>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations for large size", async () => {
      render(
        html`
          <ds-avatar size="lg">
            <ds-avatar-fallback aria-label="Jane Smith">JS</ds-avatar-fallback>
          </ds-avatar>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("avatar group", () => {
    it("should have no violations for avatar group", async () => {
      render(
        html`
          <div role="group" aria-label="Team members">
            <ds-avatar>
              <ds-avatar-fallback aria-label="Alice">A</ds-avatar-fallback>
            </ds-avatar>
            <ds-avatar>
              <ds-avatar-fallback aria-label="Bob">B</ds-avatar-fallback>
            </ds-avatar>
            <ds-avatar>
              <ds-avatar-fallback aria-label="Charlie">C</ds-avatar-fallback>
            </ds-avatar>
          </div>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("avatar with status", () => {
    it("should have no violations with online status", async () => {
      render(
        html`
          <ds-avatar>
            <ds-avatar-fallback aria-label="John Doe (Online)">JD</ds-avatar-fallback>
          </ds-avatar>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 50));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
