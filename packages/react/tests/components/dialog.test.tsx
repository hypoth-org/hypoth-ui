/**
 * Tests for React Dialog compound component.
 * Focuses on asChild behavior and compound component pattern.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, forwardRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "../../src/components/dialog/index.js";

describe("Dialog", () => {
  describe("asChild pattern", () => {
    it("renders trigger as child element when asChild is true", () => {
      render(
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <a href="/settings">Settings</a>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Settings</Dialog.Title>
          </Dialog.Content>
        </Dialog.Root>
      );

      const trigger = screen.getByRole("link", { name: "Settings" });
      expect(trigger.tagName).toBe("A");
      expect(trigger).toHaveAttribute("href", "/settings");
      expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    });

    it("renders trigger as button when asChild is false", () => {
      render(
        <Dialog.Root>
          <Dialog.Trigger>Open Dialog</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Title</Dialog.Title>
          </Dialog.Content>
        </Dialog.Root>
      );

      const trigger = screen.getByRole("button", { name: "Open Dialog" });
      expect(trigger.tagName).toBe("BUTTON");
    });

    it("merges className when using asChild", () => {
      render(
        <Dialog.Root>
          <Dialog.Trigger asChild className="trigger-class">
            <button type="button" className="custom-class">
              Open
            </button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Title</Dialog.Title>
          </Dialog.Content>
        </Dialog.Root>
      );

      const trigger = screen.getByRole("button", { name: "Open" });
      expect(trigger).toHaveClass("trigger-class");
      expect(trigger).toHaveClass("custom-class");
    });

    it("composes onClick handlers when using asChild", async () => {
      const user = userEvent.setup();
      const childClickHandler = vi.fn();

      render(
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button type="button" onClick={childClickHandler}>
              Open
            </button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Title</Dialog.Title>
          </Dialog.Content>
        </Dialog.Root>
      );

      const trigger = screen.getByRole("button", { name: "Open" });
      await user.click(trigger);

      expect(childClickHandler).toHaveBeenCalledTimes(1);
    });

    it("forwards ref to child element with asChild", () => {
      const ref = createRef<HTMLButtonElement>();

      render(
        <Dialog.Root>
          <Dialog.Trigger asChild ref={ref}>
            <button type="button">Open</button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Title</Dialog.Title>
          </Dialog.Content>
        </Dialog.Root>
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.textContent).toBe("Open");
    });

    it("works with forwardRef components", () => {
      const CustomButton = forwardRef<HTMLButtonElement, { children: React.ReactNode }>(
        ({ children, ...props }, ref) => (
          <button type="button" ref={ref} data-custom="true" {...props}>
            {children}
          </button>
        )
      );
      CustomButton.displayName = "CustomButton";

      const ref = createRef<HTMLButtonElement>();

      render(
        <Dialog.Root>
          <Dialog.Trigger asChild ref={ref}>
            <CustomButton>Open</CustomButton>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Title</Dialog.Title>
          </Dialog.Content>
        </Dialog.Root>
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveAttribute("data-custom", "true");
      expect(ref.current).toHaveAttribute("aria-haspopup", "dialog");
    });
  });

  describe("Close with asChild", () => {
    it("renders close as child element when asChild is true", async () => {
      const user = userEvent.setup();

      render(
        <Dialog.Root defaultOpen>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.Close asChild>
              <a href="#close">Close Link</a>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>
      );

      const closeLink = screen.getByRole("link", { name: "Close Link" });
      expect(closeLink.tagName).toBe("A");
      expect(closeLink).toHaveAttribute("href", "#close");

      await user.click(closeLink);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("forwards ref to close child element", () => {
      const ref = createRef<HTMLButtonElement>();

      render(
        <Dialog.Root defaultOpen>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.Close asChild ref={ref}>
              <button type="button">X</button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });
});
