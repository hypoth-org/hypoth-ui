/**
 * Accessibility tests for React Dialog compound component.
 * Tests ARIA attributes, keyboard interaction, and axe-core compliance.
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe, toHaveNoViolations } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Dialog } from "../../src/components/dialog/index.js";

expect.extend(toHaveNoViolations);

describe("Dialog accessibility", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    // Clean up any portaled dialogs
    document.querySelectorAll('[role="dialog"], [role="alertdialog"]').forEach((el) => el.remove());
  });

  describe("axe-core compliance", () => {
    it("should have no accessibility violations for closed dialog", async () => {
      const { container: renderContainer } = render(
        <Dialog.Root>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Dialog Title</Dialog.Title>
            <p>Dialog content</p>
          </Dialog.Content>
        </Dialog.Root>
      );

      const results = await axe(renderContainer);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations for open dialog with title", async () => {
      render(
        <Dialog.Root defaultOpen>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>
          <Dialog.Content container={container}>
            <Dialog.Title>Confirmation Required</Dialog.Title>
            <p>Are you sure you want to continue?</p>
            <button type="button">Yes</button>
            <button type="button">No</button>
          </Dialog.Content>
        </Dialog.Root>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations for dialog with title and description", async () => {
      render(
        <Dialog.Root defaultOpen>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>
          <Dialog.Content container={container}>
            <Dialog.Title>Delete Item</Dialog.Title>
            <Dialog.Description>
              This action cannot be undone. Are you sure you want to delete this item?
            </Dialog.Description>
            <button type="button">Delete</button>
            <button type="button">Cancel</button>
          </Dialog.Content>
        </Dialog.Root>
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it("should have no accessibility violations for alertdialog role", async () => {
      render(
        <Dialog.Root defaultOpen role="alertdialog">
          <Dialog.Trigger>Open Alert</Dialog.Trigger>
          <Dialog.Content container={container}>
            <Dialog.Title>Warning</Dialog.Title>
            <Dialog.Description>Your session is about to expire.</Dialog.Description>
            <button type="button">Extend Session</button>
          </Dialog.Content>
        </Dialog.Root>
      );

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe("ARIA attributes", () => {
    it("should have role='dialog' on content by default", async () => {
      render(
        <Dialog.Root defaultOpen>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content container={container}>
            <Dialog.Title>Title</Dialog.Title>
            Content
          </Dialog.Content>
        </Dialog.Root>
      );

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
      });
    });

    it("should have role='alertdialog' when specified", async () => {
      render(
        <Dialog.Root defaultOpen role="alertdialog">
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content container={container}>
            <Dialog.Title>Alert</Dialog.Title>
            Content
          </Dialog.Content>
        </Dialog.Root>
      );

      await waitFor(() => {
        const alertDialog = screen.getByRole("alertdialog");
        expect(alertDialog).toBeInTheDocument();
      });
    });

    it("should have aria-modal='true' on content", async () => {
      render(
        <Dialog.Root defaultOpen>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content container={container}>
            <Dialog.Title>Title</Dialog.Title>
            Content
          </Dialog.Content>
        </Dialog.Root>
      );

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("aria-modal", "true");
      });
    });

    it("should connect aria-labelledby to dialog title", async () => {
      render(
        <Dialog.Root defaultOpen>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content container={container}>
            <Dialog.Title>My Dialog Title</Dialog.Title>
            Content
          </Dialog.Content>
        </Dialog.Root>
      );

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        const labelledBy = dialog.getAttribute("aria-labelledby");
        expect(labelledBy).toBeTruthy();

        const title = document.getElementById(labelledBy!);
        expect(title).toHaveTextContent("My Dialog Title");
      });
    });

    it("should connect aria-describedby to dialog description", async () => {
      render(
        <Dialog.Root defaultOpen>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content container={container}>
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.Description>Description text here</Dialog.Description>
            Content
          </Dialog.Content>
        </Dialog.Root>
      );

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        const describedBy = dialog.getAttribute("aria-describedby");
        expect(describedBy).toBeTruthy();

        const description = document.getElementById(describedBy!);
        expect(description).toHaveTextContent("Description text here");
      });
    });

    it("trigger should have aria-haspopup='dialog'", () => {
      render(
        <Dialog.Root>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Title</Dialog.Title>
          </Dialog.Content>
        </Dialog.Root>
      );

      const trigger = screen.getByRole("button", { name: "Open" });
      expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    });

    it("trigger should have aria-expanded reflecting open state", async () => {
      const user = userEvent.setup();

      render(
        <Dialog.Root>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content container={container}>
            <Dialog.Title>Title</Dialog.Title>
          </Dialog.Content>
        </Dialog.Root>
      );

      const trigger = screen.getByRole("button", { name: "Open" });
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);

      await waitFor(() => {
        expect(trigger).toHaveAttribute("aria-expanded", "true");
      });
    });

    it("trigger should have aria-controls pointing to dialog", async () => {
      render(
        <Dialog.Root defaultOpen>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content container={container}>
            <Dialog.Title>Title</Dialog.Title>
          </Dialog.Content>
        </Dialog.Root>
      );

      await waitFor(() => {
        const trigger = screen.getByRole("button", { name: "Open" });
        const controls = trigger.getAttribute("aria-controls");
        expect(controls).toBeTruthy();

        const dialog = document.getElementById(controls!);
        expect(dialog).toHaveAttribute("role", "dialog");
      });
    });
  });

  describe("keyboard interaction", () => {
    it("should open dialog on Enter key", async () => {
      const user = userEvent.setup();

      render(
        <Dialog.Root>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content container={container}>
            <Dialog.Title>Title</Dialog.Title>
          </Dialog.Content>
        </Dialog.Root>
      );

      const trigger = screen.getByRole("button", { name: "Open" });
      trigger.focus();
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });

    it("should open dialog on Space key", async () => {
      const user = userEvent.setup();

      render(
        <Dialog.Root>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content container={container}>
            <Dialog.Title>Title</Dialog.Title>
          </Dialog.Content>
        </Dialog.Root>
      );

      const trigger = screen.getByRole("button", { name: "Open" });
      trigger.focus();
      await user.keyboard(" ");

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
      });
    });
  });

  describe("multiple dialogs", () => {
    it("should handle multiple independent dialogs with unique IDs", async () => {
      const { container: renderContainer } = render(
        <>
          <Dialog.Root>
            <Dialog.Trigger>Open Dialog 1</Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Dialog 1</Dialog.Title>
              <p>Content 1</p>
            </Dialog.Content>
          </Dialog.Root>
          <Dialog.Root>
            <Dialog.Trigger>Open Dialog 2</Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Dialog 2</Dialog.Title>
              <p>Content 2</p>
            </Dialog.Content>
          </Dialog.Root>
        </>
      );

      const triggers = screen.getAllByRole("button");
      const ids = triggers.map((t) => t.getAttribute("aria-controls"));

      // Each dialog should have unique IDs
      expect(ids[0]).not.toBe(ids[1]);

      const results = await axe(renderContainer);
      expect(results).toHaveNoViolations();
    });
  });
});
