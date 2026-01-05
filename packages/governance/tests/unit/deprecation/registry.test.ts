import { describe, expect, it } from "vitest";
import type { DeprecationRecord } from "../../../src/types/index.js";

describe("Deprecation Registry", () => {
  describe("calculateDeprecationStatus", () => {
    it("should mark as active when far from removal", async () => {
      const { calculateDeprecationStatus } = await import(
        "../../../src/deprecation/registry.js"
      );

      const record: DeprecationRecord = {
        item: "OldButton",
        type: "component",
        deprecated_in: "1.0.0",
        removal_version: "4.0.0", // 3 versions away
      };

      const result = calculateDeprecationStatus(record, "1.0.0");
      expect(result.status).toBe("active");
      expect(result.versionsUntilRemoval).toBe(3);
    });

    it("should mark as warning when 2 versions away", async () => {
      const { calculateDeprecationStatus } = await import(
        "../../../src/deprecation/registry.js"
      );

      const record: DeprecationRecord = {
        item: "OldButton",
        type: "component",
        deprecated_in: "1.0.0",
        removal_version: "3.0.0",
      };

      const result = calculateDeprecationStatus(record, "1.5.0");
      expect(result.status).toBe("warning");
      expect(result.versionsUntilRemoval).toBe(2);
    });

    it("should mark as removal-imminent when 1 version away", async () => {
      const { calculateDeprecationStatus } = await import(
        "../../../src/deprecation/registry.js"
      );

      const record: DeprecationRecord = {
        item: "OldButton",
        type: "component",
        deprecated_in: "1.0.0",
        removal_version: "3.0.0",
      };

      const result = calculateDeprecationStatus(record, "2.0.0");
      expect(result.status).toBe("removal-imminent");
      expect(result.versionsUntilRemoval).toBe(1);
    });

    it("should mark as removed when past removal version", async () => {
      const { calculateDeprecationStatus } = await import(
        "../../../src/deprecation/registry.js"
      );

      const record: DeprecationRecord = {
        item: "OldButton",
        type: "component",
        deprecated_in: "1.0.0",
        removal_version: "3.0.0",
      };

      const result = calculateDeprecationStatus(record, "3.0.0");
      expect(result.status).toBe("removed");
      expect(result.versionsUntilRemoval).toBeNull();
    });
  });

  describe("createDeprecation", () => {
    it("should calculate removal version 2 majors ahead", async () => {
      const { createDeprecation } = await import(
        "../../../src/deprecation/registry.js"
      );

      const record = createDeprecation("OldButton", "component", "1.0.0");
      expect(record.removal_version).toBe("3.0.0");
    });

    it("should include optional fields", async () => {
      const { createDeprecation } = await import(
        "../../../src/deprecation/registry.js"
      );

      const record = createDeprecation("OldButton", "component", "1.0.0", {
        replacement: "NewButton",
        reason: "New design system",
        package: "@ds/wc",
      });

      expect(record.replacement).toBe("NewButton");
      expect(record.reason).toBe("New design system");
      expect(record.package).toBe("@ds/wc");
    });
  });

  describe("validateDeprecationWindow", () => {
    it("should accept 2 major version window", async () => {
      const { validateDeprecationWindow } = await import(
        "../../../src/deprecation/registry.js"
      );

      const record: DeprecationRecord = {
        item: "OldButton",
        type: "component",
        deprecated_in: "1.0.0",
        removal_version: "3.0.0",
      };

      expect(validateDeprecationWindow(record)).toBe(true);
    });

    it("should reject 1 major version window", async () => {
      const { validateDeprecationWindow } = await import(
        "../../../src/deprecation/registry.js"
      );

      const record: DeprecationRecord = {
        item: "OldButton",
        type: "component",
        deprecated_in: "1.0.0",
        removal_version: "2.0.0",
      };

      expect(validateDeprecationWindow(record)).toBe(false);
    });

    it("should accept longer windows", async () => {
      const { validateDeprecationWindow } = await import(
        "../../../src/deprecation/registry.js"
      );

      const record: DeprecationRecord = {
        item: "OldButton",
        type: "component",
        deprecated_in: "1.0.0",
        removal_version: "5.0.0",
      };

      expect(validateDeprecationWindow(record)).toBe(true);
    });
  });

  describe("queryDeprecations", () => {
    it("should filter by type", async () => {
      const { queryDeprecations } = await import(
        "../../../src/deprecation/registry.js"
      );

      const registry = {
        deprecations: [
          {
            item: "OldButton",
            type: "component" as const,
            deprecated_in: "1.0.0",
            removal_version: "3.0.0",
          },
          {
            item: "oldProp",
            type: "prop" as const,
            deprecated_in: "1.0.0",
            removal_version: "3.0.0",
          },
        ],
      };

      const results = queryDeprecations(registry, {
        type: "component",
        currentVersion: "1.0.0",
      });

      expect(results).toHaveLength(1);
      expect(results[0]?.item).toBe("OldButton");
    });

    it("should filter by status", async () => {
      const { queryDeprecations } = await import(
        "../../../src/deprecation/registry.js"
      );

      const registry = {
        deprecations: [
          {
            item: "OldButton",
            type: "component" as const,
            deprecated_in: "1.0.0",
            removal_version: "3.0.0",
          },
          {
            item: "AncientButton",
            type: "component" as const,
            deprecated_in: "0.1.0",
            removal_version: "2.0.0",
          },
        ],
      };

      const results = queryDeprecations(registry, {
        status: "removal-imminent",
        currentVersion: "1.0.0",
      });

      expect(results).toHaveLength(1);
      expect(results[0]?.item).toBe("AncientButton");
    });
  });
});
