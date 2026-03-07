import { cleanup, render } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { EmptyState } from "../../src/components/empty-state/index.js";

describe("EmptyState React Component", () => {
  afterEach(() => {
    cleanup();
  });

  describe("rendering", () => {
    it("should render a section element with role=status", () => {
      const { container } = render(
        createElement(EmptyState, null,
          createElement(EmptyState.Title, null, "No results"),
        )
      );
      const section = container.querySelector("section");
      expect(section).not.toBeNull();
      expect(section?.getAttribute("role")).toBe("status");
    });

    it("should render with ds-empty-state class", () => {
      const { container } = render(createElement(EmptyState, null, "Content"));
      const section = container.querySelector(".ds-empty-state");
      expect(section).not.toBeNull();
    });
  });

  describe("sub-components", () => {
    it("Icon should render with aria-hidden=true", () => {
      const { container } = render(
        createElement(EmptyState, null,
          createElement(EmptyState.Icon, null, "🔍"),
        )
      );
      const icon = container.querySelector(".ds-empty-state-icon");
      expect(icon).not.toBeNull();
      expect(icon?.getAttribute("aria-hidden")).toBe("true");
    });

    it("Title should render as h3", () => {
      const { container } = render(
        createElement(EmptyState, null,
          createElement(EmptyState.Title, null, "No results found"),
        )
      );
      const title = container.querySelector("h3.ds-empty-state-title");
      expect(title).not.toBeNull();
      expect(title?.textContent).toBe("No results found");
    });

    it("Description should render as p", () => {
      const { container } = render(
        createElement(EmptyState, null,
          createElement(EmptyState.Description, null, "Try adjusting your search."),
        )
      );
      const desc = container.querySelector("p.ds-empty-state-description");
      expect(desc).not.toBeNull();
      expect(desc?.textContent).toBe("Try adjusting your search.");
    });

    it("Action should render a div container", () => {
      const { container } = render(
        createElement(EmptyState, null,
          createElement(EmptyState.Action, null,
            createElement("button", null, "Retry"),
          ),
        )
      );
      const action = container.querySelector(".ds-empty-state-action");
      expect(action).not.toBeNull();
      expect(action?.querySelector("button")).not.toBeNull();
    });
  });

  describe("compound component", () => {
    it("should render all sub-components together", () => {
      const { container } = render(
        createElement(EmptyState, null,
          createElement(EmptyState.Icon, null, "📭"),
          createElement(EmptyState.Title, null, "No messages"),
          createElement(EmptyState.Description, null, "Your inbox is empty."),
          createElement(EmptyState.Action, null,
            createElement("button", null, "Compose"),
          ),
        )
      );

      expect(container.querySelector("[role='status']")).not.toBeNull();
      expect(container.querySelector("[aria-hidden='true']")).not.toBeNull();
      expect(container.querySelector("h3")).not.toBeNull();
      expect(container.querySelector("p")).not.toBeNull();
      expect(container.querySelector(".ds-empty-state-action button")).not.toBeNull();
    });
  });

  describe("display names", () => {
    it("should have correct displayNames", () => {
      expect(EmptyState.displayName).toBe("EmptyState");
      expect(EmptyState.Icon.displayName).toBe("EmptyState.Icon");
      expect(EmptyState.Title.displayName).toBe("EmptyState.Title");
      expect(EmptyState.Description.displayName).toBe("EmptyState.Description");
      expect(EmptyState.Action.displayName).toBe("EmptyState.Action");
    });
  });

  describe("className forwarding", () => {
    it("should append custom className to root", () => {
      const { container } = render(
        createElement(EmptyState, { className: "custom" }, "Content")
      );
      const section = container.querySelector("section");
      expect(section?.className).toContain("ds-empty-state");
      expect(section?.className).toContain("custom");
    });
  });
});
