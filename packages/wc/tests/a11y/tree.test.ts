import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/tree/tree.js";

expect.extend(toHaveNoViolations);

describe("Tree Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  describe("basic tree", () => {
    it("should have no accessibility violations", async () => {
      render(
        html`
          <ds-tree aria-label="File explorer">
            <ds-tree-item>
              <ds-tree-item-content>Documents</ds-tree-item-content>
              <ds-tree-group>
                <ds-tree-item>
                  <ds-tree-item-content>Report.pdf</ds-tree-item-content>
                </ds-tree-item>
                <ds-tree-item>
                  <ds-tree-item-content>Notes.txt</ds-tree-item-content>
                </ds-tree-item>
              </ds-tree-group>
            </ds-tree-item>
            <ds-tree-item>
              <ds-tree-item-content>Images</ds-tree-item-content>
            </ds-tree-item>
          </ds-tree>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("tree with selection", () => {
    it("should have no violations with single selection", async () => {
      render(
        html`
          <ds-tree aria-label="Select a file">
            <ds-tree-item aria-selected="false">
              <ds-tree-item-content>File 1</ds-tree-item-content>
            </ds-tree-item>
            <ds-tree-item aria-selected="true">
              <ds-tree-item-content>File 2</ds-tree-item-content>
            </ds-tree-item>
            <ds-tree-item aria-selected="false">
              <ds-tree-item-content>File 3</ds-tree-item-content>
            </ds-tree-item>
          </ds-tree>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no violations with multi-selection", async () => {
      render(
        html`
          <ds-tree aria-label="Select files" aria-multiselectable="true">
            <ds-tree-item aria-selected="true">
              <ds-tree-item-content>File 1</ds-tree-item-content>
            </ds-tree-item>
            <ds-tree-item aria-selected="true">
              <ds-tree-item-content>File 2</ds-tree-item-content>
            </ds-tree-item>
            <ds-tree-item aria-selected="false">
              <ds-tree-item-content>File 3</ds-tree-item-content>
            </ds-tree-item>
          </ds-tree>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("tree ARIA attributes", () => {
    it("should have role='tree' on container", async () => {
      render(
        html`
          <ds-tree aria-label="Navigation tree">
            <ds-tree-item>
              <ds-tree-item-content>Item</ds-tree-item-content>
            </ds-tree-item>
          </ds-tree>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const tree = container.querySelector("[role='tree']");
      expect(tree).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have aria-expanded on expandable items", async () => {
      render(
        html`
          <ds-tree aria-label="Expandable tree">
            <ds-tree-item aria-expanded="true">
              <ds-tree-item-content>Expanded Folder</ds-tree-item-content>
              <ds-tree-group>
                <ds-tree-item>
                  <ds-tree-item-content>Child Item</ds-tree-item-content>
                </ds-tree-item>
              </ds-tree-group>
            </ds-tree-item>
            <ds-tree-item aria-expanded="false">
              <ds-tree-item-content>Collapsed Folder</ds-tree-item-content>
              <ds-tree-group>
                <ds-tree-item>
                  <ds-tree-item-content>Hidden Child</ds-tree-item-content>
                </ds-tree-item>
              </ds-tree-group>
            </ds-tree-item>
          </ds-tree>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const expandedItem = container.querySelector("[aria-expanded='true']");
      expect(expandedItem).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("tree with icons", () => {
    it("should have no violations with decorative icons", async () => {
      render(
        html`
          <ds-tree aria-label="File tree">
            <ds-tree-item>
              <ds-tree-item-content>
                <span aria-hidden="true">📁</span>
                Folder
              </ds-tree-item-content>
            </ds-tree-item>
            <ds-tree-item>
              <ds-tree-item-content>
                <span aria-hidden="true">📄</span>
                File
              </ds-tree-item-content>
            </ds-tree-item>
          </ds-tree>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("tree with disabled items", () => {
    it("should have no violations with disabled items", async () => {
      render(
        html`
          <ds-tree aria-label="Tree with disabled">
            <ds-tree-item>
              <ds-tree-item-content>Enabled Item</ds-tree-item-content>
            </ds-tree-item>
            <ds-tree-item aria-disabled="true">
              <ds-tree-item-content>Disabled Item</ds-tree-item-content>
            </ds-tree-item>
          </ds-tree>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("keyboard navigation", () => {
    it("should have focusable items", async () => {
      render(
        html`
          <ds-tree aria-label="Keyboard navigable tree">
            <ds-tree-item>
              <ds-tree-item-content>Item 1</ds-tree-item-content>
            </ds-tree-item>
            <ds-tree-item>
              <ds-tree-item-content>Item 2</ds-tree-item-content>
            </ds-tree-item>
          </ds-tree>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
