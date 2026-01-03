import { describe, expect, it, beforeEach } from "vitest";
import {
  getRegisteredTags,
  getComponentClass,
  getComponentClassSync,
  registerComponent,
  hasComponent,
} from "../../src/registry/registry.js";

describe("Component Registry", () => {
  describe("getRegisteredTags", () => {
    it("should return an array of registered tag names", () => {
      const tags = getRegisteredTags();

      expect(Array.isArray(tags)).toBe(true);
      expect(tags).toContain("ds-button");
      expect(tags).toContain("ds-input");
    });

    it("should return at least the core components", () => {
      const tags = getRegisteredTags();

      expect(tags.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("hasComponent", () => {
    it("should return true for registered components", () => {
      expect(hasComponent("ds-button")).toBe(true);
      expect(hasComponent("ds-input")).toBe(true);
    });

    it("should return false for unregistered components", () => {
      expect(hasComponent("ds-unknown")).toBe(false);
      expect(hasComponent("not-a-component")).toBe(false);
    });
  });

  describe("getComponentClass", () => {
    it("should return undefined for unknown tags", async () => {
      const result = await getComponentClass("ds-unknown");
      expect(result).toBeUndefined();
    });

    it("should load and return component class for known tags", async () => {
      const ButtonClass = await getComponentClass("ds-button");

      expect(ButtonClass).toBeDefined();
      expect(typeof ButtonClass).toBe("function");
    });

    it("should cache loaded classes", async () => {
      // First load
      const first = await getComponentClass("ds-button");
      // Second load should be cached
      const second = await getComponentClass("ds-button");

      expect(first).toBe(second);
    });
  });

  describe("getComponentClassSync", () => {
    it("should return undefined for not-yet-loaded components initially", () => {
      // Note: If previous tests loaded ds-button, this might already be cached
      // This test is more about API behavior
      const result = getComponentClassSync("ds-unknown");
      expect(result).toBeUndefined();
    });

    it("should return class after async load", async () => {
      // First load async
      await getComponentClass("ds-button");

      // Then sync should work
      const result = getComponentClassSync("ds-button");
      expect(result).toBeDefined();
    });
  });

  describe("registerComponent", () => {
    it("should register a custom component", () => {
      class TestComponent extends HTMLElement {}

      registerComponent("ds-test-custom", TestComponent);

      expect(hasComponent("ds-test-custom")).toBe(true);
    });

    it("should make registered component available synchronously", () => {
      class TestComponent2 extends HTMLElement {}

      registerComponent("ds-test-custom-2", TestComponent2);

      const result = getComponentClassSync("ds-test-custom-2");
      expect(result).toBe(TestComponent2);
    });
  });
});
