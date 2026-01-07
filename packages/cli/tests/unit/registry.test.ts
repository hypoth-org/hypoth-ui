/**
 * Unit tests for component registry utilities
 */

import { describe, expect, it } from "vitest";
import type { ComponentRegistry } from "../../src/types/index.js";
import {
  componentExists,
  getComponent,
  getComponentNames,
  getComponentsForFramework,
  getNpmDependencies,
  isComponentCompatible,
  resolveDependencies,
} from "../../src/utils/registry.js";

describe("registry utilities", () => {
  // Test registry with sample components
  const mockRegistry: ComponentRegistry = {
    version: "1.0.0",
    updatedAt: "2026-01-06T00:00:00Z",
    components: [
      {
        name: "button",
        displayName: "Button",
        description: "Accessible button",
        version: "1.0.0",
        status: "stable",
        frameworks: ["react", "wc"],
        dependencies: ["@hypoth-ui/tokens"],
        registryDependencies: [],
        files: [
          { path: "button/button.tsx", target: "button.tsx", type: "tsx", framework: "react" },
          { path: "button/button.ts", target: "button.ts", type: "ts", framework: "wc" },
        ],
        a11y: { apgPattern: "button", keyboardSupport: ["Enter", "Space"] },
      },
      {
        name: "dialog",
        displayName: "Dialog",
        description: "Modal dialog",
        version: "1.0.0",
        status: "stable",
        frameworks: ["react", "wc"],
        dependencies: ["@hypoth-ui/tokens", "@hypoth-ui/primitives-dom"],
        registryDependencies: ["button"],
        files: [
          { path: "dialog/dialog.tsx", target: "dialog.tsx", type: "tsx", framework: "react" },
        ],
        a11y: { apgPattern: "dialog-modal", keyboardSupport: ["Escape", "Tab"] },
      },
      {
        name: "menu",
        displayName: "Menu",
        description: "Dropdown menu",
        version: "1.0.0",
        status: "stable",
        frameworks: ["react", "wc"],
        dependencies: ["@hypoth-ui/tokens", "@hypoth-ui/primitives-dom"],
        registryDependencies: ["button", "popover"],
        files: [],
        a11y: { apgPattern: "menu-button", keyboardSupport: ["Enter", "Space", "Escape"] },
      },
      {
        name: "popover",
        displayName: "Popover",
        description: "Non-modal overlay",
        version: "1.0.0",
        status: "stable",
        frameworks: ["react", "wc"],
        dependencies: ["@hypoth-ui/primitives-dom"],
        registryDependencies: [],
        files: [],
        a11y: { apgPattern: "dialog-non-modal", keyboardSupport: ["Escape"] },
      },
      {
        name: "react-only",
        displayName: "React Only",
        description: "React-only component",
        version: "1.0.0",
        status: "stable",
        frameworks: ["react"],
        dependencies: [],
        registryDependencies: [],
        files: [],
        a11y: { apgPattern: "none", keyboardSupport: [] },
      },
    ],
  };

  describe("getComponent", () => {
    it("should find component by exact name", () => {
      const component = getComponent(mockRegistry, "button");
      expect(component?.name).toBe("button");
      expect(component?.displayName).toBe("Button");
    });

    it("should find component case-insensitively", () => {
      const component = getComponent(mockRegistry, "BUTTON");
      expect(component?.name).toBe("button");
    });

    it("should return undefined for non-existent component", () => {
      const component = getComponent(mockRegistry, "nonexistent");
      expect(component).toBeUndefined();
    });
  });

  describe("getComponentNames", () => {
    it("should return all component names", () => {
      const names = getComponentNames(mockRegistry);
      expect(names).toContain("button");
      expect(names).toContain("dialog");
      expect(names).toContain("menu");
      expect(names).toHaveLength(5);
    });
  });

  describe("componentExists", () => {
    it("should return true for existing component", () => {
      expect(componentExists(mockRegistry, "button")).toBe(true);
    });

    it("should return true case-insensitively", () => {
      expect(componentExists(mockRegistry, "DIALOG")).toBe(true);
    });

    it("should return false for non-existent component", () => {
      expect(componentExists(mockRegistry, "nonexistent")).toBe(false);
    });
  });

  describe("getComponentsForFramework", () => {
    it("should return React-compatible components", () => {
      const components = getComponentsForFramework(mockRegistry, "react");
      expect(components).toHaveLength(5);
      expect(components.map((c) => c.name)).toContain("button");
      expect(components.map((c) => c.name)).toContain("react-only");
    });

    it("should return Next.js-compatible components (uses React)", () => {
      const components = getComponentsForFramework(mockRegistry, "next");
      expect(components).toHaveLength(5);
    });

    it("should return WC-compatible components", () => {
      const components = getComponentsForFramework(mockRegistry, "wc");
      expect(components).toHaveLength(4);
      expect(components.map((c) => c.name)).not.toContain("react-only");
    });

    it("should return vanilla-compatible components (uses WC)", () => {
      const components = getComponentsForFramework(mockRegistry, "vanilla");
      expect(components).toHaveLength(4);
    });
  });

  describe("resolveDependencies", () => {
    it("should resolve component without dependencies", () => {
      const resolved = resolveDependencies(mockRegistry, ["button"]);
      expect(resolved).toHaveLength(1);
      expect(resolved[0].name).toBe("button");
    });

    it("should resolve single dependency", () => {
      const resolved = resolveDependencies(mockRegistry, ["dialog"]);
      expect(resolved).toHaveLength(2);
      expect(resolved[0].name).toBe("button"); // Dependency first
      expect(resolved[1].name).toBe("dialog");
    });

    it("should resolve nested dependencies", () => {
      const resolved = resolveDependencies(mockRegistry, ["menu"]);
      expect(resolved).toHaveLength(3);
      expect(resolved.map((c) => c.name)).toEqual(["button", "popover", "menu"]);
    });

    it("should deduplicate dependencies", () => {
      const resolved = resolveDependencies(mockRegistry, ["dialog", "menu"]);
      // button appears in both dependency trees but should only be once
      const buttonCount = resolved.filter((c) => c.name === "button").length;
      expect(buttonCount).toBe(1);
    });

    it("should maintain correct order with multiple components", () => {
      const resolved = resolveDependencies(mockRegistry, ["menu", "button"]);
      // button should come before menu (it's a dependency)
      const buttonIndex = resolved.findIndex((c) => c.name === "button");
      const menuIndex = resolved.findIndex((c) => c.name === "menu");
      expect(buttonIndex).toBeLessThan(menuIndex);
    });

    it("should throw on non-existent component", () => {
      expect(() => resolveDependencies(mockRegistry, ["nonexistent"])).toThrow(
        "Component not found in registry: nonexistent"
      );
    });

    it("should throw on circular dependency", () => {
      const circularRegistry: ComponentRegistry = {
        ...mockRegistry,
        components: [
          {
            name: "a",
            displayName: "A",
            description: "",
            version: "1.0.0",
            status: "stable",
            frameworks: ["react"],
            dependencies: [],
            registryDependencies: ["b"],
            files: [],
            a11y: { apgPattern: "", keyboardSupport: [] },
          },
          {
            name: "b",
            displayName: "B",
            description: "",
            version: "1.0.0",
            status: "stable",
            frameworks: ["react"],
            dependencies: [],
            registryDependencies: ["a"],
            files: [],
            a11y: { apgPattern: "", keyboardSupport: [] },
          },
        ],
      };

      expect(() => resolveDependencies(circularRegistry, ["a"])).toThrow(
        "Circular dependency detected"
      );
    });
  });

  describe("getNpmDependencies", () => {
    it("should return empty array for components without dependencies", () => {
      const components = [mockRegistry.components[4]]; // react-only has no deps
      const deps = getNpmDependencies(components);
      expect(deps).toHaveLength(0);
    });

    it("should return dependencies for single component", () => {
      const components = [mockRegistry.components[0]]; // button
      const deps = getNpmDependencies(components);
      expect(deps).toContain("@hypoth-ui/tokens");
      expect(deps).toHaveLength(1);
    });

    it("should deduplicate dependencies across components", () => {
      const components = [
        mockRegistry.components[0], // button: @hypoth-ui/tokens
        mockRegistry.components[1], // dialog: @hypoth-ui/tokens, @hypoth-ui/primitives-dom
      ];
      const deps = getNpmDependencies(components);
      expect(deps).toHaveLength(2);
      expect(deps).toContain("@hypoth-ui/tokens");
      expect(deps).toContain("@hypoth-ui/primitives-dom");
    });
  });

  describe("isComponentCompatible", () => {
    it("should return true for React component in React project", () => {
      const component = mockRegistry.components[0]; // button: both frameworks
      expect(isComponentCompatible(component, "react")).toBe(true);
    });

    it("should return true for React component in Next.js project", () => {
      const component = mockRegistry.components[0];
      expect(isComponentCompatible(component, "next")).toBe(true);
    });

    it("should return true for WC component in WC project", () => {
      const component = mockRegistry.components[0];
      expect(isComponentCompatible(component, "wc")).toBe(true);
    });

    it("should return true for WC component in vanilla project", () => {
      const component = mockRegistry.components[0];
      expect(isComponentCompatible(component, "vanilla")).toBe(true);
    });

    it("should return false for React-only component in WC project", () => {
      const component = mockRegistry.components[4]; // react-only
      expect(isComponentCompatible(component, "wc")).toBe(false);
    });

    it("should return false for React-only component in vanilla project", () => {
      const component = mockRegistry.components[4];
      expect(isComponentCompatible(component, "vanilla")).toBe(false);
    });
  });
});
