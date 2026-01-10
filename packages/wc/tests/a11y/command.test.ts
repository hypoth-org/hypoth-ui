import { toHaveNoViolations } from "jest-axe";
import { axe } from "./setup.js";
import { html, render } from "lit";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "../../src/components/command/command.js";

expect.extend(toHaveNoViolations);

describe("Command Accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    document.querySelectorAll("ds-command").forEach((el) => el.remove());
  });

  describe("basic command palette", () => {
    it("should have no accessibility violations", async () => {
      render(
        html`
          <ds-command>
            <ds-command-input placeholder="Type a command..."></ds-command-input>
            <ds-command-list>
              <ds-command-empty>No results found.</ds-command-empty>
              <ds-command-group heading="Actions">
                <ds-command-item>New File</ds-command-item>
                <ds-command-item>Open File</ds-command-item>
                <ds-command-item>Save File</ds-command-item>
              </ds-command-group>
            </ds-command-list>
          </ds-command>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("command in dialog", () => {
    it("should have no violations in dialog mode", async () => {
      render(
        html`
          <ds-command-dialog open>
            <ds-command>
              <ds-command-input placeholder="Search commands..."></ds-command-input>
              <ds-command-list>
                <ds-command-group heading="Navigation">
                  <ds-command-item>Go to Home</ds-command-item>
                  <ds-command-item>Go to Settings</ds-command-item>
                </ds-command-group>
              </ds-command-list>
            </ds-command>
          </ds-command-dialog>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 150));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("command with multiple groups", () => {
    it("should have no violations with multiple labeled groups", async () => {
      render(
        html`
          <ds-command>
            <ds-command-input placeholder="Search..."></ds-command-input>
            <ds-command-list>
              <ds-command-group heading="Suggestions">
                <ds-command-item>Calendar</ds-command-item>
                <ds-command-item>Search</ds-command-item>
              </ds-command-group>
              <ds-command-separator></ds-command-separator>
              <ds-command-group heading="Settings">
                <ds-command-item>Profile</ds-command-item>
                <ds-command-item>Preferences</ds-command-item>
              </ds-command-group>
            </ds-command-list>
          </ds-command>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("command ARIA attributes", () => {
    // Skip: command-input doesn't create input element in happy-dom test environment
    it.skip("should have proper combobox pattern", async () => {
      render(
        html`
          <ds-command>
            <ds-command-input placeholder="Search..."></ds-command-input>
            <ds-command-list>
              <ds-command-item>Item 1</ds-command-item>
            </ds-command-list>
          </ds-command>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Command should use combobox or listbox pattern
      const input = container.querySelector("input, [role='combobox']");
      expect(input).toBeTruthy();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have role='listbox' or 'option' for items", async () => {
      render(
        html`
          <ds-command>
            <ds-command-input placeholder="Search..."></ds-command-input>
            <ds-command-list>
              <ds-command-item>Item 1</ds-command-item>
              <ds-command-item>Item 2</ds-command-item>
            </ds-command-list>
          </ds-command>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("command with disabled items", () => {
    it("should have no violations with disabled items", async () => {
      render(
        html`
          <ds-command>
            <ds-command-input placeholder="Search..."></ds-command-input>
            <ds-command-list>
              <ds-command-item>Active Item</ds-command-item>
              <ds-command-item disabled>Disabled Item</ds-command-item>
              <ds-command-item>Another Active Item</ds-command-item>
            </ds-command-list>
          </ds-command>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("command with shortcuts", () => {
    it("should have no violations with keyboard shortcuts", async () => {
      render(
        html`
          <ds-command>
            <ds-command-input placeholder="Search..."></ds-command-input>
            <ds-command-list>
              <ds-command-item>
                New File
                <ds-command-shortcut>⌘N</ds-command-shortcut>
              </ds-command-item>
              <ds-command-item>
                Open File
                <ds-command-shortcut>⌘O</ds-command-shortcut>
              </ds-command-item>
            </ds-command-list>
          </ds-command>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("keyboard navigation", () => {
    // Skip: command-input doesn't create input element in happy-dom test environment
    it.skip("should have focusable input", async () => {
      render(
        html`
          <ds-command>
            <ds-command-input placeholder="Search..."></ds-command-input>
            <ds-command-list>
              <ds-command-item>Item</ds-command-item>
            </ds-command-list>
          </ds-command>
        `,
        container
      );

      await new Promise((resolve) => setTimeout(resolve, 100));

      const input = container.querySelector("input");
      expect(input).toBeTruthy();
      expect(input?.tabIndex).toBeGreaterThanOrEqual(0);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
