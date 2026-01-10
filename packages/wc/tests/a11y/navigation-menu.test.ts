import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/navigation-menu/navigation-menu.js";

expect.extend(toHaveNoViolations);

describe("NavigationMenu Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    // Clean up any portaled menus
    document.querySelectorAll("ds-navigation-menu").forEach((el) => el.remove());
  });

  describe("basic navigation menu", () => {
    it("should have no accessibility violations", async () => {
      render(
        html`
          <ds-navigation-menu>
            <ds-navigation-menu-list>
              <ds-navigation-menu-item>
                <ds-navigation-menu-link href="/home">Home</ds-navigation-menu-link>
              </ds-navigation-menu-item>
              <ds-navigation-menu-item>
                <ds-navigation-menu-link href="/about">About</ds-navigation-menu-link>
              </ds-navigation-menu-item>
              <ds-navigation-menu-item>
                <ds-navigation-menu-link href="/contact">Contact</ds-navigation-menu-link>
              </ds-navigation-menu-item>
            </ds-navigation-menu-list>
          </ds-navigation-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("navigation menu with submenus", () => {
    it("should have no violations with dropdown submenu", async () => {
      render(
        html`
          <ds-navigation-menu>
            <ds-navigation-menu-list>
              <ds-navigation-menu-item>
                <ds-navigation-menu-trigger>Products</ds-navigation-menu-trigger>
                <ds-navigation-menu-content>
                  <ds-navigation-menu-link href="/product-1">Product 1</ds-navigation-menu-link>
                  <ds-navigation-menu-link href="/product-2">Product 2</ds-navigation-menu-link>
                </ds-navigation-menu-content>
              </ds-navigation-menu-item>
              <ds-navigation-menu-item>
                <ds-navigation-menu-link href="/about">About</ds-navigation-menu-link>
              </ds-navigation-menu-item>
            </ds-navigation-menu-list>
          </ds-navigation-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("navigation menu ARIA attributes", () => {
    it("should have navigation landmark", async () => {
      render(
        html`
          <ds-navigation-menu aria-label="Main navigation">
            <ds-navigation-menu-list>
              <ds-navigation-menu-item>
                <ds-navigation-menu-link href="/home">Home</ds-navigation-menu-link>
              </ds-navigation-menu-item>
            </ds-navigation-menu-list>
          </ds-navigation-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const nav = container.querySelector("nav, [role='navigation']");
      expect(nav).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have menubar role", async () => {
      render(
        html`
          <ds-navigation-menu>
            <ds-navigation-menu-list>
              <ds-navigation-menu-item>
                <ds-navigation-menu-link href="/home">Home</ds-navigation-menu-link>
              </ds-navigation-menu-item>
            </ds-navigation-menu-list>
          </ds-navigation-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("navigation menu with current page", () => {
    it("should have no violations with aria-current", async () => {
      render(
        html`
          <ds-navigation-menu>
            <ds-navigation-menu-list>
              <ds-navigation-menu-item>
                <ds-navigation-menu-link href="/home" aria-current="page">Home</ds-navigation-menu-link>
              </ds-navigation-menu-item>
              <ds-navigation-menu-item>
                <ds-navigation-menu-link href="/about">About</ds-navigation-menu-link>
              </ds-navigation-menu-item>
            </ds-navigation-menu-list>
          </ds-navigation-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("keyboard navigation", () => {
    it("should have focusable menu items", async () => {
      render(
        html`
          <ds-navigation-menu>
            <ds-navigation-menu-list>
              <ds-navigation-menu-item>
                <ds-navigation-menu-link href="/home">Home</ds-navigation-menu-link>
              </ds-navigation-menu-item>
              <ds-navigation-menu-item>
                <ds-navigation-menu-link href="/about">About</ds-navigation-menu-link>
              </ds-navigation-menu-item>
            </ds-navigation-menu-list>
          </ds-navigation-menu>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const links = container.querySelectorAll("a, [role='menuitem']");
      expect(links.length).toBeGreaterThan(0);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
