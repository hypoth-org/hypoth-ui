import { describe, expect, it } from "vitest";
import type { DeprecationRecord } from "../../../src/types/index.js";

describe("Migration Utilities", () => {
  describe("deprecationToMigrationSteps", () => {
    it("should generate steps for component deprecation with replacement", async () => {
      const { deprecationToMigrationSteps } = await import(
        "../../../src/deprecation/migration.js"
      );

      const record: DeprecationRecord = {
        item: "OldButton",
        type: "component",
        deprecated_in: "1.0.0",
        removal_version: "3.0.0",
        replacement: "Button",
      };

      const steps = deprecationToMigrationSteps(record);
      expect(steps.length).toBeGreaterThan(1);
      expect(steps[0]?.description).toContain("Replace");
      expect(steps[0]?.before).toContain("<OldButton");
      expect(steps[0]?.after).toContain("<Button");
    });

    it("should generate steps for prop deprecation", async () => {
      const { deprecationToMigrationSteps } = await import(
        "../../../src/deprecation/migration.js"
      );

      const record: DeprecationRecord = {
        item: "isDisabled",
        type: "prop",
        deprecated_in: "1.0.0",
        removal_version: "3.0.0",
        replacement: "disabled",
      };

      const steps = deprecationToMigrationSteps(record);
      expect(steps[0]?.description).toContain("Rename prop");
    });

    it("should generate steps for CSS variable deprecation", async () => {
      const { deprecationToMigrationSteps } = await import(
        "../../../src/deprecation/migration.js"
      );

      const record: DeprecationRecord = {
        item: "--ds-color-primary",
        type: "css-variable",
        deprecated_in: "1.0.0",
        removal_version: "3.0.0",
        replacement: "--ds-color-brand",
      };

      const steps = deprecationToMigrationSteps(record);
      expect(steps[0]?.automated).toBe(true);
    });
  });

  describe("estimateMigrationEffort", () => {
    it("should return low for few simple changes", async () => {
      const { estimateMigrationEffort } = await import(
        "../../../src/deprecation/migration.js"
      );

      const deprecations: DeprecationRecord[] = [
        {
          item: "oldProp",
          type: "prop",
          deprecated_in: "1.0.0",
          removal_version: "3.0.0",
        },
      ];

      expect(estimateMigrationEffort(deprecations)).toBe("low");
    });

    it("should return medium for multiple changes", async () => {
      const { estimateMigrationEffort } = await import(
        "../../../src/deprecation/migration.js"
      );

      const deprecations: DeprecationRecord[] = [
        {
          item: "OldButton",
          type: "component",
          deprecated_in: "1.0.0",
          removal_version: "3.0.0",
        },
        {
          item: "oldProp",
          type: "prop",
          deprecated_in: "1.0.0",
          removal_version: "3.0.0",
        },
      ];

      expect(estimateMigrationEffort(deprecations)).toBe("medium");
    });

    it("should return high for many component changes", async () => {
      const { estimateMigrationEffort } = await import(
        "../../../src/deprecation/migration.js"
      );

      const deprecations: DeprecationRecord[] = [
        {
          item: "OldButton",
          type: "component",
          deprecated_in: "1.0.0",
          removal_version: "3.0.0",
        },
        {
          item: "OldInput",
          type: "component",
          deprecated_in: "1.0.0",
          removal_version: "3.0.0",
        },
        {
          item: "OldSelect",
          type: "component",
          deprecated_in: "1.0.0",
          removal_version: "3.0.0",
        },
      ];

      expect(estimateMigrationEffort(deprecations)).toBe("high");
    });
  });

  describe("generateMigrationMarkdown", () => {
    it("should generate valid markdown", async () => {
      const { generateMigrationMarkdown } = await import(
        "../../../src/deprecation/migration.js"
      );

      const guide = {
        title: "Migration Guide: 1.0.0 to 2.0.0",
        fromVersion: "1.0.0",
        toVersion: "2.0.0",
        breakingChanges: [
          {
            item: "OldButton",
            type: "component" as const,
            reason: "New button design",
            migration: [
              {
                description: "Replace OldButton with Button",
                before: "<OldButton />",
                after: "<Button />",
              },
            ],
          },
        ],
        effort: "low" as const,
        prerequisites: ["Backup your project"],
      };

      const markdown = generateMigrationMarkdown(guide);

      expect(markdown).toContain("# Migration Guide: 1.0.0 to 2.0.0");
      expect(markdown).toContain("**Estimated Effort:** Low");
      expect(markdown).toContain("## Prerequisites");
      expect(markdown).toContain("## Breaking Changes");
      expect(markdown).toContain("### OldButton");
      expect(markdown).toContain("**Before:**");
      expect(markdown).toContain("**After:**");
    });
  });
});
