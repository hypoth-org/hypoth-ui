/**
 * Tests for React Menu compound component.
 * Focuses on asChild behavior and compound component pattern.
 */

import { createRef, forwardRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Menu } from "../../src/components/menu/index.js";

describe("Menu", () => {
  describe("asChild pattern", () => {
    it("renders trigger as child element when asChild is true", () => {
      render(
        <Menu.Root>
          <Menu.Trigger asChild>
            <span data-testid="custom-trigger">Options</span>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Edit</Menu.Item>
            <Menu.Item>Delete</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      );

      const trigger = screen.getByTestId("custom-trigger");
      expect(trigger.tagName).toBe("SPAN");
      expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    });

    it("renders trigger as button when asChild is false", () => {
      render(
        <Menu.Root>
          <Menu.Trigger>Options</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Edit</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      );

      const trigger = screen.getByRole("button", { name: "Options" });
      expect(trigger.tagName).toBe("BUTTON");
    });

    it("merges className when using asChild", () => {
      render(
        <Menu.Root>
          <Menu.Trigger asChild className="trigger-class">
            <button type="button" className="custom-class">Options</button>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Edit</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      );

      const trigger = screen.getByRole("button", { name: "Options" });
      expect(trigger).toHaveClass("trigger-class");
      expect(trigger).toHaveClass("custom-class");
    });

    it("composes onClick handlers when using asChild", async () => {
      const user = userEvent.setup();
      const childClickHandler = vi.fn();

      render(
        <Menu.Root>
          <Menu.Trigger asChild>
            <button type="button" onClick={childClickHandler}>Options</button>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Edit</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      );

      const trigger = screen.getByRole("button", { name: "Options" });
      await user.click(trigger);

      expect(childClickHandler).toHaveBeenCalledTimes(1);
    });

    it("forwards ref to child element with asChild", () => {
      const ref = createRef<HTMLButtonElement>();

      render(
        <Menu.Root>
          <Menu.Trigger asChild ref={ref}>
            <button type="button">Options</button>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Edit</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current?.textContent).toBe("Options");
    });

    it("works with forwardRef components", () => {
      const IconButton = forwardRef<HTMLButtonElement, { children: React.ReactNode }>(
        ({ children, ...props }, ref) => (
          <button type="button" ref={ref} data-icon-button="true" {...props}>
            {children}
          </button>
        )
      );
      IconButton.displayName = "IconButton";

      const ref = createRef<HTMLButtonElement>();

      render(
        <Menu.Root>
          <Menu.Trigger asChild ref={ref}>
            <IconButton>☰</IconButton>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Edit</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      );

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
      expect(ref.current).toHaveAttribute("data-icon-button", "true");
      expect(ref.current).toHaveAttribute("aria-haspopup", "menu");
    });

    it("composes onKeyDown handlers when using asChild", async () => {
      const user = userEvent.setup();
      const childKeyDownHandler = vi.fn();

      render(
        <Menu.Root>
          <Menu.Trigger asChild>
            <button type="button" onKeyDown={childKeyDownHandler}>Options</button>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Edit</Menu.Item>
          </Menu.Content>
        </Menu.Root>
      );

      const trigger = screen.getByRole("button", { name: "Options" });
      trigger.focus();
      await user.keyboard("{ArrowDown}");

      expect(childKeyDownHandler).toHaveBeenCalledTimes(1);
    });
  });

});

